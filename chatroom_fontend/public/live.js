document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('live-video');
    const videoSource = document.getElementById('video-source');
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const socket = io('http://localhost:3000'); 

    let isPlaying = false; 
    let currentVideoTime = 0;

    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('Please login first！');
        window.location.href = 'login.html'; 
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const videoSrc = urlParams.get('src');

    if (videoSrc) {
        videoSource.src = videoSrc;
        videoElement.load();
    }


    socket.emit('user joined', username);


    socket.on('video start time', ({ currentTime, isPlaying }) => {
        
        videoElement.currentTime = currentTime;
        currentVideoTime = currentTime; 
        if (isPlaying) {
            videoElement.play();
            isPlaying = true; 
        } else {
            videoElement.pause();
            isPlaying = false; 
        }
    });


    socket.on('video action', (data) => {
        if (data.action === 'play' && !isPlaying) {
            videoElement.play();
            isPlaying = true;
        } else if (data.action === 'pause' && isPlaying) {
            videoElement.pause();
            isPlaying = false;
        } else if (data.action === 'seek') {
            videoElement.currentTime = data.currentTime; 
        }
    });

    videoElement.addEventListener('play', () => {
        if (!isPlaying) {
            isPlaying = true;
            socket.emit('video action', { action: 'play', currentTime: videoElement.currentTime });
        }
    });

    videoElement.addEventListener('pause', () => {
        if (isPlaying) {
            isPlaying = false;
            socket.emit('video action', { action: 'pause', currentTime: videoElement.currentTime });
        }
    });

    videoElement.addEventListener('seeked', () => {
        if (videoElement.currentTime !== currentVideoTime) {
            socket.emit('video seek', videoElement.currentTime);
        }
    });

    socket.on('chat message', (msg) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = msg;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    sendBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            const fullMessage = `${username}: ${message}`;
            socket.emit('chat message', fullMessage);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            alert('Logout successfully');
            window.location.href = 'login.html';
        });
    }
});
