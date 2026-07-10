// 话游 - 游戏主状态 Store

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  TimeState,
  TimePeriod,
  GameState,
} from "@shared/types/game.types";
import { TIME_PERIODS, TIME_PERIOD_NAMES } from "@shared/constants/game.enum";

export const useGameStore = defineStore("game", () => {
  // ==================== 状态 ====================

  const time = ref<TimeState>({
    day: 1,
    period: "morning",
    totalDays: 20,
  });

  const game = ref<GameState>({
    isStarted: false,
    isPaused: false,
    currentChapter: 1,
    currentEvent: undefined,
    history: [],
  });

  const flags = ref<string[]>([]);

  // ==================== 计算属性 ====================

  const periodName = computed(() => TIME_PERIOD_NAMES[time.value.period]);

  const periodIndex = computed(() => TIME_PERIODS.indexOf(time.value.period));

  const dayProgress = computed(
    () => (time.value.day / time.value.totalDays) * 100,
  );

  const isLastPeriod = computed(() => time.value.period === "night");

  const isLastDay = computed(() => time.value.day >= time.value.totalDays);

  // ==================== 操作 ====================

  function advancePeriod() {
    const currentIndex = TIME_PERIODS.indexOf(time.value.period);
    if (currentIndex < TIME_PERIODS.length - 1) {
      time.value.period = TIME_PERIODS[currentIndex + 1];
    } else {
      // 进入下一天
      time.value.day++;
      time.value.period = TIME_PERIODS[0];
    }
  }

  function advanceTime(periods: number = 1) {
    for (let i = 0; i < periods; i++) {
      advancePeriod();
    }
  }

  function advanceDays(days: number) {
    time.value.day += days;
    if (time.value.day > time.value.totalDays) {
      time.value.day = time.value.totalDays;
    }
  }

  function setPeriod(period: TimePeriod) {
    time.value.period = period;
  }

  function setDay(day: number) {
    time.value.day = Math.max(1, Math.min(day, time.value.totalDays));
  }

  function startGame() {
    game.value.isStarted = true;
    game.value.isPaused = false;
    time.value = { day: 1, period: "morning", totalDays: 20 };
    game.value.history = [];
    flags.value = [];
  }

  function pauseGame() {
    game.value.isPaused = true;
  }

  function resumeGame() {
    game.value.isPaused = false;
  }

  function endGame() {
    game.value.isStarted = false;
    game.value.isPaused = false;
  }

  function addHistory(eventId: string) {
    if (!game.value.history.includes(eventId)) {
      game.value.history.push(eventId);
    }
  }

  function hasHistory(eventId: string): boolean {
    return game.value.history.includes(eventId);
  }

  function addFlag(flag: string) {
    if (!flags.value.includes(flag)) {
      flags.value.push(flag);
    }
  }

  function removeFlag(flag: string) {
    const index = flags.value.indexOf(flag);
    if (index !== -1) {
      flags.value.splice(index, 1);
    }
  }

  function hasFlag(flag: string): boolean {
    return flags.value.includes(flag);
  }

  function reset() {
    time.value = { day: 1, period: "morning", totalDays: 20 };
    game.value = {
      isStarted: false,
      isPaused: false,
      currentChapter: 1,
      currentEvent: undefined,
      history: [],
    };
    flags.value = [];
  }

  return {
    // 状态
    time,
    game,
    flags,
    // 计算属性
    periodName,
    periodIndex,
    dayProgress,
    isLastPeriod,
    isLastDay,
    // 操作
    advancePeriod,
    advanceTime,
    advanceDays,
    setPeriod,
    setDay,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    addHistory,
    hasHistory,
    addFlag,
    removeFlag,
    hasFlag,
    reset,
  };
});
