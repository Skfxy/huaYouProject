# 《话游》文档目录

详细开发文档请见此目录。

## 目录结构

```
docs/
├── game-design/       # 游戏设计文档（世界观、系统、剧情等）
├── changelogs/        # 更新日志与优化记录（每次迭代新建文档）
├── README.md          # 本文件 - 文档总索引
├── code-wiki.md       # 代码知识库
└── todolist.md        # 开发路线图（三阶段计划）
```

## 各目录说明

### [game-design/](./game-design/)
游戏核心设计文档，包含：
- [世界观设定](./game-design/world-setting.md)
- [角色档案](./game-design/characters.md)
- 系统设计：[四维状态](./game-design/systems/status-system.md)、[技能成长](./game-design/systems/skill-system.md)、[时间推进](./game-design/systems/time-system.md)
- 剧情规划：[第一章完整剧情](./game-design/chapters/chapter1.md)、[第二章规划](./game-design/chapters/chapter2-plan.md)、[第三章规划](./game-design/chapters/chapter3-plan.md)
- 事件设计：[随机事件池](./game-design/events/chapter1-events.md)、[通用事件](./game-design/events/common-events.md)、[事件触发规则](./game-design/events/event-rules.md)
- 结局设计：[第一章结局分支](./game-design/endings/chapter1-endings.md)、[结局判定逻辑](./game-design/endings/ending-rules.md)

### [changelogs/](./changelogs/)
**更新日志与优化记录目录**

每次进行 Bug 修复、功能优化、新功能开发或重构时，必须在此目录下新建对应文档记录：
- **文件命名**: `YYYY-MM-DD_vX.Y.Z_short-description.md`
- **状态标记**: 使用 checkbox 标记任务完成状态（`- [ ]` 未开始 / `- [x]` 已完成）
- **详细规范**: 参见 [changelogs/README.md](./changelogs/README.md)

### [todolist.md](./todolist.md)
开发路线图，包含三阶段开发计划和进度跟踪。
- **注意**: 历史更新日志已迁移至 [changelogs/](./changelogs/) 目录
- 本文件仅保留未来开发计划，不记录具体更新内容

### [code-wiki.md](./code-wiki.md)
代码知识库，记录开发过程中的重要知识点和技术决策。
