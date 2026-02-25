<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const MIN_DESKTOP_WIDTH = 1024

const isSmallScreen = ref(false)
const dismissed = ref(false)

const updateScreenState = () => {
  if (dismissed.value) return
  isSmallScreen.value = window.innerWidth < MIN_DESKTOP_WIDTH
}

const handleContinue = () => {
  dismissed.value = true
}

onMounted(() => {
  updateScreenState()
  window.addEventListener('resize', updateScreenState)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenState)
})
</script>

<template>
  <div v-if="isSmallScreen && !dismissed" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    <div class="relative w-[90%] max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-start gap-3">
        <div class="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v4m0 4h.01" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">建议使用桌面端浏览器</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
            当前屏幕宽度偏小，移动端访问可能出现排版错位、预览不完整等问题。为了获得最佳体验，请使用桌面端浏览器打开。
          </p>
          <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
            再次提醒 (°△°|||)：移动端显示效果不保证美观性，部分功能可能受限。
          </p>
        </div>
      </div>
      <div class="mt-6 flex flex-col gap-3">
        <button
          class="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
          @click="handleContinue"
        >
          继续使用（可能影响体验）
        </button>
        <div class="text-center text-xs text-gray-500 dark:text-gray-400">
          建议切换至电脑或平板横屏访问
        </div>
      </div>
    </div>
  </div>
</template>
