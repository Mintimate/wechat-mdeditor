import { ref, readonly } from 'vue';

// 通知状态
const notification = ref({
  visible: false,
  type: 'success',
  message: ''
});

let hideTimeout = null;

// 图标配置
const icons = {
  success: {
    color: '#34C759',
    svg: '<polyline points="20 6 9 17 4 12"></polyline>'
  },
  error: {
    color: '#FF3B30',
    svg: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
  },
  info: {
    color: '#007AFF',
    svg: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
  },
  warning: {
    color: '#FF9500',
    svg: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'
  }
};

/**
 * 显示灵动岛通知
 * @param {string} message - 显示的消息内容
 * @param {string} type - 通知类型: success | error | info | warning
 * @param {number} duration - 显示时长（毫秒）
 */
const show = (message, type = 'success', duration = 2000) => {
  // 清除之前的定时器
  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }
  
  notification.value = {
    visible: true,
    type,
    message
  };
  
  hideTimeout = setTimeout(() => {
    hide();
  }, duration);
};

const hide = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }
  notification.value.visible = false;
};

// 快捷方法
const success = (message, duration) => show(message, 'success', duration);
const error = (message, duration) => show(message, 'error', duration);
const info = (message, duration) => show(message, 'info', duration);
const warning = (message, duration) => show(message, 'warning', duration);

export function useDynamicIsland() {
  return {
    notification: readonly(notification),
    icons,
    show,
    hide,
    success,
    error,
    info,
    warning
  };
}
