/**
 * MongoDB Database Setup Script for AdBoost Platform
 * This script creates the database and collections with proper indexes
 */

// Database name
const dbName = 'adboost';

// Switch to adboost database
use(dbName);

// Drop existing collections if they exist (for clean setup)
db.merchants.drop();
db.ads.drop();
db.transactions.drop();

// Create merchants collection with validation
db.createCollection('merchants', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password_hash', 'credits'],
      properties: {
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 32,
          pattern: '^[a-zA-Z0-9_]+$'
        },
        email: {
          bsonType: 'string',
          pattern: '^[^@]+@[^@]+\.[^@]+$'
        },
        password_hash: {
          bsonType: 'string',
          minLength: 1
        },
        credits: {
          bsonType: 'int',
          minimum: 0
        },
        role: {
          enum: ['merchant', 'admin']
        },
        status: {
          enum: ['active', 'suspended', 'deleted']
        },
        lastLoginAt: {
          bsonType: 'date'
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Create ads collection with validation
db.createCollection('ads', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['merchantId', 'title', 'type', 'costPerDay'],
      properties: {
        merchantId: {
          bsonType: 'objectId'
        },
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100
        },
        type: {
          enum: ['ECOMMERCE', 'APP', 'BANNER']
        },
        status: {
          enum: ['draft', 'active', 'paused', 'ended', 'cancelled']
        },
        targetUrl: {
          bsonType: 'string'
        },
        bannerImageUrl: {
          bsonType: 'string'
        },
        appStoreUrl: {
          bsonType: 'string'
        },
        googlePlayUrl: {
          bsonType: 'string'
        },
        costPerDay: {
          bsonType: 'int',
          minimum: 1
        },
        budgetCredits: {
          bsonType: 'int',
          minimum: 0
        },
        startDate: {
          bsonType: 'date'
        },
        endDate: {
          bsonType: 'date'
        },
        metrics: {
          bsonType: 'object',
          properties: {
            impressions: {
              bsonType: 'int',
              minimum: 0
            },
            clicks: {
              bsonType: 'int',
              minimum: 0
            }
          }
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Create transactions collection with validation
db.createCollection('transactions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['merchantId', 'type', 'amount', 'balanceAfter'],
      properties: {
        merchantId: {
          bsonType: 'objectId'
        },
        adId: {
          bsonType: 'objectId'
        },
        type: {
          enum: ['CREDIT_RECHARGE', 'AD_ACTIVATE', 'AD_DAILY_DEBIT', 'AD_PAUSE_REFUND', 'AD_CANCEL_REFUND', 'MANUAL_ADJUST']
        },
        amount: {
          bsonType: 'number'
        },
        balanceAfter: {
          bsonType: 'number',
          minimum: 0
        },
        note: {
          bsonType: 'string'
        },
        source: {
          enum: ['system', 'user', 'admin']
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Create indexes for merchants collection
db.merchants.createIndex({ username: 1 }, { unique: true });
db.merchants.createIndex({ email: 1 }, { unique: true });
db.merchants.createIndex({ status: 1 });
db.merchants.createIndex({ createdAt: 1 });

// Create indexes for ads collection
db.ads.createIndex({ merchantId: 1, status: 1 });
db.ads.createIndex({ type: 1 });
db.ads.createIndex({ createdAt: 1 });
db.ads.createIndex({ status: 1 });

// Create indexes for transactions collection
db.transactions.createIndex({ merchantId: 1, createdAt: -1 });
db.transactions.createIndex({ adId: 1, createdAt: -1 });
db.transactions.createIndex({ type: 1 });
db.transactions.createIndex({ createdAt: -1 });

print('✅ Database setup completed successfully!');
print('📊 Collections created: merchants, ads, transactions');
print('🔧 Indexes created for optimal performance');
print('✨ Validation rules applied to ensure data integrity');
