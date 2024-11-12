// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import io from 'socket.io-client';

// // Import necessary components from Chart.js
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register the components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Connect to backend on port 4125
// const socket = io('http://localhost:4125');

// const RealTimeGraph = () => {
//   const [focusData, setFocusData] = useState([]);

//   useEffect(() => {
//     // Listen for focus data from the backend
//     socket.on('focusData', (data) => {
//       setFocusData(data);
//     });

//     return () => {
//       socket.off('focusData');
//     };
//   }, []);

//   // Prepare data for chart
//   const chartData = {
//     labels: focusData.map(entry => new Date(entry.startTime).toLocaleTimeString()),
//     datasets: [
//       {
//         label: 'Focus Percentage',
//         data: focusData.map(entry => entry.focusPercentage),
//         borderColor: 'rgba(75,192,192,1)',
//         fill: false,
//       },
//       {
//         label: 'Blink Count',
//         data: focusData.map(entry => entry.blinkCount),
//         borderColor: 'rgba(255,99,132,1)',
//         fill: false,
//       },
//     ],
//   };

//   return (
//     <div>
//       <h2>Real-Time Focus Data</h2>
//       <Line data={chartData} />
//     </div>
//   );
// };

// export default RealTimeGraph;


import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client';

// Import necessary components from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Connect to backend on port 4125
const socket = io('http://localhost:4125');

const RealTimeGraph = () => {
  const [focusData, setFocusData] = useState([]);

  useEffect(() => {
    // Listen for focus data from the backend
    socket.on('focusData', (data) => {
      // Add the new data to the state
      setFocusData((prevData) => {
        // You can adjust how to merge or replace the data based on your requirement
        return data;
      });
    });

    return () => {
      socket.off('focusData');
    };
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: focusData.map(entry => new Date(entry.startTime).toLocaleTimeString()), // X-axis: Time
    datasets: [
      {
        label: 'Focus Percentage',
        data: focusData.map(entry => entry.focusPercentage), // Y-axis: Focus Percentage
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
        yAxisID: 'y1',
      },
      {
        label: 'Blink Count',
        data: focusData.map(entry => entry.blinkCount), // Y-axis: Blink Count
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
        yAxisID: 'y2',
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Real-Time Focus Data',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Focus Percentage',
        },
        ticks: {
          beginAtZero: true,
          max: 100,
        },
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Blink Count',
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div>
      <h2>Real-Time Focus Data</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default RealTimeGraph;
