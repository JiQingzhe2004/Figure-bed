import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { RegisterData } from '../types/auth';
import { getSettings } from '../services/settingService';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [siteName, setSiteName] = useState('我的图床');
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();

    // 获取网站设置
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { settings } = await getSettings();
                if (settings.site_name) setSiteName(settings.site_name);
            } catch (error) {
                console.error('获取网站设置失败:', error);
            }
        };

        fetchSettings();
    }, []);

    const goToNextStep = () => {
        if (currentStep === 1) {
            if (!username) {
                setError('请输入用户名');
                return;
            }
            if (!email) {
                setError('请输入电子邮箱');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('请输入有效的电子邮箱地址');
                return;
            }
            setError(null);
            setCurrentStep(2);
        }
    };

    const goToPrevStep = () => {
        setCurrentStep(1);
        setError(null);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }
        if (password.length < 6) {
            setError('密码长度不能少于6个字符');
            return;
        }

        setIsSubmitting(true);
        const userData: RegisterData = { 
            username: username, 
            email: email, 
            password: password 
        };

        try {
            const response = await registerUser(userData);
            console.log('注册成功:', response);
            navigate('/login'); // 跳转到登录页
        } catch (error: any) {
            setError(error.message || '注册过程中发生错误');
            console.error('注册失败:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
            {/* 装饰性元素 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                <div className="absolute top-0 -left-20 w-72 h-72 bg-green-100 dark:bg-green-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute bottom-0 right-20 w-72 h-72 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>
            
            <div className="w-full max-w-md relative">
                {/* 卡片 */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* 卡片顶部装饰 */}
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-green-400 to-blue-500"></div>
                    
                    {/* 卡片内容 */}
                    <div className="relative pt-12 px-8 pb-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-lg mb-4">
                                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">注册{siteName}账号</h2>
                            <p className="text-green-100 text-sm">只需几个简单步骤，立即开始使用</p>
                        </div>
                        
                        {/* 进度指示器 */}
                        <div className="flex items-center justify-center mb-8">
                            <div className={`w-3 h-3 rounded-full ${currentStep === 1 ? 'bg-blue-500' : 'bg-blue-300'}`}></div>
                            <div className={`w-12 h-1 ${currentStep === 1 ? 'bg-gray-300' : 'bg-blue-300'}`}></div>
                            <div className={`w-3 h-3 rounded-full ${currentStep === 2 ? 'bg-blue-500' : 'bg-blue-300'}`}></div>
                        </div>
                        
                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="mt-8">
                            {currentStep === 1 && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                            用户名
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="username"
                                                type="text"
                                                className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                                placeholder="请输入用户名"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                            电子邮箱
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                                placeholder="请输入邮箱"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            onClick={goToNextStep}
                                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5"
                                        >
                                            下一步
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {currentStep === 2 && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                            密码
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="password"
                                                type="password"
                                                className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                                placeholder="请输入密码"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">密码长度至少6个字符</p>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                            确认密码
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                                placeholder="请再次输入密码"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={goToPrevStep}
                                            className="w-1/2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                        >
                                            返回
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    注册中...
                                                </>
                                            ) : '完成注册'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                        
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                已有账号？
                                <Link to="/login" className="ml-1 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                                    立即登录
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* 底部装饰图案 */}
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70"></div>
            </div>
        </div>
    );
};

export default RegisterPage;