import React, { useState } from 'react';
import styles from './AddCategoryModal.module.css';

const defaultCategory = { name: '', icon: '', color: '#64748b' };

export default function AddCategoryModal({ isOpen, onClose, onAddCategory }) {
  const [category, setCategory] = useState(defaultCategory);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.name.trim() || !category.icon.trim()) {
      setError('Name and icon are required.');
      return;
    }
    setError('');
    onAddCategory({ ...category });
    setCategory(defaultCategory);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Add New Category</h2>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label className={styles.modalLabel}>
            Name
            <input className={styles.modalInput} name="name" value={category.name} onChange={handleChange} required />
          </label>
          <label className={styles.modalLabel}>
            Icon (emoji)
            <input className={styles.modalInput} name="icon" value={category.icon} onChange={handleChange} required maxLength={2} />
          </label>
          <label className={styles.modalLabel}>
            Color
            <input className={styles.modalColorInput} name="color" type="color" value={category.color} onChange={handleChange} />
          </label>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button type="button" className={`${styles.modalButton} ${styles.modalButtonCancel}`} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.modalButton}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
