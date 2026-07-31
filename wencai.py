import csv
import datetime
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from datetime import timezone, timedelta

# ============== 可配置项 ==============
# 是否剔除特定板块 / 类型（与旧 i问财 查询口径保持一致，可自由开关）
FILTERS = {
    "net_gt_0": True,          # 当日龙虎榜净额 > 0
    "exclude_bj": True,        # 剔除北交所 (4/8 开头, .BJ)
    "exclude_cyb": True,       # 剔除创业板 (300/301 开头)
    "exclude_kcb": True,       # 剔除科创板 (688/689 开头)
    "exclude_b": True,         # 剔除 B 股 (900 上交所B股 / 200 深交所B股)
    "exclude_delist_st": True, # 剔除退市 / ST
    "exclude_subnew": False,   # 剔除次新股 (上市 < 60 个交易日) — EM 该接口无此字段，默认关闭
    "chg_gt_neg8": True,       # 涨幅 > -8% (与 iwencai 查询口径一致)
}
# =====================================

EM_URL = "https://datacenter-web.eastmoney.com/api/data/v1/get"
HEADERS = {"User-Agent": "Mozilla/5.0", "Referer": "https://data.eastmoney.com/"}
COLUMNS = ("TRADE_DATE,SECURITY_CODE,SECUCODE,SECURITY_NAME_ABBR,EXPLANATION,"
           "BILLBOARD_BUY_AMT,BILLBOARD_NET_AMT,BILLBOARD_SELL_AMT,FREE_MARKET_CAP,"
           "CHANGE_RATE,MARKET")

# 输出到仓库根目录的 docs/（与旧 wencai.py 的 ./docs 行为一致；GitHub Actions 中 cwd 即仓库根）
DOCS_DIR = os.path.join(os.getcwd(), "docs")
os.makedirs(DOCS_DIR, exist_ok=True)


def beijing_today():
    return datetime.datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d")


def _http_get(url, retries=3):
    last_err = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            last_err = e
            time.sleep(2 + i)
    raise RuntimeError(f"请求失败(重试{retries}次): {last_err}")


def fetch_day(date_str):
    #拉取某天的全部龙虎榜明细（自动翻页），返回原始记录列表
    out = []
    page = 1
    while True:
        query = (
            "reportName=RPT_DAILYBILLBOARD_DETAILS"
            "&columns=" + urllib.parse.quote(COLUMNS)
            + "&filter=(TRADE_DATE%3D%27" + date_str + "%27)"
            + "&pageSize=1000&pageNumber=" + str(page)
            + "&source=WEB&client=WEB"
        )
        url = EM_URL + "?" + query
        js = _http_get(url)
        batch = (js.get("result") or {}).get("data") or []
        out.extend(batch)
        if len(batch) < 1000:
            break
        page += 1
        if page > 20:  # 安全阀
            break
    return out


def is_excluded(r):
    code = (r.get("SECUCODE") or "")
    name = (r.get("SECURITY_NAME_ABBR") or "")
    expl = (r.get("EXPLANATION") or "")
    # 用前 3 位数字切片判断（避免 '300.' 这种带点 startswith 永远不匹配的坑）
    prefix3 = code[:3] if code else ""
    # 北交所: 4/8 开头 + .BJ
    if FILTERS["exclude_bj"] and (r.get("MARKET") == "BJ" or code.endswith(".BJ")):
        return True
    # 创业板: 300/301 开头
    if FILTERS["exclude_cyb"] and prefix3 in ("300", "301"):
        return True
    # 科创板: 688/689 开头
    if FILTERS["exclude_kcb"] and prefix3 in ("688", "689"):
        return True
    # B 股: 900 (上交所B股) / 200 (深交所B股)
    if FILTERS["exclude_b"] and (prefix3 == "900" or prefix3 == "200"):
        return True
    # 退市 / ST
    if FILTERS["exclude_delist_st"]:
        up = name.upper()
        if "退" in name or up.startswith("ST") or "ST" in up or "退市" in expl:
            return True
    # 次新股: 上市交易日天数 < 60
    if FILTERS["exclude_subnew"]:
        try:
            days = r.get("LISTING_DAYS") or r.get("TRADE_DAYS_SINCE_LIST")
            if days is not None and int(days) < 60:
                return True
        except (TypeError, ValueError):
            pass
    # 涨幅 > -8%
    if FILTERS["chg_gt_neg8"]:
        chg = r.get("CHANGE_RATE")
        if chg is not None:
            try:
                if float(chg) <= -8.0:
                    return True
            except (TypeError, ValueError):
                pass
    # 当日龙虎榜净额 > 0
    if FILTERS["net_gt_0"] and (r.get("BILLBOARD_NET_AMT") or 0) <= 0:
        return True
    return False


