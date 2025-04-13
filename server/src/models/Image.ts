import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Image {
    id?: number;
    user_id: number;
    filename: string;
    original_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    width?: number;
    height?: number;
    is_public: boolean;
    created_at?: Date;
    updated_at?: Date;
}

// 创建新图片
export const createImage = async (image: Omit<Image, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
    const { user_id, filename, original_name, file_path, file_size, file_type, width, height, is_public } = image;
    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO images (user_id, filename, original_name, file_path, file_size, file_type, width, height, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, filename, original_name, file_path, file_size, file_type, width, height, is_public]
    );
    return result.insertId;
};

// 获取某用户的所有图片
export const getImagesByUserId = async (userId: number): Promise<Image[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM images WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    return rows as Image[];
};

// 获取所有公开图片
export const getPublicImages = async (limit: number = 20, offset: number = 0): Promise<Image[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM images WHERE is_public = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return rows as Image[];
};

// 根据ID获取图片
export const getImageById = async (id: number): Promise<Image | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM images WHERE id = ?',
        [id]
    );
    if (rows.length > 0) {
        return rows[0] as Image;
    }
    return null;
};

// 删除图片
export const deleteImage = async (id: number, userId?: number): Promise<boolean> => {
    let sql = 'DELETE FROM images WHERE id = ?';
    const params: any[] = [id];
    
    if (userId !== undefined) {
        sql += ' AND user_id = ?';
        params.push(userId);
    }
    
    const [result] = await pool.query<ResultSetHeader>(sql, params);
    return result.affectedRows > 0;
};

// 更新图片公开状态
export const updateImagePublicStatus = async (id: number, isPublic: boolean, userId?: number): Promise<boolean> => {
    let sql = 'UPDATE images SET is_public = ? WHERE id = ?';
    const params: any[] = [isPublic, id];
    
    if (userId !== undefined) {
        sql += ' AND user_id = ?';
        params.push(userId);
    }
    
    const [result] = await pool.query<ResultSetHeader>(sql, params);
    return result.affectedRows > 0;
};

// 获取所有图片（管理员功能）
export const getAllImages = async (limit: number = 20, offset: number = 0): Promise<Image[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT i.*, u.username FROM images i JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return rows as Image[];
};

// 获取图片总数
export const countImages = async (isPublic?: boolean, userId?: number): Promise<number> => {
    let sql = 'SELECT COUNT(*) as count FROM images WHERE 1=1';
    const params: any[] = [];
    
    if (isPublic !== undefined) {
        sql += ' AND is_public = ?';
        params.push(isPublic);
    }
    
    if (userId !== undefined) {
        sql += ' AND user_id = ?';
        params.push(userId);
    }
    
    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows[0].count;
};
