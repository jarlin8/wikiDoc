# -*- coding: utf-8 -*-
import re, sys
from pathlib import Path
sys.path.insert(0, str(Path(".workbuddy")))
from fix_img_alt import FM_RE

f = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\docs\exness-trader\了解做市商.mdx")
norm = f.read_bytes().decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
m = FM_RE.match(norm)
print("match:", bool(m))
if m:
    g = m.group(1)
    print("group(1):", repr(g))
    tt = re.search(r"^title:\s*(.*)$", g, re.M)
    print("title match:", tt.group(1) if tt else None)
    # 逐行分析
    for i, line in enumerate(g.split("\n")):
        print(f"  fm line {i}: {repr(line)}")
    print("regex pattern:", FM_RE.pattern)
