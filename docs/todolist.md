# 话游 · 游戏开发Development TodoLis

> 部分内容由豆包生成

# 话游 · 游戏开发 TodoList

> 技术栈：Vue 3 + TypeScript + Pinia（前端为主）| Node.js + MongoDB（第二阶段引入）  
游戏类型：交互式叙事 + 人生模拟（平行时空题材）  
开发策略：三阶段迭代，优先验证核心玩法

***

## 第一阶段：MVP 原型（纯前端，本地存档）

**目标**：跑通核心玩法循环，验证「人生选择」叙事和数值系统是否有趣。  
**预计产出**：可玩的第一章 Demo，数据存在 localStorage。

### 1.1 项目搭建

- [x] 初始化 Vue 3 + TS + Vite 项目 ✅ 2026-07-10
- [x] 配置 Pinia 状态管理 ✅ 2026-07-10
- [x] 配置路由（Vue Router）：主菜单 / 游戏页 / 设置页 / 存档页 ✅ 2026-07-10
- [x] 基础 CSS 样式框架搭建（暗色赛博时空主题） ✅ 2026-07-10
- [x] 全局样式变量与重置样式 ✅ 2026-07-10

### 1.2 核心系统：人物状态

- [x] 设计四维状态模型：精力 / 心情 / 健康 / 存款 ✅ 2026-07-10
- [x] 实现状态 Store（Pinia），支持增减、边界检查、状态联动 ✅ 2026-07-10
- [x] 状态变化的视觉反馈（进度条 / 数值变化动效） ✅ 2026-07-10
- [x] 状态归零的触发逻辑（精力归零强制休息、心情归零触发emo事件等） ✅ 2026-07-10

### 1.3 核心系统：技能与成长

- [x] 设计技能数据结构（ID、名称、等级、效果、描述） ✅ 2026-07-10
- [x] 实现技能 Store：学习 / 升级 / 效果计算 ✅ 2026-07-10
- [x] 技能树雏形（编程 / 运营 / 社交 三条技能线） ✅ 2026-07-10
- [x] 学习行为触发技能经验增长 ✅ 2026-07-10

### 1.4 核心系统：剧情事件引擎

- [x] 设计事件数据结构（文本、选项列表、触发条件、结果数值） ✅ 2026-07-10
- [x] 实现事件引擎：读取事件 → 展示选项 → 执行结果 → 推进剧情 ✅ 2026-07-10
- [x] 剧情分支记录（已选择项持久化，影响后续事件） ✅ 2026-07-10
- [x] 文字打字机显示效果 + 速度调节 ✅ 2026-07-10

### 1.5 核心系统：时间推进

- [x] 天数 / 时段系统（早 / 午 / 晚 / 夜） ✅ 2026-07-10
- [x] 时间推进机制：每个行为消耗对应时长 ✅ 2026-07-10
- [x] 日期特殊事件触发（周末、节日、发薪日） ✅ 2026-07-15
- [x] 睡眠恢复机制（熬夜惩罚、规律作息奖励） ✅ 2026-07-15

### 1.6 存档系统（本地）

- [x] localStorage 存档：保存 / 读取 / 删除 ✅ 2026-07-10
- [x] 多存档位支持（至少 3 个槽位） ✅ 2026-07-10
- [x] 存档缩略信息显示（天数、当前职业、存款） ✅ 2026-07-10
- [x] 自动存档机制（关键节点自动存） ✅ 2026-07-15

### 1.7 UI 界面

