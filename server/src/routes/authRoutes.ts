import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe); // 添加 /me 路由

// 添加JWT调试路由，帮助验证令牌和用户信息
router.get('/debug-token', authenticateToken, (req: Request, res: Response) => {
  res.json({
    message: '令牌验证成功',
    user: req.user
  });
});

export default router;
