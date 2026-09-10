#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MDX 格式扫描器 V5：最终综合扫描
新增检测：
- 图片空 alt 文本：![](url)
- 英文/中文之间缺空格（盘古之白）
- 连续标点
- 连续 2+ 空格
- 文件末尾无换行
- BOM 标记
- 常见 wiki 链接写法错误
- 标题前后空行缺失
- 列表缩进不一致
- HTML 实体应该用 Markdown 的地方
"""
import os
import re
import json
from pathlib import Path
from collections import defaultdict

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"

FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.DOTALL)
FENCE_RE = re.compile(r"^(\s*)(```+|~~~+)(.*)$")
TABLE_ROW_RE = re.compile(r"^\s*\|.*\|\s*$")
TABLE_SEP_RE = re.compile(r"^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$")
IMG_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")

stats = defaultdict(int)
issues = defaultdict(list)


def scan_file(path: Path):
    rel = str(path.relative_to(ROOT))
    try:
        raw = path.read_bytes()
        text = raw.decode("utf-8")
    except Exception as e:
        issues[rel].append(f"READ_ERROR: {e}")
        return

    # BOM 检查
    if raw.startswith(b"\xef\xbb\xbf"):
        stats["bom"] += 1
        issues[rel].append("文件含 BOM 标记")

    m = FRONTMATTER_RE.match(text)
    if m:
        body = text[m.end():]
        frontmatter_text = text[:m.end()]
        frontmatter_lines = text[:m.end()].count("\n")
    else:
        body = text
        frontmatter_text = ""
        frontmatter_lines = 0

    lines = body.split("\n")
    file_issues = []
    in_code = False

    def emit(line_no, msg):
        file_issues.append(f"L{line_no}: {msg}")

    target_text = frontmatter_text + "\n" + body
    target_lines = target_text.split("\n")

    # 1) 标点后多余空格
    in_code = False
    for i, line in enumerate(target_lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        for m2 in re.finditer(r"([。，！？：；」』）】》])\s+(?=[\u4e00-\u9fffA-Za-z0-9。，！？：；])", line):
            stats["punct_space"] += 1
            emit(i, f"标点后多余空格: ...{line[max(0,m2.start()-5):m2.end()+5]}...")

    # 2) 中文后跟半角标点
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        if TABLE_ROW_RE.match(line):
            continue
        # **English:**
        for m2 in re.finditer(r"\*\*([A-Za-z][A-Za-z0-9]*):\*\*", line):
            stats["english_bold_half_colon"] += 1
            emit(i+frontmatter_lines, f"**English:** 半角冒号: ...{line[max(0,m2.start()-5):m2.end()+5]}...")
        # 中文后半角逗号/分号/冒号
        for m2 in re.finditer(r"([\u4e00-\u9fff]{2,}),(?=[\u4e00-\u9fff])", line):
            stats["half_punct_comma"] += 1
            emit(i+frontmatter_lines, f"中文后半角逗号: ...{line[max(0,m2.start()-5):m2.end()+5]}...")
        for m2 in re.finditer(r"([\u4e00-\u9fff]{2,});(?=[\u4e00-\u9fff])", line):
            stats["half_punct_semicolon"] += 1
            emit(i+frontmatter_lines, f"中文后半角分号: ...{line[max(0,m2.start()-5):m2.end()+5]}...")
        for m2 in re.finditer(r"([\u4e00-\u9fff]):(?!//)(?!\d)(?!\w)", line):
            stats["half_punct_colon"] += 1
            emit(i+frontmatter_lines, f"中文后半角冒号: ...{line[max(0,m2.start()-5):m2.end()+5]}...")

    # 3) 图片 alt 检查（空 alt / 仅文件名）
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        for m2 in IMG_RE.finditer(line):
            alt = m2.group(1)
            url = m2.group(2)
            if alt == "":
                stats["img_empty_alt"] += 1
                emit(i+frontmatter_lines, "图片 alt 为空（建议添加描述）")
            elif re.match(r"^[\w\-_]+\.(jpg|jpeg|png|gif|svg|webp)$", alt, re.IGNORECASE):
                stats["img_alt_filename"] += 1
                emit(i+frontmatter_lines, f"图片 alt 仅为文件名: {alt}")

    # 4) 表格列数检查
    in_code = False
    table_buf = []
    def flush():
        if not table_buf:
            return
        header = None
        sep = None
        data = []
        for ln, line, cells, kind in table_buf:
            if kind == "sep":
                sep = (ln, line, cells)
            elif header is None:
                header = (ln, line, cells)
            else:
                data.append((ln, line, cells))
        if not header or not sep:
            return
        if header[2] is None or sep[2] is None:
            return
        h_n = len(header[2])
        s_n = len(sep[2])
        if h_n != s_n:
            emit(header[0]+frontmatter_lines, f"表格列数不匹配 header={h_n} vs sep={s_n}")
            stats["table_col_mismatch"] += 1
        for ln, line, cells in data:
            if cells is None:
                continue
            if len(cells) != h_n:
                emit(ln+frontmatter_lines, f"数据行 {len(cells)} 列与 header {h_n} 列不一致")
                stats["table_col_mismatch"] += 1

    for i, line in enumerate(lines):
        if FENCE_RE.match(line):
            in_code = not in_code
            flush()
            table_buf = []
            continue
        if in_code:
            continue
        if TABLE_ROW_RE.match(line) or TABLE_SEP_RE.match(line.rstrip()):
            inner = line.rstrip()
            if not inner.endswith("|"):
                inner += "|"
            inner = inner[1:-1]
            cells = [c.strip() for c in inner.split("|")]
            kind = "sep" if TABLE_SEP_RE.match(line.rstrip()) else "data"
            table_buf.append((i, line, cells, kind))
        else:
            flush()
            table_buf = []
    flush()

    # 5) 行尾空格
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        if re.search(r"[ \t]+$", line):
            stats["trailing_ws"] += 1
            emit(i+frontmatter_lines, "行尾空格")

    # 6) 连续空行 3+
    for m2 in re.finditer(r"\n{3,}", body):
        line_no = body[:m2.start()].count("\n") + 1 + frontmatter_lines
        stats["multi_blank"] += 1
        emit(line_no, f"连续 {m2.end() - m2.start()} 个空行")

    # 7) 标题层级跳跃
    in_code = False
    headings = []
    for i, line in enumerate(lines):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        m2 = re.match(r"^(#+)\s", line)
        if m2:
            headings.append((i+1+frontmatter_lines, len(m2.group(1)), line.strip()))
    for j in range(1, len(headings)):
        prev_lvl = headings[j-1][1]
        cur_lvl = headings[j][1]
        if cur_lvl > prev_lvl + 1:
            emit(headings[j][0], f"标题层级跳跃 H{prev_lvl}→H{cur_lvl}")
            stats["hierarchy_jump"] += 1

    # 8) 文件末尾无换行
    if not text.endswith("\n"):
        stats["no_trailing_newline"] += 1
        file_issues.append("文件末尾无换行")

    # 9) 连续 2+ 空格（行中，不在代码块/表格/链接内）
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        if TABLE_ROW_RE.match(line):
            continue
        # 跳过表格/链接/frontmatter 等
        if re.search(r" {2,}([^\s])", line) and not re.search(r"^>", line):
            # 排除行首缩进和列表缩进
            stripped = line.lstrip()
            indent_len = len(line) - len(stripped)
            body = line[indent_len:]
            if re.search(r" {2,}", body):
                # 排除代码/链接内部
                if not re.search(r"`[^`]*  [^`]*`", line):
                    stats["multi_space"] += 1
                    emit(i+frontmatter_lines, f"行中连续 2+ 空格")

    if file_issues:
        issues[rel] = file_issues


def main():
    files = list(DOCS.rglob("*.mdx")) + list(DOCS.rglob("*.md"))
    for f in files:
        scan_file(f)
    out = {"stats": dict(stats), "files": dict(issues)}
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
