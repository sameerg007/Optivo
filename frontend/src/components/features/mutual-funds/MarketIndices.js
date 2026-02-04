'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './marketIndices.module.css';
import { MARKET_INDICES, MOCK_MARKET_DATA, getMarketStatus, MARKET_STATUS } from './config';

/**
 * MarketIndices Component
 * Displays Nifty, Sensex, and Bank Nifty values similar to Zerodha/Groww
 */
export default function MarketIndices() {
    const [marketData, setMarketData] = useState(MOCK_MARKET_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Get market status
    const marketStatus = useMemo(() => getMarketStatus(), []);

    // Simulate real-time updates (in production, this would be WebSocket or polling)
    useEffect(() => {
        const interval = setInterval(() => {
            if (marketStatus === MARKET_STATUS.OPEN) {
                // Simulate small random changes
                setMarketData(prev => {
                    const updated = { ...prev };
                    Object.keys(updated).forEach(key => {
                        const randomChange = (Math.random() - 0.5) * 10;
                        const newValue = updated[key].value + randomChange;
                        const change = newValue - updated[key].previousClose;
                        const changePercent = (change / updated[key].previousClose) * 100;
                        
                        updated[key] = {
                            ...updated[key],
                            value: parseFloat(newValue.toFixed(2)),
                            change: parseFloat(change.toFixed(2)),
                            changePercent: parseFloat(changePercent.toFixed(2)),
                            lastUpdated: new Date().toISOString()
                        };
                    });
                    return updated;
                });
                setLastUpdated(new Date());
            }
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, [marketStatus]);

    const formatValue = (value) => {
        return value.toLocaleString('en-IN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    };

    const formatChange = (change, changePercent) => {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
    };

    const getStatusColor = () => {
        switch (marketStatus) {
            case MARKET_STATUS.OPEN:
                return styles.statusOpen;
            case MARKET_STATUS.PRE_OPEN:
                return styles.statusPreOpen;
            default:
                return styles.statusClosed;
        }
    };

    const getStatusText = () => {
        switch (marketStatus) {
            case MARKET_STATUS.OPEN:
                return 'Market Open';
            case MARKET_STATUS.PRE_OPEN:
                return 'Pre-Market';
            default:
                return 'Market Closed';
        }
    };

    return (
        <div className={styles.marketIndicesContainer}>
            {/* Market Status Indicator */}
            <div className={styles.marketStatus}>
                <span className={`${styles.statusDot} ${getStatusColor()}`}></span>
                <span className={styles.statusText}>{getStatusText()}</span>
            </div>

            {/* Indices */}
            <div className={styles.indicesList}>
                {/* NIFTY 50 */}
                <div className={styles.indexCard}>
                    <div className={styles.indexName}>
                        <span className={styles.indexLabel}>NIFTY 50</span>
                    </div>
                    <div className={styles.indexValue}>
                        <span className={styles.value}>{formatValue(marketData.nifty_50.value)}</span>
                        <span className={`${styles.change} ${marketData.nifty_50.change >= 0 ? styles.positive : styles.negative}`}>
                            {formatChange(marketData.nifty_50.change, marketData.nifty_50.changePercent)}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider}></div>

                {/* SENSEX */}
                <div className={styles.indexCard}>
                    <div className={styles.indexName}>
                        <span className={styles.indexLabel}>SENSEX</span>
                    </div>
                    <div className={styles.indexValue}>
                        <span className={styles.value}>{formatValue(marketData.sensex.value)}</span>
                        <span className={`${styles.change} ${marketData.sensex.change >= 0 ? styles.positive : styles.negative}`}>
                            {formatChange(marketData.sensex.change, marketData.sensex.changePercent)}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider}></div>

                {/* BANK NIFTY */}
                <div className={styles.indexCard}>
                    <div className={styles.indexName}>
                        <span className={styles.indexLabel}>BANK NIFTY</span>
                    </div>
                    <div className={styles.indexValue}>
                        <span className={styles.value}>{formatValue(marketData.nifty_bank.value)}</span>
                        <span className={`${styles.change} ${marketData.nifty_bank.change >= 0 ? styles.positive : styles.negative}`}>
                            {formatChange(marketData.nifty_bank.change, marketData.nifty_bank.changePercent)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Last Updated */}
            <div className={styles.lastUpdated}>
                <span>Updated: {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
}
