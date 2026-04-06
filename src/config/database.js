const mysql = require('mysql2');
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.DATABASE_MAIN_HOST,
  user: process.env.DATABASE_MAIN_USERNAME,
  password: process.env.DATABASE_MAIN_PASSWORD,
  database: process.env.DATABASE_MAIN_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const promisePool = pool.promise();

pool.on('connection', (connection) => {

  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

module.exports = {
  query: async (sql, params) => {
    const [rows] = await promisePool.query(sql, params);
    return { rows };
  },
  pool: promisePool
};
