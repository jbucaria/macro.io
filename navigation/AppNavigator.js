import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { auth } from '../firebase' // Firebase configuration
import { onAuthStateChanged } from 'firebase/auth'

// Screens
import LoginForm from '../components/LoginForm'
import RegistrationForm from '../components/RegistrationForm'
import MainAppTabs from './MainAppTabs'
import OnboardingScreen from '../screens/OnboardingScreen'

const Stack = createStackNavigator()

const AppNavigator = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          !onboardingComplete ? (
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: true, title: 'Set Your Nutrition Goals' }}
            />
          ) : (
            <>
              <Stack.Screen
                name="MainAppTabs"
                component={MainAppTabs}
                options={{ headerShown: false }}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginForm}
              options={{ headerShown: false }}
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
