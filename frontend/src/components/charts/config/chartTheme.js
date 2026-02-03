// AG Charts - Global Theme Configuration
// Customize colors, fonts, and styling for enterprise consistency

export const chartColors = {
    primary: ['#4F46E5', '#7C3AED', '#2563EB', '#0891B2', '#059669', '#D97706'],
    secondary: ['#6366F1', '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B'],
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    neutral: ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6'],
};

export const defaultChartTheme = {
    palette: {
        fills: chartColors.primary,
        strokes: chartColors.primary,
    },
    overrides: {
        common: {
            title: {
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#1F2937',
            },
            subtitle: {
                fontSize: 12,
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#6B7280',
            },
            legend: {
                item: {
                    label: {
                        fontSize: 12,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        color: '#374151',
                    },
                },
                spacing: 20,
            },
            axes: {
                category: {
                    label: {
                        fontSize: 11,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        color: '#6B7280',
                    },
                    line: {
                        stroke: '#E5E7EB',
                    },
                    tick: {
                        stroke: '#E5E7EB',
                    },
                },
                number: {
                    label: {
                        fontSize: 11,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        color: '#6B7280',
                    },
                    line: {
                        stroke: '#E5E7EB',
                    },
                    tick: {
                        stroke: '#E5E7EB',
                    },
                    gridLine: {
                        stroke: '#F3F4F6',
                    },
                },
            },
        },
        bar: {
            series: {
                cornerRadius: 4,
                strokeWidth: 0,
            },
        },
        line: {
            series: {
                strokeWidth: 2,
                marker: {
                    enabled: true,
                    size: 6,
                    strokeWidth: 2,
                },
            },
        },
        area: {
            series: {
                strokeWidth: 2,
                fillOpacity: 0.3,
                marker: {
                    enabled: false,
                },
            },
        },
        pie: {
            series: {
                strokeWidth: 2,
                stroke: '#FFFFFF',
                calloutLabel: {
                    fontSize: 11,
                    fontFamily: 'Inter, system-ui, sans-serif',
                },
                sectorLabel: {
                    fontSize: 11,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: '#FFFFFF',
                },
            },
        },
        donut: {
            series: {
                strokeWidth: 2,
                stroke: '#FFFFFF',
                innerRadiusRatio: 0.6,
            },
        },
    },
};

// Dark theme variant
export const darkChartTheme = {
    ...defaultChartTheme,
    overrides: {
        ...defaultChartTheme.overrides,
        common: {
            ...defaultChartTheme.overrides.common,
            background: {
                fill: '#1F2937',
            },
            title: {
                ...defaultChartTheme.overrides.common.title,
                color: '#F9FAFB',
            },
            subtitle: {
                ...defaultChartTheme.overrides.common.subtitle,
                color: '#9CA3AF',
            },
            legend: {
                item: {
                    label: {
                        ...defaultChartTheme.overrides.common.legend.item.label,
                        color: '#D1D5DB',
                    },
                },
            },
            axes: {
                category: {
                    label: {
                        ...defaultChartTheme.overrides.common.axes.category.label,
                        color: '#9CA3AF',
                    },
                    line: { stroke: '#374151' },
                    tick: { stroke: '#374151' },
                },
                number: {
                    label: {
                        ...defaultChartTheme.overrides.common.axes.number.label,
                        color: '#9CA3AF',
                    },
                    line: { stroke: '#374151' },
                    tick: { stroke: '#374151' },
                    gridLine: { stroke: '#374151' },
                },
            },
        },
    },
};
