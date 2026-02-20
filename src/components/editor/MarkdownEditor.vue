<script setup lang="ts">
import { computed, ref, onUnmounted, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { languages } from '@codemirror/language-data';
import { useEditorState } from '../../composables/useEditorState';
import type { EditorView } from '@codemirror/view';

const { input, isDark } = useEditorState();

const editorRef = ref<InstanceType<typeof Codemirror> | null>(null);
const editorView = ref<EditorView | null>(null);
const editorScrollContainer = ref<HTMLElement | null>(null);

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

// 处理编辑器准备就绪
const handleReady = (payload: { view: EditorView }) => {
  editorView.value = payload.view;
  // 获取 CodeMirror 的滚动容器
  const scroller = payload.view.scrollDOM;
  if (scroller) {
    editorScrollContainer.value = scroller;
    // 绑定滚动事件
    scroller.addEventListener('scroll', handleEditorScroll);
  }
};

// 滚动同步相关
const isSyncing = ref(false);
const scrollRatio = ref(0);

// 监听编辑器滚动
const handleEditorScroll = () => {
  if (isSyncing.value || !editorScrollContainer.value) return;
  
  const container = editorScrollContainer.value;
  const maxScroll = container.scrollHeight - container.clientHeight;
  if (maxScroll > 0) {
    scrollRatio.value = container.scrollTop / maxScroll;
  }
};

// 监听滚动比例变化
watch(scrollRatio, () => {
  // 触发自定义事件，通知父组件
  window.dispatchEvent(new CustomEvent('editor-scroll', { detail: scrollRatio.value }));
});

onUnmounted(() => {
  if (editorScrollContainer.value) {
    editorScrollContainer.value.removeEventListener('scroll', handleEditorScroll);
  }
});

// 暴露属性给父组件
defineExpose({
  editorScrollContainer,
  scrollRatio
});
</script>

<template>
  <div class="flex flex-col h-full border-r border-gray-300 dark:border-gray-700">
    <div class="bg-gray-200 dark:bg-gray-800 px-4 py-2 text-sm text-gray-500 font-medium">
      MARKDOWN 编辑区
    </div>
    <div class="flex-1 overflow-hidden">
        <Codemirror
        ref="editorRef"
        v-model="input"
        placeholder="在此输入 Markdown 内容..."
        :style="editorStyle"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        @ready="handleReady"
        />
    </div>
  </div>
</template>
