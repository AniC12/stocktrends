import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function MyChart({ data, title, xLabel, yLabel }) {
    const chartData = {
        labels: data.map((entry) => entry.date),
        datasets: [
            {
                label: title,
                data: data.map((entry) => entry.value),
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
                    text: yLabel
                }
            },
            x: {
                title: {
                    display: true,
                    text: xLabel
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

export default MyChart;
