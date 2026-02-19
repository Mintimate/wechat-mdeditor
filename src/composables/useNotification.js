import { ref, readonly } from 'vue';

const notifications = ref([]);
let idCounter = 0;

const show = (message, type = 'success', duration = 3000) => {
  const id = ++idCounter;
  notifications.value.push({ id, message, type });
  
  setTimeout(() => {
    remove(id);
  }, duration);
};

const remove = (id) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
};

const success = (message, duration) => show(message, 'success', duration);
const error = (message, duration) => show(message, 'error', duration);
const info = (message, duration) => show(message, 'info', duration);

export function useNotification() {
  return {
    notifications: readonly(notifications),
    show,
    success,
    error,
    info,
    remove
  };
}
