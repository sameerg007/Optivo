import React from 'react';
import styles from './dashboard.module.css';
import ExpenseTracker from '@/components/features/expense-tracker/ExpenseTracker';

const TabContent = () => (
  <div className={styles.tabContent}>
    <ExpenseTracker />
  </div>
);

export default TabContent;
