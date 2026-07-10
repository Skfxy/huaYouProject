<script setup lang="ts">
// 话游 - 选项列表组件

import type { EventOption } from "@shared/types/game.types";

defineProps<{
  options: EventOption[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  select: [option: EventOption];
}>();

function selectOption(option: EventOption) {
  emit("select", option);
}
</script>

<template>
  <div class="option-list">
    <button
      v-for="option in options"
      :key="option.id"
      class="option-button"
      :disabled="disabled"
      @click="selectOption(option)"
    >
      <span class="option-text">{{ option.text }}</span>
      <span class="option-arrow">→</span>
    </button>
  </div>
</template>

<style scoped>
.option-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(79, 195, 247, 0.2);
  border-radius: 12px;
  color: #e0e0e0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-button:hover:not(:disabled) {
  background: rgba(79, 195, 247, 0.1);
  border-color: rgba(79, 195, 247, 0.5);
  transform: translateX(4px);
}

.option-button:active:not(:disabled) {
  transform: translateX(2px);
}

.option-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-text {
  flex: 1;
}

.option-arrow {
  color: #4fc3f7;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.option-button:hover:not(:disabled) .option-arrow {
  opacity: 1;
}
</style>
