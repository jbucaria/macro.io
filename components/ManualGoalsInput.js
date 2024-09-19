import React from 'react'
import { View, Text, TextInput } from 'react-native'

const ManualGoalsInput = ({
  calories,
  protein,
  fat,
  carbs,
  setCalories,
  setProtein,
  setFat,
  setCarbs,
}) => {
  return (
    <View>
      <View className="mb-4">
        <Text className="text-lg mb-2">Calorie Goal</Text>
        <TextInput
          placeholder="Calories"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg mb-2">Protein Goal (g)</Text>
        <TextInput
          placeholder="Protein (g)"
          value={protein}
          onChangeText={setProtein}
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg mb-2">Fat Goal (g)</Text>
        <TextInput
          placeholder="Fat (g)"
          value={fat}
          onChangeText={setFat}
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
        />
      </View>

      <View className="mb-6">
        <Text className="text-lg mb-2">Carbohydrates Goal (g)</Text>
        <TextInput
          placeholder="Carbohydrates (g)"
          value={carbs}
          onChangeText={setCarbs}
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
        />
      </View>
    </View>
  )
}

export default ManualGoalsInput
