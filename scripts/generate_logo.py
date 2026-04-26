"""Generate the ShopX Elite Pro Max app icon and related branding assets.

Produces:
  assets/icon.png            (1024x1024, full bleed icon used by Expo / iOS)
  assets/adaptive-icon.png   (1024x1024, foreground for Android adaptive icon)
  assets/splash.png          (2048x2048, splash screen artwork)
  assets/favicon.png         (256x256, web favicon)
  branding/logo-mark.png     (1024x1024, transparent logo mark for marketing)
  branding/logo-wordmark.png (2048x768, full wordmark for store listings)

The mark is a stylized "X" formed from two interlocking premium ribbons
emerging from a faceted shopping-bag silhouette, set on a deep cosmic
gradient with neon halo, gold accents and inner glass highlights.
"""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
BRANDING = ROOT / "branding"
ASSETS.mkdir(exist_ok=True)
BRANDING.mkdir(exist_ok=True)

# Master canvas resolution (high res, downsampled later for crisp edges).
MASTER = 2048

# Brand palette — cosmic violet → electric cyan → royal gold accents.
BG_TOP = (12, 6, 38)         # deep indigo
BG_MID = (38, 14, 90)        # royal violet
BG_BOT = (4, 14, 48)         # midnight
RIBBON_A1 = (255, 196, 86)   # warm gold
RIBBON_A2 = (255, 110, 199)  # neon pink
RIBBON_B1 = (98, 244, 255)   # cyan
RIBBON_B2 = (118, 110, 255)  # violet
HIGHLIGHT = (255, 255, 255)


def lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def lerp_rgb(c1, c2, t: float):
    return (lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t))


def radial_gradient(size: int, inner, outer) -> Image.Image:
    img = Image.new("RGB", (size, size), outer)
    px = img.load()
    cx = cy = size / 2
    max_r = math.hypot(cx, cy)
    for y in range(size):
        for x in range(size):
            r = math.hypot(x - cx, y - cy) / max_r
            r = min(1.0, r)
            px[x, y] = lerp_rgb(inner, outer, r ** 1.4)
    return img


def vertical_gradient(w: int, h: int, top, mid, bot) -> Image.Image:
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        if t < 0.5:
            c = lerp_rgb(top, mid, t * 2)
        else:
            c = lerp_rgb(mid, bot, (t - 0.5) * 2)
        for x in range(w):
            px[x, y] = c
    return img


def squircle_mask(size: int, radius_ratio: float = 0.235) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    r = int(size * radius_ratio)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=r, fill=255)
    return mask


def add_noise(img: Image.Image, amount: int = 6) -> Image.Image:
    import random
    px = img.load()
    w, h = img.size
    for _ in range(w * h // 18):
        x = random.randint(0, w - 1)
        y = random.randint(0, h - 1)
        r, g, b = px[x, y][:3]
        d = random.randint(-amount, amount)
        px[x, y] = (max(0, min(255, r + d)), max(0, min(255, g + d)), max(0, min(255, b + d)))
    return img


def draw_starfield(img: Image.Image, count: int = 220) -> None:
    import random
    d = ImageDraw.Draw(img, "RGBA")
    w, h = img.size
    for _ in range(count):
        x = random.uniform(0, w)
        y = random.uniform(0, h)
        r = random.choice([1, 1, 1, 2, 2, 3])
        a = random.randint(80, 220)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, a))
    # A few brighter twinkle stars with a soft halo.
    for _ in range(14):
        x = random.uniform(0, w)
        y = random.uniform(0, h)
        for rr, aa in [(8, 30), (5, 80), (2, 220)]:
            d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=(255, 255, 255, aa))


def make_background(size: int) -> Image.Image:
    base = vertical_gradient(size, size, BG_TOP, BG_MID, BG_BOT)
    glow = radial_gradient(size, (90, 40, 180), (0, 0, 0))
    base = Image.blend(base, glow, 0.35)
    base = base.convert("RGBA")
    draw_starfield(base, count=320)
    # Soft outer vignette.
    vignette = Image.new("L", (size, size), 0)
    vd = ImageDraw.Draw(vignette)
    vd.ellipse((-size * 0.1, -size * 0.1, size * 1.1, size * 1.1), fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(size * 0.18))
    dark = Image.new("RGBA", (size, size), (0, 0, 0, 220))
    base = Image.composite(base, dark, vignette)
    return base


