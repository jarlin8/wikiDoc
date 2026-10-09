# -*- coding: utf-8 -*-
"""
每日龙虎榜数据采集 —— 问财 stream-query 直连方案（2026-10-09 重写）

背景：问财老接口 get-robot-data 对非浏览器客户端一律 403（WAF），pywencai 主链路失效。
新版前端改走 /gateway/aime/stream-query（SSE 流式接口），实测可程序化直连：
  1) 浏览器抓包 cURL 原样重放 -> 200，同一份数据
  2) hexin-v 令牌用 node 本地生成（60 字符），替代浏览器令牌 -> 200，数据一致
  3) 换问句返回对应新结果（实时计算，非缓存回放）
  4) 纯 python requests + 最简请求头 -> 200（无需 curl_cffi）

依赖：requests、pandas、pywencai（仅用其自带的 hexin-v.bundle.js 生成令牌，需 Node.js 在 PATH）
cookie：环境变量 WENCAI_COOKIE（浏览器登录 iwencai.com 后 F12 复制整段 Cookie 请求头）；
        脚本会自动剥离其中的旧 v= 对，统一换成程序新生成的令牌。
输出：./docs/data_<日期>.csv（与当日已有数据合并后整体重写）
"""
import datetime
import json
import os
import re
import subprocess
import time

import pandas as pd
import requests

# ---------- 配置 ----------
# 问句与网页版抓包一致（已验证可返回涨停原因/龙虎榜净买入额等全部字段）
QUERY = ('龙虎榜净额大于0，非退市非st非创业板非科创板非北交所非次新股,涨幅大于-8%,'
         '涨停原因,(龙虎榜净额/龙虎榜买入金额)从大到小列出')
PERPAGE = 50          # 与网页版抓包一致；row_count 超过返回行数时会报错退出（见下）
RETRY = 3             # 网络层重试次数
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36')
STREAM_URL = 'https://www.iwencai.com/gateway/aime/stream-query'

cookie = os.environ.get('WENCAI_COOKIE', '').strip()
if not cookie:
    raise SystemExit(
        '[wencai] 缺少 WENCAI_COOKIE 环境变量。'
        '浏览器登录 iwencai.com -> F12 -> Network -> 任一请求 -> 复制整段 Cookie 请求头。'
    )


