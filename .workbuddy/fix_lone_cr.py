# -*- coding: utf-8 -*-
"""修复孤立 CR：\r（非 \r\n 的一部分）-> \r\n"""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
TARGETS = ["docs/exness-agent/exness-agent.mdx", "docs/nytimes/nytimes.mdx"]
PAT = re.compile(rb"\r(?!\n)")

for rel in TARGETS:
    p = ROOT / rel
    raw = p.read_bytes()
    n = len(PAT.findall(raw))
    if n:
        p.write_bytes(PAT.sub(b"\r\n", raw))
    print(f"{rel}: 修复 {n} 处孤立 CR")
