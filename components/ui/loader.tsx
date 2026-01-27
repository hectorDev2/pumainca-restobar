import React from 'react';
import styles from './loader.module.css';

interface LoaderProps {
  className?: string; // Kept for compatibility, though the loader is fixed full-screen by default
  text?: string;
}

export const Loader = ({ className, text = "Cooking in progress.." }: LoaderProps) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h1 className={styles.title}>{text}</h1>
      <div className={styles.cooking}>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.area}>
          <div className={styles.sides}>
            <div className={styles.pan}></div>
            <div className={styles.handle}></div>
          </div>
          <div className={styles.pancake}>
            <div className={styles.pastry}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
