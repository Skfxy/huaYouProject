# Changelogs 文档系统搭建计划

## 仓库调研结论

### 当前状态
1. **现有文档结构**：
   - `docs/game-design/` - 游戏设计文档（世界观、系统、剧情等）
   - `docs/todolist.md` - 开发 TodoList，包含三阶段开发计划和更新日志（2026-07-10、2026-07-15）
   - `docs/README.md` - 仅简单标题，无实际索引内容
   - `docs/code-wiki.md` - 代码 wiki
   - `AGENTS.md` - 项目导航文档，未包含 changelogs 目录

2. **版本信息**：
   - 当前版本：v0.1.0 MVP（从首页可见）
   - 日期：2026-07-15

3. **需要整合的内容**：
   - `docs/todolist.md` 底部有两次更新日志（2026-07-10 和 2026-07-15）需要迁移
   - 本次检查发现的 16 个问题需要记录为第一份优化文档

## 需要编辑/创建的文件

### 新建文件/目录
1. **`docs/changelogs/`** - 新目录，存放所有更新日志
2. **`docs/changelogs/README.md`** - 索引文件，列出所有日志
3. **`docs/changelogs/2026-07-10_v0.1.0_initial-project-setup.md`** - 迁移 2026-07-10 初始项目搭建记录
4. **`docs/changelogs/2026-07-15_v0.1.0_mvp-completion.md`** - 迁移 2026-07-15 MVP 完成记录
5. **`docs/changelogs/2026-07-15_v0.1.1_bug-fixes-and-optimizations.md`** - 本次问题检查和优化记录

### 需要修改的文件
6. **`AGENTS.md`** - 更新文档目录结构，添加 changelogs 说明
7. **`docs/README.md`** - 更新文档索引，包含 changelogs 目录说明
8. **`docs/todolist.md`** - 移除底部的更新日志部分，添加指向 changelogs 的说明

## 修改步骤

### 步骤 1：创建 changelogs 目录和索引文件
- 创建 `docs/changelogs/` 目录
- 创建 `docs/changelogs/README.md`，包含：
  - 目录说明
  - 文件命名规范（YYYY-MM-DD_vX.Y.Z_short-description.md）
  - 日志类型说明（🔧 Bug修复 / ✨ 功能优化 / 🎨 UI改进 / ⚡ 性能优化 / 🆕 新功能）
  - 状态标记规范（- [ ] 未开始 / - [x] 已完成）
  - 表格索引列出所有日志

### 步骤 2：迁移历史更新日志
- 将 `docs/todolist.md` 中 2026-07-10 的更新日志迁移为独立文档
- 将 `docs/todolist.md` 中 2026-07-15 的 MVP 完成更新日志迁移为独立文档
- 每个迁移文档按照统一模板格式化：
  ```markdown
  # 标题
  
  - **日期**: YYYY-MM-DD
  - **版本**: vX.Y.Z
  - **类型**: 类型标签
  - **状态**: - [x] 已完成
  
  ## 更新内容
  <详细内容>
  
  ## 涉及文件
  - `path/to/file`
  ```

### 步骤 3：创建本次问题检查记录文档
创建 `2026-07-15_v0.1.1_bug-fixes-and-optimizations.md`，记录本次检查发现的所有问题：
- 🔴 严重问题（3个）
  1. 游戏无法正常启动 - 核心流程 Bug
  2. 序章结束后无事件可触发
  3. 存档加载后无法恢复当前剧情事件
- 🟡 中等问题（6个）
  4. 时间信息重复显示
  5. 存档页返回按钮逻辑不合理
  6. 设置页面功能未真正实现
  7. 开场事件时段与实际时间不匹配
  8. TypeScript 类型忽略（@ts-ignore）
  9. 事件选项缺少条件过滤
- 🟢 优化建议（7个）
  10. 代码格式问题（运行 pnpm format）
  11. 使用原生弹窗替代 alert/confirm
  12. 缺少加载状态确认
  13. 自动存档提示位置冲突
  14. 游戏流程中缺少返回主菜单的二次确认
  15. 技能 maxExperience 初始化问题
  16. 首屏背景图片加载优化
- 所有问题使用 checkbox 标记状态（初始为未完成）

### 步骤 4：更新 AGENTS.md
- 在 3.1 文档目录部分，添加 changelogs/ 目录说明：
  ```
  docs/
  ├── game-design/       # 游戏设计文档
  ├── changelogs/        # 更新日志与优化记录（每次优化/修复都在此新建文档）
  │   └── README.md      # 更新日志索引
  ├── README.md          # 文档总索引
  ├── code-wiki.md       # 代码知识库
  └── todolist.md        # 开发计划 TodoList（不含历史日志）
  ```
- 添加文档规范说明：每次新的优化/bug修复/功能迭代，必须在 `docs/changelogs/` 下新建对应日期版本的 md 文档，使用 checkbox 标记完成状态。

### 步骤 5：更新 docs/README.md
- 将简单标题替换为完整的文档目录索引
- 说明各目录用途
- 重点说明 changelogs 的使用规范

### 步骤 6：更新 docs/todolist.md
- 保留三阶段开发计划（第一/二/三阶段 + 长期迭代）
- 移除底部"更新日志"章节（2026-07-10 和 2026-07-15 内容）
- 在文件开头或结尾添加说明：历史更新日志已迁移至 `docs/changelogs/` 目录
- 保持第一阶段进度总结表格，但标记"待反馈"项在 changelogs 中跟踪

## 潜在依赖与注意事项

1. **文件命名规范一致性**：确保所有新建日志文件严格遵循 `YYYY-MM-DD_vX.Y.Z_description.md` 格式
2. **版本号递增规则**：本次问题修复建议从 v0.1.0 递增到 v0.1.1（patch 版本）
3. **Checkbox 使用规范**：所有任务项使用 `- [ ]` 或 `- [x]` 标记，方便后续跟踪
4. **向后兼容**：不删除 todolist.md，保留其作为开发路线图，仅将更新日志部分迁移
5. **索引文件同步**：每次新建 changelog 文档时，必须同步更新 `docs/changelogs/README.md` 中的索引表格

## 风险处理

1. **内容迁移完整性**：迁移历史日志时仔细对照原文，确保不遗漏任何更新内容
2. **AGENTS.md 更新准确性**：确保目录结构示例与实际创建的目录完全一致
3. **引用路径正确性**：所有文档间的引用使用相对路径或正确的绝对路径格式
