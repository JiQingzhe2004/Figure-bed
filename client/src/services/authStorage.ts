/**
 * 处理身份验证令牌的本地存储
 */
export const AUTH_TOKEN_KEY = 'authToken';

/**
 * 保存认证令牌到本地存储
 */
export const saveAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * 从本地存储获取认证令牌
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * 从本地存储删除认证令牌
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
