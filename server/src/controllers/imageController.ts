import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp'; // 添加sharp库导入
import { createImage, getImagesByUserId, getPublicImages as getPublicImagesModel, 
         deleteImage as deleteImageModel, updateImagePublicStatus, getImageById as getImageByIdModel,
         countImages } from '../models/Image';
import { getSetting } from '../models/Setting';
import sizeOf from 'image-size';
import { sanitizeFileName } from '../utils/fileHelpers';
import { getResourceUrl } from '../utils/urlHelper';

// 格式化返回数据 - 在多个地方使用此函数
const formatImageUrl = (image: any, req: Request) => {
    // 确保使用远程服务器URL而不是localhost
    const serverUrl = process.env.REMOTE_SERVER_URL || 
                     `http://${req.headers.host}` || 
                     `http://localhost:${process.env.PORT || 5000}`;
    
    return {
        ...image,
        url: `${serverUrl}${image.file_path}`
    };
};

// 在返回图片信息时添加缩略图URL
const formatImageResponse = (image: any, serverUrl: string) => {
    return {
        ...image,
        url: `${serverUrl}${image.file_path}`,
        thumbnail_url: image.thumbnail_path ? `${serverUrl}${image.thumbnail_path}` : undefined
    };
};

// 上传图片
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('上传请求接收到，用户:', req.user?.username);
        console.log('文件信息:', req.file);
        console.log('表单数据:', req.body);
        
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

        // 检查文件类型是否允许
        try {
            const allowedTypes = await getSetting('allowed_file_types');
            if (allowedTypes) {
                const allowedTypesList = allowedTypes.split(',');
                if (allowedTypesList.length > 0 && !allowedTypesList.includes(req.file.mimetype)) {
                    // 删除临时上传的文件
                    fs.unlinkSync(req.file.path);
                    return res.status(400).json({ message: `不允许的文件类型: ${req.file.mimetype}` });
                }
            }
        } catch (typeError) {
            console.error('检查文件类型设置失败:', typeError);
            // 继续处理，不阻止上传
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
        // 检查是否提供了自定义文件名
        let originalName;
        if (req.body.custom_filename) {
            // 使用客户端提供的自定义文件名
            originalName = sanitizeFileName(req.body.custom_filename);
            console.log('使用客户端提供的文件名:', originalName);
        } else {
            // 使用原始上传的文件名
            originalName = sanitizeFileName(req.file.originalname);
            console.log('使用原始上传文件名:', originalName);
        }

        // 获取是否公开参数
        const isPublic = req.body.is_public !== 'false';
        console.log('图片公开状态:', isPublic);

        // 创建缩略图
        let thumbnailPath = null;
        try {
            const fileExt = path.extname(req.file.filename);
            const fileName = req.file.filename.substring(0, req.file.filename.length - fileExt.length);
            const thumbnailFilename = `${fileName}_thumb${fileExt}`;
            const thumbnailFullPath = path.join(path.dirname(req.file.path), thumbnailFilename);
            
            console.log('生成缩略图:', thumbnailFullPath);
            
            // 使用sharp生成缩略图，限制最大宽度为800像素
            await sharp(req.file.path)
                .resize({ width: 800, withoutEnlargement: true })
                .toFile(thumbnailFullPath);
            
            thumbnailPath = `/uploads/${thumbnailFilename}`;
            console.log('缩略图路径:', thumbnailPath);
        } catch (thumbErr) {
            console.error('创建缩略图失败:', thumbErr);
            // 缩略图失败不影响主流程，继续执行
        }

        // 文件相对路径
        const filePath = `/uploads/${req.file.filename}`;

        // 创建图片记录
        const imageData = {
            user_id: req.user.userId,
            filename: req.file.filename,
            original_name: originalName,
            file_path: filePath,
            file_size: req.file.size,
            file_type: req.file.mimetype,
            width,
            height,
            is_public: isPublic,
            thumbnail_path: thumbnailPath
        };

        console.log('保存图片数据到数据库...');
        try {
            const imageId = await createImage(imageData);
            console.log('图片已保存，ID:', imageId);
            
            // 获取完整的图片URL（包括服务器基址）
            const serverUrl = process.env.REMOTE_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
            const imageUrl = `${serverUrl}${filePath}`;
            const thumbnailUrl = thumbnailPath ? `${serverUrl}${thumbnailPath}` : undefined;
            
            res.status(201).json({
                message: '图片上传成功',
                image: {
                    id: imageId,
                    ...imageData,
                    url: imageUrl,
                    thumbnail_url: thumbnailUrl
                }
            });
        } catch (dbError: any) {
            console.error('保存图片数据到数据库失败:', dbError);
            // 如果数据库错误，删除已上传的文件
            fs.unlinkSync(req.file.path);
            if (thumbnailPath) {
                const thumbnailFullPath = path.join(path.dirname(req.file.path), path.basename(thumbnailPath));
                if (fs.existsSync(thumbnailFullPath)) {
                    fs.unlinkSync(thumbnailFullPath);
                }
            }
            return res.status(500).json({ message: '保存图片数据失败', error: dbError.message });
        }
    } catch (error) {
        console.error('上传图片失败:', error);
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
        
        // 获取服务器URL
        const serverUrl = process.env.REMOTE_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
        
        // 格式化返回数据，添加完整URL和缩略图URL
        const formattedImages = images.map(image => formatImageResponse(image, serverUrl));

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
        
        // 获取服务器URL
        const serverUrl = process.env.REMOTE_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
        
        // 格式化返回数据，添加完整URL和缩略图URL
        const formattedImages = images.map(image => formatImageResponse(image, serverUrl));

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

        // 获取服务器URL
        const serverUrl = process.env.REMOTE_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
        
        // 格式化返回数据
        res.json({ image: formatImageResponse(image, serverUrl) });

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

        // 删除缩略图文件
        if (image.thumbnail_path) {
            const thumbnailPath = path.join(__dirname, '../../uploads', path.basename(image.thumbnail_path));
            if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            }
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
