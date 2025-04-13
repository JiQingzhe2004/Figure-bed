require('dotenv').config(); // 确保首先加载环境变量
const express = require('express');
const cors = require('cors');
const corsConfig = require('./config/cors.config');

const app = express();

// 应用CORS中间件
app.use(cors(corsConfig));

// 处理OPTIONS预检请求
app.options('*', cors(corsConfig));

// 解析JSON请求
app.use(express.json());

// 应用其他中间件

// 路由定义

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ success: false, message: '服务器内部错误' });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
// 绑定到0.0.0.0以监听所有网络接口，而不仅是localhost
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`服务器地址: http://localhost:${PORT}`);
  console.log(`CORS配置: 允许来源 ${corsConfig.origin}`);
});