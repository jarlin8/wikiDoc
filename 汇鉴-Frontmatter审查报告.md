# 汇鉴 Frontmatter SEO 审查报告

> 审查日期：2026-09-16｜范围：`docs/` 下全部 **320 篇** `.mdx` + 构建产物 `<head>` + sitemap.xml
> 本报告**只审查不建议执行**，所有改动待确认后再做。

---

## 一、SEO 最佳写法（推荐模板）

### 1.1 标准模板

```yaml
---
title: "Exness 出金完整指南：到账时间、限额与失败排查"      # 必填 · ≤25 汉字
description: "Exness 出金的到账时间、最低与最高限额、可用支付渠道，以及出金被拒绝或余额不足时的排查步骤。"  # 必填 · 60–80 汉字
slug: /guides/exness-withdrawal                           # 可选 · 仅在需要自定义 URL 时写
image: /img/og/exness-withdrawal.png                      # 可选 · 每页独立 1200×630 分享图
sidebar_label: "出入金完整指南"                             # 只影响侧栏，不影响 SEO
sidebar_position: 2                                       # 只影响排序
hide_table_of_contents: true                              # 仅列表型索引页需要
last_update:                                              # 可选 · 显式声明时优先于 git
  date: 2026-09-16
  author: 汇鉴
---
```

### 1.2 逐字段规范

| 字段 | SEO 作用 | 规范 | 本站在用 |
|---|---|---|---|
| **`title`** | `<title>` + 页内 H1 | **≤25 汉字**；主关键词前置；**不要写品牌名**（模板自动追加 `\| 汇鉴`）；同站不得重复 | ✅ 100% |
| **`description`** | `meta description` + `og:description` | **60–80 汉字**；必须含主关键词；写成"用户会点"的承诺句，不是目录式罗列 | ✅ 100% |
| `slug` | 最终 URL | 仅在需要短/语义化 URL 时写；否则跟随文件路径 | 5 篇 |
| `image` | `og:image` / `twitter:image` | 每页独立 1200×630；不写则回退站点默认图 | ⚠️ 1 篇 |
| `sidebar_label` | **不影响 SEO** | 只控制侧栏显示文字；长 SEO 标题务必靠它保住侧栏可读性 | 29 篇 |
| `sidebar_position` | **不影响 SEO** | 只控制同层排序 | 5 篇 |
| `hide_table_of_contents` | 无 | 列表型索引页设为 `true` | 6 篇 |
| `last_update` | 页面「最后更新」+ sitemap `lastmod` | 写了就**优先于 git**；不写则回退 git | 1 篇 |
| **`date`** | 被本站 swizzle 组件用于 JSON-LD 的 **`datePublished`** | **必须存在且取值真实**。本站内容 2026-07-31 起收录，**不要沿用源站日期** | ✅ 320 篇 |
| `keywords` | **Google 已明确忽略** | **不建议添加**（浪费维护成本，且有被误判堆砌的风险） | 2 篇 |
| `tags` | 生成 `/tags/*` 聚合页 | 本站在 `robots.txt` 屏蔽了 `/tags/`，**建议保持一致：不要用** | 5 篇 |
| ~~`date`~~ | 见下方 **P1-1 更正** | 曾被误判为"遗留字段" | — |

### 1.3 三条铁律

1. **`title` 里不要写「汇鉴」** —— Docusaurus 默认模板是 `%s | <站点名>`，手写会导致品牌重复（此前 `index.mdx` 就犯过这个错）
2. **`description` 不是摘要，是广告语** —— 它决定点击，不决定排名。写成"看完这句就知道点了能拿到什么"
3. **`keywords` 与 `tags` 在本站都不要加** —— 前者被 Google 忽略，后者被 robots 屏蔽，加了只有维护成本

---

## 二、现状审查（实测）

### 2.1 字段使用频次

| 字段 | 篇数 | 占比 |
|---|---|---|
| `title` | 320 | 100.0% |
| `description` | 320 | 100.0% |
| `date` | 257 | 80.3% |
| `sidebar_label` | 29 | 9.1% |
| `hide_table_of_contents` | 6 | 1.9% |
| `tags` / `slug` / `sidebar_position` | 各 5 | 1.6% |
| `keywords` | 2 | 0.6% |
| `image` / `last_update` / `hide_title` / `background` | 各 1 | 0.3% |

### 2.2 长度分布

| 指标 | 最短 | 中位 | 最长 | 越界 |
|---|---|---|---|---|
| `title` | 3 | 14 | 40 | **>30 字：6 篇** |
| `description` | 12 | 67 | 185 | **<40 字：43 篇**／**>120 字：54 篇** |

