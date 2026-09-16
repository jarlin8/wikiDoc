# -*- coding: utf-8 -*-
"""为 B-优先救 20 篇生成建议 title / description"""
import csv
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
OUT = ROOT / "reports"
SRC = OUT / "02-优先优化清单.csv"

# 文档ID -> (建议标题, 建议描述)
SUGGEST = {
    "exness-trader/出金须知": (
        "Exness 出金完整指南：到账时间、限额与失败排查",
        "Exness 出金的到账时间、最低与最高限额、可用支付渠道，以及出金被拒绝或提示余额不足时的排查步骤。",
    ),
    "exness-trader/如何进行订单部分平仓": (
        "Exness 订单部分平仓怎么做：步骤与注意事项",
        "在 MT4/MT5 上对已开仓位执行部分平仓的完整步骤，含可平数量限制、剩余仓位与保证金变化说明。",
    ),
    "exness-trader/exness是否受到相关监管": (
        "Exness 受哪些机构监管？牌照、实体与监管编号一览",
        "Exness 的监管牌照与法人实体清单，含塞舌尔 FSA、CySEC、南非 FSCA 等监管编号及客户归属实体的判定规则。",
    ),
    "exness-trader/隔夜利息": (
        "Exness 隔夜利息怎么算：收取规则与免息账户",
        "隔夜利息的计算方式、三倍隔夜利息日、免隔夜利息账户的适用条件，以及在哪里查看持仓的隔夜费用。",
    ),
    "exness-agent/Exness提供的交易平台": (
        "Exness 提供哪些交易平台？MT4、MT5 与网页版对比",
        "Exness 支持的交易平台：MT4、MT5、网页终端与移动应用的功能差异、可交易品种与适用场景对比。",
    ),
    "exness-trader/零点账户": (
        "Exness 零点账户详解：点差、手续费与适用人群",
        "零点账户的点差结构、每手手续费、杠杆与保证金要求，以及与裸点账户的差别和适合的交易风格。",
    ),
    "exness-trader/指数交易": (
        "Exness 指数交易指南：可交易指数、点差与交易时间",
        "Exness 提供的 CFD 指数品种（US30、DE30、HK50 等）的合约规格、交易时间、点差与保证金要求。",
    ),
    "exness-trader/股票": (
        "Exness 股票 CFD 交易：品种、交易时间与隔夜费用",
        "Exness 股票差价合约的可交易标的、交易时段、股息调整与隔夜利息规则说明。",
    ),
    "exness-trader/如何完全验证您的exness账户": (
        "Exness 账户验证怎么完成：所需文件与审核时长",
        "Exness 账户验证（KYC）需要提交的身份与地址证明文件、格式与大小限制，以及审核通常需要多久。",
    ),
    "exness-trader/如何开立模拟账户": (
        "Exness 模拟账户怎么开：免费开户步骤与资金设置",
        "在 Exness 个人专区开立模拟账户的步骤、虚拟资金额度、可选杠杆，以及模拟账户与真实账户的差别。",
    ),
    "exness-trader/您的-exness-个人专区": (
        "Exness 个人专区使用指南：功能与常用操作入口",
        "Exness 个人专区（PA）的主要功能入口：开户、出入金、账户验证、报表与安全设置的使用说明。",
    ),
    "exness-trader/如何使用中国银联入金": (
        "Exness 中国银联入金：步骤、到账时间与限额",
        "通过中国银联向 Exness 入金的操作步骤、单笔限额、到账时间，以及常见入金失败原因的处理方式。",
    ),
    "exness-trader/能否更改-metatrader-4-5-平台上的时区": (
        "MT4/MT5 时区可以改吗？Exness 服务器时间说明",
        "Exness 的 MT4/MT5 服务器使用什么时区、能否在客户端修改，以及时区对图表与订单时间的影响。",
    ),
    "exness-trader/mt4-mt5-提供哪些交易品种": (
        "Exness 的 MT4/MT5 提供哪些交易品种？差异对比",
        "Exness 在 MT4 与 MT5 上可交易的品种范围，含外汇、金属、指数、能源、股票与加密货币的差异说明。",
    ),
    "exness-trader/使用-mt4-mt5-网页终端进行交易": (
        "Exness 网页终端怎么用：登录、下单与功能限制",
        "Exness 网页版交易终端（Web Terminal）的登录方式、支持的下单操作，以及与桌面版 MT4/MT5 的功能差异。",
    ),
    "exness-trader/如何进行交易账户间转账": (
        "Exness 账户间内部转账：步骤、限制与到账时间",
        "在 Exness 不同交易账户之间进行内部转账的操作步骤、可用账户范围、是否收费以及到账时间。",
    ),
    "exness-agent/合作伙伴佣金框架": (
        "Exness 合作伙伴佣金框架：级别比例与计算方式",
        "Exness 合作伙伴的佣金级别划分、各级别返佣比例、计算基准与升级条件说明。",
    ),
    "exness-trader/exness-trader": (
        "EXNESS 客户帮助中心：开户、出入金、交易与账户问题",
        "Exness 客户帮助总览：账户类型、入金出金、交易品种、平台终端、账户验证与常见错误处理。",
    ),
    "exness-trader/交易品种": (
        "Exness 交易品种一览：外汇、金属、指数、能源与股票",
        "Exness 提供的全部交易品种分类说明，含各品种组的合约规格、交易时间与成本结构入口。",
    ),
    "index": (
        "WikiDoc：Exness 帮助文档与经纪商调研",
        "Exness 客户与代理帮助文档，以及外汇经纪商的监管、成本与出入金调研。",
    ),
}

rows = []
with SRC.open(encoding="utf-8-sig", newline="") as f:
    r = csv.reader(f)
    header = next(r)
    for row in r:
        if not row:
            continue
        rows.append(row)

out = OUT / "02-优先优化清单.csv"
miss = []
with out.open("w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["文档ID", "URL", "当前标题", "曝光", "平均排名",
                "建议标题", "建议描述", "改动理由"])
    for row in rows:
        doc_id = row[0]
        s = SUGGEST.get(doc_id)
        if not s:
            miss.append(doc_id)
            s = ("", "")
        w.writerow([doc_id, row[1], row[2], row[4], row[5], s[0], s[1],
                    "原标题过短且无搜索意图词；排名已在首页但零点击"])

print("写入:", out)
print("条数:", len(rows))
print("未覆盖:", miss if miss else "无")
