import React from 'react'
import { View, Button, Alert } from 'react-native'
import { auth } from '../firebase' // Import Firebase auth
import { useNavigation } from '@react-navigation/native'

const SettingsScreen = () => {
  const navigation = useNavigation()

  const handleLogout = async () => {
    try {
      // Log out the user
      await auth.signOut()
      Alert.alert('Logged out successfully')
      // Redirect to the login screen after logout
      navigation.replace('Login') // Replace ensures they can't go back to the previous screen
    } catch (error) {
      console.error('Logout failed:', error)
      Alert.alert('Logout failed')
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  )
}

export default SettingsScreen
