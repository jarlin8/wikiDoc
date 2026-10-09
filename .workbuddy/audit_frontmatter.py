# -*- coding: utf-8 -*-
"""审计全站 .mdx 的 frontmatter 字段，为 SEO 规范化提供依据（只读）"""
import re
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
FM = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

key_count = Counter()
docs_missing = defaultdict(list)
title_len = []
desc_len = []
titles = Counter()
descs = Counter()
rows = []


def parse_fm(fmtext):
    """返回 {key: value}，支持简单的多行 list"""
    out = {}
    lines = fmtext.split("\n")
    i = 0
    while i < len(lines):
        ln = lines[i]
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$", ln)
        if not m:
            i += 1
            continue
        k, v = m.group(1), m.group(2).strip()
        if v == "" and i + 1 < len(lines) and re.match(r"^\s*[- ]", lines[i + 1]):
            arr = []
            j = i + 1
            while j < len(lines) and re.match(r"^\s*[- ]", lines[j]):
                arr.append(lines[j].strip().lstrip("- ").strip())
                j += 1
            out[k] = arr
            i = j
            continue
        if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
            v = v[1:-1]
        out[k] = v
        i += 1
    return out


for f in sorted(DOCS.rglob("*.mdx")):
    doc_id = str(f.relative_to(DOCS).with_suffix("")).replace("\\", "/")
    raw = f.read_bytes().decode("utf-8", errors="replace").replace("\r\n", "\n").replace("\r", "\n")
    m = FM.match(raw)
    fm = parse_fm(m.group(1)) if m else {}
    for k in fm:
        key_count[k] += 1

    t = fm.get("title", "")
    d = fm.get("description", "")
    if not t:
        docs_missing["title"].append(doc_id)
    if not d:
        docs_missing["description"].append(doc_id)
    if "keywords" not in fm:
        docs_missing["keywords"].append(doc_id)
    if "image" not in fm:
        docs_missing["image"].append(doc_id)
    if "tags" not in fm:
        docs_missing["tags"].append(doc_id)

    if t:
        title_len.append((len(t), doc_id))
        titles[t] += 1
    if d:
        desc_len.append((len(d), doc_id))
        descs[d] += 1

    rows.append((doc_id, len(t), len(d), sorted(fm.keys())))

print("=" * 76)
print("文档总数:", len(rows))
print()
print("【字段使用频次】")
for k, v in key_count.most_common():
    print("  %-24s %4d  (%5.1f%%)" % (k, v, v * 100.0 / len(rows)))
print()
print("【缺失情况】")
for k in ["title", "description", "keywords", "image", "tags"]:
    n = len(docs_missing[k])
    print("  %-14s 缺失 %3d 篇" % (k, n))
print()
print("【title 长度】(Docusaurus 会自动追加 ' | 汇鉴')")
if title_len:
    L = [x[0] for x in title_len]
    L.sort()
    print("  最短 %d / 中位 %d / 最长 %d" % (L[0], L[len(L) // 2], L[-1]))
    over = [x for x in title_len if x[0] > 30]
    print("  超过 30 字（+品牌后可能被截断）:", len(over))
    for l, d in sorted(over, reverse=True)[:8]:
        print("     %2d 字  %s" % (l, d))
print()
print("【description 长度】")
if desc_len:
    D = [x[0] for x in desc_len]
    D.sort()
    print("  最短 %d / 中位 %d / 最长 %d" % (D[0], D[len(D) // 2], D[-1]))
    short = [x for x in desc_len if x[0] < 40]
    long_ = [x for x in desc_len if x[0] > 120]
    print("  过短(<40字):", len(short), " 过长(>120字):", len(long_))
    for l, d in sorted(long_, reverse=True)[:5]:
        print("     过长 %3d 字  %s" % (l, d))
print()
print("【重复 title】")
dupt = [(t, c) for t, c in titles.items() if c > 1]
print("  重复标题组数:", len(dupt), " 涉及文档:", sum(c for _, c in dupt))
for t, c in sorted(dupt, key=lambda x: -x[1])[:8]:
    print("     %2d× %s" % (c, t[:56]))
print()
print("【重复 description】")
dupd = [(t, c) for t, c in descs.items() if c > 1]
print("  重复描述组数:", len(dupd), " 涉及文档:", sum(c for _, c in dupd))
for t, c in sorted(dupd, key=lambda x: -x[1])[:5]:
    print("     %2d× %s" % (c, t[:56]))

# 存一份明细供后续使用
out = ROOT / "reports" / "08-frontmatter审计.csv"
with out.open("w", encoding="utf-8-sig", newline="") as fh:
    import csv
    w = csv.writer(fh)
    w.writerow(["文档ID", "标题字数", "描述字数", "已有字段"])
    for r in rows:
        w.writerow([r[0], r[1], r[2], " ".join(r[3])])
print()
print("明细已写入:", out)
