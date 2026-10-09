import pywencai
import pandas as pd
import datetime
import os
import re

# 问财自 2025 年起强制要求登录 cookie，否则 WAF 直接返回 403（openresty 拦截页）。
# cookie 通过环境变量 WENCAI_COOKIE 注入：
#   - 本地运行：PowerShell 先执行 $env:WENCAI_COOKIE='<从浏览器复制的整段 Cookie>'
#   - GitHub Actions：repo Secrets 里配 WENCAI_COOKIE，workflow 已注入同名 env
cookie = os.environ.get('WENCAI_COOKIE', '').strip()
if not cookie:
    raise SystemExit(
        '[wencai] 缺少 WENCAI_COOKIE 环境变量。问财已强制要求登录 cookie，'
        '请在浏览器登录 iwencai.com 后，F12 -> Network -> 任一请求 -> 复制 Cookie 请求头。'
    )

# 获取当前日期（用于输出文件名）
today = datetime.datetime.now()
mtime = today.strftime("%Y%m%d")

# 使用 pywencai 获取股市数据
# log=True 让 pywencai 打印重试日志（默认它会把 10 次重试的真实异常全部吞掉）
try:
    data = pywencai.get(
        query='龙虎榜净额大于0,非退市非st非创业板非科创板非北交所非次新股,涨幅大于-8%,涨停原因,(当日龙虎榜净额/当日龙虎榜买入金额)从大到小列出',
        query_type='stock', loop=True, cookie=cookie, log=True
    )
except AttributeError as e:
    # pywencai 内部：get_robot_data 重试 10 次全失败返回 None -> params.get('data') 崩溃
    # 真实原因几乎只有两个：cookie 失效 或 出口 IP 被 WAF 拦截
    raise SystemExit(
        '[wencai] pywencai 请求失败（内部重试 10 次均未成功）。'
        '常见原因：1) WENCAI_COOKIE 已失效或无效，重新从浏览器抓取；'
        '2) 出口 IP 被问财 WAF 拦截（GitHub Actions/云服务器为境外或机房 IP，风险高，建议本地跑）。'
        f'原始异常：{e}'
    ) from e

if data is None:
    raise SystemExit('[wencai] pywencai 返回空结果，脚本终止。')

# 将数据转换为 DataFrame
df = pd.DataFrame(data)

# 删除不需要的列
columns_to_drop = ['股票市场类型','经营范围','上市板块','注册地址','market_code']
df.drop(columns=columns_to_drop,inplace=True,errors='ignore')

# 修饰表头，去除 [数字] 模式以及 {} 和 ()
df.columns = [re.sub(r'\[\d+\]|\{|\}|\(|\)','',col) for col in df.columns]

# 文件路径
# 原先输出到 ./docs/ —— 那是 Docusaurus 的内容目录，且文件名带日期戳会无限累积，
# 每次提交都会触发 425 页站点的全量重建。改到 ./data/ 并与站点解耦。
os.makedirs('./data', exist_ok=True)
file_path = './data/wencai_' + mtime + '.csv'

# 尝试读取现有数据，如果文件不存在则创建一个空 DataFrame
try:
    original_data = pd.read_csv(file_path)
except FileNotFoundError:
    original_data = pd.DataFrame()

# 合并新旧数据
data = pd.concat([original_data,df],ignore_index=True)

# 将合并后的数据保存为 CSV 文件
data.to_csv(file_path,mode='w',index=False,header=True,encoding='utf-8-sig')
