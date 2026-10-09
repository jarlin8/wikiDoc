# -*- coding: utf-8 -*-
"""校验 guides 下所有内链是否指向真实存在的文档"""
import re
import sys
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
FM_RE = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

# 建立 URL -> doc_id 映射
url2id = {"/": "index"}
all_ids = set()
for f in DOCS.rglob("*.mdx"):
    doc_id = str(f.relative_to(DOCS).with_suffix("")).replace("\\", "/")
    all_ids.add(doc_id)
    txt = f.read_bytes().decode("utf-8", errors="replace")
    fm = FM_RE.match(txt.replace("\r\n", "\n").replace("\r", "\n"))
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

MD = re.compile(r"\]\((/[^)\s]*)\)")
WIKI = re.compile(r"\[\[([^\[\]|]+)(?:\|([^\[\]]+))?\]\]")

bad = []
total = 0
for f in sorted((DOCS / "guides").glob("*.mdx")):
    text = f.read_bytes().decode("utf-8", errors="replace").replace("\r\n", "\n").replace("\r", "\n")
    for m in MD.finditer(text):
        total += 1
        url = m.group(1).split("#")[0].rstrip("/") or "/"
        if url not in url2id:
            line = text[: m.start()].count("\n") + 1
            bad.append((f.name, line, "MD", url))
    for m in WIKI.finditer(text):
        total += 1
        t = m.group(1).strip().split("#")[0].strip().rstrip("/")
        t = re.sub(r"\.mdx?$", "", t)
        if t not in all_ids:
            line = text[: m.start()].count("\n") + 1
            bad.append((f.name, line, "WIKI", t))

print("检查 guides 内链总数:", total)
print("断链数:", len(bad))
for b in bad:
    print("  ❌ %s:%d [%s] %s" % b)
if not bad:
    print("  ✅ 全部有效")
sys.exit(1 if bad else 0)
