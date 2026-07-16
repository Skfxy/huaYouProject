<script setup lang="ts">
// 话游 - 主菜单页面

import { useRouter } from "vue-router";
import { useSaveStore } from "@/stores/save.store";
import { onMounted } from "vue";
import homeBg from "@/assets/images/home-bg.jpg";

const router = useRouter();
const saveStore = useSaveStore();

onMounted(() => {
  saveStore.initSlots();
});

function startNewGame() {
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
  <div class="home-view" :style="{ backgroundImage: `url(${homeBg})` }">
    <div class="vignette"></div>
    <div class="home-content">
      <div class="title-section">
        <h1 class="game-title">话游</h1>
        <div class="subtitle-wrap">
          <span class="subtitle-line"></span>
          <p class="game-subtitle">交互式叙事人生模拟</p>
          <span class="subtitle-line"></span>
        </div>
        <p class="game-slogan">一话一人生，一言一世界</p>
      </div>

      <nav class="menu-section">
        <button class="menu-button primary" @click="startNewGame">
          <span class="button-text">开始游戏</span>
        </button>

        <button
          class="menu-button"
          :disabled="saveStore.isEmpty"
          @click="loadGame"
        >
          <span class="button-text">读取存档</span>
        </button>

        <button class="menu-button" @click="openSettings">
          <span class="button-text">设置</span>
        </button>
      </nav>

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
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #0a0a1a;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 60% 50% at 50% 45%,
      rgba(8, 10, 20, 0.25) 0%,
      rgba(8, 10, 20, 0.5) 40%,
      rgba(5, 5, 15, 0.75) 100%
    ),
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.15) 0%,
      transparent 30%,
      transparent 70%,
      rgba(0, 0, 0, 0.4) 100%
    );
  pointer-events: none;
  z-index: 0;
}

.home-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 56px;
  padding: 40px;
  animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-section {
  text-align: center;
}

.game-title {
  font-family:
    "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "SimHei", "Heiti SC",
    sans-serif;
  font-size: 120px;
  font-weight: 900;
  letter-spacing: 8px;
  margin: 0;
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #f0f2f5 35%,
    #d8dde5 65%,
    #c0c8d4 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.8))
    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9));
  animation: titleAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards;
  opacity: 0;
  transform: scale(0.85);
  position: relative;
  line-height: 1.1;
}

@keyframes titleAppear {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.subtitle-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px 0 12px;
}

.subtitle-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45));
}

.subtitle-line:last-child {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.45), transparent);
}

.game-subtitle {
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 10px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
}

.game-slogan {
  font-size: 15px;
  font-weight: 300;
  letter-spacing: 5px;
  color: rgba(230, 235, 245, 0.75);
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
  font-style: italic;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 240px;
}

.menu-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 40px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(240, 245, 250, 0.82);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 6px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
}

.menu-button::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(140, 190, 255, 0.8),
    transparent
  );
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  transform: translateX(-50%);
}

.menu-button::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(140, 190, 255, 0.06),
    transparent
  );
  transition: left 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.menu-button:hover:not(:disabled) {
  color: rgba(240, 245, 255, 0.95);
  letter-spacing: 10px;
  border-bottom-color: transparent;
}

.menu-button:hover:not(:disabled)::before {
  width: 100%;
}

.menu-button:hover:not(:disabled)::after {
  left: 100%;
}

.menu-button:active:not(:disabled) {
  transform: scale(0.98);
}

.menu-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  letter-spacing: 6px;
}

.menu-button.primary {
  color: rgba(180, 220, 255, 0.9);
  border-bottom-color: rgba(140, 190, 255, 0.3);
  font-size: 17px;
}

.menu-button.primary::before {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(160, 210, 255, 0.9),
    transparent
  );
  height: 1.5px;
}

.menu-button.primary:hover:not(:disabled) {
  color: rgba(220, 240, 255, 1);
}

.button-text {
  position: relative;
  z-index: 1;
}

.footer-section {
  text-align: center;
  color: rgba(255, 255, 255, 0.25);
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 300;
}

.version {
  margin: 0 0 6px;
}

.copyright {
  margin: 0;
}

@media (max-width: 768px) {
  .home-content {
    gap: 40px;
    padding: 24px;
  }

  .game-title {
    font-size: 72px;
    letter-spacing: 4px;
  }

  .subtitle-wrap {
    gap: 12px;
    margin: 16px 0 8px;
  }

  .subtitle-line {
    width: 40px;
  }

  .game-subtitle {
    font-size: 16px;
    letter-spacing: 6px;
  }

  .game-slogan {
    font-size: 13px;
    letter-spacing: 3px;
  }

  .menu-section {
    min-width: 200px;
    gap: 0;
  }

  .menu-button {
    padding: 16px 32px;
    font-size: 15px;
    letter-spacing: 4px;
  }

  .menu-button:hover:not(:disabled) {
    letter-spacing: 6px;
  }

  .menu-button.primary {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .home-content {
    gap: 32px;
    padding: 16px;
  }

  .game-title {
    font-size: 56px;
    letter-spacing: 2px;
  }

  .game-subtitle {
    font-size: 14px;
    letter-spacing: 4px;
  }

  .menu-section {
    min-width: 180px;
  }

  .menu-button {
    padding: 14px 24px;
    font-size: 14px;
  }

  .footer-section {
    font-size: 10px;
  }
}
</style>
