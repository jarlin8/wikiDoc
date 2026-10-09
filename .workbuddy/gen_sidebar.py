# -*- coding: utf-8 -*-
"""生成按主题分类的 sidebars.js（v2，扩充关键词 + 显式映射）"""
import json
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"

TRADER_RULES = [
    ("账户类型与选择", [
        "账户类型", "什么账户类型", "标准账户", "先锋账户", "美分账户", "裸点账户",
        "零点账户", "尊享", "后缀", "不同账户", "账户区别", "选择哪种账户",
        "最适合什么账户", "账户数量", "最大和最小交易手数", "地区限制",
        "账户可以交易", "账户支持", "账户类型可以", "交易新手", "模拟账户",
        "真实账户", "开立专业型", "持有几个", "账户类型可以交易",
    ]),
    ("入金与出金", [
        "入金", "出金", "充值", "提现", "支付", "转账", "银行卡", "电汇", "银联",
        "支付宝", "usdt", "usdc", "比特币", "泰达币", "货币转换器", "手续费",
        "到账", "款项", "neteller", "webmoney", "perfect-money", "sticpay",
        "bitake", "flashex", "otc365", "mypay", "虚拟美元", "兑换", "余额不足",
        "资金，交易账户", "退款", "多少资金", "支付平台", "支付方式",
    ]),
    ("交易品种与合约", [
        "品种", "外汇", "金属", "黄金", "白银", "铂金", "钯", "指数", "能源",
        "原油", "石油", "股票", "加密", "数字货币", "货币对", "直盘", "交叉盘",
        "小币种", "点差", "隔夜利息", "隔夜费用", "杠杆", "杠杆", "保证金",
        "基点", "迷你点", "做市商", "交易术语", "差价合约", "合约单位",
        "报价是如何计算", "汇率", "拆股", "跳动点", "外汇基本知识",
    ]),
    ("交易平台与工具", [
        "mt4", "mt5", "metatrader", "交易应用", "网页终端", "终端", "vps",
        "ea", "智能交易", "信号", "图表", "推送", "通知", "multiterminal",
        "linux", "macos", "windows", "安卓版", "下载", "语言设置",
        "交易平台功能比较", "服务器么", "pwa", "买价线", "版本", "屏幕截图",
        "浏览器缓存", "cookies",
    ]),
    ("交易操作与订单", [
        "订单", "挂单", "平仓", "止损", "止盈", "爆仓", "对冲", "滑点", "报价",
        "交易历史", "盈亏", "利润", "交易状态", "单号", "市价", "限价", "执行",
        "手数", "仓位", "交易量", "亏损", "偏差", "开始交易", "进行交易",
    ]),
    ("交易时间与市场规则", [
        "交易时间", "夏季", "冬季", "休市", "新闻", "监管", "条款", "政策",
        "市场保护", "竞赛", "价格缺口", "时区", "周末", "节假日", "保证金通知",
        "对冲保证金", "不接受哪些国家", "限制", "繁忙", "市场已关闭", "负余额保护",
        "财报", "监管", "实体",
    ]),
    ("错误与故障排除", [
        "错误", "失败", "无法", "问题", "拒绝", "日志", "缓存", "恢复", "疑难",
        "故障", "无效", "提示", "出错", "不足", "被拒绝", "乱码", "过期",
    ]),
    ("账户管理与安全", [
        "注册", "验证", "密码", "姓名", "个人信息", "邮箱", "安全", "验证文件",
        "上传", "账号", "服务器", "关闭账户", "信用", "登录", "资料",
        "手机号码", "短信", "3d", "cvv", "个人专区", "账户货币", "网络日志",
        "哪些文件", "创建", "账户验", "归档账户", "他人以", "长时间未使用",
        "交易账户设置",
    ]),
]

AGENT_RULES = [
    ("计划与入门", [
        "合作伙伴计划", "加入", "入门", "合作伙伴类型", "IB", "介绍经纪商",
        "地区代表", "社交交易", "忠诚计划", "推广指南", "单链接", "自定义",
        "合作伙伴链接", "合作伙伴账户", "合作伙伴和介绍", "如何成为一名",
        "合作伙伴如何知道", "合作伙伴忠诚", "外汇基本知识", "佣金框架",
    ]),
    ("佣金与返佣", [
        "佣金", "返佣", "收入分享", "赚取多少钱", "本金使用比率", "提取",
        "最低和最高出金限额", "是否允许返佣", "手续费", "标准账户", "先锋账户",
        "美分账户", "零点账户", "裸点账户", "如何管理返佣", "探索返佣",
    ]),
    ("个人专区与报告", [
        "个人专区", "报告", "面板", "查看", "探索",
    ]),
    ("资金与平台安全", [
        "资金安全", "资金是否安全", "支付服务", "财务", "审计", "经纪公司",
        "实体", "提供的交易平台", "提供的交易产品", "VPS", "出金规则",
        "内部转账", "比特币电子钱包", "不接受哪些国家", "客服支持",
    ]),
]

# 显式覆盖（文件名 -> 分类）
TRADER_OVERRIDE = {
    "exness-意见门户介绍": "其他",
    "exness-是做什么的": "其他",
    "如何为客服团队创建屏幕截图": "其他",
    "如何查询我的代理信息": "其他",
    "如何通过-exness-进行交易": "其他",
    "我在国外可以用自己的交易账户交易吗": "其他",
    "是否可由朋友或家人代我进行交易": "其他",
    "立即开始交易": "其他",
    "怀疑他人以自己的名义交易": "账户管理与安全",
    "交易方式是否有限制": "交易时间与市场规则",
}


def classify(name, rules, fallback="其他"):
    low = name.lower()
    for label, kws in rules:
        for kw in kws:
            if kw.lower() in low:
                return label
    return fallback


def collect(folder, rules, override=None):
    order = [label for label, _ in rules] + ["其他"]
    groups = {label: [] for label in order}
    for f in sorted((DOCS / folder).glob("*.mdx")):
        stem = f.stem
        if stem == folder:
            continue
        if override and stem in override:
            label = override[stem]
        else:
            label = classify(stem, rules)
        groups[label].append(f"{folder}/{stem}")
    return groups, order


trader, trader_order = collect("exness-trader", TRADER_RULES, TRADER_OVERRIDE)
agent, agent_order = collect("exness-agent", AGENT_RULES)

print("=== exness-trader ===")
for k in trader_order:
    print(f"  {k}: {len(trader[k])}")
print(f"  合计: {sum(len(v) for v in trader.values())}")
print()
print("=== exness-agent ===")
for k in agent_order:
    print(f"  {k}: {len(agent[k])}")
print(f"  合计: {sum(len(v) for v in agent.values())}")
print()
print("=== trader 其他明细 ===")
for x in trader["其他"]:
    print("   ", x.split("/", 1)[1])
print("=== agent 其他明细 ===")
for x in agent["其他"]:
    print("   ", x.split("/", 1)[1])

Path(".workbuddy/sidebar_groups.json").write_text(
    json.dumps({"trader": trader, "agent": agent}, ensure_ascii=False, indent=1),
    encoding="utf-8",
)
