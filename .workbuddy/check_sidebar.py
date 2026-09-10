# -*- coding: utf-8 -*-
"""校验 sidebars.js 是否覆盖全部文档且无重复/无失效 ID"""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"

# 文件系统真实 doc id（相对 docs/，去扩展名）
real = set()
for f in DOCS.rglob("*.mdx"):
    rel = f.relative_to(DOCS).with_suffix("")
    real.add(str(rel).replace("\\", "/"))

txt = (ROOT / "sidebars.js").read_text(encoding="utf-8")
# 抓取 items 里的字符串条目（形如 "xxx" 且不是 key）
ids = re.findall(r'^\s*"([^"]+)",\s*$', txt, re.M)

print("文件系统文档数:", len(real))
print("侧栏条目数:", len(ids))
print()

dup = [x for x in set(ids) if ids.count(x) > 1]
missing = sorted(real - set(ids))
extra = sorted(set(ids) - real)

print("重复条目:", dup if dup else "无")
print()
print(f"未收录 ({len(missing)}):")
for x in missing:
    print("   ", x)
print()
print(f"无效条目 ({len(extra)}):")
for x in extra:
    print("   ", x)
