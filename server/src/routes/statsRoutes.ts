import express from 'express';
import { getPublicStats } from '../controllers/statsController';

const router = express.Router();

// 获取公开统计数据
router.get('/public', getPublicStats);

export default router;
