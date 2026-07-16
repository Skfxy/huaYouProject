// 话游 - 游戏主状态 Store

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  TimeState,
  TimePeriod,
  GameState,
} from "@shared/types/game.types";
import {
  TIME_PERIODS,
  TIME_PERIOD_NAMES,
  DAYS_OF_WEEK,
} from "@shared/constants/game.enum";
import { getDayOfWeek } from "@shared/utils/calculator";

export const useGameStore = defineStore("game", () => {
  // ==================== 状态 ====================

  const time = ref<TimeState>({
    day: 0,
    period: "night",
    totalDays: 20,
    dayOfWeek: getDayOfWeek(0),
    consecutiveRegularSleep: 0,
    stayedUpLate: false,
  });

  const game = ref<GameState>({
    isStarted: false,
    isPaused: false,
    currentChapter: 1,
    currentEvent: undefined,
    history: [],
  });

  const flags = ref<string[]>([]);

  // 用于自动存档的选项计数器
  const optionsSinceLastSave = ref(0);

  // ==================== 计算属性 ====================

  const periodName = computed(() => TIME_PERIOD_NAMES[time.value.period]);

  const dayOfWeekName = computed(() => DAYS_OF_WEEK[time.value.dayOfWeek]);

  const periodIndex = computed(() => TIME_PERIODS.indexOf(time.value.period));

  const dayProgress = computed(
    () => (time.value.day / time.value.totalDays) * 100,
  );

  const isLastPeriod = computed(() => time.value.period === "night");

  const isLastDay = computed(() => time.value.day >= time.value.totalDays);

  const isWeekend = computed(
    () => time.value.dayOfWeek === 0 || time.value.dayOfWeek === 6,
  );

  const isSaturday = computed(() => time.value.dayOfWeek === 6);

  const isSunday = computed(() => time.value.dayOfWeek === 0);

  const isPayday = computed(() => time.value.day % 30 === 1);

  const isMonthEnd = computed(() => time.value.day % 30 === 0);

  // ==================== 操作 ====================

  function advancePeriod() {
    const currentIndex = TIME_PERIODS.indexOf(time.value.period);
    if (currentIndex < TIME_PERIODS.length - 1) {
      // 进入下一个时段
      const nextPeriod = TIME_PERIODS[currentIndex + 1];
      time.value.period = nextPeriod;

      // 进入深夜时段，标记可能熬夜
      if (nextPeriod === "night") {
        time.value.stayedUpLate = true;
      }
    } else {
      // 进入下一天 - 从night进入第二天morning
      advanceToNextDay();
    }
  }

  function advanceToNextDay() {
    time.value.day++;
    time.value.period = TIME_PERIODS[0];
    time.value.dayOfWeek = getDayOfWeek(time.value.day);
  }

  /**
   * 记录规律作息（日期递增已由advancePeriod处理）
   */
  function recordRegularSleep() {
    time.value.consecutiveRegularSleep++;
    time.value.stayedUpLate = false;
  }

  /**
   * 记录熬夜（日期递增已由advancePeriod处理）
   */
  function recordOvertimeSleep() {
    time.value.consecutiveRegularSleep = 0;
    time.value.stayedUpLate = false;
  }

  /**
   * 直接睡觉（从当前时段跳到第二天早晨）
   * 用于选项中显式选择睡觉
   */
  function goToSleep() {
    const wasOvertime = time.value.period === "night";
    time.value.day++;
    time.value.period = TIME_PERIODS[0];
    time.value.dayOfWeek = getDayOfWeek(time.value.day);
    if (wasOvertime) {
      time.value.consecutiveRegularSleep = 0;
    } else {
      time.value.consecutiveRegularSleep++;
    }
    time.value.stayedUpLate = false;
    return wasOvertime;
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
    time.value.dayOfWeek = getDayOfWeek(time.value.day);
  }

  function setPeriod(period: TimePeriod) {
    time.value.period = period;
  }

  function setDay(day: number) {
    time.value.day = Math.max(1, Math.min(day, time.value.totalDays));
    time.value.dayOfWeek = getDayOfWeek(time.value.day);
  }

  function incrementOptionsCount() {
    optionsSinceLastSave.value++;
  }

  function resetOptionsCount() {
    optionsSinceLastSave.value = 0;
  }

  function startGame() {
    game.value.isStarted = true;
    game.value.isPaused = false;
    time.value = {
      day: 0,
      period: "night",
      totalDays: 20,
      dayOfWeek: getDayOfWeek(0),
      consecutiveRegularSleep: 0,
      stayedUpLate: false,
    };
    game.value.history = [];
    flags.value = [];
    optionsSinceLastSave.value = 0;
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
    time.value = {
      day: 0,
      period: "night",
      totalDays: 20,
      dayOfWeek: getDayOfWeek(0),
      consecutiveRegularSleep: 0,
      stayedUpLate: false,
    };
    game.value = {
      isStarted: false,
      isPaused: false,
      currentChapter: 1,
      currentEvent: undefined,
      history: [],
    };
    flags.value = [];
    optionsSinceLastSave.value = 0;
  }

  return {
    // 状态
    time,
    game,
    flags,
    optionsSinceLastSave,
    // 计算属性
    periodName,
    dayOfWeekName,
    periodIndex,
    dayProgress,
    isLastPeriod,
    isLastDay,
    isWeekend,
    isSaturday,
    isSunday,
    isPayday,
    isMonthEnd,
    // 操作
    advancePeriod,
    advanceToNextDay,
    recordRegularSleep,
    recordOvertimeSleep,
    goToSleep,
    advanceTime,
    advanceDays,
    setPeriod,
    setDay,
    incrementOptionsCount,
    resetOptionsCount,
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
