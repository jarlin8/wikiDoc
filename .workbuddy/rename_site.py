# -*- coding: utf-8 -*-
"""改名 WikiDoc -> 汇鉴 / Huijian"""
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
NEW_CN = "汇鉴"
NEW_EN = "Huijian"

edits = [
    # (文件, 旧串, 新串, 期望次数)
    ("docusaurus.config.js", '"WikiDoc"', '"%s"' % NEW_CN, 3),
    ("docusaurus.config.js", '"WikiDoc Logo"', '"%s Logo"' % NEW_CN, 2),
    ("docusaurus.config.js", "WikiDoc · wiki.ssgg.net",
     "%s %s · wiki.ssgg.net" % (NEW_CN, NEW_EN), 1),
    ("src/components/Homepage/index.js", ">WikiDoc</h1>", ">%s</h1>" % NEW_CN, 1),
]

# index.mdx 用带引号的形式单独处理
edits.append(("docs/index.mdx", "author: WikiDoc", "author: %s" % NEW_CN, 1))

for rel, old, new, expect in edits:
    p = ROOT / rel
    raw = p.read_bytes().decode("utf-8")
    n = raw.count(old)
    if n != expect:
        print("⚠️ %s: 期望 %d 处，实际 %d 处 —— 跳过" % (rel, expect, n))
        continue
    p.write_bytes(raw.replace(old, new).encode("utf-8"))
    print("✅ %-34s %d 处  %s -> %s" % (rel, n, old[:28], new[:28]))

# 更新 config 里的历史注释
p = ROOT / "docusaurus.config.js"
t = p.read_bytes().decode("utf-8")
t = t.replace(
    '  // 原先为 "wikiDoc"（小写 w），与 navbar 显示的 "WikiDoc" 不一致；\n'
    '  // 页面 <title> 会输出「标准账户 | wikiDoc」，统一为 WikiDoc。\n',
    '  // 站点名：2026-09-16 由 "WikiDoc" 更名为「汇鉴 / Huijian」。\n'
    '  // 该值会联动：<title> 后缀、og:site_name、footer、JSON-LD Organization。\n'
)
p.write_bytes(t.encode("utf-8"))
print("✅ 已更新 config 注释")
