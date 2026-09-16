# -*- coding: utf-8 -*-
"""
GSC Pages.csv × 站点文档 交叉分析
产出：分档清单 CSV
"""
import csv
import os
import re
import urllib.parse
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
OUT = ROOT / "reports"
OUT.mkdir(exist_ok=True)
GSC = Path(r"C:\Users\Jarlin\Desktop\Pages.csv")
SITE = "https://wiki.ssgg.net"

FM_RE = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)


def norm_url(u):
    u = u.strip()
    u = u.split("#", 1)[0]
    u = urllib.parse.unquote(u)
    u = u.rstrip("/")
    if u.startswith(SITE):
        u = u[len(SITE):]
    if not u:
        u = "/"
    return u or "/"


# ---------- 1) 读 GSC ----------
gsc = {}
with GSC.open(encoding="utf-8-sig", newline="") as f:
    r = csv.reader(f)
    header = next(r)
    for row in r:
        if len(row) < 5 or not row[0].strip():
            continue
        try:
            clicks = int(row[1].replace(",", ""))
            imps = int(row[2].replace(",", ""))
            ctr = float(row[3].replace("%", ""))
            pos = float(row[4])
        except ValueError:
            continue
        key = norm_url(row[0])
        if key in gsc:
            g = gsc[key]
            g["clicks"] += clicks
            g["imps"] += imps
        else:
            gsc[key] = {"clicks": clicks, "imps": imps, "ctr": ctr, "pos": pos,
                        "raw": row[0]}

# ---------- 2) 枚举文档 ----------
docs = []
for f in sorted(DOCS.rglob("*.mdx")):
    rel = f.relative_to(DOCS).with_suffix("")
    doc_id = str(rel).replace("\\", "/")
    txt = f.read_bytes().decode("utf-8", errors="replace")
    txt = txt.replace("\r\n", "\n").replace("\r", "\n")
    fm = FM_RE.match(txt)
    fmtext = fm.group(1) if fm else ""

    def grab(key):
        m = re.search(r"(?m)^%s:\s*(.*)$" % key, fmtext)
        if not m:
            return ""
        v = m.group(1).strip()
        if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
            v = v[1:-1]
        return v.strip()

    slug = grab("slug")
    if slug:
        url = slug if slug.startswith("/") else "/" + slug
    elif doc_id == "index":
        url = "/"
    else:
        parts = doc_id.split("/")
        if len(parts) >= 2 and parts[-1] == parts[-2]:
            url = "/" + "/".join(parts[:-1])
        else:
            url = "/" + doc_id
    url = norm_url(url)
    docs.append({
        "doc_id": doc_id,
        "url": url,
        "title": grab("title"),
        "desc": grab("description"),
        "slug": slug,
        "bytes": f.stat().st_size,
    })

# ---------- 3) 匹配 + 分档 ----------
rows = []
matched = set()
for d in docs:
    g = gsc.get(d["url"])
    clicks = g["clicks"] if g else 0
    imps = g["imps"] if g else 0
    pos = g["pos"] if g else None
    if g:
        matched.add(d["url"])
    if clicks >= 1:
        tier, action = "A-保留", "保留并深化：加内链、补实测数据"
    elif imps == 0:
        tier, action = "D-删除候选", "16个月零曝光：删除或 301 合并"
    elif imps >= 50 and (pos or 999) <= 15:
        tier, action = "B-优先救", "仅改 title/description，排名已在首页"
    elif imps >= 10:
        tier, action = "C1-观察", "零点击中等曝光：先并入支柱页内链，观察一周期"
    else:
        tier, action = "C2-合并", "零点击极低曝光：301 到同主题支柱页"
    rows.append({**d, "clicks": clicks, "imps": imps, "pos": pos, "tier": tier,
                 "action": action})

# GSC 里存在但站点上找不到的 URL（已删/锚点/外链）
unmatched = sorted(set(gsc) - matched)

order = {"A-保留": 0, "B-优先救": 1, "C1-观察": 2, "C2-合并": 3, "D-删除候选": 4}
rows.sort(key=lambda x: (order[x["tier"]], -x["clicks"], -x["imps"]))

# ---------- 4) 输出 ----------
def write_csv(name, data):
    p = OUT / name
    with p.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["文档ID", "URL", "标题", "点击", "曝光", "平均排名", "分档", "建议动作"])
        for x in data:
            w.writerow([x["doc_id"], x["url"], x["title"], x["clicks"], x["imps"],
                        "" if x["pos"] is None else x["pos"], x["tier"], x["action"]])
    return p


write_csv("00-全部文档-GSC分档.csv", rows)
write_csv("01-保留清单.csv", [x for x in rows if x["tier"] == "A-保留"])
write_csv("02-优先优化清单.csv", [x for x in rows if x["tier"] == "B-优先救"])
write_csv("03-观察清单.csv", [x for x in rows if x["tier"] == "C1-观察"])
write_csv("04-合并清单.csv", [x for x in rows if x["tier"] == "C2-合并"])
write_csv("05-删除候选清单.csv", [x for x in rows if x["tier"] == "D-删除候选"])

with (OUT / "99-GSC中未匹配的URL.csv").open("w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["URL", "点击", "曝光", "平均排名"])
    for u in unmatched:
        g = gsc[u]
        w.writerow([u, g["clicks"], g["imps"], g["pos"]])

print("文档总数:", len(docs))
print("GSC 唯一URL数:", len(gsc))
print("已匹配文档数:", len(matched))
print("GSC未匹配URL数:", len(unmatched))
print()
from collections import Counter
c = Counter(x["tier"] for x in rows)
for k in ["A-保留", "B-优先救", "C1-观察", "C2-合并", "D-删除候选"]:
    sub = [x for x in rows if x["tier"] == k]
    print(f"{k}: {c[k]} 篇 | 点击 {sum(x['clicks'] for x in sub)} | 曝光 {sum(x['imps'] for x in sub):,}")
print()
print("总点击:", sum(x["clicks"] for x in rows))
print("总曝光:", f"{sum(x['imps'] for x in rows):,}")
print()
print("输出目录:", OUT)
