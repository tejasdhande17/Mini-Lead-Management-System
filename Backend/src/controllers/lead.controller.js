const db = require('../config/db');
const { assignLeadToAgent, logActivity } = require('../services/lead.service');
const { enrichLeadData } = require('../utils/enrichment');

const createLead = async (req, res) => {
    const { name, email, phone, source, notes } = req.body;

    try {
        // Auto-assignment logic
        const assignedTo = await assignLeadToAgent();

        // Third-party API Lead Enrichment
        let enrichedNotes = notes || '';
        try {
            const enrichment = await enrichLeadData();
            if (enrichment && enrichment.location) {
                enrichedNotes += `\n\n--- Enriched Data ---\nLocation: ${enrichment.location}\nGender: ${enrichment.gender}\nThumbnail: ${enrichment.thumbnail}`;
            }
        } catch (enrichError) {
            console.error('Lead enrichment failed:', enrichError.message);
        }

        const [result] = await db.query(
            'INSERT INTO leads (name, email, phone, source, notes, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, phone, source, enrichedNotes, assignedTo, req.user.id]
        );

        const leadId = result.insertId;
        await logActivity(leadId, req.user.id, 'Lead Created', { name, email, phone, source });
        if (assignedTo) {
            await logActivity(leadId, req.user.id, 'Lead Assigned', { assigned_to: assignedTo });
        }

        res.status(201).json({ id: leadId, message: 'Lead created and assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeads = async (req, res) => {
    const { page = 1, limit = 10, search = '', status = '', source = '', sortBy = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    try {
        let query = 'SELECT l.*, u.name as agent_name FROM leads l LEFT JOIN users u ON l.assigned_to = u.id WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.phone LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (status) {
            query += ' AND l.status = ?';
            params.push(status);
        }

        if (source) {
            query += ' AND l.source = ?';
            params.push(source);
        }

        // Role-based filtering: Agents only see their leads
        if (req.user.role === 'Agent') {
            query += ' AND l.assigned_to = ?';
            params.push(req.user.id);
        }

        // Role-based filtering: Managers only see leads created by them
        if (req.user.role === 'Manager') {
            query += ' AND l.created_by = ?';
            params.push(req.user.id);
        }

        const [totalRows] = await db.query(query.replace('l.*, u.name as agent_name', 'COUNT(*) as count'), params);
        
        query += ` ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [leads] = await db.query(query, params);

        res.json({
            leads,
            pagination: {
                total: totalRows[0].count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(totalRows[0].count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLead = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const [leads] = await db.query('SELECT * FROM leads WHERE id = ?', [id]);
        if (leads.length === 0) return res.status(404).json({ message: 'Lead not found' });
        const lead = leads[0];

        // Admins are allowed to update any lead fields
        // No restriction for Admin role

        // Managers are allowed to update any lead fields
        // No restriction for Manager role

        if (req.user.role === 'Agent') {
            if (lead.assigned_to !== req.user.id) {
                return res.status(403).json({ message: 'You are not authorized to update this lead' });
            }
            // Agents can only update status
            const fieldsToUpdate = Object.keys(updates).filter(f => ['name', 'email', 'phone', 'source', 'status', 'notes', 'assigned_to'].includes(f));
            const nonStatusFields = fieldsToUpdate.filter(f => f !== 'status');
            if (nonStatusFields.length > 0) {
                return res.status(403).json({ message: 'Agents are only allowed to update the status of a lead' });
            }
        }

        // Build update query dynamically
        const fields = Object.keys(updates).filter(f => ['name', 'email', 'phone', 'source', 'status', 'notes', 'assigned_to'].includes(f));
        if (fields.length === 0) return res.status(400).json({ message: 'No valid fields provided' });

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = fields.map(f => updates[f]);
        values.push(id);

        await db.query(`UPDATE leads SET ${setClause} WHERE id = ?`, values);
        
        // Log specific events
        if (updates.status) {
            await logActivity(id, req.user.id, 'Status Changed', { status: updates.status });
        }
        if (updates.assigned_to) {
            await logActivity(id, req.user.id, 'Lead Assigned', { assigned_to: updates.assigned_to });
        }

        // Log general update for other fields
        const otherFields = fields.filter(f => f !== 'status' && f !== 'assigned_to');
        if (otherFields.length > 0) {
            const otherUpdates = {};
            otherFields.forEach(f => { otherUpdates[f] = updates[f]; });
            await logActivity(id, req.user.id, 'Lead Updated', otherUpdates);
        }

        res.json({ message: 'Lead updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLead = async (req, res) => {
    const { id } = req.params;

    try {
        // Role based deletion rules
        const [leads] = await db.query('SELECT * FROM leads WHERE id = ?', [id]);
        if (leads.length === 0) return res.status(404).json({ message: 'Lead not found' });
        const lead = leads[0];

        // Role‑based deletion rules
        if (req.user.role === 'Admin' || req.user.role === 'Manager') {
            // Admins and Managers can delete any lead
        } else if (req.user.role === 'Agent') {
            // Agents can only delete leads assigned to them
            if (lead.assigned_to !== req.user.id) {
                return res.status(403).json({ message: 'Agents can only delete leads assigned to them' });
            }
        } else {
            return res.status(403).json({ message: 'You are not authorized to delete leads' });
        }
        await db.query('DELETE FROM leads WHERE id = ?', [id]);
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeadById = async (req, res) => {
    const { id } = req.params;

    try {
        const [leads] = await db.query(
            'SELECT l.*, u.name as agent_name FROM leads l LEFT JOIN users u ON l.assigned_to = u.id WHERE l.id = ?',
            [id]
        );
        
        if (leads.length === 0) return res.status(404).json({ message: 'Lead not found' });

        const lead = leads[0];
        if (req.user.role === 'Agent' && lead.assigned_to !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to view this lead' });
        }
        if (req.user.role === 'Manager' && lead.created_by !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to view this lead' });
        }

        const [logs] = await db.query(
            'SELECT al.*, u.name as user_name FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id WHERE al.lead_id = ? ORDER BY al.created_at DESC',
            [id]
        );

        res.json({ ...lead, activityLogs: logs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createLead, getLeads, updateLead, deleteLead, getLeadById };
