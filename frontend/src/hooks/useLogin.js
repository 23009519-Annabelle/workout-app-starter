import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

// This custom hook handles the user login process
export const useLogin = () => {
  // State to store any error message during login
  const [error, setError] = useState(null)
  
  // State to track if the login process is loading
  const [isLoading, setIsLoading] = useState(null)
  
  // Access the dispatch function from the authentication context
  const { dispatch } = useAuthContext()

  // Async function to handle login
  const login = async (email, password) => {
    setIsLoading(true) // Set loading state to true before starting the process
    setError(null) // Reset error to null before attempting login

    try {
      // Send a POST request to the login API with email and password
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, // Indicate JSON data in the request
        body: JSON.stringify({ email, password }) // Convert credentials into JSON format
      })
      const json = await response.json() // Parse the JSON response from the server

      // Check if the response is not OK (error occurred)
      if (!response.ok) {
        setIsLoading(false) // Stop loading state
        setError(json.error) // Set the error message from the server response
      }

      // If the response is OK (successful login)
      if (response.ok) {
        // Save the user data (token, etc.) to local storage
        localStorage.setItem('user', JSON.stringify(json))

        // Update the global authentication context with the logged-in user's data
        dispatch({ type: 'LOGIN', payload: json })

        // Stop the loading state
        setIsLoading(false)
      }
    } catch (err) {
      // Catch any unexpected errors during the login process
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  // Return the login function and the states so components can use them
  return { login, isLoading, error }
}
