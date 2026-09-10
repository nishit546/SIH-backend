import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // 1. Custom Application Errors (ValidationError, NotFoundError, BadRequestError, ConflictError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
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
      // Record to update or delete not found
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'The requested record was not found in the database',
        },
      });
      return;
    }

    if (err.code === 'P2002') {
      // Unique constraint failed
      const target = Array.isArray(err.meta?.target) ? (err.meta.target as string[]).join(', ') : 'unique field';
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: `A record with this ${target} already exists`,
        },
      });
      return;
    }

    // Generic Prisma Client error without exposing SQL/table details
    console.error('Prisma Known Error:', err.code);
    res.status(400).json({
      success: false,
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
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload provided in request body',
      },
    });
    return;
  }

  // 4. Unexpected Internal Server Error (Never leak stack traces or connection details)
  console.error('Unhandled Internal Server Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred',
    },
  });
}
