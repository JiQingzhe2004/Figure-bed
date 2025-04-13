import apiClient from './api';
import { SettingsResponse, SettingUpdatePayload } from '../types/settings';

export const getSettings = async (): Promise<SettingsResponse> => {
    try {
        const response = await apiClient.get<SettingsResponse>('/settings');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取设置失败');
    }
};

export const updateSetting = async (key: string, value: string): Promise<void> => {
    try {
        await apiClient.put(`/settings/${key}`, { value });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '更新设置失败');
    }
};

export const updateSettings = async (settings: SettingUpdatePayload[]): Promise<void> => {
    try {
        await apiClient.put('/settings', { settings });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '更新设置失败');
    }
};
