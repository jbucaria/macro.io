import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
  ImageBackground, // To add a background image
} from 'react-native'
import { db, auth } from '../firebase' // Firebase services

const LastLoggedMeal = ({ refreshTrigger }) => {
  const [lastMeal, setLastMeal] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Fetch the last logged meal when component mounts or refreshTrigger changes
  useEffect(() => {
    const fetchLastMeal = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        Alert.alert('Error', 'No user is logged in.')
        return
      }

      const userId = currentUser.uid

      try {
        const mealsRef = db
          .collection('users')
          .doc(userId)
          .collection('meals')
          .orderBy('createdAt', 'desc')
          .limit(1)

        const snapshot = await mealsRef.get()
        if (!snapshot.empty) {
          const meal = snapshot.docs[0].data()
          setLastMeal({ id: snapshot.docs[0].id, ...meal })
        }
      } catch (error) {
        console.error(error)
        Alert.alert('Error', 'Failed to fetch the last logged meal.')
      }
    }

    fetchLastMeal()
  }, [refreshTrigger]) // Refresh the last meal when refreshTrigger changes

  const toggleModal = () => setModalVisible(!modalVisible)

  const handleDeleteMeal = async () => {
    const currentUser = auth.currentUser
    if (!currentUser || !lastMeal) {
      Alert.alert('Error', 'No meal or user available.')
      return
    }

    const userId = currentUser.uid
    try {
      await db
        .collection('users')
        .doc(userId)
        .collection('meals')
        .doc(lastMeal.id)
        .delete()
      setLastMeal(null)
      toggleModal()
      Alert.alert('Success', 'Meal deleted successfully.')
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Failed to delete meal.')
    }
  }

  const handleEditMeal = () => {
    Alert.alert('Edit', 'Edit meal functionality can be implemented here.')
  }

  if (!lastMeal) {
    return (
      <View>
        <Text>No recent meal found</Text>
      </View>
    )
  }

  return (
    <View>
      {/* Button to show last meal */}
      <TouchableOpacity
        className="p-4 bg-blue-200 rounded-lg"
        onPress={toggleModal}
      >
        <Text className="text-lg font-bold">Last Logged Meal</Text>
        <Text>{lastMeal.food}</Text>
        <Text>
          {new Date(lastMeal.createdAt.seconds * 1000).toLocaleTimeString()}
        </Text>
        <Text>{`Calories: ${lastMeal.calories}`}</Text>
        <Text>{`Protein: ${lastMeal.protein}`}</Text>
      </TouchableOpacity>

      {/* Expanded Modal with Background Image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View className="flex-1 justify-end  bg-black bg-opacity-50  ">
          {/* <ImageBackground
            source={require('../assets/icon.png')}
            style={{ flex: 1, justifyContent: 'center' }}
            resizeMode="cover"
          > */}
          <View className="bg-white rounded-t-2xl p-6 h-1/2">
            {/* Close Modal Button */}
            <TouchableOpacity
              className="absolute top-4 right-4"
              onPress={toggleModal}
            >
              <Text className="text-xl font-bold">×</Text>
            </TouchableOpacity>

            <Text className="text-lg font-bold mb-4">Last Meal Details</Text>
            <Text>Food: {lastMeal.food}</Text>
            <Text>Calories: {lastMeal.calories}</Text>
            <Text>Protein: {lastMeal.protein}g</Text>
            <Text>Fat: {lastMeal.fat}g</Text>
            <Text>Carbohydrates: {lastMeal.carbohydrates}g</Text>
            <Text>
              Logged At:{' '}
              {new Date(lastMeal.createdAt.seconds * 1000).toLocaleString()}
            </Text>

            <Button title="Edit Meal" onPress={handleEditMeal} />
            <Button
              title="Delete Meal"
              onPress={handleDeleteMeal}
              color="red"
            />
          </View>
          {/* </ImageBackground> */}
        </View>
      </Modal>
    </View>
  )
}

export default LastLoggedMeal
