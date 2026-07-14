<script setup lang="ts">
import { computed } from "vue";
import BaseModal from "@/components/common/BaseModal.vue";
import { usePlayerStore } from "@/stores/player.store";
import { useGameStore } from "@/stores/game.store";
import {
  getEnergyEfficiency,
  getMoodEfficiency,
  getHealthEfficiency,
  getOverallEfficiency,
} from "@shared/utils/calculator";

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const playerStore = usePlayerStore();
const gameStore = useGameStore();

const statusDetails = computed(() => {
  const { energy, mood, health, money } = playerStore.status;
  return [
    {
      key: "energy",
      name: "精力",
      icon: "⚡",
      value: energy,
      max: 100,
      description: getStatusDescription("energy", energy),
      efficiency: getEnergyEfficiency(energy),
      color: energy > 70 ? "#4caf50" : energy > 30 ? "#ffc107" : "#f44336",
    },
    {
      key: "mood",
      name: "心情",
      icon: "😊",
      value: mood,
      max: 100,
      description: getStatusDescription("mood", mood),
      efficiency: getMoodEfficiency(mood),
      color: mood > 70 ? "#4caf50" : mood > 30 ? "#ffc107" : "#f44336",
    },
    {
      key: "health",
      name: "健康",
      icon: "❤️",
      value: health,
      max: 100,
      description: getStatusDescription("health", health),
      efficiency: getHealthEfficiency(health),
      color: health > 70 ? "#4caf50" : health > 40 ? "#ffc107" : "#f44336",
    },
    {
      key: "money",
      name: "存款",
      icon: "💰",
      value: money,
      max: null,
      description:
        money < 2000
          ? "资金紧张，注意节约"
          : money < 5000
            ? "资金尚可"
            : "资金充裕",
      efficiency: 1,
      color: "#4fc3f7",
    },
  ];
});

const overallEff = computed(() =>
  Math.round(getOverallEfficiency(playerStore.status) * 100),
);

function getStatusDescription(key: string, value: number): string {
  const descriptions: Record<
    string,
    Array<{ min: number; max: number; text: string }>
  > = {
    energy: [
      { min: 80, max: 100, text: "精力充沛，做什么都有效率！" },
      { min: 50, max: 79, text: "精力正常，可以正常活动。" },
      { min: 30, max: 49, text: "有点累了，注意休息。" },
      { min: 0, max: 29, text: "非常疲惫，急需休息！" },
    ],
    mood: [
      { min: 70, max: 100, text: "心情愉悦，学习效率很高！" },
      { min: 40, max: 69, text: "心情平静，正常状态。" },
      { min: 20, max: 39, text: "有点低落，可以做些开心的事。" },
      { min: 0, max: 19, text: "非常沮丧，可能会触发emo事件。" },
    ],
    health: [
      { min: 80, max: 100, text: "身体健康，状态很好！" },
      { min: 50, max: 79, text: "身体还行，注意不要过度劳累。" },
      { min: 20, max: 49, text: "亚健康状态，该锻炼了。" },
      { min: 0, max: 19, text: "身体很差，容易生病！" },
    ],
  };

  const descs = descriptions[key];
  if (!descs) return "";
  return descs.find((d) => value >= d.min && value <= d.max)?.text || "";
}

function getEfficiencyText(eff: number): string {
  if (eff >= 1.5) return "极高 (×1.5)";
  if (eff >= 1.3) return "很高 (×1.3)";
  if (eff >= 1.0) return "正常 (×1.0)";
  if (eff >= 0.7) return "较低 (×0.7)";
  return "很低 (×0.5)";
}
</script>

<template>
  <BaseModal :show="show" title="状态详情" @close="emit('close')">
    <div class="status-detail">
      <div class="efficiency-overview">
        <div class="efficiency-label">综合效率</div>
        <div
          class="efficiency-value"
          :class="{ low: overallEff < 70, high: overallEff >= 130 }"
        >
          {{ overallEff }}%
        </div>
        <div class="efficiency-desc">
          连续规律作息 {{ gameStore.time.consecutiveRegularSleep }} 天
        </div>
      </div>

      <div class="status-list">
        <div
          v-for="status in statusDetails"
          :key="status.key"
          class="status-card"
        >
          <div class="status-header">
            <span class="status-icon">{{ status.icon }}</span>
            <span class="status-name">{{ status.name }}</span>
            <span class="status-value-text" :style="{ color: status.color }">
              {{ status.key === "money" ? `¥${status.value}` : status.value }}
            </span>
          </div>
          <div v-if="status.max" class="status-bar">
            <div
              class="status-bar-fill"
              :style="{
                width: `${(status.value / status.max) * 100}%`,
                background: status.color,
              }"
            ></div>
          </div>
          <div class="status-description">{{ status.description }}</div>
          <div v-if="status.key !== 'money'" class="status-efficiency">
            效率:
            <span
              :style="{ color: status.efficiency >= 1 ? '#4caf50' : '#f44336' }"
            >
              {{ getEfficiencyText(status.efficiency) }}
            </span>
          </div>
        </div>
      </div>

      <div class="tips-section">
        <h4>💡 小贴士</h4>
        <ul>
          <li>精力、心情、健康都会影响学习和工作效率</li>
          <li>熬夜会导致精力恢复不足，还会损害健康</li>
          <li>连续7天规律作息可以获得恢复加成</li>
          <li>周末可以睡懒觉，获得额外精力恢复</li>
        </ul>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.status-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.efficiency-overview {
  text-align: center;
  padding: 16px;
  background: rgba(79, 195, 247, 0.1);
  border-radius: 12px;
}

.efficiency-label {
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
}

.efficiency-value {
  font-size: 36px;
  font-weight: bold;
  color: #4fc3f7;
}

.efficiency-value.low {
  color: #f44336;
}

.efficiency-value.high {
  color: #4caf50;
}

.efficiency-desc {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-card {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-icon {
  font-size: 20px;
}

.status-name {
  color: #aaa;
  flex: 1;
}

.status-value-text {
  font-weight: bold;
  font-size: 16px;
}

.status-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.status-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 3px;
}

.status-description {
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
}

.status-efficiency {
  font-size: 12px;
  color: #666;
}

.tips-section {
  padding: 12px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 8px;
}

.tips-section h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #ffc107;
}

.tips-section ul {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  color: #aaa;
  line-height: 1.8;
}

@media (max-width: 480px) {
  .status-detail {
    gap: 16px;
  }

  .efficiency-overview {
    padding: 12px;
  }

  .efficiency-value {
    font-size: 28px;
  }

  .tips-section ul {
    font-size: 11px;
    line-height: 1.7;
  }
}
</style>
