const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})
// Static signup method
userSchema.statics.signup = async function(email, password) {

  // Validation checks
  if (!email || !password) {
    throw Error('All fields must be filled') // Ensures both fields are provided
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid') // Validates email format
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough') // Validates password strength
  }

  const exists = await this.findOne({ email }) // Checks if email already exists in the database

  if (exists) {
    throw Error('Email already in use') // Throws error if email is already in use
  }

  const salt = await bcrypt.genSalt(10) // Generates a salt for hashing the password
  const hash = await bcrypt.hash(password, salt) // Hashes the password with the salt

  const user = await this.create({ email, password: hash }) // Creates a new user with the hashed password

  return user // Returns the created user object
}

// Static login method
userSchema.statics.login = async function(email, password) {

  // Check if both fields are provided
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  // Find user by email
  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email') // If no user is found
  }

  // Compare provided password with stored hash
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password') // If passwords don't match
  }

  return user // Return the user object on successful login
}

module.exports = mongoose.model('User', userSchema)