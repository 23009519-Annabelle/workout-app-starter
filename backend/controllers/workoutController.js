const Workout = require('../models/workoutModel') // Import the Workout model
const mongoose = require('mongoose') // Import mongoose for database operations

// Get all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.user._id // Retrieve the user's ID from the request (authenticated user)

  // Find all workouts that belong to the user and sort them by creation date (newest first)
  const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 })

  // Respond with the list of workouts
  res.status(200).json(workouts)
}

// Get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params // Extract the workout ID from the request parameters

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' }) // Return 404 if invalid
  }

  // Find the workout by ID
  const workout = await Workout.findById(id)

  if (!workout) {
    return res.status(404).json({ error: 'No such workout' }) // Return 404 if the workout does not exist
  }

  res.status(200).json(workout) // Respond with the workout details
}

// Create a new workout
const createWorkout = async (req, res) => {
  const { title, load, reps } = req.body // Extract workout details from the request body

  let emptyFields = [] // Track any missing fields

  // Check for missing fields and add them to the emptyFields array
  if (!title) emptyFields.push('title')
  if (!load) emptyFields.push('load')
  if (!reps) emptyFields.push('reps')

  // If there are missing fields, return a 400 response with the error message and missing fields
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  try {
    const user_id = req.user._id // Retrieve the user's ID from the request
    // Create a new workout in the database
    const workout = await Workout.create({ title, load, reps, user_id })
    res.status(200).json(workout) // Respond with the newly created workout
  } catch (error) {
    res.status(400).json({ error: error.message }) // Handle any errors
  }
}

// Delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params // Extract the workout ID from the request parameters

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' }) // Return 404 if invalid
  }

  // Find and delete the workout by ID
  const workout = await Workout.findOneAndDelete({ _id: id })

  if (!workout) {
    return res.status(400).json({ error: 'No such workout' }) // Return 400 if the workout does not exist
  }

  res.status(200).json(workout) // Respond with the deleted workout details
}

// Update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params // Extract the workout ID from the request parameters

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' }) // Return 404 if invalid
  }

  // Find the workout by ID and update it with the new data from the request body
  const workout = await Workout.findOneAndUpdate({ _id: id }, {
    ...req.body // Spread the request body to apply all updated fields
  })

  if (!workout) {
    return res.status(400).json({ error: 'No such workout' }) // Return 400 if the workout does not exist
  }

  res.status(200).json(workout) // Respond with the updated workout details
}

// Export the functions to make them available in other parts of the app
module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}
