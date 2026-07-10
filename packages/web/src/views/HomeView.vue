<script setup lang="ts">
// 话游 - 主菜单页面

import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game.store";
import { useSaveStore } from "@/stores/save.store";
import { onMounted } from "vue";

const router = useRouter();
const gameStore = useGameStore();
const saveStore = useSaveStore();

onMounted(() => {
  saveStore.initSlots();
});

function startNewGame() {
  gameStore.startGame();
  router.push("/game");
}

function loadGame() {
  router.push("/save");
}

function openSettings() {
  router.push("/settings");
}
</script>

<template>
  <div class="home-view">
    <div class="home-content">
      <div class="title-section">
        <h1 class="game-title">话游</h1>
        <p class="game-subtitle">交互式叙事人生模拟</p>
        <p class="game-slogan">一话一人生，一言一世界</p>
      </div>

      <div class="menu-section">
        <button class="menu-button primary" @click="startNewGame">
          <span class="button-icon">🎮</span>
          <span class="button-text">开始游戏</span>
        </button>

        <button
          class="menu-button"
          :disabled="saveStore.isEmpty"
          @click="loadGame"
        >
          <span class="button-icon">📂</span>
          <span class="button-text">读取存档</span>
        </button>

        <button class="menu-button" @click="openSettings">
          <span class="button-icon">⚙️</span>
          <span class="button-text">设置</span>
        </button>
      </div>

      <div class="footer-section">
        <p class="version">v0.1.0 MVP</p>
        <p class="copyright">© 2026 话游工作室</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  padding: 40px;
}

.title-section {
  text-align: center;
}

.game-title {
  font-size: 72px;
  font-weight: bold;
  background: linear-gradient(90deg, #4fc3f7, #29b6f6, #03a9f4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 0 30px rgba(79, 195, 247, 0.5);
}

.game-subtitle {
  font-size: 24px;
  color: #888;
  margin: 16px 0 0;
}

.game-slogan {
  font-size: 16px;
  color: #666;
  margin: 8px 0 0;
  font-style: italic;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 280px;
}

.menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #e0e0e0;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-button:hover:not(:disabled) {
  background: rgba(79, 195, 247, 0.1);
  border-color: rgba(79, 195, 247, 0.5);
  transform: translateY(-2px);
}

.menu-button:active:not(:disabled) {
  transform: translateY(0);
}

.menu-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.menu-button.primary {
  background: linear-gradient(
    135deg,
    rgba(79, 195, 247, 0.2),
    rgba(3, 169, 244, 0.2)
  );
  border-color: rgba(79, 195, 247, 0.5);
}

.menu-button.primary:hover {
  background: linear-gradient(
    135deg,
    rgba(79, 195, 247, 0.3),
    rgba(3, 169, 244, 0.3)
  );
}

.button-icon {
  font-size: 24px;
}

.button-text {
  flex: 1;
}

.footer-section {
  text-align: center;
  color: #444;
  font-size: 12px;
}

.version {
  margin: 0 0 4px;
}

.copyright {
  margin: 0;
}
</style>
