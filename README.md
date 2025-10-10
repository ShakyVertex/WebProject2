# AdBoost - Merchant Advertisement Management Platform

A web-based platform that enables merchants to manage and activate their own online advertisement campaigns using a credit-based system.

## Author
1. Kangning Li
2. Kewen Xu

## Class Link
CS5610 - Web Development
https://johnguerra.co/classes/webDevelopment_online_fall_2025/

## Project Objective
Build a comprehensive advertisement management platform where merchants can:
- Register and manage their accounts
- Purchase and manage advertisement credits
- Create, activate, and monitor advertisement campaigns
- View transaction history and analytics
- Simulate advertisement interactions

## Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Credit Management**: Virtual credit system for ad campaign funding
- **Advertisement Types**:
  - E-commerce Link Ads (10 credits/day)
  - App Download Ads (15 credits/day) 
  - Web Banner Ads (20 credits/day)
- **Campaign Management**: Full CRUD operations for advertisement campaigns
- **Transaction History**: Complete audit trail of all credit transactions
- **Ad Performance**: Track impressions and clicks for active campaigns

### Technical Features
- **Frontend**: Vanilla JavaScript with ES6 modules
- **Backend**: Node.js + Express
- **Database**: MongoDB with proper indexing and validation
- **Session Management**: Express-session for authentication
- **Code Quality**: ESLint and Prettier configuration
- **Responsive Design**: Mobile-friendly interface

## Screenshots

![Dashboard Screenshot](https://via.placeholder.com/800x400/c3b091/1a1a1a?text=AdBoost+Dashboard)

*Main dashboard showing campaign statistics and credit management*

## Project Link

🌐 **Live Demo**: [http://47.252.30.228:3000/](http://47.252.30.228:3000/)

**Test Account**:
- Username: `testUser`
- Password: `test123`

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 modules)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Session Management**: express-session
- **Code Quality**: ESLint + Prettier

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Community Edition)
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 5600Project2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   ```bash
   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   
   # Create database and collections
   npm run setup-db
   
   # Seed with test data
   npm run seed-db
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Use test account: username `techstore_owner`, password `password123`

## Usage Instructions

### For New Users
1. **Registration**: Click "Register" tab and create a new account
2. **Dashboard**: View your account statistics and credit balance
3. **Create Ads**: Navigate to "Ad Management" and create your first campaign
4. **Activate Campaigns**: Use credits to activate your advertisements
5. **Monitor Performance**: Track impressions and clicks in real-time

### For Existing Users
1. **Login**: Use your credentials to access the dashboard
2. **Recharge Credits**: Add more credits to fund campaigns
3. **Manage Campaigns**: Create, activate, pause, or delete advertisements
4. **View History**: Check transaction history and export data

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info

### Advertisement Management
- `GET /api/ads` - Get user's advertisements
- `POST /api/ads` - Create new advertisement
- `POST /api/ads/:id/activate` - Activate advertisement
- `DELETE /api/ads/:id` - Delete advertisement
- `POST /api/ads/:id/click` - Simulate ad click

### Credit Management
- `POST /api/recharge` - Recharge credits
- `GET /api/transactions` - Get transaction history

## Database Design

### Collections Overview

#### 1. **merchants** Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  email: String (unique, indexed),
  password_hash: String,
  credits: Number (default: 100),
  role: String (default: 'merchant'),
  status: String (default: 'active', indexed),
  createdAt: Date (indexed),
  updatedAt: Date,
  lastLoginAt: Date
}
```

#### 2. **ads** Collection
```javascript
{
  _id: ObjectId,
  merchantId: ObjectId (indexed),
  title: String,
  type: String, // 'ECOMMERCE', 'APP', 'BANNER'
  status: String (indexed), // 'draft', 'active', 'paused'
  targetUrl: String,
  bannerImageUrl: String,
  appStoreUrl: String,
  googlePlayUrl: String,
  costPerDay: Number, // 10/15/20 based on type
  budgetCredits: Number,
  metrics: {
    impressions: Number (default: 0),
    clicks: Number (default: 0)
  },
  createdAt: Date (indexed),
  updatedAt: Date,
  startDate: Date
}
```

#### 3. **transactions** Collection
```javascript
{
  _id: ObjectId,
  merchantId: ObjectId (indexed),
  adId: ObjectId (optional, indexed),
  type: String, // 'CREDIT_RECHARGE', 'AD_ACTIVATE'
  amount: Number, // positive for recharge, negative for spending
  balanceAfter: Number,
  note: String,
  source: String, // 'user', 'system'
  createdAt: Date (indexed)
}
```

### Key Features
- **Indexing**: Optimized queries with strategic indexes on frequently searched fields
- **Validation**: Schema validation ensures data integrity
- **Relationships**: Proper foreign key relationships between collections
- **Performance**: Compound indexes for complex queries

See `database/setup.js` for detailed schema definitions.

## Development

### Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Database Management
```bash
# Reset and setup database
npm run setup-db

# Add test data
npm run seed-db
```

## Project Structure
```
├── server.js              # Main Express server
├── package.json           # Project configuration
├── database/              # Database setup and schemas
│   ├── setup.js          # Database initialization
│   └── seed.js           # Test data seeding
├── public/                # Frontend assets
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript modules
│   ├── login.html        # Login page
│   └── dashboard.html    # Main application
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
└── README.md             # This file
```

## LLM Use

This project utilized Large Language Models to enhance development efficiency and documentation quality:

### **Claude Sonnet 4**
- **Project Framework Setup**: Used for initial project architecture design and scaffolding

### **ChatGPT-5**
- **Documentation Writing**: Used for creating comprehensive documentation and README content

## License
MIT License - see LICENSE file for details

## Contributing
This is a class project. For issues or suggestions, please contact the author.

---

**Note**: This project uses simulated payment processing. No real financial transactions are processed.