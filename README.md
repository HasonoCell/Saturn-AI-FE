# Saturn-AI-FE

## 🎯 项目功能

- ✅ **多轮对话**：支持与 AI 进行多轮自然语言对话，消息实时同步。
- ✅ **会话管理**：支持新建、切换、删除会话，历史消息可追溯。
- ✅ **用户系统**：支持注册、登录、登出，用户信息本地持久化。
- ✅ **文件上传**：支持图片、文档等多类型文件上传，自动分块与断点续传。
- ✅ **智能检索**：内置消息搜索功能，支持关键词高亮与上下文定位。
- ✅ **AI 角色管理**：可自定义/切换 AI 角色，支持多智能体对话。
- ✅ **响应式 UI**：基于 Tailwind CSS，适配多端设备，体验流畅。
- ✅ **异常处理**：全局错误捕获与提示，提升用户体验。
- ✅ **权限路由**：基于用户登录状态自动跳转，保护敏感页面。

------

## 📚 技术选型

- 前端框架：`React 18` + `TypeScript`
- 构建工具：`Vite`
- 状态管理：`Zustand`
- 路由管理：`React Router v6`
- 样式方案：`Tailwind CSS`
- 网络请求：自封装 `axios`（支持拦截与统一错误处理）
- 组件库：`Antd` + `Antd-x`
- 代码规范：`ESLint` + `Prettier` + `Husky` + `Commitlint`
- 依赖管理：`pnpm`
- 其他工具：`Vite` 热更新、环境变量配置、接口分层（api/service/store）

------

## 🗂️ 目录结构

- `src/`
  - `apis/` —— API 请求封装
  - `components/` —— 通用与业务组件
  - `pages/` —— 页面级组件
  - `router/` —— 路由配置
  - `services/` —— 业务逻辑与数据处理
  - `stores/` —— 状态管理（Zustand）
  - `types/` —— TypeScript 类型定义
  - `utils/` —— 工具函数
  - `assets/` —— 静态资源
- `public/` —— 公共资源
- `tailwind.config.js` —— Tailwind 配置
- `vite.config.ts` —— Vite 配置
- `.env` —— 环境变量

------

## 🚀 快速开始

1. 克隆项目到本地：

  ```bash
  git clone https://github.com/你的仓库/Saturn-AI.git
  ```

2. 安装依赖（推荐使用 pnpm）：

  ```bash
  cd Saturn-AI-FE
  pnpm install
  ```

3. 启动开发环境：

  ```bash
  pnpm dev
  ```

4. 构建生产环境：

  ```bash
  pnpm build
  ```

5. 预览生产环境：

  ```bash
  pnpm preview
  ```

------
