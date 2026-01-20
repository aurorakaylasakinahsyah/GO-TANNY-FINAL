import React from 'react'
import styles from './Modal.module.css'

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>{title}</h3>
        {children}
        <button className={styles.modalButton} onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  )
}

export default Modal
