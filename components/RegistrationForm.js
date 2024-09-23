import React, { useState } from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { auth, db } from '../firebase' // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native'

// Import Firebase Modular SDK functions
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from 'firebase/auth'

import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const RegistrationForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('') // New state for password confirmation
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // State to toggle confirm password visibility
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(false)
  const navigation = useNavigation()

  // Email validation function using regex
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Simple email format check
    return emailRegex.test(email)
  }

  // Password requirements: at least 8 characters, 1 uppercase, 1 number, 1 special character
  const validatePassword = password => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  }

  const handleRegister = async () => {
    // Reset error message
    setErrorMessage('')

    // Input Validations
    if (name.trim() === '') {
      setErrorMessage('Name is required.')
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        'Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.'
      )
      return
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      if (user) {
        // Update the displayName in Firebase Authentication
        await updateProfile(user, {
          displayName: name.trim(),
        })

        // Reference to the user's document in Firestore
        const userDocRef = doc(db, 'users', user.uid)

        // Set user information in Firestore with server timestamp
        await setDoc(userDocRef, {
          name: name.trim(),
          email: email.trim(),
          createdAt: serverTimestamp(),
          onboardingComplete: false,
        })

        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => {}, // Navigate to the main app screen after registration
          },
        ])
      }
    } catch (error) {
      console.error('Registration Error:', error)
      setErrorMessage(error.message || 'Failed to create account.')
    }
  }
  return (
    <View className="p-4 flex-1 justify-center bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Register</Text>

      {/* Name Input */}
      <View className="mb-4">
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          className="border border-gray-300 p-3 mb-2 rounded-lg"
        />
      </View>

      {/* Email Input */}
      <View className="mb-4">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="border border-gray-300 p-3 mb-2 rounded-lg"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="mb-4">
        <View className="flex-row items-center">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            className="border border-gray-300 p-3 mb-2 rounded-lg flex-1"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="ml-2 text-blue-500">
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password Input */}
      <View className="mb-4">
        <View className="flex-row items-center">
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="border border-gray-300 p-3 mb-2 rounded-lg flex-1"
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Text className="ml-2 text-blue-500">
              {showConfirmPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
          disabled={!agreedToPrivacyPolicy}
          color="#1E90FF"
        />
      </View>

      {/* Error Message */}
      {errorMessage ? (
        <Text className="text-red-500 text-center mb-4">{errorMessage}</Text>
      ) : null}

      {/* Register Button */}
      <Button title="Register" onPress={handleRegister} color="#4CAF50" />
    </View>
  )
}

export default RegistrationForm
