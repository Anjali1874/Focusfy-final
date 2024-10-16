const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // Vite runs on port 5173 by default
        methods: ["GET", "POST"]
    }
});

app.use(cors());

let usersFocusData = [
    { id: 1, name: "Alice", focusLevel: 75, timeInterval: Date.now() },
    { id: 2, name: "Bob", focusLevel: 85, timeInterval: Date.now() },
    { id: 3, name: "Charlie", focusLevel: 65, timeInterval: Date.now() }
];

// Simulate focus level updates every minute
const updateFocusLevels = () => {
    usersFocusData = usersFocusData.map((user) => ({
        ...user,
        focusLevel: Math.floor(Math.random() * 100), // Random focus level between 0 and 100
        timeInterval: Date.now() // Update to current time
    }));
};

// Send updated focus data every 60 seconds (1 minute)
setInterval(() => {
    updateFocusLevels();
    io.emit('focusData', usersFocusData); // Emit the updated focus data to all clients
}, 60000); // 60000 ms = 1 minute

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Send initial focus data when a user connects
    socket.emit('focusData', usersFocusData);

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Endpoint to get leaderboard
app.get('/leaderboard', (req, res) => {
    // Sort users by focus level for leaderboard
    const leaderboard = [...usersFocusData].sort((a, b) => b.focusLevel - a.focusLevel);
    res.json(leaderboard);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
