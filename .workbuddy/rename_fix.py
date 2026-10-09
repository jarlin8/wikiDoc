# -*- coding: utf-8 -*-
"""补完 config 改名"""
from pathlib import Path

p = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\docusaurus.config.js")
t = p.read_bytes().decode("utf-8")

reps = [
    ('  title: "WikiDoc",', '  title: "汇鉴",'),
    ('        title: "WikiDoc",', '        title: "汇鉴",'),
    ('content: "WikiDoc"', 'content: "汇鉴"'),
]
for old, new in reps:
    n = t.count(old)
    t = t.replace(old, new)
    print("%-36s %d 处" % (old[:34], n))

# 注释块
import re
t = re.sub(
    r"  // 原先为 \"wikiDoc\".*?\n  // 页面 <title> 会输出.*?\n",
    '  // 站点名：2026-09-16 由 "WikiDoc" 更名为「汇鉴 / Huijian」。\n'
    '  // 该值联动：<title> 后缀、og:site_name、footer、JSON-LD Organization。\n',
    t, flags=re.S)

p.write_bytes(t.encode("utf-8"))
print("\n剩余 WikiDoc 出现次数:", t.count("WikiDoc"))
