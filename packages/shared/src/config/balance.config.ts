// 话游 - 游戏平衡配置

import type { GameConfig, SkillConfig } from '../types/game.types'

// ==================== 游戏基础配置 ====================

export const GAME_CONFIG: GameConfig = {
  maxStatus: 100,
  minStatus: 0,
  initialStatus: {
    energy: 80,
    mood: 30,
    health: 70,
    money: 3200
  },
  maxSkillLevel: 5,
  saveSlots: 3
}

// ==================== 技能配置 ====================

export const SKILL_CONFIGS: SkillConfig[] = [
  {
    id: 'programming',
    name: '编程入门',
    description: '学习编程技能，影响程序员路线面试通过率',
    maxLevel: 5,
    experienceRequired: [0, 100, 300, 650, 1150, 1850]
  },
  {
    id: 'operation',
    name: '运营基础',
    description: '学习运营技能，影响运营路线面试通过率',
    maxLevel: 5,
    experienceRequired: [0, 100, 300, 650, 1150, 1850]
  },
  {
    id: 'social',
    name: '社交能力',
    description: '提升社交能力，影响人脉事件触发概率',
    maxLevel: 10,
    experienceRequired: [0, 50, 120, 220, 350, 520, 730, 990, 1310, 1710, 2200]
  }
]

// ==================== 状态恢复配置 ====================

// 睡眠恢复
export const SLEEP_RECOVERY = {
  normal: 40,        // 正常睡眠恢复
  nap: 15,           // 午休恢复
  overtime: 20,      // 熬夜恢复
  overtimePenalty: 20 // 熬夜精力上限惩罚
}

// 精力消耗
export const ENERGY_COST = {
  studyPerHour: 10,    // 学习每小时消耗
  workPerHour: 8,      // 工作每小时消耗
  social: 5,           // 社交活动消耗
  overtimePerHour: 15  // 熬夜每小时消耗
}

// 健康变化
export const HEALTH_CHANGE = {
  regularSleep: 1,      // 规律作息每天恢复
  regularSleepBonus: 3, // 连续7天额外恢复
  overtime: -3,         // 熬夜消耗
  skipBreakfast: -1,    // 跳过早餐消耗
  exercise: 2,          // 运动恢复
  exerciseBonus: 1,     // 每周3次以上额外恢复
  sick: -20             // 生病消耗
}

// 心情变化
export const MOOD_CHANGE = {
  goodNews: [5, 15],     // 好消息范围
  badNews: [-5, -15],    // 坏消息范围
  socialSuccess: [3, 8], // 社交成功范围
  socialFail: [-3, -8],  // 社交失败范围
  selfImprovement: [2, 5], // 自我提升范围
  selfDoubt: [-5, -10]   // 自我怀疑范围
}

// ==================== 效率系数 ====================

export const EFFICIENCY_MULTIPLIER = {
  energyHigh: 1.5,    // 精力充沛（>80）
  energyNormal: 1.0,  // 精力正常（30-80）
  energyLow: 0.5,     // 精力不足（<30）
  moodHigh: 1.3,      // 心情愉悦（>70）
  moodNormal: 1.0,    // 心情正常（30-70）
  moodLow: 0.7,       // 心情低落（<30）
  healthHigh: 1.5,    // 身体健康（>80）
  healthNormal: 1.0,  // 健康正常（50-80）
  healthLow: 0.7      // 健康不佳（<50）
}

// ==================== 时间价值 ====================

export const TIME_VALUE = {
  morning: 1.5,   // 早晨效率最高
  afternoon: 1.0, // 下午正常
  evening: 0.8,   // 晚上效率下降
  night: 0.5      // 深夜效率最低
}

// ==================== 事件触发配置 ====================

export const EVENT_TRIGGER = {
  baseProbability: {
    low: 0.15,
    normal: 0.3,
    high: 0.5,
    must: 1.0
  },
  maxDailyEvents: 3,
  cooldownResetDay: 1,
  positiveEventChance: 0.6,
  negativeEventChance: 0.4
}