- [x] 主菜单界面（开始游戏 / 读取存档 / 设置 / 关于） ✅ 2026-07-10
- [x] 游戏主界面布局：顶部状态栏 + 中间剧情区 + 底部操作区 ✅ 2026-07-10
- [x] 选项按钮组件（悬停/点击动效） ✅ 2026-07-10
- [x] 状态栏技能面板显示（编程/运营/社交等级和经验条） ✅ 2026-07-10
- [x] 选项效果提示（浮动通知显示状态变化） ✅ 2026-07-10
- [x] 章节标题栏 ✅ 2026-07-10
- [x] 章节结束画面（状态统计 + 继续探索） ✅ 2026-07-10
- [x] 状态详情弹窗 / 技能面板弹窗 ✅ 2026-07-15
- [x] 设置页（音量 / 文字速度 / 重置存档） ✅ 2026-07-10

### 1.8 内容填充（第一章）

- [x] 撰写第一章完整剧情：现实开场 → 穿越确认 → 人生抉择 ✅ 2026-07-10
- [x] 重写开场剧情和4条主线独立结局场景 ✅ 2026-07-10
- [x] 设计 10+ 个随机事件（开黑邀请、偶遇学长、余额提醒等） ✅ 2026-07-10
- [x] 扩展随机事件至10个（同学、疲惫、天气、食堂、灵感） ✅ 2026-07-10
- [x] 配置 4 条主线分支（程序员 / 边工作边学 / 运营产品 / 享受当下） ✅ 2026-07-10
- [x] 选项支持多字段效果（同时改变多个状态+技能经验） ✅ 2026-07-10
- [x] 数值平衡初调（精力消耗速率、技能成长曲线） ✅ 2026-07-15

### 1.9 打磨与测试

- [x] 移动端响应式适配 ✅ 2026-07-15
- [x] 完整流程走测，修复 Bug ✅ 2026-07-10
- [ ] 收集反馈，调整难度与剧情节奏
- [x] 首屏加载优化 ✅ 2026-07-15

### 1.10 共享层（packages/shared）

- [x] 类型定义：game.types.ts（状态、技能、事件、存档等核心类型） ✅ 2026-07-10
- [x] 枚举常量：game.enum.ts（时段、技能名称、状态图标） ✅ 2026-07-10
- [x] 平衡配置：balance.config.ts（状态恢复、效率系数、事件概率） ✅ 2026-07-10
- [x] 工具函数：calculator.ts（状态计算、技能升级、效率计算） ✅ 2026-07-10

### 1.11 设计文档（docs/game-design）

- [x] 世界观设定文档 ✅ 2026-07-10
- [x] 角色档案文档 ✅ 2026-07-10
- [x] 四维状态系统文档 ✅ 2026-07-10
- [x] 技能成长系统文档 ✅ 2026-07-10
- [x] 时间推进系统文档 ✅ 2026-07-10
- [x] 第一章完整剧情文档 ✅ 2026-07-10
- [x] 第二章/第三章规划文档 ✅ 2026-07-10
- [x] 随机事件池文档 ✅ 2026-07-10
- [x] 事件触发规则文档 ✅ 2026-07-10
- [x] 结局分支文档 ✅ 2026-07-10
- [x] 结局判定逻辑文档 ✅ 2026-07-10

### 第一阶段进度总结

| 模块         | 完成度 | 状态                                  |
| ------------ | ------ | ------------------------------------- |
| 项目搭建     | 100%   | ✅ 完成                               |
| 四维状态系统 | 100%   | ✅ 完成                               |
| 技能成长系统 | 100%   | ✅ 完成                               |
| 剧情事件引擎 | 100%   | ✅ 完成                               |
| 时间推进系统 | 100%   | ✅ 完成（日期事件+睡眠机制）          |
| 存档系统     | 100%   | ✅ 完成（自动存档）                   |
| UI 界面      | 100%   | ✅ 完成（弹窗组件+响应式）            |
| 内容填充     | 100%   | ✅ 完成（数值平衡调整）               |
| 打磨测试     | 90%    | ✅ 主要完成（响应式+加载优化，待反馈）|
| 共享层       | 100%   | ✅ 完成                               |
| 设计文档     | 100%   | ✅ 完成                               |

**总体进度：约 98%**

***

## 第二阶段：后端 + 云存档（Node.js + MongoDB）

