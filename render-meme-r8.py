#!/usr/bin/env python3
"""Render the VICE CITY GENERAL HOSPITAL prescription meme (1600x1600).

Deterministic: no randomness, no network. Output: meme-r8.png
"""
import hashlib
from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 1600
OUT = "meme-r8.png"

NAVY = (16, 42, 67)
RED = (193, 39, 45)
RED_DARK = (150, 22, 28)
MAGENTA = (216, 17, 89)
MAGENTA_DARK = (176, 9, 68)
PAPER = (255, 255, 255)
GRAY = (110, 116, 124)
LIGHT = (245, 246, 248)
PINK_BG = (255, 235, 238)
TEAL = (0, 150, 136)

FONT_DIR = "/usr/share/fonts/truetype/dejavu"


def font(name, size, subdir="dejavu"):
    return ImageFont.truetype(f"/usr/share/fonts/truetype/{subdir}/{name}", size)


F_SERIF_B = lambda s: font("DejaVuSerif-Bold.ttf", s)
F_SERIF_I = lambda s: font("LiberationSerif-Italic.ttf", s, "liberation")
F_SANS_B = lambda s: font("DejaVuSans-Bold.ttf", s)
F_SANS = lambda s: font("DejaVuSans.ttf", s)


def text(draw, xy, s, f, fill, anchor="la"):
    draw.text(xy, s, font=f, fill=fill, anchor=anchor)


def centered(draw, cx, y, s, f, fill):
    text(draw, (cx, y), s, f, fill, anchor="ma")


def wrap(draw, s, f, max_w):
    words = s.split()
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=f) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_ghost(draw, x, y, w, h, fill):
    """Simple make.fun-style ghost, fully inside (x, y, w, h)."""
    # head: semicircle on top of a body with a wavy bottom
    r = w // 2
    draw.ellipse([x, y, x + w, y + 2 * r], fill=fill)
    body_top = y + r
    body_bottom = y + h
    # body rectangle down to the wave start
    wave_h = 26
    draw.rectangle([x, body_top, x + w, body_bottom - wave_h], fill=fill)
    # wavy bottom: three bumps (drawn as circles below the cut line)
    bump_w = w // 3
    for i in range(3):
        bx0 = x + i * bump_w
        draw.pieslice([bx0, body_bottom - 2 * wave_h, bx0 + bump_w, body_bottom],
                      start=0, end=180, fill=fill)
    # eyes + mouth (dark on the white ghost), sized to fit inside the body
    ex = x + w // 2
    ey = y + int(h * 0.38)
    draw.ellipse([ex - 26, ey - 14, ex - 6, ey + 14], fill=NAVY)
    draw.ellipse([ex + 6, ey - 14, ex + 26, ey + 14], fill=NAVY)
    draw.ellipse([ex - 7, ey + 32, ex + 7, ey + 44], fill=NAVY)


