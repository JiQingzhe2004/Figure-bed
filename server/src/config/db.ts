import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // 确保环境变量已加载

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'figure_bed',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4', // 确保使用utf8mb4字符集
});

export default pool;
