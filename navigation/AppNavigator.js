import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LoginForm from '../components/LoginForm'
import RegistrationForm from '../components/RegistrationForm'
import MainAppTabs from './MainAppTabs' // Import your Tab Navigator
import LogExerciseScreen from '../screens/LogExerciseScreen' // Placeholder for Log Exercise
import SavedFoodsScreen from '../screens/SavedFoodsScreen' // Placeholder for Saved Foods
import DescribeFoodScreen from '../screens/DescribeFoodScreen' // Placeholder for Describe Food
import GoalPage from '../screens/GoalPage' // Import GoalPage for setting goals
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
          <>
            {/* Main App Tabs */}
            <Stack.Screen
              name="MainAppTabs"
              component={MainAppTabs}
              options={{ headerShown: false }} // Hide header in the tab navigation
            />
            {/* Additional Routes */}
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
              options={{ headerShown: true, title: 'Set Nutrition Goals' }} // Add the GoalPage route
            />
          </>
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
