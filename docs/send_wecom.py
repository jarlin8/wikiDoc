"""企业微信智能机器人推送 - WebSocket 长连接主动推送"""

import asyncio
import json
import os
import uuid

import websockets


BOT_ID = os.environ.get("BOT_ID", "")
BOT_SECRET = os.environ.get("BOT_SECRET", "")
CHAT_USERID = os.environ.get("CHAT_USERID", "")
REPORT_PATH = "docs/REPORT.md"

def build_summary(content: str) -> str:
    """从 REPORT.md 提取关键内容，用完整 Markdown 格式（表格+emoji）"""
    lines = content.split("\n")
    section = ""
    signals = []
    watches = []
    dist_lines = []

    for line in lines:
        if line.startswith("## 阶段分布"):
            section = "dist"
        elif line.startswith("## ") and "二次启动" in line:
            section = "signal"
        elif line.startswith("## ") and "洗盘" in line:
            section = "watch"
        elif line.startswith("## "):
            section = "other"
        elif section == "dist" and line.startswith("- "):
            dist_lines.append(line.lstrip("- ").strip())
        elif section in ("signal", "watch"):
            if "|" in line and "---" not in line and "代码" not in line:
                parts = [p.strip() for p in line.split("|") if p.strip()]
                if len(parts) >= 6:
                    if section == "signal":
                        signals.append(parts)
                    else:
                        watches.append(parts)

    from datetime import datetime
    today = datetime.now().strftime("%Y-%m-%d")

    msg = []
    msg.append(f"# 🐲 龙虎榜强势股日报 {today}")
    msg.append("")

    # 阶段分布
    if dist_lines:
        msg.append("## 📊 阶段分布")
        for d in dist_lines:
            msg.append(f"- {d}")
        msg.append("")

    # 二次启动信号 - 表格
    msg.append(f"## 🟢 二次启动信号（{len(signals)}只）")
    if signals:
        msg.append("")
        msg.append("| # | 股票 | 代码 | 评分 | 涨幅 | 净买比 | 题材 |")
        msg.append("|---|------|------|------|------|--------|------|")
        for i, p in enumerate(signals, 1):
            code = p[0]
            name = p[1]
            score = p[2]
            change = p[3] if len(p) > 3 else ""
            net_ratio = p[5] if len(p) > 5 else ""
            theme = p[7] if len(p) > 7 else ""
            msg.append(f"| {i} | **{name}** | {code} | {score} | {change} | {net_ratio} | {theme} |")
    else:
        msg.append("> 今日无二次启动信号")
    msg.append("")

    # 洗盘观察期 TOP15 - 表格
    top_n = watches[:15]
    msg.append(f"## 🟡 洗盘观察期 TOP15（共{len(watches)}只）")
    if top_n:
        msg.append("")
        msg.append("| # | 股票 | 代码 | 评分 | 沉寂天数 | 净买比 | 题材 |")
        msg.append("|---|------|------|------|----------|--------|------|")
        for i, p in enumerate(top_n, 1):
            code = p[0]
            name = p[1]
            score = p[2]
            silent = p[4] if len(p) > 4 else ""
            net_ratio = p[5] if len(p) > 5 else ""
            theme = p[7] if len(p) > 7 else ""
            msg.append(f"| {i} | **{name}** | {code} | {score} | {silent}天 | {net_ratio} | {theme} |")
    else:
        msg.append("> 今日无洗盘观察股")

    result = "\n".join(msg)
    if len(result) > 4000:
        result = result[:3900] + "\n\n> … 已截断，完整报告见 GitHub"
    return result

async def send_report():
    """连接 WebSocket，认证后主动推送消息"""
    uri = "wss://openws.work.weixin.qq.com"

    try:
        async with websockets.connect(
            uri,
            close_timeout=5,
            ping_interval=None,
        ) as ws:

            # 1. 订阅认证
            subscribe_req = {
                "cmd": "aibot_subscribe",
                "headers": {"req_id": str(uuid.uuid4())},
                "body": {
                    "bot_id": BOT_ID,
                    "secret": BOT_SECRET,
                },
            }
            await ws.send(json.dumps(subscribe_req))
            resp = json.loads(await asyncio.wait_for(ws.recv(), timeout=15))
            print(f"订阅结果: {resp}")

            if resp.get("errcode", -1) != 0:
                print(f"❌ 订阅失败: {resp.get('errmsg', 'unknown')}")
                return False

            print("✅ 订阅成功")

            # 2. 读取并精简报告
            with open(REPORT_PATH, "r", encoding="utf-8") as f:
                content = f.read()
            msg_text = build_summary(content)

            # 3. 主动推送消息
            # 官方格式：chatid 单聊填 userid，msgtype + 对应结构体
            send_req = {
                "cmd": "aibot_send_msg",
                "headers": {"req_id": str(uuid.uuid4())},
                "body": {
                    "chatid": CHAT_USERID,
                    "msgtype": "markdown",
                    "markdown": {
                        "content": msg_text,
                    },
                },
            }
            print(f"发送请求: {json.dumps(send_req, ensure_ascii=False)[:500]}")
            await ws.send(json.dumps(send_req))
            resp = json.loads(await asyncio.wait_for(ws.recv(), timeout=15))
            print(f"发送结果: {resp}")

            if resp.get("errcode", -1) == 0:
                print("✅ 报告已推送到企业微信")
                return True
            else:
                print(f"⚠️ 发送返回: {resp}")
                return False

    except websockets.exceptions.ConnectionClosedError as e:
        print(f"连接被关闭: {e}")
        return False
    except asyncio.TimeoutError:
        print("⚠️ 超时，未收到响应")
        return False
    except Exception as e:
        print(f"异常: {type(e).__name__}: {e}")
        return False


def main():
    if not BOT_ID or not BOT_SECRET:
        print("⚠️ 未配置 BOT_ID 或 BOT_SECRET，跳过推送")
        return
    if not CHAT_USERID:
        print("⚠️ 未配置 CHAT_USERID，跳过推送")
        return

    result = asyncio.run(send_report())
    if not result:
        print("⚠️ 企业微信推送失败，但不影响报告生成")


if __name__ == "__main__":
    main()
