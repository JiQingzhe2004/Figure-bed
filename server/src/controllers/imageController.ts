import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { createImage, getImagesByUserId, getPublicImages as getPublicImagesModel, 
         deleteImage as deleteImageModel, updateImagePublicStatus, getImageById as getImageByIdModel,
         countImages } from '../models/Image';
import { getSetting } from '../models/Setting';
import sizeOf from 'image-size';
import { sanitizeFileName } from '../utils/fileHelpers';

// 上传图片
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('上传请求接收到，用户:', req.user?.username);
        console.log('文件信息:', req.file);
        
        // 检查是否有文件上传
        if (!req.file) {
            return res.status(400).json({ message: '没有选择要上传的图片' });
        }

        // 确保用户已登录
        if (!req.user) {
            // 删除临时上传的文件
            fs.unlinkSync(req.file.path);
            return res.status(401).json({ message: '请先登录' });
        }

        console.log('开始处理图片...');
        
        // 获取图片尺寸
        let width, height;
        try {
            const dimensions = sizeOf(req.file.path);
            width = dimensions.width;
            height = dimensions.height;
            console.log(`图片尺寸: ${width}x${height}`);
        } catch (error) {
            console.error('获取图片尺寸失败:', error);
        }

        // 处理可能包含特殊字符的文件名
        const originalName = sanitizeFileName(req.file.originalname);
        console.log('原始文件名:', req.file.originalname);
        console.log('处理后文件名:', originalName);

        // 获取是否公开参数
        const isPublic = req.body.is_public !== 'false';
        console.log('图片公开状态:', isPublic);

        // 创建图片记录
        const imageData = {
            user_id: req.user.userId,
            filename: req.file.filename,
            original_name: originalName,  // 使用处理后的文件名
            file_path: `/uploads/${req.file.filename}`, // 存储相对路径
            file_size: req.file.size,
            file_type: req.file.mimetype,
            width,
            height,
            is_public: isPublic
        };

        console.log('保存图片数据到数据库...');
        const imageId = await createImage(imageData);
        console.log('图片已保存，ID:', imageId);

        const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
        
        res.status(201).json({
            message: '图片上传成功',
            image: {
                id: imageId,
                ...imageData,
                url: `${serverUrl}${imageData.file_path}`
            }
        });

    } catch (error) {
        console.error('上传图片失败:', error);
        // 如果发生错误，删除已上传的文件
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error('删除临时文件失败:', err);
            }
        }
        next(error);
    }
};

// 获取用户自己的图片
export const getUserImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: '请先登录' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 12;
        const offset = (page - 1) * perPage;

        // 获取图片
        const images = await getImagesByUserId(req.user.userId);
        
        // 获取总数
        const totalCount = await countImages(undefined, req.user.userId);
        
        // 格式化返回数据
        const formattedImages = images.map(image => ({
            ...image,
            url: `${process.env.SERVER_URL || 'http://localhost:5000'}${image.file_path}`
        }));

        res.json({
            images: formattedImages,
            pagination: {
                total: totalCount,
                per_page: perPage,
                current_page: page,
                last_page: Math.ceil(totalCount / perPage)
            }
        });

    } catch (error) {
        console.error('获取用户图片失败:', error);
        next(error);
    }
};

// 获取所有公开图片
export const getPublicImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 12;
        const offset = (page - 1) * perPage;
        
        // 获取公开图片
        const images = await getPublicImagesModel(perPage, offset);
        
        // 获取总数
        const totalCount = await countImages(true);
        
        // 格式化返回数据
        const formattedImages = images.map(image => ({
            ...image,
            url: `${process.env.SERVER_URL || 'http://localhost:5000'}${image.file_path}`
        }));

        res.json({
            images: formattedImages,
            pagination: {
                total: totalCount,
                per_page: perPage,
                current_page: page,
                last_page: Math.ceil(totalCount / perPage)
            }
        });

    } catch (error) {
        console.error('获取公开图片失败:', error);
        next(error);
    }
};

// 获取单张图片
export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imageId = parseInt(req.params.id);
        if (isNaN(imageId)) {
            return res.status(400).json({ message: '无效的图片ID' });
        }

        const image = await getImageByIdModel(imageId);
        
        if (!image) {
            return res.status(404).json({ message: '图片不存在' });
        }

        // 检查权限
        if (!image.is_public && (!req.user || (req.user.userId !== image.user_id && req.user.role !== 'admin'))) {
            return res.status(403).json({ message: '没有权限查看此图片' });
        }

        // 格式化返回数据
        const formattedImage = {
            ...image,
            url: `${process.env.SERVER_URL || 'http://localhost:5000'}${image.file_path}`
        };

        res.json({ image: formattedImage });

    } catch (error) {
        console.error('获取图片失败:', error);
        next(error);
    }
};

// 删除图片
export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: '请先登录' });
        }

        const imageId = parseInt(req.params.id);
        if (isNaN(imageId)) {
            return res.status(400).json({ message: '无效的图片ID' });
        }

        // 获取图片信息
        const image = await getImageByIdModel(imageId);
        
        if (!image) {
            return res.status(404).json({ message: '图片不存在' });
        }

        // 检查权限
        if (req.user.role !== 'admin' && req.user.userId !== image.user_id) {
            return res.status(403).json({ message: '没有权限删除此图片' });
        }

        // 删除数据库记录
        const deleted = await deleteImageModel(imageId);
        
        if (!deleted) {
            return res.status(500).json({ message: '删除图片失败' });
        }

        // 删除实际文件
        const filePath = path.join(__dirname, '../../uploads', path.basename(image.file_path));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: '图片已删除' });

    } catch (error) {
        console.error('删除图片失败:', error);
        next(error);
    }
};

// 切换图片公开状态
export const toggleImagePublicStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: '请先登录' });
        }

        const imageId = parseInt(req.params.id);
        if (isNaN(imageId)) {
            return res.status(400).json({ message: '无效的图片ID' });
        }

        // 获取图片信息
        const image = await getImageByIdModel(imageId);
        
        if (!image) {
            return res.status(404).json({ message: '图片不存在' });
        }

        // 检查权限
        if (req.user.role !== 'admin' && req.user.userId !== image.user_id) {
            return res.status(403).json({ message: '没有权限修改此图片' });
        }

        // 切换公开状态
        const newPublicStatus = !image.is_public;
        const updated = await updateImagePublicStatus(imageId, newPublicStatus);
        
        if (!updated) {
            return res.status(500).json({ message: '更新图片状态失败' });
        }

        res.json({ 
            message: newPublicStatus ? '图片已设为公开' : '图片已设为私密',
            is_public: newPublicStatus
        });

    } catch (error) {
        console.error('更新图片状态失败:', error);
        next(error);
    }
};
