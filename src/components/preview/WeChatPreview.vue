<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useEditorState } from '../../composables/useEditorState';
import { useMarkdownRenderer } from '../../composables/useMarkdownRenderer';

const { 
  input, 
  currentTheme, 
  currentFont, 
  currentSize, 
  codeBlockStyle, 
  headingStyle,
  imageCaptionMode, 
  wechatStyle
} = useEditorState();

const { outputHtml, previewContainer, render } = useMarkdownRenderer();

// Watch for changes and re-render
watch([input, currentTheme, currentFont, currentSize, codeBlockStyle, headingStyle, imageCaptionMode], () => {
    render({
        input: input.value,
        codeBlockStyle: codeBlockStyle.value,
        imageCaptionMode: imageCaptionMode.value,
        currentFont: currentFont.value,
        wechatStyle: wechatStyle.value
    });
});

onMounted(() => {
    // Initial Render
    render({
        input: input.value,
        codeBlockStyle: codeBlockStyle.value,
        imageCaptionMode: imageCaptionMode.value,
        currentFont: currentFont.value,
        wechatStyle: wechatStyle.value
    });
});

// Expose functionality for parent (Copy)
const copyToClipboard = async () => {
  if (!previewContainer.value) return;
  
  try {
    // 获取渲染后的 HTML 内容
    const htmlContent = outputHtml.value;
    
    // 使用 Clipboard API 写入 HTML 格式
    // 微信公众号需要 HTML 格式，而不是纯文本
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([htmlContent], { type: 'text/html' }),
      'text/plain': new Blob([htmlContent], { type: 'text/plain' })
    });
    
    await navigator.clipboard.write([clipboardItem]);
    alert('已复制到剪贴板！请直接在微信公众号编辑器中粘贴 (Ctrl+V)');
  } catch (err) {
    console.error('复制失败', err);
    // 降级方案：使用 execCommand
    try {
      const range = document.createRange();
      range.selectNode(previewContainer.value);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        
        document.execCommand('copy');
        selection.removeAllRanges();
        
        alert('已复制到剪贴板！请直接在微信公众号编辑器中粘贴 (Ctrl+V)');
      }
    } catch (e) {
      alert('复制失败，请尝试手动全选复制');
    }
  }
};

defineExpose({
    copyToClipboard
});

</script>

<template>
  <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
     <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-500 font-medium flex justify-between items-center shadow-sm z-10">
       <span class="flex items-center gap-2">
         <span class="w-2 h-2 rounded-full bg-green-500"></span>
         微信公众号预览
       </span>
       <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-400">支持 Mermaid, 样式已内联</span>
     </div>
     
     <!-- Phone Simulator Container -->
     <div class="flex-1 overflow-y-auto p-8 relative flex justify-center bg-gray-100/50 dark:bg-black/20">
       
       <!-- Phone Frame -->
       <div class="relative w-[375px] h-[812px] bg-white dark:bg-gray-800 rounded-[50px] shadow-[0_0_0_12px_#1f2937] border-[8px] border-gray-900 dark:border-gray-700 overflow-hidden shrink-0 ring-1 ring-white/20">
          
          <!-- Dynamic Island / Status Bar Area -->
          <div class="absolute top-0 left-0 right-0 h-12 bg-white dark:bg-gray-800 z-20 flex justify-between items-center px-8 pt-2 select-none pointer-events-none">
            <!-- Time -->
            <span class="text-sm font-semibold text-gray-900 dark:text-white">9:41</span>
            
            <!-- Status Icons (Signal, WiFi, Battery) -->
            <div class="flex items-center gap-1.5">
              <!-- Cellular Signal -->
              <div class="flex items-end gap-0.5 h-3">
                <div class="w-0.5 h-1 bg-gray-900 dark:bg-white rounded-[0.5px]"></div>
                <div class="w-0.5 h-1.5 bg-gray-900 dark:bg-white rounded-[0.5px]"></div>
                <div class="w-0.5 h-2 bg-gray-900 dark:bg-white rounded-[0.5px]"></div>
                <div class="w-0.5 h-2.5 bg-gray-900 dark:bg-white rounded-[0.5px]"></div>
              </div>
              
              <!-- WiFi Icon -->
              <svg class="w-4 h-3.5 text-gray-900 dark:text-white" viewBox="0 0 16 14" fill="currentColor">
                <path d="M8 11a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
                <path d="M3.5 7.5a6.5 6.5 0 019 0" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                <path d="M1 4.5a10 10 0 0114 0" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
              </svg>
              
              <!-- Battery -->
              <div class="flex items-center gap-0.5">
                <div class="w-6 h-3 border border-gray-900 dark:border-white rounded-[3px] relative flex items-center p-[1.5px]">
                  <div class="w-full h-full bg-gray-900 dark:bg-white rounded-[1.5px]"></div>
                </div>
                <div class="w-0.5 h-1.5 bg-gray-900 dark:bg-white rounded-r-full"></div>
              </div>
            </div>
            
            <!-- Dynamic Island -->
            <div class="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-[20px]"></div>
          </div>

          <!-- Content Area (Scrollable within phone) -->
          <div class="h-full w-full overflow-y-auto pt-12 pb-8 scrollbar-hide bg-white" id="wx-box">
            <!-- Wrapper for padding text content -->
            <div 
              ref="previewContainer" 
              class="wx-content p-4 min-h-full"
              v-html="outputHtml"
            ></div>
            
            <!-- Bottom Home Indicator -->
            <div class="fixed bottom-0 left-0 right-0 h-8 bg-white/90 backdrop-blur flex justify-center items-center pointer-events-none rounded-b-[40px]">
               <div class="w-32 h-1 bg-gray-900/20 rounded-full"></div>
            </div>
          </div>
          
       </div>
     </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
