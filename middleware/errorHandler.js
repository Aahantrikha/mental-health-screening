/**
 * Global error handler middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'Audio file must be less than 25MB',
      maxSize: '25MB'
    });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: err.message
    });
  }

  // API-specific errors
  if (err.message && err.message.includes('HF_TOKEN')) {
    return res.status(500).json({
      error: 'Configuration error',
      message: 'Hugging Face API token not configured. Please set HF_TOKEN in .env file.'
    });
  }

  if (err.message && err.message.includes('Cannot connect to local classifier')) {
    return res.status(503).json({
      error: 'Service unavailable',
      message: err.message,
      suggestion: 'Ensure your FastAPI classifier is running on http://localhost:8000'
    });
  }

  // Generic error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : 'Request failed',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}