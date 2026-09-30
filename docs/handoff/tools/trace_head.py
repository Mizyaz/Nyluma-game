import cv2, numpy as np, json
z = cv2.imread('out/head_zoom.png')
hsv = cv2.cvtColor(z, cv2.COLOR_BGR2HSV)
H,S,V = [hsv[...,i].astype(int) for i in range(3)]
dark = V < 95
pink = (~dark) & (H >= 158) & (H <= 180) & (S >= 85)
maze = (~dark) & (H >= 138) & (H < 162) & (S >= 35) & (S < 120) & (V > 120)
frame = (~dark) & (H >= 125) & (H <= 175) & (S < 45) & (V > 150)
wood = (~dark) & (H >= 8) & (H <= 26) & (S > 45)
green = (~dark) & (H >= 28) & (H <= 55)
def clean(m, k=5):
    m = m.astype(np.uint8)*255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((k,k),np.uint8))
    return m
vis = np.zeros_like(z)
for m,c in [(pink,(160,90,230)),(maze,(200,120,190)),(frame,(230,210,230)),(wood,(80,120,160)),(green,(90,150,110))]:
    vis[clean(m)>0] = c
cv2.imwrite('out/head_seg.png', vis)
# screen = pink + maze (+ dark lines in between) -> fill holes of the union
scr = clean(pink|maze, 3)
scr = cv2.morphologyEx(scr, cv2.MORPH_CLOSE, np.ones((25,25),np.uint8))
cs,_ = cv2.findContours(scr, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c = max(cs, key=cv2.contourArea)
print('screen area', cv2.contourArea(c), cv2.boundingRect(c))
out = {'screen': cv2.approxPolyDP(c, 4, True).reshape(-1,2).tolist()}
# frame outer = frame + screen, closed
fr = clean(frame,3) | scr
fr = cv2.morphologyEx(fr, cv2.MORPH_CLOSE, np.ones((31,31),np.uint8))
cs,_ = cv2.findContours(fr, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c = max(cs, key=cv2.contourArea)
print('frame outer', cv2.boundingRect(c))
out['frame'] = cv2.approxPolyDP(c, 4, True).reshape(-1,2).tolist()
# maze blocks: components of maze mask, expanded by half line width (they are drawn with outline)
mz = clean(maze,5)
n, lab, st, cen = cv2.connectedComponentsWithStats(mz)
blocks = []
for i in range(1,n):
    if st[i,4] < 600: continue
    m = (lab==i).astype(np.uint8)*255
    m = cv2.dilate(m, np.ones((9,9),np.uint8))
    cs,_ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)
    blocks.append(cv2.approxPolyDP(c, 5, True).reshape(-1,2).tolist())
    print('block', st[i])
out['blocks'] = blocks
# wood planks: components of wood
wd = clean(wood,5)
n, lab, st, cen = cv2.connectedComponentsWithStats(wd)
planks=[]
for i in range(1,n):
    if st[i,4] < 3000: continue
    m = (lab==i).astype(np.uint8)*255
    m = cv2.dilate(m, np.ones((9,9),np.uint8))
    cs,_ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)
    planks.append(cv2.approxPolyDP(c, 5, True).reshape(-1,2).tolist())
    print('plank', st[i])
out['planks'] = planks
gr = clean(green,5)
n, lab, st, cen = cv2.connectedComponentsWithStats(gr)
for i in range(1,n):
    if st[i,4] < 3000: continue
    print('green', st[i])
json.dump(out, open('out/head_trace.json','w'))
# overlay the traced polygons
ov = z.copy()
cv2.polylines(ov, [np.array(out['screen'])], True, (0,255,0), 2)
cv2.polylines(ov, [np.array(out['frame'])], True, (255,0,0), 2)
for b in blocks: cv2.polylines(ov, [np.array(b)], True, (0,255,255), 2)
for p in planks: cv2.polylines(ov, [np.array(p)], True, (0,0,255), 2)
cv2.imwrite('out/head_trace.png', np.hstack([ov, vis]))
