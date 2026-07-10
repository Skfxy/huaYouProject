<script setup lang="ts">
// 话游 - 游戏主界面

import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game.store";
import { usePlayerStore } from "@/stores/player.store";
import { useEventEngine } from "@/hooks/useEventEngine";
import StatusBar from "@/components/game/StatusBar.vue";
import DialogBox from "@/components/game/DialogBox.vue";
import OptionList from "@/components/game/OptionList.vue";
import type { EventOption } from "@shared/types/game.types";

const router = useRouter();
const gameStore = useGameStore();
const playerStore = usePlayerStore();
const { currentEvent, startGame, handleOptionSelect, selectNextEvent } =
  useEventEngine();

const showOptions = ref(false);
const isTextComplete = ref(false);
const showEffectHint = ref(false);
const effectHint = ref("");

onMounted(() => {
  // 如果游戏未开始，初始化
  if (!gameStore.game.isStarted) {
    gameStore.startGame();
    startGame();
  }
});

// 监听事件变化，重置选项状态
watch(currentEvent, () => {
  showOptions.value = false;
  isTextComplete.value = false;
});

function onTextComplete() {
  isTextComplete.value = true;
  showOptions.value = true;
}

function selectOption(option: EventOption) {
  showOptions.value = false;
  isTextComplete.value = false;

  // 显示效果提示
  const hints: string[] = [];
  if (option.effects.energy) {
    hints.push(
      `精力 ${option.effects.energy > 0 ? "+" : ""}${option.effects.energy}`,
    );
  }
  if (option.effects.mood) {
    hints.push(
      `心情 ${option.effects.mood > 0 ? "+" : ""}${option.effects.mood}`,
    );
  }
  if (option.effects.health) {
    hints.push(
      `健康 ${option.effects.health > 0 ? "+" : ""}${option.effects.health}`,
    );
  }
  if (option.effects.money) {
    hints.push(
      `存款 ${option.effects.money > 0 ? "+" : ""}${option.effects.money}`,
    );
  }
  if (option.skillEffects) {
    const skillNames: Record<string, string> = {
      programming: "编程",
      operation: "运营",
      social: "社交",
    };
    Object.entries(option.skillEffects).forEach(([skillId, exp]) => {
      if (exp > 0) {
        hints.push(`${skillNames[skillId] || skillId}经验 +${exp}`);
      }
    });
  }

  if (hints.length > 0) {
    effectHint.value = hints.join(" | ");
    showEffectHint.value = true;
    setTimeout(() => {
      showEffectHint.value = false;
    }, 2000);
  }

  handleOptionSelect(option);
}

function goToHome() {
  router.push("/");
}

function goToSave() {
  router.push("/save");
}

function continueGame() {
  // 继续游戏，选择下一个随机事件
  const nextEvent = selectNextEvent();
  if (nextEvent) {
    currentEvent.value = nextEvent;
  }
}
</script>

<template>
  <div class="game-view">
    <div class="game-header">
      <button class="back-button" @click="goToHome">← 返回</button>
      <div class="header-center">
        <span class="chapter-title">第一章：重启的2018</span>
      </div>
      <button class="save-button" @click="goToSave">💾 存档</button>
    </div>

    <div class="game-content">
      <div class="status-section">
        <StatusBar />
      </div>

      <!-- 效果提示 -->
      <Transition name="fade">
        <div v-if="showEffectHint" class="effect-hint">
          {{ effectHint }}
        </div>
      </Transition>

      <div v-if="currentEvent" class="dialog-section">
        <div class="event-title">
          <h2>{{ currentEvent.name }}</h2>
          <p class="event-description">{{ currentEvent.description }}</p>
        </div>
        <DialogBox
          :key="currentEvent.id"
          :text="currentEvent.text"
          :speed="50"
          @click="onTextComplete"
        />
      </div>

      <div v-else class="end-section">
        <div class="end-content">
          <h2>第一章 · 完</h2>
          <div class="end-divider"></div>
          <p class="end-text">感谢游玩《话游》</p>
          <p class="end-subtext">你的选择将决定后续的故事走向</p>

          <div class="end-stats">
            <div class="stat-item">
              <span class="stat-label">当前天数</span>
              <span class="stat-value">{{ gameStore.time.day }} 天</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">心情</span>
              <span class="stat-value">{{ playerStore.status.mood }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">存款</span>
              <span class="stat-value">¥{{ playerStore.status.money }}</span>
            </div>
          </div>

          <div class="end-actions">
            <button class="menu-button primary" @click="goToHome">
              返回主菜单
            </button>
            <button class="menu-button" @click="continueGame">继续探索</button>
          </div>
        </div>
      </div>

      <div v-if="showOptions && currentEvent" class="options-section">
        <OptionList :options="currentEvent.options" @select="selectOption" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.3);
}

.header-center {
  flex: 1;
  text-align: center;
}

.chapter-title {
  font-size: 14px;
  color: #4fc3f7;
  opacity: 0.8;
}

.back-button,
.save-button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover,
.save-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.status-section {
  width: 100%;
}

.effect-hint {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(79, 195, 247, 0.9);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  z-index: 100;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dialog-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-title {
  text-align: center;
}

.event-title h2 {
  font-size: 24px;
  color: #4fc3f7;
  margin: 0 0 8px;
}

.event-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.end-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.end-content {
  text-align: center;
  max-width: 400px;
}

.end-content h2 {
  font-size: 32px;
  color: #4fc3f7;
  margin: 0 0 16px;
}

.end-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4fc3f7, transparent);
  margin: 0 auto 24px;
}

.end-text {
  font-size: 18px;
  color: #e0e0e0;
  margin: 0 0 8px;
}

.end-subtext {
  font-size: 14px;
  color: #666;
  margin: 0 0 32px;
}

.end-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.stat-value {
  font-size: 18px;
  color: #4fc3f7;
  font-weight: bold;
}

.end-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-button {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.menu-button.primary {
  background: rgba(79, 195, 247, 0.2);
  border-color: rgba(79, 195, 247, 0.5);
  color: #4fc3f7;
}

.menu-button.primary:hover {
  background: rgba(79, 195, 247, 0.3);
}

.options-section {
  margin-top: auto;
}
</style>
