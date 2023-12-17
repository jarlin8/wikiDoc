import pywencai
import pandas as pd
from tabulate import tabulate
import datetime
import os

hexin_v_file = os.path.join(os.path.dirname(__file__), 'hexin-v.js')

today = datetime.datetime.now()
mtime = today.strftime("%Y%m%d")

data = pywencai.get(query='当日龙虎榜净额大于0，非st的股票，非创业板，非科创板，非北交所，非新股,涨幅大于0,(当日龙虎榜净额/当日龙虎榜买入金额)从大到小列出', query_type='stock', loop=True)

df = pd.DataFrame(data)

df = df[['股票代码','股票简称','最新价']]

try:
    original_data = pd.read_csv('./docs/data_'+mtime+'.csv')
except FileNotFoundError:
    original_data = pd.DataFrame()


data = pd.concat([original_data, df], ignore_index=True)

# 将数据保存为CSV文件

data.to_csv('./docs/data_'+mtime+'.csv', mode='a', index=False, header=True, encoding='utf-8-sig')

try:
    original_data = pd.read_csv('./docs/data_'+mtime+'.csv')
except FileNotFoundError:
    original_data = pd.DataFrame()
data = pd.concat([original_data, df], ignore_index=True)