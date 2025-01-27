import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  console.log("useSignup hook is being initialized");

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    console.log("Signup function triggered with:", email, password);

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      })

      console.log("API Response Status:", response.status); // Log the response status
      const text = await response.text(); // Get raw response text for debugging
      console.log("API Response Body:", text);

      let json = {};
      if (text) {
        try {
          json = JSON.parse(text); // Safely parse the response text
        } catch (parseError) {
          console.error("Failed to parse response JSON:", parseError);
          setError('Error parsing response');
          setIsLoading(false);
          return;
        }
      }

      if (!response.ok) {
        setIsLoading(false)
        setError(json.error || 'An error occurred');
      } else {
        localStorage.setItem('user', JSON.stringify(json))
        dispatch({ type: 'LOGIN', payload: json })
        setIsLoading(false)
      }

    } catch (err) {
      console.error("Error during signup:", err); // Log any unexpected errors
      setError('Signup failed. Please try again.');
      setIsLoading(false);
    }
  }

  console.log("Returning from useSignup:", { signup, isLoading, error });

  return { signup, isLoading, error }
}

export default useSignup;
