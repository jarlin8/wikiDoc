# -*- coding: utf-8 -*-
"""生成 1200x630 的默认 OG 分享图（暗色主题 + 品牌绿）"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630
BG_TOP = (13, 15, 18)
BG_BOTTOM = (22, 27, 31)
ACCENT = (37, 194, 160)      # dark theme primary #25c2a0
ACCENT_DIM = (12, 120, 100)
TEXT = (243, 245, 247)
MUTED = (150, 160, 168)

FONT_DIR = Path("C:/Windows/Fonts")


def load_font(names, size):
    for n in names:
        p = FONT_DIR / n
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size)
            except Exception:
                continue
    return ImageFont.load_default()


f_title = load_font(["msyhbd.ttc", "segoeuib.ttf", "arialbd.ttf"], 108)
f_sub = load_font(["msyh.ttc", "segoeui.ttf", "arial.ttf"], 40)
f_url = load_font(["msyh.ttc", "segoeui.ttf", "arial.ttf"], 30)

img = Image.new("RGB", (W, H), BG_TOP)
d = ImageDraw.Draw(img)

# 垂直渐变背景
for y in range(H):
    t = y / H
    r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * t)
    g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * t)
    b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * t)
    d.line([(0, y), (W, y)], fill=(r, g, b))

# 右上角装饰光晕（低分辨率计算 + 双三次放大，避免同心环）
ov_w, ov_h = 300, 158
scale = 4
small = Image.new("RGBA", (ov_w // scale, ov_h // scale), (0, 0, 0, 0))
sx, sy = (ov_w // scale) / 2, (ov_h // scale) / 2
maxr = min(sx, sy)
px = small.load()
for yy in range(small.height):
    for xx in range(small.width):
        dx, dy = xx - sx, yy - sy
        dist = (dx * dx + dy * dy) ** 0.5
        if dist < maxr:
            a = int(70 * (1 - dist / maxr) ** 2)
            px[xx, yy] = (ACCENT[0], ACCENT[1], ACCENT[2], a)
glow = small.resize((ov_w, ov_h), Image.BICUBIC).resize((W, H), Image.BICUBIC)
img = img.convert("RGBA")
img.alpha_composite(glow, (W - ov_w + 40, -40))
img = img.convert("RGB")
d = ImageDraw.Draw(img)

# 左侧强调竖条
d.rounded_rectangle([72, 150, 82, 470], radius=5, fill=ACCENT)

# 标题
d.text((116, 158), "WikiDoc", font=f_title, fill=TEXT)

# 副标题（logo 圆点 + 站点主张）
d.ellipse([120, 322, 134, 336], fill=ACCENT)
d.text((152, 306), "全职交易员关注的吃喝 / 交易", font=f_sub, fill=TEXT)
d.text((116, 372), "帮助文档与代理佣金说明", font=f_sub, fill=MUTED)

# 分隔线
d.line([(116, 470), (700, 470)], fill=(60, 68, 75), width=2)

# 域名
d.text((116, 494), "wiki.ssgg.net", font=f_url, fill=ACCENT)

out = Path(r"C:\Users\Jarlin\Desktop\Github\wikiDoc\static\img\og-default.png")
img.save(out, "PNG", optimize=True)
print("已生成:", out, img.size)
