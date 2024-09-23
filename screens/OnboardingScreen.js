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
import { auth, db } from '../firebase' // Firebase config
import { useNavigation } from '@react-navigation/native'
import { doc, setDoc } from 'firebase/firestore' // Firestore methods

const OnboardingScreen = ({ setOnboardingComplete }) => {
  const [step, setStep] = useState(1)
  const [currentWeight, setCurrentWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [fat, setFat] = useState('')
  const [carbs, setCarbs] = useState('')
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(false)

  const navigation = useNavigation()

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const calculateMacros = () => {
    const desiredWeight = parseFloat(goalWeight)
    if (!desiredWeight) {
      Alert.alert('Error', 'Please provide a valid goal weight.')
      return
    }

    // Calculating macros based on the goal weight
    const calculatedProtein = desiredWeight * 1 // 1g protein per kg
    const calculatedCarbs = desiredWeight * 0.7 // 0.7g carbs per kg
    const calculatedFat = desiredWeight * 0.8 // 0.8g fat per kg
    const proteinCalories = calculatedProtein * 4
    const carbCalories = calculatedCarbs * 4
    const fatCalories = calculatedFat * 9
    const totalCalories = proteinCalories + carbCalories + fatCalories

    // Set calculated macros
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
      // Saving nutrition goals in Firestore under the 'goals' collection
      const nutritionDocRef = doc(
        db,
        'users',
        currentUser.uid,
        'goals',
        'nutrition'
      )
      await setDoc(nutritionDocRef, {
        calories: parseInt(calories, 10),
        protein: parseInt(protein, 10),
        fat: parseInt(fat, 10),
        carbohydrates: parseInt(carbs, 10),
        createdAt: new Date(),
      })

      // Mark onboarding as complete
      const userDocRef = doc(db, 'users', currentUser.uid)
      await setDoc(userDocRef, { onboardingComplete: true }, { merge: true })

      Alert.alert('Success', 'Goals saved successfully!', [
        { text: 'OK', onPress: () => setOnboardingComplete(true) },
      ])
    } catch (error) {
      console.error('Error saving goals:', error)
      Alert.alert('Error', 'Failed to save goals.')
    }
  }
  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              title="Next" // Ensure the title is a string
              onPress={nextStep}
              disabled={!agreedToPrivacyPolicy}
              color="#1E90FF"
            />
          </View>
        )}

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
                title="Next" // Ensure the title is a string
                onPress={nextStep}
                disabled={currentWeight.trim() === ''}
                color="#1E90FF"
              />
            </View>
          </View>
        )}

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
                title="Calculate Macros" // Ensure the title is a string
                onPress={calculateMacros}
                disabled={goalWeight.trim() === ''}
                color="#32CD32"
              />
            </View>
          </View>
        )}

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
