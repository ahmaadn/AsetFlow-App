import { FetchError } from 'ofetch';

export const returnErrorMessage = (errorCode: string): string => {
  if (typeof errorCode !== 'string') {
    return 'Unknown error';
  }

  switch (errorCode) {
    case 'FOLDER_SLUG_EXISTS':
      return 'The folder slug already exists.';
    case 'NOT_FOUND':
      return 'The requested resource was not found.';
  }
  return 'An unexpected error occurred.';
};

export function isFetchError<T>(error: unknown): error is FetchError<T> {
  return error instanceof FetchError;
}
