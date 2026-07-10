<script setup lang="ts">
// 话游 - 状态栏组件

import { usePlayerStore } from "@/stores/player.store";
import { useGameStore } from "@/stores/game.store";

const playerStore = usePlayerStore();
const gameStore = useGameStore();
</script>

<template>
  <div class="status-bar">
    <div class="time-info">
      <span class="day">第 {{ gameStore.time.day }} 天</span>
      <span class="period">{{ gameStore.periodName }}</span>
    </div>
    <div class="status-list">
      <div
        v-for="item in playerStore.statusWithNames"
        :key="item.key"
        class="status-item"
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="name">{{ item.name }}</span>
        <div class="bar-container">
          <div
            class="bar-fill"
            :style="{
              width: item.max ? `${(item.value / item.max) * 100}%` : '100%',
            }"
            :class="{
              low: item.key !== 'money' && item.value < 30,
              medium:
                item.key !== 'money' && item.value >= 30 && item.value < 70,
              high: item.key !== 'money' && item.value >= 70,
            }"
          ></div>
        </div>
        <span class="value">{{
          item.key === "money" ? `¥${item.value}` : item.value
        }}</span>
      </div>
    </div>
    <div class="skill-list">
      <div
        v-for="skill in playerStore.skillWithDetails"
        :key="skill.id"
        class="skill-item"
        :class="{ unlocked: skill.level > 0 }"
      >
        <span class="skill-name">{{ skill.name }}</span>
        <span class="skill-level">Lv.{{ skill.level }}</span>
        <div class="exp-bar">
          <div
            class="exp-fill"
            :style="{
              width: `${(skill.experience / skill.maxExperience) * 100}%`,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.time-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #aaa;
}

.day {
  font-weight: bold;
  color: #4fc3f7;
}

.period {
  background: rgba(79, 195, 247, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
}

.status-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.icon {
  font-size: 16px;
}

.name {
  color: #888;
  min-width: 32px;
}

.bar-container {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.bar-fill.low {
  background: linear-gradient(90deg, #f44336, #ff5722);
}

.bar-fill.medium {
  background: linear-gradient(90deg, #ff9800, #ffc107);
}

.bar-fill.high {
  background: linear-gradient(90deg, #4caf50, #8bc34a);
}

.value {
  color: #fff;
  font-weight: bold;
  min-width: 40px;
  text-align: right;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  opacity: 0.5;
}

.skill-item.unlocked {
  opacity: 1;
}

.skill-name {
  color: #888;
  min-width: 60px;
}

.skill-level {
  color: #4fc3f7;
  font-weight: bold;
  min-width: 32px;
}

.exp-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #4fc3f7, #29b6f6);
  transition: width 0.3s ease;
}
</style>
