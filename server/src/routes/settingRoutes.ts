import express from 'express';
import { getSettings, updateSetting, updateMultipleSettings } from '../controllers/settingController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// 获取所有设置（公开）
router.get('/', getSettings);

// 更新单个设置（需要管理员权限）
router.put('/:key', authenticateToken, isAdmin, updateSetting);

// 批量更新设置（需要管理员权限）
router.put('/', authenticateToken, isAdmin, updateMultipleSettings);

export default router;
