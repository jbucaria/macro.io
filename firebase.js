import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'

// Firebase configuration object
const firebaseConfig = {
  apiKey: 'AIzaSyA2uSBpTcDhGgh3LAbv4X7duGB-gMRRwY8',
  authDomain: 'macro-io-54134.firebaseapp.com',
  projectId: 'macro-io-54134',
  storageBucket: 'macro-io-54134.appspot.com',
  messagingSenderId: '300281451674',
  appId: '1:300281451674:android:4e28e2bc518570c6bdbb23',
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(app)

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

// Export Firebase services
export { app, auth, db }
