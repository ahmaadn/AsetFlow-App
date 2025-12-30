import { ErrorCode } from '@asetflow/shared';
import type {
  ApiErrorDetails,
  ApiErrorResponse,
  ParamErrorType,
  ValidationErrorResponse,
} from '@asetflow/shared';

/**
 * Kelas Dasar untuk Error API, kelas ini dapat diperluas untuk error spesifik lainnya.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly details: ApiErrorDetails;

  constructor(params: ParamErrorType) {
    super(params.message || 'An error occurred');

    // Set properti tambahan
    this.statusCode = params.statusCode || 500;
    this.errorCode = params.errorCode || ErrorCode.API_ERROR;
    this.details = params.details || {};

    // Set nama prototype agar 'instanceof' berfungsi dengan benar
    Object.setPrototypeOf(this, new.target.prototype);

    // Menyimpan stack trace untuk debugging yang lebih baik
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): ValidationErrorResponse | ApiErrorResponse {
    if (Object.keys(this.details).length === 0) {
      return { message: this.message, errorCode: this.errorCode };
    }

    return {
      message: this.message,
      errorCode: this.errorCode,
      details: this.details,
    };
  }
}

/**
 * Kelas untuk error 404 Not Found.
 */
export class NotFoundError extends ApiError {
  constructor(params: ParamErrorType = {}) {
    super({
      message: params.message || 'Resource not found',
      statusCode: params.statusCode || 404,
      errorCode: params.errorCode || ErrorCode.NOT_FOUND,
      details: params.details || {},
    });
  }
}

/**
 * Kelas untuk error 400 Bad Request.
 */
export class BadRequestError extends ApiError {
  constructor(params: ParamErrorType = {}) {
    super({
      message: params.message || 'Bad request',
      statusCode: params.statusCode || 400,
      errorCode: params.errorCode || ErrorCode.BAD_REQUEST,
      details: params.details || {},
    });
  }
}

/**
 * Kelas untuk error 401 Unauthorized.
 */
export class UnauthorizedError extends ApiError {
  constructor(params: ParamErrorType = {}) {
    super({
      message: params.message || 'Unauthorized',
      statusCode: params.statusCode || 401,
      errorCode: params.errorCode || ErrorCode.UNAUTHORIZED,
      details: params.details || {},
    });
  }
}

/**
 * Kelas untuk error 403 Forbidden.
 */
export class ForbiddenError extends ApiError {
  constructor(params: ParamErrorType = {}) {
    super({
      message: params.message || 'Forbidden',
      statusCode: params.statusCode || 403,
      errorCode: params.errorCode || ErrorCode.FORBIDDEN,
      details: params.details || {},
    });
  }
}

/**
 * Kelas untuk error 409 Conflict.
 */
export class ConflictError extends ApiError {
  constructor(params: ParamErrorType = {}) {
    super({
      message: params.message || 'Conflict',
      statusCode: params.statusCode || 409,
      errorCode: params.errorCode || ErrorCode.CONFLICT,
      details: params.details || {},
    });
  }
}

/**
 * Kelas untuk error 500 Internal Server Error.
 */
export class InternalServerError extends ApiError {
  constructor(
    params: {
      message?: string;
      errorCode?: ErrorCode;
    } = {}
  ) {
    super({
      message: params.message || 'Internal server error',
      statusCode: 500,
      errorCode: params.errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
      details: {},
    });
  }
}

/**
 * Kelas untuk error 422 Unprocessable Entity (Validation Error).
 */
export class FieldValidationError extends ApiError {
  constructor(params: ParamErrorType = {}) {
    super({
      message: params.message || 'Validation error',
      statusCode: params.statusCode || 422,
      errorCode: params.errorCode || ErrorCode.VALIDATION_ERROR,
      details: params.details || {},
    });
  }
}
