// updateMeal.js

import { db, auth } from '../firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'

export const updateMeal = async (mealId, updatedData) => {
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('No user is logged in.')
  }

  const userId = currentUser.uid

  try {
    const mealDocRef = doc(db, 'users', userId, 'meals', mealId)

    await updateDoc(mealDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    })

    return {
      success: true,
      message: 'Meal updated successfully.',
    }
  } catch (error) {
    console.error('Error updating meal:', error)
    throw new Error(error.message || 'Failed to update meal.')
  }
}
