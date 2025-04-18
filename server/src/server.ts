import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs'; // 导入fs模块
import db from './config/db';
import { initDatabase } from './utils/dbInit';
import { getLocalIPs } from './utils/urlHelper'; 
import corsConfig from './config/cors.config'; // 修改导入路径
import authRoutes from './routes/authRoutes';
import imageRoutes from './routes/imageRoutes'; 
import settingRoutes from './routes/settingRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes'; // 添加用户路由
import statsRoutes from './routes/statsRoutes'; // 添加统计路由

// 加载环境变量
dotenv.config();

const app = express();
// 将PORT转换为数字类型
const PORT = parseInt(process.env.PORT || '5000', 10);

// 中间件
app.use(cors(corsConfig)); // 使用配置好的CORS设置
// 处理OPTIONS预检请求
app.options('*', cors(corsConfig));

// 增加请求体大小限制
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 设置静态文件目录，使用绝对路径
const uploadPath = path.resolve(__dirname, '../uploads');
console.log('静态文件目录:', uploadPath);

// 确保上传目录存在
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('创建上传目录');
}

// 设置静态文件服务
app.use('/uploads', express.static(uploadPath));

// 添加客户端构建文件的静态服务
const clientBuildPath = path.resolve(__dirname, '../../client/build');
if (fs.existsSync(clientBuildPath)) {
  console.log('提供静态文件目录:', clientBuildPath);
  app.use(express.static(clientBuildPath));
} else {
  console.log('警告: 客户端构建目录不存在:', clientBuildPath);
}

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
app.use('/api/user', userRoutes); // 添加用户路由
app.use('/api/stats', statsRoutes); // 添加统计路由

// 配置前端路由支持 - 添加此代码
// 在API路由之后，错误处理之前，添加catch-all路由
// 这将处理所有非API和非静态文件的请求
app.get('*', (req: Request, res: Response) => {
  // 忽略API请求和静态资源请求
  if (
    req.url.startsWith('/api/') || 
    req.url.startsWith('/uploads/') || 
    req.url.includes('.')
  ) {
    return res.status(404).send('Not found');
  }
  
  // 将所有其他请求都重定向到前端应用的index.html
  res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
});

// 全局错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('服务器错误:', err);
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误', error: err.message });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`服务器正在端口 ${PORT} 上运行`);
  console.log(`本地访问: ${process.env.LOCAL_SERVER_URL || `http://localhost:${PORT}`}`);
  
  // 获取本机IP地址并显示远程访问链接
  const localIPs = getLocalIPs();
  if (localIPs.length > 0) {
    console.log(`远程访问: ${process.env.REMOTE_SERVER_URL || `http://${localIPs[0]}:${PORT}`}`);
  }
  
  // 如果未设置远程URL，使用检测到的IP
  if (!process.env.REMOTE_SERVER_URL && localIPs.length > 0) {
    process.env.REMOTE_SERVER_URL = `http://${localIPs[0]}:${PORT}`;
    console.log(`已自动设置REMOTE_SERVER_URL为: ${process.env.REMOTE_SERVER_URL}`);
  }

  // 数据库初始化
  try {
    await initDatabase();
    console.log('数据库初始化完成');
  } catch (err) {
    console.error('数据库操作失败:', err);
  }
});
