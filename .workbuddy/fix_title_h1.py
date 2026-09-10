# -*- coding: utf-8 -*-
"""任务14：重复 title 消歧 + 正文双 H1 修复"""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
FM_RE = re.compile(r"^---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

# ---------- 1) 重复 title 消歧（exness-agent 版为“合作伙伴佣金”视角）----------
TITLE_FIX = {
    "docs/exness-agent/标准账户.mdx": "标准账户（合作伙伴佣金）",
    "docs/exness-agent/先锋账户.mdx": "先锋账户（合作伙伴佣金）",
    "docs/exness-agent/美分账户.mdx": "美分账户（合作伙伴佣金）",
}
for rel, new_title in TITLE_FIX.items():
    p = ROOT / rel
    norm = p.read_bytes().decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
    m = FM_RE.match(norm)
    fm = m.group(1)
    fm2 = re.sub(r"(?m)^title:\s*.*$", 'title: "%s"' % new_title, fm)
    norm2 = norm[: m.start(1)] + fm2 + norm[m.end(1):]
    p.write_bytes(norm2.replace("\n", "\r\n").encode("utf-8"))
    print(f"标题更新: {rel} -> {new_title}")


# ---------- 2) 正文双 H1 ----------
def strip_md(s):
    s = s.strip()
    s = re.sub(r"\s*#+\s*$", "", s)
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"`(.+?)`", r"\1", s)
    return s.strip()


def norm_key(s):
    return re.sub(r"[\s，,。.、：:\-—–]+", "", strip_md(s)).lower()


H1_FILES = [
    "docs/exness-trader/指数交易.mdx",
    "docs/nytimes/concise-vs-natrue.mdx",
    "docs/nytimes/MQ4各种函数参数笔记.mdx",
    "docs/nytimes/prm写作风格和语调.mdx",
    "docs/nytimes/美硕移民.mdx",
    "docs/nytimes/赴美零碎知识点.mdx",
]

for rel in H1_FILES:
    p = ROOT / rel
    norm = p.read_bytes().decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")
    m = FM_RE.match(norm)
    title = ""
    if m:
        tt = re.search(r"(?m)^title:\s*(.*)$", m.group(1))
        if tt:
            title = strip_md(tt.group(1).strip().strip("\"'"))
    lines = norm.split("\n")
    out = []
    done = False
    for i, ln in enumerate(lines):
        if not done and re.match(r"^#\s+", ln):
            h1_text = re.sub(r"^#\s+", "", ln)
            key_h1 = norm_key(h1_text)
            key_t = norm_key(title)
            is_dup = key_h1 == key_t or key_h1.startswith(key_t) and key_t
            is_center = "帮助中心" in h1_text
            if is_dup or is_center:
                # 删除该行；若下一行为空且上一行也为空，避免三空行
                if out and out[-1].strip() == "" and i + 1 < len(lines) and lines[i + 1].strip() == "":
                    continue
                print(f"  删除冗余 H1: {rel}: {h1_text[:40]}  (title={title})")
                continue
            else:
                out.append("## " + h1_text)
                print(f"  降级 H1→H2: {rel}: {h1_text[:40]}")
                done = True
                continue
        out.append(ln)
    p.write_bytes("\n".join(out).replace("\n", "\r\n").encode("utf-8"))

print("完成")
