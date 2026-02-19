/**
 * 主题颜色配置
 * primary: 主要颜色
 * secondary: 次要颜色（通常用于背景等）
 */
export const themes = {
  orange: {
    name: '焕能橙',
    primary: '#f97316',
    secondary: 'rgba(255, 107, 107, 0.1)',
  },
  purple: {
    name: '编程紫',
    primary: '#674AF6',
    secondary: 'rgba(103, 74, 246, 0.1)',
  },
  green: {
    name: '微信绿',
    primary: '#07c160',
    secondary: 'rgba(7, 193, 96, 0.1)',
  },
  blue: {
    name: '源码蓝',
    primary: '#0366d6',
    secondary: 'rgba(3, 102, 214, 0.1)',
  },
  cyan: {
    name: '极光青',
    primary: '#00bcd4',
    secondary: 'rgba(0, 188, 212, 0.1)',
  },
  pink: {
    name: '樱花粉',
    primary: '#CF6C88',
    secondary: 'rgba(207, 57, 100, 0.1)',
  },
  gold: {
    name: '构建金',
    primary: '#ff9800',
    secondary: 'rgba(255, 152, 0, 0.1)',
  },
  dark: {
    name: '深邃黑',
    primary: '#333333',
    secondary: 'rgba(51, 51, 51, 0.1)',
  },
}

export const themeKeys = Object.keys(themes)
