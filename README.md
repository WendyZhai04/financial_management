# Wendy & Daniel 记账本

## 项目简介
一个基于 React + Flask + SQLite 的双人手机网页版记账应用，部署在自己的服务器上，数据完全私有。

## 核心功能
- **语音速记**：长按麦克风说 "Wendy 买菜 35 块"，自动解析金额、分类和付款人
- **订阅管理**：管理 Apple Music、Kimi 会员等周期性支出，每月自动生成账单
- **分类统计**：饼图 + 列表展示各类支出占比
- **时间筛选**：支持按本月、本周、上月或自定义日期段查看
- **个人标签**：可标记某笔支出为个人消费（如单独和朋友聚餐）
- **拍照上传**：支持上传消费凭证照片
- **收支模式**：支持记录支出和收入

## 技术栈
- 前端：React + Vite + Tailwind CSS
- 后端：Flask + SQLite
- 部署：云服务器

## 本地开发启动步骤

### 1. 启动后端
```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```
后端默认运行在 http://127.0.0.1:5000

### 2. 启动前端
```bash
cd frontend
npm install
npm run dev
```
前端默认运行在 http://localhost:5173

用浏览器（推荐 Chrome 或 Safari）打开前端地址即可使用。

## 部署到服务器
### 方式一：独立部署
1. 后端：用 Gunicorn 或 uWSGI 运行 Flask，Nginx 反向代理
2. 前端：`npm run build` 生成 dist 文件夹，用 Nginx 托管静态文件
3. 配置 Nginx 将 `/api` 和 `/uploads` 代理到后端服务

### 方式二：Docker 部署（推荐让你男朋友做）
可以写一个 `docker-compose.yml`，同时跑前端 Nginx 容器和后端 Python 容器。

## 注意事项
- **语音识别**：iPhone 用户请务必使用 **Safari 浏览器**打开，iOS 上的 Chrome 不支持 Web Speech API
- 如果浏览器语音识别效果不好，可以升级成讯飞 API（有免费额度）
- 首次使用请添加一些订阅项目，它们会在每月指定日期自动生成支出记录
- 数据库文件 `backend/finance.db` 就是你们所有的数据，记得定期备份

## 设计风格
严格遵循 `Design System Inspired by Notion.md` 中的设计规范：温暖的灰度色调、超细边框、Notion Blue 强调色、Inter 字体。
