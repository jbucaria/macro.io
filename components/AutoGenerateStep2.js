import React from 'react'
import { View, Text, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker'

const AutoGenerateStep2 = ({
  height,
  setHeight,
  weight,
  setWeight,
  nextStep,
  prevStep,
}) => {
  return (
    <View>
      <Text className="text-xl font-bold mb-4 text-center">
        Select your height and weight
      </Text>
      <View className="flex-row justify-between mb-4">
        <View className="w-1/2 pr-2">
          <Text className="text-lg mb-2">Height (cm)</Text>
          <Picker selectedValue={height} onValueChange={setHeight}>
            {[...Array(81)].map((_, i) => (
              <Picker.Item key={i} label={`${140 + i}`} value={`${140 + i}`} />
            ))}
          </Picker>
        </View>
        <View className="w-1/2 pl-2">
          <Text className="text-lg mb-2">Weight (kg)</Text>
          <Picker selectedValue={weight} onValueChange={setWeight}>
            {[...Array(121)].map((_, i) => (
              <Picker.Item key={i} label={`${40 + i}`} value={`${40 + i}`} />
            ))}
          </Picker>
        </View>
      </View>
      <Button title="Previous" onPress={prevStep} color="gray" />
      <Button title="Next" onPress={nextStep} color="blue" />
    </View>
  )
}

export default AutoGenerateStep2
