import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth';
import * as imageController from '../controllers/imageController';

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

// 配置 multer 上传大小限制和文件过滤
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        // 仅接受图片文件
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件'));
        }
    }
});

// 图片上传路由 - 确保使用了正确的中间件链
router.post('/upload', authenticateToken, upload.single('image'), imageController.uploadImage);

// 获取用户自己的图片
router.get('/my-images', authenticateToken, imageController.getUserImages);

// 获取公开图片
router.get('/public', imageController.getPublicImages);

// 获取单张图片
router.get('/:id', imageController.getImageById);

// 删除图片
router.delete('/:id', authenticateToken, imageController.deleteImage);

// 切换图片公开状态
router.patch('/:id/toggle-public', authenticateToken, imageController.toggleImagePublicStatus);

export default router;
