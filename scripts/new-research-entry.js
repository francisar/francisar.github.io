'use strict';

const fs = require('fs');
const path = require('path');

const repositoryRoot = path.resolve(__dirname, '..');

const kinds = {
  industry: { directory: 'research/industries' },
  company: { directory: 'research/companies' },
  log: { directory: 'research/logs' },
  observation: { directory: 'research/urban-observation/observations', extension: 'yaml' },
  knowledge: { directory: 'knowledge/finance' },
  blog: { directory: 'source/_drafts' },
  'urban-blog': { directory: 'source/_drafts' }
};

function usage() {
  console.error('Usage: npm run research:new -- <industry|company|log|observation|knowledge|blog|urban-blog> "Title" [--city city] [--slug slug]');
  process.exitCode = 1;
}

function today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\\/?%*:|"<>]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'entry';
}

function parseArguments(argumentsList) {
  const [kind, ...rest] = argumentsList;
  const titleParts = [];
  let explicitSlug;
  let city;

  for (let index = 0; index < rest.length; index += 1) {
    if (rest[index] === '--slug') {
      explicitSlug = rest[index + 1];
      index += 1;
    } else if (rest[index] === '--city') {
      city = rest[index + 1];
      index += 1;
    } else {
      titleParts.push(rest[index]);
    }
  }

  return { kind, title: titleParts.join(' ').trim(), explicitSlug, city };
}

function renderEntry(kind, title, date, city) {
  if (kind === 'observation') {
    return `observation_id: ""
city: "${city || ''}"
district: ""
location_detail: ""
date_time: "${date}"

raw_observation: "${title.replace(/"/g, '\\"')}"
visible_evidence:
  - ""

user_reaction_or_surprise: ""
why_noteworthy: ""

media:
  - type: photo
    ref: ""

repeat_count: 1

known_context:
  - ""

uncertainties:
  - ""

interpretation: null

status:
  observed: true
  verified: false
`;
  }

  if (kind === 'blog' || kind === 'urban-blog') {
    const category = kind === 'urban-blog' ? '城市观察' : '金融';
    const tag = kind === 'urban-blog' ? 'urban-observer' : 'draft';
    return `---
layout: post
title: ${title}
date: ${date}
categories:
  - ${category}
tags:
  - ${tag}
status: draft
sources:
---

## 结论先行

## 背景与问题

## 核心分析

## 数据与来源

## 风险与边界

## 结论与后续观察
`;
  }

  if (kind === 'knowledge') {
    return `---
type: knowledge
title: ${title}
updated: ${date}
---

# 定义

## 直觉

## 机制或公式

## 示例

## 边界与误区

## 关联条目
`;
  }

  const tags = kind === 'log' ? 'research-log' : kind;
  return `---
type: ${kind === 'log' ? 'research-log' : kind}
title: ${title}
date: ${date}
as_of: ${date}
status: inbox
tags:
  - ${tags}
sources:
---

# 研究摘要

## 研究问题

## 观察与证据

## 假设与推断

## 反证条件

## 下一步
`;
}

function findAvailablePath(directory, date, slug, extension) {
  const baseName = `${date}-${slug}`;
  let suffix = 0;

  while (true) {
    const suffixText = suffix === 0 ? '' : `-${suffix}`;
    const candidate = path.join(directory, `${baseName}${suffixText}.${extension}`);
    if (!fs.existsSync(candidate)) {
      return candidate;
    }
    suffix += 1;
  }
}

if (require.main === module) {
  const { kind, title, explicitSlug, city } = parseArguments(process.argv.slice(2));

  if (!kinds[kind] || !title) {
    usage();
  } else {
    const date = today();
    const directory = path.join(repositoryRoot, kinds[kind].directory);
    const slug = slugify(explicitSlug || title);
    const extension = kinds[kind].extension || 'md';
    const filePath = findAvailablePath(directory, date, slug, extension);

    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(filePath, renderEntry(kind, title, date, city), 'utf8');

    console.log(`Created ${path.relative(repositoryRoot, filePath)}`);
    if (kind === 'blog' || kind === 'urban-blog') {
      console.log('Next: edit the draft, run npm run build, then publish deliberately with npm run publish -- "Title".');
    } else if (kind === 'observation') {
      console.log('Next: assign a CITY-TOPIC-### ID, separate visible facts from interpretation, and do not research yet.');
    } else {
      console.log('Next: add sources, data dates, evidence, counter-evidence, and a review date.');
    }
  }
}
