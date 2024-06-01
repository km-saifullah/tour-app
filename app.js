const express = require('express')
const morgan = require('morgan')

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
  console.log('Hello from the middleware!')
  next()
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app
