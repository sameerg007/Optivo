'use client';

import React, { useState, useMemo, useEffect } from 'react';
import styles from './mutualFunds.module.css';
import MarketIndices from './MarketIndices';
import { MF_CATEGORIES, SAMPLE_MUTUAL_FUNDS } from './config';
import { 
    getPopularFunds, 
    searchFunds
} from '@/services/api/mutualFunds.service';

/**
 * MutualFunds Component
 * Main container for mutual funds section - Fetches real data from Yahoo Finance API
 */
export default function MutualFunds() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('returns');
    
    // API State
    const [funds, setFunds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [useRealData, setUseRealData] = useState(true);

    // Map API category to our category keys
    const mapCategory = (apiCategory) => {
        if (!apiCategory) return 'equity';
        const cat = apiCategory.toLowerCase();
        if (cat.includes('large cap')) return 'equity';
        if (cat.includes('mid cap')) return 'equity';
        if (cat.includes('small cap')) return 'equity';
        if (cat.includes('flexi')) return 'equity';
        if (cat.includes('elss')) return 'elss';
        if (cat.includes('index')) return 'index';
        if (cat.includes('debt')) return 'debt';
        if (cat.includes('liquid')) return 'liquid';
        if (cat.includes('hybrid')) return 'hybrid';
        return 'equity';
    };

    // Calculate rating based on returns
    const calculateRating = (fund) => {
        const oneYearReturn = fund.one_year_return || 0;
        if (oneYearReturn >= 20) return 5;
        if (oneYearReturn >= 15) return 4;
        if (oneYearReturn >= 10) return 3;
        if (oneYearReturn >= 5) return 2;
        return 1;
    };

    // Get risk level based on category
    const getRiskLevelFromCategory = (category) => {
        if (!category) return 'Moderate';
        const cat = category.toLowerCase();
        if (cat.includes('small')) return 'Very High';
        if (cat.includes('mid')) return 'High';
        if (cat.includes('large')) return 'Moderate';
        if (cat.includes('elss')) return 'High';
        if (cat.includes('index')) return 'Moderate';
        if (cat.includes('debt') || cat.includes('liquid')) return 'Low';
        return 'Moderate';
    };

    // Format large numbers
    const formatLargeNumber = (value) => {
        if (!value) return '-';
        if (value >= 10000000) {
            return `₹${(value / 10000000).toFixed(0)} Cr`;
        } else if (value >= 100000) {
            return `₹${(value / 100000).toFixed(0)} L`;
        }
        return `₹${value.toLocaleString('en-IN')}`;
    };

    // Fetch funds from API
    useEffect(() => {
        const fetchFunds = async () => {
            if (!useRealData) {
                setFunds(SAMPLE_MUTUAL_FUNDS);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                const response = await getPopularFunds();
                
                if (response.success && response.data?.funds) {
                    const transformedFunds = response.data.funds.map((fund) => ({
                        id: fund.symbol,
                        symbol: fund.symbol,
                        name: fund.name || fund.symbol,
                        category: mapCategory(fund.category),
                        nav: fund.nav || 0,
                        navChange: fund.day_change || 0,
                        navChangePercent: fund.day_change_percent || 0,
                        aum: fund.total_assets ? formatLargeNumber(fund.total_assets) : '-',
                        returns: {
                            '1Y': fund.one_year_return || 0,
                            '3Y': fund.three_year_return || 0,
                            '5Y': fund.five_year_return || 0
                        },
                        rating: calculateRating(fund),
                        riskLevel: getRiskLevelFromCategory(fund.category),
                        fundFamily: fund.fund_family
                    }));
                    
                    setFunds(transformedFunds);
                } else {
                    console.warn('Using sample data - API returned no funds');
                    setFunds(SAMPLE_MUTUAL_FUNDS);
                }
            } catch (err) {
                console.error('Failed to fetch funds:', err);
                setError('Unable to fetch live data. Showing sample data.');
                setFunds(SAMPLE_MUTUAL_FUNDS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFunds();
    }, [useRealData]);

    // Filter and sort mutual funds
    const filteredFunds = useMemo(() => {
        let result = [...funds];

        if (selectedCategory !== 'all') {
            result = result.filter(fund => fund.category === selectedCategory);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(fund => 
                fund.name.toLowerCase().includes(query) ||
                (fund.fundFamily && fund.fundFamily.toLowerCase().includes(query))
            );
        }

        if (sortBy === 'returns') {
            result.sort((a, b) => (b.returns['1Y'] || 0) - (a.returns['1Y'] || 0));
        } else if (sortBy === 'nav') {
            result.sort((a, b) => (b.nav || 0) - (a.nav || 0));
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [funds, selectedCategory, searchQuery, sortBy]);

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

            {/* Error Banner */}
            {error && (
                <div className={styles.errorBanner}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

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

                {/* Live Data Toggle */}
                <div className={styles.dataToggle}>
                    <label className={styles.toggleLabel}>
                        <input
                            type="checkbox"
                            checked={useRealData}
                            onChange={(e) => setUseRealData(e.target.checked)}
                            className={styles.toggleInput}
                        />
                        <span className={styles.toggleSwitch}></span>
                        <span className={styles.toggleText}>Live</span>
                    </label>
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
                    {isLoading ? 'Loading...' : `${filteredFunds.length} ${filteredFunds.length === 1 ? 'fund' : 'funds'}`}
                </span>
                {useRealData && !isLoading && !error && (
                    <span className={styles.liveIndicator}>
                        <span className={styles.liveDot}></span>
                        Live from Yahoo Finance
                    </span>
                )}
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

                {/* Loading State */}
                {isLoading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Fetching mutual fund data...</p>
                    </div>
                ) : (
                    /* Table Body */
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
                                                    {MF_CATEGORIES[fund.category]?.name || fund.category}
                                                </span>
                                                <span className={styles.separator}>•</span>
                                                <span className={`${styles.fundRisk} ${getRiskStyle(fund.riskLevel)}`}>
                                                    {fund.riskLevel}
                                                </span>
                                                <span className={styles.separator}>•</span>
                                                <span className={styles.fundRating}>
                                                    {'★'.repeat(fund.rating)}{'☆'.repeat(5 - fund.rating)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* NAV */}
                                    <div className={styles.colNav}>
                                        <span className={styles.navValue}>
                                            {fund.nav ? `₹${fund.nav.toFixed(2)}` : '-'}
                                        </span>
                                        <span className={`${styles.navChange} ${(fund.navChangePercent || 0) >= 0 ? styles.positive : styles.negative}`}>
                                            {fund.navChangePercent != null
                                                ? `${fund.navChangePercent >= 0 ? '+' : ''}${fund.navChangePercent.toFixed(2)}%`
                                                : '-'
                                            }
                                        </span>
                                    </div>

                                    {/* Returns */}
                                    <div className={styles.colReturns}>
                                        <span className={`${styles.returnValue} ${(fund.returns['1Y'] || 0) >= 0 ? styles.positive : styles.negative}`}>
                                            {fund.returns['1Y'] ? `${fund.returns['1Y'] >= 0 ? '+' : ''}${fund.returns['1Y'].toFixed ? fund.returns['1Y'].toFixed(1) : fund.returns['1Y']}%` : '-'}
                                        </span>
                                    </div>
                                    <div className={styles.colReturns}>
                                        <span className={`${styles.returnValue} ${(fund.returns['3Y'] || 0) >= 0 ? styles.positive : styles.negative}`}>
                                            {fund.returns['3Y'] ? `${fund.returns['3Y'] >= 0 ? '+' : ''}${fund.returns['3Y'].toFixed ? fund.returns['3Y'].toFixed(1) : fund.returns['3Y']}%` : '-'}
                                        </span>
                                    </div>
                                    <div className={styles.colReturns}>
                                        <span className={`${styles.returnValue} ${(fund.returns['5Y'] || 0) >= 0 ? styles.positive : styles.negative}`}>
                                            {fund.returns['5Y'] ? `${fund.returns['5Y'] >= 0 ? '+' : ''}${fund.returns['5Y'].toFixed ? fund.returns['5Y'].toFixed(1) : fund.returns['5Y']}%` : '-'}
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
                )}
            </div>
        </div>
    );
}
