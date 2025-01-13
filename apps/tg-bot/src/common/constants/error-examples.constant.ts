export const defaultErrorExamples = {
  badRequest: {
    description: 'Bad Request - Validation failed',
    value: {
      statusCode: 400,
      message: [
        'id must be a number',
        'name must be at least 3 characters long',
        'email must be a valid email address',
      ],
      error: 'Bad Request',
      timestamp: new Date().toISOString(),
      path: 'http://localhost:3000/api/v1/example',
    },
  },
  unauthorized: {
    description: 'Unauthorized - Authentication failed',
    value: {
      statusCode: 401,
      message: 'Invalid credentials',
      error: 'Unauthorized',
      timestamp: new Date().toISOString(),
      path: 'http://localhost:3000/api/v1/example',
    },
  },
  forbidden: {
    description: 'Forbidden - Insufficient permissions',
    value: {
      statusCode: 403,
      message: 'You do not have permission to access this resource',
      error: 'Forbidden',
      timestamp: new Date().toISOString(),
      path: 'http://localhost:3000/api/v1/example',
    },
  },
  notFound: {
    description: 'Not Found - Resource not found',
    value: {
      statusCode: 404,
      message: 'Example with id 999 not found',
      error: 'Not Found',
      timestamp: new Date().toISOString(),
      path: 'http://localhost:3000/api/v1/example/999',
    },
  },
  internalError: {
    description: 'Internal Server Error',
    value: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: 'http://localhost:3000/api/v1/example',
    },
  },
};
