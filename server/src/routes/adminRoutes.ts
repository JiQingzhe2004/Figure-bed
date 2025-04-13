import express from 'express';
import { getAllUsers, getUserById, updateUserRole, deleteUser, getDashboardStats, 
         getAllImages, deleteImageAdmin } from '../controllers/adminController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// 所有管理员路由都需要管理员权限
router.use(authenticateToken, isAdmin);

// 仪表盘统计
router.get('/stats', getDashboardStats);

// 用户管理
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// 图片管理
router.get('/images', getAllImages);
router.delete('/images/:id', deleteImageAdmin);

export default router;
