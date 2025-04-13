import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeFileName } from '../utils/fileHelpers';

// 确保上传目录存在
const uploadsDir = path.join(__dirname, '../../uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 根据文件用途决定存储位置
        const isAvatar = req.path.includes('avatar');
        const dest = isAvatar ? avatarsDir : uploadsDir;
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        // 生成唯一文件名防止冲突
        const uniqueId = uuidv4();
        const sanitizedName = sanitizeFileName(file.originalname);
        const fileExt = path.extname(sanitizedName);
        const fileName = `${uniqueId}${fileExt}`;
        cb(null, fileName);
    }
});

// 导出上传中间件
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 头像限制5MB
    },
    fileFilter: (req, file, cb) => {
        // 仅接受图片文件
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件') as any);
        }
    }
});
