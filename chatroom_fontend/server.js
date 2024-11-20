const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let clients = [];
let currentVideoTime = 0; 
let isVideoPlaying = false; 
const videoTimeFilePath = path.join(__dirname, 'videoTime.txt');

const badWordsList = [
    'badword1', 'badword2', 'badword3', 'exampleword'  
];

function loadVideoTime() {
    if (fs.existsSync(videoTimeFilePath)) {
        const timeFromFile = fs.readFileSync(videoTimeFilePath, 'utf8');
        currentVideoTime = parseFloat(timeFromFile);
    }
}


function saveVideoTime(time) {
    fs.writeFileSync(videoTimeFilePath, time.toString(), 'utf8');
}


function filterProfanity(message) {
    let filteredMessage = message;
    badWordsList.forEach((badWord) => {
       
        const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
        filteredMessage = filteredMessage.replace(regex, '[CENSORED]');
    });
    return filteredMessage;
}


loadVideoTime();

io.on('connection', (socket) => {
    console.log('A user connected');
    clients.push(socket); // Add the new client


    socket.emit('video start time', { currentTime: currentVideoTime, isPlaying: isVideoPlaying });

   
    socket.on('user joined', (username) => {
        console.log(`${username} joined the chat`);
        
       
        io.emit('chat message', `${username} has joined the chat!`);
        
    
        io.emit('video action', { action: 'pause', currentTime: currentVideoTime });
    });

    socket.on('video action', (data) => {
        if (data.action === 'play') {
            isVideoPlaying = true;
            currentVideoTime = data.currentTime;
            saveVideoTime(currentVideoTime); 
         
            clients.forEach((clientSocket) => {
                if (clientSocket !== socket) {
                    clientSocket.emit('video action', { action: 'play', currentTime: currentVideoTime });
                }
            });
        } else if (data.action === 'pause') {
            isVideoPlaying = false;
            currentVideoTime = data.currentTime;
            saveVideoTime(currentVideoTime); 
            clients.forEach((clientSocket) => {
                if (clientSocket !== socket) {
                    clientSocket.emit('video action', { action: 'pause', currentTime: currentVideoTime });
                }
            });
        } else if (data.action === 'seek') {
            currentVideoTime = data.currentTime;
            saveVideoTime(currentVideoTime); 
            clients.forEach((clientSocket) => {
                if (clientSocket !== socket) {
                    clientSocket.emit('video action', { action: 'seek', currentTime: currentVideoTime });
                }
            });
        }
    });

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        const filteredMessage = filterProfanity(msg); 
        io.emit('chat message', filteredMessage); 
    });

    // Remove the client on disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        clients = clients.filter((clientSocket) => clientSocket !== socket);
    });
});


app.use(express.static('public'));


server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
