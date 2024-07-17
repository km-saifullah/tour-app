const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only works on CREATE and SAVE!!!
      validator: function (element) {
        return element === this.password
      },
      messgae: 'Passwords are not same',
    },
  },
})

userSchema.pre('save', async function (next) {
  // only run thus function if password was actually modified
  if (!this.isModified('password')) return next()

  // hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // delete passwordConfirm field
  this.passwordConfirm = undefined
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
