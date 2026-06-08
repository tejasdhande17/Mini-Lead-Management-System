const express = require('express');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { protect, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

// Get all agents (accessible by Admin and Manager)
router.get('/agents', protect, authorize('Admin', 'Manager'), async (req, res) => {
    try {
        const [agents] = await db.query("SELECT id, name, email FROM users WHERE role = 'Agent'");
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Get all users
router.get('/', protect, authorize('Admin'), async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Create new user (Manager or Agent)
router.post('/', protect, authorize('Admin'), async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (role !== 'Manager' && role !== 'Agent') {
        return res.status(400).json({ message: 'Admin can only create Manager or Agent users' });
    }

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.status(201).json({
            success: true,
            message: `${role} created successfully`,
            userId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
