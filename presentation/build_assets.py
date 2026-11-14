"""Prepare images for the FIRE-X presentation (run with the project .venv)."""
import sys
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageChops

src_dir = Path(sys.argv[1])
out = Path(__file__).parent / "assets"
out.mkdir(exist_ok=True)

# ── Hardware photo: crop to the board, punch up colours, sink the table into darkness ──
img = Image.open(src_dir / "3.jpg").convert("RGB")
w, h = img.size
img = img.crop((int(w * 0.13), int(h * 0.08), int(w * 0.86), int(h * 0.88)))
img = ImageEnhance.Contrast(img).enhance(1.25)
img = ImageEnhance.Color(img).enhance(1.25)
img = ImageEnhance.Sharpness(img).enhance(1.6)

# cool, dark grade on the wooden background (keeps the board readable)
w, h = img.size
r, g, b = img.split()
graded = Image.merge("RGB", (r.point(lambda v: int(v * 0.30)), g.point(lambda v: int(v * 0.36)), b.point(lambda v: int(v * 0.55))))

# radial mask: centre = original colours, edges = graded + black
mask = Image.new("L", (w, h), 0)
d = ImageDraw.Draw(mask)
cx, cy = int(w * 0.52), int(h * 0.58)
for i in range(60, 0, -1):
    k = i / 60
    rx, ry = int(w * 0.50 * k), int(h * 0.52 * k)
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=int(255 * (1 - k) ** 0.6))
mask = mask.filter(ImageFilter.GaussianBlur(40))
mixed = Image.composite(img, graded, mask)
black = Image.new("RGB", (w, h), (4, 8, 18))
vignette = mask.point(lambda v: min(255, int(v * 1.25)))
final = Image.composite(mixed, black, vignette)
final.save(out / "hardware_hero.jpg", quality=92)

# ── Dashboard screenshot ──
Image.open(src_dir / "4.webp").convert("RGB").save(out / "dashboard_live.jpg", quality=92)
print("assets ready:", sorted(p.name for p in out.iterdir()))
