// 话游 - 游戏核心类型定义

// ==================== 状态系统 ====================

// 四维状态
export interface PlayerStatus {
  energy: number    // 精力 (0-100)
  mood: number      // 心情 (0-100)
  health: number    // 健康 (0-100)
  money: number     // 存款 (0-∞)
}

// 状态变化
export interface StatusChange {
  energy?: number
  mood?: number
  health?: number
  money?: number
}

// ==================== 技能系统 ====================

// 技能类型
export type SkillType = 'programming' | 'operation' | 'social'

// 技能等级
export interface Skill {
  id: SkillType
  name: string
  level: number       // 0-5
  experience: number  // 当前经验
  maxExperience: number // 升级所需经验
}

// 技能配置
export interface SkillConfig {
  id: SkillType
  name: string
  description: string
  maxLevel: number
  experienceRequired: number[]  // 每级所需经验
}

// ==================== 时间系统 ====================

// 时段
export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night'

// 时间状态
export interface TimeState {
  day: number           // 当前天数
  period: TimePeriod    // 当前时段
  totalDays: number     // 总天数
}

// 时间配置
export interface TimeConfig {
  periods: TimePeriod[]
  periodHours: Record<TimePeriod, [number, number]>
}

// ==================== 事件系统 ====================

// 事件条件
export interface EventCondition {
  minEnergy?: number
  maxEnergy?: number
  minMood?: number
  maxMood?: number
  minHealth?: number
  maxHealth?: number
  minMoney?: number
  maxMoney?: number
  dayOfWeek?: number[]    // 0-6，周日-周六
  minDay?: number
  maxDay?: number
  period?: TimePeriod[]
  skills?: Partial<Record<SkillType, number>>  // 技能等级要求
  flags?: string[]        // 已解锁的标志
}

// 事件选项
export interface EventOption {
  id: string
  text: string
  effects: StatusChange
  skillEffects?: Partial<Record<SkillType, number>>  // 技能经验变化
  nextEvent?: string     // 下一个事件ID
  flags?: string[]       // 解锁的标志
  condition?: EventCondition  // 选项显示条件
}

// 事件
export interface GameEvent {
  id: string
  name: string
  description: string
  text: string           // 剧情文本
  options: EventOption[]
  condition?: EventCondition  // 触发条件
  priority?: number      // 优先级 0-100
  cooldown?: number      // 冷却时间（天）
  isRandom?: boolean     // 是否为随机事件
  isMain?: boolean       // 是否为主线事件
}

// ==================== 存档系统 ====================

// 存档数据
export interface SaveData {
  id: string
  name: string
  timestamp: number
  day: number
  period: TimePeriod
  status: PlayerStatus
  skills: Skill[]
  flags: string[]
  currentEvent?: string
  version: string
}

// 存档槽位
export interface SaveSlot {
  id: number
  isEmpty: boolean
  data?: SaveData
}

// ==================== 游戏状态 ====================

// 游戏状态
export interface GameState {
  isStarted: boolean
  isPaused: boolean
  currentChapter: number
  currentEvent?: string
  history: string[]      // 已触发的事件ID
}

// ==================== 配置 ====================

// 游戏配置
export interface GameConfig {
  maxStatus: number
  minStatus: number
  initialStatus: PlayerStatus
  maxSkillLevel: number
  saveSlots: number
}
