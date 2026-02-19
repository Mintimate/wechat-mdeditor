import { ref, watch, onMounted, computed } from 'vue'
import { 
  themes, themeKeys, 
  fonts, fontKeys, 
  codeBlockStyles, codeBlockStyleKeys,
  headingStyles, headingStyleKeys,
  generateBaseStyles 
} from '../config'
import { defaultDemo } from '../demos'

const STORAGE_KEY_CONTENT = 'wechat-md-content'
const STORAGE_KEY_AUTOSAVE = 'wechat-md-autosave'

const input = ref(defaultDemo)

const currentTheme = ref('orange')
const currentFont = ref('sans')
const currentSize = ref(16)
const codeBlockStyle = ref('default')
const headingStyle = ref('classic')
const autoSave = ref(true)
const imageCaptionMode = ref('title-priority')

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
    headingStyle,
    autoSave,
    imageCaptionMode,
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
export { themes, themeKeys, fonts, fontKeys, codeBlockStyles, codeBlockStyleKeys, headingStyles, headingStyleKeys }
