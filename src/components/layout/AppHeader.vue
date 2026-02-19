<script setup lang="ts">
import { useEditorState, themes, fonts, codeBlockStyles, headingStyles } from '../../composables/useEditorState';

const { 
  currentTheme,
  currentFont,
  currentSize,
  codeBlockStyle,
  headingStyle,
  imageCaptionMode,
  autoSave,
  darkMode
} = useEditorState();

const emit = defineEmits<{
  (e: 'copy'): void
}>();

const handleCopy = () => {
  emit('copy');
};

// 动态生成选项
const themeOptions = Object.entries(themes).map(([key, config]) => ({
  value: key,
  label: config.name
}));

const fontOptions = Object.entries(fonts).map(([key, config]) => ({
  value: key,
  label: config.name
}));

const codeBlockOptions = Object.entries(codeBlockStyles).map(([key, config]) => ({
  value: key,
  label: config.name
}));

const headingOptions = Object.entries(headingStyles).map(([key, config]) => ({
  value: key,
  label: config.name
}));

// 暗色模式选项
const darkModeOptions = [
  { value: 'light', label: '亮色' },
  { value: 'system', label: '系统' },
  { value: 'dark', label: '暗色' }
] as const;
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center gap-4 shadow-sm transition-all duration-300">
    <h1 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 tracking-tight">
      <img src="/favicon.png" alt="Logo" class="w-6 h-6">
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">WeChat</span> Markdown
    </h1>

    <div class="flex items-center gap-3 flex-wrap">
      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
        <label class="text-xs text-gray-500 font-medium">主题</label>
        <select v-model="currentTheme" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 pr-8 pl-1 dark:text-gray-200 hover:text-orange-500 transition-colors">
          <option v-for="opt in themeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
        <label class="text-xs text-gray-500 font-medium">字体</label>
        <select v-model="currentFont" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 pr-8 pl-1 dark:text-gray-200 hover:text-orange-500 transition-colors">
          <option v-for="opt in fontOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5">
        <label class="text-xs text-gray-500 font-medium">字号</label>
        <input type="range" v-model.number="currentSize" min="14" max="20" step="1" class="w-20 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-orange-500">
        <span class="text-xs text-gray-500 w-8 text-right">{{ currentSize }}px</span>
      </div>

      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
        <label class="text-xs text-gray-500 font-medium">代码</label>
        <select v-model="codeBlockStyle" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 pr-8 pl-1 dark:text-gray-200 hover:text-orange-500 transition-colors">
          <option v-for="opt in codeBlockOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
        <label class="text-xs text-gray-500 font-medium">标题</label>
        <select v-model="headingStyle" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 pr-8 pl-1 dark:text-gray-200 hover:text-orange-500 transition-colors">
          <option v-for="opt in headingOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
        <label class="text-xs text-gray-500 font-medium">图片</label>
        <select v-model="imageCaptionMode" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 pr-8 pl-1 dark:text-gray-200 hover:text-orange-500 transition-colors">
          <option value="title-priority">title 优先</option>
          <option value="alt-priority">alt 优先</option>
          <option value="only-title">只显示 title</option>
          <option value="only-alt">只显示 alt</option>
          <option value="none">不显示</option>
        </select>
      </div>

      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 cursor-pointer select-none group" @click="autoSave = !autoSave">
        <div class="relative w-8 h-4 transition-colors duration-200 ease-in-out rounded-full" :class="autoSave ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'">
          <div class="absolute w-3 h-3 transition-transform duration-200 ease-in-out transform bg-white rounded-full top-0.5 left-0.5" :class="autoSave ? 'translate-x-4' : 'translate-x-0'"></div>
        </div>
        <label class="text-xs text-gray-500 font-medium cursor-pointer group-hover:text-orange-500 transition-colors">自动保存</label>
      </div>

      <!-- 三段式暗色模式切换器 -->
      <div class="relative flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors">
        <!-- 滑块背景 -->
        <div 
          class="absolute top-1 w-7 h-7 bg-white dark:bg-gray-600 rounded-full shadow-md transition-transform duration-300 ease-in-out"
          :style="{ transform: `translateX(${darkMode === 'light' ? '0' : darkMode === 'system' ? '28px' : '56px'})` }"
        ></div>
        <!-- 三个按钮 -->
        <button 
          v-for="opt in darkModeOptions" 
          :key="opt.value"
          @click="darkMode = opt.value"
          class="relative z-10 w-7 h-7 flex items-center justify-center transition-colors duration-200 rounded-full"
          :class="darkMode === opt.value ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
          :title="opt.label"
        >
          <!-- 太阳图标 - 亮色模式 -->
          <svg v-if="opt.value === 'light'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- 系统/电脑图标 - 跟随系统 -->
          <svg v-else-if="opt.value === 'system'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <!-- 月亮图标 - 暗色模式 -->
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>

      <button 
        @click="handleCopy"
        class="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-1.5 rounded-full shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 font-medium text-sm ml-2"
      >
        <span>✨</span> 复制
      </button>
    </div>
  </header>
</template>
