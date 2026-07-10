// 话游 - 事件引擎 Hook

import { ref } from "vue";
import type {
  GameEvent,
  EventOption,
  EventCondition,
} from "@shared/types/game.types";
import { usePlayerStore } from "@/stores/player.store";
import { useGameStore } from "@/stores/game.store";
import { checkStatusCondition } from "@shared/utils/calculator";
import chapter1Events from "@/data/events/chapter1.json";

export function useEventEngine() {
  const playerStore = usePlayerStore();
  const gameStore = useGameStore();

  const allEvents = ref<GameEvent[]>(chapter1Events as GameEvent[]);
  const currentEvent = ref<GameEvent | null>(null);
  const eventHistory = ref<string[]>([]);

  // 检查事件触发条件
  function checkEventCondition(condition?: EventCondition): boolean {
    if (!condition) return true;

    // 检查状态条件
    if (!checkStatusCondition(playerStore.status, condition)) {
      return false;
    }

    // 检查时间条件
    if (condition.period && !condition.period.includes(gameStore.time.period)) {
      return false;
    }

    // 检查天数条件
    if (condition.minDay && gameStore.time.day < condition.minDay) {
      return false;
    }
    if (condition.maxDay && gameStore.time.day > condition.maxDay) {
      return false;
    }

    // 检查技能条件
    if (condition.skills) {
      for (const [skillId, minLevel] of Object.entries(condition.skills)) {
        if (playerStore.getSkillLevel(skillId as any) < minLevel) {
          return false;
        }
      }
    }

    // 检查标志条件
    if (condition.flags) {
      for (const flag of condition.flags) {
        if (!gameStore.hasFlag(flag)) {
          return false;
        }
      }
    }

    return true;
  }

  // 获取可用事件
  function getAvailableEvents(): GameEvent[] {
    return allEvents.value.filter((event) => {
      // 检查触发条件
      if (!checkEventCondition(event.condition)) {
        return false;
      }

      // 检查冷却时间
      if (event.cooldown && eventHistory.value.includes(event.id)) {
        const lastTriggerIndex = eventHistory.value.lastIndexOf(event.id);
        const eventsSince = eventHistory.value.length - lastTriggerIndex;
        if (eventsSince < event.cooldown) {
          return false;
        }
      }

      return true;
    });
  }

  // 获取主线事件
  function getMainEvents(): GameEvent[] {
    return allEvents.value.filter(
      (event) => event.isMain && checkEventCondition(event.condition),
    );
  }

  // 获取随机事件
  function getRandomEvents(): GameEvent[] {
    return allEvents.value.filter(
      (event) => event.isRandom && checkEventCondition(event.condition),
    );
  }

  // 选择下一个事件
  function selectNextEvent(): GameEvent | null {
    // 优先选择主线事件
    const mainEvents = getMainEvents();
    if (mainEvents.length > 0) {
      return mainEvents[0];
    }

    // 然后选择随机事件
    const randomEvents = getRandomEvents();
    if (randomEvents.length > 0) {
      // 根据优先级加权随机选择
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

    return null;
  }

  // 触发事件
  function triggerEvent(eventId: string): GameEvent | null {
    const event = allEvents.value.find((e) => e.id === eventId);
    if (event && checkEventCondition(event.condition)) {
      currentEvent.value = event;
      return event;
    }
    return null;
  }

  // 应用选项效果
  function applyOptionEffects(option: EventOption) {
    // 应用状态变化
    playerStore.applyChange(option.effects);

    // 应用技能经验变化
    if (option.skillEffects) {
      Object.entries(option.skillEffects).forEach(([skillId, experience]) => {
        playerStore.addSkillExperience(skillId as any, experience);
      });
    }

    // 添加标志
    if (option.flags) {
      option.flags.forEach((flag) => gameStore.addFlag(flag));
    }

    // 记录历史
    if (currentEvent.value) {
      eventHistory.value.push(currentEvent.value.id);
      gameStore.addHistory(currentEvent.value.id);
    }
  }

  // 处理选项选择
  function handleOptionSelect(option: EventOption) {
    applyOptionEffects(option);

    // 推进时间
    gameStore.advancePeriod();

    // 如果有下一个事件，触发它
    if (option.nextEvent) {
      if (option.nextEvent === "chapter_end") {
        // 章节结束
        currentEvent.value = null;
      } else {
        triggerEvent(option.nextEvent);
      }
    } else {
      // 选择下一个事件
      currentEvent.value = selectNextEvent();
    }
  }

  // 开始游戏
  function startGame() {
    const firstEvent = allEvents.value.find((e) => e.id === "scene_0_1");
    if (firstEvent) {
      currentEvent.value = firstEvent;
    }
  }

  // 重置
  function reset() {
    currentEvent.value = null;
    eventHistory.value = [];
  }

  return {
    currentEvent,
    allEvents,
    eventHistory,
    checkEventCondition,
    getAvailableEvents,
    getMainEvents,
    getRandomEvents,
    selectNextEvent,
    triggerEvent,
    handleOptionSelect,
    startGame,
    reset,
  };
}
