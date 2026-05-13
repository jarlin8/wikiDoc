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
    """从 REPORT.md 提取关键内容"""
    lines = content.split("\n")
    summary = []
    section = ""
    count = 0

    for line in lines:
        if line.startswith("# "):
            summary.append(line.lstrip("# ").strip())
            summary.append("")
        elif line.startswith("## 阶段分布"):
            section = "dist"
            summary.append("📊 阶段分布")
        elif line.startswith("## 🟢"):
            section = "signal"
            count = 0
            summary.append("\n🟢 二次启动信号")
        elif line.startswith("## 🟡"):
            section = "watch"
            count = 0
            summary.append("\n🟡 洗盘观察期 TOP10")
        elif line.startswith("## "):
            section = "other"
        elif section == "dist" and line.startswith("- "):
            summary.append(line)
        elif section == "signal":
            if "|" in line and "---" not in line and "代码" not in line:
                parts = [p.strip() for p in line.split("|") if p.strip()]
                if len(parts) >= 6:
                    count += 1
                    theme = parts[7] if len(parts) > 7 else ""
                    summary.append(
                        f"  {count}. {parts[1]}({parts[0]}) "
                        f"评分{parts[2]} 净买比{parts[5]} {theme}"
                    )
        elif section == "watch":
            if "|" in line and "---" not in line and "代码" not in line:
                parts = [p.strip() for p in line.split("|") if p.strip()]
                if len(parts) >= 6:
                    count += 1
                    if count <= 10:
                        theme = parts[7] if len(parts) > 7 else ""
                        summary.append(
                            f"  {count}. {parts[1]}({parts[0]}) "
                            f"评分{parts[2]} 沉寂{parts[4]}天 {theme}"
                        )

    msg = "\n".join(summary)
    if len(msg) > 2000:
        msg = msg[:2000] + "\n\n... 已截断，完整报告见 GitHub"
    return msg


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

            # 3. 主动推送消息（单聊，先尝试 markdown，失败则回退 text）
            for msg_type in ["markdown", "text"]:
                if msg_type == "markdown":
                    body_content = {"markdown": msg_text}
                else:
                    body_content = {"text": {"content": msg_text}}

                send_req = {
                    "cmd": "aibot_send_msg",
                    "headers": {"req_id": str(uuid.uuid4())},
                    "body": {
                        "chattype": "single",
                        "userid": CHAT_USERID,
                        "msg_type": msg_type,
                        **body_content,
                    },
                }
                await ws.send(json.dumps(send_req))
                resp = json.loads(await asyncio.wait_for(ws.recv(), timeout=15))
                print(f"发送结果 (msg_type={msg_type}): {resp}")

                if resp.get("errcode", -1) == 0:
                    print(f"✅ 报告已推送到企业微信 (格式: {msg_type})")
                    return True
                else:
                    print(f"⚠️ {msg_type} 格式失败，尝试下一种...")

            print("❌ 所有格式都失败了")
            return False
            await ws.send(json.dumps(send_req))
            resp = json.loads(await asyncio.wait_for(ws.recv(), timeout=15))
            print(f"发送结果: {resp}")

            if resp.get("errcode", 0) == 0:
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
