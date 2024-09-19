import React, { useState } from 'react'
import { View, Modal, TouchableOpacity, Text, ScrollView } from 'react-native'
import AutoGenerateStep1 from './AutoGenerateStep1'
import AutoGenerateStep2 from './AutoGenerateStep2'
import AutoGenerateStep3 from './AutoGenerateStep3'
import AutoGenerateStep4 from './AutoGenerateStep4'

const AutoGenerateModal = ({ visible, onClose, generateMacros }) => {
  const [step, setStep] = useState(1)
  const [workoutFrequency, setWorkoutFrequency] = useState(null)
  const [height, setHeight] = useState('170')
  const [weight, setWeight] = useState('70')
  const [goalType, setGoalType] = useState(null)
  const [currentWeight, setCurrentWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-2xl p-6">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4"
          >
            <Text className="text-xl font-bold">×</Text>
          </TouchableOpacity>
          <ScrollView>
            {step === 1 && (
              <AutoGenerateStep1
                nextStep={nextStep}
                workoutFrequency={workoutFrequency}
                setWorkoutFrequency={setWorkoutFrequency}
              />
            )}
            {step === 2 && (
              <AutoGenerateStep2
                nextStep={nextStep}
                prevStep={prevStep}
                height={height}
                setHeight={setHeight}
                weight={weight}
                setWeight={setWeight}
              />
            )}
            {step === 3 && (
              <AutoGenerateStep3
                nextStep={nextStep}
                prevStep={prevStep}
                goalType={goalType}
                setGoalType={setGoalType}
              />
            )}
            {step === 4 && (
              <AutoGenerateStep4
                generateMacros={generateMacros}
                prevStep={prevStep}
                currentWeight={currentWeight}
                setCurrentWeight={setCurrentWeight}
                goalWeight={goalWeight}
                setGoalWeight={setGoalWeight}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default AutoGenerateModal
