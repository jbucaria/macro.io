import React from 'react'
import { View, Text, TextInput, Button } from 'react-native'

const AutoGenerateStep4 = ({
  currentWeight,
  setCurrentWeight,
  goalWeight,
  setGoalWeight,
  generateMacros,
  prevStep,
}) => {
  return (
    <View>
      <Text className="text-xl font-bold mb-4 text-center">
        Enter your current weight (kg)
      </Text>
      <TextInput
        placeholder="Current weight"
        value={currentWeight}
        onChangeText={setCurrentWeight}
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4"
      />

      <Text className="text-xl font-bold mb-4 text-center">
        Enter your goal weight (kg)
      </Text>
      <TextInput
        placeholder="Goal weight"
        value={goalWeight}
        onChangeText={setGoalWeight}
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4"
      />

      <View className="flex-row justify-between mt-4">
        <Button title="Previous" onPress={prevStep} color="gray" />
        <Button
          title="Generate Goals"
          onPress={generateMacros}
          disabled={!goalWeight || !currentWeight}
          color="green"
        />
      </View>
    </View>
  )
}

export default AutoGenerateStep4
