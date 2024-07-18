const AppError = require('./../utils/appError')

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateFieldDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Duplicate field value:${value}. Please use another value`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid Input Data.${errors.join('. ')}`
  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProduction = (err, res) => {
  // operational, truested error: send  message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
    // programming or other unknown error
  } else {
    // log error
    // console.error('Error', err)
    // send a generic message
    res
      .status(500)
      .json({ status: 'error', message: 'Something went very wrong' })
  }
}

const handleJWTError = (err, res) =>
  new AppError('Invalid token. Please login again', 401)

const handleJWTExpiredError = (err, res) =>
  new AppError('Your token has expired.Please login again', 401)

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldDB(error)
    if (error.name === 'ValidatorError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error)
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error)
    sendErrorProduction(error, res)
  }
}
