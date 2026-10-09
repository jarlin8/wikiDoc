# -*- coding: utf-8 -*-
"""
表格感知的内链格式统一：
  - 表格行（以 | 开头）  : 保持 markdown  [label](/url)
  - 其余正文            : 统一为 wiki    [[docId|label]]

原因（已实测）：[[id|label]] 中的 `|` 会被 GFM 表格解析器当作列分隔符，
              导致单元格被切断且插件不再转换；转义 `\\|` 又会让 href 带上反斜杠。
"""
import re
import sys
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
FM = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

url2id, id2url = {"/": "index"}, {"index": "/"}
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
    id2url[doc_id] = url

MD = re.compile(r"\[([^\[\]]+)\]\((/[^)\s]*)\)")
WIKI = re.compile(r"\[\[([^\[\]|\\]+)(?:\|([^\[\]]*))?\]\]")

targets = sorted((DOCS / "guides").glob("*.mdx")) + [
    DOCS / "exness-trader" / n for n in
    ["交易品种.mdx", "先锋账户.mdx", "关于账户类型后缀.mdx",
     "标准账户和先锋账户有什么不同.mdx", "零点账户.mdx"]
]

stat = {"md2wiki": 0, "wiki2md": 0, "unresolved": 0}

for p in targets:
    norm = p.read_bytes().decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
    out = []
    for line in norm.split("\n"):
        if line.lstrip().startswith("|"):
            # 表格行：wiki -> markdown（保证表格结构不被 | 破坏）
            def back(m):
                doc_id, label = m.group(1).strip(), (m.group(2) or "").strip()
                u = id2url.get(doc_id)
                if not u:
                    stat["unresolved"] += 1
                    return m.group(0)
                stat["wiki2md"] += 1
                return "[%s](%s)" % (label or doc_id, u)
            line = WIKI.sub(back, line)
        else:
            # 正文：markdown -> wiki
            def fwd(m):
                label, u = m.group(1), m.group(2).split("#")[0].rstrip("/") or "/"
                doc_id = url2id.get(u)
                if not doc_id:
                    stat["unresolved"] += 1
                    return m.group(0)
                stat["md2wiki"] += 1
                return "[[%s|%s]]" % (doc_id, label)
            line = MD.sub(fwd, line)
        out.append(line)
    p.write_bytes("\n".join(out).encode("utf-8"))
    print("  ✅", p.name)

print("\n正文 markdown→wiki:", stat["md2wiki"])
print("表格 wiki→markdown:", stat["wiki2md"])
print("未解析:", stat["unresolved"])
