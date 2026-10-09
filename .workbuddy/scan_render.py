#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MDX 渲染阻断检查器：找出真正导致"无法渲染"的语法问题
核心规则（CommonMark/GFM）：
1. 表格 H 前必须有空行 —— 表格不能中断段落
2. 表格后必须有空行 —— 否则后续内容并入表格
3. 围栏代码块 ``` 前通常需要空行
4. frontmatter 后需要空行
5. 列表前需要有空行（有序/无序都可能无法中断段落）
6. HTML 块的前后
7. 表格分隔行必须与表头列数一致
8. 表格内不能有裸的未转义 |
"""
import os
import re
import json
from pathlib import Path
from collections import defaultdict

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"

FRONTMATTER_RE = re.compile(r"^---\n.*?\n---\n", re.DOTALL)
FENCE_RE = re.compile(r"^(\s{0,3})(```+|~~~+)")
TABLE_ROW_RE = re.compile(r"^\s*\|.*$")
TABLE_SEP_RE = re.compile(r"^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$")

stats = defaultdict(int)
issues = defaultdict(list)
examples = defaultdict(list)


def split_cells(line):
    s = line.strip()
    if not s.startswith("|"):
        return None
    # 去掉首尾 |
    if s.endswith("|"):
        s = s[1:-1]
    else:
        s = s[1:]
    return [c.strip() for c in s.split("|")]


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
        fm_lines = text[:m.end()].count("\n")
    else:
        body = text
        fm_lines = 0

    # 统一换行（文件可能是 CRLF）
    body = body.replace("\r\n", "\n").replace("\r", "\n")
    lines = body.split("\n")
    file_issues = []

    def emit(ln, msg, ex=None):
        file_issues.append(f"L{ln}: {msg}")
        if ex is not None and len(examples[msg.split(':')[0]]) < 3:
            examples[msg.split(':')[0]].append((rel, ln, ex))

    in_code = False

    # --- 1. 表格前必须有空行 ---
    for i, line in enumerate(lines):
        is_table_row = bool(TABLE_ROW_RE.match(line)) and "|" in line
        # 判断是否是表格起始行（前一行不是表格行）
        prev_is_table = i > 0 and bool(TABLE_ROW_RE.match(lines[i-1])) and "|" in lines[i-1]
        if is_table_row and not prev_is_table:
            # 这是表格第一行
            if i > 0:
                prev = lines[i-1]
                if prev.strip() != "" and not prev.strip().startswith("<"):
                    # 前一行非空 → 表格无法被识别！
                    emit(i+1+fm_lines, "表格前缺空行（无法渲染成表格）", prev.strip()[:50])
                    stats["table_no_blank_before"] += 1
            else:
                pass

    # --- 2. 表格后必须有空行 ---
    for i, line in enumerate(lines):
        is_table_row = bool(TABLE_ROW_RE.match(line)) and "|" in line
        next_is_table = i + 1 < len(lines) and bool(TABLE_ROW_RE.match(lines[i+1])) and "|" in lines[i+1]
        if is_table_row and not next_is_table:
            # 这是表格最后一行
            if i + 1 < len(lines):
                nxt = lines[i+1]
                if nxt.strip() != "" and not nxt.strip().startswith(("|", "<")):
                    emit(i+2+fm_lines, "表格后缺空行（后续内容并入表格）", nxt.strip()[:50])
                    stats["table_no_blank_after"] += 1

    # --- 3. 表格列数一致性（严格：分隔行决定列数）---
    in_code = False
    i = 0
    while i < len(lines):
        line = lines[i]
        if FENCE_RE.match(line):
            in_code = not in_code
            i += 1
            continue
        if in_code:
            i += 1
            continue
        if TABLE_ROW_RE.match(line) and "|" in line:
            # 收集表格块
            start = i
            rows = []
            while i < len(lines) and TABLE_ROW_RE.match(lines[i]) and "|" in lines[i]:
                rows.append((i, lines[i]))
                i += 1
            # 分析
            if len(rows) < 2:
                stats["table_too_few_rows"] += 1
                emit(start+1+fm_lines, f"表格只有 {len(rows)} 行（至少需要表头+分隔行）")
                continue
            header = rows[0]
            sep = rows[1]
            h_cells = split_cells(header[1])
            s_cells = split_cells(sep[1])
            if h_cells is None or s_cells is None:
                continue
            # 分隔行是否合法
            if not TABLE_SEP_RE.match(sep[1]):
                emit(sep[0]+1+fm_lines, "表格第 2 行不是合法分隔行", sep[1][:60])
                stats["table_bad_sep"] += 1
            h_n = len(h_cells)
            s_n = len(s_cells)
            if h_n != s_n:
                emit(header[0]+1+fm_lines,
                     f"表头 {h_n} 列 vs 分隔行 {s_n} 列不一致（表格渲染错位）",
                     header[1][:60])
                stats["table_header_sep_mismatch"] += 1
            for ln, r in rows[2:]:
                c = split_cells(r)
                if c is not None and len(c) != h_n:
                    emit(ln+1+fm_lines,
                         f"数据行 {len(c)} 列 vs 表头 {h_n} 列（错位）",
                         r[:60])
                    stats["table_data_mismatch"] += 1
            continue
        i += 1

    # --- 4. 围栏代码块前必须有空行 ---
    in_code = False
    for i, line in enumerate(lines):
        m_f = FENCE_RE.match(line)
        if m_f:
            if not in_code:
                # 开始围栏
                if i > 0:
                    prev = lines[i-1]
                    if prev.strip() != "":
                        emit(i+1+fm_lines, "代码块起始 ``` 前缺空行", prev.strip()[:50])
                        stats["fence_no_blank_before"] += 1
            in_code = not in_code
            continue

    # --- 5. frontmatter 后必须有空行 ---
    if m and len(lines) > 0 and lines[0].strip() != "":
        # lines[0] 是 frontmatter 后的第一行
        emit(1+fm_lines, "frontmatter 后缺空行", lines[0].strip()[:50])
        stats["fm_no_blank"] += 1

    if file_issues:
        issues[rel] = file_issues


def main():
    files = list(DOCS.rglob("*.mdx")) + list(DOCS.rglob("*.md"))
    for f in files:
        scan_file(f)
    out = {"stats": dict(stats), "files": dict(issues), "examples": {k: v for k, v in examples.items()}}
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
