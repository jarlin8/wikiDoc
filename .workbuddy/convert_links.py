# -*- coding: utf-8 -*-
"""
内链格式转换：markdown [label](/path)  ->  wiki [[docId|label]]
用法：
  SAMPLE=1 只转 exness-regulation.mdx（小样验证）
  否则转全部（4 篇 guides + 5 个旧文件）
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
SAMPLE = os.environ.get("SAMPLE") == "1"
FM = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

# 建立 URL -> docId
url2id = {"/": "index"}
for f in DOCS.rglob("*.mdx"):
    doc_id = str(f.relative_to(DOCS).with_suffix("")).replace("\\", "/")
    txt = f.read_bytes().decode("utf-8", errors="replace").replace("\r\n", "\n").replace("\r", "\n")
    fm = FM.match(txt)
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
        p = doc_id.split("/")
        url = "/" + ("/".join(p[:-1]) if len(p) >= 2 and p[-1] == p[-2] else doc_id)
    url2id[url.rstrip("/") or "/"] = doc_id

MD = re.compile(r"\[([^\[\]]+)\]\((/[^)\s]*)\)")
missing = []


def conv(m):
    label, url = m.group(1), m.group(2).split("#")[0].rstrip("/") or "/"
    doc_id = url2id.get(url)
    if not doc_id:
        missing.append((url, label))
        return m.group(0)
    # wiki 链接的 label 中若有 | 需转义，这里按站点既有惯例直接写入
    return "[[%s|%s]]" % (doc_id, label)


if SAMPLE:
    # SAMPLE=1 时可指定仅转某几个文件，用于小样验证
    custom = [x for x in os.environ.get("FILES", "").split(",") if x.strip()]
    if custom:
        targets = [DOCS / c for c in custom]
    else:
        targets = [DOCS / "guides" / "exness-regulation.mdx"]
else:
    targets = sorted((DOCS / "guides").glob("*.mdx"))
    targets += [
        DOCS / "exness-trader" / n
        for n in ["交易品种.mdx", "先锋账户.mdx", "关于账户类型后缀.mdx",
                  "标准账户和先锋账户有什么不同.mdx", "零点账户.mdx"]
    ]

total = 0
for p in targets:
    raw = p.read_bytes()
    norm = raw.decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
    new, n = MD.subn(conv, norm)
    if n:
        p.write_bytes(new.replace("\n", "\r\n").encode("utf-8"))
    total += n
    print("  %-46s %d 条" % (p.name, n))

print("\n合计转换:", total)
if missing:
    print("⚠️ 无法解析的 URL:")
    for u, l in missing:
        print("   ", u, "|", l)
else:
    print("✅ 全部 URL 均解析成功")
