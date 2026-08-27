# AGENTS.md

## Project overview

This repository is a Hexo 6 blog and a finance research knowledge base. Reusable concepts are kept in `knowledge/`, unpublished research is kept in `research/`, public pages and blog content are kept in `source/`, and generated output is written to `public/`.

Treat this file as the operating contract for Codex and other coding agents working in the repository.

## Repository map

- `source/_posts/`: Markdown articles and their YAML front matter.
- `source/_drafts/`: Blog drafts that are not published yet.
- `source/finance/`: Public entry page for the finance research area.
- `source/`: Static pages and assets copied into the generated site.
- `knowledge/finance/`: Stable financial concepts, formulas, mechanisms, and learning notes.
- `research/frameworks/`: Reusable industry and listed-company research frameworks.
- `research/templates/`: Templates for industry, company, research-log, and blog-brief records.
- `research/industries/`: Unpublished industry research.
- `research/companies/`: Unpublished listed-company research.
- `research/logs/`: Dated research observations and review records.
- `research/urban-observation/`: Urban observation cards, evidence, mechanisms, drafts, and review artifacts.
- `.agents/skills/urban-observer/`: Integrated urban observation skill, prompts, workflows, constitution, and templates.
- `source/urban-observer/`: Public entry page for the urban observation research area.
- `scripts/`: Deterministic repository checks and research-entry generators.
- `themes/pure/`: Active theme templates, styles, scripts, and theme data.
- `themes/TKL/` and `themes/landscape/`: Legacy themes; change them only when the task explicitly targets them.
- `_config.yml`: Site-wide Hexo configuration, including the active theme and deployment target.
- `scaffolds/`: Templates used by `hexo new`.
- `public/`: Generated files; never edit or commit them manually.
- `.deploy_git/`: Deployment checkout; never use it as an editing source.

## Environment and commands

Use the repository-local dependency tree and the lockfile. Do not install Hexo globally and do not modify dependencies one by one.

```bash
npm ci                 # clean, reproducible dependency install
npm run build          # generate the static site
npm run check          # generate quietly for validation
npm run server         # start the local preview server
npm run new -- post "Title"  # create a new post from the scaffold
npm run research:new -- industry "Industry"  # create an industry research note
npm run research:new -- company "Company"    # create a listed-company note
npm run research:new -- log "Question"      # create a research log
npm run research:new -- observation "Scene" --city "City"  # create an observation card
npm run research:new -- blog "Title"         # create a blog draft
npm run research:new -- urban-blog "Title"   # create an urban-observation draft
npm run research:check                       # validate research structure
npm run publish -- "Title"                   # publish a draft only when requested
```

The legacy `hexo_blog.sh` script is a convenience wrapper around the same local workflow. It must remain non-interactive and should not deploy the site.

## Editing rules

1. Preserve unrelated user changes. Before editing, inspect `git status` and do not reset, stash, checkout, or overwrite existing work.
2. For article changes, edit files under `source/_posts/` and preserve the existing front matter style unless the user asks for normalization.
3. Put reusable finance knowledge in `knowledge/finance/`; keep company-specific claims and time-sensitive evidence in `research/`.
4. For research records, preserve `date`, `as_of`, `status`, `sources`, and the distinction between facts, inferences, judgments, and forecasts.
5. For city observations, follow `.agents/skills/urban-observer/` and keep outputs under `research/urban-observation/`. Do not infer institutional causes before capturing observations and competing hypotheses.
6. Keep generated output out of commits. `public/`, `db.json`, logs, and deployment directories are build artifacts.
7. Keep secrets out of Markdown, theme configuration, shell scripts, and Git history. Deployment credentials must come from the user's environment or Git configuration.
8. Do not run `npm run deploy` or change the deployment repository, branch, or domain unless the user explicitly requests it.
9. Prefer focused edits. Do not rewrite old posts or replace a theme merely to modernize unrelated code.
10. When changing templates or styles, validate with a full static build because Hexo errors can surface only during rendering.

## Validation and handoff

For content-only changes, run `npm run check` and `git diff --check`. For theme or configuration changes, run `npm run build` and `git diff --check`. Research-only changes should also pass `npm run research:check`. Report the exact commands run and call out existing warnings separately from new failures.

When creating or modifying a research record, summarize the scope, data date, sources, evidence gaps, and next review step. When converting research into a post, verify that public claims are sourced and that uncertainty is visible. Do not claim a deployment occurred unless a deployment command was explicitly requested and completed.
