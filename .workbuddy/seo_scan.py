# -*- coding: utf-8 -*-
import re, json
from pathlib import Path
from collections import Counter, defaultdict

DOCS = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\docs")
FM = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

field_count = Counter()
titles = []
descs = []
no_title = []
no_desc = []
title_len = []
desc_len = []
h1_in_body = []
no_keywords = 0
no_image = 0
total = 0
slug_count = 0

for f in DOCS.rglob("*.mdx"):
    total += 1
    t = f.read_text(encoding="utf-8").replace("\r\n", "\n")
    m = FM.match(t)
    fm = m.group(1) if m else ""
    body = t[m.end():] if m else t
    fields = {}
    for line in fm.split("\n"):
        mm = re.match(r"^([a-zA-Z_]+)\s*:\s*(.*)$", line)
        if mm:
            fields[mm.group(1)] = mm.group(2).strip()
            field_count[mm.group(1)] += 1

    def clean(s):
        s = s.strip()
        if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
            s = s[1:-1]
        return s

    title = clean(fields.get("title", ""))
    desc = clean(fields.get("description", ""))
    if not title:
        no_title.append(str(f.relative_to(DOCS.parent)))
    else:
        titles.append(title)
        title_len.append(len(title))
    if not desc:
        no_desc.append(str(f.relative_to(DOCS.parent)))
    else:
        descs.append(desc)
        desc_len.append(len(desc))
    if "keywords" not in fields:
        no_keywords += 1
    if "image" not in fields:
        no_image += 1
    if "slug" in fields:
        slug_count += 1
    if re.search(r"(?m)^#\s", body):
        h1_in_body.append(str(f.relative_to(DOCS.parent)))

print("总文档数:", total)
print()
print("=== frontmatter 字段覆盖 ===")
for k, v in field_count.most_common():
    print(f"  {k}: {v} ({v*100//total}%)")
print()
print(f"缺 title: {len(no_title)}")
print(f"缺 description: {len(no_desc)}")
print(f"缺 keywords: {no_keywords}")
print(f"缺 image: {no_image}")
print(f"使用 slug: {slug_count}")
print(f"body 内含 H1（与标题重复风险）: {len(h1_in_body)}")
for x in h1_in_body[:10]:
    print("   ", x)
print()
dup_t = [t for t, c in Counter(titles).items() if c > 1]
dup_d = [d for d, c in Counter(descs).items() if c > 1]
print(f"重复 title: {len(dup_t)} 组")
for t in dup_t[:10]:
    print("   ", t)
print(f"重复 description: {len(dup_d)} 组")
for d in dup_d[:5]:
    print("   ", d[:50])
print()
if title_len:
    print(f"title 长度: min={min(title_len)} max={max(title_len)} avg={sum(title_len)//len(title_len)}")
    print(f"  >60 字符: {sum(1 for x in title_len if x > 60)}")
if desc_len:
    print(f"description 长度: min={min(desc_len)} max={max(desc_len)} avg={sum(desc_len)//len(desc_len)}")
    print(f"  <50 字符: {sum(1 for x in desc_len if x < 50)}")
    print(f"  >160 字符: {sum(1 for x in desc_len if x > 160)}")
