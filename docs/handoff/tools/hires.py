"""Crisp reconstruction of the painting at a larger scale.

The painting is pastel fills with thick black outlines, stored as a soft JPEG.
Upscaling it plainly keeps the soft line halos (washed out). Instead:
  ink  : per-pixel ink coverage unmixed against the local fill lightness,
         upscaled and re-thresholded at its half maximum with a 1 px ramp (crisp, antialiased)
  fill : the original colour away from the lines; under the lines and their
         halos, the region's own flat colour times the nearest clean texel's
         texture (original / flat), so tiny regions keep their own colour
  out  : mix(fill, ink colour, ink)
"""
import numpy as np, cv2

U = '/root/.claude/uploads/412530b9-7f90-5327-9330-8f73b0180b4a/'


def load():
    bgr = cv2.imread(U + '0f999d99-image.jpg')
    ink = cv2.imread('ink.png', 0) < 128
    flat = cv2.imread('flat.png')
    return bgr, ink, flat


def ink_alpha(bgr, ink, flat):
    L = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)[..., 0].astype(np.float32)
    Lf = cv2.cvtColor(flat, cv2.COLOR_BGR2LAB)[..., 0].astype(np.float32)
    Lk = float(np.median(L[ink & (L < 40)]))
    a = np.clip((Lf - L) / np.maximum(Lf - Lk, 25.0), 0, 1)
    near = cv2.dilate(ink.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))) > 0
    a[~near] = 0
    # normalise thin lines by their own peak so they keep their half-max width
    peak = cv2.dilate(a, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    return np.clip(a / np.maximum(peak, 0.45), 0, 1), Lk


def sharpen_alpha(a, R, cut=0.5, ramp=1.0):
    up = cv2.resize(a, None, fx=R, fy=R, interpolation=cv2.INTER_CUBIC)
    gx = cv2.Sobel(up, cv2.CV_32F, 1, 0, ksize=3) / 8
    gy = cv2.Sobel(up, cv2.CV_32F, 0, 1, ksize=3) / 8
    g = np.maximum(np.hypot(gx, gy), 0.04)
    return np.clip(0.5 + (up - cut) / g / ramp, 0, 1)


def extend(img, bad):
    """Fill `bad` pixels with the value of the nearest good pixel."""
    good = (~bad).astype(np.uint8)
    # labels name each pixel's nearest ZERO pixel: zeros must be the good ones
    _, lab = cv2.distanceTransformWithLabels(1 - good, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
    gy, gx = np.nonzero(good)
    idx = np.zeros((lab.max() + 1, 2), np.int32)
    idx[1:len(gy) + 1, 0] = gy
    idx[1:len(gy) + 1, 1] = gx
    return img[idx[lab, 0], idx[lab, 1]]


def fill_image(b, k, f, halo=2.5, clamp=(0.85, 1.15)):
    """Clean fill: original away from lines, flat x nearby texture under them."""
    bad = cv2.distanceTransform((~k).astype(np.uint8), cv2.DIST_L2, 5) < halo
    b = b.astype(np.float32)
    f = f.astype(np.float32)
    ratio = extend(np.clip(b / np.maximum(f, 1), *clamp), bad)
    fill = np.where(bad[..., None], f * ratio, b)
    soft = cv2.GaussianBlur(fill, (0, 0), 0.6)
    return np.where(bad[..., None], soft, fill)


def reconstruct(bgr, ink, flat, R, x0=0, y0=0, x1=None, y1=None, usm=0.35, cut=0.5, alpha=None):
    a, Lk = alpha if alpha is not None else ink_alpha(bgr, ink, flat)
    ys, xs = slice(y0, y1), slice(x0, x1)
    fill = fill_image(bgr[ys, xs], ink[ys, xs], flat[ys, xs])
    up = cv2.resize(fill, None, fx=R, fy=R, interpolation=cv2.INTER_CUBIC)
    if usm:
        up = up + usm * (up - cv2.GaussianBlur(up, (0, 0), 1.2 * R))
    A = sharpen_alpha(a[ys, xs], R, cut)[..., None]
    inkc = np.array(cv2.cvtColor(np.uint8([[[Lk, 128, 128]]]), cv2.COLOR_LAB2BGR)[0, 0], np.float32)
    out = up * (1 - A) + inkc * A
    return np.clip(out, 0, 255).astype(np.uint8), A[..., 0]


if __name__ == '__main__':
    import sys
    bgr, ink, flat = load()
    R = float(sys.argv[1]) if len(sys.argv) > 1 else 1.5
    al = ink_alpha(bgr, ink, flat)
    for name, (x0, y0, x1, y1) in {'gorti': (1230, 1080, 1720, 1720), 'puzzle': (820, 1220, 1110, 1420), 'lid': (880, 700, 1260, 1060)}.items():
        out, A = reconstruct(bgr, ink, flat, R, x0, y0, x1, y1, alpha=al)
        ref = cv2.resize(bgr[y0:y1, x0:x1], None, fx=R, fy=R, interpolation=cv2.INTER_CUBIC)
        cv2.imwrite(f'out/{name}_new.png', out)
        cv2.imwrite(f'out/{name}_ref.png', ref)
    print('ok')
