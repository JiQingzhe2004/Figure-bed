import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../models/User';

// 扩展 Request 接口以包含用户信息
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

// JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

// 验证用户是否已登录
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    // 获取 Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    console.log('验证认证令牌:', authHeader ? '有令牌' : '无令牌');
    
    if (!token) {
        return res.status(401).json({ message: '请登录后访问' });
    }
    
    try {
        // 验证 token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, username: string };
        console.log('令牌验证成功，用户ID:', decoded.userId);
        
        // 获取用户信息（包括角色）
        const user = await findUserById(decoded.userId);
        if (!user) {
            console.log('用户不存在:', decoded.userId);
            return res.status(403).json({ message: '用户不存在' });
        }
        
        // 将用户信息附加到请求对象
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            role: user.role
        };
        
        next();
    } catch (error) {
        console.error('令牌验证失败:', error);
        return res.status(403).json({ message: '登录已过期，请重新登录' });
    }
};

// 验证用户是否为管理员
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: '请登录后访问' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '没有管理员权限' });
    }
    
    next();
};

// 可选的身份验证中间件（不强制要求登录，但如果有token会验证）
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    // 获取 Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    // 如果没有token，继续处理请求
    if (!token) {
        return next();
    }
    
    try {
        // 验证 token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, username: string };
        
        // 获取用户信息
        const user = await findUserById(decoded.userId);
        if (user) {
            // 将用户信息附加到请求对象
            req.user = {
                userId: decoded.userId,
                username: decoded.username,
                role: user.role
            };
        }
        
        next();
    } catch (error) {
        // 如果token无效，继续处理请求但不设置用户信息
        next();
    }
};
