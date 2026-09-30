import cv2, numpy as np, json
R44='../r44/out/'
seg=cv2.cvtColor(cv2.imread(R44+'head_seg.png'),cv2.COLOR_BGR2RGB).astype(int)
def cls(c): return (np.abs(seg-np.array(c)).sum(-1)<10)
black=cls([0,0,0]); brown=cls([160,120,80]); pink=cls([230,90,160]); green=cls([110,150,90]); lil=cls([230,210,230]); purp=cls([190,120,200])
H,W=black.shape
def u8(m): return (m.astype(np.uint8)*255)
def op(m,k,kind): return cv2.morphologyEx(u8(m),kind,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(k,k)))>0
# clean masks
pink_c=op(op(pink,5,cv2.MORPH_OPEN),5,cv2.MORPH_CLOSE)
purp_c=op(op(purp,5,cv2.MORPH_OPEN),5,cv2.MORPH_CLOSE)
# keep big components only
def big(m,minA):
    n,lab,st,_=cv2.connectedComponentsWithStats(u8(m))
    out=np.zeros_like(m)
    for i in range(1,n):
        if st[i,4]>=minA: out|=lab==i
    return out
pink_c=big(pink_c,2000); purp_c=big(purp_c,600)
content=pink_c|purp_c
scr=op(content,45,cv2.MORPH_CLOSE)
scr=big(scr,5000)
# fill holes
cs,_=cv2.findContours(u8(scr),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
scr=np.zeros_like(scr); cv2.drawContours(u8v:=np.zeros((H,W),np.uint8),cs,-1,255,-1); scr=u8v>0
hole=cv2.dilate(u8(scr),cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(15,15)))>0
# outer: complement of dilated brown/green, above y cap, component containing screen centre
bg=cv2.dilate(u8(brown|green),cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(13,13)))>0
cand=~bg
cand[:150,:]=False
cand=op(cand,9,cv2.MORPH_OPEN)
n,lab=cv2.connectedComponents(u8(cand))
yy,xx=np.nonzero(scr); cy,cx=int(yy.mean()),int(xx.mean())
outer=lab==lab[cy,cx]
outer=op(outer,25,cv2.MORPH_CLOSE)
cs,_=cv2.findContours(u8(outer),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE); c=max(cs,key=cv2.contourArea)
outer=np.zeros((H,W),np.uint8); cv2.drawContours(outer,[c],-1,255,-1); outer=outer>0
print('screen centre',cx,cy,'outer bbox',cv2.boundingRect(u8(outer)),'hole bbox',cv2.boundingRect(u8(hole)))
def smooth_contour(m,sig=4,eps=1.2):
    cs,_=cv2.findContours(u8(m),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    c=max(cs,key=cv2.contourArea).reshape(-1,2).astype(float)
    # circular gaussian smoothing
    k=int(sig*3); w=np.exp(-np.arange(-k,k+1)**2/(2*sig*sig)); w/=w.sum()
    cc=np.concatenate([c[-k:],c,c[:k]])
    sm=np.stack([np.convolve(cc[:,i],w,'valid') for i in range(2)],1)
    ap=cv2.approxPolyDP(sm.astype(np.float32).reshape(-1,1,2),eps,True).reshape(-1,2)
    return ap
o=smooth_contour(outer,5,1.5); h=smooth_contour(hole,4,1.2)
print('outer pts',len(o),'hole pts',len(h))
viz=cv2.imread(R44+'head_zoom.png')
cv2.polylines(viz,[o.astype(np.int32).reshape(-1,1,2)],True,(0,255,0),2)
cv2.polylines(viz,[h.astype(np.int32).reshape(-1,1,2)],True,(255,255,0),2)
cv2.imwrite('bezel_viz.png',viz)
np.save('masks.npy',np.stack([pink_c,purp_c,hole,outer]))
json.dump({'outer':o.round(1).tolist(),'hole':h.round(1).tolist()},open('bezel.json','w'))
