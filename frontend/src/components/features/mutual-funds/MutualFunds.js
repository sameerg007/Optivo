'use client';

import React, { useState, useMemo } from 'react';
import styles from './mutualFunds.module.css';
import MarketIndices from './MarketIndices';
import { MF_CATEGORIES, SAMPLE_MUTUAL_FUNDS } from './config';

/**
 * MutualFunds Component
 * Main container for mutual funds section with market indices header
 */
export default function MutualFunds() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter mutual funds
    const filteredFunds = useMemo(() => {
        let funds = [...SAMPLE_MUTUAL_FUNDS];

        // Filter by category
        if (selectedCategory !== 'all') {
            funds = funds.filter(fund => fund.category === selectedCategory);
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            funds = funds.filter(fund => 
                fund.name.toLowerCase().includes(query)
            );
        }

        return funds;
    }, [selectedCategory, searchQuery]);

    // Render star rating
    const renderRating = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className={styles.mutualFundsContainer}>
            {/* Market Indices Header - Similar to Zerodha/Groww */}
            <MarketIndices />

            {/* Search and Filter Section */}
            <div className={styles.filterSection}>
                {/* Search */}
                <div className={styles.searchWrapper}>
                    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search mutual funds..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Tabs */}
                <div className={styles.categoryTabs}>
                    <button
                        className={`${styles.categoryTab} ${selectedCategory === 'all' ? styles.categoryTabActive : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </button>
                    {Object.entries(MF_CATEGORIES).map(([key, category]) => (
                        <button
                            key={key}
                            className={`${styles.categoryTab} ${selectedCategory === key ? styles.categoryTabActive : ''}`}
                            onClick={() => setSelectedCategory(key)}
                        >
                            <span className={styles.categoryIcon}>{category.icon}</span>
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Funds List */}
            <div className={styles.fundsSection}>
                <div className={styles.fundsHeader}>
                    <h3 className={styles.fundsTitle}>
                        {selectedCategory === 'all' ? 'All Funds' : MF_CATEGORIES[selectedCategory]?.name + ' Funds'}
                    </h3>
                    <span className={styles.fundsCount}>{filteredFunds.length} funds</span>
                </div>

                <div className={styles.fundsList}>
                    {filteredFunds.length > 0 ? (
                        filteredFunds.map((fund) => (
                            <div key={fund.id} className={styles.fundCard}>
                                <div className={styles.fundMain}>
                                    <div className={styles.fundInfo}>
                                        <div className={styles.fundCategory}>
                                            <span className={styles.fundCategoryIcon}>
                                                {MF_CATEGORIES[fund.category]?.icon}
                                            </span>
                                            <span className={styles.fundCategoryName}>
                                                {MF_CATEGORIES[fund.category]?.name}
                                            </span>
                                        </div>
                                        <h4 className={styles.fundName}>{fund.name}</h4>
                                        <div className={styles.fundMeta}>
                                            <span className={styles.fundRating}>{renderRating(fund.rating)}</span>
                                            <span className={styles.fundRisk}>{fund.riskLevel}</span>
                                            <span className={styles.fundAum}>AUM: {fund.aum}</span>
                                        </div>
                                    </div>

                                    <div className={styles.fundNav}>
                                        <span className={styles.navLabel}>NAV</span>
                                        <span className={styles.navValue}>₹{fund.nav.toFixed(2)}</span>
                                        <span className={`${styles.navChange} ${fund.navChange >= 0 ? styles.positive : styles.negative}`}>
                                            {fund.navChange >= 0 ? '+' : ''}{fund.navChange.toFixed(2)} ({fund.navChangePercent.toFixed(2)}%)
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.fundReturns}>
                                    <div className={styles.returnItem}>
                                        <span className={styles.returnLabel}>1Y Returns</span>
                                        <span className={`${styles.returnValue} ${fund.returns['1Y'] >= 0 ? styles.positive : styles.negative}`}>
                                            {fund.returns['1Y'] >= 0 ? '+' : ''}{fund.returns['1Y']}%
                                        </span>
                                    </div>
                                    <div className={styles.returnItem}>
                                        <span className={styles.returnLabel}>3Y Returns</span>
                                        <span className={`${styles.returnValue} ${fund.returns['3Y'] >= 0 ? styles.positive : styles.negative}`}>
                                            {fund.returns['3Y'] >= 0 ? '+' : ''}{fund.returns['3Y']}%
                                        </span>
                                    </div>
                                    <div className={styles.returnItem}>
                                        <span className={styles.returnLabel}>5Y Returns</span>
                                        <span className={`${styles.returnValue} ${fund.returns['5Y'] >= 0 ? styles.positive : styles.negative}`}>
                                            {fund.returns['5Y'] >= 0 ? '+' : ''}{fund.returns['5Y']}%
                                        </span>
                                    </div>
                                </div>

                                <button className={styles.investButton}>
                                    Invest Now
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>📭</span>
                            <p>No mutual funds found</p>
                            <span className={styles.emptyHint}>Try adjusting your filters</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
