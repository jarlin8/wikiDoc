# -*- coding: utf-8 -*-
"""
1) 3 个旧索引页退役：unlisted: true + hide_table_of_contents: true
2) 首页 index.mdx 隐藏 TOC（列表型落地页）
3) 从 reports/05 删除清单中剔除 pu_prime_broker_research_report（假阳性，已恢复）
"""
import csv
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
FM = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

RETIRE = [
    ("docs/exness-trader/exness-trader.mdx", True),
    ("docs/exness-agent/exness-agent.mdx", True),
    ("docs/nytimes/nytimes.mdx", True),
    ("docs/index.mdx", False),   # 首页只隐藏 TOC，不退役
]


def set_field(fm, key, value):
    line = "%s: %s" % (key, value)
    pat = re.compile(r"(?m)^%s:.*$" % re.escape(key))
    if pat.search(fm):
        return pat.sub(lambda m: line, fm, count=1)
    tp = re.compile(r"(?m)^title:.*$")
    if tp.search(fm):
        return tp.sub(lambda m: m.group(0) + "\n" + line, fm, count=1)
    return line + "\n" + fm


for rel, retire in RETIRE:
    p = ROOT / rel
    raw = p.read_bytes()
    norm = raw.decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
    m = FM.match(norm)
    if not m:
        print("⚠️ 无 frontmatter:", rel)
        continue
    fm = m.group(1)
    if retire:
        fm = set_field(fm, "unlisted", "true")
        fm = set_field(fm, "hide_table_of_contents", "true")
    else:
        fm = set_field(fm, "hide_table_of_contents", "true")
    out = norm[: m.start(1)] + fm + norm[m.end(1):]
    p.write_bytes(out.replace("\n", "\r\n").encode("utf-8"))
    print("✅ %-44s unlisted=%s" % (rel, retire))

# ---- 修正 reports/05 ----
p = ROOT / "reports" / "05-删除候选清单.csv"
rows = list(csv.reader(p.open(encoding="utf-8-sig")))
hdr, body = rows[0], rows[1:]
RAISE = {"nytimes/pu_prime_broker_research_report"}
new = [r for r in body if not (r and r[0] in RAISE)]
with p.open("w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(hdr)
    w.writerows(new)
print("\nreports/05: %d -> %d 条（剔除 %s）" % (len(body), len(new), ", ".join(RAISE)))
