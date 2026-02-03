'use client';

import React, { useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import { defaultChartTheme, chartColors } from '../config/chartTheme';
import styles from './PieChart.module.css';

/**
 * PieChart Component
 * Enterprise-ready pie chart using AG Charts
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {string} props.angleKey - Key for angle (value) calculation
 * @param {string} props.legendKey - Key for legend labels
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {string} props.height - Chart height
 * @param {boolean} props.showLegend - Show/hide legend
 * @param {boolean} props.showLabels - Show slice labels
 * @param {boolean} props.showCallouts - Show callout labels
 * @param {Array} props.colors - Custom color array
 * @param {Function} props.onSliceClick - Callback for slice clicks
 * @param {string} props.legendPosition - Legend position: 'right', 'bottom', 'left', 'top'
 */
export default function PieChart({
    data = [],
    angleKey = 'value',
    legendKey = 'label',
    title = '',
    subtitle = '',
    height = '300px',
    showLegend = true,
    showLabels = false,
    showCallouts = true,
    colors = chartColors.primary,
    onSliceClick,
    legendPosition = 'right',
    tooltipRenderer,
}) {
    // Build chart options
    const chartOptions = useMemo(() => ({
        theme: defaultChartTheme,
        data,
        title: title ? { text: title } : undefined,
        subtitle: subtitle ? { text: subtitle } : undefined,
        series: [
            {
                type: 'pie',
                angleKey,
                legendItemKey: legendKey,
                fills: colors,
                strokes: colors.map(() => '#FFFFFF'),
                strokeWidth: 2,
                sectorLabel: showLabels
                    ? {
                          enabled: true,
                          color: '#FFFFFF',
                          fontWeight: 600,
                          formatter: ({ datum }) => `${datum[angleKey].toLocaleString()}`,
                      }
                    : { enabled: false },
                calloutLabel: showCallouts
                    ? {
                          enabled: true,
                          formatter: ({ datum }) => datum[legendKey],
                      }
                    : { enabled: false },
                calloutLine: showCallouts
                    ? {
                          strokeWidth: 1,
                          colors: chartColors.neutral,
                      }
                    : { strokeWidth: 0 },
                tooltip: tooltipRenderer
                    ? { renderer: tooltipRenderer }
                    : {
                          renderer: ({ datum, angleKey, legendItemKey }) => ({
                              title: datum[legendItemKey || legendKey],
                              content: `${datum[angleKey].toLocaleString()}`,
                          }),
                      },
                listeners: onSliceClick
                    ? {
                          nodeClick: (event) => onSliceClick(event.datum, event),
                      }
                    : undefined,
            },
        ],
        legend: {
            enabled: showLegend,
            position: legendPosition,
        },
    }), [data, title, subtitle, angleKey, legendKey, colors, showLabels, showCallouts, tooltipRenderer, onSliceClick, showLegend, legendPosition]);

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
