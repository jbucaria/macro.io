// components/MacroBox.js

import React from 'react'
import { View, Text } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

const MacroBox = ({ title, amount, color, icon }) => {
  return (
    <View className={`p-4 w-1/2 sm:w-1/4 rounded-lg shadow-md bg-${color}-500`}>
      <View className="flex-row items-center justify-center mb-2">
        <FontAwesome5 name={icon} size={20} color="white" className="mr-2" />
        <Text className="text-white font-bold text-center">{title}</Text>
      </View>
      <Text className="text-white text-center text-xl">{amount}g</Text>
    </View>
  )
}

export default MacroBox
