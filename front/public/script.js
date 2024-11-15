let socket;

function showLoginPage() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('register-page').style.display = 'none';
}

function showRegisterPage() {
    document.getElementById('register-page').style.display = 'block';
    document.getElementById('login-page').style.display = 'none';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        const storedPassword = localStorage.getItem(username);

        if (storedPassword && storedPassword === password) {
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('chatroom').style.display = 'block';
            socket = io('http://localhost:3000');

            socket.on('connect', () => {
                console.log('Connected to WebSocket server');
            });

            socket.on('chat message', (msg) => {
                displayMessage(msg);
            });
        } else {
            alert('Invalid username or password');
        }
    } else {
        alert('Please enter both username and password');
    }
}

function register() {
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    if (newUsername && newPassword) {
        if (localStorage.getItem(newUsername)) {
            alert('Username already exists. Please choose another one.');
        } else {
            localStorage.setItem(newUsername, newPassword);  // Store user data in localStorage
            alert('Registration successful! You can now login.');
            showLoginPage();
        }
    } else {
        alert('Please enter both username and password');
    }
}

function sendMessage() {
    if (socket && socket.connected) {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();

        if (message) {
            const username = document.getElementById('username').value;
            const fullMessage = `${username}: ${message}`;
            socket.emit('chat message', fullMessage);
            chatInput.value = '';
        }
    } else {
        console.error('WebSocket connection not established');
    }
}

function displayMessage(msg) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; 
}
