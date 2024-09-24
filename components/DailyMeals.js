import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  View,
  Alert, // Import Alert for user feedback
  ActivityIndicator, // Optional: For loading indicators
} from 'react-native'
import { db, auth } from '../firebase' // Adjust the path as necessary
import {
  collection,
  doc,
  onSnapshot,
  deleteDoc,
  query,
  updateDoc,
  orderBy,
} from 'firebase/firestore' // Import Firestore functions

const DailyMeals = ({ selectedDate }) => {
  const [meals, setMeals] = useState([]) // Store all meals for the selected date
  const [selectedMeal, setSelectedMeal] = useState(null) // Store the selected meal for the modal
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedMeal, setEditedMeal] = useState(null)
  const [loading, setLoading] = useState(false) // Optional: For loading states

  useEffect(() => {
    let unsubscribe

    const fetchMeals = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.error('No user logged in.')
        return
      }

      const userId = currentUser.uid

      try {
        const mealsRef = collection(
          db,
          'users',
          userId,
          'meals',
          selectedDate,
          'meals'
        )
        const mealsQuery = query(mealsRef, orderBy('createdAt', 'desc'))

        unsubscribe = onSnapshot(mealsQuery, snapshot => {
          if (snapshot.empty) {
            console.log('No meals found for this date.')
            setMeals([])
          } else {
            const mealsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }))
            setMeals(mealsData)
          }
        })
      } catch (error) {
        console.error('Error fetching meals:', error)
        Alert.alert('Error', 'Failed to fetch meals. Please try again later.')
      }
    }

    if (selectedDate) {
      fetchMeals()
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [selectedDate])

  // Function to open the modal with selected meal
  const openModal = meal => {
    setSelectedMeal(meal)
    setIsEditing(false)
    setModalVisible(true)
  }

  // Function to close the modal and reset states
  const closeModal = () => {
    setSelectedMeal(null)
    setIsEditing(false)
    setEditedMeal(null)
    setModalVisible(false)
  }

  // Function to start editing the selected meal
  const startEditing = () => {
    setIsEditing(true)
    setEditedMeal({ ...selectedMeal }) // Clone the selectedMeal to editedMeal
  }

  // Function to handle deletion of a meal
  const handleDeleteMeal = async mealId => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const currentUser = auth.currentUser
            if (!currentUser) {
              Alert.alert('Error', 'User not authenticated.')
              return
            }

            const userId = currentUser.uid

            try {
              // Reference to the specific meal document
              const mealDocRef = doc(
                db,
                'users',
                userId,
                'meals',
                selectedDate,
                'meals',
                mealId
              )

              // Delete the meal document
              await deleteDoc(mealDocRef)

              Alert.alert('Success', 'Meal deleted successfully.')
              closeModal()
            } catch (error) {
              console.error('Error deleting meal:', error)
              Alert.alert('Error', 'Failed to delete meal. Please try again.')
            }
          },
        },
      ],
      { cancelable: true }
    )
  }

  // Function to handle updating a meal
  const handleUpdateMeal = async () => {
    // Basic validation
    if (!editedMeal.food.trim()) {
      Alert.alert('Validation Error', 'Food name cannot be empty.')
      return
    }
    if (
      isNaN(editedMeal.calories) ||
      isNaN(editedMeal.protein) ||
      isNaN(editedMeal.fat) ||
      isNaN(editedMeal.carbohydrates)
    ) {
      Alert.alert('Validation Error', 'Nutrient values must be numbers.')
      return
    }

    setLoading(true) // Start loading indicator

    const currentUser = auth.currentUser
    if (!currentUser || !editedMeal) {
      setLoading(false)
      Alert.alert('Error', 'User not authenticated or meal data missing.')
      return
    }

    const userId = currentUser.uid

    try {
      const mealDocRef = doc(
        db,
        'users',
        userId,
        'meals',
        selectedDate,
        'meals',
        editedMeal.id
      )
      await updateDoc(mealDocRef, {
        food: editedMeal.food,
        calories: editedMeal.calories,
        protein: editedMeal.protein,
        fat: editedMeal.fat,
        carbohydrates: editedMeal.carbohydrates,
        // Optionally, update 'updatedAt' timestamp
        updatedAt: new Date(),
      })
      Alert.alert('Success', 'Meal updated successfully.')
      closeModal()
    } catch (error) {
      console.error('Error updating meal:', error)
      Alert.alert('Error', 'Failed to update meal. Please try again.')
    } finally {
      setLoading(false) // Stop loading indicator
    }
  }

  return (
    <ScrollView className="p-4">
      {meals.length === 0 ? (
        <Text className="text-center text-gray-500">
          No meals for this date.
        </Text>
      ) : (
        meals.map(meal => (
          <TouchableOpacity
            key={meal.id}
            onPress={() => openModal(meal)}
            className="bg-white p-4 mb-4 rounded-lg shadow-md"
          >
            <Text>🍽️ Food: {meal.food}</Text>
            <Text>🔥 Calories: {meal.calories} kcal</Text>
            <Text>💪 Protein: {meal.protein}g</Text>
            <Text>🧈 Fat: {meal.fat}g</Text>
            <Text>🍞 Carbs: {meal.carbohydrates}g</Text>
            <Text className="text-gray-400">
              Logged At:{' '}
              {meal.createdAt && meal.createdAt.toDate().toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))
      )}

      {/* Modal for Meal Details and Editing */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-2xl p-6 h-3/5">
            {selectedMeal && !isEditing ? (
              <>
                {/* Close Button */}
                <TouchableOpacity
                  className="absolute top-4 right-4"
                  onPress={closeModal}
                >
                  <Text className="text-xl font-bold">×</Text>
                </TouchableOpacity>

                {/* Meal Details */}
                <Text className="text-lg font-bold mb-4">Meal Details</Text>
                <Text>🍽️ Food: {selectedMeal.food}</Text>
                <Text>🔥 Calories: {selectedMeal.calories} kcal</Text>
                <Text>💪 Protein: {selectedMeal.protein}g</Text>
                <Text>🧈 Fat: {selectedMeal.fat}g</Text>
                <Text>🍞 Carbs: {selectedMeal.carbohydrates}g</Text>
                <Text className="text-gray-400">
                  Logged At:{' '}
                  {selectedMeal.createdAt &&
                    selectedMeal.createdAt.toDate().toLocaleString()}
                </Text>

                {/* Action Buttons */}
                <View className="mt-6 space-y-2">
                  <Button
                    title="Edit Meal"
                    onPress={startEditing}
                    color="#1E90FF" // DodgerBlue
                  />
                  <Button
                    title="Delete Meal"
                    onPress={() => handleDeleteMeal(selectedMeal.id)}
                    color="#FF4500" // OrangeRed
                  />
                </View>
              </>
            ) : (
              <>
                {/* Close Button */}
                <TouchableOpacity
                  className="absolute top-4 right-4"
                  onPress={closeModal}
                >
                  <Text className="text-xl font-bold">×</Text>
                </TouchableOpacity>

                {/* Edit Form */}
                <Text className="text-lg font-bold mb-4">Edit Meal</Text>
                <TextInput
                  placeholder="Food"
                  value={editedMeal?.food}
                  onChangeText={text =>
                    setEditedMeal({ ...editedMeal, food: text })
                  }
                  className="border border-gray-300 p-2 mb-4 rounded"
                />
                <TextInput
                  placeholder="Calories"
                  value={
                    editedMeal?.calories !== undefined
                      ? String(editedMeal.calories)
                      : ''
                  }
                  keyboardType="numeric"
                  onChangeText={text =>
                    setEditedMeal({ ...editedMeal, calories: Number(text) })
                  }
                  className="border border-gray-300 p-2 mb-4 rounded"
                />
                <TextInput
                  placeholder="Protein"
                  value={
                    editedMeal?.protein !== undefined
                      ? String(editedMeal.protein)
                      : ''
                  }
                  keyboardType="numeric"
                  onChangeText={text =>
                    setEditedMeal({ ...editedMeal, protein: Number(text) })
                  }
                  className="border border-gray-300 p-2 mb-4 rounded"
                />
                <TextInput
                  placeholder="Fat"
                  value={
                    editedMeal?.fat !== undefined ? String(editedMeal.fat) : ''
                  }
                  keyboardType="numeric"
                  onChangeText={text =>
                    setEditedMeal({ ...editedMeal, fat: Number(text) })
                  }
                  className="border border-gray-300 p-2 mb-4 rounded"
                />
                <TextInput
                  placeholder="Carbs"
                  value={
                    editedMeal?.carbohydrates !== undefined
                      ? String(editedMeal.carbohydrates)
                      : ''
                  }
                  keyboardType="numeric"
                  onChangeText={text =>
                    setEditedMeal({
                      ...editedMeal,
                      carbohydrates: Number(text),
                    })
                  }
                  className="border border-gray-300 p-2 mb-4 rounded"
                />

                {/* Save and Cancel Buttons */}
                <View className="mt-6 space-y-2">
                  {loading ? (
                    <ActivityIndicator size="large" color="#32CD32" /> // LimeGreen
                  ) : (
                    <>
                      <Button
                        title="Save Changes"
                        onPress={handleUpdateMeal}
                        color="#32CD32" // LimeGreen
                      />
                      <Button
                        title="Cancel"
                        onPress={closeModal}
                        color="#A9A9A9" // DarkGray
                      />
                    </>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default DailyMeals
