document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('live-video');
    const videoSource = document.getElementById('video-source');
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const logoutButton = document.getElementById('logout-btn');

    const socket = io('http://localhost:3000'); // Connect to the server

    // Check if the user is logged in
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('Please log in first!');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    // Send "user joined" message when user connects
    socket.emit('user joined', username);

    // Get the video source from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const videoSrc = urlParams.get('src');
    if (videoSrc) {
        videoSource.src = videoSrc;
        videoElement.load(); // Reload the video element to apply the source
    }

    // Sync play/pause state
    videoElement.addEventListener('play', () => {
        socket.emit('video action', { action: 'play', currentTime: videoElement.currentTime });
    });

    videoElement.addEventListener('pause', () => {
        socket.emit('video action', { action: 'pause', currentTime: videoElement.currentTime });
    });

    // Sync seeking action
    videoElement.addEventListener('seeked', () => {
        socket.emit('video action', { action: 'seek', currentTime: videoElement.currentTime });
    });

    // Listen for video actions from other clients
    socket.on('video action', (data) => {
        if (data.action === 'play') {
            videoElement.play();
        } else if (data.action === 'pause') {
            videoElement.pause();
        } else if (data.action === 'seek') {
            videoElement.currentTime = data.currentTime;
        }
    });

    // Chat functionality
    socket.on('chat message', (msg) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = msg;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to the latest message
    });

    // Send chat message
    sendBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            const fullMessage = `${username}: ${message}`;
            socket.emit('chat message', fullMessage);
            chatInput.value = ''; // Clear input field after sending
        }
    });

    // Allow sending messages with Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Handle logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        alert('Logged out successfully');
        window.location.href = 'login.html';
    });
});
