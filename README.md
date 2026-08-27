# francisar's Blog

一个基于 Hexo 6 的个人技术博客，同时作为金融学习知识库、行业与上市公司研究工作台，以及研究成果发布渠道。

项目按三层组织：`knowledge/` 保存可复用的金融基础知识，`research/` 保存未发布的研究过程，`source/` 保存公开页面、博客草稿和已发布文章。

## 快速开始

需要 Node.js 和 npm。安装依赖并生成站点：

```bash
npm ci
npm run build
```

本地预览：

```bash
npm run server
```

默认访问 `http://localhost:4000`。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm ci` | 按 `package-lock.json` 安装依赖 |
| `npm run build` | 生成静态站点到 `public/` |
| `npm run check` | 安静生成站点，用于自动验证 |
| `npm run server` | 启动本地预览服务器 |
| `npm run clean` | 清理 Hexo 缓存和生成目录 |
| `npm run new -- post "标题"` | 按文章模板创建新文章 |
| `npm run research:new -- industry "行业"` | 创建行业研究条目 |
| `npm run research:new -- company "公司"` | 创建上市公司研究条目 |
| `npm run research:new -- log "问题"` | 创建研究过程记录 |
| `npm run research:new -- observation "街景" --city "城市"` | 创建城市观察卡片 |
| `npm run research:new -- blog "标题"` | 创建博客草稿 |
| `npm run research:new -- urban-blog "标题"` | 创建城市观察博客草稿 |
| `npm run research:check` | 检查研究目录和元数据约定 |
| `npm run publish -- "标题"` | 明确操作后发布 Hexo 草稿 |
| `git diff --check` | 检查空白字符和补丁问题 |

## 内容结构

- 文章位于 `source/_posts/`，使用 Markdown 和 YAML front matter。
- 金融知识位于 `knowledge/finance/`，按概念和方法沉淀。
- 行业、公司和研究日志位于 `research/`，默认不进入 Hexo 生成结果。
- 城市观察 skill 位于 `.agents/skills/urban-observer/`，中间产物位于 `research/urban-observation/`。
- 博客草稿位于 `source/_drafts/`，审核后再移动到 `source/_posts/`。
- 金融研究入口页位于 `source/finance/index.md`。
- 城市观察入口页位于 `source/urban-observer/index.md`。
- 当前启用的主题是 `themes/pure/`。
- `themes/TKL/` 和 `themes/landscape/` 是历史主题，除非任务明确指定，否则不要修改。
- `public/` 是构建产物，不是源码。

## Codex 协作约定

根目录的 `AGENTS.md` 是本仓库的 Agent 工作契约，包含目录边界、命令、内容编辑规则、部署安全边界和验证要求。Codex 开始任务时应先读取它，再根据任务范围检查 Git 状态。

建议的 Agent 工作循环：

1. 阅读 `AGENTS.md`，确认任务涉及的源码目录。
2. 运行 `git status --short`，保留已有未提交改动。
3. 只修改文章、页面、主题或配置源码，不直接修改 `public/`。
4. 研究工作优先写入 `research/`，确定公开表达后再生成 `source/_drafts/`。
5. 运行 `npm run check` 或 `npm run build`，再运行 `git diff --check`。
6. 汇报修改的文件、数据日期、来源、验证命令和任何未解决的警告。

## 金融研究工作流

1. 从 `knowledge/finance/` 学习和补充基础概念。
2. 使用 `research/frameworks/industry-analysis.md` 或 `company-analysis.md` 建立研究框架。
3. 通过 `npm run research:new` 创建带元数据的研究条目。
4. 在研究记录中区分事实、推断、判断和预测，并保留来源与数据截点。
5. 使用 `research/templates/blog-brief.md` 把研究结论提炼成博客提纲。
6. 生成草稿、构建预览、校对后再发布，不把未验证的研究假设直接当成事实。

## 城市观察工作流

城市观察必须从具体街景、物件、价格、标识、基础设施或行为开始，依次经过观察、问题、竞争性假设、证据、机制、写作和审阅。完整规则与模板见 `.agents/skills/urban-observer/`，产出目录见 `research/urban-observation/`。

推荐顺序：`/observe -> /question -> /hypothesize -> /research -> /synthesize -> /write -> /review`。

## 发布边界

仓库中的 `_config.yml` 保留了 Hexo Git 部署配置，但本地 Agent 默认只构建和预览，不自动发布。只有用户明确要求时，才执行部署相关操作。

金融研究内容仅用于学习和写作，不构成投资、交易、税务或法律建议。
