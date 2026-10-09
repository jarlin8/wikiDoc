#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MDX 格式修复脚本 V3：处理 V3 扫描器发现的所有问题
- 标点后多余空格（含 frontmatter）
- 中文后半角冒号 / 逗号 / 分号 → 全角
- **English:** → **English：**
- 表格列数不匹配
- 孤立图片说明 → 改为斜体
- 行尾空格
- 连续空行
- 标题层级
- 列表符号
- 代码块围栏后多余空格
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


def fix_file(path: Path):
    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        return False
    original = text

    # 拆分 frontmatter
    m = FRONTMATTER_RE.match(text)
    if m:
        front = text[:m.end()]
        body = text[m.end():]
    else:
        front = ""
        body = text

    lines = body.split("\n")

    # 阶段 1: 行级处理（标点空格、半角标点、行尾空格、围栏空格、English冒号、孤立说明）
    new_lines = []
    in_code = False
    prev_was_image = False
    for line in lines:
        if FENCE_RE.match(line):
            in_code = not in_code
            # 围栏多余空格
            m_f = FENCE_RE.match(line)
            tail = m_f.group(3)
            if tail and tail.strip() == "" and tail != "":
                line = m_f.group(1) + m_f.group(2)
                stats["fence_trailing"] += 1
            new_lines.append(line)
            prev_was_image = IMG_RE.match(line.strip()) is not None
            continue
        if in_code:
            new_lines.append(line)
            prev_was_image = False
            continue
        # 行尾空格
        new_line = re.sub(r"[ \t]+$", "", line)
        if new_line != line:
            stats["trailing_ws"] += 1
        line = new_line

        # 标点后多余空格
        new_line = re.sub(
            r"([。，！？：；」』）】》])\s+(?=[\u4e00-\u9fffA-Za-z0-9。，！？：；])",
            r"\1",
            line,
        )
        if new_line != line:
            stats["punct_space"] += 1
        line = new_line

        # 标点前多余空格
        new_line = re.sub(r"\s+([。，！？：；」』）】》])", r"\1", line)
        if new_line != line:
            stats["punct_lead_space"] += 1
        line = new_line

        # 表格行不处理半角标点
        if TABLE_ROW_RE.match(line) or is_sep(line):
            new_lines.append(line)
            prev_was_image = False
            continue

        # **English:** → **English：**
        new_line = re.sub(r"\*\*([A-Za-z][A-Za-z0-9]*):\*\*", r"**\1：**", line)
        if new_line != line:
            stats["english_bold_half_colon"] += 1
        line = new_line

        # 中文后半角逗号 / 分号
        new_line = re.sub(r"([\u4e00-\u9fff]{2,}),(?=[\u4e00-\u9fff])", r"\1，", line)
        if new_line != line:
            stats["half_punct_comma"] += 1
        line = new_line
        new_line = re.sub(r"([\u4e00-\u9fff]{2,});(?=[\u4e00-\u9fff])", r"\1；", line)
        if new_line != line:
            stats["half_punct_semicolon"] += 1
        line = new_line

        # 中文后半角冒号（不在 URL/时间中）
        new_line = re.sub(r"([\u4e00-\u9fff]):(?!//)(?!\d)(?!\w)", r"\1：", line)
        if new_line != line:
            stats["half_punct_colon"] += 1
        line = new_line

        # 孤立图片说明
        if prev_was_image:
            stripped = line.strip()
            if stripped and not stripped.startswith(("-", "*", ">", "#", "|", "`", "!", "<")) and len(stripped) <= 30 and stripped.endswith("。"):
                if not (stripped.startswith("*") or stripped.startswith("**")):
                    line = "*" + stripped + "*" if not stripped.startswith("*") else line
                    if "*" in line and line.strip().endswith("。*"):
                        stats["orphan_caption"] += 1
        prev_was_image = False
        new_lines.append(line)

    body = "\n".join(new_lines)

    # 阶段 2: 折叠连续空行
    new_body = re.sub(r"\n{3,}", "\n\n", body)
    if new_body != body:
        stats["multi_blank"] += 1
    body = new_body

    # 阶段 3: 标题层级
    lines = body.split("\n")
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
    body = "\n".join(new_lines)

    # 阶段 4: 列表符号
    lines = body.split("\n")
    bullet_by_indent = defaultdict(set)
    in_code = False
    for line in lines:
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        m_b = re.match(r"^(\s*)([*+-])\s+", line)
        if m_b and len(m_b.group(1)) == 0:
            bullet_by_indent[0].add(m_b.group(2))
    if len(bullet_by_indent.get(0, set())) > 1:
        new_lines = []
        for line in lines:
            m_b = re.match(r"^(\s*)([*])(\s+)", line)
            if m_b and len(m_b.group(1)) == 0:
                line = m_b.group(1) + "-" + m_b.group(3) + line[len(m_b.group(0)):]
                stats["list_mix"] += 1
            new_lines.append(line)
        body = "\n".join(new_lines)

    # 阶段 5: 表格修复
    lines = body.split("\n")
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
            fixed = fix_table(table_buf)
            new_lines.extend(fixed)
            i = j
            continue
        new_lines.append(line)
        i += 1
    body = "\n".join(new_lines)

    new_text = front + body
    if new_text != original:
        path.write_text(new_text, encoding="utf-8")
        stats["files_changed"] += 1
        return True
    return False


def fix_table(rows):
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


def main():
    files = list(DOCS.rglob("*.mdx")) + list(DOCS.rglob("*.md"))
    for f in files:
        fix_file(f)
    print("=== Stats ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()
