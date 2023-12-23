import pywencai
import pandas as pd
import datetime
import os

# 设置 hexin-v.js 文件的路径
hexin_v_file = os.path.join(os.path.dirname(__file__), 'hexin-v.js')

# 获取当前日期
today = datetime.datetime.now()
mtime = today.strftime("%Y%m%d")

# 使用 pywencai 获取股市数据
data = pywencai.get(query='当日龙虎榜净额大于0，非st的股票，非创业板，非科创板，非北交所，非新股,涨幅大于0,(当日龙虎榜净额/当日龙虎榜买入金额)从大到小列出', query_type='stock', loop=True)

# 将数据转换为 DataFrame
df = pd.DataFrame(data)

# 文件路径
file_path = './docs/data_' + mtime + '.csv'

# 尝试读取现有数据，如果文件不存在则创建一个空 DataFrame
try:
    original_data = pd.read_csv(file_path)
except FileNotFoundError:
    original_data = pd.DataFrame()

# 合并新旧数据
data = pd.concat([original_data, df], ignore_index=True)

# 将合并后的数据保存为 CSV 文件
data.to_csv(file_path, mode='w', index=False, header=True, encoding='utf-8-sig')