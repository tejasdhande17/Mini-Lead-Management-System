const express = require('express');
const { createLead, getLeads, updateLead, deleteLead, getLeadById } = require('../controllers/lead.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect); // All lead routes are protected

router.post('/', authorize('Manager'), createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.put('/:id', authorize('Manager', 'Agent'), updateLead);
router.delete('/:id', authorize('Admin'), deleteLead);

module.exports = router;
