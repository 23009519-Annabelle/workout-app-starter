import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

// Custom hook to handle user signup functionality
export const useSignup = () => {
  // State to store any error that occurs during signup
  const [error, setError] = useState(null)
  
  // State to track whether the signup process is currently loading
  const [isLoading, setIsLoading] = useState(null)
  
  // Access the dispatch function from the authentication context
  const { dispatch } = useAuthContext()

  // Async function to handle user signup
  const signup = async (email, password) => {
    setIsLoading(true) // Set loading state to true at the start of the process
    setError(null) // Reset error state before attempting signup

    try {
      // Send a POST request to the signup API with email and password
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Specify JSON data in the request
        body: JSON.stringify({ email, password }) // Convert signup details into JSON format
      })
      const json = await response.json() // Parse the JSON response from the server

      // If the response is not OK (error occurred)
      if (!response.ok) {
        setIsLoading(false) // Stop loading state
        setError(json.error) // Set the error message from the server response
      }

      // If the response is OK (successful signup)
      if (response.ok) {
        // Save the user data (e.g., token) to local storage for login persistence
        localStorage.setItem('user', JSON.stringify(json))

        // Update the global authentication context with the new user's data
        dispatch({ type: 'LOGIN', payload: json })

        // Stop the loading state
        setIsLoading(false)
      }
    } catch (err) {
      // Handle any unexpected errors during the signup process
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  // Return the signup function and the states for use in components
  return { signup, isLoading, error }
}
