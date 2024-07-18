const express = require('express')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// Middleware is just a function that can modify incoming request data. It can be placed in between req and res
app.use(express.json()) //middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// for static file
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// global error handling middleware
app.use(globalErrorHandler)

module.exports = app
