// OnboardingScreen.js

import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native'
import { auth, db } from '../firebaseConfig' // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native'

// Import Firebase Modular SDK functions
import { doc, setDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth' // Optional: For auth state management

const OnboardingScreen = () => {
  const [step, setStep] = useState(1)
  const [currentWeight, setCurrentWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [fat, setFat] = useState('')
  const [carbs, setCarbs] = useState('')
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(false)

  const navigation = useNavigation()

  // Optional: Monitor authentication state
  // const [user, loading, error] = useAuthState(auth);

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const calculateMacros = () => {
    const desiredWeight = parseFloat(goalWeight)
    if (!desiredWeight) {
      Alert.alert('Error', 'Please provide a valid goal weight.')
      return
    }

    const calculatedProtein = desiredWeight * 1
    const calculatedCarbs = desiredWeight * 0.7
    const calculatedFat = desiredWeight * 0.8
    const proteinCalories = calculatedProtein * 4
    const carbCalories = calculatedCarbs * 4
    const fatCalories = calculatedFat * 9
    const totalCalories = proteinCalories + carbCalories + fatCalories

    setCalories(totalCalories.toFixed(0))
    setProtein(calculatedProtein.toFixed(0))
    setFat(calculatedFat.toFixed(0))
    setCarbs(calculatedCarbs.toFixed(0))

    nextStep() // Move to the next step after calculation
  }

  const saveGoals = async () => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.')
      return
    }

    try {
      // Reference to the 'nutrition' document in the 'goals' collection
      const nutritionDocRef = doc(
        db,
        'users',
        currentUser.uid,
        'goals',
        'nutrition'
      )

      // Set the goals in Firestore with modular syntax
      await setDoc(nutritionDocRef, {
        calories: parseInt(calories, 10),
        protein: parseInt(protein, 10),
        fat: parseInt(fat, 10),
        carbohydrates: parseInt(carbs, 10),
        createdAt: new Date(), // Consider using serverTimestamp() for consistency
      })

      Alert.alert('Success', 'Goals saved successfully!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainAppTabs' }],
            }),
        },
      ])
    } catch (error) {
      console.error('Error saving goals:', error)
      Alert.alert('Error', 'Failed to save goals.')
    }
  }

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Step 1: Privacy Policy Agreement */}
        {step === 1 && (
          <View className="flex-1 justify-center">
            <Text className="text-2xl font-bold text-center mb-6">
              Privacy Policy
            </Text>
            <TouchableOpacity
              onPress={() => setAgreedToPrivacyPolicy(!agreedToPrivacyPolicy)}
              className="flex-row items-center mb-6"
            >
              <View
                className={`h-6 w-6 mr-3 border border-gray-400 rounded ${
                  agreedToPrivacyPolicy ? 'bg-blue-500' : 'bg-white'
                }`}
              />
              <Text className="text-lg">I agree to the Privacy Policy</Text>
            </TouchableOpacity>
            <Button
              title="Next"
              onPress={nextStep}
              disabled={!agreedToPrivacyPolicy}
              color="#1E90FF"
            />
          </View>
        )}

        {/* Step 2: Enter Current Weight */}
        {step === 2 && (
          <View className="flex-1 justify-center">
            <Text className="text-2xl font-bold text-center mb-6">
              Enter Your Current Weight
            </Text>
            <TextInput
              placeholder="Current Weight (kg)"
              value={currentWeight}
              onChangeText={setCurrentWeight}
              keyboardType="numeric"
              className="border border-gray-300 p-3 mb-4 rounded-lg"
            />
            <View className="flex-row justify-between">
              <Button title="Back" onPress={prevStep} color="#A9A9A9" />
              <Button
                title="Next"
                onPress={nextStep}
                disabled={currentWeight.trim() === ''}
                color="#1E90FF"
              />
            </View>
          </View>
        )}

        {/* Step 3: Enter Goal Weight */}
        {step === 3 && (
          <View className="flex-1 justify-center">
            <Text className="text-2xl font-bold text-center mb-6">
              Enter Your Goal Weight
            </Text>
            <TextInput
              placeholder="Goal Weight (kg)"
              value={goalWeight}
              onChangeText={setGoalWeight}
              keyboardType="numeric"
              className="border border-gray-300 p-3 mb-4 rounded-lg"
            />
            <View className="flex-row justify-between">
              <Button title="Back" onPress={prevStep} color="#A9A9A9" />
              <Button
                title="Calculate Macros"
                onPress={calculateMacros}
                disabled={goalWeight.trim() === ''}
                color="#32CD32"
              />
            </View>
          </View>
        )}

        {/* Step 4: Display Calculated Macros and Save */}
        {step === 4 && (
          <View className="flex-1 justify-center">
            <Text className="text-2xl font-bold text-center mb-6">
              Your Calculated Macros
            </Text>
            <View className="mb-4">
              <Text className="text-lg">Calories: {calories}</Text>
              <Text className="text-lg">Protein: {protein}g</Text>
              <Text className="text-lg">Fat: {fat}g</Text>
              <Text className="text-lg">Carbohydrates: {carbs}g</Text>
            </View>
            <Button title="Save Goals" onPress={saveGoals} color="#32CD32" />
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default OnboardingScreen
