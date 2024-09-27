import React, { useRef, useState, useEffect } from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native'
import {
  Camera,
  useCameraDevices,
  useCameraFormat,
} from 'react-native-vision-camera'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { launchImageLibrary } from 'react-native-image-picker'
import axios from 'axios'

const ScanFoodCamera = ({ visible, onClose, onCapture }) => {
  const cameraRef = useRef(null)
  const devices = useCameraDevices()
  const [isUploading, setIsUploading] = useState(false)
  const [token, setToken] = useState('')
  const [customerId, setCustomerId] = useState('')

  // Get the back camera device
  const device = devices.find(d => d.position === 'back')

  // Format the camera to 544x544
  const format = useCameraFormat(device, [
    { photoResolution: { width: 544, height: 544 } }, // Custom resolution
  ])

  const auth = getAuth()
  const storage = getStorage()

  // Fetch Passio token when the component mounts
  useEffect(() => {
    const fetchPassioToken = async () => {
      try {
        const response = await axios.post(
          'https://api.passiolife.com/v2/token-cache/napi/oauth/token/9DNuQvuKEnyROsSAe4a7BLZ3fCbptYn0nCWnZquo'
        )
        setToken(response.data.access_token)
        setCustomerId(response.data.customer_id)
        console.log('Access Token:', response.data.access_token)
        console.log('Customer ID:', response.data.customer_id)
      } catch (error) {
        console.error('Error getting token:', error)
      }
    }

    fetchPassioToken()
  }, [])

  // Function to take photo using camera
  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'balanced',
        flash: 'off', // Optional: set flash to 'off', 'on', or 'auto'
      })
      console.log('Photo captured:', photo.path)

      setIsUploading(true)

      // Upload image to Firebase storage
      const downloadUrl = await uploadToFirebase(photo.path)
      console.log('Image uploaded to Firebase, URL:', downloadUrl)

      // Send image to Passio API for food recognition
      const foodItems = await sendToPassio(downloadUrl)

      setIsUploading(false)

      if (foodItems) {
        console.log('Recognized food items:', foodItems)
        onCapture(photo.path)
      }
      onClose()
    }
  }

  // Function to upload the image to Firebase storage
  const uploadToFirebase = async imagePath => {
    const user = auth.currentUser
    const filename = `users/${user.uid}/photos/${Date.now()}.jpg`
    const reference = ref(storage, filename)

    const response = await fetch(imagePath)
    const blob = await response.blob()
    await uploadBytes(reference, blob)
    const downloadURL = await getDownloadURL(reference)
    return downloadURL
  }

  // Function to send the image to Passio API
  const sendToPassio = async imageUri => {
    const apiUrl =
      'https://api.passiolife.com/v2/products/napi/tools/vision/extractIngredients'

    try {
      const response = await axios.post(
        apiUrl,
        {
          image: imageUri,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Customer-ID': customerId,
            'Content-Type': 'application/json',
          },
        }
      )

      const foodItems = response.data // Adjust this according to the response structure
      return foodItems
    } catch (error) {
      console.error('Error recognizing food with Passio API:', error)
      return null
    }
  }

  // Function to select an image from the user's photo library
  const selectImageFromLibrary = () => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.assets) {
        const imageUri = response.assets[0].uri
        console.log('Selected image from library:', imageUri)

        setIsUploading(true)

        // Upload selected image to Firebase storage
        const downloadUrl = await uploadToFirebase(imageUri)
        console.log('Image uploaded to Firebase, URL:', downloadUrl)

        // Send selected image to Passio API for food recognition
        const foodItems = await sendToPassio(downloadUrl)

        setIsUploading(false)

        if (foodItems) {
          console.log('Recognized food items:', foodItems)
          onCapture(imageUri)
        }
        onClose()
      }
    })
  }

  if (!device || !format) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No camera available. Please ensure the camera is enabled.</Text>
      </View>
    )
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1">
        {/* Camera */}
        {device && (
          <Camera
            ref={cameraRef}
            style={{ flex: 1, borderRadius: 20, overflow: 'hidden' }}
            device={device}
            format={format} // Set the custom format here
            isActive={true}
            photo={true}
          />
        )}

        {/* Upload from Library Button */}
        <TouchableOpacity
          onPress={selectImageFromLibrary}
          style={{
            position: 'absolute',
            top: 30,
            left: 30,
            width: 80,
            height: 40,
            backgroundColor: 'green',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white' }}>Upload</Text>
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity
          onPress={takePhoto}
          style={{
            position: 'absolute',
            bottom: 20,
            width: 80,
            height: 40,
            backgroundColor: 'blue',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
        >
          {isUploading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={{ color: 'white' }}>Capture</Text>
          )}
        </TouchableOpacity>

        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 30,
            right: 30,
            width: 80,
            height: 40,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default ScanFoodCamera
