import cv2, sys
im=cv2.imread('/root/.claude/uploads/412530b9-7f90-5327-9330-8f73b0180b4a/0f999d99-image.jpg')
# args: x0 y0 x1 y1 (px) scale step(px) out
x0,y0,x1,y1=map(int,sys.argv[1:5]); s=float(sys.argv[5]); step=int(sys.argv[6]); out=sys.argv[7]
c=im[y0:y1,x0:x1].copy()
c=cv2.resize(c,None,fx=s,fy=s,interpolation=cv2.INTER_AREA)
for u in range((x0//step+1)*step,x1,step):
    X=int((u-x0)*s); col=(0,0,255) if u%(step*4)==0 else (255,120,0)
    cv2.line(c,(X,0),(X,c.shape[0]),col,1)
    if u%(step*2)==0: cv2.putText(c,str(u),(X+2,11),cv2.FONT_HERSHEY_SIMPLEX,0.36,(0,0,200),1)
for v in range((y0//step+1)*step,y1,step):
    Y=int((v-y0)*s); col=(0,0,255) if v%(step*4)==0 else (255,120,0)
    cv2.line(c,(0,Y),(c.shape[1],Y),col,1)
    if v%(step*2)==0: cv2.putText(c,str(v),(2,Y-2),cv2.FONT_HERSHEY_SIMPLEX,0.36,(0,0,200),1)
cv2.imwrite(out,c)
