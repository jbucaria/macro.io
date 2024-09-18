import React, { useState } from 'react'
import { View, TextInput, Button, Text, Alert } from 'react-native'
import { auth } from '../firebase' // Firebase authentication
import { useNavigation } from '@react-navigation/native' // For navigation

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigation = useNavigation() // Use navigation for navigating between screens

  const handleLogin = async () => {
    try {
      const response = await auth.signInWithEmailAndPassword(email, password)
      if (response.user) {
        Alert.alert('Login Successful')
        navigation.navigate('MainAppTabs') // Navigate to the Tab Navigator (MainAppTabs)
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <View style={{ padding: 16, justifyContent: 'center', flex: 1 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
        secureTextEntry
      />
      {errorMessage ? (
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
      ) : null}
      <Button title="Login" onPress={handleLogin} />

      {/* Register button to navigate to RegistrationForm */}
      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  )
}

export default LoginForm
