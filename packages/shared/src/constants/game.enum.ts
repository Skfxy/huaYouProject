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

// ==================== 星期枚举 ====================

export const DAYS_OF_WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const

export const WEEKEND_DAYS = [0, 6] // 周日、周六

export const SPECIAL_DATES = {
  START_DAY: 1,        // 穿越日 6月1日 (day 1 = 周五 in our game starting day)
  PAYDAY: 1,           // 每月1日发工资
  CREDIT_CARD_DAY: 15, // 每月15日信用卡还款
  SKILL_SUMMARY: 30    // 每月末技能总结
} as const

// 游戏开始日是周五（第1天=周五，dayOfWeek=5）
export const START_DAY_OF_WEEK = 5

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
export const AUTO_SAVE_STORAGE_KEY = 'huayou_autosave'
export const MAX_SAVE_SLOTS = 3
export const AUTO_SAVE_SLOT = 0
export const GAME_VERSION = '0.1.0'

// ==================== 自动存档配置 ====================

export const AUTO_SAVE_CONFIG = {
  enabled: true,
  // 每N个选项后自动存档
  saveEveryNOptions: 3,
  // 每天早晨自动存档
  saveOnMorning: true,
  // 章节结束自动存档
  saveOnChapterEnd: true
} as const

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
