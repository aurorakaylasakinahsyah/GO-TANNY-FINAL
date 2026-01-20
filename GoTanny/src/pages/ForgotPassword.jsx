import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import styles from './Login.module.css' // Reusing Login styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Mohon isi email Anda')
      return
    }

    setLoading(true)
    
    try {
      const result = await forgotPassword(email)
      if (result.success) {
        toast.success(result.message)
        // In a real app, we wouldn't show the token. But for dev/demo:
        if (result.token) {
            console.log("Reset Token:", result.token);
            toast.success("Cek console untuk token (Dev Mode)", { duration: 5000 });
        }
        // navigate('/login') // Or stay here? Maybe stay here.
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
              <h1 className={styles.loginTitle}>LUPA PASSWORD</h1>
              <p className={styles.loginSubtitle}>Masukkan email untuk reset password</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <div className={styles.inputWrapper}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
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
                  'KIRIM LINK RESET'
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

export default ForgotPassword
