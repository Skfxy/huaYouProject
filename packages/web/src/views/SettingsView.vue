<script setup lang="ts">
// 话游 - 设置页面

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSaveStore } from "@/stores/save.store";

const router = useRouter();
const saveStore = useSaveStore();

const settings = ref({
  textSpeed: 50,
  musicVolume: 80,
  soundVolume: 80,
});

function handleReset() {
  if (confirm("确定要重置所有存档吗？此操作不可恢复！")) {
    saveStore.reset();
    alert("存档已重置！");
  }
}

function goBack() {
  router.push("/");
}
</script>

<template>
  <div class="settings-view">
    <div class="settings-header">
      <button class="back-button" @click="goBack">← 返回</button>
      <h1>设置</h1>
    </div>

    <div class="settings-content">
      <div class="settings-section">
        <h2>游戏设置</h2>

        <div class="setting-item">
          <label class="setting-label">文字速度</label>
          <div class="setting-control">
            <input
              v-model="settings.textSpeed"
              type="range"
              min="10"
              max="100"
              class="setting-slider"
            />
            <span class="setting-value">{{ settings.textSpeed }}ms</span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">背景音乐</label>
          <div class="setting-control">
            <input
              v-model="settings.musicVolume"
              type="range"
              min="0"
              max="100"
              class="setting-slider"
            />
            <span class="setting-value">{{ settings.musicVolume }}%</span>
          </div>
        </div>

        <div class="setting-item">
          <label class="setting-label">音效</label>
          <div class="setting-control">
            <input
              v-model="settings.soundVolume"
              type="range"
              min="0"
              max="100"
              class="setting-slider"
            />
            <span class="setting-value">{{ settings.soundVolume }}%</span>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>数据管理</h2>

        <div class="setting-item">
          <label class="setting-label">重置存档</label>
          <button class="reset-button" @click="handleReset">
            重置所有存档
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h2>关于</h2>
        <div class="about-info">
          <p><strong>话游</strong> - 交互式叙事人生模拟</p>
          <p>版本：v0.1.0 MVP</p>
          <p>一话一人生，一言一世界</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.3);
}

.back-button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.settings-header h1 {
  font-size: 24px;
  color: #4fc3f7;
  margin: 0;
}

.settings-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.settings-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.settings-section h2 {
  font-size: 18px;
  color: #4fc3f7;
  margin: 0 0 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  color: #e0e0e0;
  font-size: 14px;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-slider {
  width: 150px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
}

.setting-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #4fc3f7;
  border-radius: 50%;
  cursor: pointer;
}

.setting-value {
  color: #888;
  font-size: 12px;
  min-width: 40px;
}

.reset-button {
  padding: 8px 16px;
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  color: #f44336;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background: rgba(244, 67, 54, 0.3);
}

.about-info {
  color: #888;
  font-size: 14px;
}

.about-info p {
  margin: 8px 0;
}

.about-info strong {
  color: #4fc3f7;
}

@media (max-width: 768px) {
  .settings-header {
    padding: 12px 16px;
    gap: 12px;
  }

  .back-button {
    padding: 6px 12px;
    font-size: 13px;
  }

  .settings-header h1 {
    font-size: 20px;
  }

  .settings-content {
    padding: 16px;
    gap: 16px;
  }

  .settings-section {
    padding: 16px;
  }

  .settings-section h2 {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .setting-item {
    padding: 10px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .setting-slider {
    width: 180px;
  }

  .reset-button {
    padding: 10px 16px;
    min-height: 40px;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .settings-header {
    padding: 10px 12px;
  }

  .settings-header h1 {
    font-size: 18px;
  }

  .settings-content {
    padding: 12px;
    gap: 12px;
  }

  .settings-section {
    padding: 14px;
    border-radius: 10px;
  }

  .setting-control {
    width: 100%;
    justify-content: space-between;
  }

  .setting-slider {
    flex: 1;
    max-width: 200px;
  }
}
</style>
