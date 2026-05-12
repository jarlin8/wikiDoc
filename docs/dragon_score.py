#!/usr/bin/env python3
# dragon_score.py — 龙虎榜龙头评分一体化脚本 v3
# 基于完整龙虎榜明细数据（含净额、净买比、上榜原因等）

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import glob
import os
import sys
import re


# ============================================================
# 第一步：读取并合并所有 CSV
# ============================================================

def load_all_csv(data_dir='.'):
    """读取目录下所有 data_*.csv 文件并合并，自动删除空文件"""
    csv_files = sorted(glob.glob(os.path.join(data_dir, 'data_*.csv')))
    if not csv_files:
        print(f'错误: 在 {os.path.abspath(data_dir)} 下找不到 data_*.csv 文件')
        sys.exit(1)

    dfs = []
    deleted = 0
    for f in csv_files:
        try:
            if os.path.getsize(f) == 0:
                os.remove(f)
                deleted += 1
                continue

            df = pd.read_csv(f)

            if len(df) == 0:
                os.remove(f)
                deleted += 1
                continue

            # 日期处理：优先用 CSV 内的日期列，否则从文件名提取
            date_col = None
            for col_name in ['营业部交易日期', '交易日期', '上榜日期']:
                if col_name in df.columns:
                    date_col = col_name
                    break

            if date_col is None:
                # 从文件名提取日期
                match = re.search(r'data_(\d{8})', os.path.basename(f))
                if match:
                    ds = match.group(1)
                    df['trade_date'] = f'{ds[:4]}-{ds[4:6]}-{ds[6:8]}'
                else:
                    continue
            else:
                df['trade_date'] = pd.to_datetime(
                    df[date_col].astype(str).str.strip(),
                    format='%Y%m%d', errors='coerce'
                ).dt.strftime('%Y-%m-%d')
                df = df.dropna(subset=['trade_date'])

            dfs.append(df)
        except pd.errors.EmptyDataError:
            os.remove(f)
            deleted += 1
        except Exception as e:
            print(f'警告: {os.path.basename(f)} 读取出错: {e}')

    if deleted > 0:
        print(f'已删除 {deleted} 个空文件')

    if not dfs:
        print('错误: 没有成功读取任何 CSV 文件')
        sys.exit(1)

    merged = pd.concat(dfs, ignore_index=True)
    print(f'已读取 {len(dfs)} 个有效 CSV 文件')
    print(f'共 {len(merged)} 条记录')
    return merged


# ============================================================
# 第二步：统一列名
# ============================================================

