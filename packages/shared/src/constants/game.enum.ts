// 话游 - 游戏枚举定义

import type { TimePeriod, SkillType } from '../types/game.types'

// ==================== 时段枚举 ====================

export const TIME_PERIODS: TimePeriod[] = ['morning', 'afternoon', 'evening', 'night']

export const TIME_PERIOD_NAMES: Record<TimePeriod, string> = {
  morning: '早晨',
  afternoon: '下午',
  evening: '晚上',
  night: '深夜'
}

export const TIME_PERIOD_HOURS: Record<TimePeriod, [number, number]> = {
  morning: [6, 12],
  afternoon: [12, 18],
  evening: [18, 24],
  night: [0, 6]
}

// ==================== 技能枚举 ====================

export const SKILL_TYPES: SkillType[] = ['programming', 'operation', 'social']

export const SKILL_NAMES: Record<SkillType, string> = {
  programming: '编程入门',
  operation: '运营基础',
  social: '社交能力'
}

export const SKILL_DESCRIPTIONS: Record<SkillType, string> = {
  programming: '学习编程技能，影响程序员路线面试通过率',
  operation: '学习运营技能，影响运营路线面试通过率',
  social: '提升社交能力，影响人脉事件触发概率'
}

// ==================== 状态枚举 ====================

export const STATUS_KEYS = ['energy', 'mood', 'health', 'money'] as const

export const STATUS_NAMES: Record<string, string> = {
  energy: '精力',
  mood: '心情',
  health: '健康',
  money: '存款'
}

export const STATUS_ICONS: Record<string, string> = {
  energy: '⚡',
  mood: '😊',
  health: '❤️',
  money: '💰'
}

// ==================== 存档枚举 ====================

export const SAVE_STORAGE_KEY = 'huayou_saves'
export const MAX_SAVE_SLOTS = 3
export const GAME_VERSION = '0.1.0'

// ==================== 事件优先级 ====================

export const EVENT_PRIORITY = {
  LOW: 10,
  NORMAL: 30,
  HIGH: 60,
  MUST: 100
} as const

// ==================== 事件冷却 ====================

export const EVENT_COOLDOWN = {
  LOW: 3,
  NORMAL: 2,
  HIGH: 1,
  SPECIAL: 0
} as const
