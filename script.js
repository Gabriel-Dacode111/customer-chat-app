// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupBtn = document.getElementById('show-signup-btn');
const showLoginBtn = document.getElementById('show-login-btn');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const chatInterface = document.getElementById('chat-interface');
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const usernameDisplay = document.getElementById('username-display');

// Local storage for user data (simulating a database)
const users = JSON.parse(localStorage.getItem('chatAppUsers')) || [];
let currentUser = null;

// Toggle between login and signup forms
showSignupBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Signup functionality
signupBtn.addEventListener('click', () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Check if user already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        alert('User with this email already exists');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // Note: In a real app, never store plain text passwords
        messages: []
    };

    users.push(newUser);
    localStorage.setItem('chatAppUsers', JSON.stringify(users));
    
    // Log the user in automatically after signup
    currentUser = newUser;
    startChatSession();
    
    alert('Account created successfully!');
});

// Login functionality
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        currentUser = user;
        startChatSession();
    } else {
        alert('Invalid email or password');
    }
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    authContainer.classList.remove('hidden');
    chatInterface.classList.add('hidden');
    
    // Clear form fields
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    
    // Show login form by default
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Send message functionality
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    // Create message object
    const message = {
        text: messageText,
        timestamp: new Date().toLocaleTimeString(),
        sender: currentUser.name
    };

    // Add message to user's chat history
    currentUser.messages.push(message);
    updateLocalStorage();
    
    // Display the message
    displayMessage(message, 'user-message');
    
    // Clear input
    messageInput.value = '';
    
    // Simulate a response (in a real app, this would come from a server)
    setTimeout(() => {
        const response = {
            text: "Thanks for your message! Our team will get back to you soon.",
            timestamp: new Date().toLocaleTimeString(),
            sender: "Support Team"
        };
        currentUser.messages.push(response);
        updateLocalStorage();
        displayMessage(response, 'system-message');
    }, 1000);
}

function displayMessage(message, messageClass) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', messageClass);
    messageElement.innerHTML = `
        <strong>${message.sender}</strong> (${message.timestamp}):<br>
        ${message.text}
    `;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function startChatSession() {
    // Hide auth forms and show chat interface
    authContainer.classList.add('hidden');
    chatInterface.classList.remove('hidden');
    
    // Display username
    usernameDisplay.textContent = currentUser.name;
    
    // Show chat container
    chatContainer.style.display = 'block';
    
    // Clear chat container
    chatContainer.innerHTML = '';
    
    // Load previous messages if any
    if (currentUser.messages && currentUser.messages.length > 0) {
        currentUser.messages.forEach(msg => {
            const msgClass = msg.sender === currentUser.name ? 'user-message' : 'system-message';
            displayMessage(msg, msgClass);
        });
    } else {
        // Show welcome message
        const welcomeMsg = {
            text: "Hello! How can we help you today?",
            timestamp: new Date().toLocaleTimeString(),
            sender: "Support Team"
        };
        currentUser.messages.push(welcomeMsg);
        updateLocalStorage();
        displayMessage(welcomeMsg, 'system-message');
    }
}

function updateLocalStorage() {
    // Update the user in the "database"
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('chatAppUsers', JSON.stringify(users));
    }
                                  }
