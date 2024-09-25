// App.js

import React from 'react'
import { SafeAreaView } from 'react-native'
import AppNavigator from './navigation/AppNavigator'
import ErrorBoundary from './components/ErrorBoundry'

const App = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ErrorBoundary>
        <AppNavigator />
      </ErrorBoundary>
    </SafeAreaView>
  )
}

export default App
