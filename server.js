import express from 'express';
import session from 'express-session';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();
/**
* Every credit movement is logged (positive and negative amounts)
* Balance snapshot stored with each transaction (balanceAfter)
* Detailed context (transaction type, source, notes, related ad ID)
* Fast queries with proper indexing
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'adboost';

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URL);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'adboost-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

// Routes

// Serve main page
app.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.sendFile(join(__dirname, 'public', 'login.html'));
  }
});

// Auth routes
app.post('/api/register', async(req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await db.collection('merchants').findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create new merchant
    const newMerchant = {
      username,
      email,
      password_hash,
      credits: 100, // Starting credits
      role: 'merchant',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('merchants').insertOne(newMerchant);

    // Create initial credit transaction
    await db.collection('transactions').insertOne({
      merchantId: result.insertedId,
      type: 'CREDIT_RECHARGE',
      amount: 100,
      balanceAfter: 100,
      note: 'Welcome bonus',
      source: 'system',
      createdAt: new Date()
    });

    // Set session
    req.session.user = {
      id: result.insertedId,
      username,
      email,
      role: 'merchant'
    };

    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async(req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await db.collection('merchants').findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.collection('merchants').updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    );

    // Set session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logout successful' });
  });
});

// User info route
app.get('/api/user', requireAuth, async(req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const user = await db.collection('merchants').findOne(
      { _id: new ObjectId(req.session.user.id) },
      { projection: { password_hash: 0 } }
    );
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Ads routes
app.get('/api/ads', requireAuth, async(req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const ads = await db.collection('ads').find({
      merchantId: new ObjectId(req.session.user.id)
    }).sort({ createdAt: -1 }).toArray();
    res.json(ads);
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ error: 'Failed to get ads' });
  }
});

app.post('/api/ads', requireAuth, async(req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const { title, type, targetUrl, bannerImageUrl, appStoreUrl, googlePlayUrl, budgetCredits } = req.body;

    // Validate required fields
    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    // Set cost per day based on type
    const costPerDay = {
      ECOMMERCE: 10,
      APP: 15,
      BANNER: 20
    }[type];

    const newAd = {
      merchantId: new ObjectId(req.session.user.id),
      title,
      type,
      status: 'draft',
      targetUrl: targetUrl || '',
      bannerImageUrl: bannerImageUrl || '',
      appStoreUrl: appStoreUrl || '',
      googlePlayUrl: googlePlayUrl || '',
      costPerDay,
      budgetCredits: budgetCredits || 0,
      metrics: {
        impressions: 0,
        clicks: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('ads').insertOne(newAd);
    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ error: 'Failed to create ad' });
  }
});

app.post('/api/ads/:id/activate', requireAuth, async(req, res) => {
  try {
    const adId = req.params.id;
    const { ObjectId } = await import('mongodb');

    // Get ad and user info
    const ad = await db.collection('ads').findOne({
      _id: new ObjectId(adId),
      merchantId: new ObjectId(req.session.user.id)
    });

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    const user = await db.collection('merchants').findOne({ _id: new ObjectId(req.session.user.id) });

    if (user.credits < ad.costPerDay) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Update ad status
    await db.collection('ads').updateOne(
      { _id: new ObjectId(adId) },
      {
        $set: {
          status: 'active',
          startDate: new Date(),
          updatedAt: new Date()
        }
      }
    );

    // Deduct credits
    const newBalance = user.credits - ad.costPerDay;
    await db.collection('merchants').updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: { credits: newBalance, updatedAt: new Date() } }
    );

    // Record transaction
    await db.collection('transactions').insertOne({
      merchantId: new ObjectId(req.session.user.id),
      adId: new ObjectId(adId),
      type: 'AD_ACTIVATE',
      amount: -ad.costPerDay,
      balanceAfter: newBalance,
      note: `Activated ad: ${ad.title}`,
      source: 'user',
      createdAt: new Date()
    });

    res.json({ success: true, message: 'Ad activated successfully' });
  } catch (error) {
    console.error('Activate ad error:', error);
    res.status(500).json({ error: 'Failed to activate ad' });
  }
});

app.delete('/api/ads/:id', requireAuth, async(req, res) => {
  try {
    const adId = req.params.id;
    const { ObjectId } = await import('mongodb');

    const result = await db.collection('ads').deleteOne({
      _id: new ObjectId(adId),
      merchantId: new ObjectId(req.session.user.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    res.json({ success: true, message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ error: 'Failed to delete ad' });
  }
});

// Simulate ad click
app.post('/api/ads/:id/click', async(req, res) => {
  try {
    const adId = req.params.id;
    const { ObjectId } = await import('mongodb');

    const ad = await db.collection('ads').findOne({ _id: new ObjectId(adId) });

    if (!ad || ad.status !== 'active') {
      return res.status(404).json({ error: 'Ad not found or not active' });
    }

    // Update metrics
    await db.collection('ads').updateOne(
      { _id: new ObjectId(adId) },
      {
        $inc: {
          'metrics.clicks': 1,
          'metrics.impressions': 1
        },
        $set: { updatedAt: new Date() }
      }
    );

    res.json({
      success: true,
      redirectUrl: ad.targetUrl || ad.appStoreUrl || ad.googlePlayUrl,
      adData: {
        title: ad.title,
        type: ad.type,
        bannerImageUrl: ad.bannerImageUrl
      }
    });
  } catch (error) {
    console.error('Ad click error:', error);
    res.status(500).json({ error: 'Failed to process ad click' });
  }
});

// Transactions routes
app.get('/api/transactions', requireAuth, async(req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const transactions = await db.collection('transactions').find({
      merchantId: new ObjectId(req.session.user.id)
    }).sort({ createdAt: -1 }).toArray();
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Credit recharge
app.post('/api/recharge', requireAuth, async(req, res) => {
  try {
    const { amount } = req.body;
    const { ObjectId } = await import('mongodb');

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await db.collection('merchants').findOne({ _id: new ObjectId(req.session.user.id) });
    const newBalance = user.credits + amount;

    // Update user credits
    await db.collection('merchants').updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: { credits: newBalance, updatedAt: new Date() } }
    );

    // Record transaction
    await db.collection('transactions').insertOne({
      merchantId: new ObjectId(req.session.user.id),
      type: 'CREDIT_RECHARGE',
      amount,
      balanceAfter: newBalance,
      note: 'Credit recharge',
      source: 'user',
      createdAt: new Date()
    });

    res.json({ success: true, newBalance });
  } catch (error) {
    console.error('Recharge error:', error);
    res.status(500).json({ error: 'Failed to recharge credits' });
  }
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 AdBoost server running on http://localhost:${PORT}`);
    console.log(`📊 MongoDB connected to database: ${DB_NAME}`);
  });
}

startServer().catch(console.error);
