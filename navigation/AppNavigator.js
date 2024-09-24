import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { auth, db } from '../firebase' // Import Firebase config
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore' // Firestore methods

// Import your screens and components
import LoginForm from '../components/LoginForm'
import RegistrationForm from '../components/RegistrationForm'
import MainAppTabs from './MainAppTabs'
import OnboardingScreen from '../screens/OnboardingScreen'
import GoalPage from '../screens/GoalPage'
import DescribeFoodScreen from '../screens/DescribeFoodScreen'

const Stack = createStackNavigator()

const AppNavigator = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onboardingComplete, setOnboardingComplete] = useState(false) // Onboarding state

  // Check Firebase Auth state and onboarding completion status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user)
      if (user) {
        // Fetch onboarding status from Firestore
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const data = userDoc.data()
          setOnboardingComplete(data.onboardingComplete || false) // Default to false if undefined
        }
      }
      setLoading(false)
    })
    return unsubscribe // Unsubscribe from listener when component unmounts
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
          !onboardingComplete ? (
            <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
              {props => (
                <OnboardingScreen
                  {...props}
                  setOnboardingComplete={setOnboardingComplete} // Pass function to update onboarding state
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen
                name="MainAppTabs"
                component={MainAppTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="GoalPage"
                component={GoalPage} // Add GoalPage to the navigator
                options={{ headerShown: true, title: 'Set Nutrition Goals' }} // Optionally set header and title
              />
              <Stack.Screen
                name="DescribeFood"
                component={DescribeFoodScreen} // Add GoalPage to the navigator
                options={{ headerShown: true, title: 'Describe Meals' }} // Optionally set header and title
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
