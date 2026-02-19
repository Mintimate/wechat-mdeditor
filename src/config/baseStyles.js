/**
 * 基础样式配置
 * 包含段落、列表、引用、表格等基础元素样式
 */

/**
 * 生成基础样式
 * @param {Object} options - 配置选项
 * @param {string} options.font - 字体
 * @param {number} options.size - 基础字号
 * @param {string} options.primary - 主题主色
 * @param {string} options.secondary - 主题次要色
 */
export const generateBaseStyles = ({ font, size, primary, secondary }) => {
  const tableStyle = `
    table { border-collapse: collapse; margin: 10px 0; width: 100%; display: table; font-size: 14px; }
    th { background-color: #f2f2f2; font-weight: bold; border: 1px solid #ddd; padding: 8px; text-align: left; min-width: 60px; }
    td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    tr:nth-child(even) { background-color: #f9f9f9; }
  `

  const listStyle = `
    ul { margin: 0; padding: 0 0 0 21px; list-style: none; }
    ol { margin: 0; padding: 0 0 0 21px; list-style: none; }
    li { font-family: ${font}; font-size: ${size}px; color: #3f3f3f; line-height: 1.75; margin: 7px 8px; display: block; }
    li p { display: inline; margin: 0; padding: 0; }
    ul ul, ol ol, ul ol, ol ul { margin: 0; padding-left: 21px; }
  `

  return `
    p { font-family: ${font}; font-size: ${size}px; line-height: 1.75; margin: 1.5em 8px; color: #3f3f3f; letter-spacing: 0.1em; }
    ${listStyle}
    blockquote { font-family: ${font}; border-left: 4px solid #ddd; padding-left: 15px; color: #666; font-size: ${size - 1}px; margin: 0 0 15px 0; background-color: #f8f8f8; padding: 10px; }
    strong { font-weight: bold; color: ${primary}; }
    em { font-style: italic; color: #666; }
    del { color: #999; }
    ins { text-decoration: underline; }
    mark { background-color: ${secondary}; color: inherit; padding: 2px 4px; border-radius: 2px; }
    sub { vertical-align: sub; font-size: smaller; }
    sup { vertical-align: super; font-size: smaller; }
    hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
    img { max-width: 100%; height: auto; display: block; margin: 0.5em auto; border-radius: 8px; border: 1px solid rgba(0,0,0,0.04); }
    sup.ref-mark { font-size: 12px; color: #888; vertical-align: super; margin-left: 4px; }
    .ref-links { margin-top: 18px; border-top: 1px solid #eee; padding-top: 10px; padding-left: 0; list-style: none; }
    .ref-links li { font-size: 13px; color: #666; margin: 6px 0; word-break: break-all; }
    ${tableStyle}
  `
}