**目标**：加入账号系统与云存档，支持多设备同步；剧情内容可热更新。  
**预计产出**：带用户系统的正式版，数据存在 MongoDB。

### 2.1 后端搭建

- [ ] Node.js + NestJS 项目初始化（TypeScript 全栈统一）
- [ ] MongoDB 连接与 Mongoose 配置
- [ ] 基础项目结构分层（Controller / Service / Schema）
- [ ] 接口统一响应格式与全局错误处理

### 2.2 用户系统

- [ ] 用户注册 / 登录接口（邮箱 + 密码）
- [ ] JWT Token 鉴权中间件
- [ ] 密码加密存储（bcrypt）
- [ ] 前端登录 / 注册页面
- [ ] 个人资料页（昵称、头像、游戏统计）

### 2.3 云存档系统

- [ ] 设计 Save Schema（关联 userId，支持多存档位）
- [ ] 存档 CRUD 接口：上传 / 拉取 / 删除 / 列表
- [ ] 前端：本地存档同步到云端
- [ ] 冲突处理策略（云端覆盖本地 / 手动选择保留）

### 2.4 配置数据后端化

- [ ] 技能配置迁移到 MongoDB（skills 集合）
- [ ] 事件 / 剧情配置迁移到数据库
- [ ] 前端启动时拉取配置，支持热更新
- [ ] 简易后台管理：配置编辑与发布

### 2.5 成就系统

- [ ] 设计成就数据模型（名称、解锁条件、图标、描述、稀有度）
- [ ] 成就触发检测逻辑（事件驱动 + 状态监听）
- [ ] 成就解锁弹窗动画
- [ ] 个人成就墙页面展示

### 2.6 部署

- [ ] 后端部署（阿里云 ECS + Docker / 或者 Serverless）
- [ ] MongoDB 部署（云数据库 / 自建）
- [ ] 前端静态资源部署（CDN / OSS）
- [ ] 域名 + HTTPS 配置
- [ ] 日志与监控接入

***

## 第三阶段：社交化 + 内容扩充

**目标**：增加社交与排行榜功能，扩充游戏内容，提升留存与传播。

### 3.1 排行榜系统

- [ ] 设计排行榜维度：最快通关 / 最高存款 / 全成就 / 存活天数
- [ ] 排行榜接口：全服榜 / 好友榜 / 周榜月榜
- [ ] 前端排行榜页面
- [ ] 排行榜数据刷新与 Redis 缓存策略

### 3.2 好友系统

- [ ] 好友添加 / 搜索 / 申请接口
- [ ] 好友列表与在线状态展示
- [ ] 查看好友的游戏数据与成就
- [ ] 分享人生轨迹功能（生成分享图）

### 3.3 内容扩充

- [ ] 第二章剧情开发（面试季 / 职场新人期）
- [ ] 第三章剧情开发（晋升期 / 创业线 / 中年危机）
- [ ] 新增 30+ 随机事件
- [ ] 多结局设计（财富自由 / 平平淡淡 / 创业失败 / 家庭美满 等）
- [ ] 隐藏剧情与彩蛋事件

### 3.4 体验优化

- [ ] 背景音乐与音效系统（Howler.js）
- [ ] 场景背景图与转场动效
- [ ] 关键剧情 CG 插画
- [ ] 游戏内提示与新手引导
- [ ] 夜间模式 / 护眼模式

### 3.5 运营功能

- [ ] 游戏行为埋点与数据分析
- [ ] 公告 / 活动弹窗系统
- [ ] 反馈与 Bug 提交入口
- [ ] 版本更新日志页面
- [ ] 邀请好友奖励机制

***

## 长期迭代（可选方向）

- [ ] 多语言支持（中 / 英）
- [ ] Steam 移植（Electron 打包 + 成就同步）
- [ ] 创意工坊：玩家自制剧情模组
- [ ] 多人互动：和好友一起走同一条时间线
- [ ] DLC 扩展包：不同年代（2000 / 2010 / 2025）
- [ ] 周边：实体人生选择卡牌

