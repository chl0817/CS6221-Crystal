document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const storedPassword = localStorage.getItem(username);
            if (storedPassword && storedPassword === password) {
                alert('Success！');
                localStorage.setItem('currentUser', username); 
                window.location.href = 'index.html'; 
            } else {
                alert('Error password or username');
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;

            if (localStorage.getItem(username)) {
                alert('Username is existed');
            } else {
                localStorage.setItem(username, password);
                alert('Register success！');
                window.location.href = 'login.html';
            }
        });
    }

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        console.log(`Current User: ${currentUser}`);
    } else {
        console.log('Not logged in');
    }

    const searchBar = document.getElementById('search-bar');
    const videoGrid = document.getElementById('video-grid');
    if (searchBar && videoGrid) {
        const videoCards = Array.from(videoGrid.getElementsByClassName('video-card'));

        searchBar.addEventListener('input', () => {
            const query = searchBar.value.toLowerCase(); 
            videoCards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase(); 
                if (title.includes(query)) {
                    card.style.display = 'block'; 
                } else {
                    card.style.display = 'none'; 
                }
            });
        });
    }

    
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('currentUser'); 
            alert('Logout successfully');
            window.location.href = 'login.html'; 
        });
    }
});
