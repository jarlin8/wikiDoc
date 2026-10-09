// 用真实的 mdast GFM 解析器检测表格渲染失败
const fs = require('fs');
const path = require('path');
const { fromMarkdown } = require('mdast-util-from-markdown');
const { gfm } = require('micromark-extension-gfm');
const { gfmFromMarkdown } = require('mdast-util-gfm');

const ROOT = process.cwd();
const DOCS = path.join(ROOT, 'docs');

function walkDir(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkDir(p, out);
    else if (/\.mdx?$/.test(name)) out.push(p);
  }
}

// 收集表格节点覆盖的行号范围
function collectTables(tree) {
  const ranges = [];
  function visit(node) {
    if (!node) return;
    if (node.type === 'table' && node.position) {
      ranges.push([node.position.start.line, node.position.end.line, node]);
    }
    if (node.children) node.children.forEach(visit);
  }
  visit(tree);
  return ranges;
}

const files = [];
walkDir(DOCS, files);

const results = [];
let totalSuspicious = 0;
let totalTables = 0;

for (const f of files) {
  let text;
  try {
    text = fs.readFileSync(f, 'utf-8');
  } catch (e) { continue; }
  // 统一换行
  const norm = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let tree;
  try {
    tree = fromMarkdown(norm, {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()],
    });
  } catch (e) {
    results.push({ file: path.relative(ROOT, f), error: e.message });
    continue;
  }
  const tables = collectTables(tree);
  totalTables += tables.length;

  const lines = norm.split('\n');
  // 找出所有"疑似表格行"：以 | 开头（允许前导空格）且含至少一个 |
  const covered = new Set();
  for (const [s, e] of tables) {
    for (let i = s; i <= e; i++) covered.add(i);
  }
  const suspicious = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.includes('|') && trimmed !== '|') {
      const ln = i + 1;
      if (!covered.has(ln)) {
        // 不在任何表格内 → 疑似渲染失败
        // 检查是不是代码块内
        const before = lines.slice(0, i).join('\n');
        const fenceCount = (before.match(/^```/gm) || []).length;
        if (fenceCount % 2 === 0) {
          suspicious.push({ line: ln, text: trimmed.slice(0, 70) });
        }
      }
    }
    i++;
  }
  if (suspicious.length) {
    totalSuspicious += suspicious.length;
    results.push({ file: path.relative(ROOT, f), tables: tables.length, suspicious });
  }
}

// 输出
console.log('=== 统计 ===');
console.log('解析文件数:', files.length);
console.log('识别出的表格总数:', totalTables);
console.log('疑似渲染失败的表格行数:', totalSuspicious);
console.log('受影响文件数:', results.filter(r => r.suspicious).length);
console.log();
console.log('=== 受影响文件（按可疑行数排序）===');
const ranked = results.filter(r => r.suspicious && r.suspicious.length)
  .sort((a, b) => b.suspicious.length - a.suspicious.length);
for (const r of ranked.slice(0, 30)) {
  console.log(`[${r.suspicious.length}] ${r.file}`);
}
console.log();
console.log('=== 示例 ===');
for (const r of ranked.slice(0, 6)) {
  console.log(`--- ${r.file} ---`);
  for (const s of r.suspicious.slice(0, 3)) {
    console.log(`  L${s.line}: ${s.text}`);
  }
}