# ---------- hexin-v 令牌（pywencai 自带 bundle，需 Node.js 在 PATH） ----------
def get_hexin_v():
    try:
        import pywencai  # noqa: F401  仅用作令牌 bundle 的载体
        bundle = os.path.join(os.path.dirname(pywencai.__file__), 'hexin-v.bundle.js')
    except ImportError:
        raise SystemExit('[wencai] 缺少 pywencai（仅作令牌 bundle 载体）：pip install pywencai')
    r = subprocess.run(['node', bundle], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    token = r.stdout.decode().strip()
    if r.returncode != 0 or not token:
        raise SystemExit(
            '[wencai] hexin-v 令牌生成失败（需 Node.js v16+ 在 PATH 中）。'
            f'node stderr: {r.stderr.decode(errors="replace")[:200]}'
        )
    return token


token = get_hexin_v()

# 浏览器 cookie 自带的旧 v= 对去掉，统一换成程序新生成的令牌（与 hexin-v 头保持一致）
pairs = [p.strip() for p in cookie.split(';') if p.strip() and not p.strip().lower().startswith('v=')]
cookie_final = '; '.join(pairs + [f'v={token}'])

headers = {
    'Content-Type': 'application/json',
    'accept': 'text/event-stream',
    'hexin-v': token,
    'X-Source': 'ths_iwencai_pc_xuangu',
    'Origin': 'https://www.iwencai.com',
    'Referer': 'https://www.iwencai.com/screener/result?w=test&querytype=stock&sign=1791510393175',
    'User-Agent': UA,
    'cookie': cookie_final,
}

req_body = {
    'question': QUERY,
    'default_fallback': False,
    'input_type': 'click',
    'entity_info': {'device_type': 'pc', 'comefrom': None},
    'source': 'ths_iwencai_pc_xuangu',
    'dialog_model': 'CUSTOMER_AGENT',
    'version': '3.4.1',
    'agent_tools': [{'tool_id': 'FinQuery', 'tool_param': {'domain': 'stock', 'perpage': PERPAGE}}],
    'events': [{'event_type': 'user_input', 'event_name': 'normal_agent', 'content': {}}],
    'add_info': {},
    'agent_id': 'MaSzyUwyyl',   # 抓包固定值，实测可复用
    'agent_name': '',
}


# ---------- 请求 + SSE 解析 ----------
def fetch_rows():
    """请求 stream-query 并解析 SSE，返回 (rows, row_count, status_msg)"""
    res = requests.post(STREAM_URL, json=req_body, headers=headers, timeout=(5, 90))
    if res.status_code == 401:
        raise SystemExit('[wencai] HTTP 401 未登陆：WENCAI_COOKIE 已失效，请从浏览器重新抓取。')
    if res.status_code != 200:
        raise SystemExit(f'[wencai] HTTP {res.status_code}：{res.text[:200]}')
    if 'event-stream' not in res.headers.get('Content-Type', ''):
        raise SystemExit(f'[wencai] 非 SSE 响应（疑似被 WAF 拦截）：{res.text[:200]}')

    rows, row_count, status_msg = None, None, None
    for line in res.text.splitlines():
        if not line.startswith('data:'):
            continue
        try:
            evt = json.loads(line[5:].strip())
        except json.JSONDecodeError:
            continue
        sec = evt.get('section') or {}
        for comp in (sec.get('result_page') or {}).get('components', []):
            d = comp.get('data') or {}
            if 'datas' in d:
                rows = d.get('datas') or []
                row_count = d.get('row_count')
                status_msg = d.get('status_msg')
    return rows, row_count, status_msg


print('[wencai] 请求 stream-query ...', flush=True)
rows, row_count, status_msg = None, None, None
for attempt in range(1, RETRY + 1):
    try:
        rows, row_count, status_msg = fetch_rows()
        if rows:
            break
        print(f'[wencai] 第{attempt}次未取得数据行（row_count={row_count}, status={status_msg}）', flush=True)
    except SystemExit:
        raise
    except requests.RequestException as e:
        print(f'[wencai] 第{attempt}次请求异常：{type(e).__name__}: {e}', flush=True)
    time.sleep(5)

if not rows:
    raise SystemExit(
        f'[wencai] 重试{RETRY}次均未取得数据行（row_count={row_count}, status={status_msg}）。'
        '常见原因：1) WENCAI_COOKIE 已失效，重新从浏览器抓取；'
        '2) 出口 IP 被问财风控拦截（GitHub Actions 为境外 IP，风险高，兜底方案是本地跑）。'
    )
if row_count and row_count > len(rows):
    # 超页翻页能力尚未验证（scroll 接口实测是会话历史列表，非翻页）。
    # 为避免把不完整数据伪装成全量写入下游，这里选择报错退出而不是写部分数据。
    raise SystemExit(
        f'[wencai] row_count={row_count} 超过单页返回 {len(rows)} 行，数据不完整，脚本终止。'
        '需在真实溢出日排查翻页方案后再运行。'
    )

df = pd.DataFrame(rows)
print(f'[wencai] 取得 {len(df)} 行 x {len(df.columns)} 列', flush=True)

# ---------- 列清洗 + 落盘（沿用原逻辑） ----------
columns_to_drop = ['股票市场类型', '经营范围', '上市板块', '注册地址', 'market_code']
df.drop(columns=columns_to_drop, inplace=True, errors='ignore')
df.columns = [re.sub(r'\[\d+\]|\{|\}|\(|\)', '', col) for col in df.columns]

# 文件路径
os.makedirs('./docs', exist_ok=True)
mtime = datetime.datetime.now().strftime('%Y%m%d')
file_path = './docs/data_' + mtime + '.csv'

try:
    original_data = pd.read_csv(file_path)
except FileNotFoundError:
    original_data = pd.DataFrame()

data = pd.concat([original_data, df], ignore_index=True)
data.to_csv(file_path, mode='w', index=False, header=True, encoding='utf-8-sig')
print(f'[wencai] 已写入 {file_path}（共 {len(data)} 行）', flush=True)
