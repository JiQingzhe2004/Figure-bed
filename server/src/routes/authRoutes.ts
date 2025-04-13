import express from 'express';
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// 用户注册与登录
router.post('/register', authController.register);
router.post('/login', authController.login);

// 获取当前用户信息
router.get('/me', authenticateToken, authController.getMe);

// 上传头像
router.post('/avatar', authenticateToken, upload.single('avatar'), authController.uploadAvatar);

// token验证的调试端点
router.get('/debug-token', authenticateToken, (req, res) => {
    res.json({
        message: '令牌有效',
        user: req.user
    });
});

export default router;
