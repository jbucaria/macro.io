import firebase from 'firebase/compat/app'
import { db, auth } from '../firebase'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const saveMeal = async (foodInput, mealData) => {
  if (!mealData) {
    throw new Error('No meal data to save. Please add food first.')
  }

  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('No user is logged in.')
  }

  const userId = currentUser.uid

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const now = new Date()
    const zonedDate = utcToZonedTime(now, timeZone)
    const today = format(zonedDate, 'yyyy-MM-dd') // Format the date as YYYY-MM-DD

    const { calories = 0, protein = 0, fat = 0, carbohydrates = 0 } = mealData

    // Use a sub-collection for the day (e.g., meals/2024-09-21/meals)
    const mealRef = db
      .collection('users')
      .doc(userId)
      .collection('meals')
      .doc(today) // Document for today's date
      .collection('meals') // Sub-collection for the day’s meals
      .doc() // Auto-generate meal ID

    await mealRef.set({
      food: foodInput,
      calories,
      protein,
      fat,
      carbohydrates,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

    // Update daily totals
    const dailyTotalsRef = db
      .collection('users')
      .doc(userId)
      .collection('dailyTotals')
      .doc(today)
    const docSnapshot = await dailyTotalsRef.get()

    if (docSnapshot.exists) {
      // If the document exists, update the totals by incrementing the existing values
      await dailyTotalsRef.update({
        calories: firebase.firestore.FieldValue.increment(calories),
        protein: firebase.firestore.FieldValue.increment(protein),
        fat: firebase.firestore.FieldValue.increment(fat),
        carbohydrates: firebase.firestore.FieldValue.increment(carbohydrates),
      })
    } else {
      // If the document does not exist, create a new one with the totals
      await dailyTotalsRef.set({
        calories,
        protein,
        fat,
        carbohydrates,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    }

    return {
      success: true,
      message: 'Meal saved and daily totals updated successfully.',
    }
  } catch (error) {
    console.error('Error in saveMeal:', error)
    throw new Error(error.message || 'Failed to save meal and update totals.')
  }
}
