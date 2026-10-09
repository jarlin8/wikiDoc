#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 \r\r\n 损坏：将 \r\r\n 还原为 \r\n
以二进制方式写出，避免 Python 再次转换换行。
"""
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"

fixed = 0
detail = []

targets = list(DOCS.rglob("*.mdx")) + list(DOCS.rglob("*.md"))
for f in targets:
    raw = f.read_bytes()
    if b"\r\r\n" not in raw:
        continue
    n_before = raw.count(b"\r\r\n")
    new = raw
    # 反复替换直到稳定
    while b"\r\r\n" in new:
        new = new.replace(b"\r\r\n", b"\r\n")
    # 兜底：残留的 \r\r 也归一
    while b"\r\r" in new:
        new = new.replace(b"\r\r", b"\r")
    # 二进制写出
    f.write_bytes(new)
    fixed += 1
    detail.append((str(f.relative_to(ROOT)), n_before))

print(f"修复文件数: {fixed}")
for d, n in sorted(detail, key=lambda x: -x[1])[:10]:
    print(f"  {n:5d} 处  {d}")
