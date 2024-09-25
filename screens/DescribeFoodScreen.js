// DescribeFoodScreen.js

import React, { useState } from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native'
import axios from 'axios'
import { saveMeal } from '../services/mealService' // Adjust the path as necessary
import { useNavigation, useRoute } from '@react-navigation/native' // Import useRoute for accessing params
import { format, isValid, parseISO } from 'date-fns' // Import date-fns functions for validation and formatting

const DescribeFoodScreen = () => {
  const [foodInput, setFoodInput] = useState('')
  const [mealData, setMealData] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation() // Initialize navigation
  const route = useRoute() // Initialize route
  const { selectedDate, onAddMeal } = route.params // Destructure selectedDate and onAddMeal from route params

  const applicationId = 'cba1023b'
  const applicationKey = '17f44a8c25557cac72d221bf88846285'

  // Fetch macros using Edamam API and save the meal
  const fetchAndSaveMacros = async () => {
    if (!foodInput.trim()) {
      Alert.alert('Error', 'Please enter some food items.')
      return
    }

    setLoading(true)
    try {
      // Fetch the macros from Edamam API
      const response = await axios.post(
        `https://api.edamam.com/api/nutrition-details?app_id=${applicationId}&app_key=${applicationKey}`,
        { ingr: [foodInput] }
      )

      // Check if valid data is returned
      if (response.data && response.data.totalNutrients) {
        const { ENERC_KCAL, PROCNT, FAT, CHOCDF } = response.data.totalNutrients

        const meal = {
          calories: ENERC_KCAL ? Math.round(ENERC_KCAL.quantity) : 0,
          protein: PROCNT ? Math.round(PROCNT.quantity) : 0,
          fat: FAT ? Math.round(FAT.quantity) : 0,
          carbohydrates: CHOCDF ? Math.round(CHOCDF.quantity) : 0,
        }

        // Validate selectedDate
        const parsedDate = parseISO(selectedDate)
        if (!isValid(parsedDate)) {
          Alert.alert('Error', 'Selected date is invalid.')
          setLoading(false)
          return
        }

        const formattedDate = format(parsedDate, 'yyyy-MM-dd')

        // Save the meal using the saveMeal function from mealService
        await saveMeal(foodInput, meal, formattedDate)

        // Set the meal data locally if needed to display it
        setMealData(meal)
        Alert.alert('Success', 'Meal added and saved successfully!')

        // Trigger the onAddMeal callback to refresh data in HomeScreen
        if (onAddMeal && typeof onAddMeal === 'function') {
          onAddMeal()
        }

        // Redirect to the HomeScreen after saving the meal
        navigation.navigate('Home')
      } else {
        Alert.alert('Error', 'Could not retrieve macros for the entered food.')
      }
    } catch (error) {
      console.error(error)
      Alert.alert(
        'Error',
        'There was an error retrieving and saving the food data.'
      )
    }
    setLoading(false)
  }

  return (
    <View className="p-4">
      <Text className="text-lg mb-4">Describe your meal:</Text>

      {/* Food Input */}
      <TextInput
        placeholder="Enter foods (e.g., chicken, rice)"
        value={foodInput}
        onChangeText={setFoodInput}
        className="border border-gray-300 p-2 mb-4 rounded"
      />

      {/* Add Food Button (fetches and saves the meal) */}
      <Button
        title={loading ? 'Processing...' : 'Add Food'}
        onPress={fetchAndSaveMacros}
        disabled={loading}
      />

      {/* Display Meal Data (optional) */}
      {mealData && (
        <View className="mt-4">
          <Text>Calories: {mealData.calories}</Text>
          <Text>Protein: {mealData.protein} g</Text>
          <Text>Fat: {mealData.fat} g</Text>
          <Text>Carbohydrates: {mealData.carbohydrates} g</Text>
        </View>
      )}
    </View>
  )
}

export default DescribeFoodScreen
