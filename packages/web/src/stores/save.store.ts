// 话游 - 存档管理 Store

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SaveData, SaveSlot } from "@shared/types/game.types";
import {
  SAVE_STORAGE_KEY,
  MAX_SAVE_SLOTS,
  GAME_VERSION,
} from "@shared/constants/game.enum";
import { usePlayerStore } from "./player.store";
import { useGameStore } from "./game.store";

export const useSaveStore = defineStore("save", () => {
  // ==================== 状态 ====================

  const slots = ref<SaveSlot[]>([]);
  const currentSlot = ref<number | null>(null);

  // ==================== 计算属性 ====================

  const isEmpty = computed(() => slots.value.every((slot) => slot.isEmpty));

  const filledSlots = computed(() =>
    slots.value.filter((slot) => !slot.isEmpty),
  );

  const emptySlots = computed(() => slots.value.filter((slot) => slot.isEmpty));

  // ==================== 操作 ====================

  function initSlots() {
    const savedData = localStorage.getItem(SAVE_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        slots.value = parsed;
      } catch {
        createEmptySlots();
      }
    } else {
      createEmptySlots();
    }
  }

  function createEmptySlots() {
    slots.value = Array.from({ length: MAX_SAVE_SLOTS }, (_, index) => ({
      id: index + 1,
      isEmpty: true,
      data: undefined,
    }));
  }

  function saveToSlot(slotId: number, name?: string): boolean {
    const playerStore = usePlayerStore();
    const gameStore = useGameStore();

    const saveData: SaveData = {
      id: generateSaveId(),
      name: name || `存档 ${slotId}`,
      timestamp: Date.now(),
      day: gameStore.time.day,
      period: gameStore.time.period,
      status: { ...playerStore.status },
      skills: playerStore.skills.map((skill) => ({ ...skill })),
      flags: [...gameStore.flags],
      currentEvent: gameStore.game.currentEvent,
      version: GAME_VERSION,
    };

    const slotIndex = slots.value.findIndex((slot) => slot.id === slotId);
    if (slotIndex !== -1) {
      slots.value[slotIndex] = {
        id: slotId,
        isEmpty: false,
        data: saveData,
      };
      saveToLocalStorage();
      return true;
    }
    return false;
  }

  function loadFromSlot(slotId: number): boolean {
    const slot = slots.value.find((s) => s.id === slotId);
    if (!slot || slot.isEmpty || !slot.data) {
      return false;
    }

    const playerStore = usePlayerStore();
    const gameStore = useGameStore();

    // 恢复状态
    playerStore.status = { ...slot.data.status };
    playerStore.skills = slot.data.skills.map((skill) => ({ ...skill }));

    // 恢复游戏状态
    gameStore.time.day = slot.data.day;
    gameStore.time.period = slot.data.period;
    gameStore.flags = [...slot.data.flags];
    gameStore.game.currentEvent = slot.data.currentEvent;
    gameStore.game.isStarted = true;

    currentSlot.value = slotId;
    return true;
  }

  function deleteSlot(slotId: number): boolean {
    const slotIndex = slots.value.findIndex((slot) => slot.id === slotId);
    if (slotIndex !== -1) {
      slots.value[slotIndex] = {
        id: slotId,
        isEmpty: true,
        data: undefined,
      };
      saveToLocalStorage();
      return true;
    }
    return false;
  }

  function getSlotInfo(slotId: number): SaveSlot | undefined {
    return slots.value.find((slot) => slot.id === slotId);
  }

  function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function saveToLocalStorage() {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(slots.value));
  }

  function generateSaveId(): string {
    return `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function reset() {
    createEmptySlots();
    currentSlot.value = null;
    localStorage.removeItem(SAVE_STORAGE_KEY);
  }

  return {
    // 状态
    slots,
    currentSlot,
    // 计算属性
    isEmpty,
    filledSlots,
    emptySlots,
    // 操作
    initSlots,
    saveToSlot,
    loadFromSlot,
    deleteSlot,
    getSlotInfo,
    formatTimestamp,
    reset,
  };
});
