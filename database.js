const { Pool } = require("pg");

const pool = new Pool({connectionString: process.env.DATABASE, idleTimeoutMillis: 1500});
module.exports.db = pool;