def gradient_polygon(size: int, points, c1, c2, angle_deg: float = 45.0) -> Image.Image:
    """Render a polygon filled with a linear gradient (c1 -> c2)."""
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)

    grad = Image.new("RGBA", (size, size))
    px = grad.load()
    rad = math.radians(angle_deg)
    dx, dy = math.cos(rad), math.sin(rad)
    # Project each pixel onto the gradient axis through the polygon bbox.
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)
    cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
    half = math.hypot(maxx - minx, maxy - miny) / 2 or 1
    for y in range(size):
        for x in range(size):
            t = ((x - cx) * dx + (y - cy) * dy) / half
            t = max(0.0, min(1.0, (t + 1) / 2))
            r = lerp(c1[0], c2[0], t)
            g = lerp(c1[1], c2[1], t)
            b = lerp(c1[2], c2[2], t)
            px[x, y] = (r, g, b, 255)
    layer.paste(grad, (0, 0), mask)
    return layer


def shopping_bag_silhouette(size: int) -> Image.Image:
    """Faceted, glass-like shopping bag silhouette behind the X."""
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    cx, cy = size / 2, size / 2 + size * 0.04
    bw = size * 0.62
    bh = size * 0.58
    left = cx - bw / 2
    right = cx + bw / 2
    top = cy - bh / 2
    bottom = cy + bh / 2

    # Bag body — slightly trapezoidal.
    body = [
        (left + size * 0.02, top + size * 0.02),
        (right - size * 0.02, top + size * 0.02),
        (right + size * 0.025, bottom),
        (left - size * 0.025, bottom),
    ]
    body_layer = gradient_polygon(size, body, (38, 18, 92), (10, 6, 40), angle_deg=110)
    layer.alpha_composite(body_layer)

    # Bag handle — rendered as two arcs.
    d = ImageDraw.Draw(layer, "RGBA")
    handle_w = size * 0.018
    hx1 = cx - bw * 0.30
    hx2 = cx + bw * 0.30
    hy_top = top - size * 0.12
    d.arc(
        (hx1 - size * 0.05, hy_top, hx2 + size * 0.05, top + size * 0.20),
        start=200, end=340,
        fill=(255, 220, 140, 230), width=int(handle_w),
    )
    d.arc(
        (hx1 - size * 0.05, hy_top, hx2 + size * 0.05, top + size * 0.20),
        start=200, end=340,
        fill=(255, 255, 255, 90), width=int(handle_w * 0.35),
    )

    # Inner highlight strip on the bag for a glassy sheen.
    sheen = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sheen)
    sheen_pts = [
        (left + size * 0.08, top + size * 0.05),
        (left + size * 0.22, top + size * 0.05),
        (left + size * 0.10, bottom - size * 0.08),
        (left - size * 0.01, bottom - size * 0.08),
    ]
    sd.polygon(sheen_pts, fill=(255, 255, 255, 55))
    sheen = sheen.filter(ImageFilter.GaussianBlur(size * 0.012))
    layer.alpha_composite(sheen)

    return layer


