'use strict';

const fs = require('fs');
const path = require('path');

const repositoryRoot = path.resolve(__dirname, '..');
const requiredPaths = [
  'knowledge/finance/README.md',
  'research/README.md',
  'research/frameworks/industry-analysis.md',
  'research/frameworks/company-analysis.md',
  'research/templates/industry.md',
  'research/templates/company.md',
  'research/templates/research-log.md',
  'research/templates/blog-brief.md',
  'research/urban-observation/README.md',
  '.agents/skills/urban-observer/SKILL.md',
  '.agents/skills/urban-observer/README.md',
  '.agents/skills/urban-observer/constitution.md',
  '.agents/skills/urban-observer/COMMANDS.md',
  '.agents/skills/urban-observer/agents/openai.yaml',
  '.agents/skills/urban-observer/workflows/observe.md',
  '.agents/skills/urban-observer/workflows/question.md',
  '.agents/skills/urban-observer/workflows/hypothesize.md',
  '.agents/skills/urban-observer/workflows/research.md',
  '.agents/skills/urban-observer/workflows/synthesize.md',
  '.agents/skills/urban-observer/workflows/write.md',
  '.agents/skills/urban-observer/workflows/review.md',
  '.agents/skills/urban-observer/templates/observation-card.yaml',
  '.agents/skills/urban-observer/templates/question-tree.md',
  '.agents/skills/urban-observer/templates/hypothesis-test.yaml',
  '.agents/skills/urban-observer/templates/evidence-ledger.csv',
  '.agents/skills/urban-observer/templates/mechanism-map.md',
  '.agents/skills/urban-observer/templates/article-spec.md',
  '.agents/skills/urban-observer/prompts/01-capture.md',
  '.agents/skills/urban-observer/prompts/02-question.md',
  '.agents/skills/urban-observer/prompts/03-hypothesis.md',
  '.agents/skills/urban-observer/prompts/04-research.md',
  '.agents/skills/urban-observer/prompts/05-mechanism.md',
  '.agents/skills/urban-observer/prompts/06-write.md',
  '.agents/skills/urban-observer/prompts/07-review.md',
  'source/urban-observer/index.md',
  'source/finance/index.md'
];

if (require.main === module) {
  const errors = [];

  for (const relativePath of requiredPaths) {
    if (!fs.existsSync(path.join(repositoryRoot, relativePath))) {
      errors.push(`missing required file: ${relativePath}`);
    }
  }

  function markdownFiles(relativeDirectory) {
    const directory = path.join(repositoryRoot, relativeDirectory);
    if (!fs.existsSync(directory)) {
      return [];
    }

    return fs.readdirSync(directory)
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => path.join(directory, fileName));
  }

  for (const relativeDirectory of ['research/industries', 'research/companies', 'research/logs']) {
    for (const filePath of markdownFiles(relativeDirectory)) {
      const relativePath = path.relative(repositoryRoot, filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.startsWith('---\n')) {
        errors.push(`missing front matter: ${relativePath}`);
      }
      for (const field of ['type:', 'title:', 'date:', 'status:', 'sources:']) {
        if (!content.includes(`\n${field}`) && !content.startsWith(field)) {
          errors.push(`missing ${field.slice(0, -1)} in ${relativePath}`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Research structure: ok');
  }
}
