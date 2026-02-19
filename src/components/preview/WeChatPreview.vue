<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useEditorState } from '../../composables/useEditorState';
import { useMarkdownRenderer } from '../../composables/useMarkdownRenderer';
import { useNotification } from '../../composables/useNotification';

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
const { success, error } = useNotification();

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
    success('已复制到剪贴板！请直接在微信公众号编辑器中粘贴');
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
        
        success('已复制到剪贴板！请直接在微信公众号编辑器中粘贴');
      }
    } catch (e) {
      error('复制失败，请尝试手动全选复制');
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
              <svg class="w-4 h-3.5 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
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
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  博客
                 </a>
                 <span class="text-gray-300 dark:text-gray-600">|</span>
                 <a href="https://space.bilibili.com/355567627" target="_blank" class="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/></svg>
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
