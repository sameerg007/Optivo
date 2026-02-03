'use client';

import React, { useState, useMemo } from 'react';
import styles from './spendingTrend.module.css';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';

// Chart view types
const CHART_VIEWS = {
    LINE: 'line',
    PIE: 'pie'
};

/**
 * SpendingTrend Component
 * Displays spending trends with toggle between line and pie chart
 * 
 * @param {Object} props
 * @param {Array} props.expenses - Array of expense objects
 * @param {Object} props.categories - Categories configuration
 */
export default function SpendingTrend({ expenses = [], categories = {} }) {
    const [chartView, setChartView] = useState(CHART_VIEWS.LINE);
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

    // Process expenses for pie chart (by category)
    const pieData = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];

        const categoryTotals = {};
        expenses.forEach((exp) => {
            if (!categoryTotals[exp.category]) {
                categoryTotals[exp.category] = 0;
            }
            categoryTotals[exp.category] += exp.amount;
        });

        return Object.entries(categoryTotals)
            .map(([category, amount]) => ({
                category: categories[category]?.name || category,
                amount: parseFloat(amount.toFixed(2)),
                color: categories[category]?.color || '#64748b'
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [expenses, categories]);

    // Pie chart tooltip renderer
    const pieTooltipRenderer = ({ datum }) => ({
        content: `${datum.category}: ₹${datum.amount.toLocaleString('en-IN')}`
    });

    return (
        <div className={styles.trendCard}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h3 className={styles.title}>
                        {chartView === CHART_VIEWS.LINE ? 'Spending Trend' : 'Category Breakdown'}
                    </h3>
                    <div className={`${styles.trendBadge} ${trendInfo.isUp ? styles.trendUp : styles.trendDown}`}>
                        <span className={styles.trendArrow}>
                            {trendInfo.isUp ? '↑' : '↓'}
                        </span>
                        <span className={styles.trendPercent}>{trendInfo.percentage}%</span>
                    </div>
                </div>
                
                {/* Chart Toggle Icons */}
                <div className={styles.chartToggle}>
                    <button
                        className={`${styles.toggleButton} ${chartView === CHART_VIEWS.LINE ? styles.toggleActive : ''}`}
                        onClick={() => setChartView(CHART_VIEWS.LINE)}
                        title="Line Chart"
                        aria-label="Switch to line chart"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    </button>
                    <button
                        className={`${styles.toggleButton} ${chartView === CHART_VIEWS.PIE ? styles.toggleActive : ''}`}
                        onClick={() => setChartView(CHART_VIEWS.PIE)}
                        title="Pie Chart"
                        aria-label="Switch to pie chart"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                            <path d="M22 12A10 10 0 0 0 12 2v10z" />
                        </svg>
                    </button>
                </div>
            </div>

            <p className={styles.subtitle}>
                {chartView === CHART_VIEWS.LINE 
                    ? 'Daily spending over last 7 days' 
                    : 'Spending distribution by category'}
            </p>

            {/* Line Chart View */}
            {chartView === CHART_VIEWS.LINE && (
                trendData.length > 0 ? (
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
                )
            )}

            {/* Pie Chart View */}
            {chartView === CHART_VIEWS.PIE && (
                pieData.length > 0 ? (
                    <div className={styles.chartWrapper}>
                        <PieChart
                            data={pieData}
                            angleKey="amount"
                            labelKey="category"
                            height="200px"
                            showLegend={false}
                            colors={pieData.map(d => d.color)}
                            tooltipRenderer={pieTooltipRenderer}
                            innerRadiusRatio={0}
                        />
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>📊</span>
                        <p>No expense data available</p>
                    </div>
                )
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
