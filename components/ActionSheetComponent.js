// components/ActionSheetComponent.js
import React from 'react'
import { ActionSheetIOS, Button, View } from 'react-native'
import { tw } from 'nativewind'

const ActionSheetComponent = ({ onOptionSelect }) => {
  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Option 1', 'Option 2'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (onOptionSelect) {
          onOptionSelect(buttonIndex)
        }
      }
    )
  }

  return (
    <View>
      <Button onPress={showActionSheet} title="Show Action Sheet" />
    </View>
  )
}

export default ActionSheetComponent
