// 话游 - 存档管理 Store

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SaveData, SaveSlot } from "@shared/types/game.types";
import {
  SAVE_STORAGE_KEY,
  AUTO_SAVE_STORAGE_KEY,
  MAX_SAVE_SLOTS,
  GAME_VERSION,
  AUTO_SAVE_CONFIG,
} from "@shared/constants/game.enum";
import { usePlayerStore } from "./player.store";
import { useGameStore } from "./game.store";

export const useSaveStore = defineStore("save", () => {
  // ==================== 状态 ====================

  const slots = ref<SaveSlot[]>([]);
  const currentSlot = ref<number | null>(null);
  const autoSaveData = ref<SaveData | null>(null);
  const showAutoSaveHint = ref(false);

  // ==================== 计算属性 ====================

  const isEmpty = computed(() => slots.value.every((slot) => slot.isEmpty));

  const filledSlots = computed(() =>
    slots.value.filter((slot) => !slot.isEmpty),
  );

  const emptySlots = computed(() => slots.value.filter((slot) => slot.isEmpty));

  const hasAutoSave = computed(() => autoSaveData.value !== null);

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

    const autoSavedData = localStorage.getItem(AUTO_SAVE_STORAGE_KEY);
    if (autoSavedData) {
      try {
        autoSaveData.value = JSON.parse(autoSavedData);
      } catch {
        autoSaveData.value = null;
      }
    }
  }

  function createEmptySlots() {
    slots.value = Array.from({ length: MAX_SAVE_SLOTS }, (_, index) => ({
      id: index + 1,
      isEmpty: true,
      data: undefined,
    }));
  }

  function createSaveData(
    name?: string,
    isAutoSave: boolean = false,
  ): SaveData {
    const playerStore = usePlayerStore();
    const gameStore = useGameStore();

    return {
      id: generateSaveId(),
      name: name || (isAutoSave ? "自动存档" : "手动存档"),
      timestamp: Date.now(),
      day: gameStore.time.day,
      period: gameStore.time.period,
      dayOfWeek: gameStore.time.dayOfWeek,
      consecutiveRegularSleep: gameStore.time.consecutiveRegularSleep,
      stayedUpLate: gameStore.time.stayedUpLate,
      status: { ...playerStore.status },
      skills: playerStore.skills.map((skill) => ({ ...skill })),
      flags: [...gameStore.flags],
      currentEvent: gameStore.game.currentEvent,
      version: GAME_VERSION,
      autoSave: isAutoSave,
    };
  }

  function saveToSlot(slotId: number, name?: string): boolean {
    const saveData = createSaveData(name || `存档 ${slotId}`);

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

  function autoSave(): boolean {
    if (!AUTO_SAVE_CONFIG.enabled) return false;

    const saveData = createSaveData("自动存档", true);
    autoSaveData.value = saveData;
    localStorage.setItem(AUTO_SAVE_STORAGE_KEY, JSON.stringify(saveData));

    try {
      const gameStore = useGameStore();
      gameStore.resetOptionsCount();
    } catch {
      // Store might not be initialized yet
    }

    showAutoSaveHint.value = true;
    setTimeout(() => {
      showAutoSaveHint.value = false;
    }, 1500);
    return true;
  }

  function loadFromSlot(slotId: number): boolean {
    const slot = slots.value.find((s) => s.id === slotId);
    if (!slot || slot.isEmpty || !slot.data) {
      return false;
    }
    return loadSaveData(slot.data, slotId);
  }

  function loadAutoSave(): boolean {
    if (!autoSaveData.value) return false;
    return loadSaveData(autoSaveData.value, null);
  }

  function loadSaveData(data: SaveData, slotId: number | null): boolean {
    const playerStore = usePlayerStore();
    const gameStore = useGameStore();

    playerStore.status = { ...data.status };
    playerStore.skills = data.skills.map((skill) => ({ ...skill }));

    gameStore.time.day = data.day;
    gameStore.time.period = data.period;
    gameStore.time.dayOfWeek = data.dayOfWeek ?? 5;
    gameStore.time.consecutiveRegularSleep = data.consecutiveRegularSleep ?? 0;
    gameStore.time.stayedUpLate = data.stayedUpLate ?? false;
    gameStore.flags = [...data.flags];
    gameStore.game.currentEvent = data.currentEvent;
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

  function deleteAutoSave() {
    autoSaveData.value = null;
    localStorage.removeItem(AUTO_SAVE_STORAGE_KEY);
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
    autoSaveData.value = null;
    localStorage.removeItem(SAVE_STORAGE_KEY);
    localStorage.removeItem(AUTO_SAVE_STORAGE_KEY);
  }

  return {
    // 状态
    slots,
    currentSlot,
    autoSaveData,
    showAutoSaveHint,
    // 计算属性
    isEmpty,
    filledSlots,
    emptySlots,
    hasAutoSave,
    // 操作
    initSlots,
    createSaveData,
    saveToSlot,
    autoSave,
    loadFromSlot,
    loadAutoSave,
    loadSaveData,
    deleteSlot,
    deleteAutoSave,
    getSlotInfo,
    formatTimestamp,
    reset,
  };
});
