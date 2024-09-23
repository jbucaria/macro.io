import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'
import AnalyticsScreen from '../screens/AnalyticsScreen'
// import OnboardingScreen from '../screens/OnboardingScreen'
const Tab = createBottomTabNavigator()

const MainAppTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      {/* <Tab.Screen name="Onboard" component={OnboardingScreen} /> */}
    </Tab.Navigator>
  )
}

export default MainAppTabs
