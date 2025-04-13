import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Setting extends RowDataPacket {
    id: number;
    setting_key: string;
    setting_value: string;
    created_at: Date;
    updated_at: Date;
}

// 获取所有设置
export const getAllSettings = async (): Promise<Setting[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM settings'
    );
    return rows as Setting[];
};

// 获取单个设置
export const getSetting = async (key: string, defaultValue: string = ''): Promise<string> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT setting_value FROM settings WHERE setting_key = ?',
        [key]
    );
    
    if (rows.length > 0) {
        return rows[0].setting_value;
    }
    
    return defaultValue;
};

// 更新或创建设置
export const updateSetting = async (key: string, value: string): Promise<boolean> => {
    try {
        // 检查设置是否已存在
        const [existing] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM settings WHERE setting_key = ?',
            [key]
        );
        
        if ((existing as any[]).length > 0) {
            // 更新现有设置
            const [result] = await pool.query<ResultSetHeader>(
                'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
                [value, key]
            );
            return result.affectedRows > 0;
        } else {
            // 创建新设置
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
                [key, value]
            );
            return result.affectedRows > 0;
        }
    } catch (error) {
        console.error(`更新设置失败 (${key}):`, error);
        return false;
    }
};
