// Creates the database (if allowed) and runs schema.sql
// Usage: npm run init-db
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};
const dbName = process.env.DB_NAME || 'festival_lineup';

(async () => {
  try {
    // 1. Try to create the database (cloud hosts may not allow this, so ignore errors)
    try {
      const admin = await mysql.createConnection(config);
      await admin.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      await admin.end();
    } catch (e) {
      console.log('Could not create database (it may already exist):', e.message);
    }

    // 2. Run schema.sql inside that database
    const conn = await mysql.createConnection({
      ...config,
      database: dbName,
      multipleStatements: true,
    });
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await conn.query(sql);
    const [rows] = await conn.query('SELECT COUNT(*) AS total FROM lineup');
    console.log(`Done. Table "lineup" created with ${rows[0].total} records in "${dbName}".`);
    await conn.end();
  } catch (err) {
    console.error('Database setup failed:', err.message);
    process.exit(1);
  }
})();
