<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/layout/AppHeader.vue';
import MarkdownEditor from './components/editor/MarkdownEditor.vue';
import WeChatPreview from './components/preview/WeChatPreview.vue';
import NotificationToast from './components/ui/NotificationToast.vue';

const previewRef = ref<InstanceType<typeof WeChatPreview> | null>(null);

const handleCopy = () => {
    if (previewRef.value && previewRef.value.copyToClipboard) {
        previewRef.value.copyToClipboard();
    }
};
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
    <AppHeader @copy="handleCopy" />
    <main class="flex-1 flex overflow-hidden">
      <div class="w-1/2 h-full">
        <MarkdownEditor />
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
