import numpy as np, cv2, json
U='/root/.claude/uploads/412530b9-7f90-5327-9330-8f73b0180b4a/'
bgr=cv2.imread(U+'0f999d99-image.jpg')
H,W=bgr.shape[:2]
ink=(cv2.imread('ink.png',0)<128).astype(np.uint8)
free=(1-ink).astype(np.uint8)
n,lbl,st,cen=cv2.connectedComponentsWithStats(free,connectivity=4)
dist=cv2.distanceTransform(free,cv2.DIST_L2,5)
lab=cv2.cvtColor(bgr,cv2.COLOR_BGR2LAB).astype(np.float32)
cols=np.zeros((n,3),np.float32); spread=np.zeros(n); maxd=np.zeros(n)
# per-region max distance
order=np.argsort(lbl.ravel())
lr=lbl.ravel()[order]; dr=dist.ravel()[order]
starts=np.searchsorted(lr,np.arange(n+1))
labr=lab.reshape(-1,3)[order]
for r in range(1,n):
    a,b=starts[r],starts[r+1]
    d=dr[a:b]; c=labr[a:b]
    md=d.max(); maxd[r]=md
    th=min(12.0,0.6*md)
    sel=c[d>=th] if (d>=th).sum()>=3 else c
    if md<4:
        # tiny regions: every texel is darkened by the outline's blur; the
        # brightest quarter is the least touched
        sel=c[c[:,0]>=np.percentile(c[:,0],75)]
    cols[r]=np.median(sel,axis=0)
    spread[r]=np.linalg.norm(sel.std(axis=0))
# ink pixels -> nearest free pixel's region
_,near=cv2.distanceTransformWithLabels(free,cv2.DIST_L2,5,labelType=cv2.DIST_LABEL_PIXEL)
# map label index of zero pixels -> region: zero pixels of 'free' are ink... we need nearest free pixel, so invert
_,near=cv2.distanceTransformWithLabels(ink,cv2.DIST_L2,5,labelType=cv2.DIST_LABEL_PIXEL)
zy,zx=np.nonzero(ink==0)
idx2reg=np.zeros(near.max()+1,np.int32)
# labels enumerate zero pixels in raster order
idx2reg[1:len(zy)+1]=lbl[zy,zx]
reg=idx2reg[near]
flat_lab=cols[reg]
flat_lab[reg==0]=0
flat=cv2.cvtColor(np.clip(flat_lab,0,255).astype(np.uint8),cv2.COLOR_LAB2BGR)
cv2.imwrite('flat.png',flat)
np.save('regions.npy',reg)
big=[(int(r),int(st[r,cv2.CC_STAT_AREA]),float(spread[r]),[int(v) for v in cen[r]]) for r in range(1,n) if st[r,cv2.CC_STAT_AREA]>400 and spread[r]>9]
big.sort(key=lambda t:-t[2])
print('regions',n-1,'high-spread',len(big))
for t in big[:40]: print(t)
