#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MDX 格式修复脚本 V5：修复 V5 扫描器发现的问题
- 文件末尾无换行
- 行中连续 2+ 空格（不在代码/链接/表格内）
- 标题层级跳跃
- 表格列数不匹配
- 之前的 V4 修复
"""
import re
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


def fix_punct_and_trailing(text):
    lines = text.split("\n")
    new_lines = []
    in_code = False
    for line in lines:
        if FENCE_RE.match(line):
            in_code = not in_code
            new_lines.append(line)
            continue
        if in_code:
            new_lines.append(line)
            continue
        # 行尾空格
        new_line = re.sub(r"[ \t]+$", "", line)
        if new_line != line:
            stats["trailing_ws"] += 1
        line = new_line
        # 标点后多余空格
        new_line = re.sub(
            r"([。，！？：；」』）】》])\s+(?=[\u4e00-\u9fffA-Za-z0-9。，！？：；])",
            r"\1", line,
        )
        if new_line != line:
            stats["punct_space"] += 1
        line = new_line
        new_lines.append(line)
    return "\n".join(new_lines)


def fix_multi_space(text):
    """行中连续 2+ 空格 → 1 个空格（不在代码/链接/表格内）"""
    lines = text.split("\n")
    new_lines = []
    in_code = False
    for line in lines:
        if FENCE_RE.match(line):
            in_code = not in_code
            new_lines.append(line)
            continue
        if in_code:
            new_lines.append(line)
            continue
        if TABLE_ROW_RE.match(line):
            new_lines.append(line)
            continue
        # 跳过引用块
        if line.lstrip().startswith(">"):
            new_lines.append(line)
            continue
        # 去除行中连续 2+ 空格（不在反引号内）
        new_line = ""
        in_backtick = False
        for j, ch in enumerate(line):
            if ch == "`":
                in_backtick = not in_backtick
            if not in_backtick and ch == " " and j > 0 and line[j-1] == " ":
                # 跳过连续空格
                continue
            new_line += ch
        if new_line != line:
            stats["multi_space"] += 1
        new_lines.append(new_line)
    return "\n".join(new_lines)


def fix_trailing_newline(text):
    if not text.endswith("\n"):
        stats["no_trailing_newline"] += 1
        return text + "\n"
    return text


def fix_blank_lines(text):
    new_text = re.sub(r"\n{3,}", "\n\n", text)
    if new_text != text:
        stats["multi_blank"] += 1
    return new_text


def fix_headings(text):
    lines = text.split("\n")
    new_lines = []
    in_code = False
    last_h = 0
    for line in lines:
        if FENCE_RE.match(line):
            in_code = not in_code
            new_lines.append(line)
            continue
        if in_code:
            new_lines.append(line)
            continue
        m_h = re.match(r"^(#+)\s", line)
        if m_h:
            cur = len(m_h.group(1))
            if last_h > 0 and cur > last_h + 1:
                new_lvl = last_h + 1
                if new_lvl <= 6:
                    line = "#" * new_lvl + line[len(m_h.group(1)):]
                    stats["heading_jump"] += 1
            last_h = len(re.match(r"^(#+)", line).group(1))
        new_lines.append(line)
    return "\n".join(new_lines)


def split_cells(line):
    s = line.rstrip()
    if not s.startswith("|"):
        return None
    if not s.endswith("|"):
        s += "|"
    inner = s[1:-1]
    return [c.strip() for c in inner.split("|")]


def is_sep(line):
    return bool(TABLE_SEP_RE.match(line.rstrip()))


def fix_tables(text):
    lines = text.split("\n")
    new_lines = []
    i = 0
    in_code = False
    while i < len(lines):
        line = lines[i]
        if FENCE_RE.match(line):
            in_code = not in_code
            new_lines.append(line)
            i += 1
            continue
        if in_code:
            new_lines.append(line)
            i += 1
            continue
        if TABLE_ROW_RE.match(line) or is_sep(line):
            table_buf = [(i, line)]
            j = i + 1
            while j < len(lines) and (TABLE_ROW_RE.match(lines[j]) or is_sep(lines[j])):
                table_buf.append((j, lines[j]))
                j += 1
            fixed = _fix_table(table_buf)
            new_lines.extend(fixed)
            i = j
            continue
        new_lines.append(line)
        i += 1
    return "\n".join(new_lines)


def _fix_table(rows):
    if len(rows) < 2:
        return [r[1] for r in rows]
    header = None
    sep = None
    data = []
    for ln, line in rows:
        if is_sep(line):
            sep = (ln, line)
        elif header is None:
            header = (ln, line)
        else:
            data.append((ln, line))
    if not header or not sep:
        return [r[1] for r in rows]
    h_cells = split_cells(header[1])
    s_cells = split_cells(sep[1])
    if h_cells is None or s_cells is None:
        return [r[1] for r in rows]
    h_n = len(h_cells)
    s_n = len(s_cells)
    target = max(h_n, s_n)
    if h_n != target:
        header = (header[0], "| " + " | ".join(h_cells + [" "] * (target - h_n)) + " |")
    if s_n != target:
        sep = (sep[0], "| " + " | ".join(["---"] * target) + " |")
    fixed = [header[1], sep[1]]
    for ln, line in data:
        cells = split_cells(line)
        if cells is None:
            fixed.append(line)
            continue
        n = len(cells)
        if n == target:
            fixed.append(line)
        elif n < target:
            new_cells = cells + [" "] * (target - n)
            fixed.append("| " + " | ".join(new_cells) + " |")
            stats["table_pad"] += 1
        elif n == target + 1 and cells[0] and cells[1]:
            merged = cells[0] + cells[1]
            new_cells = [merged] + cells[2:]
            fixed.append("| " + " | ".join(new_cells) + " |")
            stats["table_merge"] += 1
        else:
            fixed.append(line)
            stats["table_unfixed"] += 1
    return fixed


def fix_file(path: Path):
    try:
        raw = path.read_bytes()
        text = raw.decode("utf-8")
    except Exception:
        return False
    original = text
    text = fix_punct_and_trailing(text)
    text = fix_multi_space(text)
    text = fix_blank_lines(text)
    text = fix_headings(text)
    text = fix_tables(text)
    text = fix_trailing_newline(text)
    if text != original:
        path.write_text(text, encoding="utf-8")
        stats["files_changed"] += 1
        return True
    return False


def main():
    files = list(DOCS.rglob("*.mdx")) + list(DOCS.rglob("*.md"))
    for f in files:
        fix_file(f)
    print("=== Stats ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()
