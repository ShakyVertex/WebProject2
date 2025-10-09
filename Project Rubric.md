# Project Rubric

As discussed in class, in this project you will be applying the concepts learned by building a basic backend application with Node + Express + Mongo and HTML5

**Potential Rubric:**

**Design document including at least:**  

*** Project description**
*** User Personas**
*** User stories (use cases but with a story)**
*** Design mockups. 50**
Does the app accomplish all the requirements approved in #project   15
Is the app usable? Does it include instructions on how to be used?   5
Is the app actually useful? Would a final user use it?   5
The code includes an eslint config file and it doesn't throw any error   5
Is the code properly organized. Each page in its own file. Database files separate, CSS into folders, etc.   5
**Your JS code is organized in Modules (e.g. The Database connector) 15**
**Uses client side rendering for the frontend using only vanilla JavaScript 15**
Does it implement at least 1 form  15
Is the project deployed on a public server? Does it work there?   5
Does it use at least 2 Mongo Collections, supporting CRUD operations on them?   15
Does the app use node + express   5
The page is formatted using Prettier   5
Doesn't use non standard tags for accomplishing tasks that should be done with standard components? e.g. Buttons implemented with divs or spans   5
Is the CSS organized by Modules? Each module has its own css file as shown in class   5
Clear and descriptive README including: * Author * Class Link * Project Objective * Screenshot * Instructions to build   10
It doesn't expose any secret credentials such as the Mongo USER and Password   10
Does it include a package.json file listing all the dependencies of the project   5
Does it use MIT license   5
The project doesn't include leftover code that isn't used. e.g. routes/users.js or the default react faveicon   5
Is the google Form submission correct (thumbnail displays correctly, and links work as well)   5
Does it include a short public and narrated video demonstrating the application   10
The code was frozen on time (24 hours before class). Video, slides and deployment were completed before class   5

Your backend doesn't use CJS modules (Require) 10



# Project Proposal

