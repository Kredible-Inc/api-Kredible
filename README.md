# Credit Score API - NestJS

A **decentralized Credit Score system using Stellar** where external platforms can query the score of a wallet address via API.

## 🎯 System Objective

There are 3 types of users:
1. **External Platforms**: register and query the credit score of users via the API. Authenticate using an API Key.
2. **End Users**: can check their own score and upload documents or perform actions to earn points.
3. **Backoffice/Admin**: views platform usage, how many queries have been made, and how much is left in their plan.

## 🚀 Installation

```bash
# Clone the repository
git clone <repository-url>
cd api-CreditScore

# Install dependencies
npm install

# Configure environment variables
cp env.example .env
# Edit .env with your Firebase credentials

# Run in development
npm run start:dev
```

## 📦 Project Structure

```
src/
├── app.module.ts
├── main.ts
│
├── config/      # general and environment configuration
├── auth/        # API key guard, roles, and validation
├── common/      # global DTOs, pipes, filters
├── core/        # reusable services, logger, interceptors
│
├── modules/
│ ├── platform/  # registered platforms with their API Key
│ ├── user/      # end users (wallets)
│ ├── score/     # score calculation (pending logic)
│ ├── stats/     # usage and metrics for backoffice
│ ├── plan/      # usage plans per platform
│
├── firebase/    # initialization and functions to interact with Firebase Admin SDK
├── utils/       # common functions
```

## 🔐 Authentication

### External Platforms
- Authenticate using `x-api-key` in the header
- Each query is automatically logged
- Plan limit validation

### Admin
- Authenticate using `x-admin-key` in the header
- Access to statistics and platform management

## 📊 Main Endpoints

### Score
- `GET /score/:walletAddress` - Get the credit score of a wallet

### Platforms
- `POST /platforms` - Create a new platform (admin)

### Users
- `POST /users` - Create a user
- `GET /users/:walletAddress` - Get user
- `POST /users/:walletAddress/documents` - Add document
- `GET /users/:walletAddress/activity` - Get activity

### Statistics (Admin)
- `GET /stats` - Global statistics
- `GET /stats/usage` - Usage statistics
- `GET /stats/revenue` - Revenue statistics
- `GET /stats/platform/:platformId` - Platform statistics

### Plans
- `GET /plans/:platformId` - Get platform plan
- `PUT /plans/:platformId` - Update plan (admin)

## 🧠 Score

The `score` module includes a function `calculateScore(address: string): Promise<number>` that currently returns a random number between 0 and 100. The real algorithm will be implemented based on:

- On-chain activity (transactions, tokens, etc.)
- Uploaded documents
- User behavior patterns
- Activity on the Stellar network

## ☁️ Database

We use **Firebase (Firestore)** to:

- Store platforms with their API Key and query usage
- Store user activity
- Store query logs
- The admin panel (stats) is also powered by Firebase

## 🛠️ Technologies

- **NestJS** - Node.js framework
- **Firebase Admin SDK** - Database and authentication
- **Swagger** - API documentation
- **TypeScript** - Static typing
- **Stellar** - Blockchain for on-chain data

## 📚 Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## 🔧 Configuration

### Required environment variables

```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Admin
ADMIN_KEY=your-admin-secret-key

# Stellar
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

## 🚀 Available Scripts

```bash
# Development
npm run start:dev

# Production
npm run start:prod

# Build
npm run build

# Tests
npm run test
```

## 📝 TODO

- [ ] Implement real score calculation algorithm
- [ ] Integrate with Stellar Horizon API
- [ ] Document upload system
- [ ] On-chain activity tracking
- [ ] Payment system
- [ ] Admin dashboard
- [ ] Unit and integration tests