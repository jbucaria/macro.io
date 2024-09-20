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
import { db, auth } from '../firebase'
import { format } from 'date-fns'

const OnboardingScreen = ({ navigation }) => {
  const [step, setStep] = useState(1)

  // States for user inputs
  const [currentWeight, setCurrentWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')

  // States for calculated macros
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [fat, setFat] = useState('')
  const [carbs, setCarbs] = useState('')

  // Privacy Policy Agreement
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(false)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  // Macro calculation logic
  const calculateMacros = () => {
    const desiredWeight = parseFloat(goalWeight)

    if (!desiredWeight) {
      Alert.alert('Error', 'Please provide a valid goal weight.')
      return
    }

    const calculatedProtein = desiredWeight * 1 // 1g protein per lb of desired weight
    const calculatedCarbs = desiredWeight * 0.7 // 0.7g carbs per lb of desired weight
    const calculatedFat = desiredWeight * 0.8 // 0.8g fat per lb of desired weight

    const proteinCalories = calculatedProtein * 4
    const carbCalories = calculatedCarbs * 4
    const fatCalories = calculatedFat * 9

    const totalCalories = proteinCalories + carbCalories + fatCalories

    // Update state with calculated values
    setCalories(totalCalories.toFixed(0))
    setProtein(calculatedProtein.toFixed(0))
    setFat(calculatedFat.toFixed(0))
    setCarbs(calculatedCarbs.toFixed(0))
  }

  // Save goals to Firestore
  const saveGoals = async () => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.')
      return
    }

    const userId = currentUser.uid

    try {
      await db
        .collection('users')
        .doc(userId)
        .collection('goals')
        .doc('nutrition')
        .set({
          calories: parseInt(calories),
          protein: parseInt(protein),
          fat: parseInt(fat),
          carbohydrates: parseInt(carbs),
        })

      Alert.alert('Success', 'Goals saved successfully!')
      // Navigate to HomeScreen
      navigation.replace('Home')
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to save goals.')
    }
  }

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView>
        {/* Step 1: Privacy Policy Agreement */}
        {step === 1 && (
          <View>
            <Text className="text-2xl font-bold text-center mb-6">
              Privacy Policy
            </Text>
            <Text className="mb-4">
              {/* Placeholder Privacy Policy Text */}
              This is a placeholder for your privacy policy. Please read and
              agree to continue.
            </Text>
            <TouchableOpacity
              onPress={() => setAgreedToPrivacyPolicy(!agreedToPrivacyPolicy)}
              className="flex-row items-center mb-4"
            >
              <View
                className={`h-6 w-6 mr-2 rounded border ${
                  agreedToPrivacyPolicy ? 'bg-blue-500' : 'bg-white'
                }`}
              />
              <Text>I agree to the Privacy Policy</Text>
            </TouchableOpacity>
            <Button
              title="Next"
              onPress={nextStep}
              disabled={!agreedToPrivacyPolicy}
              color="blue"
            />
          </View>
        )}

        {/* Step 2: Current Weight */}
        {step === 2 && (
          <View>
            <Text className="text-2xl font-bold text-center mb-6">
              Enter Your Current Weight (lbs)
            </Text>
            <TextInput
              placeholder="Current Weight"
              value={currentWeight}
              onChangeText={setCurrentWeight}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4"
            />
            <View className="flex-row justify-between">
              <Button title="Back" onPress={prevStep} color="gray" />
              <Button
                title="Next"
                onPress={nextStep}
                disabled={!currentWeight}
                color="blue"
              />
            </View>
          </View>
        )}

        {/* Step 3: Goal Weight */}
        {step === 3 && (
          <View>
            <Text className="text-2xl font-bold text-center mb-6">
              Enter Your Goal Weight (lbs)
            </Text>
            <TextInput
              placeholder="Goal Weight"
              value={goalWeight}
              onChangeText={setGoalWeight}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4"
            />
            <View className="flex-row justify-between">
              <Button title="Back" onPress={prevStep} color="gray" />
              <Button
                title="Next"
                onPress={() => {
                  calculateMacros()
                  nextStep()
                }}
                disabled={!goalWeight}
                color="blue"
              />
            </View>
          </View>
        )}

        {/* Step 4: Display Calculated Macros */}
        {step === 4 && (
          <View>
            <Text className="text-2xl font-bold text-center mb-6">
              Your Calculated Macros
            </Text>
            <Text className="text-lg mb-2">Calories: {calories}</Text>
            <Text className="text-lg mb-2">Protein: {protein}g</Text>
            <Text className="text-lg mb-2">Fat: {fat}g</Text>
            <Text className="text-lg mb-2">Carbohydrates: {carbs}g</Text>
            <Text className="mb-4">
              You can adjust these values if you like.
            </Text>
            {/* Allow user to adjust macros */}
            <TextInput
              placeholder="Calories"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg mb-2"
            />
            <TextInput
              placeholder="Protein (g)"
              value={protein}
              onChangeText={setProtein}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg mb-2"
            />
            <TextInput
              placeholder="Fat (g)"
              value={fat}
              onChangeText={setFat}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg mb-2"
            />
            <TextInput
              placeholder="Carbohydrates (g)"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4"
            />
            <View className="flex-row justify-between">
              <Button title="Back" onPress={prevStep} color="gray" />
              <Button title="Save Goals" onPress={saveGoals} color="green" />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default OnboardingScreen
