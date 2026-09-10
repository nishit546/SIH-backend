const { ZodError } = require('zod');
const { ValidationError } = require('../utils/errors');

function validateRequest(schemas) {
  return async (req, res, next) => {
    try {
      if (schemas.params) {
        const parsedParams = await schemas.params.parseAsync(req.params);
        if (req.params) {
          Object.assign(req.params, parsedParams);
        }
      }
      if (schemas.query) {
        const parsedQuery = await schemas.query.parseAsync(req.query);
        if (req.query) {
          Object.assign(req.query, parsedQuery);
        }
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedDetails = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          rule: issue.code,
        }));

        const primaryMessage =
          formattedDetails.length === 1
            ? formattedDetails[0].message
            : `Validation failed for ${formattedDetails.length} field(s)`;

        next(new ValidationError(primaryMessage, formattedDetails));
        return;
      }
      next(error);
    }
  };
}

module.exports = {
  validateRequest,
};
