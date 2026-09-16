# -*- coding: utf-8 -*-
"""
步骤2-批次1：归档 D 档（零曝光）文档
- 移动 docs/{id}.mdx -> _archive/{id}.mdx（不删除，可一键还原）
- 从分类索引页移除对应条目
- 从 sidebars.js 移除对应条目
DRYRUN=1 试运行
"""
import csv
import os
import re
import shutil
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
ARCH = ROOT / "_archive"
SIDEBARS = ROOT / "sidebars.js"
DRYRUN = os.environ.get("DRYRUN") == "1"

INDEX_FILES = [
    DOCS / "exness-trader" / "exness-trader.mdx",
    DOCS / "exness-agent" / "exness-agent.mdx",
    DOCS / "nytimes" / "nytimes.mdx",
]

# ---- 1) 取 D 档清单 ----
targets = []
with (ROOT / "reports" / "05-删除候选清单.csv").open(encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        targets.append(r["文档ID"])
print("D 档待归档:", len(targets))

# ---- 2) 安全检查：是否被其他文档正文引用 ----
all_docs = {}
for f in DOCS.rglob("*.mdx"):
    did = str(f.relative_to(DOCS).with_suffix("")).replace("\\", "/")
    all_docs[did] = f.read_bytes().decode("utf-8", errors="replace")

idx_ids = {"exness-trader/exness-trader", "exness-agent/exness-agent", "nytimes/nytimes"}
WIKI = re.compile(r"\[\[([^\[\]|]+)(?:\|([^\[\]]+))?\]\]")
refs = {}
for src, body in all_docs.items():
    if src in idx_ids or src in targets:
        continue
    for m in WIKI.finditer(body):
        t = m.group(1).strip().split("#")[0].strip().rstrip("/")
        if t in targets:
            refs.setdefault(t, set()).add(src)
if refs:
    print("⚠️ 以下待归档文档被正文引用，需人工处理：")
    for k, v in refs.items():
        print("   ", k, "<-", sorted(v))
else:
    print("✓ 无正文引用，可安全归档")

# ---- 3) 执行 ----
moved = 0
for did in targets:
    src = DOCS / (did + ".mdx")
    dst = ARCH / (did + ".mdx")
    if not src.exists():
        print("   跳过（不存在）:", did)
        continue
    if not DRYRUN:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
    moved += 1
print("已归档文件:", moved)

# ---- 4) 清理索引页 ----
def clean_index(path, idset):
    if not path.exists():
        return 0
    raw = path.read_bytes().decode("utf-8")
    norm = raw.replace("\r\n", "\n").replace("\r", "\n")
    lines = norm.split("\n")
    out, removed = [], 0
    for ln in lines:
        hit = False
        for m in WIKI.finditer(ln):
            t = m.group(1).strip().split("#")[0].strip().rstrip("/")
            if t in idset:
                hit = True
                break
        if hit:
            removed += 1
            continue
        out.append(ln)
    new = "\n".join(out)
    if new != norm and not DRYRUN:
        path.write_bytes(new.replace("\n", "\r\n").encode("utf-8"))
    return removed


idset = set(targets)
tot = 0
for p in INDEX_FILES:
    n = clean_index(p, idset)
    tot += n
    print("  索引清理 %s: -%d 条" % (p.name, n))
print("索引页共移除条目:", tot)

# ---- 5) 清理 sidebars.js ----
raw = SIDEBARS.read_bytes().decode("utf-8")
norm = raw.replace("\r\n", "\n")
out, removed = [], 0
pat = re.compile(r'^\s*"([^"]+)",\s*$')
for ln in norm.split("\n"):
    m = pat.match(ln)
    if m and m.group(1) in idset:
        removed += 1
        continue
    out.append(ln)
if not DRYRUN and removed:
    SIDEBARS.write_bytes("\n".join(out).encode("utf-8"))
print("sidebars.js 移除条目:", removed)

if not DRYRUN:
    ARCH.mkdir(parents=True, exist_ok=True)
print()
print("DRYRUN:", DRYRUN, "| 归档目录:", ARCH)
