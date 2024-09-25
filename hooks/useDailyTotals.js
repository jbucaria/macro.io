// hooks/useDailyTotals.js

import { useState, useEffect } from 'react'
import { doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase'

const useDailyTotals = () => {
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Utility function for consistent date formatting
  const getFormattedToday = () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const now = new Date()
    const zonedDate = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)
    // Convert to yyyy-MM-dd
    const [month, day, year] = zonedDate.split('/')
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    const fetchDailyTotals = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        setError('No user is logged in.')
        setLoading(false)
        return
      }

      const userId = currentUser.uid
      const today = getFormattedToday()

      try {
        // Fetch daily totals
        const dailyTotalsRef = doc(db, 'users', userId, 'dailyTotals', today)
        const dailyDoc = await getDoc(dailyTotalsRef)

        if (dailyDoc.exists()) {
          const data = dailyDoc.data()
          setTotals({
            calories: data.calories || 0,
            protein: data.protein || 0,
            fat: data.fat || 0,
            carbohydrates: data.carbohydrates || 0,
          })
        } else {
          setTotals({
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0,
          })
        }
      } catch (err) {
        console.error('Error fetching daily totals:', err)
        setError('Failed to fetch daily totals.')
      } finally {
        setLoading(false)
      }
    }

    fetchDailyTotals()
  }, [])

  return { totals, loading, error }
}

export default useDailyTotals
