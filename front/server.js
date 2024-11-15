const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');  

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST']
}));

app.use(express.static('public'));


io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);  
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
