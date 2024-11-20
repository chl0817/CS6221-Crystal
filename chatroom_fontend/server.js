const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let clients = [];
let currentVideoTime = 0; // Default value for video time
let isVideoPlaying = false; // Track if video is playing or paused
const videoTimeFilePath = path.join(__dirname, 'videoTime.txt');

// List of profane words to check against (you can extend this list)
const badWordsList = [
    'badword1', 'badword2', 'badword3', 'exampleword'  // Replace these with actual words
];

// Function to load the video time from file
function loadVideoTime() {
    if (fs.existsSync(videoTimeFilePath)) {
        const timeFromFile = fs.readFileSync(videoTimeFilePath, 'utf8');
        currentVideoTime = parseFloat(timeFromFile);
    }
}

// Function to save the video time to file
function saveVideoTime(time) {
    fs.writeFileSync(videoTimeFilePath, time.toString(), 'utf8');
}

// Function to filter out profane words from a message
function filterProfanity(message) {
    let filteredMessage = message;
    badWordsList.forEach((badWord) => {
        // Use a simple regex to match the bad word (case insensitive)
        const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
        filteredMessage = filteredMessage.replace(regex, '[CENSORED]');
    });
    return filteredMessage;
}

// Load the video time when the server starts
loadVideoTime();

io.on('connection', (socket) => {
    console.log('A user connected');
    clients.push(socket); // Add the new client

    // Send the current video time and play state to the new user when they connect
    socket.emit('video start time', { currentTime: currentVideoTime, isPlaying: isVideoPlaying });

    // Broadcast to all users to pause the video and sync the time when a new user joins
    socket.on('user joined', (username) => {
        console.log(`${username} joined the chat`);
        
        // Broadcast to all users that a new user has joined
        io.emit('chat message', `${username} has joined the chat!`);
        
        // Pause the video for everyone and sync time
        io.emit('video action', { action: 'pause', currentTime: currentVideoTime });
    });

    // Listen for video control actions (play, pause, seek)
    socket.on('video action', (data) => {
        if (data.action === 'play') {
            isVideoPlaying = true;
            currentVideoTime = data.currentTime;
            saveVideoTime(currentVideoTime); // Persist the video time to the file
            // Broadcast the play action to all other clients
            clients.forEach((clientSocket) => {
                if (clientSocket !== socket) {
                    clientSocket.emit('video action', { action: 'play', currentTime: currentVideoTime });
                }
            });
        } else if (data.action === 'pause') {
            isVideoPlaying = false;
            currentVideoTime = data.currentTime;
            saveVideoTime(currentVideoTime); // Persist the video time to the file
            // Broadcast the pause action to all other clients
            clients.forEach((clientSocket) => {
                if (clientSocket !== socket) {
                    clientSocket.emit('video action', { action: 'pause', currentTime: currentVideoTime });
                }
            });
        } else if (data.action === 'seek') {
            currentVideoTime = data.currentTime;
            saveVideoTime(currentVideoTime); // Persist the video time
            // Broadcast the seek action to other clients
            clients.forEach((clientSocket) => {
                if (clientSocket !== socket) {
                    clientSocket.emit('video action', { action: 'seek', currentTime: currentVideoTime });
                }
            });
        }
    });

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        const filteredMessage = filterProfanity(msg); // Filter out profanity
        io.emit('chat message', filteredMessage); // Broadcast the message to all clients
    });

    // Remove the client on disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        clients = clients.filter((clientSocket) => clientSocket !== socket);
    });
});

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
