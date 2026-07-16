<script setup lang="ts">
// 话游 - 游戏主界面

import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game.store";
import { usePlayerStore } from "@/stores/player.store";
import { useSaveStore } from "@/stores/save.store";
import { useSettingsStore } from "@/stores/settings.store";
import { useEventEngine } from "@/hooks/useEventEngine";
import StatusBar from "@/components/game/StatusBar.vue";
import DialogBox from "@/components/game/DialogBox.vue";
import OptionList from "@/components/game/OptionList.vue";
import BaseModal from "@/components/common/BaseModal.vue";
import type { EventOption } from "@shared/types/game.types";

const router = useRouter();
const gameStore = useGameStore();
const playerStore = usePlayerStore();
const saveStore = useSaveStore();
const settingsStore = useSettingsStore();
const {
  currentEvent,
  startGame,
  handleOptionSelect,
  selectNextEvent,
  specialDateHint,
  showSpecialDateHint,
  chapterEnded,
  endingResult,
  restoreEngineFromEventId,
  checkEventCondition,
  reset: resetEngine,
} = useEventEngine();

const showOptions = ref(false);
const isTextComplete = ref(false);
const showEffectHint = ref(false);
const effectHint = ref("");
const showBackConfirm = ref(false);

const dialogSpeed = computed(() => settingsStore.settings.textSpeed);

const endingGradeColor = computed(() => {
  if (!endingResult.value) return "#4fc3f7";
  switch (endingResult.value.grade) {
    case "S":
      return "#ffd700";
    case "A":
      return "#4fc3f7";
    case "B":
      return "#66bb6a";
    case "C":
      return "#ffa726";
    case "D":
      return "#ef5350";
    default:
      return "#4fc3f7";
  }
});

const endingTypeText = computed(() => {
  if (!endingResult.value) return "";
  switch (endingResult.value.type) {
    case "good":
      return "好结局";
    case "neutral":
      return "中结局";
    case "bad":
      return "坏结局";
    default:
      return "";
  }
});

onMounted(() => {
  if (!gameStore.game.isStarted) {
    // 新游戏：初始化所有状态
    gameStore.startGame();
    playerStore.reset();
    resetEngine();
    startGame();
  } else if (gameStore.game.currentEvent) {
    // 读档：恢复事件引擎状态
    restoreEngineFromEventId(gameStore.game.currentEvent);
  }
});

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
  showBackConfirm.value = false;
  router.push("/");
}

function goToSave() {
  router.push("/save");
}

function continueGame() {
  const nextEvent = selectNextEvent();
  if (nextEvent) {
    currentEvent.value = nextEvent;
  }
}

function restartGame() {
  gameStore.reset();
  playerStore.reset();
  resetEngine();
  startGame();
}
</script>