def normalize_columns(df):
    """根据实际 CSV 列名映射为标准名称"""
    print(f'原始列名: {list(df.columns)}')

    COLUMN_RULES = {
        'stock_code':      ['股票代码'],
        'stock_name':      ['股票简称'],
        'close_price':     ['收盘价:前复权', '收盘价', '最新价'],
        'buy_amount':      ['当日龙虎榜买入金额', '营业部买入金额合计', '买入金额'],
        'net_amount':      ['当日龙虎榜净额', '龙虎榜净额', '净额'],
        'sell_amount':     ['当日龙虎榜卖出金额', '龙虎榜卖出金额', '卖出金额'],
        'list_reason':     ['当日上榜原因', '上榜原因'],
        'list_type':       ['龙虎榜上榜类型', '上榜类型'],
        'listing_days':    ['上市交易日天数', '上市天数'],
        'change_pct':      ['涨跌幅:前复权', '最新涨跌幅', '涨跌幅'],
        'limit_up_reason': ['涨停原因类别', '涨停原因'],
        'net_buy_ratio':   ['当日龙虎榜净额/当日龙虎榜买入金额', '净额/买入额'],
        'net_buy_rank':    ['当日龙虎榜净额/当日龙虎榜买入金额排名', '净买比排名'],
        'market_cap':      ['a股市值不含限售股', '流通市值'],
        'open_price':      ['开盘价:前复权', '开盘价'],
        'high_price':      ['最高价:前复权', '最高价'],
        'low_price':       ['最低价:前复权', '最低价'],
        'amplitude':       ['振幅', '振幅%'],
        'volume':          ['成交量'],
    }

    rename_map = {}
    missing = []

    for std_name, candidates in COLUMN_RULES.items():
        found = False
        for candidate in candidates:
            if candidate in df.columns:
                rename_map[candidate] = std_name
                found = True
                break
            fuzzy = [c for c in df.columns if candidate in c]
            if fuzzy:
                rename_map[fuzzy[0]] = std_name
                found = True
                break
        if not found:
            missing.append(std_name)

    if missing:
        print(f'提示: 以下可选字段未找到: {missing}')

    df = df.rename(columns=rename_map)

    # 数值列
    numeric_cols = ['close_price', 'buy_amount', 'net_amount', 'sell_amount',
                    'change_pct', 'net_buy_ratio', 'market_cap',
                    'amplitude', 'volume', 'listing_days',
                    'open_price', 'high_price', 'low_price']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # 解析净买比排名“4/99”格式
    if 'net_buy_rank' in df.columns:
        df['net_buy_rank_num'] = df['net_buy_rank'].astype(str).str.extract(r'(\d+)')[0]
        df['net_buy_rank_num'] = pd.to_numeric(df['net_buy_rank_num'], errors='coerce')

    # 去重
    dedup_cols = ['stock_code', 'trade_date']
    if 'list_type' in df.columns:
        dedup_cols.append('list_type')
    if 'list_reason' in df.columns:
        dedup_cols.append('list_reason')
    before = len(df)
    df = df.drop_duplicates(subset=dedup_cols, keep='last')
    if len(df) < before:
        print(f'去重: {before} -> {len(df)} 条')

    print(f'数据范围: {df["trade_date"].min()} ~ {df["trade_date"].max()}')
    print(f'覆盖个股: {df["stock_code"].nunique()} 只')
    return df


# ============================================================
# 第三步：构建个股特征
# ============================================================

