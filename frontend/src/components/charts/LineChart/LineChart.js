'use client';

import React, { useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import '@/components/charts/config/chartRegistry'; // Register AG Charts modules
import { defaultChartTheme, chartColors } from '../config/chartTheme';
import styles from './LineChart.module.css';

/**
 * LineChart Component
 * Enterprise-ready line chart using AG Charts
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {string} props.xKey - Key for x-axis values
 * @param {Array|string} props.yKeys - Key(s) for y-axis values (single string or array for multiple lines)
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {Object} props.options - Additional chart options
 * @param {string} props.height - Chart height (default: '300px')
 * @param {boolean} props.showLegend - Show/hide legend
 * @param {boolean} props.showMarkers - Show/hide data point markers
 * @param {Array} props.colors - Custom color array
 * @param {Function} props.onDataPointClick - Callback for data point clicks
 * @param {Object} props.tooltipRenderer - Custom tooltip renderer
 */
export default function LineChart({
    data = [],
    xKey = 'date',
    yKeys = ['value'],
    title = '',
    subtitle = '',
    options = {},
    height = '300px',
    showLegend = true,
    showMarkers = true,
    colors = chartColors.primary,
    onDataPointClick,
    tooltipRenderer,
    xAxisTitle = '',
    yAxisTitle = '',
    strokeWidth = 2,
    smooth = false,
}) {
    // Normalize yKeys to array
    const normalizedYKeys = Array.isArray(yKeys) ? yKeys : [yKeys];

    // Build series configuration
    const series = useMemo(() => {
        return normalizedYKeys.map((yKey, index) => ({
            type: 'line',
            xKey,
            yKey,
            yName: yKey.charAt(0).toUpperCase() + yKey.slice(1).replace(/([A-Z])/g, ' $1'),
            stroke: colors[index % colors.length],
            strokeWidth,
            marker: {
                enabled: showMarkers,
                fill: colors[index % colors.length],
                stroke: colors[index % colors.length],
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
    }, [normalizedYKeys, xKey, colors, showMarkers, strokeWidth, smooth, tooltipRenderer, onDataPointClick]);

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
                    formatter: ({ value }) => value.toLocaleString(),
                },
            },
        ],
        legend: {
            enabled: showLegend && normalizedYKeys.length > 1,
            position: 'bottom',
        },
        ...options,
    }), [data, title, subtitle, series, xAxisTitle, yAxisTitle, showLegend, normalizedYKeys.length, options]);

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
