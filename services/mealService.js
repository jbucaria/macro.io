// saveMeal.js

import { db, auth } from '../firebase' // Adjust the path as necessary
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  increment,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore'
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

    // Reference to the meals collection for the current date
    const mealsCollectionRef = collection(
      db,
      'users',
      userId,
      'meals',
      today,
      'meals'
    )

    // Add a new meal document with an auto-generated ID
    await addDoc(mealsCollectionRef, {
      food: foodInput,
      calories,
      protein,
      fat,
      carbohydrates,
      createdAt: serverTimestamp(),
    })

    // Reference to the daily totals document for the current date
    const dailyTotalsRef = doc(db, 'users', userId, 'dailyTotals', today)
    const docSnapshot = await getDoc(dailyTotalsRef)

    if (docSnapshot.exists()) {
      // If the document exists, update the totals by incrementing the existing values
      await updateDoc(dailyTotalsRef, {
        calories: increment(calories),
        protein: increment(protein),
        fat: increment(fat),
        carbohydrates: increment(carbohydrates),
      })
    } else {
      // If the document does not exist, create a new one with the totals
      await setDoc(dailyTotalsRef, {
        calories,
        protein,
        fat,
        carbohydrates,
        createdAt: serverTimestamp(),
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
