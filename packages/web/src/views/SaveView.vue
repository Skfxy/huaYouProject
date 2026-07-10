<script setup lang="ts">
// 话游 - 存档管理页面

import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSaveStore } from "@/stores/save.store";
import { useGameStore } from "@/stores/game.store";

const router = useRouter();
const saveStore = useSaveStore();
const gameStore = useGameStore();

onMounted(() => {
  saveStore.initSlots();
});

function handleSave(slotId: number) {
  if (saveStore.saveToSlot(slotId)) {
    alert("存档成功！");
  }
}

function handleLoad(slotId: number) {
  if (saveStore.loadFromSlot(slotId)) {
    router.push("/game");
  } else {
    alert("读取失败！");
  }
}

function handleDelete(slotId: number) {
  if (confirm("确定要删除这个存档吗？")) {
    saveStore.deleteSlot(slotId);
  }
}

function goBack() {
  router.push("/");
}
</script>

<template>
  <div class="save-view">
    <div class="save-header">
      <button class="back-button" @click="goBack">← 返回</button>
      <h1>存档管理</h1>
    </div>

    <div class="save-content">
      <div class="save-slots">
        <div
          v-for="slot in saveStore.slots"
          :key="slot.id"
          class="save-slot"
          :class="{ empty: slot.isEmpty }"
        >
          <div class="slot-header">
            <span class="slot-id">槽位 {{ slot.id }}</span>
            <span v-if="!slot.isEmpty" class="slot-time">
              {{ saveStore.formatTimestamp(slot.data!.timestamp) }}
            </span>
          </div>

          <div v-if="!slot.isEmpty" class="slot-info">
            <div class="slot-details">
              <p class="slot-name">{{ slot.data!.name }}</p>
              <p class="slot-progress">
                第 {{ slot.data!.day }} 天 |
                {{
                  slot.data!.period === "morning"
                    ? "早晨"
                    : slot.data!.period === "afternoon"
                      ? "下午"
                      : slot.data!.period === "evening"
                        ? "晚上"
                        : "深夜"
                }}
              </p>
              <div class="slot-status">
                <span>⚡ {{ slot.data!.status.energy }}</span>
                <span>😊 {{ slot.data!.status.mood }}</span>
                <span>❤️ {{ slot.data!.status.health }}</span>
                <span>💰 ¥{{ slot.data!.status.money }}</span>
              </div>
            </div>
          </div>

          <div v-else class="slot-empty">
            <p>空存档位</p>
          </div>

          <div class="slot-actions">
            <button
              v-if="gameStore.game.isStarted"
              class="action-button save"
              @click="handleSave(slot.id)"
            >
              存档
            </button>
            <button
              v-if="!slot.isEmpty"
              class="action-button load"
              @click="handleLoad(slot.id)"
            >
              读取
            </button>
            <button
              v-if="!slot.isEmpty"
              class="action-button delete"
              @click="handleDelete(slot.id)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.save-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
}

.save-header {
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

.save-header h1 {
  font-size: 24px;
  color: #4fc3f7;
  margin: 0;
}

.save-content {
  flex: 1;
  padding: 24px;
  display: flex;
  justify-content: center;
}

.save-slots {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  width: 100%;
}

.save-slot {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.save-slot:hover {
  border-color: rgba(79, 195, 247, 0.3);
}

.save-slot.empty {
  opacity: 0.6;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.slot-id {
  font-size: 16px;
  font-weight: bold;
  color: #4fc3f7;
}

.slot-time {
  font-size: 12px;
  color: #666;
}

.slot-info {
  margin-bottom: 16px;
}

.slot-name {
  font-size: 16px;
  color: #e0e0e0;
  margin: 0 0 8px;
}

.slot-progress {
  font-size: 14px;
  color: #888;
  margin: 0 0 8px;
}

.slot-status {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #aaa;
}

.slot-empty {
  text-align: center;
  padding: 20px 0;
}

.slot-empty p {
  color: #666;
  margin: 0;
}

.slot-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.save {
  background: rgba(79, 195, 247, 0.2);
  color: #4fc3f7;
}

.action-button.save:hover {
  background: rgba(79, 195, 247, 0.3);
}

.action-button.load {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.action-button.load:hover {
  background: rgba(76, 175, 80, 0.3);
}

.action-button.delete {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.action-button.delete:hover {
  background: rgba(244, 67, 54, 0.3);
}
</style>
