const db = require('../config/db');

const assignLeadToAgent = async () => {
    // Round-robin or least-loaded assignment logic
    // Implementation: Find the agent with the fewest assigned leads in 'New' or 'Contacted' status
    const [agents] = await db.query(
        "SELECT id FROM users WHERE role = 'Agent' ORDER BY id ASC"
    );

    if (agents.length === 0) return null;

    // Get the count of leads per agent
    const [counts] = await db.query(`
        SELECT assigned_to, COUNT(*) as lead_count 
        FROM leads 
        WHERE assigned_to IS NOT NULL 
        GROUP BY assigned_to
    `);

    // Simple Round-robin fallback: if no leads assigned, pick first. 
    // Otherwise pick the one with the lowest count.
    let selectedAgentId = agents[0].id;
    let minCount = Infinity;

    const countMap = counts.reduce((acc, curr) => {
        acc[curr.assigned_to] = curr.lead_count;
        return acc;
    }, {});

    for (const agent of agents) {
        const count = countMap[agent.id] || 0;
        if (count < minCount) {
            minCount = count;
            selectedAgentId = agent.id;
        }
    }

    return selectedAgentId;
};

const logActivity = async (leadId, userId, action, details) => {
    try {
        await db.query(
            'INSERT INTO activity_logs (lead_id, user_id, action, details) VALUES (?, ?, ?, ?)',
            [leadId, userId, action, JSON.stringify(details)]
        );
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

module.exports = { assignLeadToAgent, logActivity };
