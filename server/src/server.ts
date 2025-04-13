import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import db from './config/db';
import { initDatabase } from './utils/dbInit';
import { upgradeDatabase } from './utils/upgradeDb'; // 导入升级脚本
import authRoutes from './routes/authRoutes';
import imageRoutes from './routes/imageRoutes'; 
import settingRoutes from './routes/settingRoutes';
import adminRoutes from './routes/adminRoutes';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors({
  origin: '*', // 允许所有源 - 开发环境可用，生产环境应该限制
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 设置静态文件目录，使用绝对路径
const uploadPath = path.resolve(__dirname, '../uploads');
console.log('静态文件目录:', uploadPath);
app.use('/uploads', express.static(uploadPath));

// 请求日志中间件
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers));
  next();
});

// 基本路由
app.get('/', (req: Request, res: Response) => {
  res.send('图床 API 正在运行！');
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin', adminRoutes);

// 全局错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('服务器错误:', err);
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误', error: err.message });
});

// 启动服务器
app.listen(PORT, async () => {
  console.log(`服务器正在端口 ${PORT} 上运行`);
  console.log(`访问: http://localhost:${PORT}`);
  
  // 数据库初始化和升级
  try {
    // 首先升级现有数据库字符集
    await upgradeDatabase();
    console.log('数据库字符集升级完成');
    
    // 然后初始化数据库
    await initDatabase();
    console.log('数据库初始化完成');
  } catch (err) {
    console.error('数据库操作失败:', err);
  }
});
