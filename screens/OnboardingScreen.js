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

const OnboardingScreen = ({ navigation }) => {
  const [step, setStep] = useState(1)
  const [currentWeight, setCurrentWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [fat, setFat] = useState('')
  const [carbs, setCarbs] = useState('')
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(false)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

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
  }

  const saveGoals = async () => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.')
      return
    }

    try {
      await db
        .collection('users')
        .doc(currentUser.uid)
        .collection('goals')
        .doc('nutrition')
        .set({
          calories: parseInt(calories),
          protein: parseInt(protein),
          fat: parseInt(fat),
          carbohydrates: parseInt(carbs),
        })

      Alert.alert('Success', 'Goals saved successfully!')
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainAppTabs' }],
      })
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to save goals.')
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <ScrollView>
        {step === 1 && (
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              Privacy Policy
            </Text>
            <TouchableOpacity
              onPress={() => setAgreedToPrivacyPolicy(!agreedToPrivacyPolicy)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  height: 24,
                  width: 24,
                  marginRight: 8,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  backgroundColor: agreedToPrivacyPolicy ? '#007bff' : 'white',
                }}
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

        {/* Steps for weight and macro calculations */}

        {/* Last step for saving goals */}
        {step === 4 && (
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              Your Calculated Macros
            </Text>
            <Text>Calories: {calories}</Text>
            <Button title="Save Goals" onPress={saveGoals} color="green" />
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default OnboardingScreen
