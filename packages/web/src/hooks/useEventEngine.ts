// 话游 - 事件引擎 Hook

import { ref } from "vue";
import type {
  GameEvent,
  EventOption,
  EventCondition,
} from "@shared/types/game.types";
import { usePlayerStore } from "@/stores/player.store";
import { useGameStore } from "@/stores/game.store";
import { useSaveStore } from "@/stores/save.store";
import {
  checkStatusCondition,
  isPayday,
  isMonthEnd,
} from "@shared/utils/calculator";
import { AUTO_SAVE_CONFIG } from "@shared/constants/game.enum";
import chapter1Events from "@/data/events/chapter1.json";
import dateEvents from "@/data/events/date-events.json";
import dailyEvents from "@/data/events/daily-events.json";

export interface EndingResult {
  id: string;
  name: string;
  type: "good" | "neutral" | "bad";
  grade: "S" | "A" | "B" | "C" | "D";
  score: number;
  description: string;
}

export function useEventEngine() {
  const playerStore = usePlayerStore();
  const gameStore = useGameStore();
  const saveStore = useSaveStore();

  const allEvents = ref<GameEvent[]>([
    ...(chapter1Events as GameEvent[]),
    ...(dateEvents as GameEvent[]),
    ...(dailyEvents as GameEvent[]),
  ]);
  const currentEvent = ref<GameEvent | null>(null);
  const eventHistory = ref<string[]>([]);
  const specialDateHint = ref("");
  const showSpecialDateHint = ref(false);
  const chapterEnded = ref(false);
  const endingResult = ref<EndingResult | null>(null);

  function showHint(hint: string, duration: number = 2500) {
    specialDateHint.value = hint;
    showSpecialDateHint.value = true;
    setTimeout(() => {
      showSpecialDateHint.value = false;
    }, duration);
  }

  function checkEventCondition(condition?: EventCondition): boolean {
    if (!condition) return true;

    if (!checkStatusCondition(playerStore.status, condition)) {
      return false;
    }

    if (condition.period && !condition.period.includes(gameStore.time.period)) {
      return false;
    }

    if (condition.dayOfWeek) {
      if (!condition.dayOfWeek.includes(gameStore.time.dayOfWeek)) {
        return false;
      }
    }

    if (condition.days) {
      if (!condition.days.includes(gameStore.time.day)) {
        return false;
      }
    }

    if (condition.minDay && gameStore.time.day < condition.minDay) {
      return false;
    }
    if (condition.maxDay && gameStore.time.day > condition.maxDay) {
      return false;
    }

    if (condition.skills) {
      for (const [skillId, minLevel] of Object.entries(condition.skills)) {
        if (playerStore.getSkillLevel(skillId as any) < minLevel) {
          return false;
        }
      }
    }

    if (condition.flags) {
      for (const flag of condition.flags) {
        if (!gameStore.hasFlag(flag)) {
          return false;
        }
      }
    }

    if (condition.excludeFlags) {
      for (const flag of condition.excludeFlags) {
        if (gameStore.hasFlag(flag)) {
          return false;
        }
      }
    }

    return true;
  }

  function getAvailableEvents(): GameEvent[] {
    return allEvents.value.filter((event) => {
      if (!checkEventCondition(event.condition)) {
        return false;
      }

      if (event.cooldown && eventHistory.value.includes(event.id)) {
        const lastTriggerIndex = eventHistory.value.lastIndexOf(event.id);
        const eventsSince = eventHistory.value.length - lastTriggerIndex;
        if (eventsSince < event.cooldown) {
          return false;
        }
      }

      if (
        eventHistory.value.includes(event.id) &&
        event.id.startsWith("date_")
      ) {
        return false;
      }

      return true;
    });
  }

  function getMainEvents(): GameEvent[] {
    return allEvents.value.filter(
      (event) => event.isMain && checkEventCondition(event.condition),
    );
  }

  function getRandomEvents(): GameEvent[] {
    return allEvents.value.filter(
      (event) => event.isRandom && checkEventCondition(event.condition),
    );
  }

  function getDateEvents(): GameEvent[] {
    return allEvents.value.filter(
      (event) =>
        event.id.startsWith("date_") && checkEventCondition(event.condition),
    );
  }

  function getDailyEvents(): GameEvent[] {
    return allEvents.value.filter(
      (event) =>
        event.id.startsWith("daily_") && checkEventCondition(event.condition),
    );
  }

  function selectNextEvent(): GameEvent | null {
    if (chapterEnded.value) return null;

    const dateEvts = getDateEvents();
    if (dateEvts.length > 0) {
      return dateEvts[0];
    }

    const mainEvents = getMainEvents();
    if (mainEvents.length > 0) {
      return mainEvents[0];
    }

    const randomEvents = getRandomEvents();
    if (randomEvents.length > 0 && Math.random() < 0.4) {
      const totalWeight = randomEvents.reduce(
        (sum, event) => sum + (event.priority || 30),
        0,
      );
      let random = Math.random() * totalWeight;

      for (const event of randomEvents) {
        random -= event.priority || 30;
        if (random <= 0) {
          return event;
        }
      }
    }

    const dailyEvts = getDailyEvents();
    if (dailyEvts.length > 0) {
      return dailyEvts[0];
    }

    return null;
  }

  function triggerEvent(eventId: string): GameEvent | null {
    const event = allEvents.value.find((e) => e.id === eventId);
    if (event && checkEventCondition(event.condition)) {
      currentEvent.value = event;
      return event;
    }
    return null;
  }

  function applyOptionEffects(option: EventOption) {
    playerStore.applyChange(option.effects);

    if (option.skillEffects) {
      Object.entries(option.skillEffects).forEach(([skillId, experience]) => {
        playerStore.addSkillExperience(skillId as any, experience);
      });
    }

    if (option.flags) {
      option.flags.forEach((flag) => {
        if (flag === "first_weekend_chosen") {
          gameStore.addFlag("first_weekend_done");
        }
        gameStore.addFlag(flag);
      });
    }

    if (currentEvent.value) {
      eventHistory.value.push(currentEvent.value.id);
      gameStore.addHistory(currentEvent.value.id);
    }
  }

  function checkAndTriggerAutoSave() {
    gameStore.incrementOptionsCount();

    if (
      AUTO_SAVE_CONFIG.saveEveryNOptions &&
      gameStore.optionsSinceLastSave >= AUTO_SAVE_CONFIG.saveEveryNOptions
    ) {
      saveStore.autoSave();
    }
  }

  function calculateEnding(): EndingResult {
    const { mood, health, money } = playerStore.status;
    const progLevel = playerStore.getSkillLevel("programming");
    const opLevel = playerStore.getSkillLevel("operation");
    const socialLevel = playerStore.getSkillLevel("social");

    const moodWeight = Math.min(mood / 100, 1.0);
    const skillWeight = Math.min((progLevel + opLevel) / 10, 1.0);
    const moneyWeight = Math.min(money / 10000, 1.0);
    const socialWeight = Math.min(socialLevel / 10, 1.0);

    let score =
      moodWeight * 0.3 +
      skillWeight * 0.3 +
      moneyWeight * 0.2 +
      socialWeight * 0.2;

    let positiveMod = 0;
    let negativeMod = 0;
    if (mood > 80) positiveMod += 0.1;
    if (progLevel + opLevel >= 3) positiveMod += 0.1;
    if (money > 8000) positiveMod += 0.1;
    if (socialLevel >= 8) positiveMod += 0.1;

    if (mood < 30) negativeMod += 0.1;
    if (progLevel + opLevel === 0) negativeMod += 0.1;
    if (money < 2000) negativeMod += 0.1;
    if (socialLevel < 3) negativeMod += 0.1;

    score = Math.max(0, Math.min(1, score + positiveMod - negativeMod));

    const isProgrammer = gameStore.hasFlag("route_programmer");
    const isPartTime = gameStore.hasFlag("route_part_time");
    const isOperation = gameStore.hasFlag("route_operation");
    const isDelay = gameStore.hasFlag("route_delay");

    let id: string,
      name: string,
      type: "good" | "neutral" | "bad",
      description: string;

    if (health <= 20 || (isDelay && mood < 40) || mood <= 10) {
      id = "ending_003";
      name = "浑浑噩噩";
      type = "bad";
      description =
        "你又像当年一样，稀里糊涂毕了业。那个关于「重来一次」的梦，你渐渐记不清了……";
    } else if (isProgrammer || isOperation) {
      if (mood > 50 || progLevel >= 1 || opLevel >= 1) {
        id = "ending_001";
        name = "踌躇满志";
        type = "good";
        description =
          "你收拾好行李，带着全新的目标踏出校门。这一次，你不会再错过了。";
      } else {
        id = "ending_003";
        name = "浑浑噩噩";
        type = "bad";
        description =
          "虽然做出了选择，但你并没有真正努力。毕业那天，你依然感到迷茫。";
      }
    } else if (isPartTime) {
      id = "ending_002";
      name = "稳中求进";
      type = "neutral";
      description =
        "白天在工厂上班，晚上回家自学编程。日子很苦，但每多学一天，就离目标更近一步。";
    } else {
      if (score >= 0.5) {
        id = "ending_002";
        name = "稳中求进";
        type = "neutral";
        description =
          "你度过了毕业前的20天，虽然没有特别努力，但也没有完全荒废。未来还有机会。";
      } else {
        id = "ending_003";
        name = "浑浑噩噩";
        type = "bad";
        description =
          "20天很快就过去了，你好像什么都没做。又一次，你站在了人生的十字路口。";
      }
    }

    let grade: "S" | "A" | "B" | "C" | "D";
    if (score >= 0.8) grade = "S";
    else if (score >= 0.6) grade = "A";
    else if (score >= 0.4) grade = "B";
    else if (score >= 0.2) grade = "C";
    else grade = "D";

    if (type === "good" && grade === "D") grade = "B";
    if (type === "bad" && grade === "S") grade = "C";

    return { id, name, type, grade, score, description };
  }

  function checkChapterEnd(): boolean {
    if (gameStore.time.day > gameStore.time.totalDays) {
      endingResult.value = calculateEnding();
      chapterEnded.value = true;
      currentEvent.value = null;
      saveStore.autoSave();
      return true;
    }
    return false;
  }

  function handleDayChange(wasOvertime: boolean, isExplicitSleep: boolean) {
    const hints: string[] = [];

    if (wasOvertime && !isExplicitSleep) {
      playerStore.applyOvertimePenalty();
      playerStore.sleepAfterOvertime();
      gameStore.recordOvertimeSleep();
      hints.push("🌙 熬夜了！精力恢复不足，健康和心情下降");
    } else {
      const recovery = playerStore.sleep();
      gameStore.recordRegularSleep();
      hints.push(`😴 好好休息，精力+${recovery.energy}，心情+${recovery.mood}`);

      if (gameStore.time.consecutiveRegularSleep >= 7) {
        hints.push(
          `✨ 连续${gameStore.time.consecutiveRegularSleep}天规律作息！恢复加成！`,
        );
      }
    }

    const newDay = gameStore.time.day;

    if (isPayday(newDay)) {
      if (
        gameStore.hasFlag("route_part_time") ||
        gameStore.hasFlag("route_work_study")
      ) {
        const salary = playerStore.applyPayday();
        if (salary) {
          setTimeout(
            () => showHint(`💰 发薪日！工资到账 +¥${salary}`, 3000),
            2600,
          );
        }
      }
    }

    if (isMonthEnd(newDay)) {
      const bonus = playerStore.applyMonthlySummary();
      setTimeout(
        () =>
          showHint(
            `📊 月末总结：全技能经验+${bonus.exp}，心情+${bonus.mood}`,
            3000,
          ),
        2600,
      );
    }

    if (hints.length > 0) {
      showHint(hints.join(" | "), 2800);
    }

    if (AUTO_SAVE_CONFIG.saveOnMorning) {
      setTimeout(() => saveStore.autoSave(), 500);
    }
  }

  function handleOptionSelect(option: EventOption) {
    applyOptionEffects(option);

    const prevPeriod = gameStore.time.period;
    const prevDay = gameStore.time.day;
    const isExplicitSleep = option.flags?.includes("action_sleep");
    const skipToNextDay = option.skipPeriods !== undefined || isExplicitSleep;

    if (skipToNextDay) {
      const wasOvertime = gameStore.goToSleep();
      handleDayChange(wasOvertime, true);
    } else {
      const timeAdvance = option.timeAdvance || 1;
      let dayChanged = false;
      let wasOvertime = false;

      for (let i = 0; i < timeAdvance; i++) {
        const beforePeriod = gameStore.time.period;
        gameStore.advancePeriod();
        if (gameStore.time.day > prevDay) {
          dayChanged = true;
          wasOvertime = beforePeriod === "night";
          break;
        }
      }

      if (dayChanged) {
        handleDayChange(wasOvertime, false);
      } else if (
        prevPeriod === "evening" &&
        gameStore.time.period === "night" &&
        !isExplicitSleep
      ) {
        showHint("🌙 夜深了，早点休息吧...熬夜会影响精力和健康", 2000);
      }
    }

    checkAndTriggerAutoSave();

    if (checkChapterEnd()) {
      return;
    }

    if (option.nextEvent) {
      if (option.nextEvent === "chapter_end") {
        endingResult.value = calculateEnding();
        chapterEnded.value = true;
        currentEvent.value = null;
        if (AUTO_SAVE_CONFIG.saveOnChapterEnd) {
          saveStore.autoSave();
        }
      } else {
        triggerEvent(option.nextEvent);
      }
    } else {
      currentEvent.value = selectNextEvent();
    }
  }

  function startGame() {
    chapterEnded.value = false;
    endingResult.value = null;
    const firstEvent = allEvents.value.find((e) => e.id === "scene_0_1");
    if (firstEvent) {
      currentEvent.value = firstEvent;
    }
  }

  function reset() {
    currentEvent.value = null;
    eventHistory.value = [];
    specialDateHint.value = "";
    showSpecialDateHint.value = false;
    chapterEnded.value = false;
    endingResult.value = null;
  }

  return {
    currentEvent,
    allEvents,
    eventHistory,
    specialDateHint,
    showSpecialDateHint,
    chapterEnded,
    endingResult,
    checkEventCondition,
    getAvailableEvents,
    getMainEvents,
    getRandomEvents,
    getDateEvents,
    getDailyEvents,
    selectNextEvent,
    triggerEvent,
    handleOptionSelect,
    calculateEnding,
    checkChapterEnd,
    startGame,
    reset,
  };
}
