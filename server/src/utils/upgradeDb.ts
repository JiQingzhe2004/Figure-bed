import pool from '../config/db';

export const upgradeDatabase = async (): Promise<void> => {
    const connection = await pool.getConnection();
    
    try {
        console.log('开始升级数据库字符集...');
        
        // 修改数据库字符集
        console.log('正在修改数据库字符集为utf8mb4...');
        await connection.query('ALTER DATABASE img CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci');
        
        // 修改images表字符集
        console.log('正在修改images表字符集...');
        try {
            await connection.query(`
                ALTER TABLE images 
                CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            `);
            console.log('✓ images表字符集升级完成');
        } catch (err) {
            console.error('修改images表失败，可能表不存在:', err);
        }
        
        // 修改users表字符集
        console.log('正在修改users表字符集...');
        try {
            await connection.query(`
                ALTER TABLE users 
                CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            `);
            console.log('✓ users表字符集升级完成');
        } catch (err) {
            console.error('修改users表失败，可能表不存在:', err);
        }
        
        // 修改settings表字符集
        console.log('正在修改settings表字符集...');
        try {
            await connection.query(`
                ALTER TABLE settings 
                CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            `);
            console.log('✓ settings表字符集升级完成');
        } catch (err) {
            console.error('修改settings表失败，可能表不存在:', err);
        }
        
        // 修改数据库连接字符集
        console.log('正在修改数据库连接字符集...');
        await connection.query('SET NAMES utf8mb4');
        
        console.log('数据库字符集升级完成！');
    } catch (error) {
        console.error('数据库升级失败:', error);
        throw error;
    } finally {
        connection.release();
    }
};
