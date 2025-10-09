/**
 * Authentication Module for AdBoost Platform
 * Handles login, registration, and session management
 */

// DOM elements
const formTabs = document.querySelectorAll('.form-tab');
const formContents = document.querySelectorAll('.form-content');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const messageElement = document.getElementById('message');

// Initialize auth page
document.addEventListener('DOMContentLoaded', function() {
  setupTabSwitching();
  setupFormHandlers();
});

// Tab switching functionality
function setupTabSwitching() {
  formTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabName) {
  // Remove active class from all tabs and contents
  formTabs.forEach(tab => tab.classList.remove('active'));
  formContents.forEach(content => content.classList.remove('active'));

  // Add active class to selected tab and content
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-form`).classList.add('active');

  // Clear any messages
  hideMessage();
}

// Form handlers
function setupFormHandlers() {
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
}

async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      showMessage(data.error || 'Login failed', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage('Network error. Please try again.', 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  if (!username || !email || !password) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('Password must be at least 6 characters long', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showMessage('Please enter a valid email address', 'error');
    return;
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Registration successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      showMessage(data.error || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showMessage('Network error. Please try again.', 'error');
  }
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showMessage(text, type) {
  messageElement.className = `alert alert-${type}`;
  messageElement.textContent = text;
  messageElement.classList.remove('hidden');

  // Auto-hide error messages after 5 seconds
  if (type === 'error') {
    setTimeout(() => {
      hideMessage();
    }, 5000);
  }
}

function hideMessage() {
  messageElement.classList.add('hidden');
}

// Global logout function
async function logout() {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST'
    });

    if (response.ok) {
      window.location.href = '/login.html';
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}
