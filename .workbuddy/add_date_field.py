# -*- coding: utf-8 -*-
"""给缺少 date 字段的文档补上（取 git 首次添加日期），保证每页 JSON-LD 都有 datePublished"""
import re
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
FM = re.compile(r"^---\r?\n(.*?)\r?\n---", re.DOTALL)

out = subprocess.run(
    ["git", "-c", "core.quotepath=false", "log", "--diff-filter=A",
     "--name-only", "--format=COMMIT%as", "--", "docs/"],
    cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace",
).stdout

add, cur = {}, None
for line in out.splitlines():
    line = line.strip()
    if line.startswith("COMMIT"):
        cur = line[6:]
    elif line.startswith("docs/") and line.endswith(".mdx") and cur:
        if line not in add or cur < add[line]:
            add[line] = cur
print("git 添加日期表:", len(add))

added, skipped = 0, 0
for f in sorted(DOCS.rglob("*.mdx")):
    doc_id = str(f.relative_to(DOCS).with_suffix("")).replace("\\", "/")
    raw = f.read_bytes().decode("utf-8")
    norm = raw.replace("\r\n", "\n").replace("\r", "\n")
    m = FM.match(norm)
    if not m:
        continue
    fm = m.group(1)
    if re.search(r"(?m)^date:", fm):
        skipped += 1
        continue
    rel = "docs/" + doc_id + ".mdx"
    d = add.get(rel)
    if not d:
        print("  ⚠️ 无 git 日期:", doc_id)
        continue
    tp = re.compile(r"(?m)^title:.*$")
    fm2 = tp.sub(lambda x: x.group(0) + '\ndate: "%s"' % d, fm, count=1) \
        if tp.search(fm) else 'date: "%s"\n%s' % (d, fm)
    f.write_bytes((norm[: m.start(1)] + fm2 + norm[m.end(1):]).replace("\n", "\r\n").encode("utf-8"))
    added += 1

print("新补 date:", added, " 已有 date:", skipped)
