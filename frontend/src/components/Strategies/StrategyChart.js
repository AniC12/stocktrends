import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function StrategyChart({ performanceHistory }) {
    // Prepare the data for Chart.js
    const chartData = {
        labels: performanceHistory.map((entry) => entry.date),
        datasets: [
            {
                label: 'Strategy Performance',
                data: performanceHistory.map((entry) => entry.returnRate),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Return Rate (%)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default StrategyChart;
