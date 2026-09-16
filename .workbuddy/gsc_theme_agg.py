# -*- coding: utf-8 -*-
"""按现有分类聚合 GSC 流量"""
import csv
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
OUT = ROOT / "reports"

groups = json.loads((ROOT / ".workbuddy/sidebar_groups.json").read_text(encoding="utf-8"))
doc2cat = {}
for folder, cats in groups.items():
    for cat, ids in cats.items():
        for i in ids:
            doc2cat[i] = f"{folder}/{cat}"

rows = []
with (OUT / "00-全部文档-GSC分档.csv").open(encoding="utf-8-sig", newline="") as f:
    r = csv.reader(f)
    next(r)
    for row in r:
        rows.append(row)

agg = defaultdict(lambda: {"n": 0, "with_click": 0, "clicks": 0, "imps": 0})
for row in rows:
    doc_id = row[0]
    cat = doc2cat.get(doc_id, "未分类（首页/独立页）")
    clicks, imps = int(row[3]), int(row[4])
    a = agg[cat]
    a["n"] += 1
    a["clicks"] += clicks
    a["imps"] += imps
    if clicks > 0:
        a["with_click"] += 1

order = sorted(agg.items(), key=lambda kv: -kv[1]["imps"])
p = OUT / "06-主题流量汇总.csv"
with p.open("w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["分类", "文档数", "有点击的文档数", "总点击", "总曝光", "点击效率(点击/文档)", "曝光效率(曝光/文档)"])
    for cat, a in order:
        w.writerow([cat, a["n"], a["with_click"], a["clicks"], a["imps"],
                    round(a["clicks"] / a["n"], 3), round(a["imps"] / a["n"], 1)])

print(f"{'分类':<34}{'文档':>5}{'有点击':>7}{'点击':>6}{'曝光':>8}{'曝光/篇':>9}")
print("-" * 72)
for cat, a in order:
    print(f"{cat:<34}{a['n']:>5}{a['with_click']:>7}{a['clicks']:>6}{a['imps']:>8,}{a['imps']/a['n']:>9.1f}")
print()
print("输出:", p)
