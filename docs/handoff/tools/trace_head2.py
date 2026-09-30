import cv2, numpy as np, json
z = cv2.imread('out/head_zoom.png')
hsv = cv2.cvtColor(z, cv2.COLOR_BGR2HSV)
H,S,V = [hsv[...,i].astype(int) for i in range(3)]
dark = V < 95
pink = ((~dark) & (H >= 158) & (H <= 180) & (S >= 85)).astype(np.uint8)*255
frame = ((~dark) & (H >= 110) & (H <= 179) & (S < 50) & (V > 150)).astype(np.uint8)*255
frame = cv2.morphologyEx(frame, cv2.MORPH_CLOSE, np.ones((9,9),np.uint8))
# frame ring: outer = external contour; inner = hole
cs, hier = cv2.findContours(frame, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
big = max(range(len(cs)), key=lambda i: cv2.contourArea(cs[i]))
outer = cs[big]
holes = [cs[i] for i in range(len(cs)) if hier[0][i][3] == big]
inner = max(holes, key=cv2.contourArea) if holes else None
print('outer bbox', cv2.boundingRect(outer), 'inner bbox', cv2.boundingRect(inner) if inner is not None else None)
pk = cv2.morphologyEx(pink, cv2.MORPH_OPEN, np.ones((5,5),np.uint8))
cs2,_ = cv2.findContours(pk, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
pc = max(cs2, key=cv2.contourArea)
print('pink bbox', cv2.boundingRect(pc), cv2.contourArea(pc))
# grey-lilac zone inside the screen: not pink, not maze, not dark, inside inner
def poly(c, eps): return cv2.approxPolyDP(c, eps, True).reshape(-1,2).tolist()
out = {'outer': poly(outer,3), 'inner': poly(inner,3), 'pink': poly(pc,3)}
t = json.load(open('out/head_trace.json'))
out['blocks'] = t['blocks']; out['planks'] = t['planks']
json.dump(out, open('out/head_trace2.json','w'))
ov = z.copy()
cv2.polylines(ov, [np.array(out['outer'])], True, (255,0,0), 2)
cv2.polylines(ov, [np.array(out['inner'])], True, (0,200,0), 2)
cv2.polylines(ov, [np.array(out['pink'])], True, (0,255,255), 2)
for b in out['blocks']: cv2.polylines(ov, [np.array(b)], True, (255,255,0), 2)
cv2.imwrite('out/head_trace2.png', ov)
for k in ('outer','inner','pink'): print(k, len(out[k]), out[k])
for b in out['blocks']: print('block', b)
for p in out['planks']: print('plank', p)
