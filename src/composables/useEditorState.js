import { ref, watch, onMounted, computed } from 'vue'

const STORAGE_KEY_CONTENT = 'wechat-md-content'
const STORAGE_KEY_AUTOSAVE = 'wechat-md-autosave'

export const themeColors = {
  green: { primary: '#07c160', secondary: 'rgba(7, 193, 96, 0.1)' },
  orange: { primary: '#ff6b6b', secondary: 'rgba(255, 107, 107, 0.1)' },
  purple: { primary: '#6f42c1', secondary: 'rgba(111, 66, 193, 0.1)' },
}

export const fontFamilies = {
  sans: "-apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif",
  serif: "Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
  mono: "Menlo, Monaco, 'Courier New', monospace",
}

const input = ref(`# Hello WeChat

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
`)

const currentTheme = ref('orange')
const currentFont = ref('sans')
const currentSize = ref(16)
const codeBlockStyle = ref('default')
const autoSave = ref(true)
const imageCaptionMode = ref('title-priority')

export function useEditorState() {
  const wechatStyle = computed(() => {
    const theme = themeColors[currentTheme.value]
    const font = fontFamilies[currentFont.value]
    const size = currentSize.value

    const tableStyle = `
      table { border-collapse: collapse; margin: 10px 0; width: 100%; display: table; font-size: 14px; }
      th { background-color: #f2f2f2; font-weight: bold; border: 1px solid #ddd; padding: 8px; text-align: left; min-width: 60px; }
      td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      tr:nth-child(even) { background-color: #f9f9f9; }
    `

    const listStyle = `
      ul { margin: 10px 0; padding-left: 2em; list-style-type: disc; list-style-position: outside; }
      ol { margin: 10px 0; padding-left: 2em; list-style-type: decimal; list-style-position: outside; }
      li { font-family: ${font}; font-size: ${size}px; color: #3f3f3f; line-height: 1.75; margin: 4px 0; word-break: break-word; overflow-wrap: break-word; display: list-item; }
      li p, li section, li article, li div, li aside, li header, li footer { display: inline; margin: 0; padding: 0; }
      li span, li strong, li em, li code { display: inline; margin: 0; padding: 0; }
      ul ul, ol ol, ul ol, ol ul { margin: 2px 0; padding-left: 1.5em; }
    `

    let codeStyle = ''
    if (codeBlockStyle.value === 'macos') {
      codeStyle = `
        pre { 
          background-color: #282c34; 
          border-radius: 6px; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
          margin: 15px 0; 
          overflow: hidden; 
          position: relative;
          padding-top: 35px !important;
        }
        pre::before {
          content: "• • •";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 25px;
          background: #21252b;
          color: #6c6f78;
          font-size: 24px;
          line-height: 16px;
          padding-left: 10px;
          letter-spacing: -10px;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        code { color: #abb2bf; font-family: 'Menlo', 'Monaco', 'Courier New', monospace; font-size: 13px; }
      `
    } else {
      codeStyle = `
        pre { background-color: #f6f8fa; padding: 10px; border-radius: 5px; font-size: 14px; overflow-x: auto; margin-bottom: 15px; }
        code { font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; background-color: rgba(27,31,35,0.05); padding: 2px 4px; border-radius: 3px; color: #d73a49; }
        pre code { background-color: transparent; padding: 0; color: inherit; }
      `
    }

    return `
    h1 { font-family: ${font}; font-size: ${Math.round(size * 1.5)}px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #333; border-bottom: 2px solid ${theme.primary}; padding-bottom: 5px; }
    h2 { font-family: ${font}; font-size: ${Math.round(size * 1.25)}px; font-weight: bold; margin-top: 18px; margin-bottom: 10px; color: #333; border-left: 4px solid ${theme.primary}; padding-left: 10px; }
    h3 { font-family: ${font}; font-size: ${Math.round(size * 1.125)}px; font-weight: bold; margin-top: 16px; margin-bottom: 10px; color: #333; }
    p { font-family: ${font}; font-size: ${size}px; line-height: 1.6; margin-bottom: 15px; color: #3f3f3f; text-align: justify; }
    ${listStyle}
    blockquote { font-family: ${font}; border-left: 4px solid #ddd; padding-left: 15px; color: #666; font-size: ${size - 1}px; margin: 0 0 15px 0; background-color: #f8f8f8; padding: 10px; }
    strong { font-weight: bold; color: ${theme.primary}; }
    em { font-style: italic; color: #666; }
    del { color: #999; }
    ins { text-decoration: underline; }
    mark { background-color: ${theme.secondary}; color: inherit; padding: 2px 4px; border-radius: 2px; }
    sub { vertical-align: sub; font-size: smaller; }
    sup { vertical-align: super; font-size: smaller; }
    hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
    img { max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px; }
    figure { margin: 10px 0; text-align: center; }
    figcaption { font-size: 13px; color: #666; margin-top: 6px; }
    sup.ref-mark { font-size: 12px; color: #888; vertical-align: super; margin-left: 4px; }
    .ref-links { margin-top: 18px; border-top: 1px solid #eee; padding-top: 10px; padding-left: 0; list-style: none; }
    .ref-links li { font-size: 13px; color: #666; margin: 6px 0; word-break: break-all; }
    ${tableStyle}
    ${codeStyle}
    `
  })

  watch(autoSave, (newVal) => {
    localStorage.setItem(STORAGE_KEY_AUTOSAVE, String(newVal))
    if (newVal) {
      localStorage.setItem(STORAGE_KEY_CONTENT, input.value)
    }
  })

  watch(input, () => {
    if (autoSave.value) {
      localStorage.setItem(STORAGE_KEY_CONTENT, input.value)
    }
  })

  onMounted(() => {
    const savedAutoSave = localStorage.getItem(STORAGE_KEY_AUTOSAVE)
    if (savedAutoSave !== null) {
      autoSave.value = savedAutoSave === 'true'
    }

    const savedContent = localStorage.getItem(STORAGE_KEY_CONTENT)
    if (autoSave.value && savedContent) {
      input.value = savedContent
    }
  })

  return {
    input,
    currentTheme,
    currentFont,
    currentSize,
    codeBlockStyle,
    autoSave,
    imageCaptionMode,
    wechatStyle,
  }
}
