# Design Document

## 1. Project Description
AdBoost is a comprehensive web-based merchant advertisement management platform that enables businesses to create, manage, and activate online advertising campaigns using a credit-based system. The platform provides merchants with complete control over their advertising budget through virtual credits, supports multiple advertisement types (e-commerce links, app downloads, and web banners), and offers real-time campaign analytics. Built with modern web technologies including Node.js, Express, MongoDB, and vanilla JavaScript, AdBoost demonstrates enterprise-level web application development with secure authentication, responsive design, and robust data management. The platform serves as both a functional business tool and a showcase of full-stack web development capabilities.

## 2. User Personas

**Persona 1: Small Business Owner**
- Name: Sarah Kim
- Age: 35
- Occupation: Owner of an online boutique clothing store
- Goals: Increase online sales through targeted advertising within a controlled budget
- Pain Points: Limited marketing budget, needs simple ad management tools, wants clear ROI tracking
- Scenario: Sarah registers on AdBoost to create e-commerce link ads for her seasonal collection, monitors click-through rates, and adjusts campaigns based on performance

**Persona 2: Mobile App Developer**
- Name: David Chen
- Age: 29
- Occupation: Indie mobile app developer
- Goals: Promote new app downloads across multiple platforms
- Pain Points: Needs cost-effective user acquisition, wants to track download conversions
- Scenario: David creates app download campaigns for both iOS and Android versions of his productivity app, uses credit system to control spending, and monitors impression-to-download ratios

**Persona 3: Digital Marketing Manager**
- Name: Maria Rodriguez
- Age: 31
- Occupation: Marketing Manager at a mid-size tech company
- Goals: Manage multiple advertising campaigns for different products and services
- Pain Points: Needs comprehensive campaign oversight, detailed transaction history, and budget control
- Scenario: Maria oversees banner ad campaigns for various company services, tracks spending across departments, and generates reports for management review

**Persona 4: Academic Evaluator**
- Name: Prof. James Wilson
- Age: 48
- Occupation: CS5600 Web Development Professor
- Goals: Assess student's full-stack development skills and modern web practices
- Pain Points: Needs to evaluate code quality, security implementation, and adherence to requirements
- Scenario: Prof. Wilson reviews the AdBoost platform to grade technical implementation, database design, and user experience quality

## 3. User Stories

**As a merchant, I want to register for an account so that I can access the advertising platform and start creating campaigns.**

**As a business owner, I want to recharge my credit balance so that I can fund my advertising campaigns according to my budget.**

**As an advertiser, I want to create different types of ads (e-commerce, app, banner) so that I can choose the most suitable format for my marketing goals.**

**As a campaign manager, I want to activate my advertisements so that they become live and start generating impressions and clicks.**

**As a merchant, I want to view real-time analytics for my ads so that I can monitor performance and make data-driven decisions.**

**As a user, I want to see my transaction history so that I can track my advertising spending and budget allocation.**

**As a business owner, I want to delete or modify my campaigns so that I can adjust my marketing strategy based on performance.**

**As a mobile user, I want a responsive interface so that I can manage my campaigns from any device.**

**As a security-conscious user, I want secure authentication so that my account and financial information are protected.**

**As an advertiser, I want to simulate ad clicks so that I can test my campaigns and understand the user experience.**

## 4. Design Mockups

### Login Page Layout
```
┌─────────────────────────────────────────────────────┐
│              AdBoost Logo & Branding                │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐ │
│  │         [Login] [Register] Tabs              │ │
│  ├─────────────────────────────────────────────────┤ │
│  │  Username: [________________]                   │ │
│  │  Password: [________________]                   │ │
│  │                                                 │ │
│  │           [Login Button]                        │ │
│  │                                                 │ │
│  │  Test Account: testUser / test123               │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Dashboard Layout Structure
```
┌─────────────────────────────────────────────────────┐
│ Header: AdBoost | Credits: 150 | User | [Logout]    │
├─────────────────────────────────────────────────────┤
│      [Dashboard] [Ad Management] [Transactions]     │
├─────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│ │ Total   │ │ Active  │ │ Total   │ │ Total   │     │
│ │ Ads: 5  │ │ Ads: 2  │ │Impress. │ │Clicks:  │     │
│ │         │ │         │ │ 1,234   │ │ 89      │     │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
├─────────────────────────────────────────────────────┤
│ Credit Management: [Recharge] [View History]        │
├─────────────────────────────────────────────────────┤
│ Recent Activity Feed                                │
└─────────────────────────────────────────────────────┘
```

### Ad Management Layout
```
┌─────────────────────────────────────────────────────┐
│               [+ Create New Ad]                     │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ E-commerce Ad: "Summer Sale"        [Active]    │ │
│ │ Cost: 10 credits/day | Clicks: 45 | [Pause]    │ │
│ │ [Edit] [Delete] [View Analytics]                │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ App Ad: "Productivity App"          [Draft]     │ │
│ │ Cost: 15 credits/day | [Activate]               │ │
│ │ [Edit] [Delete]                                 │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Create Ad Modal
```
┌─────────────────────────────────────────────────────┐
│                   Create New Ad                     │
├─────────────────────────────────────────────────────┤
│ Ad Title: [________________________________]        │
│                                                     │
│ Ad Type: ○ E-commerce (10 credits/day)              │
│          ○ App Download (15 credits/day)            │
│          ● Web Banner (20 credits/day)              │
│                                                     │
│ Target URL: [____________________________]          │
│ Banner Image URL: [______________________]          │
│                                                     │
│ Budget Credits: [_____] (Optional)                  │
│                                                     │
│           [Cancel]    [Create Ad]                   │
└─────────────────────────────────────────────────────┘
```

### Transaction History Layout
```
┌─────────────────────────────────────────────────────┐
│ Transaction History                  [Export CSV]   │
├─────────────────────────────────────────────────────┤
│ Date       │ Type           │ Amount │ Balance      │
├─────────────────────────────────────────────────────┤
│ 2024-01-15 │ Credit Recharge│ +100   │ 150 credits  │
│ 2024-01-14 │ Ad Activation  │ -20    │ 50 credits   │
│ 2024-01-13 │ Ad Activation  │ -10    │ 70 credits   │
│ 2024-01-12 │ Credit Recharge│ +50    │ 80 credits   │
└─────────────────────────────────────────────────────┘
```

### Mobile Responsive Design
```
┌─────────────────┐
│ ☰ AdBoost      │
│    Credits: 150 │
├─────────────────┤
│ Dashboard       │
│ ┌─────┐ ┌─────┐ │
│ │Total│ │Activ│ │
│ │ 5   │ │ 2   │ │
│ └─────┘ └─────┘ │
│ ┌─────┐ ┌─────┐ │
│ │Impr.│ │Click│ │
│ │1,234│ │ 89  │ │
│ └─────┘ └─────┘ │
├─────────────────┤
│ [+ Create Ad]   │
├─────────────────┤
│ Ad List         │
│ (Stacked Cards) │
└─────────────────┘
```

### Interactive Features
- **Real-time Credit Updates**: Dynamic balance display across all pages
- **Ad Status Indicators**: Visual status badges (Active, Draft, Paused)
- **Interactive Metrics**: Hover effects showing detailed analytics
- **Modal Confirmations**: Secure confirmation dialogs for critical actions
- **Responsive Navigation**: Collapsible menu for mobile devices
- **Form Validation**: Real-time input validation with error messaging
- **Loading States**: Smooth loading animations during API calls
- **Success/Error Messages**: Toast notifications for user feedback
- **Auto-refresh**: Periodic updates for active campaign metrics
- **Keyboard Navigation**: Accessible navigation for power users