> （注：部分内容可能由 AI 生成）

***

## 更新日志

### 2026-07-15

**第一阶段MVP完成 — 补全所有剩余开发任务**

#### 1. 时间推进系统增强（1.5 ✅）

- `packages/shared/src/types/game.types.ts` — TimeState 新增 `dayOfWeek`（星期几）、`consecutiveRegularSleep`（连续规律作息天数）、`stayedUpLate`（熬夜标记）；EventCondition 新增 `days`、`excludeFlags`；EventOption 新增 `timeAdvance`、`skipPeriods`
- `packages/shared/src/constants/game.enum.ts` — 新增 DAYS_OF_WEEK、WEEKEND_DAYS、SPECIAL_DATES 常量；新增 AUTO_SAVE_CONFIG 自动存档配置
- `packages/shared/src/config/balance.config.ts` — 新增 SLEEP_RECOVERY（睡眠恢复配置，含熬夜惩罚/周末加成/规律作息加成）、WEEKEND_CONFIG、PAYDAY_CONFIG、MONTH_END_CONFIG
- `packages/shared/src/utils/calculator.ts` — 新增 `getDayOfWeek()`、`isWeekend()`、`isPayday()`、`isMonthEnd()`、`calculateSleepRecovery()`、`getSkillMaxLevel()`；修复技能升级使用各技能独立 maxLevel
- `packages/web/src/stores/game.store.ts` — TimeState 跟踪 dayOfWeek/consecutiveRegularSleep/stayedUpLate；新增 `recordRegularSleep()`、`recordOvertimeSleep()`、`goToSleep()`；修正 isPayday 计算含第1天
- `packages/web/src/data/events/date-events.json` — 新增6个特殊日期事件：周六早晨/周六晚间/周日早晨/发薪日/月末总结/首个周末

#### 2. 睡眠恢复机制（1.5 ✅）

- 正常睡眠恢复精力35 + 心情2 + 健康1
- 熬夜惩罚：精力恢复不足(-15)、健康-2、心情-5
- 周末懒觉额外恢复：精力+15、心情+2
- 连续7天规律作息：恢复系数×1.3、心情+3、健康额外+3
- `packages/web/src/stores/player.store.ts` — 新增 `sleep()`、`applyOvertimePenalty()`、`sleepAfterOvertime()`、`applyPayday()`、`applyMonthlySummary()`

#### 3. 事件引擎整合（1.4/1.5 ✅）

- `packages/web/src/hooks/useEventEngine.ts` — 整合睡眠机制、特殊日期事件、自动存档触发、事件优先级系统；新增 `handleDayChange()` 处理日期变更（睡眠/熬夜/发薪日/月末总结）；修复周末奖励重复发放和熬夜惩罚数值；新增特殊日期提示和自动存档触发
- `packages/web/src/data/events/daily-events.json` — 新增日常自由活动事件（学习/工作/休息/社交/睡觉），每个时段有不同选项

#### 4. 自动存档机制（1.6 ✅）

- `packages/web/src/stores/save.store.ts` — 实现 autoSave() 功能，localStorage 持久化；新增自动存档提示（showAutoSaveHint，1.5秒后自动隐藏）；关键节点触发：每5个选项、每天早晨、章节结束

#### 5. UI 界面补全（1.7 ✅）

- `packages/web/src/components/common/BaseModal.vue` — 新建通用弹窗组件（Teleport + Transition，支持标题/关闭）
- `packages/web/src/components/game/StatusDetailModal.vue` — 新建状态详情弹窗（四维状态描述、综合效率、效率文本、小贴士）
- `packages/web/src/components/game/SkillPanelModal.vue` — 新建技能面板弹窗（技能总等级、各技能进度条/经验条/升级提示、技能说明）
- `packages/web/src/components/game/StatusBar.vue` — 新增星期显示、周末标识；状态栏/技能面板可点击打开详情弹窗
- `packages/web/src/views/GameView.vue` — 新增特殊日期提示、自动存档提示、星期/时段显示；结局界面显示评分和等级

