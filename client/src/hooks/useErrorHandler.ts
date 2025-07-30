import { useCallback } from 'react'
import { AppError } from '@/types'

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error | AppError, context?: Record<string, any>) => {
    // Log error details
    console.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })

    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Error tracking would be implemented here in production
    }

    // Show user-friendly error message
    return {
      message: 'An error occurred. Please try again.',
      shouldRetry: true
    }
  }, [])

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<{ data?: T; error?: string }> => {
    try {
      const data = await asyncFn()
      return { data }
    } catch (error) {
      const errorDetails = handleError(error as Error, context)
      return { error: errorDetails.message }
    }
  }, [handleError])

  return {
    handleError,
    handleAsyncError
  }
}