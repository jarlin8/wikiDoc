# -*- coding: utf-8 -*-
"""为 4 篇支柱页生成专属 1200x630 OG 分享图（与站点默认图同一套视觉）"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630
BG_TOP = (13, 15, 18)
BG_BOTTOM = (22, 27, 31)
ACCENT = (37, 194, 160)
TEXT = (243, 245, 247)
MUTED = (150, 160, 168)
FONT_DIR = Path("C:/Windows/Fonts")
OUT = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\static\img\og")
SITE = "wiki.ssgg.net"
BRAND = "汇鉴"


def load_font(names, size):
    for n in names:
        p = FONT_DIR / n
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size)
            except Exception:
                continue
    return ImageFont.load_default()


f_title = load_font(["msyhbd.ttc", "segoeuib.ttf", "arialbd.ttf"], 62)
f_brand = load_font(["msyhbd.ttc", "segoeuib.ttf", "arialbd.ttf"], 40)
f_tag = load_font(["msyh.ttc", "segoeui.ttf", "arial.ttf"], 30)
f_url = load_font(["msyh.ttc", "segoeui.ttf", "arial.ttf"], 28)

PAGES = [
    ("exness-regulation", "Exness 监管与合规全景",
     "牌照 · 法人实体 · 资金保护"),
    ("exness-deposit-withdrawal", "Exness 出入金完整指南",
     "渠道对照 · 到账时间 · 失败排查"),
    ("exness-platforms", "Exness 交易平台怎么选",
     "MT4 · MT5 · 网页端 · App · VPS"),
    ("exness-account-types", "Exness 账户类型怎么选",
     "标准账户 vs 专业账户 · 成本结构"),
]


def wrap(text, font, draw, max_w):
    lines, cur = [], ""
    for ch in text:
        if draw.textlength(cur + ch, font=font) <= max_w:
            cur += ch
        else:
            lines.append(cur)
            cur = ch
    if cur:
        lines.append(cur)
    return lines


def make(slug, title, tag):
    img = Image.new("RGB", (W, H), BG_TOP)
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)],
               fill=tuple(int(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3)))

    # 右上角光晕
    ov_w, ov_h, scale = 300, 158, 4
    small = Image.new("RGBA", (ov_w // scale, ov_h // scale), (0, 0, 0, 0))
    sx, sy = (ov_w // scale) / 2, (ov_h // scale) / 2
    maxr = min(sx, sy)
    px = small.load()
    for yy in range(small.height):
        for xx in range(small.width):
            dist = ((xx - sx) ** 2 + (yy - sy) ** 2) ** 0.5
            if dist < maxr:
                px[xx, yy] = (ACCENT[0], ACCENT[1], ACCENT[2],
                              int(70 * (1 - dist / maxr) ** 2))
    glow = small.resize((ov_w, ov_h), Image.BICUBIC).resize((W, H), Image.BICUBIC)
    img = img.convert("RGBA")
    img.alpha_composite(glow, (W - ov_w + 40, -40))
    img = img.convert("RGB")
    d = ImageDraw.Draw(img)

    # 左侧强调竖条
    d.rounded_rectangle([72, 150, 82, 470], radius=5, fill=ACCENT)

    # 品牌（小字，右上）
    bw = d.textlength(BRAND, font=f_brand)
    d.text((W - 80 - bw, 74), BRAND, font=f_brand, fill=ACCENT)

    # 标题（自动换行，最多 2 行）
    lines = wrap(title, f_title, d, 900)[:2]
    y = 196 if len(lines) > 1 else 232
    for ln in lines:
        d.text((116, y), ln, font=f_title, fill=TEXT)
        y += 80

    # 分隔线 + 副标题
    d.line([(116, 430), (700, 430)], fill=(60, 68, 75), width=2)
    d.text((116, 456), tag, font=f_tag, fill=MUTED)

    # 域名
    d.text((116, 534), SITE, font=f_url, fill=ACCENT)

    OUT.mkdir(parents=True, exist_ok=True)
    p = OUT / ("%s.png" % slug)
    img.save(p, "PNG", optimize=True)
    print("  ✅", p.name, img.size)


for slug, title, tag in PAGES:
    make(slug, title, tag)
print("\n输出目录:", OUT)
