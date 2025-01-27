import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  console.log("useSignup hook is being initialized"); // Log to verify hook initialization

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    console.log("Signup function triggered with:", email, password); // Log the signup attempt

    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(json))
      dispatch({type: 'LOGIN', payload: json})
      setIsLoading(false)
    }
  }

  console.log("Returning from useSignup:", { signup, isLoading, error }); // Log the return values

  return { signup, isLoading, error }
}

export default useSignup;
