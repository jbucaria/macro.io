import React from 'react'
import { View, Text, Button } from 'react-native'

const AutoGenerateStep1 = ({
  workoutFrequency,
  setWorkoutFrequency,
  nextStep,
}) => {
  return (
    <View>
      <Text className="text-xl font-bold mb-4 text-center">
        How many times a week do you work out?
      </Text>
      <Button
        title="1-2 times"
        onPress={() => setWorkoutFrequency('1-2')}
        color={workoutFrequency === '1-2' ? 'green' : 'gray'}
      />
      <Button
        title="3-5 times"
        onPress={() => setWorkoutFrequency('3-5')}
        color={workoutFrequency === '3-5' ? 'green' : 'gray'}
      />
      <Button
        title="6-7 times"
        onPress={() => setWorkoutFrequency('6-7')}
        color={workoutFrequency === '6-7' ? 'green' : 'gray'}
      />
      <Button
        title="Next"
        onPress={nextStep}
        disabled={!workoutFrequency}
        color="blue"
      />
    </View>
  )
}

export default AutoGenerateStep1