超标样例：

```
40 字  guides/exness-platforms
34 字  exness-trader/exness-交易应用-如何更改-exness-交易应用的语言设置
31 字  guides/exness-account-types

185 字  ea-setup
149 字  exness-agent/零点账户的合伙人佣金如何计算
148 字  exness-trader/美分账户有哪些地域限制
```

### 2.3 ✅ 已经做对的部分（不要动）

| 项 | 状态 |
|---|---|
| 重复 `title` | **0 组** ✅ |
| 重复 `description` | **0 组** ✅ |
| `<link rel="canonical">` | 每页都有 ✅ |
| JSON-LD | WebSite / Organization / TechArticle / WebPage / BreadcrumbList / ImageObject ✅ |
| `og:title` / `og:description` / `og:url` / `og:type` / `og:site_name` | 齐全 ✅ |
| `twitter:card=summary_large_image` | 已声明 ✅ |
| `hreflang` | 自引用 ✅ |
| `robots.txt` | 屏蔽 `/search`、`/tags/`，声明 sitemap ✅ |
| `sitemap.xml` | 320 个 URL ✅ |

---

## 三、发现的问题（按严重度）

### 🔴 P0-1：418 篇文档丢失 `lastmod`，且全站不显示「最后更新」

**症状（实测）**
- `sitemap.xml` 中 **仅 11/320 个 URL 有 `<lastmod>`**
- 构建产物中**没有任何页面**显示「最后更新 / 作者」，尽管配置里写着 `showLastUpdateTime: true`、`showLastUpdateAuthor: true`

**根因（已定位到源码级）**

`git config core.quotepath` 未设置 → 默认 `true` → git 对**含非 ASCII 字符的路径**输出为带引号 + 八进制转义的形式：

```bash
# 默认行为
$ git log -1 --name-only --format="" -- "docs/exness-trader/隔夜利息.mdx"
"docs/exness-trader/\351\232\224\345\244\234\345\210\251\346\201\257.mdx"

# 关闭 quotepath 后
$ git -c core.quotepath=false log -1 --name-only --format="" -- "docs/exness-trader/隔夜利息.mdx"
docs/exness-trader/隔夜利息.mdx
```

Docusaurus 的 `getGitRepositoryFilesInfo()` 直接用 git 的原始输出作为映射表的 key，**不做反转义**。实测该表 697 条中：

| key 前缀 | 条数 |
|---|---|
| `"docs`（**带引号**） | **418** |
| `docs`（干净） | **14** |

→ 只有 **14 篇纯 ASCII 路径**的文档能被匹配上，其余 **418 篇全部查不到 git 信息**。

**影响**
- sitemap 里 309/320 个 URL 无 freshness 信号 → 爬虫重访调度吃亏
- 读者看不到页面新鲜度（对金融类内容尤其影响信任）

**修复方向**（一行命令）
```bash
git config core.quotepath false
```
改完重新构建，`lastmod` 覆盖率应升到接近 100%。

**备选方案**：给重要页面显式写 `last_update` frontmatter（优先级高于 git）。

---

### 🔴 P0-2：sitemap 仍在输出 `changefreq` / `priority`，且 320 个 URL 全部相同

**症状（实测）**
```
含 changefreq : 320 / 320   →  全部 <changefreq>weekly</changefreq>
含 priority   : 320 / 320   →  全部 <priority>0.5</priority>
```

而 `docusaurus.config.js` 第 102 行的注释写着：

> 「已移除 changefreq / priority：Google 已明确声明不参考这两个字段，且 425 篇帮助文档全标 changefreq: daily 是错误信号。」

**注释与产物不一致** —— 说明这两个字段并没有被真正移除（只删了显式传参，Docusaurus 仍在用默认值输出）。

**影响**：Google 确实不参考这两个字段，所以**不会因此被惩罚**；但 320 个完全相同的值没有任何信息量，纯属噪声。属"低危但应当清理"，与注释保持一致。

---

### 🟡 P1-1（**已更正**）：`date` 取值是源站的假日期 —— 该字段**并非**无用

> ⚠️ **本报告初版在此处判断错误**：初版称"`date` 是 Docusaurus 不使用的遗留字段，建议清理"。
> 实际核查 `src/theme/DocItem/Layout/index.js:58` 后发现：
> ```js
> ...(toIso(frontMatter.date) ? { datePublished: toIso(frontMatter.date) } : {}),
> ```
> **该字段被 swizzle 组件用于 JSON-LD 的 `datePublished`。删除它会丢掉结构化数据的发布日期。**

