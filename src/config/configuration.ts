export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  admin: {
    key: process.env.ADMIN_KEY || "admin-secret-key",
  },
  stellar: {
    network: process.env.STELLAR_NETWORK || "testnet",
    horizonUrl:
      process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org",
  },
});
