<script setup lang="ts">
import { useEditorState, themes, fonts, codeBlockStyles, headingStyles } from '../../composables/useEditorState';

const { 
  currentTheme,
  currentFont,
  currentSize,
  codeBlockStyle,
  headingStyle,
  imageCaptionMode,
  autoSave
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
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center gap-4 shadow-sm transition-all duration-300">
    <h1 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 tracking-tight">
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

      <button 
        @click="handleCopy"
        class="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-1.5 rounded-full shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 font-medium text-sm ml-2"
      >
        <span>✨</span> 复制
      </button>
    </div>
  </header>
</template>
