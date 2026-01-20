import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiAtSign } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import styles from './Register.module.css'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ level: '', text: '' })
  
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = useCallback((password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++

    if (strength === 0 || strength === 1) {
      setPasswordStrength({ level: 'weak', text: 'Lemah' })
    } else if (strength === 2 || strength === 3) {
      setPasswordStrength({ level: 'medium', text: 'Sedang' })
    } else {
      setPasswordStrength({ level: 'strong', text: 'Kuat' })
    }
  }, [])

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('Nama depan harus diisi')
      return false
    }
    if (!formData.lastName.trim()) {
      toast.error('Nama belakang harus diisi')
      return false
    }
    if (!formData.username || formData.username.length < 4) {
      toast.error('Username minimal 4 karakter')
      return false
    }
    if (!formData.email) {
      toast.error('Email harus diisi')
      return false
    }
    if (!formData.phone) {
      toast.error('Nomor telepon harus diisi')
      return false
    }
    if (formData.password.length < 8) {
      toast.error('Password minimal 8 karakter')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok')
      return false
    }
    if (!agreeTerms) {
      toast.error('Anda harus menyetujui syarat dan ketentuan')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`
      await signup(formData.email, formData.password, fullName, formData.phone)
      toast.success('Pendaftaran berhasil!')
      navigate('/beranda')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStrengthClass = () => {
    switch (passwordStrength.level) {
      case 'weak': return styles.strengthWeak
      case 'medium': return styles.strengthMedium
      case 'strong': return styles.strengthStrong
      default: return ''
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
        <div className={styles.registerCard}>
          <div className={styles.registerHeader}>
            <h1 className={styles.registerTitle}>DAFTAR</h1>
            <p className={styles.registerSubtitle}>Buat akun baru untuk memulai</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Name Row */}
            <div className={styles.formRow}>
              <div className={styles.inputGroupHalf}>
                <label htmlFor="firstName" className={styles.label}>Nama Depan</label>
                <div className={styles.inputWrapper}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Nama depan"
                    className={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className={styles.inputGroupHalf}>
                <label htmlFor="lastName" className={styles.label}>Nama Belakang</label>
                <div className={styles.inputWrapper}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Nama belakang"
                    className={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <div className={styles.inputWrapper}>
                <FiAtSign className={styles.inputIcon} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Pilih username unik"
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <FiMail className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alamat@email.com"
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone & Gender Row */}
            <div className={styles.formRow}>
              <div className={styles.inputGroupHalf}>
                <label htmlFor="phone" className={styles.label}>Nomor Telepon</label>
                <div className={styles.inputWrapper}>
                  <FiPhone className={styles.inputIcon} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className={styles.inputGroupHalf}>
                <label htmlFor="gender" className={styles.label}>Jenis Kelamin</label>
                <div className={styles.inputWrapper}>
                  <FiUser className={styles.inputIcon} />
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={styles.select}
                    disabled={loading}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <FiLock className={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Buat password yang kuat"
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
              {formData.password && (
                <>
                  <div className={styles.passwordStrength}>
                    <div className={`${styles.passwordStrengthBar} ${getStrengthClass()}`}></div>
                  </div>
                  <div className={styles.passwordStrengthText}>{passwordStrength.text}</div>
                </>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Konfirmasi Password</label>
              <div className={styles.inputWrapper}>
                <FiLock className={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className={styles.input}
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                Saya menyetujui <a href="#">Syarat dan Ketentuan</a> serta <a href="#">Kebijakan Privasi</a> GO TANY
              </label>
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
                'DAFTAR SEKARANG'
              )}
            </motion.button>

            <div className={styles.divider}>
              <span>ATAU</span>
            </div>

            <p className={styles.loginLink}>
              Sudah punya akun? <Link to="/login">Masuk sekarang</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
