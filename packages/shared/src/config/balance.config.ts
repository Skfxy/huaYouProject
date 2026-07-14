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
    experienceRequired: [0, 80, 220, 450, 800, 1300]
  },
  {
    id: 'operation',
    name: '运营基础',
    description: '学习运营技能，影响运营路线面试通过率',
    maxLevel: 5,
    experienceRequired: [0, 80, 220, 450, 800, 1300]
  },
  {
    id: 'social',
    name: '社交能力',
    description: '提升社交能力，影响人脉事件触发概率',
    maxLevel: 10,
    experienceRequired: [0, 40, 100, 180, 300, 450, 650, 900, 1200, 1600, 2100]
  }
]

// ==================== 状态恢复配置 ====================

// 睡眠恢复
export const SLEEP_RECOVERY = {
  normal: 40,        // 正常睡眠恢复
  nap: 15,           // 午休恢复
  overtime: 20,      // 熬夜后补觉恢复
  overtimePenalty: 20, // 熬夜精力惩罚
  weekendBonus: 15,  // 周末懒觉额外恢复
  regularBonusMultiplier: 1.25, // 连续规律作息恢复加成
  healthRecoveryRegular: 2,    // 规律作息每天健康恢复
  healthRecoveryBonus: 3,      // 连续7天规律作息额外健康恢复
  healthOvertimePenalty: 3,    // 熬夜健康惩罚
  moodOvertimePenalty: 8       // 熬夜心情惩罚
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

// ==================== 特殊日期配置 ====================

// 发薪日配置（边工作路线）
export const PAYDAY_CONFIG = {
  salary: 4500,        // 月工资
  workRouteFlag: 'route_part_time' // 边工作边学路线标志
}

// 周末事件配置
export const WEEKEND_CONFIG = {
  saturdayEventChance: 0.6,  // 周六开黑邀请概率
  sundayEnergyBonus: 20,     // 周日懒觉精力恢复
  partTimeChance: 0.3,       // 兼职机会概率
  partTimeIncome: [300, 800] // 兼职收入范围
}

// 月度总结配置
export const MONTHLY_SUMMARY = {
  skillBonusExp: 50,     // 月末技能经验奖励
  moodBonus: 5           // 月末心情奖励
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
