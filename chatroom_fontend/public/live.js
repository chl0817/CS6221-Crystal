document.addEventListener('DOMContentLoaded', () => {
    // chech login
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('Please login first！');
        window.location.href = 'login.html'; // go to login page
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const videoSrc = urlParams.get('src');

    const videoElement = document.getElementById('live-video');
    const videoSource = document.getElementById('video-source');
    if (videoSrc) {
        videoSource.src = videoSrc;
        videoElement.load();
    }

    // live-chat
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    const socket = io('http://localhost:3000'); // server address

    // recieve messages
    socket.on('chat message', (msg) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = msg;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // send messages
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
