import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiEye, FiEyeOff, FiKey } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import styles from './Login.module.css' // Reusing Login styles
import logo from '../assets/LOGO.png'

const ResetPassword = () => {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token || !password || !confirmPassword) {
      toast.error('Mohon isi semua field')
      return
    }

    if (password !== confirmPassword) {
        toast.error('Password tidak cocok')
        return
    }

    setLoading(true)
    
    try {
      const result = await resetPassword(token, password)
      if (result.success) {
        toast.success('Password berhasil diubah! Silakan login.')
        navigate('/login')
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
          <img src={logo} alt="GO TANY Logo" className={styles.logoImage} />
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
              <h1 className={styles.loginTitle}>RESET PASSWORD</h1>
              <p className={styles.loginSubtitle}>Buat password baru Anda</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="token" className={styles.label}>Token Reset</label>
                <div className={styles.inputWrapper}>
                  <FiKey className={styles.inputIcon} />
                  <input
                    type="text"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Masukkan token reset"
                    className={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password Baru</label>
                <div className={styles.inputWrapper}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password baru"
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
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Konfirmasi Password</label>
                <div className={styles.inputWrapper}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className={styles.input}
                    disabled={loading}
                  />
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
                  'UBAH PASSWORD'
                )}
              </motion.button>
            </form>

            <div className={styles.divider}>
              <span>ATAU</span>
            </div>

            <p className={styles.registerLink}>
              Kembali ke{' '}
              <Link to="/login">Halaman Login</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword
