import React, { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const [isDeleting, setIsDeleting] = useState(false)  // Track loading state for delete operation
  const [error, setError] = useState(null)  // To handle errors during the delete

  const handleClick = async () => {
    if (!user) {
      return
    }

    setIsDeleting(true)
    setError(null)  // Reset error state before making the request

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'DELETE_WORKOUT', payload: json })
      } else {
        setError(json.error || 'Failed to delete the workout.')
      }
    } catch (err) {
      setError('Error deleting the workout: ' + err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p><strong>Load (kg): </strong>{workout.load}</p>
      <p><strong>Reps: </strong>{workout.reps}</p>
      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
      {error && <p className="error-message">{error}</p>}  {/* Display error message if it exists */}
      <span
        className={`material-symbols-outlined ${isDeleting ? 'loading' : ''}`}
        onClick={handleClick}
        disabled={isDeleting}  // Prevent multiple clicks while deleting
      >
        {isDeleting ? 'hourglass_top' : 'delete'}
      </span>
    </div>
  )
}

export default WorkoutDetails
