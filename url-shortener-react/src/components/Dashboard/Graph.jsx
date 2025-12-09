import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';
import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';

// Register Chart.js components
ChartJS.register(BarElement, Tooltip, CategoryScale, LinearScale, Legend);

/**
 * @typedef {Object} GraphData
 * @property {string} clickDate
 * @property {number} count
 */

/**
 * Bar chart displaying click analytics
 * @param {{graphData: GraphData[]}} props
 */
const Graph = ({ graphData = [] }) => {
  const theme = useTheme();

  const labels = graphData.map((item) => dayjs(item.clickDate).format('MMM DD'));
  const counts = graphData.map((item) => item.count);

  const data = {
    labels: labels.length ? labels : ['No Data'],
    datasets: [
      {
        label: 'Total Clicks',
        data: counts.length ? counts : [0],
        backgroundColor: theme.palette.primary.main + 'B3',
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      duration: 800,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        cornerRadius: 8,
        padding: 12,
        backgroundColor: theme.palette.text.primary,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: theme.palette.grey[200], borderDash: [5, 5] },
        ticks: {
          color: theme.palette.text.secondary,
          callback: (value) => (Number.isInteger(value) ? value.toString() : ''),
        },
        title: {
          display: true,
          text: 'Number of Clicks',
          color: theme.palette.text.secondary,
          font: { weight: '600' },
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: theme.palette.text.secondary },
        title: {
          display: true,
          text: 'Date',
          color: theme.palette.text.secondary,
          font: { weight: '600' },
        },
      },
    },
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default Graph;
