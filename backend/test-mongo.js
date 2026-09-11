const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./src/app');
const SafetyReport = require('./src/models/SafetyReport');
const { generateAccessToken } = require('./src/utils/jwt');

let passed = 0;
let failed = 0;

function assert(condition, testName, detail) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}${detail ? ' - ' + detail : ''}`);
    failed++;
  }
}

async function runMongoTests() {
  console.log('====================================================');
  console.log('STARTING MONGOOSE MODEL & REST API TEST SUITE');
  console.log('====================================================\n');

  // Generate test JWT tokens
  const reviewerToken = generateAccessToken({
    userId: 'reviewer-user-1',
    role: 'REVIEWER',
  });
  const managerToken = generateAccessToken({
    userId: 'manager-user-2',
    role: 'MANAGER',
  });
  const adminToken = generateAccessToken({
    userId: 'admin-user-3',
    role: 'ADMIN',
  });

  // Check if live MongoDB connection is active, or mock in-memory for testing
  const isLiveMongo = mongoose.connection.readyState === 1;
  console.log(`Database Mode: ${isLiveMongo ? 'Live MongoDB Server' : 'In-Memory Mongoose Mock'}\n`);

  // In-memory mock storage if local MongoDB daemon is not running
  const inMemoryReports = new Map();

  const originalSave = SafetyReport.prototype.save;
  const originalFind = SafetyReport.find;
  const originalFindById = SafetyReport.findById;
  const originalFindByIdAndUpdate = SafetyReport.findByIdAndUpdate;
  const originalFindByIdAndDelete = SafetyReport.findByIdAndDelete;
  const originalCountDocuments = SafetyReport.countDocuments;

  if (!isLiveMongo) {
    SafetyReport.prototype.save = async function () {
      const error = this.validateSync();
      if (error) throw error;
      const _id = new mongoose.Types.ObjectId();
      const doc = {
        _id,
        id: _id.toString(),
        reportNumber: this.reportNumber || `MGO-REP-${Date.now().toString().slice(-6)}`,
        description: this.description,
        reportType: this.reportType,
        site: this.site,
        department: this.department || null,
        activity: this.activity,
        contractorType: this.contractorType || null,
        workPhase: this.workPhase || null,
        eventDate: this.eventDate || new Date(),
        status: this.status || 'PENDING',
        reporterId: this.reporterId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryReports.set(_id.toString(), doc);
      return doc;
    };

    SafetyReport.find = function (filter = {}) {
      let list = Array.from(inMemoryReports.values());
      if (filter.reportType) {
        list = list.filter((r) => r.reportType === filter.reportType);
      }
      return {
        sort: () => ({
          skip: (skipNum) => ({
            limit: (limitNum) => ({
              lean: async () => list.slice(skipNum, skipNum + limitNum),
            }),
          }),
        }),
      };
    };

    SafetyReport.countDocuments = async (filter = {}) => {
      let list = Array.from(inMemoryReports.values());
      if (filter.reportType) list = list.filter((r) => r.reportType === filter.reportType);
      return list.length;
    };

    SafetyReport.findById = async (id) => {
      const doc = inMemoryReports.get(id.toString());
      return doc || null;
    };

    SafetyReport.findByIdAndUpdate = async (id, update) => {
      const doc = inMemoryReports.get(id.toString());
      if (!doc) return null;
      const updated = { ...doc, ...update.$set, updatedAt: new Date() };
      inMemoryReports.set(id.toString(), updated);
      return updated;
    };

    SafetyReport.findByIdAndDelete = async (id) => {
      const doc = inMemoryReports.get(id.toString());
      if (!doc) return null;
      inMemoryReports.delete(id.toString());
      return doc;
    };
  }

  try {
    // -----------------------------------------------------------------------
    // 1. Mongoose Model Validation Unit Tests
    // -----------------------------------------------------------------------
    console.log('--- 1. Mongoose Schema Validation ---');
    const validReportDoc = new SafetyReport({
      description: 'Worker noticed gas odor near valve manifold during pre-shift walk.',
      reportType: 'UNSAFE_CONDITION',
      site: 'Platform Charlie',
      activity: 'Inspection',
    });
    const validValidationErr = validReportDoc.validateSync();
    assert(!validValidationErr, 'Valid SafetyReport schema passes validation');

    const invalidTypeDoc = new SafetyReport({
      description: 'Test description',
      reportType: 'INVALID_TYPE_NAME',
      site: 'Platform A',
      activity: 'Hot work',
    });
    const invalidTypeErr = invalidTypeDoc.validateSync();
    assert(Boolean(invalidTypeErr?.errors?.reportType), 'Invalid reportType fails enum validation');

    const missingFieldsDoc = new SafetyReport({});
    const missingFieldsErr = missingFieldsDoc.validateSync();
    assert(Boolean(missingFieldsErr?.errors?.description), 'Missing description triggers required validation error');
    assert(Boolean(missingFieldsErr?.errors?.reportType), 'Missing reportType triggers required validation error');
    assert(Boolean(missingFieldsErr?.errors?.site), 'Missing site triggers required validation error');
    assert(Boolean(missingFieldsErr?.errors?.activity), 'Missing activity triggers required validation error');

    // -----------------------------------------------------------------------
    // 2. Authentication Protection
    // -----------------------------------------------------------------------
    console.log('\n--- 2. Route Security & Authentication ---');
    const noTokenRes = await request(app).get('/api/mongo/reports');
    assert(noTokenRes.status === 401, 'GET /api/mongo/reports without token returns 401');
    assert(noTokenRes.body.success === false, 'Returns standard success: false');

    // -----------------------------------------------------------------------
    // 3. CREATE: POST /api/mongo/reports
    // -----------------------------------------------------------------------
    console.log('\n--- 3. CREATE: POST /api/mongo/reports ---');
    const createRes = await request(app)
      .post('/api/mongo/reports')
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({
        description: 'Hydraulic hose rupture observed on Crane #4 during pipe handling.',
        reportType: 'NEAR_MISS',
        site: 'Offshore Rig Bravo',
        department: 'Drilling',
        activity: 'Lifting Operations',
        contractorType: 'Contractor',
        workPhase: 'Operations',
      });

    assert(createRes.status === 201, 'POST /api/mongo/reports returns 201 Created');
    assert(createRes.body.success === true, 'Response contains success: true');
    assert(Boolean(createRes.body.data.id || createRes.body.data._id), 'Created document has valid ID');
    assert(createRes.body.data.reportType === 'NEAR_MISS', 'reportType matches input');
    assert(createRes.body.data.status === 'PENDING', 'Default status is PENDING');

    const createdId = createRes.body.data.id || createRes.body.data._id;

    // -----------------------------------------------------------------------
    // 4. GET ALL: GET /api/mongo/reports
    // -----------------------------------------------------------------------
    console.log('\n--- 4. GET ALL: GET /api/mongo/reports ---');
    const getAllRes = await request(app)
      .get('/api/mongo/reports')
      .set('Authorization', `Bearer ${reviewerToken}`);

    assert(getAllRes.status === 200, 'GET /api/mongo/reports returns 200 OK');
    assert(getAllRes.body.success === true, 'Response contains success: true');
    assert(Array.isArray(getAllRes.body.data), 'Returns an array of reports');
    assert(Boolean(getAllRes.body.pagination), 'Returns pagination metadata');

    // -----------------------------------------------------------------------
    // 5. GET BY ID: GET /api/mongo/reports/:id
    // -----------------------------------------------------------------------
    console.log('\n--- 5. GET BY ID: GET /api/mongo/reports/:id ---');
    const getByIdRes = await request(app)
      .get(`/api/mongo/reports/${createdId}`)
      .set('Authorization', `Bearer ${reviewerToken}`);

    assert(getByIdRes.status === 200, 'GET /api/mongo/reports/:id returns 200 OK');
    assert(getByIdRes.body.data.description.includes('Hydraulic hose rupture'), 'Returned document matches created record');

    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const notFoundRes = await request(app)
      .get(`/api/mongo/reports/${nonExistentId}`)
      .set('Authorization', `Bearer ${reviewerToken}`);
    assert(notFoundRes.status === 404, 'GET with non-existent ID returns 404 Not Found');

    const badFormatRes = await request(app)
      .get('/api/mongo/reports/not-an-objectid')
      .set('Authorization', `Bearer ${reviewerToken}`);
    assert(badFormatRes.status === 400, 'GET with invalid ObjectId format returns 400 Bad Request');

    // -----------------------------------------------------------------------
    // 6. UPDATE: PUT /api/mongo/reports/:id
    // -----------------------------------------------------------------------
    console.log('\n--- 6. UPDATE: PUT /api/mongo/reports/:id ---');
    const updateRes = await request(app)
      .put(`/api/mongo/reports/${createdId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        status: 'ANALYZED',
        department: 'Subsea Engineering',
      });

    assert(updateRes.status === 200, 'PUT /api/mongo/reports/:id returns 200 OK');
    assert(updateRes.body.data.status === 'ANALYZED', 'Status successfully updated to ANALYZED');

    // Reviewer trying to update -> 403
    const forbiddenUpdateRes = await request(app)
      .put(`/api/mongo/reports/${createdId}`)
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({ status: 'FAILED' });
    assert(forbiddenUpdateRes.status === 403, 'REVIEWER role cannot update report (403 Forbidden)');

    // -----------------------------------------------------------------------
    // 7. DELETE: DELETE /api/mongo/reports/:id
    // -----------------------------------------------------------------------
    console.log('\n--- 7. DELETE: DELETE /api/mongo/reports/:id ---');
    // Non-admin trying to delete -> 403
    const forbiddenDeleteRes = await request(app)
      .delete(`/api/mongo/reports/${createdId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    assert(forbiddenDeleteRes.status === 403, 'MANAGER role cannot delete report (403 Forbidden)');

    // Admin deleting -> 200
    const deleteRes = await request(app)
      .delete(`/api/mongo/reports/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert(deleteRes.status === 200, 'DELETE /api/mongo/reports/:id by ADMIN returns 200 OK');
    assert(deleteRes.body.success === true, 'Delete response contains success: true');

    // Confirm deleted
    const verifyDeleted = await request(app)
      .get(`/api/mongo/reports/${createdId}`)
      .set('Authorization', `Bearer ${reviewerToken}`);
    assert(verifyDeleted.status === 404, 'Deleted record returns 404 on subsequent GET');

    console.log('\n✅ All Mongoose Model & MongoDB REST API tests completed successfully!');

  } finally {
    if (!isLiveMongo) {
      SafetyReport.prototype.save = originalSave;
      SafetyReport.find = originalFind;
      SafetyReport.findById = originalFindById;
      SafetyReport.findByIdAndUpdate = originalFindByIdAndUpdate;
      SafetyReport.findByIdAndDelete = originalFindByIdAndDelete;
      SafetyReport.countDocuments = originalCountDocuments;
    }
    await mongoose.disconnect();
  }

  console.log('\n====================================================');
  console.log(`FINAL MONGO TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runMongoTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
