import { Request, Response, NextFunction } from 'express';
import { getAllSettings, updateSetting as updateSettingModel, updateSettings } from '../models/Setting';

// 获取所有设置
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const settings = await getAllSettings();
        
        // 转换为对象格式，方便前端使用
        const settingsObject = settings.reduce((acc, setting) => {
            acc[setting.setting_key] = setting.setting_value;
            return acc;
        }, {} as Record<string, string>);
        
        res.json({ settings: settingsObject });

    } catch (error) {
        console.error('获取设置失败:', error);
        next(error);
    }
};

// 更新单个设置
export const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        
        if (value === undefined) {
            return res.status(400).json({ message: '设置值不能为空' });
        }
        
        const success = await updateSettingModel(key, value);
        
        if (success) {
            res.json({ message: '设置更新成功' });
        } else {
            res.status(500).json({ message: '设置更新失败' });
        }

    } catch (error) {
        console.error('更新设置失败:', error);
        next(error);
    }
};

// 批量更新设置
export const updateMultipleSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { settings } = req.body;
        
        if (!settings || !Array.isArray(settings)) {
            return res.status(400).json({ message: '无效的设置数据' });
        }
        
        const formattedSettings = settings.map(item => ({
            key: item.key,
            value: item.value
        }));
        
        const success = await updateSettings(formattedSettings);
        
        if (success) {
            res.json({ message: '设置更新成功' });
        } else {
            res.status(500).json({ message: '设置更新失败' });
        }

    } catch (error) {
        console.error('批量更新设置失败:', error);
        next(error);
    }
};
