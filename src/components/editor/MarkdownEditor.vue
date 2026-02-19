<script setup lang="ts">
import { computed } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { languages } from '@codemirror/language-data';
import { useEditorState } from '../../composables/useEditorState';

const { input, isDark } = useEditorState();

// 动态扩展配置
const extensions = computed(() => {
  const ext = [markdown({ codeLanguages: languages })];
  if (isDark.value) {
    ext.push(oneDark);
  }
  return ext;
});

// 编辑器样式
const editorStyle = computed(() => ({
  height: '100%',
  fontSize: '14px',
  backgroundColor: isDark.value ? '#1e1e1e' : '#ffffff',
  color: isDark.value ? '#d4d4d4' : '#1f2937',
}));
</script>

<template>
  <div class="flex flex-col h-full border-r border-gray-300 dark:border-gray-700">
    <div class="bg-gray-200 dark:bg-gray-800 px-4 py-2 text-sm text-gray-500 font-medium">
      MARKDOWN 编辑区
    </div>
    <div class="flex-1 overflow-hidden">
        <Codemirror
        v-model="input"
        placeholder="在此输入 Markdown 内容..."
        :style="editorStyle"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        />
    </div>
  </div>
</template>
