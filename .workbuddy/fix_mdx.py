#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MDX 格式修复脚本：处理可安全自动修复的格式问题
- 去除行尾空格
- 折叠连续空行（3+ → 2）
- 修复标题层级跳跃（H2→H4 → H2→H3）
- 统一列表符号（缩进 0 处 * / - 混用 → -）
- 修复表格内多余 | 分隔符导致的伪多列
"""
import re
import sys
from pathlib import Path
from collections import defaultdict

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.DOTALL)
TABLE_ROW_RE = re.compile(r"^\s*\|.*\|\s*$")
TABLE_SEP_RE = re.compile(r"^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$")
FENCE_RE = re.compile(r"^(\s*)(```+|~~~+)(.*)$")

stats = defaultdict(int)
fixes = []  # (file, line_no, description)


def split_cells(line):
    s = line.strip()
    if not s.startswith("|") or not s.endswith("|"):
        return None
    inner = s[1:-1]
    return [c.strip() for c in inner.split("|")]


def is_sep(line):
    return bool(TABLE_SEP_RE.match(line))


def fix_file(path: Path):
    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"READ_ERR {path}: {e}")
        return False
    original = text

    # 1) 拆分 frontmatter
    m = FRONTMATTER_RE.match(text)
    if m:
        front = text[:m.end()]
        body = text[m.end():]
    else:
        front = ""
        body = text

    lines = body.split("\n")
    new_lines = []
    in_code = False

    # 2) 修标题层级跳跃（仅在 H2 后直接 H4 缺 H3）
    # 收集 heading 序列
    headings = []  # (idx, level)
    for i, line in enumerate(lines):
        if FENCE_RE.match(line):
            in_code = not in_code
            new_lines.append(line)
            continue
        if in_code:
            new_lines.append(line)
            continue
        new_lines.append(line)

    # 重新分词（上面 new_lines 已是 lines 的复制）
    # 标题跳跃修复：扫 H 标记，若上一 H 是 L 且当前是 L+2，则把当前降一级
    in_code = False
    final_lines = []
    last_h_level = 0
    for line in new_lines:
        if FENCE_RE.match(line):
            in_code = not in_code
            final_lines.append(line)
            continue
        if in_code:
            final_lines.append(line)
            continue
        m_h = re.match(r"^(#+)\s", line)
        if m_h:
            cur_lvl = len(m_h.group(1))
            if last_h_level > 0 and cur_lvl > last_h_level + 1:
                # 跳跃，降为 last_h_level + 1
                new_lvl = last_h_level + 1
                # 仅当 new_lvl <= 6 才有意义
                if new_lvl <= 6:
                    new_line = "#" * new_lvl + line[len(m_h.group(1)):]
                    final_lines.append(new_line)
                    stats["heading_jump_fixed"] += 1
                    fixes.append((str(path.relative_to(ROOT)), cur_lvl, new_lvl, line.strip()[:60]))
                    last_h_level = new_lvl
                    continue
            last_h_level = cur_lvl
            final_lines.append(line)
        else:
            final_lines.append(line)

    # 3) 列表符号统一（缩进 0 处 * / - 混用 → -）
    in_code = False
    norm_lines = []
    bullet_by_indent = defaultdict(set)
    for line in final_lines:
        if FENCE_RE.match(line):
            in_code = not in_code
            norm_lines.append(line)
            continue
        if in_code:
            norm_lines.append(line)
            continue
        m_b = re.match(r"^(\s*)([*+-])\s+", line)
        if m_b and len(m_b.group(1)) == 0:
            bullet_by_indent[0].add(m_b.group(2))
            norm_lines.append(line)
        else:
            norm_lines.append(line)
    if len(bullet_by_indent.get(0, set())) > 1:
        # 统一为 -
        new_norm = []
        for line in norm_lines:
            m_b = re.match(r"^(\s*)([*])(\s+)", line)
            if m_b and len(m_b.group(1)) == 0:
                new_line = m_b.group(1) + "-" + m_b.group(3) + line[len(m_b.group(0)):]
                new_norm.append(new_line)
                stats["list_mix_fixed"] += 1
            else:
                new_norm.append(line)
        norm_lines = new_norm

    # 4) 去除行尾空格（不影响代码块内）
    in_code = False
    out_lines = []
    for line in norm_lines:
        if FENCE_RE.match(line):
            in_code = not in_code
            out_lines.append(line)
            continue
        if in_code:
            out_lines.append(line)
            continue
        new_line = re.sub(r"[ \t]+$", "", line)
        if new_line != line:
            stats["trailing_ws_fixed"] += 1
        out_lines.append(new_line)

    # 5) 折叠连续空行（3+ → 2）
    new_body = "\n".join(out_lines)
    new_body = re.sub(r"\n{3,}", "\n\n", new_body)
    # 重新切分处理后续步骤
    out_lines = new_body.split("\n")

    # 6) 表格修复：若 header 是 2 列而某数据行是 3 列，且第 2 列是短标签
    # 模式：第 1 列是"Xxx|" 形式且第 2 列也是"短标签"（不含换行/数字），合并第 1 和第 2 列
    in_code = False
    in_table = False
    table_buf = []  # list of (line_idx, line)
    final_out = []
    i = 0
    while i < len(out_lines):
        line = out_lines[i]
        if FENCE_RE.match(line):
            in_code = not in_code
            if table_buf:
                final_out.extend(process_table_block(table_buf, path))
                table_buf = []
            final_out.append(line)
            i += 1
            continue
        if in_code:
            final_out.append(line)
            i += 1
            continue
        if TABLE_ROW_RE.match(line):
            table_buf.append((i, line))
        else:
            if table_buf:
                final_out.extend(process_table_block(table_buf, path))
                table_buf = []
            final_out.append(line)
        i += 1
    if table_buf:
        final_out.extend(process_table_block(table_buf, path))

    new_body = "\n".join(final_out)
    new_text = front + new_body

    if new_text != original:
        path.write_text(new_text, encoding="utf-8")
        stats["files_changed"] += 1
        return True
    return False


def process_table_block(rows, path):
    """尝试修复一张表格中的列数不匹配问题"""
    if len(rows) < 2:
        return [r[1] for r in rows]

    # 找 header 和 sep
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
    if len(h_cells) != len(s_cells):
        return [r[1] for r in rows]  # 不可救

    fixed = [(header[0], header[1]), (sep[0], sep[1])]
    for ln, line in data:
        cells = split_cells(line)
        if cells is None or len(cells) == len(h_cells):
            fixed.append((ln, line))
            continue
        if len(cells) > len(h_cells):
            # 尝试合并前几列直到匹配
            need = len(h_cells)
            extra = len(cells) - need
            # 启发式：把多余的 | 移除——只在 cells[0] 末尾无值且 cells[1] 是短标签时合并
            # 简单做法：当 cells[0] 非空且 cells[1] 非空且 cells 多了 N 个时，
            # 把 cells[0] + cells[1] 合并为一个 cell（用 " " 分隔），然后取后续 cells
            if extra == 1 and cells[0] and cells[1]:
                merged = cells[0] + cells[1]
                new_cells = [merged] + cells[2:]
                if len(new_cells) == need:
                    new_line = "| " + " | ".join(new_cells) + " |"
                    fixed.append((ln, new_line))
                    stats["table_extra_pipe_merged"] += 1
                    fixes.append((str(path.relative_to(ROOT)), ln, "表格多余 | 合并"))
                    continue
        fixed.append((ln, line))
    return [r[1] for r in rows]  # placeholder, replaced below

# rewrite process_table_block to actually return fixed lines
def process_table_block(rows, path):
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
    if len(h_cells) != len(s_cells):
        return [r[1] for r in rows]
    fixed = [(header[0], header[1]), (sep[0], sep[1])]
    for ln, line in data:
        cells = split_cells(line)
        if cells is None or len(cells) == len(h_cells):
            fixed.append((ln, line))
            continue
        if len(cells) == len(h_cells) + 1 and cells[0] and cells[1]:
            merged = cells[0] + cells[1]
            new_cells = [merged] + cells[2:]
            new_line = "| " + " | ".join(new_cells) + " |"
            fixed.append((ln, new_line))
            stats["table_extra_pipe_merged"] += 1
            fixes.append((str(path.relative_to(ROOT)), ln, "表格多余 | 合并"))
            continue
        fixed.append((ln, line))
    return [r[1] for r in fixed]


def main():
    files = list(DOCS.rglob("*.mdx")) + list(DOCS.rglob("*.md"))
    for f in files:
        fix_file(f)
    print("=== Stats ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    print()
    print(f"=== Sample fixes (first 20) ===")
    for f in fixes[:20]:
        print(f"  {f}")


if __name__ == "__main__":
    main()
