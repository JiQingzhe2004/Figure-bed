import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from '../../utils/apiUtils';

/**
 * API状态指示器组件
 * 显示API连接状态，帮助调试前后端连接问题
 */
const ApiStatus = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);
  const apiUrl = getApiBaseUrl();

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await axios.get(`${apiUrl}/`, { timeout: 5000 });
        if (response.status === 200) {
          setStatus('connected');
        } else {
          setStatus('error');
          setError(`响应状态码: ${response.status}`);
        }
      } catch (err) {
        setStatus('error');
        setError(err.message);
      }
    };

    checkApi();
  }, [apiUrl]);

  if (status === 'checking') {
    return (
      <div className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
        正在检查API连接...
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
        API已连接: {apiUrl}
      </div>
    );
  }

  return (
    <div className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">
      API连接失败: {error}
    </div>
  );
};

export default ApiStatus;
