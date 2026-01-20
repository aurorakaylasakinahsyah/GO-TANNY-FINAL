import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import HalamanUtama from './pages/HalamanUtama'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Beranda from './pages/Beranda'
import DetailPenyakit from './pages/DetailPenyakit'
import ScanTanaman from './pages/ScanTanaman'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(34, 139, 34, 0.2)',
          borderTopColor: '#228B22',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Public Route - redirect to beranda if already logged in
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()
  
  if (loading) {
    return null
  }
  
  if (currentUser) {
    return <Navigate to="/beranda" replace />
  }
  
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HalamanUtama />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/daftar" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />
      
      {/* Protected Routes */}
      <Route path="/beranda" element={
        <ProtectedRoute>
          <Beranda />
        </ProtectedRoute>
      } />
      <Route path="/database" element={
        <ProtectedRoute>
          <Beranda />
        </ProtectedRoute>
      } />
      <Route path="/detail/:id" element={
        <ProtectedRoute>
          <DetailPenyakit />
        </ProtectedRoute>
      } />
      <Route path="/scan" element={
        <ProtectedRoute>
          <ScanTanaman />
        </ProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#228B22',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
