import React from 'react'
import { View, Button } from 'react-native'

const GoalActionButtons = ({ saveGoals, openAutoGenerate }) => {
  return (
    <View>
      <Button title="Save Goals" onPress={saveGoals} color="green" />
      <View className="mt-4">
        <Button
          title="Auto Generate Goals"
          onPress={openAutoGenerate}
          color="blue"
        />
      </View>
    </View>
  )
}

export default GoalActionButtons
