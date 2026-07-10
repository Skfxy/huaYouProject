<script setup lang="ts">
// 话游 - 剧情对话框组件

import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  text: string;
  speed?: number;
}>();

const displayText = ref("");
const isTyping = ref(false);
const typewriterTimer = ref<number | null>(null);

function startTypewriter() {
  displayText.value = "";
  isTyping.value = true;
  let index = 0;

  if (typewriterTimer.value) {
    clearInterval(typewriterTimer.value);
  }

  typewriterTimer.value = window.setInterval(() => {
    if (index < props.text.length) {
      displayText.value += props.text[index];
      index++;
    } else {
      isTyping.value = false;
      if (typewriterTimer.value) {
        clearInterval(typewriterTimer.value);
        typewriterTimer.value = null;
      }
    }
  }, props.speed || 50);
}

function skipTypewriter() {
  if (typewriterTimer.value) {
    clearInterval(typewriterTimer.value);
    typewriterTimer.value = null;
  }
  displayText.value = props.text;
  isTyping.value = false;
}

watch(
  () => props.text,
  () => {
    startTypewriter();
  },
);

onMounted(() => {
  startTypewriter();
});
</script>

<template>
  <div class="dialog-box" @click="skipTypewriter">
    <div class="dialog-content">
      <p class="dialog-text">{{ displayText }}</p>
      <span v-if="isTyping" class="typing-indicator">|</span>
    </div>
    <div v-if="!isTyping" class="click-hint">点击继续</div>
  </div>
</template>

<style scoped>
.dialog-box {
  background: linear-gradient(
    135deg,
    rgba(20, 20, 40, 0.95),
    rgba(30, 30, 60, 0.95)
  );
  border: 1px solid rgba(79, 195, 247, 0.3);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  position: relative;
  min-height: 120px;
}

.dialog-content {
  line-height: 1.8;
}

.dialog-text {
  color: #e0e0e0;
  font-size: 16px;
  margin: 0;
  white-space: pre-wrap;
}

.typing-indicator {
  display: inline-block;
  color: #4fc3f7;
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.click-hint {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 12px;
  color: #666;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
