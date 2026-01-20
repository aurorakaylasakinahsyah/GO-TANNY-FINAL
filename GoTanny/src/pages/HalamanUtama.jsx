import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiMessageSquare, FiCamera, FiSearch, FiCheck } from 'react-icons/fi'
import styles from './HalamanUtama.module.css'
import logo from '../assets/LOGO.png'

const HalamanUtama = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Identifikasi Cepat',
      description: 'Scan tanaman Anda dan dapatkan hasil identifikasi hama atau penyakit dalam hitungan detik menggunakan AI'
    },
    {
      icon: '➕',
      title: 'Rekomendasi Solusi',
      description: 'Dapatkan rekomendasi treatment dan perawatan yang tepat untuk mengatasi masalah pada tanaman Anda'
    },
    {
      icon: '👥',
      title: 'Komunitas Petani',
      description: 'Bergabung dengan komunitas petani untuk berbagi pengalaman dan solusi pertanian'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Pengguna Aktif' },
    { number: '700+', label: 'Jenis Penyakit' },
    { number: '98%', label: 'Akurasi AI' },
    { number: '24/7', label: 'Dukungan' }
  ]

  const steps = [
    {
      number: '1',
      icon: <FiCamera />,
      title: 'Ambil Foto',
      description: 'Foto bagian tanaman yang bermasalah menggunakan kamera smartphone Anda. Pastikan pencahayaan cukup dan fokus jelas.'
    },
    {
      number: '2',
      icon: <FiSearch />,
      title: 'Analisis AI',
      description: 'AI kami akan menganalisis foto dan mencocokkan dengan database untuk mengidentifikasi masalah pada tanaman Anda.'
    },
    {
      number: '3',
      icon: <FiCheck />,
      title: 'Dapatkan Solusi',
      description: 'Terima hasil diagnosa lengkap dengan rekomendasi perawatan, obat, dan tips pencegahan untuk tanaman Anda.'
    }
  ]

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="GO TANY Logo" className={styles.logoImg} />
            <span>GO TANY</span>
          </Link>
          
          <nav>
            <ul className={styles.navMenu}>
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Fitur</a></li>
              <li><a href="#how">Cara Kerja</a></li>
            </ul>
          </nav>
          
          <Link to="/daftar" className={styles.ctaButton}>
            Daftar Sekarang
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero} id="home">
        <div className={styles.heroContainer}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Jaga Kesehatan Tanaman dengan <span>Go Tany</span></h1>
            <p>Platform digital pertama di Indonesia untuk identifikasi hama & penyakit tanaman menggunakan teknologi AI. Solusi cepat, akurat, dan mudah untuk petani modern.</p>
            
            <div className={styles.heroButtons}>
              <Link to="/daftar" className={styles.btnPrimary}>
                <FiArrowRight />
                Daftar Sekarang
              </Link>
              <Link to="http://wa.me/6282169972635" className={styles.btnSecondary}>
                <FiMessageSquare />
                Hubungi Kami
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className={styles.heroImage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.heroLaptop}>
              <div className={styles.laptopScreen}>
                <div className={styles.laptopDisplay}>
                  <img src="/gambar/raisa.png" alt="GO TANY Preview" />
                  <div className={styles.laptopDisplayText}>
                    Scan & Identifikasi
                  </div>
                </div>
              </div>
              <div className={styles.laptopBase}></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.featuresContainer}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Fitur Unggulan
          </motion.h2>
          <motion.p 
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Teknologi canggih untuk membantu Anda merawat tanaman dengan lebih baik
          </motion.p>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statItem}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks} id="how">
        <div className={styles.howContainer}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Cara Kerja
          </motion.h2>
          <motion.p 
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Tiga langkah mudah untuk mendiagnosa tanaman Anda
          </motion.p>
          
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={styles.stepCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className={styles.stepNumber}>{step.number}</div>
                <h3>
                  {step.icon}
                  {step.title}
                </h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <motion.div 
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Siap Meningkatkan Hasil Panen Anda?</h2>
          <p>Bergabunglah dengan ribuan petani yang sudah merasakan manfaat Go Tany. Daftar sekarang dan dapatkan akses gratis selama 30 hari!</p>
          <div className={styles.ctaButtons}>
            <Link to="/daftar" className={styles.btnPrimary}>
              <FiArrowRight />
              Daftar Sekarang
            </Link>
            <Link to="http://wa.me/6282169972635" className={styles.btnSecondary}>
                <FiMessageSquare />
                Hubungi Kami
              </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <img src={logo} alt="GO TANY Logo" />
              </div>
              <p className={styles.footerDesc}>
                Platform digital untuk identifikasi dan perawatan kesehatan tanaman. 
                Membantu petani Indonesia meningkatkan produktivitas dengan teknologi AI.
              </p>
            </div>
            
            <div className={styles.footerLinks}>
              <div className={styles.footerColumn}>
                <h4 className={styles.footerTitle}>Produk</h4>
                <ul>
                  <li><a href="#features">Fitur</a></li>
                  <li><a href="#how">Tutorial</a></li>
                </ul>
              </div>
              
              <div className={styles.footerColumn}>
                <h4 className={styles.footerTitle}>Perusahaan</h4>
                <ul>
                  <li><a href="#">Tentang Kami</a></li>
                  <li><a href="#">Kontak</a></li>
                </ul>
              </div>
              
              <div className={styles.footerColumn}>
                <h4 className={styles.footerTitle}>Legal</h4>
                <ul>
                  <li><a href="#">Privasi</a></li>
                  <li><a href="#">Syarat & Ketentuan</a></li>
                  <li><a href="#">Lisensi</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p>&copy; 2025 Go Tany. All rights reserved. Made with ❤️ for Indonesian Farmers</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HalamanUtama
