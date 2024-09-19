import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { db, auth } from '../firebase' // Import Firestore and Auth

const DailyTotals = () => {
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
  })
  const [goals, setGoals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
  })
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation() // Initialize navigation

  const today = new Date().toISOString().split('T')[0]

  useFocusEffect(
    React.useCallback(() => {
      const fetchDailyTotals = async () => {
        const currentUser = auth.currentUser
        if (!currentUser) {
          Alert.alert('Error', 'No user is logged in.')
          return
        }

        const userId = currentUser.uid

        try {
          // Fetch daily totals
          const dailyTotalsRef = db
            .collection('users')
            .doc(userId)
            .collection('dailyTotals')
            .doc(today)
          const dailyDoc = await dailyTotalsRef.get()

          if (dailyDoc.exists) {
            setTotals({
              calories: dailyDoc.data().calories || 0,
              protein: dailyDoc.data().protein || 0,
              fat: dailyDoc.data().fat || 0,
              carbohydrates: dailyDoc.data().carbohydrates || 0,
            })
          } else {
            setTotals({
              calories: 0,
              protein: 0,
              fat: 0,
              carbohydrates: 0,
            })
          }

          // Fetch user goals
          const goalsRef = db
            .collection('users')
            .doc(userId)
            .collection('goals')
            .doc('nutrition')
          const goalsDoc = await goalsRef.get()

          if (goalsDoc.exists) {
            setGoals({
              calories: goalsDoc.data().calories || 0,
              protein: goalsDoc.data().protein || 0,
              fat: goalsDoc.data().fat || 0,
              carbohydrates: goalsDoc.data().carbohydrates || 0,
            })
          } else {
            Alert.alert(
              'Error',
              'No goals set. Please set your nutrition goals.'
            )
          }
        } catch (error) {
          console.error(error)
          Alert.alert('Error', 'Failed to fetch daily totals or goals.')
        } finally {
          setLoading(false)
        }
      }

      fetchDailyTotals()
    }, [])
  )

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  // Calculate the remaining macronutrients
  const remainingCalories = goals.calories - totals.calories
  const remainingProtein = goals.protein - totals.protein
  const remainingFat = goals.fat - totals.fat
  const remainingCarbs = goals.carbohydrates - totals.carbohydrates

  return (
    <View className="p-4">
      {/* Total Calories Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('GoalPage')} // Navigate to GoalPage
        className="bg-green-500 p-4 mb-4 rounded-lg"
      >
        <Text className="text-white text-lg font-bold text-center">
          Calories Left: {remainingCalories}
        </Text>
      </TouchableOpacity>

      {/* Macronutrient Boxes */}
      <View className="flex-row justify-between">
        <View className="bg-red-500 p-4 w-1/3 mr-2 rounded-lg">
          <Text className="text-white font-bold text-center">Protein Left</Text>
          <Text className="text-white text-center">{remainingProtein} g</Text>
        </View>

        <View className="bg-blue-500 p-4 w-1/3 mr-2 rounded-lg">
          <Text className="text-white font-bold text-center">Fat Left</Text>
          <Text className="text-white text-center">{remainingFat} g</Text>
        </View>

        <View className="bg-yellow-500 p-4 w-1/3 rounded-lg">
          <Text className="text-white font-bold text-center">Carbs Left</Text>
          <Text className="text-white text-center">{remainingCarbs} g</Text>
        </View>
      </View>
    </View>
  )
}

export default DailyTotals
