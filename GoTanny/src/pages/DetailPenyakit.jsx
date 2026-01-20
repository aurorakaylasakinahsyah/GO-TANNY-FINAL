import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Header, Breadcrumb } from '../components'
import { getDiseaseById } from '../data/diseaseData'
import { 
  FiArrowLeft, FiCamera, FiSearch, FiActivity, FiList, FiCheckCircle, 
  FiChevronLeft, FiChevronRight, FiAlertTriangle, FiAlertCircle, 
  FiDroplet, FiInfo, FiBook, FiArrowRight, FiDisc, FiSun
} from 'react-icons/fi'
import styles from './DetailPenyakit.module.css'

function DetailPenyakit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const disease = getDiseaseById(id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Gallery images (using disease image + placeholders)
  const galleryImages = disease ? [
    disease.image,
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop'
  ] : []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  if (!disease) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.notFound}>
            <FiAlertCircle size={64} color="#ccc" style={{ marginBottom: '1rem' }} />
            <h2>Penyakit tidak ditemukan</h2>
            <p>Data yang Anda cari tidak tersedia</p>
            <button onClick={() => navigate('/database')} className={styles.backButton}>
              <FiArrowLeft />
              Kembali ke Database
            </button>
          </div>
        </main>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Database Penyakit', link: '/database' },
    { label: 'Hama & Penyakit', link: '/beranda' },
    { label: disease.title }
  ]

  return (
    <div className={styles.page}>
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className={styles.mainContent}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          {/* Disease Header Card */}
          <div className={styles.diseaseHeader}>
            <h1 className={styles.diseaseTitle}>{disease.title}</h1>
            <p className={styles.diseaseScientific}>{disease.scientificName || 'Nama ilmiah belum tersedia'}</p>
            <span className={styles.diseaseTag}>{disease.type}</span>
          </div>

          {/* Scan Card */}
          <div className={styles.scanCard}>
            <h3 className={styles.scanCardTitle}>Identifikasi Tanaman Anda</h3>
            <div className={styles.scanSteps}>
              <div className={styles.scanStep}>
                <div className={styles.stepIcon}>
                  <FiCamera />
                </div>
                <div className={styles.stepArrow}><FiArrowRight /></div>
                <div className={styles.stepText}>Foto tanaman</div>
              </div>
              <div className={styles.scanStep}>
                <div className={styles.stepIcon}>
                  <FiSearch />
                </div>
                <div className={styles.stepArrow}><FiArrowRight /></div>
                <div className={styles.stepText}>Analisis AI</div>
              </div>
              <div className={styles.scanStep}>
                <div className={styles.stepIcon}>
                  <FiActivity />
                </div>
                <div className={styles.stepArrow}><FiArrowRight /></div>
                <div className={styles.stepText}>Solusi tepat</div>
              </div>
            </div>
            <button className={styles.scanButtonFull} onClick={() => navigate('/scan')}>
              <FiCamera />
              Mulai Scan Sekarang
            </button>
          </div>

          {/* Summary Card */}
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>
              <FiList />
              Ringkasan Cepat
            </h3>
            <ul className={styles.summaryList}>
              <li>
                <FiDisc size={10} />
                <span>Menyerang tanaman {disease.plant}</span>
              </li>
              <li>
                <FiDisc size={10} />
                <span>Jenis patogen: {disease.type}</span>
              </li>
              {disease.symptoms && disease.symptoms.slice(0, 2).map((symptom, index) => (
                <li key={index}>
                  <FiDisc size={10} />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right Content */}
        <div className={styles.diseaseContent}>
          {/* Image Gallery */}
          <div className={styles.imageGallery}>
            <div className={styles.galleryContainer}>
              <img 
                src={galleryImages[currentImageIndex]} 
                alt={disease.title} 
                className={styles.galleryImage}
              />
              <div className={styles.galleryNav}>
                <button className={styles.galleryBtn} onClick={prevImage}>
                  <FiChevronLeft />
                </button>
                <button className={styles.galleryBtn} onClick={nextImage}>
                  <FiChevronRight />
                </button>
              </div>
              <div className={styles.diseaseBadge}>
                <FiAlertTriangle />
                {disease.plant}
              </div>
            </div>
          </div>

          {/* Symptoms Section */}
          <div className={styles.infoSection}>
            <h2 className={styles.infoTitle}>
              <FiActivity />
              Gejala Penyakit
            </h2>
            <div className={styles.infoContent}>
              <p>{disease.description}</p>
              <ul className={styles.infoList}>
                {disease.symptoms && disease.symptoms.map((symptom, index) => (
                  <li key={index}>
                    <FiDisc />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Treatment Section */}
          <div className={styles.infoSection}>
            <h2 className={styles.infoTitle}>
              <FiSun />
              Pengendalian & Pengobatan
            </h2>
            <div className={styles.infoContent}>
              <p><strong>Pencegahan Terbaik:</strong></p>
              <ul className={styles.infoList}>
                {disease.prevention && disease.prevention.map((item, index) => (
                  <li key={index}>
                    <FiCheckCircle />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {disease.treatment && (
                <>
                  <p style={{ marginTop: '1.5rem' }}><strong>Pengendalian Kimiawi:</strong></p>
                  <ul className={styles.infoList}>
                    {disease.treatment.map((item, index) => (
                      <li key={index}>
                        <FiDroplet />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className={styles.warningBox}>
                <div className={styles.warningBoxTitle}>
                  <FiInfo />
                  Catatan Penting
                </div>
                <div className={styles.warningBoxContent}>
                  Selalu baca dan ikuti petunjuk penggunaan pestisida dengan cermat. 
                  Gunakan alat pelindung diri saat aplikasi. Perhatikan masa tunggu 
                  panen sebelum memanen hasil untuk memastikan keamanan produk.
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className={styles.infoSection}>
            <h2 className={styles.infoTitle}>
              <FiBook />
              Informasi Tambahan
            </h2>
            <div className={styles.infoContent}>
              <p>
                {disease.title} disebabkan oleh {disease.type.toLowerCase() === 'jamur' ? 'jamur' : 
                 disease.type.toLowerCase() === 'bakteri' ? 'bakteri' : 
                 disease.type.toLowerCase() === 'virus' ? 'virus' : 'hama'} 
                {disease.scientificName ? ` (${disease.scientificName})` : ''}. 
                Penyakit/hama ini paling aktif pada kondisi cuaca lembab dengan suhu hangat.
              </p>
              <p>
                Pencegahan dan pengendalian dini sangat penting untuk meminimalkan kerugian. 
                Lakukan monitoring rutin pada tanaman {disease.plant} Anda dan segera ambil 
                tindakan jika ditemukan gejala awal.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DetailPenyakit
