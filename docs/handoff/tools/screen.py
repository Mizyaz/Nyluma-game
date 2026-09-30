import cv2, numpy as np, json
R44='../r44/out/'
m=np.load('masks.npy'); pink,purp=m[0],m[1]
img=cv2.cvtColor(cv2.imread(R44+'head_zoom.png'),cv2.COLOR_BGR2RGB)
H,W=pink.shape
UP=4
def sdf(mask):
    f=cv2.GaussianBlur(mask.astype(np.float32),(0,0),2.0)
    big=cv2.resize(f,(W*UP,H*UP),interpolation=cv2.INTER_CUBIC)>0.5
    b8=big.astype(np.uint8)
    din=cv2.distanceTransform(b8,cv2.DIST_L2,5)
    dout=cv2.distanceTransform(1-b8,cv2.DIST_L2,5)
    sd=(din-dout)/UP
    return cv2.resize(sd,(W,H),interpolation=cv2.INTER_AREA)
sp=sdf(pink); sq=sdf(purp)
# colour by depth inside each shape
for name,sd in (('pink',sp),('purp',sq)):
    for a,b in ((0.5,3),(3,6),(6,10),(10,16),(16,99)):
        sel=(sd>=a)&(sd<b)
        if sel.sum()==0: continue
        c=np.median(img[sel],0)
        print(name,a,b,int(sel.sum()),'#%02x%02x%02x'%tuple(int(x) for x in c))
# purple: top-left vs bottom-right light
ys,xs=np.nonzero(sq>4)
for part,sel in (('upper',ys<np.median(ys)),('lower',ys>=np.median(ys))):
    c=np.median(img[ys[sel],xs[sel]],0); print('purp',part,'#%02x%02x%02x'%tuple(int(x) for x in c))
ink=(sp<-3)&(sq<-3)&np.load('hole.npy')
c=np.median(img[ink],0); print('ink #%02x%02x%02x'%tuple(int(x) for x in c), int(ink.sum()))
SPREAD=16.0
enc=lambda sd: np.clip(0.5+sd/(2*SPREAD),0,1)
glow=cv2.GaussianBlur(pink.astype(np.float32),(0,0),10.0); glow/=glow.max()
x0,y0,w,h=150,180,520,380
out=np.stack([enc(sp),enc(sq),glow],-1)[y0:y0+h,x0:x0+w]
out8=np.round(out*255).astype(np.uint8)
cv2.imwrite('gorti-screen.png',cv2.cvtColor(out8,cv2.COLOR_RGB2BGR),[cv2.IMWRITE_PNG_COMPRESSION,9])
# preview decode
dec=np.zeros((h,w,3),np.float32)+np.array([14,10,16])/255
def ss(e0,e1,x): t=np.clip((x-e0)/(e1-e0),0,1); return t*t*(3-2*t)
r=out[...,0]; g=out[...,1]
aw=1.2/(2*SPREAD)
kp=ss(0.5-aw,0.5+aw,r)[...,None]; kq=ss(0.5-aw,0.5+aw,g)[...,None]
pinkc=np.array([0xe8,0x6c,0xa4])/255; pinkcore=np.array([0xf2,0x8c,0xb8])/255
col=dec*(1-kq)+kq*np.array([0xb8,0x80,0xc0])/255
col=col*(1-kp)+kp*(pinkc+(pinkcore-pinkc)*ss(0.55,0.9,r)[...,None])
cv2.imwrite('screen_dec.png',cv2.cvtColor((np.clip(col,0,1)*255).astype(np.uint8),cv2.COLOR_RGB2BGR))
print('saved',out8.shape, 'rect',x0,y0,w,h)
