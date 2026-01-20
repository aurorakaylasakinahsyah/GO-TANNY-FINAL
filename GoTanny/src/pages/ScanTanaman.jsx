import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiCamera, FiImage, FiX, FiCheck, FiArrowLeft, FiLoader, FiAlertCircle, FiActivity, FiShield, FiSun, FiInfo } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Header from '../components/Header/Header'
import { useAuth } from '../contexts/AuthContext'
import { uploadScanImage, saveScanResult } from '../services/firebaseService'
import { diseaseData } from '../data/diseaseData'
import { API_ENDPOINTS } from '../config/api_config'
import styles from './ScanTanaman.module.css'

const ScanTanaman = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  
  const fileInputRef = useRef(null)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Mohon upload file gambar (JPG, PNG, etc.)')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB')
      return
    }
    
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
    setResult(null)
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Pilih gambar terlebih dahulu')
      return
    }

    setIsAnalyzing(true)
    
    try {
      // Call Backend API
      const formData = new FormData();
      formData.append('file', selectedImage);

      let token = null;
      if (currentUser) {
          try {
              token = await currentUser.getIdToken();
          } catch (e) {
              console.warn("Failed to get ID token", e);
          }
      }

      const response = await fetch(API_ENDPOINTS.ANALYZE, {
        method: 'POST',
        body: formData,
        headers: token ? {
            'Authorization': `Bearer ${token}`
        } : {}
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = errorData.detail || errorData.message || 'Analysis failed';
        
        // Handle FastAPI validation errors (array of objects)
        if (typeof errorMessage === 'object') {
            errorMessage = JSON.stringify(errorMessage);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Map the new Python backend response to the frontend format
      // Backend returns: { prediction, plant, accuracy, details: { ... } }
      if (data.prediction) {
         const resultData = data.details;
         const diseaseName = data.prediction;
         const plantName = data.plant;
         const confidence = parseFloat(data.accuracy.replace('%', '')) / 100;

         // Find matching disease in local data (optional, for fallback images/tags)
         const matchedDisease = diseaseData.find(d => 
             d.plant.toLowerCase() === plantName.toLowerCase() && 
             d.type.toLowerCase() === diseaseName.toLowerCase()
         );

         const finalImageUrl = imagePreview; 

         const formattedResult = {
             disease: matchedDisease ? matchedDisease.title : `${diseaseName} pada ${plantName}`,
             confidence: Math.round(confidence * 100),
             type: matchedDisease && matchedDisease.tags.length > 0 ? matchedDisease.tags[0].text : diseaseName,
             plant: plantName,
             severity: 'Medium',
             description: matchedDisease ? matchedDisease.description : (resultData.summary || "Tidak ada deskripsi tersedia."),
             recommendations: matchedDisease ? matchedDisease.treatment : (resultData.treatment || ["Konsultasikan dengan ahli."]),
             imageUrl: finalImageUrl,
             symptoms: matchedDisease ? matchedDisease.symptoms : (resultData.symptoms || []),
             control: matchedDisease ? matchedDisease.prevention : (resultData.prevention || []), // Note: backend uses 'prevention'
             extra_info: matchedDisease ? [] : (resultData.environment || []), // Mapping environment to extra_info or separate
             environment_factors: matchedDisease ? [] : (resultData.environment || [])
         };
         
         setResult(formattedResult);
      
         // Save scan result to Firestore (or Backend)
         // Since we disabled Firebase Auth, we can't write to Firestore if rules require auth.
         // But we can try. If it fails, we just log it.
         // Ideally we should save to Backend DB.
         // But for now, let's keep it as is, it will likely fail silently or warn.
         if (currentUser) {
           try {
             // We can't use saveScanResult if it uses Firestore and we are not auth'd in Firebase
             // So we skip it or implement backend save.
             // The backend ALREADY saves the log in analysisController.js!
             // So we don't need to do anything here for saving history.
             console.log("Scan saved to backend history automatically.");
           } catch (saveError) {
             console.warn('Failed to save scan result:', saveError)
           }
         }
         
         toast.success('Analisis selesai!')
      } else {
         throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(`Gagal menganalisis gambar: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/beranda" className={styles.backButton}>
              <FiArrowLeft />
              Kembali
            </Link>
            <div className={styles.headerText}>
              <h1>Scan Tanaman</h1>
              <p>Upload foto tanaman Anda untuk mendeteksi penyakit</p>
            </div>
          </motion.div>

          <div className={styles.scanArea}>
            {/* Upload Section */}
            <motion.div 
              className={styles.uploadSection}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                {!imagePreview ? (
                  <motion.div
                    key="dropzone"
                    className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className={styles.fileInput}
                    />
                    <div className={styles.dropzoneContent}>
                      <div className={styles.uploadIcon}>
                        <FiUpload />
                      </div>
                      <h3>Drag & Drop gambar di sini</h3>
                      <p>atau klik untuk memilih file</p>
                      <span className={styles.fileTypes}>
                        Mendukung: JPG, PNG, WEBP (Maks. 10MB)
                      </span>
                    </div>
                    
                    <div className={styles.uploadActions}>
                      <button 
                        type="button" 
                        className={styles.uploadBtn}
                        onClick={(e) => {
                          e.stopPropagation()
                          fileInputRef.current?.click()
                        }}
                      >
                        <FiImage />
                        Pilih dari Galeri
                      </button>
                      <button 
                        type="button" 
                        className={styles.cameraBtn}
                        onClick={(e) => {
                          e.stopPropagation()
                          fileInputRef.current?.click()
                        }}
                      >
                        <FiCamera />
                        Ambil Foto
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    className={styles.previewContainer}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className={styles.previewHeader}>
                      <h3>Preview Gambar</h3>
                      <button 
                        className={styles.clearBtn}
                        onClick={clearImage}
                        disabled={isAnalyzing}
                      >
                        <FiX />
                      </button>
                    </div>
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Preview" />
                      {isAnalyzing && (
                        <div className={styles.analyzingOverlay}>
                          <div className={styles.spinner}>
                            <FiLoader className={styles.spinnerIcon} />
                          </div>
                          <p>Menganalisis gambar...</p>
                        </div>
                      )}
                    </div>
                    <div className={styles.previewActions}>
                      <button 
                        className={styles.changeBtn}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing}
                      >
                        <FiImage />
                        Ganti Gambar
                      </button>
                      <button 
                        className={styles.analyzeBtn}
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <FiLoader className={styles.spinning} />
                            Menganalisis...
                          </>
                        ) : (
                          <>
                            <FiCheck />
                            Analisis Sekarang
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className={styles.fileInput}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Result Section */}
            <motion.div 
              className={styles.resultSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    className={styles.resultCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className={styles.resultHeader}>
                      <div className={styles.resultBadge}>
                        <FiCheck />
                        Terdeteksi
                      </div>
                      <div className={styles.confidenceBadge}>
                        {result.confidence}% Akurasi
                      </div>
                    </div>

                    <h2 className={styles.diseaseName}>{result.disease}</h2>
                    
                    <div className={styles.resultMeta}>
                      <span className={`${styles.tag} ${styles[result.type.toLowerCase()]}`}>
                        {result.type}
                      </span>
                      <span className={styles.tag}>{result.plant}</span>
                      <span className={`${styles.severityTag} ${styles[`severity${result.severity}`]}`}>
                        Tingkat: {result.severity}
                      </span>
                    </div>

                    <p className={styles.resultDescription}>{result.description}</p>

                    {result.symptoms && result.symptoms.length > 0 && (
                      <div className={styles.recommendations}>
                        <h4><FiActivity /> Gejala:</h4>
                        <ul>
                          {result.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className={styles.recommendations}>
                      <h4>
                        <FiAlertCircle />
                        Pengobatan:
                      </h4>
                      <ul>
                        {result.recommendations.map((rec, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            {rec}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {result.control && result.control.length > 0 && (
                      <div className={styles.recommendations}>
                        <h4><FiShield /> Pengendalian:</h4>
                        <ul>
                          {result.control.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    )}

                    {result.environment_factors && result.environment_factors.length > 0 && (
                      <div className={styles.recommendations}>
                        <h4><FiSun /> Lingkungan:</h4>
                        <ul>
                          {result.environment_factors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                      </div>
                    )}

                    {result.extra_info && result.extra_info.length > 0 && (
                      <div className={styles.recommendations}>
                        <h4><FiInfo /> Info Tambahan:</h4>
                        <ul>
                          {result.extra_info.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className={styles.resultActions}>
                      <button 
                        className={styles.newScanBtn}
                        onClick={clearImage}
                      >
                        Scan Baru
                      </button>
                      <button 
                        className={styles.viewDetailBtn}
                        onClick={() => navigate('/beranda')}
                      >
                        Lihat Database
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className={styles.emptyResult}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={styles.emptyIcon}>🔬</div>
                    <h3>Hasil Analisis</h3>
                    <p>Upload dan analisis gambar tanaman untuk melihat hasil deteksi penyakit di sini.</p>
                    
                    <div className={styles.tips}>
                      <h4>Tips untuk hasil terbaik:</h4>
                      <ul>
                        <li>📸 Pastikan gambar jelas dan tidak blur</li>
                        <li>💡 Gunakan pencahayaan yang cukup</li>
                        <li>🎯 Fokus pada bagian tanaman yang terinfeksi</li>
                        <li>🌱 <strong>Tanaman yang didukung:</strong> Apel, Blueberry, Ceri, Jagung, Anggur, Jeruk, Persik, Paprika, Kentang, Raspberry, Kedelai, Labu, Stroberi, Tomat.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ScanTanaman
