/**
 * 主题颜色配置
 * 
 * 颜色层级命名规范：
 * - primary: 主要强调色（最深，用于粗体、重点强调等需要突出显示的场景）
 * - tertiary: 三级色（中等深度，用于链接引用等柔和强调，保持足够对比度）
 * - secondary: 次要色（最浅，半透明背景色，用于高亮标记等背景场景）
 */
export const themes = {
  orange: {
    name: '焕能橙',
    primary: '#f97316',
    tertiary: '#ea7c4d',  // 柔和橙，比 primary 浅约 20%
    secondary: 'rgba(249, 115, 22, 0.1)',
  },
  purple: {
    name: '编程紫',
    primary: '#674AF6',
    tertiary: '#8b7bf7',  // 柔和紫
    secondary: 'rgba(103, 74, 246, 0.1)',
  },
  green: {
    name: '微信绿',
    primary: '#07c160',
    tertiary: '#4cd382',  // 柔和绿
    secondary: 'rgba(7, 193, 96, 0.1)',
  },
  blue: {
    name: '源码蓝',
    primary: '#0366d6',
    tertiary: '#5a8fd6',  // 柔和蓝
    secondary: 'rgba(3, 102, 214, 0.1)',
  },
  cyan: {
    name: '极光青',
    primary: '#00bcd4',
    tertiary: '#4dd0e1',  // 柔和青
    secondary: 'rgba(0, 188, 212, 0.1)',
  },
  pink: {
    name: '樱花粉',
    primary: '#CF6C88',
    tertiary: '#db9aab',  // 柔和粉
    secondary: 'rgba(207, 108, 136, 0.1)',
  },
  gold: {
    name: '构建金',
    primary: '#ff9800',
    tertiary: '#ffb74d',  // 柔和金
    secondary: 'rgba(255, 152, 0, 0.1)',
  },
  dark: {
    name: '深邃黑',
    primary: '#333333',
    tertiary: '#666666',  // 柔和灰
    secondary: 'rgba(51, 51, 51, 0.1)',
  },
}

export const themeKeys = Object.keys(themes)
