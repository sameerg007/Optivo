/**
 * AG Charts - Usage Examples
 * 
 * This file demonstrates how to use each chart type with params.
 * Import charts and pass data/configuration as props.
 * 
 * NOTE: This is a documentation file. Copy examples into your components.
 */

// ============================================
// IMPORTS
// ============================================
// import { 
//     LineChart, 
//     BarChart, 
//     PieChart, 
//     DonutChart, 
//     AreaChart,
//     chartColors,
//     aggregateByField,
//     generateTimeSeries,
// } from '@/components/charts';


// ============================================
// LINE CHART EXAMPLE
// ============================================
/*
<LineChart
    data={[
        { date: 'Jan', revenue: 4500, expenses: 3200 },
        { date: 'Feb', revenue: 5200, expenses: 3800 },
        { date: 'Mar', revenue: 4800, expenses: 3400 },
        { date: 'Apr', revenue: 6100, expenses: 4200 },
    ]}
    xKey="date"
    yKeys={['revenue', 'expenses']}
    title="Revenue vs Expenses"
    height="350px"
    showMarkers={true}
    smooth={true}
/>

<LineChart
    data={monthlyData}
    xKey="month"
    yKeys="amount"
    colors={['#10B981']}
    strokeWidth={3}
/>
*/


// ============================================
// BAR CHART EXAMPLES
// ============================================
/*
<BarChart
    data={[
        { category: 'Food', amount: 12500 },
        { category: 'Transport', amount: 8200 },
        { category: 'Shopping', amount: 15800 },
        { category: 'Bills', amount: 9400 },
    ]}
    xKey="category"
    yKeys="amount"
    title="Spending by Category"
    height="300px"
    showValues={true}
/>

<BarChart
    data={categoryData}
    xKey="name"
    yKeys="value"
    direction="horizontal"
    height="400px"
/>

<BarChart
    data={quarterlyData}
    xKey="quarter"
    yKeys={['income', 'savings', 'expenses']}
    stacked={true}
    showLegend={true}
/>

<BarChart
    data={comparisonData}
    xKey="month"
    yKeys={['thisYear', 'lastYear']}
    grouped={true}
    colors={['#4F46E5', '#9CA3AF']}
/>
*/


// ============================================
// PIE CHART EXAMPLES
// ============================================
/*
<PieChart
    data={[
        { label: 'Food', value: 35 },
        { label: 'Transport', value: 20 },
        { label: 'Entertainment', value: 15 },
        { label: 'Bills', value: 30 },
    ]}
    angleKey="value"
    legendKey="label"
    title="Expense Distribution"
    height="300px"
    showCallouts={true}
/>

<PieChart
    data={categoryBreakdown}
    angleKey="amount"
    legendKey="category"
    onSliceClick={(data) => console.log('Clicked:', data)}
    legendPosition="bottom"
/>
*/


// ============================================
// DONUT CHART EXAMPLES
// ============================================
/*
<DonutChart
    data={budgetData}
    angleKey="spent"
    legendKey="category"
    title="Budget Usage"
    centerLabel="Total Spent"
    centerValue="₹45,000"
    innerRadiusRatio={0.65}
    height="350px"
/>

<DonutChart
    data={statusData}
    angleKey="count"
    legendKey="status"
    showLegend={false}
    innerRadiusRatio={0.7}
    height="200px"
/>
*/


// ============================================
// AREA CHART EXAMPLES
// ============================================
/*
<AreaChart
    data={dailySpending}
    xKey="date"
    yKeys="amount"
    title="Daily Spending Trend"
    fillOpacity={0.4}
    smooth={true}
/>

<AreaChart
    data={monthlyBreakdown}
    xKey="month"
    yKeys={['essentials', 'lifestyle', 'savings']}
    stacked={true}
    showLegend={true}
    height="400px"
/>

<AreaChart
    data={marketShare}
    xKey="quarter"
    yKeys={['productA', 'productB', 'productC']}
    stacked={true}
    normalized={true}
    title="Market Share Over Time"
/>
*/


// ============================================
// USING UTILITY FUNCTIONS
// ============================================
/*
const categoryTotals = aggregateByField(expenses, 'category', 'amount', 'sum');
const dailyTrend = generateTimeSeries(transactions, 'date', 'amount', 'day');

<BarChart data={categoryTotals} xKey="category" yKeys="amount" />
<LineChart data={dailyTrend} xKey="date" yKeys="amount" />
*/


// ============================================
// CUSTOM TOOLTIP EXAMPLE
// ============================================
/*
<BarChart
    data={expenseData}
    xKey="category"
    yKeys="amount"
    tooltipRenderer={({ datum }) => ({
        title: datum.category,
        content: `Amount: ₹${datum.amount.toLocaleString()}`,
    })}
/>
*/


// ============================================
// CLICK HANDLERS EXAMPLE
// ============================================
/*
const handleChartClick = (data, event) => {
    console.log('Clicked data:', data);
    setSelectedCategory(data.category);
};

<DonutChart data={categoryData} onSliceClick={handleChartClick} />
<BarChart data={monthlyData} onBarClick={handleChartClick} />
*/


// ============================================
// COMPLETE COMPONENT EXAMPLE
// ============================================
/*
'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, BarChart, DonutChart, aggregateByField } from '@/components/charts';

export default function ExpenseDashboard({ expenses }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categoryData = useMemo(() => 
        aggregateByField(expenses, 'category', 'amount', 'sum'),
        [expenses]
    );

    return (
        <div className="dashboard">
            <DonutChart
                data={categoryData}
                angleKey="amount"
                legendKey="category"
                centerLabel="Total"
                onSliceClick={(data) => setSelectedCategory(data.category)}
            />
            <BarChart
                data={categoryData}
                xKey="category"
                yKeys="amount"
                direction="horizontal"
            />
        </div>
    );
}
*/

export {};
