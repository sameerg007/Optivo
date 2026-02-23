"use client";
import React, { Suspense, lazy } from 'react';
import styles from '@/components/features/expense-tracker/expenseTracker.module.css';

const GroupedExpense = lazy(() => import('@/components/features/grouped-expense/GroupedExpense'));
const ExpenseTracker = lazy(() => import('@/components/features/expense-tracker/ExpenseTracker'));
const Profile = lazy(() => import('@/components/features/profile/Profile'));

const TABS = [
  { id: 'grouped', label: 'Group Expense' },
  { id: 'personal', label: 'Personal Expense' },
  { id: 'profile', label: 'Profile' }
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState('personal');

  const renderTabContent = React.useCallback(() => {
    switch (activeTab) {
      case 'grouped':
        return <GroupedExpense />;
      case 'personal':
        return <ExpenseTracker />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <main className={styles.dashboardMobileWrapper}>
      <Suspense fallback={<div style={{padding:'2rem',textAlign:'center'}}>Loading...</div>}>
        {renderTabContent()}
      </Suspense>
      <nav style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e0e7ef', zIndex: 100 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              background: activeTab === tab.id ? '#FFD700' : '#fff',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #2962ff' : '2px solid transparent',
              cursor: 'pointer',
              color: activeTab === tab.id ? '#23243a' : '#6a6d78',
              transition: 'all 0.2s',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </main>
  );
}
