/**
 * Advertisement Management Module for AdBoost Platform
 * Handles CRUD operations for advertisements
 */

// Global variables for ad management
let currentAdId = null;

// Load ads data when ads tab is active
async function loadAdsData() {
  try {
    const response = await fetch('/api/ads');

    if (!response.ok) {
      throw new Error('Failed to load ads');
    }

    userAds = await response.json();
    displayAds();
  } catch (error) {
    console.error('Error loading ads:', error);
    document.getElementById('adsList').innerHTML = '<p class="text-error">Failed to load advertisements</p>';
  }
}

function displayAds() {
  const adsListElement = document.getElementById('adsList');

  if (userAds.length === 0) {
    adsListElement.innerHTML = `
            <div class="text-center" style="padding: 2rem;">
                <p class="text-gray mb-2">No advertisements created yet</p>
                <button class="btn btn-primary" onclick="showCreateAdModal()">Create Your First Ad</button>
            </div>
        `;
    return;
  }

  const adsHTML = userAds.map(ad => {
    const createdDate = new Date(ad.createdAt).toLocaleDateString();
    const statusBadge = getStatusBadge(ad.status);
    const typeBadge = getTypeBadge(ad.type);

    return `
            <div class="card">
                <div class="flex justify-between align-center mb-2">
                    <div class="flex align-center gap-2">
                        <h3 style="margin: 0;">${ad.title}</h3>
                        ${statusBadge}
                        ${typeBadge}
                    </div>
                    <div class="flex gap-1">
                        ${ad.status === 'draft' ? `<button class="btn btn-success btn-small" onclick="activateAd('${ad._id}')">Activate</button>` : ''}
                        ${ad.status === 'active' ? `<button class="btn btn-primary btn-small" onclick="previewAd('${ad._id}')">Preview</button>` : ''}
                        <button class="btn btn-danger btn-small" onclick="deleteAd('${ad._id}')">Delete</button>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
                    <div>
                        <strong>Cost per Day:</strong> ${ad.costPerDay} credits
                    </div>
                    <div>
                        <strong>Budget:</strong> ${ad.budgetCredits || 'Unlimited'} credits
                    </div>
                    <div>
                        <strong>Impressions:</strong> ${ad.metrics?.impressions || 0}
                    </div>
                    <div>
                        <strong>Clicks:</strong> ${ad.metrics?.clicks || 0}
                    </div>
                </div>
                
                ${ad.targetUrl ? `<div class="mb-1"><strong>Target URL:</strong> <a href="${ad.targetUrl}" target="_blank" style="color: var(--primary-khaki);">${ad.targetUrl}</a></div>` : ''}
                ${ad.appStoreUrl ? `<div class="mb-1"><strong>App Store:</strong> <a href="${ad.appStoreUrl}" target="_blank" style="color: var(--primary-khaki);">${ad.appStoreUrl}</a></div>` : ''}
                ${ad.googlePlayUrl ? `<div class="mb-1"><strong>Google Play:</strong> <a href="${ad.googlePlayUrl}" target="_blank" style="color: var(--primary-khaki);">${ad.googlePlayUrl}</a></div>` : ''}
                ${ad.bannerImageUrl ? `<div class="mb-1"><strong>Banner Image:</strong> <a href="${ad.bannerImageUrl}" target="_blank" style="color: var(--primary-khaki);">${ad.bannerImageUrl}</a></div>` : ''}
                
                <div class="text-gray" style="font-size: 0.9rem; margin-top: 1rem;">
                    Created: ${createdDate}
                    ${ad.startDate ? ` | Started: ${new Date(ad.startDate).toLocaleDateString()}` : ''}
                </div>
            </div>
        `;
  }).join('');

  adsListElement.innerHTML = adsHTML;
}

function getStatusBadge(status) {
  return `<span class="status-badge status-${status}">${status}</span>`;
}

function getTypeBadge(type) {
  const typeMap = {
    ECOMMERCE: { class: 'type-ecommerce', label: 'E-commerce' },
    APP: { class: 'type-app', label: 'App Download' },
    BANNER: { class: 'type-banner', label: 'Web Banner' }
  };

  const typeInfo = typeMap[type] || { class: 'type-ecommerce', label: type };
  return `<span class="type-badge ${typeInfo.class}">${typeInfo.label}</span>`;
}

// Create ad modal functions
function showCreateAdModal() {
  document.getElementById('createAdModal').classList.add('show');
}

function hideCreateAdModal() {
  document.getElementById('createAdModal').classList.remove('show');
  document.getElementById('createAdForm').reset();
  toggleAdFields(); // Reset field visibility
}

function toggleAdFields() {
  const adType = document.getElementById('adType').value;
  const targetUrlGroup = document.getElementById('targetUrlGroup');
  const bannerImageGroup = document.getElementById('bannerImageGroup');
  const appStoreGroup = document.getElementById('appStoreGroup');
  const googlePlayGroup = document.getElementById('googlePlayGroup');

  // Hide all optional fields first
  bannerImageGroup.classList.add('hidden');
  appStoreGroup.classList.add('hidden');
  googlePlayGroup.classList.add('hidden');

  // Show relevant fields based on ad type
  switch (adType) {
  case 'ECOMMERCE':
    targetUrlGroup.style.display = 'block';
    break;
  case 'APP':
    targetUrlGroup.style.display = 'none';
    appStoreGroup.classList.remove('hidden');
    googlePlayGroup.classList.remove('hidden');
    break;
  case 'BANNER':
    targetUrlGroup.style.display = 'block';
    bannerImageGroup.classList.remove('hidden');
    break;
  default:
    targetUrlGroup.style.display = 'block';
  }
}

