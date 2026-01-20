const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./api/routes/auth');
const analysisRoutes = require('./api/routes/analysis');
const progressRoutes = require('./api/routes/progress');

// CORS configuration - allow frontend access
app.use(cors({
  origin: [
    'http://localhost:9000', 'https://localhost:9000', 
    'http://localhost:7000', 'http://127.0.0.1:9000', 
    'http://localhost:3000', 'http://127.0.0.1:3000',
    'http://localhost:3001', 'http://127.0.0.1:3001',
    'http://localhost:5173', 'http://127.0.0.1:5173', // Common Vite ports
    'https://go-tanny-final.vercel.app', // Production Frontend
    'https://go-tanny-final.vercel.app/'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB (optional) — allow Firebase-only setups
let appDb = null;
const connectDB = async () => {
  const useFirebaseAuth = String(process.env.USE_FIREBASE_AUTH || '').toLowerCase() === 'true';
  
  if (!useFirebaseAuth) {
    const authUri = process.env.MONGO_URI_AUTH || 'mongodb://localhost:27017/fruit_auth';
    try {
      await mongoose.connect(authUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB Auth Connected');
    } catch (err) {
      console.error('MongoDB Auth Connection Error:', err.message);
    }
  } else {
    console.log('Using Firebase-only mode. MongoDB connection skipped.');
  }
};

connectDB().then(() => {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local: http://127.0.0.1:${PORT}`);
    console.log(`Network: http://192.168.1.21:${PORT}`);
  });
});

// Export optional appDb for future models
module.exports.appDb = appDb;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});