import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { countImages } from '../models/Image';

// 获取公开统计数据
export const getPublicStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 获取公开图片总数
    const publicImagesCount = await countImages(true);
    
    // 获取注册用户总数
    const [userResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users');
    const totalUsers = userResult[0].count || 0;
    
    // 获取总存储空间使用量 (可选)
    const [storageResult] = await pool.query<RowDataPacket[]>(
      'SELECT SUM(file_size) as total_size FROM images'
    );
    const totalStorage = storageResult[0].total_size || 0;
    
    res.json({
      publicImagesCount,
      totalUsers,
      totalStorage
    });
  } catch (error) {
    console.error('获取公开统计数据失败:', error);
    next(error);
  }
};
