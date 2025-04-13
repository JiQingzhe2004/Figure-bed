import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Setting {
    id?: number;
    setting_key: string;
    setting_value: string;
    setting_description?: string;
    updated_at?: Date;
}

// 获取所有设置
export const getAllSettings = async (): Promise<Setting[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM settings'
    );
    return rows as Setting[];
};

// 获取单个设置
export const getSetting = async (key: string): Promise<string | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT setting_value FROM settings WHERE setting_key = ?',
        [key]
    );
    if (rows.length > 0) {
        return rows[0].setting_value;
    }
    return null;
};

// 更新设置
export const updateSetting = async (key: string, value: string): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
        'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
        [value, key]
    );
    
    if (result.affectedRows === 0) {
        // 如果没有更新任何行，说明设置可能不存在，尝试创建
        const [insertResult] = await pool.query<ResultSetHeader>(
            'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
            [key, value]
        );
        return insertResult.affectedRows > 0;
    }
    
    return result.affectedRows > 0;
};

// 批量更新设置
export const updateSettings = async (settings: { key: string, value: string }[]): Promise<boolean> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        for (const setting of settings) {
            await connection.query(
                'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
                [setting.value, setting.key]
            );
        }
        
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// 获取默认设置
export const getDefaultSettings = (): { key: string, value: string, description: string }[] => {
    return [
        { key: 'site_name', value: '我的图床', description: '网站名称' },
        { key: 'site_description', value: '一个简单好用的图床服务', description: '网站描述' },
        { key: 'site_keywords', value: '图床,图片存储,图片分享', description: '网站关键词' },
        { key: 'site_logo', value: '', description: '网站Logo URL' },
        { key: 'site_favicon', value: '', description: '网站Favicon URL' },
        { key: 'allow_register', value: 'true', description: '是否允许注册' },
        { key: 'default_theme', value: 'light', description: '默认主题' },
        { key: 'images_per_page', value: '20', description: '每页显示图片数量' },
        { key: 'max_file_size', value: '5', description: '最大文件大小(MB)' },
        { key: 'allowed_file_types', value: 'image/jpeg,image/png,image/gif,image/webp', description: '允许的文件类型' }
    ];
};
