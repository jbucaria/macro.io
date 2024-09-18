import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LoginForm from '../components/LoginForm'
import RegistrationForm from '../components/RegistrationForm'
import MainAppTabs from './MainAppTabs' // Import your Tab Navigator
import { auth } from '../firebase' // Firebase Authentication

const Stack = createStackNavigator()

const AppNavigator = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Firebase Auth listener to check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
      setLoading(false) // Set loading to false once the user state is determined
    })
    return unsubscribe // Unsubscribe from the listener when component unmounts
  }, [])

  if (loading) {
    return null // Placeholder for loading state (could be an ActivityIndicator)
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // If the user is logged in, navigate to the MainAppTabs
          <Stack.Screen
            name="MainAppTabs"
            component={MainAppTabs} // Register MainAppTabs in Stack Navigator
            options={{ headerShown: false }} // Hide header in the tab navigation
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginForm}
              options={{ headerShown: false }} // Hide header on login screen
            />
            <Stack.Screen
              name="Register"
              component={RegistrationForm}
              options={{ headerShown: true }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
