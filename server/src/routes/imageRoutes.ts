import express from 'express';
import { uploadImage, getUserImages, getPublicImages, 
         deleteImage, toggleImagePublicStatus, getImageById } from '../controllers/imageController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { sanitizeFileName } from '../utils/fileHelpers';

const router = express.Router();

// 确保上传目录存在，使用绝对路径
const uploadDir = path.resolve(__dirname, '../../uploads');
console.log('上传目录路径:', uploadDir);

// 确保目录存在
if (!fs.existsSync(uploadDir)) {
    console.log('创建上传目录...');
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('上传目录创建成功');
    } catch (err) {
        console.error('创建上传目录失败:', err);
    }
}

// 配置Multer存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        try {
            // 生成唯一文件名，避开文件名编码问题
            const uniqueSuffix = crypto.randomBytes(8).toString('hex') + '-' + Date.now();
            const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
            const filename = uniqueSuffix + ext;
            
            console.log('生成安全文件名:', filename, '原始名称:', file.originalname);
            cb(null, filename);
        } catch (error) {
            console.error('文件名处理出错:', error);
            // 回退到安全的文件名方案
            cb(null, `file-${Date.now()}.jpg`);
        }
    }
});

// 文件过滤器
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // 只接受图片文件
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false);
        cb(new Error('只能上传图片文件'));
    }
};

// 创建Multer实例
const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB限制
    }
});

// 上传图片
router.post('/upload', authenticateToken, upload.single('image'), uploadImage);

// 获取用户自己的图片
router.get('/my-images', authenticateToken, getUserImages);

// 获取所有公开图片（不需要登录也可以查看）
router.get('/public', optionalAuth, getPublicImages);

// 获取单张图片
router.get('/:id', optionalAuth, getImageById);

// 删除图片（需要验证所有权）
router.delete('/:id', authenticateToken, deleteImage);

// 切换图片公开状态
router.patch('/:id/toggle-public', authenticateToken, toggleImagePublicStatus);

export default router;
