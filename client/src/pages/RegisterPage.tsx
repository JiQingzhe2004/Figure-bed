import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { RegisterData } from '../types/auth';

const 注册页面: React.FC = () => {
    const [用户名, set用户名] = useState('');
    const [邮箱, set邮箱] = useState('');
    const [密码, set密码] = useState('');
    const [确认密码, set确认密码] = useState('');
    const [错误信息, set错误信息] = useState<string | null>(null);
    const [正在提交, set正在提交] = useState(false);
    const 导航 = useNavigate();

    const 处理提交 = async (事件: FormEvent) => {
        事件.preventDefault();
        set错误信息(null);

        if (密码 !== 确认密码) {
            set错误信息('两次输入的密码不一致');
            return;
        }
        if (密码.length < 6) {
            set错误信息('密码长度不能少于6个字符');
            return;
        }

        set正在提交(true);
        const 用户数据: RegisterData = { 
            username: 用户名, 
            email: 邮箱, 
            password: 密码 
        };

        try {
            const 响应 = await registerUser(用户数据);
            console.log('注册成功:', 响应);
            导航('/login'); // 跳转到登录页，将中文路径改为英文
        } catch (错误: any) {
            set错误信息(错误.message || '注册过程中发生错误');
            console.error('注册失败:', 错误);
        } finally {
            set正在提交(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">用户注册</h2>
            {错误信息 && <p className="text-red-500 text-center mb-4">{错误信息}</p>}
            <form onSubmit={处理提交}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                        用户名
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="请输入用户名"
                        value={用户名}
                        onChange={(e) => set用户名(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                        电子邮箱
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="请输入邮箱"
                        value={邮箱}
                        onChange={(e) => set邮箱(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                        密码
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="请输入密码"
                        value={密码}
                        onChange={(e) => set密码(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="confirm-password">
                        确认密码
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirm-password"
                        type="password"
                        placeholder="请再次输入密码"
                        value={确认密码}
                        onChange={(e) => set确认密码(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${正在提交 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={正在提交}
                    >
                        {正在提交 ? '注册中...' : '立即注册'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default 注册页面;