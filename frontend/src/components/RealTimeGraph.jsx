// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import io from 'socket.io-client';
// import { Chart as ChartJS } from 'chart.js/auto';

// // Connect to the Socket.io server
// const socket = io('http://localhost:4125');

// const RealTimeGraph = () => {
//     const [focusData, setFocusData] = useState({}); // Store focus data for each user   
//     const [leaderboard, setLeaderboard] = useState([]);

//     useEffect(() => {
//         // Listen for focus data from the server
//         socket.on('focusData', newData => {
//             setFocusData(prevData => {
//                 const updatedData = { ...prevData };

//                 newData.forEach(user => {
//                     if (!updatedData[user.id]) {
//                         updatedData[user.id] = { name: user.name, data: [] };
//                     }
//                     updatedData[user.id].data.push({
//                         focusLevel: user.focusLevel,
//                         timeInterval: new Date(user.timeInterval).toLocaleTimeString()
//                     });
//                 });

//                 return updatedData;
//             });
//         });

//         // Fetch the leaderboard
//         fetch('http://localhost:4125/leaderboard')
//             .then(res => res.json())
//             .then(data => setLeaderboard(data));

//         return () => {
//             socket.off('focusData');
//         };
//     }, []);

//     // Handle no data case
//     if (Object.keys(focusData).length === 0) {
//         return <div>Loading...</div>;
//     }

//     // Prepare data for the graph
//     const chartData = {
//         labels: Object.values(focusData)[0].data.map(point => point.timeInterval),  // Time intervals as x-axis (assuming all users share same time intervals)
//         datasets: Object.values(focusData).map(user => ({
//             label: user.name,
//             data: user.data.map(point => point.focusLevel),
//             borderColor: rgba(`${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1c`),
//             fill: false
//         }))
//     };

//     return (
//         <div className='w-[700px] h-[500px] bg-black p-10 rounded-xl ml-10'>
//             <h2 className='text-white font-bold'>Your Focus vs Time</h2>
//             <Line data={chartData} />

//             <h2>Leaderboard</h2>
//             <ul>
//                 {leaderboard.map((user, index) => (
//                     <li key={index}>{index + 1}. {user.name}: {user.focusLevel.toFixed(2)}%</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default RealTimeGraph;


import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client';
import { Chart as ChartJS } from 'chart.js/auto';

// Connect to the Socket.IO server
const socket = io('http://localhost:4125');

const RealTimeGraph = () => {
    const [focusData, setFocusData] = useState({});
    const [leaderboard, setLeaderboard] = useState([]);

    // Helper function to generate random colors
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 1)`;
    };

    useEffect(() => {
        // Listen for real-time focus data
        socket.on('focusData', newData => {
            setFocusData(prevData => {
                const updatedData = { ...prevData };

                newData.forEach(user => {
                    if (!updatedData[user.id]) {
                        updatedData[user.id] = { name: user.name, data: [] };
                    }
                    updatedData[user.id].data.push({
                        focusLevel: user.focusLevel,
                        timeInterval: new Date(user.timeInterval).toLocaleTimeString()
                    });
                });

                return updatedData;
            });
        });

        // Fetch leaderboard data
        fetch('http://localhost:4125/leaderboard')
            .then(res => res.json())
            .then(data => setLeaderboard(data))
            .catch(err => console.error('Error fetching leaderboard:', err));

        return () => {
            socket.off('focusData');
        };
    }, []);

    if (Object.keys(focusData).length === 0) {
        return <div>Loading...</div>;
    }

    const chartData = {
        labels: Object.values(focusData)[0].data.map(point => point.timeInterval),
        datasets: Object.values(focusData).map(user => ({
            label: user.name,
            data: user.data.map(point => point.focusLevel),
            borderColor: getRandomColor(),
            fill: false
        }))
    };

    return (
        <div className='w-[700px] h-[500px] bg-black p-10 rounded-xl ml-10'>
            <h2 className='text-white font-bold'>Your Focus vs Time</h2>
            <Line data={chartData} />

            <h2 className='text-white font-bold mt-5'>Leaderboard</h2>
            <ul className='text-white'>
                {leaderboard.map((user, index) => (
                    <li key={index}>{index + 1}. {user.name}: {user.focusLevel.toFixed(2)}%</li>
                ))}
            </ul>
        </div>
    );
};

export default RealTimeGraph;
