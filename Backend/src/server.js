const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Lead Management API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;
const db = require('./config/db');

async function startServer() {
    try {
        // Test database connection
        await db.query('SELECT 1');
        console.log('✅ Connected to MySQL database successfully.');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to MySQL database!');
        console.error('Error details:', error.message);
        console.error('\nPlease verify that:');
        console.error('1. Your MySQL server is running.');
        console.error('2. The credentials in Backend/.env match your local MySQL configuration.');
        console.error('3. You have run "npm run init-db" to create the database schema.\n');
        
        // Start server anyway so user can see health check status, but requests will fail clearly
        app.listen(PORT, () => {
            console.log(`🚀 Server started in degraded mode on port ${PORT} (Database Offline)`);
        });
    }
}

startServer();
