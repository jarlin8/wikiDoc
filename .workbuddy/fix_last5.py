#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复最后 5 处表格列数不一致"""
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")


def load(p):
    return p.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")


def save(p, text):
    p.write_bytes(text.replace("\n", "\r\n").encode("utf-8"))


def replace_line(lines, idx, new):
    old = lines[idx]
    lines[idx] = new
    return old


# ---------- 1. 先锋账户 ----------
p = ROOT / "docs/exness-trader/先锋账户.mdx"
lines = load(p).split("\n")
for i, ln in enumerate(lines):
    if ln.startswith("| 执行类别即时执行"):
        lines[i] = "| 执行类别 | 即时执行（外汇、金属、指数、[[exness-trader/股票 \\| 股票]]、能源）<br/>市价执行（加密数字货币） |"
    elif ln.startswith("| 对冲保证金 | 00% |"):
        lines[i] = "| 对冲保证金 | 0% |"
    elif ln.startswith("| 交易品种外汇"):
        lines[i] = "| 交易品种 | 外汇、金属、加密数字货币、能源、指数、[[exness-trader/股票 \\| 股票]] |"
save(p, "\n".join(lines))
print("先锋账户 完成")

# ---------- 2. 关于账户类型后缀 ----------
p = ROOT / "docs/exness-trader/关于账户类型后缀.mdx"
lines = load(p).split("\n")
for i, ln in enumerate(lines):
    if ln.startswith("| 裸点账户无后缀"):
        lines[i] = "| 裸点账户 | 无后缀 | MT4/MT5 | 外汇-加密数字货币-指数-[[exness-trader/股票 \\| 股票]]-能源 | 市价 | EURJPY、XAUUSD-BTCUSD-US30-AAPL-USOIL |"
    elif ln.startswith("| 零点账户-z"):
        lines[i] = "| 零点账户 | -z | MT4/MT5 | 外汇-加密数字货币-指数-[[exness-trader/股票 \\| 股票]]-能源 | 市价 | GBPCHFz、XAUUSDz-ETHUSDz-US30z-AAPLz-USOILz |"
save(p, "\n".join(lines))
print("关于账户类型后缀 完成")

# ---------- 3. 标准账户和先锋账户有什么不同 ----------
p = ROOT / "docs/exness-trader/标准账户和先锋账户有什么不同.mdx"
lines = load(p).split("\n")
for i, ln in enumerate(lines):
    if ln.startswith("| 订单执行：市价执行"):
        lines[i] = "| 订单执行： | 市价执行 | 即时**：外汇、金属、指数、能源、[[exness-trader/股票 \\| 股票]]市价：加密数字货币 |"
save(p, "\n".join(lines))
print("标准账户和先锋账户有什么不同 完成")

# ---------- 4. 零点账户 ----------
p = ROOT / "docs/exness-trader/零点账户.mdx"
lines = load(p).split("\n")
for i, ln in enumerate(lines):
    if ln.startswith("| 交易品种外汇"):
        lines[i] = "| 交易品种 | 外汇、金属、加密数字货币、能源、指数、[[exness-trader/股票 \\| 股票]] |"
save(p, "\n".join(lines))
print("零点账户 完成")

# ---------- 5. 夏季交易时间 ----------
p = ROOT / "docs/exness-trader/夏季交易时间.mdx"
lines = load(p).split("\n")
for i, ln in enumerate(lines):
    if "（下行提及的除外）" in ln and ln.lstrip().startswith("|"):
        lines[i] = "| **[[exness-trader/股票 \\| 股票]]（下行提及的除外）**休市 | 星期五 | 19:45 |"
save(p, "\n".join(lines))
print("夏季交易时间 完成")

print("全部完成")
