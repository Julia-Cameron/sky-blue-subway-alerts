const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const userRoutes = require ('./routes/user')
const reportRoutes = require('./routes/report');

// 1. Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// 2. Middleware
app.use(express.json()); 
app.use(cors());         

// 3. Mount Routes 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Basic root test route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'TTC Commuter Transit Alert API is active and running.' 
  });
});

// 4. Database Connection & Server Startup
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully...');
    
    // Start Express server only after database connection is verified
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  });