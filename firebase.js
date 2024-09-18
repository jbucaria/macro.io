import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// Firebase configuration object
const firebaseConfig = {
  apiKey: 'AIzaSyA2uSBpTcDhGgh3LAbv4X7duGB-gMRRwY8',
  authDomain: 'macro-io-54134.firebaseapp.com',
  projectId: 'macro-io-54134',
  storageBucket: 'macro-io-54134.appspot.com',
  messagingSenderId: '300281451674',
  appId: '1:300281451674:android:4e28e2bc518570c6bdbb23',
}
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app() // Use the already initialized instance
}

// Enable session persistence
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

// Export Firebase services
export const auth = firebase.auth()
export const db = firebase.firestore()
export default firebase
