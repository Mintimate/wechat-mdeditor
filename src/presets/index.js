/**
 * 默认 Demo 内容
 */
export const defaultDemo = `# WeChat Markdown Editor

一个优雅的微信公众号 Markdown 编辑器，专为创作者打造。

## 链接引用

如果感觉项目不错，欢迎点个 ⭐ 支持一下:
- [GitHub](https://github.com/Mintimate/wechat-mdeditor)
- [CNB](https://cnb.cool/Mintimate/tool-forge/wechat-mdeditor)

或者访问我的 B站 主页 [Mintimate](https://space.bilibili.com/12345678) 关注我，助力冲击 1w 粉丝！

## 文本样式

支持多种内联样式：**粗体**、*斜体*、~~删除线~~、++下划线++、==高亮标记==。

科学公式支持：H~2~O 是水分子，E = mc^2^ 是质能方程。

Ruby 注音：{微信|wēi xìn}、{Markdown|mǎ kè dào}。

---

## 功能特性

### 列表展示

无序列表：
- 🎨 多主题切换（8种配色）
- 📝 实时 Markdown 预览
- 🎯 一键复制到公众号
- 💾 本地自动保存

有序列表：
1. 编写 Markdown 内容
2. 选择主题颜色
3. 点击复制按钮
4. 粘贴至公众号后台

任务列表：
- [x] 实时预览
- [x] 主题切换
- [x] 代码高亮
- [ ] 更多功能开发中...

## 代码高亮

\`\`\`javascript
// 支持 JavaScript 语法高亮
const greeting = 'Hello, WeChat!';
console.log(greeting);

const features = {
  preview: true,
  themes: 8,
  mermaid: true
};
\`\`\`

\`\`\`python
# Python 代码示例
def hello_wechat():
    message = "欢迎使用微信编辑器"
    return message

print(hello_wechat())
\`\`\`

## 表格展示

| 功能 | 状态 | 说明 |
|------|:----:|------|
| Markdown 解析 | ✅ | 支持 GFM 语法 |
| 代码高亮 | ✅ | highlight.js |
| Mermaid 图表 | ✅ | 流程图/时序图 |
| 主题切换 | ✅ | 8 种主题色 |

## 图片展示

### 单张图片

![Tailwind CSS 示例](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800)

### 滑动图片（左右滑动查看更多）

<![代码编辑](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800),![数据分析](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800),![团队协作](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800)>

## Mermaid 图表

### 流程图

\`\`\`mermaid
flowchart LR
    subgraph 编辑[📝 编辑阶段]
        A[选择主题] --> B[编写内容]
        B --> C[实时预览]
    end
    
    subgraph 发布[🚀 发布阶段]
        D[点击复制] --> E[粘贴发布]
    end
    
    C --> D
    
    style 编辑 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style 发布 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
\`\`\`

### 时序图

\`\`\`mermaid
sequenceDiagram
    participant U as 用户
    participant E as 编辑器
    participant W as 微信
    U->>E: 编写 Markdown
    E->>E: 实时渲染
    U->>E: 点击复制
    E->>U: 复制到剪贴板
    U->>W: 粘贴发布
\`\`\`

## 引用块

> 写作是一种思考方式。
> 
> 好的工具让创作更专注，让表达更优雅。

---

> 💡 **提示**：点击右上角的主题按钮，可以切换不同的配色方案。
`

/**
 * 其他 Demo 模板
 */
