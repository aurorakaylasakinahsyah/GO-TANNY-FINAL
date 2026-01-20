import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import styles from './Login.module.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Mohon isi semua field')
      return
    }

    setLoading(true)
    
    try {
      const result = await login(email, password)
      if (result.success) {
        toast.success('Login berhasil!')
        navigate('/beranda')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    
    try {
      const result = await loginWithGoogle()
      if (result.success) {
        toast.success('Login dengan Google berhasil!')
        navigate('/beranda')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Left Side - Logo */}
      <motion.div 
        className={styles.logoSection}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className={styles.logoContainer}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <img src="/gambar/LOGO.png" alt="GO TANY Logo" className={styles.logoImage} />
        </motion.div>
        <span className={styles.companyName}>Organic Solutions</span>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div 
        className={styles.formSection}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.formWrapper}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <h1 className={styles.loginTitle}>LOGIN</h1>
              <p className={styles.loginSubtitle}>Silakan masuk ke akun Anda</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email / Username</label>
                <div className={styles.inputWrapper}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email atau username"
                    className={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className={styles.input}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <div className={styles.forgotPassword}>
                  <Link to="/forgot-password" className={styles.forgotLink}>
                    Lupa password?
                  </Link>
                </div>
              </div>

              <motion.button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className={styles.loader}></span>
                ) : (
                  'MASUK'
                )}
              </motion.button>
            </form>

            <div className={styles.divider}>
              <span>ATAU</span>
            </div>

            <motion.button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleLogin}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FcGoogle className={styles.googleIcon} />
              Masuk dengan Google
            </motion.button>

            <p className={styles.registerLink}>
              Belum punya akun?{' '}
              <Link to="/daftar">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
