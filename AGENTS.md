# AGENTS.md

> 给 AI Coding Agent 看的项目指令 | 兼容 Cursor / Copilot / Claude Code / 灵码

本文件仅保留硬性规则与导航索引，详情见 docs/ 目录

## 1. 项目概述

《话游》是一款「交互式叙事 + 人生模拟」网页游戏，核心玩法为「一句话改变平行时空人生」——玩家通过剧情选项影响角色状态与故事走向，最终走向不同结局。

- **技术栈**: Vue 3 + TypeScript + Pinia + Vite（前端）；NestJS + MongoDB（后端，第二阶段启用）
- **仓库方案**: pnpm workspace monorepo，分为 web / server / shared 三个子包
- **当前阶段**: 第一阶段 MVP，纯前端本地运行，localStorage 存档；后端仅预留目录占位
- **核心系统**: 四维状态（精力/心情/健康/存款）+ 技能成长树 + 事件分支剧情 + 本地多存档

## 2. 快速命令

所有命令在项目根目录执行：

```bash
# 安装全局依赖
pnpm install

# 启动前端开发服务（第一阶段唯一运行入口）
pnpm dev:web

# 构建前端生产产物
pnpm build:web

# 全量代码规范检查
pnpm lint

# 全量代码自动格式化
pnpm format

# 全局 TypeScript 类型检查
pnpm type-check
```

### 3.仓库结构概览

````
huayou/
├── packages/
│   ├── web/          # 前端游戏主程序 ✅ 当前阶段核心开发包
│   ├── server/       # 后端服务 ⏸️ 预留占位，第二阶段正式开发
│   └── shared/       # 前后端共享：类型定义 / 常量 / 纯工具函数
├── docs/             # 详细开发文档（本文件为导航入口，详情见此目录）
├── scripts/          # 构建、检查、部署脚本
├── AGENTS.md         # 本文件
├── README.md         # 给人类看的项目说明
└── pnpm-workspace.yaml
````

#### 3.1 前端目录

````
packages/web/
├── public/                     # 静态资源（不参与构建）
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/                 # 构建内资源
│   │   ├── images/             # 封面、场景图
│   │   ├── audios/             # BGM、音效
│   │   └── styles/             # 全局样式、变量、主题
│   ├── components/             # 通用组件
│   │   ├── common/             # 基础组件（按钮、弹窗、提示）
│   │   ├── game/               # 游戏专属组件
│   │   │   ├── StatusBar.vue   # 状态栏（精力/心情/健康/存款）
│   │   │   ├── DialogBox.vue   # 剧情文本对话框
│   │   │   ├── OptionList.vue  # 选项列表
│   │   │   └── TagCloud.vue    # 技能/标签展示
│   │   └── layout/             # 布局组件
│   ├── stores/                 # Pinia 状态管理
│   │   ├── game.store.ts       # 游戏主状态（天数、场景、进度）
│   │   ├── player.store.ts     # 玩家属性状态
│   │   ├── skill.store.ts      # 技能系统
│   │   └── save.store.ts       # 存档管理
│   ├── views/                  # 页面级视图
│   │   ├── HomeView.vue        # 主菜单页
│   │   ├── GameView.vue        # 游戏主界面
│   │   ├── SaveView.vue        # 存档页
│   │   └── SettingsView.vue    # 设置页
│   ├── router/                 # 路由配置
│   │   └── index.ts
│   ├── hooks/                  # 组合式函数
│   │   ├── useGameEngine.ts    # 游戏引擎核心逻辑
│   │   ├── useEventTrigger.ts  # 事件触发判定
│   │   └── useLocalSave.ts     # 本地存档封装
│   ├── data/                   # 游戏静态配置（第一阶段放前端）
│   │   ├── events/             # 剧情事件表
│   │   │   ├── chapter1.json   # 第一章事件配置
│   │   │   └── random.json     # 随机事件池
│   │   ├── skills.json         # 技能树配置
│   │   └── achievements.json   # 成就配置
│   ├── utils/                  # 工具函数
│   │   ├── calculator.ts       # 数值计算
│   │   ├── typewriter.ts       # 打字机效果
│   │   └── storage.ts          # 本地存储封装
│   ├── types/                  # 前端专属类型
│   │   └── index.d.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── .env.development
├── .env.production
└── package.json
````

#### 3.2 后端目录（暂未启用）

````
packages/server/
├── src/
│   ├── common/                 # 公共模块
│   │   ├── filters/            # 全局异常过滤器
│   │   ├── interceptors/       # 响应拦截器
│   │   ├── guards/             # 鉴权守卫
│   │   └── dto/                # 通用 DTO
│   ├── config/                 # 配置模块
│   │   ├── env.config.ts       # 环境变量
│   │   └── database.config.ts  # 数据库配置
│   ├── modules/                # 业务模块
│   │   ├── user/               # 用户模块
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.schema.ts  # Mongoose Schema
│   │   │   └── user.dto.ts
│   │   ├── save/               # 存档模块
│   │   │   ├── save.controller.ts
│   │   │   ├── save.service.ts
│   │   │   └── save.schema.ts
│   │   ├── game/               # 游戏配置模块
│   │   │   ├── event.controller.ts
│   │   │   ├── event.service.ts
│   │   │   └── event.schema.ts
│   │   └── achievement/        # 成就模块（预留）
│   ├── app.module.ts
│   └── main.ts
├── test/                       # 测试用例（预留）
├── .env.development
├── .env.production
├── nest-cli.json
├── tsconfig.json
└── package.json
````

#### 3.3 共享层

````
packages/shared/
├── src/
│   ├── types/                  # 前后端共用类型定义
│   │   ├── game.types.ts       # 游戏核心类型（玩家状态、事件结构）
│   │   ├── save.types.ts       # 存档数据结构
│   │   └── api.types.ts        # 接口响应通用类型
│   ├── constants/              # 全局常量与枚举
│   │   ├── game.enum.ts        # 场景、时段、事件类型枚举
│   │   └── status.enum.ts      # 属性键名、默认值常量
│   ├── config/                 # 游戏配置（前后端共用，第二阶段迁移到后端）
│   │   └── balance.config.ts   # 数值平衡基础参数
│   └── utils/                  # 无环境依赖的纯工具函数
│       ├── validator.ts        # 数据格式校验
│       ├── calculator.ts       # 属性计算公式
│       └── deepClone.ts
├── tsconfig.json
└── package.json
````

