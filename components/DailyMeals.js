import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  ScrollView,
} from 'react-native'
import { db, auth } from '../firebase'
import { useFocusEffect } from '@react-navigation/native'

const DailyMeals = () => {
  const [meals, setMeals] = useState([]) // Store all meals for the day
  const [selectedMeal, setSelectedMeal] = useState(null) // Store the selected meal for the modal
  const [modalVisible, setModalVisible] = useState(false)

  const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

  useFocusEffect(
    React.useCallback(() => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return
      }

      const userId = currentUser.uid
      const mealsRef = db
        .collection('users')
        .doc(userId)
        .collection('meals')
        .where('createdAt', '>=', new Date(today)) // Fetch meals logged today
        .orderBy('createdAt', 'desc')

      // Set up the Firestore real-time listener
      const unsubscribe = mealsRef.onSnapshot(
        snapshot => {
          const mealsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          setMeals(mealsData)
        },
        error => {
          console.error('Error fetching real-time meals:', error)
        }
      )

      return () => unsubscribe() // Clean up the listener when the component is unmounted
    }, [today])
  )

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
      await db
        .collection('users')
        .doc(userId)
        .collection('meals')
        .doc(mealId)
        .delete()
      setMeals(meals.filter(meal => meal.id !== mealId)) // Remove the deleted meal from the state
      toggleModal()
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  }

  return (
    <ScrollView className="p-4">
      <Text className="text-lg font-bold mb-4">Today's Meals</Text>

      {/* Render all meals for the day */}
      {meals.map(meal => (
        <TouchableOpacity
          key={meal.id}
          onPress={() => toggleModal(meal)} // Open modal with meal details
          className="bg-white p-4 mb-4 rounded-lg shadow-md"
        >
          <Text>Food: {meal.food}</Text>
          <Text>Calories: {meal.calories} kcal</Text>
          <Text>Protein: {meal.protein}g</Text>
          <Text>Fat: {meal.fat}g</Text>
          <Text>Carbs: {meal.carbohydrates}g</Text>
          <Text>
            Logged At:{' '}
            {new Date(meal.createdAt.seconds * 1000).toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Modal for viewing, editing, or deleting a meal */}
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
                  {new Date(
                    selectedMeal.createdAt.seconds * 1000
                  ).toLocaleString()}
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
