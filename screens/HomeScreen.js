import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons' // Icon library for the plus symbol
import { useNavigation } from '@react-navigation/native'
import BottomModal from '../components/BottomModal' // Import the modal component
import ScanFoodCamera from '../components/ScanFoodCamera' // Import the camera component
import DailyTotals from '../components/DailyTotals' // Import the DailyTotals component

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [cameraVisible, setCameraVisible] = useState(false)
  const navigation = useNavigation()

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const toggleCamera = () => {
    setCameraVisible(!cameraVisible)
  }

  const handleOptionSelect = option => {
    toggleModal()
    if (option === 'LogExercise') {
      navigation.navigate('LogExercise')
    } else if (option === 'SavedFoods') {
      navigation.navigate('SavedFoods')
    } else if (option === 'DescribeFood') {
      navigation.navigate('DescribeFood')
    } else if (option === 'ScanFood') {
      toggleCamera()
    }
  }

  const handlePhotoCapture = uri => {
    console.log('Photo captured:', uri)
    toggleCamera()
  }

  return (
    <View className="flex-1 bg-white p-4">
      {/* Daily Totals Component */}
      <DailyTotals />

      <TouchableOpacity
        onPress={toggleModal}
        className="absolute bottom-10 right-10 bg-blue-500 p-4 rounded-full"
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Bottom Modal Component */}
      <BottomModal
        visible={modalVisible}
        onClose={toggleModal}
        onOptionSelect={handleOptionSelect}
      />

      {/* Scan Food Camera Modal */}
      <ScanFoodCamera
        visible={cameraVisible}
        onClose={toggleCamera}
        onCapture={handlePhotoCapture}
      />
    </View>
  )
}

export default HomeScreen
