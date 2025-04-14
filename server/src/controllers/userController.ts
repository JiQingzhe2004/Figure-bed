import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

// 获取用户统计数据
export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '请先登录' });
    }

    const userId = req.user.userId;

    // 获取用户图片数量
    const [imageCountResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS count FROM images WHERE user_id = ?',
      [userId]
    );
    const imageCount = imageCountResult[0].count || 0;

    // 获取用户存储空间使用量
    const [storageResult] = await pool.query<RowDataPacket[]>(
      'SELECT SUM(file_size) AS total_size FROM images WHERE user_id = ?',
      [userId]
    );
    const storageUsed = storageResult[0].total_size || 0;

    res.json({
      imageCount,
      storageUsed
    });
  } catch (error) {
    console.error('获取用户统计数据失败:', error);
    next(error);
  }
};
