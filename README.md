# Figure Bed - 一个现代化的图床应用

这是一个使用现代 Web 技术构建的图床项目，提供美观的用户界面和稳定的后端服务，用于存储和展示图片。

## ✨ 功能特性

### 已实现功能
* 用户注册与登录系统
* 图片上传（支持拖拽、多文件、自定义文件名）
* 图片管理（查看、删除、复制链接、公开/私密切换）
* 图片瀑布流展示
* 响应式设计，适配桌面和移动设备
* 缩略图自动生成
* 深色/浅色主题切换
* 管理员控制面板
* 用户资料管理
* 系统设置配置

### 规划中功能
* 图片云存储支持（如七牛云、阿里云OSS等）
* 图片分类与标签功能
* 批量图片操作
* 图片编辑与裁剪
* 图片分享与访问控制
* API访问令牌管理
* 访问统计与分析

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

### 打包与部署

#### 前端 (client)

```bash
cd client
npm run build # 或者 yarn build
```

构建完成后，生成的文件位于 `client/build` 目录。可以将其部署到任何静态文件服务器，例如 Nginx 或 Vercel。

#### 后端 (server)

```bash
cd server
npm run build # 或者 yarn build
```

构建完成后，生成的文件位于 `server/dist` 目录。可以将其部署到任何支持 Node.js 的服务器。

#### 后端部署后运行命令

##### 基本运行（不推荐用于生产环境）

```bash
cd server
node dist/server.js
```

##### 使用 PM2 进程管理器（推荐）

1. 安装 PM2
```bash
npm install -g pm2
```

2. 创建 PM2 配置文件 `ecosystem.config.js`（需手动创建）
   
   方法一：使用文本编辑器手动创建文件，内容如下：
```javascript
module.exports = {
  apps: [{
    name: "figure-bed",
    script: "./dist/server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
```

   方法二：使用命令行创建（Linux/macOS环境）：
```bash
cd server
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: "figure-bed",
    script: "./dist/server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
EOL
```

3. 启动服务
```bash
pm2 start ecosystem.config.js --env production
```

4. 常用 PM2 命令
```bash
pm2 status                # 查看所有进程状态
pm2 logs                  # 查看日志
pm2 logs figure-bed       # 查看特定应用日志
pm2 restart figure-bed    # 重启应用
pm2 stop figure-bed       # 停止应用
pm2 delete figure-bed     # 删除应用
pm2 save                  # 保存当前进程列表
pm2 startup               # 生成开机自启动脚本
```

##### 使用 systemd 服务（Linux 系统）

1. 创建 systemd 服务文件
```bash
sudo nano /etc/systemd/system/figure-bed.service
```

2. 添加以下内容（记得修改路径和用户）
```bash
[Unit]
Description=Figure Bed Application
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/server
ExecStart=/usr/bin/node /path/to/server/dist/server.js
Restart=on-failure
Environment=NODE_ENV=production PORT=5000

[Install]
WantedBy=multi-user.target
```

3. 启用并启动服务
```bash
sudo systemctl enable figure-bed
sudo systemctl start figure-bed
```

4. 服务管理命令
```bash
sudo systemctl status figure-bed   # 查看状态
sudo systemctl restart figure-bed  # 重启服务
sudo systemctl stop figure-bed     # 停止服务
sudo journalctl -u figure-bed      # 查看日志
```

## 完整部署流程示例
```bash
# 假设已经将代码拉取到服务器上

# 后端部署
cd server
npm install --production    # 只安装生产环境依赖
cp .env.example .env       # 复制环境变量文件
nano .env                  # 编辑配置文件

# 构建项目
npm run build

# 创建上传目录（如果不存在）
mkdir -p uploads

# 启动服务（使用PM2）
pm2 start dist/server.js --name "figure-bed" \
  --max-memory-restart 300M \
  --env production

# 设置开机自启动
pm2 save
pm2 startup

# 前端部署（如果后端也提供前端静态文件）
cd ../client
npm install
npm run build
cp -r build/* ../server/public/
```

## ⚠️ 注意事项

* 数据库迁移：首次部署时，应用会自动创建必要的数据库表和初始管理员账户（用户名：admin，密码：admin123）
* 文件权限：确保 uploads 目录有正确的读写权限
* 安全配置：建议在生产环境使用 HTTPS，可以通过 Nginx 反向代理配置
* 监控：PM2 提供基本监控功能，使用 `pm2 monit` 查看实时性能
* 备份：定期备份数据库和上传的图片文件

## 📝 API 端点

### 认证相关
* `POST /api/auth/register` - 用户注册
* `POST /api/auth/login` - 用户登录
* `GET /api/auth/me` - 获取当前用户信息
* `POST /api/auth/logout` - 用户登出

### 图片相关
* `POST /api/images/upload` - 上传图片
* `GET /api/images` - 获取用户图片列表
* `GET /api/images/public` - 获取公开图片列表
* `GET /api/images/:id` - 获取单个图片详情
* `DELETE /api/images/:id` - 删除图片
* `PATCH /api/images/:id/public` - 切换图片公开状态

### 用户相关
* `PATCH /api/user/profile` - 更新用户资料
* `POST /api/user/avatar` - 上传用户头像
* `POST /api/user/password` - 修改用户密码

### 管理员相关
* `GET /api/admin/dashboard` - 获取仪表盘数据
* `GET /api/admin/users` - 获取所有用户列表
* `DELETE /api/admin/users/:id` - 删除用户
* `PATCH /api/admin/users/:id/role` - 修改用户角色
* `GET /api/admin/images` - 获取所有图片
* `DELETE /api/admin/images/:id` - 删除图片（管理员权限）

### 系统设置相关
* `GET /api/settings` - 获取系统设置
* `POST /api/settings` - 更新系统设置（管理员）

## 🔧 系统配置

系统设置可以通过管理员后台界面进行修改，包括：

* 站点名称和描述
* 网站Logo URL
* 网站关键词
* 允许上传的图片类型和大小限制
* 是否允许新用户注册
* 默认主题设置（浅色/深色/跟随系统）

## 🤝 贡献

欢迎提出 Issue 或 Pull Request。

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE) 进行开源。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SPDX-License-Identifier: MIT