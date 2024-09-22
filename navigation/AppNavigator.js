// AppNavigator.js

import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

// Import your screens and components
import LoginForm from '../components/LoginForm'
import RegistrationForm from '../components/RegistrationForm'
import MainAppTabs from './MainAppTabs'
import LogExerciseScreen from '../screens/LogExerciseScreen'
import SavedFoodsScreen from '../screens/SavedFoodsScreen'
import DescribeFoodScreen from '../screens/DescribeFoodScreen'
import GoalPage from '../screens/GoalPage'

// Import Firebase Auth and necessary functions
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const Stack = createStackNavigator()

const AppNavigator = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Firebase Auth listener to check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)
      setLoading(false) // Set loading to false once the user state is determined
    })
    return unsubscribe // Unsubscribe from the listener when component unmounts
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="MainAppTabs"
              component={MainAppTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LogExercise"
              component={LogExerciseScreen}
              options={{ headerShown: true, title: 'Log Exercise' }}
            />
            <Stack.Screen
              name="SavedFoods"
              component={SavedFoodsScreen}
              options={{ headerShown: true, title: 'Saved Foods' }}
            />
            <Stack.Screen
              name="DescribeFood"
              component={DescribeFoodScreen}
              options={{ headerShown: true, title: 'Describe Food' }}
            />
            <Stack.Screen
              name="GoalPage"
              component={GoalPage}
              options={{ headerShown: true, title: 'Set Nutrition Goals' }}
            />
          </>
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
