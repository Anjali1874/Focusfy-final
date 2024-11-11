import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client';

// Connect to the WebSocket server
const socket = io();

const FocusGraph = ({ userId }) => {
    const [focusData, setFocusData] = useState([]);

    useEffect(() => {
        // Join the session for the user
        socket.emit('joinUserSession', userId);

        // Get the initial data
        socket.on('initialData', (data) => {
            setFocusData(data);
        });

        // Listen for real-time focus updates
        socket.on('updateFocusData', (newData) => {
            setFocusData((prevData) => [...prevData, newData]);
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, [userId]);

    // Prepare data for the graph
    const data = {
        labels: focusData.map(item => Minute ${item.minute}),
        datasets: [
            {
                label: 'Focus Level',
                data: focusData.map(item => item.focusLevel),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div>
            <h2>Your Focus Level Over Time</h2>
            <Line data={data} />
        </div>
    );
};

export default FocusGraph;
