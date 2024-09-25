import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, auth } from '../firebase'

const useGoals = () => {
  const [goals, setGoals] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      setError('No user is logged in.')
      setLoading(false)
      return
    }

    const userId = currentUser.uid
    const goalsDocRef = doc(db, 'users', userId, 'goals', 'nutrition')

    const unsubscribe = onSnapshot(
      goalsDocRef,
      docSnapshot => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          setGoals({
            calories: data.calories || 0,
            protein: data.protein || 0,
            fat: data.fat || 0,
            carbohydrates: data.carbohydrates || 0,
          })
        } else {
          setError('Goals not set.')
        }
        setLoading(false)
      },
      err => {
        console.error('Error fetching goals:', err)
        setError('Failed to fetch goals.')
        setLoading(false)
      }
    )

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [])

  const refreshGoals = () => {
    // Since onSnapshot listens in real-time, this can be a no-op or used to trigger manual refresh if needed
    // Alternatively, implement a one-time fetch if real-time is not desired
  }

  return { goals, loading, error, refreshGoals }
}

export default useGoals
