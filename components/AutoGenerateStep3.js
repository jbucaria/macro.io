import React from 'react'
import { View, Text, Button } from 'react-native'

const AutoGenerateStep3 = ({ goalType, setGoalType, nextStep, prevStep }) => {
  return (
    <View>
      <Text className="text-xl font-bold mb-4 text-center">
        What is your goal?
      </Text>
      <Button
        title="Lose Weight"
        onPress={() => setGoalType('lose')}
        color={goalType === 'lose' ? 'green' : 'gray'}
      />
      <Button
        title="Maintain Weight"
        onPress={() => setGoalType('maintain')}
        color={goalType === 'maintain' ? 'green' : 'gray'}
      />
      <Button
        title="Gain Weight"
        onPress={() => setGoalType('gain')}
        color={goalType === 'gain' ? 'green' : 'gray'}
      />
      <View className="flex-row justify-between mt-4">
        <Button title="Previous" onPress={prevStep} color="gray" />
        <Button
          title="Next"
          onPress={nextStep}
          disabled={!goalType}
          color="blue"
        />
      </View>
    </View>
  )
}

export default AutoGenerateStep3
