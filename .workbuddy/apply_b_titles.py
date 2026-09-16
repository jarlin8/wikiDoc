# -*- coding: utf-8 -*-
"""
步骤1：为 B-优先救 20 篇更新 title / description
同时写入 sidebar_label，避免长标题污染侧栏
DRYRUN=1 试运行
"""
import csv
import os
import re
import shutil
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
SRC = ROOT / "reports" / "02-优先优化清单.csv"
BACKUP = ROOT / ".workbuddy" / "backup-fm-20260915"
DRYRUN = os.environ.get("DRYRUN") == "1"

FM_RE = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)


def set_fm_field(fm, key, value):
    """在 frontmatter 文本里设置/插入一个字段（值统一用双引号）"""
    line = '%s: "%s"' % (key, value.replace('"', '\\"'))
    pat = re.compile(r"(?m)^%s:.*$" % re.escape(key))
    if pat.search(fm):
        return pat.sub(lambda m: line, fm, count=1)
    # 不存在则插到 title 之后；若无 title 则插到最前
    tp = re.compile(r"(?m)^title:.*$")
    if tp.search(fm):
        return tp.sub(lambda m: m.group(0) + "\n" + line, fm, count=1)
    return line + "\n" + fm


rows = list(csv.DictReader(SRC.open(encoding="utf-8-sig")))
BACKUP.mkdir(parents=True, exist_ok=True)

done, skipped = [], []
for r in rows:
    doc_id = r["文档ID"]
    new_title = (r.get("建议标题") or "").strip()
    new_desc = (r.get("建议描述") or "").strip()
    old_title = (r.get("当前标题") or "").strip()
    if not new_title:
        skipped.append((doc_id, "无建议标题"))
        continue
    f = DOCS / (doc_id + ".mdx")
    if not f.exists():
        skipped.append((doc_id, "文件不存在"))
        continue

    raw = f.read_bytes()
    norm = raw.decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
    m = FM_RE.match(norm)
    if not m:
        skipped.append((doc_id, "无 frontmatter"))
        continue
    fm = m.group(1)

    has_sbl = bool(re.search(r"(?m)^sidebar_label:", fm))
    if has_sbl:
        new_fm = set_fm_field(fm, "title", new_title)
    else:
        new_fm = set_fm_field(fm, "title", new_title)
        new_fm = set_fm_field(new_fm, "sidebar_label", old_title)

    if new_desc:
        new_fm = set_fm_field(new_fm, "description", new_desc)

    out = norm[: m.start(1)] + new_fm + norm[m.end(1):]
    if not DRYRUN:
        shutil.copy2(f, BACKUP / (doc_id.replace("/", "__") + ".mdx"))
        f.write_bytes(out.replace("\n", "\r\n").encode("utf-8"))
    done.append((doc_id, old_title, new_title))

print("DRYRUN:", DRYRUN)
print("已更新:", len(done), "| 跳过:", len(skipped))
for s in skipped:
    print("   跳过:", s)
print()
for d, o, n in done:
    print("  %-46s %s  ->  %s" % (d, o[:14], n))
print()
print("备份目录:", BACKUP)
