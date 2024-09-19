import React from 'react'
import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native'

const BottomModal = ({ visible, onClose, onOptionSelect }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-lg p-4">
          <Text className="text-xl font-bold mb-4">Options</Text>

          <Pressable
            className="py-2 border-b border-gray-300"
            onPress={() => onOptionSelect('LogExercise')}
          >
            <Text className="text-lg">Log Exercise</Text>
          </Pressable>

          <Pressable
            className="py-2 border-b border-gray-300"
            onPress={() => onOptionSelect('SavedFoods')}
          >
            <Text className="text-lg">Saved Foods</Text>
          </Pressable>

          <Pressable
            className="py-2 border-b border-gray-300"
            onPress={() => onOptionSelect('DescribeFood')}
          >
            <Text className="text-lg">Describe Food</Text>
          </Pressable>

          <Pressable
            className="py-2"
            onPress={() => onOptionSelect('ScanFood')}
          >
            <Text className="text-lg">Scan Food</Text>
          </Pressable>

          {/* Close Modal Button */}
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 p-2 bg-gray-200 rounded-lg items-center"
          >
            <Text className="text-base text-gray-700">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default BottomModal
