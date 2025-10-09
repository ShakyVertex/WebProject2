/**
 * MongoDB Test Data Seeding Script for AdBoost Platform
 * This script inserts sample data for testing purposes
 */

// Database name
const dbName = 'adboost';

// Switch to adboost database
use(dbName);

// Sample merchants data
const merchants = [
  {
    username: 'techstore_owner',
    email: 'owner@techstore.com',
    password_hash: '$2b$10$rOKWnmZzZ1l9VcGZrK5zWOy8.3cN2QwXvZKfJlxYGKu5BhVqP7XYi', // password: password123
    credits: 500,
    role: 'merchant',
    status: 'active',
    lastLoginAt: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2024-01-01T08:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    username: 'app_developer',
    email: 'dev@mobilegames.com',
    password_hash: '$2b$10$rOKWnmZzZ1l9VcGZrK5zWOy8.3cN2QwXvZKfJlxYGKu5BhVqP7XYi', // password: password123
    credits: 750,
    role: 'merchant',
    status: 'active',
    lastLoginAt: new Date('2024-01-14T16:45:00Z'),
    createdAt: new Date('2024-01-03T12:00:00Z'),
    updatedAt: new Date('2024-01-14T16:45:00Z')
  },
  {
    username: 'fashion_brand',
    email: 'marketing@fashionbrand.com',
    password_hash: '$2b$10$rOKWnmZzZ1l9VcGZrK5zWOy8.3cN2QwXvZKfJlxYGKu5BhVqP7XYi', // password: password123
    credits: 1200,
    role: 'merchant',
    status: 'active',
    lastLoginAt: new Date('2024-01-16T09:15:00Z'),
    createdAt: new Date('2024-01-02T14:30:00Z'),
    updatedAt: new Date('2024-01-16T09:15:00Z')
  },
  {
    username: 'admin_user',
    email: 'admin@adboost.com',
    password_hash: '$2b$10$rOKWnmZzZ1l9VcGZrK5zWOy8.3cN2QwXvZKfJlxYGKu5BhVqP7XYi', // password: password123
    credits: 0,
    role: 'admin',
    status: 'active',
    lastLoginAt: new Date('2024-01-16T11:00:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-16T11:00:00Z')
  }
];

// Insert merchants and get their IDs
const merchantResult = db.merchants.insertMany(merchants);
const merchantIds = Object.values(merchantResult.insertedIds);

print(`✅ Inserted ${merchantIds.length} merchants`);

