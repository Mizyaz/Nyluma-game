import cv2, numpy as np, json
R44='../r44/out/'
m=np.load('masks.npy'); pink_c,purp_c=m[0],m[1]
bz=cv2.imread(R44+'bezel_mask.png',0)>127
H,W=bz.shape
def u8(x): return x.astype(np.uint8)*255
def el(k): return cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(k,k))
content=pink_c|purp_c
fr=bz & ~(cv2.dilate(u8(content),el(9))>0)
fr=cv2.morphologyEx(u8(fr),cv2.MORPH_OPEN,el(5))
fr=cv2.morphologyEx(fr,cv2.MORPH_CLOSE,el(9))
n,lab,st,_=cv2.connectedComponentsWithStats(fr)
i=1+np.argmax(st[1:,4]); fr=(lab==i)
cs,hier=cv2.findContours(u8(fr),cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
hier=hier[0]
ext=[k for k in range(len(cs)) if hier[k][3]<0]
e=max(ext,key=lambda k:cv2.contourArea(cs[k]))
holes=[k for k in range(len(cs)) if hier[k][3]==e]
hk=max(holes,key=lambda k:cv2.contourArea(cs[k]))
print('outer area',cv2.contourArea(cs[e]),'hole area',cv2.contourArea(cs[hk]),'n holes',len(holes))
def smooth(c,sig,eps):
    c=c.reshape(-1,2).astype(float)
    k=int(sig*3); w=np.exp(-np.arange(-k,k+1)**2/(2*sig*sig)); w/=w.sum()
    cc=np.concatenate([c[-k:],c,c[:k]])
    sm=np.stack([np.convolve(cc[:,i],w,'valid') for i in range(2)],1)
    return cv2.approxPolyDP(sm.astype(np.float32).reshape(-1,1,2),eps,True).reshape(-1,2)
# outer grows by ~3px (half the outline) so the hull line sits where the ink was
om=np.zeros((H,W),np.uint8); cv2.drawContours(om,[cs[e]],-1,255,-1); om=cv2.dilate(om,el(5))
hm=np.zeros((H,W),np.uint8); cv2.drawContours(hm,[cs[hk]],-1,255,-1)
o=smooth(cv2.findContours(om,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)[0][0],5,1.4)
h=smooth(cv2.findContours(hm,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)[0][0],4,1.2)
print('outer',len(o),cv2.boundingRect(o.astype(np.int32)),'hole',len(h),cv2.boundingRect(h.astype(np.int32)))
viz=cv2.imread(R44+'head_zoom.png')
cv2.polylines(viz,[o.astype(np.int32).reshape(-1,1,2)],True,(0,255,0),2)
cv2.polylines(viz,[h.astype(np.int32).reshape(-1,1,2)],True,(255,255,0),2)
cv2.imwrite('bezel_viz.png',viz)
np.save('hole.npy',hm>0); np.save('outer.npy',om>0)
json.dump({'outer':o.round(1).tolist(),'hole':h.round(1).tolist()},open('bezel.json','w'))
