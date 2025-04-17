import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as imageController from '../controllers/imageController';
import { getSetting } from '../models/Setting';

const router = Router();

// 确保上传目录存在
const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('创建uploads目录:', uploadDir);
}

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // 使用随机字符串+时间戳作为文件名，避免冲突
        const uniquePrefix = Math.random().toString(36).substring(2, 15);
        cb(null, `${uniquePrefix}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 创建一个中间件来检查文件大小限制
const fileSizeLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 从数据库获取最大文件大小设置
        // 首先尝试获取新的键名 max_file_size (单位: MB)
        let maxSizeSetting = await getSetting('max_file_size');
        let maxFileSize: number;
        
        if (maxSizeSetting) {
            // 新键名设置值是以MB为单位，需要转换为字节
            const maxSizeMB = parseFloat(maxSizeSetting);
            if (isNaN(maxSizeMB)) {
                maxFileSize = 10 * 1024 * 1024; // 默认10MB
                console.warn('max_file_size 设置值无效，使用默认值 10MB');
            } else {
                maxFileSize = Math.round(maxSizeMB * 1024 * 1024);
            }
        } else {
            // 尝试获取旧的键名 max_upload_size (可能是字节单位)
            maxSizeSetting = await getSetting('max_upload_size');
            if (maxSizeSetting) {
                // 旧键名设置值可能直接是字节
                const sizeValue = parseInt(maxSizeSetting);
                if (isNaN(sizeValue)) {
                    maxFileSize = 10 * 1024 * 1024; // 默认10MB
                    console.warn('max_upload_size 设置值无效，使用默认值 10MB');
                } else {
                    maxFileSize = sizeValue;
                }
            } else {
                // 两个键名都没找到，使用默认值
                maxFileSize = 10 * 1024 * 1024; // 默认10MB
            }
        }
        
        // 输出日志，确认当前使用的限制
        console.log(`当前最大文件上传限制: ${(maxFileSize / (1024 * 1024)).toFixed(2)}MB (${maxFileSize}字节)`);
        
        // 配置 multer 实例，使用从数据库获取的大小限制
        const upload = multer({
            storage,
            limits: {
                fileSize: maxFileSize,
            },
            fileFilter: (req, file, cb) => {
                // 仅接受图片文件
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                } else {
                    cb(new Error('只允许上传图片文件'));
                }
            }
        }).single('image');

        // 使用 multer 中间件处理上传，但捕获可能的错误
        upload(req, res, function(err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        message: `文件大小超出限制，最大允许 ${(maxFileSize / (1024 * 1024)).toFixed(2)}MB`
                    });
                }
                return res.status(400).json({ message: `上传错误: ${err.message}` });
            } else if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    } catch (error: any) {
        console.error('检查文件大小限制失败:', error.message || error);
        // 如果获取设置失败，使用默认限制
        const defaultUpload = multer({
            storage,
            limits: { fileSize: 10 * 1024 * 1024 }, // 默认10MB
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                } else {
                    cb(new Error('只允许上传图片文件'));
                }
            }
        }).single('image');

        defaultUpload(req, res, function(err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    }
};

// 图片上传路由 - 使用动态限制大小的中间件
router.post('/upload', authenticateToken, fileSizeLimit, imageController.uploadImage);

// 获取用户自己的图片
router.get('/my-images', authenticateToken, imageController.getUserImages);

// 获取公开图片
router.get('/public', imageController.getPublicImages);

// 根据范围获取公开图片 - 新增API端点
router.get('/public-range', imageController.getPublicImagesByRange);

// 获取单张图片
router.get('/:id', imageController.getImageById);

// 删除图片
router.delete('/:id', authenticateToken, imageController.deleteImage);

// 切换图片公开状态
router.patch('/:id/toggle-public', authenticateToken, imageController.toggleImagePublicStatus);

export default router;