def build_stock_features(df):
    """为每只股票构建特征"""
    today = datetime.now()
    recent_cutoff = (today - timedelta(days=30)).strftime('%Y-%m-%d')

    features = []
    for code, group in df.groupby('stock_code'):
        dates = sorted(group['trade_date'].dropna().unique())
        if len(dates) == 0:
            continue

        date_objs = [datetime.strptime(str(d), '%Y-%m-%d') for d in dates]
        latest = group.sort_values('trade_date').iloc[-1]

        feat = {
            'stock_code': code,
            'stock_name': latest.get('stock_name', ''),
            'total_appearances': len(dates),
            'first_appear_date': dates[0],
            'last_appear_date': dates[-1],
            'days_since_last': (today - date_objs[-1]).days,
        }

        # ====== 资金数据（核心） ======

        # 净买比：资金意图最核心的指标
        if 'net_buy_ratio' in group.columns:
            valid = group['net_buy_ratio'].dropna()
            feat['avg_net_buy_ratio'] = valid.mean() if len(valid) > 0 else 0
            feat['max_net_buy_ratio'] = valid.max() if len(valid) > 0 else 0
            # 净买比为正的次数占比（资金一致性）
            feat['positive_net_ratio'] = (valid > 0).sum() / len(valid) if len(valid) > 0 else 0
        else:
            feat['avg_net_buy_ratio'] = 0
            feat['max_net_buy_ratio'] = 0
            feat['positive_net_ratio'] = 0

        # 净额统计
        if 'net_amount' in group.columns:
            valid = group['net_amount'].dropna()
            feat['total_net_amount'] = valid.sum()
            feat['avg_net_amount'] = valid.mean() if len(valid) > 0 else 0
        else:
            feat['total_net_amount'] = 0
            feat['avg_net_amount'] = 0

        # 买入金额
        if 'buy_amount' in group.columns:
            valid = group['buy_amount'].dropna()
            feat['total_buy_amount'] = valid.sum()
        else:
            feat['total_buy_amount'] = 0

        # 净买比排名
        if 'net_buy_rank_num' in group.columns:
            valid = group['net_buy_rank_num'].dropna()
            feat['avg_net_buy_rank'] = valid.mean() if len(valid) > 0 else 99
            feat['best_net_buy_rank'] = valid.min() if len(valid) > 0 else 99
        else:
            feat['avg_net_buy_rank'] = 99
            feat['best_net_buy_rank'] = 99

        # ====== 上榜类型 ======

        if 'list_type' in group.columns:
            three_day = group['list_type'].str.contains('三日', na=False).sum()
            feat['three_day_ratio'] = round(three_day / len(group), 2)
        else:
            feat['three_day_ratio'] = 0

        # ====== 涨跌幅 ======

        if 'change_pct' in group.columns:
            valid = group['change_pct'].dropna()
            feat['avg_change_pct'] = valid.mean() if len(valid) > 0 else 0
            feat['max_change_pct'] = valid.max() if len(valid) > 0 else 0
        else:
            feat['avg_change_pct'] = 0
            feat['max_change_pct'] = 0

        # ====== 市值 ======

        if 'market_cap' in group.columns:
            valid = group['market_cap'].dropna()
            feat['last_market_cap'] = valid.iloc[-1] if len(valid) > 0 else 0
        else:
            feat['last_market_cap'] = 0

        # ====== 收盘价 ======

        if 'close_price' in group.columns:
            valid = group['close_price'].dropna()
            feat['last_close_price'] = valid.iloc[-1] if len(valid) > 0 else None
        else:
            feat['last_close_price'] = None

        # ====== 涨停原因/题材 ======

        if 'limit_up_reason' in group.columns:
            themes = group['limit_up_reason'].dropna()
            feat['main_themes'] = themes.iloc[-1] if len(themes) > 0 else ''
        else:
            feat['main_themes'] = ''

        # ====== 上榜原因 ======

        if 'list_reason' in group.columns:
            reasons = group['list_reason'].dropna()
            # 统计涨停上榜的比例
            limit_up_count = reasons.str.contains('涨幅偏离', na=False).sum()
            feat['limit_up_list_ratio'] = limit_up_count / len(reasons) if len(reasons) > 0 else 0
            feat['last_list_reason'] = reasons.iloc[-1] if len(reasons) > 0 else ''
        else:
            feat['limit_up_list_ratio'] = 0
            feat['last_list_reason'] = ''

        # ====== 上榜间隔分析 ======

        if len(dates) >= 2:
            gaps = [(date_objs[i+1] - date_objs[i]).days
                    for i in range(len(date_objs)-1)]
            feat['avg_gap_days'] = round(np.mean(gaps), 1)
            feat['max_gap_days'] = max(gaps)
            feat['recent_gap_days'] = gaps[-1]
        else:
            feat['avg_gap_days'] = 0
            feat['max_gap_days'] = 0
            feat['recent_gap_days'] = 0

        # 近期活跃度
        feat['recent_30d_count'] = len(
            [d for d in dates if str(d) >= recent_cutoff]
        )

        features.append(feat)

    return pd.DataFrame(features)


# ============================================================
# 第四步：龙头评分
# ============================================================

