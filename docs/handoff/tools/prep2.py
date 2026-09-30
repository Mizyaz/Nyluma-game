import numpy as np, cv2
U='/root/.claude/uploads/412530b9-7f90-5327-9330-8f73b0180b4a/'
bgr=cv2.imread(U+'0f999d99-image.jpg')
lab=cv2.cvtColor(bgr,cv2.COLOR_BGR2LAB).astype(np.float32)
L=lab[...,0]
chroma=np.hypot(lab[...,1]-128,lab[...,2]-128)
# 1. core ink: very dark and neutral
core=((L<44)&(chroma<14)).astype(np.uint8)
core=cv2.morphologyEx(core,cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
n,lbl,st,_=cv2.connectedComponentsWithStats(core,connectivity=8)
keep=np.zeros(n,bool); keep[1:]=st[1:,cv2.CC_STAT_AREA]>=10
core=keep[lbl].astype(np.uint8)
# 2. regions of the rest, and each region's fill lightness (far from ink)
free=(1-core).astype(np.uint8)
n,lbl,st,_=cv2.connectedComponentsWithStats(free,connectivity=4)
dist=cv2.distanceTransform(free,cv2.DIST_L2,5)
order=np.argsort(lbl.ravel()); lr=lbl.ravel()[order]; dr=dist.ravel()[order]; Lr=L.ravel()[order]
starts=np.searchsorted(lr,np.arange(n+1))
Lfill=np.zeros(n,np.float32)
for r in range(1,n):
    a,b=starts[r],starts[r+1]; d=dr[a:b]
    th=min(10.0,0.6*d.max()); sel=Lr[a:b][d>=th]
    Lfill[r]=np.median(sel) if sel.size>=3 else np.median(Lr[a:b])
# 3. edge pixels near the core join the ink where darker than midway to their region's fill
near=(dist>0)&(dist<=4.5)
thr=(22+Lfill[lbl])/2
ink=core.copy(); ink[near&(L<thr)]=1
ink=cv2.morphologyEx(ink,cv2.MORPH_CLOSE,np.ones((2,2),np.uint8))
n2,l2,s2,_=cv2.connectedComponentsWithStats(ink,connectivity=8)
k2=np.zeros(n2,bool); k2[1:]=s2[1:,cv2.CC_STAT_AREA]>=12
ink=k2[l2].astype(np.uint8)
cv2.imwrite('ink.png',255-ink*255)
print('ink px',int(ink.sum()))
