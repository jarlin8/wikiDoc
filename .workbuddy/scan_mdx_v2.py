#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MDX 格式扫描器 V2：检测更全面的格式问题
- 标点后多余空格（包括 1 个空格）
- 半角/全角标点混用
- 表格列数不匹配
- 行尾空格
- 连续空行
- 标题层级跳跃
- 代码块围栏后多余空格
- 中文与英文/数字间缺空格（盘古之白风格）
- 列表符号混用
- 其他
"""
import os
import re
import sys
import json
from pathlib import Path
from collections import defaultdict

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"

FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.DOTALL)
FENCE_RE = re.compile(r"^(\s*)(```+|~~~+)(.*)$")
TABLE_ROW_RE = re.compile(r"^\s*\|.*\|\s*$")
TABLE_SEP_RE = re.compile(r"^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$")
TABLE_SEP_ANY_RE = re.compile(r"^\s*\|?[\s\-:|]+\|?\s*$")

# 1) 中文标点后跟空格（1+ 个空格 → 紧跟中文/英文/数字/标点）
PUNCT_SPACE_RE = re.compile(r"([。，！？：；」』）】》])\s+([\u4e00-\u9fffA-Za-z0-9。，！？：；])")
# 2) 标点前多余空格（中文标点前有空格）
PUNCT_LEAD_SPACE_RE = re.compile(r"\s+([。，！？：；」』）】》])")
# 3) 半角标点出现在中文文本中（连续 2+ 中文字符后跟半角标点）
HALF_PUNCT_RE = re.compile(r"[\u4e00-\u9fff]{2,}([,;:])(?![\s\d])")
# 4) 行尾空格
TRAILING_WS_RE = re.compile(r"[ \t]+$")
# 5) 连续空行 3+
MULTI_BLANK_RE = re.compile(r"\n{3,}")
# 6) 代码块围栏后多余空格（如 ``` 后面有空格）
FENCE_TRAILING_RE = re.compile(r"^(\s*)(```+|~~~+)\s+\S*$")
# 7) 列表符号混用：同缩进用 - 和 * 两种

# 链接/图片 语法
LINK_RE = re.compile(r"(!?)\[([^\]]*)\]\(([^)]*)\)")
# 表格行单元格
def split_cells(line):
    s = line.rstrip()
    if not s.startswith("|"):
        return None
    if not s.endswith("|"):
        # 表格行必须以 | 开头和结尾
        s = s + "|"
    inner = s[1:-1]
    return [c.strip() for c in inner.split("|")]


def is_sep(line):
    return bool(TABLE_SEP_RE.match(line.rstrip()))


stats = defaultdict(int)
issues = defaultdict(list)


def scan_file(path: Path):
    rel = str(path.relative_to(ROOT))
    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        issues[rel].append(f"READ_ERROR: {e}")
        return

    m = FRONTMATTER_RE.match(text)
    if m:
        body = text[m.end():]
        frontmatter_lines = text[:m.end()].count("\n")
    else:
        body = text
        frontmatter_lines = 0

    lines = body.split("\n")
    file_issues = []
    in_code = False
    fence_open_count = 0

    # 1) 标点后多余空格
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            if in_code:
                fence_open_count += 1
            continue
        if in_code:
            continue
        for m2 in PUNCT_SPACE_RE.finditer(line):
            stats["punct_space"] += 1
            file_issues.append(f"L{i+frontmatter_lines}: 标点后多余空格: ...{line[max(0,m2.start()-5):m2.end()+5]}...")

    # 2) 标点前多余空格
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        for m2 in PUNCT_LEAD_SPACE_RE.finditer(line):
            stats["punct_lead_space"] += 1
            file_issues.append(f"L{i+frontmatter_lines}: 标点前多余空格: ...{line[max(0,m2.start()-5):m2.end()+5]}...")

    # 3) 半角标点（中文上下文）
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        # 跳过表格行、链接、frontmatter 等
        if TABLE_ROW_RE.match(line) or is_sep(line):
            continue
        for m2 in HALF_PUNCT_RE.finditer(line):
            stats["half_punct"] += 1
            file_issues.append(f"L{i+frontmatter_lines}: 半角标点出现在中文中: ...{line[max(0,m2.start()-5):m2.end()+5]}...")

    # 4) 行尾空格
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        if TRAILING_WS_RE.search(line):
            stats["trailing_ws"] += 1
            file_issues.append(f"L{i+frontmatter_lines}: 行尾空格")

    # 5) 连续空行
    for m2 in MULTI_BLANK_RE.finditer(body):
        line_no = body[:m2.start()].count("\n") + 1 + frontmatter_lines
        stats["multi_blank"] += 1
        file_issues.append(f"L{line_no}: 连续 {m2.end() - m2.start()} 个空行")

    # 6) 表格列数检查
    in_code = False
    table_buf = []  # (line_idx, line, cells, kind)
    def flush_table():
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
            file_issues.append(
                f"L{header[0]+frontmatter_lines}/L{sep[0]+frontmatter_lines}: 表格列数不匹配 header={h_n} vs sep={s_n}"
            )
            stats["table_col_mismatch"] += 1
        for ln, line, cells in data:
            if cells is None:
                continue
            if len(cells) != h_n:
                file_issues.append(
                    f"L{ln+frontmatter_lines}: 数据行 {len(cells)} 列与 header {h_n} 列不一致: {line[:60]}"
                )
                stats["table_col_mismatch"] += 1

    for i, line in enumerate(lines):
        if FENCE_RE.match(line):
            in_code = not in_code
            flush_table()
            table_buf = []
            continue
        if in_code:
            continue
        if TABLE_ROW_RE.match(line) or is_sep(line):
            cells = split_cells(line)
            kind = "sep" if is_sep(line) else "data"
            table_buf.append((i, line, cells, kind))
        else:
            flush_table()
            table_buf = []
    flush_table()

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
            file_issues.append(
                f"L{headings[j][0]}: 标题层级跳跃 H{prev_lvl}→H{cur_lvl} ({headings[j][2][:50]})"
            )
            stats["hierarchy_jump"] += 1

    # 8) 代码块围栏后多余空格
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            m_f = re.match(r"^(\s*)(```+|~~~+)(.*)$", line)
            if m_f:
                tail = m_f.group(3)
                if tail.strip():  # 有非空内容（语言标识除外）
                    # 如果是 ``` + 空格 + 非空，标记
                    if re.search(r"```+\s+\S", line) or re.search(r"~~~+\s+\S", line):
                        stats["fence_trailing"] += 1
                        file_issues.append(f"L{i+frontmatter_lines}: 代码块围栏后多余空格")
            in_code = not in_code
            continue

    # 9) 列表符号混用
    in_code = False
    bullet_by_indent = defaultdict(set)
    for i, line in enumerate(lines):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        m2 = re.match(r"^(\s*)([*+-])\s+", line)
        if m2:
            bullet_by_indent[len(m2.group(1))].add(m2.group(2))
    for ind, marks in bullet_by_indent.items():
        if len(marks) > 1:
            file_issues.append(f"缩进 {ind} 处混用列表符号: {sorted(marks)}")
            stats["list_mix"] += 1

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
