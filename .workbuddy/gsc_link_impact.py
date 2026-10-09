# -*- coding: utf-8 -*-
"""
步骤2前置：精简影响分析
- 待精简文档（C2+D）被多少其他文档引用（wiki 链接 / markdown 绝对路径链接）
- 是否出现在 sidebars.js
输出：reports/07-精简影响分析.csv
"""
import csv
import re
import urllib.parse
from collections import defaultdict
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
OUT = ROOT / "reports"
SITE = "https://wiki.ssgg.net"
FM_RE = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

# ---------- 1) 文档清单 + URL 映射 ----------
docs = {}
url2id = {}
for f in sorted(DOCS.rglob("*.mdx")):
    doc_id = str(f.relative_to(DOCS).with_suffix("")).replace("\\", "/")
    txt = f.read_bytes().decode("utf-8", errors="replace").replace("\r\n", "\n").replace("\r", "\n")
    fm = FM_RE.match(txt)
    slug = ""
    if fm:
        s = re.search(r"(?m)^slug:\s*(.*)$", fm.group(1))
        if s:
            slug = s.group(1).strip().strip("\"'")
    if slug:
        url = slug if slug.startswith("/") else "/" + slug
    elif doc_id == "index":
        url = "/"
    else:
        parts = doc_id.split("/")
        url = "/" + ("/".join(parts[:-1]) if len(parts) >= 2 and parts[-1] == parts[-2] else doc_id)
    docs[doc_id] = {"url": url, "body": txt}
    url2id[url.rstrip("/") or "/"] = doc_id

# 文件名索引（wiki 链接可能只写页面名）
name2id = defaultdict(list)
for doc_id in docs:
    name2id[doc_id.split("/")[-1]].append(doc_id)

WIKI = re.compile(r"\[\[([^\[\]|]+)(?:\|([^\[\]]+))?\]\]")
MDLINK = re.compile(r"\]\((/[^)\s]+)\)")

inbound = defaultdict(set)      # target doc_id -> set(source doc_id)
unresolved = defaultdict(int)   # 未解析的 wiki 链接目标

for src, d in docs.items():
    body = d["body"]
    for m in WIKI.finditer(body):
        t = urllib.parse.unquote(m.group(1).strip()).split("#")[0].strip().rstrip("/")
        t = re.sub(r"\.mdx?$", "", t)
        if t in docs:
            inbound[t].add(src)
        elif len(name2id.get(t.split("/")[-1], [])) == 1:
            inbound[name2id[t.split("/")[-1]][0]].add(src)
        else:
            unresolved[t] += 1
    for m in MDLINK.finditer(body):
        u = urllib.parse.unquote(m.group(1).split("#")[0]).rstrip("/") or "/"
        if u.startswith(SITE):
            u = u[len(SITE):] or "/"
        t = url2id.get(u)
        if t and t != src:
            inbound[t].add(src)

# ---------- 2) 读分档 ----------
tiers = {}
with (OUT / "00-全部文档-GSC分档.csv").open(encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        tiers[r["文档ID"]] = r

sidebar_text = (ROOT / "sidebars.js").read_text(encoding="utf-8")
in_sidebar = set(re.findall(r'^\s*"([^"]+)",\s*$', sidebar_text, re.M))

# ---------- 3) 输出 ----------
p = OUT / "07-精简影响分析.csv"
with p.open("w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["文档ID", "分档", "曝光", "入链数", "入链来源(前8)", "在侧栏", "处理建议"])
    for doc_id, r in sorted(tiers.items(), key=lambda kv: (kv[1]["分档"], -len(inbound.get(kv[0], ())))):
        if r["分档"] not in ("C2-合并", "D-删除候选"):
            continue
        srcs = sorted(inbound.get(doc_id, ()))
        n = len(srcs)
        if n == 0:
            act = "直接删除（无任何引用）"
        elif n <= 3:
            act = "删除 + 改写 %d 处引用" % n
        else:
            act = "⚠️ 高引用，建议保留或改写 %d 处引用" % n
        w.writerow([doc_id, r["分档"], r["曝光"], n, " | ".join(srcs[:8]),
                    "是" if doc_id in in_sidebar else "否", act])

# 汇总
tgt = [d for d, r in tiers.items() if r["分档"] in ("C2-合并", "D-删除候选")]
zero = [d for d in tgt if not inbound.get(d)]
low = [d for d in tgt if 0 < len(inbound.get(d, ())) <= 3]
high = [d for d in tgt if len(inbound.get(d, ())) > 3]
print("待精简文档总数:", len(tgt))
print("  无任何入链（可直接删）:", len(zero))
print("  入链 1-3（改少量引用）:", len(low))
print("  入链 >3（需评估，建议保留）:", len(high))
print()
print("引用最多的前 12 篇：")
for d in sorted(tgt, key=lambda x: -len(inbound.get(x, ())))[:12]:
    print("  %-52s 入链 %2d  [%s]" % (d, len(inbound.get(d, ())), tiers[d]["分档"]))
print()
print("未解析 wiki 链接目标数:", len(unresolved))
print("输出:", p)