def to_str(v):
    if v is None:
        return ""
    if isinstance(v, float):
        # 尽量保留原始精度（净额/买入额等），整数型金额去掉无意义小数
        if v == int(v):
            return str(int(v))
        return repr(v)
    return str(v)


def build_row(r):
    code = r.get("SECUCODE") or ""
    name = r.get("SECURITY_NAME_ABBR") or ""
    expl = r.get("EXPLANATION") or ""
    buy = r.get("BILLBOARD_BUY_AMT") or 0
    net = r.get("BILLBOARD_NET_AMT") or 0
    sell = r.get("BILLBOARD_SELL_AMT") or 0
    close = r.get("CLOSE_PRICE")
    chg = r.get("CHANGE_RATE")
    trade_date = (r.get("TRADE_DATE") or "")[:10].replace("-", "")
    net_ratio = (net / buy) if (buy not in (None, 0)) else None
    board = "三日榜" if "连续三个交易" in expl else "单日榜"
    return {
        "股票代码": code,
        "股票简称": name,
        "最新价": to_str(close),
        "营业部交易日期": trade_date,
        "当日龙虎榜买入金额": to_str(buy),
        "当日龙虎榜净额": to_str(net),
        "当日龙虎榜卖出金额": to_str(sell),
        "当日上榜原因": expl,
        "龙虎榜上榜类型": board,
        "上市交易日天数": "",
        "涨跌幅:前复权": to_str(chg),
        "涨停原因类别": expl,                       # 东方财富无板块概念字段，用龙虎榜上榜原因作为涨停原因
        "当日龙虎榜净额/当日龙虎榜买入金额": (repr(net_ratio) if net_ratio is not None else ""),
        "当日龙虎榜净额/当日龙虎榜买入金额排名": "",
        "a股市值不含限售股": to_str(r.get("FREE_MARKET_CAP")),
        "开盘价:前复权": "",
        "最高价:前复权": "",
        "最低价:前复权": "",
        "收盘价:前复权": to_str(close),
        "振幅": "",                                # 由下游 compute_metrics 从K线推导，保证稳定
        "成交量": "",
        "code": code,
    }


def main():
    if len(sys.argv) > 1:
        target = sys.argv[1]
    else:
        target = beijing_today()

    # 今天无数据则回退到昨天（按接口实际返回的日期命名文件，避免错标）
    candidates = [target]
    y = datetime.datetime.strptime(target, "%Y-%m-%d") - timedelta(days=1)
    candidates.append(y.strftime("%Y-%m-%d"))

    for date_str in candidates:
        print(f"采集 {date_str} 龙虎榜明细 ...")
        try:
            raw = fetch_day(date_str)
        except Exception as e:
            print(f"  {date_str} 请求异常: {e}")
            continue
        if not raw:
            print(f"  {date_str} 无数据（可能非交易日或数据未发布），跳过")
            continue

        rows = [build_row(r) for r in raw if not is_excluded(r)]
        print(f"  原始 {len(raw)} 条 -> 过滤后 {len(rows)} 条")

        # 同一(股票,交易日)可能因多原因/多日榜重复出现，按 key 去重
        # 保留净买比例最高的那条（与 iwencai 默认行为一致）
        def _nr(row):
            try:
                return float(row["当日龙虎榜净额/当日龙虎榜买入金额"])
            except (TypeError, ValueError):
                return -1.0
        seen = {}
        for row in rows:
            k = (row["股票代码"], row["营业部交易日期"])
            if k not in seen or _nr(row) > _nr(seen[k]):
                seen[k] = row
        rows = list(seen.values())
        # 按净买比例降序，与 iwencai 截图展示顺序一致
        rows.sort(key=_nr, reverse=True)

        fname = f"data_{date_str.replace('-', '')}.csv"
        fpath = os.path.join(DOCS_DIR, fname)
        with open(fpath, "w", encoding="utf-8-sig", newline="") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            w.writeheader()
            w.writerows(rows)
        print(f"已写入 {fpath} ({len(rows)} 条)")
        return  # 成功即结束（只写实际有数据的那一天）

    print("今天与昨天均无龙虎榜数据，未生成文件。")


if __name__ == "__main__":
    main()
