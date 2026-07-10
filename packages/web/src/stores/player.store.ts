// 话游 - 玩家状态 Store

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  PlayerStatus,
  StatusChange,
  Skill,
  SkillType,
} from "@shared/types/game.types";
import { GAME_CONFIG, SKILL_CONFIGS } from "@shared/config/balance.config";
import {
  applyStatusChange,
  checkStatusCondition,
  applySkillExperience,
  canSkillUpgrade,
} from "@shared/utils/calculator";
import {
  STATUS_NAMES,
  STATUS_ICONS,
  SKILL_NAMES,
} from "@shared/constants/game.enum";

export const usePlayerStore = defineStore("player", () => {
  // ==================== 状态 ====================

  const status = ref<PlayerStatus>({ ...GAME_CONFIG.initialStatus });
  const skills = ref<Skill[]>(
    SKILL_CONFIGS.map((config) => ({
      id: config.id,
      name: config.name,
      level: 0,
      experience: 0,
      maxExperience: config.experienceRequired[1] || 100,
    })),
  );

  // ==================== 计算属性 ====================

  const statusWithNames = computed(() => {
    return Object.entries(status.value).map(([key, value]) => ({
      key,
      name: STATUS_NAMES[key],
      icon: STATUS_ICONS[key],
      value,
      max: key === "money" ? undefined : GAME_CONFIG.maxStatus,
    }));
  });

  const skillWithDetails = computed(() => {
    return skills.value.map((skill) => ({
      ...skill,
      name: SKILL_NAMES[skill.id],
      canUpgrade: canSkillUpgrade(skill),
    }));
  });

  const overallEfficiency = computed(() => {
    const { energy, mood, health } = status.value;
    let efficiency = 1.0;

    // 精力效率
    if (energy > 80) efficiency *= 1.5;
    else if (energy > 30) efficiency *= 1.0;
    else efficiency *= 0.5;

    // 心情效率
    if (mood > 70) efficiency *= 1.3;
    else if (mood > 30) efficiency *= 1.0;
    else efficiency *= 0.7;

    // 健康效率
    if (health > 80) efficiency *= 1.5;
    else if (health > 50) efficiency *= 1.0;
    else efficiency *= 0.7;

    return efficiency;
  });

  // ==================== 操作 ====================

  function applyChange(change: StatusChange) {
    status.value = applyStatusChange(status.value, change);
  }

  function checkCondition(
    condition: Parameters<typeof checkStatusCondition>[1],
  ): boolean {
    return checkStatusCondition(status.value, condition);
  }

  function addSkillExperience(skillId: SkillType, experience: number) {
    const index = skills.value.findIndex((s) => s.id === skillId);
    if (index !== -1) {
      const skill = skills.value[index];
      const efficiency = overallEfficiency.value;
      const adjustedExperience = Math.round(experience * efficiency);
      skills.value[index] = applySkillExperience(skill, adjustedExperience);
    }
  }

  function getSkill(skillId: SkillType): Skill | undefined {
    return skills.value.find((s) => s.id === skillId);
  }

  function getSkillLevel(skillId: SkillType): number {
    return getSkill(skillId)?.level || 0;
  }

  function reset() {
    status.value = { ...GAME_CONFIG.initialStatus };
    skills.value = SKILL_CONFIGS.map((config) => ({
      id: config.id,
      name: config.name,
      level: 0,
      experience: 0,
      maxExperience: config.experienceRequired[1] || 100,
    }));
  }

  return {
    // 状态
    status,
    skills,
    // 计算属性
    statusWithNames,
    skillWithDetails,
    overallEfficiency,
    // 操作
    applyChange,
    checkCondition,
    addSkillExperience,
    getSkill,
    getSkillLevel,
    reset,
  };
});
