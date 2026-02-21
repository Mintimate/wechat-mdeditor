<script setup>
import { ref, watch, computed } from 'vue';
import { useDynamicIsland } from '../../composables/useDynamicIsland';

const { notification, icons } = useDynamicIsland();
const showContent = ref(false);
const isExpanded = ref(false);

// 当前通知配置
const currentIcon = computed(() => {
  return icons[notification.value.type] || icons.success;
});

// 监听通知可见性变化，触发灵动岛动画序列
watch(() => notification.value.visible, (newVal) => {
  if (newVal) {
    // 第一步：展开灵动岛
    isExpanded.value = true;
    // 第二步：展开完成后显示内容
    setTimeout(() => {
      showContent.value = true;
    }, 250);
  } else {
    // 第一步：隐藏内容
    showContent.value = false;
    // 第二步：收起灵动岛
    setTimeout(() => {
      isExpanded.value = false;
    }, 200);
  }
});
</script>

<template>
  <div 
    class="dynamic-island-container"
    :class="{ 'is-expanded': isExpanded }"
  >
    <!-- 展开状态：显示通知内容 -->
    <Transition name="content-fade">
      <div v-if="showContent" class="island-content">
        <!-- 左侧图标 -->
        <div class="notify-icon" :style="{ color: currentIcon.color }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" v-html="currentIcon.svg"></svg>
        </div>
        <!-- 右侧文字 -->
        <span class="notify-text">{{ notification.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dynamic-island-container {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 126px;
  height: 37px;
  background: #000;
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: 
    width 0.35s cubic-bezier(0.42, 0, 0.58, 1),
    height 0.35s cubic-bezier(0.42, 0, 0.58, 1),
    border-radius 0.35s cubic-bezier(0.42, 0, 0.58, 1);
  overflow: hidden;
}

.dynamic-island-container.is-expanded {
  width: 220px;
  height: 52px;
  border-radius: 26px;
}

.island-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
}

.notify-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.notify-icon svg {
  width: 100%;
  height: 100%;
}

.notify-text {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* 内容淡入淡出动画 */
.content-fade-enter-active {
  animation: contentFadeIn 0.25s ease-out;
}

.content-fade-leave-active {
  animation: contentFadeOut 0.2s ease-in forwards;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes contentFadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