def main():
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)

    # ---- paper border ----
    d.rectangle([24, 24, W - 24, H - 24], outline=NAVY, width=6)
    d.rectangle([40, 40, W - 40, H - 40], outline=(200, 205, 212), width=2)

    # ================= HEADER =================
    # red cross badge
    d.rounded_rectangle([72, 72, 196, 196], radius=18, fill=RED)
    d.rectangle([122, 92, 146, 176], fill=PAPER)
    d.rectangle([88, 126, 180, 150], fill=PAPER)
    # hospital name
    text(d, (224, 66), "VICE CITY GENERAL", F_SERIF_B(76), NAVY)
    text(d, (224, 148), "HOSPITAL", F_SERIF_B(76), NAVY)
    text(d, (224, 232), "EMERGENCY DEPARTMENT  ·  123 OCEAN DRIVE, VICE CITY, LEONIDA",
         F_SANS(26), GRAY)
    # form number, top right
    text(d, (1528, 76), "FORM VC-2013", F_SANS_B(28), RED, anchor="ra")
    text(d, (1528, 112), "DEA # VC-0917-2013", F_SANS(24), GRAY, anchor="ra")

    d.line([72, 286, 1528, 286], fill=NAVY, width=4)

    # ================= PRESCRIPTION TITLE =================
    centered(d, W // 2, 312, "P R E S C R I P T I O N", F_SERIF_B(58), NAVY)
    # big Rx at left
    text(d, (72, 372), "Rx", F_SERIF_B(150), RED)

    # patient grid (right of Rx)
    gx, gy = 300, 396
    fields = [
        ("PATIENT", "EVERY GTA FAN"),
        ("AGE", "13 YEARS"),
        ("DOB", "SEP 17 2013"),
        ("DATE", "NOV 22 2026"),
    ]
    col_w = 640
    for i, (label, value) in enumerate(fields):
        cx = gx + (i % 2) * col_w
        cy = gy + (i // 2) * 96
        text(d, (cx, cy), label, F_SANS_B(26), GRAY)
        text(d, (cx, cy + 32), value, F_SANS_B(46), NAVY)

    # ================= DIAGNOSIS =================
    d.rounded_rectangle([72, 600, 1528, 748], radius=16, fill=PINK_BG, outline=RED, width=3)
    text(d, (104, 620), "DIAGNOSIS", F_SANS_B(28), RED)
    text(d, (104, 654), "GTA VI WITHDRAWAL SYNDROME — ACUTE", F_SANS_B(50), RED_DARK)
    text(d, (104, 712), "Patient has waited 13 years. Symptoms: refreshing trailer pages, counting days.",
         F_SANS(26), (90, 40, 44))

    # ================= THE Rx =================
    text(d, (72, 782), "GRAND THEFT AUTO VI", F_SANS_B(72), NAVY)
    text(d, (72, 862), "250 GB  —  take ONE (1) copy on 19 NOV 2026", F_SANS_B(44), NAVY)
    text(d, (72, 922), "Sig: One copy by mouth on release day. Do not drive (in real life) while playing.",
         F_SANS(30), GRAY)
    # refills
    text(d, (72, 972), "REFILLS:  0  —  NO REFILLS.", F_SANS_B(38), RED_DARK)
    text(d, (72, 1022), "One copy took 13 years. There will not be a second wait.", F_SANS(30), GRAY)

    d.line([72, 1080, 1528, 1080], fill=(200, 205, 212), width=2)

    # ================= SIDE EFFECTS =================
    text(d, (72, 1104), "SIDE EFFECTS", F_SANS_B(28), RED)
    se = "Vice City flu  ·  214 GB day-one update  ·  empty wallet  ·  5 sick days (doctor approved)"
    lines = wrap(d, se, F_SANS_B(36), 1456)
    yy = 1144
    for ln in lines:
        text(d, (72, yy), ln, F_SANS_B(36), NAVY)
        yy += 48

    # ================= QTY / PRICE =================
    text(d, (72, 1262), "QTY 1  ×  GTA VI — STANDARD", F_SANS_B(44), NAVY)
    text(d, (1528, 1246), "$79.99", F_SANS_B(64), NAVY, anchor="ra")

    # ================= DOCTOR =================
    d.line([72, 1360, 700, 1360], fill=NAVY, width=3)
    text(d, (72, 1372), "Dr. Jason & Lucia, MD", F_SERIF_I(44), NAVY)
    text(d, (72, 1426), "LICENSED TO PRESCRIBE HYPE", F_SANS(24), GRAY)

    # ================= RED STAMP (rotated, bottom-right gap above the footer) ====
    # Small enough to fit fully between the price row and the footer band.
    stamp = Image.new("RGBA", (400, 110), (0, 0, 0, 0))
    sd = ImageDraw.Draw(stamp)
    sd.rounded_rectangle([4, 4, 396, 106], radius=14, outline=RED, width=6)
    sd.text((200, 22), "DISPENSED", font=F_SANS_B(44), fill=RED, anchor="ma")
    sd.text((200, 68), "AFTER 13 YEARS", font=F_SANS_B(34), fill=RED, anchor="ma")
    stamp = stamp.rotate(-6, expand=True, resample=Image.BICUBIC)
    img.paste(stamp, (1080, 1305), stamp)
    d = ImageDraw.Draw(img)

    # ================= MAGENTA FOOTER =================
    fy0, fy1 = 1470, 1600
    d.rectangle([40, fy0, W - 40, fy1 - 24], fill=MAGENTA)
    # ghost, fully inside the footer with margin (fixes R7's left-edge clip
    # and the bottom clip: footer band is 1470..1576, ghost ends at 1572)
    draw_ghost(d, 96, fy0 + 14, 84, 88, PAPER)
    # footer text
    text(d, (216, fy0 + 14), "PAID BY MY AI AGENT", F_SANS_B(44), PAPER)
    text(d, (216, fy0 + 66), "with a bounty payout it earned on make.fun", F_SANS(30), (255, 220, 232))
    # make.fun pill, right side
    pill = "make.fun"
    pw = int(d.textlength(pill, font=F_SANS_B(40))) + 56
    px0, py0 = 1528 - 40 - pw, fy0 + 28
    d.rounded_rectangle([px0, py0, px0 + pw, py0 + 64], radius=32, fill=PAPER)
    text(d, (px0 + 28, py0 + 12), pill, F_SANS_B(40), MAGENTA)

    img.save(OUT, "PNG")
    data = open(OUT, "rb").read()
    print(f"{OUT}: {len(data)} bytes sha256={hashlib.sha256(data).hexdigest()}")


if __name__ == "__main__":
    main()
