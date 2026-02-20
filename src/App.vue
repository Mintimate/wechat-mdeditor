<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import MarkdownEditor from './components/editor/MarkdownEditor.vue'
import AppHeader from './components/layout/AppHeader.vue'
import WeChatPreview from './components/preview/WeChatPreview.vue'
import NotificationToast from './components/ui/NotificationToast.vue'

const editorRef = ref(null)
const previewRef = ref(null)

const isSyncing = ref(false)
const syncScrollEnabled = ref(true)

// 处理编辑器滚动事件
const handleEditorScroll = (e) => {
  if (!syncScrollEnabled.value || isSyncing.value || !previewRef.value?.previewScrollContainer) return;
  
  isSyncing.value = true;
  const ratio = e.detail
  const container = previewRef.value.previewScrollContainer
  const maxScroll = container.scrollHeight - container.clientHeight
  
  if (maxScroll > 0) {
    container.scrollTop = ratio * maxScroll
  }
  
  setTimeout(() => { isSyncing.value = false }, 50)
}

// 处理预览区滚动事件
const handlePreviewScroll = () => {
  if (!syncScrollEnabled.value || isSyncing.value || !previewRef.value?.previewScrollContainer || !editorRef.value?.editorScrollContainer) return
  
  const previewContainer = previewRef.value.previewScrollContainer
  const editorContainer = editorRef.value.editorScrollContainer
  
  const maxPreviewScroll = previewContainer.scrollHeight - previewContainer.clientHeight
  const maxEditorScroll = editorContainer.scrollHeight - editorContainer.clientHeight
  
  if (maxPreviewScroll > 0 && maxEditorScroll > 0) {
    isSyncing.value = true
    const ratio = previewContainer.scrollTop / maxPreviewScroll
    editorContainer.scrollTop = ratio * maxEditorScroll
    setTimeout(() => { isSyncing.value = false }, 50)
  }
}

const handleCopy = () => {
    if (previewRef.value && previewRef.value.copyToClipboard) {
        previewRef.value.copyToClipboard()
    }
}

onMounted(() => {
  window.addEventListener('editor-scroll', handleEditorScroll)
  
  // 延迟绑定预览区滚动事件
  setTimeout(() => {
    if (previewRef.value?.previewScrollContainer) {
      previewRef.value.previewScrollContainer.addEventListener('scroll', handlePreviewScroll)
    }
  }, 200)
})

onUnmounted(() => {
  window.removeEventListener('editor-scroll', handleEditorScroll)
  if (previewRef.value?.previewScrollContainer) {
    previewRef.value.previewScrollContainer.removeEventListener('scroll', handlePreviewScroll)
  }
})
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
    <AppHeader @copy="handleCopy" />
    <main class="flex-1 flex overflow-hidden relative">
      <div class="w-1/2 h-full">
        <MarkdownEditor ref="editorRef" />
      </div>
      <!-- 同步滚动开关 -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <button
          @click="syncScrollEnabled = !syncScrollEnabled"
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200',
            syncScrollEnabled 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
          ]"
          :title="syncScrollEnabled ? '关闭同步滚动' : '开启同步滚动'"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="syncScrollEnabled" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" stroke-linecap="round" stroke-linejoin="round"/>
            <path v-else d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="w-1/2 h-full">
        <WeChatPreview ref="previewRef" />
      </div>
    </main>
    <NotificationToast />
  </div>
</template>

<style>
/* 可以在这里添加编辑器自身的 UI 样式，不会影响生成的微信内容 */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
