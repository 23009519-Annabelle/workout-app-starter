const User = require('../models/userModel') // Import the User model
const jwt = require('jsonwebtoken') // Import the jsonwebtoken library for token creation

// Function to create a JSON Web Token (JWT)
const createToken = (_id) => {
  // Create a token using the user's ID, a secret key, and an expiration time of 3 days
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body // Extract email and password from the request body

  try {
    // Use the User model's login method to verify credentials
    const user = await User.login(email, password)

    // Create a token for the authenticated user
    const token = createToken(user._id)

    // Respond with the user's email and the created token
    res.status(200).json({ email, token })
  } catch (error) {
    // If an error occurs (e.g., invalid credentials), send a 400 status with the error message
    res.status(400).json({ error: error.message })
  }
}

// Signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body // Extract email and password from the request body

  try {
    // Use the User model's signup method to create a new user
    const user = await User.signup(email, password)

    // Create a token for the newly signed-up user
    const token = createToken(user._id)

    // Respond with the user's email and the created token
    res.status(200).json({ email, token })
  } catch (error) {
    // If an error occurs (e.g., email already in use), send a 400 status with the error message
    res.status(400).json({ error: error.message })
  }
}

// Export the functions to be used in other parts of the application
module.exports = { signupUser, loginUser }
