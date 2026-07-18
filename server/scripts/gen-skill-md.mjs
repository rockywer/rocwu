// 生成各技能的 SKILL.md（OpenClaw 风格）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SKILLS, listSkills } from '../skills/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.join(__dirname, '..', 'skills');

for (const s of listSkills()) {
  const slug = s.slug;
  const dir = path.join(SKILLS_DIR, slug.replace(/\./g, '-'));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const md = `---
name: ${slug}
description: ${s.description}
trigger: ${s.trigger}
user-invocable: true
---

# ${slug}

${s.description}

**触发词**: ${s.trigger}

**调用方式**: \`skill.run('${slug}')\`
`;
  fs.writeFileSync(path.join(dir, 'SKILL.md'), md);
  console.log('generated', path.join(dir, 'SKILL.md'));
}
