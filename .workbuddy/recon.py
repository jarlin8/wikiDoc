# -*- coding: utf-8 -*-
import re
from pathlib import Path
from collections import defaultdict, Counter

FM = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)


def clean(s):
    s = s.strip()
    if len(s) >= 2 and s[0] == s[-1] and s[0] in "\"'":
        s = s[1:-1]
    return s.strip()


byname = defaultdict(list)
h1_files = []
img_stats = Counter()
img_captions = 0
img_alt_ctx = 0

for f in Path("docs").rglob("*.mdx"):
    t = f.read_text(encoding="utf-8").replace("\r\n", "\n")
    rel = str(f).replace("\\", "/")
    m = FM.match(t)
    fm = m.group(1) if m else ""
    body = t[m.end():] if m else t
    tt = re.search(r"^title:\s*(.*)$", fm, re.M)
    if tt:
        byname[clean(tt.group(1))].append(rel)
    # body H1
    for hm in re.finditer(r"(?m)^#\s+(.*)$", body):
        h1_files.append((rel, hm.group(1)[:50]))

    # 图片扫描
    lines = body.split("\n")
    for i, ln in enumerate(lines):
        for im in re.finditer(r"!\[([^\]]*)\]\(([^)]+)\)", ln):
            alt, url = im.group(1), im.group(2)
            if alt == "":
                img_stats["empty"] += 1
            elif re.match(r"^[\w\-. ]+\.(jpg|jpeg|png|gif|svg|webp)$", alt, re.IGNORECASE):
                img_stats["filename"] += 1
                # 上下文：下一非空行是否为说明
                nxt = ""
                for j in range(i + 1, min(i + 4, len(lines))):
                    if lines[j].strip():
                        nxt = lines[j].strip()
                        break
                if nxt and len(nxt) <= 40 and not nxt.startswith(("|", "-", "*", "#", "!")):
                    img_captions += 1
                else:
                    img_alt_ctx += 1
            else:
                img_stats["ok"] += 1

print("=== 重复 title ===")
for k, v in byname.items():
    if len(v) > 1:
        print(f"  「{k}」 x{len(v)}")
        for x in v:
            print("     ", x)

print()
print("=== 正文含 H1 的文件 ===")
for rel, h in h1_files:
    print(f"  {rel}: {h}")

print()
print("=== 图片 alt 统计 ===")
for k, v in img_stats.items():
    print(f"  {k}: {v}")
print(f"  文件名 alt 中，下一行有说明文本: {img_captions}")
print(f"  文件名 alt 中，下一行无说明: {img_alt_ctx}")
