import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Default is false
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Failed to log in");
      }

      // Save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // Update the auth context
      dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      console.error("Login error:", err); // Added console logging for debugging
    }
  };

  return { login, isLoading, error };
};
