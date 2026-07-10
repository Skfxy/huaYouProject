# 话游 · 游戏设计文档

> 本目录包含《话游》的全部游戏设计文档，供开发者与策划参考。

## 文档导航

### 世界观与角色

| 文档 | 说明 |
|------|------|
| [world-setting.md](./world-setting.md) | 世界观设定：平行时空穿越机制、时间线规则 |
| [characters.md](./characters.md) | 角色档案：主角设定、配角档案、关系网络 |

### 游戏系统

| 文档 | 说明 |
|------|------|
| [systems/status-system.md](./systems/status-system.md) | 四维状态系统：精力/心情/健康/存款 |
| [systems/skill-system.md](./systems/skill-system.md) | 技能成长系统：学习、升级、效果 |
| [systems/time-system.md](./systems/time-system.md) | 时间推进系统：天数、时段、日期事件 |

### 章节剧情

| 文档 | 说明 | 状态 |
|------|------|------|
| [chapters/chapter1.md](./chapters/chapter1.md) | 第一章：重启的2018 | ✅ 已完成 |
| [chapters/chapter2-plan.md](./chapters/chapter2-plan.md) | 第二章：面试季 | ⏳ 规划中 |
| [chapters/chapter3-plan.md](./chapters/chapter3-plan.md) | 第三章：职场新人 | ⏳ 规划中 |

### 随机事件

| 文档 | 说明 |
|------|------|
| [events/chapter1-events.md](./events/chapter1-events.md) | 第一章随机事件池 |
| [events/common-events.md](./events/common-events.md) | 通用事件（跨章节复用） |
| [events/event-rules.md](./events/event-rules.md) | 事件触发规则与优先级 |

### 结局设计

| 文档 | 说明 |
|------|------|
| [endings/chapter1-endings.md](./endings/chapter1-endings.md) | 第一章结局分支 |
| [endings/ending-rules.md](./endings/ending-rules.md) | 结局判定逻辑与多结局规则 |

---

## 与程序代码的分工

| 目录 | 用途 | 维护者 |
|------|------|--------|
| `docs/game-design/` | 设计文档，给人阅读 | 策划/剧情设计 |
| `packages/web/src/data/` | 配置数据，给程序读取 | 程序开发 |

**工作流程**：先在 `docs/game-design/` 中完成剧情设计，确认无误后再转化为 `packages/web/src/data/` 中的 JSON 配置。

---

## 版本记录

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026-07-10 | v0.1 | 初始化文档结构，完成第一章设计 |
