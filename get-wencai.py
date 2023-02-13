import pywencai
import pandas as pd
from tabulate import tabulate
import datetime
import os

hexin_v_file = os.path.join(os.path.dirname(__file__), 'hexin-v.js')

today = datetime.datetime.now()
mtime = today.strftime("%Y%m%d")

data = pywencai.get(question='龙虎榜买入排序且龙虎榜买入大于8000万，非科创板，非ST，非创业板，市值小于500亿，上市时间超过180天，MA10>MA30>MA60且市净率大于1，每股净资产大于1,净利润同比增长，股价小于30，非钢铁，非金融，非房地产，非有色，非造纸')

df = pd.DataFrame(data)

df = df[['股票代码','股票简称', '营业部买入金额合计[{}]'.format(mtime), '营业部买入金额合计排名[{}]'.format(mtime),
       '最新涨跌幅','a股市值(不含限售股)[{}]'.format(mtime),'收盘价:不复权[{}]'.format(mtime),'总市值[{}]'.format(mtime),'市净率(pb)[{}]'.format(mtime)]]

try:
    original_data = pd.read_csv('stock_data.csv')
except FileNotFoundError:
    original_data = pd.DataFrame()


data = pd.concat([original_data, df], ignore_index=True)

# 将数据保存为CSV文件

data.to_csv('stock_data.csv', mode='a', index=False, header=True, encoding='utf-8-sig')

try:
    original_data = pd.read_csv('stock_data.md')
except FileNotFoundError:
    original_data = pd.DataFrame()
data = pd.concat([original_data, df], ignore_index=True)

# 保存为.md格式
with open("stock_data.md", "a", encoding="utf-8") as f:
    f.write("---\n")
    f.write(df.to_markdown())