def calculate_dragon_score(feat_df):
    """
    龙头评分：满分 100

    评分维度：
    1) 资金强度 (0~30): 净买比 + 累计净买入 + 净买比排名
    2) 持续性   (0~20): 上榜次数 + 三日榜占比 + 资金一致性
    3) 模式匹配 (0~30): 洗盘间隔 + 净买比强势 + 涨停上榜比例
    4) 市值权重 (0~10): 小市值优先
    5) 时效衰减 (0~-10): 距今越久扣分越多
    """
    if len(feat_df) == 0:
        return feat_df

    scores = pd.DataFrame(index=feat_df.index)

    # 1) 资金强度分 (0~30)
    scores['fund'] = (
        feat_df['avg_net_buy_ratio'].clip(0, 1) * 15 +       # 净买比越高越好
        feat_df['total_net_amount'].rank(pct=True) * 10 +    # 累计净买入越多越好
        (1 - feat_df['avg_net_buy_rank'].clip(1, 99).rank(pct=True)) * 5  # 排名越前越好
    )

    # 2) 持续性分 (0~20)
    scores['persist'] = (
        feat_df['total_appearances'].clip(upper=15).rank(pct=True) * 8 +   # 多次上榜
        feat_df['three_day_ratio'] * 6 +              # 三日榜占比高 = 连续强势
        feat_df['positive_net_ratio'] * 6             # 净买比为正的次数占比
    )

    # 3) 模式匹配分 (0~30) — 核心
    scores['pattern'] = 0.0

    # 有过 5~30 天的洗盘间隔
    has_wash = (
        (feat_df['max_gap_days'] >= 5) &
        (feat_df['max_gap_days'] <= 30)
    )
    scores.loc[has_wash, 'pattern'] += 8

    # 多次上榜 + 洗盘间隔 + 净买比为正 = 典型庄家吸筹模式
    strong_wash = has_wash & (feat_df['total_appearances'] >= 3) & (feat_df['avg_net_buy_ratio'] > 0.15)
    scores.loc[strong_wash, 'pattern'] += 7

    # 净买比 > 30% = 买方极度坚决
    scores.loc[feat_df['avg_net_buy_ratio'] > 0.3, 'pattern'] += 5

    # 涨停上榜占比高 = 强势股特征
    scores['pattern'] += feat_df['limit_up_list_ratio'] * 5

    # 累计净买入为正 = 主力持续吸筹
    scores.loc[feat_df['total_net_amount'] > 0, 'pattern'] += 5

    # 4) 市值权重 (0~10)
    valid_cap = feat_df['last_market_cap'].replace(0, np.nan)
    scores['cap'] = (1 - valid_cap.rank(pct=True).fillna(0.5)) * 10

    # 5) 时效衰减：距今超过 30 天扣分，最多扣 10 分
    decay = feat_df['days_since_last'].clip(0, 60).apply(
        lambda d: 0 if d <= 30 else -min((d - 30) / 3, 10)
    )
    scores['decay'] = decay

    feat_df['dragon_score'] = (
        scores['fund'] + scores['persist'] +
        scores['pattern'] + scores['cap'] + scores['decay']
    ).clip(lower=0).round(1)

    feat_df['score_fund'] = scores['fund'].round(1)
    feat_df['score_persist'] = scores['persist'].round(1)
    feat_df['score_pattern'] = scores['pattern'].round(1)
    feat_df['score_cap'] = scores['cap'].round(1)
    feat_df['score_decay'] = scores['decay'].round(1)

    return feat_df


# ============================================================
# 第五步：阶段判定
# ============================================================

def determine_stage(feat_df):
    """
    判定当前阶段：
    - 🔴 首次上榜：只出现过1次
    - ⚪ 已过热：30天内上榜超过6次
    - 🟢 二次启动信号：沉寂一段时间后再次上榜，且净买入为正
    - 🟡 洗盘观察期：多次上榜，最近沉寂5~30天
    - ⚫ 已冷却：距今超过30天
    - 🔵 持续活跃：其他
    """
    stages = []
    for _, row in feat_df.iterrows():
        d = row['days_since_last']

        if row['total_appearances'] == 1:
            stage = '🔴 首次上榜'
        elif row['recent_30d_count'] >= 6:
            stage = '⚪ 已过热'
        elif d <= 3 and row.get('recent_gap_days', 0) >= 5 and row.get('avg_net_buy_ratio', 0) > 0:
            stage = '🟢 二次启动信号'
        elif 5 <= d <= 30 and row['total_appearances'] >= 2:
            stage = '🟡 洗盘观察期'
        elif d > 30:
            stage = '⚫ 已冷却'
        else:
            stage = '🔵 持续活跃'

        stages.append(stage)

    feat_df['current_stage'] = stages
    return feat_df


