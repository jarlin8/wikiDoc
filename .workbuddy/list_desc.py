# -*- coding: utf-8 -*-
"""导出需要改写的 description 清单"""
import re
from pathlib import Path

DOCS = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\docs")
FM = re.compile(r"^---\r?\n(.*?)\r?\n---", re.DOTALL)


def grab(fm, k):
    m = re.search(r"(?m)^" + k + r":\s*(.*)$", fm)
    if not m:
        return ""
    v = m.group(1).strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        v = v[1:-1]
    return v.strip()


rows = []
for f in sorted(DOCS.rglob("*.mdx")):
    did = str(f.relative_to(DOCS).with_suffix("")).replace("\\", "/")
    t = f.read_bytes().decode("utf-8", errors="replace").replace("\r\n", "\n").replace("\r", "\n")
    m = FM.match(t)
    if not m:
        continue
    fm = m.group(1)
    ti, de = grab(fm, "title"), grab(fm, "description")
    L = len(de)
    if L < 40 or L > 120:
        rows.append((did, ti, de, L))

short = [r for r in rows if r[3] < 40]
long_ = [r for r in rows if r[3] > 120]
print("需改写总数:", len(rows), " 过短:", len(short), " 过长:", len(long_))
print()
print("########## 过短 (<40 字) ##########")
for d, t, de, L in sorted(short, key=lambda x: x[3]):
    print("%3d\t%s\t%s\t%s" % (L, d, t, de))
print()
print("########## 过长 (>120 字) ##########")
for d, t, de, L in sorted(long_, key=lambda x: -x[3]):
    print("%3d\t%s\t%s\t%s" % (L, d, t, de[:70]))
