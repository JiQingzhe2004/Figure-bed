import express from 'express';
import { getUserStats } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// 获取用户统计数据
router.get('/stats', authenticateToken, getUserStats);

export default router;
