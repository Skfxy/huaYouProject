<script setup lang="ts">
interface Props {
  show: boolean;
  title?: string;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
}

withDefaults(defineProps<Props>(), {
  title: "",
  showCancel: false,
  confirmText: "确认",
  cancelText: "取消",
});

const emit = defineEmits<{
  close: [];
  confirm: [];
  cancel: [];
}>();

function handleConfirm() {
  emit("confirm");
  emit("close");
}

function handleCancel() {
  emit("cancel");
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-container">
          <div class="modal-header">
            <h3 v-if="title" class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="handleCancel">×</button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="showCancel || $slots.footer" class="modal-footer">
            <slot name="footer">
              <button class="modal-button cancel" @click="handleCancel">
                {{ cancelText }}
              </button>
              <button class="modal-button confirm" @click="handleConfirm">
                {{ confirmText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: linear-gradient(135deg, #1a1a3a 0%, #0a0a2a 100%);
  border: 1px solid rgba(79, 195, 247, 0.3);
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  margin: 0;
  font-size: 18px;
  color: #4fc3f7;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
  font-size: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  line-height: 1;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: flex-end;
}

.modal-button {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-button.cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
}

.modal-button.cancel:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.modal-button.confirm {
  background: rgba(79, 195, 247, 0.2);
  border-color: rgba(79, 195, 247, 0.5);
  color: #4fc3f7;
}

.modal-button.confirm:hover {
  background: rgba(79, 195, 247, 0.3);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 480px) {
  .modal-overlay {
    align-items: flex-end;
  }

  .modal-container {
    width: 100%;
    max-width: 100%;
    max-height: 85vh;
    border-radius: 16px 16px 0 0;
    border-bottom: none;
  }

  .modal-header {
    padding: 14px 16px;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-close {
    width: 36px;
    height: 36px;
  }

  .modal-footer {
    padding: 12px 16px;
    gap: 8px;
  }

  .modal-button {
    flex: 1;
    padding: 10px 16px;
  }
}
</style>
