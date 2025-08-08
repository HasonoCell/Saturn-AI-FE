import { create } from "zustand";
import type { MessageStoreProps } from "./types";

export const useMessageStore = create<MessageStoreProps>((set) => ({
  messages: [
    {
      role: "user",
      content: "你好！我想学习React开发，有什么好的建议吗？",
    },
    {
      role: "system",
      content: `你好！很高兴帮助你学习 React。

**学习路线建议：**

1. **打好 JavaScript 基础**
  - 熟悉 ES6+ 语法、异步编程（Promise/async/await）
  - 推荐资源：[MDN JavaScript 教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
2. **理解 React 核心概念**
  - 组件、JSX、Props、State、事件处理
  - 推荐文档：[React 官方文档](https://react.dev/learn)
3. **掌握 Hooks**
  - 重点学习 useState、useEffect、useContext
  - 了解自定义 Hook 的写法
4. **动手实践项目**
  - 从简单的 Todo 应用、计数器等入手
  - 逐步挑战天气查询、博客等中型项目
5. **学习状态管理**
  - 推荐 Redux、Zustand、Context API
6. **关注社区与最佳实践**
  - 多看优秀开源项目，参与讨论

> 你目前的 JavaScript 和前端基础如何？是否有实际项目经验？
`,
    },
    {
      role: "user",
      content: "我了解 ES6，做过一些小型 JS 项目。",
    },
    {
      role: "system",
      content: `很棒！基于你的基础，推荐以下 React 项目作为练手：

### 1. Todo 应用（首选）
- **功能**：添加、删除、标记完成任务
- **学习点**：组件状态、事件处理、列表渲染、条件渲染

### 2. 天气查询应用
- **功能**：输入城市，调用天气 API 获取数据
- **学习点**：API 请求、异步处理、表单输入、错误处理

### 3. 简易博客系统
- **功能**：文章列表、详情页、评论
- **学习点**：路由、组件传参、数据管理

> 建议先从 Todo 应用开始，逐步扩展功能。你对哪个项目更感兴趣？
`,
    },
    {
      role: "user",
      content: "我想先做 Todo 应用，能给个详细的实现建议吗？",
    },
    {
      role: "system",
      content: `当然可以！

#### Todo 应用实现建议

1. **项目结构设计**
  - 组件拆分：TodoList、TodoItem、AddTodo
2. **核心功能实现**
  - 添加任务（输入框+按钮）
  - 删除任务（每项后加删除按钮）
  - 标记完成（点击切换状态）
3. **进阶功能**
  - 本地存储（localStorage）持久化
  - 任务筛选（全部/已完成/未完成）
  - 样式美化（可用 Tailwind CSS）
4. **代码风格与最佳实践**
  - 使用函数组件和 Hooks
  - 适当拆分逻辑，保持代码简洁

> 如果你需要代码模板或遇到具体问题，随时可以问我！
`,
    },
    {
      role: "user",
      content: "如果我想做天气查询应用，有什么 API 推荐吗？",
    },
    {
      role: "system",
      content: `天气查询应用推荐使用以下免费 API：

- [和风天气](https://dev.qweather.com/)（需注册，免费额度充足）
- [OpenWeatherMap](https://openweathermap.org/api)（国际通用，免费有速率限制）

**实现建议：**
1. 设计输入框和查询按钮，输入城市名
2. 使用 fetch/axios 请求天气 API
3. 展示天气信息（如温度、天气状况、风力等）
4. 处理加载状态和错误提示

> 你可以先用假数据模拟，等接口调通后再接入真实 API。
`,
    },
    {
      role: "user",
      content: "React 状态管理选 Redux 还是 Zustand？",
    },
    {
      role: "system",
      content: `两者各有优劣：

- **Redux**：生态成熟，适合大型项目，工具链丰富（如 Redux Toolkit、DevTools），但配置略繁琐。
- **Zustand**：API 简洁，易于上手，适合中小型项目或局部状态管理，和 React 结合更自然。

**建议：**
- 新手/中小项目优先用 Zustand，体验更好
- 需要复杂全局状态、团队协作时可选 Redux

> 你可以先用 Zustand，等项目变复杂再考虑 Redux。
`,
    },
  ],

  addMessage(message) {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));
