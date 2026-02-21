/**
 * 基础样式配置
 * 包含段落、列表、引用、表格等基础元素样式
 */

/**
 * 生成格子背景样式
 * @param {string} gridColor - 格子基础色
 * @param {string} gridAccent - 格子强调色
 * @returns {string} 格子背景 CSS
 */
export const generateGridBackground = (gridColor = 'rgba(200, 195, 195, 0.3)', gridAccent = 'rgba(180, 176, 176, 0.2)') => {
  // 使用 linear-gradient 创建格子图案
  // 两个方向的渐变叠加形成网格效果
  return `
    background-image:
      linear-gradient(
        0deg,
        transparent 24%,
        ${gridColor} 25%,
        ${gridAccent} 26%,
        transparent 27%,
        transparent 74%,
        ${gridColor} 75%,
        ${gridAccent} 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        ${gridColor} 25%,
        ${gridAccent} 26%,
        transparent 27%,
        transparent 74%,
        ${gridColor} 75%,
        ${gridAccent} 76%,
        transparent 77%,
        transparent
      );
    background-size: 50px 50px;
  `
}

/**
 * 生成基础样式
 * @param {Object} options - 配置选项
 * @param {string} options.font - 字体
 * @param {number} options.size - 基础字号
 * @param {string} options.primary - 主要强调色（用于粗体等强强调）
 * @param {string} options.tertiary - 三级色（用于链接引用等柔和强调）
 * @param {string} options.secondary - 次要色（用于背景高亮）
 * @param {string} options.gridColor - 格子背景基础色（可选）
 * @param {string} options.gridAccent - 格子背景强调色（可选）
 * @param {string} options.lightColor - 浅色背景色（可选）
 */
export const generateBaseStyles = ({ font, size, primary, tertiary, secondary, gridColor, gridAccent, lightColor }) => {
  const tableStyle = `
    table { border-collapse: collapse; margin: 0; width: 100%; display: table; font-size: 14px; min-width: max-content; }
    th { background-color: #f2f2f2; font-weight: bold; border: 1px solid #ddd; padding: 8px; text-align: left; min-width: 60px; white-space: nowrap; }
    td { border: 1px solid #ddd; padding: 8px; text-align: left; white-space: nowrap; }
    tr:nth-child(even) { background-color: #f9f9f9; }
  `

  const listStyle = `
    ul { margin: 0; padding: 0 0 0 12px; list-style: none; }
    ol { margin: 0; padding: 0 0 0 12px; list-style: none; }
    li { font-family: ${font}; font-size: ${size}px; color: #3f3f3f; line-height: 1.75; margin: 7px 8px; display: block; }
    li p { display: inline; margin: 0; padding: 0; }
    ul ul, ol ol, ul ol, ol ul { margin: 0; padding-left: 21px; }
  `

  // 引用块样式，支持主题色
  const blockquoteBg = lightColor || '#f8f8f8'
  const blockquoteStyle = `
    blockquote {
      font-family: ${font};
      border-left: 4px solid ${primary};
      padding: 10px 15px;
      color: #666;
      font-size: ${size - 1}px;
      margin: 0 0 15px 0;
      background-color: ${blockquoteBg};
      border-radius: 0 4px 4px 0;
    }
  `

  return `
    p { font-family: ${font}; font-size: ${size}px; line-height: 1.75; margin: 1.5em 8px; color: #3f3f3f; letter-spacing: 0.1em; }
    ${listStyle}
    ${blockquoteStyle}
    strong { font-weight: bold; color: ${primary}; }
    em { font-style: italic; color: #666; }
    del { color: #999; }
    ins { text-decoration: underline; }
    mark { background-color: ${secondary}; color: inherit; padding: 2px 4px; border-radius: 2px; }
    sub { vertical-align: sub; font-size: smaller; }
    sup { vertical-align: super; font-size: smaller; }
    hr { border: none; border-top: 1px solid ${primary}40; margin: 20px 0; }
    img { max-width: 100%; height: auto; display: block; margin: 0.5em auto; border-radius: 8px; border: 1px solid rgba(0,0,0,0.04); }
    sup.ref-mark { font-size: 10px; color: ${tertiary}; vertical-align: super; margin-left: 4px; }
    .ref-links { margin-top: 18px; border-top: 1px solid #eee; padding-top: 10px; padding-left: 0; list-style: none; }
    .ref-links li { font-size: 12px; color: #666; margin: 6px 0; word-break: break-all; line-height: 1.6; }
    .ref-links li span { font-size: 12px; }
    .ref-text { color: ${tertiary}; }
    ${tableStyle}
  `
}
