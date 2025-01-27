import { useAuthContext } from './useAuthContext'
import { useWorkoutsContext } from './useWorkoutsContext'

// Custom hook to handle user logout functionality
export const useLogout = () => {
  // Access the dispatch function from the authentication context
  const { dispatch } = useAuthContext()
  
  // Access the dispatch function from the workouts context (for managing workout-related state)
  const { dispatch: dispatchWorkouts } = useWorkoutsContext()

  // Function to log out the user
  const logout = () => {
    // Remove the user data from local storage (to clear login persistence)
    localStorage.removeItem('user')

    // Dispatch a 'LOGOUT' action to update the auth context (user is no longer logged in)
    dispatch({ type: 'LOGOUT' })
    
    // Reset the workouts state by dispatching a 'SET_WORKOUTS' action with a payload of null
    // This ensures no workout data is retained after logout
    dispatchWorkouts({ type: 'SET_WORKOUTS', payload: null })
  }

  // Return the logout function so it can be used in components
  return { logout }
}
