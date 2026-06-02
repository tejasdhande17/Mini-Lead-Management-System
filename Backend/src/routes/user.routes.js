const express = require('express');
const db = require('../config/db');
const { protect, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/agents', protect, authorize('Admin', 'Manager'), async (req, res) => {
    try {
        const [agents] = await db.query("SELECT id, name, email FROM users WHERE role = 'Agent'");
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
