# 金融研究工作台

这里保存尚未整理成公开博客的研究材料。它与 `source/` 分离：研究过程可以不完整、可以包含待验证假设，但公开文章必须经过事实核验、来源整理和表达重写。

## 目录

```text
research/
├── companies/       # 上市公司研究
├── industries/      # 行业研究
├── logs/            # 研究过程、观察和复盘
├── urban-observation/ # 城市观察研究产物
├── frameworks/      # 可复用的研究框架
└── templates/       # 行业、公司、记录和博客提纲模板
```

## 研究生命周期

1. **收集**：记录问题、数据日期和原始来源，不急于下结论。
2. **拆解**：按行业或公司框架组织事实、指标和假设。
3. **验证**：交叉检查财报、公告、监管文件、公司材料和独立来源。
4. **形成观点**：区分事实、推断、判断和预测，写出反证条件。
5. **复核**：在新财报、重大公告或预设日期更新研究记录。
6. **发布**：从研究记录提炼博客提纲，复制到 `source/_drafts/`，完成编辑后再发布。

## 元数据约定

研究条目建议使用以下 front matter：

```yaml
type: company # company | industry | research-log
title: 条目标题
date: 2026-08-24
as_of: 2026-08-24
status: inbox # inbox | active | review | published | archived
tags:
sources:
```

`as_of` 是数据截点，`date` 是记录创建时间，两者不要混用。历史数据或观点更新时，保留更新时间和变更原因。

## 证据分层

- **一级证据**：年报、季报、公告、监管披露、债券募集说明书、审计报告。
- **二级证据**：行业协会、统计机构、供应链或客户访谈、可信研究机构。
- **三级证据**：媒体、论坛、社交平台和未核实传闻，只能作为线索。

任何关键结论都应能回溯到来源和数据日期。无法确认的内容标记为“待验证”，不要写成事实。

## 研究到博客

```text
research/ 条目
    ↓ 提炼核心问题、证据和结论
research/templates/blog-brief.md
    ↓ 生成公开草稿
source/_drafts/
    ↓ 编辑、校对、构建预览
source/_posts/
```

可使用以下命令创建条目：

```bash
npm run research:new -- industry "行业名称"
npm run research:new -- company "公司名称"
npm run research:new -- log "研究问题"
npm run research:new -- observation "街景观察" --city "城市"
npm run research:new -- blog "博客标题"
npm run research:new -- urban-blog "城市观察文章"
npm run research:check
```

研究内容仅用于学习和写作，不构成投资、交易、税务或法律建议。