def x_ribbon(size: int) -> Image.Image:
    """The interlocking premium "X" mark."""
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    cx, cy = size / 2, size / 2

    # Geometry — two thick diagonals forming an X with slight inset corners.
    span = size * 0.46
    thickness = size * 0.16
    inset = size * 0.05  # shorten tips for an elegant cut

    def diagonal(angle_deg: float, c1, c2, grad_angle: float):
        rad = math.radians(angle_deg)
        dx, dy = math.cos(rad), math.sin(rad)
        # perpendicular for thickness
        px_, py_ = -dy, dx
        x1 = cx - dx * (span - inset)
        y1 = cy - dy * (span - inset)
        x2 = cx + dx * (span - inset)
        y2 = cy + dy * (span - inset)
        pts = [
            (x1 + px_ * thickness / 2, y1 + py_ * thickness / 2),
            (x2 + px_ * thickness / 2, y2 + py_ * thickness / 2),
            (x2 - px_ * thickness / 2, y2 - py_ * thickness / 2),
            (x1 - px_ * thickness / 2, y1 - py_ * thickness / 2),
        ]
        return gradient_polygon(size, pts, c1, c2, angle_deg=grad_angle), pts

    # Back diagonal (\\) — gold→pink ribbon.
    back, back_pts = diagonal(45, RIBBON_A1, RIBBON_A2, grad_angle=45)
    # Drop shadow under the back ribbon.
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.polygon(back_pts, fill=(0, 0, 0, 180))
    shadow = shadow.filter(ImageFilter.GaussianBlur(size * 0.018))
    layer.alpha_composite(shadow)
    layer.alpha_composite(back)

    # Front diagonal (/) — cyan→violet ribbon, drawn over the back.
    front, front_pts = diagonal(-45, RIBBON_B1, RIBBON_B2, grad_angle=135)
    # Inner shadow where the front crosses the back to suggest weaving.
    cross = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cross)
    cd.polygon(back_pts, fill=(0, 0, 0, 130))
    cross_mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(cross_mask).polygon(front_pts, fill=255)
    cross.putalpha(Image.eval(cross_mask, lambda v: int(v * 0.45)))
    cross = cross.filter(ImageFilter.GaussianBlur(size * 0.006))
    layer.alpha_composite(front)
    layer.alpha_composite(cross)

    # Glossy highlight on each ribbon.
    gloss = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gloss)
    for pts in (back_pts, front_pts):
        # Top-edge highlight: thin polygon along the upper edge.
        p0, p1, p2, p3 = pts
        edge_top = [
            p0,
            p1,
            ((p1[0] * 0.78 + p2[0] * 0.22), (p1[1] * 0.78 + p2[1] * 0.22)),
            ((p0[0] * 0.78 + p3[0] * 0.22), (p0[1] * 0.78 + p3[1] * 0.22)),
        ]
        gd.polygon(edge_top, fill=(255, 255, 255, 120))
    gloss = gloss.filter(ImageFilter.GaussianBlur(size * 0.004))
    layer.alpha_composite(gloss)

    # Outer neon glow halo around the X.
    glow_src = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd2 = ImageDraw.Draw(glow_src)
    gd2.polygon(back_pts, fill=(255, 150, 90, 160))
    gd2.polygon(front_pts, fill=(120, 220, 255, 160))
    glow = glow_src.filter(ImageFilter.GaussianBlur(size * 0.05))
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.alpha_composite(glow)
    out.alpha_composite(layer)
    return out


def crown_accent(size: int) -> Image.Image:
    """A small jeweled crown above the X to convey 'Elite Pro Max'."""
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, "RGBA")
    cx = size / 2
    cy = size * 0.20
    w = size * 0.20
    h = size * 0.07

    base = [
        (cx - w / 2, cy + h * 0.35),
        (cx + w / 2, cy + h * 0.35),
        (cx + w / 2, cy + h * 0.95),
        (cx - w / 2, cy + h * 0.95),
    ]
    crown_layer = gradient_polygon(size, base, (255, 220, 130), (255, 170, 60), angle_deg=90)
    layer.alpha_composite(crown_layer)

    # Three pointed peaks.
    peaks = [
        [(cx - w / 2, cy + h * 0.35), (cx - w * 0.18, cy + h * 0.35), (cx - w * 0.34, cy - h * 0.55)],
        [(cx - w * 0.10, cy + h * 0.35), (cx + w * 0.10, cy + h * 0.35), (cx, cy - h * 0.95)],
        [(cx + w * 0.18, cy + h * 0.35), (cx + w / 2, cy + h * 0.35), (cx + w * 0.34, cy - h * 0.55)],
    ]
    for poly in peaks:
        peak = gradient_polygon(size, poly, (255, 230, 150), (220, 140, 40), angle_deg=70)
        layer.alpha_composite(peak)

    # Gemstones at peak tips.
    for (gx, gy, col) in [
        (cx - w * 0.34, cy - h * 0.55, (110, 230, 255)),
        (cx, cy - h * 0.95, (255, 110, 200)),
        (cx + w * 0.34, cy - h * 0.55, (110, 230, 255)),
    ]:
        r = size * 0.012
        d.ellipse((gx - r, gy - r, gx + r, gy + r), fill=col + (255,))
        d.ellipse(
            (gx - r * 0.4, gy - r * 0.6, gx + r * 0.1, gy - r * 0.1),
            fill=(255, 255, 255, 200),
        )

    # Soft glow under the crown.
    glow = layer.filter(ImageFilter.GaussianBlur(size * 0.012))
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.alpha_composite(glow)
    out.alpha_composite(layer)
    return out


