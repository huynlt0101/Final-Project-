// Standardized API response helpers
export const successResponse = (res, message = 'Success', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = 'Error message', statusCode = 500, data = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data
  });
};
