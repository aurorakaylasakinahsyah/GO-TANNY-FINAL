import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '../config/firebase'
import { API_ENDPOINTS } from '../config/api_config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        // Fetch additional user data from Firestore
        // Note: If using backend-only DB, this might fail or be empty.
        // But we keep it for hybrid approach or if Firestore is enabled.
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid))
            if (userDoc.exists()) {
              setUserData(userDoc.data())
            }
        } catch (e) {
            console.warn("Firestore access failed (expected if using backend-only):", e);
        }
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Sign up with email and password
  const signup = async (email, password, fullName, phone) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name
      await updateProfile(result.user, { displayName: fullName })
      
      // Create user document in Firestore (Optional if using backend)
      try {
          await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            email: email,
            fullName: fullName,
            phone: phone || '',
            photoURL: result.user.photoURL || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            scanHistory: [],
            savedDiseases: []
          })
      } catch (e) {
          console.warn("Firestore write failed:", e);
      }

      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) }
    }
  }

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) }
    }
  }

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' })
      const result = await signInWithPopup(auth, googleProvider)
      
      // Check if user exists in Firestore
      try {
          const userDoc = await getDoc(doc(db, 'users', result.user.uid))
          
          if (!userDoc.exists()) {
            // Create new user document
            await setDoc(doc(db, 'users', result.user.uid), {
              uid: result.user.uid,
              email: result.user.email,
              fullName: result.user.displayName || '',
              phone: result.user.phoneNumber || '',
              photoURL: result.user.photoURL || '',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              scanHistory: [],
              savedDiseases: []
            })
          }
      } catch (e) {
          console.warn("Firestore access failed:", e);
      }

      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) }
    }
  }

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Gagal mengirim email reset password');
      }
      return { success: true, message: data.message, token: data.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Reset Password
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Gagal mereset password');
      }
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Helper function to get user-friendly error messages
  const getErrorMessage = (code) => {
    const errorMessages = {
      'auth/email-already-in-use': 'Email sudah terdaftar. Silakan gunakan email lain.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/operation-not-allowed': 'Operasi tidak diizinkan. Hubungi admin.',
      'auth/weak-password': 'Password terlalu lemah. Minimal 6 karakter.',
      'auth/user-disabled': 'Akun ini telah dinonaktifkan.',
      'auth/user-not-found': 'Email tidak terdaftar.',
      'auth/wrong-password': 'Password salah.',
      'auth/invalid-credential': 'Email atau password salah.',
      'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
      'auth/popup-closed-by-user': 'Login dibatalkan.',
      'auth/network-request-failed': 'Koneksi jaringan bermasalah.'
    }
    return errorMessages[code] || `Terjadi kesalahan (${code}). Silakan coba lagi.`
  }

  const value = {
    currentUser: user,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
