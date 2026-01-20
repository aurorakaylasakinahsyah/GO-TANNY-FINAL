import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './DiseaseCard.module.css'

function DiseaseCard({ disease, onInfoClick }) {
  const navigate = useNavigate()

  const getTypeIcon = (type) => {
    const icons = {
      'Serangga': 'fa-bug',
      'Jamur': 'fa-disease',
      'Bakteri': 'fa-bacteria',
      'Virus': 'fa-virus'
    }
    return icons[type] || 'fa-question'
  }

  const handleClick = () => {
    navigate(`/detail/${disease.id}`)
  }

  const handleInfoClick = (e) => {
    e.stopPropagation()
    onInfoClick(disease)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <article>
      <div 
        className={styles.card}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        role="button"
        tabIndex={0}
        aria-label={`Lihat detail ${disease.title}`}
      >
        <div className={styles.cardImageWrapper}>
          <img 
            src={disease.image} 
            alt={disease.title} 
            className={styles.cardImage}
            loading="lazy"
          />
          <div className={styles.cardImageOverlay}></div>
          <div className={styles.cardBadge}>
            <i className={`fas ${getTypeIcon(disease.type)}`}></i>
            {disease.type}
          </div>
          <button 
            className={styles.infoButton}
            onClick={handleInfoClick}
            aria-label={`Info cepat ${disease.title}`}
          >
            <i className="fas fa-info"></i>
          </button>
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{disease.title}</h3>
          <div className={styles.cardMeta}>
            <span className={styles.metaIcon}>
              <i className="fas fa-leaf"></i>
            </span>
            <span>Tanaman {disease.plant}</span>
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
    </article>
  )
}

export default DiseaseCard
