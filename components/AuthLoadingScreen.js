import React, { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { auth } from './firebase'

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('MainAppScreen') // Navigate if the user is logged in
      } else {
        navigation.navigate('Login') // Navigate to login if not logged in
      }
    })

    return () => unsubscribe() // Cleanup subscription on unmount
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default AuthLoadingScreen
