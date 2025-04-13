import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import * as settingController from '../controllers/settingController';

const router = Router();

// 获取所有设置（公开）
router.get('/', settingController.getSettings);

// 更新设置（需要管理员权限）
router.post('/', authenticateToken, isAdmin, settingController.updateSettings);

export default router;
