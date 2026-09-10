// 检查表格列数一致性（用真实解析器）
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

const files = [];
walkDir(DOCS, files);

let bad = [];
let totalTables = 0;

for (const f of files) {
  let text;
  try { text = fs.readFileSync(f, 'utf-8'); } catch (e) { continue; }
  const norm = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let tree;
  try {
    tree = fromMarkdown(norm, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] });
  } catch (e) { continue; }

  const lines = norm.split('\n');
  function visit(node) {
    if (!node) return;
    if (node.type === 'table') {
      totalTables++;
      // 统计每行的单元格数
      const rowCounts = [];
      for (const row of node.children || []) {
        if (row.type === 'tableRow') {
          rowCounts.push((row.children || []).length);
        }
      }
      const uniq = [...new Set(rowCounts)];
      if (uniq.length > 1) {
        const line = node.position ? node.position.start.line : '?';
        bad.push({ file: path.relative(ROOT, f), line, counts: rowCounts, raw: lines[line - 1] ? lines[line - 1].slice(0, 70) : '' });
      }
    }
    if (node.children) node.children.forEach(visit);
  }
  visit(tree);
}

console.log('表格总数:', totalTables);
console.log('列数不一致的表格数:', bad.length);
console.log();
for (const b of bad.slice(0, 40)) {
  console.log(`  ${b.file}:L${b.line}  行单元格数=${JSON.stringify(b.counts)}`);
  console.log(`      ${b.raw}`);
}
