import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 扩展Request类型，添加user属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        role?: string;
      };
    }
  }
}

/**
 * 验证JWT令牌的中间件
 * 从请求头中提取Authorization Token并验证
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // 从请求头中获取Authorization字段
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // 如果没有token，返回401未授权错误
  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  try {
    // 验证token
    const secret = process.env.JWT_SECRET || 'your_very_strong_jwt_secret_key';
    const decoded = jwt.verify(token, secret);
    
    // 将解码后的用户信息添加到请求对象中
    req.user = decoded as any;
    
    // 调试信息，记录解码后的用户信息
    console.log('已验证用户身份:', {
      userId: req.user!.userId,
      username: req.user!.username,
      role: req.user!.role
    });
    
    next(); // 继续下一个中间件或路由处理器
  } catch (error) {
    console.error('令牌验证失败:', error);
    return res.status(403).json({ message: '无效或过期的令牌' });
  }
};

/**
 * 验证管理员权限的中间件
 * 必须在authenticateToken中间件之后使用
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log('检查管理员权限:', req.user);
  
  if (!req.user) {
    return res.status(401).json({ message: '需要先进行身份认证' });
  }

  // 确保角色属性存在并严格比较为'admin'
  if (!req.user.role || req.user.role !== 'admin') {
    console.error('权限不足，用户角色:', req.user.role);
    return res.status(403).json({ message: '需要管理员权限' });
  }

  console.log('用户拥有管理员权限，允许操作');
  next();
};