# ============================================================
# 第六步：输出报告
# ============================================================

def print_report(feat_df):
    """打印分析报告"""
    print('\n' + '=' * 75)
    print(f'  龙头评分报告  ({datetime.now().strftime("%Y-%m-%d %H:%M")})')
    print('=' * 75)

    # 阶段分布
    print(f'\n阶段分布:')
    stage_counts = feat_df['current_stage'].value_counts()
    for stage, count in stage_counts.items():
        print(f'   {stage}: {count} 只')

    # 二次启动信号
    launch = feat_df[feat_df['current_stage'] == '🟢 二次启动信号']
    if len(launch) > 0:
        print(f'\n{"=" * 75}')
        print(f'  🟢 二次启动信号 ({len(launch)} 只) — 重点关注!')
        print(f'{"=" * 75}')
        for _, r in launch.head(20).iterrows():
            themes = str(r.get('main_themes', ''))[:25]
            print(f'   {r["stock_code"]:>10}  {r["stock_name"]:<8}'
                  f'  评分:{r["dragon_score"]:>5}  '
                  f'上榜{r["total_appearances"]}次  '
                  f'间隔{r["recent_gap_days"]}天  '
                  f'净买比{r["avg_net_buy_ratio"]:.1%}  '
                  f'累计净买{r["total_net_amount"]/1e8:.1f}亿  '
                  f'{themes}')
    else:
        print(f'\n  🟢 二次启动信号: 暂无')

    # 洗盘观察期 TOP 20
    wash = feat_df[feat_df['current_stage'] == '🟡 洗盘观察期']
    if len(wash) > 0:
        print(f'\n{"=" * 75}')
        print(f'  🟡 洗盘观察期 TOP 20 ({len(wash)} 只) — 等待启动')
        print(f'{"=" * 75}')
        for _, r in wash.head(20).iterrows():
            themes = str(r.get('main_themes', ''))[:25]
            print(f'   {r["stock_code"]:>10}  {r["stock_name"]:<8}'
                  f'  评分:{r["dragon_score"]:>5}  '
                  f'上榜{r["total_appearances"]}次  '
                  f'沉寂{r["days_since_last"]}天  '
                  f'净买比{r["avg_net_buy_ratio"]:.1%}  '
                  f'累计净买{r["total_net_amount"]/1e8:.1f}亿  '
                  f'{themes}')

    # 总评分 TOP 20
    print(f'\n{"=" * 75}')
    print(f'  龙头评分 TOP 20')
    print(f'{"=" * 75}')
    for _, r in feat_df.head(20).iterrows():
        themes = str(r.get('main_themes', ''))[:25]
        print(f'   {r["stock_code"]:>10}  {r["stock_name"]:<8}'
              f'  评分:{r["dragon_score"]:>5}  '
              f'{r["current_stage"]:<12}  '
              f'上榜{r["total_appearances"]}次  '
              f'净买比{r["avg_net_buy_ratio"]:.1%}  '
              f'累计净买{r["total_net_amount"]/1e8:.1f}亿  '
              f'{themes}')


