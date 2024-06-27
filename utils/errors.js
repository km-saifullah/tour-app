// unhandled routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // })
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status = 'fail'
  // err.statusCode = 404

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// global error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
})
