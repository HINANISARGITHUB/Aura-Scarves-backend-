class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

const handleCastError = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400)
const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0]
  return new AppError(`${field} already in use`, 400)
}
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(e => e.message)
  return new AppError(`Validation failed: ${errors.join('. ')}`, 400)
}
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401)
const handleJWTExpiredError = () => new AppError('Session expired. Please log in again.', 401)

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500

  let error = { ...err, message: err.message }

  if (err.name === 'CastError') error = handleCastError(err)
  if (err.code === 11000) error = handleDuplicateFields(err)
  if (err.name === 'ValidationError') error = handleValidationError(err)
  if (err.name === 'JsonWebTokenError') error = handleJWTError()
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError()

  if (process.env.NODE_ENV !== 'production') {
    console.error('ERROR 💥', err)
  }

  res.status(error.statusCode || 500).json({
    message: error.message || 'Something went wrong',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

module.exports = { AppError, globalErrorHandler }
