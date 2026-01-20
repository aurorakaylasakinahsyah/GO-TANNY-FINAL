import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration for GO TANY
const firebaseConfig = {
  apiKey: "AIzaSyCYjShWgpOHFSj-wGENl-mvjCosolJgLCo",
  authDomain: "gotanny-aa209.firebaseapp.com",
  projectId: "gotanny-aa209",
  storageBucket: "gotanny-aa209.firebasestorage.app",
  messagingSenderId: "236319763824",
  appId: "1:236319763824:web:7f194345ac004c5e2df3b5",
  measurementId: "G-5ECMJ85XME"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics (only in browser environment)
let analytics = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

// Initialize services
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)
export { analytics }

export default app
