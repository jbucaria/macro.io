import { db, auth } from '../firebase'
import firebase from 'firebase/compat/app'
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
    const today = format(zonedDate, 'yyyy-MM-dd')

    const { calories = 0, protein = 0, fat = 0, carbohydrates = 0 } = mealData

    const batch = db.batch()

    const mealRef = db.collection('users').doc(userId).collection('meals').doc()
    batch.set(mealRef, {
      food: foodInput,
      calories,
      protein,
      fat,
      carbohydrates,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

    const dailyTotalsRef = db
      .collection('users')
      .doc(userId)
      .collection('dailyTotals')
      .doc(today)

    const docSnapshot = await dailyTotalsRef.get()
    if (docSnapshot.exists) {
      batch.update(dailyTotalsRef, {
        calories: firebase.firestore.FieldValue.increment(calories),
        protein: firebase.firestore.FieldValue.increment(protein),
        fat: firebase.firestore.FieldValue.increment(fat),
        carbohydrates: firebase.firestore.FieldValue.increment(carbohydrates),
      })
    } else {
      batch.set(dailyTotalsRef, {
        calories,
        protein,
        fat,
        carbohydrates,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    }

    await batch.commit()

    return {
      success: true,
      message: 'Meal saved and daily totals updated successfully.',
    }
  } catch (error) {
    console.error('Error in saveMeal:', error)
    throw new Error(error.message || 'Failed to save meal and update totals.')
  }
}
