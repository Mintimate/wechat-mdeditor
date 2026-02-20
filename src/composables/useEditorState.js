import { computed, onMounted, ref, watch } from 'vue'
import {
    codeBlockStyleKeys,
    codeBlockStyles,
    fontKeys,
    fonts,
    generateBaseStyles,
    headingStyleKeys,
    headingStyles,
    themeKeys,
    themes
} from '../config'
import { defaultDemo } from '../presets'

const STORAGE_KEY_CONTENT = 'wechat-md-content'
const STORAGE_KEY_AUTOSAVE = 'wechat-md-autosave'
const STORAGE_KEY_DARK_MODE = 'wechat-md-dark-mode'

const input = ref(defaultDemo)

const currentTheme = ref('orange')
const currentFont = ref('sans')
const currentSize = ref(16)
const codeBlockStyle = ref('default')
const headingStyle = ref('classic')
const autoSave = ref(true)
const imageCaptionMode = ref('title-priority')

// 暗色模式状态: 'light' | 'system' | 'dark'
const darkMode = ref('system')

// 系统偏好（用于响应式跟踪）
const systemPrefersDark = ref(false)

// 计算当前是否为暗色模式
const isDark = computed(() => {
  if (darkMode.value === 'dark') return true
  if (darkMode.value === 'light') return false
  return systemPrefersDark.value
})

// 应用暗色模式
const applyDarkMode = () => {
  systemPrefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// 监听系统主题变化
let mediaQueryListener = null
const setupSystemListener = () => {
  if (mediaQueryListener) {
    mediaQueryListener.removeEventListener('change', applyDarkMode)
  }
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQueryListener = mediaQuery
  mediaQuery.addEventListener('change', applyDarkMode)
}

export function useEditorState() {
  const wechatStyle = computed(() => {
    const theme = themes[currentTheme.value]
    const font = fonts[currentFont.value].value
    const size = currentSize.value

    // 获取代码块样式
    const codeStyleConfig = codeBlockStyles[codeBlockStyle.value]
    const codeStyle = codeStyleConfig ? codeStyleConfig.generate(font, size) : ''

    // 获取标题样式
    const headingStyleConfig = headingStyles[headingStyle.value]
    const headingStyleCss = headingStyleConfig ? headingStyleConfig.generate(theme.primary, font, size) : ''

    // 基础样式
    const baseStyle = generateBaseStyles({ font, size, primary: theme.primary, secondary: theme.secondary })

    return `
    ${headingStyleCss}
    ${baseStyle}
    ${codeStyle}
    `
  })

  // 导出配置供其他模块使用
  const themeColors = computed(() => themes)
  const fontFamilies = computed(() => {
    const result = {}
    for (const [key, config] of Object.entries(fonts)) {
      result[key] = config.value
    }
    return result
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

  // 监听暗色模式变化
  watch(darkMode, (newVal) => {
    localStorage.setItem(STORAGE_KEY_DARK_MODE, newVal)
    applyDarkMode()
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

    // 初始化暗色模式
    const savedDarkMode = localStorage.getItem(STORAGE_KEY_DARK_MODE)
    if (savedDarkMode && ['light', 'system', 'dark'].includes(savedDarkMode)) {
      darkMode.value = savedDarkMode
    }
    setupSystemListener()
    applyDarkMode()
  })

  return {
    input,
    currentTheme,
    currentFont,
    currentSize,
    codeBlockStyle,
    headingStyle,
    autoSave,
    imageCaptionMode,
    darkMode,
    isDark,
    wechatStyle,
    // 配置导出
    themeColors,
    fontFamilies,
    themeKeys,
    fontKeys,
    codeBlockStyleKeys,
    headingStyleKeys,
  }
}

// 导出配置供其他模块直接访问
export { codeBlockStyleKeys, codeBlockStyles, fontKeys, fonts, headingStyleKeys, headingStyles, themeKeys, themes }
