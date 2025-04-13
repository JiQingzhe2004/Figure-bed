import { Request, Response, NextFunction } from 'express';
import { getSetting, updateSetting, getAllSettings } from '../models/Setting';

// 获取所有设置
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 获取所有设置
        const settings = await getAllSettings();
        
        // 转换为{key: value}格式
        const settingsObject: Record<string, string> = {};
        settings.forEach(setting => {
            settingsObject[setting.setting_key] = setting.setting_value;
        });
        
        res.json({ settings: settingsObject });
    } catch (error) {
        console.error('获取设置失败:', error);
        next(error);
    }
};

// 更新设置
export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 已经通过中间件验证了管理员权限，无需重复验证
        // 获取设置对象
        const { settings } = req.body;
        
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ message: '无效的设置数据' });
        }
        
        console.log('接收到设置更新请求，用户:', req.user?.username);
        
        // 更新每个设置
        const updatePromises = Object.entries(settings).map(([key, value]) => {
            return updateSetting(key, value as string);
        });
        
        await Promise.all(updatePromises);
        
        res.json({ message: '设置已更新' });
    } catch (error) {
        console.error('更新设置失败:', error);
        next(error);
    }
};
