// deleteMeal.js

import { db, auth } from '../firebase'
import { doc, deleteDoc } from 'firebase/firestore'

export const deleteMeal = async mealId => {
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('No user is logged in.')
  }

  const userId = currentUser.uid

  try {
    const mealDocRef = doc(db, 'users', userId, 'meals', mealId)

    await deleteDoc(mealDocRef)

    return {
      success: true,
      message: 'Meal deleted successfully.',
    }
  } catch (error) {
    console.error('Error deleting meal:', error)
    throw new Error(error.message || 'Failed to delete meal.')
  }
}
