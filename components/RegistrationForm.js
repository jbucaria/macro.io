import React, { useState } from 'react'
import { View, TextInput, Button, Text, Alert } from 'react-native'
import { auth, db } from '../firebase' // Firebase authentication and Firestore
import { useNavigation } from '@react-navigation/native'

const RegistrationForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
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

    try {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      )
      if (response.user) {
        // Store user information in Firestore
        await db.collection('users').doc(response.user.uid).set({
          name: name,
          email: email,
          createdAt: new Date(),
        })
        Alert.alert('Account created successfully!')
        navigation.navigate('MainAppTabs') // Navigate to the main app screen after registration
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <View className="p-4 flex-1 justify-center">
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 p-2 mb-3 rounded"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 p-2 mb-3 rounded"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 p-2 mb-3 rounded"
        secureTextEntry
      />
      {errorMessage ? (
        <Text className="text-red-500">{errorMessage}</Text>
      ) : null}
      <Button title="Register" onPress={handleRegister} />
    </View>
  )
}

export default RegistrationForm
