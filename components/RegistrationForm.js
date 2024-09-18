import React, { useState } from 'react'
import { View, TextInput, Button, Text, Alert } from 'react-native'
import { auth, db } from '../firebase' // Assuming you are using Firestore (db) for storing user profiles
import { useNavigation } from '@react-navigation/native'

const RegistrationForm = () => {
  const [name, setName] = useState('') // State for storing the user's name
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigation = useNavigation() // Navigation hook

  const handleRegister = async () => {
    try {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      )
      if (response.user) {
        // Create user profile in Firestore if using Firestore
        await db.collection('users').doc(response.user.uid).set({
          name: name, // Save user's name to Firestore
          email: email,
          createdAt: new Date(),
        })

        Alert.alert('Account Created Successfully!')
        navigation.navigate('MainAppScreen') // Navigate to the main app screen
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <View style={{ padding: 16, justifyContent: 'center', flex: 1 }}>
      {/* Input for Name */}
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      {/* Input for Email */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Input for Password */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
        secureTextEntry
      />

      {/* Display error message if any */}
      {errorMessage ? (
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
      ) : null}

      {/* Register button */}
      <Button title="Register" onPress={handleRegister} />
    </View>
  )
}

export default RegistrationForm
