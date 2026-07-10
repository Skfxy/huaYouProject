// 话游 - 数值计算工具函数

import type { PlayerStatus, StatusChange, Skill } from '../types/game.types'
import { EFFICIENCY_MULTIPLIER, GAME_CONFIG } from '../config/balance.config'

// ==================== 状态计算 ====================

/**
 * 限制状态值在有效范围内
 */
export function clampStatus(value: number): number {
  return Math.max(GAME_CONFIG.minStatus, Math.min(GAME_CONFIG.maxStatus, value))
}

/**
 * 应用状态变化
 */
export function applyStatusChange(current: PlayerStatus, change: StatusChange): PlayerStatus {
  return {
    energy: clampStatus(current.energy + (change.energy || 0)),
    mood: clampStatus(current.mood + (change.mood || 0)),
    health: clampStatus(current.health + (change.health || 0)),
    money: Math.max(0, current.money + (change.money || 0))
  }
}

/**
 * 检查状态是否满足条件
 */
export function checkStatusCondition(status: PlayerStatus, condition: {
  minEnergy?: number
  maxEnergy?: number
  minMood?: number
  maxMood?: number
  minHealth?: number
  maxHealth?: number
  minMoney?: number
  maxMoney?: number
}): boolean {
  if (condition.minEnergy !== undefined && status.energy < condition.minEnergy) return false
  if (condition.maxEnergy !== undefined && status.energy > condition.maxEnergy) return false
  if (condition.minMood !== undefined && status.mood < condition.minMood) return false
  if (condition.maxMood !== undefined && status.mood > condition.maxMood) return false
  if (condition.minHealth !== undefined && status.health < condition.minHealth) return false
  if (condition.maxHealth !== undefined && status.health > condition.maxHealth) return false
  if (condition.minMoney !== undefined && status.money < condition.minMoney) return false
  if (condition.maxMoney !== undefined && status.money > condition.maxMoney) return false
  return true
}

// ==================== 效率计算 ====================

/**
 * 计算精力效率系数
 */
export function getEnergyEfficiency(energy: number): number {
  if (energy > 80) return EFFICIENCY_MULTIPLIER.energyHigh
  if (energy > 30) return EFFICIENCY_MULTIPLIER.energyNormal
  return EFFICIENCY_MULTIPLIER.energyLow
}

/**
 * 计算心情效率系数
 */
export function getMoodEfficiency(mood: number): number {
  if (mood > 70) return EFFICIENCY_MULTIPLIER.moodHigh
  if (mood > 30) return EFFICIENCY_MULTIPLIER.moodNormal
  return EFFICIENCY_MULTIPLIER.moodLow
}

/**
 * 计算健康效率系数
 */
export function getHealthEfficiency(health: number): number {
  if (health > 80) return EFFICIENCY_MULTIPLIER.healthHigh
  if (health > 50) return EFFICIENCY_MULTIPLIER.healthNormal
  return EFFICIENCY_MULTIPLIER.healthLow
}

/**
 * 计算综合效率系数
 */
export function getOverallEfficiency(status: PlayerStatus): number {
  return getEnergyEfficiency(status.energy) *
         getMoodEfficiency(status.mood) *
         getHealthEfficiency(status.health)
}

// ==================== 技能计算 ====================

/**
 * 计算技能升级所需经验
 */
export function getSkillUpgradeExperience(skill: Skill): number {
  const config = {
    programming: [0, 100, 300, 650, 1150, 1850],
    operation: [0, 100, 300, 650, 1150, 1850],
    social: [0, 50, 120, 220, 350, 520, 730, 990, 1310, 1710, 2200]
  }
  const required = config[skill.id]
  return skill.level < required.length ? required[skill.level] : Infinity
}

/**
 * 检查技能是否可以升级
 */
export function canSkillUpgrade(skill: Skill): boolean {
  return skill.experience >= getSkillUpgradeExperience(skill) &&
         skill.level < GAME_CONFIG.maxSkillLevel
}

/**
 * 应用技能经验变化
 */
export function applySkillExperience(skill: Skill, experience: number): Skill {
  const newExperience = Math.max(0, skill.experience + experience)
  let newLevel = skill.level

  // 检查是否可以升级
  while (canSkillUpgrade({ ...skill, level: newLevel, experience: newExperience })) {
    newLevel++
  }

  return {
    ...skill,
    level: newLevel,
    experience: newExperience
  }
}

// ==================== 工具函数 ====================

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 随机浮点数
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
