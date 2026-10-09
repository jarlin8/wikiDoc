# -*- coding: utf-8 -*-
"""为 4 篇支柱页补 image 字段（指向各自的 1200x630 分享图）"""
import re
from pathlib import Path

DOCS = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\docs")
FM = re.compile(r"^---\r?\n(.*?)\r?\n---", re.DOTALL)

MAP = {
    "guides/exness-regulation": "/img/og/exness-regulation.png",
    "guides/exness-deposit-withdrawal": "/img/og/exness-deposit-withdrawal.png",
    "guides/exness-platforms": "/img/og/exness-platforms.png",
    "guides/exness-account-types": "/img/og/exness-account-types.png",
}


def set_field(fm, key, value):
    line = '%s: "%s"' % (key, value)
    pat = re.compile(r"(?m)^%s:.*$" % re.escape(key))
    if pat.search(fm):
        return pat.sub(lambda m: line, fm, count=1)
    tp = re.compile(r"(?m)^title:.*$")
    return tp.sub(lambda m: m.group(0) + "\n" + line, fm, count=1)


for doc_id, img in MAP.items():
    f = DOCS / (doc_id + ".mdx")
    raw = f.read_bytes().decode("utf-8")
    norm = raw.replace("\r\n", "\n").replace("\r", "\n")
    m = FM.match(norm)
    fm = set_field(m.group(1), "image", img)
    f.write_bytes((norm[: m.start(1)] + fm + norm[m.end(1):]).replace("\n", "\r\n").encode("utf-8"))
    print("  ✅ %-34s %s" % (doc_id, img))
