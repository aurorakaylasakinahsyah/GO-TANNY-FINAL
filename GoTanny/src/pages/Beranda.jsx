import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components'
import { diseaseData } from '../data/diseaseData'
import styles from './Beranda.module.css'

const Beranda = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [plantFilter, setPlantFilter] = useState('Semua Buah')
  const [diseaseFilter, setDiseaseFilter] = useState('')
  const navigate = useNavigate()

  // Get unique plants and diseases from data
  const uniquePlants = useMemo(() => {
    const plants = [...new Set(diseaseData.map(d => d.plant))];
    return plants.sort();
  }, []);

  const uniqueDiseases = useMemo(() => {
    // If a plant is selected, only show diseases for that plant
    let dataToFilter = diseaseData;
    if (plantFilter && plantFilter !== 'Semua Buah') {
      dataToFilter = diseaseData.filter(d => d.plant.toLowerCase() === plantFilter.toLowerCase());
    }
    const diseases = [...new Set(dataToFilter.map(d => d.type))];
    return diseases.sort();
  }, [plantFilter]);

  const filteredData = useMemo(() => {
    return diseaseData.filter(disease => {
      const matchesSearch = disease.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           disease.plant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           disease.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlant = plantFilter === 'Semua Buah' || !plantFilter || disease.plant.toLowerCase() === plantFilter.toLowerCase();
      const matchesDisease = !diseaseFilter || disease.type.toLowerCase() === diseaseFilter.toLowerCase();

      return matchesSearch && matchesPlant && matchesDisease;
    });
  }, [searchTerm, plantFilter, diseaseFilter])

  const handleReset = () => {
    setSearchTerm('')
    setPlantFilter('Semua Buah')
    setDiseaseFilter('')
  }

  const showInfo = (e, disease) => {
    e.stopPropagation();
    alert(`Info Cepat:\n\nNama: ${disease.title}\nJenis: ${disease.type}\nBuah: ${disease.plant}`);
  }

  const goToDetail = (id) => {
    navigate(`/detail/${id}`)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbContainer}>
          <Link to='/beranda'><i className='fas fa-home'></i> Beranda</Link>
          <span className={styles.breadcrumbSeparator}><i className='fas fa-chevron-right'></i></span>
          <Link to='/database'>Database Penyakit</Link>
          <span className={styles.breadcrumbSeparator}><i className='fas fa-chevron-right'></i></span>
          <span className={styles.breadcrumbCurrent}>
            Hama & Penyakit
            <i className='fas fa-times' onClick={handleReset}></i>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Filters Section */}
        <div className={styles.filtersSection}>
          <div className={styles.filterBox}>
            <label className={styles.filterLabel}>
              <i className='fas fa-search'></i> Pencarian
            </label>
            <div className={styles.searchWrapper}>
              <input 
                type='text' 
                className={styles.searchInput} 
                placeholder='Cari hama atau penyakit...' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.filterBox}>
            <label className={styles.filterLabel}>
              <i className='fas fa-seedling'></i> Buah
            </label>
            <div className={styles.selectWrapper}>
              <select 
                className={styles.filterSelect} 
                value={plantFilter}
                onChange={(e) => {
                  setPlantFilter(e.target.value);
                  setDiseaseFilter(''); // Reset disease filter when plant changes
                }}
              >
                <option value='Semua Buah'>Semua Buah</option>
                {uniquePlants.map(plant => (
                  <option key={plant} value={plant}>{plant}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.filterBox}>
            <label className={styles.filterLabel}>
              <i className='fas fa-virus'></i> Jenis Penyakit
            </label>
            <div className={styles.selectWrapper}>
              <select 
                className={styles.filterSelect}
                value={diseaseFilter}
                onChange={(e) => setDiseaseFilter(e.target.value)}
              >
                <option value=''>Semua Jenis</option>
                {uniqueDiseases.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <h2><span className={styles.resultsCount}>{filteredData.length}</span> hasil ditemukan</h2>
        </div>

        {/* Cards Grid */}
        <div className={styles.cardsGrid}>
          {filteredData.length === 0 ? (
            <div className={styles.noResults}>
              <i className='fas fa-search'></i>
              <h3>Tidak ada hasil ditemukan</h3>
              <p>Coba ubah kata kunci atau filter pencarian Anda</p>
            </div>
          ) : (
            filteredData.map(disease => (
              <div key={disease.id} className={styles.card} onClick={() => goToDetail(disease.id)}>
                <div className={styles.cardImageWrapper}>
                  <img src={disease.image} alt={disease.title} className={styles.cardImage} />
                  <div className={styles.cardBadge}>{disease.type}</div>
                  <button className={styles.infoButton} onClick={(e) => showInfo(e, disease)}>
                    <i className='fas fa-info'></i>
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{disease.title}</h3>
                  <div className={styles.cardMeta}>
                    <i className='fas fa-leaf'></i>
                    <span>{disease.plant}</span>
                  </div>
                  <div className={styles.cardTags}>
                    {disease.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        <i className={tag.icon}></i>
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Beranda
