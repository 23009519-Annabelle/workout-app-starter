import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  // State variables for error handling and loading state
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  // Accessing dispatch function from auth context
  const { dispatch } = useAuthContext();

  // Signup function to handle user registration
  const signup = async (email, password) => {
    setIsLoading(true); // Start loading
    setError(null); // Reset any previous error

    // Sending POST request to signup endpoint
    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // Send email and password in the request body
    });
    const json = await response.json(); // Parse the JSON response

    // Handle errors if the response is not OK
    if (!response.ok) {
      setIsLoading(false); // Stop loading
      setError(json.error); // Set the error message
    }

    // If the response is successful
    if (response.ok) {
      // Save the user data to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // Dispatch a 'LOGIN' action to update the auth context
      dispatch({ type: "LOGIN", payload: json });

      // Stop loading after successful signup
      setIsLoading(false);
    }
  };

  // Return the signup function, loading state, and error for usage in components
  return { signup, isLoading, error };
};
