# Figure Bed - 一个现代化的图床应用

这是一个使用现代 Web 技术构建的图床项目，提供美观的用户界面和稳定的后端服务，用于存储和展示图片。

## ✨ 功能特性 (规划中)

*   用户注册与登录
*   图片上传 (支持拖拽、多文件)
*   图片管理 (查看、删除、复制链接)
*   图片展示墙
*   响应式设计，适配不同设备

## 🚀 技术栈

*   **前端:** React, TypeScript, Tailwind CSS, Axios
*   **后端:** Node.js, Express, TypeScript
*   **数据库:** MySQL
*   **图片存储:** 本地文件系统 (初期), 云存储 (未来)

## 📁 项目结构

```
Figure-bed/
├── client/         # 前端 React 应用
├── server/         # 后端 Node.js 应用
├── .gitignore      # Git 忽略配置
└── README.md       # 项目说明
```

## 🛠️ 安装与运行

### 环境要求

*   Node.js (建议使用 LTS 版本)
*   npm 或 yarn
*   MySQL 数据库

### 前端 (client)

```bash
cd client
npm install # 或者 yarn install
npm start   # 或者 yarn start
```

### 后端 (server)

```bash
cd server
npm install # 或者 yarn install

# 1. 创建 .env 文件
# 将 .env.example 复制为 .env
# cp .env.example .env # Linux/macOS
# copy .env.example .env # Windows

# 2. 配置 .env 文件
# 打开 .env 文件，根据你的环境 (特别是数据库凭证和 JWT_SECRET) 修改其中的值。

# 3. 运行开发服务器
npm run dev # 开发模式运行
```

## 📝 API 端点 (初步设计)

*   `POST /api/auth/register` - 用户注册
*   `POST /api/auth/login` - 用户登录
*   `GET /api/auth/me` - 获取当前用户信息
*   `POST /api/images/upload` - 上传图片
*   `GET /api/images` - 获取用户图片列表
*   `DELETE /api/images/:id` - 删除图片

##🤝 贡献

欢迎提出 Issue 或 Pull Request。