Hi Professor [@John Alexis Guerra Gomez (Teacher)](https://webdev-online-neu.slack.com/team/U09D5U3USNR), here is the proposal for project-2, by [@Kangning Li](https://webdev-online-neu.slack.com/team/U09DK1EMKGD) **[ProjectProposal] AdBoost — Web-based Merchant Advertisement Management Platform**
**Project Description**
AdBoost is a web-based platform that enables merchants to manage and activate their own online advertisement campaigns using a credit-based system. Merchants can register and log in, purchase advertisement credits (simulated without real payment integration), and use these credits to activate customized ad campaigns. The platform provides merchants with an intuitive dashboard to view, activate, and manage different types of ad plans based on their business goals.
The platform supports **three advertisement types**:

- **E-commerce Link Ads** – redirect users to an online store or product page.
- **App Download Ads** – promote mobile apps with download links.
- **Web Banner Ads** – display visual banner ads for general website promotion.

Each ad type has its own pricing model and activation cost. Merchants can view campaign status, credit balance, and performance statistics directly from their personal dashboard.**Tech Stack**

- **Frontend:** HTML5, CSS3, vanilla JavaScript (ES6 modules)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Session Management:** express-session (for merchant authentication)

**User Stories**
**As a Merchant (Advertiser):**

- I want to register with a unique username and log in to manage my ads.
- I want to view my current credit balance and recharge credits (simulated purchase, no real payment).
- I want to browse available advertisement plans and see their activation costs.
- I want to activate an advertisement plan using my available credits.
- I want to view all active and past advertisement campaigns in my dashboard.
- I want to see campaign details such as ad type, cost, start date, and status.
- I want to pause or deactivate an ongoing campaign.
- I want to delete my account and all associated ads if I choose to leave the platform.

**Databases**

- **Merchants Collection** – Stores merchant accounts, login sessions, and credit balances.
- **Ads Collection** – Stores advertisement details (type, link, cost, status, associated merchant).
- **Transactions Collection** – Tracks simulated credit purchases and spending records.

**Key Features**

- **Merchant Registration & Login:** Simple username-based authentication using express-session.
- **Credit System:** Merchants use credits (virtual points) to activate ads. Credits can be “recharged” without real payment gateway integration.
- **Ad Plan Management:** Create and manage ad campaigns for three ad types—e-commerce, app download, and web banners.
- **Dashboard Overview:** View credit balance, campaign list, and spending statistics.
- **Ownership Control:** Each merchant can only view and manage their own ads and transactions.
- **Dynamic Pricing:** Each ad type has its own cost per activation or duration model.

**Example Ad Plans**
**Ad Type**
**Description**
**Cost (Credits)**
E-commerce Link
Redirects to product page
10 credits/day
App Download
Promotes a mobile app with download link
15 credits/day
Web Banner
Displays a banner image with custom link
20 credits/day
**Future Enhancements**

- Integrate real payment APIs (e.g., Stripe) for credit purchase.
- Add ad performance analytics (impressions, clicks, conversions).
- Enable time-based scheduling of ad campaigns.
- Support admin dashboard to monitor overall activity and merchant statistics.

**Project Members:**
	•		•	Kangning Li (Merchant Management, Credit System, Dashboard UI, Advertisement Module, Pricing Logic, Backend Integration)

# **AdBoost Database Design Document**

## **Overview**

The AdBoost platform uses **MongoDB** as its primary database to manage merchant authentication, advertisement campaigns, and credit-based transaction records.
 The database consists of three main collections:

1. `merchants` – Stores merchant credentials, authentication data, and credit balance.
2. `ads` – Stores all advertisement campaign details and their current statuses.
3. `transactions` – Tracks all credit-related activities for auditing and reporting purposes.

------

## **1. merchants Collection**

### **Purpose**

The `merchants` collection stores all merchant accounts. It supports login, session management, and credit balance tracking.

### **Schema Definition**

| Field           | Type         | Description                                          | Constraints / Notes                                          |
| --------------- | ------------ | ---------------------------------------------------- | ------------------------------------------------------------ |
| `_id`           | ObjectId     | Unique identifier automatically generated by MongoDB | Primary key                                                  |
| `username`      | String       | Unique merchant username                             | Required, unique, 3–32 alphanumeric characters               |
| `email`         | String       | Merchant email address                               | Required, unique, valid email format                         |
| `password_hash` | String       | Encrypted password using bcrypt                      | Required                                                     |
| `credits`       | Number (int) | Current available credits                            | Default = 0, cannot be negative                              |
| `role`          | String       | User role                                            | Enum: `["merchant", "admin"]`, default `"merchant"`          |
| `status`        | String       | Account status                                       | Enum: `["active", "suspended", "deleted"]`, default `"active"` |
| `lastLoginAt`   | Date         | Timestamp of the last login                          | Optional                                                     |
| `createdAt`     | Date         | Account creation date                                | Auto-set                                                     |
| `updatedAt`     | Date         | Last update time                                     | Auto-set                                                     |

### **Indexes**

- `username` – Unique
- `email` – Unique
- `status` – Non-unique for quick filtering

------

## **2. ads Collection**

### **Purpose**

The `ads` collection stores all advertisement campaign data, including type, cost, duration, and ownership by merchants.

### **Schema Definition**

| Field            | Type                          | Description                   | Constraints / Notes                                          |
| ---------------- | ----------------------------- | ----------------------------- | ------------------------------------------------------------ |
| `_id`            | ObjectId                      | Unique ad identifier          | Primary key                                                  |
| `merchantId`     | ObjectId (ref: merchants._id) | The merchant who owns this ad | Required, foreign key                                        |
| `title`          | String                        | Campaign title                | Required                                                     |
| `type`           | String                        | Advertisement type            | Enum: `["ECOMMERCE", "APP", "BANNER"]`                       |
| `status`         | String                        | Current ad state              | Enum: `["draft", "active", "paused", "ended", "cancelled"]`, default `"draft"` |
| `targetUrl`      | String                        | Destination URL for ad clicks | Required for `ECOMMERCE` and `BANNER` ads                    |
| `bannerImageUrl` | String                        | URL of banner image           | Required for `BANNER` ads                                    |
| `appStoreUrl`    | String                        | iOS App Store link            | Optional for `APP` ads                                       |
| `googlePlayUrl`  | String                        | Google Play link              | Optional for `APP` ads                                       |
| `costPerDay`     | Number (int)                  | Daily cost in credits         | Required, > 0                                                |
| `budgetCredits`  | Number (int)                  | Optional ad credit budget     | Optional                                                     |
| `startDate`      | Date                          | Activation date               | Optional                                                     |
| `endDate`        | Date                          | Deactivation or expiry date   | Optional                                                     |
| `metrics`        | Object                        | Performance stats             | `{ impressions: Number, clicks: Number }`, default `{0, 0}`  |
| `createdAt`      | Date                          | Date created                  | Auto-set                                                     |
| `updatedAt`      | Date                          | Date last updated             | Auto-set                                                     |

### **Indexes**

- Composite: `(merchantId, status)` for filtering by owner and state
- Secondary: `type`, `createdAt`

### **Relations**

- Each ad belongs to exactly **one merchant**.
- Optionally linked to multiple `transactions` for tracking spending.

------

## **3. transactions Collection**

### **Purpose**

The `transactions` collection records every credit change event — including top-ups, ad activations, daily charges, and refunds.

### **Schema Definition**

| Field          | Type                          | Description                                                  | Constraints / Notes                                          |
| -------------- | ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `_id`          | ObjectId                      | Unique transaction identifier                                | Primary key                                                  |
| `merchantId`   | ObjectId (ref: merchants._id) | Merchant who performed the transaction                       | Required                                                     |
| `adId`         | ObjectId (ref: ads._id)       | Related ad (if applicable)                                   | Optional                                                     |
| `type`         | String                        | Transaction type                                             | Enum: `["CREDIT_RECHARGE", "AD_ACTIVATE", "AD_DAILY_DEBIT", "AD_PAUSE_REFUND", "AD_CANCEL_REFUND", "MANUAL_ADJUST"]` |
| `amount`       | Number                        | Positive for income (recharge/refund), negative for spending | Cannot be 0                                                  |
| `balanceAfter` | Number                        | Merchant’s credit balance after transaction                  | Required                                                     |
| `note`         | String                        | Description or comment                                       | Optional                                                     |
| `source`       | String                        | Source of the transaction                                    | Enum: `["system", "user", "admin"]`, default `"system"`      |
| `createdAt`    | Date                          | Time of transaction                                          | Auto-set                                                     |

### **Indexes**

- `(merchantId, createdAt)` – For chronological filtering
- `(adId, createdAt)` – For ad-based financial reports
- `(type)` – For filtering by transaction type

------

## **Relationships Summary**

| Collection                | Relation | Target          | Type        | Description                                    |
| ------------------------- | -------- | --------------- | ----------- | ---------------------------------------------- |
| `ads.merchantId`          | →        | `merchants._id` | One-to-Many | Each merchant can own multiple ads             |
| `transactions.merchantId` | →        | `merchants._id` | One-to-Many | Each merchant can have many transactions       |
| `transactions.adId`       | →        | `ads._id`       | One-to-Many | Each ad can have multiple related transactions |

------

## **Data Flow Example**

1. **Merchant Registration** → Document created in `merchants`.
2. **Credit Recharge (Simulated)** → New record in `transactions` with positive `amount`, `merchants.credits` updated.
3. **Ad Activation** →
   - New document in `ads` (`status: active`)
   - Corresponding `transactions` record with negative `amount`
   - `merchants.credits` decreased accordingly
4. **Daily Debit or Refund** → Additional entries in `transactions`, maintaining running balance consistency.



# 基本功能

1. 用户注册、登录登出：通过邮箱和密码来进行唯一绑定，数据库只存储密码的hash
2. 广告方案的CRUD：用户可以管理自己账号下的所有的广告方案，包括：创建方案（使用积分购买方案）、删除方案、不支持编辑方案，而是模拟一次用户访问（点击对应的链接，弹出对应的广告窗口）
3. 当前用户的transactions查看：当前用户可以查看自己账户下的所有transactions

页面路由：登录页面->main tab（dashboard+广告方案CRUD+流水CRUD）

ui风格：不要使用复杂的ui交互和动画，使用简化的设计，颜色使用黑色+卡其色+白色

