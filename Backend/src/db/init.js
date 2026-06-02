const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const initDb = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    console.log('Connected to MySQL server.');

    // Read schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL by semicolon and filter out empty statements
    const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log('Creating database and tables...');
    for (const statement of statements) {
        await connection.query(statement);
    }
    console.log('Schema imported successfully.');

    // Check if demo users exist, if not create them
    const [users] = await connection.query('SELECT * FROM lead_management_db.users LIMIT 1');
    if (users.length === 0) {
        console.log('Inserting seed users...');
        const adminPass = await bcrypt.hash('password123', 10);
        const managerPass = await bcrypt.hash('password123', 10);
        const agentPass = await bcrypt.hash('password123', 10);

        await connection.query(
            `INSERT INTO lead_management_db.users (name, email, password, role) VALUES 
            ('System Admin', 'admin@example.com', ?, 'Admin'),
            ('Sales Manager', 'manager@example.com', ?, 'Manager'),
            ('Sales Agent', 'agent@example.com', ?, 'Agent')`,
            [adminPass, managerPass, agentPass]
        );
        console.log('Seed users created.');
    }

    await connection.end();
    console.log('Database initialization complete!');
};

initDb().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
