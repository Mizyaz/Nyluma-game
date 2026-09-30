import numpy as np, cv2
from PIL import Image
U='/root/.claude/uploads/412530b9-7f90-5327-9330-8f73b0180b4a/'
bgr=cv2.imread(U+'0f999d99-image.jpg')
lab=cv2.cvtColor(bgr,cv2.COLOR_BGR2LAB)
L=lab[...,0].astype(np.float32)
# Ink: dark pixels. Use a threshold with a small hysteresis: core < 60, grow into < 95 when connected.
core=(L<60).astype(np.uint8)
loose=(L<100).astype(np.uint8)
# hysteresis: keep loose components that touch core
n,lbl=cv2.connectedComponents(loose,connectivity=8)
touch=np.zeros(n,bool); touch[np.unique(lbl[core>0])]=True; touch[0]=False
ink=touch[lbl].astype(np.uint8)
# Threshold at the midpoint for geometry (antialias): use L<80 inside the hysteresis mask
ink=((L<85)&(ink>0)).astype(np.uint8)
ink=cv2.morphologyEx(ink,cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
n,lbl,st,_=cv2.connectedComponentsWithStats(ink,connectivity=8)
keep=np.zeros(n,bool); keep[1:]=st[1:,cv2.CC_STAT_AREA]>=12
ink=keep[lbl].astype(np.uint8)
cv2.imwrite('ink.png',255-ink*255)
# Fills: inpaint the ink plus a halo (antialias + the painted shadow), then flatten the linen hatch.
halo=cv2.dilate(ink,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7)))
fill=cv2.inpaint(bgr,halo,5,cv2.INPAINT_TELEA)
for _ in range(2):
    fill=cv2.medianBlur(fill,7)
fill=cv2.bilateralFilter(fill,9,30,9)
cv2.imwrite('fill.png',fill)
print('ink px',int(ink.sum()))
