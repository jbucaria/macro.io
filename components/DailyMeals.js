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
import { format, startOfDay, endOfDay, addHours } from 'date-fns'

const DailyMeals = ({ selectedDate }) => {
  const [meals, setMeals] = useState([]) // Store all meals for the selected date
  const [selectedMeal, setSelectedMeal] = useState(null) // Store the selected meal for the modal
  const [modalVisible, setModalVisible] = useState(false)
  console.log('selected:', selectedDate)
  // Convert selectedDate to a Date object
  const localDate = new Date(selectedDate)
  console.log('local:', localDate)

  // Convert to UTC to handle timezone differences
  const startOfDayUTC = addHours(startOfDay(localDate), 0) // Normalize to UTC start of day
  console.log(startOfDay)
  const endOfDayUTC = addHours(endOfDay(localDate), 0) // Normalize to UTC end of day

  useEffect(() => {
    const fetchMeals = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return
      }

      const userId = currentUser.uid
      const mealsRef = db
        .collection('users')
        .doc(userId)
        .collection('meals')
        .where('createdAt', '>=', startOfDayUTC)
        .where('createdAt', '<=', endOfDayUTC)
        .orderBy('createdAt', 'desc')

      try {
        const snapshot = await mealsRef.get()
        const mealsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setMeals(mealsData)
      } catch (error) {
        console.error('Error fetching meals:', error)
      }
    }

    fetchMeals()
  }, [selectedDate]) // Re-fetch meals when selectedDate changes

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
      {/* <Text className="text-lg font-bold mb-4">
        Meals on {format(localDate, 'MMM dd, yyyy')}
      </Text> */}

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
            {meal.createdAt &&
              format(
                new Date(meal.createdAt.seconds * 1000),
                'MMM dd, yyyy h:mm a'
              )}
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
                    format(
                      new Date(selectedMeal.createdAt.seconds * 1000),
                      'MMM dd, yyyy h:mm a'
                    )}
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
