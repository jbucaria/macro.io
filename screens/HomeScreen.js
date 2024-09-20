import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import BottomModal from '../components/BottomModal'
import ScanFoodCamera from '../components/ScanFoodCamera'
import DailyTotals from '../components/DailyTotals'
import LastLoggedMeal from '../components/LastLoggedMeal'
import DailyMeals from '../components/DailyMeals'

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [cameraVisible, setCameraVisible] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0) // Trigger for refreshing last meal
  const navigation = useNavigation()

  const toggleModal = () => setModalVisible(!modalVisible)

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
      navigation.navigate('DescribeFood', {
        onAddMeal: () => setRefreshTrigger(prev => prev + 1), // Refresh trigger
      })
    } else if (option === 'ScanFood') {
      toggleCamera()
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Daily Totals Component */}
      <DailyTotals />

      <View className="flex-1 bg-white">
        <DailyMeals />
      </View>

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
        onCapture={uri => console.log('Photo captured:', uri)}
      />
    </View>
  )
}

export default HomeScreen
