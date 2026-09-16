# -*- coding: utf-8 -*-
"""将 sidebars.js 中 5 个一级分类的 link 从 generated-index 改回 doc"""
import re
from pathlib import Path

p = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\sidebars.js")
t = p.read_bytes().decode("utf-8")

PAIRS = [
    ("/category/guides", "guides/guides"),
    ("/category/exness-trader", "exness-trader/exness-trader"),
    ("/category/exness-agent", "exness-agent/exness-agent"),
    ("/category/ai-tools", "ai-tools"),
    ("/category/nytimes", "nytimes/nytimes"),
]

# 把每个 generated-index 块整体替换为一行 doc link
pat = re.compile(
    r'link:\s*\{\s*\n\s*type:\s*"generated-index",\s*\n\s*slug:\s*"([^"]+)",\s*\n'
    r'(?:\s*title:\s*"[^"]*",\s*\n)?(?:\s*description:\s*\n?\s*"[^"]*",\s*\n)?\s*\},',
    re.M,
)

mapping = dict(PAIRS)
count = 0


def rep(m):
    global count
    slug = m.group(1)
    doc = mapping.get(slug)
    if not doc:
        return m.group(0)
    count += 1
    return 'link: { type: "doc", id: "%s" },' % doc


new = pat.sub(rep, t)
p.write_bytes(new.encode("utf-8"))
print("替换 generated-index 块:", count)

left = re.findall(r'generated-index', new)
print("剩余 generated-index 出现:", len(left))
for s, d in PAIRS:
    print("  %-24s -> %s" % (s, d))
