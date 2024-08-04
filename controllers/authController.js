const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const catchAsync = require('../utils/catchAsync')
const User = require('./../models/userModel')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  })

  const token = signToken(newUser._id)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // 1) check email and passsword actually exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  // 2) check if user exist and password is correct
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  // 3) if everything ok send token to client
  const token = signToken(user._id)
  res.status(200).json({
    status: 'success',
    token,
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token & check of it's there
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401))
  }

  // 2) verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET)

  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(
      new AppError('The user belonging of this token does not exist', 401)
    )
  }

  // 4) check if user changed password after the JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User rescently changed password!plase log in again', 401)
    )
  }

  // grant access to protected route
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array: ['admin','lead-guide']. role is now just user
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do  not have permission to perform this action', 403)
      )
    }
    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on posted email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with that email', 404))
  }

  // 2. generate the random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // 3. send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`

  const message = `Forgot your password? submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email`

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token (valid only for 10 min)',
      message: message,
    })

    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    })
  } catch (error) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })
    return next(
      new AppError('There is an error to sending email. Try again later'),
      500
    )
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  // 2. If token has not expired and there is user set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  // 3. Update changed password at property for the user

  // 4. Log the user in, send jwt
  const token = signToken(user._id)
  res.status(200).json({
    status: 'success',
    token,
  })
})
