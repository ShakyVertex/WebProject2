/**
 * Dashboard Module for AdBoost Platform
 * Handles main dashboard functionality, navigation, and user info
 */

// Global state
let currentUser = null;
let userAds = [];
let userTransactions = [];

// DOM elements
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const messageElement = document.getElementById('message');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  setupNavigation();
  loadUserData();
  loadDashboardData();
});

// Navigation setup
function setupNavigation() {
  navTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabName) {
  // Remove active class from all tabs and contents
  navTabs.forEach(tab => tab.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));

  // Add active class to selected tab and content
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');

  // Load specific tab data
  switch (tabName) {
  case 'dashboard':
    loadDashboardData();
    break;
  case 'ads':
    loadAdsData();
    break;
  case 'transactions':
    loadTransactionsData();
    break;
  }
}

// Load user data
async function loadUserData() {
  try {
    const response = await fetch('/api/user');

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login.html';
        return;
      }
      throw new Error('Failed to load user data');
    }

    currentUser = await response.json();
    updateUserDisplay();
  } catch (error) {
    console.error('Error loading user data:', error);
    showMessage('Failed to load user data', 'error');
  }
}

function updateUserDisplay() {
  if (currentUser) {
    document.getElementById('username').textContent = currentUser.username;
    document.getElementById('userCredits').textContent = currentUser.credits;
    document.getElementById('dashboardCredits').textContent = currentUser.credits;
  }
}

// Dashboard data loading
async function loadDashboardData() {
  try {
    // Load ads for statistics
    const adsResponse = await fetch('/api/ads');
    if (adsResponse.ok) {
      userAds = await adsResponse.json();
      updateDashboardStats();
    }

    // Load recent transactions
    const transactionsResponse = await fetch('/api/transactions');
    if (transactionsResponse.ok) {
      userTransactions = await transactionsResponse.json();
      updateRecentActivity();
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showMessage('Failed to load dashboard data', 'error');
  }
}

function updateDashboardStats() {
  const totalAds = userAds.length;
  const activeAds = userAds.filter(ad => ad.status === 'active').length;
  const totalImpressions = userAds.reduce((sum, ad) => sum + (ad.metrics?.impressions || 0), 0);
  const totalClicks = userAds.reduce((sum, ad) => sum + (ad.metrics?.clicks || 0), 0);

  document.getElementById('totalAds').textContent = totalAds;
  document.getElementById('activeAds').textContent = activeAds;
  document.getElementById('totalImpressions').textContent = totalImpressions.toLocaleString();
  document.getElementById('totalClicks').textContent = totalClicks.toLocaleString();
}

function updateRecentActivity() {
  const recentActivityElement = document.getElementById('recentActivity');

  if (userTransactions.length === 0) {
    recentActivityElement.innerHTML = '<p class="text-gray">No recent activity</p>';
    return;
  }

  const recentTransactions = userTransactions.slice(0, 5); // Show last 5 transactions

  const activityHTML = recentTransactions.map(transaction => {
    const date = new Date(transaction.createdAt).toLocaleDateString();
    const amount = transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount;
    const amountClass = transaction.amount > 0 ? 'text-success' : 'text-error';

    return `
            <div class="flex justify-between align-center mb-2" style="padding: 0.75rem; border-bottom: 1px solid var(--border-gray);">
                <div>
                    <strong>${getTransactionTypeLabel(transaction.type)}</strong>
                    <br>
                    <small class="text-gray">${date}</small>
                </div>
                <div class="${amountClass}" style="font-weight: bold;">
                    ${amount} Credits
                </div>
            </div>
        `;
  }).join('');

  recentActivityElement.innerHTML = activityHTML;
}

function getTransactionTypeLabel(type) {
  const labels = {
    CREDIT_RECHARGE: 'Credit Recharge',
    AD_ACTIVATE: 'Ad Activation',
    AD_DAILY_DEBIT: 'Daily Ad Charge',
    AD_PAUSE_REFUND: 'Ad Pause Refund',
    AD_CANCEL_REFUND: 'Ad Cancel Refund',
    MANUAL_ADJUST: 'Manual Adjustment'
  };
  return labels[type] || type;
}

// Credit recharge functionality
function showRechargeModal() {
  document.getElementById('rechargeModal').classList.add('show');
}

function hideRechargeModal() {
  document.getElementById('rechargeModal').classList.remove('show');
  document.getElementById('rechargeForm').reset();
}

// Setup recharge form handler
document.getElementById('rechargeForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const amount = parseInt(document.getElementById('rechargeAmount').value);

  if (!amount || amount <= 0) {
    showMessage('Please enter a valid amount', 'error');
    return;
  }

  try {
    const response = await fetch('/api/recharge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(`Successfully recharged ${amount} credits!`, 'success');
      hideRechargeModal();

      // Update user credits display
      currentUser.credits = data.newBalance;
      updateUserDisplay();

      // Refresh dashboard data
      loadDashboardData();
    } else {
      showMessage(data.error || 'Recharge failed', 'error');
    }
  } catch (error) {
    console.error('Recharge error:', error);
    showMessage('Network error. Please try again.', 'error');
  }
});

// Utility functions
function showMessage(text, type) {
  messageElement.className = `alert alert-${type}`;
  messageElement.textContent = text;
  messageElement.classList.remove('hidden');

  // Auto-hide messages after 5 seconds
  setTimeout(() => {
    hideMessage();
  }, 5000);
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

// Modal click outside to close
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    const modal = event.target;
    modal.classList.remove('show');
  }
});
