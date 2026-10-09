#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MDX 格式修复脚本 V2：修复 V2 扫描器发现的所有问题
- 标点后多余空格（1+ 空格）→ 删除
- 标点前多余空格 → 删除
- 半角标点（中文上下文）→ 转为全角
- 代码块围栏后多余空格 → 删除
- 表格列数不匹配（更激进的修复）
- 行尾空格 → 删除
- 连续空行 → 折叠
- 标题层级跳跃 → 降级
- 列表符号统一
"""
import re
import sys
from pathlib import Path
from collections import defaultdict

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"

FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.DOTALL)
FENCE_RE = re.compile(r"^(\s*)(```+|~~~+)(.*)$")
TABLE_ROW_RE = re.compile(r"^\s*\|.*\|\s*$")
TABLE_SEP_RE = re.compile(r"^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$")

stats = defaultdict(int)


def split_cells(line):
    s = line.rstrip()
    if not s.startswith("|"):
        return None
    if not s.endswith("|"):
        s = s + "|"
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

    # 阶段 1: 处理每行（标点空格、半角标点、行尾空格、围栏空格）
    # 注意：保留代码块内的原样
    new_lines = []
    in_code = False
    for line in lines:
        if FENCE_RE.match(line):
            in_code = not in_code
            # 围栏后多余空格：```+ 空格 → ```
            m_f = FENCE_RE.match(line)
            tail = m_f.group(3)
            # 仅当 tail 全是空白时才删，否则保留语言标识
            if tail and tail.strip() == "":
                line = m_f.group(1) + m_f.group(2) + tail.rstrip()
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

        # 标点后多余空格：中文标点后跟 1+ 空格 → 删除空格
        # 但要保留 URL、代码、特殊场景
        # 模式：标点 + 空格 + (中文/英文/数字/中文标点)
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

        # 半角标点（中文上下文）
        # 跳过表格行、链接文本、URL
        if TABLE_ROW_RE.match(line) or is_sep(line):
            new_lines.append(line)
            continue
        # 检测：2+ 中文字符后跟半角 ,;: （不接数字）
        # 替换为全角
        new_line = re.sub(
            r"([\u4e00-\u9fff]{2,}),(?=[\u4e00-\u9fff])",
            r"\1，",
            line,
        )
        new_line = re.sub(
            r"([\u4e00-\u9fff]{2,});(?=[\u4e00-\u9fff])",
            r"\1；",
            new_line,
        )
        # 冒号：中文后跟半角 : （不接 // 或数字）→ 全角
        # 排除 URL（http://, https://, ftp://）和时间
        new_line = re.sub(
            r"([\u4e00-\u9fff]):(?!\d)(?!//)(?!\w)",
            r"\1：",
            new_line,
        )
        if new_line != line:
            stats["half_punct"] += 1
        line = new_line

        new_lines.append(line)

    body = "\n".join(new_lines)

    # 阶段 2: 折叠连续空行
    new_body = re.sub(r"\n{3,}", "\n\n", body)
    if new_body != body:
        stats["multi_blank"] += max(0, body.count("\n\n\n") - new_body.count("\n\n\n"))
    body = new_body

    # 阶段 3: 标题层级跳跃
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
            last_h = len(re.match(r"^(#+)", line).group(1)) if re.match(r"^(#+)", line) else 0
        new_lines.append(line)
    body = "\n".join(new_lines)

    # 阶段 4: 列表符号统一
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
            if FENCE_RE.match(line):
                new_lines.append(line)
                continue
            m_b = re.match(r"^(\s*)([*])(\s+)", line)
            if m_b and len(m_b.group(1)) == 0:
                line = m_b.group(1) + "-" + m_b.group(3) + line[len(m_b.group(0)):]
                stats["list_mix"] += 1
            new_lines.append(line)
        body = "\n".join(new_lines)

    # 阶段 5: 表格修复（更激进：尝试合并多余 | 和补空列）
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
            # 收集整张表
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
    """修复表格：列数匹配、补空列、合并多余 |"""
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

    # 如果 header 和 sep 列数不一致：取较大者，把小的补空列
    target = max(h_n, s_n)
    if h_n != target:
        new_h = "| " + " | ".join(h_cells + [" "] * (target - h_n)) + " |"
        header = (header[0], new_h)
    if s_n != target:
        new_s = "| " + " | ".join(["---"] * target) + " |"
        sep = (sep[0], new_s)
        s_n = target
        s_cells = ["---"] * target

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
            # 补空列
            new_cells = cells + [" "] * (target - n)
            new_line = "| " + " | ".join(new_cells) + " |"
            fixed.append(new_line)
            stats["table_pad"] += 1
        elif n == target + 1 and cells[0] and cells[1]:
            # 多 1 列：合并前两列
            merged = cells[0] + cells[1]
            new_cells = [merged] + cells[2:]
            new_line = "| " + " | ".join(new_cells) + " |"
            fixed.append(new_line)
            stats["table_merge"] += 1
        else:
            # 多 N 列但模式复杂，保留原样
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
