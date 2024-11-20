document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('live-video');
    const videoSource = document.getElementById('video-source');
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const socket = io('http://localhost:3000'); // Connect to the server

    let isPlaying = false; // Track whether the video is playing
    let currentVideoTime = 0; // Store the current video time

    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('Please login first！');
        window.location.href = 'login.html'; // go to login page
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const videoSrc = urlParams.get('src');

    if (videoSrc) {
        videoSource.src = videoSrc;
        videoElement.load();
    }

    // Emit 'user joined' message when a new user joins
    socket.emit('user joined', username);

    // Listen for video start time when a new user joins
    socket.on('video start time', ({ currentTime, isPlaying }) => {
        // Set the video to the shared current time and play state
        videoElement.currentTime = currentTime;
        currentVideoTime = currentTime; // Update the client's current video time
        if (isPlaying) {
            videoElement.play();
            isPlaying = true; // Update play state
        } else {
            videoElement.pause();
            isPlaying = false; // Update pause state
        }
    });

    // Listen for video actions (play, pause, seek)
    socket.on('video action', (data) => {
        if (data.action === 'play' && !isPlaying) {
            videoElement.play();
            isPlaying = true; // Update play state
        } else if (data.action === 'pause' && isPlaying) {
            videoElement.pause();
            isPlaying = false; // Update pause state
        } else if (data.action === 'seek') {
            videoElement.currentTime = data.currentTime; // Sync video position
        }
    });

    // Handle video play/pause events
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

    // Handle video seek events (when user skips forward/backward)
    videoElement.addEventListener('seeked', () => {
        if (videoElement.currentTime !== currentVideoTime) {
            socket.emit('video seek', videoElement.currentTime);
        }
    });

    // Handle chat message events
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

    // Logout functionality
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            alert('Logout successfully');
            window.location.href = 'login.html';
        });
    }
});
