import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import BottomModal from '../components/BottomModal'
import ScanFoodCamera from '../components/ScanFoodCamera'
import DailyTotals from '../components/DailyTotals'
import DailyMeals from '../components/DailyMeals'
import DateCarousel from '../components/DateCarousel'
import { format } from 'date-fns'
import { Camera } from 'react-native-vision-camera' // Import Vision Camera

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [modalVisible, setModalVisible] = useState(false)
  const [cameraVisible, setCameraVisible] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0) // Trigger for refreshing last meal
  const navigation = useNavigation()

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission()
      if (cameraPermission === 'denied') {
        console.error('Camera permission denied.')
      }
    }

    requestPermissions()
  }, [])

  const toggleModal = () => setModalVisible(!modalVisible)

  const toggleCamera = () => {
    setCameraVisible(!cameraVisible)
    console.log('camera visibility:', cameraVisible)
  }

  const handleOptionSelect = option => {
    toggleModal()
    if (option === 'LogExercise') {
      navigation.navigate('LogExercise')
    } else if (option === 'SavedFoods') {
      navigation.navigate('SavedFoods')
    } else if (option === 'DescribeFood') {
      navigation.navigate('DescribeFood', {
        selectedDate,
        onAddMeal: () => setRefreshTrigger(prev => prev + 1), // Refresh trigger
      })
    } else if (option === 'ScanFood') {
      toggleCamera()
    }
  }

  return (
    <View className="flex-1 bg-white">
      <DateCarousel
        onDateSelect={date => {
          setSelectedDate(date)
        }}
        selectedDate={selectedDate}
      />
      <DailyTotals selectedDate={selectedDate} />
      <DailyMeals selectedDate={selectedDate} />
      <View className="flex-1 bg-white">
        <DailyMeals />
      </View>
      <TouchableOpacity
        onPress={toggleModal}
        className="absolute bottom-10 right-10 bg-blue-500 p-4 rounded-full"
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <BottomModal
        visible={modalVisible}
        onClose={toggleModal}
        onOptionSelect={handleOptionSelect}
      />
      <ScanFoodCamera
        visible={cameraVisible}
        onClose={toggleCamera}
        onCapture={uri => console.log('Photo captured:', uri)}
      />
    </View>
  )
}

export default HomeScreen
