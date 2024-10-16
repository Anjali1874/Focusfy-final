import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client';
import { Chart as ChartJS } from 'chart.js/auto';

// Connect to the Socket.io server
const socket = io('http://localhost:3000');

const RealTimeGraph = () => {
    const [focusData, setFocusData] = useState({}); // Store focus data for each user
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Listen for focus data from the server
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

        // Fetch the leaderboard
        fetch('http://localhost:3000/leaderboard')
            .then(res => res.json())
            .then(data => setLeaderboard(data));

        return () => {
            socket.off('focusData');
        };
    }, []);

    // Handle no data case
    if (Object.keys(focusData).length === 0) {
        return <div>Loading...</div>;
    }

    // Prepare data for the graph
    const chartData = {
        labels: Object.values(focusData)[0].data.map(point => point.timeInterval),  // Time intervals as x-axis (assuming all users share same time intervals)
        datasets: Object.values(focusData).map(user => ({
            label: user.name,
            data: user.data.map(point => point.focusLevel),
            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
            fill: false
        }))
    };

    return (
        <div>
            <h2>Your Focus vs Time</h2>
            <Line data={chartData} />

            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.map((user, index) => (
                    <li key={index}>{index + 1}. {user.name}: {user.focusLevel.toFixed(2)}%</li>
                ))}
            </ul>
        </div>
    );
};

export default RealTimeGraph;
