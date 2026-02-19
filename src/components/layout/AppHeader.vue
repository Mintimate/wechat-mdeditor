<script setup lang="ts">
import { ref } from 'vue';
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

// 移动端菜单状态
const menuOpen = ref(false);

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

// 字号描述映射
const getSizeLabel = (size: number): string => {
  const labels: Record<number, string> = {
    14: '较小',
    15: '偏小',
    16: '适中',
    17: '还行',
    18: '偏大',
    19: '较大ヽ(???)メ',
    20: '好大(°△°|||)'
  };
  return labels[size] || '适中';
};

// 暗色模式选项
const darkModeOptions = [
  { value: 'light', label: '亮色' },
  { value: 'system', label: '系统' },
  { value: 'dark', label: '暗色' }
] as const;
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 py-3 shadow-sm transition-all duration-300">
    <div class="flex justify-between items-center gap-4">
      <!-- Logo -->
      <div class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 tracking-tight shrink-0">
        <img src="/favicon.png" alt="Logo" class="w-10 h-10">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">WeChat</span> Markdown
      </div>

      <!-- 桌面端工具栏 -->
      <div class="hidden lg:flex items-center gap-3 flex-wrap">
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

        <!-- 字号控制 -->
        <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1 group relative">
          <label class="text-xs text-gray-500 font-medium">字号</label>
          <input type="range" v-model.number="currentSize" min="14" max="20" step="1" class="w-16 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-orange-500">
          <!-- 自定义 Tooltip -->
          <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50">
            {{ getSizeLabel(currentSize) }}
            <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 dark:bg-gray-200 rotate-45"></div>
          </div>
          <span class="text-xs text-gray-600 dark:text-gray-300 font-medium min-w-[2.5rem]">{{ currentSize }}px</span>
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
          class="relative group bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white px-5 py-2 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 font-medium text-sm ml-2 overflow-hidden"
        >
          <span class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          <svg class="w-4 h-4 relative z-10 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span class="relative z-10">复制</span>
        </button>
      </div>

      <!-- 移动端：复制按钮 + 汉堡菜单 -->
      <div class="flex lg:hidden items-center gap-2">
        <button 
          @click="handleCopy"
          class="relative group bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 active:scale-95 flex items-center gap-2 font-medium text-sm overflow-hidden"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>复制</span>
        </button>

        <!-- 汉堡菜单按钮 -->
        <button 
          @click="menuOpen = !menuOpen"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-orange-100 dark:bg-orange-900/30': menuOpen }"
        >
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-300 transition-transform duration-300" :class="{ 'rotate-90': menuOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line v-if="!menuOpen" x1="3" y1="6" x2="21" y2="6"/>
            <line v-if="!menuOpen" x1="3" y1="12" x2="21" y2="12"/>
            <line v-if="!menuOpen" x1="3" y1="18" x2="21" y2="18"/>
            <line v-if="menuOpen" x1="6" y1="6" x2="18" y2="18"/>
            <line v-if="menuOpen" x1="6" y1="18" x2="18" y2="6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="menuOpen" class="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-2 gap-3">
          <!-- 主题 -->
          <div class="flex flex-col gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <label class="text-xs text-gray-500 font-medium">主题</label>
            <select v-model="currentTheme" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 dark:text-gray-200">
              <option v-for="opt in themeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>

          <!-- 字体 -->
          <div class="flex flex-col gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <label class="text-xs text-gray-500 font-medium">字体</label>
            <select v-model="currentFont" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 dark:text-gray-200">
              <option v-for="opt in fontOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>

          <!-- 代码样式 -->
          <div class="flex flex-col gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <label class="text-xs text-gray-500 font-medium">代码</label>
            <select v-model="codeBlockStyle" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 dark:text-gray-200">
              <option v-for="opt in codeBlockOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>

          <!-- 标题样式 -->
          <div class="flex flex-col gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <label class="text-xs text-gray-500 font-medium">标题</label>
            <select v-model="headingStyle" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 dark:text-gray-200">
              <option v-for="opt in headingOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>

          <!-- 图片说明 -->
          <div class="flex flex-col gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 col-span-2">
            <label class="text-xs text-gray-500 font-medium">图片说明</label>
            <select v-model="imageCaptionMode" class="bg-transparent border-none text-gray-700 text-sm focus:ring-0 cursor-pointer py-1 dark:text-gray-200">
              <option value="title-priority">title 优先</option>
              <option value="alt-priority">alt 优先</option>
              <option value="only-title">只显示 title</option>
              <option value="only-alt">只显示 alt</option>
              <option value="none">不显示</option>
            </select>
          </div>

          <!-- 字号控制 -->
          <div class="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 col-span-2">
            <div class="flex justify-between items-center">
              <label class="text-xs text-gray-500 font-medium">字号</label>
              <span class="text-sm text-gray-600 dark:text-gray-300 font-medium">{{ currentSize }}px - {{ getSizeLabel(currentSize) }}</span>
            </div>
            <input type="range" v-model.number="currentSize" min="14" max="20" step="1" class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-orange-500">
          </div>
        </div>

        <!-- 底部选项 -->
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <!-- 自动保存 -->
          <div class="flex items-center gap-2 cursor-pointer select-none" @click="autoSave = !autoSave">
            <div class="relative w-10 h-5 transition-colors duration-200 ease-in-out rounded-full" :class="autoSave ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'">
              <div class="absolute w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full top-0.5 left-0.5" :class="autoSave ? 'translate-x-5' : 'translate-x-0'"></div>
            </div>
            <label class="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">自动保存</label>
          </div>

          <!-- 暗色模式切换 -->
          <div class="relative flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors">
            <div 
              class="absolute top-1 w-7 h-7 bg-white dark:bg-gray-600 rounded-full shadow-md transition-transform duration-300 ease-in-out"
              :style="{ transform: `translateX(${darkMode === 'light' ? '0' : darkMode === 'system' ? '28px' : '56px'})` }"
            ></div>
            <button 
              v-for="opt in darkModeOptions" 
              :key="opt.value"
              @click="darkMode = opt.value"
              class="relative z-10 w-7 h-7 flex items-center justify-center transition-colors duration-200 rounded-full"
              :class="darkMode === opt.value ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
              :title="opt.label"
            >
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
              <svg v-else-if="opt.value === 'system'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