def assemble_icon(size: int = MASTER) -> Image.Image:
    bg = make_background(size)
    bag = shopping_bag_silhouette(size)
    x = x_ribbon(size)
    crown = crown_accent(size)

    # Inner border ring for a premium framed look.
    ring = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rd = ImageDraw.Draw(ring)
    pad = int(size * 0.045)
    rd.rounded_rectangle(
        (pad, pad, size - pad, size - pad),
        radius=int(size * 0.20),
        outline=(255, 230, 180, 130),
        width=max(2, size // 220),
    )
    pad2 = int(size * 0.07)
    rd.rounded_rectangle(
        (pad2, pad2, size - pad2, size - pad2),
        radius=int(size * 0.18),
        outline=(255, 255, 255, 35),
        width=max(1, size // 320),
    )

    composed = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    composed.alpha_composite(bg)
    composed.alpha_composite(bag)
    composed.alpha_composite(x)
    composed.alpha_composite(crown)
    composed.alpha_composite(ring)

    # Top-left specular highlight for the glassy squircle look.
    spec = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(spec)
    sd.ellipse(
        (-size * 0.2, -size * 0.35, size * 0.85, size * 0.20),
        fill=(255, 255, 255, 55),
    )
    spec = spec.filter(ImageFilter.GaussianBlur(size * 0.04))
    composed.alpha_composite(spec)

    return composed


def save_icon(target: Path, master: Image.Image, size: int, *, squircle: bool, transparent_bg: bool = False) -> None:
    img = master.resize((size, size), Image.LANCZOS)
    if squircle:
        mask = squircle_mask(size)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        img = out
    elif not transparent_bg:
        img = img.convert("RGB")
    img.save(target, optimize=True)


def make_adaptive_foreground(master: Image.Image, size: int = 1024) -> Image.Image:
    """Adaptive icon foreground: just the X + crown + bag, transparent bg, padded."""
    fg_master = MASTER
    bag = shopping_bag_silhouette(fg_master)
    x = x_ribbon(fg_master)
    crown = crown_accent(fg_master)
    composed = Image.new("RGBA", (fg_master, fg_master), (0, 0, 0, 0))
    composed.alpha_composite(bag)
    composed.alpha_composite(x)
    composed.alpha_composite(crown)
    # Adaptive icons need 33% safe-zone padding.
    pad = int(fg_master * 0.18)
    padded = Image.new("RGBA", (fg_master, fg_master), (0, 0, 0, 0))
    inner = composed.resize((fg_master - 2 * pad, fg_master - 2 * pad), Image.LANCZOS)
    padded.paste(inner, (pad, pad), inner)
    return padded.resize((size, size), Image.LANCZOS)


def make_splash(master: Image.Image, size: int = 2048) -> Image.Image:
    bg = make_background(size)
    icon_size = int(size * 0.55)
    icon = master.resize((icon_size, icon_size), Image.LANCZOS)
    # Round the icon corners for the splash too.
    mask = squircle_mask(icon_size)
    framed = Image.new("RGBA", (icon_size, icon_size), (0, 0, 0, 0))
    framed.paste(icon, (0, 0), mask)
    out = bg.copy()
    ox = (size - icon_size) // 2
    oy = int(size * 0.20)
    # Soft drop shadow.
    shadow = Image.new("RGBA", (icon_size + 80, icon_size + 80), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle(
        (40, 40, icon_size + 40, icon_size + 40),
        radius=int(icon_size * 0.235),
        fill=(0, 0, 0, 200),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(40))
    out.alpha_composite(shadow, (ox - 40, oy - 20))
    out.alpha_composite(framed, (ox, oy))

    # Wordmark below.
    draw = ImageDraw.Draw(out, "RGBA")
    title = "ShopX Elite Pro Max"
    tag = "Premium Shopping. Reimagined."
    title_font = _load_font(int(size * 0.058), bold=True)
    tag_font = _load_font(int(size * 0.026), bold=False)
    title_w = draw.textlength(title, font=title_font)
    tag_w = draw.textlength(tag, font=tag_font)
    title_y = oy + icon_size + int(size * 0.05)
    draw.text(
        ((size - title_w) / 2, title_y),
        title,
        font=title_font,
        fill=(255, 240, 210, 255),
    )
    draw.text(
        ((size - tag_w) / 2, title_y + int(size * 0.075)),
        tag,
        font=tag_font,
        fill=(190, 200, 240, 220),
    )
    return out


def _load_font(size: int, *, bold: bool) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/TTF/DejaVuSans.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def make_logo_mark(size: int = 1024) -> Image.Image:
    bag = shopping_bag_silhouette(MASTER)
    x = x_ribbon(MASTER)
    crown = crown_accent(MASTER)
    composed = Image.new("RGBA", (MASTER, MASTER), (0, 0, 0, 0))
    composed.alpha_composite(bag)
    composed.alpha_composite(x)
    composed.alpha_composite(crown)
    return composed.resize((size, size), Image.LANCZOS)


def make_wordmark(width: int = 2048, height: int = 768) -> Image.Image:
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    mark = make_logo_mark(height)
    img.alpha_composite(mark, (int(height * 0.05), 0))

    draw = ImageDraw.Draw(img, "RGBA")
    title = "ShopX"
    sub = "Elite Pro Max"
    tag = "Premium Shopping. Reimagined."
    title_font = _load_font(int(height * 0.40), bold=True)
    sub_font = _load_font(int(height * 0.18), bold=True)
    tag_font = _load_font(int(height * 0.10), bold=False)
    text_x = int(height * 1.10)
    draw.text((text_x, int(height * 0.10)), title, font=title_font, fill=(255, 230, 180, 255))
    draw.text((text_x, int(height * 0.55)), sub, font=sub_font, fill=(140, 220, 255, 255))
    draw.text((text_x, int(height * 0.78)), tag, font=tag_font, fill=(200, 200, 230, 220))
    return img


def main() -> None:
    print("Composing master icon...")
    master = assemble_icon(MASTER)

    print("Saving icon.png (1024)...")
    save_icon(ASSETS / "icon.png", master, 1024, squircle=False, transparent_bg=True)

    print("Saving adaptive-icon.png (1024 foreground, transparent)...")
    fg = make_adaptive_foreground(master, 1024)
    fg.save(ASSETS / "adaptive-icon.png", optimize=True)

    print("Saving splash.png (2048)...")
    splash = make_splash(master, 2048)
    splash.convert("RGB").save(ASSETS / "splash.png", optimize=True)

    print("Saving favicon.png (256, squircle)...")
    save_icon(ASSETS / "favicon.png", master, 256, squircle=True)

    print("Saving branding/logo-mark.png (1024 transparent)...")
    make_logo_mark(1024).save(BRANDING / "logo-mark.png", optimize=True)

    print("Saving branding/logo-wordmark.png (2048x768 transparent)...")
    make_wordmark().save(BRANDING / "logo-wordmark.png", optimize=True)

    print("Done.")


if __name__ == "__main__":
    main()
