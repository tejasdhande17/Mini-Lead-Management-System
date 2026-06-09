const express = require('express');
const { createLead, getLeads, updateLead, deleteLead, getLeadById } = require('../controllers/lead.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect); // All lead routes are protected

router.post('/', authorize('Manager', 'Admin'), createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.put('/:id', authorize('Manager', 'Agent', 'Admin'), updateLead);
router.delete('/:id', authorize('Admin','Manager'), deleteLead);

module.exports = router;
