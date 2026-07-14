# 话游 - Code Wiki 技术文档

> 版本：v0.1.0 MVP | 最后更新：2026-07-14

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术架构](#2-技术架构)
- [3. 项目结构](#3-项目结构)
- [4. 前端模块详解](#4-前端模块详解)
- [5. 共享层模块详解](#5-共享层模块详解)
- [6. 游戏核心系统](#6-游戏核心系统)
- [7. 事件系统](#7-事件系统)
- [8. 存档系统](#8-存档系统)
- [9. 依赖关系图](#9-依赖关系图)
- [10. 项目运行与构建](#10-项目运行与构建)
- [11. 开发规范与约定](#11-开发规范与约定)
- [12. 第二阶段规划](#12-第二阶段规划)

---

## 1. 项目概述

### 1.1 项目简介

《话游》是一款「交互式叙事 + 人生模拟」网页游戏，核心玩法为「一句话改变平行时空人生」——玩家通过剧情选项影响角色状态与故事走向，最终走向不同结局。

### 1.2 核心玩法

- **四维状态系统**：精力、心情、健康、存款
- **技能成长树**：编程入门、运营基础、社交能力
- **事件分支剧情**：主线事件 + 随机事件
- **本地多存档**：3个存档槽位，localStorage 持久化

### 1.3 当前阶段

- **阶段**：第一阶段 MVP
- **模式**：纯前端本地运行
- **存档方式**：localStorage 本地存档
- **后端状态**：预留目录占位，第二阶段正式开发

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术选型 | 版本 | 说明 |
|------|----------|------|------|
| 前端框架 | Vue 3 | ^3.4.21 | Composition API + `<script setup>` |
| 状态管理 | Pinia | ^2.1.7 | 基于 Vue 3 的状态管理库 |
| 路由 | Vue Router | ^4.3.0 | 前端路由管理 |
| 构建工具 | Vite | ^5.2.8 | 下一代前端构建工具 |
| 语言 | TypeScript | ^5.4.3 | 类型安全的 JavaScript |
| 后端框架 | NestJS | - | 第二阶段启用 |
| 数据库 | MongoDB | - | 第二阶段启用 |
| 包管理 | pnpm | - | workspace monorepo 管理 |
| 代码规范 | ESLint + Prettier | - | 代码质量与格式化 |

### 2.2 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                     前端应用 (web)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Views   │  │Components│  │  Stores  │  │  Hooks  │ │
│  │  页面视图 │  │  UI组件  │  │ 状态管理 │  │游戏引擎 │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │             │             │             │       │
│       └─────────────┴──────┬──────┴─────────────┘       │
│                            │                            │
│                     ┌──────┴──────┐                     │
│                     │   Router    │                     │
│                     └──────┬──────┘                     │
└────────────────────────────┼────────────────────────────┘
                             │
                     ┌───────┴───────┐
                     │  共享层 (shared) │
                     │ 类型/常量/配置/工具 │
                     └───────┬───────┘
                             │
                     ┌───────┴───────┐
                     │  后端 (server)  │
                     │  第二阶段启用    │
                     └───────────────┘
```

### 2.3 设计原则

1. **关注点分离**：视图层、业务逻辑层、数据层清晰分离
2. **状态集中管理**：Pinia 统一管理游戏状态
3. **共享层优先**：前后端共用类型和逻辑放在 shared 包
4. **组合式函数**：游戏核心逻辑封装为 Vue Composition API Hooks
5. **渐进式开发**：第一阶段纯前端，第二阶段接入后端

---

## 3. 项目结构

### 3.1 Monorepo 结构

```
huayou/
├── packages/
│   ├── web/              # 前端游戏主程序 ✅ 当前阶段核心
│   ├── server/           # 后端服务 ⏸️ 第二阶段启用
│   └── shared/           # 前后端共享代码
├── docs/                 # 项目文档
│   ├── game-design/      # 游戏设计文档
│   │   ├── chapters/     # 章节剧情
│   │   ├── endings/      # 结局设计
│   │   ├── events/       # 事件设计
│   │   └── systems/      # 系统设计
│   └── code-wiki.md      # 本文档
├── scripts/              # 构建、检查、部署脚本
├── AGENTS.md             # AI Agent 项目指令
├── README.md             # 项目说明
├── package.json          # 根 package.json
└── pnpm-workspace.yaml   # pnpm workspace 配置
```

### 3.2 前端目录结构

```
packages/web/
├── public/                    # 静态资源（不参与构建）
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/                # 构建内资源
│   │   ├── images/
│   │   ├── audios/
│   │   └── styles/
│   ├── components/            # 通用组件
│   │   ├── common/            # 基础组件
│   │   ├── game/              # 游戏专属组件
│   │   │   ├── StatusBar.vue  # 状态栏
│   │   │   ├── DialogBox.vue  # 剧情对话框
│   │   │   └── OptionList.vue # 选项列表
│   │   └── layout/            # 布局组件
│   ├── stores/                # Pinia 状态管理
│   │   ├── game.store.ts      # 游戏主状态
│   │   ├── player.store.ts    # 玩家属性状态
│   │   └── save.store.ts      # 存档管理
│   ├── views/                 # 页面级视图
│   │   ├── HomeView.vue       # 主菜单页
│   │   ├── GameView.vue       # 游戏主界面
│   │   ├── SaveView.vue       # 存档页
│   │   └── SettingsView.vue   # 设置页
│   ├── router/                # 路由配置
│   │   └── index.ts
│   ├── hooks/                 # 组合式函数
│   │   └── useEventEngine.ts  # 事件引擎
│   ├── data/                  # 游戏静态配置
│   │   └── events/
│   │       └── chapter1.json  # 第一章事件
│   ├── utils/                 # 工具函数
│   ├── types/                 # 前端专属类型
│   ├── App.vue                # 根组件
│   ├── main.ts                # 应用入口
│   └── style.css              # 全局样式
├── index.html
├── vite.config.ts             # Vite 配置
├── tsconfig.json              # TypeScript 配置
├── .eslintrc.cjs              # ESLint 配置
└── package.json
```

### 3.3 共享层目录结构

```
packages/shared/
├── src/
│   ├── types/                 # 类型定义
│   │   └── game.types.ts      # 游戏核心类型
│   ├── constants/             # 常量与枚举
│   │   └── game.enum.ts       # 游戏枚举
│   ├── config/                # 游戏配置
│   │   └── balance.config.ts  # 数值平衡配置
│   ├── utils/                 # 工具函数
│   │   └── calculator.ts      # 数值计算工具
│   └── index.ts               # 统一导出
├── tsconfig.json
└── package.json
```

---

## 4. 前端模块详解

### 4.1 应用入口 (main.ts)

**文件**：[main.ts](file:///d:/huaYouProject/packages/web/src/main.ts)

应用入口文件，负责：
- 创建 Vue 应用实例
- 注册 Pinia 状态管理
- 注册 Vue Router 路由
- 挂载根组件到 `#app`

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");
```

### 4.2 路由系统

**文件**：[router/index.ts](file:///d:/huaYouProject/packages/web/src/router/index.ts)

#### 路由配置

| 路径 | 名称 | 组件 | 页面标题 |
|------|------|------|----------|
| `/` | home | HomeView | 话游 - 主菜单 |
| `/game` | game | GameView | 话游 - 游戏中 |
| `/save` | save | SaveView | 话游 - 存档管理 |
| `/settings` | settings | SettingsView | 话游 - 设置 |
| `/:pathMatch(.*)*` | - | 重定向到 `/` | - |

#### 路由守卫

- **beforeEach**：设置页面标题（从 `to.meta.title` 读取）

### 4.3 状态管理 (Pinia Stores)

项目采用 Pinia 进行状态管理，使用 Composition API 风格定义 Store。

#### 4.3.1 玩家状态 Store

**文件**：[player.store.ts](file:///d:/huaYouProject/packages/web/src/stores/player.store.ts)

**Store 名称**：`player`

##### 状态 (State)

| 状态 | 类型 | 说明 |
|------|------|------|
| `status` | `PlayerStatus` | 玩家四维状态（精力/心情/健康/存款） |
| `skills` | `Skill[]` | 技能列表 |

##### 计算属性 (Getters)

| 计算属性 | 返回类型 | 说明 |
|----------|----------|------|
| `statusWithNames` | `Array` | 带名称和图标的状态列表 |
| `skillWithDetails` | `Array` | 带详情的技能列表 |
| `overallEfficiency` | `number` | 综合效率系数（精力×心情×健康） |

##### 操作 (Actions)

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `applyChange` | `change: StatusChange` | `void` | 应用状态变化 |
| `checkCondition` | `condition` | `boolean` | 检查状态是否满足条件 |
| `addSkillExperience` | `skillId: SkillType, experience: number` | `void` | 添加技能经验 |
| `getSkill` | `skillId: SkillType` | `Skill \| undefined` | 获取技能信息 |
| `getSkillLevel` | `skillId: SkillType` | `number` | 获取技能等级 |
| `reset` | - | `void` | 重置玩家状态 |

##### 效率计算逻辑

综合效率 = 精力效率 × 心情效率 × 健康效率

- **精力效率**：>80 → 1.5；30-80 → 1.0；<30 → 0.5
- **心情效率**：>70 → 1.3；30-70 → 1.0；<30 → 0.7
- **健康效率**：>80 → 1.5；50-80 → 1.0；<50 → 0.7

#### 4.3.2 游戏主状态 Store

**文件**：[game.store.ts](file:///d:/huaYouProject/packages/web/src/stores/game.store.ts)

**Store 名称**：`game`

##### 状态 (State)

| 状态 | 类型 | 说明 |
|------|------|------|
| `time` | `TimeState` | 时间状态（天数、时段、总天数） |
| `game` | `GameState` | 游戏状态（开始/暂停/章节/历史） |
| `flags` | `string[]` | 剧情标志数组 |

##### 计算属性 (Getters)

| 计算属性 | 返回类型 | 说明 |
|----------|----------|------|
| `periodName` | `string` | 当前时段中文名 |
| `periodIndex` | `number` | 当前时段索引 |
| `dayProgress` | `number` | 天数进度百分比 |
| `isLastPeriod` | `boolean` | 是否是当天最后时段 |
| `isLastDay` | `boolean` | 是否是最后一天 |

##### 操作 (Actions)

**时间操作：**

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `advancePeriod` | - | `void` | 推进一个时段 |
| `advanceTime` | `periods: number` | `void` | 推进指定数量时段 |
| `advanceDays` | `days: number` | `void` | 推进指定天数 |
| `setPeriod` | `period: TimePeriod` | `void` | 设置当前时段 |
| `setDay` | `day: number` | `void` | 设置当前天数 |

**游戏操作：**

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `startGame` | - | `void` | 开始游戏 |
| `pauseGame` | - | `void` | 暂停游戏 |
| `resumeGame` | - | `void` | 继续游戏 |
| `endGame` | - | `void` | 结束游戏 |

**历史与标志：**

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `addHistory` | `eventId: string` | `void` | 添加事件历史 |
| `hasHistory` | `eventId: string` | `boolean` | 检查事件历史 |
| `addFlag` | `flag: string` | `void` | 添加剧情标志 |
| `removeFlag` | `flag: string` | `void` | 移除剧情标志 |
| `hasFlag` | `flag: string` | `boolean` | 检查剧情标志 |

#### 4.3.3 存档管理 Store

**文件**：[save.store.ts](file:///d:/huaYouProject/packages/web/src/stores/save.store.ts)

**Store 名称**：`save`

##### 状态 (State)

| 状态 | 类型 | 说明 |
|------|------|------|
| `slots` | `SaveSlot[]` | 存档槽位列表 |
| `currentSlot` | `number \| null` | 当前存档槽位 ID |

##### 计算属性 (Getters)

| 计算属性 | 返回类型 | 说明 |
|----------|----------|------|
| `isEmpty` | `boolean` | 是否所有槽位都为空 |
| `filledSlots` | `SaveSlot[]` | 已填充的槽位 |
| `emptySlots` | `SaveSlot[]` | 空槽位 |

##### 操作 (Actions)

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `initSlots` | - | `void` | 初始化存档槽位（从 localStorage 读取） |
| `saveToSlot` | `slotId: number, name?: string` | `boolean` | 保存到指定槽位 |
| `loadFromSlot` | `slotId: number` | `boolean` | 从指定槽位加载 |
| `deleteSlot` | `slotId: number` | `boolean` | 删除指定槽位 |
| `getSlotInfo` | `slotId: number` | `SaveSlot \| undefined` | 获取槽位信息 |
| `formatTimestamp` | `timestamp: number` | `string` | 格式化时间戳 |
| `reset` | - | `void` | 重置所有存档 |

##### 存档数据结构

存档保存在 localStorage 的 `huayou_saves` 键中，格式为 `SaveSlot[]`。

### 4.4 游戏引擎 (Hooks)

#### 4.4.1 事件引擎 Hook

**文件**：[useEventEngine.ts](file:///d:/huaYouProject/packages/web/src/hooks/useEventEngine.ts)

事件引擎是游戏的核心逻辑模块，封装为 Vue Composition API Hook。

##### 响应式状态

| 状态 | 类型 | 说明 |
|------|------|------|
| `allEvents` | `Ref<GameEvent[]>` | 所有事件列表 |
| `currentEvent` | `Ref<GameEvent \| null>` | 当前事件 |
| `eventHistory` | `Ref<string[]>` | 事件触发历史 |

##### 核心方法

**条件检查：**

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `checkEventCondition` | `condition?: EventCondition` | `boolean` | 检查事件触发条件 |

检查项包括：
- 状态条件（精力/心情/健康/存款的最小/最大值）
- 时间条件（时段、天数范围）
- 技能条件（技能等级要求）
- 标志条件（剧情标志）

**事件获取：**

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getAvailableEvents` | - | `GameEvent[]` | 获取所有可用事件 |
| `getMainEvents` | - | `GameEvent[]` | 获取可用主线事件 |
| `getRandomEvents` | - | `GameEvent[]` | 获取可用随机事件 |
| `selectNextEvent` | - | `GameEvent \| null` | 选择下一个事件 |

**事件选择逻辑：**
1. 优先选择主线事件（按顺序第一个）
2. 如无主线事件，从随机事件中按优先级加权随机选择
3. 优先级权重：`event.priority || 30`

**事件处理：**

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `triggerEvent` | `eventId: string` | `GameEvent \| null` | 触发指定事件 |
| `applyOptionEffects` | `option: EventOption` | `void` | 应用选项效果 |
| `handleOptionSelect` | `option: EventOption` | `void` | 处理选项选择 |
| `startGame` | - | `void` | 开始游戏（触发第一个事件） |
| `reset` | - | `void` | 重置事件引擎 |

**选项效果应用：**
1. 应用状态变化（精力/心情/健康/存款）
2. 应用技能经验变化
3. 添加剧情标志
4. 记录事件历史

**选项选择流程：**
1. 应用选项效果
2. 推进一个时段
3. 如果有 `nextEvent`，触发下一个事件
4. 否则自动选择下一个事件

### 4.5 游戏组件

#### 4.5.1 状态栏组件

**文件**：[StatusBar.vue](file:///d:/huaYouProject/packages/web/src/components/game/StatusBar.vue)

显示游戏状态信息，包括：
- 时间信息（天数、时段）
- 四维状态条（精力、心情、健康、存款）
- 技能列表与经验条

**状态条颜色：**
- 低（<30）：红色渐变
- 中（30-70）：黄色渐变
- 高（≥70）：绿色渐变

#### 4.5.2 剧情对话框组件

**文件**：[DialogBox.vue](file:///d:/huaYouProject/packages/web/src/components/game/DialogBox.vue)

展示剧情文本，带有打字机效果。

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `string` | - | 要显示的文本 |
| `speed` | `number` | 50 | 打字速度（ms/字） |

**功能：**
- 打字机动画效果
- 点击跳过打字效果
- 完成后显示「点击继续」提示

#### 4.5.3 选项列表组件

**文件**：[OptionList.vue](file:///d:/huaYouProject/packages/web/src/components/game/OptionList.vue)

展示事件选项列表。

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `options` | `EventOption[]` | - | 选项列表 |
| `disabled` | `boolean` | `false` | 是否禁用 |

**Events：**

| 事件 | 参数 | 说明 |
|------|------|------|
| `select` | `option: EventOption` | 选择选项时触发 |

### 4.6 页面视图

#### 4.6.1 主菜单页面

**文件**：[HomeView.vue](file:///d:/huaYouProject/packages/web/src/views/HomeView.vue)

游戏主菜单，包含：
- 游戏标题与副标题
- 开始游戏按钮
- 读取存档按钮（无存档时禁用）
- 设置按钮
- 版本信息

#### 4.6.2 游戏主界面

**文件**：[GameView.vue](file:///d:/huaYouProject/packages/web/src/views/GameView.vue)

游戏核心界面，包含：
- 顶部导航栏（返回、章节标题、存档按钮）
- 状态栏
- 效果提示（选项效果浮动提示）
- 事件标题与描述
- 剧情对话框
- 选项列表
- 章节结束界面

**核心交互流程：**
1. 进入页面时自动开始游戏
2. 显示事件文本（打字机效果）
3. 文本完成后显示选项
4. 选择选项后显示效果提示
5. 推进时间并加载下一个事件

#### 4.6.3 存档管理页面

**文件**：[SaveView.vue](file:///d:/huaYouProject/packages/web/src/views/SaveView.vue)

存档管理界面，包含：
- 3个存档槽位
- 每个槽位显示：存档名、时间、天数、时段、状态
- 操作按钮：存档、读取、删除

#### 4.6.4 设置页面

**文件**：[SettingsView.vue](file:///d:/huaYouProject/packages/web/src/views/SettingsView.vue)

游戏设置界面，包含：
- 游戏设置（文字速度、背景音乐、音效）
- 数据管理（重置存档）
- 关于信息

---

## 5. 共享层模块详解

### 5.1 类型定义

**文件**：[game.types.ts](file:///d:/huaYouProject/packages/shared/src/types/game.types.ts)

#### 5.1.1 状态系统类型

```typescript
// 四维玩家状态
interface PlayerStatus {
  energy: number    // 精力 (0-100)
  mood: number      // 心情 (0-100)
  health: number    // 健康 (0-100)
  money: number     // 存款 (0-∞)
}

// 状态变化（增量）
interface StatusChange {
  energy?: number
  mood?: number
  health?: number
  money?: number
}
```

#### 5.1.2 技能系统类型

```typescript
type SkillType = 'programming' | 'operation' | 'social'

interface Skill {
  id: SkillType
  name: string
  level: number       // 0-5
  experience: number  // 当前经验
  maxExperience: number // 升级所需经验
}

interface SkillConfig {
  id: SkillType
  name: string
  description: string
  maxLevel: number
  experienceRequired: number[]  // 每级所需经验
}
```

#### 5.1.3 时间系统类型

```typescript
type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night'

interface TimeState {
  day: number           // 当前天数
  period: TimePeriod    // 当前时段
  totalDays: number     // 总天数
}
```

#### 5.1.4 事件系统类型

```typescript
interface EventCondition {
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
  skills?: Partial<Record<SkillType, number>>
  flags?: string[]
}

interface EventOption {
  id: string
  text: string
  effects: StatusChange
  skillEffects?: Partial<Record<SkillType, number>>
  nextEvent?: string
  flags?: string[]
  condition?: EventCondition
}

interface GameEvent {
  id: string
  name: string
  description: string
  text: string
  options: EventOption[]
  condition?: EventCondition
  priority?: number
  cooldown?: number
  isRandom?: boolean
  isMain?: boolean
}
```

#### 5.1.5 存档系统类型

```typescript
interface SaveData {
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

interface SaveSlot {
  id: number
  isEmpty: boolean
  data?: SaveData
}
```

### 5.2 常量与枚举

**文件**：[game.enum.ts](file:///d:/huaYouProject/packages/shared/src/constants/game.enum.ts)

#### 5.2.1 时段枚举

| 常量 | 值 | 说明 |
|------|----|------|
| `TIME_PERIODS` | `['morning', 'afternoon', 'evening', 'night']` | 时段列表 |
| `TIME_PERIOD_NAMES` | `{ morning: '早晨', ... }` | 时段中文名 |
| `TIME_PERIOD_HOURS` | `{ morning: [6, 12], ... }` | 时段小时范围 |

#### 5.2.2 技能枚举

| 常量 | 值 | 说明 |
|------|----|------|
| `SKILL_TYPES` | `['programming', 'operation', 'social']` | 技能类型列表 |
| `SKILL_NAMES` | `{ programming: '编程入门', ... }` | 技能中文名 |
| `SKILL_DESCRIPTIONS` | - | 技能描述 |

#### 5.2.3 状态枚举

| 常量 | 值 | 说明 |
|------|----|------|
| `STATUS_KEYS` | `['energy', 'mood', 'health', 'money']` | 状态键名 |
| `STATUS_NAMES` | - | 状态中文名 |
| `STATUS_ICONS` | - | 状态图标（emoji） |

#### 5.2.4 存档枚举

| 常量 | 值 | 说明 |
|------|----|------|
| `SAVE_STORAGE_KEY` | `'huayou_saves'` | localStorage 键名 |
| `MAX_SAVE_SLOTS` | `3` | 最大存档槽位数 |
| `GAME_VERSION` | `'0.1.0'` | 游戏版本号 |

#### 5.2.5 事件优先级

| 级别 | 值 |
|------|----|
| LOW | 10 |
| NORMAL | 30 |
| HIGH | 60 |
| MUST | 100 |

### 5.3 平衡配置

**文件**：[balance.config.ts](file:///d:/huaYouProject/packages/shared/src/config/balance.config.ts)

#### 5.3.1 游戏基础配置

```typescript
GAME_CONFIG = {
  maxStatus: 100,           // 状态最大值
  minStatus: 0,             // 状态最小值
  initialStatus: {          // 初始状态
    energy: 80,
    mood: 30,
    health: 70,
    money: 3200
  },
  maxSkillLevel: 5,         // 最大技能等级
  saveSlots: 3              // 存档槽位数
}
```

#### 5.3.2 技能配置

| 技能 | 最大等级 | 升级经验曲线 |
|------|----------|-------------|
| 编程入门 | 5 | [0, 100, 300, 650, 1150, 1850] |
| 运营基础 | 5 | [0, 100, 300, 650, 1150, 1850] |
| 社交能力 | 10 | [0, 50, 120, 220, 350, 520, 730, 990, 1310, 1710, 2200] |

#### 5.3.3 效率系数

| 状态 | 高阈值 | 高效系数 | 正常范围 | 正常系数 | 低阈值 | 低系数 |
|------|--------|----------|----------|----------|--------|--------|
| 精力 | >80 | 1.5 | 30-80 | 1.0 | <30 | 0.5 |
| 心情 | >70 | 1.3 | 30-70 | 1.0 | <30 | 0.7 |
| 健康 | >80 | 1.5 | 50-80 | 1.0 | <50 | 0.7 |

#### 5.3.4 时间价值

| 时段 | 效率系数 |
|------|----------|
| 早晨 | 1.5 |
| 下午 | 1.0 |
| 晚上 | 0.8 |
| 深夜 | 0.5 |

### 5.4 计算工具

**文件**：[calculator.ts](file:///d:/huaYouProject/packages/shared/src/utils/calculator.ts)

#### 5.4.1 状态计算

| 函数 | 签名 | 说明 |
|------|------|------|
| `clampStatus` | `(value: number) => number` | 限制状态值在有效范围 |
| `applyStatusChange` | `(current: PlayerStatus, change: StatusChange) => PlayerStatus` | 应用状态变化 |
| `checkStatusCondition` | `(status: PlayerStatus, condition) => boolean` | 检查状态条件 |

#### 5.4.2 效率计算

| 函数 | 签名 | 说明 |
|------|------|------|
| `getEnergyEfficiency` | `(energy: number) => number` | 计算精力效率 |
| `getMoodEfficiency` | `(mood: number) => number` | 计算心情效率 |
| `getHealthEfficiency` | `(health: number) => number` | 计算健康效率 |
| `getOverallEfficiency` | `(status: PlayerStatus) => number` | 计算综合效率 |

#### 5.4.3 技能计算

| 函数 | 签名 | 说明 |
|------|------|------|
| `getSkillUpgradeExperience` | `(skill: Skill) => number` | 获取升级所需经验 |
| `canSkillUpgrade` | `(skill: Skill) => boolean` | 检查是否可升级 |
| `applySkillExperience` | `(skill: Skill, experience: number) => Skill` | 应用技能经验 |

#### 5.4.4 工具函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `generateId` | `() => string` | 生成唯一 ID |
| `randomInt` | `(min: number, max: number) => number` | 随机整数 |
| `randomFloat` | `(min: number, max: number) => number` | 随机浮点数 |
| `deepClone` | `<T>(obj: T) => T` | 深拷贝 |

---

## 6. 游戏核心系统

### 6.1 四维状态系统

#### 6.1.1 状态说明

| 状态 | 图标 | 范围 | 说明 |
|------|------|------|------|
| 精力 (energy) | ⚡ | 0-100 | 影响学习/工作效率 |
| 心情 (mood) | 😊 | 0-100 | 影响整体效率和事件触发 |
| 健康 (health) | ❤️ | 0-100 | 影响效率，过低会生病 |
| 存款 (money) | 💰 | 0-∞ | 游戏货币，用于消费 |

#### 6.1.2 状态变化机制

- 状态变化通过事件选项的 `effects` 触发
- 状态值会被 clamp 在有效范围内（存款最低为 0）
- 状态影响综合效率系数，进而影响技能经验获取

### 6.2 技能系统

#### 6.2.1 技能列表

| 技能 | 类型 | 最大等级 | 说明 |
|------|------|----------|------|
| 编程入门 | programming | 5 | 影响程序员路线面试通过率 |
| 运营基础 | operation | 5 | 影响运营路线面试通过率 |
| 社交能力 | social | 10 | 影响人脉事件触发概率 |

#### 6.2.2 技能升级机制

1. 通过事件选项的 `skillEffects` 获取经验
2. 经验获取受综合效率系数影响
3. 经验达到阈值时自动升级
4. 升级后 `maxExperience` 更新为下一级所需经验

### 6.3 时间系统

#### 6.3.1 时段划分

| 时段 | 时间范围 | 效率系数 |
|------|----------|----------|
| 早晨 (morning) | 6:00 - 12:00 | 1.5 |
| 下午 (afternoon) | 12:00 - 18:00 | 1.0 |
| 晚上 (evening) | 18:00 - 24:00 | 0.8 |
| 深夜 (night) | 0:00 - 6:00 | 0.5 |

#### 6.3.2 时间推进

- 每次选择选项后推进一个时段
- 深夜之后进入第二天早晨
- 第一章总天数为 20 天

### 6.4 标志系统

剧情标志（flags）用于记录玩家的选择和剧情进度：
- 用于事件触发条件判断
- 用于选项显示条件判断
- 保存在存档中

---

## 7. 事件系统

### 7.1 事件分类

| 类型 | 字段 | 说明 |
|------|------|------|
| 主线事件 | `isMain: true` | 按顺序推进的核心剧情 |
| 随机事件 | `isRandom: true` | 随机触发的支线事件 |

### 7.2 事件数据结构

事件数据以 JSON 格式存储在 `packages/web/src/data/events/` 目录下。

**示例：**

```json
{
  "id": "scene_1_1",
  "name": "不对的早晨",
  "description": "第一章 · 醒来",
  "text": "剧情文本...",
  "options": [
    {
      "id": "option_1_1_1",
      "text": "选项文本",
      "effects": { "mood": -5 },
      "flags": ["confirmed_dream"],
      "nextEvent": "scene_1_2"
    }
  ],
  "isMain": true,
  "priority": 100
}
```

### 7.3 事件触发条件

事件可以设置多种触发条件：

| 条件类型 | 字段 | 说明 |
|----------|------|------|
| 状态条件 | `minEnergy`, `maxMood` 等 | 状态值范围要求 |
| 时间条件 | `period`, `minDay`, `maxDay` | 时间范围要求 |
| 技能条件 | `skills` | 技能等级要求 |
| 标志条件 | `flags` | 已解锁标志要求 |

### 7.4 事件选择流程

```
玩家选择选项
    ↓
应用选项效果（状态/技能/标志）
    ↓
推进时间（一个时段）
    ↓
检查是否有 nextEvent
    ├─ 有 → 触发指定事件
    └─ 无 → 自动选择下一个事件
              ↓
         优先主线事件？
              ├─ 是 → 选择第一个可用主线事件
              └─ 否 → 按优先级加权随机选择随机事件
```

### 7.5 冷却机制

- 事件可设置 `cooldown`（冷却事件数）
- 在冷却期内的事件不会被重复触发
- 冷却基于事件历史记录计算

---

## 8. 存档系统

### 8.1 存储方式

- **存储位置**：浏览器 localStorage
- **存储键名**：`huayou_saves`
- **数据格式**：JSON 序列化的 `SaveSlot[]`

### 8.2 存档槽位

- 共 3 个存档槽位
- 每个槽位独立保存
- 支持存档命名（默认「存档 N」）

### 8.3 存档内容

存档包含完整的游戏状态：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 存档唯一 ID |
| `name` | `string` | 存档名称 |
| `timestamp` | `number` | 存档时间戳 |
| `day` | `number` | 当前天数 |
| `period` | `TimePeriod` | 当前时段 |
| `status` | `PlayerStatus` | 玩家状态 |
| `skills` | `Skill[]` | 技能列表 |
| `flags` | `string[]` | 剧情标志 |
| `currentEvent` | `string?` | 当前事件 ID |
| `version` | `string` | 游戏版本 |

---

## 9. 依赖关系图

### 9.1 包依赖关系

```
@huaYou/web (前端)
    └── @huaYou/shared (共享层)

@huaYou/server (后端，第二阶段)
    └── @huaYou/shared (共享层)
```

### 9.2 前端模块依赖

```
main.ts
    ├── App.vue
    ├── router/index.ts
    │     └── views/*.vue
    │           ├── components/game/*.vue
    │           ├── stores/*.store.ts
    │           └── hooks/useEventEngine.ts
    │                 ├── stores/player.store.ts
    │                 ├── stores/game.store.ts
    │                 ├── data/events/chapter1.json
    │                 └── @shared/*
    └── stores/index.ts
          ├── player.store.ts → @shared/*
          ├── game.store.ts → @shared/*
          └── save.store.ts → player.store, game.store, @shared/*
```

### 9.3 别名路径配置

| 别名 | 路径 | 说明 |
|------|------|------|
| `@/*` | `src/*` | 前端源码根目录 |
| `@shared/*` | `../shared/src/*` | 共享层源码目录 |

---

## 10. 项目运行与构建

### 10.1 环境要求

- Node.js >= 16
- pnpm >= 8

### 10.2 安装依赖

在项目根目录执行：

```bash
pnpm install
```

### 10.3 开发命令

所有命令在项目根目录执行：

| 命令 | 说明 |
|------|------|
| `pnpm dev:web` | 启动前端开发服务器 |
| `pnpm build:web` | 构建前端生产产物 |
| `pnpm lint` | 全量代码规范检查 |
| `pnpm format` | 全量代码自动格式化 |
| `pnpm type-check` | 全局 TypeScript 类型检查 |

### 10.4 前端专用命令

在 `packages/web` 目录下执行：

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 Vite 开发服务器 |
| `pnpm build` | 类型检查 + 生产构建 |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | ESLint 检查 |
| `pnpm format` | Prettier 格式化 |
| `pnpm type-check` | TypeScript 类型检查 |

### 10.5 构建配置

**Vite 配置**：[vite.config.ts](file:///d:/huaYouProject/packages/web/vite.config.ts)

- 插件：`@vitejs/plugin-vue`
- 路径别名：`@` → `src`，`@shared` → `../shared/src`

**TypeScript 配置**：[tsconfig.json](file:///d:/huaYouProject/packages/web/tsconfig.json)

- 目标：ES2020
- 模块：ESNext
- 严格模式：开启
- 路径别名：与 Vite 配置一致

---

## 11. 开发规范与约定

### 11.1 代码风格

- 使用 TypeScript 严格模式
- Vue 组件使用 `<script setup lang="ts">` 语法
- 使用 Composition API 风格
- 文件名使用 kebab-case（Vue 组件使用 PascalCase）

### 11.2 目录约定

| 目录 | 用途 |
|------|------|
| `components/` | 可复用 UI 组件 |
| `views/` | 页面级组件 |
| `stores/` | Pinia 状态管理 |
| `hooks/` | 组合式函数（业务逻辑） |
| `utils/` | 纯工具函数 |
| `types/` | TypeScript 类型定义 |
| `data/` | 静态数据配置 |
| `assets/` | 构建内资源 |

### 11.3 Store 约定

- 使用 Composition API 风格定义 Store
- 状态、计算属性、操作分组清晰
- 操作函数命名使用动词开头
- 跨 Store 访问通过导入对应 Store

### 11.4 事件数据约定

- 事件 ID 格式：`scene_{章节}_{序号}`
- 选项 ID 格式：`option_{事件序号}_{选项序号}`
- 主线事件设置 `isMain: true`
- 随机事件设置 `isRandom: true`

---

## 12. 第二阶段规划

### 12.1 后端服务

**包**：`@huaYou/server`

**技术栈**：
- NestJS 框架
- MongoDB 数据库
- Mongoose ODM

**模块规划**：
- 用户模块（user）：注册、登录、用户信息
- 存档模块（save）：云存档同步
- 游戏配置模块（game/event）：事件配置管理
- 成就模块（achievement）：成就系统

### 12.2 迁移计划

1. 将前端静态数据迁移到后端数据库
2. 实现用户认证系统
3. 实现云存档同步
4. 逐步将游戏逻辑迁移到后端
5. 前端适配 API 调用

---

## 附录

### A. 相关文档

- [AGENTS.md](file:///d:/huaYouProject/AGENTS.md) - AI Agent 项目指令
- [README.md](file:///d:/huaYouProject/README.md) - 项目说明
- [docs/game-design/](file:///d:/huaYouProject/docs/game-design/) - 游戏设计文档

### B. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1.0 | 2026-07-14 | 初始版本，MVP 阶段文档 |