// Sample ads data
const ads = [
  {
    merchantId: merchantIds[0], // techstore_owner
    title: 'Latest Gaming Laptops - 50% Off!',
    type: 'ECOMMERCE',
    status: 'active',
    targetUrl: 'https://techstore.com/gaming-laptops',
    costPerDay: 15,
    budgetCredits: 300,
    startDate: new Date('2024-01-10T00:00:00Z'),
    endDate: new Date('2024-01-25T23:59:59Z'),
    metrics: {
      impressions: 1250,
      clicks: 87
    },
    createdAt: new Date('2024-01-09T14:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    merchantId: merchantIds[0], // techstore_owner
    title: 'Smart Home Bundle Deals',
    type: 'BANNER',
    status: 'paused',
    targetUrl: 'https://techstore.com/smart-home',
    bannerImageUrl: 'https://techstore.com/images/smart-home-banner.jpg',
    costPerDay: 20,
    budgetCredits: 200,
    startDate: new Date('2024-01-05T00:00:00Z'),
    metrics: {
      impressions: 850,
      clicks: 34
    },
    createdAt: new Date('2024-01-04T16:30:00Z'),
    updatedAt: new Date('2024-01-12T09:00:00Z')
  },
  {
    merchantId: merchantIds[1], // app_developer
    title: 'Epic Fantasy RPG - Download Now!',
    type: 'APP',
    status: 'active',
    appStoreUrl: 'https://apps.apple.com/us/app/epic-fantasy-rpg/id123456',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.mobilegames.epicfantasy',
    costPerDay: 25,
    budgetCredits: 500,
    startDate: new Date('2024-01-12T00:00:00Z'),
    endDate: new Date('2024-02-12T23:59:59Z'),
    metrics: {
      impressions: 2100,
      clicks: 156
    },
    createdAt: new Date('2024-01-11T10:00:00Z'),
    updatedAt: new Date('2024-01-15T16:45:00Z')
  },
  {
    merchantId: merchantIds[1], // app_developer
    title: 'Puzzle Master - Brain Training',
    type: 'APP',
    status: 'draft',
    appStoreUrl: 'https://apps.apple.com/us/app/puzzle-master/id789012',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.mobilegames.puzzlemaster',
    costPerDay: 18,
    metrics: {
      impressions: 0,
      clicks: 0
    },
    createdAt: new Date('2024-01-14T12:00:00Z'),
    updatedAt: new Date('2024-01-14T12:00:00Z')
  },
  {
    merchantId: merchantIds[2], // fashion_brand
    title: 'Spring Collection 2024',
    type: 'BANNER',
    status: 'active',
    targetUrl: 'https://fashionbrand.com/spring-2024',
    bannerImageUrl: 'https://fashionbrand.com/images/spring-collection-banner.jpg',
    costPerDay: 30,
    budgetCredits: 600,
    startDate: new Date('2024-01-08T00:00:00Z'),
    endDate: new Date('2024-03-01T23:59:59Z'),
    metrics: {
      impressions: 3200,
      clicks: 245
    },
    createdAt: new Date('2024-01-07T11:30:00Z'),
    updatedAt: new Date('2024-01-16T09:15:00Z')
  },
  {
    merchantId: merchantIds[2], // fashion_brand
    title: 'Winter Clearance Sale',
    type: 'ECOMMERCE',
    status: 'ended',
    targetUrl: 'https://fashionbrand.com/winter-clearance',
    costPerDay: 12,
    budgetCredits: 240,
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-01-15T23:59:59Z'),
    metrics: {
      impressions: 1800,
      clicks: 98
    },
    createdAt: new Date('2023-12-28T15:00:00Z'),
    updatedAt: new Date('2024-01-15T23:59:59Z')
  }
];

// Insert ads and get their IDs
const adResult = db.ads.insertMany(ads);
const adIds = Object.values(adResult.insertedIds);

print(`✅ Inserted ${adIds.length} ads`);

// Sample transactions data
const transactions = [
  // Credit recharges
  {
    merchantId: merchantIds[0], // techstore_owner
    type: 'CREDIT_RECHARGE',
    amount: 1000,
    balanceAfter: 1000,
    note: 'Initial credit purchase',
    source: 'user',
    createdAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    merchantId: merchantIds[1], // app_developer
    type: 'CREDIT_RECHARGE',
    amount: 1500,
    balanceAfter: 1500,
    note: 'Monthly advertising budget',
    source: 'user',
    createdAt: new Date('2024-01-03T14:00:00Z')
  },
  {
    merchantId: merchantIds[2], // fashion_brand
    type: 'CREDIT_RECHARGE',
    amount: 2000,
    balanceAfter: 2000,
    note: 'Q1 marketing budget',
    source: 'user',
    createdAt: new Date('2024-01-02T16:00:00Z')
  },

  // Ad activations and daily debits
  {
    merchantId: merchantIds[0], // techstore_owner
    adId: adIds[0],
    type: 'AD_ACTIVATE',
    amount: -15,
    balanceAfter: 985,
    note: 'Activated Gaming Laptops campaign',
    source: 'system',
    createdAt: new Date('2024-01-10T00:00:00Z')
  },
  {
    merchantId: merchantIds[0], // techstore_owner
    adId: adIds[1],
    type: 'AD_ACTIVATE',
    amount: -20,
    balanceAfter: 965,
    note: 'Activated Smart Home Bundle campaign',
    source: 'system',
    createdAt: new Date('2024-01-05T00:00:00Z')
  },
  {
    merchantId: merchantIds[1], // app_developer
    adId: adIds[2],
    type: 'AD_ACTIVATE',
    amount: -25,
    balanceAfter: 1475,
    note: 'Activated Epic Fantasy RPG campaign',
    source: 'system',
    createdAt: new Date('2024-01-12T00:00:00Z')
  },
  {
    merchantId: merchantIds[2], // fashion_brand
    adId: adIds[4],
    type: 'AD_ACTIVATE',
    amount: -30,
    balanceAfter: 1970,
    note: 'Activated Spring Collection campaign',
    source: 'system',
    createdAt: new Date('2024-01-08T00:00:00Z')
  },
  {
    merchantId: merchantIds[2], // fashion_brand
    adId: adIds[5],
    type: 'AD_ACTIVATE',
    amount: -12,
    balanceAfter: 1958,
    note: 'Activated Winter Clearance campaign',
    source: 'system',
    createdAt: new Date('2024-01-01T00:00:00Z')
  },

  // Daily debits (simulation of ongoing charges)
  {
    merchantId: merchantIds[0], // techstore_owner
    adId: adIds[0],
    type: 'AD_DAILY_DEBIT',
    amount: -15,
    balanceAfter: 950,
    note: 'Daily charge for Gaming Laptops campaign',
    source: 'system',
    createdAt: new Date('2024-01-11T00:00:00Z')
  },
  {
    merchantId: merchantIds[0], // techstore_owner
    adId: adIds[0],
    type: 'AD_DAILY_DEBIT',
    amount: -15,
    balanceAfter: 935,
    note: 'Daily charge for Gaming Laptops campaign',
    source: 'system',
    createdAt: new Date('2024-01-12T00:00:00Z')
  },
  {
    merchantId: merchantIds[1], // app_developer
    adId: adIds[2],
    type: 'AD_DAILY_DEBIT',
    amount: -25,
    balanceAfter: 1450,
    note: 'Daily charge for Epic Fantasy RPG campaign',
    source: 'system',
    createdAt: new Date('2024-01-13T00:00:00Z')
  },
  {
    merchantId: merchantIds[1], // app_developer
    adId: adIds[2],
    type: 'AD_DAILY_DEBIT',
    amount: -25,
    balanceAfter: 1425,
    note: 'Daily charge for Epic Fantasy RPG campaign',
    source: 'system',
    createdAt: new Date('2024-01-14T00:00:00Z')
  },

  // Pause refund
  {
    merchantId: merchantIds[0], // techstore_owner
    adId: adIds[1],
    type: 'AD_PAUSE_REFUND',
    amount: 140,
    balanceAfter: 575,
    note: 'Refund for paused Smart Home Bundle campaign (7 days unused)',
    source: 'system',
    createdAt: new Date('2024-01-12T09:00:00Z')
  },

  // Recent recharge
  {
    merchantId: merchantIds[0], // techstore_owner
    type: 'CREDIT_RECHARGE',
    amount: 300,
    balanceAfter: 875,
    note: 'Additional credit purchase',
    source: 'user',
    createdAt: new Date('2024-01-14T11:00:00Z')
  }
];

// Insert transactions
const transactionResult = db.transactions.insertMany(transactions);

print(`✅ Inserted ${transactionResult.insertedIds.length} transactions`);

// Update merchant credit balances to match final transaction balances
db.merchants.updateOne(
  { _id: merchantIds[0] },
  { $set: { credits: 500 } } // techstore_owner final balance
);

db.merchants.updateOne(
  { _id: merchantIds[1] },
  { $set: { credits: 750 } } // app_developer final balance
);

db.merchants.updateOne(
  { _id: merchantIds[2] },
  { $set: { credits: 1200 } } // fashion_brand final balance
);

print('✅ Updated merchant credit balances');

// Show summary
print('\n📊 Database Seeding Summary:');
print(`👥 Merchants: ${db.merchants.countDocuments()}`);
print(`📢 Ads: ${db.ads.countDocuments()}`);
print(`💳 Transactions: ${db.transactions.countDocuments()}`);

print('\n🔍 Sample Queries:');
print('// View all active ads:');
print('db.ads.find({ status: "active" })');
print('\n// View merchant with transactions:');
print('db.merchants.aggregate([{ $lookup: { from: "transactions", localField: "_id", foreignField: "merchantId", as: "transactions" }}])');

print('\n✨ Test data seeding completed successfully!');
