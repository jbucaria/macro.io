// DailyMeals.js

import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  View,
} from 'react-native'
import { db, auth } from '../firebase' // Adjust the path as necessary
import {
  collection,
  doc,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore' // Import Firestore functions

const DailyMeals = ({ selectedDate }) => {
  const [meals, setMeals] = useState([]) // Store all meals for the selected date
  const [selectedMeal, setSelectedMeal] = useState(null) // Store the selected meal for the modal
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    let unsubscribe // To store the unsubscribe function from onSnapshot

    const fetchMeals = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.error('No user logged in.')
        return
      }

      const userId = currentUser.uid

      try {
        // Reference to the meals collection for the selected date
        const mealsRef = collection(
          db,
          'users',
          userId,
          'meals',
          selectedDate,
          'meals'
        )

        // Create a query to order meals by creation time (optional)
        const mealsQuery = query(mealsRef, orderBy('createdAt', 'desc'))

        // Set up real-time listener
        unsubscribe = onSnapshot(mealsQuery, snapshot => {
          if (snapshot.empty) {
            console.log('No meals found for this date.')
            setMeals([]) // Ensure meals state is empty
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
      }
    }

    if (selectedDate) {
      fetchMeals() // Only fetch if selectedDate is valid
    }

    // Clean up the listener when component unmounts or selectedDate changes
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [selectedDate]) // Re-fetch meals when `selectedDate` changes

  const toggleModal = (meal = null) => {
    setSelectedMeal(meal)
    setModalVisible(!modalVisible)
  }

  const handleDeleteMeal = async mealId => {
    const currentUser = auth.currentUser
    if (!currentUser) {
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

      // No need to manually update state; onSnapshot will handle it
      toggleModal()
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  }

  return (
    <ScrollView className="p-4">
      {meals.map(meal => (
        <TouchableOpacity
          key={meal.id}
          onPress={() => toggleModal(meal)}
          className="bg-white p-4 mb-4 rounded-lg shadow-md"
        >
          <Text>Food: {meal.food}</Text>
          <Text>Calories: {meal.calories} kcal</Text>
          <Text>Protein: {meal.protein}g</Text>
          <Text>Fat: {meal.fat}g</Text>
          <Text>Carbs: {meal.carbohydrates}g</Text>
          <Text>
            Logged At:{' '}
            {meal.createdAt && meal.createdAt.toDate().toLocaleString()}
          </Text>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => toggleModal()}
      >
        <View className="flex-1 justify-center bg-black bg-opacity-50">
          <View className="bg-white rounded-t-2xl p-6 h-3/5">
            {selectedMeal && (
              <>
                <TouchableOpacity
                  className="absolute top-4 right-4"
                  onPress={() => toggleModal()}
                >
                  <Text className="text-xl font-bold">×</Text>
                </TouchableOpacity>

                <Text className="text-lg font-bold mb-4">Meal Details</Text>
                <Text>Food: {selectedMeal.food}</Text>
                <Text>Calories: {selectedMeal.calories} kcal</Text>
                <Text>Protein: {selectedMeal.protein}g</Text>
                <Text>Fat: {selectedMeal.fat}g</Text>
                <Text>Carbs: {selectedMeal.carbohydrates}g</Text>
                <Text>
                  Logged At:{' '}
                  {selectedMeal.createdAt &&
                    selectedMeal.createdAt.toDate().toLocaleString()}
                </Text>

                <Button
                  title="Delete Meal"
                  onPress={() => handleDeleteMeal(selectedMeal.id)}
                  color="red"
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default DailyMeals