#### 6. 数值平衡调整（1.8 ✅）

- 正常睡眠恢复 40→35，熬夜补觉 20→15，周末额外 15→10，规律作息系数 1.25→1.3
- 修正 PAYDAY_CONFIG.workRouteFlag 匹配 chapter1.json 中的 route_part_time
- 修复技能 maxLevel 使用各技能独立配置而非全局上限

#### 7. 移动端响应式适配（1.9 ✅）

- `packages/web/src/style.css` — 全局移动端优化：-webkit-tap-highlight-color、字体渲染、touch-action、移动端基础字号
- `packages/web/src/views/HomeView.vue` — 768px/480px 断点适配（标题缩放、间距调整）
- `packages/web/src/views/GameView.vue` — 头部/内容区/提示/结局界面移动端适配
- `packages/web/src/views/SaveView.vue` — 存档卡片/操作按钮移动端适配
- `packages/web/src/views/SettingsView.vue` — 设置项/滑块/重置按钮移动端适配
- `packages/web/src/components/game/StatusBar.vue` — 状态栏/技能列表/进度条移动端适配，小屏单列布局
- `packages/web/src/components/game/DialogBox.vue` — 对话框内边距/字号移动端适配
- `packages/web/src/components/game/OptionList.vue` — 选项按钮增大点击区域（min-height 48px）
- `packages/web/src/components/common/BaseModal.vue` — 小屏底部抽屉式布局（border-radius 上圆角）
- `packages/web/src/components/game/StatusDetailModal.vue` — 效率数值/提示列表移动端适配
- `packages/web/src/components/game/SkillPanelModal.vue` — 技能卡片/经验条移动端适配
- 所有页面使用 100svh 适配移动端浏览器视口

#### 8. 首屏加载优化（1.9 ✅）

- `packages/web/index.html` — 新增内联启动加载画面（Logo + Spinner + 加载文案）；新增 theme-color/description/viewport-fit meta 标签；加载画面响应式适配
- `packages/web/src/main.ts` — 路由就绪后挂载应用，requestAnimationFrame 淡出加载画面
- `packages/web/vite.config.ts` — 新增 build 配置：target es2015、manualChunks 分离 vue-vendor、开发服务器 host 0.0.0.0

#### 9. 质量保证

- ESLint 检查通过（0 错误，0 警告）
- TypeScript 类型检查通过（vue-tsc --noEmit）
- 生产构建成功（vue-vendor 105KB gzip 41KB，各页面按路由懒加载分割）

### 2026-07-10

**游戏内容开发**

- 重写 `chapter1.json` 事件配置：更完整的场景描述和内心独白
- 扩展主线事件：4条路线各有独立的结局场景
- 新增随机事件：偶遇同学、学习疲惫、天气很好、食堂偶遇、深夜灵感（共10个随机事件）
- 选项支持多字段效果：同时改变多个状态+技能经验

**UI 更新**

- 状态栏增加技能面板：显示编程/运营/社交技能等级和经验条
- 游戏界面增加章节标题栏
- 选项选择后显示效果提示（浮动通知）
- 章节结束画面：显示当前状态统计，支持继续探索

**项目初始化**

- 创建 `packages/shared` 共享层（类型、枚举、配置、工具函数）
- 创建路由配置（4个页面）
- 创建 Pinia Store（player、game、save）
- 创建基础组件（StatusBar、DialogBox、OptionList）
- 创建页面视图（Home、Game、Save、Settings）
- 创建事件引擎 Hook
- 创建设计文档目录结构（14个文档）
- 通过 TypeScript 类型检查和 ESLint 检查