<template>
  <div class="game-view">
    <div class="game-header">
      <button class="back-button" @click="showBackConfirm = true">
        ← 返回
      </button>
      <div class="header-center">
        <span class="chapter-title">第一章：重启的2018</span>
        <span v-if="!chapterEnded" class="day-progress"
          >第 {{ gameStore.time.day }}/{{ gameStore.time.totalDays }} 天</span
        >
      </div>
      <button class="save-button" @click="goToSave">💾 存档</button>
    </div>

    <div class="game-content">
      <div class="status-section">
        <StatusBar />
      </div>

      <div class="hint-stack">
        <Transition name="fade">
          <div v-if="showEffectHint" class="effect-hint">
            {{ effectHint }}
          </div>
        </Transition>

        <Transition name="fade">
          <div v-if="showSpecialDateHint" class="special-hint">
            {{ specialDateHint }}
          </div>
        </Transition>

        <Transition name="fade">
          <div v-if="saveStore.showAutoSaveHint" class="autosave-hint">
            💾 已自动存档
          </div>
        </Transition>
      </div>

      <!-- 结局界面 -->
      <div v-if="chapterEnded && endingResult" class="ending-section">
        <div class="ending-content">
          <div
            class="ending-grade-badge"
            :style="{ borderColor: endingGradeColor, color: endingGradeColor }"
          >
            {{ endingResult.grade }}
          </div>
          <h2 class="ending-title">{{ endingResult.name }}</h2>
          <p class="ending-type">{{ endingTypeText }}</p>
          <div class="ending-divider"></div>
          <p class="ending-description">{{ endingResult.description }}</p>

          <div class="ending-stats">
            <div class="stat-row">
              <span class="stat-label">精力</span>
              <span class="stat-value">{{ playerStore.status.energy }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">心情</span>
              <span class="stat-value">{{ playerStore.status.mood }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">健康</span>
              <span class="stat-value">{{ playerStore.status.health }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">存款</span>
              <span class="stat-value">¥{{ playerStore.status.money }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">编程等级</span>
              <span class="stat-value"
                >Lv.{{ playerStore.getSkillLevel("programming") }}</span
              >
            </div>
            <div class="stat-row">
              <span class="stat-label">运营等级</span>
              <span class="stat-value"
                >Lv.{{ playerStore.getSkillLevel("operation") }}</span
              >
            </div>
            <div class="stat-row">
              <span class="stat-label">社交能力</span>
              <span class="stat-value"
                >Lv.{{ playerStore.getSkillLevel("social") }}</span
              >
            </div>
          </div>

          <div class="ending-score">
            <span>结局评分</span>
            <span class="score-value"
              >{{ Math.round(endingResult.score * 100) }}分</span
            >
          </div>

          <div class="ending-actions">
            <button class="menu-button primary" @click="restartGame">
              重新开始
            </button>
            <button class="menu-button" @click="goToHome">返回主菜单</button>
          </div>
        </div>
      </div>

      <div v-else-if="currentEvent" class="dialog-section">
        <div class="event-title">
          <h2>{{ currentEvent.name }}</h2>
          <p class="event-description">{{ currentEvent.description }}</p>
        </div>
        <DialogBox
          :key="currentEvent.id"
          :text="currentEvent.text"
          :speed="dialogSpeed"
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

      <div
        v-if="showOptions && currentEvent && !chapterEnded"
        class="options-section"
      >
        <OptionList
          :options="currentEvent.options"
          :check-condition="checkEventCondition"
          @select="selectOption"
        />
      </div>
    </div>

    <BaseModal
      :show="showBackConfirm"
      title="返回主菜单"
      :show-cancel="true"
      confirm-text="确认返回"
      cancel-text="继续游戏"
      @close="showBackConfirm = false"
      @confirm="goToHome"
    >
      <p class="back-confirm-text">
        返回主菜单后当前未保存的进度可能会丢失，是否继续？
      </p>
    </BaseModal>
  </div>
</template>

<style scoped>
.game-view {
  min-height: 100vh;
  min-height: 100svh;
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
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chapter-title {
  font-size: 14px;
  color: #4fc3f7;
  opacity: 0.8;
}

.day-progress {
  font-size: 12px;
  color: #888;
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

.hint-stack {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 100;
  pointer-events: none;
  width: max-content;
  max-width: 90%;
}

.back-confirm-text {
  margin: 0;
  color: #ccc;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
}

.effect-hint {
  background: rgba(79, 195, 247, 0.9);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  animation: slideDown 0.3s ease;
}

.special-hint {
  background: rgba(156, 39, 176, 0.9);
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  animation: slideDown 0.3s ease;
  max-width: 100%;
  text-align: center;
}

.autosave-hint {
  background: rgba(76, 175, 80, 0.9);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

.ending-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.ending-content {
  text-align: center;
  max-width: 450px;
  width: 100%;
}

.ending-grade-badge {
  width: 80px;
  height: 80px;
  border: 3px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.ending-title {
  font-size: 32px;
  color: #4fc3f7;
  margin: 0 0 8px;
}

.ending-type {
  font-size: 14px;
  color: #888;
  margin: 0 0 20px;
}

.ending-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4fc3f7, transparent);
  margin: 0 auto 24px;
}

.ending-description {
  font-size: 15px;
  color: #ccc;
  line-height: 1.8;
  margin: 0 0 24px;
  font-style: italic;
}

.ending-stats {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  text-align: left;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-row .stat-label {
  color: #888;
  font-size: 14px;
}

.stat-row .stat-value {
  color: #4fc3f7;
  font-weight: bold;
}

.ending-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(79, 195, 247, 0.1);
  border-radius: 8px;
  margin-bottom: 24px;
}

.ending-score span:first-child {
  color: #aaa;
}

.score-value {
  color: #4fc3f7;
  font-size: 20px;
  font-weight: bold;
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

.stat-item .stat-label {
  font-size: 12px;
  color: #666;
}

.stat-item .stat-value {
  font-size: 18px;
  color: #4fc3f7;
  font-weight: bold;
}

.ending-actions,
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

@media (max-width: 768px) {
  .game-header {
    padding: 12px 16px;
  }

  .back-button,
  .save-button {
    padding: 6px 12px;
    font-size: 13px;
  }

  .chapter-title {
    font-size: 13px;
  }

  .day-progress {
    font-size: 11px;
  }

  .game-content {
    padding: 16px;
    gap: 16px;
  }

  .event-title h2 {
    font-size: 20px;
  }

  .event-description {
    font-size: 13px;
  }

  .hint-stack {
    top: 64px;
    gap: 6px;
  }

  .effect-hint {
    font-size: 13px;
    padding: 6px 12px;
  }

  .special-hint {
    font-size: 13px;
    padding: 8px 16px;
  }

  .autosave-hint {
    font-size: 12px;
    padding: 6px 12px;
  }

  .ending-grade-badge {
    width: 64px;
    height: 64px;
    font-size: 28px;
    margin-bottom: 16px;
  }

  .ending-title {
    font-size: 26px;
  }

  .ending-description {
    font-size: 14px;
  }

  .ending-stats {
    padding: 12px;
  }

  .stat-row {
    padding: 6px 0;
    font-size: 13px;
  }

  .end-content h2 {
    font-size: 26px;
  }

  .end-stats {
    gap: 20px;
  }

  .stat-item .stat-value {
    font-size: 16px;
  }

  .menu-button {
    padding: 10px 20px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .game-header {
    padding: 10px 12px;
  }

  .back-button,
  .save-button {
    padding: 6px 10px;
    font-size: 12px;
  }

  .chapter-title {
    font-size: 12px;
  }

  .game-content {
    padding: 12px;
    gap: 12px;
  }

  .event-title h2 {
    font-size: 18px;
  }

  .ending-grade-badge {
    width: 56px;
    height: 56px;
    font-size: 24px;
    border-width: 2px;
  }

  .ending-title {
    font-size: 22px;
  }

  .ending-type {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .ending-description {
    font-size: 13px;
    line-height: 1.7;
  }

  .ending-score {
    padding: 10px 12px;
  }

  .score-value {
    font-size: 18px;
  }

  .end-content h2 {
    font-size: 22px;
  }

  .end-text {
    font-size: 16px;
  }

  .end-subtext {
    font-size: 13px;
    margin-bottom: 24px;
  }

  .end-stats {
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-item .stat-label {
    font-size: 11px;
  }

  .stat-item .stat-value {
    font-size: 15px;
  }

  .ending-actions,
  .end-actions {
    gap: 10px;
  }

  .menu-button {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>
