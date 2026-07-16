<script setup lang="ts">
// 话游 - 存档管理页面

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSaveStore } from "@/stores/save.store";
import { useGameStore } from "@/stores/game.store";
import BaseModal from "@/components/common/BaseModal.vue";

const router = useRouter();
const saveStore = useSaveStore();
const gameStore = useGameStore();

// 自定义弹窗状态
const modalVisible = ref(false);
const modalTitle = ref("");
const modalText = ref("");
// 删除确认弹窗状态
const deleteConfirmVisible = ref(false);
const pendingDeleteSlot = ref<number | null>(null);

onMounted(() => {
  saveStore.initSlots();
});

function showModal(title: string, text: string) {
  modalTitle.value = title;
  modalText.value = text;
  modalVisible.value = true;
}

function handleSave(slotId: number) {
  if (saveStore.saveToSlot(slotId)) {
    showModal("存档成功", "存档已成功保存到槽位 " + slotId);
  }
}

function handleLoad(slotId: number) {
  if (saveStore.loadFromSlot(slotId)) {
    router.push("/game");
  } else {
    showModal("读取失败", "存档读取失败，请重试");
  }
}

function handleDelete(slotId: number) {
  pendingDeleteSlot.value = slotId;
  deleteConfirmVisible.value = true;
}

function confirmDelete() {
  if (pendingDeleteSlot.value !== null) {
    saveStore.deleteSlot(pendingDeleteSlot.value);
    pendingDeleteSlot.value = null;
  }
}

function goBack() {
  // 如果游戏已开始，返回游戏界面；否则返回首页
  if (gameStore.game.isStarted) {
    router.push("/game");
  } else {
    router.push("/");
  }
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

    <!-- 信息提示弹窗 -->
    <BaseModal
      :show="modalVisible"
      :title="modalTitle"
      confirm-text="知道了"
      @close="modalVisible = false"
    >
      <p class="modal-text">{{ modalText }}</p>
    </BaseModal>

    <!-- 删除确认弹窗 -->
    <BaseModal
      :show="deleteConfirmVisible"
      title="删除存档"
      :show-cancel="true"
      confirm-text="确认删除"
      cancel-text="取消"
      @close="deleteConfirmVisible = false"
      @confirm="confirmDelete"
    >
      <p class="modal-text">确定要删除这个存档吗？此操作不可恢复。</p>
    </BaseModal>
  </div>
</template>

<style scoped>
.save-view {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
}

.modal-text {
  margin: 0;
  color: #ccc;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
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

@media (max-width: 768px) {
  .save-header {
    padding: 12px 16px;
    gap: 12px;
  }

  .back-button {
    padding: 6px 12px;
    font-size: 13px;
  }

  .save-header h1 {
    font-size: 20px;
  }

  .save-content {
    padding: 16px;
  }

  .save-slot {
    padding: 16px;
  }

  .slot-status {
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .slot-actions {
    flex-wrap: wrap;
  }

  .action-button {
    padding: 10px 12px;
    font-size: 13px;
    min-height: 40px;
  }
}

@media (max-width: 480px) {
  .save-header {
    padding: 10px 12px;
  }

  .save-header h1 {
    font-size: 18px;
  }

  .save-content {
    padding: 12px;
  }

  .save-slots {
    gap: 12px;
  }

  .save-slot {
    padding: 14px;
    border-radius: 10px;
  }

  .slot-header {
    margin-bottom: 10px;
  }

  .slot-id {
    font-size: 15px;
  }

  .slot-info {
    margin-bottom: 12px;
  }

  .slot-name {
    font-size: 15px;
  }

  .slot-actions {
    gap: 6px;
  }

  .action-button {
    padding: 10px 8px;
    font-size: 13px;
    flex: 1 1 calc(50% - 3px);
    min-height: 44px;
  }
}
</style>
