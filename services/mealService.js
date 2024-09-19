import { db, auth } from '../firebase' // Import Firebase auth and Firestore
import firebase from 'firebase/compat/app' // Import firebase for Firestore functions

// Function to save a meal and update daily totals
export const saveMeal = async (foodInput, mealData) => {
  if (!mealData) {
    throw new Error('No meal data to save. Please add food first.')
  }

  const currentUser = auth.currentUser // Get the current authenticated user
  if (!currentUser) {
    throw new Error('No user is logged in.')
  }

  const userId = currentUser.uid // Retrieve the user's unique ID (uid)

  try {
    const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

    // Save the meal in the user's meals subcollection
    await db.collection('users').doc(userId).collection('meals').add({
      food: foodInput,
      calories: mealData.calories,
      protein: mealData.protein,
      fat: mealData.fat,
      carbohydrates: mealData.carbohydrates,
      createdAt: firebase.firestore.Timestamp.now(), // Use firebase.firestore.Timestamp for the timestamp
    })

    // Update daily totals in the dailyTotals subcollection
    const dailyTotalsRef = db
      .collection('users')
      .doc(userId)
      .collection('dailyTotals')
      .doc(today)
    await dailyTotalsRef.set(
      {
        calories: firebase.firestore.FieldValue.increment(mealData.calories),
        protein: firebase.firestore.FieldValue.increment(mealData.protein),
        fat: firebase.firestore.FieldValue.increment(mealData.fat),
        carbohydrates: firebase.firestore.FieldValue.increment(
          mealData.carbohydrates
        ),
        createdAt: firebase.firestore.Timestamp.now(), // Only set the timestamp if the document is created
      },
      { merge: true }
    ) // Merge to update the existing document

    return {
      success: true,
      message: 'Meal saved and daily totals updated successfully.',
    }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to save meal and update totals.')
  }
}
