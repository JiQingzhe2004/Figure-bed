import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserByUsername, createUser, findUserById, User } from '../models/User';
import { getSetting } from '../models/Setting';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    // 基本验证
    if (!username || !email || !password) {
        return res.status(400).json({ message: '用户名、邮箱和密码都是必填项' });
    }

    try {
        // 检查注册是否开放
        const allowRegister = await getSetting('allow_register');
        if (allowRegister === 'false') {
            return res.status(403).json({ message: '管理员已关闭注册功能' });
        }
        
        // 检查用户是否已存在
        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            return res.status(409).json({ message: '该邮箱已被使用' });
        }
        const existingUsername = await findUserByUsername(username);
        if (existingUsername) {
            return res.status(409).json({ message: '该用户名已被使用' });
        }

        // 密码加密
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 创建用户
        const newUser: Omit<User, 'id' | 'created_at'> = { username, email, password_hash, role: 'user' };
        const userId = await createUser(newUser);

        // 生成JWT令牌，有效期30天
        const tokenPayload = { userId: userId, username: username };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '30d' }); // 令牌30天过期

        // 发送响应
        res.status(201).json({
            message: '用户注册成功',
            token,
            user: { id: userId, username, email, role: 'user' }
        });

    } catch (error) {
        console.error("注册失败:", error);
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    // 基本验证
    if ((!email && !username) || !password) {
        return res.status(400).json({ message: '请提供邮箱/用户名和密码' });
    }

    try {
        // 根据邮箱或用户名查找用户
        let user = null;
        if (email) {
            user = await findUserByEmail(email);
        } else if (username) {
            user = await findUserByUsername(username);
        }

        if (!user) {
            return res.status(401).json({ message: '用户名/邮箱或密码不正确' });
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: '用户名/邮箱或密码不正确' });
        }

        // 生成JWT令牌，有效期30天
        const tokenPayload = { userId: user.id!, username: user.username };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '30d' });

        // 发送响应
        res.json({
            message: '登录成功',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("登录失败:", error);
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('收到获取当前用户请求, 用户ID:', req.user?.userId);
        
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: '未登录' });
        }

        const user = await findUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        // 返回不包含密码的用户信息
        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error("获取用户信息失败:", error);
        next(error);
    }
};
