const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('dotenv').config();

/*
REGISTER USER
*/
const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const [existing] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Secure password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [
                name,
                email,
                hashedPassword,
                role || 'Agent'
            ]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/*
LOGIN USER
*/
const login = async (req, res) => {
    const { email, password } = req.body;

    // DIAGNOSTIC LOGS: Extremely helpful for debugging exact credentials and db state
    console.log('\n=======================================');
    console.log('🔑 [Login Attempt Received]');
    console.log(`- Request Email:    "${email}"`);
    console.log(`- Request Password: "${password}"`);

    try {
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        console.log(`- Users found in DB: ${users.length}`);

        if (users.length === 0) {
            console.log('❌ [Failed]: No user found with this email in the database.');
            console.log('=======================================\n');
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];
        console.log(`- DB User Name:     "${user.name}"`);
        console.log(`- DB User Role:     "${user.role}"`);
        console.log(`- DB Password Hash: "${user.password}"`);

        // Hybrid Password Validation (Supports both Bcrypt Hashed passwords and Manual Plain-text uploads)
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.password);
            console.log(`- Bcrypt Match:     ${isMatch}`);
        } catch (bcryptErr) {
            console.log('- Bcrypt Match:     Failed (Invalid Hash Format - proceeding to plaintext comparison)');
            isMatch = false;
        }

        // Fallback check: Direct string match for manually inserted plain-text passwords
        if (!isMatch && password === user.password) {
            console.log('- Plaintext Match:  Success (Match found using plaintext comparison)');
            isMatch = true;
        } else if (!isMatch) {
            console.log('- Plaintext Match:  Failed');
        }

        if (!isMatch) {
            console.log('❌ [Failed]: Password mismatch. Access denied.');
            console.log('=======================================\n');
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log('✅ [Success]: Authentication passed. Generating token...');
        console.log('=======================================\n');

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE || '24h'
            }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('❌ [Database Error during Login]:', error);
        console.log('=======================================\n');
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
};