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
            
            <!-- Bottom Home Indicator with Author Info -->
            <div class="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-b-[40px] pb-2">
               <!-- Author Info -->
               <div class="flex justify-center items-center gap-4 pt-2 px-4 text-xs">
                 <a href="https://github.com/Mintimate" target="_blank" class="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1">
                   <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                   Github
                 </a>
                 <span class="text-gray-300 dark:text-gray-600">|</span>
                 <a href="https://www.mintimate.cn" target="_blank" class="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1">
                   <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                   博客
                 </a>
                 <span class="text-gray-300 dark:text-gray-600">|</span>
                 <a href="https://space.bilibili.com/355567627" target="_blank" class="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1">
                   <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 16.5h-9v-3h9v3zm2.5-5.25h-14c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5h14c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5z"/></svg>
                   B站
                 </a>
               </div>
               <!-- Home Indicator -->
               <div class="flex justify-center items-center pt-2">
                 <div class="w-32 h-1 bg-gray-900/20 dark:bg-white/20 rounded-full"></div>
               </div>
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

<style>
/* 预览内容样式 - 非 scoped 以影响 v-html 渲染的内容 */
.wx-content {
    word-wrap: break-word;
}
</style>
