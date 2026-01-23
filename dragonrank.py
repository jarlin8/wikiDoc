import pywencai
import pandas as pd
import datetime
import os
import re

# 设置 hexin-v.js 文件的路径
hexin_v_file = os.path.join(os.path.dirname(__file__),'hexin-v.js')

# 获取当前日期
today = datetime.datetime.now()
mtime = today.strftime("%Y%m%d")

# 使用 pywencai 获取股市数据
data = pywencai.get(query='中信建投证券股份有限公司上海浦东南路证券营业部或财通证券股份有限公司杭州上塘路证券营业部,非次新股,非创业板,非北交所',query_type='stock',loop=True)

# 将数据转换为 DataFrame
df = pd.DataFrame(data)

# 删除不需要的列
columns_to_drop = ['股票市场类型','经营范围','上市板块','注册地址','market_code']
df.drop(columns=columns_to_drop,inplace=True,errors='ignore')

# 修饰表头，去除 [数字] 模式以及 {} 和 ()
df.columns = [re.sub(r'\[\d+\]|\{|\}|\(|\)','',col) for col in df.columns]

# 文件路径
file_path = './docs/dragon_' + mtime + '.csv'

# 尝试读取现有数据，如果文件不存在则创建一个空 DataFrame
try:
    original_data = pd.read_csv(file_path)
except FileNotFoundError:
    original_data = pd.DataFrame()

# 合并新旧数据
data = pd.concat([original_data,df],ignore_index=True)

# 将合并后的数据保存为 CSV 文件
data.to_csv(file_path,mode='w',index=False,header=True,encoding='utf-8-sig')