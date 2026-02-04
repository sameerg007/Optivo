'use client';

import React, { useState, useMemo } from 'react';
import styles from './mutualFunds.module.css';
import MarketIndices from './MarketIndices';
import Button from '@/components/common/Button';
import { MF_CATEGORIES, SAMPLE_MUTUAL_FUNDS } from './config';

/**
 * MutualFunds Component
 * Main container for mutual funds section - Clean professional design
 */
export default function MutualFunds() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('returns'); // returns, nav, rating

    // Filter and sort mutual funds
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

        // Sort
        if (sortBy === 'returns') {
            funds.sort((a, b) => b.returns['1Y'] - a.returns['1Y']);
        } else if (sortBy === 'nav') {
            funds.sort((a, b) => b.nav - a.nav);
        } else if (sortBy === 'rating') {
            funds.sort((a, b) => b.rating - a.rating);
        }

        return funds;
    }, [selectedCategory, searchQuery, sortBy]);

    // Get risk badge style
    const getRiskStyle = (risk) => {
        switch (risk) {
            case 'Low': return styles.riskLow;
            case 'Moderate': return styles.riskModerate;
            case 'High': return styles.riskHigh;
            case 'Very High': return styles.riskVeryHigh;
            default: return '';
        }
    };

    return (
        <div className={styles.mutualFundsContainer}>
            {/* Market Indices Header */}
            <MarketIndices />

            {/* Controls Bar */}
            <div className={styles.controlsBar}>
                {/* Search */}
                <div className={styles.searchWrapper}>
                    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search funds"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button 
                            className={styles.clearSearch}
                            onClick={() => setSearchQuery('')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Sort Dropdown */}
                <div className={styles.sortWrapper}>
                    <label className={styles.sortLabel}>Sort by</label>
                    <select 
                        className={styles.sortSelect}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="returns">1Y Returns</option>
                        <option value="nav">NAV</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className={styles.categoryFilter}>
                <button
                    className={`${styles.categoryPill} ${selectedCategory === 'all' ? styles.categoryPillActive : ''}`}
                    onClick={() => setSelectedCategory('all')}
                >
                    All
                </button>
                {Object.entries(MF_CATEGORIES).map(([key, category]) => (
                    <button
                        key={key}
                        className={`${styles.categoryPill} ${selectedCategory === key ? styles.categoryPillActive : ''}`}
                        onClick={() => setSelectedCategory(key)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Results Header */}
            <div className={styles.resultsHeader}>
                <span className={styles.resultsCount}>
                    {filteredFunds.length} {filteredFunds.length === 1 ? 'fund' : 'funds'}
                </span>
            </div>

            {/* Funds Table/List */}
            <div className={styles.fundsTable}>
                {/* Table Header */}
                <div className={styles.tableHeader}>
                    <div className={styles.colFund}>Fund</div>
                    <div className={styles.colNav}>NAV</div>
                    <div className={styles.colReturns}>1Y</div>
                    <div className={styles.colReturns}>3Y</div>
                    <div className={styles.colReturns}>5Y</div>
                    <div className={styles.colAction}></div>
                </div>

                {/* Table Body */}
                <div className={styles.tableBody}>
                    {filteredFunds.length > 0 ? (
                        filteredFunds.map((fund) => (
                            <div key={fund.id} className={styles.fundRow}>
                                {/* Fund Info */}
                                <div className={styles.colFund}>
                                    <div className={styles.fundDetails}>
                                        <span className={styles.fundName}>{fund.name}</span>
                                        <div className={styles.fundMeta}>
                                            <span className={styles.fundType}>
                                                {MF_CATEGORIES[fund.category]?.name}
                                            </span>
                                            <span className={styles.separator}>•</span>
                                            <span className={`${styles.fundRisk} ${getRiskStyle(fund.riskLevel)}`}>
                                                {fund.riskLevel}
                                            </span>
                                            <span className={styles.separator}>•</span>
                                            <span className={styles.fundRating}>
                                                {'★'.repeat(fund.rating)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* NAV */}
                                <div className={styles.colNav}>
                                    <span className={styles.navValue}>₹{fund.nav.toFixed(2)}</span>
                                    <span className={`${styles.navChange} ${fund.navChange >= 0 ? styles.positive : styles.negative}`}>
                                        {fund.navChange >= 0 ? '+' : ''}{fund.navChangePercent.toFixed(2)}%
                                    </span>
                                </div>

                                {/* Returns */}
                                <div className={styles.colReturns}>
                                    <span className={`${styles.returnValue} ${fund.returns['1Y'] >= 0 ? styles.positive : styles.negative}`}>
                                        {fund.returns['1Y'] >= 0 ? '+' : ''}{fund.returns['1Y']}%
                                    </span>
                                </div>
                                <div className={styles.colReturns}>
                                    <span className={`${styles.returnValue} ${fund.returns['3Y'] >= 0 ? styles.positive : styles.negative}`}>
                                        {fund.returns['3Y'] >= 0 ? '+' : ''}{fund.returns['3Y']}%
                                    </span>
                                </div>
                                <div className={styles.colReturns}>
                                    <span className={`${styles.returnValue} ${fund.returns['5Y'] >= 0 ? styles.positive : styles.negative}`}>
                                        {fund.returns['5Y'] >= 0 ? '+' : ''}{fund.returns['5Y']}%
                                    </span>
                                </div>

                                {/* Action */}
                                <div className={styles.colAction}>
                                    <button className={styles.investBtn}>
                                        Invest
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <p className={styles.emptyTitle}>No funds found</p>
                            <span className={styles.emptyHint}>Try adjusting your search or filters</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
