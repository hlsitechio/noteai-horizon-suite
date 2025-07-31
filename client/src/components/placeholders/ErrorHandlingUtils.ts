// Utility functions for error handling in placeholders

export const safeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as any).message);
  }
  return 'An unknown error occurred';
};

export const safeErrorCode = (error: unknown): string | undefined => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as any).code);
  }
  return undefined;
};

export const handleUnknownError = (error: unknown, context: string = 'operation'): void => {
  const message = safeErrorMessage(error);
  console.error(`Error in ${context}:`, message);
};