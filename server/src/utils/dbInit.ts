import pool from '../config/db';
import bcrypt from 'bcryptjs';
import { getDefaultSettings } from '../models/Setting';

export const initDatabase = async (): Promise<void> => {
    const connection = await pool.getConnection();
    
    try {
        console.log('开始初始化数据库...');
        
        // 创建users表 - 添加utf8mb4字符集
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(100) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
        console.log('✓ users表创建成功');
        
        // 创建images表 - 添加utf8mb4字符集
        await connection.query(`
            CREATE TABLE IF NOT EXISTS images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                file_path VARCHAR(255) NOT NULL,
                file_size INT NOT NULL,
                file_type VARCHAR(50) NOT NULL,
                width INT,
                height INT,
                is_public BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
        console.log('✓ images表创建成功');
        
        // 创建settings表 - 添加utf8mb4字符集
        await connection.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(50) NOT NULL UNIQUE,
                setting_value TEXT,
                setting_description VARCHAR(255),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
        console.log('✓ settings表创建成功');
        
        // 检查是否已经有管理员账户
        const [adminRows] = await connection.query('SELECT * FROM users WHERE role = "admin" LIMIT 1');
        
        if (Array.isArray(adminRows) && adminRows.length === 0) {
            // 创建默认管理员账户
            const salt = await bcrypt.genSalt(10);
            const adminPassword = 'admin123'; // 默认密码
            const passwordHash = await bcrypt.hash(adminPassword, salt);
            
            await connection.query(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@example.com', passwordHash, 'admin']
            );
            console.log('✓ 创建了默认管理员账户 (用户名: admin, 密码: admin123)');
        }
        
        // 插入默认设置
        const defaultSettings = getDefaultSettings();
        for (const setting of defaultSettings) {
            // 检查设置是否已存在
            const [settingRows] = await connection.query(
                'SELECT * FROM settings WHERE setting_key = ?', 
                [setting.key]
            );
            
            if (Array.isArray(settingRows) && settingRows.length === 0) {
                await connection.query(
                    'INSERT INTO settings (setting_key, setting_value, setting_description) VALUES (?, ?, ?)',
                    [setting.key, setting.value, setting.description]
                );
            }
        }
        console.log('✓ 默认设置初始化完成');
        
        console.log('数据库初始化完成！');
    } catch (error) {
        console.error('数据库初始化失败:', error);
        throw error;
    } finally {
        connection.release();
    }
};
