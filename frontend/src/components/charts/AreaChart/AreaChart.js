'use client';

import React, { useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import '@/components/charts/config/chartRegistry'; // Register AG Charts modules
import { defaultChartTheme, chartColors } from '../config/chartTheme';
import styles from './AreaChart.module.css';

/**
 * AreaChart Component
 * Enterprise-ready area chart using AG Charts
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {string} props.xKey - Key for x-axis values
 * @param {Array|string} props.yKeys - Key(s) for y-axis values
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {string} props.height - Chart height
 * @param {boolean} props.stacked - Enable stacked areas
 * @param {boolean} props.showLegend - Show/hide legend
 * @param {boolean} props.showMarkers - Show/hide data point markers
 * @param {Array} props.colors - Custom color array
 * @param {number} props.fillOpacity - Area fill opacity (0-1)
 * @param {Function} props.onDataPointClick - Callback for data point clicks
 */
export default function AreaChart({
    data = [],
    xKey = 'date',
    yKeys = ['value'],
    title = '',
    subtitle = '',
    height = '300px',
    stacked = false,
    normalized = false,
    showLegend = true,
    showMarkers = false,
    colors = chartColors.primary,
    fillOpacity = 0.3,
    onDataPointClick,
    xAxisTitle = '',
    yAxisTitle = '',
    tooltipRenderer,
    smooth = true,
}) {
    // Normalize yKeys to array
    const normalizedYKeys = Array.isArray(yKeys) ? yKeys : [yKeys];

    // Build series configuration
    const series = useMemo(() => {
        return normalizedYKeys.map((yKey, index) => ({
            type: 'area',
            xKey,
            yKey,
            yName: yKey.charAt(0).toUpperCase() + yKey.slice(1).replace(/([A-Z])/g, ' $1'),
            fill: colors[index % colors.length],
            stroke: colors[index % colors.length],
            fillOpacity,
            strokeWidth: 2,
            stacked,
            normalizedTo: normalized ? 100 : undefined,
            marker: {
                enabled: showMarkers,
                fill: colors[index % colors.length],
                stroke: '#FFFFFF',
                strokeWidth: 2,
                size: 6,
            },
            interpolation: smooth ? { type: 'smooth' } : undefined,
            tooltip: tooltipRenderer
                ? { renderer: tooltipRenderer }
                : {
                      renderer: ({ datum, xKey, yKey }) => ({
                          content: `${datum[xKey]}: ${datum[yKey].toLocaleString()}`,
                      }),
                  },
            listeners: onDataPointClick
                ? {
                      nodeClick: (event) => onDataPointClick(event.datum, event),
                  }
                : undefined,
        }));
    }, [normalizedYKeys, xKey, colors, fillOpacity, stacked, normalized, showMarkers, smooth, tooltipRenderer, onDataPointClick]);

    // Build chart options
    const chartOptions = useMemo(() => ({
        theme: defaultChartTheme,
        data,
        title: title ? { text: title } : undefined,
        subtitle: subtitle ? { text: subtitle } : undefined,
        series,
        axes: [
            {
                type: 'category',
                position: 'bottom',
                title: xAxisTitle ? { text: xAxisTitle } : undefined,
            },
            {
                type: 'number',
                position: 'left',
                title: yAxisTitle ? { text: yAxisTitle } : undefined,
                label: {
                    formatter: ({ value }) => normalized ? `${value}%` : value.toLocaleString(),
                },
            },
        ],
        legend: {
            enabled: showLegend && normalizedYKeys.length > 1,
            position: 'bottom',
        },
    }), [data, title, subtitle, series, xAxisTitle, yAxisTitle, normalized, showLegend, normalizedYKeys.length]);

    if (!data || data.length === 0) {
        return (
            <div className={styles.emptyState} style={{ height }}>
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div className={styles.chartContainer} style={{ height }}>
            <AgCharts options={chartOptions} />
        </div>
    );
}
