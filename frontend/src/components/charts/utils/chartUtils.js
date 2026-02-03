// AG Charts - Utility Functions
// Data transformation and formatting helpers

/**
 * Format raw data for chart consumption
 * @param {Array} data - Raw data array
 * @param {Object} options - Formatting options
 * @returns {Array} Formatted data
 */
export function formatChartData(data, options = {}) {
    const {
        xKey = 'x',
        yKey = 'y',
        labelKey = 'label',
        valueKey = 'value',
        dateFormat = 'short',
    } = options;

    return data.map((item) => ({
        [xKey]: item[labelKey] || item[xKey],
        [yKey]: item[valueKey] || item[yKey],
        ...item,
    }));
}

/**
 * Aggregate data by a specific field
 * @param {Array} data - Raw data array
 * @param {string} groupByField - Field to group by
 * @param {string} valueField - Field to aggregate
 * @param {string} aggregation - Aggregation type: 'sum', 'avg', 'count', 'min', 'max'
 * @returns {Array} Aggregated data
 */
export function aggregateByField(data, groupByField, valueField, aggregation = 'sum') {
    const groups = {};

    data.forEach((item) => {
        const key = item[groupByField];
        if (!groups[key]) {
            groups[key] = { values: [], label: key };
        }
        groups[key].values.push(item[valueField]);
    });

    return Object.entries(groups).map(([key, group]) => {
        let value;
        switch (aggregation) {
            case 'sum':
                value = group.values.reduce((a, b) => a + b, 0);
                break;
            case 'avg':
                value = group.values.reduce((a, b) => a + b, 0) / group.values.length;
                break;
            case 'count':
                value = group.values.length;
                break;
            case 'min':
                value = Math.min(...group.values);
                break;
            case 'max':
                value = Math.max(...group.values);
                break;
            default:
                value = group.values.reduce((a, b) => a + b, 0);
        }

        return {
            [groupByField]: key,
            [valueField]: value,
        };
    });
}

/**
 * Generate time series data points
 * @param {Array} data - Raw data with dates
 * @param {string} dateField - Date field name
 * @param {string} valueField - Value field name
 * @param {string} interval - 'day', 'week', 'month', 'year'
 * @returns {Array} Time series data
 */
export function generateTimeSeries(data, dateField, valueField, interval = 'day') {
    const sorted = [...data].sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]));
    const groups = {};

    sorted.forEach((item) => {
        const date = new Date(item[dateField]);
        let key;

        switch (interval) {
            case 'day':
                key = date.toISOString().split('T')[0];
                break;
            case 'week':
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
                break;
            case 'month':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'year':
                key = String(date.getFullYear());
                break;
            default:
                key = date.toISOString().split('T')[0];
        }

        if (!groups[key]) {
            groups[key] = { date: key, total: 0, count: 0 };
        }
        groups[key].total += item[valueField] || 0;
        groups[key].count += 1;
    });

    return Object.values(groups).map((g) => ({
        date: g.date,
        [valueField]: g.total,
        average: g.total / g.count,
        count: g.count,
    }));
}

/**
 * Calculate percentage distribution
 * @param {Array} data - Data with values
 * @param {string} valueField - Field containing numeric values
 * @returns {Array} Data with percentage field added
 */
export function calculatePercentages(data, valueField) {
    const total = data.reduce((sum, item) => sum + (item[valueField] || 0), 0);

    return data.map((item) => ({
        ...item,
        percentage: total > 0 ? ((item[valueField] / total) * 100).toFixed(1) : 0,
    }));
}

/**
 * Format currency values for display
 * @param {number} value - Numeric value
 * @param {string} currency - Currency code
 * @param {string} locale - Locale string
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'INR', locale = 'en-IN') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format large numbers with abbreviations
 * @param {number} value - Numeric value
 * @returns {string} Abbreviated string (e.g., 1.2K, 3.4M)
 */
export function abbreviateNumber(value) {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
}
