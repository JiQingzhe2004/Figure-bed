import pool from '../config/db';
import bcrypt from 'bcryptjs';

// 初始化数据库函数
export const initDatabase = async () => {
    try {
        console.log('开始初始化数据库...');

        // 创建users表
        const usersTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            avatar_path VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
        
        await pool.query(usersTableSql);
        console.log('Users表已初始化');

        // 创建images表，包含thumbnail_path字段
        const imagesTableSql = `
        CREATE TABLE IF NOT EXISTS images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            filename VARCHAR(255) NOT NULL,
            original_name VARCHAR(255) NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            file_size INT NOT NULL,
            file_type VARCHAR(100) NOT NULL,
            width INT,
            height INT,
            is_public BOOLEAN DEFAULT TRUE,
            thumbnail_path VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
        
        await pool.query(imagesTableSql);
        console.log('Images表已初始化');

        // 创建settings表
        const settingsTableSql = `
        CREATE TABLE IF NOT EXISTS settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(50) NOT NULL UNIQUE,
            setting_value TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
        
        await pool.query(settingsTableSql);
        console.log('Settings表已初始化');

        // 检查并修复现有表的字符集
        await upgradeTablesCharset();
        
        // 添加默认管理员账号
        await createDefaultAdmin();
        
        // 添加默认设置
        await insertDefaultSettings();

        console.log('数据库初始化完成');
    } catch (error) {
        console.error('初始化数据库失败:', error);
        throw error;
    }
};

// 修复表的字符集（从upgradeDb.ts合并）
const upgradeTablesCharset = async () => {
    try {
        // 获取所有表
        const [tables] = await pool.query('SHOW TABLES');
        
        for (const tableRow of tables as any[]) {
            const tableName = Object.values(tableRow)[0] as string;
            
            // 修改表字符集
            await pool.query(
                `ALTER TABLE ${tableName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
            );
            
            // 获取表的所有列
            const [columns] = await pool.query(`SHOW FULL COLUMNS FROM ${tableName}`);
            
            for (const column of columns as any[]) {
                if (column.Type.includes('varchar') || column.Type.includes('text')) {
                    // 修改列字符集
                    await pool.query(
                        `ALTER TABLE ${tableName} MODIFY ${column.Field} ${column.Type} 
                        CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
                    );
                }
            }
        }
        
        console.log('所有表已升级为utf8mb4字符集');
    } catch (error) {
        console.error('升级表字符集失败:', error);
        throw error;
    }
};

// 创建默认管理员账号
const createDefaultAdmin = async () => {
    try {
        // 检查是否已有管理员账号
        const [admins] = await pool.query('SELECT * FROM users WHERE role = ?', ['admin']);
        
        if ((admins as any[]).length === 0) {
            const defaultPassword = 'admin123';  // 默认密码
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            
            // 使用事务确保操作完整性
            await pool.query('START TRANSACTION');
            
            try {
                await pool.query(
                    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                    ['admin', 'admin@example.com', hashedPassword, 'admin']
                );
                
                await pool.query('COMMIT');
                console.log('已创建默认管理员账号 (用户名: admin, 密码: admin123)');
            } catch (error) {
                await pool.query('ROLLBACK');
                throw error;
            }
        }
    } catch (error) {
        console.error('创建默认管理员账号失败:', error);
    }
};

// 插入默认设置
const insertDefaultSettings = async () => {
    try {
        const defaultSettings = [
            { key: 'site_name', value: '图床应用' },
            { key: 'site_description', value: '简单好用的图片管理工具' },
            { key: 'site_logo', value: '' },  // 添加网站Logo URL默认值
            { key: 'site_keywords', value: '图片,上传,图床,照片,分享' }, 
            { key: 'allow_register', value: 'true' },
            { key: 'max_file_size', value: '10' },
            { key: 'allowed_file_types', value: 'image/jpeg,image/png,image/gif,image/webp' },
            { key: 'default_theme', value: 'system' },
            // 添加隐私政策和使用条款默认内容
            { key: 'privacy_policy', value: '# 隐私政策\n\n这是默认的隐私政策内容，请管理员在后台修改。\n\n## 信息收集\n\n我们只收集必要的用户信息用于账户管理和服务提供。\n\n## 数据安全\n\n我们采取合理措施保护您的数据安全。' },
            { key: 'terms_of_service', value: '# 使用条款\n\n这是默认的使用条款内容，请管理员在后台修改。\n\n## 服务描述\n\n本网站提供图片上传和管理服务。\n\n## 用户责任\n\n用户须对上传的内容负责，不得上传违反法律法规的图片。' }
        ];
        
        for (const setting of defaultSettings) {
            // 检查设置是否已存在
            const [existingSetting] = await pool.query(
                'SELECT * FROM settings WHERE setting_key = ?',
                [setting.key]
            );
            
            if ((existingSetting as any[]).length === 0) {
                await pool.query(
                    'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
                    [setting.key, setting.value]
                );
            }
        }
        
        // 处理旧版本数据迁移 - 如果存在旧键名的值，迁移到新键名
        const [oldSetting] = await pool.query(
            'SELECT * FROM settings WHERE setting_key = ?',
            ['max_upload_size']
        );
        
        if ((oldSetting as any[]).length > 0) {
            // 存在旧设置，转换为MB并迁移到新键名
            const oldValue = (oldSetting as any[])[0].setting_value;
            const mbValue = Math.round(parseInt(oldValue) / (1024 * 1024)).toString();
            
            // 检查新键名是否已存在
            const [newSetting] = await pool.query(
                'SELECT * FROM settings WHERE setting_key = ?',
                ['max_file_size']
            );
            
            if ((newSetting as any[]).length === 0) {
                await pool.query(
                    'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
                    ['max_file_size', mbValue]
                );
            }
        }
        
        // 处理旧版本数据迁移 - 如果存在旧allow_registration键名的值，迁移到新键名allow_register
        const [oldRegSetting] = await pool.query(
            'SELECT * FROM settings WHERE setting_key = ?',
            ['allow_registration']
        );
        
        if ((oldRegSetting as any[]).length > 0) {
            // 存在旧设置，迁移到新键名
            const oldValue = (oldRegSetting as any[])[0].setting_value;
            
            // 检查新键名是否已存在
            const [newRegSetting] = await pool.query(
                'SELECT * FROM settings WHERE setting_key = ?',
                ['allow_register']
            );
            
            if ((newRegSetting as any[]).length === 0) {
                await pool.query(
                    'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
                    ['allow_register', oldValue]
                );
            }
        }
        
        console.log('已插入默认设置');
    } catch (error) {
        console.error('插入默认设置失败:', error);
    }
};
