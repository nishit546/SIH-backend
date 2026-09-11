const { AppError } = require('../utils/errors');
const { Prisma } = require('@prisma/client');

function errorHandler(err, req, res, next) {
  // 1. Custom Application Errors (ValidationError, NotFoundError, BadRequestError, ConflictError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // 2. Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'The requested record was not found in the database',
        error: {
          code: 'NOT_FOUND',
          message: 'The requested record was not found in the database',
        },
      });
      return;
    }

    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'unique field';
      res.status(409).json({
        success: false,
        message: `A record with this ${target} already exists`,
        error: {
          code: 'CONFLICT',
          message: `A record with this ${target} already exists`,
        },
      });
      return;
    }

    console.error('Prisma Known Error:', err.code);
    res.status(400).json({
      success: false,
      message: 'Invalid database operation requested',
      error: {
        code: 'DATABASE_REQUEST_ERROR',
        message: 'Invalid database operation requested',
      },
    });
    return;
  }

  // 3. JSON Parsing Syntax Error
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Malformed JSON payload provided in request body',
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload provided in request body',
      },
    });
    return;
  }

  // 4. Unexpected Internal Server Error
  console.error('Unhandled Internal Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred',
    },
  });
}

module.exports = {
  errorHandler,
};