**真正的问题不是字段本身，而是取值**

```
初版实测：date: "2023-01-10"   × 256 篇（全部同一日期）
```

`2023-01-10` 是**源站 Exness 帮助中心的文档日期**，不是本站内容的发布日期。
一个网站上 256 个页面全部声称"发布于 2023-01-10"，是明显的低质量特征。

**正确做法**：保留字段，改用**本站真实收录日期** —— 由 git 提供：

```bash
git -c core.quotepath=false log --diff-filter=A --format=%as -- <file> | tail -1
```

实测结果：425 篇为 `2026-07-31`（批量导入日），新增页面为 `2026-09-15/16`。

---

### 🟡 P1-1b（**执行中新发现**）：JSON-LD `dateModified` 输出垃圾日期

修好 P0-1 的 git 问题后，`metadata.lastUpdatedAt` 首次有了值，从而**暴露出一个被掩盖的组件 bug**：

```
实测输出： "dateModified": "+058677-09-20T21:30:00.000Z"   ← 年份 58677
```

**根因**：`metadata.lastUpdatedAt` 已经是**毫秒**时间戳
（来源：`utils/lastUpdateUtils` → `vcs.getFileLastUpdateInfo().timestamp`），
但 swizzle 组件写成了 `new Date(lastUpdatedAt * 1000)`，多乘了 1000。

此前该值恒为 `null`（正是 P0-1 的 git 问题），所以这个错误一直不可见。

**修复**：`new Date(metadata.lastUpdatedAt).toISOString()`

---

### 🟡 P1-2：缺少每页独立的 `og:image`（319/320 缺失）

**症状**：所有页面共用 `https://wiki.ssgg.net/img/og-default.png`

**影响**：社交/IM 分享时每篇都是同一张图。不直接影响排名，但直接影响**分享点击率**——对内容型站点是实打实的损失。

**建议（分两档）**
- 低成本：给 4 篇支柱页 + 首页单独做 5 张 1200×630 分享图
- 高成本：为每篇生成带标题的分享图（可脚本化）

---

### 🟡 P1-3：`description` 长度两极分化

- **过短（<40 字）：43 篇** —— 在搜索结果里信息量不足，等同浪费这个位置
- **过长（>120 字）：54 篇** —— 会被 Google 截断，且多数是"目录式罗列"（把页面内小标题堆在一起）

**典型反例**（`exness-agent.mdx` 修改前的 description）：
> 「本金使用比率 标准账户 单链接服务详解 地区代表-区域代理 返佣详述 …」

这是**小标题堆砌**，不是描述。已随本次改造替换。

**建议**：按 60–80 汉字重写这 97 篇，优先处理 A 档（有点击）和 B 档（高曝光零点击）的页面。

---

### 🟡 P1-4：6 篇 `title` 超过 30 汉字

| 字数 | 文档 |
|---|---|
| 40 | `guides/exness-platforms` |
| 34 | `exness-trader/exness-交易应用-如何更改-exness-交易应用的语言设置` |
| 32 | `exness-trader/exness-交易应用-为何我在进行入金操作时找不到我的` |
| 31 | `guides/exness-account-types` |
| 31 | `exness-trader/如何将我在社交交易中的入金与我的-exness-账户关联起` |
| 31 | `exness-trader/如何使用-mt4-multiterminal多账户管理终端` |

加上 ` | 汇鉴`（5 字）后在 SERP 里大概率被截断。**建议压缩到 25 字内**，核心词前置。

---

### 🟢 P2-1：一个无作用的遗留字段

`docs/chatgpt-edgegpt.mdx:4` 有 `background: bg-[#4aa181]` —— 这是 Tailwind 风格的类名，Docusaurus 不识别。建议清理。

---

### 🟢 P2-2：`keywords` 与 `tags` —— 结论是"不要补"

- `keywords`：Google 2019 年就明确不再使用。不建议添加。
- `tags`：本站 `robots.txt` 已 `Disallow: /tags/`，说明定位就是不要标签页。保持现状即可，**不要给 320 篇补 tags**。

---

## 四、建议执行顺序（待确认后实施）

| 优先级 | 动作 | 影响面 | 成本 |
|---|---|---|---|
| **P0-1** | `git config core.quotepath false` + 重新构建验证 | 418 篇恢复 lastmod + 全站恢复「最后更新」 | 1 条命令 |
| **P0-2** | 真正移除 sitemap 的 changefreq / priority，与注释一致 | 320 个 URL | 配置数行 |
| P1-1 | 确认后清理 257 篇的 `date` 字段 | 257 篇 | 脚本 |
| P1-2 | 支柱页 + 首页做 5 张独立 og:image | 5 页 | 中 |
| P1-3 | 重写 97 篇过短/过长的 `description` | 97 篇 | 高（逐篇写） |
| P1-4 | 压缩 6 篇超长 `title` | 6 篇 | 低 |
| P2-1 | 清理 `background` 遗留字段 | 1 篇 | 极低 |

