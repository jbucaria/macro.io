import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native' // For additional styling if needed

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error Boundary Caught an error:', error, errorInfo)
    this.setState({ errorInfo })
    // Optionally, send the error to an external service like Sentry
  }

  handleReload = () => {
    // Reset the state to try rendering again
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <View className="flex-1 justify-center items-center bg-white p-4">
          <Text className="text-2xl font-bold text-red-600 mb-4">Oops!</Text>
          <Text className="text-lg text-gray-700 mb-6">
            Something went wrong.
          </Text>
          <Text className="text-sm text-gray-500 mb-6">
            {this.state.error && this.state.error.toString()}
          </Text>
          <TouchableOpacity
            onPress={this.handleReload}
            className="bg-blue-500 px-6 py-3 rounded-lg"
            accessibilityLabel="Retry"
            accessibilityRole="button"
          >
            <Text className="text-white text-lg">Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
