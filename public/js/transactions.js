/**
 * Transactions Module for AdBoost Platform
 * Handles transaction history display and management
 */

// Load transactions data when transactions tab is active
async function loadTransactionsData() {
  try {
    const response = await fetch('/api/transactions');

    if (!response.ok) {
      throw new Error('Failed to load transactions');
    }

    userTransactions = await response.json();
    displayTransactions();
  } catch (error) {
    console.error('Error loading transactions:', error);
    document.getElementById('transactionsList').innerHTML = '<p class="text-error">Failed to load transactions</p>';
  }
}

function displayTransactions() {
  const transactionsListElement = document.getElementById('transactionsList');

  if (userTransactions.length === 0) {
    transactionsListElement.innerHTML = `
            <div class="text-center" style="padding: 2rem;">
                <p class="text-gray mb-2">No transactions yet</p>
                <p class="text-gray">Start by recharging credits or creating advertisements</p>
            </div>
        `;
    return;
  }

  // Group transactions by date for better organization
  const groupedTransactions = groupTransactionsByDate(userTransactions);

  let transactionsHTML = '';

  // Add summary statistics
  const summary = calculateTransactionSummary(userTransactions);
  transactionsHTML += `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card">
                <div class="stat-number">+${summary.totalRecharges}</div>
                <div class="stat-label">Total Recharges</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.totalSpent}</div>
                <div class="stat-label">Total Spent</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.totalTransactions}</div>
                <div class="stat-label">Total Transactions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.currentBalance}</div>
                <div class="stat-label">Current Balance</div>
            </div>
        </div>
    `;

  // Add filter options
  transactionsHTML += `
        <div class="flex gap-2 mb-3">
            <select id="transactionTypeFilter" class="form-select" style="max-width: 200px;" onchange="filterTransactions()">
                <option value="">All Transaction Types</option>
                <option value="CREDIT_RECHARGE">Credit Recharges</option>
                <option value="AD_ACTIVATE">Ad Activations</option>
                <option value="AD_DAILY_DEBIT">Daily Charges</option>
                <option value="AD_PAUSE_REFUND">Refunds</option>
            </select>
            <button class="btn btn-secondary btn-small" onclick="exportTransactions()">Export CSV</button>
        </div>
    `;

  // Display transactions table
  transactionsHTML += `
        <div style="overflow-x: auto;">
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                        <th>Source</th>
                    </tr>
                </thead>
                <tbody id="transactionsTableBody">
                    ${generateTransactionRows(userTransactions)}
                </tbody>
            </table>
        </div>
    `;

  transactionsListElement.innerHTML = transactionsHTML;
}

function generateTransactionRows(transactions) {
  return transactions.map(transaction => {
    const date = new Date(transaction.createdAt);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const amount = transaction.amount;
    const amountStr = amount > 0 ? `+${amount}` : `${amount}`;
    const amountClass = amount > 0 ? 'text-success' : 'text-error';

    const typeLabel = getTransactionTypeLabel(transaction.type);
    const typeClass = getTransactionTypeClass(transaction.type);

    return `
            <tr data-type="${transaction.type}">
                <td>
                    <div>${dateStr}</div>
                    <div style="font-size: 0.8rem; color: var(--text-gray);">${timeStr}</div>
                </td>
                <td>
                    <span class="status-badge ${typeClass}">${typeLabel}</span>
                </td>
                <td>${transaction.note || '-'}</td>
                <td class="${amountClass}" style="font-weight: bold;">
                    ${amountStr} Credits
                </td>
                <td>${transaction.balanceAfter} Credits</td>
                <td>
                    <span style="text-transform: capitalize; font-size: 0.9rem; color: var(--text-gray);">
                        ${transaction.source}
                    </span>
                </td>
            </tr>
        `;
  }).join('');
}

function getTransactionTypeClass(type) {
  const classMap = {
    CREDIT_RECHARGE: 'status-active',
    AD_ACTIVATE: 'status-draft',
    AD_DAILY_DEBIT: 'status-paused',
    AD_PAUSE_REFUND: 'status-active',
    AD_CANCEL_REFUND: 'status-active',
    MANUAL_ADJUST: 'status-ended'
  };
  return classMap[type] || 'status-draft';
}

function groupTransactionsByDate(transactions) {
  const groups = {};
  transactions.forEach(transaction => {
    const date = new Date(transaction.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
  });
  return groups;
}

function calculateTransactionSummary(transactions) {
  const totalRecharges = transactions
    .filter(t => t.type === 'CREDIT_RECHARGE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  const currentBalance = transactions.length > 0 ? transactions[0].balanceAfter : 0;

  return {
    totalRecharges,
    totalSpent,
    totalTransactions: transactions.length,
    currentBalance
  };
}

// Filter transactions by type
function filterTransactions() {
  const filterType = document.getElementById('transactionTypeFilter').value;
  const rows = document.querySelectorAll('#transactionsTableBody tr');

  rows.forEach(row => {
    const rowType = row.getAttribute('data-type');
    if (!filterType || rowType === filterType) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Export transactions to CSV
function exportTransactions() {
  if (userTransactions.length === 0) {
    showMessage('No transactions to export', 'warning');
    return;
  }

  const headers = ['Date', 'Type', 'Description', 'Amount', 'Balance After', 'Source'];
  const csvData = [headers];

  userTransactions.forEach(transaction => {
    const row = [
      new Date(transaction.createdAt).toLocaleDateString(),
      getTransactionTypeLabel(transaction.type),
      transaction.note || '',
      transaction.amount,
      transaction.balanceAfter,
      transaction.source
    ];
    csvData.push(row);
  });

  const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `adboost-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showMessage('Transactions exported successfully!', 'success');
}

// Transaction type labels and utilities
function getTransactionTypeLabel(type) {
  const labels = {
    CREDIT_RECHARGE: 'Credit Recharge',
    AD_ACTIVATE: 'Ad Activation',
    AD_DAILY_DEBIT: 'Daily Charge',
    AD_PAUSE_REFUND: 'Pause Refund',
    AD_CANCEL_REFUND: 'Cancel Refund',
    MANUAL_ADJUST: 'Manual Adjustment'
  };
  return labels[type] || type;
}

// Transaction analytics (optional feature)
function showTransactionAnalytics() {
  // This function could be expanded to show charts and analytics
  // For now, we'll just show a simple breakdown

  const analytics = {
    recharges: userTransactions.filter(t => t.type === 'CREDIT_RECHARGE').length,
    adActivations: userTransactions.filter(t => t.type === 'AD_ACTIVATE').length,
    dailyCharges: userTransactions.filter(t => t.type === 'AD_DAILY_DEBIT').length,
    refunds: userTransactions.filter(t => t.type.includes('REFUND')).length
  };

  console.log('Transaction Analytics:', analytics);
}
