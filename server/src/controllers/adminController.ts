import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import fs from 'fs';
import { updateUserRole as updateUserRoleModel, findUserById } from '../models/User';
import { countImages, getAllImages as getAllImagesModel, getImageById, deleteImage, deleteMultipleImages } from '../models/Image';

// 获取所有用户
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 10;
        const offset = (page - 1) * perPage;
        
        // 获取用户列表（不返回密码哈希）
        const [users] = await pool.query<RowDataPacket[]>(
            'SELECT id, username, email, role, created_at FROM users LIMIT ? OFFSET ?',
            [perPage, offset]
        );
        
        // 获取用户总数
        const [countResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users');
        const totalCount = countResult[0].count;
        
        res.json({
            users,
            pagination: {
                total: totalCount,
                per_page: perPage,
                current_page: page,
                last_page: Math.ceil(totalCount / perPage)
            }
        });

    } catch (error: any) {
        console.error('获取用户失败:', error);
        next(error);
    }
};

// 获取单个用户
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: '无效的用户ID' });
        }
        
        const user = await findUserById(userId);
        
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        
        // 不返回密码哈希
        const { password_hash, ...userInfo } = user;
        
        res.json({ user: userInfo });

    } catch (error: any) {
        console.error('获取用户失败:', error);
        next(error);
    }
};

// 更新用户角色
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: '无效的用户ID' });
        }
        
        const { role } = req.body;
        if (role !== 'user' && role !== 'admin') {
            return res.status(400).json({ message: '角色必须是 user 或 admin' });
        }
        
        // 不允许降级自己的权限
        if (userId === req.user?.userId && role !== 'admin') {
            return res.status(403).json({ message: '不能降级自己的管理员权限' });
        }
        
        const success = await updateUserRoleModel(userId, role);
        
        if (!success) {
            return res.status(404).json({ message: '用户不存在或更新失败' });
        }
        
        res.json({ message: '用户角色更新成功' });

    } catch (error: any) {
        console.error('更新用户角色失败:', error);
        next(error);
    }
};

// 删除用户
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: '无效的用户ID' });
        }
        
        // 不能删除自己
        if (userId === req.user?.userId) {
            return res.status(403).json({ message: '不能删除自己的账户' });
        }
        
        // 先获取该用户的所有图片
        const [images] = await pool.query<RowDataPacket[]>(
            'SELECT file_path FROM images WHERE user_id = ?',
            [userId]
        );
        
        // 开始事务
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // 删除用户
            const [deleteResult] = await connection.query(
                'DELETE FROM users WHERE id = ?',
                [userId]
            );
            
            if ((deleteResult as any).affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ message: '用户不存在或删除失败' });
            }
            
            await connection.commit();
            
            // 删除图片文件
            for (const image of images) {
                const filePath = path.join(__dirname, '../../uploads', path.basename(image.file_path));
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            
            res.json({ message: '用户已删除' });

        } catch (error: any) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error: any) {
        console.error('删除用户失败:', error);
        next(error);
    }
};

// 获取仪表盘统计数据
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 获取用户总数
        const [userResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users');
        const totalUsers = userResult[0].count;
        
        // 获取图片总数
        const totalImages = await countImages();
        
        // 获取公开图片数
        const publicImages = await countImages(true);
        
        // 获取私密图片数
        const privateImages = await countImages(false);
        
        // 获取总存储空间使用量
        const [storageResult] = await pool.query<RowDataPacket[]>(
            'SELECT SUM(file_size) as total_size FROM images'
        );
        const totalStorage = storageResult[0].total_size || 0;
        
        // 获取最近7天的注册用户数量
        const [recentUsers] = await pool.query<RowDataPacket[]>(
            'SELECT DATE(created_at) as date, COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date'
        );
        
        // 获取最近7天的上传图片数量
        const [recentImages] = await pool.query<RowDataPacket[]>(
            'SELECT DATE(created_at) as date, COUNT(*) as count FROM images WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date'
        );
        
        res.json({
            stats: {
                totalUsers,
                totalImages,
                publicImages,
                privateImages,
                totalStorage,
                storageFormatted: formatBytes(totalStorage)
            },
            charts: {
                recentUsers,
                recentImages
            }
        });

    } catch (error: any) {
        console.error('获取统计数据失败:', error);
        next(error);
    }
};

// 获取所有图片（管理员功能）
export const getAllImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 20;
        const offset = (page - 1) * perPage;
        
        // 获取图片列表
        const images = await getAllImagesModel(perPage, offset);
        
        // 获取图片总数
        const totalCount = await countImages();
        
        // 格式化返回数据
        const formattedImages = images.map(image => ({
            ...image,
            url: `${process.env.SERVER_URL || 'http://localhost:5000'}${image.file_path}`,
            file_size_formatted: formatBytes(image.file_size)
        }));
        
        res.json({
            images: formattedImages,
            pagination: {
                total: totalCount,
                per_page: perPage,
                current_page: page,
                last_page: Math.ceil(totalCount / perPage)
            }
        });

    } catch (error: any) {
        console.error('获取图片失败:', error);
        next(error);
    }
};

// 管理员删除图片
export const deleteImageAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imageId = parseInt(req.params.id);
        if (isNaN(imageId)) {
            return res.status(400).json({ message: '无效的图片ID' });
        }
        
        // 获取图片信息
        const image = await getImageById(imageId);
        
        if (!image) {
            return res.status(404).json({ message: '图片不存在' });
        }
        
        // 删除数据库记录
        const deleted = await deleteImage(imageId);
        
        if (!deleted) {
            return res.status(500).json({ message: '删除图片失败' });
        }
        
        // 删除实际文件
        const filePath = path.join(__dirname, '../../uploads', path.basename(image.file_path));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        res.json({ message: '图片已删除' });

    } catch (error: any) {
        console.error('删除图片失败:', error);
        next(error);
    }
};

// 批量删除图片
export const deleteImagesAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { imageIds } = req.body;
        
        if (!Array.isArray(imageIds) || imageIds.length === 0) {
            return res.status(400).json({ message: '请至少选择一张图片' });
        }

        // 获取所有要删除的图片信息
        const imagesPromises = imageIds.map(id => getImageById(id));
        const images = await Promise.all(imagesPromises);
        const validImages = images.filter(image => image !== null);

        if (validImages.length === 0) {
            return res.status(404).json({ message: '未找到要删除的图片' });
        }

        // 删除文件
        const deletedFiles: string[] = [];
        for (const image of validImages) {
            try {
                // 删除原始图片
                const filePath = path.join(__dirname, '../../uploads', path.basename(image.file_path));
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    deletedFiles.push(filePath);
                }

                // 删除缩略图
                if (image.thumbnail_path) {
                    const thumbnailPath = path.join(__dirname, '../../uploads', path.basename(image.thumbnail_path));
                    if (fs.existsSync(thumbnailPath)) {
                        fs.unlinkSync(thumbnailPath);
                        deletedFiles.push(thumbnailPath);
                    }
                }
            } catch (err) {
                console.error(`删除文件失败: ${image.file_path}`, err);
                // 继续处理其他文件
            }
        }

        // 从数据库中删除记录
        const result = await deleteMultipleImages(imageIds);

        res.json({
            message: `成功删除 ${result.affectedRows} 张图片`,
            deletedCount: result.affectedRows,
            deletedFiles: deletedFiles
        });

    } catch (error: any) {
        console.error('批量删除图片失败:', error);
        res.status(500).json({ message: '批量删除图片失败', error: error.message });
    }
};

// 辅助函数：格式化字节数
function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
