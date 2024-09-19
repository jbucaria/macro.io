import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { Ionicons } from '@expo/vector-icons' // For the 'X' icon

const ScanFoodCamera = ({ visible, onClose, onOptionSelect }) => {
  const [cameraRef, setCameraRef] = useState(null)

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        {/* Close Button */}
        <View className="absolute top-10 right-4 z-10">
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <RNCamera
          ref={ref => setCameraRef(ref)}
          style={{ flex: 1 }}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={false}
        >
          {/* Bottom Options */}
          <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex-row justify-around border border-red-600 h-1/5 items-center">
            <TouchableOpacity
              onPress={() => onOptionSelect('ScanFood')}
              className="flex-1 items-center"
            >
              <Text className="text-white text-center">Scan Food</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onOptionSelect('Barcode')}
              className="flex-1 items-center"
            >
              <Text className="text-white text-center">Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onOptionSelect('FoodLabel')}
              className="flex-1 items-center"
            >
              <Text className="text-white text-center">Food Label</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onOptionSelect('Gallery')}
              className="flex-1 items-center"
            >
              <Text className="text-white text-center">Gallery</Text>
            </TouchableOpacity>
          </View>
        </RNCamera>
      </View>
    </Modal>
  )
}

export default ScanFoodCamera
