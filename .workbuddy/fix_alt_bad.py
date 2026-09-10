# -*- coding: utf-8 -*-
"""修正质量差的图片 alt（v2，用文件写入避免 shell 转义问题）"""
import os
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from fix_img_alt import strip_md, is_caption_line, HEADING_RE, IMG_RE, FM_RE

DOCS = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\docs")
DRYRUN = os.environ.get("DRYRUN") == "1"

TITLE_RE = re.compile(r"^title:\s*(.*)$", re.M)
BAD_CODE_RE = re.compile(r"^[A-Za-z]{0,8}[\s\-]*\d+$")
DIGITS_RE = re.compile(r"^\d+$")
WEAK_RE = re.compile(r"^[A-Za-z]{1,6}\d*$")


def is_bad(a):
    a = a.strip()
    if a == "":
        return True
    if a.endswith("#"):
        return True
    if a.startswith(("*", "#")):
        return True
    if BAD_CODE_RE.match(a):
        return True
    if DIGITS_RE.match(a):
        return True
    return False


def is_weak(s):
    s = s.strip()
    if len(s) <= 3:
        return True
    if WEAK_RE.fullmatch(s):
        return True
    return False


report = []
changed = 0
for f in DOCS.rglob("*.mdx"):
    norm = f.read_bytes().decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
    fm = FM_RE.match(norm)
    doc_title = ""
    if fm:
        tt = TITLE_RE.search(fm.group(1))
        if tt:
            doc_title = strip_md(tt.group(1).strip().strip("\"'"))
    lines = norm.split("\n")
    cur, in_code = doc_title, False
    nearest = [""] * len(lines)
    for i, ln in enumerate(lines):
        if ln.strip().startswith("```"):
            in_code = not in_code
        if not in_code:
            hm = HEADING_RE.match(ln.strip())
            if hm:
                h = strip_md(hm.group(2))
                if h:
                    cur = h
        nearest[i] = cur

    def repl(mm, i):
        a, url = mm.group(1), mm.group(2)
        if not is_bad(a):
            return mm.group(0)
        new = ""
        # 1) 图片下一行的说明
        for j in range(i + 1, min(i + 4, len(lines))):
            if lines[j].strip():
                if is_caption_line(lines[j]):
                    c = strip_md(lines[j])
                    c = re.sub(r"^[*\-\s]+", "", c)
                    c = re.sub(r"[。．.：:]+$", "", c).strip()
                    if c and not is_weak(c):
                        new = c
                break
        # 2) 最近前置标题
        if not new and nearest[i] and not is_weak(nearest[i]):
            new = nearest[i]
        # 3) 文档标题
        if not new and doc_title:
            new = doc_title
        # 4) 文件名清洗
        if not new:
            n = re.sub(r"\.(jpg|jpeg|png|gif|svg|webp|bmp)$", "", a, flags=re.I)
            n = re.sub(r"[_\-]+", " ", n)
            n = re.sub(r"\b(ZH|CN|EN|SC|TC|CSVP)\b", "", n, flags=re.I)
            n = re.sub(r"\s{2,}", " ", n).strip()
            if n and not is_weak(n):
                new = n
        # 5) 保底
        if not new:
            new = doc_title or "示意图"
        new = new if len(new) <= 60 else new[:60]
        report.append((a, new))
        return "![%s](%s)" % (new, url)

    out = [IMG_RE.sub(lambda mm, i=i: repl(mm, i), ln) for i, ln in enumerate(lines)]
    new_txt = "\n".join(out)
    if new_txt != norm:
        changed += 1
        if not DRYRUN:
            f.write_bytes(new_txt.replace("\n", "\r\n").encode("utf-8"))

print("DRYRUN:", DRYRUN, "| 改动文件数:", changed, "| 修正 alt:", len(report))
for a, n in report:
    print(f"  [{a or '(空)'}] -> {n}")
