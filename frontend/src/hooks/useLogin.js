import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      })

      // Check if the response is OK (status 200)
      if (!response.ok) {
        const errorText = await response.text(); // Get raw response text
        throw new Error(errorText || 'Failed to log in. Please try again later.');
      }

      // Parse the JSON response
      const json = await response.json()

      // Handle the response if it's valid
      localStorage.setItem('user', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })

      setIsLoading(false)
    } catch (err) {
      // Set error state if any error occurs
      setIsLoading(false)
      setError(err.message || 'An error occurred during login.')
    }
  }

  return { login, isLoading, error }
}
