const db = require('../config/db');
const { assignLeadToAgent, logActivity } = require('../services/lead.service');

const createLead = async (req, res) => {
    const { name, email, phone, source, notes } = req.body;

    try {
        // Auto-assignment logic
        const assignedTo = await assignLeadToAgent();

        const [result] = await db.query(
            'INSERT INTO leads (name, email, phone, source, notes, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, phone, source, notes, assignedTo]
        );

        const leadId = result.insertId;
        await logActivity(leadId, req.user.id, 'Lead Created', { assignedTo });

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
        // Build update query dynamically
        const fields = Object.keys(updates).filter(f => ['name', 'email', 'phone', 'source', 'status', 'notes', 'assigned_to'].includes(f));
        if (fields.length === 0) return res.status(400).json({ message: 'No valid fields provided' });

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = fields.map(f => updates[f]);
        values.push(id);

        await db.query(`UPDATE leads SET ${setClause} WHERE id = ?`, values);
        
        await logActivity(id, req.user.id, 'Lead Updated', updates);

        res.json({ message: 'Lead updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLead = async (req, res) => {
    const { id } = req.params;

    try {
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

        const [logs] = await db.query(
            'SELECT al.*, u.name as user_name FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id WHERE al.lead_id = ? ORDER BY al.created_at DESC',
            [id]
        );

        res.json({ ...leads[0], activityLogs: logs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createLead, getLeads, updateLead, deleteLead, getLeadById };