export const demoTemplates = {
  default: defaultDemo,
  technical: `# API 技术文档

## 安装

\`\`\`bash
# 使用 npm
npm install awesome-editor

# 使用 yarn
yarn add awesome-editor

# 使用 pnpm
pnpm add awesome-editor
\`\`\`

## 快速开始

\`\`\`typescript
import { createEditor } from 'awesome-editor';

const editor = createEditor({
  theme: 'orange',
  fontSize: 16,
  autoSave: true
});

// 渲染内容
const html = editor.render('# Hello World');
\`\`\`

## API 参考

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| \`theme\` | \`string\` | \`'orange'\` | 主题名称 |
| \`fontSize\` | \`number\` | \`16\` | 字体大小 |
| \`autoSave\` | \`boolean\` | \`true\` | 自动保存 |

### 方法列表

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| \`render()\` | \`content: string\` | \`string\` | 渲染 Markdown |
| \`setTheme()\` | \`theme: string\` | \`void\` | 设置主题 |
| \`destroy()\` | 无 | \`void\` | 销毁实例 |

## 使用流程

\`\`\`mermaid
flowchart LR
    subgraph 初始化[⚙️ 初始化]
        A[安装依赖] --> B[导入模块]
    end
    
    subgraph 使用[🚀 使用]
        C[创建实例] --> D[调用方法]
    end
    
    B --> C
\`\`\`

> 📘 完整文档请访问 [官方文档](https://docs.example.com)
`,

  article: `# 深度好文：如何提升写作效率

在信息爆炸的时代，高效的写作工具能够帮助我们更好地表达想法。

## 为什么选择 Markdown？

### 简洁优雅

Markdown 语法简单直观，让你专注于内容本身，而非排版格式。

- **纯文本格式**：跨平台兼容，版本控制友好
- **所见即所得**：实时预览，写作体验流畅
- **扩展性强**：支持表格、代码块、图表等

### 微信公众号适配

针对微信公众号的特殊需求进行了优化：

1. 内联样式导出，完美兼容
2. 多种主题配色，一键切换
3. 代码高亮渲染，专业美观

## 写作建议

> 好的工具是写作的助力，而非干扰。选择适合自己的工具，让创作更纯粹。

### 实用技巧

- [x] 使用快捷键提升效率
- [x] 定期保存避免丢失
- [x] 善用模板快速开始
- [ ] 建立个人写作习惯

---

**结语**：工欲善其事，必先利其器。希望这款编辑器能为你的创作带来便利。

> 本文由作者原创，转载请注明出处。
`,

  mermaid: `# Mermaid 图表示例

Mermaid 是一种基于 JavaScript 的图表绘制工具，使用 Markdown 风格的语法定义图表。

## 流程图

\`\`\`mermaid
flowchart LR
    subgraph 输入[📥 输入]
        A[开始]
    end
    
    subgraph 处理[⚙️ 处理]
        B{条件判断}
        B -->|是| C[操作A]
        B -->|否| D[操作B]
    end
    
    subgraph 输出[📤 输出]
        E[结束]
    end
    
    A --> B
    C --> E
    D --> E
\`\`\`

## 时序图

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant U as 用户
    participant F as 前端
    participant B as 后端
    participant D as 数据库
    
    U->>F: 点击登录
    F->>B: 发送认证请求
    B->>D: 查询用户信息
    D-->>B: 返回用户数据
    B-->>F: 返回 Token
    F-->>U: 登录成功
\`\`\`

## 饼图

\`\`\`mermaid
pie showData
    title 技术栈使用占比
    "Vue.js" : 35
    "React" : 30
    "Angular" : 15
    "其他" : 20
\`\`\`

## 甘特图

\`\`\`mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    
    section 需求阶段
    需求分析     :a1, 2024-01-01, 7d
    原型设计     :a2, after a1, 5d
    
    section 开发阶段
    前端开发     :b1, after a2, 14d
    后端开发     :b2, after a2, 14d
    
    section 测试阶段
    功能测试     :c1, after b1, 7d
    上线部署     :c2, after c1, 3d
\`\`\`

## 类图

\`\`\`mermaid
classDiagram
    class Editor {
        +theme: string
        +content: string
        +render(): string
        +setTheme(theme): void
    }
    
    class Preview {
        +html: string
        +update(html): void
    }
    
    Editor --> Preview : 使用
\`\`\`
`,
}

export const demoTemplateKeys = Object.keys(demoTemplates)
