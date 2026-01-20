import React from 'react'
import styles from './FilterSection.module.css'

function FilterSection({ 
  searchTerm, 
  onSearchChange, 
  plantFilter, 
  onPlantChange, 
  diseaseFilter, 
  onDiseaseChange 
}) {
  return (
    <section className={styles.filtersSection} aria-label="Filter pencarian">
      <div className={styles.filterBox}>
        <label className={styles.filterLabel} htmlFor="searchInput">
          <i className="fas fa-search"></i>
          Pencarian
        </label>
        <div className={styles.searchWrapper}>
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="Cari nama hama atau penyakit..." 
            id="searchInput"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
          />
          <i className="fas fa-search"></i>
        </div>
      </div>

      <div className={styles.filterBox}>
        <label className={styles.filterLabel} htmlFor="plantFilter">
          <i className="fas fa-seedling"></i>
          Jenis Tanaman
        </label>
        <div className={styles.selectWrapper}>
          <select 
            className={styles.filterSelect} 
            id="plantFilter"
            value={plantFilter}
            onChange={(e) => onPlantChange(e.target.value)}
          >
            <option value="">Semua Tanaman</option>
            <option value="kentang">Kentang</option>
            <option value="cabai">Cabai</option>
            <option value="tomat">Tomat</option>
            <option value="kapas">Kapas</option>
            <option value="kedelai">Kedelai</option>
            <option value="jagung">Jagung</option>
            <option value="padi">Padi</option>
          </select>
          <i className="fas fa-leaf"></i>
        </div>
      </div>

      <div className={styles.filterBox}>
        <label className={styles.filterLabel} htmlFor="diseaseFilter">
          <i className="fas fa-virus"></i>
          Jenis Patogen
        </label>
        <div className={styles.selectWrapper}>
          <select 
            className={styles.filterSelect} 
            id="diseaseFilter"
            value={diseaseFilter}
            onChange={(e) => onDiseaseChange(e.target.value)}
          >
            <option value="">Semua Patogen</option>
            <option value="serangga">Serangga</option>
            <option value="jamur">Jamur</option>
            <option value="bakteri">Bakteri</option>
            <option value="virus">Virus</option>
          </select>
          <i className="fas fa-bug"></i>
        </div>
      </div>
    </section>
  )
}

export default FilterSection
