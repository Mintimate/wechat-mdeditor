# WeChat Markdown Editor

一个优雅的微信公众号 Markdown 编辑器，支持实时预览和样式自定义。

## 在线体验 🚀

**立即体验在线演示：** [WeChat Markdown Editor](https://gsvshc.mintimate.cc/)

通过在线演示可以直接体验编辑、主题切换与实时预览等功能。

## 项目结构

```
wechat-md/
├── .editorconfig              # 编辑器统一配置
├── .eslintrc.cjs              # ESLint 配置
├── .prettierrc                # Prettier 配置
├── .gitignore                 # Git 忽略规则
├── index.html                 # HTML 入口
├── package.json               # 项目依赖配置
├── vite.config.js             # Vite 构建配置
├── yarn.lock                  # Yarn 依赖锁定
│
├── public/                    # 静态资源
│   ├── favicon.ico
│   └── favicon.png
│
└── src/
    ├── main.js                # 应用入口
    ├── App.vue                # 根组件
    ├── style.css              # 全局样式
    │
    ├── components/            # Vue 组件
    │   ├── editor/            # 编辑器相关组件
    │   │   └── MarkdownEditor.vue
    │   ├── layout/            # 布局组件
    │   │   └── AppHeader.vue
    │   ├── preview/           # 预览相关组件
    │   │   └── WeChatPreview.vue
    │   └── ui/                # UI 组件
    │       └── NotificationToast.vue
    │
    ├── composables/           # Vue 3 Composition API
    │   ├── useEditorState.js
    │   ├── useMarkdownRenderer.js
    │   └── useNotification.js
    │
    ├── config/                # 配置模块
    │   ├── index.js
    │   ├── baseStyles.js
    │   ├── codeBlockStyles.js
    │   ├── fonts.js
    │   ├── headingStyles.js
    │   └── themes.js
    │
    ├── presets/               # 预设模板
    │   └── index.js
    │
    └── utils/                 # 工具函数
        ├── inlineStyles.js
        └── markdownItPlugins.js
```

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **CodeMirror 6** - 代码编辑器
- **markdown-it** - Markdown 解析器
- **Mermaid** - 图表渲染

## 开发

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 代码检查
yarn lint

# 代码格式化
yarn format

# 构建生产版本
yarn build

# 预览生产构建
yarn preview
```

## 功能特性

- ✅ 实时 Markdown 预览
- ✅ 微信公众号样式适配
- ✅ 多主题切换
- ✅ 自定义字体
- ✅ 代码高亮
- ✅ 图表支持（Mermaid）
- ✅ 同步滚动
- ✅ 一键复制
- ✅ 暗色模式
- ✅ 本地自动保存

## License

MIT
