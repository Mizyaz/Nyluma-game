# Dev helper: lay screenshots side by side on one contact sheet (needs Pillow).
# usage: python3 scripts/montage.py out.png cols [label=]file ...
# Each picture is shrunk to at most 640 px wide; look at one sheet rather than many shots.
import sys
from PIL import Image, ImageDraw

out = sys.argv[1]
cols = int(sys.argv[2])
ims = []
for it in sys.argv[3:]:
    lab, f = it.split('=', 1) if '=' in it else ('', it)
    ims.append((lab, Image.open(f).convert('RGB')))
w = max(i.width for _, i in ims)
h = max(i.height for _, i in ims)
scale = min(1.0, 640 / w)
tw, th = int(w * scale), int(h * scale)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (tw + 6) + 6, rows * (th + 26) + 6), (40, 36, 48))
d = ImageDraw.Draw(sheet)
for k, (lab, im) in enumerate(ims):
    r, c = divmod(k, cols)
    x = 6 + c * (tw + 6)
    y = 6 + r * (th + 26)
    sheet.paste(im.resize((int(im.width * scale), int(im.height * scale))), (x, y + 20))
    d.text((x + 2, y + 4), lab, fill=(255, 240, 200))
sheet.save(out)
print(out, sheet.size)