// Create ad form handler
document.getElementById('createAdForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = {
    title: document.getElementById('adTitle').value,
    type: document.getElementById('adType').value,
    targetUrl: document.getElementById('targetUrl').value,
    bannerImageUrl: document.getElementById('bannerImageUrl').value,
    appStoreUrl: document.getElementById('appStoreUrl').value,
    googlePlayUrl: document.getElementById('googlePlayUrl').value,
    budgetCredits: parseInt(document.getElementById('budgetCredits').value) || 0
  };

  if (!formData.title || !formData.type) {
    showMessage('Please fill in all required fields', 'error');
    return;
  }

  try {
    const response = await fetch('/api/ads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Advertisement created successfully!', 'success');
      hideCreateAdModal();
      loadAdsData(); // Refresh ads list
    } else {
      showMessage(data.error || 'Failed to create advertisement', 'error');
    }
  } catch (error) {
    console.error('Create ad error:', error);
    showMessage('Network error. Please try again.', 'error');
  }
});

// Activate ad
async function activateAd(adId) {
  if (!confirm('Are you sure you want to activate this advertisement? This will deduct credits from your account.')) {
    return;
  }

  try {
    const response = await fetch(`/api/ads/${adId}/activate`, {
      method: 'POST'
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Advertisement activated successfully!', 'success');
      loadAdsData(); // Refresh ads list
      loadUserData(); // Refresh user credits
    } else {
      showMessage(data.error || 'Failed to activate advertisement', 'error');
    }
  } catch (error) {
    console.error('Activate ad error:', error);
    showMessage('Network error. Please try again.', 'error');
  }
}

// Delete ad
async function deleteAd(adId) {
  if (!confirm('Are you sure you want to delete this advertisement? This action cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch(`/api/ads/${adId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Advertisement deleted successfully!', 'success');
      loadAdsData(); // Refresh ads list
    } else {
      showMessage(data.error || 'Failed to delete advertisement', 'error');
    }
  } catch (error) {
    console.error('Delete ad error:', error);
    showMessage('Network error. Please try again.', 'error');
  }
}

// Preview ad
function previewAd(adId) {
  const ad = userAds.find(a => a._id === adId);
  if (!ad) return;

  currentAdId = adId;

  let previewContent = '';

  switch (ad.type) {
  case 'ECOMMERCE':
    previewContent = `
                <div style="border: 2px solid var(--primary-khaki); padding: 1.5rem; border-radius: 8px; background: var(--light-gray);">
                    <h3 style="color: var(--primary-khaki); margin-bottom: 1rem;">🛒 ${ad.title}</h3>
                    <p>Click to visit our store and discover amazing deals!</p>
                    <div style="margin-top: 1rem;">
                        <strong>Target URL:</strong> ${ad.targetUrl}
                    </div>
                </div>
            `;
    break;
  case 'APP':
    previewContent = `
                <div style="border: 2px solid var(--primary-khaki); padding: 1.5rem; border-radius: 8px; background: var(--light-gray);">
                    <h3 style="color: var(--primary-khaki); margin-bottom: 1rem;">📱 ${ad.title}</h3>
                    <p>Download our amazing app now!</p>
                    <div style="margin-top: 1rem;">
                        ${ad.appStoreUrl ? `<div><strong>App Store:</strong> ${ad.appStoreUrl}</div>` : ''}
                        ${ad.googlePlayUrl ? `<div><strong>Google Play:</strong> ${ad.googlePlayUrl}</div>` : ''}
                    </div>
                </div>
            `;
    break;
  case 'BANNER':
    previewContent = `
                <div style="border: 2px solid var(--primary-khaki); padding: 1.5rem; border-radius: 8px; background: var(--light-gray);">
                    <h3 style="color: var(--primary-khaki); margin-bottom: 1rem;">🎨 ${ad.title}</h3>
                    ${ad.bannerImageUrl ? `<img src="${ad.bannerImageUrl}" alt="Banner" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 1rem;" onerror="this.style.display='none'">` : ''}
                    <p>Click to learn more about our services!</p>
                    <div style="margin-top: 1rem;">
                        <strong>Target URL:</strong> ${ad.targetUrl}
                    </div>
                </div>
            `;
    break;
  }

  document.getElementById('adPreviewContent').innerHTML = previewContent;
  document.getElementById('adPreviewModal').classList.add('show');
}

function hideAdPreviewModal() {
  document.getElementById('adPreviewModal').classList.remove('show');
  currentAdId = null;
}

// Simulate ad click
async function simulateAdClick() {
  if (!currentAdId) return;

  try {
    const response = await fetch(`/api/ads/${currentAdId}/click`, {
      method: 'POST'
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Ad click simulated! Metrics updated.', 'success');

      // Show redirect simulation
      if (data.redirectUrl) {
        setTimeout(() => {
          if (confirm(`Ad would redirect to: ${data.redirectUrl}\n\nWould you like to open this URL?`)) {
            window.open(data.redirectUrl, '_blank');
          }
        }, 1000);
      }

      // Refresh ads data to show updated metrics
      loadAdsData();
      hideAdPreviewModal();
    } else {
      showMessage(data.error || 'Failed to simulate ad click', 'error');
    }
  } catch (error) {
    console.error('Simulate click error:', error);
    showMessage('Network error. Please try again.', 'error');
  }
}
