'use client';

import React, { useMemo } from 'react';
import styles from './spendingTrend.module.css';
import LineChart from '@/components/charts/LineChart';

/**
 * SpendingTrend Component
 * Displays a line chart showing spending trends over time
 * 
 * @param {Object} props
 * @param {Array} props.expenses - Array of expense objects
 */
export default function SpendingTrend({ expenses = [] }) {
    // Process expenses to get daily totals for the line chart
    const trendData = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];

        // Group expenses by date
        const dailyTotals = {};
        
        expenses.forEach((exp) => {
            const date = exp.date;
            if (!dailyTotals[date]) {
                dailyTotals[date] = 0;
            }
            dailyTotals[date] += exp.amount;
        });

        // Convert to array and sort by date
        const sortedData = Object.entries(dailyTotals)
            .map(([date, amount]) => ({
                date: formatDate(date),
                rawDate: date,
                amount: parseFloat(amount.toFixed(2))
            }))
            .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

        // Take last 7 days of data
        return sortedData.slice(-7);
    }, [expenses]);

    // Calculate trend percentage
    const trendInfo = useMemo(() => {
        if (trendData.length < 2) {
            return { percentage: 0, isUp: false, text: 'Not enough data' };
        }

        const firstHalf = trendData.slice(0, Math.floor(trendData.length / 2));
        const secondHalf = trendData.slice(Math.floor(trendData.length / 2));

        const firstAvg = firstHalf.reduce((sum, d) => sum + d.amount, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, d) => sum + d.amount, 0) / secondHalf.length;

        if (firstAvg === 0) {
            return { percentage: 0, isUp: false, text: 'No previous data' };
        }

        const change = ((secondAvg - firstAvg) / firstAvg) * 100;
        const isUp = change > 0;

        return {
            percentage: Math.abs(change).toFixed(1),
            isUp,
            text: isUp ? 'Spending increased' : 'Spending decreased'
        };
    }, [trendData]);

    // Custom tooltip renderer
    const tooltipRenderer = ({ datum }) => ({
        content: `₹${datum.amount.toLocaleString('en-IN')}`
    });

    return (
        <div className={styles.trendCard}>
            <div className={styles.header}>
                <h3 className={styles.title}>Spending Trend</h3>
                <div className={`${styles.trendBadge} ${trendInfo.isUp ? styles.trendUp : styles.trendDown}`}>
                    <span className={styles.trendArrow}>
                        {trendInfo.isUp ? '↑' : '↓'}
                    </span>
                    <span className={styles.trendPercent}>{trendInfo.percentage}%</span>
                </div>
            </div>

            <p className={styles.subtitle}>Daily spending over last 7 days</p>

            {trendData.length > 0 ? (
                <div className={styles.chartWrapper}>
                    <LineChart
                        data={trendData}
                        xKey="date"
                        yKeys="amount"
                        height="200px"
                        showLegend={false}
                        showMarkers={true}
                        smooth={true}
                        strokeWidth={3}
                        colors={['#6366f1']}
                        tooltipRenderer={tooltipRenderer}
                        yAxisTitle=""
                        xAxisTitle=""
                    />
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📊</span>
                    <p>No expense data available</p>
                </div>
            )}

            <div className={styles.trendSummary}>
                <span className={styles.summaryText}>{trendInfo.text}</span>
                {trendData.length > 0 && (
                    <span className={styles.totalText}>
                        Total: ₹{trendData.reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                )}
            </div>
        </div>
    );
}

/**
 * Format date to readable format (e.g., "Jan 30")
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
