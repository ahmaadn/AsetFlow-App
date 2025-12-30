import { ErrorCode } from '../utils/error-code.utils';

/**
 * Detail tambahan untuk error API.
 */
export type ErrorDetail = {
  message: string;
  [key: string]: unknown;
};

/**
 * Kumpulan detail tambahan untuk error API.
 */
export type ApiErrorDetails = { [key: string]: ErrorDetail };

/**
 * Parameter untuk membuat error API.
 */
export type ParamErrorType = {
  message?: string;
  statusCode?: number;
  errorCode?: ErrorCode;
  details?: ApiErrorDetails;
};

/**
 * Tipe respons error API.
 */
export type ValidationErrorResponse = {
  message: string;
  errorCode: ErrorCode;
  details: ApiErrorDetails;
};

export type ApiErrorResponse = {
  message: string;
  errorCode: ErrorCode;
};
