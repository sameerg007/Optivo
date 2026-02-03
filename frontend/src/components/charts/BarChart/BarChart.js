'use client';

import React, { useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import { defaultChartTheme, chartColors } from '../config/chartTheme';
import styles from './BarChart.module.css';

/**
 * BarChart Component
 * Enterprise-ready bar chart using AG Charts
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {string} props.xKey - Key for x-axis (category) values
 * @param {Array|string} props.yKeys - Key(s) for y-axis values
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {string} props.direction - 'vertical' or 'horizontal'
 * @param {boolean} props.stacked - Enable stacked bars
 * @param {boolean} props.grouped - Enable grouped bars
 * @param {string} props.height - Chart height
 * @param {boolean} props.showLegend - Show/hide legend
 * @param {boolean} props.showValues - Show values on bars
 * @param {Array} props.colors - Custom color array
 * @param {Function} props.onBarClick - Callback for bar clicks
 * @param {number} props.cornerRadius - Bar corner radius
 */
export default function BarChart({
    data = [],
    xKey = 'category',
    yKeys = ['value'],
    title = '',
    subtitle = '',
    direction = 'vertical',
    stacked = false,
    grouped = false,
    height = '300px',
    showLegend = true,
    showValues = false,
    colors = chartColors.primary,
    onBarClick,
    cornerRadius = 4,
    xAxisTitle = '',
    yAxisTitle = '',
    tooltipRenderer,
}) {
    // Normalize yKeys to array
    const normalizedYKeys = Array.isArray(yKeys) ? yKeys : [yKeys];
    const isHorizontal = direction === 'horizontal';

    // Build series configuration
    const series = useMemo(() => {
        return normalizedYKeys.map((yKey, index) => ({
            type: 'bar',
            xKey,
            yKey,
            yName: yKey.charAt(0).toUpperCase() + yKey.slice(1).replace(/([A-Z])/g, ' $1'),
            fill: colors[index % colors.length],
            stroke: colors[index % colors.length],
            cornerRadius,
            stacked: stacked,
            grouped: grouped && !stacked,
            direction: isHorizontal ? 'horizontal' : 'vertical',
            label: showValues
                ? {
                      enabled: true,
                      formatter: ({ value }) => value.toLocaleString(),
                      placement: 'inside',
                      color: '#FFFFFF',
                  }
                : undefined,
            tooltip: tooltipRenderer
                ? { renderer: tooltipRenderer }
                : {
                      renderer: ({ datum, xKey, yKey }) => ({
                          title: datum[xKey],
                          content: `${yKey}: ${datum[yKey].toLocaleString()}`,
                      }),
                  },
            listeners: onBarClick
                ? {
                      nodeClick: (event) => onBarClick(event.datum, event),
                  }
                : undefined,
        }));
    }, [normalizedYKeys, xKey, colors, cornerRadius, stacked, grouped, isHorizontal, showValues, tooltipRenderer, onBarClick]);

    // Build chart options
    const chartOptions = useMemo(() => ({
        theme: defaultChartTheme,
        data,
        title: title ? { text: title } : undefined,
        subtitle: subtitle ? { text: subtitle } : undefined,
        series,
        axes: isHorizontal
            ? [
                  {
                      type: 'number',
                      position: 'bottom',
                      title: yAxisTitle ? { text: yAxisTitle } : undefined,
                      label: {
                          formatter: ({ value }) => value.toLocaleString(),
                      },
                  },
                  {
                      type: 'category',
                      position: 'left',
                      title: xAxisTitle ? { text: xAxisTitle } : undefined,
                  },
              ]
            : [
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
    }), [data, title, subtitle, series, isHorizontal, xAxisTitle, yAxisTitle, showLegend, normalizedYKeys.length]);

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
