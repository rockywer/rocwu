# TOOLS.md — 本地工具说明

## 内置工具（由 Gateway 暴露）
- `member.query`     查询会员档案与等级权益
- `member.activate`  激活会员资质 / 权限分级
- `member.renew`     续费提醒与通道推送
- `board.match`      板块智能匹配与活动报名
- `resource.match`   圈层资源精准对接
- `kb.answer`        运营方案知识库答疑
- `report.daily`     运营数据复盘

## 技能目录
- 位于 `server/skills/`，每个技能含 `SKILL.md` + `handler.js`
- 通过 `skill.run('<slug>')` 调用
