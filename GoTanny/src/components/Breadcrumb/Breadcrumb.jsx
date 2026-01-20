import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

function Breadcrumb({ items, onReset }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <div className={styles.breadcrumbContainer}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className={styles.breadcrumbSeparator}>
                <i className="fas fa-chevron-right"></i>
              </span>
            )}
            {item.link ? (
              <Link to={item.link} className={styles.breadcrumbLink}>
                {item.icon && <i className={item.icon}></i>}
                {item.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>
                {item.label}
                {onReset && (
                  <span 
                    className={styles.closeIcon} 
                    onClick={onReset}
                    role="button" 
                    aria-label="Reset filter"
                  >
                    <i className="fas fa-times"></i>
                  </span>
                )}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  )
}

export default Breadcrumb
