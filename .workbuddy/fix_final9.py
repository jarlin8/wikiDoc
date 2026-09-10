#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复最后 9 处表格列数不一致问题"""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")


def load(p):
    return p.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")


def save(p, text):
    p.write_bytes(text.replace("\n", "\r\n").encode("utf-8"))


def repl_range(lines, start, end, new_lines):
    """替换 [start, end] (0-indexed, 含两端)"""
    return lines[:start] + new_lines + lines[end+1:]


# ---------- A: 如何成为一名介绍经纪商IB ----------
pA = ROOT / "docs/exness-agent/如何成为一名介绍经纪商IB.mdx"
tA = load(pA).split("\n")
assert tA[14] == "IB内又分四个佣金级别，分别为青铜、白银、黄金和卓越。每上升一个级别，要求就越高，佣金比例也将从33%提升到40%。", repr(tA[14])
tA = repl_range(tA, 14, 14, ["", tA[14]])
save(pA, "\n".join(tA))
print("A 完成")

# ---------- B: 裸点账户的合作伙伴佣金如何计算 ----------
pB = ROOT / "docs/exness-agent/裸点账户的合作伙伴佣金如何计算.mdx"
tB = load(pB).split("\n")
assert tB[38] == "**佣金计算方法**：", repr(tB[38])
tB = repl_range(tB, 38, 38, ["", tB[38]])
save(pB, "\n".join(tB))
print("B 完成")

# ---------- C: 如何通过-mypay-出入金 ----------
pC = ROOT / "docs/exness-trader/如何通过-mypay-出入金.mdx"
tC = load(pC).split("\n")
assert tC[23].startswith("| **入金到账时间**"), repr(tC[23])
assert tC[24].startswith("**最多**：2天"), repr(tC[24])
assert tC[25].startswith("| **出金到账时间**"), repr(tC[25])
assert tC[26].startswith("**最多**：1天"), repr(tC[26])
tC = repl_range(tC, 25, 26, ["| **出金到账时间** | **平均**：3小时以内<br/>**最多**：1天 |"])
tC = repl_range(tC, 23, 24, ["| **入金到账时间** | **平均**：即时*<br/>**最多**：2天 |"])
save(pC, "\n".join(tC))
print("C 完成")

# ---------- D: 收到订单数量过多错误提示 ----------
pD = ROOT / "docs/exness-trader/收到订单数量过多错误提示.mdx"
tD = load(pD).split("\n")
assert tD[16].startswith("| **先锋账户、裸点账户、零点账户**"), repr(tD[16])
assert tD[23].strip() == "|", repr(tD[23])
newD = ["| **先锋账户、裸点账户、零点账户** | MT4：数量限制基于上述提到的累计订单数<br/>MT5 模拟账户：1024<br/>MT5 真实账户：无限 |"]
tD = repl_range(tD, 16, 23, newD)
save(pD, "\n".join(tD))
print("D 完成")

# ---------- E: 账户长时间未使用 ----------
pE = ROOT / "docs/exness-trader/账户长时间未使用会出现什么情况.mdx"
tE = load(pE).split("\n")
# MT5 表 L42-50 (idx 41..49)
assert tE[41].startswith("| 真实账户 | 模拟账户 |"), repr(tE[41])
assert tE[49].strip() == "|", repr(tE[49])
newE2 = [
    "| 真实账户 | 模拟账户 |",
    "| --- | --- |",
    "| 以下情况下账户将被归档：<br/>- 15 天不活跃，且<br/>- 余额 < 1 美元 | |",
]
tE = repl_range(tE, 41, 49, newE2)
# MT4 表 L24-38 (idx 23..37)
assert tE[23].startswith("| 真实账户 | 模拟账户 |"), repr(tE[23])
assert tE[37].strip() == "|", repr(tE[37])
newE1 = [
    "| 真实账户 | 模拟账户 |",
    "| --- | --- |",
    "| 以下情况下账户将被归档：<br/>- 90 天不活跃，且<br/>- 余额 < 10 美元<br/><br/>以下情况账户将被删除：<br/>- 最后一次登录后的 180 天里账户处于不活跃状态 | |",
]
tE = repl_range(tE, 23, 37, newE1)
save(pE, "\n".join(tE))
print("E 完成")

# ---------- H: 直盘交易 USDJPY 表 ----------
pH = ROOT / "docs/exness-trader/直盘交易.mdx"
tH = load(pH).split("\n")
assert "账户类型" in tH[130] and "标准账户、美分账户" in tH[130], repr(tH[130])
assert tH[144].startswith(" 交易手续费（每手/单向）"), repr(tH[144])
newH = [
    "| 账户类型 | 标准账户、美分账户、先锋账户、裸点账户与零点账户 |",
    "| --- | --- |",
    "| 交易品种后缀 | 美分账户 – USDJPYc<br/>标准账户 – USDJPYm<br/>先锋账户、裸点账户、零点账户 – USDJPY |",
    "| 交易终端 | MT4、MT5 |",
    "| 执行类别 | 美分账户、标准账户、裸点账户、零点账户 - 市价执行<br/>先锋账户 - 即时执行 |",
    "| 合约单位 | 100,000 |",
    "| 平均点差（点） | 美分账户 - 1.1点<br/>标准账户 - 1.1点<br/>裸点账户 – 0点<br/>零点账户 – 0点<br/>先锋账户 - 0.7点 |",
    "| 最小交易量/订单： | 0.01手 |",
    "| 最大交易量/订单： | 白天(7:00 – 20:59 GMT)：200手<br/>夜间(21:00 – 6:59 GMT)：20手 |",
    "| 最大杠杆 | 1：无限杠杆 – 如符合条件 1:2000 |",
    "| 对冲保证金 | 0% |",
    "| 三倍隔夜利息日 | 星期三 |",
    "| 隔夜利息 | 多头：0.06105<br/>空头：−0.42754 |",
    "| 提供高级隔夜利息豁免权益 | 是 |",
    "| 交易手续费（每手/单向） | 裸点账户 – 3.5美元<br/>零点账户 – 3.5美元 |",
]
tH = repl_range(tH, 130, 144, newH)
save(pH, "\n".join(tH))
print("H 完成")

# ---------- F/G + 其它: 表格行内 wiki 链接转义 ----------
# 对所有文件，仅对表格行内的 [[a|b]] 转义为 [[a\|b]]
count = 0
files = list((ROOT / "docs").rglob("*.mdx")) + list((ROOT / "docs").rglob("*.md"))
for f in files:
    txt = load(f)
    lines = txt.split("\n")
    changed = False
    for i, ln in enumerate(lines):
        s = ln.lstrip()
        if not s.startswith("|"):
            continue
        if "[[" in ln and "|" in ln:
            # 转义 wiki 链接内部的 |
            new = re.sub(r"\[\[([^\]]*?)\|([^\]]*?)\]\]", r"[[\1\\|\2]]", ln)
            if new != ln:
                lines[i] = new
                changed = True
                count += 1
    if changed:
        save(f, "\n".join(lines))
print(f"wiki 链接转义: {count} 处")
print("全部完成")
