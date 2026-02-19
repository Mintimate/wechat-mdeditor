/**
 * 默认 Demo 内容
 */
export const defaultDemo = `# Hello WeChat

这是一段 **粗体**，这是一段 *斜体*，这是一段 ~~删除线~~，这是一段 ++下划线++。
这是一段 ==高亮==，这是一段 ~下标~，这是一段 ^上标^。

## 无序列表

- 项目名称: 微信公众号 Markdown 编辑器
- 作者: Mintimate
- 版本: 1.0.0
- 特性: 支持 Mermaid、代码高亮、主题切换

## 有序列表

1. 第一步: 编写 Markdown 内容
2. 第二步: 选择主题颜色
3. 第三步: 点击复制按钮
4. 第四步: 粘贴至微信公众号后台

## 代码块

\`\`\`javascript
console.log('Hello, WeChat!');
const a = 100;
\`\`\`

## 流程图 (Mermaid)

\`\`\`mermaid
graph TD;
    A[开始处理] --> B{是否有效?};
    B -- 是 --> C[执行操作];
    B -- 否 --> D[显示错误];
    C --> E[完成任务];
    D --> F[结束流程];
\`\`\`

## 引用

> 这是一个引用块，微信公众号通常会有特殊的样式。
`

/**
 * 其他 Demo 模板
 */
export const demoTemplates = {
  default: defaultDemo,
  technical: `# 技术文档示例

## 快速开始

安装依赖：

\`\`\`bash
npm install my-package
# 或者
yarn add my-package
\`\`\`

## API 文档

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| \`init()\` | 无 | \`void\` | 初始化应用 |
| \`render()\` | \`data: object\` | \`string\` | 渲染内容 |
| \`destroy()\` | 无 | \`void\` | 销毁实例 |

## 代码示例

\`\`\`typescript
interface Config {
  theme: string;
  fontSize: number;
}

function createEditor(config: Config) {
  return {
    render: (content: string) => content,
    destroy: () => console.log('destroyed')
  };
}
\`\`\`

> 提示：这是一个技术文档的示例模板。
`,

  article: `# 文章标题

这里是文章的开头段落，用于吸引读者的注意力。

## 引言

在这一部分，我们将讨论...

## 正文

### 第一点

内容内容内容...

### 第二点

更多内容...

## 总结

总结全文要点。

---

> 本文由作者原创，转载请注明出处。
`,

  mermaid: `# Mermaid 图表示例

## 流程图

\`\`\`mermaid
graph LR
    A[开始] --> B{判断}
    B -->|是| C[处理A]
    B -->|否| D[处理B]
    C --> E[结束]
    D --> E
\`\`\`

## 时序图

\`\`\`mermaid
sequenceDiagram
    participant 用户
    participant 前端
    participant 后端
    用户->>前端: 点击按钮
    前端->>后端: 发送请求
    后端-->>前端: 返回数据
    前端-->>用户: 显示结果
\`\`\`

## 饼图

\`\`\`mermaid
pie title 数据分布
    "A类型" : 40
    "B类型" : 30
    "C类型" : 20
    "其他" : 10
\`\`\`
`,
}

export const demoTemplateKeys = Object.keys(demoTemplates)