def save_results(feat_df, output_dir='.'):
    """保存结果文件"""
    csv_path = os.path.join(output_dir, 'stock_scores.csv')
    feat_df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f'\n完整评分已保存: {csv_path}')

    md_path = os.path.join(output_dir, 'REPORT.md')
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(f'# 龙虎榜龙头评分报告\n\n')
        f.write(f'> 更新时间: {datetime.now().strftime("%Y-%m-%d %H:%M")}\n\n')

        # 阶段分布
        f.write('## 阶段分布\n\n')
        stage_counts = feat_df['current_stage'].value_counts()
        for stage, count in stage_counts.items():
            f.write(f'- {stage}: {count} 只\n')

        # 二次启动信号
        launch = feat_df[feat_df['current_stage'] == '🟢 二次启动信号']
        if len(launch) > 0:
            f.write(f'\n## 🟢 二次启动信号 ({len(launch)} 只)\n\n')
            f.write('| 代码 | 名称 | 评分 | 上榜次数 | 间隔天数 | 净买比 | 累计净买(亿) | 题材 |\n')
            f.write('|------|------|------|----------|----------|--------|------------|------|\n')
            for _, r in launch.head(30).iterrows():
                themes = str(r.get('main_themes', ''))[:35]
                f.write(f'| {r["stock_code"]} | {r["stock_name"]} '
                        f'| {r["dragon_score"]} | {r["total_appearances"]} '
                        f'| {r["recent_gap_days"]} | {r["avg_net_buy_ratio"]:.1%} '
                        f'| {r["total_net_amount"]/1e8:.1f} | {themes} |\n')

        # 洗盘观察期
        wash = feat_df[feat_df['current_stage'] == '🟡 洗盘观察期']
        if len(wash) > 0:
            f.write(f'\n## 🟡 洗盘观察期 TOP 30 ({len(wash)} 只)\n\n')
            f.write('| 代码 | 名称 | 评分 | 上榜次数 | 沉寂天数 | 净买比 | 累计净买(亿) | 题材 |\n')
            f.write('|------|------|------|----------|----------|--------|------------|------|\n')
            for _, r in wash.head(30).iterrows():
                themes = str(r.get('main_themes', ''))[:35]
                f.write(f'| {r["stock_code"]} | {r["stock_name"]} '
                        f'| {r["dragon_score"]} | {r["total_appearances"]} '
                        f'| {r["days_since_last"]} | {r["avg_net_buy_ratio"]:.1%} '
                        f'| {r["total_net_amount"]/1e8:.1f} | {themes} |\n')

        # TOP 30 评分
        f.write(f'\n## 🏆 龙头评分 TOP 30\n\n')
        f.write('| 代码 | 名称 | 评分 | 阶段 | 上榜次数 | 净买比 | 累计净买(亿) | 三日榜% | 题材 |\n')
        f.write('|------|------|------|------|----------|--------|------------|---------|------|\n')
        for _, r in feat_df.head(30).iterrows():
            themes = str(r.get('main_themes', ''))[:35]
            f.write(f'| {r["stock_code"]} | {r["stock_name"]} '
                    f'| {r["dragon_score"]} | {r["current_stage"]} '
                    f'| {r["total_appearances"]} | {r["avg_net_buy_ratio"]:.1%} '
                    f'| {r["total_net_amount"]/1e8:.1f} | {r["three_day_ratio"]:.0%} '
                    f'| {themes} |\n')

    print(f'Markdown 报告已保存: {md_path}')


# ============================================================
# 主流程
# ============================================================

def main():
    data_dir = sys.argv[1] if len(sys.argv) > 1 else '.'

    print(f'数据目录: {os.path.abspath(data_dir)}')
    print(f'运行时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n')

    # 1. 读取所有 CSV
    raw_df = load_all_csv(data_dir)

    # 2. 统一列名
    df = normalize_columns(raw_df)

    # 3. 构建特征
    print(f'\n正在分析...')
    feat_df = build_stock_features(df)

    # 4. 评分
    feat_df = calculate_dragon_score(feat_df)

    # 5. 阶段判定
    feat_df = determine_stage(feat_df)

    # 6. 排序
    feat_df = feat_df.sort_values('dragon_score', ascending=False)

    # 7. 输出
    print_report(feat_df)
    save_results(feat_df, data_dir)

    print(f'\n共 {len(feat_df)} 只个股已评分')


if __name__ == '__main__':
    main()
