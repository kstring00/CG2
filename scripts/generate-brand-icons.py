#!/usr/bin/env python3
"""Regenerate every derived brand asset from the primary mark.

One-off maintenance script — not part of the build. Run it after replacing
public/logos/common-ground-mark.png:

    python3 scripts/generate-brand-icons.py

Produces the favicon, Apple touch icon, PWA icons, and the Open Graph card.
Requires Pillow (`pip install Pillow`).
"""
import pathlib
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
MARK = ROOT / "public/logos/common-ground-mark.png"

NAVY = (26, 46, 82)
PLUM = (112, 48, 104)
TEAL = (47, 154, 121)
WHITE = (255, 255, 255)
MUTED = (196, 204, 220)

FONT_DIR = pathlib.Path("/mnt/skills/examples/canvas-design/canvas-fonts")


def trimmed_art(path):
    """The mark with any surrounding white margin removed."""
    img = Image.open(path).convert("RGBA")
    flat = Image.new("RGB", img.size, WHITE)
    flat.paste(img, (0, 0), img)
    diff = ImageChops.difference(flat, Image.new("RGB", img.size, WHITE)).convert("L")
    bbox = diff.point(lambda v: 255 if v > 12 else 0).getbbox()
    return img.crop(bbox) if bbox else img


def square(art, size, pad_ratio=0.10, bg=WHITE + (255,)):
    canvas = Image.new("RGBA", (size, size), bg)
    inner = int(size * (1 - 2 * pad_ratio))
    scale = min(inner / art.width, inner / art.height)
    resized = art.resize(
        (max(1, int(art.width * scale)), max(1, int(art.height * scale))), Image.LANCZOS
    )
    canvas.paste(
        resized,
        ((size - resized.width) // 2, (size - resized.height) // 2),
        resized,
    )
    return canvas


def build_icons(art):
    square(art, 512).save(ROOT / "src/app/icon.png")
    square(art, 180).save(ROOT / "src/app/apple-icon.png")
    icons = ROOT / "public/icons"
    icons.mkdir(parents=True, exist_ok=True)
    square(art, 192).convert("RGB").save(icons / "icon-192.png")
    square(art, 512).convert("RGB").save(icons / "icon-512.png")
    square(art, 512, pad_ratio=0.20).convert("RGB").save(icons / "icon-maskable-512.png")
    print("icons: favicon, apple-icon, 192, 512, maskable")


def build_og(art):
    W, H = 1200, 630
    try:
        title_f = ImageFont.truetype(str(FONT_DIR / "Lora-Bold.ttf"), 76)
        tag_f = ImageFont.truetype(str(FONT_DIR / "InstrumentSans-Regular.ttf"), 34)
        chip_f = ImageFont.truetype(str(FONT_DIR / "InstrumentSans-Bold.ttf"), 22)
    except OSError:
        print("og: skipped (brand fonts unavailable on this machine)")
        return

    img = Image.new("RGB", (W, H), NAVY)
    glow = Image.new("RGB", (W, H), NAVY)
    ImageDraw.Draw(glow).ellipse([W - 620, H - 520, W + 220, H + 260], fill=PLUM)
    img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(190)), 0.55)

    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 6], fill=TEAL)

    card_w = card_h = 300
    card = square(art, card_w, pad_ratio=0.11)
    mask = Image.new("L", (card_w, card_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, card_w - 1, card_h - 1], radius=36, fill=255)
    img.paste(card.convert("RGB"), (84, (H - card_h) // 2), mask)

    x = 84 + card_w + 62
    d.text((x, 196), "Common Ground", font=title_f, fill=WHITE)
    for i, line in enumerate(
        ["Clear next steps, local support, and real", "help for families on the autism journey."]
    ):
        d.text((x, 300 + i * 46), line, font=tag_f, fill=MUTED)

    label = "FREE  ·  NO SIGN-UP REQUIRED"
    box = d.textbbox((0, 0), label, font=chip_f)
    cw, ch = box[2] - box[0] + 44, box[3] - box[1] + 28
    d.rounded_rectangle([x, 416, x + cw, 416 + ch], radius=ch // 2, fill=TEAL)
    d.text((x + 22, 416 + 13), label, font=chip_f, fill=WHITE)

    img.save(ROOT / "src/app/opengraph-image.png", quality=95)
    img.save(ROOT / "src/app/twitter-image.png", quality=95)
    print("og: opengraph-image, twitter-image (1200x630)")


def main():
    if not MARK.exists():
        sys.exit(f"missing {MARK}")
    art = trimmed_art(MARK)
    print(f"source mark: {Image.open(MARK).size}  artwork: {art.size}")
    build_icons(art)
    build_og(art)


if __name__ == "__main__":
    main()
