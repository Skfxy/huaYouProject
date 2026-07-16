<script setup lang="ts">
// 话游 - 选项列表组件

import { computed } from "vue";
import type { EventOption, EventCondition } from "@shared/types/game.types";

const props = withDefaults(
  defineProps<{
    options: EventOption[];
    disabled?: boolean;
    // 选项条件检查函数，返回 false 表示选项不可用
    checkCondition?: (condition?: EventCondition) => boolean;
  }>(),
  {
    disabled: false,
    checkCondition: () => true,
  },
);

const emit = defineEmits<{
  select: [option: EventOption];
}>();

interface DisplayOption {
  option: EventOption;
  visible: boolean;
  disabled: boolean;
}

const displayOptions = computed<DisplayOption[]>(() =>
  props.options.map((option) => {
    if (!option.condition) {
      return { option, visible: true, disabled: false };
    }
    const ok = props.checkCondition(option.condition);
    // 不满足条件的选项隐藏而不是禁用，避免破坏沉浸感
    return { option, visible: ok, disabled: false };
  }),
);

function selectOption(option: EventOption) {
  if (props.disabled) return;
  emit("select", option);
}
</script>

<template>
  <div class="option-list">
    <template v-for="item in displayOptions" :key="item.option.id">
      <button
        v-if="item.visible"
        class="option-button"
        :disabled="disabled || item.disabled"
        @click="selectOption(item.option)"
      >
        <span class="option-text">{{ item.option.text }}</span>
        <span class="option-arrow">→</span>
      </button>
    </template>
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

@media (max-width: 768px) {
  .option-list {
    gap: 10px;
  }

  .option-button {
    padding: 14px 16px;
    font-size: 14px;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .option-list {
    gap: 8px;
  }

  .option-button {
    padding: 14px 14px;
    font-size: 14px;
    min-height: 48px;
  }

  .option-button:active:not(:disabled) {
    transform: scale(0.98);
  }
}
</style>
