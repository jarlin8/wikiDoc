# -*- coding: utf-8 -*-
"""补齐最后 4 篇偏短的 description"""
import re
from pathlib import Path

DOCS = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\docs")
FM = re.compile(r"^---\r?\n(.*?)\r?\n---", re.DOTALL)

FIX = {
    "nytimes/美硕移民":
        "美国硕士留学申请的经验记录：选校定位、材料准备、申请时间线与签证面试各环节的风险与注意事项。",
    "exness-agent/先锋账户":
        "先锋账户（合作伙伴佣金）说明：无后缀品种的适用范围、佣金比例的计算方式与具体示例。",
    "exness-trader/exness-vps-使用须知":
        "Exness VPS 使用须知：服务用途、适用条件、连接与登录方式，以及使用中的常见问题解答。",
    "exness-trader/文件被拒绝后如何再次上传":
        "验证文件被拒绝后如何重新上传：常见拒绝原因、文件格式与大小要求，以及重新提交的完整步骤。",
}

for doc_id, desc in FIX.items():
    f = DOCS / (doc_id + ".mdx")
    raw = f.read_bytes().decode("utf-8")
    norm = raw.replace("\r\n", "\n").replace("\r", "\n")
    m = FM.match(norm)
    fm = re.sub(r"(?m)^description:.*$", 'description: "%s"' % desc, m.group(1), count=1)
    f.write_bytes((norm[: m.start(1)] + fm + norm[m.end(1):]).replace("\n", "\r\n").encode("utf-8"))
    print("  ✅", doc_id, "->", len(desc), "字")
