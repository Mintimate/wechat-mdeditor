/**
 * 代码块样式配置
 * 每个样式包含 name 和生成样式字符串的函数
 * 
 * 重要：code 样式用于行内代码，pre code 样式用于代码块
 * 深色主题需要为行内代码设置浅色背景，以便在白色文档中可见
 */

export const codeBlockStyles = {
  default: {
    name: '默认',
    generate: (font, size) => `
      pre { 
        background-color: #f6f8fa; 
        padding: 10px; 
        border-radius: 5px; 
        font-size: 14px; 
        overflow-x: auto; 
        margin: 15px 0; 
        border: 1px solid #e1e4e8;
      }
      code { 
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; 
        background-color: rgba(27,31,35,0.05); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #d73a49; 
        font-size: 0.9em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #24292e; 
        font-size: 13px;
      }
    `,
    highlightPre: (content, font) => 
      `<pre class="hljs" style="background: #f6f8fa; padding: 10px; border-radius: 5px; overflow-x: auto; border: 1px solid #e1e4e8;"><code style="font-family: ${font}; font-size: 13px; line-height: 1.5; color: #24292e;">${content}</code></pre>`,
  },

  macos: {
    name: 'macOS 风格',
    generate: (font, size) => `
      pre { 
        background-color: #282c34; 
        border-radius: 8px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
        margin: 15px 0; 
        overflow: hidden; 
        position: relative;
        padding: 15px;
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
      code { 
        font-family: 'Menlo', 'Monaco', 'Courier New', monospace; 
        background-color: rgba(40,44,52,0.08); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #e06c75; 
        font-size: 0.9em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #abb2bf; 
        font-size: 13px;
      }
    `,
    highlightPre: (content, font) => {
      const macHeader = `<div style="display: flex; gap: 6px; margin-bottom: 10px; align-items: center;"><span style="width: 12px; height: 12px; border-radius: 50%; background-color: #ff5f56; border: 1px solid #e0443e; display: inline-block;"></span><span style="width: 12px; height: 12px; border-radius: 50%; background-color: #ffbd2e; border: 1px solid #dea123; display: inline-block;"></span><span style="width: 12px; height: 12px; border-radius: 50%; background-color: #27c93f; border: 1px solid #1aab29; display: inline-block;"></span></div>`
      return `<pre class="hljs macos" style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 8px; overflow-x: auto;">${macHeader}<code style="font-family: ${font}; font-size: 13px; line-height: 1.5; background: transparent;">${content}</code></pre>`
    },
  },

  github: {
    name: 'GitHub 风格',
    generate: (font, size) => `
      pre { 
        background-color: #f6f8fa; 
        padding: 16px; 
        border-radius: 6px; 
        font-size: 14px; 
        overflow-x: auto; 
        margin: 15px 0;
        border: 1px solid #e1e4e8;
        line-height: 1.45;
      }
      code { 
        font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace; 
        background-color: rgba(175,184,193,0.2); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #24292f;
        font-size: 0.85em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #24292f;
        font-size: 12px;
      }
    `,
    highlightPre: (content, font) => 
      `<pre class="hljs" style="background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; border: 1px solid #e1e4e8;"><code style="font-family: ${font}; font-size: 12px; line-height: 1.45; color: #24292f;">${content}</code></pre>`,
  },

  vscode: {
    name: 'VS Code 风格',
    generate: (font, size) => `
      pre { 
        background-color: #1e1e1e; 
        padding: 16px; 
        border-radius: 4px; 
        font-size: 14px; 
        overflow-x: auto; 
        margin: 15px 0;
        border: 1px solid #3c3c3c;
      }
      code { 
        font-family: 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace; 
        background-color: rgba(30,30,30,0.08); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #d73a49; 
        font-size: 0.9em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #d4d4d4;
        font-size: 13px;
        line-height: 1.5;
      }
    `,
    highlightPre: (content, font) => 
      `<pre class="hljs" style="background: #1e1e1e; padding: 16px; border-radius: 4px; overflow-x: auto; border: 1px solid #3c3c3c;"><code style="font-family: ${font}; font-size: 13px; line-height: 1.5; color: #d4d4d4;">${content}</code></pre>`,
  },

  atom: {
    name: 'Atom 风格',
    generate: (font, size) => `
      pre { 
        background-color: #282c34; 
        padding: 16px; 
        border-radius: 8px; 
        font-size: 14px; 
        overflow-x: auto; 
        margin: 15px 0;
        border: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      code { 
        font-family: 'Fira Code', 'DejaVu Sans Mono', Consolas, monospace; 
        background-color: rgba(40,44,52,0.08); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #e06c75; 
        font-size: 0.9em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #abb2bf;
        font-size: 13px;
        line-height: 1.6;
      }
    `,
    highlightPre: (content, font) => 
      `<pre class="hljs" style="background: #282c34; padding: 16px; border-radius: 8px; overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"><code style="font-family: ${font}; font-size: 13px; line-height: 1.6; color: #abb2bf;">${content}</code></pre>`,
  },

  oneDark: {
    name: 'One Dark Pro',
    generate: (font, size) => `
      pre { 
        background-color: #282c34; 
        padding: 20px; 
        border-radius: 10px; 
        font-size: 14px; 
        overflow-x: auto; 
        margin: 15px 0;
        border: 1px solid #3e4451;
      }
      code { 
        font-family: 'JetBrains Mono', 'Fira Code', 'Droid Sans Mono', monospace; 
        background-color: rgba(40,44,52,0.08); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #e06c75; 
        font-size: 0.9em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #abb2bf;
        font-size: 14px;
        line-height: 1.6;
      }
    `,
    highlightPre: (content, font) => 
      `<pre class="hljs" style="background: #282c34; padding: 20px; border-radius: 10px; overflow-x: auto; border: 1px solid #3e4451;"><code style="font-family: ${font}; font-size: 14px; line-height: 1.6; color: #abb2bf;">${content}</code></pre>`,
  },

  dracula: {
    name: 'Dracula',
    generate: (font, size) => `
      pre { 
        background-color: #282a36; 
        padding: 16px; 
        border-radius: 8px; 
        font-size: 14px; 
        overflow-x: auto; 
        margin: 15px 0;
        border: 1px solid #44475a;
      }
      code { 
        font-family: 'Fira Code', Consolas, Monaco, monospace; 
        background-color: rgba(40,42,54,0.08); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #ff79c6; 
        font-size: 0.9em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #f8f8f2;
        font-size: 13px;
        line-height: 1.5;
      }
    `,
    highlightPre: (content, font) => 
      `<pre class="hljs" style="background: #282a36; padding: 16px; border-radius: 8px; overflow-x: auto; border: 1px solid #44475a;"><code style="font-family: ${font}; font-size: 13px; line-height: 1.5; color: #f8f8f2;">${content}</code></pre>`,
  },

  monokai: {
    name: 'Monokai',
    generate: (font, size) => `
      pre { 
        background-color: #272822; 
        padding: 16px; 
        border-radius: 6px; 
        font-size: 14px; 
        overflow-x: auto; 
        margin: 15px 0;
        border: none;
      }
      code { 
        font-family: 'Monaco', 'Courier New', monospace; 
        background-color: rgba(39,40,34,0.08); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #a6e22e; 
        font-size: 0.9em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #f8f8f2;
        font-size: 13px;
        line-height: 1.5;
      }
    `,
    highlightPre: (content, font) => 
      `<pre class="hljs" style="background: #272822; padding: 16px; border-radius: 6px; overflow-x: auto;"><code style="font-family: ${font}; font-size: 13px; line-height: 1.5; color: #f8f8f2;">${content}</code></pre>`,
  },

  nord: {
    name: 'Nord',
    generate: (font, size) => `
      pre { 
        background-color: #2e3440; 
        padding: 16px; 
        border-radius: 8px; 
        font-size: 14px; 
        overflow-x: auto; 
        margin: 15px 0;
        border: 1px solid #3b4252;
      }
      code { 
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace; 
        background-color: rgba(46,52,64,0.08); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #88c0d0; 
        font-size: 0.9em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #d8dee9;
        font-size: 13px;
        line-height: 1.5;
      }
    `,
    highlightPre: (content, font) => 
      `<pre class="hljs" style="background: #2e3440; padding: 16px; border-radius: 8px; overflow-x: auto; border: 1px solid #3b4252;"><code style="font-family: ${font}; font-size: 13px; line-height: 1.5; color: #d8dee9;">${content}</code></pre>`,
  },

  notion: {
    name: 'Notion 风格',
    generate: (font, size) => `
      pre { 
        background-color: #f7f6f3; 
        padding: 16px; 
        border-radius: 4px; 
        font-size: 14px; 
        overflow-x: auto; 
        margin: 15px 0;
        border: 1px solid rgba(55, 53, 47, 0.16);
        color: #37352f;
      }
      code { 
        font-family: 'SFMono-Regular', Menlo, Consolas, 'PT Mono', monospace; 
        background-color: rgba(135,131,120,0.15); 
        padding: 2px 6px; 
        border-radius: 3px; 
        color: #eb5757;
        font-size: 0.85em;
      }
      pre code { 
        background-color: transparent; 
        padding: 0; 
        color: #37352f;
        font-size: 14px;
        line-height: 1.5;
      }
    `,
    highlightPre: (content, font) => 
      `<pre class="hljs" style="background: #f7f6f3; padding: 16px; border-radius: 4px; overflow-x: auto; border: 1px solid rgba(55, 53, 47, 0.16); color: #37352f;"><code style="font-family: ${font}; font-size: 14px; line-height: 1.5; color: #37352f;">${content}</code></pre>`,
  },
}

export const codeBlockStyleKeys = Object.keys(codeBlockStyles)
