import cv2, numpy as np, json
z = cv2.imread('out/head_zoom.png')
hsv = cv2.cvtColor(z, cv2.COLOR_BGR2HSV)
H,S,V = [hsv[...,i].astype(int) for i in range(3)]
dark = V < 95
def comp(mask, k_open=5, k_close=0, eps=3, minA=500):
    m = mask.astype(np.uint8)*255
    if k_open: m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((k_open,k_open),np.uint8))
    if k_close: m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((k_close,k_close),np.uint8))
    cs,_ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    return [cv2.approxPolyDP(c, eps, True).reshape(-1,2).tolist() for c in cs if cv2.contourArea(c) >= minA]
pink = (~dark) & (H >= 158) & (H <= 180) & (S >= 85)
pk = comp(pink, 5, 7, 3, 2000)
print('pink', pk)
# everything non-dark light-lilac-ish (bezel incl shading), excluding the pink and the saturated blocks
bez = (~dark) & (((H >= 110) & (S < 60)) ) & (V > 105)
bz = bez.astype(np.uint8)*255
bz = cv2.morphologyEx(bz, cv2.MORPH_OPEN, np.ones((3,3),np.uint8))
cv2.imwrite('out/bezel_mask.png', bz)
# screen region = holes inside the visor: pink + blocks + dark lines inside. Take (pink|maze) closed big
maze = (~dark) & (H >= 138) & (H < 162) & (S >= 35) & (S < 120) & (V > 120)
m = ((pink|maze).astype(np.uint8)*255)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((41,41),np.uint8))
cs,_ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c = max(cs, key=cv2.contourArea)
print('screen', cv2.approxPolyDP(c, 6, True).reshape(-1,2).tolist())
