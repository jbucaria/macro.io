import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { db, auth } from '../firebase'
import { doc, getDoc, onSnapshot } from 'firebase/firestore' // Make sure getDoc is imported

const DailyTotals = ({ selectedDate }) => {
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
  const navigation = useNavigation()

  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error('No user logged in.')
      setLoading(false)
      return
    }

    const userId = currentUser.uid

    const dailyTotalsRef = doc(db, 'users', userId, 'dailyTotals', selectedDate)

    const unsubscribe = onSnapshot(dailyTotalsRef, doc => {
      if (doc.exists()) {
        const data = doc.data()
        setTotals({
          calories: data.calories || 0,
          protein: data.protein || 0,
          fat: data.fat || 0,
          carbohydrates: data.carbohydrates || 0,
        })
      } else {
        setTotals({
          calories: 0,
          protein: 0,
          fat: 0,
          carbohydrates: 0,
        })
      }
      setLoading(false)
    })

    return () => {
      unsubscribe() // Clean up listener on unmount
    }
  }, [selectedDate])

  useEffect(() => {
    const fetchGoals = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.error('No user logged in.')
        setLoading(false)
        return
      }

      const userId = currentUser.uid
      try {
        const goalsRef = doc(db, 'users', userId, 'goals', 'nutrition')
        const goalsDoc = await getDoc(goalsRef) // Correct usage of getDoc

        if (goalsDoc.exists()) {
          const data = goalsDoc.data()
          setGoals({
            calories: data.calories || 0,
            protein: data.protein || 0,
            fat: data.fat || 0,
            carbohydrates: data.carbohydrates || 0,
          })
        } else {
          Alert.alert('Error', 'No goals set. Please set your nutrition goals.')
        }
      } catch (error) {
        console.error(error)
        Alert.alert('Error', 'Failed to fetch nutrition goals.')
      }
    }

    fetchGoals()
  }, [])

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  const remainingCalories = goals.calories - totals.calories
  const remainingProtein = goals.protein - totals.protein
  const remainingFat = goals.fat - totals.fat
  const remainingCarbs = goals.carbohydrates - totals.carbohydrates

  return (
    <View className="p-4">
      <TouchableOpacity
        onPress={() => navigation.navigate('GoalPage')}
        className="bg-green-500 p-4 mb-4 rounded-lg"
      >
        <Text className="text-white text-lg font-bold text-center">
          Calories Left: {remainingCalories}
        </Text>
      </TouchableOpacity>

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
