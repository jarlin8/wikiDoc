#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复 无法出金 + 我可以使用合作伙伴链接 两个文件"""
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")


def load(p):
    return p.read_text(encoding="utf-8")


def save(p, text):
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    p.write_bytes(text.replace("\n", "\r\n").encode("utf-8"))


# ---------- 文件2: 无法出金时该如何操作 ----------
f2 = ROOT / "docs/exness-trader/无法出金时该如何操作.mdx"
t2 = load(f2)
lines2 = t2.split("\n")
# 替换索引 17..34 (L18..L35)
new_table = [
    "| 错误 | 解决方案： |",
    "| --- | --- |",
    "| **出金金额不足** | - 请确保所有未结订单均未导致可用保证金浮动。请平仓所有未结订单，结清余额，然后输入您想要出金的金额。<br/>- 请确认您的出金货币在**账户货币**指定的范围之中，否则可能会导致错误。 |",
    "| **出金请求遭到拒绝** | 您可以**登录自己的个人专区**并查看**交易历史**获取出金遭到拒绝的原因。<br/><br/>请**遵守 EXNESS 的出金政策**，包括：出金比例需与入金比例相同、出金和入金的需使用相同的支付系统。<br/><br/>再次尝试出金前，请确保未完成的**银行卡退款**或比特币退款已到账。 |",
    "| **无法找到支付系统** | 如果入金时使用的支付系统在出金时无法继续使用，请联系 EXNESS 的客服团队获取帮助，通过其他方式进行出金操作。 |",
    "| **支付系统账户遭到冻结或入侵** | 如果您使用的支付系统的注册账户遭到冻结、入侵或无法使用，请联系 EXNESS 的客服团队并提供相关证明，以便其咨询 EXNESS 的支付专员，寻找最佳解决方案。 |",
]
# 校验边界
assert lines2[17].startswith("| 错误"), repr(lines2[17])
assert lines2[34].startswith("| **支付系统账户遭到冻结"), repr(lines2[34])
lines2 = lines2[:17] + new_table + lines2[35:]
save(f2, "\n".join(lines2))
print("文件2 完成")

# ---------- 文件3: 我可以使用合作伙伴链接 ----------
f3 = ROOT / "docs/exness-agent/我可以使用合作伙伴链接创建自定义合作伙伴链接吗.mdx"
t3 = load(f3)
lines3 = t3.split("\n")
# 1) 图片 alt 改为描述
for i, ln in enumerate(lines3):
    if ln.startswith("![Partner_link_ZH.jpg]"):
        lines3[i] = ln.replace(
            "![Partner_link_ZH.jpg]",
            "![合作伙伴链接中的八位符号代码示意图]",
        )
# 2) 表格前补空行：找到 "| 账户类型：" 起始行
for i, ln in enumerate(lines3):
    if ln.startswith("| 账户类型："):
        if i > 0 and lines3[i-1].strip() != "":
            lines3.insert(i, "")
            print(f"文件3: 在 L{i+1} 前插入空行")
        break
save(f3, "\n".join(lines3))
print("文件3 完成")
