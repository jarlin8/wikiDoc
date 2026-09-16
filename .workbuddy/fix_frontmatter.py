# -*- coding: utf-8 -*-
"""
批量 frontmatter 修复：
 ① date 字段取值 -> git 中的真实「首次添加日期」（原值 2023-01-10 是从源站抄来的假日期，
    且被 swizzle 组件用于 JSON-LD datePublished）
 ② 删除无作用的 background 字段
 ③ 压缩 6 个超长 title（>30 汉字），并为它们补 sidebar_label 保持侧栏可读
"""
import re
import subprocess
from pathlib import Path

ROOT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc")
DOCS = ROOT / "docs"
FM = re.compile(r"^---\r?\n(.*?)\r?\n---", re.DOTALL)
DRYRUN = False

# ---------- ① 取 git 首次添加日期 ----------
out = subprocess.run(
    ["git", "-c", "core.quotepath=false", "log", "--diff-filter=A",
     "--name-only", "--format=COMMIT%as", "--", "docs/"],
    cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace",
).stdout

add_date = {}
cur = None
for line in out.splitlines():
    line = line.strip()
    if line.startswith("COMMIT"):
        cur = line[6:]
    elif line.startswith("docs/") and line.endswith(".mdx") and cur:
        add_date.setdefault(line, cur)   # 取最早一次（log 为倒序，setdefault 保留最后赋的=最早）

# log 是倒序输出，最早的在最后 -> setdefault 保留的是第一次遇到=最新。改为取最小值
add_date2 = {}
for line in out.splitlines():
    line = line.strip()
    if line.startswith("COMMIT"):
        cur = line[6:]
    elif line.startswith("docs/") and line.endswith(".mdx") and cur:
        k = line
        if k not in add_date2 or cur < add_date2[k]:
            add_date2[k] = cur
add_date = add_date2
print("git 添加日期表条目:", len(add_date))
from collections import Counter
print("日期分布:", dict(Counter(add_date.values())))
print()

# ---------- ③ 超长标题重写 ----------
TITLE_FIX = {
    "guides/exness-platforms": "Exness 交易平台怎么选：MT4、MT5、网页与 App",
    "exness-trader/exness-交易应用-如何更改-exness-交易应用的语言设置":
        "Exness 交易应用：如何更改语言设置",
    "exness-trader/exness-交易应用-为何我在进行入金操作时找不到我的":
        "Exness 交易应用入金时找不到账户怎么办",
    "guides/exness-account-types": "Exness 账户类型怎么选：成本结构对比",
    "exness-trader/如何将我在社交交易中的入金与我的-exness-账户关联起":
        "社交交易的入金如何关联到 Exness 账户",
    "exness-trader/如何使用-mt4-multiterminal多账户管理终端":
        "MT4 Multiterminal 多账户管理终端怎么用",
}


def set_field(fm, key, value):
    line = '%s: "%s"' % (key, value)
    pat = re.compile(r"(?m)^%s:.*$" % re.escape(key))
    if pat.search(fm):
        return pat.sub(lambda m: line, fm, count=1)
    tp = re.compile(r"(?m)^title:.*$")
    if tp.search(fm):
        return tp.sub(lambda m: m.group(0) + "\n" + line, fm, count=1)
    return line + "\n" + fm


def drop_field(fm, key):
    return re.sub(r"(?m)^%s:.*\n?" % re.escape(key), "", fm)


stat = {"date": 0, "bg": 0, "title": 0}

for f in sorted(DOCS.rglob("*.mdx")):
    doc_id = str(f.relative_to(DOCS).with_suffix("")).replace("\\", "/")
    raw = f.read_bytes().decode("utf-8")
    norm = raw.replace("\r\n", "\n").replace("\r", "\n")
    m = FM.match(norm)
    if not m:
        continue
    fm = m.group(1)
    orig = fm

    # ③ 标题
    if doc_id in TITLE_FIX:
        old = re.search(r"(?m)^title:\s*(.*)$", fm)
        old_title = old.group(1).strip().strip('"') if old else ""
        if not re.search(r"(?m)^sidebar_label:", fm):
            fm = set_field(fm, "sidebar_label", old_title)
        fm = set_field(fm, "title", TITLE_FIX[doc_id])
        stat["title"] += 1

    # ① date
    rel = str(Path("docs") / (doc_id + ".mdx")).replace("\\", "/")
    if re.search(r"(?m)^date:", fm) and rel in add_date:
        fm = set_field(fm, "date", add_date[rel])
        stat["date"] += 1

    # ② background
    if re.search(r"(?m)^background:", fm):
        fm = drop_field(fm, "background")
        fm = re.sub(r"\n{2,}", "\n", fm)
        stat["bg"] += 1

    if fm != orig:
        new = norm[: m.start(1)] + fm + norm[m.end(1):]
        f.write_bytes(new.replace("\n", "\r\n").encode("utf-8"))

print("已修改：date %d 篇 / background %d 篇 / title %d 篇"
      % (stat["date"], stat["bg"], stat["title"]))
