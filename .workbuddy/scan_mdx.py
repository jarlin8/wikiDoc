#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MDX/Markdown 格式扫描器：检测渲染错误与阅读体验问题
仅扫描，不修改。输出 JSON 报告。
"""
import os
import re
import sys
import json
from pathlib import Path
from collections import defaultdict

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"

# 跳过 frontmatter 的正则
FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.DOTALL)
# 代码块 fence
FENCE_RE = re.compile(r"^(\s*)(```+|~~~+)(.*)$")
# 链接/图片语法
LINK_RE = re.compile(r"(!?)\[([^\]]*)\]\(([^)]*)\)")
# 中文字符范围
CN_RE = re.compile(r"[\u4e00-\u9fff]")
# 中文标点
CN_PUNCT_RE = re.compile(r"[。，！？：；、）】》」』]")
# 半角标点
EN_PUNCT_RE = re.compile(r"[,.;:?!()\[\]\"']")
# 标点后多余的空格
PUNCT_SPACE_RE = re.compile(r"([。，！？：；」』）】》])\s{2,}([\u4e00-\u9fffA-Za-z0-9])")
# 中文字符前多余的半角空格
CN_LEAD_SPACE_RE = re.compile(r"\s([\u4e00-\u9fff])")
# 整行尾随空格
TRAILING_WS_RE = re.compile(r"[ \t]+$")
# 连续空行（3+）
MULTI_BLANK_RE = re.compile(r"\n{3,}")
# 表格行
TABLE_ROW_RE = re.compile(r"^\s*\|.*\|\s*$")
TABLE_SEP_RE = re.compile(r"^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$")

issues = defaultdict(list)
stats = {
    "files_scanned": 0,
    "files_with_issues": 0,
    "table_col_mismatch": 0,
    "punct_space": 0,
    "trailing_ws": 0,
    "multi_blank": 0,
    "cn_lead_space": 0,
    "hierarchy_jump": 0,
    "unclosed_fence": 0,
    "unclosed_bracket": 0,
    "list_mix": 0,
    "list_indent_inconsistent": 0,
}


def split_table_row(line):
    """拆分 Markdown 表格行，返回单元格列表（去前导/尾部空单元格如果由 | 包围）"""
    s = line.strip()
    if not s.startswith("|") or not s.endswith("|"):
        return None
    inner = s[1:-1]
    # 简单按 | 拆分（不处理转义，文档里没有）
    return [c.strip() for c in inner.split("|")]


def is_separator_row(line):
    return bool(TABLE_SEP_RE.match(line))


def scan_file(path: Path):
    rel = str(path.relative_to(ROOT))
    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        issues[rel].append(f"[READ_ERROR] {e}")
        return

    # 去掉 frontmatter
    body = text
    m = FRONTMATTER_RE.match(text)
    if m:
        body = text[m.end():]

    lines = body.split("\n")
    file_issues = []

    # 1) 表格列数检查
    in_table = False
    table_rows = []  # [(line_no, cells, kind)]
    for i, line in enumerate(lines, 1):
        if TABLE_ROW_RE.match(line):
            cells = split_table_row(line)
            kind = "sep" if is_separator_row(line) else "data"
            table_rows.append((i, cells, kind))
            in_table = True
        else:
            if in_table and table_rows:
                # 结算上一张表
                analyze_table(rel, table_rows, file_issues)
                table_rows = []
            in_table = False
    if table_rows:
        analyze_table(rel, table_rows, file_issues)

    # 2) 标点后多余空格
    for i, line in enumerate(lines, 1):
        for m2 in PUNCT_SPACE_RE.finditer(line):
            file_issues.append(f"L{i}: 标点后多余空格: ...{line[max(0,m2.start()-10):m2.end()+10]}...")
            stats["punct_space"] += 1

    # 3) 行尾空格
    for i, line in enumerate(lines, 1):
        if TRAILING_WS_RE.search(line):
            file_issues.append(f"L{i}: 行尾空格")
            stats["trailing_ws"] += 1

    # 4) 连续空行
    for m2 in MULTI_BLANK_RE.finditer(body):
        line_no = body[:m2.start()].count("\n") + 1
        file_issues.append(f"L{line_no}: 连续 {m2.end() - m2.start()} 个空行")
        stats["multi_blank"] += 1

    # 5) 中文字符前多余空格（仅在行首或行中段，跳过代码块内）
    # 简单实现：行首空白后直接是中文字符，或者中文字符前面是半角空格
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        # 跳过 frontmatter 等元数据
        if line.startswith("{") or line.startswith("import "):
            continue
        # 匹配 中文 前的空格（行内，排除首行缩进场景的连续 2+ 空格）
        for m2 in re.finditer(r" {2,}([\u4e00-\u9fff])", line):
            file_issues.append(f"L{i}: 中文字符前多余空格: {line.strip()[:60]}")
            stats["cn_lead_space"] += 1

    # 6) 标题层级跳跃
    headings = []
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        m2 = re.match(r"^(#+)\s", line)
        if m2:
            headings.append((i, len(m2.group(1)), line.strip()))
    for j in range(1, len(headings)):
        prev_lvl = headings[j-1][1]
        cur_lvl = headings[j][1]
        if cur_lvl > prev_lvl + 1:
            file_issues.append(
                f"L{headings[j][0]}: 标题层级跳跃 H{prev_lvl}→H{cur_lvl} ({headings[j][2]})"
            )
            stats["hierarchy_jump"] += 1

    # 7) 未闭合的代码块
    fence_count = 0
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            fence_count += 1
    if fence_count % 2 != 0:
        file_issues.append(f"未闭合的代码块（fence 数 = {fence_count}，奇数）")
        stats["unclosed_fence"] += 1

    # 8) 未闭合的方括号/圆括号（仅扫描 link/image 语法）
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        # 找 [ 但没找到对应 ] 配对（粗略：数 ] [）
        ob = line.count("[")
        cb = line.count("]")
        if ob != cb:
            file_issues.append(f"L{i}: 方括号不匹配: [={ob} ]={cb}")
            stats["unclosed_bracket"] += 1
        op = line.count("(")
        cp = line.count(")")
        # 排除 inline code 内的括号干扰（粗略）
        if abs(op - cp) > 1:
            file_issues.append(f"L{i}: 圆括号不匹配: (={op} )={cp}")
            stats["unclosed_bracket"] += 1

    # 9) 列表符号混用（同一文件内出现 - 和 * 作为无序列表，且距离很近）
    bullet_marks = []  # [(line_no, mark, indent)]
    in_code = False
    for i, line in enumerate(lines, 1):
        if FENCE_RE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        m2 = re.match(r"^(\s*)([-*+])\s+", line)
        if m2:
            bullet_marks.append((i, m2.group(2), len(m2.group(1))))
    # 同一缩进级别上有不同符号
    by_indent = defaultdict(set)
    for ln, mark, ind in bullet_marks:
        by_indent[ind].add(mark)
    for ind, marks in by_indent.items():
        if len(marks) > 1:
            file_issues.append(f"缩进 {ind} 处混用列表符号: {sorted(marks)}")
            stats["list_mix"] += 1

    if file_issues:
        issues[rel] = file_issues
        stats["files_with_issues"] += 1

    stats["files_scanned"] += 1


def analyze_table(rel, table_rows, file_issues):
    """分析一张表格的列数一致性"""
    if len(table_rows) < 2:
        return
    # 第一个非 sep 行就是 header
    header = None
    sep = None
    data_rows = []
    for ln, cells, kind in table_rows:
        if kind == "sep":
            sep = (ln, cells)
        elif header is None:
            header = (ln, cells)
        else:
            data_rows.append((ln, cells))
    if not header or not sep:
        return
    h_cells = header[1]
    s_cells = sep[1]
    if h_cells is None or s_cells is None:
        return
    if len(h_cells) != len(s_cells):
        file_issues.append(
            f"L{header[0]}/{sep[0]}: 表格列数不匹配 header={len(h_cells)} vs sep={len(s_cells)}"
        )
        stats["table_col_mismatch"] += 1
    for ln, cells in data_rows:
        if cells is None:
            continue
        if len(cells) != len(h_cells):
            file_issues.append(
                f"L{ln}: 数据行列数 {len(cells)} 与 header 列数 {len(h_cells)} 不一致"
            )
            stats["table_col_mismatch"] += 1


def main():
    files = list(DOCS.rglob("*.mdx")) + list(DOCS.rglob("*.md"))
    for f in files:
        scan_file(f)
    # 输出
    out = {"stats": stats, "files": dict(issues)}
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
