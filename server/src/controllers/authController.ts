import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { 
  findUserByUsername,
  findUserByEmail, 
  createUser, 
  findUserById, 
  updateLastLogin,
  updateUserAvatar
} from '../models/User';
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
        const newUser = { username, email, password: password_hash, role: 'user' };
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
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: '用户名和密码不能为空' });
        }
        
        console.log(`尝试登录用户: ${username}`);
        
        // 查找用户
        const user = await findUserByUsername(username);
        
        // 验证用户存在
        if (!user) {
            console.log(`用户 ${username} 不存在`);
            return res.status(401).json({ message: '用户名或密码不正确' });
        }
        
        console.log(`找到用户: ${user.username}, 角色: ${user.role}`);
        
        // 检查密码是否存在
        if (!user.password) {
            console.error('用户密码字段为空');
            return res.status(401).json({ message: '用户名或密码不正确' });
        }
        
        // 验证密码
        try {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                console.log('密码验证失败');
                return res.status(401).json({ message: '用户名或密码不正确' });
            }
        } catch (bcryptError) {
            console.error('密码验证出错:', bcryptError);
            return res.status(401).json({ message: '用户名或密码不正确' });
        }
        
        console.log(`用户 ${username} 密码验证通过`);
        
        // 更新最后登录时间
        try {
            await updateLastLogin(user.id);
        } catch (loginUpdateError) {
            // 记录错误但不中断登录流程
            console.error('更新登录时间失败:', loginUpdateError);
        }
        
        // 创建JWT令牌
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username, 
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // 返回用户信息和令牌
        res.json({
            message: '登录成功',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
        
    } catch (error) {
        console.error('登录失败:', error);
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

        // 获取服务器URL
        const serverUrl = process.env.REMOTE_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
        
        // 返回不包含密码的用户信息，添加头像URL
        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                avatar_url: user.avatar_path ? `${serverUrl}${user.avatar_path}` : null
            }
        });
    } catch (error) {
        console.error("获取用户信息失败:", error);
        next(error);
    }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: '请先登录' });
        }

        if (!req.file) {
            return res.status(400).json({ message: '没有选择要上传的头像图片' });
        }

        // 处理头像图片，调整大小为标准尺寸
        const avatarSize = 200; // 设置标准头像尺寸为200x200
        const avatarPath = req.file.path;
        const outputPath = avatarPath; // 覆盖原始文件

        await sharp(avatarPath)
            .resize(avatarSize, avatarSize)
            .toFile(outputPath + '.tmp');
        
        // 替换原始文件
        fs.unlinkSync(avatarPath);
        fs.renameSync(outputPath + '.tmp', avatarPath);

        // 获取相对路径用于数据库存储
        const relativePath = '/uploads/avatars/' + path.basename(avatarPath);

        // 更新用户头像路径
        const updated = await updateUserAvatar(req.user.userId, relativePath);

        if (!updated) {
            return res.status(500).json({ message: '更新头像失败' });
        }

        // 获取服务器URL用于返回完整路径
        const serverUrl = process.env.REMOTE_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
        
        res.status(200).json({
            message: '头像上传成功',
            avatar_url: `${serverUrl}${relativePath}`
        });

    } catch (error) {
        console.error('上传头像失败:', error);
        
        // 如果发生错误，删除已上传的文件
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error('删除临时文件失败:', err);
            }
        }
        
        next(error);
    }
};
