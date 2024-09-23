import React, { useState, useEffect } from 'react'
import { View, TextInput, Alert, Text, Modal } from 'react-native'
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const SettingsScreen = () => {
  const navigation = useNavigation()
  const auth = getAuth() // Initialize Firebase auth

  // State to hold user data
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  // State for updating info
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Fetch current user data when the component loads
  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setEmail(currentUser.email || '')
      setName(currentUser.displayName || '')
    }
  }, [auth])

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut()
      Alert.alert('Logged out successfully')
      navigation.replace('Login')
    } catch (error) {
      console.error('Logout failed:', error)
      Alert.alert('Logout failed')
    }
  }

  // Function to re-authenticate user
  const reauthenticateUser = async currentPassword => {
    const user = auth.currentUser
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    try {
      await reauthenticateWithCredential(user, credential)
      return true
    } catch (error) {
      Alert.alert('Current password is incorrect:', error.message)
      return false
    }
  }

  // Function to update user info
  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Passwords do not match')
      return
    }

    const reauthenticated = await reauthenticateUser(currentPassword)
    if (!reauthenticated) return

    try {
      const currentUser = auth.currentUser

      if (currentUser) {
        // Update email if it's changed
        if (email !== currentUser.email) {
          await updateEmail(currentUser, email)
        }

        // Update password if provided
        if (newPassword) {
          await updatePassword(currentUser, newPassword)
        }

        // Update profile (display name)
        if (name !== currentUser.displayName) {
          await updateProfile(currentUser, { displayName: name })
        }

        Alert.alert('Profile updated successfully')
        setIsModalVisible(false) // Close modal on success
      }
    } catch (error) {
      console.error('Update failed:', error)
      Alert.alert('Update failed:', error.message)
    }
  }

  // Function to handle password reset
  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email)
      Alert.alert('Password reset link sent to your email')
    } catch (error) {
      Alert.alert('Failed to send password reset email:', error.message)
    }
  }

  return (
    <View className="flex-1 items-center justify-center p-4 bg-gray-100">
      {/* Display User Info */}
      <Text className="text-xl font-semibold mb-4">User Profile</Text>
      <View className="mb-4">
        <Text className="text-lg mb-2">Name: {name}</Text>
        <Text className="text-lg">Email: {email}</Text>
      </View>

      {/* Button to open modal */}
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-lg mb-4"
        onPress={() => setIsModalVisible(true)}
      >
        <Text className="text-white text-lg">Update Info</Text>
      </TouchableOpacity>

      {/* Logout button */}
      <TouchableOpacity
        className="bg-red-500 p-3 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg">Log Out</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity className="mt-4" onPress={handleForgotPassword}>
        <Text className="text-blue-600 underline">Forgot Password?</Text>
      </TouchableOpacity>

      {/* Modal for updating info */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-xl font-semibold mb-4">Update Profile</Text>

            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />

            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-lg"
                onPress={handleUpdate}
              >
                <Text className="text-white text-lg">Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-gray-500 p-3 rounded-lg"
                onPress={() => setIsModalVisible(false)}
              >
                <Text className="text-white text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default SettingsScreen
