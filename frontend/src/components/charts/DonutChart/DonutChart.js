'use client';

import React, { useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import { defaultChartTheme, chartColors } from '../config/chartTheme';
import styles from './DonutChart.module.css';

/**
 * DonutChart Component
 * Enterprise-ready donut chart using AG Charts
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {string} props.angleKey - Key for angle (value) calculation
 * @param {string} props.legendKey - Key for legend labels
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {string} props.height - Chart height
 * @param {number} props.innerRadiusRatio - Inner radius ratio (0.4 to 0.8 recommended)
 * @param {boolean} props.showLegend - Show/hide legend
 * @param {boolean} props.showLabels - Show slice labels
 * @param {Array} props.colors - Custom color array
 * @param {Function} props.onSliceClick - Callback for slice clicks
 * @param {string} props.legendPosition - Legend position
 * @param {string} props.centerLabel - Text to show in center of donut
 * @param {string} props.centerValue - Value to show in center of donut
 */
export default function DonutChart({
    data = [],
    angleKey = 'value',
    legendKey = 'label',
    title = '',
    subtitle = '',
    height = '300px',
    innerRadiusRatio = 0.6,
    showLegend = true,
    showLabels = false,
    colors = chartColors.primary,
    onSliceClick,
    legendPosition = 'right',
    centerLabel = '',
    centerValue = '',
    tooltipRenderer,
}) {
    // Calculate total for center display
    const total = useMemo(() => {
        return data.reduce((sum, item) => sum + (item[angleKey] || 0), 0);
    }, [data, angleKey]);

    // Build chart options
    const chartOptions = useMemo(() => ({
        theme: defaultChartTheme,
        data,
        title: title ? { text: title } : undefined,
        subtitle: subtitle ? { text: subtitle } : undefined,
        series: [
            {
                type: 'donut',
                angleKey,
                legendItemKey: legendKey,
                innerRadiusRatio,
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
                calloutLabel: {
                    enabled: false,
                },
                innerLabels: centerLabel || centerValue
                    ? [
                          {
                              text: centerValue || total.toLocaleString(),
                              fontSize: 24,
                              fontWeight: 700,
                              color: '#1F2937',
                          },
                          {
                              text: centerLabel || 'Total',
                              fontSize: 12,
                              color: '#6B7280',
                          },
                      ]
                    : [],
                tooltip: tooltipRenderer
                    ? { renderer: tooltipRenderer }
                    : {
                          renderer: ({ datum, angleKey, legendItemKey }) => {
                              const percentage = ((datum[angleKey] / total) * 100).toFixed(1);
                              return {
                                  title: datum[legendItemKey || legendKey],
                                  content: `${datum[angleKey].toLocaleString()} (${percentage}%)`,
                              };
                          },
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
    }), [data, title, subtitle, angleKey, legendKey, innerRadiusRatio, colors, showLabels, centerLabel, centerValue, total, tooltipRenderer, onSliceClick, showLegend, legendPosition]);

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
