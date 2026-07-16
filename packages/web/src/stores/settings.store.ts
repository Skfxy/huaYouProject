// 话游 - 设置 Store

import { defineStore } from "pinia";
import { ref, watch } from "vue";

const SETTINGS_STORAGE_KEY = "huayou_settings";

export interface GameSettings {
  textSpeed: number; // 打字机速度（ms/字符）
  musicVolume: number; // 背景音乐音量 0-100
  soundVolume: number; // 音效音量 0-100
}

const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 50,
  musicVolume: 80,
  soundVolume: 80,
};

function loadSettings(): GameSettings {
  const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (saved) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }
  return { ...DEFAULT_SETTINGS };
}

export const useSettingsStore = defineStore("settings", () => {
  const settings = ref<GameSettings>(loadSettings());

  function persist() {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings.value));
  }

  function updateSetting<K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K],
  ) {
    settings.value[key] = value;
    persist();
  }

  function reset() {
    settings.value = { ...DEFAULT_SETTINGS };
    persist();
  }

  // 自动持久化
  watch(settings, () => persist(), { deep: true });

  return {
    settings,
    updateSetting,
    reset,
  };
});
