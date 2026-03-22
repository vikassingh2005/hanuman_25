/**
 * Error handling utility for consistent error management across the application
 */

// Format error message from various API response formats
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle axios error response
  if (error.response) {
    const { data } = error.response;
    
    // Handle different error response formats
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (typeof data === 'string') return data;
    
    return 'Server error occurred';
  }
  
  // Handle network errors
  if (error.request) {
    return 'Network error. Please check your connection';
  }
  
  // Handle string errors
  if (typeof error === 'string') return error;
  
  // Handle error objects with message property
  if (error.message) return error.message;
  
  return 'An unexpected error occurred';
};

// Log errors to console and potentially to an error tracking service
export const logError = (error, context = {}) => {
  console.error('Error occurred:', error);
  
  // Here you could add integration with error tracking services like Sentry
  // Example: Sentry.captureException(error, { extra: context });
  
  return formatErrorMessage(error);
};

// Create a standardized error object
export const createError = (message, code = 'ERROR', data = {}) => {
  return {
    message,
    code,
    data,
    timestamp: new Date().toISOString()
  };
};

export default {
  formatErrorMessage,
  logError,
  createError
};