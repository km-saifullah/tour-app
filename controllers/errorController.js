const AppError = require('./../utils/appError')

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`
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
    console.error('Error', err)
    // send a generic message
    res
      .status(500)
      .json({ status: 'error', message: 'Something went very wrong' })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    if (error.name === 'CastError') error = handleCastErrorDB(error)
    sendErrorProduction(error, res)
  }
}
