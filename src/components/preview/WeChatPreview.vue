<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
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
  wechatStyle,
  themeColors,
  fancyMode
} = useEditorState();

const { outputHtml, previewContainer, render } = useMarkdownRenderer();
const { success, error } = useNotification();

const previewScrollContainer = ref<HTMLElement | null>(null);

// Watch for changes and re-render
watch([input, currentTheme, currentFont, currentSize, codeBlockStyle, headingStyle, imageCaptionMode, fancyMode], () => {
    const theme = themeColors.value[currentTheme.value];
    render({
        input: input.value,
        codeBlockStyle: codeBlockStyle.value,
        imageCaptionMode: imageCaptionMode.value,
        currentFont: currentFont.value,
        wechatStyle: wechatStyle.value,
        themeTertiary: theme?.tertiary || '#ea7c4d',
        fancyMode: fancyMode.value,
        themePrimary: theme?.primary || '#f97316'
    });
});

onMounted(() => {
    // Initial Render
    const theme = themeColors.value[currentTheme.value];
    render({
        input: input.value,
        codeBlockStyle: codeBlockStyle.value,
        imageCaptionMode: imageCaptionMode.value,
        currentFont: currentFont.value,
        wechatStyle: wechatStyle.value,
        themeTertiary: theme?.tertiary || '#ea7c4d'
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
    copyToClipboard,
    previewScrollContainer
});

</script>

<template>
  <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
    <!-- Top label bar -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-500 font-medium flex justify-between items-center shadow-sm z-10 shrink-0">
      <span class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500"></span>
        微信公众号预览
      </span>
      <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-400">支持 Mermaid, 样式已内联</span>
    </div>

    <!-- Phone Simulator Container -->
    <div class="flex-1 overflow-y-auto py-10 px-4 flex justify-center bg-gradient-to-b from-gray-200/60 to-gray-300/60 dark:from-gray-900 dark:to-black">

      <!-- Outer wrapper for phone body + physical side buttons -->
      <div class="relative shrink-0" style="width: 375px; height: 812px;">

        <!-- Side buttons LEFT: mute switch -->
        <div class="absolute -left-[4px] top-[112px] w-[4px] h-7 bg-gray-700 dark:bg-gray-500 rounded-l-[3px] shadow-inner"></div>
        <!-- volume up -->
        <div class="absolute -left-[4px] top-[160px] w-[4px] h-14 bg-gray-700 dark:bg-gray-500 rounded-l-[3px] shadow-inner"></div>
        <!-- volume down -->
        <div class="absolute -left-[4px] top-[232px] w-[4px] h-14 bg-gray-700 dark:bg-gray-500 rounded-l-[3px] shadow-inner"></div>

        <!-- Side button RIGHT: power -->
        <div class="absolute -right-[4px] top-[172px] w-[4px] h-20 bg-gray-700 dark:bg-gray-500 rounded-r-[3px] shadow-inner"></div>

        <!-- Phone Body -->
        <div class="w-[375px] h-[812px] rounded-[44px] bg-white dark:bg-gray-900 overflow-hidden relative
          shadow-[0_0_0_2px_#4b5563,0_0_0_11px_#111827,0_0_0_13px_#374151,0_30px_80px_rgba(0,0,0,0.45)]">

          <!-- Screen inner edge highlight -->
          <div class="absolute inset-0 rounded-[44px] ring-1 ring-inset ring-white/10 pointer-events-none z-50"></div>

          <!-- ===== STATUS BAR ===== -->
          <div class="absolute top-0 left-0 right-0 h-[52px] z-30 flex justify-between items-start px-7 pt-[17px] select-none pointer-events-none bg-[#ededed]">
            <span class="text-[15px] font-semibold text-gray-900 tracking-tight">9:41</span>

            <!-- Status icons - iPhone 15 Pro Style -->
            <div class="flex items-center gap-[6px] mt-[2px]">
              <!-- Cellular Signal - iPhone 15 Pro style rounded bars -->
              <div class="flex items-end gap-[1.5px] h-[13px]">
                <div class="w-[4px] bg-gray-900 rounded-[1.5px]" style="height:31%"></div>
                <div class="w-[4px] bg-gray-900 rounded-[1.5px]" style="height:52%"></div>
                <div class="w-[4px] bg-gray-900 rounded-[1.5px]" style="height:73%"></div>
                <div class="w-[4px] bg-gray-900 rounded-[1.5px]" style="height:100%"></div>
              </div>
              <!-- WiFi - iPhone 15 Pro style smooth arcs -->
              <svg class="w-[18px] h-[13px] text-gray-900" viewBox="0 0 26 20" fill="currentColor">
                <path d="M13 2C7.5 2 2.5 4 0.5 7.5L2.5 9.5C4.5 6.5 8.5 5 13 5C17.5 5 21.5 6.5 23.5 9.5L25.5 7.5C23.5 4 18.5 2 13 2Z" fill="currentColor"/>
                <path d="M13 7C9.5 7 6.5 8.5 5 10.5L7 12.5C8.5 11 10.5 10 13 10C15.5 10 17.5 11 19 12.5L21 10.5C19.5 8.5 16.5 7 13 7Z" fill="currentColor"/>
                <circle cx="13" cy="16" r="2.5" fill="currentColor"/>
              </svg>
              <!-- Battery - iPhone 15 Pro style -->
              <div class="flex items-center">
                <div class="relative w-[27px] h-[13px] border-[1.5px] border-gray-900 rounded-[3px] overflow-hidden">
                  <div class="absolute inset-[1.5px] bg-gray-900 rounded-[2px]"></div>
                </div>
                <div class="w-[1.5px] h-[5px] bg-gray-900 rounded-r-full ml-[0.5px]"></div>
              </div>
            </div>
          </div>

          <!-- Dynamic Island -->
          <div class="absolute top-[10px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-[24px] z-40 shadow-lg"></div>

          <!-- ===== WECHAT NAVIGATION BAR ===== -->
          <div class="absolute top-[52px] left-0 right-0 h-[44px] z-20 flex items-center justify-between px-4 bg-[#ededed] border-b border-black/[0.08]">
            <!-- Back button -->
            <button class="flex items-center gap-[2px] text-[#07C160]">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <!-- Title -->
            <span class="text-[16px] font-medium text-gray-800 truncate max-w-[200px]">公众号文章</span>
            <!-- More (•••) -->
            <button class="text-gray-600">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
              </svg>
            </button>
          </div>

          <!-- ===== CONTENT AREA (scrollable) ===== -->
          <div
            ref="previewScrollContainer"
            class="absolute left-0 right-0 overflow-y-auto scrollbar-hide bg-white"
            style="top: 96px; bottom: 63px;"
            id="wx-box"
          >
            <div
              ref="previewContainer"
              class="wx-content px-4 py-4 pb-8"
              v-html="outputHtml"
            ></div>
          </div>

          <div class="absolute bottom-0 left-0 right-0 z-20 bg-[#f7f7f7] border-t border-black/[0.08]">
            <!-- Toolbar row -->
            <div class="flex items-center gap-2 px-3 py-2">
              <!-- Message input mock -->
              <div class="flex-1 h-9 bg-white rounded-full flex items-center px-3 gap-2 border border-gray-200 shadow-inner">
                <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span class="text-[12px] text-gray-400">写留言</span>
              </div>
              <!-- GitHub -->
              <a href="https://github.com/Mintimate" target="_blank" class="flex flex-col items-center">
                <svg class="w-[22px] h-[22px] text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <!-- Blog -->
              <a href="https://www.mintimate.cn" target="_blank" class="flex flex-col items-center">
                <svg class="w-[22px] h-[22px] text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </a>
              <!-- Bilibili -->
              <a href="https://space.bilibili.com/355567627" target="_blank" class="flex flex-col items-center">
                <svg class="w-[22px] h-[22px] text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
                </svg>
              </a>
            </div>
            <!-- Home Indicator -->
            <div class="flex justify-center pb-[6px]">
              <div class="w-32 h-[4px] rounded-full bg-gray-800/20"></div>
            </div>
          </div>

        </div><!-- /phone body -->
      </div><!-- /outer wrapper -->
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
