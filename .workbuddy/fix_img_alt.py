# -*- coding: utf-8 -*-
"""
批量修复图片 alt（v2）
优先级：说明文字(caption) > 最近前置标题 > 文档标题 > 文件名清洗
支持 DRYRUN=1 试运行。
"""
import os
import re
from pathlib import Path

DOCS = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\docs")
IMG_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
FILENAME_ALT = re.compile(r"^[\w\-. ]+\.(jpg|jpeg|png|gif|svg|webp|bmp)$", re.IGNORECASE)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
FM_RE = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

DRYRUN = os.environ.get("DRYRUN") == "1"
stats = {"caption": 0, "heading": 0, "doctitle": 0, "filename": 0, "skip": 0}
report = []


def strip_md(s):
    s = s.strip()
    s = re.sub(r"\s*#+\s*$", "", s)          # 标题尾部 ###
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"\1", s)
    s = re.sub(r"`(.+?)`", r"\1", s)
    s = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    s = re.sub(r"<[^>]+>", "", s)
    return s.strip()


def clean_filename(alt):
    n = re.sub(r"\.(jpg|jpeg|png|gif|svg|webp|bmp)$", "", alt, flags=re.IGNORECASE)
    n = re.sub(r"[_\-]+", " ", n)
    n = re.sub(r"\b(ZH|CN|EN|SC|TC|CSVP)\b", "", n, flags=re.IGNORECASE)
    n = re.sub(r"\b\d+\b", "", n)
    n = re.sub(r"\s{2,}", " ", n).strip()
    return n


def is_caption_line(s):
    s = s.strip()
    if not s:
        return False
    if s.startswith(("|", "#", "!", "<", ">", "```")):
        return False
    if re.match(r"^[-+]\s", s):
        return False
    if re.match(r"^\*\s", s):        # * 列表项
        return False
    if re.match(r"^\d+[.)]\s", s):
        return False
    if len(s) > 2 and s.startswith("*") and s.endswith("*") and not s.startswith("**"):
        return True
    if len(s) <= 20:
        return True
    if len(s) <= 30 and re.search(r"[。．.]$", s):
        return True
    return False


def cap(s, n=60):
    return s if len(s) <= n else s[:n]


def process(text, doc_title):
    lines = text.split("\n")
    cur = doc_title
    nearest = [""] * len(lines)
    in_code = False
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

    def repl(m, i):
        alt, url = m.group(1), m.group(2)
        if not (alt == "" or FILENAME_ALT.match(alt)):
            stats["skip"] += 1
            return m.group(0)
        new_alt = None
        for j in range(i + 1, min(i + 4, len(lines))):
            if lines[j].strip():
                if is_caption_line(lines[j]):
                    c = re.sub(r"[。．.]+$", "", strip_md(lines[j])).strip()
                    if c:
                        new_alt = c
                        stats["caption"] += 1
                break
        if not new_alt and nearest[i]:
            new_alt = nearest[i]
            stats["heading"] += 1
        if not new_alt:
            new_alt = clean_filename(alt)
            if new_alt:
                stats["filename"] += 1
            else:
                new_alt = doc_title or "示意图"
                stats["doctitle"] += 1
        new_alt = cap(new_alt)
        report.append((alt, new_alt))
        return "![%s](%s)" % (new_alt, url)

    out = []
    for i, ln in enumerate(lines):
        out.append(IMG_RE.sub(lambda m, i=i: repl(m, i), ln))
    return "\n".join(out)


changed = 0
for f in DOCS.rglob("*.mdx"):
    raw = f.read_bytes()
    text = raw.decode("utf-8")
    norm = text.replace("\r\n", "\n").replace("\r", "\n")
    m = FM_RE.match(norm)
    doc_title = ""
    if m:
        tt = re.search(r"^title:\s*(.*)$", m.group(1), re.M)
        if tt:
            doc_title = strip_md(tt.group(1).strip().strip('"\''))
    new = process(norm, doc_title)
    if new != norm:
        changed += 1
        if not DRYRUN:
            f.write_bytes(new.replace("\n", "\r\n").encode("utf-8"))

print("DRYRUN:", DRYRUN)
print("将改动文件数:", changed)
print("alt 来源:", stats)
print()
for old, new in report[:30]:
    print(f"  [{old or '(空)'}] -> {new}")
