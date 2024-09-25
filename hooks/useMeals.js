// hooks/useMeals.js

import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'

const useMeals = () => {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  useEffect(() => {
    const fetchMeals = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        setError('No user is logged in.')
        setLoading(false)
        return
      }

      const userId = currentUser.uid
      const today = getFormattedToday()

      try {
        const mealsRef = doc(db, 'users', userId, 'meals', today)
        const mealsDoc = await getDoc(mealsRef)

        if (mealsDoc.exists()) {
          setMeals(mealsDoc.data().meals || [])
        } else {
          setMeals([])
        }
      } catch (err) {
        console.error('Error fetching meals:', err)
        setError('Failed to fetch meals. Please try again.')
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMeals()
  }, [retryCount])

  const retry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1)
    } else {
      Alert.alert(
        'Error',
        'Maximum retry attempts reached. Please try again later.'
      )
    }
  }

  return { meals, loading, error, retry }
}

export default useMeals
