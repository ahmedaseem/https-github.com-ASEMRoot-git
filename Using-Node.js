// Run this in your server initialization
const fs = require('fs');
const schema = fs.readFileSync('./DATABASE_SCHEMA.sql', 'utf8');
await db.query(schema);