---

## 五、需要你确认的三件事

1. **`git config core.quotepath false` 是否允许执行？** 它会写入仓库的 `.git/config`（不影响其他人，除非提交到共享配置）。这是 P0-1 的最小修复。
2. **257 篇的 `date: 2023-01-10` 是否清理？** 需要先确认没有主题组件在读取它（我可以再查一遍）。
3. **`description` 重写的范围**：全部 97 篇，还是只做 A 档 + B 档（约 85 篇）优先？

---

## 附：本次审查用到的脚本

| 脚本 | 作用 |
|---|---|
| `.workbuddy/audit_frontmatter.py` | 统计全站 frontmatter 字段、长度、重复 |
| `.workbuddy/` 内的 git 探测命令 | 定位 `core.quotepath` 根因 |
| 产物 | `reports/08-frontmatter审计.csv`（320 行明细） |

---

# 执行记录（2026-09-16 已完成）

用户确认"全部按建议执行"，以下改动**已落地并构建验证**。

| # | 动作 | 结果 |
|---|---|---|
| P0-1 | `git config core.quotepath false` | ✅ sitemap `lastmod` **11 → 320/320**；全站页面恢复「最后由…于…更新」行 |
| P0-2 | sitemap 显式置 `changefreq: null` / `priority: null` | ✅ 320 → **0 / 0** |
| P1-1 | `date` 取值 257 篇改为 git 真实添加日期（`2023-01-10` → `2026-07-31`）；并为 63 篇缺该字段的文档补上 | ✅ **320/320 篇有 date**；全站 `2023-01-10` 残留 **0** |
| P1-1b | 修复 swizzle 组件 `lastUpdatedAt * 1000` 单位错误 | ✅ `dateModified` 由 `+058677-09-20` → **2026-09-16**；全站 330 页异常日期 **0** |
| P1-2 | 为 4 篇支柱页生成专属 1200×630 OG 图并写入 `image` 字段 | ✅ 4 页 `og:image` 已各自独立 |
| P1-3 | 改写 97 篇过短/过长 description | ✅ 越界数 **97 → 0** |
| P1-4 | 压缩 6 篇超长 title（并保留原 sidebar_label） | ✅ 最长 40 → **24 字** |
| P2-1 | 删除 `chatgpt-edgegpt.mdx` 的 `background` 遗留字段 | ✅ |
| 附加 | 移除 `index.mdx` 的 `last_update` 覆盖（强制盖过 git，导致首页日期停在 2024）+ 移除其 `keywords` | ✅ 首页 `dateModified` 2024-09-10 → **2026-09-16** |

## 最终验证（构建 EXIT=0，330 个 HTML）

```
sitemap：320 URL / 320 lastmod / 0 changefreq / 0 priority
JSON-LD：全部页面日期格式正常，异常值 0
页面：全部显示「最后由 <作者> 于 <日期> 更新」
description：越界 0 篇
支柱页 og:image：4/4 独立
```

## 新增脚本

| 脚本 | 作用 |
|---|---|
| `.workbuddy/fix_frontmatter.py` | date 取值 + 清理 background + 压缩超长 title |
| `.workbuddy/fix_descriptions.py` | 97 篇 description 改写 |
| `.workbuddy/fix_desc_rest.py` | 补齐最后 4 篇偏短的 description |
| `.workbuddy/gen_og_pages.py` | 支柱页专属 OG 图生成 |
| `.workbuddy/add_og_image.py` | 写入 `image` 字段 |
| `.workbuddy/add_date_field.py` | 为缺 date 的文档补 git 真实日期 |
| `.workbuddy/list_desc.py` | 复核 description 长度越界 |

## 仍需注意

1. **`date` 字段现在承载 `datePublished`，改动它会影响结构化数据** —— 不要再当成可随意清理的遗留字段。
2. **`core.quotepath=false` 是仓库级配置**，写在 `.git/config`。若换机器或 CI 重新 clone，**需要重新设置**，否则 P0-1 的问题会复发。建议在 CI 流程或 README 中记录。
3. 首页等仍使用站点默认 OG 图（`og-default.png`）—— 如需逐页独立分享图，可沿用 `gen_og_pages.py` 的模式扩展。
