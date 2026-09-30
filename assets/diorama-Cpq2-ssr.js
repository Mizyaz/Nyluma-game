var P0=Object.defineProperty;var D0=(n,e,t)=>e in n?P0(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Me=(n,e,t)=>D0(n,typeof e!="symbol"?e+"":e,t);const ni="srgb",oo="srgb-linear",lo="linear",$t="srgb";const Ic="300 es";function I0(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ua(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function k0(){const n=ua("canvas");return n.style.display="block",n}const kc={};function co(...n){const e="THREE."+n.shift();console.log(e,...n)}function df(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function it(...n){n=df(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Ut(...n){n=df(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function mr(...n){const e=n.join(" ");e in kc||(kc[e]=!0,it(...n))}function U0(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const N0={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};class zs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Wn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Po=Math.PI/180,Dl=180/Math.PI;function Ms(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wn[n&255]+Wn[n>>8&255]+Wn[n>>16&255]+Wn[n>>24&255]+"-"+Wn[e&255]+Wn[e>>8&255]+"-"+Wn[e>>16&15|64]+Wn[e>>24&255]+"-"+Wn[t&63|128]+Wn[t>>8&255]+"-"+Wn[t>>16&255]+Wn[t>>24&255]+Wn[i&255]+Wn[i>>8&255]+Wn[i>>16&255]+Wn[i>>24&255]).toLowerCase()}function It(n,e,t){return Math.max(e,Math.min(t,n))}function F0(n,e){return(n%e+e)%e}function Do(n,e,t){return(1-t)*n+t*e}function Fi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Wt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Mc=class Mc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=It(this.x,e.x,t.x),this.y=It(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=It(this.x,e,t),this.y=It(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(It(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Mc.prototype.isVector2=!0;let st=Mc;class Dr{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3],f=r[o+0],d=r[o+1],m=r[o+2],_=r[o+3];if(u!==_||c!==f||l!==d||h!==m){let p=c*f+l*d+h*m+u*_;p<0&&(f=-f,d=-d,m=-m,_=-_,p=-p);let g=1-a;if(p<.9995){const b=Math.acos(p),E=Math.sin(b);g=Math.sin(g*b)/E,a=Math.sin(a*b)/E,c=c*g+f*a,l=l*g+d*a,h=h*g+m*a,u=u*g+_*a}else{c=c*g+f*a,l=l*g+d*a,h=h*g+m*a,u=u*g+_*a;const b=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=b,l*=b,h*=b,u*=b}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,o){const a=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[o],f=r[o+1],d=r[o+2],m=r[o+3];return e[t]=a*m+h*u+c*d-l*f,e[t+1]=c*m+h*f+l*u-a*d,e[t+2]=l*m+h*d+a*f-c*u,e[t+3]=h*m-a*u-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),h=a(s/2),u=a(r/2),f=c(i/2),d=c(s/2),m=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"YXZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"ZXY":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"ZYX":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"YZX":this._x=f*h*u+l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u-f*d*m;break;case"XZY":this._x=f*h*u-l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u+f*d*m;break;default:it("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],f=i+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(i>a&&i>u){const d=2*Math.sqrt(1+i-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-i-u);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-i-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(It(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=i*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-i*l,this._z=r*h+o*l+i*c-s*a,this._w=o*h-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){const l=Math.acos(a),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const vc=class vc{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Uc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Uc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*i),h=2*(a*t-r*s),u=2*(r*i-o*t);return this.x=t+c*l+o*u-a*h,this.y=i+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=It(this.x,e.x,t.x),this.y=It(this.y,e.y,t.y),this.z=It(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=It(this.x,e,t),this.y=It(this.y,e,t),this.z=It(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(It(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Io.copy(this).projectOnVector(e),this.sub(Io)}reflect(e){return this.sub(Io.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};vc.prototype.isVector3=!0;let z=vc;const Io=new z,Uc=new Dr,xc=class xc{constructor(e,t,i,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l)}set(e,t,i,s,r,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=i,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],h=i[4],u=i[7],f=i[2],d=i[5],m=i[8],_=s[0],p=s[3],g=s[6],b=s[1],E=s[4],v=s[7],S=s[2],T=s[5],L=s[8];return r[0]=o*_+a*b+c*S,r[3]=o*p+a*E+c*T,r[6]=o*g+a*v+c*L,r[1]=l*_+h*b+u*S,r[4]=l*p+h*E+u*T,r[7]=l*g+h*v+u*L,r[2]=f*_+d*b+m*S,r[5]=f*p+d*E+m*T,r[8]=f*g+d*v+m*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-i*r*h+i*a*c+s*r*l-s*o*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,f=a*c-h*r,d=l*r-o*c,m=t*u+i*f+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return e[0]=u*_,e[1]=(s*l-h*i)*_,e[2]=(a*i-s*o)*_,e[3]=f*_,e[4]=(h*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=d*_,e[7]=(i*c-l*t)*_,e[8]=(o*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return mr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ko.makeScale(e,t)),this}rotate(e){return mr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ko.makeRotation(-e)),this}translate(e,t){return mr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ko.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};xc.prototype.isMatrix3=!0;let ot=xc;const ko=new ot,Nc=new ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fc=new ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function O0(){const n={enabled:!0,workingColorSpace:oo,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===$t&&(s.r=Ji(s.r),s.g=Ji(s.g),s.b=Ji(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===$t&&(s.r=gr(s.r),s.g=gr(s.g),s.b=gr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===""?lo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return mr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return mr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[oo]:{primaries:e,whitePoint:i,transfer:lo,toXYZ:Nc,fromXYZ:Fc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ni},outputColorSpaceConfig:{drawingBufferColorSpace:ni}},[ni]:{primaries:e,whitePoint:i,transfer:$t,toXYZ:Nc,fromXYZ:Fc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ni}}}),n}const Lt=O0();function Ji(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function gr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Xs;class B0{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Xs===void 0&&(Xs=ua("canvas")),Xs.width=e.width,Xs.height=e.height;const s=Xs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Xs}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ua("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ji(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ji(t[i]/255)*255):t[i]=Ji(t[i]);return{data:t,width:e.width,height:e.height}}else return it("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let $0=0;class Ql{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:$0++}),this.uuid=Ms(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Uo(s[o].image)):r.push(Uo(s[o]))}else r=Uo(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Uo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?B0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(it("Texture: Unable to serialize Texture."),{})}let G0=0;const No=new z;class zn extends zs{constructor(e=zn.DEFAULT_IMAGE,t=zn.DEFAULT_MAPPING,i=1001,s=1001,r=1006,o=1008,a=1023,c=1009,l=zn.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:G0++}),this.uuid=Ms(),this.name="",this.source=new Ql(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new st(0,0),this.repeat=new st(1,1),this.center=new st(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(No).x}get height(){return this.source.getSize(No).y}get depth(){return this.source.getSize(No).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){it(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){it(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}zn.DEFAULT_IMAGE=null;zn.DEFAULT_MAPPING=300;zn.DEFAULT_ANISOTROPY=1;const yc=class yc{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const c=e.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],m=c[9],_=c[2],p=c[6],g=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(m+p)<.1&&Math.abs(l+d+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(l+1)/2,v=(d+1)/2,S=(g+1)/2,T=(h+f)/4,L=(u+_)/4,x=(m+p)/4;return E>v&&E>S?E<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(E),s=T/i,r=L/i):v>S?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=T/s,r=x/s):S<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),i=L/r,s=x/r),this.set(i,s,r,t),this}let b=Math.sqrt((p-m)*(p-m)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(b)<.001&&(b=1),this.x=(p-m)/b,this.y=(u-_)/b,this.z=(f-h)/b,this.w=Math.acos((l+d+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=It(this.x,e.x,t.x),this.y=It(this.y,e.y,t.y),this.z=It(this.z,e.z,t.z),this.w=It(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=It(this.x,e,t),this.y=It(this.y,e,t),this.z=It(this.z,e,t),this.w=It(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(It(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};yc.prototype.isVector4=!0;let pn=yc;class z0 extends zs{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new pn(0,0,e,t),this.scissorTest=!1,this.viewport=new pn(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},r=new zn(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ql(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ri extends z0{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class pf extends zn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class H0 extends zn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const go=class go{constructor(e,t,i,s,r,o,a,c,l,h,u,f,d,m,_,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l,h,u,f,d,m,_,p)}set(e,t,i,s,r,o,a,c,l,h,u,f,d,m,_,p){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=s,g[1]=r,g[5]=o,g[9]=a,g[13]=c,g[2]=l,g[6]=h,g[10]=u,g[14]=f,g[3]=d,g[7]=m,g[11]=_,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new go().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/qs.setFromMatrixColumn(e,0).length(),r=1/qs.setFromMatrixColumn(e,1).length(),o=1/qs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=o*h,d=o*u,m=a*h,_=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=d+m*l,t[5]=f-_*l,t[9]=-a*c,t[2]=_-f*l,t[6]=m+d*l,t[10]=o*c}else if(e.order==="YXZ"){const f=c*h,d=c*u,m=l*h,_=l*u;t[0]=f+_*a,t[4]=m*a-d,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-m,t[6]=_+f*a,t[10]=o*c}else if(e.order==="ZXY"){const f=c*h,d=c*u,m=l*h,_=l*u;t[0]=f-_*a,t[4]=-o*u,t[8]=m+d*a,t[1]=d+m*a,t[5]=o*h,t[9]=_-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const f=o*h,d=o*u,m=a*h,_=a*u;t[0]=c*h,t[4]=m*l-d,t[8]=f*l+_,t[1]=c*u,t[5]=_*l+f,t[9]=d*l-m,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const f=o*c,d=o*l,m=a*c,_=a*l;t[0]=c*h,t[4]=_-f*u,t[8]=m*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=d*u+m,t[10]=f-_*u}else if(e.order==="XZY"){const f=o*c,d=o*l,m=a*c,_=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=f*u+_,t[5]=o*h,t[9]=d*u-m,t[2]=m*u-d,t[6]=a*h,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(V0,e,W0)}lookAt(e,t,i){const s=this.elements;return ci.subVectors(e,t),ci.lengthSq()===0&&(ci.z=1),ci.normalize(),as.crossVectors(i,ci),as.lengthSq()===0&&(Math.abs(i.z)===1?ci.x+=1e-4:ci.z+=1e-4,ci.normalize(),as.crossVectors(i,ci)),as.normalize(),ba.crossVectors(ci,as),s[0]=as.x,s[4]=ba.x,s[8]=ci.x,s[1]=as.y,s[5]=ba.y,s[9]=ci.y,s[2]=as.z,s[6]=ba.z,s[10]=ci.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],h=i[1],u=i[5],f=i[9],d=i[13],m=i[2],_=i[6],p=i[10],g=i[14],b=i[3],E=i[7],v=i[11],S=i[15],T=s[0],L=s[4],x=s[8],w=s[12],I=s[1],O=s[5],U=s[9],G=s[13],P=s[2],$=s[6],Z=s[10],V=s[14],se=s[3],K=s[7],ne=s[11],he=s[15];return r[0]=o*T+a*I+c*P+l*se,r[4]=o*L+a*O+c*$+l*K,r[8]=o*x+a*U+c*Z+l*ne,r[12]=o*w+a*G+c*V+l*he,r[1]=h*T+u*I+f*P+d*se,r[5]=h*L+u*O+f*$+d*K,r[9]=h*x+u*U+f*Z+d*ne,r[13]=h*w+u*G+f*V+d*he,r[2]=m*T+_*I+p*P+g*se,r[6]=m*L+_*O+p*$+g*K,r[10]=m*x+_*U+p*Z+g*ne,r[14]=m*w+_*G+p*V+g*he,r[3]=b*T+E*I+v*P+S*se,r[7]=b*L+E*O+v*$+S*K,r[11]=b*x+E*U+v*Z+S*ne,r[15]=b*w+E*G+v*V+S*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],f=e[10],d=e[14],m=e[3],_=e[7],p=e[11],g=e[15],b=c*d-l*f,E=a*d-l*u,v=a*f-c*u,S=o*d-l*h,T=o*f-c*h,L=o*u-a*h;return t*(_*b-p*E+g*v)-i*(m*b-p*S+g*T)+s*(m*E-_*S+g*L)-r*(m*v-_*T+p*L)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],l=e[6],h=e[10];return t*(o*h-a*l)-i*(r*h-a*c)+s*(r*l-o*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],f=e[10],d=e[11],m=e[12],_=e[13],p=e[14],g=e[15],b=t*a-i*o,E=t*c-s*o,v=t*l-r*o,S=i*c-s*a,T=i*l-r*a,L=s*l-r*c,x=h*_-u*m,w=h*p-f*m,I=h*g-d*m,O=u*p-f*_,U=u*g-d*_,G=f*g-d*p,P=b*G-E*U+v*O+S*I-T*w+L*x;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const $=1/P;return e[0]=(a*G-c*U+l*O)*$,e[1]=(s*U-i*G-r*O)*$,e[2]=(_*L-p*T+g*S)*$,e[3]=(f*T-u*L-d*S)*$,e[4]=(c*I-o*G-l*w)*$,e[5]=(t*G-s*I+r*w)*$,e[6]=(p*v-m*L-g*E)*$,e[7]=(h*L-f*v+d*E)*$,e[8]=(o*U-a*I+l*x)*$,e[9]=(i*I-t*U-r*x)*$,e[10]=(m*T-_*v+g*b)*$,e[11]=(u*v-h*T-d*b)*$,e[12]=(a*w-o*O-c*x)*$,e[13]=(t*O-i*w+s*x)*$,e[14]=(_*E-m*S-p*b)*$,e[15]=(h*S-u*E+f*b)*$,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+i,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,f=r*l,d=r*h,m=r*u,_=o*h,p=o*u,g=a*u,b=c*l,E=c*h,v=c*u,S=i.x,T=i.y,L=i.z;return s[0]=(1-(_+g))*S,s[1]=(d+v)*S,s[2]=(m-E)*S,s[3]=0,s[4]=(d-v)*T,s[5]=(1-(f+g))*T,s[6]=(p+b)*T,s[7]=0,s[8]=(m+E)*L,s[9]=(p-b)*L,s[10]=(1-(f+_))*L,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let o=qs.set(s[0],s[1],s[2]).length();const a=qs.set(s[4],s[5],s[6]).length(),c=qs.set(s[8],s[9],s[10]).length();r<0&&(o=-o),xi.copy(this);const l=1/o,h=1/a,u=1/c;return xi.elements[0]*=l,xi.elements[1]*=l,xi.elements[2]*=l,xi.elements[4]*=h,xi.elements[5]*=h,xi.elements[6]*=h,xi.elements[8]*=u,xi.elements[9]*=u,xi.elements[10]*=u,t.setFromRotationMatrix(xi),i.x=o,i.y=a,i.z=c,this}makePerspective(e,t,i,s,r,o,a=2e3,c=!1){const l=this.elements,h=2*r/(t-e),u=2*r/(i-s),f=(t+e)/(t-e),d=(i+s)/(i-s);let m,_;if(c)m=r/(o-r),_=o*r/(o-r);else if(a===2e3)m=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===2001)m=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=2e3,c=!1){const l=this.elements,h=2/(t-e),u=2/(i-s),f=-(t+e)/(t-e),d=-(i+s)/(i-s);let m,_;if(c)m=1/(o-r),_=o/(o-r);else if(a===2e3)m=-2/(o-r),_=-(o+r)/(o-r);else if(a===2001)m=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};go.prototype.isMatrix4=!0;let mn=go;const qs=new z,xi=new mn,V0=new z(0,0,0),W0=new z(1,1,1),as=new z,ba=new z,ci=new z,Oc=new mn,Bc=new Dr;class ys{constructor(e=0,t=0,i=0,s=ys.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(It(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-It(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(It(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-It(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(It(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-It(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:it("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Oc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Oc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Bc.setFromEuler(this),this.setFromQuaternion(Bc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ys.DEFAULT_ORDER="XYZ";class mf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let X0=0;const $c=new z,Ys=new Dr,$i=new mn,Ta=new z,zr=new z,q0=new z,Y0=new Dr,Gc=new z(1,0,0),zc=new z(0,1,0),Hc=new z(0,0,1),Vc={type:"added"},Z0={type:"removed"},Zs={type:"childadded",child:null},Fo={type:"childremoved",child:null};class In extends zs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:X0++}),this.uuid=Ms(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=In.DEFAULT_UP.clone();const e=new z,t=new ys,i=new Dr,s=new z(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new mn},normalMatrix:{value:new ot}}),this.matrix=new mn,this.matrixWorld=new mn,this.matrixAutoUpdate=In.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=In.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new mf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ys.setFromAxisAngle(e,t),this.quaternion.multiply(Ys),this}rotateOnWorldAxis(e,t){return Ys.setFromAxisAngle(e,t),this.quaternion.premultiply(Ys),this}rotateX(e){return this.rotateOnAxis(Gc,e)}rotateY(e){return this.rotateOnAxis(zc,e)}rotateZ(e){return this.rotateOnAxis(Hc,e)}translateOnAxis(e,t){return $c.copy(e).applyQuaternion(this.quaternion),this.position.add($c.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Gc,e)}translateY(e){return this.translateOnAxis(zc,e)}translateZ(e){return this.translateOnAxis(Hc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4($i.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ta.copy(e):Ta.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),zr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$i.lookAt(zr,Ta,this.up):$i.lookAt(Ta,zr,this.up),this.quaternion.setFromRotationMatrix($i),s&&($i.extractRotation(s.matrixWorld),Ys.setFromRotationMatrix($i),this.quaternion.premultiply(Ys.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ut("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Vc),Zs.child=e,this.dispatchEvent(Zs),Zs.child=null):Ut("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Z0),Fo.child=e,this.dispatchEvent(Fo),Fo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),$i.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),$i.multiply(e.parent.matrixWorld)),e.applyMatrix4($i),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Vc),Zs.child=e,this.dispatchEvent(Zs),Zs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,e,q0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,Y0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),d=o(e.animations),m=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=s,i;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}In.DEFAULT_UP=new z(0,1,0);In.DEFAULT_MATRIX_AUTO_UPDATE=!0;In.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ai extends In{constructor(){super(),this.isGroup=!0,this.type="Group"}}const K0={type:"move"};class Oo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ai,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ai,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ai,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,i),g=this._getHandJoint(l,_);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,m=.005;l.inputState.pinching&&f>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(K0)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ai;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const gf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},os={h:0,s:0,l:0},Ea={h:0,s:0,l:0};function Bo(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class bt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ni){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Lt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Lt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Lt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Lt.workingColorSpace){if(e=F0(e,1),t=It(t,0,1),i=It(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Bo(o,r,e+1/3),this.g=Bo(o,r,e),this.b=Bo(o,r,e-1/3)}return Lt.colorSpaceToWorking(this,s),this}setStyle(e,t=ni){function i(r){r!==void 0&&parseFloat(r)<1&&it("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:it("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);it("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ni){const i=gf[e.toLowerCase()];return i!==void 0?this.setHex(i,t):it("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ji(e.r),this.g=Ji(e.g),this.b=Ji(e.b),this}copyLinearToSRGB(e){return this.r=gr(e.r),this.g=gr(e.g),this.b=gr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ni){return Lt.workingToColorSpace(Xn.copy(this),e),Math.round(It(Xn.r*255,0,255))*65536+Math.round(It(Xn.g*255,0,255))*256+Math.round(It(Xn.b*255,0,255))}getHexString(e=ni){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Lt.workingColorSpace){Lt.workingToColorSpace(Xn.copy(this),t);const i=Xn.r,s=Xn.g,r=Xn.b,o=Math.max(i,s,r),a=Math.min(i,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Lt.workingColorSpace){return Lt.workingToColorSpace(Xn.copy(this),t),e.r=Xn.r,e.g=Xn.g,e.b=Xn.b,e}getStyle(e=ni){Lt.workingToColorSpace(Xn.copy(this),e);const t=Xn.r,i=Xn.g,s=Xn.b;return e!==ni?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(os),this.setHSL(os.h+e,os.s+t,os.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(os),e.getHSL(Ea);const i=Do(os.h,Ea.h,t),s=Do(os.s,Ea.s,t),r=Do(os.l,Ea.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xn=new bt;bt.NAMES=gf;class Q0 extends In{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ys,this.environmentIntensity=1,this.environmentRotation=new ys,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const yi=new z,Gi=new z,$o=new z,zi=new z,Ks=new z,Qs=new z,Wc=new z,Go=new z,zo=new z,Ho=new z,Vo=new pn,Wo=new pn,Xo=new pn;class gi{constructor(e=new z,t=new z,i=new z){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),yi.subVectors(e,t),s.cross(yi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){yi.subVectors(s,t),Gi.subVectors(i,t),$o.subVectors(e,t);const o=yi.dot(yi),a=yi.dot(Gi),c=yi.dot($o),l=Gi.dot(Gi),h=Gi.dot($o),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,m=(o*h-a*c)*f;return r.set(1-d-m,m,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,zi)===null?!1:zi.x>=0&&zi.y>=0&&zi.x+zi.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,zi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,zi.x),c.addScaledVector(o,zi.y),c.addScaledVector(a,zi.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return Vo.setScalar(0),Wo.setScalar(0),Xo.setScalar(0),Vo.fromBufferAttribute(e,t),Wo.fromBufferAttribute(e,i),Xo.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Vo,r.x),o.addScaledVector(Wo,r.y),o.addScaledVector(Xo,r.z),o}static isFrontFacing(e,t,i,s){return yi.subVectors(i,t),Gi.subVectors(e,t),yi.cross(Gi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return yi.subVectors(this.c,this.b),Gi.subVectors(this.a,this.b),yi.cross(Gi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return gi.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return gi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let o,a;Ks.subVectors(s,i),Qs.subVectors(r,i),Go.subVectors(e,i);const c=Ks.dot(Go),l=Qs.dot(Go);if(c<=0&&l<=0)return t.copy(i);zo.subVectors(e,s);const h=Ks.dot(zo),u=Qs.dot(zo);if(h>=0&&u<=h)return t.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(i).addScaledVector(Ks,o);Ho.subVectors(e,r);const d=Ks.dot(Ho),m=Qs.dot(Ho);if(m>=0&&d<=m)return t.copy(r);const _=d*l-c*m;if(_<=0&&l>=0&&m<=0)return a=l/(l-m),t.copy(i).addScaledVector(Qs,a);const p=h*m-d*u;if(p<=0&&u-h>=0&&d-m>=0)return Wc.subVectors(r,s),a=(u-h)/(u-h+(d-m)),t.copy(s).addScaledVector(Wc,a);const g=1/(p+_+f);return o=_*g,a=f*g,t.copy(i).addScaledVector(Ks,o).addScaledVector(Qs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ma{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Si.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Si.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Si.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Si):Si.fromBufferAttribute(r,o),Si.applyMatrix4(e.matrixWorld),this.expandByPoint(Si);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wa.copy(i.boundingBox)),wa.applyMatrix4(e.matrixWorld),this.union(wa)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Si),Si.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Hr),Aa.subVectors(this.max,Hr),Js.subVectors(e.a,Hr),js.subVectors(e.b,Hr),er.subVectors(e.c,Hr),ls.subVectors(js,Js),cs.subVectors(er,js),Cs.subVectors(Js,er);let t=[0,-ls.z,ls.y,0,-cs.z,cs.y,0,-Cs.z,Cs.y,ls.z,0,-ls.x,cs.z,0,-cs.x,Cs.z,0,-Cs.x,-ls.y,ls.x,0,-cs.y,cs.x,0,-Cs.y,Cs.x,0];return!qo(t,Js,js,er,Aa)||(t=[1,0,0,0,1,0,0,0,1],!qo(t,Js,js,er,Aa))?!1:(Ra.crossVectors(ls,cs),t=[Ra.x,Ra.y,Ra.z],qo(t,Js,js,er,Aa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Si).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Si).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Hi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Hi=[new z,new z,new z,new z,new z,new z,new z,new z],Si=new z,wa=new Ma,Js=new z,js=new z,er=new z,ls=new z,cs=new z,Cs=new z,Hr=new z,Aa=new z,Ra=new z,Ls=new z;function qo(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ls.fromArray(n,r);const a=s.x*Math.abs(Ls.x)+s.y*Math.abs(Ls.y)+s.z*Math.abs(Ls.z),c=e.dot(Ls),l=t.dot(Ls),h=i.dot(Ls);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const An=new z,Ca=new st;let J0=0;class Bi extends zs{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:J0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ca.fromBufferAttribute(this,t),Ca.applyMatrix3(e),this.setXY(t,Ca.x,Ca.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.applyMatrix3(e),this.setXYZ(t,An.x,An.y,An.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.applyMatrix4(e),this.setXYZ(t,An.x,An.y,An.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.applyNormalMatrix(e),this.setXYZ(t,An.x,An.y,An.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.transformDirection(e),this.setXYZ(t,An.x,An.y,An.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Fi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Wt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Fi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Fi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Fi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Fi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array),r=Wt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class _f extends Bi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Mf extends Bi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ai extends Bi{constructor(e,t,i){super(new Float32Array(e),t,i)}}const j0=new Ma,Vr=new z,Yo=new z;class Jl{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):j0.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Vr.subVectors(e,this.center);const t=Vr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Vr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Yo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Vr.copy(e.center).add(Yo)),this.expandByPoint(Vr.copy(e.center).sub(Yo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let eu=0;const pi=new mn,Zo=new In,tr=new z,hi=new Ma,Wr=new Ma,Fn=new z;class Mi extends zs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=Ms(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(I0(e)?Mf:_f)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new ot().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return pi.makeRotationFromQuaternion(e),this.applyMatrix4(pi),this}rotateX(e){return pi.makeRotationX(e),this.applyMatrix4(pi),this}rotateY(e){return pi.makeRotationY(e),this.applyMatrix4(pi),this}rotateZ(e){return pi.makeRotationZ(e),this.applyMatrix4(pi),this}translate(e,t,i){return pi.makeTranslation(e,t,i),this.applyMatrix4(pi),this}scale(e,t,i){return pi.makeScale(e,t,i),this.applyMatrix4(pi),this}lookAt(e){return Zo.lookAt(e),Zo.updateMatrix(),this.applyMatrix4(Zo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(tr).negate(),this.translate(tr.x,tr.y,tr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ai(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&it("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ma);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];hi.setFromBufferAttribute(r),this.morphTargetsRelative?(Fn.addVectors(this.boundingBox.min,hi.min),this.boundingBox.expandByPoint(Fn),Fn.addVectors(this.boundingBox.max,hi.max),this.boundingBox.expandByPoint(Fn)):(this.boundingBox.expandByPoint(hi.min),this.boundingBox.expandByPoint(hi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ut('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(e){const i=this.boundingSphere.center;if(hi.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Wr.setFromBufferAttribute(a),this.morphTargetsRelative?(Fn.addVectors(hi.min,Wr.min),hi.expandByPoint(Fn),Fn.addVectors(hi.max,Wr.max),hi.expandByPoint(Fn)):(hi.expandByPoint(Wr.min),hi.expandByPoint(Wr.max))}hi.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)Fn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Fn));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Fn.fromBufferAttribute(a,l),c&&(tr.fromBufferAttribute(e,l),Fn.add(tr)),s=Math.max(s,i.distanceToSquared(Fn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ut('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ut("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Bi(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));const a=[],c=[];for(let x=0;x<i.count;x++)a[x]=new z,c[x]=new z;const l=new z,h=new z,u=new z,f=new st,d=new st,m=new st,_=new z,p=new z;function g(x,w,I){l.fromBufferAttribute(i,x),h.fromBufferAttribute(i,w),u.fromBufferAttribute(i,I),f.fromBufferAttribute(r,x),d.fromBufferAttribute(r,w),m.fromBufferAttribute(r,I),h.sub(l),u.sub(l),d.sub(f),m.sub(f);const O=1/(d.x*m.y-m.x*d.y);isFinite(O)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(u,-d.y).multiplyScalar(O),p.copy(u).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(O),a[x].add(_),a[w].add(_),a[I].add(_),c[x].add(p),c[w].add(p),c[I].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let x=0,w=b.length;x<w;++x){const I=b[x],O=I.start,U=I.count;for(let G=O,P=O+U;G<P;G+=3)g(e.getX(G+0),e.getX(G+1),e.getX(G+2))}const E=new z,v=new z,S=new z,T=new z;function L(x){S.fromBufferAttribute(s,x),T.copy(S);const w=a[x];E.copy(w),E.sub(S.multiplyScalar(S.dot(w))).normalize(),v.crossVectors(T,w);const O=v.dot(c[x])<0?-1:1;o.setXYZW(x,E.x,E.y,E.z,O)}for(let x=0,w=b.length;x<w;++x){const I=b[x],O=I.start,U=I.count;for(let G=O,P=O+U;G<P;G+=3)L(e.getX(G+0)),L(e.getX(G+1)),L(e.getX(G+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Bi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const s=new z,r=new z,o=new z,a=new z,c=new z,l=new z,h=new z,u=new z;if(e)for(let f=0,d=e.count;f<d;f+=3){const m=e.getX(f+0),_=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,m),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,p),a.add(h),c.add(h),l.add(h),i.setXYZ(m,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Fn.fromBufferAttribute(e,t),Fn.normalize(),e.setXYZ(t,Fn.x,Fn.y,Fn.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,m=0;for(let _=0,p=c.length;_<p;_++){a.isInterleavedBufferAttribute?d=c[_]*a.data.stride+a.offset:d=c[_]*h;for(let g=0;g<h;g++)f[m++]=l[d++]}return new Bi(f,h,u)}if(this.index===null)return it("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Mi,i=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=e(c,i);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=e(f,i);c.push(d)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class tu{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=Ms()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ms()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ms()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const Qn=new z;class ho{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Qn.fromBufferAttribute(this,t),Qn.applyMatrix4(e),this.setXYZ(t,Qn.x,Qn.y,Qn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Qn.fromBufferAttribute(this,t),Qn.applyNormalMatrix(e),this.setXYZ(t,Qn.x,Qn.y,Qn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Qn.fromBufferAttribute(this,t),Qn.transformDirection(e),this.setXYZ(t,Qn.x,Qn.y,Qn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Fi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Wt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Fi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Fi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Fi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Fi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array),r=Wt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){co("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Bi(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ho(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){co("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Ko=new z,nu=new z,iu=new ot;class us{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Ko.subVectors(i,t).cross(nu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Ko),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||iu.getNormalMatrix(e),s=this.coplanarPoint(Ko).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let su=0;class Ir extends zs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=Ms(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){it(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){it(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new bt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new us().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new st().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new st().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class vf extends Ir{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let nr;const Xr=new z,ir=new z,sr=new z,rr=new st,qr=new st,xf=new mn,La=new z,Yr=new z,Pa=new z,Xc=new st,Qo=new st,qc=new st;class ru extends In{constructor(e=new vf){if(super(),this.isSprite=!0,this.type="Sprite",nr===void 0){nr=new Mi;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new tu(t,5);nr.setIndex([0,1,2,0,2,3]),nr.setAttribute("position",new ho(i,3,0,!1)),nr.setAttribute("uv",new ho(i,2,3,!1))}this.geometry=nr,this.material=e,this.center=new st(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Ut('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ir.setFromMatrixScale(this.matrixWorld),xf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),sr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ir.multiplyScalar(-sr.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const o=this.center;Da(La.set(-.5,-.5,0),sr,o,ir,s,r),Da(Yr.set(.5,-.5,0),sr,o,ir,s,r),Da(Pa.set(.5,.5,0),sr,o,ir,s,r),Xc.set(0,0),Qo.set(1,0),qc.set(1,1);let a=e.ray.intersectTriangle(La,Yr,Pa,!1,Xr);if(a===null&&(Da(Yr.set(-.5,.5,0),sr,o,ir,s,r),Qo.set(0,1),a=e.ray.intersectTriangle(La,Pa,Yr,!1,Xr),a===null))return;const c=e.ray.origin.distanceTo(Xr);c<e.near||c>e.far||t.push({distance:c,point:Xr.clone(),uv:gi.getInterpolation(Xr,La,Yr,Pa,Xc,Qo,qc,new st),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Da(n,e,t,i,s,r){rr.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(qr.x=r*rr.x-s*rr.y,qr.y=s*rr.x+r*rr.y):qr.copy(rr),n.copy(e),n.x+=qr.x,n.y+=qr.y,n.applyMatrix4(xf)}const Vi=new z,Jo=new z,Ia=new z,ka=new z;class au{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Vi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Vi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Vi.copy(this.origin).addScaledVector(this.direction,t),Vi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Jo.copy(e).add(t).multiplyScalar(.5),Ia.copy(t).sub(e).normalize(),ka.copy(this.origin).sub(Jo);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Ia),a=ka.dot(this.direction),c=-ka.dot(Ia),l=ka.lengthSq(),h=Math.abs(1-o*o);let u,f,d,m;if(h>0)if(u=o*c-a,f=o*a-c,m=r*h,u>=0)if(f>=-m)if(f<=m){const _=1/h;u*=_,f*=_,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-m?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=m?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Jo).addScaledVector(Ia,f),d}intersectSphere(e,t){if(e.radius<0)return null;Vi.subVectors(e.center,this.origin);const i=Vi.dot(this.direction),s=Vi.dot(Vi)-i*i,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Vi)!==null}intersectTriangle(e,t,i,s,r){const o=this.origin,a=this.direction,c=a.x,l=a.y,h=a.z,u=e.x-o.x,f=e.y-o.y,d=e.z-o.z,m=t.x-o.x,_=t.y-o.y,p=t.z-o.z,g=i.x-o.x,b=i.y-o.y,E=i.z-o.z,v=Math.abs(c),S=Math.abs(l),T=Math.abs(h);let L,x,w,I,O,U,G,P,$,Z,V,se;if(v>=S&&v>=T?(w=c,U=u,$=m,se=g,c>=0?(L=l,x=h,I=f,O=d,G=_,P=p,Z=b,V=E):(L=h,x=l,I=d,O=f,G=p,P=_,Z=E,V=b)):S>=T?(w=l,U=f,$=_,se=b,l>=0?(L=h,x=c,I=d,O=u,G=p,P=m,Z=E,V=g):(L=c,x=h,I=u,O=d,G=m,P=p,Z=g,V=E)):(w=h,U=d,$=p,se=E,h>=0?(L=c,x=l,I=u,O=f,G=m,P=_,Z=g,V=b):(L=l,x=c,I=f,O=u,G=_,P=m,Z=b,V=g)),w===0)return null;const K=L/w,ne=x/w,he=1/w,Be=I-K*U,Oe=O-ne*U,me=G-K*$,Ae=P-ne*$,Ve=Z-K*se,j=V-ne*se,re=Ve*Ae-j*me,Se=Be*j-Oe*Ve,Je=me*Oe-Ae*Be;if(s){if(re<0||Se<0||Je<0)return null}else if((re<0||Se<0||Je<0)&&(re>0||Se>0||Je>0))return null;const Ie=re+Se+Je;if(Ie===0)return null;const gt=he*(re*U+Se*$+Je*se);return(Ie>0?gt<0:gt>0)?null:this.at(gt/Ie,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class va extends Ir{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ys,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Yc=new mn,Ps=new au,Ua=new Jl,Zc=new z,Na=new z,Fa=new z,Oa=new z,jo=new z,Ba=new z,Kc=new z,$a=new z;class tn extends In{constructor(e=new Mi,t=new va){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){Ba.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(jo.fromBufferAttribute(u,e),o?Ba.addScaledVector(jo,h):Ba.addScaledVector(jo.sub(t),h))}t.add(Ba)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ua.copy(i.boundingSphere),Ua.applyMatrix4(r),Ps.copy(e.ray).recast(e.near),!(Ua.containsPoint(Ps.origin)===!1&&(Ps.intersectSphere(Ua,Zc)===null||Ps.origin.distanceToSquared(Zc)>(e.far-e.near)**2))&&(Yc.copy(r).invert(),Ps.copy(e.ray).applyMatrix4(Yc),!(i.boundingBox!==null&&Ps.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ps)))}_computeIntersections(e,t,i){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,_=f.length;m<_;m++){const p=f[m],g=o[p.materialIndex],b=Math.max(p.start,d.start),E=Math.min(a.count,Math.min(p.start+p.count,d.start+d.count));for(let v=b,S=E;v<S;v+=3){const T=a.getX(v),L=a.getX(v+1),x=a.getX(v+2);s=Ga(this,g,e,i,l,h,u,T,L,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let p=m,g=_;p<g;p+=3){const b=a.getX(p),E=a.getX(p+1),v=a.getX(p+2);s=Ga(this,o,e,i,l,h,u,b,E,v),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,_=f.length;m<_;m++){const p=f[m],g=o[p.materialIndex],b=Math.max(p.start,d.start),E=Math.min(c.count,Math.min(p.start+p.count,d.start+d.count));for(let v=b,S=E;v<S;v+=3){const T=v,L=v+1,x=v+2;s=Ga(this,g,e,i,l,h,u,T,L,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let p=m,g=_;p<g;p+=3){const b=p,E=p+1,v=p+2;s=Ga(this,o,e,i,l,h,u,b,E,v),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function ou(n,e,t,i,s,r,o,a){let c;if(e.side===1?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===0,a),c===null)return null;$a.copy(a),$a.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo($a);return l<t.near||l>t.far?null:{distance:l,point:$a.clone(),object:n}}function Ga(n,e,t,i,s,r,o,a,c,l){n.getVertexPosition(a,Na),n.getVertexPosition(c,Fa),n.getVertexPosition(l,Oa);const h=ou(n,e,t,i,Na,Fa,Oa,Kc);if(h){const u=new z;gi.getBarycoord(Kc,Na,Fa,Oa,u),s&&(h.uv=gi.getInterpolatedAttribute(s,a,c,l,u,new st)),r&&(h.uv1=gi.getInterpolatedAttribute(r,a,c,l,u,new st)),o&&(h.normal=gi.getInterpolatedAttribute(o,a,c,l,u,new z),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new z,materialIndex:0};gi.getNormal(Na,Fa,Oa,f.normal),h.face=f,h.barycoord=u}return h}class lu extends zn{constructor(e=null,t=1,i=1,s,r,o,a,c,l=1003,h=1003,u,f){super(null,o,a,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ds=new Jl,cu=new st(.5,.5),za=new z;class jl{constructor(e=new us,t=new us,i=new us,s=new us,r=new us,o=new us){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3,i=!1){const s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],d=r[7],m=r[8],_=r[9],p=r[10],g=r[11],b=r[12],E=r[13],v=r[14],S=r[15];if(s[0].setComponents(l-o,d-h,g-m,S-b).normalize(),s[1].setComponents(l+o,d+h,g+m,S+b).normalize(),s[2].setComponents(l+a,d+u,g+_,S+E).normalize(),s[3].setComponents(l-a,d-u,g-_,S-E).normalize(),i)s[4].setComponents(c,f,p,v).normalize(),s[5].setComponents(l-c,d-f,g-p,S-v).normalize();else if(s[4].setComponents(l-c,d-f,g-p,S-v).normalize(),t===2e3)s[5].setComponents(l+c,d+f,g+p,S+v).normalize();else if(t===2001)s[5].setComponents(c,f,p,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ds.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ds.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ds)}intersectsSprite(e){Ds.center.set(0,0,0);const t=cu.distanceTo(e.center);return Ds.radius=.7071067811865476+t,Ds.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ds)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(za.x=s.normal.x>0?e.max.x:e.min.x,za.y=s.normal.y>0?e.max.y:e.min.y,za.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(za)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class yf extends zn{constructor(e=[],t=301,i,s,r,o,a,c,l,h){super(e,t,i,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class _o extends zn{constructor(e,t,i,s,r,o,a,c,l){super(e,t,i,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Sr extends zn{constructor(e,t,i=1014,s,r,o,a=1003,c=1003,l,h=1026,u=1){if(h!==1026&&h!==1027)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,s,r,o,a,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ql(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class hu extends Sr{constructor(e,t=1014,i=301,s,r,o=1003,a=1003,c,l=1026){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,s,r,o,a,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Sf extends zn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ss extends Mi{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let f=0,d=0;m("z","y","x",-1,-1,i,t,e,o,r,0),m("z","y","x",1,-1,i,t,-e,o,r,1),m("x","z","y",1,1,e,i,t,s,o,2),m("x","z","y",1,-1,e,i,-t,s,o,3),m("x","y","z",1,-1,e,t,i,s,r,4),m("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new ai(l,3)),this.setAttribute("normal",new ai(h,3)),this.setAttribute("uv",new ai(u,2));function m(_,p,g,b,E,v,S,T,L,x,w){const I=v/L,O=S/x,U=v/2,G=S/2,P=T/2,$=L+1,Z=x+1;let V=0,se=0;const K=new z;for(let ne=0;ne<Z;ne++){const he=ne*O-G;for(let Be=0;Be<$;Be++){const Oe=Be*I-U;K[_]=Oe*b,K[p]=he*E,K[g]=P,l.push(K.x,K.y,K.z),K[_]=0,K[p]=0,K[g]=T>0?1:-1,h.push(K.x,K.y,K.z),u.push(Be/L),u.push(1-ne/x),V+=1}}for(let ne=0;ne<x;ne++)for(let he=0;he<L;he++){const Be=f+he+$*ne,Oe=f+he+$*(ne+1),me=f+(he+1)+$*(ne+1),Ae=f+(he+1)+$*ne;c.push(Be,Oe,Ae),c.push(Oe,me,Ae),se+=6}a.addGroup(d,se,w),d+=se,f+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ss(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class fo extends Mi{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let m=0;const _=[],p=i/2;let g=0;b(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new ai(u,3)),this.setAttribute("normal",new ai(f,3)),this.setAttribute("uv",new ai(d,2));function b(){const v=new z,S=new z;let T=0;const L=(t-e)/i;for(let x=0;x<=r;x++){const w=[],I=x/r,O=I*(t-e)+e;for(let U=0;U<=s;U++){const G=U/s,P=G*c+a,$=Math.sin(P),Z=Math.cos(P);S.x=O*$,S.y=-I*i+p,S.z=O*Z,u.push(S.x,S.y,S.z),v.set($,L,Z).normalize(),f.push(v.x,v.y,v.z),d.push(G,1-I),w.push(m++)}_.push(w)}for(let x=0;x<s;x++)for(let w=0;w<r;w++){const I=_[w][x],O=_[w+1][x],U=_[w+1][x+1],G=_[w][x+1];(e>0||w!==0)&&(h.push(I,O,G),T+=3),(t>0||w!==r-1)&&(h.push(O,U,G),T+=3)}l.addGroup(g,T,0),g+=T}function E(v){const S=m,T=new st,L=new z;let x=0;const w=v===!0?e:t,I=v===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,p*I,0),f.push(0,I,0),d.push(.5,.5),m++;const O=m;for(let U=0;U<=s;U++){const P=U/s*c+a,$=Math.cos(P),Z=Math.sin(P);L.x=w*Z,L.y=p*I,L.z=w*$,u.push(L.x,L.y,L.z),f.push(0,I,0),T.x=$*.5+.5,T.y=Z*.5*I+.5,d.push(T.x,T.y),m++}for(let U=0;U<s;U++){const G=S+U,P=O+U;v===!0?h.push(P,P+1,G):h.push(P+1,P,G),x+=3}l.addGroup(g,x,v===!0?1:2),g+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fo(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ri extends Mi{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),l=a+1,h=c+1,u=e/a,f=t/c,d=[],m=[],_=[],p=[];for(let g=0;g<h;g++){const b=g*f-o;for(let E=0;E<l;E++){const v=E*u-r;m.push(v,-b,0),_.push(0,0,1),p.push(E/a),p.push(1-g/c)}}for(let g=0;g<c;g++)for(let b=0;b<a;b++){const E=b+l*g,v=b+l*(g+1),S=b+1+l*(g+1),T=b+1+l*g;d.push(E,v,T),d.push(v,S,T)}this.setIndex(d),this.setAttribute("position",new ai(m,3)),this.setAttribute("normal",new ai(_,3)),this.setAttribute("uv",new ai(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ri(e.width,e.height,e.widthSegments,e.heightSegments)}}function br(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(Qc(s))s.isRenderTargetTexture?(it("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(Qc(s[0])){const r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Jn(n){const e={};for(let t=0;t<n.length;t++){const i=br(n[t]);for(const s in i)e[s]=i[s]}return e}function Qc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function fu(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function bf(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Lt.workingColorSpace}const ec={clone:br,merge:Jn};var uu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,du=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class oi extends Ir{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uu,this.fragmentShader=du,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=br(e.uniforms),this.uniformsGroups=fu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new bt().setHex(s.value);break;case"v2":this.uniforms[i].value=new st().fromArray(s.value);break;case"v3":this.uniforms[i].value=new z().fromArray(s.value);break;case"v4":this.uniforms[i].value=new pn().fromArray(s.value);break;case"m3":this.uniforms[i].value=new ot().fromArray(s.value);break;case"m4":this.uniforms[i].value=new mn().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Tf extends oi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Oi extends Ir{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ys,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class pu extends Ir{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class mu extends Ir{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const el={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(Jc(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!Jc(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function Jc(n){try{const e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class gu{constructor(e,t,i){const s=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){const d=l[u],m=l[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const _u=new gu;class tc{constructor(e){this.manager=e!==void 0?e:_u,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}tc.DEFAULT_MATERIAL_NAME="__DEFAULT";const ar=new WeakMap;class Mu extends tc{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=el.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let u=ar.get(o);u===void 0&&(u=[],ar.set(o,u)),u.push({onLoad:t,onError:s})}return o}const a=ua("img");function c(){h(),t&&t(this);const u=ar.get(this)||[];for(let f=0;f<u.length;f++){const d=u[f];d.onLoad&&d.onLoad(this)}ar.delete(this),r.manager.itemEnd(e)}function l(u){h(),s&&s(u),el.remove(`image:${e}`);const f=ar.get(this)||[];for(let d=0;d<f.length;d++){const m=f[d];m.onError&&m.onError(u)}ar.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),el.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}}class vu extends tc{constructor(e){super(e)}load(e,t,i,s){const r=new zn,o=new Mu(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}}class Mo extends In{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new bt(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class xu extends Mo{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(In.DEFAULT_UP),this.updateMatrix(),this.groundColor=new bt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const tl=new mn,jc=new z,eh=new z;class Ef{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new st(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new mn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new jl,this._frameExtents=new st(1,1),this._viewportCount=1,this._viewports=[new pn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;jc.setFromMatrixPosition(e.matrixWorld),t.position.copy(jc),eh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(eh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){tl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(tl,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,.5,.5,0,0,0,1),t.multiply(tl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ha=new z,Va=new Dr,Di=new z;class wf extends In{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mn,this.projectionMatrix=new mn,this.projectionMatrixInverse=new mn,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ha,Va,Di),Di.x===1&&Di.y===1&&Di.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ha,Va,Di.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Ha,Va,Di),Di.x===1&&Di.y===1&&Di.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ha,Va,Di.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const hs=new z,th=new st,nh=new st;class fi extends wf{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Dl*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Po*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Dl*2*Math.atan(Math.tan(Po*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){hs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(hs.x,hs.y).multiplyScalar(-e/hs.z),hs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(hs.x,hs.y).multiplyScalar(-e/hs.z)}getViewSize(e,t){return this.getViewBounds(e,th,nh),t.subVectors(nh,th)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Po*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class yu extends Ef{constructor(){super(new fi(90,1,.5,500)),this.isPointLightShadow=!0}}class ih extends Mo{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new yu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class vo extends wf{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Su extends Ef{constructor(){super(new vo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sh extends Mo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(In.DEFAULT_UP),this.updateMatrix(),this.target=new In,this.shadow=new Su}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class bu extends Mo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const or=-90,lr=1;class Tu extends In{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new fi(or,lr,e,t);s.layers=this.layers,this.add(s);const r=new fi(or,lr,e,t);r.layers=this.layers,this.add(r);const o=new fi(or,lr,e,t);o.layers=this.layers,this.add(o);const a=new fi(or,lr,e,t);a.layers=this.layers,this.add(a);const c=new fi(or,lr,e,t);c.layers=this.layers,this.add(c);const l=new fi(or,lr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===2e3)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===2001)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Eu extends fi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class wu{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Au.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Au(){this._document.hidden===!1&&this.reset()}const Sc=class Sc{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};Sc.prototype.isMatrix2=!0;let rh=Sc;function ah(n,e,t,i){const s=Ru(i);switch(t){case 1021:return n*e;case 1028:return n*e/s.components*s.byteLength;case 1029:return n*e/s.components*s.byteLength;case 1030:return n*e*2/s.components*s.byteLength;case 1031:return n*e*2/s.components*s.byteLength;case 1022:return n*e*3/s.components*s.byteLength;case 1023:return n*e*4/s.components*s.byteLength;case 1033:return n*e*4/s.components*s.byteLength;case 33776:case 33777:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(n,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(n,8)*Math.max(e,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(n/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(n/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ru(n){switch(n){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?it("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Af(){let n=null,e=!1,t=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Cu(n){const e=new WeakMap;function t(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,c,l){const h=c.array,u=c.updateRanges;if(n.bindBuffer(l,a),u.length===0)n.bufferSubData(l,0,h);else{u.sort((d,m)=>d.start-m.start);let f=0;for(let d=1;d<u.length;d++){const m=u[f],_=u[d];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++f,u[f]=_)}u.length=f+1;for(let d=0,m=u.length;d<m;d++){const _=u[d];n.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Lu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Pu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Du=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Iu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ku=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Uu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Nu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Fu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ou=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Bu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$u=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Gu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Hu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Vu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Wu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Xu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Zu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ku=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Qu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Ju=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,ju=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ed=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,td=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,nd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,id=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ad="gl_FragColor = linearToOutputTexel( gl_FragColor );",od=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ld=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,cd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,hd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,fd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ud=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,dd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,md=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_d=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Md=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Sd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,bd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Td=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ed=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,wd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ad=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Rd=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Cd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ld=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Pd=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Dd=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Id=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ud=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Nd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Fd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Od=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,$d=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Vd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Wd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,qd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Zd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Kd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,jd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ep=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,np=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ip=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,ap=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,op=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,fp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,up=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,dp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,pp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,mp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,gp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_p=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Mp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,xp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Tp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ep=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,wp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Cp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Lp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ip=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Up=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Np=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Fp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Op=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Bp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,$p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Gp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Vp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Wp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Zp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Qp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Jp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,t1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,i1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,r1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,a1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,o1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,l1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,c1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Mt={alphahash_fragment:Lu,alphahash_pars_fragment:Pu,alphamap_fragment:Du,alphamap_pars_fragment:Iu,alphatest_fragment:ku,alphatest_pars_fragment:Uu,aomap_fragment:Nu,aomap_pars_fragment:Fu,batching_pars_vertex:Ou,batching_vertex:Bu,begin_vertex:$u,beginnormal_vertex:Gu,bsdfs:zu,iridescence_fragment:Hu,bumpmap_pars_fragment:Vu,clipping_planes_fragment:Wu,clipping_planes_pars_fragment:Xu,clipping_planes_pars_vertex:qu,clipping_planes_vertex:Yu,color_fragment:Zu,color_pars_fragment:Ku,color_pars_vertex:Qu,color_vertex:Ju,common:ju,cube_uv_reflection_fragment:ed,defaultnormal_vertex:td,displacementmap_pars_vertex:nd,displacementmap_vertex:id,emissivemap_fragment:sd,emissivemap_pars_fragment:rd,colorspace_fragment:ad,colorspace_pars_fragment:od,envmap_fragment:ld,envmap_common_pars_fragment:cd,envmap_pars_fragment:hd,envmap_pars_vertex:fd,envmap_physical_pars_fragment:Sd,envmap_vertex:ud,fog_vertex:dd,fog_pars_vertex:pd,fog_fragment:md,fog_pars_fragment:gd,gradientmap_pars_fragment:_d,lightmap_pars_fragment:Md,lights_lambert_fragment:vd,lights_lambert_pars_fragment:xd,lights_pars_begin:yd,lights_toon_fragment:bd,lights_toon_pars_fragment:Td,lights_phong_fragment:Ed,lights_phong_pars_fragment:wd,lights_physical_fragment:Ad,lights_physical_pars_fragment:Rd,lights_fragment_begin:Cd,lights_fragment_maps:Ld,lights_fragment_end:Pd,lightprobes_pars_fragment:Dd,logdepthbuf_fragment:Id,logdepthbuf_pars_fragment:kd,logdepthbuf_pars_vertex:Ud,logdepthbuf_vertex:Nd,map_fragment:Fd,map_pars_fragment:Od,map_particle_fragment:Bd,map_particle_pars_fragment:$d,metalnessmap_fragment:Gd,metalnessmap_pars_fragment:zd,morphinstance_vertex:Hd,morphcolor_vertex:Vd,morphnormal_vertex:Wd,morphtarget_pars_vertex:Xd,morphtarget_vertex:qd,normal_fragment_begin:Yd,normal_fragment_maps:Zd,normal_pars_fragment:Kd,normal_pars_vertex:Qd,normal_vertex:Jd,normalmap_pars_fragment:jd,clearcoat_normal_fragment_begin:ep,clearcoat_normal_fragment_maps:tp,clearcoat_pars_fragment:np,iridescence_pars_fragment:ip,opaque_fragment:sp,packing:rp,premultiplied_alpha_fragment:ap,project_vertex:op,dithering_fragment:lp,dithering_pars_fragment:cp,roughnessmap_fragment:hp,roughnessmap_pars_fragment:fp,shadowmap_pars_fragment:up,shadowmap_pars_vertex:dp,shadowmap_vertex:pp,shadowmask_pars_fragment:mp,skinbase_vertex:gp,skinning_pars_vertex:_p,skinning_vertex:Mp,skinnormal_vertex:vp,specularmap_fragment:xp,specularmap_pars_fragment:yp,tonemapping_fragment:Sp,tonemapping_pars_fragment:bp,transmission_fragment:Tp,transmission_pars_fragment:Ep,uv_pars_fragment:wp,uv_pars_vertex:Ap,uv_vertex:Rp,worldpos_vertex:Cp,background_vert:Lp,background_frag:Pp,backgroundCube_vert:Dp,backgroundCube_frag:Ip,cube_vert:kp,cube_frag:Up,depth_vert:Np,depth_frag:Fp,distance_vert:Op,distance_frag:Bp,equirect_vert:$p,equirect_frag:Gp,linedashed_vert:zp,linedashed_frag:Hp,meshbasic_vert:Vp,meshbasic_frag:Wp,meshlambert_vert:Xp,meshlambert_frag:qp,meshmatcap_vert:Yp,meshmatcap_frag:Zp,meshnormal_vert:Kp,meshnormal_frag:Qp,meshphong_vert:Jp,meshphong_frag:jp,meshphysical_vert:e1,meshphysical_frag:t1,meshtoon_vert:n1,meshtoon_frag:i1,points_vert:s1,points_frag:r1,shadow_vert:a1,shadow_frag:o1,sprite_vert:l1,sprite_frag:c1},Ce={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ot}},envmap:{envMap:{value:null},envMapRotation:{value:new ot},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ot},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0},uvTransform:{value:new ot}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}}},Ui={basic:{uniforms:Jn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.fog]),vertexShader:Mt.meshbasic_vert,fragmentShader:Mt.meshbasic_frag},lambert:{uniforms:Jn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new bt(0)},envMapIntensity:{value:1}}]),vertexShader:Mt.meshlambert_vert,fragmentShader:Mt.meshlambert_frag},phong:{uniforms:Jn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Mt.meshphong_vert,fragmentShader:Mt.meshphong_frag},standard:{uniforms:Jn([Ce.common,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.roughnessmap,Ce.metalnessmap,Ce.fog,Ce.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Mt.meshphysical_vert,fragmentShader:Mt.meshphysical_frag},toon:{uniforms:Jn([Ce.common,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.gradientmap,Ce.fog,Ce.lights,{emissive:{value:new bt(0)}}]),vertexShader:Mt.meshtoon_vert,fragmentShader:Mt.meshtoon_frag},matcap:{uniforms:Jn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,{matcap:{value:null}}]),vertexShader:Mt.meshmatcap_vert,fragmentShader:Mt.meshmatcap_frag},points:{uniforms:Jn([Ce.points,Ce.fog]),vertexShader:Mt.points_vert,fragmentShader:Mt.points_frag},dashed:{uniforms:Jn([Ce.common,Ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Mt.linedashed_vert,fragmentShader:Mt.linedashed_frag},depth:{uniforms:Jn([Ce.common,Ce.displacementmap]),vertexShader:Mt.depth_vert,fragmentShader:Mt.depth_frag},normal:{uniforms:Jn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,{opacity:{value:1}}]),vertexShader:Mt.meshnormal_vert,fragmentShader:Mt.meshnormal_frag},sprite:{uniforms:Jn([Ce.sprite,Ce.fog]),vertexShader:Mt.sprite_vert,fragmentShader:Mt.sprite_frag},background:{uniforms:{uvTransform:{value:new ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Mt.background_vert,fragmentShader:Mt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ot}},vertexShader:Mt.backgroundCube_vert,fragmentShader:Mt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Mt.cube_vert,fragmentShader:Mt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Mt.equirect_vert,fragmentShader:Mt.equirect_frag},distance:{uniforms:Jn([Ce.common,Ce.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Mt.distance_vert,fragmentShader:Mt.distance_frag},shadow:{uniforms:Jn([Ce.lights,Ce.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:Mt.shadow_vert,fragmentShader:Mt.shadow_frag}};Ui.physical={uniforms:Jn([Ui.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ot},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ot},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ot},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ot},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ot},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ot},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ot}}]),vertexShader:Mt.meshphysical_vert,fragmentShader:Mt.meshphysical_frag};const Wa={r:0,b:0,g:0},h1=new mn,Rf=new ot;Rf.set(-1,0,0,0,1,0,0,0,1);function f1(n,e,t,i,s,r){const o=new bt(0);let a=s===!0?0:1,c,l,h=null,u=0,f=null;function d(b){let E=b.isScene===!0?b.background:null;if(E&&E.isTexture){const v=b.backgroundBlurriness>0;E=e.get(E,v)}return E}function m(b){let E=!1;const v=d(b);v===null?p(o,a):v&&v.isColor&&(p(v,1),E=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(b,E){const v=d(E);v&&(v.isCubeTexture||v.mapping===306)?(l===void 0&&(l=new tn(new Ss(1,1,1),new oi({name:"BackgroundCubeMaterial",uniforms:br(Ui.backgroundCube.uniforms),vertexShader:Ui.backgroundCube.vertexShader,fragmentShader:Ui.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(S,T,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(h1.makeRotationFromEuler(E.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Rf),l.material.toneMapped=Lt.getTransfer(v.colorSpace)!==$t,(h!==v||u!==v.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,f=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new tn(new Ri(2,2),new oi({name:"BackgroundMaterial",uniforms:br(Ui.background.uniforms),vertexShader:Ui.background.vertexShader,fragmentShader:Ui.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=Lt.getTransfer(v.colorSpace)!==$t,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,f=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function p(b,E){b.getRGB(Wa,bf(n)),t.buffers.color.setClear(Wa.r,Wa.g,Wa.b,E,r)}function g(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,E=1){o.set(b),a=E,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(b){a=b,p(o,a)},render:m,addToRenderList:_,dispose:g}}function u1(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,o=!1;function a(O,U,G,P,$){let Z=!1;const V=u(O,P,G,U);r!==V&&(r=V,l(r.object)),Z=d(O,P,G,$),Z&&m(O,P,G,$),$!==null&&e.update($,n.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,v(O,U,G,P),$!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function c(){return n.createVertexArray()}function l(O){return n.bindVertexArray(O)}function h(O){return n.deleteVertexArray(O)}function u(O,U,G,P){const $=P.wireframe===!0;let Z=i[U.id];Z===void 0&&(Z={},i[U.id]=Z);const V=O.isInstancedMesh===!0?O.id:0;let se=Z[V];se===void 0&&(se={},Z[V]=se);let K=se[G.id];K===void 0&&(K={},se[G.id]=K);let ne=K[$];return ne===void 0&&(ne=f(c()),K[$]=ne),ne}function f(O){const U=[],G=[],P=[];for(let $=0;$<t;$++)U[$]=0,G[$]=0,P[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:G,attributeDivisors:P,object:O,attributes:{},index:null}}function d(O,U,G,P){const $=r.attributes,Z=U.attributes;let V=0;const se=G.getAttributes();for(const K in se)if(se[K].location>=0){const he=$[K];let Be=Z[K];if(Be===void 0&&(K==="instanceMatrix"&&O.instanceMatrix&&(Be=O.instanceMatrix),K==="instanceColor"&&O.instanceColor&&(Be=O.instanceColor)),he===void 0||he.attribute!==Be||Be&&he.data!==Be.data)return!0;V++}return r.attributesNum!==V||r.index!==P}function m(O,U,G,P){const $={},Z=U.attributes;let V=0;const se=G.getAttributes();for(const K in se)if(se[K].location>=0){let he=Z[K];he===void 0&&(K==="instanceMatrix"&&O.instanceMatrix&&(he=O.instanceMatrix),K==="instanceColor"&&O.instanceColor&&(he=O.instanceColor));const Be={};Be.attribute=he,he&&he.data&&(Be.data=he.data),$[K]=Be,V++}r.attributes=$,r.attributesNum=V,r.index=P}function _(){const O=r.newAttributes;for(let U=0,G=O.length;U<G;U++)O[U]=0}function p(O){g(O,0)}function g(O,U){const G=r.newAttributes,P=r.enabledAttributes,$=r.attributeDivisors;G[O]=1,P[O]===0&&(n.enableVertexAttribArray(O),P[O]=1),$[O]!==U&&(n.vertexAttribDivisor(O,U),$[O]=U)}function b(){const O=r.newAttributes,U=r.enabledAttributes;for(let G=0,P=U.length;G<P;G++)U[G]!==O[G]&&(n.disableVertexAttribArray(G),U[G]=0)}function E(O,U,G,P,$,Z,V){V===!0?n.vertexAttribIPointer(O,U,G,$,Z):n.vertexAttribPointer(O,U,G,P,$,Z)}function v(O,U,G,P){_();const $=P.attributes,Z=G.getAttributes(),V=U.defaultAttributeValues;for(const se in Z){const K=Z[se];if(K.location>=0){let ne=$[se];if(ne===void 0&&(se==="instanceMatrix"&&O.instanceMatrix&&(ne=O.instanceMatrix),se==="instanceColor"&&O.instanceColor&&(ne=O.instanceColor)),ne!==void 0){const he=ne.normalized,Be=ne.itemSize,Oe=e.get(ne);if(Oe===void 0)continue;const me=Oe.buffer,Ae=Oe.type,Ve=Oe.bytesPerElement,j=Ae===n.INT||Ae===n.UNSIGNED_INT||ne.gpuType===1013;if(ne.isInterleavedBufferAttribute){const re=ne.data,Se=re.stride,Je=ne.offset;if(re.isInstancedInterleavedBuffer){for(let Ie=0;Ie<K.locationSize;Ie++)g(K.location+Ie,re.meshPerAttribute);O.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Ie=0;Ie<K.locationSize;Ie++)p(K.location+Ie);n.bindBuffer(n.ARRAY_BUFFER,me);for(let Ie=0;Ie<K.locationSize;Ie++)E(K.location+Ie,Be/K.locationSize,Ae,he,Se*Ve,(Je+Be/K.locationSize*Ie)*Ve,j)}else{if(ne.isInstancedBufferAttribute){for(let re=0;re<K.locationSize;re++)g(K.location+re,ne.meshPerAttribute);O.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let re=0;re<K.locationSize;re++)p(K.location+re);n.bindBuffer(n.ARRAY_BUFFER,me);for(let re=0;re<K.locationSize;re++)E(K.location+re,Be/K.locationSize,Ae,he,Be*Ve,Be/K.locationSize*re*Ve,j)}}else if(V!==void 0){const he=V[se];if(he!==void 0)switch(he.length){case 2:n.vertexAttrib2fv(K.location,he);break;case 3:n.vertexAttrib3fv(K.location,he);break;case 4:n.vertexAttrib4fv(K.location,he);break;default:n.vertexAttrib1fv(K.location,he)}}}}b()}function S(){w();for(const O in i){const U=i[O];for(const G in U){const P=U[G];for(const $ in P){const Z=P[$];for(const V in Z)h(Z[V].object),delete Z[V];delete P[$]}}delete i[O]}}function T(O){if(i[O.id]===void 0)return;const U=i[O.id];for(const G in U){const P=U[G];for(const $ in P){const Z=P[$];for(const V in Z)h(Z[V].object),delete Z[V];delete P[$]}}delete i[O.id]}function L(O){for(const U in i){const G=i[U];for(const P in G){const $=G[P];if($[O.id]===void 0)continue;const Z=$[O.id];for(const V in Z)h(Z[V].object),delete Z[V];delete $[O.id]}}}function x(O){for(const U in i){const G=i[U],P=O.isInstancedMesh===!0?O.id:0,$=G[P];if($!==void 0){for(const Z in $){const V=$[Z];for(const se in V)h(V[se].object),delete V[se];delete $[Z]}delete G[P],Object.keys(G).length===0&&delete i[U]}}}function w(){I(),o=!0,r!==s&&(r=s,l(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:w,resetDefaultState:I,dispose:S,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:L,initAttributes:_,enableAttribute:p,disableUnusedAttributes:b}}function d1(n,e,t){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function o(c,l,h){h!==0&&(n.drawArraysInstanced(i,c,l,h),t.update(l,i,h))}function a(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,h);let f=0;for(let d=0;d<h;d++)f+=l[d];t.update(f,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function p1(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const L=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(L){return!(L!==1023&&i.convert(L)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(L){const x=L===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(L!==1009&&L!==1015&&!x&&i.convert(L)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function c(L){if(L==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(it("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&it("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:b,maxVaryings:E,maxFragmentUniforms:v,maxSamples:S,samples:T}}function m1(n){const e=this;let t=null,i=0,s=!1,r=!1;const o=new us,a=new ot,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||i!==0||s;return s=f,i=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){const m=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,g=n.get(u);if(!s||m===null||m.length===0||r&&!p)r?h(null):l();else{const b=r?0:i,E=b*4;let v=g.clippingState||null;c.value=v,v=h(m,f,E,d);for(let S=0;S!==E;++S)v[S]=t[S];g.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,f,d,m){const _=u!==null?u.length:0;let p=null;if(_!==0){if(p=c.value,m!==!0||p===null){const g=d+_*4,b=f.matrixWorldInverse;a.getNormalMatrix(b),(p===null||p.length<g)&&(p=new Float32Array(g));for(let E=0,v=d;E!==_;++E,v+=4)o.copy(u[E]).applyMatrix4(b,a),o.normal.toArray(p,v),p[v+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}const ur=4,g1=6,_1=20,M1=256,Zr=new vo,oh=new bt;let nl=null,il=0,sl=0,rl=!1;const v1=new z,Is=new z;class lh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:o=256,position:a=v1}=r;nl=this._renderer.getRenderTarget(),il=this._renderer.getActiveCubeFace(),sl=this._renderer.getActiveMipmapLevel(),rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(nl,il,sl),this._renderer.xr.enabled=rl,e.scissorTest=!1,cr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),nl=this._renderer.getRenderTarget(),il=this._renderer.getActiveCubeFace(),sl=this._renderer.getActiveMipmapLevel(),rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:oo,depthBuffer:!1},s=ch(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ch(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=x1(r)),this._blurMaterial=S1(r,e,t),this._ggxMaterial=y1(r,e,t)}return s}_compileMaterial(e){const t=new tn(new Mi,e);this._renderer.compile(t,Zr)}_sceneToCubeUV(e,t,i,s,r){const c=new fi(90,1,t,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(oh),u.toneMapping=0,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new tn(new Ss,new va({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,p=_.material;let g=!1;const b=e.background;b?b.isColor&&(p.color.copy(b),e.background=null,g=!0):(p.color.copy(oh),g=!0);for(let E=0;E<6;E++){const v=E%3;v===0?(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[E],r.y,r.z)):v===1?(c.up.set(0,0,l[E]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[E],r.z)):(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[E]));const S=this._cubeSize;cr(s,v*S,E>2?S:0,S,S),u.setRenderTarget(s),g&&u.render(_,c),u.render(e,c)}u.toneMapping=d,u.autoClear=f,e.background=b}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===301||e.mapping===302;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=fh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hh());const r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;cr(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,Zr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const c=o.uniforms,l=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-h*h),f=l*1.25,d=u*f,{_lodMax:m}=this,_=this._sizeLods[i],p=3*_*(i>m-ur?i-m+ur:0),g=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=d,c.mipInt.value=m-t,cr(r,p,g,3*_,2*_),s.setRenderTarget(r),s.render(a,Zr),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=m-i,cr(e,p,g,3*_,2*_),s.setRenderTarget(e),s.render(a,Zr)}_blur(e,t,i,s){const r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,i,o),this._blurPass(r,e,i,i,o)}_blurPass(e,t,i,s,r){const o=this._renderer,a=this._blurMaterial,c=this._lodMeshes[s];c.material=a;const l=a.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-i;const h=this._sizeLods[s],u=3*h*(s>this._lodMax-ur?s-this._lodMax+ur:0),f=4*(this._cubeSize-h);cr(t,u,f,3*h,2*h),o.setRenderTarget(t),o.render(c,Zr)}}function x1(n){const e=[],t=[];let i=n;const s=n-ur+1+g1;for(let r=0;r<s;r++){const o=Math.pow(2,i);e.push(o);const a=1/(o-2),c=-a,l=1+a,h=[c,c,l,c,l,l,c,c,l,l,c,l],u=6,f=6,d=3,m=new Float32Array(d*f*u),_=new Float32Array(d*f*u);for(let g=0;g<u;g++){const b=g%3*2/3-1,E=g>2?0:-1,v=[b,E,0,b+2/3,E,0,b+2/3,E+1,0,b,E,0,b+2/3,E+1,0,b,E+1,0];m.set(v,d*f*g);for(let S=0;S<f;S++){const T=h[S*2]*2-1,L=h[S*2+1]*2-1;g===0?Is.set(1,L,T):g===1?Is.set(-T,1,-L):g===2?Is.set(-T,L,1):g===3?Is.set(-1,L,-T):g===4?Is.set(-T,-1,L):Is.set(T,L,-1),Is.toArray(_,(g*f+S)*d)}}const p=new Mi;p.setAttribute("position",new Bi(m,d)),p.setAttribute("outputDirection",new Bi(_,d)),t.push(new tn(p,null)),i>ur&&i--}return{lodMeshes:t,sizeLods:e}}function ch(n,e,t){const i=new ri(n,e,t);return i.texture.mapping=306,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function cr(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function y1(n,e,t){return new oi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:M1,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:xo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function S1(n,e,t){return new oi({name:"SphericalGaussianBlur",defines:{SAMPLES:_1,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:xo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function hh(){return new oi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function fh(){return new oi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function xo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Cf extends ri{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new yf(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ss(5,5,5),r=new oi({name:"CubemapFromEquirect",uniforms:br(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:1,blending:0});r.uniforms.tEquirect.value=t;const o=new tn(s,r),a=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new Tu(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}}function b1(n){let e=new WeakMap,t=new WeakMap,i=null;function s(f,d=!1){return f==null?null:d?o(f):r(f)}function r(f){if(f&&f.isTexture){const d=f.mapping;if(d===303||d===304)if(e.has(f)){const m=e.get(f).texture;return a(m,f.mapping)}else{const m=f.image;if(m&&m.height>0){const _=new Cf(m.height);return _.fromEquirectangularTexture(n,f),e.set(f,_),f.addEventListener("dispose",l),a(_.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture){const d=f.mapping,m=d===303||d===304,_=d===301||d===302;if(m||_){let p=t.get(f);const g=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==g)return i===null&&(i=new lh(n)),p=m?i.fromEquirectangular(f,p):i.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),p.texture;if(p!==void 0)return p.texture;{const b=f.image;return m&&b&&b.height>0||_&&b&&c(b)?(i===null&&(i=new lh(n)),p=m?i.fromEquirectangular(f):i.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),f.addEventListener("dispose",h),p.texture):null}}}return f}function a(f,d){return d===303?f.mapping=301:d===304&&(f.mapping=302),f}function c(f){let d=0;const m=6;for(let _=0;_<m;_++)f[_]!==void 0&&d++;return d===m}function l(f){const d=f.target;d.removeEventListener("dispose",l);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function h(f){const d=f.target;d.removeEventListener("dispose",h);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function T1(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&mr("WebGLRenderer: "+i+" extension not supported."),s}}}function E1(n,e,t,i){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const m in f.attributes)e.remove(f.attributes[m]);f.removeEventListener("dispose",o),delete s[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function c(u){const f=u.attributes;for(const d in f)e.update(f[d],n.ARRAY_BUFFER)}function l(u){const f=[],d=u.index,m=u.attributes.position;let _=0;if(m===void 0)return;if(d!==null){const b=d.array;_=d.version;for(let E=0,v=b.length;E<v;E+=3){const S=b[E+0],T=b[E+1],L=b[E+2];f.push(S,T,T,L,L,S)}}else{const b=m.array;_=m.version;for(let E=0,v=b.length/3-1;E<v;E+=3){const S=E+0,T=E+1,L=E+2;f.push(S,T,T,L,L,S)}}const p=new(m.count>=65535?Mf:_f)(f,1);p.version=_;const g=r.get(u);g&&e.remove(g),r.set(u,p)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function w1(n,e,t){let i;function s(u){i=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function c(u,f){n.drawElements(i,f,r,u*o),t.update(f,i,1)}function l(u,f,d){d!==0&&(n.drawElementsInstanced(i,f,r,u*o,d),t.update(f,i,d))}function h(u,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,u,0,d);let _=0;for(let p=0;p<d;p++)_+=f[p];t.update(_,i,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function A1(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:Ut("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function R1(n,e,t){const i=new WeakMap,s=new pn;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(a);if(f===void 0||f.count!==u){let w=function(){L.dispose(),i.delete(a),a.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let E=0;d===!0&&(E=1),m===!0&&(E=2),_===!0&&(E=3);let v=a.attributes.position.count*E,S=1;v>e.maxTextureSize&&(S=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const T=new Float32Array(v*S*4*u),L=new pf(T,v,S,u);L.type=1015,L.needsUpdate=!0;const x=E*4;for(let I=0;I<u;I++){const O=p[I],U=g[I],G=b[I],P=v*S*4*I;for(let $=0;$<O.count;$++){const Z=$*x;d===!0&&(s.fromBufferAttribute(O,$),T[P+Z+0]=s.x,T[P+Z+1]=s.y,T[P+Z+2]=s.z,T[P+Z+3]=0),m===!0&&(s.fromBufferAttribute(U,$),T[P+Z+4]=s.x,T[P+Z+5]=s.y,T[P+Z+6]=s.z,T[P+Z+7]=0),_===!0&&(s.fromBufferAttribute(G,$),T[P+Z+8]=s.x,T[P+Z+9]=s.y,T[P+Z+10]=s.z,T[P+Z+11]=G.itemSize===4?s.w:1)}}f={count:u,texture:L,size:new st(v,S)},i.set(a,f),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let d=0;for(let _=0;_<l.length;_++)d+=l[_];const m=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(n,"morphTargetBaseInfluence",m),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function C1(n,e,t,i,s){let r=new WeakMap;function o(l){const h=s.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==h&&(e.update(f),r.set(f,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return f}function a(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}const L1={1:"LINEAR_TONE_MAPPING",2:"REINHARD_TONE_MAPPING",3:"CINEON_TONE_MAPPING",4:"ACES_FILMIC_TONE_MAPPING",6:"AGX_TONE_MAPPING",7:"NEUTRAL_TONE_MAPPING",5:"CUSTOM_TONE_MAPPING"};function P1(n,e,t,i,s,r){const o=new ri(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let a=null,c=null;const l=new Mi;l.setAttribute("position",new ai([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new ai([0,2,0,0,2,0],2));const h=new Tf({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new tn(l,h),f=new vo(-1,1,1,-1,0,1);let d=null,m=null,_=!1,p,g=null,b=[],E=!1;this.setSize=function(v,S){o.setSize(v,S),a!==null&&a.setSize(v,S),c!==null&&c.setSize(v,S);for(let T=0;T<b.length;T++){const L=b[T];L.setSize&&L.setSize(v,S)}},this.setEffects=function(v){b=v,E=b.length>0&&b[0].isRenderPass===!0;const S=o.width,T=o.height;b.length>0&&a===null&&(a=new ri(S,T,{type:1016,depthBuffer:!1,stencilBuffer:!1}),c=new ri(S,T,{type:1016,depthBuffer:!1,stencilBuffer:!1}));for(let L=0;L<b.length;L++){const x=b[L];x.setSize&&x.setSize(S,T)}},this.begin=function(v,S){if(_||v.toneMapping===0&&b.length===0)return!1;if(g=S,S!==null){const T=S.width,L=S.height;(o.width!==T||o.height!==L)&&this.setSize(T,L)}return E===!1&&v.setRenderTarget(o),p=v.toneMapping,v.toneMapping=0,!0},this.hasRenderPass=function(){return E},this.end=function(v,S){v.toneMapping=p,_=!0;let T=o,L=a;for(let x=0;x<b.length;x++){const w=b[x];w.enabled!==!1&&(w.render(v,L,T,S),w.needsSwap!==!1&&(T=L,L=L===a?c:a))}if(d!==v.outputColorSpace||m!==v.toneMapping){d=v.outputColorSpace,m=v.toneMapping,h.defines={},Lt.getTransfer(d)===$t&&(h.defines.SRGB_TRANSFER="");const x=L1[m];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(g),v.render(u,f),g=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}const Lf=new zn,Il=new Sr(1,1),Pf=new pf,Df=new H0,If=new yf,uh=[],dh=[],ph=new Float32Array(16),mh=new Float32Array(9),gh=new Float32Array(4);function kr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=uh[s];if(r===void 0&&(r=new Float32Array(s),uh[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function kn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Un(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function yo(n,e){let t=dh[e];t===void 0&&(t=new Int32Array(e),dh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function D1(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function I1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kn(t,e))return;n.uniform2fv(this.addr,e),Un(t,e)}}function k1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(kn(t,e))return;n.uniform3fv(this.addr,e),Un(t,e)}}function U1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kn(t,e))return;n.uniform4fv(this.addr,e),Un(t,e)}}function N1(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(kn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Un(t,e)}else{if(kn(t,i))return;gh.set(i),n.uniformMatrix2fv(this.addr,!1,gh),Un(t,i)}}function F1(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(kn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Un(t,e)}else{if(kn(t,i))return;mh.set(i),n.uniformMatrix3fv(this.addr,!1,mh),Un(t,i)}}function O1(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(kn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Un(t,e)}else{if(kn(t,i))return;ph.set(i),n.uniformMatrix4fv(this.addr,!1,ph),Un(t,i)}}function B1(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function $1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kn(t,e))return;n.uniform2iv(this.addr,e),Un(t,e)}}function G1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kn(t,e))return;n.uniform3iv(this.addr,e),Un(t,e)}}function z1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kn(t,e))return;n.uniform4iv(this.addr,e),Un(t,e)}}function H1(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function V1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kn(t,e))return;n.uniform2uiv(this.addr,e),Un(t,e)}}function W1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kn(t,e))return;n.uniform3uiv(this.addr,e),Un(t,e)}}function X1(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kn(t,e))return;n.uniform4uiv(this.addr,e),Un(t,e)}}function q1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Il.compareFunction=t.isReversedDepthBuffer()?518:515,r=Il):r=Lf,t.setTexture2D(e||r,s)}function Y1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Df,s)}function Z1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||If,s)}function K1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Pf,s)}function Q1(n){switch(n){case 5126:return D1;case 35664:return I1;case 35665:return k1;case 35666:return U1;case 35674:return N1;case 35675:return F1;case 35676:return O1;case 5124:case 35670:return B1;case 35667:case 35671:return $1;case 35668:case 35672:return G1;case 35669:case 35673:return z1;case 5125:return H1;case 36294:return V1;case 36295:return W1;case 36296:return X1;case 35678:case 36198:case 36298:case 36306:case 35682:return q1;case 35679:case 36299:case 36307:return Y1;case 35680:case 36300:case 36308:case 36293:return Z1;case 36289:case 36303:case 36311:case 36292:return K1}}function J1(n,e){n.uniform1fv(this.addr,e)}function j1(n,e){const t=kr(e,this.size,2);n.uniform2fv(this.addr,t)}function em(n,e){const t=kr(e,this.size,3);n.uniform3fv(this.addr,t)}function tm(n,e){const t=kr(e,this.size,4);n.uniform4fv(this.addr,t)}function nm(n,e){const t=kr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function im(n,e){const t=kr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function sm(n,e){const t=kr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function rm(n,e){n.uniform1iv(this.addr,e)}function am(n,e){n.uniform2iv(this.addr,e)}function om(n,e){n.uniform3iv(this.addr,e)}function lm(n,e){n.uniform4iv(this.addr,e)}function cm(n,e){n.uniform1uiv(this.addr,e)}function hm(n,e){n.uniform2uiv(this.addr,e)}function fm(n,e){n.uniform3uiv(this.addr,e)}function um(n,e){n.uniform4uiv(this.addr,e)}function dm(n,e,t){const i=this.cache,s=e.length,r=yo(t,s);kn(i,r)||(n.uniform1iv(this.addr,r),Un(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=Il:o=Lf;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function pm(n,e,t){const i=this.cache,s=e.length,r=yo(t,s);kn(i,r)||(n.uniform1iv(this.addr,r),Un(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Df,r[o])}function mm(n,e,t){const i=this.cache,s=e.length,r=yo(t,s);kn(i,r)||(n.uniform1iv(this.addr,r),Un(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||If,r[o])}function gm(n,e,t){const i=this.cache,s=e.length,r=yo(t,s);kn(i,r)||(n.uniform1iv(this.addr,r),Un(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Pf,r[o])}function _m(n){switch(n){case 5126:return J1;case 35664:return j1;case 35665:return em;case 35666:return tm;case 35674:return nm;case 35675:return im;case 35676:return sm;case 5124:case 35670:return rm;case 35667:case 35671:return am;case 35668:case 35672:return om;case 35669:case 35673:return lm;case 5125:return cm;case 36294:return hm;case 36295:return fm;case 36296:return um;case 35678:case 36198:case 36298:case 36306:case 35682:return dm;case 35679:case 36299:case 36307:return pm;case 35680:case 36300:case 36308:case 36293:return mm;case 36289:case 36303:case 36311:case 36292:return gm}}class Mm{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Q1(t.type)}}class vm{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=_m(t.type)}}class xm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],i)}}}const al=/(\w+)(\])?(\[|\.)?/g;function _h(n,e){n.seq.push(e),n.map[e.id]=e}function ym(n,e,t){const i=n.name,s=i.length;for(al.lastIndex=0;;){const r=al.exec(i),o=al.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){_h(t,l===void 0?new Mm(a,n,e):new vm(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new xm(a),_h(t,u)),t=u}}}class to{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);ym(a,c,this)}const s=[],r=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&i.push(o)}return i}}function Mh(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Sm=37297;let bm=0;function Tm(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const vh=new ot;function Em(n){Lt._getMatrix(vh,Lt.workingColorSpace,n);const e=`mat3( ${vh.elements.map(t=>t.toFixed(4))} )`;switch(Lt.getTransfer(n)){case lo:return[e,"LinearTransferOETF"];case $t:return[e,"sRGBTransferOETF"];default:return it("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function xh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Tm(n.getShaderSource(e),a)}else return r}function wm(n,e){const t=Em(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Am={1:"Linear",2:"Reinhard",3:"Cineon",4:"ACESFilmic",6:"AgX",7:"Neutral",5:"Custom"};function Rm(n,e){const t=Am[e];return t===void 0?(it("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Xa=new z;function Cm(){Lt.getLuminanceCoefficients(Xa);const n=Xa.x.toFixed(4),e=Xa.y.toFixed(4),t=Xa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Lm(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ra).join(`
`)}function Pm(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Dm(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),o=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function ra(n){return n!==""}function yh(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Im=/^[ \t]*#include +<([\w\d./]+)>/gm;function kl(n){return n.replace(Im,Um)}const km=new Map;function Um(n,e){let t=Mt[e];if(t===void 0){const i=km.get(e);if(i!==void 0)t=Mt[i],it('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return kl(t)}const Nm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bh(n){return n.replace(Nm,Fm)}function Fm(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Th(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Om={1:"SHADOWMAP_TYPE_PCF",3:"SHADOWMAP_TYPE_VSM"};function Bm(n){return Om[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const $m={301:"ENVMAP_TYPE_CUBE",302:"ENVMAP_TYPE_CUBE",306:"ENVMAP_TYPE_CUBE_UV"};function Gm(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":$m[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const zm={302:"ENVMAP_MODE_REFRACTION"};function Hm(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":zm[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Vm={0:"ENVMAP_BLENDING_MULTIPLY",1:"ENVMAP_BLENDING_MIX",2:"ENVMAP_BLENDING_ADD"};function Wm(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Vm[n.combine]||"ENVMAP_BLENDING_NONE"}function Xm(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function qm(n,e,t,i){const s=n.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=Bm(t),l=Gm(t),h=Hm(t),u=Wm(t),f=Xm(t),d=Lm(t),m=Pm(r),_=s.createProgram();let p,g,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ra).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ra).join(`
`),g.length>0&&(g+=`
`)):(p=[Th(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ra).join(`
`),g=[Th(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Mt.tonemapping_pars_fragment:"",t.toneMapping!==0?Rm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Mt.colorspace_pars_fragment,wm("linearToOutputTexel",t.outputColorSpace),Cm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ra).join(`
`)),o=kl(o),o=yh(o,t),o=Sh(o,t),a=kl(a),a=yh(a,t),a=Sh(a,t),o=bh(o),a=bh(a),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",t.glslVersion===Ic?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ic?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const E=b+p+o,v=b+g+a,S=Mh(s,s.VERTEX_SHADER,E),T=Mh(s,s.FRAGMENT_SHADER,v);s.attachShader(_,S),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function L(O){if(n.debug.checkShaderErrors){const U=s.getProgramInfoLog(_)||"",G=s.getShaderInfoLog(S)||"",P=s.getShaderInfoLog(T)||"",$=U.trim(),Z=G.trim(),V=P.trim();let se=!0,K=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(se=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,S,T);else{const ne=xh(s,S,"vertex"),he=xh(s,T,"fragment");Ut("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+$+`
`+ne+`
`+he)}else $!==""?it("WebGLProgram: Program Info Log:",$):(Z===""||V==="")&&(K=!1);K&&(O.diagnostics={runnable:se,programLog:$,vertexShader:{log:Z,prefix:p},fragmentShader:{log:V,prefix:g}})}s.deleteShader(S),s.deleteShader(T),x=new to(s,_),w=Dm(s,_)}let x;this.getUniforms=function(){return x===void 0&&L(this),x};let w;this.getAttributes=function(){return w===void 0&&L(this),w};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(_,Sm)),I},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=bm++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=S,this.fragmentShader=T,this}let Ym=0;class Zm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Km(e),t.set(e,i)),i}}class Km{constructor(e){this.id=Ym++,this.code=e,this.usedTimes=0}}function Qm(n){return n===1030||n===37490||n===36285}function Jm(n,e,t,i,s,r){const o=new mf,a=new Zm,c=new Set,l=[],h=new Map,u=i.logarithmicDepthBuffer;let f=i.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return c.add(x),x===0?"uv":`uv${x}`}function _(x,w,I,O,U,G){const P=O.fog,$=U.geometry,Z=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?O.environment:null,V=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,se=e.get(x.envMap||Z,V),K=se&&se.mapping===306?se.image.height:null,ne=d[x.type];x.precision!==null&&(f=i.getMaxPrecision(x.precision),f!==x.precision&&it("WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const he=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Be=he!==void 0?he.length:0;let Oe=0;$.morphAttributes.position!==void 0&&(Oe=1),$.morphAttributes.normal!==void 0&&(Oe=2),$.morphAttributes.color!==void 0&&(Oe=3);let me,Ae,Ve,j;if(ne){const jt=Ui[ne];me=jt.vertexShader,Ae=jt.fragmentShader}else{me=x.vertexShader,Ae=x.fragmentShader;const jt=a.getVertexShaderStage(x),Ot=a.getFragmentShaderStage(x);a.update(x,jt,Ot),Ve=jt.id,j=Ot.id}const re=n.getRenderTarget(),Se=n.state.buffers.depth.getReversed(),Je=U.isInstancedMesh===!0,Ie=U.isBatchedMesh===!0,gt=!!x.map,vn=!!x.matcap,At=!!se,Nt=!!x.aoMap,Jt=!!x.lightMap,Ct=!!x.bumpMap&&x.wireframe===!1,ln=!!x.normalMap,Nn=!!x.displacementMap,ei=!!x.emissiveMap,hn=!!x.metalnessMap,En=!!x.roughnessMap,B=x.anisotropy>0,Hn=x.clearcoat>0,zt=x.dispersion>0,A=x.retroreflectivity>0,M=x.iridescence>0,H=x.sheen>0,q=x.transmission>0,ee=B&&!!x.anisotropyMap,ve=Hn&&!!x.clearcoatMap,ye=Hn&&!!x.clearcoatNormalMap,te=Hn&&!!x.clearcoatRoughnessMap,oe=M&&!!x.iridescenceMap,be=M&&!!x.iridescenceThicknessMap,Xe=H&&!!x.sheenColorMap,Re=H&&!!x.sheenRoughnessMap,Te=!!x.specularMap,qe=!!x.specularColorMap,et=!!x.specularIntensityMap,ht=q&&!!x.transmissionMap,F=q&&!!x.thicknessMap,Ee=!!x.gradientMap,ae=!!x.alphaMap,we=x.alphaTest>0,ke=!!x.alphaHash,fe=!!x.extensions;let Ze=0;x.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(Ze=n.toneMapping);const ze={shaderID:ne,shaderType:x.type,shaderName:x.name,vertexShader:me,fragmentShader:Ae,defines:x.defines,customVertexShaderID:Ve,customFragmentShaderID:j,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:Ie,batchingColor:Ie&&U._colorsTexture!==null,instancing:Je,instancingColor:Je&&U.instanceColor!==null,instancingMorph:Je&&U.morphTexture!==null,outputColorSpace:re===null?n.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:Lt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:gt,matcap:vn,envMap:At,envMapMode:At&&se.mapping,envMapCubeUVHeight:K,aoMap:Nt,lightMap:Jt,bumpMap:Ct,normalMap:ln,displacementMap:Nn,emissiveMap:ei,normalMapObjectSpace:ln&&x.normalMapType===1,normalMapTangentSpace:ln&&x.normalMapType===0,packedNormalMap:ln&&x.normalMapType===0&&Qm(x.normalMap.format),metalnessMap:hn,roughnessMap:En,anisotropy:B,anisotropyMap:ee,clearcoat:Hn,clearcoatMap:ve,clearcoatNormalMap:ye,clearcoatRoughnessMap:te,dispersion:zt,retroreflection:A,iridescence:M,iridescenceMap:oe,iridescenceThicknessMap:be,sheen:H,sheenColorMap:Xe,sheenRoughnessMap:Re,specularMap:Te,specularColorMap:qe,specularIntensityMap:et,transmission:q,transmissionMap:ht,thicknessMap:F,gradientMap:Ee,opaque:x.transparent===!1&&x.blending===1&&x.alphaToCoverage===!1,alphaMap:ae,alphaTest:we,alphaHash:ke,combine:x.combine,mapUv:gt&&m(x.map.channel),aoMapUv:Nt&&m(x.aoMap.channel),lightMapUv:Jt&&m(x.lightMap.channel),bumpMapUv:Ct&&m(x.bumpMap.channel),normalMapUv:ln&&m(x.normalMap.channel),displacementMapUv:Nn&&m(x.displacementMap.channel),emissiveMapUv:ei&&m(x.emissiveMap.channel),metalnessMapUv:hn&&m(x.metalnessMap.channel),roughnessMapUv:En&&m(x.roughnessMap.channel),anisotropyMapUv:ee&&m(x.anisotropyMap.channel),clearcoatMapUv:ve&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:ye&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:oe&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:be&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:Xe&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:Re&&m(x.sheenRoughnessMap.channel),specularMapUv:Te&&m(x.specularMap.channel),specularColorMapUv:qe&&m(x.specularColorMap.channel),specularIntensityMapUv:et&&m(x.specularIntensityMap.channel),transmissionMapUv:ht&&m(x.transmissionMap.channel),thicknessMapUv:F&&m(x.thicknessMap.channel),alphaMapUv:ae&&m(x.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(ln||B),vertexNormals:!!$.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!$.attributes.uv&&(gt||ae),fog:!!P,useFog:x.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||$.attributes.normal===void 0&&ln===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Se,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:$.attributes.position!==void 0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:Be,morphTextureStride:Oe,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:G.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ze,decodeVideoTexture:gt&&x.map.isVideoTexture===!0&&Lt.getTransfer(x.map.colorSpace)===$t,decodeVideoTextureEmissive:ei&&x.emissiveMap.isVideoTexture===!0&&Lt.getTransfer(x.emissiveMap.colorSpace)===$t,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===2,flipSided:x.side===1,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:fe&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(fe&&x.extensions.multiDraw===!0||Ie)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return ze.vertexUv1s=c.has(1),ze.vertexUv2s=c.has(2),ze.vertexUv3s=c.has(3),c.clear(),ze}function p(x){const w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)w.push(I),w.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(g(w,x),b(w,x),w.push(n.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function g(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function b(x,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.retroreflection&&o.enable(24),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function E(x){const w=d[x.type];let I;if(w){const O=Ui[w];I=ec.clone(O.uniforms)}else I=x.uniforms;return I}function v(x,w){let I=h.get(w);return I!==void 0?++I.usedTimes:(I=new qm(n,w,x,s),l.push(I),h.set(w,I)),I}function S(x){if(--x.usedTimes===0){const w=l.indexOf(x);l[w]=l[l.length-1],l.pop(),h.delete(x.cacheKey),x.destroy()}}function T(x){a.remove(x)}function L(){a.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:E,acquireProgram:v,releaseProgram:S,releaseShaderCache:T,programs:l,dispose:L}}function jm(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function e2(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Eh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function wh(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function a(f,d,m,_,p,g){let b=n[e];return b===void 0?(b={id:f.id,object:f,geometry:d,material:m,materialVariant:o(f),groupOrder:_,renderOrder:f.renderOrder,z:p,group:g},n[e]=b):(b.id=f.id,b.object=f,b.geometry=d,b.material=m,b.materialVariant=o(f),b.groupOrder=_,b.renderOrder=f.renderOrder,b.z=p,b.group=g),e++,b}function c(f,d,m,_,p,g,b){b.reversedDepth===!0&&(p=-p);const E=a(f,d,m,_,p,g);m.transmission>0?i.push(E):m.transparent===!0?s.push(E):t.push(E)}function l(f,d,m,_,p,g){const b=a(f,d,m,_,p,g);m.transmission>0?i.unshift(b):m.transparent===!0?s.unshift(b):t.unshift(b)}function h(f,d){t.length>1&&t.sort(f||e2),i.length>1&&i.sort(d||Eh),s.length>1&&s.sort(d||Eh)}function u(){for(let f=e,d=n.length;f<d;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:u,sort:h}}function t2(){let n=new WeakMap;function e(i,s){const r=n.get(i);let o;return r===void 0?(o=new wh,n.set(i,[o])):s>=r.length?(o=new wh,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function n2(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new z,color:new bt};break;case"SpotLight":t={position:new z,direction:new z,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new z,color:new bt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new z,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":t={color:new bt,position:new z,halfWidth:new z,halfHeight:new z};break}return n[e.id]=t,t}}}function i2(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let s2=0;function r2(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function a2(n){const e=new n2,t=i2(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new z);const s=new z,r=new mn,o=new mn;function a(l){let h=0,u=0,f=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let d=0,m=0,_=0,p=0,g=0,b=0,E=0,v=0,S=0,T=0,L=0,x=0,w=0,I=0;l.sort(r2);for(let U=0,G=l.length;U<G;U++){const P=l[U],$=P.color,Z=P.intensity,V=P.distance;let se=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===1030?se=P.shadow.map.texture:se=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=$.r*Z,u+=$.g*Z,f+=$.b*Z;else if(P.isLightProbe){for(let K=0;K<9;K++)i.probe[K].addScaledVector(P.sh.coefficients[K],Z);I++}else if(P.isSunLight){const K=e.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const ne=P.shadow,he=t.get(P);he.shadowIntensity=ne.intensity,he.shadowBias=ne.bias,he.shadowNormalBias=ne.normalBias,he.shadowRadius=ne.radius,he.shadowMapSize.copy(ne.mapSize).multiply(ne.getFrameExtents()),i.sunShadow[m]=he,i.sunShadowMap[m]=se;const Be=ne.getViewportCount();for(let Oe=0;Oe<Be;Oe++)i.sunShadowMatrix[_+Oe]=ne.getMatrix(Oe),i.sunShadowCascade[_+Oe]=ne._cascadeData[Oe];_+=Be,m++}i.sun[d]=K,d++}else if(P.isDirectionalLight){const K=e.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const ne=P.shadow,he=t.get(P);he.shadowIntensity=ne.intensity,he.shadowBias=ne.bias,he.shadowNormalBias=ne.normalBias,he.shadowRadius=ne.radius,he.shadowMapSize=ne.mapSize,i.directionalShadow[p]=he,i.directionalShadowMap[p]=se,i.directionalShadowMatrix[p]=P.shadow.matrix,S++}i.directional[p]=K,p++}else if(P.isSpotLight){const K=e.get(P);K.position.setFromMatrixPosition(P.matrixWorld),K.color.copy($).multiplyScalar(Z),K.distance=V,K.coneCos=Math.cos(P.angle),K.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),K.decay=P.decay,i.spot[b]=K;const ne=P.shadow;if(P.map&&(i.spotLightMap[x]=P.map,x++,ne.updateMatrices(P),P.castShadow&&w++),i.spotLightMatrix[b]=ne.matrix,P.castShadow){const he=t.get(P);he.shadowIntensity=ne.intensity,he.shadowBias=ne.bias,he.shadowNormalBias=ne.normalBias,he.shadowRadius=ne.radius,he.shadowMapSize=ne.mapSize,i.spotShadow[b]=he,i.spotShadowMap[b]=se,L++}b++}else if(P.isRectAreaLight){const K=e.get(P);K.color.copy($).multiplyScalar(Z),K.halfWidth.set(P.width*.5,0,0),K.halfHeight.set(0,P.height*.5,0),i.rectArea[E]=K,E++}else if(P.isPointLight){const K=e.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity),K.distance=P.distance,K.decay=P.decay,P.castShadow){const ne=P.shadow,he=t.get(P);he.shadowIntensity=ne.intensity,he.shadowBias=ne.bias,he.shadowNormalBias=ne.normalBias,he.shadowRadius=ne.radius,he.shadowMapSize=ne.mapSize,he.shadowCameraNear=ne.camera.near,he.shadowCameraFar=ne.camera.far,i.pointShadow[g]=he,i.pointShadowMap[g]=se,i.pointShadowMatrix[g]=P.shadow.matrix,T++}i.point[g]=K,g++}else if(P.isHemisphereLight){const K=e.get(P);K.skyColor.copy(P.color).multiplyScalar(Z),K.groundColor.copy(P.groundColor).multiplyScalar(Z),i.hemi[v]=K,v++}}E>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ce.LTC_FLOAT_1,i.rectAreaLTC2=Ce.LTC_FLOAT_2):(i.rectAreaLTC1=Ce.LTC_HALF_1,i.rectAreaLTC2=Ce.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const O=i.hash;(O.sunLength!==d||O.directionalLength!==p||O.pointLength!==g||O.spotLength!==b||O.rectAreaLength!==E||O.hemiLength!==v||O.numSunShadows!==m||O.numDirectionalShadows!==S||O.numPointShadows!==T||O.numSpotShadows!==L||O.numSpotMaps!==x||O.numLightProbes!==I)&&(i.sun.length=d,i.directional.length=p,i.spot.length=b,i.rectArea.length=E,i.point.length=g,i.hemi.length=v,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=L,i.spotShadowMap.length=L,i.spotLightMatrix.length=L+x-w,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=I,O.sunLength=d,O.directionalLength=p,O.pointLength=g,O.spotLength=b,O.rectAreaLength=E,O.hemiLength=v,O.numSunShadows=m,O.numDirectionalShadows=S,O.numPointShadows=T,O.numSpotShadows=L,O.numSpotMaps=x,O.numLightProbes=I,i.version=s2++)}function c(l,h){let u=0,f=0,d=0,m=0,_=0,p=0;const g=h.matrixWorldInverse;for(let b=0,E=l.length;b<E;b++){const v=l[b];if(v.isSunLight){const S=i.sun[u];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(g),u++}else if(v.isDirectionalLight){const S=i.directional[f];S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(g),f++}else if(v.isSpotLight){const S=i.spot[m];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(g),m++}else if(v.isRectAreaLight){const S=i.rectArea[_];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(g),o.identity(),r.copy(v.matrixWorld),r.premultiply(g),o.extractRotation(r),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),_++}else if(v.isPointLight){const S=i.point[d];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(g),d++}else if(v.isHemisphereLight){const S=i.hemi[p];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(g),p++}}}return{setup:a,setupView:c,state:i}}function Ah(n){const e=new a2(n),t=[],i=[],s=[];function r(f){u.camera=f,t.length=0,i.length=0,s.length=0}function o(f){t.push(f)}function a(f){i.push(f)}function c(f){s.push(f)}function l(){e.setup(t)}function h(f){e.setupView(t,f)}const u={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}function o2(n){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new Ah(n),e.set(s,[a])):r>=o.length?(a=new Ah(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const l2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,c2=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,h2=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],f2=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],Rh=new mn,Kr=new z,ol=new z;function u2(n,e,t){let i=new jl;const s=new st,r=new st,o=new pn,a=new pu,c=new mu,l={},h=t.maxTextureSize,u={0:1,1:0,2:2},f=new oi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new st},radius:{value:4}},vertexShader:l2,fragmentShader:c2}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const m=new Mi;m.setAttribute("position",new Bi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new tn(m,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let g=this.type;this.render=function(T,L,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;this.type===2&&(it("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=1);const w=n.getRenderTarget(),I=n.getActiveCubeFace(),O=n.getActiveMipmapLevel(),U=n.state;U.setBlending(0),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const G=g!==this.type;G&&L.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach($=>$.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,$=T.length;P<$;P++){const Z=T[P],V=Z.shadow;if(V===void 0){it("WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const se=V.getFrameExtents();s.multiply(se),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/se.x),s.x=r.x*se.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/se.y),s.y=r.y*se.y,V.mapSize.y=r.y));const K=n.state.buffers.depth.getReversed();if(V.camera._reversedDepth=K,V.map===null||G===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===3){if(Z.isPointLight){it("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new ri(s.x,s.y,{format:1030,type:1016,minFilter:1006,magFilter:1006,generateMipmaps:!1}),V.map.texture.name=Z.name+".shadowMap",V.map.depthTexture=new Sr(s.x,s.y,1015),V.map.depthTexture.name=Z.name+".shadowMapDepth",V.map.depthTexture.format=1026,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=1003,V.map.depthTexture.magFilter=1003}else Z.isPointLight?(V.map=new Cf(s.x),V.map.depthTexture=new hu(s.x,1014)):(V.map=new ri(s.x,s.y),V.map.depthTexture=new Sr(s.x,s.y,1014)),V.map.depthTexture.name=Z.name+".shadowMap",V.map.depthTexture.format=1026,this.type===1?(V.map.depthTexture.compareFunction=K?518:515,V.map.depthTexture.minFilter=1006,V.map.depthTexture.magFilter=1006):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=1003,V.map.depthTexture.magFilter=1003);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==s.x||V.map.height!==s.y)&&V.map.setSize(s.x,s.y);const ne=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();Z.isPointLight!==!0&&V.updateMatrices(Z,x);for(let he=0;he<ne;he++){const Be=V.getCamera(he);if(Z.isPointLight){const Oe=V.camera,me=V.matrix,Ae=Z.distance||Oe.far;Ae!==Oe.far&&(Oe.far=Ae,Oe.updateProjectionMatrix()),Kr.setFromMatrixPosition(Z.matrixWorld),Oe.position.copy(Kr),ol.copy(Oe.position),ol.add(h2[he]),Oe.up.copy(f2[he]),Oe.lookAt(ol),Oe.updateMatrixWorld(),me.makeTranslation(-Kr.x,-Kr.y,-Kr.z),Rh.multiplyMatrices(Oe.projectionMatrix,Oe.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Rh,Oe.coordinateSystem,Oe.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)n.setRenderTarget(V.map,he),n.clear();else{he===0&&(n.setRenderTarget(V.map),n.clear());const Oe=V.getViewport(he);o.set(r.x*Oe.x,r.y*Oe.y,r.x*Oe.z,r.y*Oe.w),U.viewport(o)}i=V.getFrustum(he),v(L,x,Be,Z,this.type)}V.isPointLightShadow!==!0&&this.type===3&&b(V,x),V.needsUpdate=!1}g=this.type,p.needsUpdate=!1,n.setRenderTarget(w,I,O)};function b(T,L){const x=e.update(_);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null?T.mapPass=new ri(s.x,s.y,{format:1030,type:1016}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),f.uniforms.shadow_pass.value=T.map.depthTexture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(L,null,x,f,_,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(L,null,x,d,_,null)}function E(T,L,x,w){let I=null;const O=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(O!==void 0)I=O;else if(I=x.isPointLight===!0?c:a,n.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){const U=I.uuid,G=L.uuid;let P=l[U];P===void 0&&(P={},l[U]=P);let $=P[G];$===void 0&&($=I.clone(),P[G]=$,L.addEventListener("dispose",S)),I=$}if(I.visible=L.visible,I.wireframe=L.wireframe,w===3?I.side=L.shadowSide!==null?L.shadowSide:L.side:I.side=L.shadowSide!==null?L.shadowSide:u[L.side],I.alphaMap=L.alphaMap,I.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,I.map=L.map,I.clipShadows=L.clipShadows,I.clippingPlanes=L.clippingPlanes,I.clipIntersection=L.clipIntersection,I.displacementMap=L.displacementMap,I.displacementScale=L.displacementScale,I.displacementBias=L.displacementBias,I.wireframeLinewidth=L.wireframeLinewidth,I.linewidth=L.linewidth,x.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const U=n.properties.get(I);U.light=x}return I}function v(T,L,x,w,I){if(T.visible===!1)return;if(T.layers.test(L.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&I===3)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);const G=e.update(T),P=T.material;if(Array.isArray(P)){const $=G.groups;for(let Z=0,V=$.length;Z<V;Z++){const se=$[Z],K=P[se.materialIndex];if(K&&K.visible){const ne=E(T,K,w,I);T.onBeforeShadow(n,T,L,x,G,ne,se),n.renderBufferDirect(x,null,G,ne,T,se),T.onAfterShadow(n,T,L,x,G,ne,se)}}}else if(P.visible){const $=E(T,P,w,I);T.onBeforeShadow(n,T,L,x,G,$,null),n.renderBufferDirect(x,null,G,$,T,null),T.onAfterShadow(n,T,L,x,G,$,null)}}const U=T.children;for(let G=0,P=U.length;G<P;G++)v(U[G],L,x,w,I)}function S(T){T.target.removeEventListener("dispose",S);for(const x in l){const w=l[x],I=T.target.uuid;I in w&&(w[I].dispose(),delete w[I])}}}function d2(n,e){function t(){let F=!1;const Ee=new pn;let ae=null;const we=new pn(0,0,0,0);return{setMask:function(ke){ae!==ke&&!F&&(n.colorMask(ke,ke,ke,ke),ae=ke)},setLocked:function(ke){F=ke},setClear:function(ke,fe,Ze,ze,jt){jt===!0&&(ke*=ze,fe*=ze,Ze*=ze),Ee.set(ke,fe,Ze,ze),we.equals(Ee)===!1&&(n.clearColor(ke,fe,Ze,ze),we.copy(Ee))},reset:function(){F=!1,ae=null,we.set(-1,0,0,0)}}}function i(){let F=!1,Ee=!1,ae=null,we=null,ke=null;return{setReversed:function(fe){if(Ee!==fe){const Ze=e.get("EXT_clip_control");fe?Ze.clipControlEXT(Ze.LOWER_LEFT_EXT,Ze.ZERO_TO_ONE_EXT):Ze.clipControlEXT(Ze.LOWER_LEFT_EXT,Ze.NEGATIVE_ONE_TO_ONE_EXT),Ee=fe;const ze=ke;ke=null,this.setClear(ze)}},getReversed:function(){return Ee},setTest:function(fe){fe?re(n.DEPTH_TEST):Se(n.DEPTH_TEST)},setMask:function(fe){ae!==fe&&!F&&(n.depthMask(fe),ae=fe)},setFunc:function(fe){if(Ee&&(fe=N0[fe]),we!==fe){switch(fe){case 0:n.depthFunc(n.NEVER);break;case 1:n.depthFunc(n.ALWAYS);break;case 2:n.depthFunc(n.LESS);break;case 3:n.depthFunc(n.LEQUAL);break;case 4:n.depthFunc(n.EQUAL);break;case 5:n.depthFunc(n.GEQUAL);break;case 6:n.depthFunc(n.GREATER);break;case 7:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}we=fe}},setLocked:function(fe){F=fe},setClear:function(fe){ke!==fe&&(ke=fe,Ee&&(fe=1-fe),n.clearDepth(fe))},reset:function(){F=!1,ae=null,we=null,ke=null,Ee=!1}}}function s(){let F=!1,Ee=null,ae=null,we=null,ke=null,fe=null,Ze=null,ze=null,jt=null;return{setTest:function(Ot){F||(Ot?re(n.STENCIL_TEST):Se(n.STENCIL_TEST))},setMask:function(Ot){Ee!==Ot&&!F&&(n.stencilMask(Ot),Ee=Ot)},setFunc:function(Ot,vi,Li){(ae!==Ot||we!==vi||ke!==Li)&&(n.stencilFunc(Ot,vi,Li),ae=Ot,we=vi,ke=Li)},setOp:function(Ot,vi,Li){(fe!==Ot||Ze!==vi||ze!==Li)&&(n.stencilOp(Ot,vi,Li),fe=Ot,Ze=vi,ze=Li)},setLocked:function(Ot){F=Ot},setClear:function(Ot){jt!==Ot&&(n.clearStencil(Ot),jt=Ot)},reset:function(){F=!1,Ee=null,ae=null,we=null,ke=null,fe=null,Ze=null,ze=null,jt=null}}}const r=new t,o=new i,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f={},d=new WeakMap,m=[],_=null,p=!1,g=null,b=null,E=null,v=null,S=null,T=null,L=null,x=new bt(0,0,0),w=0,I=!1,O=null,U=null,G=null,P=null,$=null;const Z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,se=0;const K=n.getParameter(n.VERSION);K.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec(K)[1]),V=se>=1):K.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),V=se>=2);let ne=null,he={};const Be=n.getParameter(n.SCISSOR_BOX),Oe=n.getParameter(n.VIEWPORT),me=new pn().fromArray(Be),Ae=new pn().fromArray(Oe);function Ve(F,Ee,ae,we){const ke=new Uint8Array(4),fe=n.createTexture();n.bindTexture(F,fe),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ze=0;Ze<ae;Ze++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(Ee,0,n.RGBA,1,1,we,0,n.RGBA,n.UNSIGNED_BYTE,ke):n.texImage2D(Ee+Ze,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ke);return fe}const j={};j[n.TEXTURE_2D]=Ve(n.TEXTURE_2D,n.TEXTURE_2D,1),j[n.TEXTURE_CUBE_MAP]=Ve(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[n.TEXTURE_2D_ARRAY]=Ve(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),j[n.TEXTURE_3D]=Ve(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),re(n.DEPTH_TEST),o.setFunc(3),Ct(!1),ln(1),re(n.CULL_FACE),Nt(0);function re(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function Se(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function Je(F,Ee){return f[F]!==Ee?(n.bindFramebuffer(F,Ee),f[F]=Ee,F===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=Ee),F===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=Ee),!0):!1}function Ie(F,Ee){let ae=m,we=!1;if(F){ae=d.get(Ee),ae===void 0&&(ae=[],d.set(Ee,ae));const ke=F.textures;if(ae.length!==ke.length||ae[0]!==n.COLOR_ATTACHMENT0){for(let fe=0,Ze=ke.length;fe<Ze;fe++)ae[fe]=n.COLOR_ATTACHMENT0+fe;ae.length=ke.length,we=!0}}else ae[0]!==n.BACK&&(ae[0]=n.BACK,we=!0);we&&n.drawBuffers(ae)}function gt(F){return _!==F?(n.useProgram(F),_=F,!0):!1}const vn={100:n.FUNC_ADD,101:n.FUNC_SUBTRACT,102:n.FUNC_REVERSE_SUBTRACT};vn[103]=n.MIN,vn[104]=n.MAX;const At={200:n.ZERO,201:n.ONE,202:n.SRC_COLOR,204:n.SRC_ALPHA,210:n.SRC_ALPHA_SATURATE,208:n.DST_COLOR,206:n.DST_ALPHA,203:n.ONE_MINUS_SRC_COLOR,205:n.ONE_MINUS_SRC_ALPHA,209:n.ONE_MINUS_DST_COLOR,207:n.ONE_MINUS_DST_ALPHA,211:n.CONSTANT_COLOR,212:n.ONE_MINUS_CONSTANT_COLOR,213:n.CONSTANT_ALPHA,214:n.ONE_MINUS_CONSTANT_ALPHA};function Nt(F,Ee,ae,we,ke,fe,Ze,ze,jt,Ot){if(F===0){p===!0&&(Se(n.BLEND),p=!1);return}if(p===!1&&(re(n.BLEND),p=!0),F!==5){if(F!==g||Ot!==I){if((b!==100||S!==100)&&(n.blendEquation(n.FUNC_ADD),b=100,S=100),Ot)switch(F){case 1:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case 2:n.blendFunc(n.ONE,n.ONE);break;case 3:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case 4:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ut("WebGLState: Invalid blending: ",F);break}else switch(F){case 1:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case 2:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case 3:Ut("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:Ut("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ut("WebGLState: Invalid blending: ",F);break}E=null,v=null,T=null,L=null,x.set(0,0,0),w=0,g=F,I=Ot}return}ke=ke||Ee,fe=fe||ae,Ze=Ze||we,(Ee!==b||ke!==S)&&(n.blendEquationSeparate(vn[Ee],vn[ke]),b=Ee,S=ke),(ae!==E||we!==v||fe!==T||Ze!==L)&&(n.blendFuncSeparate(At[ae],At[we],At[fe],At[Ze]),E=ae,v=we,T=fe,L=Ze),(ze.equals(x)===!1||jt!==w)&&(n.blendColor(ze.r,ze.g,ze.b,jt),x.copy(ze),w=jt),g=F,I=!1}function Jt(F,Ee){F.side===2?Se(n.CULL_FACE):re(n.CULL_FACE);let ae=F.side===1;Ee&&(ae=!ae),Ct(ae),F.blending===1&&F.transparent===!1?Nt(0):Nt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);const we=F.stencilWrite;a.setTest(we),we&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),ei(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?re(n.SAMPLE_ALPHA_TO_COVERAGE):Se(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(F){O!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),O=F)}function ln(F){F!==0?(re(n.CULL_FACE),F!==U&&(F===1?n.cullFace(n.BACK):F===2?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Se(n.CULL_FACE),U=F}function Nn(F){F!==G&&(V&&n.lineWidth(F),G=F)}function ei(F,Ee,ae){F?(re(n.POLYGON_OFFSET_FILL),(P!==Ee||$!==ae)&&(P=Ee,$=ae,o.getReversed()&&(Ee=-Ee),n.polygonOffset(Ee,ae))):Se(n.POLYGON_OFFSET_FILL)}function hn(F){F?re(n.SCISSOR_TEST):Se(n.SCISSOR_TEST)}function En(F){F===void 0&&(F=n.TEXTURE0+Z-1),ne!==F&&(n.activeTexture(F),ne=F)}function B(F,Ee,ae){ae===void 0&&(ne===null?ae=n.TEXTURE0+Z-1:ae=ne);let we=he[ae];we===void 0&&(we={type:void 0,texture:void 0},he[ae]=we),(we.type!==F||we.texture!==Ee)&&(ne!==ae&&(n.activeTexture(ae),ne=ae),n.bindTexture(F,Ee||j[F]),we.type=F,we.texture=Ee)}function Hn(){const F=he[ne];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function zt(){try{n.compressedTexImage2D(...arguments)}catch(F){Ut("WebGLState:",F)}}function A(){try{n.compressedTexImage3D(...arguments)}catch(F){Ut("WebGLState:",F)}}function M(){try{n.texSubImage2D(...arguments)}catch(F){Ut("WebGLState:",F)}}function H(){try{n.texSubImage3D(...arguments)}catch(F){Ut("WebGLState:",F)}}function q(){try{n.compressedTexSubImage2D(...arguments)}catch(F){Ut("WebGLState:",F)}}function ee(){try{n.compressedTexSubImage3D(...arguments)}catch(F){Ut("WebGLState:",F)}}function ve(){try{n.texStorage2D(...arguments)}catch(F){Ut("WebGLState:",F)}}function ye(){try{n.texStorage3D(...arguments)}catch(F){Ut("WebGLState:",F)}}function te(){try{n.texImage2D(...arguments)}catch(F){Ut("WebGLState:",F)}}function oe(){try{n.texImage3D(...arguments)}catch(F){Ut("WebGLState:",F)}}function be(F){return u[F]!==void 0?u[F]:n.getParameter(F)}function Xe(F,Ee){u[F]!==Ee&&(n.pixelStorei(F,Ee),u[F]=Ee)}function Re(F){me.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),me.copy(F))}function Te(F){Ae.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),Ae.copy(F))}function qe(F,Ee){let ae=l.get(Ee);ae===void 0&&(ae=new WeakMap,l.set(Ee,ae));let we=ae.get(F);we===void 0&&(we=n.getUniformBlockIndex(Ee,F.name),ae.set(F,we))}function et(F,Ee){const we=l.get(Ee).get(F);c.get(Ee)!==we&&(n.uniformBlockBinding(Ee,we,F.__bindingPointIndex),c.set(Ee,we))}function ht(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},u={},ne=null,he={},f={},d=new WeakMap,m=[],_=null,p=!1,g=null,b=null,E=null,v=null,S=null,T=null,L=null,x=new bt(0,0,0),w=0,I=!1,O=null,U=null,G=null,P=null,$=null,me.set(0,0,n.canvas.width,n.canvas.height),Ae.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:re,disable:Se,bindFramebuffer:Je,drawBuffers:Ie,useProgram:gt,setBlending:Nt,setMaterial:Jt,setFlipSided:Ct,setCullFace:ln,setLineWidth:Nn,setPolygonOffset:ei,setScissorTest:hn,activeTexture:En,bindTexture:B,unbindTexture:Hn,compressedTexImage2D:zt,compressedTexImage3D:A,texImage2D:te,texImage3D:oe,pixelStorei:Xe,getParameter:be,updateUBOMapping:qe,uniformBlockBinding:et,texStorage2D:ve,texStorage3D:ye,texSubImage2D:M,texSubImage3D:H,compressedTexSubImage2D:q,compressedTexSubImage3D:ee,scissor:Re,viewport:Te,reset:ht}}function p2(n,e,t,i,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new st,h=new WeakMap,u=new Set;let f;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(A,M){return m?new OffscreenCanvas(A,M):ua("canvas")}function p(A,M,H){let q=1;const ee=zt(A);if((ee.width>H||ee.height>H)&&(q=H/Math.max(ee.width,ee.height)),q<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const ve=Math.floor(q*ee.width),ye=Math.floor(q*ee.height);f===void 0&&(f=_(ve,ye));const te=M?_(ve,ye):f;return te.width=ve,te.height=ye,te.getContext("2d").drawImage(A,0,0,ve,ye),it("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+ve+"x"+ye+")."),te}else return"data"in A&&it("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),A;return A}function g(A){return A.generateMipmaps}function b(A){n.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(A,M,H,q,ee,ve=!1){if(A!==null){if(n[A]!==void 0)return n[A];it("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ye;q&&(ye=e.get("EXT_texture_norm16"),ye||it("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let te=M;if(M===n.RED&&(H===n.FLOAT&&(te=n.R32F),H===n.HALF_FLOAT&&(te=n.R16F),H===n.UNSIGNED_BYTE&&(te=n.R8),H===n.UNSIGNED_SHORT&&ye&&(te=ye.R16_EXT),H===n.SHORT&&ye&&(te=ye.R16_SNORM_EXT)),M===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(te=n.R8UI),H===n.UNSIGNED_SHORT&&(te=n.R16UI),H===n.UNSIGNED_INT&&(te=n.R32UI),H===n.BYTE&&(te=n.R8I),H===n.SHORT&&(te=n.R16I),H===n.INT&&(te=n.R32I)),M===n.RG&&(H===n.FLOAT&&(te=n.RG32F),H===n.HALF_FLOAT&&(te=n.RG16F),H===n.UNSIGNED_BYTE&&(te=n.RG8),H===n.UNSIGNED_SHORT&&ye&&(te=ye.RG16_EXT),H===n.SHORT&&ye&&(te=ye.RG16_SNORM_EXT)),M===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(te=n.RG8UI),H===n.UNSIGNED_SHORT&&(te=n.RG16UI),H===n.UNSIGNED_INT&&(te=n.RG32UI),H===n.BYTE&&(te=n.RG8I),H===n.SHORT&&(te=n.RG16I),H===n.INT&&(te=n.RG32I)),M===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(te=n.RGB8UI),H===n.UNSIGNED_SHORT&&(te=n.RGB16UI),H===n.UNSIGNED_INT&&(te=n.RGB32UI),H===n.BYTE&&(te=n.RGB8I),H===n.SHORT&&(te=n.RGB16I),H===n.INT&&(te=n.RGB32I)),M===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(te=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(te=n.RGBA16UI),H===n.UNSIGNED_INT&&(te=n.RGBA32UI),H===n.BYTE&&(te=n.RGBA8I),H===n.SHORT&&(te=n.RGBA16I),H===n.INT&&(te=n.RGBA32I)),M===n.RGB&&(H===n.UNSIGNED_SHORT&&ye&&(te=ye.RGB16_EXT),H===n.SHORT&&ye&&(te=ye.RGB16_SNORM_EXT),H===n.UNSIGNED_INT_5_9_9_9_REV&&(te=n.RGB9_E5),H===n.UNSIGNED_INT_10F_11F_11F_REV&&(te=n.R11F_G11F_B10F)),M===n.RGBA){const oe=ve?lo:Lt.getTransfer(ee);H===n.FLOAT&&(te=n.RGBA32F),H===n.HALF_FLOAT&&(te=n.RGBA16F),H===n.UNSIGNED_BYTE&&(te=oe===$t?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT&&ye&&(te=ye.RGBA16_EXT),H===n.SHORT&&ye&&(te=ye.RGBA16_SNORM_EXT),H===n.UNSIGNED_SHORT_4_4_4_4&&(te=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(te=n.RGB5_A1)}return(te===n.R16F||te===n.R32F||te===n.RG16F||te===n.RG32F||te===n.RGBA16F||te===n.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function S(A,M){let H;return A?M===null||M===1014||M===1020?H=n.DEPTH24_STENCIL8:M===1015?H=n.DEPTH32F_STENCIL8:M===1012&&(H=n.DEPTH24_STENCIL8,it("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===1014||M===1020?H=n.DEPTH_COMPONENT24:M===1015?H=n.DEPTH_COMPONENT32F:M===1012&&(H=n.DEPTH_COMPONENT16),H}function T(A,M){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==1003&&A.minFilter!==1006?Math.log2(Math.max(M.width,M.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?M.mipmaps.length:1}function L(A){const M=A.target;M.removeEventListener("dispose",L),w(M),M.isVideoTexture&&h.delete(M),M.isHTMLTexture&&u.delete(M)}function x(A){const M=A.target;M.removeEventListener("dispose",x),O(M)}function w(A){const M=i.get(A);if(M.__webglInit===void 0)return;const H=A.source,q=d.get(H);if(q){const ee=q[M.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&I(A),Object.keys(q).length===0&&d.delete(H)}i.remove(A)}function I(A){const M=i.get(A);n.deleteTexture(M.__webglTexture);const H=A.source,q=d.get(H);delete q[M.__cacheKey],o.memory.textures--}function O(A){const M=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(M.__webglFramebuffer[q]))for(let ee=0;ee<M.__webglFramebuffer[q].length;ee++)n.deleteFramebuffer(M.__webglFramebuffer[q][ee]);else n.deleteFramebuffer(M.__webglFramebuffer[q]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[q])}else{if(Array.isArray(M.__webglFramebuffer))for(let q=0;q<M.__webglFramebuffer.length;q++)n.deleteFramebuffer(M.__webglFramebuffer[q]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let q=0;q<M.__webglColorRenderbuffer.length;q++)M.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[q]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const H=A.textures;for(let q=0,ee=H.length;q<ee;q++){const ve=i.get(H[q]);ve.__webglTexture&&(n.deleteTexture(ve.__webglTexture),o.memory.textures--),i.remove(H[q])}i.remove(A)}let U=0;function G(){U=0}function P(){return U}function $(A){U=A}function Z(){const A=U;return A>=s.maxTextures&&it("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+s.maxTextures),U+=1,A}function V(A){const M=[];return M.push(A.wrapS),M.push(A.wrapT),M.push(A.wrapR||0),M.push(A.magFilter),M.push(A.minFilter),M.push(A.anisotropy),M.push(A.internalFormat),M.push(A.format),M.push(A.type),M.push(A.generateMipmaps),M.push(A.premultiplyAlpha),M.push(A.flipY),M.push(A.unpackAlignment),M.push(A.colorSpace),M.join()}function se(A,M){const H=i.get(A);if(A.isVideoTexture&&B(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&H.__version!==A.version){const q=A.image;if(q===null)it("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)it("WebGLRenderer: Texture marked for update but image is incomplete");else{Se(H,A,M);return}}else A.isExternalTexture&&(H.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+M)}function K(A,M){const H=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&H.__version!==A.version){Se(H,A,M);return}else A.isExternalTexture&&(H.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+M)}function ne(A,M){const H=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&H.__version!==A.version){Se(H,A,M);return}t.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+M)}function he(A,M){const H=i.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&H.__version!==A.version){Je(H,A,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+M)}const Be={1e3:n.REPEAT,1001:n.CLAMP_TO_EDGE,1002:n.MIRRORED_REPEAT},Oe={1003:n.NEAREST,1004:n.NEAREST_MIPMAP_NEAREST,1005:n.NEAREST_MIPMAP_LINEAR,1006:n.LINEAR,1007:n.LINEAR_MIPMAP_NEAREST,1008:n.LINEAR_MIPMAP_LINEAR},me={512:n.NEVER,519:n.ALWAYS,513:n.LESS,515:n.LEQUAL,514:n.EQUAL,518:n.GEQUAL,516:n.GREATER,517:n.NOTEQUAL};function Ae(A,M){if(M.type===1015&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===1006||M.magFilter===1007||M.magFilter===1005||M.magFilter===1008||M.minFilter===1006||M.minFilter===1007||M.minFilter===1005||M.minFilter===1008)&&it("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,Be[M.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,Be[M.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,Be[M.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,Oe[M.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,Oe[M.minFilter]),M.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,me[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===1003||M.minFilter!==1005&&M.minFilter!==1008||M.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");n.texParameterf(A,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Ve(A,M){let H=!1;A.__webglInit===void 0&&(A.__webglInit=!0,M.addEventListener("dispose",L));const q=M.source;let ee=d.get(q);ee===void 0&&(ee={},d.set(q,ee));const ve=V(M);if(ve!==A.__cacheKey){ee[ve]===void 0&&(ee[ve]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,H=!0),ee[ve].usedTimes++;const ye=ee[A.__cacheKey];ye!==void 0&&(ee[A.__cacheKey].usedTimes--,ye.usedTimes===0&&I(M)),A.__cacheKey=ve,A.__webglTexture=ee[ve].texture}return H}function j(A,M,H){return Math.floor(Math.floor(A/H)/M)}function re(A,M,H,q){const ve=A.updateRanges;if(ve.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,H,q,M.data);else{ve.sort((Xe,Re)=>Xe.start-Re.start);let ye=0;for(let Xe=1;Xe<ve.length;Xe++){const Re=ve[ye],Te=ve[Xe],qe=Re.start+Re.count,et=j(Te.start,M.width,4),ht=j(Re.start,M.width,4);Te.start<=qe+1&&et===ht&&j(Te.start+Te.count-1,M.width,4)===et?Re.count=Math.max(Re.count,Te.start+Te.count-Re.start):(++ye,ve[ye]=Te)}ve.length=ye+1;const te=t.getParameter(n.UNPACK_ROW_LENGTH),oe=t.getParameter(n.UNPACK_SKIP_PIXELS),be=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let Xe=0,Re=ve.length;Xe<Re;Xe++){const Te=ve[Xe],qe=Math.floor(Te.start/4),et=Math.ceil(Te.count/4),ht=qe%M.width,F=Math.floor(qe/M.width),Ee=et,ae=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,ht),t.pixelStorei(n.UNPACK_SKIP_ROWS,F),t.texSubImage2D(n.TEXTURE_2D,0,ht,F,Ee,ae,H,q,M.data)}A.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,te),t.pixelStorei(n.UNPACK_SKIP_PIXELS,oe),t.pixelStorei(n.UNPACK_SKIP_ROWS,be)}}function Se(A,M,H){let q=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(q=n.TEXTURE_3D);const ee=Ve(A,M),ve=M.source;t.bindTexture(q,A.__webglTexture,n.TEXTURE0+H);const ye=i.get(ve);if(ve.version!==ye.__version||ee===!0){if(t.activeTexture(n.TEXTURE0+H),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const ae=Lt.getPrimaries(Lt.workingColorSpace),we=M.colorSpace===""?null:Lt.getPrimaries(M.colorSpace),ke=M.colorSpace===""||ae===we?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke)}t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment);let oe=p(M.image,!1,s.maxTextureSize);oe=Hn(M,oe);const be=r.convert(M.format,M.colorSpace),Xe=r.convert(M.type);let Re=v(M.internalFormat,be,Xe,M.normalized,M.colorSpace,M.isVideoTexture);Ae(q,M);let Te;const qe=M.mipmaps,et=M.isVideoTexture!==!0,ht=ye.__version===void 0||ee===!0,F=ve.dataReady,Ee=T(M,oe);if(M.isDepthTexture)Re=S(M.format===1027,M.type),ht&&(et?t.texStorage2D(n.TEXTURE_2D,1,Re,oe.width,oe.height):t.texImage2D(n.TEXTURE_2D,0,Re,oe.width,oe.height,0,be,Xe,null));else if(M.isDataTexture)if(qe.length>0){et&&ht&&t.texStorage2D(n.TEXTURE_2D,Ee,Re,qe[0].width,qe[0].height);for(let ae=0,we=qe.length;ae<we;ae++)Te=qe[ae],et?F&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,Te.width,Te.height,be,Xe,Te.data):t.texImage2D(n.TEXTURE_2D,ae,Re,Te.width,Te.height,0,be,Xe,Te.data);M.generateMipmaps=!1}else et?(ht&&t.texStorage2D(n.TEXTURE_2D,Ee,Re,oe.width,oe.height),F&&re(M,oe,be,Xe)):t.texImage2D(n.TEXTURE_2D,0,Re,oe.width,oe.height,0,be,Xe,oe.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){et&&ht&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Re,qe[0].width,qe[0].height,oe.depth);for(let ae=0,we=qe.length;ae<we;ae++)if(Te=qe[ae],M.format!==1023)if(be!==null)if(et){if(F)if(M.layerUpdates.size>0){const ke=ah(Te.width,Te.height,M.format,M.type);for(const fe of M.layerUpdates){const Ze=Te.data.subarray(fe*ke/Te.data.BYTES_PER_ELEMENT,(fe+1)*ke/Te.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,fe,Te.width,Te.height,1,be,Ze)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,Te.width,Te.height,oe.depth,be,Te.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,Re,Te.width,Te.height,oe.depth,0,Te.data,0,0);else it("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else et?F&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,Te.width,Te.height,oe.depth,be,Xe,Te.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,Re,Te.width,Te.height,oe.depth,0,be,Xe,Te.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{et&&ht&&t.texStorage2D(n.TEXTURE_2D,Ee,Re,qe[0].width,qe[0].height);for(let ae=0,we=qe.length;ae<we;ae++)Te=qe[ae],M.format!==1023?be!==null?et?F&&t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,Te.width,Te.height,be,Te.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,Re,Te.width,Te.height,0,Te.data):it("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):et?F&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,Te.width,Te.height,be,Xe,Te.data):t.texImage2D(n.TEXTURE_2D,ae,Re,Te.width,Te.height,0,be,Xe,Te.data)}else if(M.isDataArrayTexture)if(et){if(ht&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Re,oe.width,oe.height,oe.depth),F)if(M.layerUpdates.size>0){const ae=ah(oe.width,oe.height,M.format,M.type);for(const we of M.layerUpdates){const ke=oe.data.subarray(we*ae/oe.data.BYTES_PER_ELEMENT,(we+1)*ae/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,we,oe.width,oe.height,1,be,Xe,ke)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,be,Xe,oe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Re,oe.width,oe.height,oe.depth,0,be,Xe,oe.data);else if(M.isData3DTexture)et?(ht&&t.texStorage3D(n.TEXTURE_3D,Ee,Re,oe.width,oe.height,oe.depth),F&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,be,Xe,oe.data)):t.texImage3D(n.TEXTURE_3D,0,Re,oe.width,oe.height,oe.depth,0,be,Xe,oe.data);else if(M.isFramebufferTexture){if(ht)if(et)t.texStorage2D(n.TEXTURE_2D,Ee,Re,oe.width,oe.height);else{let ae=oe.width,we=oe.height;for(let ke=0;ke<Ee;ke++)t.texImage2D(n.TEXTURE_2D,ke,Re,ae,we,0,be,Xe,null),ae>>=1,we>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in n){const ae=n.canvas;if(ae.hasAttribute("layoutsubtree")||ae.setAttribute("layoutsubtree","true"),oe.parentNode!==ae){ae.appendChild(oe),u.add(M),ae.onpaint=we=>{const ke=we.changedElements;for(const fe of u)ke.includes(fe.image)&&(fe.needsUpdate=!0)},ae.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,oe);else{const ke=n.RGBA,fe=n.RGBA,Ze=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,ke,fe,Ze,oe)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(qe.length>0){if(et&&ht){const ae=zt(qe[0]);t.texStorage2D(n.TEXTURE_2D,Ee,Re,ae.width,ae.height)}for(let ae=0,we=qe.length;ae<we;ae++)Te=qe[ae],et?F&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,be,Xe,Te):t.texImage2D(n.TEXTURE_2D,ae,Re,be,Xe,Te);M.generateMipmaps=!1}else if(et){if(ht){const ae=zt(oe);t.texStorage2D(n.TEXTURE_2D,Ee,Re,ae.width,ae.height)}F&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,be,Xe,oe)}else t.texImage2D(n.TEXTURE_2D,0,Re,be,Xe,oe);g(M)&&b(q),ye.__version=ve.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Je(A,M,H){if(M.image.length!==6)return;const q=Ve(A,M),ee=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+H);const ve=i.get(ee);if(ee.version!==ve.__version||q===!0){t.activeTexture(n.TEXTURE0+H);const ye=Lt.getPrimaries(Lt.workingColorSpace),te=M.colorSpace===""?null:Lt.getPrimaries(M.colorSpace),oe=M.colorSpace===""||ye===te?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe);const be=M.isCompressedTexture||M.image[0].isCompressedTexture,Xe=M.image[0]&&M.image[0].isDataTexture,Re=[];for(let fe=0;fe<6;fe++)!be&&!Xe?Re[fe]=p(M.image[fe],!0,s.maxCubemapSize):Re[fe]=Xe?M.image[fe].image:M.image[fe],Re[fe]=Hn(M,Re[fe]);const Te=Re[0],qe=r.convert(M.format,M.colorSpace),et=r.convert(M.type),ht=v(M.internalFormat,qe,et,M.normalized,M.colorSpace),F=M.isVideoTexture!==!0,Ee=ve.__version===void 0||q===!0,ae=ee.dataReady;let we=T(M,Te);Ae(n.TEXTURE_CUBE_MAP,M);let ke;if(be){F&&Ee&&t.texStorage2D(n.TEXTURE_CUBE_MAP,we,ht,Te.width,Te.height);for(let fe=0;fe<6;fe++){ke=Re[fe].mipmaps;for(let Ze=0;Ze<ke.length;Ze++){const ze=ke[Ze];M.format!==1023?qe!==null?F?ae&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ze,0,0,ze.width,ze.height,qe,ze.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ze,ht,ze.width,ze.height,0,ze.data):it("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ze,0,0,ze.width,ze.height,qe,et,ze.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ze,ht,ze.width,ze.height,0,qe,et,ze.data)}}}else{if(ke=M.mipmaps,F&&Ee){ke.length>0&&we++;const fe=zt(Re[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,we,ht,fe.width,fe.height)}for(let fe=0;fe<6;fe++)if(Xe){F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,0,0,Re[fe].width,Re[fe].height,qe,et,Re[fe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,ht,Re[fe].width,Re[fe].height,0,qe,et,Re[fe].data);for(let Ze=0;Ze<ke.length;Ze++){const jt=ke[Ze].image[fe].image;F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ze+1,0,0,jt.width,jt.height,qe,et,jt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ze+1,ht,jt.width,jt.height,0,qe,et,jt.data)}}else{F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,0,0,qe,et,Re[fe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,ht,qe,et,Re[fe]);for(let Ze=0;Ze<ke.length;Ze++){const ze=ke[Ze];F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ze+1,0,0,qe,et,ze.image[fe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ze+1,ht,qe,et,ze.image[fe])}}}g(M)&&b(n.TEXTURE_CUBE_MAP),ve.__version=ee.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Ie(A,M,H,q,ee,ve){const ye=r.convert(H.format,H.colorSpace),te=r.convert(H.type),oe=v(H.internalFormat,ye,te,H.normalized,H.colorSpace),be=i.get(M),Xe=i.get(H);if(Xe.__renderTarget=M,!be.__hasExternalTextures){const Re=Math.max(1,M.width>>ve),Te=Math.max(1,M.height>>ve);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,ve,oe,Re,Te,M.depth,0,ye,te,null):t.texImage2D(ee,ve,oe,Re,Te,0,ye,te,null)}t.bindFramebuffer(n.FRAMEBUFFER,A),En(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,ee,Xe.__webglTexture,0,hn(M)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,ee,Xe.__webglTexture,ve),t.bindFramebuffer(n.FRAMEBUFFER,null)}function gt(A,M,H){if(n.bindRenderbuffer(n.RENDERBUFFER,A),M.depthBuffer){const q=M.depthTexture,ee=q&&q.isDepthTexture?q.type:null,ve=S(M.stencilBuffer,ee),ye=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;En(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,hn(M),ve,M.width,M.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,hn(M),ve,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,ve,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ye,n.RENDERBUFFER,A)}else{const q=M.textures;for(let ee=0;ee<q.length;ee++){const ve=q[ee],ye=r.convert(ve.format,ve.colorSpace),te=r.convert(ve.type),oe=v(ve.internalFormat,ye,te,ve.normalized,ve.colorSpace);En(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,hn(M),oe,M.width,M.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,hn(M),oe,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,oe,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function vn(A,M,H){const q=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,A),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ee=i.get(M.depthTexture);if(ee.__renderTarget=M,(!ee.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),q){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,M.depthTexture.addEventListener("dispose",L)),ee.__webglTexture===void 0){ee.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),Ae(n.TEXTURE_CUBE_MAP,M.depthTexture);const be=r.convert(M.depthTexture.format),Xe=r.convert(M.depthTexture.type);let Re;M.depthTexture.format===1026?Re=n.DEPTH_COMPONENT24:M.depthTexture.format===1027&&(Re=n.DEPTH24_STENCIL8);for(let Te=0;Te<6;Te++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,Re,M.width,M.height,0,be,Xe,null)}}else se(M.depthTexture,0);const ve=ee.__webglTexture,ye=hn(M),te=q?n.TEXTURE_CUBE_MAP_POSITIVE_X+H:n.TEXTURE_2D,oe=M.depthTexture.format===1027?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(M.depthTexture.format===1026)En(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,oe,te,ve,0,ye):n.framebufferTexture2D(n.FRAMEBUFFER,oe,te,ve,0);else if(M.depthTexture.format===1027)En(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,oe,te,ve,0,ye):n.framebufferTexture2D(n.FRAMEBUFFER,oe,te,ve,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function At(A){const M=i.get(A),H=A.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==A.depthTexture){const q=A.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),q){const ee=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,q.removeEventListener("dispose",ee)};q.addEventListener("dispose",ee),M.__depthDisposeCallback=ee}M.__boundDepthTexture=q}if(A.depthTexture&&!M.__autoAllocateDepthBuffer)if(H)for(let q=0;q<6;q++)vn(M.__webglFramebuffer[q],A,q);else{const q=A.texture.mipmaps;q&&q.length>0?vn(M.__webglFramebuffer[0],A,0):vn(M.__webglFramebuffer,A,0)}else if(H){M.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[q]),M.__webglDepthbuffer[q]===void 0)M.__webglDepthbuffer[q]=n.createRenderbuffer(),gt(M.__webglDepthbuffer[q],A,!1);else{const ee=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ve=M.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,ve),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,ve)}}else{const q=A.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),gt(M.__webglDepthbuffer,A,!1);else{const ee=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ve=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ve),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,ve)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Nt(A,M,H){const q=i.get(A);M!==void 0&&Ie(q.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&At(A)}function Jt(A){const M=A.texture,H=i.get(A),q=i.get(M);A.addEventListener("dispose",x);const ee=A.textures,ve=A.isWebGLCubeRenderTarget===!0,ye=ee.length>1;if(ye||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=M.version,o.memory.textures++),ve){H.__webglFramebuffer=[];for(let te=0;te<6;te++)if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer[te]=[];for(let oe=0;oe<M.mipmaps.length;oe++)H.__webglFramebuffer[te][oe]=n.createFramebuffer()}else H.__webglFramebuffer[te]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer=[];for(let te=0;te<M.mipmaps.length;te++)H.__webglFramebuffer[te]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(ye)for(let te=0,oe=ee.length;te<oe;te++){const be=i.get(ee[te]);be.__webglTexture===void 0&&(be.__webglTexture=n.createTexture(),o.memory.textures++)}if(A.samples>0&&En(A)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let te=0;te<ee.length;te++){const oe=ee[te];H.__webglColorRenderbuffer[te]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[te]);const be=r.convert(oe.format,oe.colorSpace),Xe=r.convert(oe.type),Re=v(oe.internalFormat,be,Xe,oe.normalized,oe.colorSpace,A.isXRRenderTarget===!0),Te=hn(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,Te,Re,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+te,n.RENDERBUFFER,H.__webglColorRenderbuffer[te])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),gt(H.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ve){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),Ae(n.TEXTURE_CUBE_MAP,M);for(let te=0;te<6;te++)if(M.mipmaps&&M.mipmaps.length>0)for(let oe=0;oe<M.mipmaps.length;oe++)Ie(H.__webglFramebuffer[te][oe],A,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,oe);else Ie(H.__webglFramebuffer[te],A,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);g(M)&&b(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let te=0,oe=ee.length;te<oe;te++){const be=ee[te],Xe=i.get(be);let Re=n.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Re=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Re,Xe.__webglTexture),Ae(Re,be),Ie(H.__webglFramebuffer,A,be,n.COLOR_ATTACHMENT0+te,Re,0),g(be)&&b(Re)}t.unbindTexture()}else{let te=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(te=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(te,q.__webglTexture),Ae(te,M),M.mipmaps&&M.mipmaps.length>0)for(let oe=0;oe<M.mipmaps.length;oe++)Ie(H.__webglFramebuffer[oe],A,M,n.COLOR_ATTACHMENT0,te,oe);else Ie(H.__webglFramebuffer,A,M,n.COLOR_ATTACHMENT0,te,0);g(M)&&b(te),t.unbindTexture()}A.depthBuffer&&At(A)}function Ct(A){const M=A.textures;for(let H=0,q=M.length;H<q;H++){const ee=M[H];if(g(ee)){const ve=E(A),ye=i.get(ee).__webglTexture;t.bindTexture(ve,ye),b(ve),t.unbindTexture()}}}const ln=[],Nn=[];function ei(A){if(A.samples>0){if(En(A)===!1){const M=A.textures,H=A.width,q=A.height;let ee=n.COLOR_BUFFER_BIT;const ve=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ye=i.get(A),te=M.length>1;if(te)for(let be=0;be<M.length;be++)t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer);const oe=A.texture.mipmaps;oe&&oe.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ye.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let be=0;be<M.length;be++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),te){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ye.__webglColorRenderbuffer[be]);const Xe=i.get(M[be]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Xe,0)}n.blitFramebuffer(0,0,H,q,0,0,H,q,ee,n.NEAREST),c===!0&&(ln.length=0,Nn.length=0,ln.push(n.COLOR_ATTACHMENT0+be),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&(ln.push(ve),Nn.push(ve),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Nn)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ln))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),te)for(let be=0;be<M.length;be++){t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,ye.__webglColorRenderbuffer[be]);const Xe=i.get(M[be]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,Xe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&c){const M=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function hn(A){return Math.min(s.maxSamples,A.samples)}function En(A){const M=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function B(A){const M=o.render.frame;h.get(A)!==M&&(h.set(A,M),A.update())}function Hn(A,M){const H=A.colorSpace,q=A.format,ee=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||H!==oo&&H!==""&&(Lt.getTransfer(H)===$t?(q!==1023||ee!==1009)&&it("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ut("WebGLTextures: Unsupported texture color space:",H)),M}function zt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=Z,this.resetTextureUnits=G,this.getTextureUnits=P,this.setTextureUnits=$,this.setTexture2D=se,this.setTexture2DArray=K,this.setTexture3D=ne,this.setTextureCube=he,this.rebindTextures=Nt,this.setupRenderTarget=Jt,this.updateRenderTargetMipmap=Ct,this.updateMultisampleRenderTarget=ei,this.setupDepthRenderbuffer=At,this.setupFrameBufferTexture=Ie,this.useMultisampledRTT=En,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function m2(n,e){function t(i,s=""){let r;const o=Lt.getTransfer(s);if(i===1009)return n.UNSIGNED_BYTE;if(i===1017)return n.UNSIGNED_SHORT_4_4_4_4;if(i===1018)return n.UNSIGNED_SHORT_5_5_5_1;if(i===35902)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===35899)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===1010)return n.BYTE;if(i===1011)return n.SHORT;if(i===1012)return n.UNSIGNED_SHORT;if(i===1013)return n.INT;if(i===1014)return n.UNSIGNED_INT;if(i===1015)return n.FLOAT;if(i===1016)return n.HALF_FLOAT;if(i===1021)return n.ALPHA;if(i===1022)return n.RGB;if(i===1023)return n.RGBA;if(i===1026)return n.DEPTH_COMPONENT;if(i===1027)return n.DEPTH_STENCIL;if(i===1028)return n.RED;if(i===1029)return n.RED_INTEGER;if(i===1030)return n.RG;if(i===1031)return n.RG_INTEGER;if(i===1033)return n.RGBA_INTEGER;if(i===33776||i===33777||i===33778||i===33779)if(o===$t)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===33776)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===33777)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===33778)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===33779)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===33776)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===33777)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===33778)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===33779)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===35840||i===35841||i===35842||i===35843)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===35840)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===35841)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===35842)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===35843)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===36196||i===37492||i===37496||i===37488||i===37489||i===37490||i===37491)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===36196||i===37492)return o===$t?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===37496)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===37488)return r.COMPRESSED_R11_EAC;if(i===37489)return r.COMPRESSED_SIGNED_R11_EAC;if(i===37490)return r.COMPRESSED_RG11_EAC;if(i===37491)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===37808||i===37809||i===37810||i===37811||i===37812||i===37813||i===37814||i===37815||i===37816||i===37817||i===37818||i===37819||i===37820||i===37821)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===37808)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===37809)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===37810)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===37811)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===37812)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===37813)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===37814)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===37815)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===37816)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===37817)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===37818)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===37819)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===37820)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===37821)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===36492||i===36494||i===36495)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===36492)return o===$t?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===36494)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===36495)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===36283||i===36284||i===36285||i===36286)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===36283)return r.COMPRESSED_RED_RGTC1_EXT;if(i===36284)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===36285)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===36286)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===1020?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const g2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_2=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class M2{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Sf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new oi({vertexShader:g2,fragmentShader:_2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new tn(new Ri(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class v2 extends zs{constructor(e,t){super();const i=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,m=null;const _=typeof XRWebGLBinding<"u",p=new M2,g={},b=t.getContextAttributes();let E=null,v=null;const S=[],T=[],L=new st;let x=null,w=null;const I=new fi;I.viewport=new pn;const O=new fi;O.viewport=new pn;const U=[I,O],G=new Eu;let P=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let re=S[j];return re===void 0&&(re=new Oo,S[j]=re),re.getTargetRaySpace()},this.getControllerGrip=function(j){let re=S[j];return re===void 0&&(re=new Oo,S[j]=re),re.getGripSpace()},this.getHand=function(j){let re=S[j];return re===void 0&&(re=new Oo,S[j]=re),re.getHandSpace()};function Z(j){const re=T.indexOf(j.inputSource);if(re===-1)return;const Se=S[re];Se!==void 0&&(Se.update(j.inputSource,j.frame,l||o),Se.dispatchEvent({type:j.type,data:j.inputSource}))}function V(){s.removeEventListener("select",Z),s.removeEventListener("selectstart",Z),s.removeEventListener("selectend",Z),s.removeEventListener("squeeze",Z),s.removeEventListener("squeezestart",Z),s.removeEventListener("squeezeend",Z),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",se);for(let j=0;j<S.length;j++){const re=T[j];re!==null&&(T[j]=null,S[j].disconnect(re))}P=null,$=null,p.reset();for(const j in g)delete g[j];if(e.setRenderTarget(E),d=null,f=null,u=null,s=null,v=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(L.width,L.height,!1),w!==null){const j=w.camera;j.fov=w.fov,j.zoom=w.zoom,j.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,i.isPresenting===!0&&it("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,i.isPresenting===!0&&it("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",Z),s.addEventListener("selectstart",Z),s.addEventListener("selectend",Z),s.addEventListener("squeeze",Z),s.addEventListener("squeezestart",Z),s.addEventListener("squeezeend",Z),s.addEventListener("end",V),s.addEventListener("inputsourceschange",se),b.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(L),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,Je=null,Ie=null;b.depth&&(Ie=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=b.stencil?1027:1026,Je=b.stencil?1020:1014);const gt={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(gt),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new ri(f.textureWidth,f.textureHeight,{format:1023,type:1009,depthTexture:new Sr(f.textureWidth,f.textureHeight,Je,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{const Se={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,Se),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new ri(d.framebufferWidth,d.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Ve.setContext(s),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function se(j){for(let re=0;re<j.removed.length;re++){const Se=j.removed[re],Je=T.indexOf(Se);Je>=0&&(T[Je]=null,S[Je].disconnect(Se))}for(let re=0;re<j.added.length;re++){const Se=j.added[re];let Je=T.indexOf(Se);if(Je===-1){for(let gt=0;gt<S.length;gt++)if(gt>=T.length){T.push(Se),Je=gt;break}else if(T[gt]===null){T[gt]=Se,Je=gt;break}if(Je===-1)break}const Ie=S[Je];Ie&&Ie.connect(Se)}}const K=new z,ne=new z;function he(j,re,Se){K.setFromMatrixPosition(re.matrixWorld),ne.setFromMatrixPosition(Se.matrixWorld);const Je=K.distanceTo(ne),Ie=re.projectionMatrix.elements,gt=Se.projectionMatrix.elements,vn=Ie[14]/(Ie[10]-1),At=Ie[14]/(Ie[10]+1),Nt=(Ie[9]+1)/Ie[5],Jt=(Ie[9]-1)/Ie[5],Ct=(Ie[8]-1)/Ie[0],ln=(gt[8]+1)/gt[0],Nn=vn*Ct,ei=vn*ln,hn=Je/(-Ct+ln),En=hn*-Ct;if(re.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(En),j.translateZ(hn),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ie[10]===-1)j.projectionMatrix.copy(re.projectionMatrix),j.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const B=vn+hn,Hn=At+hn,zt=Nn-En,A=ei+(Je-En),M=Nt*At/Hn*B,H=Jt*At/Hn*B;j.projectionMatrix.makePerspective(zt,A,M,H,B,Hn),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function Be(j,re){re===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(re.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let re=j.near,Se=j.far;p.texture!==null&&(p.depthNear>0&&(re=p.depthNear),p.depthFar>0&&(Se=p.depthFar)),G.near=O.near=I.near=re,G.far=O.far=I.far=Se,(P!==G.near||$!==G.far)&&(s.updateRenderState({depthNear:G.near,depthFar:G.far}),P=G.near,$=G.far),G.layers.mask=j.layers.mask|6,I.layers.mask=G.layers.mask&-5,O.layers.mask=G.layers.mask&-3;const Je=j.parent,Ie=G.cameras;Be(G,Je);for(let gt=0;gt<Ie.length;gt++)Be(Ie[gt],Je);Ie.length===2?he(G,I,O):G.projectionMatrix.copy(I.projectionMatrix),w===null&&j.isPerspectiveCamera&&(w={camera:j,fov:j.fov,zoom:j.zoom}),Oe(j,G,Je)};function Oe(j,re,Se){Se===null?j.matrix.copy(re.matrixWorld):(j.matrix.copy(Se.matrixWorld),j.matrix.invert(),j.matrix.multiply(re.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(re.projectionMatrix),j.projectionMatrixInverse.copy(re.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Dl*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(j){c=j,f!==null&&(f.fixedFoveation=j),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=j)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(G)},this.getCameraTexture=function(j){return g[j]};let me=null;function Ae(j,re){if(h=re.getViewerPose(l||o),m=re,h!==null){const Se=h.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let Je=!1;Se.length!==G.cameras.length&&(G.cameras.length=0,Je=!0);for(let At=0;At<Se.length;At++){const Nt=Se[At];let Jt=null;if(d!==null)Jt=d.getViewport(Nt);else{const ln=u.getViewSubImage(f,Nt);Jt=ln.viewport,At===0&&(e.setRenderTargetTextures(v,ln.colorTexture,ln.depthStencilTexture),e.setRenderTarget(v))}let Ct=U[At];Ct===void 0&&(Ct=new fi,Ct.layers.enable(At),Ct.viewport=new pn,U[At]=Ct),Ct.matrix.fromArray(Nt.transform.matrix),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.projectionMatrix.fromArray(Nt.projectionMatrix),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert(),Ct.viewport.set(Jt.x,Jt.y,Jt.width,Jt.height),At===0&&(G.matrix.copy(Ct.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Je===!0&&G.cameras.push(Ct)}const Ie=s.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const At=u.getDepthInformation(Se[0]);At&&At.isValid&&At.texture&&p.init(At,s.renderState)}if(Ie&&Ie.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let At=0;At<Se.length;At++){const Nt=Se[At].camera;if(Nt){let Jt=g[Nt];Jt||(Jt=new Sf,g[Nt]=Jt);const Ct=u.getCameraImage(Nt);Jt.sourceTexture=Ct}}}}for(let Se=0;Se<S.length;Se++){const Je=T[Se],Ie=S[Se];Je!==null&&Ie!==void 0&&Ie.update(Je,re,l||o)}me&&me(j,re),re.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:re}),m=null}const Ve=new Af;Ve.setAnimationLoop(Ae),this.setAnimationLoop=function(j){me=j},this.dispose=function(){}}}const x2=new mn,kf=new ot;kf.set(-1,0,0,0,1,0,0,0,1);function y2(n,e){function t(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function i(p,g){g.color.getRGB(p.fogColor.value,bf(n)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function s(p,g,b,E,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(p,g):g.isMeshLambertMaterial?(r(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(p,g),u(p,g)):g.isMeshPhongMaterial?(r(p,g),h(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(p,g),f(p,g),g.isMeshPhysicalMaterial&&d(p,g,v)):g.isMeshMatcapMaterial?(r(p,g),m(p,g)):g.isMeshDepthMaterial?r(p,g):g.isMeshDistanceMaterial?(r(p,g),_(p,g)):g.isMeshNormalMaterial?r(p,g):g.isLineBasicMaterial?(o(p,g),g.isLineDashedMaterial&&a(p,g)):g.isPointsMaterial?c(p,g,b,E):g.isSpriteMaterial?l(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,t(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===1&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,t(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===1&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,t(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,t(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);const b=e.get(g),E=b.envMap,v=b.envMapRotation;E&&(p.envMap.value=E,p.envMapRotation.value.setFromMatrix4(x2.makeRotationFromEuler(v)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(kf),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,p.aoMapTransform))}function o(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform))}function a(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function c(p,g,b,E){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*b,p.scale.value=E*.5,g.map&&(p.map.value=g.map,t(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function l(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function u(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function f(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function d(p,g,b){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===1&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function _(p,g){const b=e.get(g).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function S2(n,e,t,i){let s={},r={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,S){const T=S.program;i.uniformBlockBinding(v,T)}function l(v,S){let T=s[v.id];T===void 0&&(p(v),T=h(v),s[v.id]=T,v.addEventListener("dispose",b));const L=S.program;i.updateUBOMapping(v,L);const x=e.render.frame;r[v.id]!==x&&(f(v),r[v.id]=x)}function h(v){const S=u();v.__bindingPointIndex=S;const T=n.createBuffer(),L=v.__size,x=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,L,x),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,T),T}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return Ut("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const S=s[v.id],T=v.uniforms,L=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let x=0,w=T.length;x<w;x++){const I=T[x];if(Array.isArray(I))for(let O=0,U=I.length;O<U;O++)d(I[O],x,O,L);else d(I,x,0,L)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(v,S,T,L){if(_(v,S,T,L)===!0){const x=v.__offset,w=v.value;if(Array.isArray(w)){let I=0;for(let O=0;O<w.length;O++){const U=w[O],G=g(U);m(U,v.__data,I),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(I+=G.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(w,v.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,x,v.__data)}}function m(v,S,T){typeof v=="number"||typeof v=="boolean"?S[0]=v:v.isMatrix3?(S[0]=v.elements[0],S[1]=v.elements[1],S[2]=v.elements[2],S[3]=0,S[4]=v.elements[3],S[5]=v.elements[4],S[6]=v.elements[5],S[7]=0,S[8]=v.elements[6],S[9]=v.elements[7],S[10]=v.elements[8],S[11]=0):ArrayBuffer.isView(v)?S.set(new v.constructor(v.buffer,v.byteOffset,S.length)):v.toArray(S,T)}function _(v,S,T,L){const x=v.value,w=S+"_"+T;if(L[w]===void 0)return typeof x=="number"||typeof x=="boolean"?L[w]=x:ArrayBuffer.isView(x)?L[w]=x.slice():L[w]=x.clone(),!0;{const I=L[w];if(typeof x=="number"||typeof x=="boolean"){if(I!==x)return L[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(I.equals(x)===!1)return I.copy(x),!0}}return!1}function p(v){const S=v.uniforms;let T=0;const L=16;for(let w=0,I=S.length;w<I;w++){const O=Array.isArray(S[w])?S[w]:[S[w]];for(let U=0,G=O.length;U<G;U++){const P=O[U],$=Array.isArray(P.value)?P.value:[P.value];for(let Z=0,V=$.length;Z<V;Z++){const se=$[Z],K=g(se),ne=T%L,he=ne%K.boundary,Be=ne+he;T+=he,Be!==0&&L-Be<K.storage&&(T+=L-Be),P.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=T,T+=K.storage}}}const x=T%L;return x>0&&(T+=L-x),v.__size=T,v.__cache={},this}function g(v){const S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?it("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(S.boundary=16,S.storage=v.byteLength):it("WebGLRenderer: Unsupported uniform value type.",v),S}function b(v){const S=v.target;S.removeEventListener("dispose",b);const T=o.indexOf(S.__bindingPointIndex);o.splice(T,1),n.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function E(){for(const v in s)n.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:l,dispose:E}}const b2=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ii=null;function T2(){return Ii===null&&(Ii=new lu(b2,16,16,1030,1016),Ii.name="DFG_LUT",Ii.minFilter=1006,Ii.magFilter=1006,Ii.wrapS=1001,Ii.wrapT=1001,Ii.generateMipmaps=!1,Ii.needsUpdate=!0),Ii}class E2{constructor(e={}){const{canvas:t=k0(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:d=1009}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=o;const _=d,p=new Set([1033,1031,1029]),g=new Set([1009,1014,1012,1020,1017,1018]),b=new Uint32Array(4),E=new Int32Array(4),v=new z;let S=null,T=null;const L=[],x=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let O=!1,U=null,G=null,P=null,$=null;this._outputColorSpace=ni;let Z=0,V=0,se=null,K=-1,ne=null;const he=new pn,Be=new pn;let Oe=null;const me=new bt(0);let Ae=0,Ve=t.width,j=t.height,re=1,Se=null,Je=null;const Ie=new pn(0,0,Ve,j),gt=new pn(0,0,Ve,j);let vn=!1;const At=new jl;let Nt=!1,Jt=!1;const Ct=new mn,ln=new z,Nn=new pn,ei={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let hn=!1;function En(){return se===null?re:1}let B=i;function Hn(y,N){return t.getContext(y,N)}let zt,A,M,H,q,ee,ve,ye,te,oe,be,Xe,Re,Te,qe,et,ht,F,Ee,ae,we,ke,fe;try{const y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r186"),t.addEventListener("webglcontextlost",jt,!1),t.addEventListener("webglcontextrestored",Ot,!1),t.addEventListener("webglcontextcreationerror",vi,!1),B===null){const N="webgl2";if(B=Hn(N,y),B===null)throw Hn(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ze()}catch(y){throw t.removeEventListener("webglcontextlost",jt,!1),t.removeEventListener("webglcontextrestored",Ot,!1),t.removeEventListener("webglcontextcreationerror",vi,!1),Ut("WebGLRenderer: "+y.message),y}function Ze(){zt=new T1(B),zt.init(),we=new m2(B,zt),A=new p1(B,zt,e,we),M=new d2(B,zt),A.reversedDepthBuffer&&f&&M.buffers.depth.setReversed(!0),G=B.createFramebuffer(),P=B.createFramebuffer(),$=B.createFramebuffer(),H=new A1(B),q=new jm,ee=new p2(B,zt,M,q,A,we,H),ve=new b1(I),ye=new Cu(B),ke=new u1(B,ye),te=new E1(B,ye,H,ke),oe=new C1(B,te,ye,ke,H),F=new R1(B,A,ee),qe=new m1(q),be=new Jm(I,ve,zt,A,ke,qe),Xe=new y2(I,q),Re=new t2,Te=new o2(zt),ht=new f1(I,ve,M,oe,m,c),et=new u2(I,oe,A),fe=new S2(B,H,A,M),Ee=new d1(B,zt,H),ae=new w1(B,zt,H),H.programs=be.programs,I.capabilities=A,I.extensions=zt,I.properties=q,I.renderLists=Re,I.shadowMap=et,I.state=M,I.info=H}_!==1009&&(w=new P1(_,t.width,t.height,a,s,r));const ze=new v2(I,B);this.xr=ze,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const y=zt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=zt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return re},this.setPixelRatio=function(y){y!==void 0&&(re=y,this.setSize(Ve,j,!1))},this.getSize=function(y){return y.set(Ve,j)},this.setSize=function(y,N,J=!0){if(ze.isPresenting){it("WebGLRenderer: Can't change size while VR device is presenting.");return}Ve=y,j=N,t.width=Math.floor(y*re),t.height=Math.floor(N*re),J===!0&&(t.style.width=y+"px",t.style.height=N+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,y,N)},this.getDrawingBufferSize=function(y){return y.set(Ve*re,j*re).floor()},this.setDrawingBufferSize=function(y,N,J){Ve=y,j=N,re=J,t.width=Math.floor(y*J),t.height=Math.floor(N*J),this.setViewport(0,0,y,N)},this.setEffects=function(y){if(_===1009){Ut("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let N=0;N<y.length;N++)if(y[N].isOutputPass===!0){it("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(he)},this.getViewport=function(y){return y.copy(Ie)},this.setViewport=function(y,N,J,W){y.isVector4?Ie.set(y.x,y.y,y.z,y.w):Ie.set(y,N,J,W),M.viewport(he.copy(Ie).multiplyScalar(re).round())},this.getScissor=function(y){return y.copy(gt)},this.setScissor=function(y,N,J,W){y.isVector4?gt.set(y.x,y.y,y.z,y.w):gt.set(y,N,J,W),M.scissor(Be.copy(gt).multiplyScalar(re).round())},this.getScissorTest=function(){return vn},this.setScissorTest=function(y){M.setScissorTest(vn=y)},this.setOpaqueSort=function(y){Se=y},this.setTransparentSort=function(y){Je=y},this.getClearColor=function(y){return y.copy(ht.getClearColor())},this.setClearColor=function(){ht.setClearColor(...arguments)},this.getClearAlpha=function(){return ht.getClearAlpha()},this.setClearAlpha=function(){ht.setClearAlpha(...arguments)},this.clear=function(y=!0,N=!0,J=!0){let W=0;if(y){let X=!1;if(se!==null){const Pe=se.texture.format;X=p.has(Pe)}if(X){const Pe=se.texture.type,Fe=g.has(Pe),Le=ht.getClearColor(),$e=ht.getClearAlpha(),He=Le.r,_t=Le.g,Rt=Le.b;Fe?(b[0]=He,b[1]=_t,b[2]=Rt,b[3]=$e,B.clearBufferuiv(B.COLOR,0,b)):(E[0]=He,E[1]=_t,E[2]=Rt,E[3]=$e,B.clearBufferiv(B.COLOR,0,E))}else W|=B.COLOR_BUFFER_BIT}N&&(W|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&(W|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&B.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),U=y},this.dispose=function(){t.removeEventListener("webglcontextlost",jt,!1),t.removeEventListener("webglcontextrestored",Ot,!1),t.removeEventListener("webglcontextcreationerror",vi,!1),ht.dispose(),Re.dispose(),Te.dispose(),q.dispose(),ve.dispose(),oe.dispose(),ke.dispose(),fe.dispose(),be.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",Tc),ze.removeEventListener("sessionend",Ec),Rs.stop()};function jt(y){y.preventDefault(),co("WebGLRenderer: Context Lost."),O=!0}function Ot(){co("WebGLRenderer: Context Restored."),O=!1;const y=H.autoReset,N=et.enabled,J=et.autoUpdate,W=et.needsUpdate,X=et.type;Ze(),H.autoReset=y,et.enabled=N,et.autoUpdate=J,et.needsUpdate=W,et.type=X}function vi(y){Ut("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Li(y){const N=y.target;N.removeEventListener("dispose",Li),T0(N)}function T0(y){E0(y),q.remove(y)}function E0(y){const N=q.get(y).programs;N!==void 0&&(N.forEach(function(J){be.releaseProgram(J)}),y.isShaderMaterial&&be.releaseShaderCache(y))}this.renderBufferDirect=function(y,N,J,W,X,Pe){N===null&&(N=ei);const Fe=X.isMesh&&X.matrixWorld.determinantAffine()<0,Le=R0(y,N,J,W,X);M.setMaterial(W,Fe);let $e=J.index,He=1;if(W.wireframe===!0){if($e=te.getWireframeAttribute(J),$e===void 0)return;He=2}const _t=J.drawRange,Rt=J.attributes.position;let Ge=_t.start*He,Bt=(_t.start+_t.count)*He;Pe!==null&&(Ge=Math.max(Ge,Pe.start*He),Bt=Math.min(Bt,(Pe.start+Pe.count)*He)),$e!==null?(Ge=Math.max(Ge,0),Bt=Math.min(Bt,$e.count)):Rt!=null&&(Ge=Math.max(Ge,0),Bt=Math.min(Bt,Rt.count));const wn=Bt-Ge;if(wn<0||wn===1/0)return;ke.setup(X,W,Le,J,$e);let nn,Yt=Ee;if($e!==null&&(nn=ye.get($e),Yt=ae,Yt.setIndex(nn)),X.isMesh)W.wireframe===!0?(M.setLineWidth(W.wireframeLinewidth*En()),Yt.setMode(B.LINES)):Yt.setMode(B.TRIANGLES);else if(X.isLine){let Vn=W.linewidth;Vn===void 0&&(Vn=1),M.setLineWidth(Vn*En()),X.isLineSegments?Yt.setMode(B.LINES):X.isLineLoop?Yt.setMode(B.LINE_LOOP):Yt.setMode(B.LINE_STRIP)}else X.isPoints?Yt.setMode(B.POINTS):X.isSprite&&Yt.setMode(B.TRIANGLES);if(X.isBatchedMesh)if(zt.get("WEBGL_multi_draw"))Yt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Vn=X._multiDrawStarts,Ue=X._multiDrawCounts,Kn=X._multiDrawCount,kt=$e?ye.get($e).bytesPerElement:1,di=q.get(W).currentProgram.getUniforms();for(let Pi=0;Pi<Kn;Pi++)di.setValue(B,"_gl_DrawID",Pi),Yt.render(Vn[Pi]/kt,Ue[Pi])}else if(X.isInstancedMesh)Yt.renderInstances(Ge,wn,X.count);else if(J.isInstancedBufferGeometry){const Vn=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Ue=Math.min(J.instanceCount,Vn);Yt.renderInstances(Ge,wn,Ue)}else Yt.render(Ge,wn)};function bc(y,N,J,W){U!==null&&y.isNodeMaterial&&U.setObject(W,y),Nt===!0&&qe.setState(y,J,!1),y.transparent===!0&&y.side===2&&y.forceSinglePass===!1?(y.side=1,y.needsUpdate=!0,Sa(y,N,W),y.side=0,y.needsUpdate=!0,Sa(y,N,W),y.side=2):Sa(y,N,W)}this.compile=function(y,N,J=null){J===null&&(J=y),U!==null&&U.renderStart(y,N,J),T=Te.get(J),T.init(N),x.push(T),J.traverseVisible(function(X){X.isLight&&X.layers.test(N.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),y!==J&&y.traverseVisible(function(X){X.isLight&&X.layers.test(N.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),T.setupLights(),U!==null&&U.updateLights(T.state.lightsArray),Jt=this.localClippingEnabled,Nt=qe.init(this.clippingPlanes,Jt),Nt===!0&&qe.setGlobalState(this.clippingPlanes,N),U!==null&&et.render(T.state.shadowsArray,J,N);const W=new Set;return y.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const Pe=X.material;if(Pe)if(Array.isArray(Pe))for(let Fe=0;Fe<Pe.length;Fe++){const Le=Pe[Fe];bc(Le,J,N,X),W.add(Le)}else bc(Pe,J,N,X),W.add(Pe)}),T=x.pop(),U!==null&&U.renderEnd(),W},this.compileAsync=function(y,N,J=null){const W=this.compile(y,N,J);return new Promise(X=>{function Pe(){if(W.forEach(function(Fe){const $e=q.get(Fe).currentProgram;($e===void 0||$e.isReady())&&W.delete(Fe)}),W.size===0){X(y);return}setTimeout(Pe,10)}zt.get("KHR_parallel_shader_compile")!==null?Pe():setTimeout(Pe,10)})};let Co=null;function w0(y){Co&&Co(y)}function Tc(){Rs.stop()}function Ec(){Rs.start()}const Rs=new Af;Rs.setAnimationLoop(w0),typeof self<"u"&&Rs.setContext(self),this.setAnimationLoop=function(y){Co=y,ze.setAnimationLoop(y),y===null?Rs.stop():Rs.start()},ze.addEventListener("sessionstart",Tc),ze.addEventListener("sessionend",Ec),this.render=function(y,N){if(N!==void 0&&N.isCamera!==!0){Ut("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;U!==null&&U.renderStart(y,N);const J=ze.enabled===!0&&ze.isPresenting===!0,W=w!==null&&(se===null||J)&&w.begin(I,se);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(N),N=ze.getCamera()),y.isScene===!0&&y.onBeforeRender(I,y,N,se),T=Te.get(y,x.length),T.init(N),T.state.textureUnits=ee.getTextureUnits(),x.push(T),Ct.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),At.setFromProjectionMatrix(Ct,2e3,N.reversedDepth),Jt=this.localClippingEnabled,Nt=qe.init(this.clippingPlanes,Jt),S=Re.get(y,L.length),S.init(),L.push(S),ze.enabled===!0&&ze.isPresenting===!0){const Fe=I.xr.getDepthSensingMesh();Fe!==null&&Lo(Fe,N,-1/0,I.sortObjects)}Lo(y,N,0,I.sortObjects),S.finish(),U!==null&&U.updateLights(T.state.lightsArray),I.sortObjects===!0&&S.sort(Se,Je),hn=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,hn&&ht.addToRenderList(S,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Nt===!0&&qe.beginShadows();const X=T.state.shadowsArray;if(et.render(X,y,N),Nt===!0&&qe.endShadows(),(W&&w.hasRenderPass())===!1){const Fe=S.opaque,Le=S.transmissive;if(T.setupLights(),N.isArrayCamera){const $e=N.cameras;if(Le.length>0)for(let He=0,_t=$e.length;He<_t;He++){const Rt=$e[He];Ac(Fe,Le,y,Rt)}hn&&ht.render(y);for(let He=0,_t=$e.length;He<_t;He++){const Rt=$e[He];wc(S,y,Rt,Rt.viewport)}}else Le.length>0&&Ac(Fe,Le,y,N),hn&&ht.render(y),wc(S,y,N)}se!==null&&V===0&&(ee.updateMultisampleRenderTarget(se),ee.updateRenderTargetMipmap(se)),W&&w.end(I),y.isScene===!0&&y.onAfterRender(I,y,N),ke.resetDefaultState(),K=-1,ne=null,x.pop(),x.length>0?(T=x[x.length-1],ee.setTextureUnits(T.state.textureUnits),Nt===!0&&qe.setGlobalState(I.clippingPlanes,T.state.camera)):T=null,L.pop(),L.length>0?S=L[L.length-1]:S=null,U!==null&&U.renderEnd()};function Lo(y,N,J,W){if(y.visible===!1)return;if(y.layers.test(N.layers)){if(y.isGroup)J=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(N);else if(y.isLightProbeGrid)T.pushLightProbeGrid(y);else if(y.isLight)T.pushLight(y),y.castShadow&&T.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(At)){W&&Nn.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Ct);const Fe=oe.update(y),Le=y.material;Le.visible&&S.push(y,Fe,Le,J,Nn.z,null,N)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(At))){const Fe=oe.update(y),Le=y.material;if(W&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Nn.copy(y.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),Nn.copy(Fe.boundingSphere.center)),Nn.applyMatrix4(y.matrixWorld).applyMatrix4(Ct)),Array.isArray(Le)){const $e=Fe.groups;for(let He=0,_t=$e.length;He<_t;He++){const Rt=$e[He],Ge=Le[Rt.materialIndex];Ge&&Ge.visible&&S.push(y,Fe,Ge,J,Nn.z,Rt,N)}}else Le.visible&&S.push(y,Fe,Le,J,Nn.z,null,N)}}const Pe=y.children;for(let Fe=0,Le=Pe.length;Fe<Le;Fe++)Lo(Pe[Fe],N,J,W)}function wc(y,N,J,W){const{opaque:X,transmissive:Pe,transparent:Fe}=y;T.setupLightsView(J),Nt===!0&&qe.setGlobalState(I.clippingPlanes,J),W&&M.viewport(he.copy(W)),X.length>0&&ya(X,N,J),Pe.length>0&&ya(Pe,N,J),Fe.length>0&&ya(Fe,N,J),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Ac(y,N,J,W){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[W.id]===void 0){const Ge=zt.has("EXT_color_buffer_half_float")||zt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[W.id]=new ri(1,1,{generateMipmaps:!0,type:Ge?1016:1009,minFilter:1008,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Lt.workingColorSpace})}const Pe=T.state.transmissionRenderTarget[W.id],Fe=W.viewport||he;Pe.setSize(Fe.z*I.transmissionResolutionScale,Fe.w*I.transmissionResolutionScale);const Le=I.getRenderTarget(),$e=I.getActiveCubeFace(),He=I.getActiveMipmapLevel();I.setRenderTarget(Pe),I.getClearColor(me),Ae=I.getClearAlpha(),Ae<1&&I.setClearColor(16777215,.5),I.clear(),hn&&ht.render(J);const _t=I.toneMapping;I.toneMapping=0;const Rt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),T.setupLightsView(W),Nt===!0&&qe.setGlobalState(I.clippingPlanes,W),ya(y,J,W),ee.updateMultisampleRenderTarget(Pe),ee.updateRenderTargetMipmap(Pe),zt.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let Bt=0,wn=N.length;Bt<wn;Bt++){const nn=N[Bt],{object:Yt,geometry:Vn,material:Ue,group:Kn}=nn;if(Ue.side===2&&Yt.layers.test(W.layers)){const kt=Ue.side;Ue.side=1,Ue.needsUpdate=!0,Rc(Yt,J,W,Vn,Ue,Kn),Ue.side=kt,Ue.needsUpdate=!0,Ge=!0}}Ge===!0&&(ee.updateMultisampleRenderTarget(Pe),ee.updateRenderTargetMipmap(Pe))}I.setRenderTarget(Le,$e,He),I.setClearColor(me,Ae),Rt!==void 0&&(W.viewport=Rt),I.toneMapping=_t}function ya(y,N,J){const W=N.isScene===!0?N.overrideMaterial:null;for(let X=0,Pe=y.length;X<Pe;X++){const Fe=y[X],{object:Le,geometry:$e,group:He}=Fe;let _t=Fe.material;_t.allowOverride===!0&&W!==null&&(_t=W),Le.layers.test(J.layers)&&Rc(Le,N,J,$e,_t,He)}}function Rc(y,N,J,W,X,Pe){U!==null&&X.isNodeMaterial&&U.setObject(y,X),y.onBeforeRender(I,N,J,W,X,Pe),y.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),X.onBeforeRender(I,N,J,W,y,Pe),X.transparent===!0&&X.side===2&&X.forceSinglePass===!1?(X.side=1,X.needsUpdate=!0,I.renderBufferDirect(J,N,W,X,y,Pe),X.side=0,X.needsUpdate=!0,I.renderBufferDirect(J,N,W,X,y,Pe),X.side=2):I.renderBufferDirect(J,N,W,X,y,Pe),y.onAfterRender(I,N,J,W,X,Pe)}function Sa(y,N,J){N.isScene!==!0&&(N=ei);const W=q.get(y),X=T.state.lights,Pe=T.state.shadowsArray,Fe=X.state.version,Le=be.getParameters(y,X.state,Pe,N,J,T.state.lightProbeGridArray),$e=be.getProgramCacheKey(Le);let He=W.programs;W.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?N.environment:null,W.fog=N.fog;const _t=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;W.envMap=ve.get(y.envMap||W.environment,_t),W.envMapRotation=W.environment!==null&&y.envMap===null?N.environmentRotation:y.envMapRotation,He===void 0&&(y.addEventListener("dispose",Li),He=new Map,W.programs=He);let Rt=He.get($e);if(Rt!==void 0){if(W.currentProgram===Rt&&W.lightsStateVersion===Fe)return Lc(y,Le),Rt}else Le.uniforms=be.getUniforms(y),U!==null&&y.isNodeMaterial&&U.build(y,J,Le),y.onBeforeCompile(Le,I),Rt=be.acquireProgram(Le,$e),He.set($e,Rt),W.uniforms=Le.uniforms;const Ge=W.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ge.clippingPlanes=qe.uniform),Lc(y,Le),W.needsLights=L0(y),W.lightsStateVersion=Fe,W.needsLights&&(Ge.ambientLightColor.value=X.state.ambient,Ge.lightProbe.value=X.state.probe,Ge.sunLights.value=X.state.sun,Ge.sunLightShadows.value=X.state.sunShadow,Ge.directionalLights.value=X.state.directional,Ge.directionalLightShadows.value=X.state.directionalShadow,Ge.spotLights.value=X.state.spot,Ge.spotLightShadows.value=X.state.spotShadow,Ge.rectAreaLights.value=X.state.rectArea,Ge.ltc_1.value=X.state.rectAreaLTC1,Ge.ltc_2.value=X.state.rectAreaLTC2,Ge.pointLights.value=X.state.point,Ge.pointLightShadows.value=X.state.pointShadow,Ge.hemisphereLights.value=X.state.hemi,Ge.sunShadowMatrix.value=X.state.sunShadowMatrix,Ge.sunShadowCascade.value=X.state.sunShadowCascade,Ge.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ge.spotLightMatrix.value=X.state.spotLightMatrix,Ge.spotLightMap.value=X.state.spotLightMap,Ge.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=T.state.lightProbeGridArray.length>0,W.currentProgram=Rt,W.uniformsList=null,Rt}function Cc(y){if(y.uniformsList===null){const N=y.currentProgram.getUniforms();y.uniformsList=to.seqWithValue(N.seq,y.uniforms)}return y.uniformsList}function Lc(y,N){const J=q.get(y);J.outputColorSpace=N.outputColorSpace,J.batching=N.batching,J.batchingColor=N.batchingColor,J.instancing=N.instancing,J.instancingColor=N.instancingColor,J.instancingMorph=N.instancingMorph,J.skinning=N.skinning,J.morphTargets=N.morphTargets,J.morphNormals=N.morphNormals,J.morphColors=N.morphColors,J.morphTargetsCount=N.morphTargetsCount,J.numClippingPlanes=N.numClippingPlanes,J.numIntersection=N.numClipIntersection,J.vertexAlphas=N.vertexAlphas,J.vertexTangents=N.vertexTangents,J.toneMapping=N.toneMapping}function A0(y,N){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;v.setFromMatrixPosition(N.matrixWorld);for(let J=0,W=y.length;J<W;J++){const X=y[J];if(X.texture!==null&&X.boundingBox.containsPoint(v))return X}return null}function R0(y,N,J,W,X){N.isScene!==!0&&(N=ei),ee.resetTextureUnits();const Pe=N.fog,Fe=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?N.environment:null,Le=se===null?I.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Lt.workingColorSpace,$e=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,He=ve.get(W.envMap||Fe,$e),_t=W.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Rt=!!J.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ge=!!J.morphAttributes.position,Bt=!!J.morphAttributes.normal,wn=!!J.morphAttributes.color;let nn=0;W.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(nn=I.toneMapping);const Yt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Vn=Yt!==void 0?Yt.length:0,Ue=q.get(W),Kn=T.state.lights;if(Nt===!0&&(Jt===!0||y!==ne)){const en=y===ne&&W.id===K;qe.setState(W,y,en)}let kt=!1;W.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==Kn.state.version||Ue.outputColorSpace!==Le||X.isBatchedMesh&&Ue.batching===!1||!X.isBatchedMesh&&Ue.batching===!0||X.isBatchedMesh&&Ue.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&Ue.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&Ue.instancing===!1||!X.isInstancedMesh&&Ue.instancing===!0||X.isSkinnedMesh&&Ue.skinning===!1||!X.isSkinnedMesh&&Ue.skinning===!0||X.isInstancedMesh&&Ue.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ue.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ue.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ue.instancingMorph===!1&&X.morphTexture!==null||Ue.envMap!==He||W.fog===!0&&Ue.fog!==Pe||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==qe.numPlanes||Ue.numIntersection!==qe.numIntersection)||Ue.vertexAlphas!==_t||Ue.vertexTangents!==Rt||Ue.morphTargets!==Ge||Ue.morphNormals!==Bt||Ue.morphColors!==wn||Ue.toneMapping!==nn||Ue.morphTargetsCount!==Vn||!!Ue.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(kt=!0):(kt=!0,Ue.__version=W.version);let di=Ue.currentProgram;kt===!0&&(di=Sa(W,N,X),U&&W.isNodeMaterial&&U.onUpdateProgram(W,di,Ue));let Pi=!1,is=!1,Vs=!1;const Vt=di.getUniforms(),xn=Ue.uniforms;if(M.useProgram(di.program)&&(Pi=!0,is=!0,Vs=!0),W.id!==K&&(K=W.id,is=!0),Ue.needsLights){const en=A0(T.state.lightProbeGridArray,X);Ue.lightProbeGrid!==en&&(Ue.lightProbeGrid=en,is=!0)}if(Pi||ne!==y){M.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),Vt.setValue(B,"projectionMatrix",y.projectionMatrix),Vt.setValue(B,"viewMatrix",y.matrixWorldInverse);const rs=Vt.map.cameraPosition;rs!==void 0&&rs.setValue(B,ln.setFromMatrixPosition(y.matrixWorld)),A.logarithmicDepthBuffer&&Vt.setValue(B,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Vt.setValue(B,"isOrthographic",y.isOrthographicCamera===!0),ne!==y&&(ne=y,is=!0,Vs=!0)}if(Ue.needsLights&&(Kn.state.sunShadowMap.length>0&&Vt.setValue(B,"sunShadowMap",Kn.state.sunShadowMap,ee),Kn.state.directionalShadowMap.length>0&&Vt.setValue(B,"directionalShadowMap",Kn.state.directionalShadowMap,ee),Kn.state.spotShadowMap.length>0&&Vt.setValue(B,"spotShadowMap",Kn.state.spotShadowMap,ee),Kn.state.pointShadowMap.length>0&&Vt.setValue(B,"pointShadowMap",Kn.state.pointShadowMap,ee)),X.isSkinnedMesh){Vt.setOptional(B,X,"bindMatrix"),Vt.setOptional(B,X,"bindMatrixInverse");const en=X.skeleton;en&&(en.boneTexture===null&&en.computeBoneTexture(),Vt.setValue(B,"boneTexture",en.boneTexture,ee))}X.isBatchedMesh&&(Vt.setOptional(B,X,"batchingTexture"),Vt.setValue(B,"batchingTexture",X._matricesTexture,ee),Vt.setOptional(B,X,"batchingIdTexture"),Vt.setValue(B,"batchingIdTexture",X._indirectTexture,ee),Vt.setOptional(B,X,"batchingColorTexture"),X._colorsTexture!==null&&Vt.setValue(B,"batchingColorTexture",X._colorsTexture,ee));const ss=J.morphAttributes;if((ss.position!==void 0||ss.normal!==void 0||ss.color!==void 0)&&F.update(X,J,di),(is||Ue.receiveShadow!==X.receiveShadow)&&(Ue.receiveShadow=X.receiveShadow,Vt.setValue(B,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&N.environment!==null&&(xn.envMapIntensity.value=N.environmentIntensity),xn.dfgLUT!==void 0&&(xn.dfgLUT.value=T2()),is){if(Vt.setValue(B,"toneMappingExposure",I.toneMappingExposure),Ue.needsLights&&C0(xn,Vs),Pe&&W.fog===!0&&Xe.refreshFogUniforms(xn,Pe),Xe.refreshMaterialUniforms(xn,W,re,j,T.state.transmissionRenderTarget[y.id]),Ue.needsLights&&Ue.lightProbeGrid){const en=Ue.lightProbeGrid;xn.probesSH.value=en.texture,xn.probesMin.value.copy(en.boundingBox.min),xn.probesMax.value.copy(en.boundingBox.max),xn.probesResolution.value.copy(en.resolution)}to.upload(B,Cc(Ue),xn,ee)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(to.upload(B,Cc(Ue),xn,ee),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Vt.setValue(B,"center",X.center),Vt.setValue(B,"modelViewMatrix",X.modelViewMatrix),Vt.setValue(B,"normalMatrix",X.normalMatrix),Vt.setValue(B,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){const en=W.uniformsGroups;for(let rs=0,Ws=en.length;rs<Ws;rs++){const Dc=en[rs];fe.update(Dc,di),fe.bind(Dc,di)}}return di}function C0(y,N){y.ambientLightColor.needsUpdate=N,y.lightProbe.needsUpdate=N,y.sunLights.needsUpdate=N,y.sunLightShadows.needsUpdate=N,y.directionalLights.needsUpdate=N,y.directionalLightShadows.needsUpdate=N,y.pointLights.needsUpdate=N,y.pointLightShadows.needsUpdate=N,y.spotLights.needsUpdate=N,y.spotLightShadows.needsUpdate=N,y.rectAreaLights.needsUpdate=N,y.hemisphereLights.needsUpdate=N}function L0(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return se},this.setRenderTargetTextures=function(y,N,J){const W=q.get(y);W.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),q.get(y.texture).__webglTexture=N,q.get(y.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:J,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,N){const J=q.get(y);J.__webglFramebuffer=N,J.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(y,N=0,J=0){se=y,Z=N,V=J;let W=null,X=!1,Pe=!1;if(y){const Le=q.get(y);if(Le.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(B.FRAMEBUFFER,Le.__webglFramebuffer),he.copy(y.viewport),Be.copy(y.scissor),Oe=y.scissorTest,M.viewport(he),M.scissor(Be),M.setScissorTest(Oe),K=-1;return}else if(Le.__webglFramebuffer===void 0)ee.setupRenderTarget(y);else if(Le.__hasExternalTextures)ee.rebindTextures(y,q.get(y.texture).__webglTexture,q.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const _t=y.depthTexture;if(Le.__boundDepthTexture!==_t){if(_t!==null&&q.has(_t)&&(y.width!==_t.image.width||y.height!==_t.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ee.setupDepthRenderbuffer(y)}}const $e=y.texture;($e.isData3DTexture||$e.isDataArrayTexture||$e.isCompressedArrayTexture)&&(Pe=!0);const He=q.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(He[N])?W=He[N][J]:W=He[N],X=!0):y.samples>0&&ee.useMultisampledRTT(y)===!1?W=q.get(y).__webglMultisampledFramebuffer:Array.isArray(He)?W=He[J]:W=He,he.copy(y.viewport),Be.copy(y.scissor),Oe=y.scissorTest}else he.copy(Ie).multiplyScalar(re).floor(),Be.copy(gt).multiplyScalar(re).floor(),Oe=vn;if(J!==0&&(W=G),M.bindFramebuffer(B.FRAMEBUFFER,W)&&M.drawBuffers(y,W),M.viewport(he),M.scissor(Be),M.setScissorTest(Oe),X){const Le=q.get(y.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+N,Le.__webglTexture,J)}else if(Pe){const Le=N;for(let $e=0;$e<y.textures.length;$e++){const He=q.get(y.textures[$e]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+$e,He.__webglTexture,J,Le)}}else if(y!==null&&J!==0){const Le=q.get(y.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Le.__webglTexture,J)}K=-1};function Pc(y){const N=q.get(y);return(N.__readFormat!==y.format||N.__readType!==y.type)&&(N.__readFormat=y.format,N.__readType=y.type,N.__formatReadable=A.textureFormatReadable(y.format),N.__typeReadable=A.textureTypeReadable(y.type)),N}this.readRenderTargetPixels=function(y,N,J,W,X,Pe,Fe,Le=0){if(!(y&&y.isWebGLRenderTarget)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let $e=q.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Fe!==void 0&&($e=$e[Fe]),$e){M.bindFramebuffer(B.FRAMEBUFFER,$e);try{const He=y.textures[Le],_t=He.format,Rt=He.type;y.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Le);const Ge=Pc(He);if(Ge.__formatReadable===!1){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ge.__typeReadable===!1){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=y.width-W&&J>=0&&J<=y.height-X&&B.readPixels(N,J,W,X,we.convert(_t),we.convert(Rt),Pe)}finally{const He=se!==null?q.get(se).__webglFramebuffer:null;M.bindFramebuffer(B.FRAMEBUFFER,He)}}},this.readRenderTargetPixelsAsync=async function(y,N,J,W,X,Pe,Fe,Le=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let $e=q.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Fe!==void 0&&($e=$e[Fe]),$e)if(N>=0&&N<=y.width-W&&J>=0&&J<=y.height-X){M.bindFramebuffer(B.FRAMEBUFFER,$e);const He=y.textures[Le],_t=He.format,Rt=He.type;y.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+Le);const Ge=Pc(He);if(Ge.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ge.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Bt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Bt),B.bufferData(B.PIXEL_PACK_BUFFER,Pe.byteLength,B.STREAM_READ),B.readPixels(N,J,W,X,we.convert(_t),we.convert(Rt),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);const wn=se!==null?q.get(se).__webglFramebuffer:null;M.bindFramebuffer(B.FRAMEBUFFER,wn);const nn=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await U0(B,nn,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Bt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,Pe),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(Bt),B.deleteSync(nn),Pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,N=null,J=0){const W=Math.pow(2,-J),X=Math.floor(y.image.width*W),Pe=Math.floor(y.image.height*W),Fe=N!==null?N.x:0,Le=N!==null?N.y:0;ee.setTexture2D(y,0),B.copyTexSubImage2D(B.TEXTURE_2D,J,0,0,Fe,Le,X,Pe),M.unbindTexture()},this.copyTextureToTexture=function(y,N,J=null,W=null,X=0,Pe=0){let Fe,Le,$e,He,_t,Rt,Ge,Bt,wn;const nn=y.isCompressedTexture?y.mipmaps[Pe]:y.image;if(J!==null)Fe=J.max.x-J.min.x,Le=J.max.y-J.min.y,$e=J.isBox3?J.max.z-J.min.z:1,He=J.min.x,_t=J.min.y,Rt=J.isBox3?J.min.z:0;else{const xn=Math.pow(2,-X);Fe=Math.floor(nn.width*xn),Le=Math.floor(nn.height*xn),y.isDataArrayTexture?$e=nn.depth:y.isData3DTexture?$e=Math.floor(nn.depth*xn):$e=1,He=0,_t=0,Rt=0}W!==null?(Ge=W.x,Bt=W.y,wn=W.z):(Ge=0,Bt=0,wn=0);const Yt=we.convert(N.format),Vn=we.convert(N.type);let Ue;N.isData3DTexture?(ee.setTexture3D(N,0),Ue=B.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(ee.setTexture2DArray(N,0),Ue=B.TEXTURE_2D_ARRAY):(ee.setTexture2D(N,0),Ue=B.TEXTURE_2D),M.activeTexture(B.TEXTURE0),M.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,N.flipY),M.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),M.pixelStorei(B.UNPACK_ALIGNMENT,N.unpackAlignment);const Kn=M.getParameter(B.UNPACK_ROW_LENGTH),kt=M.getParameter(B.UNPACK_IMAGE_HEIGHT),di=M.getParameter(B.UNPACK_SKIP_PIXELS),Pi=M.getParameter(B.UNPACK_SKIP_ROWS),is=M.getParameter(B.UNPACK_SKIP_IMAGES);M.pixelStorei(B.UNPACK_ROW_LENGTH,nn.width),M.pixelStorei(B.UNPACK_IMAGE_HEIGHT,nn.height),M.pixelStorei(B.UNPACK_SKIP_PIXELS,He),M.pixelStorei(B.UNPACK_SKIP_ROWS,_t),M.pixelStorei(B.UNPACK_SKIP_IMAGES,Rt);const Vs=y.isDataArrayTexture||y.isData3DTexture,Vt=N.isDataArrayTexture||N.isData3DTexture;if(y.isDepthTexture){const xn=q.get(y),ss=q.get(N),en=q.get(xn.__renderTarget),rs=q.get(ss.__renderTarget);M.bindFramebuffer(B.READ_FRAMEBUFFER,en.__webglFramebuffer),M.bindFramebuffer(B.DRAW_FRAMEBUFFER,rs.__webglFramebuffer);for(let Ws=0;Ws<$e;Ws++)Vs&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,q.get(y).__webglTexture,X,Rt+Ws),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,q.get(N).__webglTexture,Pe,wn+Ws)),B.blitFramebuffer(He,_t,Fe,Le,Ge,Bt,Fe,Le,B.DEPTH_BUFFER_BIT,B.NEAREST);M.bindFramebuffer(B.READ_FRAMEBUFFER,null),M.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(X!==0||y.isRenderTargetTexture||q.has(y)){const xn=q.get(y),ss=q.get(N);M.bindFramebuffer(B.READ_FRAMEBUFFER,P),M.bindFramebuffer(B.DRAW_FRAMEBUFFER,$);for(let en=0;en<$e;en++)Vs?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,xn.__webglTexture,X,Rt+en):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,xn.__webglTexture,X),Vt?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ss.__webglTexture,Pe,wn+en):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ss.__webglTexture,Pe),X!==0?B.blitFramebuffer(He,_t,Fe,Le,Ge,Bt,Fe,Le,B.COLOR_BUFFER_BIT,B.NEAREST):Vt?B.copyTexSubImage3D(Ue,Pe,Ge,Bt,wn+en,He,_t,Fe,Le):B.copyTexSubImage2D(Ue,Pe,Ge,Bt,He,_t,Fe,Le);M.bindFramebuffer(B.READ_FRAMEBUFFER,null),M.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else Vt?y.isDataTexture||y.isData3DTexture?B.texSubImage3D(Ue,Pe,Ge,Bt,wn,Fe,Le,$e,Yt,Vn,nn.data):N.isCompressedArrayTexture?B.compressedTexSubImage3D(Ue,Pe,Ge,Bt,wn,Fe,Le,$e,Yt,nn.data):B.texSubImage3D(Ue,Pe,Ge,Bt,wn,Fe,Le,$e,Yt,Vn,nn):y.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,Pe,Ge,Bt,Fe,Le,Yt,Vn,nn.data):y.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,Pe,Ge,Bt,nn.width,nn.height,Yt,nn.data):B.texSubImage2D(B.TEXTURE_2D,Pe,Ge,Bt,Fe,Le,Yt,Vn,nn);M.pixelStorei(B.UNPACK_ROW_LENGTH,Kn),M.pixelStorei(B.UNPACK_IMAGE_HEIGHT,kt),M.pixelStorei(B.UNPACK_SKIP_PIXELS,di),M.pixelStorei(B.UNPACK_SKIP_ROWS,Pi),M.pixelStorei(B.UNPACK_SKIP_IMAGES,is),Pe===0&&N.generateMipmaps&&B.generateMipmap(Ue),M.unbindTexture()},this.initRenderTarget=function(y){q.get(y).__webglFramebuffer===void 0&&ee.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?ee.setTextureCube(y,0):y.isData3DTexture?ee.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?ee.setTexture2DArray(y,0):ee.setTexture2D(y,0),M.unbindTexture()},this.resetState=function(){Z=0,V=0,se=null,M.reset(),ke.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Lt._getUnpackColorSpace()}}const R={ink:"#4f4557",inkSoft:"#4a4549",bark:"#b39aa8",barkDark:"#937c8b",barkLight:"#d3c2cc",gortiBark:"#b9adc9",gortiBarkDark:"#9788aa",gortiBarkLight:"#d7cfe3",violet:"#ae8fdc",violetDark:"#8d6fc2",vein:"#e4d2f8",crystalBlue:"#93b1ea",crystalBlueDark:"#7391cf",crystalBlueLight:"#c9d9f7",crystalTeal:"#8ccfc0",crystalTealDark:"#68b0a1",crystalTealLight:"#c6ede4",crystalOrange:"#f4b580",crystalOrangeDark:"#dc9563",crystalOrangeLight:"#fad8b8",ivory:"#f6ecdb",ivoryDark:"#dfcfb4",sun:"#f1be7e",sunDark:"#d99b5f",sunLight:"#f6e39a",paper:"#f3eadb",paperDark:"#dccdb1",stamp:"#d9737e",suit:"#8e97aa",suitDark:"#737c8f",suitLight:"#b0b8c8",metalDark:"#838c9b",horse:"#b597d9",horseDark:"#977abf",horseLight:"#d4c1ec",leaf:"#a6ca8a",leafDark:"#80a96b",leafLight:"#cbe3b1",sparrow:"#c99d7e",sparrowDark:"#a88062",sparrowLight:"#e2c29f",raccoon:"#aca8b4",raccoonDark:"#8c8897",raccoonLight:"#d0cdd7"};function li(n,e,t){const i=parseInt(n.slice(1),16),s=parseInt(e.slice(1),16),r=Math.round((i>>16&255)*(1-t)+(s>>16&255)*t),o=Math.round((i>>8&255)*(1-t)+(s>>8&255)*t),a=Math.round((i&255)*(1-t)+(s&255)*t);return"#"+(1<<24|r<<16|o<<8|a).toString(16).slice(1)}function Uf(n){const e=parseInt(n.slice(1),16),t=(e>>16&255)/255,i=(e>>8&255)/255,s=(e&255)/255,r=Math.max(t,i,s),o=Math.min(t,i,s),a=(r+o)/2;if(r===o)return[0,0,a];const c=r-o,l=a>.5?c/(2-r-o):c/(r+o);return[(r===t?(i-s)/c+(i<s?6:0):r===i?(s-t)/c+2:(t-i)/c+4)/6,l,a]}function Nf(n,e,t){const i=r=>{const o=(r+n*12)%12,a=e*Math.min(t,1-t);return t-a*Math.max(-1,Math.min(o-3,9-o,1))},s=r=>Math.round(Math.max(0,Math.min(1,r))*255);return"#"+(1<<24|s(i(0))<<16|s(i(8))<<8|s(i(4))).toString(16).slice(1)}const Ch=new Map;function w2(n,e=!1){const t=n.toLowerCase(),i=e?t+"+":t,s=Ch.get(i);if(s)return s;const[r,o,a]=Uf(t);let c=t;const l=o*(1-Math.abs(2*a-1)),h=(u,f)=>Nf(r,Math.min(.62,l*f/Math.max(.05,1-Math.abs(2*u-1))),u);if(a>=.17){const u=a>=.78?a:.5+(a-.17)/.61*.28;c=h(u,1.25)}else e&&t!==R.ink&&t!=="#191728"&&t!=="#000000"&&(c=h(.28+a*.9,1.6));return Ch.set(i,c),c}function Ff(n,e=!1){return n.replace(/#[0-9a-fA-F]{6}\b/g,t=>w2(t,e))}const Lh=new Map;function A2(n){const e=n.toLowerCase(),t=Lh.get(e);if(t)return t;const[i,s,r]=Uf(e),o=r<.16?e:Nf(i,s*.92,r+(.93-r)*.14);return Lh.set(e,o),o}function R2(n){return n.replace(/(fill|stop-color)="(#[0-9a-fA-F]{6})"/g,(e,t,i)=>`${t}="${A2(i)}"`).replace(/stroke="(#[0-9a-fA-F]{6})"/g,(e,t)=>`stroke="${li(t,"#3b3245",.38)}"`)}const at="#4f4557",Ci=1.5,C=1,C2="#3b3245";function L2(n){if(!/^#[0-9a-fA-F]{6}$/.test(n))return at;const e=parseInt(n.slice(1),16),t=parseInt(C2.slice(1),16),i=.58,s=r=>Math.round((e>>r&255)*(1-i)+(t>>r&255)*i);return`#${(s(16)<<16|s(8)<<8|s(0)).toString(16).padStart(6,"0")}`}const _e={periwinkle:"#97a3dc",periwinkleDeep:"#7d8bcc",sand:"#d8c09e",sandLight:"#e8d7b8",cream:"#f7eddc",blush:"#f7dbf2",pink:"#f0b2cf",pinkDeep:"#dd8db3",lilac:"#c3a3dc",lavender:"#dccdf0",mint:"#b6dcc6",aqua:"#bfdcd8",lime:"#c3dc8c",leaf:"#9cc47a",butter:"#f3e08e",apricot:"#f4b27c",stone:"#c9c7c4",night:"#3d5248"};function Q(n,e,t={}){return ue(n,{fill:e,stroke:t.stroke??Ci,ink:t.ink??at,inner:t.inner,over:t.over,opacity:t.opacity})}class an{constructor(e){Me(this,"s");this.s=e>>>0||1}next(){this.s=this.s+1831565813>>>0;let e=this.s;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+(t-e)*this.next()}int(e,t){return Math.floor(this.range(e,t+1))}pick(e){return e[Math.floor(this.next()*e.length)]}chance(e){return this.next()<e}}function bs(n){let e=2166136261;for(let t=0;t<n.length;t++)e^=n.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}const Ye=n=>(Math.round(n*100)/100).toString();function de(n,e=1,t=!0){const i=n.length;if(i<3)return lt(n,t);const s=a=>t?n[(a+i)%i]:n[Math.max(0,Math.min(i-1,a))];let r=`M${Ye(n[0][0])} ${Ye(n[0][1])}`;const o=t?i:i-1;for(let a=0;a<o;a++){const c=s(a-1),l=s(a),h=s(a+1),u=s(a+2),f=e/6,d=[l[0]+(h[0]-c[0])*f,l[1]+(h[1]-c[1])*f],m=[h[0]-(u[0]-l[0])*f,h[1]-(u[1]-l[1])*f];r+=`C${Ye(d[0])} ${Ye(d[1])} ${Ye(m[0])} ${Ye(m[1])} ${Ye(h[0])} ${Ye(h[1])}`}return t?r+"Z":r}function lt(n,e=!0){if(n.length===0)return"";let t=`M${Ye(n[0][0])} ${Ye(n[0][1])}`;for(let i=1;i<n.length;i++)t+=`L${Ye(n[i][0])} ${Ye(n[i][1])}`;return e?t+"Z":t}function wt(n){const e=n.length;let t="";for(let i=0;i<e;i++){const s=n[i],r=n[(i-1+e)%e],o=n[(i+1)%e];if(s[2])t+=(i===0?"M":"L")+`${Ye(s[0])} ${Ye(s[1])}`;else{const a=[(r[0]+s[0])/2,(r[1]+s[1])/2],c=[(o[0]+s[0])/2,(o[1]+s[1])/2];t+=(i===0?"M":"L")+`${Ye(a[0])} ${Ye(a[1])}Q${Ye(s[0])} ${Ye(s[1])} ${Ye(c[0])} ${Ye(c[1])}`}}return t+"Z"}function xe(n,e,t,i){return`M${Ye(n-t)} ${Ye(e)}A${Ye(t)} ${Ye(i)} 0 1 0 ${Ye(n+t)} ${Ye(e)}A${Ye(t)} ${Ye(i)} 0 1 0 ${Ye(n-t)} ${Ye(e)}Z`}function mt(n,e,t,i,s){const r=Math.min(s,t/2,i/2);return`M${Ye(n+r)} ${Ye(e)}H${Ye(n+t-r)}Q${Ye(n+t)} ${Ye(e)} ${Ye(n+t)} ${Ye(e+r)}V${Ye(e+i-r)}Q${Ye(n+t)} ${Ye(e+i)} ${Ye(n+t-r)} ${Ye(e+i)}H${Ye(n+r)}Q${Ye(n)} ${Ye(e+i)} ${Ye(n)} ${Ye(e+i-r)}V${Ye(e+r)}Q${Ye(n)} ${Ye(e)} ${Ye(n+r)} ${Ye(e)}Z`}function Mn(n,e,t,i,s=0){const r=e[0]-n[0],o=e[1]-n[1],a=Math.hypot(r,o)||1,c=-o/a,l=r/a,h=r/a,u=o/a,f=t/2,d=i/2,m=[(n[0]+e[0])/2,(n[1]+e[1])/2],_=(f+d)/2+s,p=[[n[0]+c*f,n[1]+l*f],[m[0]+c*_,m[1]+l*_],[e[0]+c*d,e[1]+l*d],[e[0]+h*d*.9,e[1]+u*d*.9],[e[0]-c*d,e[1]-l*d],[m[0]-c*_,m[1]-l*_],[n[0]-c*f,n[1]-l*f],[n[0]-h*f*.9,n[1]-u*f*.9]];return de(p,.9)}function ce(n,e,t){const i=n.length;if(i<2)return"";const s=[],r=[];for(let m=0;m<i;m++){const _=n[Math.max(0,m-1)],p=n[Math.min(i-1,m+1)],g=p[0]-_[0],b=p[1]-_[1],E=Math.hypot(g,b)||1,v=-b/E,S=g/E,T=(e+(t-e)*(m/(i-1)))/2,L=n[m];s.push([L[0]+v*T,L[1]+S*T]),r.push([L[0]-v*T,L[1]-S*T])}const o=n[i-1],a=n[i-2],c=Math.hypot(o[0]-a[0],o[1]-a[1])||1,l=[o[0]+(o[0]-a[0])/c*t*.6,o[1]+(o[1]-a[1])/c*t*.6],h=n[0],u=n[1],f=Math.hypot(u[0]-h[0],u[1]-h[1])||1,d=[h[0]-(u[0]-h[0])/f*e*.4,h[1]-(u[1]-h[1])/f*e*.4];return de([...s,l,...r.reverse(),d],.85)}let ll=0;function nc(n="k"){return ll=(ll+1)%1e9,`${n}${ll}`}function Of(n){if(!n)return!0;const e=n.toLowerCase();return e===at||e===R.ink||e==="#191728"||e==="#1d1b1e"}function Bf(n){return n>0?n>Ci?Ci:n:0}function ue(n,e){const t=Of(e.ink)?L2(e.fill):e.ink,i=Bf(e.stroke??Ci);let s=`<g${e.opacity!==void 0?` opacity="${e.opacity}"`:""}>`;if(s+=`<path d="${n}" fill="${e.fill}"/>`,e.inner||e.over){const r=nc();s+=`<clipPath id="c${r}"><path d="${n}"/></clipPath>`,s+=`<g clip-path="url(#c${r})">${e.inner??""}${e.over??""}</g>`}return i>0&&(s+=`<path d="${n}" fill="none" stroke="${t}" stroke-width="${i}" stroke-linejoin="round" stroke-linecap="round"/>`),s+="</g>",s}function k(n,e,t,i=1){const s=Of(e),r=s?at:e,o=s?Bf(t):t;return`<path d="${n}" fill="none" stroke="${r}" stroke-width="${o}" stroke-linecap="round" stroke-linejoin="round"${i!==1?` opacity="${i}"`:""}/>`}function ge(n,e,t=1){return`<path d="${n}" fill="${e}"${t!==1?` opacity="${t}"`:""}/>`}function tt(n,e,t,i,s=.6){const r=nc("g"),o=Math.min(.32,s*.5);return`<radialGradient id="${r}"><stop offset="0" stop-color="${i}" stop-opacity="${Ye(o)}"/><stop offset="0.55" stop-color="${i}" stop-opacity="${Ye(o*.8)}"/><stop offset="1" stop-color="${i}" stop-opacity="0"/></radialGradient><circle cx="${Ye(n)}" cy="${Ye(e)}" r="${Ye(t)}" fill="url(#${r})"/>`}const Qt=(n,e,t)=>n.map(([i,s])=>[i+e,s+t]);function We(n,e,t,i={}){const r=-e.x0+5,o=-e.y0+5;return{key:n,w:Math.ceil(e.x1-e.x0+10),h:Math.ceil(e.y1-e.y0+10),px:r,py:o,body:t(r,o),...i}}function le(n,e=C,t=at,i=1){return`<path d="${n}" fill="none" stroke="${t}" stroke-width="${e}" stroke-linecap="round" stroke-linejoin="round"${i!==1?` opacity="${i}"`:""}/>`}function ws(n,e,t=1){return`<path d="${n}" fill="${e}"${t!==1?` opacity="${t}"`:""}/>`}const Ke=n=>de(n,1,!1);function Ph(n,e,t,i){const s=e[0]-n[0],r=e[1]-n[1],o=Math.hypot(s,r)||1;return[n[0]+s*t-r/o*i,n[1]+r*t+s/o*i]}function da(n,e,t,i,s={}){const r=new an(i),o=s.n??3,a=s.color??at,c=s.width??C*.85;let l="";for(let h=0;h<o;h++){const u=o===1?0:(h/(o-1)-.5)*t*.55,f=.08+r.range(0,.25),d=Math.min(.95,f+r.range(.35,.6)),m=[],_=4;for(let p=0;p<=_;p++){const g=f+(d-f)*p/_;m.push(Ph(n,e,g,u+r.range(-.9,.9)))}l+=le(Ke(m),c,a)}for(let h=0;h<(s.knots??1);h++){const u=r.range(.3,.75),f=Ph(n,e,u,r.range(-t*.15,t*.15)),d=Math.max(1.1,t*.12);l+=le(`M${f[0]-d} ${f[1]}q${d} ${-d*1.4} ${d*2} 0`,c,a)}return l}function Hs(n,e,t,i,s,r,o={}){return Q(Mn(n,e,t,i,o.bulge??.4),s,{over:da(n,e,(t+i)/2,r,{n:o.lines??3})+(o.over??"")})}function vs(n,e,t,i,s={}){const r=(s.width??.38)*t,o=Math.cos(e),a=Math.sin(e),c=(p,g)=>[n[0]+p*o-g*a,n[1]+p*a+g*o],l=c(t*.12,0),h=c(t,0),u=c(t*.5,-r*1.05),f=c(t*.5,r*1.05),d=p=>`${Math.round(p[0]*100)/100} ${Math.round(p[1]*100)/100}`,m=`M${d(l)}Q${d(u)} ${d(h)}Q${d(f)} ${d(l)}Z`;let _=le(`M${d(n)}L${d(l)}`,C,at);return _+=Q(m,i,{stroke:s.stroke??C*1.1,over:s.vein===!1?"":le(`M${d(l)}L${d(c(t*.82,0))}`,C*.7)}),_}function Zn(n,e=4.5,t=2.4,i=at,s=C*.85){let r=le(Ke(n),s*.8,i),o=e/2;for(let a=0;a<n.length-1;a++){const c=n[a],l=n[a+1],h=Math.hypot(l[0]-c[0],l[1]-c[1]);if(h===0)continue;const u=-(l[1]-c[1])/h,f=(l[0]-c[0])/h;for(let d=o;d<h;d+=e){const m=d/h,_=c[0]+(l[0]-c[0])*m,p=c[1]+(l[1]-c[1])*m;r+=le(`M${_-u*t} ${p-f*t}L${_+u*t} ${p+f*t}`,s,i)}o=(o-h)%e,o<0&&(o+=e)}return r}function Ul(n,e,t,i,s,r=at,o=C*.75){const a=new an(s),c=[],l=Math.max(3,Math.round(t/2.2));for(let h=0;h<=l;h++)c.push([n+t*h/l,e+i*(.5+a.range(-.5,.5))]);return le(`M${c.map(h=>`${Math.round(h[0]*100)/100} ${Math.round(h[1]*100)/100}`).join("L")}`,o,r)}function ca(n,e,t,i,s,r,o=0){const a=Math.min(2,i/3),c=Q(`M${n+a} ${e}H${n+t-a}Q${n+t} ${e} ${n+t} ${e+a}V${e+i-a}Q${n+t} ${e+i} ${n+t-a} ${e+i}H${n+a}Q${n} ${e+i} ${n} ${e+i-a}V${e+a}Q${n} ${e} ${n+a} ${e}Z`,s,{stroke:C*1.1})+Ul(n+t*.16,e+i*.3,t*.68,i*.4,r);return o?`<g transform="rotate(${o} ${n+t/2} ${e+i/2})">${c}</g>`:c}function $f(n,e,t,i,s,r,o=C){const a=new an(r),c=Math.max(2,Math.round(t/4.5)),l=Math.max(2,Math.round(i/4.5)),h=t/c,u=i/l;let f="";for(let d=0;d<l;d++)for(let m=0;m<c;m++){const _=n+m*h,p=e+d*u,g=a.int(0,3);g===0?f+=`M${_} ${p+u*.5}H${_+h*.8}`:g===1?f+=`M${_+h*.5} ${p}V${p+u*.8}`:g===2?f+=`M${_+h*.15} ${p+u*.2}H${_+h*.8}V${p+u*.85}`:f+=`M${_+h*.2} ${p+u*.85}V${p+u*.2}H${_+h*.85}`}return le(f,o,s)}function So(n,e,t,i,s,r,o,a=.35){const c=new an(o);let l="";const h=i.length;for(let u=0;u<h;u++){const f=e+(h===1?0:(u/(h-1)-.5)*t)+c.range(-.06,.06),d=i[u],m=Math.cos(f),_=Math.sin(f),p=f+a,g=[n[0]+m*d*.55,n[1]+_*d*.55],b=[g[0]+Math.cos(p)*d*.45,g[1]+Math.sin(p)*d*.45];l+=Q(ce([n,g,b],s,.5),r,{stroke:C*1.2})}return l}function Et(n,e){const t=n.length,i=r=>(Math.round(r*100)/100).toString();let s="";for(let r=0;r<t;r++){const o=n[r],a=n[(r-1+t)%t],c=n[(r+1)%t],l=typeof e=="number"?e:e[r]??0,h=Math.hypot(o[0]-a[0],o[1]-a[1])||1,u=Math.hypot(c[0]-o[0],c[1]-o[1])||1,f=Math.min(l,h/2)/h,d=Math.min(l,u/2)/u,m=[o[0]+(a[0]-o[0])*f,o[1]+(a[1]-o[1])*f],_=[o[0]+(c[0]-o[0])*d,o[1]+(c[1]-o[1])*d];s+=`${r===0?"M":"L"}${i(m[0])} ${i(m[1])}Q${i(o[0])} ${i(o[1])} ${i(_[0])} ${i(_[1])}`}return s+"Z"}function Ns(n,e,t,i=!1){const s=`<path d="${n}" fill="${i?t.glow:"none"}" stroke="${t.glow}" stroke-width="${e*2.6}" stroke-linecap="round" stroke-linejoin="round" opacity="0.32"/>`,r=`<path d="${n}" fill="${i?t.mid:"none"}" stroke="${t.mid}" stroke-width="${e}" stroke-linecap="round" stroke-linejoin="round"/>`,o=i?"":`<path d="${n}" fill="none" stroke="${t.core}" stroke-width="${e*.38}" stroke-linecap="round" stroke-linejoin="round"/>`;return s+r+o}const P2=["","happy","sad","shut"],D2=["","smile","open","grin","grit","frown"],Gf=(n,e)=>e?`${n}.${e}`:n;function Ur(n,e,t){return P2.map(i=>We(Gf(`${n}.eye`,i),e,(s,r)=>t(i,s,r)))}function ic(n){const e=n.find(t=>t.key.endsWith(".eye"));return e?n.map(t=>t.key.endsWith(".eye.happy")?{...t,body:e.body}:t):n}function Nr(n,e,t){return D2.map(i=>We(Gf(`${n}.mouth`,i),e,(s,r)=>t(i,s,r)))}const rt=n=>(Math.round(n*100)/100).toString();function Tr(n,e,t,i,s,r){const o=r.white??"#fbf6ee",a=Math.max(1.3,s*.42);if(n==="happy")return le(`M${rt(e-i)} ${rt(t+s*.35)}Q${rt(e)} ${rt(t-s*1.5)} ${rt(e+i)} ${rt(t+s*.35)}`,a*1.15);if(n==="shut")return le(`M${rt(e-i)} ${rt(t-s*.1)}Q${rt(e)} ${rt(t+s*1)} ${rt(e+i)} ${rt(t-s*.1)}`,a);const c=`M${rt(e-i)} ${rt(t)}Q${rt(e)} ${rt(t-s*1.9)} ${rt(e+i)} ${rt(t)}Q${rt(e)} ${rt(t+s*1.7)} ${rt(e-i)} ${rt(t)}Z`,l=r.look??.25,h=s*.9;let u=r.blank?"":`<path d="${xe(e+i*l,t+s*.05,h*.92,h)}" fill="${r.iris}"/>`;r.blank||(u+=`<path d="${xe(e+i*l,t+s*.05,h*(r.pupil??.45),h*(r.pupil??.45)*1.08)}" fill="${at}"/>`);const f=r.lid??0;if(f>0||n==="sad"){const m=t-s*.95,_=s*1.8,p=m+_*(n==="sad"?Math.max(f,.2)+.42:f),g=m+_*(n==="sad"?Math.max(f-.12,.04):f),[b,E]=[e-i-2,e+i+2],[v,S]=r.outer===-1?[p,g]:[g,p];u+=`<path d="M${rt(b)} ${rt(t-s*2.5)}L${rt(E)} ${rt(t-s*2.5)}L${rt(E)} ${rt(S)}L${rt(b)} ${rt(v)}Z" fill="${r.lidFill??"#e9c7cf"}"/>`,u+=le(`M${rt(b)} ${rt(v)}L${rt(E)} ${rt(S)}`,C)}let d=Q(c,o,{stroke:C*1.25,inner:u});if(r.lash){const m=r.outer*i;d+=le(`M${rt(e+m)} ${rt(t)}l${rt(r.outer*2.2)} ${rt(-1.6)}`,C)}return d}function sc(n,e,t,i,s){const r=s.inside??"#5a2438",o=s.teeth??"#fbf6ee",a=s.line??C*1.15,c=s.sad??0,l=(h,u)=>`${rt(e+h*i)} ${rt(t+u*i)}`;switch(n){case"":return le(`M${l(-1,.1+c*.3)}Q${l(0,-.12-c*.3)} ${l(1,.08+c*.3)}`,a);case"smile":return(s.lip?Q(`M${l(-1,-.1)}Q${l(0,.9)} ${l(1,-.2)}Q${l(0,.4)} ${l(-1,-.1)}Z`,s.lip,{stroke:C}):"")+le(`M${l(-1,-.12)}Q${l(0,.75)} ${l(1,-.22)}`,a);case"open":return Q(xe(e,t+i*.1,i*.55,i*.7),r,{stroke:C*1.2,inner:`<path d="${xe(e,t+i*.62,i*.38,i*.22)}" fill="${s.lip??"#e98aa8"}"/>`});case"grin":return Q(`M${l(-1.05,-.25)}Q${l(0,1.25)} ${l(1.05,-.3)}Q${l(0,.05)} ${l(-1.05,-.25)}Z`,r,{stroke:C*1.2,inner:`<path d="M${l(-1.1,-.35)}Q${l(0,.2)} ${l(1.1,-.4)}L${l(1.1,-.9)}L${l(-1.1,-.9)}Z" fill="${o}"/>`+le(`M${l(-1.05,-.2)}Q${l(0,.2)} ${l(1.05,-.25)}`,C*.8)});case"grit":return Q(`M${l(-1,-.38)}L${l(1,-.38)}L${l(1,.38)}L${l(-1,.38)}Z`,o,{stroke:C*1.2,over:le(`M${l(-.95,0)}H${rt(e+i*.95)}M${l(-.35,-.38)}V${rt(t+i*.38)}M${l(.35,-.38)}V${rt(t+i*.38)}`,C*.8)});case"frown":return le(`M${l(-1,.4)}Q${l(0,-.45)} ${l(1,.35)}`,a)}}function Er(n,e,t,i,s={}){const r=t/2,o=s.sad??0;return We(n,{x0:-r-2,y0:-i-3,x1:r+2,y1:i+3},(a,c)=>{const l=[[-r,.6+o*.4],[-r*.2,-.7],[r*.5,-.5-o*.8],[r,.3-o*1.2]],h=Qt(l,a,c),u=h.map(([m,_],p)=>[m,_-i*(.35+.65*(p/3))/2]),f=h.map(([m,_],p)=>[m,_+i*(.35+.65*(p/3))/2]).reverse(),d=`${Ke(u)}L${f.map(([m,_])=>`${rt(m)} ${rt(_)}`).join("L")}Z`;return Q(d,e,{stroke:s.stroke??C*1.1})})}const I2=["idle","walk","run","rise","fall","land","interact","reach","song","breath","transform","hurt","collapse","push","sit","kneel","shout"];function As(n,e,t,i=!1,s){const r=(l,h)=>t.parts?.[l]??`${e}.${h}`,o=[{id:"root",parent:null,x:0,y:0,z:0},{id:"hips",parent:"root",x:0,y:-t.hip,z:0},{id:"torso",parent:"hips",x:0,y:0,part:r("torso","torso"),z:50},{id:"head",parent:"torso",x:t.headX,y:-t.torso,part:r("head","head"),z:60},{id:"armR",parent:"torso",x:t.shoulderX,y:-t.shoulderY,part:r("armR","arm"),side:"R",z:70},{id:"foreR",parent:"armR",x:0,y:t.upper,part:r("foreR","fore"),side:"R",z:71},{id:"armL",parent:"torso",x:t.shoulderX*(t.farShoulder??-.4),y:-t.shoulderY-1,part:r("armL","arm"),side:"L",z:70},{id:"foreL",parent:"armL",x:0,y:t.upper,part:r("foreL","fore"),side:"L",z:71},{id:"legR",parent:"hips",x:t.hipX,y:-1,part:r("legR","thigh"),side:"R",z:40},{id:"shinR",parent:"legR",x:0,y:t.thigh,part:r("shinR","shin"),side:"R",z:41},{id:"footR",parent:"shinR",x:0,y:t.shin,part:r("footR","foot"),side:"R",z:42},{id:"legL",parent:"hips",x:-t.hipX,y:-1,part:r("legL","thigh"),side:"L",z:40},{id:"shinL",parent:"legL",x:0,y:t.thigh,part:r("shinL","shin"),side:"L",z:41},{id:"footL",parent:"shinL",x:0,y:t.shin,part:r("footL","foot"),side:"L",z:42}],a=t.watch??(i?{part:"gorti.watch",side:"L",at:t.shin-4}:null);a&&o.push({id:"watch",parent:`shin${a.side}`,x:0,y:a.at,part:a.part,side:a.side,z:43}),t.brow&&t.eye&&o.push({id:"browN",parent:"head",x:t.eye[0]+t.brow.dx,y:t.eye[1]-t.brow.up,part:t.brow.part,z:66}),t.face&&t.eye&&(o.push({id:"eyeN",parent:"head",x:t.eye[0],y:t.eye[1],part:`${t.face.eye}.eye`,z:64}),o.push({id:"mouth",parent:"head",x:t.face.mouthAt[0],y:t.face.mouthAt[1],part:`${t.face.mouth}.mouth`,z:63}));for(const l of t.hair??[])o.push({id:l.id,parent:"head",x:l.at[0],y:l.at[1],part:l.part,z:l.z,spring:{k:l.k??170,c:l.c??6.5,lag:.7,gain:.0045,tip:l.tip}});for(const l of t.extra??[])o.push({...l});const c=t.hand??30;return{id:n,joints:o,attach:{handR:{joint:"foreR",x:0,y:c},handL:{joint:"foreL",x:0,y:c},chest:{joint:"torso",x:2,y:-Math.round(t.shoulderY*.7)},eye:{joint:"head",x:t.eye?.[0]??8,y:t.eye?.[1]??-20},ankleL:{joint:"shinL",x:0,y:t.shin-4}},animations:[...I2]}}const fn={body:"#bdcb9e",root:"#9c8461",rootDark:"#7c6649",box:"#baa97f",boxSide:"#9e8e66",bezel:"#8e7f5c",screen:"#4c2245",glow:"#ff5db6",neon:"#ff9ad6",core:"#ffe4f4"},Fs={glow:fn.glow,mid:fn.neon,core:fn.core},k2={hip:42,thigh:19,shin:19,torso:33,shoulderY:27,shoulderX:3,upper:15,hipX:5,headX:1,hand:20,eye:[8,-32],brow:{part:"gorti.child.brow",up:8.5,dx:-7.5},face:{eye:"gorti.child",mouth:"gorti.child",mouthAt:[10,-19]}};function U2(){return We("gorti.child.head",{x0:-29,y0:-62,x1:33,y1:4},(n,e)=>{const t=c=>Qt(c,n,e);let i=Q(Mn([n,e+3],[n+1,e-8],9,8,.2),fn.root,{over:le(`M${n-1} ${e+1}l1 -7`,C*.8)});const s=[[-27,-53],[-18,-60],[25,-60],[31,-54],[31,-9],[26,-3],[-16,-3],[-27,-8]],r=ws(`M${n-32} ${e-64}L${n-16} ${e-64}L${n-16} ${e+2}L${n-32} ${e+2}Z`,fn.boxSide)+le(`M${n-16} ${e-59}L${n-16} ${e-4}`,C)+`<circle cx="${n-22}" cy="${e-49}" r="1.6" fill="${fn.bezel}" stroke="${at}" stroke-width="${C*.8}"/><circle cx="${n-22}" cy="${e-13}" r="1.6" fill="${fn.bezel}" stroke="${at}" stroke-width="${C*.8}"/>`+le(`M${n-24} ${e-34}q2 3 0 7`,C*.8)+le(`M${n-4} ${e-60}l1 3M${n+11} ${e-60}l-1 3`,C*.9);i+=Q(Et(t(s),[6,7,7,6,6,6,6,6]),fn.box,{inner:r}),i+=Q(Et(t([[-12,-55],[28,-55],[28,-8],[-12,-8]]),6),fn.bezel,{stroke:C*1.2});let o="";for(let c=-4;c<=24;c+=5.4)o+=`M${n+c} ${e-53}V${e-10}`;for(let c=-48;c<=-12;c+=5.4)o+=`M${n-10} ${e+c}H${n+27}`;const a=`<radialGradient id="cgscr"><stop offset="0" stop-color="${fn.glow}" stop-opacity="0.45"/><stop offset="1" stop-color="${fn.glow}" stop-opacity="0"/></radialGradient><ellipse cx="${n+8}" cy="${e-31}" rx="26" ry="25" fill="url(#cgscr)"/>`+le(o,.7,fn.neon,.28)+Ns(Ke(t([[-7,-49],[-4,-51],[-4,-47],[-1,-49]])),.9,Fs)+Ns(Ke(t([[18,-14],[21,-16],[21,-12],[24,-14]])),.9,Fs)+`<path d="${Et(t([[-8,-51],[25,-51],[25,-11],[-8,-11]]),4)}" fill="none" stroke="${fn.glow}" stroke-width="2.4" opacity="0.35"/>`;return i+=Q(Et(t([[-9,-52],[25,-52],[25,-11],[-9,-11]]),5),fn.screen,{stroke:C*1.3,inner:a}),i})}function N2(){const n=[{x:-7.5,w:6.4,h:8,outer:-1},{x:7.5,w:5.4,h:7.4,outer:1}];return ic(Ur("gorti.child",{x0:-14,y0:-9,x1:14,y1:9},(e,t,i)=>n.map(s=>{const r=t+s.x,o=i,a=s.w/2,c=s.h/2;if(e==="happy")return Ns(`M${r-a} ${o+c*.5}L${r} ${o-c*.6}L${r+a} ${o+c*.5}`,1.9,Fs);if(e==="shut"){const l=s.outer===-1?`M${r-a} ${o-c*.6}L${r+a*.8} ${o}L${r-a} ${o+c*.6}`:`M${r+a} ${o-c*.6}L${r-a*.8} ${o}L${r+a} ${o+c*.6}`;return Ns(l,1.8,Fs)}if(e==="sad"){const l=o-c*.1,h=o-c,[u,f]=s.outer===-1?[l,h]:[h,l];return Ns(`M${r-a} ${u}L${r+a} ${f}L${r+a} ${o+c}L${r-a} ${o+c}Z`,1.1,Fs,!0)}return Ns(Et([[r-a,o-c],[r+a,o-c],[r+a,o+c],[r-a,o+c]],1.6),1.1,Fs,!0)}).join("")))}function F2(){return Nr("gorti.child",{x0:-4,y0:-4,x1:4,y1:4},()=>"")}function O2(){return We("gorti.child.brow",{x0:-7,y0:-4,x1:7,y1:4},(n,e)=>Ns(`M${n-4.5} ${e+.6}L${n+4.5} ${e-.4}`,1.9,Fs))}function B2(){return We("gorti.child.torso",{x0:-19,y0:-38,x1:19,y1:8},(n,e)=>{const t=r=>Qt(r,n,e),i=[[-13,6],[-16.5,-4],[-16.5,-16],[-15,-26],[-9,-32.5],[2,-35],[11,-32],[16,-25],[17,-12],[15.5,-2],[13,6]],s=ws(`M${n-18} ${e-7}Q${n-9} ${e-12} ${n-1} ${e-7}T${n+18} ${e-8}L${n+18} ${e+10}L${n-18} ${e+10}Z`,fn.root)+le(`M${n-18} ${e-7}Q${n-9} ${e-12} ${n-1} ${e-7}T${n+18} ${e-8}`,C)+da([n-7,e-8],[n-8,e+6],8,11,{n:2,knots:0})+da([n+5,e-8],[n+6,e+6],8,12,{n:2,knots:0})+le(Ke(t([[-4,-9],[-5,-15],[-3,-20]])),C*.9)+le(Ke(t([[7,-9],[8,-13],[10,-16]])),C*.9)+le(Ke(t([[-4,-31],[1,-28],[7,-30]])),C)+le(Ke(t([[-9,-21],[-6,-19]])),C*.9);return Q(Ke(t(i))+"Z",fn.body,{inner:s})})}function $2(){return We("gorti.child.arm",{x0:-6,y0:-5,x1:6,y1:19},(n,e)=>Q(Mn([n,e],[n,e+15],10.4,8.4,.6),fn.body,{over:le(`M${n-3} ${e+11}q3 2 6 0`,C*.9)}),{far:!0})}function G2(){return We("gorti.child.fore",{x0:-9,y0:-4,x1:9,y1:26},(n,e)=>So([n,e+13],Math.PI/2,1.25,[8,10,10.5,8.5],3.6,fn.rootDark,21,.25)+Hs([n,e],[n,e+14],8.2,7.2,fn.root,22,{lines:2}),{far:!0})}function z2(){return We("gorti.child.thigh",{x0:-8,y0:-5,x1:8,y1:23},(n,e)=>Hs([n,e],[n,e+19],12.8,10.2,fn.root,31,{bulge:.8}),{far:!0})}function H2(){return We("gorti.child.shin",{x0:-7,y0:-4,x1:7,y1:22},(n,e)=>Hs([n,e],[n,e+19],10.2,8,fn.root,32,{lines:2}),{far:!0})}function V2(){return We("gorti.child.foot",{x0:-10,y0:-5,x1:17,y1:8},(n,e)=>{const t=r=>Qt(r,n,e),i=(r,o)=>Q(ce(t(r),o,.7),fn.rootDark,{stroke:C*1.2});let s=i([[-2,3],[-6,5],[-9,6.2]],3.4);return s+=i([[1,3.5],[6,5.5],[10,6.3]],3.8),s+=i([[2,2],[9,3],[15,5.8]],4.2),s+=Q(xe(n,e+2.5,6,4.2),fn.root,{over:le(`M${n-2} ${e+1}q2 2 4 0`,C*.8)}),s},{far:!0})}function W2(){return[U2(),...N2(),...F2(),O2(),B2(),$2(),G2(),z2(),H2(),V2()]}const X2=As("gorti.root.child","gorti.child",k2),pt={head:"#d6e271",headSide:"#b8c65a",frame:"#f2a3c9",socket:"#5a2d52",lens:"#c9a6e4",tendril:"#5d4454",tendrilPink:"#e58fb8",tendrilGrey:"#8ea59f",armour:"#bab9c2",armourDark:"#8f8e99",yellow:"#f2d878",pink:"#f2adcb",blue:"#8fa2c4",collar:"#c9da7c",collarDeep:"#a9c46a",limb:"#b0b1b9",boot:"#7f818d"},zf=[{cx:-6,cy:-35,w:15,h:11.5,outer:-1},{cx:14,cy:-35,w:11,h:10.5,outer:1}],Nl=[4,-35],Hf=[{id:"hairA",base:[-15,-52],pts:[[-15,-52],[-23,-61],[-33,-64],[-40,-73],[-39,-83],[-34,-89]],w:9,color:pt.tendril,band:!0},{id:"hairB",base:[-7,-55],pts:[[-7,-55],[-12,-67],[-10,-79],[-15,-89],[-23,-93]],w:8.5,color:pt.tendril,bird:"green"},{id:"hairC",base:[3,-56],pts:[[3,-56],[5,-68],[1,-79],[4,-89],[10,-92]],w:7.5,color:pt.tendrilGrey},{id:"hairD",base:[12,-55],pts:[[12,-55],[18,-65],[17,-75],[23,-83],[31,-83]],w:8,color:pt.tendril,bird:"lilac"},{id:"hairE",base:[20,-50],pts:[[20,-50],[29,-55],[35,-63],[36,-70]],w:6.5,color:pt.tendril,band:!0}],q2={hip:50,thigh:23,shin:23,torso:44,shoulderY:37,shoulderX:3,upper:22,hipX:5,headX:3,hand:27,eye:Nl,brow:{part:"gorti.youth.brow",up:9.5,dx:-10},face:{eye:"gorti.youth",mouth:"gorti.youth",mouthAt:[9,-17]},hair:Hf.map((n,e)=>{const t=n.pts[n.pts.length-1];return{part:`gorti.youth.${n.id}`,id:n.id,at:n.base,tip:[t[0]-n.base[0],t[1]-n.base[1]],z:55+e,k:150,c:6}})};function Fl(n,e,t,i){const s=t/2,r=i/2;return[[n-s,e-r*.35],[n-s*.55,e-r],[n+s*.55,e-r],[n+s,e-r*.35],[n+s*.8,e+r],[n-s*.8,e+r]]}function Y2(){return We("gorti.youth.head",{x0:-24,y0:-60,x1:28,y1:3},(n,e)=>{const t=o=>Qt(o,n,e),i=[[-21,-52],[-14,-57],[20,-57],[26,-51],[27,-26],[24,-10],[17,-3],[-9,-2],[-19,-8],[-22,-26]],s=ws(`M${n-30} ${e-62}L${n-13} ${e-62}Q${n-15} ${e-30} ${n-12} ${e+3}L${n-30} ${e+3}Z`,pt.headSide)+le(`M${n-13} ${e-56}Q${n-15} ${e-30} ${n-12} ${e-3}`,C)+le(Ke(t([[1,-15],[0,-9],[1,-3]])),C)+le(Ke(t([[19,-15],[20,-9],[18,-4]])),C)+le(`M${n-11} ${e-21}h5M${n-9} ${e-16}h5M${n-11} ${e-11}h4M${n+22} ${e-22}h3`,C*.9)+le(Ke(t([[16,-57],[14,-52],[17,-48]])),C*.9)+le(Ke(t([[-6,-57],[-5,-53]])),C*.9)+le(Ke(t([[6,-30],[8,-24],[5,-23]])),C);let r=Q(Et(t(i),[5,6,6,5,6,7,6,6,6,5]),pt.head,{inner:s});for(const o of zf)r+=Q(Et(t(Fl(o.cx,o.cy,o.w+5,o.h+4.5)),1.5),pt.frame,{stroke:C*1.2}),r+=Q(Et(t(Fl(o.cx,o.cy,o.w,o.h)),1),pt.socket,{stroke:C});return r})}function Z2(){return ic(Ur("gorti.youth",{x0:-18,y0:-9,x1:18,y1:9},(n,e,t)=>zf.map(i=>{const s=e+i.cx-Nl[0],r=t+i.cy-Nl[1],o=i.w/2-1.2,a=i.h/2-1.2;if(n==="happy")return le(`M${s-o} ${r+a*.45}Q${s} ${r-a*1.3} ${s+o} ${r+a*.45}`,2.4,pt.lens)+le(`M${s-o} ${r+a*.45}Q${s} ${r-a*1.3} ${s+o} ${r+a*.45}`,.9);if(n==="shut")return le(`M${s-o} ${r}Q${s} ${r+a*.8} ${s+o} ${r}`,2.2,pt.lens)+le(`M${s-o} ${r}Q${s} ${r+a*.8} ${s+o} ${r}`,.9);const c=Et(Fl(s,r,i.w-2.4,i.h-2.4),1);let l="";if(n==="sad"){const[h,u]=i.outer===-1?[r+a*.1,r-a*.8]:[r-a*.8,r+a*.1];l+=`<path d="M${s-o-2} ${r-a-3}L${s+o+2} ${r-a-3}L${s+o+2} ${u}L${s-o-2} ${h}Z" fill="${pt.socket}"/>`+le(`M${s-o-2} ${h}L${s+o+2} ${u}`,1)}return Q(c,pt.lens,{stroke:.9,inner:l})}).join("")))}function K2(){return Nr("gorti.youth",{x0:-4,y0:-4,x1:4,y1:4},()=>"")}function Q2(n){const e=n.pts.map(([r,o])=>[r-n.base[0],o-n.base[1]]),t=e.map(r=>r[0]),i=e.map(r=>r[1]),s={x0:Math.min(...t)-10,y0:Math.min(...i)-12,x1:Math.max(...t)+10,y1:Math.max(...i)+6};return We(`gorti.youth.${n.id}`,s,(r,o)=>{const a=Qt(e,r,o);let c=Q(ce(a,n.w,1.6),n.color,{stroke:C*1.2,over:le(Ke(a.slice(1,-1)),C*.7,"#8b6d7e")});if(n.band){const h=a[Math.floor(a.length/2)];c+=`<circle cx="${h[0]}" cy="${h[1]}" r="${n.w*.42}" fill="${pt.tendrilPink}" stroke="${at}" stroke-width="${C}"/>`}const l=a[a.length-1];if(n.bird){const h=n.bird==="green"?_e.leaf:_e.lilac,u=l[0],f=l[1]-4;c+=Q(`M${u-5} ${f+1}Q${u-3} ${f-5} ${u+3} ${f-3}Q${u+6} ${f-1} ${u+3} ${f+3}Q${u-1} ${f+4} ${u-5} ${f+1}Z`,h,{stroke:C}),c+=Q(`M${u+.5} ${f+.5}Q${u+3.5} ${f} ${u+3} ${f+2.5}Q${u+1} ${f+3} ${u+.5} ${f+.5}Z`,_e.pink,{stroke:.8}),c+=Q(`M${u+4.5} ${f-2.5}l3 0.6l-2.6 1.2Z`,_e.butter,{stroke:.8}),c+=`<circle cx="${u+2.4}" cy="${f-2.2}" r="0.7" fill="${at}"/>`,c+=le(`M${u-5} ${f+1}l-3 -1.5M${u-5} ${f+1}l-3 1`,C*.9)}else c+=vs(l,Math.atan2(l[1]-a[a.length-2][1],l[0]-a[a.length-2][0]),6,pt.collar,{vein:!1});return c})}function J2(){return We("gorti.youth.torso",{x0:-24,y0:-66,x1:28,y1:10},(n,e)=>{const t=d=>Qt(d,n,e),i=[[-12,5],[-13,-8],[-15,-22],[-16,-35],[-12,-42],[-2,-45],[10,-44],[16,-38],[16,-24],[13,-10],[12,5]];let s="";[-10,-4.5,1,6.5].forEach((d,m)=>{const _=m%2===0?pt.yellow:pt.pink;s+=Q(`M${n+d} ${e-1}V${e-17}L${n+d+1.8} ${e-19.5}L${n+d+3} ${e-17}L${n+d+4.2} ${e-19.5}L${n+d+5.5} ${e-17}V${e-1}Z`,_,{stroke:C})});const o=n+3,a=e-31,c=Q(`M${o-6} ${a}Q${o} ${a-5.5} ${o+6} ${a}Q${o} ${a+5} ${o-6} ${a}Z`,"#fbf6ee",{stroke:C,inner:`<circle cx="${o+.5}" cy="${a}" r="2.4" fill="#6fb2d8"/><circle cx="${o+.5}" cy="${a}" r="1.1" fill="${at}"/>`})+le(`M${o-5} ${a-3}l-1.5 -2M${o-2} ${a-4.2}l-0.6 -2.4M${o+1.5} ${a-4.4}l0.3 -2.4M${o+5} ${a-3}l1.6 -2M${o-3} ${a+3.8}l-0.8 2M${o+3} ${a+3.8}l0.8 2`,C*.85),l=le(Ke(t([[-15,-23],[0,-22],[16,-24]])),C)+`<circle cx="${n-11}" cy="${e-38}" r="1.2" fill="${pt.armourDark}" stroke="${at}" stroke-width="0.8"/><circle cx="${n+12}" cy="${e-38}" r="1.2" fill="${pt.armourDark}" stroke="${at}" stroke-width="0.8"/>`+ws(`M${n-20} ${e+1}H${n+20}V${e+9}H${n-20}Z`,pt.armourDark)+le(`M${n-20} ${e+1}H${n+20}`,C)+`<rect x="${n+1}" y="${e+1.5}" width="5" height="4" rx="1" fill="${pt.yellow}" stroke="${at}" stroke-width="0.9"/>`;let h=Q(Et(t(i),5),pt.armour,{inner:l,over:s+c});const u=[n+3,e-44],f=[[-2.95,22,pt.collarDeep],[-.2,21,pt.collarDeep],[-2.6,20,pt.collar],[-.55,20,pt.collar],[-2.25,16,pt.collar],[-.9,16,pt.collar]];for(const[d,m,_]of f)h+=vs([u[0]+Math.cos(d)*3,u[1]+Math.sin(d)*2],d,m,_,{width:.3,stroke:C});return h})}function j2(){return We("gorti.youth.arm",{x0:-8,y0:-7,x1:8,y1:27},(n,e)=>Q(Mn([n,e],[n,e+22],9.5,8,.4),pt.limb,{over:Zn([[n+1,e+7],[n+1.5,e+18]],3.6,1.8)})+Q(Et([[n-7,e-5],[n+7,e-5],[n+6.5,e+7],[n-6.5,e+7]],3),pt.blue,{stroke:C*1.2,over:le(`M${n-6} ${e+1}H${n+6}`,C*.8)})+Q(Et([[n-5,e+15],[n+5,e+15],[n+5,e+20],[n-5,e+20]],1.5),pt.yellow,{stroke:C}),{far:!0})}function eg(){return We("gorti.youth.fore",{x0:-9,y0:-5,x1:10,y1:32},(n,e)=>{let t=Q(Mn([n,e],[n,e+20],8.2,7,.3),pt.limb,{over:Zn([[n-.5,e+3],[n,e+12]],3.4,1.7)});t+=Q(`M${n-4.6} ${e+13}H${n+4.6}V${e+17.5}H${n-4.6}Z`,"#5a4e56",{stroke:C}),t+=Q(xe(n+1.5,e+15.2,3.6,3.6),"#f7eddc",{stroke:C,over:le(`M${n+1.5} ${e+15.2}v-2.2M${n+1.5} ${e+15.2}l1.6 0.8`,.8)}),t+=Q(Et([[n-1.5,e+21],[n+3.2,e+22],[n+5.8,e+27.5],[n+3.5,e+29]],1.2),pt.limb,{stroke:C}),t+=Q(Et([[n-4.5,e+19.5],[n+4,e+19.5],[n+4,e+25],[n-4.5,e+25]],1.8),pt.limb,{stroke:C*1.1});for(const i of[-3.5,-.8,1.9])t+=Q(Et([[n+i,e+24.5],[n+i+2.3,e+24.5],[n+i+2.1,e+30.5],[n+i+.2,e+30.5]],.9),pt.limb,{stroke:C*.9});return t},{far:!0})}function tg(){return We("gorti.youth.thigh",{x0:-8,y0:-5,x1:8,y1:27},(n,e)=>Q(Mn([n,e],[n,e+23],12.5,10,.5),pt.limb,{over:Zn([[n-2,e+3],[n-2.5,e+13]],3.6,1.8)+Q(Et([[n-5.5,e+16],[n+5.5,e+15.5],[n+5,e+24],[n-5,e+24]],2),pt.pink,{stroke:C,over:le(`M${n-3} ${e+18}l2 2M${n+1} ${e+18}l2 2`,C*.8)})}),{far:!0})}function ng(){return We("gorti.youth.shin",{x0:-7,y0:-4,x1:7,y1:26},(n,e)=>Q(Mn([n,e],[n,e+23],10,8,.2),pt.limb,{over:le(`M${n-5} ${e+9}H${n+5}`,C)+Zn([[n+1.5,e+11],[n+1.5,e+20]],3.2,1.6)}),{far:!0})}function ig(){return We("gorti.youth.foot",{x0:-8,y0:-5,x1:16,y1:8},(n,e)=>Q(Et(Qt([[-6,-3],[3,-3],[7,0],[14,1.5],[15,6],[-7,6]],n,e),[2,2,3,3,1.5,1.5]),pt.boot,{over:ws(`M${n-8} ${e+3.8}H${n+16}V${e+7}H${n-8}Z`,pt.pink)+le(`M${n-7} ${e+3.8}H${n+15}`,C)+le(`M${n+4} ${e-1}l-2 3`,C*.9)}),{far:!0})}function sg(){return[Y2(),...Z2(),...K2(),Er("gorti.youth.brow",pt.tendril,12,3.4,{stroke:C}),...Hf.map(Q2),J2(),j2(),eg(),tg(),ng(),ig()]}const rg=As("gorti.root.youth","gorti.youth",q2),St={skin:"#f1dade",skinLine:"#c99aa8",hair:"#f2dc72",hairDeep:"#d9bb4a",tunic:"#c1d488",root:"#f3b5cf",leaf:"#9cc47a",metal:"#c5c3ca",metalDeep:"#a09ea8",plate:"#f6e8ef",maze:"#e27fae",iris:"#7d91a9"},ag=[5,-27],og={hip:62,thigh:29,shin:29,torso:64,shoulderY:49,shoulderX:3,upper:26,hipX:5,headX:3,hand:30,eye:ag,brow:{part:"gorti.warrior.brow",up:6.2,dx:-5},face:{eye:"gorti.warrior",mouth:"gorti.warrior",mouthAt:[11,-11]},parts:{armL:"gorti.warrior.mecharm",foreL:"gorti.warrior.mechfore"},watch:{part:"gorti.warrior.watch",side:"L",at:22},extra:[{id:"skirt",parent:"torso",x:0,y:-4,part:"gorti.warrior.skirt",z:150,spring:{k:130,c:7,lag:.35,gain:.0025,tip:[0,26]}}]};function lg(){return We("gorti.warrior.head",{x0:-17,y0:-56,x1:22,y1:4},(n,e)=>{const t=c=>Qt(c,n,e);let i=Q(Mn([n-1,e+4],[n,e-10],11,10,0),St.skin,{over:le(`M${n+3} ${e-1}q1 -4 -1 -7`,C*.8,St.skinLine)});i+=Q(Ke(t([[-7,-27],[-15,-35],[-13,-26],[-10,-20],[-6,-19]]))+"Z",St.skin,{over:le(Ke(t([[-12,-31],[-10,-25]])),C*.8,St.skinLine)});const s=[[6,-2],[-3,-5],[-9,-12],[-11,-22],[-11,-33],[-7,-41],[2,-45],[10,-43],[14,-37],[15,-30],[19,-21],[16,-18],[16,-14],[14,-8],[11,-4]],r=le(Ke(t([[14,-29],[17.5,-21],[14.5,-19]])),C)+le(Ke(t([[-2.5,-23.5],[0,-22],[3,-23]])),C*.8,St.skinLine)+le(Ke(t([[9,-23.5],[11,-22.5],[13,-23.5]])),C*.8,St.skinLine)+le(Ke(t([[-5,-14],[-2,-10]])),C*.8,St.skinLine)+le(Ke(t([[9,-32.5],[12,-33.5],[14.5,-32]])),1.8,St.hairDeep);i+=Q(Ke(t(s))+"Z",St.skin,{over:r});const o=[[-12,-30],[-13,-40],[-9,-48],[0,-53],[11,-52],[17,-46],[16,-39],[11,-41],[5,-39],[-1,-41],[-6,-37],[-9,-33]],a=le(Ke(t([[-9,-38],[-4,-46],[4,-50]])),C)+le(Ke(t([[-3,-40],[3,-46],[11,-49]])),C)+le(Ke(t([[5,-41],[11,-45],[15,-44]])),C)+le(Ke(t([[-11,-34],[-9,-42]])),C);return i+=Q(Ke(t(o))+"Z",St.hair,{over:a}),i})}function cg(){return ic(Ur("gorti.warrior",{x0:-12,y0:-8,x1:13,y1:7},(n,e,t)=>Tr(n,e-5.5,t,4.2,2.6,{outer:-1,iris:St.iris,lid:.34,lidFill:St.skin,look:.3,blank:!0})+Tr(n,e+6.5,t,3.2,2.4,{outer:1,iris:St.iris,lid:.34,lidFill:St.skin,look:.45,blank:!0})))}function hg(){return Nr("gorti.warrior",{x0:-4,y0:-4,x1:4,y1:4},()=>"")}function Vf(n,e,t){return t.map(([i,s])=>le(`M${n+i-3} ${e+s}q1.5 -1.6 3 0t3 0`,C)).join("")}function fg(){return We("gorti.warrior.torso",{x0:-21,y0:-70,x1:22,y1:6},(n,e)=>{const t=r=>Qt(r,n,e),i=[[-13,3],[-15,-10],[-16,-26],[-18,-40],[-18,-48],[-11,-53],[-7,-57],[-6,-67],[9,-67],[10,-57],[15,-53],[20,-48],[19,-36],[15,-22],[13,-8],[13,3]],s=Vf(n,e,[[-8,-40],[6,-33],[-9,-24],[8,-18],[-2,-10],[11,-45],[-3,-30],[4,-60]])+le(Ke(t([[-6,-57],[2,-55],[10,-57]])),C)+Q(`M${n-11} ${e-44}Q${n-4} ${e-50} ${n+3} ${e-44}Q${n-4} ${e-39} ${n-11} ${e-44}Z`,"#f3eed8",{stroke:C,inner:`<circle cx="${n-3.6}" cy="${e-44}" r="2.2" fill="${St.iris}"/><circle cx="${n-3.6}" cy="${e-44}" r="1" fill="${at}"/>`})+le(`M${n-9} ${e-46.5}l-1 -1.6M${n-6} ${e-47.8}l-0.4 -1.8M${n-2.5} ${e-48}l0.3 -1.8M${n+1} ${e-46.8}l1 -1.5`,C*.8);return Q(Ke(t(i))+"Z",St.tunic,{over:s})})}function ug(){return We("gorti.warrior.skirt",{x0:-21,y0:-8,x1:21,y1:30},(n,e)=>{const i=`M${[[-14,-6],[14,-6],[16,6],[19,17],[13,13],[11,25],[6,15],[2,28],[-2,16],[-7,26],[-10,14],[-15,22],[-15,11],[-18,14],[-15,3]].map(([s,r])=>`${n+s} ${e+r}`).join("L")}Z`;return Q(i,St.tunic,{over:Vf(n,e,[[-6,3],[7,6],[0,12],[-9,12]])+le(`M${n+2} ${e+16}l0.5 8M${n-7} ${e+15}l-0.3 7M${n+11} ${e+14}l0 7`,C*.8,"#7f9a4c")})})}function dg(){return We("gorti.warrior.arm",{x0:-10,y0:-9,x1:10,y1:30},(n,e)=>{let t=Hs([n,e],[n,e+26],11.5,9.5,St.root,41,{lines:3});return t+=Q(`M${n-7} ${e+4}Q${n-8} ${e-7} ${n} ${e-7}Q${n+8} ${e-7} ${n+7} ${e+4}Z`,St.metal,{stroke:C*1.2}),t+=Q(`M${n-7} ${e+3}L${n-9} ${e+11}L${n-4.5} ${e+7}L${n-2} ${e+13}L${n+1} ${e+7}L${n+4} ${e+12}L${n+5.5} ${e+6.5}L${n+9} ${e+10}L${n+7} ${e+3}Z`,St.leaf,{stroke:C*1.1}),t},{far:!0})}function pg(){return We("gorti.warrior.fore",{x0:-16,y0:-6,x1:16,y1:44},(n,e)=>{let t=vs([n-3.5,e+9],Math.PI*.85,9,St.leaf);return t+=vs([n+3.8,e+15],-Math.PI*.12,8,St.leaf),t+=So([n,e+24],Math.PI/2,1.05,[13,16,17,13],4.8,St.root,43,.28),t+=Hs([n,e],[n,e+25],9.5,10.5,St.root,42,{lines:3,bulge:.2}),t},{far:!0})}function mg(){return We("gorti.warrior.mecharm",{x0:-10,y0:-9,x1:10,y1:30},(n,e)=>{let t=Q(Et([[n-5.5,e+10],[n+5.5,e+10],[n+4.8,e+27],[n-4.8,e+27]],2.5),St.metal,{stroke:C*1.2,over:le(`M${n-4} ${e+18}H${n+4}`,C*.9)});return t+=Q(Et([[n-8,e-6],[n+8,e-6],[n+7,e+12],[n-7,e+12]],4),St.metal,{stroke:C*1.3,over:le(`M${n-7} ${e+3}H${n+7}`,C)+`<circle cx="${n+3.5}" cy="${e-1}" r="1.3" fill="${St.metalDeep}" stroke="${at}" stroke-width="0.8"/>`}),t},{far:!0})}function gg(){return We("gorti.warrior.mechfore",{x0:-12,y0:-6,x1:12,y1:40},(n,e)=>{let t=Q(Et([[n-4.8,e-2],[n+4.8,e-2],[n+4.2,e+21],[n-4.2,e+21]],2),St.metal,{stroke:C*1.2,over:le(`M${n-4} ${e+7}H${n+4}M${n-4} ${e+13}H${n+4}`,C*.9)});return t+=`<circle cx="${n}" cy="${e}" r="3.4" fill="${St.metalDeep}" stroke="${at}" stroke-width="${C}"/>`,t+=So([n,e+30],Math.PI/2,.9,[7,8.5,7],2.8,St.metal,45,.3),t+=Q(xe(n,e+26,8.5,6),St.plate,{stroke:C*1.2,inner:$f(n-7,e+21,14,10,St.maze,7,1.1)}),t},{far:!0})}function _g(){return We("gorti.warrior.thigh",{x0:-9,y0:-5,x1:9,y1:33},(n,e)=>Hs([n,e],[n,e+29],14,11,St.root,51,{bulge:.6}),{far:!0})}function Mg(){return We("gorti.warrior.shin",{x0:-9,y0:-4,x1:9,y1:32},(n,e)=>Hs([n,e],[n,e+29],11,8.6,St.root,52)+vs([n+4,e+8],-.5,8,St.leaf),{far:!0})}function vg(){return We("gorti.warrior.foot",{x0:-12,y0:-5,x1:20,y1:9},(n,e)=>{const t=r=>Qt(r,n,e),i=(r,o)=>{const a=t(r);return Q(ce(a,o,.7),St.root,{stroke:C*1.2,inner:`<path d="${ce(a.slice(-2),o*.45,.5)}" fill="${St.leaf}"/>`})};let s=i([[-2,3],[-7,5],[-11,6.3]],3.6);return s+=i([[1,3.5],[7,5.5],[12,6.4]],4.2),s+=i([[2,1.5],[10,2.8],[18,6]],4.8),s+=Q(xe(n,e+2.4,5.8,4.2),St.root,{over:da([n-3,e+1],[n+3,e+3],4,53,{n:1,knots:0})}),s},{far:!0})}function xg(){return We("gorti.warrior.watch",{x0:-8,y0:-6,x1:8,y1:6},(n,e)=>Q(`M${n-6.8} ${e-2.6}H${n+6.8}V${e+2.6}H${n-6.8}Z`,"#5f4f45",{stroke:C})+Q(xe(n+1,e,4.3,4.3),_e.cream,{stroke:C*1.2,over:le(`M${n+1} ${e}v-2.8M${n+1} ${e}l2 1`,.9)+`<circle cx="${n+1}" cy="${e}" r="3.2" fill="none" stroke="${_e.sand}" stroke-width="0.8"/>`}))}function yg(){return[lg(),...cg(),...hg(),Er("gorti.warrior.brow",St.hairDeep,9,2.6,{sad:1.6,stroke:C*.9}),fg(),ug(),dg(),pg(),mg(),gg(),_g(),Mg(),vg(),xg()]}const Sg=As("gorti.root.warrior","gorti.warrior",og),je={body:"#dfe7e2",bodyLine:"#aebdb6",mauve:"#c996aa",mauveDeep:"#b27f95",sage:"#aacd9c",stripe:"#8fd19a",hand:"#a9c580",leg:"#bf8fa2",foot:"#d3e8e4",moon:"#a7abe3",moonDeep:"#7f84c8",tear:"#8fd3ee",sun:"#f6b77f",ray:"#f3e08e",freckle:"#c07f5e",suit:"#a3a5ad",suitDeep:"#83858f",shirt:"#f5f2ea",tie:"#5d6178",shoe:"#4c4852"},Wf={hip:43,thigh:19,shin:20,torso:57,shoulderY:46,shoulderX:9,upper:23,hipX:7,headX:9,hand:29},Xf={...Wf,eye:[-3,-31],brow:{part:"gorti.human.brow",up:6.5,dx:-.5},face:{eye:"gorti.human",mouth:"gorti.human",mouthAt:[2.5,-14.5]}},bg={...Wf,parts:{head:"gorti.sun.head"},eye:[7,-30],brow:{part:"gorti.sun.brow",up:5.8,dx:-5},face:{eye:"gorti.sun",mouth:"gorti.sun",mouthAt:[10,-18]}};function Tg(){return We("gorti.human.head",{x0:-22,y0:-68,x1:16,y1:4},(n,e)=>{const t=o=>Qt(o,n,e),i=[[12,-65],[3,-56],[-1,-47],[-1,-39],[3,-34],[4.5,-30],[1.5,-27],[2,-22],[5,-18],[8,-12],[11,-6],[8,-1],[0,1],[-9,-1],[-16,-8],[-20,-20],[-20,-34],[-16,-47],[-7,-58]],s=Q(`M${n-6} ${e-25}q-2.4 3.4 0 4.6q2.4 -1.2 0 -4.6Z`,je.tear,{stroke:C})+Q(`M${n-8.5} ${e-18}q-2.6 3.6 0 5q2.6 -1.4 0 -5Z`,je.tear,{stroke:C})+Q(`M${n-4.5} ${e-13}q-2 2.8 0 3.9q2 -1.1 0 -3.9Z`,je.tear,{stroke:C}),r=le(xe(n-13,e-42,2.2,1.6),C*.8,je.moonDeep)+le(xe(n-15,e-12,1.6,1.2),C*.8,je.moonDeep)+le(Ke(t([[-12,-52],[-7,-55]])),C*.8,je.moonDeep);return Q(Ke(t(i))+"Z",je.moon,{over:r+s})})}function Eg(){return Ur("gorti.human",{x0:-8,y0:-8,x1:8,y1:7},(n,e,t)=>Tr(n,e,t,5.2,3.6,{outer:-1,iris:"#3f6f63",lid:.1,lidFill:je.moon,look:.3,pupil:.5,blank:!0}))}function wg(){return Nr("gorti.human",{x0:-6,y0:-6,x1:6,y1:6},(e,t,i)=>sc(e,t,i,3,{lip:je.mauve,inside:"#4a2a4f",sad:.5}))}function Ag(){return We("gorti.sun.head",{x0:-27,y0:-64,x1:34,y1:6},(n,e)=>{const t=n+4,i=e-28,s=20,r=new an(88);let o="";const a=15;for(let u=0;u<a;u++){const f=u/a*Math.PI*2+.1,d=s+8+r.range(-1.5,2.5),m=.2,_=(p,g)=>`${t+Math.cos(p)*g} ${i+Math.sin(p)*g}`;o+=Q(`M${_(f-m,s-2)}L${_(f,d)}L${_(f+m,s-2)}Z`,je.ray,{stroke:C})}let c="";for(let u=0;u<10;u++){const f=r.range(0,Math.PI*2),d=r.range(s*.45,s*.85),m=t+Math.cos(f)*d,_=i+Math.sin(f)*d;_>i-7&&_<i+14&&m>t-6||(c+=`<circle cx="${m}" cy="${_}" r="0.9" fill="${je.freckle}"/>`)}const l=c+le(`M${t+7} ${i-1}l2.6 5.2l-2.8 1`,C)+le(`M${t-13} ${i+5}q2 1.5 4 0`,C*.8,je.freckle)+le(`M${t-6} ${i-8}q2 -1.4 5 -1.1`,1.6,"#c7743f");let h=Q(Mn([n,e+4],[n+1,e-10],10,10,0),je.body,{});return h+=o,h+=Q(xe(t,i,s,s),je.sun,{over:l}),h})}function Rg(){return Ur("gorti.sun",{x0:-12,y0:-8,x1:13,y1:7},(n,e,t)=>Tr(n,e-5,t,3.9,2.7,{outer:-1,iris:"#e0667f",lid:.18,lidFill:je.sun,look:.3,blank:!0})+Tr(n,e+6.5,t,3.2,2.5,{outer:1,iris:"#e0667f",lid:.18,lidFill:je.sun,look:.45,blank:!0}))}function Cg(){return Nr("gorti.sun",{x0:-4.4-3,y0:-4.4-3,x1:4.4+3,y1:4.4+3},(e,t,i)=>sc(e,t,i,4.4,{lip:"#e98a7a",inside:"#6b2c34",sad:.3}))}function uo(n,e,t,i,s,r=11){const o=new an(s),a=[];for(let c=0;c<r*2;c++){const l=c/(r*2)*Math.PI*2,h=c%2===0?1:.72+o.range(-.06,.06);a.push(`${n+Math.cos(l)*t*h} ${e+Math.sin(l)*i*h}`)}return`M${a.join("L")}Z`}const qf=[[-17,7],[-25,-5],[-31,-22],[-32,-40],[-26,-54],[-12,-62],[6,-61],[17,-53],[22,-38],[23,-20],[20,-4],[13,7]];function Lg(){return We("gorti.human.torso",{x0:-35,y0:-66,x1:27,y1:11},(n,e)=>{const t=r=>Qt(r,n,e),i=Q(uo(n-18,e-1,13,9,3,13),je.mauve,{stroke:C})+Q(uo(n+9,e-53,9,7,4,9),je.mauve,{stroke:C})+Q(Et(t([[6,-22],[16,-23],[17,-13],[7,-12]]),2),je.sage,{stroke:C,over:Zn(t([[6.5,-17.5],[16.5,-18]]),3,1.4)}),s=Zn(t([[16,-47],[19,-33],[19,-26]]),4,1.8)+le(Ke(t([[-25,-16],[-18,-12],[-12,-14]])),C,je.bodyLine)+le(Ke(t([[-8,-58],[-4,-52]])),C,je.bodyLine)+ca(n-31,e-47,13,7,"#f2a7b5",11,-14)+ca(n-29,e-38.5,12,6.5,_e.butter,12,-6)+ca(n-28,e-29.5,12,7,_e.mint,13,5)+le(Ke(t([[-2,-26],[0,-36],[-1,-46]])),C)+vs(Qt([[-1,-44]],n,e)[0],-2.3,10,_e.leaf)+vs(Qt([[0,-36]],n,e)[0],-.5,9,_e.leaf)+vs(Qt([[-.5,-29]],n,e)[0],-2.7,8,_e.leaf);return Q(Ke(t(qf))+"Z",je.body,{inner:i,over:s})})}function Pg(){return We("gorti.human.arm",{x0:-9,y0:-6,x1:9,y1:28},(n,e)=>Q(Mn([n,e],[n,e+23],14,11,.7),je.body,{inner:Q(uo(n+1,e+6,6.5,5.5,21,8),je.mauve,{stroke:C}),over:le(`M${n-4} ${e+16}q4 2 8 0`,C,je.bodyLine)}),{far:!0})}function Dh(n=!1){return We(n?"gorti.suit.fore":"gorti.human.fore",{x0:-9,y0:-5,x1:10,y1:33},(e,t)=>{const i=r=>Qt(r,e,t);let s="";if(s+=Q(Ke(i([[-4,18],[4,18],[6.5,23],[6,29.5],[3.8,30],[2.5,26],[0,29.5],[-3.5,28],[-5,23]]))+"Z",je.hand,{stroke:C*1.2,over:le(`M${e+2.5} ${t+26}l-1 -3M${e-1} ${t+27.5}l-0.3 -3`,C*.8)}),s+=Q(ce(i([[4,21],[7,23],[8.5,26]]),3.4,2.2),je.hand,{stroke:C}),n)s+=Q(Mn([e,t],[e,t+18],10.5,9.5,.3),je.suit,{over:le(`M${e-3} ${t+8}q2 2 5 0`,C,je.suitDeep)}),s+=Q(Et(i([[-5,15],[5,15],[5,20],[-5,20]]),1.2),je.shirt,{stroke:C});else{const r=[9,13,17].map(o=>Q(`M${e-6} ${t+o}H${e+6}V${t+o+2.2}H${e-6}Z`,je.stripe,{stroke:.9})).join("");s+=Q(Mn([e,t],[e,t+19],10,9,.3),je.body,{inner:r})}return s},{far:!0})}function Ih(n=!1){return We(n?"gorti.suit.thigh":"gorti.human.thigh",{x0:-9,y0:-5,x1:9,y1:24},(e,t)=>n?Q(Mn([e,t],[e,t+19],15,12,.7),je.suit,{over:le(`M${e+2} ${t+5}q-3 6 1 11`,C,je.suitDeep)}):Q(Mn([e,t],[e,t+19],16,12.5,.8),je.leg,{inner:Q(uo(e-2,t+8,5.5,5,31,8),je.sage,{stroke:C}),over:Zn([[e+4,t+2],[e+5,t+14]],3.4,1.6)}),{far:!0})}function kh(n=!1){return We(n?"gorti.suit.shin":"gorti.human.shin",{x0:-9,y0:-4,x1:9,y1:24},(e,t)=>{if(n)return Q(Mn([e,t],[e,t+20],12,11,.3),je.suit,{over:le(`M${e-5} ${t+17}H${e+5}`,C,je.suitDeep)});const i=`M${e-7} ${t+3}L${e-5} ${t+10}L${e-3} ${t+5}L${e-1} ${t+11}L${e+1.5} ${t+5}L${e+3.5} ${t+10.5}L${e+5.5} ${t+4.5}L${e+7.5} ${t+9}L${e+7} ${t-1}L${e-7} ${t-1}Z`;return Q(Mn([e,t],[e,t+20],12,10.5,.3),je.leg,{over:le(`M${e-3} ${t+14}l3 1.5`,C*.8)})+Q(i,je.mauveDeep,{stroke:C})},{far:!0})}function Dg(){return We("gorti.human.foot",{x0:-9,y0:-5,x1:17,y1:8},(n,e)=>Q(`M${n-7} ${e-2}Q${n-1} ${e-5} ${n+5} ${e-1}L${n+16} ${e+3}L${n+11} ${e+3.5}L${n+13} ${e+6}L${n+7} ${e+5}L${n+6} ${e+6.5}L${n-7} ${e+6.5}Z`,je.foot,{stroke:C*1.3,over:le(`M${n-2} ${e+1}q2 1 4 0`,C*.8,je.bodyLine)}),{far:!0})}function Ig(){return We("gorti.suit.foot",{x0:-9,y0:-5,x1:17,y1:8},(n,e)=>Q(Et(Qt([[-6,-3],[4,-3],[8,0],[15,2],[15.5,6.5],[-7,6.5]],n,e),[2,2,3,3,1.5,1.5]),je.shoe,{stroke:C*1.3,over:le(`M${n-6} ${e+4.8}H${n+15}`,C*.8,"#8a8494")}),{far:!0})}function kg(){return We("gorti.suit.torso",{x0:-35,y0:-66,x1:27,y1:11},(n,e)=>{const t=r=>Qt(r,n,e),s=Q(`M${n+1} ${e-61}L${n+16} ${e-56}L${n+10} ${e-38}Z`,je.shirt,{stroke:C*1.1})+Q(`M${n+7} ${e-57}L${n+11} ${e-56}L${n+11.5} ${e-44}L${n+9.5} ${e-39}L${n+7.5} ${e-44}Z`,je.tie,{stroke:C})+Q(`M${n+1} ${e-61}L${n+10} ${e-38}L${n+3} ${e-45}L${n-1} ${e-58}Z`,je.suitDeep,{stroke:C*1.1})+Q(`M${n+16} ${e-56}L${n+10} ${e-38}L${n+17} ${e-46}L${n+19} ${e-53}Z`,je.suitDeep,{stroke:C*1.1})+le(Ke(t([[10,-38],[13,-22],[15,-8],[15,6]])),C*1.2)+`<circle cx="${n+12.5}" cy="${e-26}" r="1.3" fill="${at}"/><circle cx="${n+14}" cy="${e-14}" r="1.3" fill="${at}"/>`+le(Ke(t([[-24,-32],[-17,-29],[-11,-31]])),C,je.suitDeep)+le(Ke(t([[-24,-12],[-17,-10],[-11,-12]])),C,je.suitDeep)+ca(n+15,e-36,8,5,_e.cream,17,8);return Q(Ke(t(qf))+"Z",je.suit,{over:s})})}function Ug(){return We("gorti.suit.arm",{x0:-9,y0:-6,x1:9,y1:28},(n,e)=>Q(Mn([n,e],[n,e+23],14,11,.7),je.suit,{over:le(`M${n-4} ${e+14}q4 2 8 0`,C,je.suitDeep)}),{far:!0})}function Ng(){return[Tg(),...Eg(),...wg(),Er("gorti.human.brow",je.moonDeep,11,3.4,{stroke:C}),Ag(),...Rg(),...Cg(),Er("gorti.sun.brow","#c7743f",9,2.8,{stroke:C}),Lg(),Pg(),Dh(),Ih(),kh(),Dg(),kg(),Ug(),Dh(!0),Ih(!0),kh(!0),Ig()]}const Fg=As("gorti.human","gorti.human",Xf),Og=As("gorti.human.sun","gorti.human",bg),Bg=As("gorti.suit","gorti.suit",{...Xf,parts:{head:"gorti.human.head"}});function $g(){return We("gorti.watch",{x0:-6,y0:-5,x1:6,y1:5},(n,e)=>Q(`M${n-5.5} ${e-2}H${n+5.5}V${e+2}H${n-5.5}Z`,"#5f4f45",{stroke:C})+Q(xe(n+1,e,3.5,3.5),_e.cream,{stroke:C*1.1,over:le(`M${n+1} ${e}v-2M${n+1} ${e}l1.4 0.7`,.8)}))}function Gg(){return[...W2(),...sg(),...yg(),...Ng(),$g()]}const cn={blanket:"#c9b8e4",blanketDeep:"#a995cf",face:"#f3e2dc",faceLine:"#cfa9a8",hair:"#4d3f4f",pyjama:"#aeb8d2",pyjamaLine:"#8290b4",foot:"#f1ddd8",wood:"#c09469",wrap:"#f4ead6",flame:"#f7c46b",flameCore:"#fff0b8",flameEdge:"#ef9a5c"},dn={plate:"#bdbcc4",plateDeep:"#9a99a4",joint:"#dddbe2",yellow:"#f2d878",pink:"#f2adcb",maze:"#e27fae",blue:"#8fa2c4",photo:"#f7eddc"};function zg(){return We("coward.head",{x0:-19,y0:-38,x1:18,y1:6},(n,e)=>{const t=o=>Qt(o,n,e);let s=Q(Ke(t([[2,-2],[-4,-8],[-5,-20],[0,-27],[8,-27],[12,-22],[13,-17],[16,-13],[12.5,-11],[12.5,-7],[9,-3]]))+"Z",cn.face,{over:le(Ke(t([[13,-17],[15.5,-13],[12.5,-12]])),C)+le(Ke(t([[2,-12],[5,-10]])),C*.8,cn.faceLine)});return s+=Q(Ke(t([[-1,-26],[4,-30],[10,-28],[9,-24],[5,-26],[2,-23]]))+"Z",cn.hair,{stroke:C}),s+=Q(Ke(t([[-15,4],[-18,-10],[-16,-25],[-8,-34],[4,-36],[12,-31],[14,-26],[7,-28],[2,-27],[-2,-21],[-2,-9],[2,1],[-5,5]]))+"Z",cn.blanket,{inner:Q(Et(t([[-16,-18],[-9,-19],[-8,-11],[-15,-10]]),1.5),_e.mint,{stroke:C,over:Zn(t([[-15.5,-14.5],[-8.5,-15]]),2.6,1.2)}),over:Zn(t([[10,-30],[4,-28],[-1,-22],[-1,-10],[2,0]]),3.4,1.5)}),s})}function Hg(){return Ur("coward",{x0:-7,y0:-8,x1:7,y1:7},(n,e,t)=>Tr(n,e,t,3.6,3.3,{outer:-1,iris:"#4b3f5a",look:.35,pupil:.55,lidFill:cn.face}))}function Vg(){return Nr("coward",{x0:-2.6-3,y0:-2.6-3,x1:2.6+3,y1:2.6+3},(e,t,i)=>sc(e,t,i,2.6,{lip:"#e7a3b0",inside:"#5a2a3c",sad:.6}))}function Wg(){return We("coward.torso",{x0:-16,y0:-40,x1:16,y1:12},(n,e)=>{const t=r=>Qt(r,n,e),i=[[-11,8],[-13,-4],[-13,-18],[-11,-29],[-3,-35],[6,-34],[11,-28],[12,-16],[11,-3],[13,7],[9,5],[7,10],[3,6],[0,10],[-3,6],[-7,10]],s=Q(Et(t([[-12,-26],[-4,-27],[-3,-18],[-11,-17]]),1.5),_e.butter,{stroke:C,over:Zn(t([[-11.5,-21.5],[-3.5,-22.5]]),2.8,1.2)})+Q(Et(t([[2,-12],[10,-13],[10,-4],[3,-3]]),1.5),_e.pink,{stroke:C})+le(Ke(t([[-8,-8],[-3,-6],[1,-9]])),C,cn.blanketDeep)+le(Ke(t([[3,-32],[5,-24],[3,-16]])),C,cn.blanketDeep);return Q(`M${i.map(([r,o])=>`${n+r} ${e+o}`).join("L")}Z`,cn.blanket,{inner:s,over:ca(n-2,e-5,8,4.5,_e.cream,5,-8)})})}function Xg(){return We("coward.arm",{x0:-7,y0:-5,x1:7,y1:21},(n,e)=>Q(Mn([n,e],[n,e+16],9,8,.4),cn.blanket,{over:le(`M${n-3} ${e+12}q3 2 6 0`,C,cn.blanketDeep)}),{far:!0})}function qg(){return We("coward.fore",{x0:-7,y0:-4,x1:8,y1:27},(n,e)=>{let t=Q(Ke(Qt([[-3,16],[3,16],[4.5,20],[3,24],[-1,25],[-3.5,21]],n,e))+"Z",cn.face,{stroke:C*1.2});return t+=Q(Mn([n,e],[n,e+17],8,7,.2),cn.blanket,{over:le(`M${n-4} ${e+14}H${n+4}`,C,cn.blanketDeep)}),t},{far:!0})}function Yg(){return We("coward.thigh",{x0:-7,y0:-4,x1:7,y1:23},(n,e)=>Q(Mn([n,e],[n,e+19],9.5,8,.3),cn.pyjama,{inner:le(`M${n-2} ${e-2}V${e+22}M${n+2} ${e-2}V${e+22}`,.9,cn.pyjamaLine)}),{far:!0})}function Zg(){return We("coward.shin",{x0:-6,y0:-4,x1:6,y1:22},(n,e)=>Q(Mn([n,e],[n,e+19],8,7,.2),cn.pyjama,{inner:le(`M${n-1.5} ${e-2}V${e+21}M${n+2} ${e-2}V${e+21}`,.9,cn.pyjamaLine)}),{far:!0})}function Kg(){return We("coward.foot",{x0:-8,y0:-4,x1:13,y1:8},(n,e)=>Q(Ke(Qt([[-4,-2],[-6,2],[-5,6],[6,6],[11.5,5],[10,1.5],[3,-2]],n,e))+"Z",cn.foot,{stroke:C*1.2,over:le(`M${n+8} ${e+5.5}l0.5 -2M${n+5.5} ${e+5.8}l0.4 -2`,C*.7)}),{far:!0})}function Qg(){return We("coward.torch",{x0:-9,y0:-58,x1:9,y1:26},(n,e)=>{let t=Q(Mn([n,e+24],[n+1,e-40],6,7,.3),cn.wood,{over:da([n,e+20],[n+1,e-36],5,61,{n:2,knots:1})});return t+=Q(Et([[n-7,e-53],[n+8,e-53],[n+8,e-38],[n-7,e-38]],3),cn.wrap,{stroke:C*1.3,over:le(`M${n-7} ${e-48}l15 2M${n-7} ${e-43}l15 2`,C)}),t})}function Jg(){return We("coward.flame",{x0:-13,y0:-32,x1:13,y1:5},(n,e)=>{const t=s=>Qt(s,n,e);let i=tt(n,e-10,15,_e.butter,.5);return i+=Q(Ke(t([[-9,0],[-10,-9],[-5,-17],[-3,-27],[2,-18],[6,-25],[9,-12],[9,-2],[3,2]]))+"Z",cn.flame,{stroke:C*1.3,inner:ws(Ke(t([[-10,2],[-8,-6],[-2,-4],[4,-7],[10,-3],[10,4]]))+"Z",cn.flameEdge,.8)}),i+=`<path d="${Ke(t([[-4,-1],[-5,-8],[-1,-14],[3,-9],[4,-2]]))}Z" fill="${cn.flameCore}"/>`,i})}function jg(){return We("mech.head",{x0:-16,y0:-44,x1:18,y1:5},(n,e)=>{const t=c=>Qt(c,n,e);let i=le(`M${n-5} ${e-29}L${n-8} ${e-38}`,1.8)+`<circle cx="${n-8.5}" cy="${e-39}" r="2.2" fill="${dn.pink}" stroke="${at}" stroke-width="${C}"/>`;const s=Et(t([[-12,-26],[-5,-30],[10,-29],[15,-22],[16,-8],[12,-1],[-9,0],[-13,-8]]),4),r=ws(`M${n-20} ${e-34}H${n-5}V${e+4}H${n-20}Z`,dn.plateDeep)+le(`M${n-5} ${e-30}V${e}`,C)+le(`M${n-5} ${e-15}H${n+16}`,C)+`<circle cx="${n-9}" cy="${e-22}" r="1.2" fill="${dn.joint}" stroke="${at}" stroke-width="0.8"/><circle cx="${n-9}" cy="${e-6}" r="1.2" fill="${dn.joint}" stroke="${at}" stroke-width="0.8"/>`+Zn(t([[-3,-26],[4,-27.5]]),2.6,1.2);i+=Q(s,dn.plate,{inner:r});const o=n+8,a=e-20;return i+=`<circle cx="${o-2}" cy="${a}" r="3.2" fill="${dn.yellow}" stroke="${at}" stroke-width="${C*1.2}"/><circle cx="${o-2}" cy="${a}" r="1.2" fill="${at}"/>`,i+=le(`M${o+1.2} ${a}L${o+7} ${a}M${o+5} ${a}l0 2.4M${o+7} ${a}l0 3`,1.8),i+=`<path d="M${n+6.8} ${e-10}a2.4 2.4 0 1 1 4.4 0l1.2 5.2h-6.8z" fill="${at}"/>`,i})}function e3(){return We("mech.torso",{x0:-16,y0:-42,x1:17,y1:8},(n,e)=>{const t=o=>Qt(o,n,e),i=Et(t([[-10,5],[-12,-10],[-12,-30],[-6,-38],[7,-38],[13,-31],[13,-10],[10,5]]),4);let s="";[-8,-3,2,7].forEach((o,a)=>{s+=Q(`M${n+o} ${e+2}V${e-10}L${n+o+1.6} ${e-12.5}L${n+o+2.6} ${e-10}L${n+o+3.6} ${e-12.5}L${n+o+4.8} ${e-10}V${e+2}Z`,a%2?dn.pink:dn.yellow,{stroke:C})});const r=le(`M${n-12} ${e-15}H${n+13}`,C)+Q(Et(t([[-9,-34],[3,-34],[3,-19],[-9,-19]]),2),"#f6e8ef",{stroke:C*1.1,inner:$f(n-8,e-33,10,13,dn.maze,3,1.1)})+Q(Et(t([[5,-33],[11,-33],[11,-25],[5,-25]]),1),dn.photo,{stroke:C,inner:`<circle cx="${n+8}" cy="${e-30}" r="1.6" fill="${_e.lilac}"/>`})+Zn(t([[6,-22],[11,-21]]),2.4,1.2)+s;return Q(i,dn.plate,{over:r})})}function t3(){return We("mech.arm",{x0:-7,y0:-7,x1:7,y1:25},(n,e)=>Q(Et([[n-4,e],[n+4,e],[n+3.6,e+21],[n-3.6,e+21]],2),dn.plate,{stroke:C*1.2,over:Zn([[n,e+5],[n,e+17]],3.2,1.6)})+Q(Et([[n-6,e-5],[n+6,e-5],[n+5.5,e+5],[n-5.5,e+5]],2.5),dn.blue,{stroke:C*1.2}),{far:!0})}function n3(){return We("mech.fore",{x0:-8,y0:-5,x1:8,y1:33},(n,e)=>{let t=So([n,e+22],Math.PI/2,.8,[7,8,7],2.8,dn.plateDeep,71,.2);return t+=Q(Et([[n-3.6,e],[n+3.6,e],[n+3.2,e+22],[n-3.2,e+22]],2),dn.plate,{stroke:C*1.2,over:le(`M${n-3} ${e+8}H${n+3}M${n-3} ${e+15}H${n+3}`,C*.9)}),t+=`<circle cx="${n}" cy="${e}" r="3.2" fill="${dn.joint}" stroke="${at}" stroke-width="${C*1.1}"/>`,t},{far:!0})}function i3(){return We("mech.thigh",{x0:-7,y0:-6,x1:7,y1:25},(n,e)=>Q(Et([[n-5,e-1],[n+5,e-1],[n+4.4,e+21],[n-4.4,e+21]],2.5),dn.plate,{stroke:C*1.2,over:Q(Et([[n-4,e+9],[n+4,e+9],[n+4,e+15],[n-4,e+15]],1),dn.pink,{stroke:C})+Zn([[n+1,e+2],[n+1,e+8]],2.6,1.3)})+`<circle cx="${n}" cy="${e}" r="3.4" fill="${dn.joint}" stroke="${at}" stroke-width="${C*1.1}"/>`,{far:!0})}function s3(){return We("mech.shin",{x0:-6,y0:-6,x1:6,y1:25},(n,e)=>Q(Et([[n-4.2,e-1],[n+4.2,e-1],[n+3.6,e+21],[n-3.6,e+21]],2),dn.plate,{stroke:C*1.2,over:Zn([[n,e+4],[n,e+17]],3,1.5)})+`<circle cx="${n}" cy="${e}" r="3.2" fill="${dn.joint}" stroke="${at}" stroke-width="${C*1.1}"/>`,{far:!0})}function r3(){return We("mech.foot",{x0:-8,y0:-4,x1:14,y1:8},(n,e)=>Q(Et(Qt([[-6,-2],[4,-2],[13,2],[13,6],[-7,6]],n,e),[2,2,2,1.5,1.5]),dn.plateDeep,{stroke:C*1.2,over:ws(`M${n-8} ${e+3.5}H${n+14}V${e+7}H${n-8}Z`,dn.yellow)+le(`M${n-7} ${e+3.5}H${n+13}`,C)}),{far:!0})}function a3(){return[zg(),Wg(),Xg(),qg(),Yg(),Zg(),Kg(),Qg(),Jg(),Er("coward.brow",cn.hair,9,2.8,{sad:1,stroke:C}),...Hg(),...Vg(),jg(),e3(),t3(),n3(),i3(),s3(),r3(),Er("mech.brow","#5b5d6b",10,3,{stroke:C})]}const o3={hip:42,thigh:19,shin:19,torso:34,shoulderY:30,shoulderX:2,upper:16,hipX:3,headX:1,hand:22,eye:[7.4,-18.5],brow:{part:"coward.brow",up:5.2,dx:0},face:{eye:"coward",mouth:"coward",mouthAt:[10.5,-7.5]}},l3={hip:46,thigh:21,shin:21,torso:38,shoulderY:33,shoulderX:2,upper:21,hipX:4,headX:1,hand:28,eye:[7,-20],brow:{part:"mech.brow",up:6,dx:-1.5}},c3=(()=>{const n=As("coward","coward",o3,!1);return n.joints.push({id:"torch",parent:"foreR",x:0,y:22,part:"coward.torch",z:72}),n.joints.push({id:"flame",parent:"torch",x:1,y:-50,part:"coward.flame",z:73,spring:{k:120,c:6,lag:.5,gain:.004,tip:[0,-26]}}),n.attach.flame={joint:"torch",x:1,y:-58},n})(),h3=As("mech","mech",l3,!1),Fr=(n,e,t)=>n.map(([i,s])=>[i+e,s+t]);function Or(n,e,t,i={}){const r=-e.x0+6,o=-e.y0+6;return{key:n,w:Math.ceil(e.x1-e.x0+12),h:Math.ceil(e.y1-e.y0+12),px:r,py:o,body:t(r,o),scale:1.5,...i}}const Tn={body:"#c4a7df",bodyLine:"#9a7fc0",patch:"#aacf8f",patchDeep:"#8fbf74",dash:"#7fb86a",tag:"#f3e08e",tagRim:"#e7a3c6",goggle:"#d6e271",hoof:"#f1d76a",cuff:"#f3e08e",eye:"#3b2d45"},wr=Ci*1.25;function qi(n,e,t,i,s,r=Tn.patch){const o=new an(s),a=[],c=7;for(let l=0;l<c;l++){const h=l/c*Math.PI*2,u=1+o.range(-.28,.22);a.push([n+Math.cos(h)*t*u,e+Math.sin(h)*i*u])}return Q(de(a),r,{stroke:C*1.3})}function Yf(n,e,t,i=Tn.dash){let s="";for(let r=0;r<n.length-1;r++){const o=n[r],a=n[r+1],c=Math.hypot(a[0]-o[0],a[1]-o[1]),l=(a[0]-o[0])/c,h=(a[1]-o[1])/c;for(let u=e/2;u<c;u+=e){const f=o[0]+l*u,d=o[1]+h*u;s+=`<path d="M${f-l*t/2} ${d-h*t/2}L${f+l*t/2} ${d+h*t/2}" stroke="${at}" stroke-width="${t*.55+1.6}" stroke-linecap="round"/>`,s+=`<path d="M${f-l*t/2} ${d-h*t/2}L${f+l*t/2} ${d+h*t/2}" stroke="${i}" stroke-width="${t*.55}" stroke-linecap="round"/>`}}return s}function f3(){return Or("horse.body",{x0:-108,y0:-18,x1:100,y1:80},(n,e)=>{const t=h=>Fr(h,n,e),i=[[-104,14],[-98,-4],[-80,-14],[-58,-12],[-30,-4],[10,0],[44,-6],[66,-16],[86,-8],[100,10],[102,30],[92,50],[74,64],[44,64],[16,68],[-16,68],[-44,62],[-66,66],[-90,56],[-104,36]],s=qi(n-78,e+36,18,13,1)+qi(n-30,e+54,22,10,2)+qi(n+36,e+44,16,11,3)+qi(n+76,e+18,12,16,4,Tn.patchDeep)+qi(n-50,e+4,10,6,5),r=n-6,o=e+14,a=[];for(let h=0;h<=16;h++){const u=h/16*Math.PI*2,f=h%2?1:.86;a.push(`${r+Math.cos(u)*21*f} ${o+Math.sin(u)*12*f}`)}const c=Q(`M${a.join("L")}Z`,Tn.tagRim,{stroke:C*1.2})+Q(`M${r-15} ${o-7}H${r+15}V${o+7}H${r-15}Z`,Tn.tag,{stroke:C*1.3})+Ul(r-12,o-4.5,24,3.5,17,"#6a4a8a",1.4)+Ul(r-9,o+1.5,18,3.5,18,"#6a4a8a",1.4),l=Yf(t([[-86,-6],[-60,-4],[-30,4],[10,8],[44,2],[70,-6]]),11,5)+Zn(t([[-60,30],[-50,44],[-54,56]]),5,2.4,at,1.4)+le(de(t([[60,6],[70,30],[62,52]]),1,!1),1.6,Tn.bodyLine)+c;return Q(de(t(i)),Tn.body,{stroke:wr,inner:s,over:l})})}function u3(){return Or("horse.neck",{x0:-24,y0:-86,x1:64,y1:22},(n,e)=>{const t=s=>Fr(s,n,e);return Q(de(t([[-20,18],[-18,-10],[0,-44],[22,-72],[42,-82],[60,-70],[52,-48],[36,-20],[26,8],[14,22]])),Tn.body,{stroke:wr,inner:qi(n+18,e-20,10,16,11)+qi(n+46,e-64,7,6,12,Tn.patchDeep),over:Yf(t([[-12,-8],[4,-40],[24,-66],[42,-78]]),12,5)})})}function d3(){return Or("horse.head",{x0:-18,y0:-34,x1:86,y1:56},(n,e)=>{const t=a=>Fr(a,n,e),i=[[-14,-6],[-2,-18],[18,-16],[42,-4],[64,14],[80,30],[81,42],[70,50],[54,47],[40,38],[22,30],[4,26],[-10,14]],s=[];for(let a=0;a<=10;a++)s.push(`${n+40+a*3.4} ${e+37.5+(a%2?2.4:-.6)+a*.8}`);const r=le(`M${s.join("L")}`,C*1.3)+`<path d="${de(t([[68,32],[74,30],[76,36],[70,38]]))}" fill="${at}"/>`+Q(xe(n+17,e-5,11,8),Tn.goggle,{stroke:C*1.5,inner:le(`M${n+8} ${e-1}l18 -8`,1,"#aab84a")})+Q(xe(n+18,e-5,5,4.4),"#fbf6ee",{stroke:C*1.2,inner:`<circle cx="${n+19.5}" cy="${e-5}" r="2.6" fill="${Tn.eye}"/>`})+le(`M${n+29} ${e-1}q10 4 16 12`,C*1.2,"#aab84a")+qi(n+40,e+20,7,5,21)+le(de(t([[4,24],[18,14],[30,20]]),1,!1),1.6,Tn.bodyLine);let o=Q(de(t([[-6,-14],[-2,-30],[6,-16]])),Tn.body,{stroke:C*1.5});return o+=Q(de(t(i)),Tn.body,{stroke:wr,over:r}),o})}function p3(){return Or("horse.tail",{x0:-70,y0:-12,x1:10,y1:96},(n,e)=>{const t=r=>Fr(r,n,e),i=(r,o)=>{const a=t(r);return Q(ce(a,o,1.6),Tn.body,{stroke:C*1.5,inner:`<path d="${ce(a.slice(-2),o*.5,1.4)}" fill="${Tn.patch}"/>`})};let s=i([[0,0],[-20,14],[-34,40],[-46,70],[-60,90]],12);return s+=i([[-6,4],[-20,30],[-24,58],[-34,84]],9),s+=i([[-2,2],[-30,12],[-50,30],[-64,44]],8),s})}function Uh(n,e,t){return Or(n,{x0:-18,y0:-10,x1:18,y1:e+8},(i,s)=>Q(ce(Fr([[0,-6],[2,e*.3],[1,e*.7],[0,e]],i,s),t,t*.42),Tn.body,{stroke:wr,inner:qi(i-2,s+e*.35,t*.3,e*.16,e),over:le(`M${i-t*.3} ${s+e*.62}q${t*.25} ${e*.18} 0 ${e*.3}`,1.5,Tn.bodyLine)}),{far:!0})}function Nh(n,e){return Or(n,{x0:-16,y0:-6,x1:20,y1:e+12},(t,i)=>{let s=Q(ce(Fr([[0,0],[0,e*.55],[1,e-10]],t,i),10,7.5),Tn.body,{stroke:wr*.9});s+=Q(`M${t-10} ${i+e-8}L${t+9} ${i+e-9}L${t+15} ${i+e+2}L${t+14} ${i+e+8}L${t-11} ${i+e+8}L${t-12} ${i+e}Z`,Tn.hoof,{stroke:wr*.9});const r=i+e-12;return s+=Q(`M${t-8} ${r-5}L${t+8} ${r-6}L${t+9} ${r+4}L${t+6} ${r+1}L${t+3.5} ${r+6}L${t+1} ${r+1.5}L${t-2} ${r+6.5}L${t-4.5} ${r+1.5}L${t-7} ${r+5.5}L${t-9} ${r+1}Z`,Tn.cuff,{stroke:C*1.4}),s},{far:!0})}function m3(){return[f3(),u3(),d3(),p3(),Uh("horse.fu",44,30),Nh("horse.fl",40),Uh("horse.hu",48,36),Nh("horse.hl",42)]}const g3={id:"horse",joints:[{id:"root",parent:null,x:0,y:0,z:0},{id:"body",parent:"root",x:0,y:-118,part:"horse.body",z:50},{id:"tail",parent:"body",x:-98,y:6,part:"horse.tail",z:45},{id:"neck",parent:"body",x:78,y:8,part:"horse.neck",z:52},{id:"head",parent:"neck",x:46,y:-70,part:"horse.head",z:53},{id:"fuR",parent:"body",x:62,y:40,part:"horse.fu",side:"R",z:60},{id:"flR",parent:"fuR",x:0,y:44,part:"horse.fl",side:"R",z:61},{id:"huR",parent:"body",x:-60,y:34,part:"horse.hu",side:"R",z:60},{id:"hlR",parent:"huR",x:0,y:48,part:"horse.hl",side:"R",z:61},{id:"fuL",parent:"body",x:56,y:40,part:"horse.fu",side:"L",z:60},{id:"flL",parent:"fuL",x:0,y:44,part:"horse.fl",side:"L",z:61},{id:"huL",parent:"body",x:-54,y:34,part:"horse.hu",side:"L",z:60},{id:"hlL",parent:"huL",x:0,y:48,part:"horse.hl",side:"L",z:61}],attach:{saddle:{joint:"body",x:6,y:-6},muzzle:{joint:"head",x:74,y:42},hoofFR:{joint:"flR",x:0,y:44},hoofFL:{joint:"flL",x:0,y:44},hoofHR:{joint:"hlR",x:0,y:46},hoofHL:{joint:"hlL",x:0,y:46}},animations:["emerge","idle","gallop","jump","land","rear","kneel","dissolve"]},Tt=R.ink,xt=n=>Math.round(n*100)/100,_3=n=>n!==1?` opacity="${xt(n)}"`:"",Zf=(n,e=1)=>de(n,e,!1),ie=(n,e,t,i=1)=>k(Zf(n),e,t,i),qt=(n,e,t,i,s=1)=>`<circle cx="${xt(n)}" cy="${xt(e)}" r="${xt(t)}" fill="${i}"${_3(s)}/>`,gn=(n,e,t,i,s,r=1)=>ge(xe(n,e,t,i),s,r),Gt=(n,e,t=1)=>ge(de(n),e,t),_r=(n,e,t)=>n.map(([i,s])=>[i+e,s+t]);function Qr(n,e){const t=n[0][0]<=n[n.length-1][0]?n:[...n].reverse();if(e<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++){const s=t[i-1],r=t[i];if(e<=r[0])return s[1]+(r[1]-s[1])*(e-s[0])/(r[0]-s[0]||1)}return t[t.length-1][1]}function ct(n,e,t,i,s,r){const o=n.startsWith("whale")?r:Ff(r);return{key:n,w:e,h:t,px:i,py:s,body:o,scale:Math.max(e,t)>320?1.5:2}}function M3(n,e,t,i){const s=[];for(let r=0;r<t;r++){const o=r/t*Math.PI*2,a=i(o,r);s.push([n+Math.cos(o)*a,e+Math.sin(o)*a])}return s}const Ln={fill:"#4f6d8f",shade:"#3b5470",light:"#7f9dbe",groove:"#c7ccde"};function v3(){const n=[[417,80],[413,68],[399,59],[377,52],[352,47],[332,42],[303,36],[264,32],[222,33],[182,37],[143,44],[110,52],[80,59],[52,65],[32,68],[20,70],[15,74],[20,78],[34,81],[58,87],[94,97],[140,109],[190,117],[240,120],[290,118],[330,112],[364,103],[392,94],[410,87]],e=[[418,83],[380,89],[340,89],[300,95],[260,102],[220,108],[190,111]],t=[[418,83],[400,91],[380,98],[360,104],[340,109],[320,113.5],[300,116.5],[280,118],[260,119.5],[240,120],[220,119.5],[190,117.5]];let i="";[.14,.3,.46,.62,.78,.92].forEach((u,f)=>{const d=[],m=409-f*3,_=200+f*9;for(let p=m;p>=_;p-=16)d.push([p,Qr(e,p)+u*(Qr(t,p)-Qr(e,p))]);i+=ie(d,Ln.groove,f===0?1.9:1.6,.78)});const r=new an(4210);let o="";for(let u=0;u<56;u++){const f=r.range(46,330),d=Qr([[40,66],[120,48],[200,38],[280,36],[330,44]],f)+7,m=Qr([[40,80],[120,95],[200,104],[280,100],[330,90]],f),_=r.range(d,m),p=r.range(1.2,3.4),g=r.chance(.62);o+=ge(xe(f,_,p*r.range(1.1,1.9),p),g?"#6f8bab":"#3f5a79",g?.6:.5)}`${Zf([[8,75],[60,85],[120,99],[190,108],[260,111],[320,105],[372,95],[424,84]])}`;const a=ie([[333,66],[340,63.5],[350,63.5],[356,66.5]],Ln.shade,2.2)+gn(345,70,7.5,5.5,"#445f80")+gn(345.5,70.5,4.3,3.3,Tt)+qt(346.8,69.4,1.2,"#c7ccde")+ie([[337,75],[345,77.5],[353,76]],Ln.shade,1.6,.9),c=o+ie([[300,41],[330,46],[362,52],[396,63]],Ln.light,2,.55)+ie([[314,44],[323,40],[333,41.5]],Ln.shade,2.4)+ie([[316,46.5],[324,43.5],[331,44.5]],Ln.light,1.3,.8)+ie([[70,73],[130,77.5],[190,81],[236,83]],Ln.shade,1.4,.35)+i+ie([[417,81],[398,85.5],[376,87.5],[356,86.5],[341,83.5],[334,80]],Tt,2.6)+ie([[334,80],[331,76.5]],Tt,2)+a,l=ue(wt([[128,52],[117,45],[106,40],[99,38,1],[103,45],[101,56]]),{fill:Ln.fill,stroke:3}),h=ue(de(n,.95),{fill:Ln.fill,stroke:4,over:c});return ct("whale.body",420,150,210,75,l+h)}function x3(){return ct("whale.fin",120,60,108,12,ue(de([[113,5],[99,8],[78,15],[55,25],[34,37],[18,47],[9,54],[17,55.5],[35,50],[58,42],[81,33],[100,25],[113,19],[118,12]],.9),{fill:Ln.fill,stroke:3,over:ie([[106,13],[82,21],[56,32],[30,44]],Ln.shade,1.5,.8)+ie([[16,52.5],[34,48],[56,40.5]],Ln.groove,1.5,.65)+ie([[70,22],[66,24.5]],Ln.light,1.4,.8)+ie([[48,31],[44,33.5]],Ln.light,1.4,.8)}))}function y3(){const n=[[109,58.5],[96,56],[80,50],[62,38],[44,24],[26,12],[10,6,1],[16,17],[22,31],[30,45],[38,55],[45,60.5,1],[38,66],[30,76],[22,90],[16,104],[10,114,1],[26,108],[44,96],[62,82],[80,70],[96,64.5],[109,62.5]];lt([[0,62],[60,66],[112,63.5],[112,122],[0,122]]);const e=ie([[98,59],[70,46],[44,30],[22,13]],Ln.light,1.6,.8)+ie([[96,61],[70,60.5],[50,60.5]],Ln.shade,1.6,.9)+ie([[34,30],[40,34]],Ln.groove,1.4,.7)+ie([[27,40],[31,44]],Ln.groove,1.3,.6)+ie([[30,88],[36,84]],Ln.groove,1.3,.45);return ct("whale.fluke",110,120,100,60,ue(wt(n),{fill:Ln.fill,stroke:3.2,over:e}))}const Yi={fill:R.sparrow,shade:R.sparrowDark,light:R.sparrowLight,throat:"#e8dcca",bib:"#33251f",edge:"#f2c69c"};function rc(n,e,t,i,s,r,o){const a=-Math.cos(r),c=Math.sin(r),l=Math.sin(r),h=Math.cos(r),u=p=>p.map(([g,b])=>[n+a*g*t+l*b*i,e+c*g*t+h*b*i]),f=[];for(let p=0;p<s;p++){const g=s>1?p/(s-1):0,b=1-.36*g,E=-.2+.3*g,v=-.1+.72*g;f.push({path:[[.24,E],[.24+(b-.24)*.55,(E+v)/2+.03],[b,v]],len:b,vt:v})}const d=[[.02,-.3],[.5,-.36],[.9,-.22]];for(const p of f)d.push([p.len-.06,p.vt+.02]);d.push([.36,.6],[.14,.42],[0,.2]);let m=ue(de(u(d),.8),{fill:o.featherShade,stroke:o.stroke});for(const p of f)m+=ue(ce(u(p.path),i*.46,i*.3),{fill:o.feather,shade:o.featherShade,stroke:o.featherStroke}),m+=ie(u(p.path.slice(1).map(([g,b])=>[g,b-.12])),o.edge,Math.max(.7,i*.06),.85);return m+=ue(de(u([[-.02,-.3],[.12,-.42],[.3,-.44],[.48,-.34],[.58,-.16],[.54,.02],[.42,.14],[.26,.26],[.1,.3],[-.03,.14]])),{fill:o.covert,shade:o.covertShade,light:o.covertLight,stroke:o.stroke,over:ie(u([[.2,-.12],[.3,.04]]),o.covertShade,Math.max(.7,i*.06))+ie(u([[.34,-.18],[.44,-.02]]),o.covertShade,Math.max(.7,i*.06))}),o.bar&&(m+=ie(u([[.06,.24],[.24,.2],[.42,.08],[.53,-.06]]),o.bar,Math.max(1,i*.1))),m+=ie(u([[.03,-.31],[.2,-.39],[.4,-.35]]),o.covertLight,Math.max(.8,i*.07),.9),m}function S3(){const n=ie([[29,34],[28,40.5]],"#5a4535",1.8)+ie([[25.5,41.5],[28,40.5],[31,41.8]],"#5a4535",1.4)+ie([[34,34],[34.5,40.5]],"#5a4535",1.8)+ie([[32,41.8],[34.5,40.5],[37.5,41.8]],"#5a4535",1.4),e=ue(wt([[19,20.5],[11,17.5],[2.5,16.5,1],[5,20.5],[2,23.5,1],[6.5,26],[19,28.5]]),{fill:Yi.shade,stroke:2.2,over:ie([[17,22.5],[9,20.5],[4,20.5]],Yi.edge,1,.8)+ie([[17,25.5],[8,24.5]],"#4a3423",1)}),t=[[14,25],[17,18],[24,13.5],[32,11.5],[38,8.5],[42,4.5],[48,3],[52.5,5],[55,9],[54.8,13],[52.5,18],[50.5,24],[46.5,30],[40,34.5],[31,36],[23,34.5],[17,31]],i=Gt([[40,7],[44,3.6],[49,2.8],[53,5],[52,7.4],[47,6.4],[42,8.8]],"#6c6264")+Gt([[43,9.8],[49,10.2],[53.5,12.5],[55.5,15],[52.5,19.5],[48,22.5],[44.5,17.5]],Yi.throat)+Gt([[51,14.5],[54.2,14.2],[53.5,19],[50.5,24.5],[47.2,22.5],[48.3,18]],Yi.bib)+Gt([[37,9.5],[42,8.6],[47,9.2],[44.5,11],[39,11.8]],"#7a4a2c")+Gt([[45,24],[49,25.5],[45,32],[37,35.5],[30,36],[33,31],[40,28]],"#c7ae8c")+ie([[21,18.5],[27,15.5]],"#4a3322",1.3)+ie([[25,21.5],[31,18]],"#4a3322",1.3)+ie([[33,15],[37,13]],"#4a3322",1.2)+qt(49.8,8.7,1.7,Tt)+qt(50.4,8.1,.55,"#f4ead8"),s=ue(de(t),{fill:Yi.fill,stroke:2.4,over:i}),r=ue(wt([[54,8.4],[59.4,11,1],[54,13.6]]),{fill:"#4a3a30",stroke:1.6});return ct("sparrow.body",60,46,30,34,n+e+s+r)}function b3(){const n=rc(38,8,33,15,5,.2,{covert:"#7d5536",covertShade:Yi.shade,covertLight:Yi.light,feather:"#5e4230",featherShade:"#45301f",edge:Yi.edge,bar:Yi.throat,stroke:2,featherStroke:1.05});return ct("sparrow.wing",46,28,38,8,n)}function T3(){const n={fill:R.ivory,shade:R.ivoryDark,light:"#f7f0e4"},e=ue(wt([[11.4,13.6],[5.4,13.8],[1.6,15.2,1],[4.2,17],[2.4,19.6,1],[6.8,19.2],[12,17.4]]),{fill:R.ivoryDark,stroke:1.6,over:ie([[10,16.2],[4,16.9]],R.violetDark,.9,.8)}),t=[[8,15],[10.5,10.4],[15,7.6],[20.5,6.4],[23.5,3.2],[28,1.9],[32,3.4],[34,7.2],[33.2,11.2],[30.4,14.8],[28.2,19],[23.4,22.4],[16.4,23.3],[10.8,21]],i=Gt([[22.2,5.4],[25,2.2],[29.5,1.4],[33,3.6],[34.4,6.4],[30.6,5.2],[26.2,5.6],[23.6,7.2]],R.violet),s=Gt([[27,5.3],[31,4.9],[34.4,6.4],[33.6,7.4],[30.2,6.6]],R.violetDark),r=i+s+ie([[24.2,3.6],[28.5,2.6]],R.vein,1,.9)+Gt([[25,16],[29.5,14],[29,18.5],[24,21.6],[18,22.6],[21,19]],"#f6efe3")+qt(29.3,7.6,1.35,Tt)+qt(29.7,7.2,.45,"#ffffff"),o=ue(de(t),{...n,stroke:2,over:r}),a=ue(wt([[33.2,6.3],[36.2,8.6,1],[33.2,10.6]]),{fill:R.crystalOrange,stroke:1.4});return ct("bird.a",36,26,18,14,e+o+a)}function E3(){const n=rc(24,6,18.5,9,4,.22,{covert:R.ivory,covertShade:R.ivoryDark,covertLight:"#f7f0e4",feather:li(R.ivoryDark,R.violet,.28),featherShade:li(R.ivoryDark,R.violetDark,.45),edge:"#f7f0e4",stroke:1.6,featherStroke:.9});return ct("bird.a.wing",30,18,24,6,n)}function w3(){const n={fill:R.crystalBlue,shade:R.crystalBlueDark,light:R.crystalBlueLight},e=a=>ue(ce(a,4.2,.9),{fill:R.crystalBlueDark,stroke:1.6}),t=e([[14,11],[8,7.8],[1.8,4.6]])+e([[14,13.4],[8,16.4],[2.4,20.2]]),i=[[10.5,12.2],[14.5,9.2],[20.5,7.8],[26.5,6.6],[30.5,4.6],[34.4,4.4],[37.4,6.6],[38.2,9.6],[36.4,12],[32.4,14],[26.4,15.9],[18.6,16.2],[12.6,14.8]],s=Gt([[13,14.2],[20,13.6],[28,12.6],[33.6,12.2],[31.4,14.4],[25.6,16.6],[17.6,16.8]],R.ivory)+Gt([[34.4,9.8],[38.6,9.8],[36.4,12.6],[33,12.8]],R.crystalOrange)+ie([[18,9.4],[27,8]],R.crystalBlueLight,1,.9)+qt(35,7.6,1.15,Tt)+qt(35.4,7.2,.4,"#ffffff"),r=ue(de(i),{...n,stroke:2,over:s}),o=ue(wt([[37.6,7.9],[40,9.2,1],[37.6,10.3]]),{fill:"#2b2840",stroke:1.2});return ct("bird.b",40,24,20,13,t+r+o)}function A3(){const n=rc(28,5,25,7.4,4,.14,{covert:R.crystalBlue,covertShade:R.crystalBlueDark,covertLight:R.crystalBlueLight,feather:"#3f6aa6",featherShade:"#2e5285",edge:R.crystalBlueLight,stroke:1.6,featherStroke:.9});return ct("bird.b.wing",34,16,28,5,n)}function R3(){const n={fill:R.crystalOrange,shade:R.crystalOrangeDark,light:R.crystalOrangeLight},e=(c,l,h,u,f)=>{const d=[c+u*h,l-h],m=[c-f,l],_=[c+f,l],p=[c+u*h*.3+f*.15,l-h*.3];return ge(lt([m,d,_]),R.crystalTeal)+ge(lt([d,_,p]),R.crystalTealDark)+ge(lt([m,d,[m[0]+f*.55,l]]),R.crystalTealLight)+k(lt([m,d,_],!1),Tt,1)},t=tt(22.6,5,6.5,R.crystalTealLight,.35)+e(19.2,8.4,6.6,-.45,2.3)+e(26.2,8.2,6,.42,2.1)+e(22.7,7.6,7,.03,2.6),i=[[6.6,19.6],[6.4,14.8],[8.9,11.8],[12.6,10.8],[15.6,9.2],[17.4,6.8],[21,5.4],[25.4,5.6],[28.4,8],[29.6,11.2],[28.3,14.2],[27.4,17],[26.2,20.4],[22.6,24],[16.8,25.8],[11.2,24.8],[8,22.8]],s=Gt([[26.6,16.4],[26.8,20.4],[22.8,23.8],[16.8,25.4],[18.6,21.6],[23.2,19]],R.crystalOrangeLight)+ie([[8.9,12.4],[7.6,11.2]],R.crystalOrangeDark,1)+ie([[11.8,11.4],[11.2,9.8]],R.crystalOrangeDark,1)+ie([[21,24],[21.8,25.8]],R.crystalOrangeDark,1)+gn(24.9,10.6,2.1,2.3,Tt)+qt(25.5,9.8,.75,"#ffffff")+ie([[22.2,8],[24.2,7.3]],R.crystalOrangeDark,.9,.9),r=ue(de(i),{...n,stroke:2,over:s}),o=ue(wt([[28.6,10.4],[32.6,11.9,1],[28.4,13]]),{fill:"#e8c16a",stroke:1.2})+ue(wt([[28.6,12.8],[31.4,13.3,1],[28.2,14.5]]),{fill:"#d9a653",stroke:1.1}),a=ie([[13.6,25.4],[13,26.9]],"#c77f4a",1.2)+ie([[18.4,25.6],[18.8,26.9]],"#c77f4a",1.2);return ct("bird.c",34,28,17,15,a+r+t+o)}function C3(){const n=[[21.4,3.2],[15,3],[9,4.8],[4.8,7.6],[2.6,11,1],[5.8,11.2],[7,13.6,1],[9.8,12],[12,13.8,1],[14.6,11.8],[18.4,9.8],[21.8,6.6]],e=ie([[13,7.4],[7,13.6]],R.crystalOrangeDark,.9)+ie([[16,8],[12,13.8]],R.crystalOrangeDark,.9)+ie([[18.6,5],[11,5.2]],R.crystalOrangeLight,1,.95)+qt(6,9.4,1.1,R.crystalTeal,.95);return ct("bird.c.wing",24,16,19,5,ue(wt(n),{fill:"#cc8752",stroke:1.7,over:e}))}const Kf={fill:"#8fa6bf",shade:"#62799a",light:"#cfdceb",belly:"#b9c8d9",fin:"#7f97b3",finShade:"#5d7592",finLight:"#b9c9dc"},Qf={fill:R.crystalTeal,shade:R.crystalTealDark,light:R.crystalTealLight,belly:"#bfe9e1",fin:"#3fa394",finShade:"#2c7a6f",finLight:R.crystalTealLight},Jf={fill:R.crystalOrange,shade:R.crystalOrangeDark,belly:"#f2cfa6",fin:R.violet,finShade:R.violetDark,finLight:"#b98ae6"},$s=(n,e,t=1.5,i="")=>ue(wt(n),{fill:e.fin,shade:e.finShade,light:e.finLight,stroke:t,over:i}),xs=(n,e,t,i=.8,s=.85)=>e.map(r=>k(`M${xt(n[0])} ${xt(n[1])}L${xt(r[0])} ${xt(r[1])}`,t,i,s)).join("");function jf(n,e,t,i,s,r,o,a,c){let l="",h=0;for(let u=t;u<=i;u+=r,h++)for(let f=n+h%2*(s/2);f<=e;f+=s)l+=`M${xt(f)} ${xt(u-o)}q${xt(-o*1.1)} ${xt(o)} 0 ${xt(o*2)}`;return k(l,a,.8,c)}function L3(){const n=Kf,e=$s([[15,8],[19,2.6,1],[26,1.6],[32,3.4],[35,6.2]],n,1.5,xs([25,8],[[19,3],[23,2],[27,2],[31,3.6]],n.finShade)),t=$s([[12,16.4],[14,21,1],[18,18.6]],n,1.3)+$s([[22,18.6],[24.5,22.6,1],[28.5,19]],n,1.3),i=[[3.8,12],[8,9.8],[14,7.2],[20,5.2],[28,4.2],[35,5],[41,7],[45,9.4],[46.6,12],[45,14.6],[40,17.2],[33,19.2],[25,19.8],[17,18.2],[11,16.2],[6.4,14.4]],s=Gt([[8,14],[16,15],[26,15.6],[36,15.2],[44,13.8],[40,17.6],[30,20.6],[18,19.4]],n.belly)+jf(12,33,8,16,4,2.8,1.3,n.shade,.55)+ie([[8,11.4],[18,10.4],[30,10],[35,10.4]],n.light,.9,.8)+ie([[35.6,5.8],[33.8,10.5],[35.4,16.2]],n.shade,1.3)+gn(39.4,9.6,2.3,2.3,"#e6edf4")+qt(39.8,9.7,1.35,Tt)+qt(39.2,9,.45,"#ffffff")+ie([[45.4,12.4],[46.8,12.6]],Tt,.9),r=ue(de(i),{fill:n.fill,stroke:2,over:s}),o=ue(wt([[33.6,13.6],[28.4,14.2],[26.4,15.8,1],[28.6,16.8],[33,15.4]]),{fill:n.finLight,stroke:1,ink:n.finShade,over:xs([33,14.4],[[27.4,15],[27.8,16.4]],n.finShade,.6,.8)}),a=ie([[45,13.6],[46.2,15.6],[44.6,17.4]],Tt,.9);return ct("fish.a",48,24,26,12,e+t+r+o+a)}function P3(){const n=Kf,e=[[19.5,9],[13,7.6],[8,4.6],[2.5,2,1],[4.2,6.6],[7.4,11,1],[4.2,15.4],[2.5,20,1],[8,17.4],[13,14.4],[19.5,13]],t=xs([17,11],[[4,3],[6,6.5],[8,9.5],[8,12.5],[6,15.5],[4,19]],n.finShade,.8,.9)+ie([[16,9.6],[10,7],[4.4,3.4]],n.finLight,.9,.9);return ct("fish.a.tail",20,22,18,11,ue(wt(e),{fill:n.fin,stroke:1.6,over:t}))}function D3(){const n=Qf,e=$s([[20,6.4],[24,2.6,1],[30,3.4],[32,6]],n,1.3),t=$s([[16,13.4],[19,17,1],[23,14]],n,1.2),i=[[3,10],[8,8.4],[15,6.8],[24,5.8],[32,5.8],[38,6.8],[42,8.5],[43.6,10],[42,11.6],[37,13.3],[30,14.4],[22,14.4],[14,13.4],[8,12],[4,10.8]],s=Gt([[8,11.4],[16,11.4],[26,11.6],[36,11.4],[42,10.8],[37,13.6],[28,15],[16,14.2]],n.belly)+ie([[6,10],[16,9.6],[28,9.4],[36,9.4]],"#2f6f67",1.3,.9)+ie([[10,8.2],[22,7],[32,7]],n.light,.9,.9)+ie([[34.4,6.6],[33.2,9.6],[34.2,12.6]],n.shade,1.1)+gn(38.2,8.8,1.9,1.9,"#e9f7f4")+qt(38.5,8.9,1.1,Tt)+qt(38,8.3,.4,"#ffffff"),r=ue(de(i),{fill:n.fill,stroke:1.9,over:s}),o=ue(wt([[32.6,11.4],[28.4,11.8],[26.6,13.2,1],[28.6,13.8],[32.2,12.8]]),{fill:n.finLight,stroke:.9,ink:n.finShade});return ct("fish.b",44,20,24,10,e+t+r+o)}function I3(){const n=Qf,e=[[17.4,8],[12,6.4],[7,3.6],[2,1.6,1],[4.8,6],[8,9,1],[4.8,12],[2,16.4,1],[7,14.4],[12,11.6],[17.4,10]],t=xs([15.5,9],[[3.5,2.6],[6,6],[6,12],[3.5,15.4]],n.finShade,.8,.9)+ie([[14,7.6],[8,5],[3.6,2.6]],n.finLight,.9,.9);return ct("fish.b.tail",18,18,16,9,ue(wt(e),{fill:n.fin,stroke:1.5,over:t}))}function k3(){const n=Jf,e=$s([[11,8.4],[14.4,2.6,1],[21.6,1.6],[28,3.4],[30.6,6.6]],n,1.4,xs([21,8],[[15,3],[19,2],[23,2.2],[27,3.6]],n.finShade)),t=$s([[13,20.6],[15,26,1],[21,25.6],[24,22.4]],n,1.3,xs([18,21],[[15.6,25],[19,25.4]],n.finShade)),i=[[4,14],[7.6,10.8],[12.6,7.4],[19,5.2],[26,5],[32,7],[36.2,10.2],[38.2,13.6],[37.2,17.2],[33.4,20.6],[27.4,23.2],[20,23.6],[13,21.6],[8,18.2],[4.8,15.6]],s=Gt([[10,17],[18,18.4],[28,18.2],[36,16.4],[33.6,20.8],[26,24],[16,23.6]],n.belly)+jf(13,29,9,17,4.2,3,1.4,n.shade,.5)+ie([[32.2,7.8],[30.2,13],[32,18.6]],n.shade,1.3)+gn(32.4,11.2,2.6,2.6,"#fbe9d3")+qt(32.8,11.3,1.55,Tt)+qt(32.1,10.5,.5,"#ffffff")+ie([[37.6,14.2],[36,15]],Tt,.9),r=ue(de(i),{fill:n.fill,stroke:2,over:s}),o=ue(wt([[28.4,14.6],[22.8,15.4],[20.6,17.4,1],[23.2,18.4],[27.8,16.8]]),{fill:n.finLight,stroke:1,ink:n.finShade,over:xs([27.8,15.6],[[21.8,16.4],[22.4,17.8]],n.finShade,.6,.8)});return ct("fish.c",40,28,22,14,e+t+r+o)}function U3(){const n=Jf,e=[[17.4,9.6],[12,7.2],[6.4,3.4],[2,2.6,1],[1.2,7.6],[3,11],[1.2,14.4],[2,19.4,1],[6.4,18.6],[12,14.8],[17.4,12.4]],t=xs([15.5,11],[[3,3.6],[2.4,7.6],[3.4,11],[2.4,14.4],[3,18.4]],n.finShade,.8,.9)+ie([[14,9],[8,5.6],[3.4,3.6]],n.finLight,.9,.9);return ct("fish.c.tail",18,22,16,11,ue(wt(e),{fill:n.fin,stroke:1.5,over:t}))}const Ht={fill:R.raccoon,shade:R.raccoonDark,light:R.raccoonLight,mask:"#2c2a35",white:"#e9e6ee",paw:"#3a3844",ring:"#3d3a47",tail:"#a4a1ab",chest:"#99969f"};function N3(n,e,t,i,s,r=1){const o=[];let a=0;for(let l=1;l<n.length;l++){const h=Math.hypot(n[l][0]-n[l-1][0],n[l][1]-n[l-1][1]);o.push(h),a+=h}let c="";for(const l of e){let h=l*a,u=0;for(;u<o.length-1&&h>o[u];)h-=o[u],u++;const f=n[u],d=n[u+1],m=o[u]||1,_=(d[0]-f[0])/m,p=(d[1]-f[1])/m,g=f[0]+_*h,b=f[1]+p*h;c+=`M${xt(g-p*t)} ${xt(b+_*t)}L${xt(g+p*t)} ${xt(b-_*t)}`}return k(c,i,s,r)}function e0(n,e,t){const i=n[n.length-1],s=n[n.length-2],r=Math.hypot(i[0]-s[0],i[1]-s[1])||1,o=[i[0]+(i[0]-s[0])/r*t*.25,i[1]+(i[1]-s[1])/r*t*.25];return ue(ce(n,e,t),{fill:Ht.tail,stroke:2.4,over:N3(n,[.2,.42,.63,.82],e,Ht.ring,e*.3)+gn(o[0],o[1],t*.75,t*.75,Ht.ring)})}function t0(n){const e=(r,o)=>{const a=(r[0][0]+r[1][0]+r[2][0])/3,c=(r[0][1]+r[1][1]+r[2][1])/3,l=r.map(([h,u])=>[a+(h-a)*.55,c+(u-c)*.55+.8]);return ue(de(r,.6),{fill:o?"#c9c6cf":"#dddae3",stroke:2.2,over:Gt(l,o?"#3a3844":"#4a4754")})},[t,i]=n.eye,s=Gt(n.cheek,"#d3d0d9")+Gt(n.mask,Ht.mask)+Gt(n.brow,Ht.white)+Gt(n.muzzle,Ht.white)+ie(n.stripe,"#4a4754",2)+gn(t,i,2.4,2.4,"#6e6b78")+gn(t,i,1.9,1.9,"#15131f")+qt(t+.7,i-.8,.75,"#e6e9f3")+gn(n.nose[0],n.nose[1],2.3,1.8,Tt)+qt(n.nose[0]-.6,n.nose[1]-.6,.55,"#8d8a98")+ie(n.mouth,Tt,1.1)+qt(n.nose[0]-6.2,n.nose[1]+1.6,.5,"#8a8794")+qt(n.nose[0]-5,n.nose[1]+3,.5,"#8a8794")+qt(n.nose[0]-7.4,n.nose[1]+3.2,.5,"#8a8794");return e(n.earFar,!0)+e(n.earNear,!1)+ue(de(n.outline),{fill:Ht.fill,stroke:2.6,over:s})}function F3(){let n=e0([[25,75.5],[15.5,79.2],[7.5,78],[3.8,71.5],[5,63.5]],12.5,8);return n+=ue(de([[20,81],[15.5,73],[15,63],[18.5,53],[25,45],[32,39],[40,36.5],[47,39],[51,45.5],[52.5,53],[50.5,61],[50.5,68.5],[53,76],[51,81.8],[40,82.4],[28,82.4]]),{fill:Ht.fill,stroke:2.8,over:Gt([[46.5,43.5],[51,48],[52.4,56],[50.4,64],[47.2,58.5],[45.4,50.5]],Ht.chest)+ie([[22.5,53],[25.5,49.5]],Ht.shade,1.2)+ie([[19.5,60],[22,56.5]],Ht.shade,1.2)+ie([[29,44.5],[32,42]],Ht.light,1.1,.9)}),n+=Gt([[26,70],[29,62.6],[36,59.6],[43,61],[47.6,66.4],[47.8,73],[43.6,78.4],[33,80],[27,77.4]],"#8a8792"),n+=Gt([[38,76.6],[44.6,72.6],[47.8,73],[46.6,77.6],[42,80.2]],Ht.shade),n+=ie([[27.4,69],[30.4,62.6],[37,59.8],[43.4,61.2],[47.4,65.8]],Tt,2),n+=ie([[31,63.4],[36.6,61.4]],Ht.light,1.2,.9),n+=ue(de([[42.4,77.2],[50,76.4],[57.6,77.8],[61.4,80.2],[59.4,82.4],[44,82.6]],.8),{fill:Ht.paw,stroke:2.2,over:ie([[56.4,79.2],[57.2,82.4]],"#1f1d27",.9)+ie([[53,79.4],[53.6,82.4]],"#1f1d27",.9)}),n+=ue(ce([[46,43.4],[52.8,45.8],[57.6,45.4]],6.4,5),{fill:Ht.shade,stroke:2.2}),n+=ue(xe(59.4,45.2,3.3,2.9),{fill:Ht.paw,stroke:1.8}),n+=t0({outline:[[33,26],[33.5,17.5],[37.5,11],[44.5,7.6],[51.5,9.2],[56,14],[61,18.5],[65.5,22.5],[65,27],[59,30],[51,33],[42.5,34],[36.5,31.5]],earFar:[[33.6,14.2],[34.6,4.4],[41,9.6]],earNear:[[42,9.2],[46.6,1.8],[50.6,8.6]],mask:[[39.5,18.5],[45.5,15.8],[53,15.3],[58.5,18.6],[56.6,22.8],[50.5,24.2],[44.6,27.2],[39,25.2]],brow:[[42.6,13.8],[49.5,11.6],[56.6,14.4],[56,16.2],[49.6,14.6],[44,16]],muzzle:[[54.8,21.6],[60,20.2],[64.6,23],[64.4,27.4],[58.6,29.6],[53.2,28],[52,24.6]],cheek:[[39.6,26.4],[45,27.2],[49.6,29.6],[44.4,32.8],[38.8,30.6]],stripe:[[49.6,9.6],[52.6,13.4],[56.2,17.8]],eye:[53.2,19.4],nose:[64.8,23.6],mouth:[[63.8,27],[61.2,28.2],[58.8,27.8]]}),n+=ue(ce([[41.6,44],[48.4,49.4],[54.2,50.8]],8,6),{fill:Ht.fill,stroke:2.4}),n+=ue(de([[53.4,48.6],[57,47.6],[59.8,49.6],[59.4,52.8],[55.6,53.8],[53,52]]),{fill:Ht.paw,stroke:1.9,over:ie([[57.2,49.2],[58.6,52.6]],"#1f1d27",.8)+ie([[55.4,49.4],[56.2,53.2]],"#1f1d27",.8)}),ct("raccoon.sit",74,84,37,84,n)}function O3(){const n=(i,s,r,o)=>ue(ce(i,s,r),{fill:o?Ht.shade:Ht.fill,stroke:2.4,over:ge(`M0 ${xt(i[i.length-1][1]-5)}H96V62H0Z`,Ht.paw)}),e=(i,s)=>ue(xe(i,57.9,4.6,2.4),{fill:s?"#2f2d38":Ht.paw,stroke:2});let t="";return t+=n([[33.4,41],[34.2,49],[35,56.2]],7.8,6,!0)+e(38,!0),t+=n([[53.8,41],[54.8,49],[55.8,56.2]],7.6,5.6,!0)+e(58.8,!0),t+=e0([[17,26],[10,22],[4.8,23.8],[4.2,30.4]],11.5,7.4),t+=ue(de([[12,31],[16,22.4],[26,17.2],[38,17.4],[50,21.6],[60,27],[66.4,33.4],[65.4,41],[57,45.6],[45,46.6],[33,45.8],[21,44.6],[14,39.6]]),{fill:Ht.fill,stroke:2.8,over:Gt([[26,42.6],[38,42],[50,41.6],[61,39.6],[58,46],[44,47.6],[30,46.6]],Ht.chest)+ie([[27,20.4],[31,19]],Ht.light,1.1,.9)+ie([[40,21.4],[44,22]],Ht.shade,1.1)+ie([[48,26.4],[52,28.2]],Ht.shade,1.1)}),t+=Gt([[18,34.6],[21.6,27.6],[29.6,26],[36.4,30.6],[37,38.4],[33,44.4],[24,44.6],[19.4,40.6]],"#8a8792"),t+=Gt([[29,43],[35.6,37.6],[37,38.4],[34.4,44],[30,45]],Ht.shade),t+=ie([[18.6,33.4],[22,27.8],[29.6,26.2],[35.6,29.8]],Tt,2),t+=n([[29.4,41.6],[29,49],[30,56.2]],8.4,6.4,!1)+e(33,!1),t+=n([[59.6,39.6],[60.8,48.4],[61.8,56.2]],8.4,6,!1)+e(64.8,!1),t+=t0({outline:[[61,34],[61.6,26],[65.6,20],[71.6,17],[78,16],[84,14.6],[89,13.2],[92.8,15],[91.6,18.8],[86.6,22.6],[81,28.4],[73,33.6],[66,35.6]],earFar:[[63,21.2],[63.2,12.8],[69,17]],earNear:[[67.2,17.8],[70.4,10],[75,16.2]],mask:[[66.8,23.6],[72.4,19.8],[79.6,18.2],[84.2,19.4],[83,23.4],[77.2,25.2],[71.6,29],[66.4,28]],brow:[[69.4,18.6],[75.4,15.8],[81.8,15.8],[80.6,17.6],[75,17.6],[70.6,20.2]],muzzle:[[82.6,19.4],[87.4,16.4],[92.2,15.8],[91,19],[86.2,23],[81.6,24.6],[80.8,22]],cheek:[[66.6,29],[71,29.8],[74.6,31.6],[70.4,34.4],[65.4,33.4]],stripe:[[76.4,15.8],[80.6,17.4],[84.4,19.4]],eye:[79.4,20.8],nose:[92.4,14.8],mouth:[[90.6,18.4],[88,20.8],[85.6,21.6]]}),t+=ie([[94.2,9.6],[95.2,7.8]],"#c7ccde",.9,.8)+ie([[94.8,12.4],[95.6,11.6]],"#c7ccde",.9,.6),ct("raccoon.sniff",96,62,48,62,t)}function B3(){const n="#1f2340";let e="";e+=ge(ce([[51,56.5],[60,55],[65.6,48.6],[65.4,40]],11.6,7),n),e+=k("M56.4 50.6L57.2 60.4M62.6 48L68 52.8M61.8 42.4L68.8 41.8","#272c4d",2.6,.9),e+=ge(de([[12.6,59.5],[13,47],[17,38],[24,32.4],[34,30.6],[44,32],[51,37.6],[55.4,46],[56.6,59.5]]),n),e+=ge(de([[21.6,14],[22.6,7],[25.6,4.6],[29.4,6],[31.2,10.4]],.9),n)+ge(de([[36.6,10],[38.6,4.6],[42.4,3.6],[45,6.4],[45.8,11.6]],.9),n),e+=ge(lt([[22.6,20],[17.4,25.4],[23.4,25.2],[19.8,29.6],[27,27.4]]),n),e+=ge(de([[21,23],[22,15.5],[27,10.6],[34,9],[41,9.6],[46,12.6],[50.6,16],[55,19.4],[55.6,21.8],[52.4,23.8],[46,27.2],[38,29.6],[29,29]]),n);for(const[t,i]of[[34.6,17.8],[44.2,17]])e+=tt(t,i,5.5,"#9fb0ff",.28),e+=ge(xe(t,i,2.1,1.35),"#cfd8ff",.72),e+=qt(t+.5,i-.3,.55,"#ffffff",.8);return ct("raccoon.shadow",70,60,35,60,e)}function n0(n,e,t,i,s,r){const o=n+t*i,a=e+t*s,c=t*r,l=Math.hypot(o-n,a-e),h=Math.atan2(a-e,o-n),u=Math.acos((t*t+l*l-c*c)/(2*t*l)),f=Math.acos((c*c+l*l-t*t)/(2*c*l)),d=[],m=40;for(let _=0;_<=m;_++){const p=h+u+_/m*(2*Math.PI-2*u);d.push([n+Math.cos(p)*t,e+Math.sin(p)*t])}for(let _=1;_<m;_++){const p=h+Math.PI+f-_/m*2*f;d.push([o+Math.cos(p)*c,a+Math.sin(p)*c])}return lt(d)}function $3(n,e,t,i){const s=`M${xt(n)} ${xt(e)}C${xt(n+t*.2)} ${xt(e+t*.5)} ${xt(n+t*.55)} ${xt(e+t*.8)} ${xt(n+t*.5)} ${xt(e+t*1.15)}C${xt(n+t*.45)} ${xt(e+t*1.5)} ${xt(n-t*.45)} ${xt(e+t*1.5)} ${xt(n-t*.5)} ${xt(e+t*1.15)}C${xt(n-t*.55)} ${xt(e+t*.8)} ${xt(n-t*.2)} ${xt(e+t*.5)} ${xt(n)} ${xt(e)}Z`;return ue(s,{fill:i,stroke:1.5})}function cl(n,e,t,i,s=0){const r=[];for(let o=0;o<10;o++){const a=s-Math.PI/2+o*Math.PI/5,c=o%2?t*.45:t;r.push([n+Math.cos(a)*c,e+Math.sin(a)*c])}return ue(lt(r),{fill:i,stroke:1.4})}const ds={fill:"#c6dbe6",mark:"#9fb9c8",eye:"#f39ac0",eyeDeep:"#e27aa8",blush:"#f4c1d6"};function G3(){const n=n0(130,130,112,.55,-.1,.86);let e="";e+=gn(58,160,14,8,ds.blush,.9),e+=ie([[40,196],[52,204],[66,206]],ds.mark,1.4),e+=ie([[34,110],[36,126]],ds.mark,1.3)+ie([[98,222],[112,226]],ds.mark,1.3);let t=ue(n,{fill:ds.fill,over:e});return t+=cl(196,150,11,_e.butter,.2)+cl(226,196,8,_e.mint,-.3)+cl(176,206,7,_e.pink,.4),ct("moon.baby",260,260,130,130,t)}function z3(){const n=xe(28,22,23,16),e=ge("M3 22Q6 4 28 5Q50 4 53 22Q40 13 28 13Q15 13 3 22Z",Tt)+gn(20,25,3,2.2,"#ffffff",.9);let t=ue(n,{fill:ds.eye,inner:e,stroke:1.8});return t+=ie([[10,33],[28,38],[46,33]],ds.eyeDeep,1.2,.8),ct("moon.baby.eye",56,44,28,22,t)}function H3(){let e=ue("M3 22Q6 4 28 4Q50 4 53 22Q40 30 28 30Q16 30 3 22Z",{fill:ds.fill,stroke:1.8});e+=ie([[6,24],[28,31],[50,24]],Tt,1.8);for(const t of[14,22,30,38,44])e+=ie([[t,29],[t-1,34]],Tt,1.2);return ct("moon.baby.lid",56,44,28,22,e)}function V3(){let n=ie([[6,10],[16,13],[26,11]],Tt,1.8);return n+=ie([[3,8],[6,10]],Tt,1.2),ct("moon.baby.mouth",32,20,16,10,n)}const gs={fill:"#b3b3e0",mark:"#8f8fc6",iris:"#9fd6a3",tear:"#9ed7ea",tearDeep:"#7cc0dc"};function W3(){const n=n0(150,150,132,.5,-.12,.84);let e="";for(const[s,r,o,a]of[[34,150,36,170],[50,220,62,232],[48,92,58,80],[96,262,112,266]])e+=ie([[s,r],[o,a]],gs.mark,1.4);let t=ue(n,{fill:gs.fill,over:e});return[[64,146,10],[52,162,11],[76,166,10],[62,184,12],[46,196,9],[80,198,11],[58,218,12],[78,232,10],[64,250,10],[82,266,8]].forEach(([s,r,o],a)=>{t+=$3(s,r,o,a%3===0?gs.tearDeep:gs.tear)}),ct("moon.old",300,300,150,150,t)}function X3(){const n="M4 22Q18 6 32 6Q48 6 60 22Q46 36 32 36Q16 36 4 22Z",e=gn(34,24,8.5,9,gs.iris)+gn(35,25,4,4.4,Tt)+ge("M2 22Q16 2 32 3Q50 3 62 22Q48 14 32 14Q16 14 2 22Z",Tt)+qt(31,21,1.6,"#ffffff",.9);let t=ue(n,{fill:"#eef3f0",inner:e,stroke:1.8});return t+=ie([[10,34],[32,40],[54,34]],gs.mark,1.2),ct("moon.old.eye",64,44,32,22,t)}function q3(){let e=ue("M3 22Q16 4 32 4Q48 4 61 22Q46 30 32 30Q18 30 3 22Z",{fill:gs.fill,stroke:1.8});e+=ie([[6,24],[32,32],[58,24]],Tt,2);for(const t of[16,26,36,46])e+=ie([[t,30],[t-1.5,36]],Tt,1.2);return ct("moon.old.lid",64,44,32,22,e)}function Y3(){let n=ie([[6,16],[18,11],[32,12],[42,16]],Tt,1.8);return n+=ie([[14,20],[26,19]],gs.mark,1.2),ct("moon.old.mouth",48,28,24,14,n)}function Z3(){const n=de([[4,10],[22,7],[42,10],[38,24],[24,32],[10,26]]);let e="";for(const s of[12,20,28])e+=ue(`M${s} 8L${s+7} 8L${s+6} 14L${s+1} 14Z`,{fill:"#fbf5e6",stroke:1.1});const t=e+gn(24,27,8,5,_e.pinkDeep),i=ue(n,{fill:"#3a3446",inner:t,stroke:1.8});return ct("moon.old.mouth.laugh",48,36,24,16,i)}const wi={face:"#f3be86",mark:"#d9955f",ring:"#ef8f86",ringDeep:"#e0716c",ray:"#f4e08c",rayLime:"#dbe68a",cheek:"#f4a3a0"};function K3(){const n=new an(9160),e=M3(160,160,60,s=>138+2.2*Math.sin(s*5+.6)+n.range(-.8,.8));let t="";for(let s=0;s<46;s++){const r=n.range(0,Math.PI*2),o=n.range(20,124),a=160+Math.cos(r)*o,c=160+Math.sin(r)*o;if(Math.abs(c-140)<26&&Math.abs(Math.abs(a-160)-46)<34||Math.abs(a-160)<22&&c>136&&c<230)continue;const l=n.range(3.5,5.5);t+=ie([[a-l,c+l*.8],[a,c-l*.3],[a+l,c+l*.8]],wi.mark,1.5)}for(const[s,r]of[[114,-1],[206,1]])t+=ue(xe(s,142,30,23),{fill:wi.ring,stroke:1.8}),t+=ie([[s+r*30,104],[s+r*10,108],[s-r*18,100]],Tt,2.2);t+=ie([[156,162],[150,186],[162,188]],Tt,1.8),t+=gn(92,196,16,9,wi.cheek,.8)+gn(228,196,16,9,wi.cheek,.8);const i=ue(de(e),{fill:wi.face,over:t,stroke:2.2});return ct("sun.disk",320,320,160,160,i)}function Q3(){const n="M4 18Q16 4 28 4Q42 4 52 18Q40 30 28 30Q14 30 4 18Z",e=gn(28,20,8,8.4,"#8a6a9c")+gn(28,21,3.8,4,Tt)+ge("M2 18Q14 0 28 1Q44 1 54 18Q42 11 28 11Q14 11 2 18Z",wi.ringDeep)+qt(25.5,18,1.4,"#ffffff",.9);let t=ue(n,{fill:"#fbf1e4",inner:e,stroke:1.8});return t+=ie([[3,17],[16,9],[28,9],[42,9],[53,17]],Tt,2),ct("sun.eye",56,36,28,18,t)}function J3(){let e=ue("M3 18Q14 2 28 2Q42 2 53 18Q40 26 28 26Q16 26 3 18Z",{fill:wi.ring,stroke:1.8});e+=ie([[6,20],[28,27],[50,20]],Tt,2);for(const t of[14,22,30,38,44])e+=ie([[t,25.5],[t-1,31]],Tt,1.2);return ct("sun.lid",56,36,28,18,e)}function j3(){let n=ie([[8,20],[16,11],[28,8],[40,11],[48,20]],Tt,2);return n+=ie([[22,23],[34,23]],wi.mark,1.3),ct("sun.mouth",56,30,28,15,n)}function e_(){const n=de([[4,20],[14,8],[28,5],[42,8],[52,20],[44,34],[28,40],[12,34]]);let e="";for(const s of[13,22,31])e+=ue(`M${s} 6L${s+8} 6L${s+6.5} 14L${s+1.5} 14Z`,{fill:"#fbf5e6",stroke:1.1});e+=ue("M18 38L22 30L26 38Z",{fill:"#fbf5e6",stroke:1})+ue("M30 38L34 30L38 38Z",{fill:"#fbf5e6",stroke:1});const t=e+gn(28,30,9,5,"#9ed0b8"),i=ue(n,{fill:"#4a3438",inner:t,stroke:2});return ct("sun.mouth.open",56,44,28,20,i)}function t_(){const n=wt([[4,74,1],[18,30],[22,3,1],[26,30],[40,74,1]]),e=ue(n,{fill:wi.ray,stroke:2,over:ie([[22,16],[22,50]],wi.mark,1.1,.6)});return ct("sun.ray",44,76,22,74,e)}function n_(){const n=wt([[4,74,1],[16,44],[14,30,1],[26,22],[30,6,1],[30,34],[40,74,1]]);let e=ue(n,{fill:wi.rayLime,stroke:2});return e+=ie([[18,52],[24,46],[20,40]],Tt,1.3),ct("sun.ray.broken",44,76,22,74,e)}const Pt={fill:"#3d3b45",shade:"#2e2c35",rim:"#6d6a7c",dark:"#26242c",collar:"#6a6878",chair:"#2a2830",chairLight:"#3b3843",skin:"#4a4854",skinShade:"#3a3842"},Zi=(n,e="",t=Pt.rim)=>ue(n,{fill:Pt.fill,stroke:2.6,over:e});function i0(n,e,t){return ue(de(n),{fill:Pt.skin,stroke:2.6,over:Gt(e,Pt.dark)+ie([[t[0],t[1]-3],[t[0]+2.2,t[1]],[t[0],t[1]+3]],Pt.skinShade,1.4)})}function i_(){const n={fill:Pt.chair,shade:"#1f1d25",light:Pt.chairLight,sx:1.6,sy:1,hx:1,hy:1,stroke:2.4};let e="";return e+=ue(lt([[21,103],[26,103],[25.4,148.4],[20.4,148.4]]),n),e+=ue(lt([[58,103],[63,103],[64,148.4],[59,148.4]]),n),e+=k("M25 130L60 130",Pt.chair,2.6),e+=ue(wt([[17.6,49,1],[26.4,47.4,1],[29.4,98,1],[21,99.4,1]]),{...n,over:ie([[21,56],[24.4,94]],Pt.chairLight,1.2,.8)}),e+=ue(wt([[19,95.6,1],[67,95.6,1],[67,103,1],[19,103,1]]),n),e+=ue(ce([[42,90],[58,90.6],[75,91.4]],16,14),{fill:Pt.shade,stroke:2.4}),e+=ue(ce([[74.6,93],[75.6,118],[76.4,140]],12.4,10.4),{fill:Pt.shade,stroke:2.4}),e+=ue(de([[69,140.6],[78,139.4],[87.6,142],[92.4,145.4],[91.4,148.6],[70,148.6]],.8),{fill:"#1f1d25",stroke:2.2}),e+=Zi(de([[28,94.4],[26.2,80],[27,66],[31,55],[38,47.6],[46,46],[52,49],[56,57],[57,68],[54,80],[50.4,90],[46,96.4],[36,97.4]]),Gt([[47.6,46],[52,47.4],[53.8,52],[50,50.4]],Pt.collar)+ie([[51.8,50],[54,62],[53.4,70]],Pt.dark,2.4)+ie([[47,49],[52,58],[53,66]],Pt.shade,1.3)+ie([[33.6,78],[41,77.4]],Pt.shade,1.2)),e+=Zi(ce([[34,91.6],[52,92.6],[70,93.6]],19,16.4),ie([[44,86.4],[66,87.6]],Pt.rim,1,.6)),e+=Zi(ce([[69.6,95],[70.6,119],[71.4,141]],14,11.6),ie([[69.2,104],[70,130]],Pt.shade,1.1)),e+=ue(de([[63.6,140.8],[73.6,139.4],[83.6,142],[89.4,145.6],[88.4,148.8],[65.6,148.8]],.8),{fill:Pt.dark,stroke:2.2}),e+='<g transform="rotate(17 46 49)">',e+=ue(ce([[44,51],[48.4,42]],8.6,7.6),{fill:Pt.skinShade,stroke:2.2}),e+=i0([[41.6,32],[42.8,24],[48,19],[55,17.6],[61,20.6],[64.4,26.6],[64.6,31],[66.6,35.4],[64.2,37.2],[62.6,41],[58.4,44.4],[52.6,45.4],[47,43],[43,38]],[[40,34],[42,22],[49.6,16],[58,16.6],[62.6,21.4],[56,22.6],[50,25.4],[47,31],[45.6,38]],[49.4,31.4]),e+="</g>",e+=Zi(ce([[42,53.6],[45,66],[49,78]],12.4,10.6)),e+=Zi(ce([[48.6,78],[58,82.6],[66.4,85.6]],10.6,9.2)),e+=Gt([[64.2,81.6],[67.2,81.4],[68.4,89.4],[65.2,89.8]],Pt.collar),e+=ue(de([[66.6,81.8],[72,82.4],[75.4,86.4],[72.4,89.8],[66.6,89.4]]),{fill:Pt.skin,stroke:2}),ct("attendee.sit",96,150,48,150,e)}function s_(){let n="";return n+=ue(ce([[31.6,108],[30.8,148],[30,184]],15,12.4),{fill:Pt.shade,stroke:2.4}),n+=ue(de([[23.4,183.4],[33,182.2],[42,186],[44.4,190.6],[42.6,194.2],[23.6,194.2]],.8),{fill:"#1f1d25",stroke:2.2}),n+=Zi(ce([[38.4,108],[39.2,148],[40.2,184]],16.4,12.8),ie([[39.4,116],[40.4,180]],Pt.shade,1.1)+ie([[34,118],[34.4,170]],Pt.rim,1,.5)),n+=ue(de([[31.6,183],[42,182.2],[52,186],[55.2,190.4],[53.8,194.4],[32.6,194.4]],.8),{fill:Pt.dark,stroke:2.2}),n+=Zi(de([[23,52],[26,44],[33,40],[42,40.6],[48,45],[51,56],[51.4,72],[49.4,88],[48.4,104],[45.4,112.4],[36,113.4],[26,112.4],[24,100],[22.6,84],[22,68]]),Gt([[41.6,40],[46,42],[47.6,47],[44,45.2]],Pt.collar)+ie([[46,45],[49,60],[48.6,74]],Pt.dark,2.4)+ie([[41,42],[47,54],[49,70]],Pt.shade,1.3)+qt(49,79,1.1,Pt.dark)+qt(48.6,91,1.1,Pt.dark)+ie([[36,92],[45,92]],Pt.shade,1.2)+ie([[25,104],[47.4,104.6]],Pt.shade,1,.8)),n+='<g transform="rotate(8 37 41)">',n+=ue(ce([[36.4,42],[37.2,34]],9.4,9),{fill:Pt.skinShade,stroke:2.2}),n+=i0([[26,20],[27,11],[33,6],[41,5.4],[47,9],[49.6,14.6],[50,19],[52.4,23.2],[50.4,25],[50,29],[47,33.6],[41,35.4],[34,34],[29,29]],[[24.8,22],[26,9.6],[33,4.4],[42,4],[48,8.6],[42.4,9.4],[36,11.6],[32,17],[30.4,25]],[34.4,20.4]),n+="</g>",n+=Zi(ce([[33,50],[34,70],[35,88]],12.6,11)),n+=Zi(ce([[35,88],[36.8,104],[38.4,117]],11,9.6)),n+=Gt([[33.4,114.4],[38.4,114],[39,118.6],[33.8,119]],Pt.collar),n+=ue(de([[34.6,117.4],[40.6,116.6],[42.6,122],[40.6,128],[36.2,128.4],[34,123]]),{fill:Pt.skin,stroke:2}),ct("attendee.stand",70,196,35,196,n)}const no={fill:"#2b2229",rim:"#5a3d78",ink:"#1d171c"};function s0(n,e){const t={fill:no.fill,light:no.rim,sx:0,sy:0,hx:1.8,hy:1.4,stroke:2,ink:no.ink};let i="";for(const s of e)i+=ue(s,t);return i+=ue(de(n,.9),{...t,over:ie([[n[0][0]+8,96],[n[0][0]+9,124]],"#231b21",2.4,.8)}),i}function r0(n,e,t){const i=new an(t);let s="";for(const r of n){const o=i.range(4,8);s+=ge(ce([[r,e-3],[r+i.range(-2,2),e+o*.5],[r+i.range(-3,3),e+o]],3.6,.8),no.fill,.75)}return s}function r_(){const n=[[13,126],[12.4,110],[11,94],[9.4,78],[10,62],[13,50],[18.6,41],[26,35.4],[32,33.6],[34,27],[37.4,20.4],[43.4,17.4],[50,18.6],[53.6,23.8],[54,30.6],[51.6,36],[47.4,39.8],[48,46],[49,54],[50,64],[48.6,76],[46.6,88],[47.4,102],[48.8,116],[49.4,126],[44,127.4],[39,124],[34,127.6],[31,116],[28,127.6],[22,124.4],[17,127.6]],e=ce([[38,44],[41.6,62],[44.6,80],[46,90]],9.4,6.4);let t=s0(n,[e]);return t+=r0([15,21,27,35,41,47],126,51),t+=ie([[36,24],[41,19],[48,18.4]],R.vein,1,.35),ct("form.shadow",62,132,31,132,t)}function a_(){const n=[[22,126],[21.4,110],[20,94],[18.8,78],[20,62],[24,50],[30,42],[37,37.4],[40,33.4],[39.6,25.4],[42.4,17.4],[48.4,13.6],[55.4,14.6],[59.4,19.8],[60,26.8],[57.6,32.6],[53.4,36.6],[54.6,44],[55.6,54],[56.4,66],[55,78],[53,90],[53.6,104],[55,116],[55.6,126],[50.4,127.4],[45.6,124],[41,127.6],[38,116],[35,127.6],[29.6,124.4],[25,127.6]],e=ce([[46,46.4],[60,44.6],[74,42.4],[84,41]],11.4,7.2),t=de([[80.4,37.6],[86.6,37.4],[89.4,39.6],[86.4,42.8],[81,44.6]]),i=ce([[86,39.8],[91.6,39.2],[94,39]],3.4,2.2);let s=s0(n,[i,t,e]);return s+=r0([24,30,36,44,50,55],126,77),s+=ie([[42,19],[47,14.6],[54,14.4]],R.vein,1,.35),s+=ie([[60,42],[74,39.6],[85,38]],R.vein,1,.3),ct("form.point",96,132,40,132,s)}const $n={fill:R.gortiBark,shade:R.gortiBarkDark,light:R.gortiBarkLight};function fr(n,e){return ie(n,R.violetDark,e+1.6,.9)+ie(n,R.violet,e)+ie(_r(n,-.6,0),R.vein,Math.max(.9,e*.35),.95)}function o_(){const n=[[14,426],[12,380],[15.4,340],[12.6,306],[9.6,290],[14,272],[18,240],[19.4,200],[17,172],[14.6,158],[19,142],[23,110],[25,80],[27.6,50],[33.4,26],[44,13],[55,9.6],[66,12],[76.6,24],[82.6,48],[85,80],[87,110],[91,142],[95.4,158],[93,172],[91,200],[92,240],[96,272],[100.4,290],[97.4,306],[95,340],[98,380],[96,426]],e=(r,o)=>ue(ce(r,o,1.4),{...$n,stroke:2.6});let t="";t+=e([[18,250],[9,243],[4,231]],7),t+=e([[92,212],[101,201],[104.6,188]],7),t+=e([[15,392],[7,398],[3,408]],8),t+=e([[88,118],[96,112],[99.6,102]],5.6);let i="";const s=[[[30,418],[33,380],[28.6,350],[34,320]],[[74,416],[69.6,372],[75,334]],[[33,380],[52,386],[69.6,372]],[[26,250],[30,222],[27,196]],[[80,256],[76,226],[82,196]],[[30,222],[48,230],[76,226]],[[34,128],[36,96],[33,70]],[[74,128],[71,98],[76,70]],[[36,96],[54,102],[71,98]],[[40,64],[56,60],[72,66]]];for(const r of s)i+=ie(r,$n.shade,2.2);for(const[r,o]of[[290,1],[158,.9]])for(let a=-1;a<=1;a++){const c=r+a*11,l=[[20,c-3],[36,c+3],[55,c+1],[74,c+4],[90,c-2]].map(([h,u])=>[55+(h-55)*o,u]);i+=ie(l,$n.shade,a===0?3:2.2)+ie(_r(l,0,-2.6),$n.light,1.4,.8)}i+=a0(new an(4101),[16,60,94,400],14,"#5e5670",$n.light,1.9),i+=Ol(34,214,4.6,3.4,$n.shade,$n.light)+Ol(76,360,4,3,$n.shade,$n.light),i+=ue(de([[60,24],[70,22],[77.6,32],[79.6,52],[72,58],[62,50]]),{fill:$n.light,stroke:2.4}),i+=fr([[48,424],[46,372],[52,330],[48,300],[54,262],[50,222],[56,180],[52,140],[57,100],[54,62],[56,36]],3.2),i+=fr([[52,330],[66,314],[74,296]],2)+fr([[50,222],[36,204],[30,184]],2)+fr([[57,100],[68,86],[72,70]],1.8),i+=fr([[46,372],[32,360],[24,342]],2);for(const[r,o]of[[52,330],[50,222],[57,100]])i+=tt(r,o,11,R.vein,.4)+qt(r,o,2.2,"#f1e3ff",.9);return t+=ue(de(n,.95),{...$n,stroke:4,over:i}),ct("giant.finger",110,420,55,410,t)}function a0(n,e,t,i,s,r){const[o,a,c,l]=e;let h="";for(let u=0;u<t;u++){let f=n.range(o,c),d=n.range(a,l),m=Math.PI/2+n.range(-.35,.35);const _=[[f,d]],p=n.int(3,5);for(let g=0;g<p;g++){const b=n.range(10,20);m=Math.max(Math.PI/2-.7,Math.min(Math.PI/2+.7,m+n.range(-.45,.45))),f+=Math.cos(m)*b,d+=Math.sin(m)*b,_.push([f,d])}if(h+=k(lt(_,!1),i,r)+k(lt(_r(_,1.3,-.4),!1),s,r*.4,.55),n.chance(.55)){const g=_[n.int(1,_.length-2)],b=m+(n.chance(.5)?1:-1)*n.range(.7,1.2),E=n.range(7,13);h+=k(lt([g,[g[0]+Math.cos(b)*E,g[1]+Math.sin(b)*E]],!1),i,r*.7)}}return h}function Ol(n,e,t,i,s,r){return gn(n,e,t*1.45,i*1.4,s,.55)+k(xe(n,e,t*1.45,i*1.4),s,1.6)+gn(n,e,t,i,r)+gn(n+t*.15,e+i*.2,t*.55,i*.5,"#4a4258")+k(xe(n,e,t,i),"#4a4258",1.4)}function l_(){const n="giantLegsFade";let e=`<mask id="${n}" maskUnits="userSpaceOnUse" x="-10" y="-30" width="400" height="620"><rect x="-10" y="160" width="400" height="420" fill="#fff"/>`;const t=40;for(let c=0;c<t;c++)e+=`<rect x="-10" y="${c*4}" width="400" height="4.3" fill="#fff" opacity="${xt(((c+.5)/t)**1.3)}"/>`;e+="</mask>";const i=(c,l)=>{const h=l?{fill:li($n.fill,$n.shade,.55),shade:"#554d66",light:$n.fill}:{fill:$n.fill,shade:$n.shade,light:$n.light},u=l?"#463f55":"#564d68";let f="";for(const[_,p]of c.rootlets)f+=ue(ce(_,p,1.6),{...h,stroke:2.6});for(const[_,p,g]of c.toes)f+=ue(ce(_,p,g),{...h,stroke:3,over:ie(_r(_.slice(1),0,-p*.12),h.light,1.3,.7)+ie(_r(_.slice(1,3),2,p*.1),u,1.6,.8)});const d=new an(c.seed);let m=a0(d,c.box,26,u,h.light,2.2);for(const[_,p,g,b]of c.knots)m+=Ol(_,p,g,b,h.shade,h.light);for(let _=0;_<3;_++){const p=c.knee-12+_*12,[g,b]=c.kneeX,E=[[g,p],[g+(b-g)*.3,p+5],[g+(b-g)*.65,p+3],[b,p-2]];m+=ie(E,u,_===1?3:2.2)+ie(_r(E,1,-2.8),h.light,1.4,.7)}for(const[_,p]of c.veins)m+=fr(_,l?p*.85:p);for(const[_,p]of c.nodes)m+=tt(_,p,l?10:12,R.vein,l?.25:.38)+qt(_,p,l?2:2.4,"#f1e3ff",l?.7:.9);return f+=ue(de([...c.left,...c.right],.9),{...h,stroke:4,over:m}),f},s={left:[[70,-30],[75,40],[80,96],[76,112],[82,128],[88,180],[84,226],[88,262],[93,300],[96,352],[90,372],[98,392],[102,420],[104,446],[102,478],[97,506],[90,530],[84,548],[80,562]],right:[[100,564],[140,564],[156,552],[166,528],[166,500],[163,470],[167,420],[172,384],[178,372],[174,356],[180,300],[190,262],[186,226],[181,186],[186,160],[191,146],[186,120],[191,50],[195,-30]],toes:[[[[146,526],[172,528],[194,536],[210,548],[218,563]],26,7],[[[148,542],[172,546],[192,554],[202,564]],18,5],[[[104,544],[88,550],[72,556],[60,564]],17,4]],rootlets:[[[[180,368],[192,360],[199,346]],7],[[[80,118],[70,110],[64,98]],7]],box:[70,-10,190,520],seed:5601,knots:[[112,196,6,4.2],[150,418,5,3.6]],knee:262,kneeX:[92,186],veins:[[[[132,-20],[128,60],[136,140],[130,210],[138,280],[132,350],[138,420],[134,470],[148,518],[178,532],[204,544]],3.2],[[[136,140],[154,160],[164,186]],2],[[[138,280],[118,300],[108,330]],2],[[[138,420],[154,440],[158,466]],1.8]],nodes:[[136,140],[138,280]]},r={left:[[178,-30],[182,40],[188,110],[194,180],[190,206],[196,222],[194,236],[197,262],[202,300],[206,350],[210,400],[212,440],[210,478],[205,506],[198,530],[192,548],[188,562]],right:[[208,564],[250,564],[266,552],[276,528],[276,500],[272,470],[276,420],[282,360],[289,300],[298,264],[294,228],[289,188],[293,120],[296,92],[304,80],[298,66],[300,50],[304,-30]],toes:[[[[258,524],[284,526],[308,534],[326,546],[336,563]],28,7],[[[258,540],[284,545],[306,553],[318,564]],19,5],[[[214,544],[198,550],[182,556],[170,564]],17,4],[[[236,548],[236,556],[232,564]],12,4]],rootlets:[[[[300,76],[312,68],[318,54]],7],[[[192,214],[180,208],[174,196]],6.5]],box:[178,-10,298,520],seed:5602,knots:[[268,150,6.5,4.4],[222,330,5.4,3.8],[258,470,4.6,3.2]],knee:264,kneeX:[200,294],veins:[[[[240,-20],[236,60],[244,140],[238,210],[246,280],[240,350],[246,420],[242,470],[258,514],[290,528],[318,540]],3.4],[[[244,140],[262,160],[272,186]],2],[[[246,280],[226,300],[216,330]],2],[[[246,420],[262,440],[266,466]],1.8],[[[236,60],[218,80],[208,104]],1.8]],nodes:[[244,140],[246,280],[246,420]]};let o=ue(de([[99,466],[130,471.4],[163,466.4],[164.4,480],[130,485.4],[100.6,480]],.7),{fill:"#4a3528",stroke:2.4,over:ie([[112,474.6],[118,475.6]],"#6a4d3a",1.2)+ie([[146,475.6],[152,474.6]],"#6a4d3a",1.2)});o+=`<rect x="141.4" y="474.4" width="2.4" height="4" fill="#b9a36a" stroke="${Tt}" stroke-width="1"/>`,o+=`<circle cx="131" cy="477.6" r="10.4" fill="${R.ivory}" stroke="${Tt}" stroke-width="2.4"/>`,o+='<circle cx="131" cy="477.6" r="8.2" fill="none" stroke="#b9a36a" stroke-width="1.4"/>',o+=k("M131 477.6l0-5.6M131 477.6l4 2",Tt,1.3),o+=k("M131 470.6l0 1.4M131 483.2l0 1.4M124 477.6l1.4 0M136.6 477.6l1.4 0","#6b5a4a",.9),o+=ge(xe(127.6,473.6,2.4,1.4),"#ffffff",.7);const a=i(s,!0)+o+i(r,!1);return ct("giant.legs",380,560,190,560,`${e}<g mask="url(#${n})">${a}</g>`)}function c_(){const n="M11 2.2C11.6 8 13.4 12.6 16.2 17.8C19.4 23.8 19.2 32.4 11 34.6C2.8 32.4 2.6 23.8 5.8 17.8C8.6 12.6 10.4 8 11 2.2Z";let e=tt(11,26,10.5,R.vein,.35);return e+=ue(n,{fill:R.violet,stroke:2}),e+=ge(xe(8.2,24.4,1.7,3.4),"#f1e3ff",.9)+qt(9.6,13.6,.8,"#f1e3ff",.8),ct("giant.drip",22,40,11,6,e)}function h_(){return[v3(),x3(),y3(),S3(),b3(),F3(),O3(),B3(),T3(),E3(),w3(),A3(),R3(),C3(),L3(),P3(),D3(),I3(),k3(),U3(),G3(),z3(),H3(),V3(),W3(),X3(),q3(),Y3(),Z3(),K3(),Q3(),J3(),j3(),e_(),t_(),n_(),i_(),s_(),r_(),a_(),o_(),l_(),c_()]}const ut=R.ink,Ne=n=>Math.round(n*100)/100;function nt(n,e,t,i,s){const r=i==="bc"?t:i==="c"?t/2:0;return{key:n,w:e,h:t,px:e/2,py:r,body:Ff(s(new an(bs(n)))),scale:1}}function D(n,e,t={}){return ue(n,{fill:e.fill,shade:e.shade,light:e.light,stroke:3.5,...t})}const vt=(n,e,t)=>xe(n,e,t,t),pe=(n,e=1)=>de(n,e,!1),ft=(n,e,t,i,s=1)=>`<circle cx="${Ne(n)}" cy="${Ne(e)}" r="${Ne(t)}" fill="${i}"${s!==1?` opacity="${s}"`:""}/>`,Br=(n,e)=>`<g ${n}>${e}</g>`,on=(n,e,t,i,s=.3)=>ge(xe(n,e,t,i),ut,s),Qe=(n,e,t,i)=>[n+Math.cos(i)*t,e+Math.sin(i)*t],Gn=(n,e,t)=>n+(e-n)*t,Zt=(n,e,t,i)=>`M${Ne(n)} ${Ne(e)}H${Ne(n+t)}V${Ne(e+i)}H${Ne(n)}Z`,aa=(n,e,t,i)=>`M${Ne(n)} ${Ne(e)}V${Ne(e+i)}H${Ne(n+t)}V${Ne(e)}Z`;function ac(n,e){const t=nc("pc");return`<clipPath id="${t}"><path d="${n}"/></clipPath><g clip-path="url(#${t})">${e}</g>`}function pa(n,e,t=.85){const i=n.length,s=[],r=[];for(let p=0;p<i;p++){const g=n[Math.max(0,p-1)],b=n[Math.min(i-1,p+1)],E=Math.hypot(b[0]-g[0],b[1]-g[1])||1,v=-(b[1]-g[1])/E,S=(b[0]-g[0])/E,T=e[p]/2,L=n[p];s.push([L[0]+v*T,L[1]+S*T]),r.push([L[0]-v*T,L[1]-S*T])}const o=n[i-1],a=n[i-2],c=Math.hypot(o[0]-a[0],o[1]-a[1])||1,l=e[i-1]*.5,h=[o[0]+(o[0]-a[0])/c*l,o[1]+(o[1]-a[1])/c*l],u=n[0],f=n[1],d=Math.hypot(f[0]-u[0],f[1]-u[1])||1,m=e[0]*.4,_=[u[0]-(f[0]-u[0])/d*m,u[1]-(f[1]-u[1])/d*m];return de([...s,h,...r.reverse(),_],t)}function ui(n,e){const t=n.length;return n.map((i,s)=>{const r=n[Math.max(0,s-1)],o=n[Math.min(t-1,s+1)],a=Math.hypot(o[0]-r[0],o[1]-r[1])||1;return[i[0]-(o[1]-r[1])/a*e,i[1]+(o[0]-r[0])/a*e]})}function Ar(n,e,t,i=6){const s=r=>{const o=r*(n.length-1),a=Math.min(n.length-2,Math.floor(o)),c=o-a,l=n[a],h=n[a+1];return[Gn(l[0],h[0],c),Gn(l[1],h[1],c)]};return Array.from({length:i},(r,o)=>s(Gn(e,t,o/(i-1))))}function Ts(n,e,t={},i=3.5,s=ut){let r="";for(const o of n)r+=`<path d="${o}" fill="${s}" stroke="${s}" stroke-width="${i}" stroke-linejoin="round"/>`;for(const o of n)r+=D(o,e,{...t,stroke:0});return r}function dr(n,e,t,i=.45,s=5,r=-Math.PI/2){const o=[];for(let a=0;a<s*2;a++)o.push(Qe(n,e,a%2?t*i:t,r+a*Math.PI/s));return lt(o)}function Bl(n,e,t,i=.45,s=-.35,r=.82){const o=n+t*i,a=e+t*s,c=t*r,l=Math.hypot(o-n,a-e),h=Math.atan2(a-e,o-n),u=Math.acos((t*t+l*l-c*c)/(2*t*l)),f=Math.acos((c*c+l*l-t*t)/(2*c*l)),d=[],m=18;for(let _=0;_<=m;_++)d.push(Qe(n,e,t,h+u+_/m*(2*Math.PI-2*u)));for(let _=1;_<m;_++)d.push(Qe(o,a,c,h+Math.PI+f-_/m*2*f));return lt(d)}function f_(n,e,t,i=5,s=0,r=.38,o=1){const a=[],c=Math.PI*2/i;for(let l=0;l<i;l++){const h=s+l*c;for(const[u,f]of[[-.5,r],[-.3,.9],[0,1],[.3,.9]]){const d=Qe(0,0,t*f,h+u*c);a.push([n+d[0],e+d[1]*o])}}return de(a,1)}const u_={1:[[[.18,.24],[.62,0],[.62,1]]],4:[[[.72,1],[.72,0],[0,.66],[1,.66]]],I:[[[.5,0],[.5,1]]],V:[[[0,0],[.5,1],[1,0]]],X:[[[0,0],[1,1]],[[1,0],[0,1]]]};function $l(n,e,t,i,s,r){const o=()=>r?r.range(-.04,.04):0;return(u_[n]??[]).map(a=>lt(a.map(([c,l])=>[e+(c+o())*i,t+(l+o())*s]),!1)).join("")}const Ni={fill:"#a27758",shade:"#7b5840",light:"#c29873"},io={fill:"#caa277",shade:"#a07b55",light:"#e3c49b"},Jr={fill:"#8e5d45",shade:"#694333",light:"#ae7b5d"},o0={fill:"#6b4d3b",shade:"#4f382b",light:"#86644d"},Dt={fill:R.bark,shade:R.barkDark,light:R.barkLight},Gs={fill:R.ivory,shade:R.ivoryDark,light:"#f7f0e4"},d_={fill:"#dcd2c2",shade:"#b8aa95",light:"#efe8dd"},hl={fill:"#f0e8da",shade:"#cdbfa9",light:"#fffaf2"},p_={fill:"#5d80b6",shade:"#48658f",light:"#86a6d6"},m_={fill:"#cf9a52",shade:"#a8783a",light:"#e6b976"},g_={fill:"#e6dac6",shade:"#c3b49c",light:"#f5eee2"},Fh={fill:"#4d4756",shade:"#37323f",light:"#6a6475"},oc={fill:R.sun,shade:R.sunDark,light:R.sunLight},jr={fill:"#b7ae9d",shade:"#8f8778",light:"#d5ccb8"},ps={fill:"#6d6680",shade:"#524c63",light:"#8a839b"},Xi={fill:R.horse,shade:R.horseDark,light:R.horseLight},yt={teal:{fill:R.crystalTeal,shade:R.crystalTealDark,light:R.crystalTealLight},blue:{fill:R.crystalBlue,shade:R.crystalBlueDark,light:R.crystalBlueLight},orange:{fill:R.crystalOrange,shade:R.crystalOrangeDark,light:R.crystalOrangeLight}},so="#8c62c6";function Rr(n,e,t,i,s,r=1.3,o=.8){return t.map(a=>{const c=s.range(n,Gn(n,e,.3)),l=s.range(Gn(n,e,.6),e);return k(pe([[c,a],[Gn(c,l,.5),a+s.range(-1.2,1.2)],[l,a+s.range(-.8,.8)]]),i,r,o)}).join("")}const __={fish:{parts:[{pts:[[.5,0],[.3,.17],[.02,.22],[-.22,.14],[-.3,0],[-.22,-.14],[.02,-.23],[.3,-.18]],round:!0},{pts:[[-.24,0],[-.5,.21],[-.43,0],[-.5,-.21]],round:!1},{pts:[[.12,-.19],[-.06,-.33],[-.12,-.15]],round:!1}],eye:[.3,-.05]},bird:{parts:[{pts:[[.36,-.08],[.24,.06],[-.05,.12],[-.3,.06],[-.36,-.01],[-.1,-.06],[.14,-.14],[.3,-.18]],round:!0},{pts:[[.36,-.14],[.52,-.1],[.37,-.04]],round:!1},{pts:[[.1,-.08],[.02,-.38],[-.12,-.52],[-.22,-.32],[-.14,-.05]],round:!0},{pts:[[-.28,.02],[-.52,.12],[-.5,-.04],[-.3,-.05]],round:!1}],eye:[.28,-.12]},moth:{parts:[{pts:[[0,-.12],[.34,-.36],[.46,-.1],[.12,.04]],round:!0},{pts:[[0,-.12],[-.34,-.36],[-.46,-.1],[-.12,.04]],round:!0},{pts:[[.02,.02],[.3,.2],[.18,.34],[.02,.18]],round:!0},{pts:[[-.02,.02],[-.3,.2],[-.18,.34],[-.02,.18]],round:!0},{pts:[[.05,-.22],[.06,.26],[-.06,.26],[-.05,-.22]],round:!0}],eye:[0,-.2]}};function es(n,e,t,i,s,r=.62,o="#e8f6f3"){const a=Math.cos(s),c=Math.sin(s),l=([d,m])=>[e+(d*a-m*c)*i,t+(d*c+m*a)*i],h=__[n];let u="";for(const d of h.parts)u+=ge(d.round?de(d.pts.map(l)):lt(d.pts.map(l)),ut);const f=l(h.eye);return Br(`opacity="${r}"`,u)+ft(f[0],f[1],Math.max(.7,i*.035),o,.85)}function Kt(n,e,t=3,i=""){const s=Math.sin(n.ang),r=-Math.cos(n.ang),o=Math.cos(n.ang),a=Math.sin(n.ang),c=o+a*.3>=0?1:-1,l=(_,p)=>[n.x+o*_*c+s*p,n.y+a*_*c+r*p],h=n.w/2,u=n.len,f=(n.shoulder??.72)*u,d=lt([l(-h,-1),l(-h,f),l(0,u),l(h,f),l(h,-1)]);lt([l(0,u),l(h,f),l(h,-1),l(h*.2,-1),l(h*.2,f*.97)]);const m=i+k(lt([l(-h*.5,f*.25),l(-h*.5,f*.88)],!1),e.light,Math.max(1,n.w*.09),.9)+k(lt([l(-h,f),l(0,u*.94),l(h*.2,f*.97)],!1),e.light,1,.5);return ue(d,{fill:e.fill,shade:e.shade,light:e.light,stroke:t,over:m})}function ma(n,e,t=0){return[n.x+Math.sin(n.ang)*n.len*e+Math.cos(n.ang)*t,n.y-Math.cos(n.ang)*n.len*e+Math.sin(n.ang)*t]}function Oh(n,e,t,i,s,r,o){return D(mt(n,e,t,i,3),Ni,{sx:3,sy:0,hx:2,hy:0})+D(mt(n-1.5,e-1,t+3,6,2),Ni,{sx:0,sy:2,hx:0,hy:1.5,stroke:2.6})+D(vt(s,r,o),Ni,{sx:2,sy:2,hx:1.5,hy:1.5,stroke:3})}function M_(){return nt("prop.bed",250,110,"bc",n=>{let e=on(126,108,118,4,.35);e+=ge(Zt(14,80,222,27),ut,.25),e+=D("M12 66V17Q13 5 27 6Q45 8 50 27V66Z",Ni,{sx:5,sy:0,over:ge(Bl(29,17,6.5),R.ivory)+k(Bl(29,17,6.5),ut,1.3)+ge(dr(41,24,2.8),R.ivory)+k(pe([[16,34],[18,50],[16,64]]),Ni.shade,1.3)});let t="";for(let r=22;r<234;r+=7)t+=k(`M${r} 38V64`,"#cbbfaa",1.3);e+=D(mt(16,38,218,25,7),d_,{sx:0,sy:4,hx:0,hy:2,inner:t}),e+=D(mt(10,60,230,22,4),Ni,{sx:0,sy:5,hx:0,hy:2.5,over:Rr(16,234,[66,72,77],Ni.shade,n)+ft(22,71,3,Ni.shade)+ft(228,71,3,Ni.shade)}),e+=D(de([[22,41],[19,32],[25,24],[41,21],[59,22],[70,27],[73,35],[67,41],[45,43]]),hl,{sx:3,sy:4,stroke:3,over:k(pe([[33,27],[40,31],[49,30]]),hl.shade,1.6)+k(pe([[62,28],[66,33]]),hl.shade,1.4)});const i=wt([[74,38,1],[237,38,1],[239,52],[237,77,1],[222,79.5],[206,76],[190,79.5],[174,76],[158,79.5],[142,76],[126,79.5],[110,76],[94,79.5],[78,77,1],[73,58]]);e+=Br('transform="translate(2 4)"',ge(i,ut,.3));let s="";for(const r of[102,136,170,204])s+=ge(Zt(r,30,11,60),so)+ge(Zt(r+15,30,2.5,60),so,.85);return e+=D(i,Gs,{sx:3,sy:4,hx:0,hy:2.5,inner:s,over:ge(Zt(72,36,17,46),"#f5eee2")+ge(Zt(76,36,4,46),so,.9)+k("M89 38.5V78",ut,2)+k(pe([[124,46],[127,60],[124,72]]),Gs.shade,1.5,.8)+k(pe([[192,44],[195,58],[192,70]]),Gs.shade,1.5,.8)}),e+=Oh(4,12,12,96,10,7,6),e+=Oh(234,29,12,79,240,24,5),e})}function v_(n,e,t){const i=c=>c.map(([l,h])=>[n+l*t,e+h*t]),s={fill:R.ivory,shade:R.ivoryDark,sx:1.5,sy:1.5,stroke:1.6},r=de(i([[.46,.06],[.36,-.16],[.08,-.25],[-.2,-.16],[-.34,.02],[-.22,.18],[.08,.24],[.34,.2]])),o=de(i([[-.28,.04],[-.42,-.1],[-.56,-.24],[-.52,-.04],[-.62,.08],[-.42,.08]])),a=i([[.24,-.05]])[0];return ue(o,s)+ue(r,{...s,over:ft(a[0],a[1],1.4,ut)+k(pe(i([[.45,.08],[.3,.11],[.18,.08]])),ut,1)})+k(pe(i([[.1,-.27],[.06,-.4],[-.02,-.46]])),R.ivory,1.6)+k(pe(i([[.14,-.27],[.2,-.4],[.28,-.44]])),R.ivory,1.6)}function x_(n,e,t,i=!1){const s=[[0,-1],[.55,-.5],[.55,.5],[0,1],[-.55,.5],[-.55,-.5]].map(([r,o])=>[n+r*t,e+o*t]);return ue(lt(s),{...yt.teal,stroke:1.8,shadeD:lt([[n,e-t],[n+.55*t,e-.5*t],[n+.55*t,e+.5*t],[n,e+t],[n+.12*t,e]]),over:(i?es("fish",n-.05*t,e+.1*t,t*.85,-.5,.55):"")+k(`M${n-.3*t} ${e-.4*t}V${e+.3*t}`,yt.teal.light,1.2)})}function fl(n,e,t,i,s){let o="";for(let a=0;a<3;a++){const c=n+8+s.range(0,42),l=s.chance(.5)?e+8+s.range(-1,2):e+58-8+s.range(-2,1);o+=ge(xe(c,l,s.range(2,3.5),s.range(1.2,2)),io.fill)}return D(mt(n,e,58,58,5),io,{sx:4,sy:4,hx:2.5,hy:2.5,over:Rr(n+4,n+58-4,[e+4,e+58-4.5],io.shade,s,1.1)})+D(mt(n+8,e+8,42,42,3),t,{sx:3,sy:3,hx:1.5,hy:1.5,stroke:2.2,over:i+o})}function y_(){return nt("prop.blocks",130,122,"bc",n=>{let e=on(65,121,62,3,.35);return e+=fl(7,64,p_,v_(37,94,30),n),e+=fl(65,64,m_,D(dr(94,94,14,.46),Gs,{stroke:1.6,sx:1.5,sy:1.5,hx:0,hy:0}),n),e+=fl(37,6,g_,x_(66,35,14,!0),n),e})}function ul(n,e=1.1,t="2.2 2.2"){return`<path d="${n}" fill="none" stroke="${ut}" stroke-width="${e}" stroke-dasharray="${t}" stroke-linecap="round"/>`}function S_(){return nt("prop.toywhale",90,56,"bc",()=>{const n="#b9c2df",e="#f4ecdc";let t=on(46,54.5,36,2.2,.18);t+=ue(de([[16,36],[10,30],[4,24],[2,17],[7,18],[11,24],[11,15],[15,12],[16,20],[19,31]]),{fill:n,stroke:1.8});const i=wt([[15,37],[22,30],[36,22],[52,15],[66,12],[80,12],[86,16,1],[88,26],[87,38,1],[80,44],[60,47],[40,46],[26,43]]),s=ge(de([[26,43],[40,40],[58,41],[80,40],[90,38],[90,56],[20,56]]),"#d4dbee")+ue(lt([[31,25.5],[41.5,23.5],[43.5,33],[33,35]]),{fill:"#f2b6cf",stroke:0,over:ul("M32 26.4L41 24.6L42.6 32.4L33.6 34.2Z",.9,"1.6 1.6")})+k(pe([[50,22],[54,20],[58,21.5]]),ut,1)+k(pe([[47,27],[51,25.2],[55,26.6]]),ut,1)+k(pe([[21,35.5],[24,33.2],[27,34]]),ut,.9);t+=ue(i,{fill:n,stroke:2,inner:s}),t+=ul(pe([[60,13],[57,24],[58,35],[61,45.5]])),t+=ul(pe([[27,42],[40,39.6],[58,40.4],[80,39.4],[87,37.6]]));let r="";for(const o of[64,69,74,79])r+=ue(`M${o} 44.6L${o+3.4} 44.6L${o+1.7} 41.8Z`,{fill:"#ffffff",stroke:.8});t+=ue(de([[60,45.5],[72,44],[84,43.5],[86.5,45.5],[82,48.5],[66,49]]),{fill:e,stroke:1.5})+r,t+=ue(vt(66,28,3.4),{fill:ut,stroke:0}),t+=k("M64.6 26.6L67.4 29.4M67.4 26.6L64.6 29.4","#dfe4f2",.8),t+=ue(lt([[19,38.5],[25.5,40.5],[23.5,48],[17,46]]),{fill:b_,stroke:1.2,over:k("M19.2 42.6q1.2-1 2.4 0t2.4 0M18.6 45q1.2-1 2.4 0","#d9737e",.8)}),t+=k(pe([[82,12],[81,8],[83,5]]),ut,1.4);for(const[o,a,c]of[[79,4.5,2.6],[84.5,3,2.4],[87.4,6.5,2.1]])t+=ue(vt(o,a,c),{fill:"#bfe4ea",stroke:1.1});return t})}const b_="#f7efdc";function ks(n,e=2){return Br('transform="translate(1.1 1.3)"',k(n,"#141120",e+.6,.9))+k(n,"#a99dbf",e)}function dl(n,e,t,i,s=1.12){const r=[],o=i.range(0,Math.PI*2);for(let a=0;a<=14;a++)r.push(Qe(n,e,t*(1+i.range(-.08,.08)),o+a/14*s*Math.PI*2));return pe(r)}function T_(){return nt("prop.marks",230,260,"c",n=>{const e={fill:"#2e2840",shade:"#241f33",light:"#3b3450"},t=[];for(let r=0;r<16;r++){const o=r/16*Math.PI*2;t.push([115+Math.cos(o)*106*n.range(.88,1.03),130+Math.sin(o)*124*n.range(.9,1.03)])}let i="";for(let r=0;r<9;r++){const o=n.range(24,206),a=n.range(20,240);i+=ge(xe(o,a,n.range(2,5),n.range(1.5,3)),e.light,.9)}i+=k(pe([[6,180],[40,170],[60,188],[96,196]]),e.shade,3)+k(pe([[150,12],[168,40],[200,52]]),e.shade,2.5);let s=D(de(t),e,{sx:6,sy:6,hx:3,hy:3,stroke:3,inner:i});for(let r=0;r<14;r++){const o=r<7?0:1,a=r%7,c=(o?142:86)+n.range(-3,3),l=222-a*27+n.range(-2,2)-o*7;if(s+=ks(`M${Ne(c-26)} ${Ne(l+n.range(-1,1))}L${Ne(c-13)} ${Ne(l)}`,1.8),r<13){s+=ks(dl(c,l,8.5,n),2);continue}s+=tt(c,l,26,R.vein,.28),s+=ge(vt(c,l,9.5),"#c7aef0",.9),s+=ks(dl(c,l,9.5,n,1.05),2.4),s+=ks(dl(c,l,15,n,1.2),1.8),s+=ks($l("1",c+22,l-17,12,32,n),2.4),s+=ks($l("4",c+36,l-17,20,32,n),2.4)}for(let r=0;r<4;r++){const o=36+r*5+n.range(-1,1);s+=ks(`M${o} ${40+n.range(-2,2)}l${Ne(n.range(3,6))} ${Ne(n.range(16,22))}`,1.4)}return s})}function E_(){return nt("prop.fourteen",180,120,"c",n=>{const e={fill:R.ivory,shade:"#c8b99f",light:"#fbf6ec"},t=a=>[a[0]+n.range(-1.5,1.5),a[1]+n.range(-1.5,1.5)],i=[[[[33,33],[46,22],[60,12]],9,14],[[[60,11],[59,40],[58.5,70],[57,98]],16,13],[[[37,100],[58,98.5],[79,99]],10,11],[[[131,11],[113,37],[96,61],[84,75]],12,15],[[[83,75],[110,73],[136,72.5],[158,70]],14,9],[[[131,24],[130.5,60],[129,104]],17,12]],s=[];let r="";for(const[a,c,l]of i){const h=a.map(t);s.push(ce(h,c,l)),r+=k(pe(ui(h,c*.22)),e.shade,1.1,.7)+k(pe(Ar(ui(h,-c*.18),.1,.7)),e.light,1.2,.8)}for(const[a,c,l,h]of[[45,101,11,4.5],[70,101,18,4],[101,76,14,4.5],[147,74,9,3.5],[127,107,7,4],[59,99,6,3.5]])s.push(de([[a-h/2,c-4],[a+h/2,c-4],[a+h*.38,c+l*.7],[a+h*.62,c+l],[a,c+l+h*.75],[a-h*.62,c+l],[a-h*.38,c+l*.7]]));let o=Ts(s,e,{sx:2.5,sy:2.5,hx:1.5,hy:1.5},4,R.inkSoft);o+=r;for(let a=0;a<7;a++)o+=ft(n.range(20,165),n.range(8,112),n.range(.8,2),R.ivory,.8);return o})}function w_(){return nt("prop.window",170,200,"c",n=>{const e={fill:"#8f6a4f",shade:"#6c4f3b",light:"#ad8768"},t=23,i=21,s=147,r=171;let o=ge(Zt(t-4,i-4,s-t+8,r-i+8),"#2a2340");["#3a2f54","#2f2746","#4b3c6c","#352b4e","#413461","#2c2442"].forEach((m,_)=>{const p=i+12+_*25,g=[];for(let b=t-6;b<=s+6;b+=16)g.push([b,p+Math.sin(b/23+_*1.7)*4+(b-85)*.08]);o+=ge(pe(g)+`L${s+6} ${r+6}L${t-6} ${r+6}Z`,m),o+=k(pe(g),ut,1.4,.55)});for(let m=0;m<12;m++)o+=D(xe(n.range(t,s),n.range(i,r),n.range(2,4),n.range(1.5,2.5)),{fill:"#54467a",shade:"#3b3157",light:"#6a5b94"},{stroke:1.2,sx:1,sy:1,hx:.5,hy:.5});o+=tt(85,92,92,R.violet,.42),o+=D(ce([[14,52],[52,66],[92,94],[156,122]],15,8),ps,{stroke:2.6,sx:2,sy:3,over:k(pe([[30,58],[62,72],[96,96]]),ps.shade,1.2)}),o+=D(ce([[66,76],[80,58],[98,42],[112,30]],7,3),ps,{stroke:2.2,sx:1.5,sy:1.5});const c={x:44,y:166,len:42,w:19,ang:.42};o+=Kt({x:30,y:168,len:22,w:11,ang:-.3},yt.teal,2.2),o+=Kt(c,yt.teal,2.4,es("fish",...ma(c,.45),15,.42-Math.PI/2+.3,.6));const l={x:136,y:24,len:38,w:17,ang:Math.PI+.55};o+=Kt(l,yt.blue,2.4,es("fish",...ma(l,.5),13,2.4,.6)),o+=Kt({x:118,y:22,len:20,w:10,ang:Math.PI-.1},yt.blue,2);for(const[m,_]of[[t,i],[89,i],[t,99],[89,99]])o+=ge(`M${m} ${_}H${m+58}V${_+6}H${m+5}V${_+72}H${m}Z`,ut,.35),o+=k(`M${m+16} ${_+60}L${m+48} ${_+14}`,"#ffffff",7,.1),o+=k(`M${m+30} ${_+62}L${m+52} ${_+31}`,"#ffffff",2.2,.16);let h=ac(Zt(t,i,s-t,r-i),o);const u=mt(10,8,150,176,5)+aa(t,i,58,70)+aa(89,i,58,70)+aa(t,99,58,72)+aa(89,99,58,72);h+=D(u,e,{sx:3.5,sy:3.5,over:Rr(14,156,[13,179],e.shade,n,1.2)+k("M16 30V160M154 36V150",e.shade,1.2,.7)}),h+=D(vt(85,95,4.5),oc,{stroke:2,sx:1.2,sy:1.2,hx:1,hy:1});for(const m of[26,144])h+=D(`M${m-7} 190H${m+7}L${m+3} 199H${m-3}Z`,e,{stroke:2.4,sx:2,sy:1});h+=D(mt(2,180,166,12,3),e,{sx:0,sy:4,hx:0,hy:2});let f="";for(let m=14;m<164;m+=22)f+=ge(Zt(m,0,7,30),so,.9);const d=[[6,3,1],[164,3,1]];for(let m=164;m>=6;m-=19.75)d.push([m,22],[m-9.9,27.5]);return d.push([6,22,1]),h+=D(wt(d),Gs,{sx:2,sy:3.5,hx:0,hy:2,stroke:3,inner:f,over:k("M26 6V20M65 6V22M105 6V22M145 6V20",Gs.shade,1.3,.8)}),h+=D(mt(0,.5,170,5,2.5),o0,{stroke:2.4,sx:0,sy:1.5,hx:0,hy:1}),h})}function A_(){return nt("prop.chest",160,86,"bc",n=>{let e=on(80,84,76,3,.35);for(const i of[14,130])e+=D(mt(i,74,16,12,2),o0,{stroke:2.6,sx:2,sy:1});const t=ge(Bl(48,48.5,8.5),R.ivory,.85)+ge(dr(99,47,5,.45,5,-1.3),R.ivory,.85)+ge(dr(115,51,3.5,.45,5,-1.8),R.ivory,.85)+ge(dr(88,53,3,.45,5,-1.5),R.ivory,.85)+ge(dr(112,69,3,.45,5,-1.2),R.ivory,.7);e+=D(mt(9,20,142,58,3),Jr,{sx:5,sy:4,inner:t,over:k("M11 39H149M11 58H149",Jr.shade,1.6)+Rr(12,148,[28,47,67],Jr.shade,n,1.1,.6)}),e+=D(mt(4,4,152,19,5),Jr,{sx:0,sy:4,hx:0,hy:2.5,over:Rr(8,150,[10],Jr.shade,n,1.1,.6)});for(const i of[20,132]){e+=D(Zt(i,4,8,74),Fh,{stroke:2.4,sx:2,sy:0,hx:1,hy:0});for(const s of[12,31,50,69])e+=ft(i+4,s,1.6,Fh.light)}return e+=D(mt(71,14,18,22,4),oc,{stroke:2.4,sx:2,sy:2,hx:1,hy:1,over:ge("M80 21.5a2.6 2.6 0 1 1 -0.01 0M78.6 23.5L77.8 30H82.2L81.4 23.5Z",ut)}),e})}function R_(){return nt("prop.toyhorse",80,70,"bc",()=>{const n={fill:"#efe5d4",shade:"#c9b99f",light:"#fffaf0"};let e=on(40,68,34,2.5,.35);const t={...Xi,fill:R.horseDark,shade:"#44246f",light:R.horse};return e+=D(ce([[30,40],[27,52],[24,61]],6,5),t,{stroke:2.4,sx:1.5,sy:0}),e+=D(ce([[55,40],[58,52],[60,61]],6,5),t,{stroke:2.4,sx:1.5,sy:0}),e+=D(ce([[2,52],[14,61],[30,66],[50,66],[66,61],[78,52]],6.5,6),Ni,{stroke:2.6,sx:0,sy:2.5,hx:0,hy:1.5}),e+=D(ce([[26,40],[22,52],[18,62]],6.5,5.5),Xi,{stroke:2.4,sx:1.5,sy:0}),e+=D(ce([[52,40],[55,52],[57,62]],6.5,5.5),Xi,{stroke:2.4,sx:1.5,sy:0}),e+=Ts([ce([[19,30],[12,36],[8,46],[10,54]],5,3),ce([[19,31],[15,40],[15,49]],4,2.5)],n,{sx:1.5,sy:1},2.4),e+=D(de([[20,30],[26,25],[42,24],[52,26],[59,31],[58,41],[50,45],[34,45],[23,42],[18,36]]),Xi,{sx:2.5,sy:3,stroke:2.8,over:ft(30,38,1.6,R.horseLight,.8)+ft(36,41,1.2,R.horseLight,.8)+ft(44,38,1.4,R.horseLight,.8)}),e+=D(de([[50,32],[53,20],[58,11],[63,5],[68,6],[74,10],[79,17],[78.5,22.5],[73,24],[67,20],[63,26],[60,36]]),Xi,{sx:2,sy:2.5,stroke:2.8,over:ft(69,11.5,1.8,ut)+ft(69.6,10.9,.6,"#fff")+ft(77,19.5,.9,ut)+k(pe([[72.5,23.5],[75.5,21.5]]),ut,1)}),e+=D(lt([[62,7],[63,0],[67,5.5]]),Xi,{stroke:2,sx:.8,sy:.8,hx:.6,hy:.6}),e+=Ts([ce([[62,5],[57,11],[53,20],[51,29]],5.5,3.5),ce([[60,8],[56,14],[55.5,21]],4.5,2.5)],n,{sx:1.5,sy:1},2.4),e+=D(de([[31,25.5],[39,23.5],[47,25],[48,31],[40,33],[31,31]]),oc,{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1}),e+=D(mt(59,12,11,4,2),io,{stroke:1.8,sx:0,sy:1,hx:0,hy:.8}),e})}function C_(){return nt("prop.lamp",90,190,"tc",()=>{const n=yt.orange;let e=tt(45,150,44,"#f2b36a",.55);e+=D(ce([[45,3],[30,1],[16,-1]],8,3),Dt,{stroke:2.6,sx:0,sy:2}),e+=D(ce([[45,3],[60,1],[76,0]],8,3),Dt,{stroke:2.6,sx:0,sy:2});const t=s=>Array.from({length:11},(r,o)=>[45+Math.sin(o*1.15+s)*3.8,1+o*11.8]);e+=D(ce(t(Math.PI),6.5,5),{...Dt,fill:R.barkDark},{stroke:2.4,sx:1.5,sy:0}),e+=D(ce(t(0),7,5.5),Dt,{stroke:2.4,sx:2,sy:0,over:k(pe(t(.4).slice(1,9)),R.violet,1,.55)}),e+=D(ce([[47,46],[55,52],[60,50]],3.5,1.5),Dt,{stroke:1.8,sx:1,sy:1}),e+=D(ce([[43,80],[35,86],[31,84]],3.5,1.5),Dt,{stroke:1.8,sx:1,sy:1});const i={x:45,y:118,len:60,w:30,ang:Math.PI,shoulder:.45};e+=Kt({x:34,y:124,len:30,w:14,ang:Math.PI+.45,shoulder:.5},n,2.6),e+=Kt({x:57,y:124,len:32,w:14,ang:Math.PI-.5,shoulder:.5},n,2.6),e+=Kt(i,n,3,tt(45,142,18,"#fff1c9",.8)+es("moth",45,146,15,.25,.5,"#fff4d8"));for(const s of[[[43,116],[33,124],[30,138],[33,150]],[[47,116],[58,125],[60,138],[57,149]],[[45,118],[46,128],[44,138]]])e+=D(ce(s,6,2.5),Dt,{stroke:2.2,sx:1.5,sy:.5});return e+=D(xe(45,116,9,5),Dt,{stroke:2.4,sx:0,sy:2}),e+=tt(45,146,20,"#ffe3a1",.35),e})}function L_(){return nt("prop.rootdoor.open",220,280,"bc",n=>{const e={fill:"#9cc47a",shade:"#86b06a",light:"#b4d894"},t={fill:"#a6e0c6",shade:"#8fcfb4",light:"#d6f4e6"},i=(r,o,a,c=!1)=>D(ce(r,o,a),Dt,{stroke:2.4,over:c?k(pe(r),R.vein,1.1,.55):""});let s="";for(const r of[-1,1]){const o=110+r*82;for(let l=0;l<4;l++){const h=[110+r*(30+l*13),44],u=[o+r*(l-1.5)*3,150],f=[o+r*(-14+l*11),206],d=[o+r*(-26+l*17)+n.range(-3,3),280],m=[Gn(h[0],u[0],.5)-r*(10-l*2),96];s+=i([h,m,u,f,d],13-l,10-l*.5,l===1)}const[a,c]=[o+r*1,150];s+=tt(a,c,20,"#d6f4e6",.45),s+=D(xe(a,c,15,9),t,{stroke:2,inner:k(xe(a,c,10,5),"#72b99b",1,.8)}),s+=D(`M${a-5} ${c-9}L${a} ${c-20}L${a+5} ${c-9}Z`,t,{stroke:1.6});for(const[l,h,u]of[[o-r*14,104,-.6],[o+r*12,226,.5]]){const f=Qe(l,h,13,r>0?-Math.PI+u:u);s+=D(`M${l} ${h}Q${(l+f[0])/2} ${h-7} ${f[0]} ${f[1]}Q${(l+f[0])/2} ${h+5} ${l} ${h}Z`,e,{stroke:1.4})}}for(let r=0;r<3;r++){const o=Array.from({length:7},(a,c)=>[-6+c*38.6,22+r*9+Math.sin(c*1.25+r*2.1)*7]);s+=i(o,14-r*2,12-r*2,r===1)}for(const[r,o,a]of[[64,26,!1],[80,40,!0],[96,22,!1],[112,34,!1],[128,46,!0],[144,24,!1],[158,30,!1]]){const c=[[r,42],[r+n.range(-4,4),42+o*.55],[r+n.range(-6,6),42+o]];if(s+=D(ce(c,5,1.4),Dt,{stroke:1.6}),a){const[l,h]=c[2];s+=D(`M${l} ${h}Q${l-6} ${h+6} ${l} ${h+12}Q${l+6} ${h+6} ${l} ${h}Z`,e,{stroke:1.2})}}return s})}function Bh(n){return n?L_():nt(n?"prop.rootdoor.open":"prop.rootdoor",120,250,"bc",e=>{const t={fill:R.barkDark,shade:"#3a2e40",light:R.bark};let i=ge("M3 252V26Q60 -10 117 26V252Z","#17131f");const s=(o,a,c,l)=>Array.from({length:9},(h,u)=>{const f=-6+u*32.5,d=l*Math.sin(Math.PI*Math.max(0,Math.min(250,f))/250);return[o+Math.sin(u*.9+c)*a+d,f]}),r=(o,a=Dt,c=!1)=>{const l=k(pe(ui(o.pts,o.w0*.18)),a.shade,1.3,.8)+(c?k(pe(Ar(ui(o.pts,-o.w0*.12),.1,.85,8)),R.violet,1.4,.7):"");return D(ce(o.pts,o.w0,o.w1),a,{sx:4,sy:1,hx:2,hy:0,stroke:3.2,over:l})};if(n){i+=ge("M30 252V60Q31 28 60 24Q89 28 90 60V252Z","#0d0b13"),i+=tt(60,170,56,R.violet,.16),i+=k(pe([[40,250],[52,236],[70,238],[84,250]]),"#241d30",3,.8);const o=[{pts:[[-6,60],[14,30],[40,14],[62,10],[86,16],[108,32],[126,58]],w0:16,w1:14},{pts:[[-6,30],[30,4],[70,0],[100,8],[126,26]],w0:12,w1:11}];i+=r(o[1],t);const a=[6,18,29].map((l,h)=>({pts:s(l,3,h*1.7,-8+h*2),w0:20,w1:17})),c=[91,102,114].map((l,h)=>({pts:s(l,3,h*2.3,8-h*2),w0:20,w1:17}));i+=r(a[0])+r(c[2])+r(a[2],Dt,!0)+r(c[0],Dt,!0)+r(a[1])+r(c[1]),i+=r(o[0],Dt,!0);for(const[l,h]of[[40,40],[52,26],[67,34],[80,22]])i+=D(ce([[l,18],[l+e.range(-3,3),18+h*.5],[l+e.range(-4,4),18+h]],4,1.2),Dt,{stroke:2,sx:1,sy:0});for(const[l,h,u]of[[30,120,1],[90,150,-1],[30,196,1],[90,84,-1]])i+=D(ce([[l,h],[l+u*8,h+4],[l+u*13,h+12]],6,2),Dt,{stroke:2.2,sx:1,sy:1})}else{const o=(h,u,f,d)=>({pts:Array.from({length:6},(m,_)=>[-8+_*27,Gn(h,u,_/5)+Math.sin(_*1.3+f)*7]),w0:d,w1:d*.75}),a=[9,33,59,86,111].map((h,u)=>({pts:s(h+e.range(-3,3),8+e.range(0,4),u*1.9,0),w0:e.range(18,23),w1:e.range(14,18)})),c=[o(40,70,.3,14),o(120,88,1.8,13),o(150,196,2.9,14),o(214,180,.9,12),o(18,8,2.2,12),o(92,128,4.1,11),{pts:[[-4,150],[22,176],[52,196],[80,226],[100,256]],w0:13,w1:10},{pts:[[124,50],[100,76],[74,92],[50,118],[30,150]],w0:12,w1:9}];i+=r(c[0],t)+r(c[2],t),i+=r(a[0])+r(a[2],Dt,!0)+r(a[4]),i+=r(c[1])+r(c[3]),i+=r(a[1],Dt,!0)+r(a[3]),i+=r(c[6],Dt,!0),i+=r(c[4])+r(c[5])+r(c[7]);const l=[];for(let h=0;h<10;h++)l.push(Qe(60,128,17*e.range(.85,1.1),h/10*Math.PI*2));i+=D(de(l),Dt,{sx:4,sy:4,stroke:3.2,over:k(xe(55,122,5,3.5),R.barkDark,1.3)}),i+=tt(60,129,16,R.violet,.6),i+=k(vt(60,129,6),R.violet,3)+k(vt(60,129,6),R.vein,1.2)}return i+=D(ce([[16,244],[4,250],[-6,252]],10,5),Dt,{stroke:2.6,sx:0,sy:2}),i+=D(ce([[104,244],[116,250],[126,252]],10,5),Dt,{stroke:2.6,sx:0,sy:2}),i})}function P_(){return nt("prop.fossil",260,150,"c",n=>{const e={fill:"#3b3550",shade:"#2e293f",light:"#4a4462"},t=[];for(let a=0;a<16;a++){const c=a/16*Math.PI*2;t.push([130+Math.cos(c)*124*n.range(.92,1.02),76+Math.sin(c)*68*n.range(.88,1.02)])}let i="";for(let a=0;a<5;a++){const c=n.range(20,240),l=n.range(20,130);i+=k(lt([[c,l],[c+n.range(-10,10),l+n.range(6,12)],[c+n.range(-14,14),l+n.range(14,22)]],!1),e.shade,1.5)}let s=D(de(t),e,{sx:6,sy:6,hx:3,hy:3,stroke:3.5,inner:i});const r=(a,c=2.4)=>D(a,jr,{sx:1.5,sy:1.5,hx:1,hy:1,stroke:c}),o=[];for(let a=0;a<=16;a++){const c=a/16;o.push([168-c*150,66-Math.sin(c*Math.PI*.9)*14+c*6])}s+=k(de([[20,66],[8,52],[2,46],[10,62],[4,80],[12,76],[20,70]]),jr.shade,1.6,.7);for(let a=1;a<=8;a++){const[c,l]=o[a],h=42-Math.abs(a-3.5)*4;s+=r(ce([[c,l+4],[c-4,l+h*.45],[c-12,l+h*.85],[c-18,l+h]],5,2.2),2)}o.forEach(([a,c],l)=>{const h=1-l/16*.6;s+=r(ce([[a,c-5*h],[a-2,c-11*h]],4*h,2),1.8),s+=r(mt(a-4.5*h,c-5.5*h,9*h,11*h,3*h),2)});for(const[a,c]of[[1.9,22],[2.2,26],[2.5,20]]){const l=Qe(160,94,c,a);s+=r(ce([[160,94],[Gn(160,l[0],.5),Gn(94,l[1],.5)+1],l],4,2),1.8)}return s+=r(ce([[170,74],[166,86],[160,94]],6,4.5)),s+=r(de([[176,86],[204,93],[234,88],[248,81],[244,89],[212,100],[182,96]]),2.6),s+=D(de([[166,60],[180,45],[206,40],[232,45],[250,57],[253,70],[241,79],[214,85],[186,85],[170,77]]),jr,{sx:3,sy:3,hx:1.5,hy:1.5,stroke:2.8,over:ge(xe(217,59,7.5,5.5),e.shade)+k(xe(217,59,7.5,5.5),ut,1.6)+ge(xe(195,50,4,2.5),e.shade)+k(pe([[180,72],[206,76],[240,72]]),jr.shade,1.4)+k(pe([[228,48],[236,60],[233,70]]),jr.shade,1.2)}),s})}function ts(n,e,t,i,s,r=2){const o=[];for(let a=0;a<7;a++){const c=Qe(0,0,t*i.range(.82,1.08),a/7*Math.PI*2+i.range(-.2,.2));o.push([n+c[0],e+c[1]*.72])}return D(de(o),s,{stroke:r,sx:t*.22,sy:t*.3,hx:t*.15,hy:t*.18})}function D_(){return nt("prop.coil",320,110,"bc",n=>{const i=[[6,100],[36,98],[72,100.5],[110,97.5],[150,99.5],[190,96]],s=[9,15,21,26,30,33],r=28;for(let h=0;h<=r;h++){const u=h/r;i.push(Qe(234,55,Gn(38,7,u),Math.PI/2-u*Math.PI*2*1.15)),s.push(Gn(35,13,u))}const o=pa(i,s,.9);let a="";for(let h=2;h<i.length-2;h+=2){const u=i[h-1],f=i[h+1],d=i[h],m=Math.hypot(f[0]-u[0],f[1]-u[1])||1,_=(f[0]-u[0])/m,p=(f[1]-u[1])/m,g=s[h]*.42,b=n.range(1.5,3.5);a+=k(pe([[d[0]-p*g,d[1]+_*g],[d[0]+_*b,d[1]+p*b],[d[0]+p*g,d[1]-_*g]]),R.barkDark,1.4,.85)}a+=k(pe(ui(i.slice(3),6)),R.barkDark,1.3,.7),a+=k(pe(ui(i.slice(1,31),-3)),R.violet,1.8,.45),a+=k(pe(ui(i.slice(9,18),8)),R.violet,1.2,.4);for(const h of[9,16,23]){const u=i[h];a+=k(xe(u[0]+n.range(-3,3),u[1]+n.range(-3,3),2.8,4),R.barkDark,1.3,.9)}let c=on(168,107,152,5,.35);for(const[h,u,f]of[[60,104,-8],[118,104,6],[176,105,-7],[214,108,10],[262,106,12]])c+=D(ce([[h,u-4],[h+f*.6,u+1],[h+f,u+4]],4,1.4),Dt,{stroke:2,sx:1,sy:1});c+=D(o,Dt,{sx:2,sy:6,hx:2,hy:3,stroke:3.8,over:a});const l=i[i.length-1];return c+=tt(l[0],l[1],12,R.violet,.35),c})}const $h=[[[60,246],[84,206],[100,160],[104,110],[110,70],[118,40]],[[112,240],[118,200],[122,150],[124,100],[130,60],[134,28]],[[168,244],[164,200],[160,150],[158,100],[156,60],[152,26]],[[236,238],[208,200],[192,150],[186,100],[182,56]]];function I_(){return nt("prop.fossilroot",300,260,"bc",n=>{const e=wt([[0,260,1],[0,257],[24,250],[50,237],[72,216],[86,188],[93,150],[95,112],[99,80],[106,54],[111,40,1],[117,28,1],[124,14,1],[131,25,1],[140,6,1],[148,22,1],[157,11,1],[164,27,1],[176,19,1],[183,38,1],[194,58],[197,96],[199,138],[206,178],[224,212],[252,236],[280,249],[300,256],[300,260,1]]),t=[ce([[80,226],[48,244],[16,252],[-8,256]],34,8),ce([[222,222],[256,240],[288,250],[308,254]],30,8)];let i="";for(const c of $h)i+=k(pe(c.map(([l,h])=>[l+n.range(-2,2),h])),ps.shade,2,.9);for(const c of $h.slice(0,3))i+=k(pe(ui(c,9).slice(1,5)),ps.light,1.4,.55);for(const[c,l,h]of[[118,58,18],[178,150,16],[104,196,22],[160,222,18]])i+=k(lt([[c,l],[c+3,l+h*.4],[c-1,l+h*.7],[c+2,l+h]],!1),ut,1.6,.8);const s=de([[168,22],[184,40],[194,60],[197,100],[199,140],[207,180],[226,214],[256,238],[300,256],[300,264],[176,264],[180,220],[174,170],[170,110],[170,60]]);let r=on(150,258,150,4,.35);r+=Ts([...t,e],ps,{sx:5,sy:3,hx:3,hy:2,shadeD:s,inner:i},4);const o={fill:"#262131",shade:"#1b1824",light:"#322c40"};for(const c of[[[112,150],[104,190],[84,222],[52,244],[18,256]],[[182,146],[192,188],[212,220],[244,242],[280,255]]])r+=D(pa(c,[4,12,18,20,16]),ps,{sx:3,sy:3,hx:2,hy:1,stroke:3.2,over:k(pe(ui(c,3).slice(1)),ps.shade,1.4,.8)});r+=D(xe(158,118,9,13),o,{sx:-3,sy:-3,hx:0,hy:0,stroke:3});const a=(c,l,h,u,f,d)=>{let m=D(xe(c,l+1,f*.42,f*.22),o,{stroke:2.4,sx:0,sy:0,hx:0,hy:0});m+=Kt({x:c-5,y:l,len:f*.62,w:f*.34,ang:h-.42},u,2.4),m+=Kt({x:c+5,y:l,len:f*.7,w:f*.34,ang:h+.4},u,2.4);const _={x:c,y:l+2,len:f,w:f*.42,ang:h};return m+=Kt(_,u,2.6,d?es(d,...ma(_,.44),f*.36,h-Math.PI/2+.4,.6):""),m};return r+=a(98,96,-1.15,yt.teal,22),r+=a(192,118,1.1,yt.blue,22),r+=a(116,150,-.35,yt.teal,34,"bird"),r+=Kt({x:140,y:18,len:20,w:9,ang:.2},yt.blue,2.2),r+=Kt({x:131,y:24,len:14,w:8,ang:-.5},yt.teal,2),r})}function pl(n,e,t){return nt(n,120,100,"bc",i=>{const s=f=>({...f,ang:f.ang+i.range(-.06,.06),len:f.len*i.range(.94,1.04)});let r=tt(60,60,54,e.light,.24);const o=s({x:60,y:93,len:82,w:28,ang:.05}),a=[s({x:24,y:92,len:30,w:14,ang:-.75}),s({x:98,y:92,len:28,w:13,ang:.8}),s({x:40,y:92,len:54,w:20,ang:-.36}),s({x:82,y:92,len:60,w:21,ang:.32})];for(const f of a)r+=Kt(f,e,3);const[c,l]=ma(o,.46,-1);r+=Kt(o,e,3.2,es(t,c,l,21,t==="fish"?-1.2:-.35,.62));const h={fill:"#4a4458",shade:"#383346",light:"#5c566c"},u={fill:"#7a7490",shade:"#5a546e",light:"#948ea8"};r+=D(de([[6,101],[12,93],[30,89],[50,91],[72,88],[94,90],[110,93],[116,101]]),h,{sx:0,sy:3,hx:0,hy:2,stroke:3});for(const[f,d,m]of[[18,96,6],[76,95,5],[104,97,4.5]])r+=ts(f,d,m,i,u,1.8);return r})}function k_(){return nt("prop.pool.poison",560,90,"bc",n=>{const t=h=>8+2.6*Math.sin(h/34+.6)+1.6*Math.sin(h/13.5+2.1),i=[];for(let h=0;h<=560;h+=8)i.push([h,t(h)]);const s=pe(i)+"L560 90L0 90Z";let r="M0 -10H560";for(let h=i.length-1;h>=0;h--)r+=`L${Ne(i[h][0])} ${Ne(i[h][1])}`;r+="Z";let o="";for(const[h,u,f,d]of[[62,84,-.22,yt.teal],[84,46,.42,yt.teal],[214,64,.2,yt.orange],[232,40,.6,yt.orange],[470,86,.1,yt.teal],[446,52,-.5,yt.blue],[528,44,.35,yt.teal]])o+=Kt({x:h,y:92,len:u,w:u*.3,ang:f},d,2.8);let a=o;a+=ge(s,"#2e6a63",.74);const c=[];for(let h=0;h<=560;h+=20)c.push([h,50+Math.sin(h/40)*5]);a+=ge(pe(c)+"L560 90L0 90Z","#1f4a47",.5),a+=tt(150,42,70,R.crystalTeal,.28)+tt(410,50,80,R.crystalTeal,.24),a+=es("fish",330,62,22,.3,.35,"#9fe3d8"),a+=es("fish",118,70,16,-2.6,.3,"#9fe3d8"),a+=ac(r,o);const l=i.map(([h,u])=>[h,u+5]);a+=ge(pe(i)+pe(l.slice().reverse()).replace("M","L")+"Z","#6fc4b1",.75);for(let h=12;h<560;h+=n.range(40,70)){const u=n.range(14,30);a+=k(pe(Ar(l,h/560,Math.min(1,(h+u)/560),5).map(([f,d])=>[f,d+3])),"#b8f0e2",2,.7)}a+=k(pe(i),ut,3.2),a+=k(pe(i.map(([h,u])=>[h,u+2.2])),"#b8f0e2",1.4,.8);for(let h=0;h<16;h++){const u=n.range(10,550),f=t(u)+n.range(-1,3);h%2?a+=ge(xe(u,f,n.range(5,11),n.range(1.5,2.5)),"#9ad8b8",.55):a+=D(vt(u,f-1.5,n.range(2.5,5)),{fill:"#62b9a6",shade:"#3f8f80",light:"#d6fff2"},{stroke:1.6,sx:1,sy:1,hx:1,hy:1,opacity:.9})}for(let h=0;h<12;h++){const u=n.range(10,550);a+=k(vt(u,n.range(22,80),n.range(1.2,3)),"#b8f0e2",1.2,n.range(.35,.7))}return a})}const ea={fill:"#5d5272",shade:"#443b57",light:"#7a6c90"},Gh=[[[[256,902],[232,876],[204,858],[166,848],[128,843],[100,838],[84,826]],34,7],[[[268,800],[290,770],[322,748],[364,738],[412,733],[456,731],[488,726],[502,712]],30,6],[[[258,684],[238,658],[208,640],[166,630],[126,626],[98,622],[82,610]],26,6]],U_=[[[[264,572],[286,546],[322,526],[366,516],[414,512],[458,510],[490,505],[504,492]],22,5],[[[258,462],[236,436],[204,418],[162,408],[124,404],[98,400],[84,388]],20,5],[[[264,350],[288,324],[326,304],[370,294],[420,291],[466,290],[496,285],[508,272]],18,5],[[[258,240],[238,214],[206,196],[166,186],[128,182],[104,178],[92,166]],16,4],[[[264,132],[288,104],[326,84],[372,74],[424,71],[474,70],[506,68],[520,60]],14,5]],N_=[[[[262,562],[300,534],[338,508],[368,480]],12,3],[[[318,522],[328,500],[334,486]],5,2],[[[256,508],[224,480],[196,452],[176,422]],11,3],[[[208,464],[194,470],[178,468]],4,1.5],[[[262,442],[292,416],[312,386]],9,2.5],[[[258,392],[238,364],[226,336]],8,2.5],[[[242,370],[252,352],[256,340]],4,1.5]],F_=[[[[222,900],[190,926],[150,936],[108,941]],32,6],[[[300,900],[332,924],[372,934],[414,941]],32,6],[[[238,916],[220,934],[200,942]],22,8],[[[284,914],[300,932],[318,942]],22,8]],Wi=n=>260+Math.sin(n/110+.8)*9,qa=n=>16+84*Math.pow(Math.max(0,n-30)/910,1.15)+Math.pow(Math.max(0,n-858),1.5)*.1;function Gl(n,e,t,i,s,r="#f0c75e"){return D(f_(n,e,t,5,s.range(0,1.2)),i,{sx:t*.18,sy:t*.2,hx:t*.1,hy:t*.1,stroke:t>9?2.4:2,light:t>12?i.light:""})+ft(n,e,t*.26,r)+k(vt(n,e,t*.26),ut,1.2)}function O_(n,e,t){const i={fill:"#f3dc8a",shade:"#d6b25a",light:"#fff4c8"};return D(de([[n-t,e+.3*t],[n-.8*t,e-.5*t],[n,e-.8*t],[n+.8*t,e-.4*t],[n+t,e+.3*t],[n,e+.6*t]]),i,{stroke:1.8,sx:1,sy:1.2,hx:.8,hy:.8})+D(vt(n+.35*t,e-1.05*t,.62*t),i,{stroke:1.8,sx:.8,sy:.8,hx:.6,hy:.6,over:k(pe([[n+.3*t,e-1.15*t],[n+.48*t,e-1.05*t],[n+.66*t,e-1.15*t]]),ut,1)})+ge(lt([[n+.92*t,e-1.12*t],[n+1.38*t,e-.95*t],[n+.92*t,e-.8*t]]),"#e3913f")+k(pe([[n-.5*t,e-.1*t],[n-.1*t,e+.15*t],[n+.3*t,e-.05*t]]),"#c9a04a",1.1)}function l0(n,e,t,i=!0){const s=[];for(let a=0;a<10;a++)s.push(Qe(n,e+t*.05,a%2?t*.68:t,-Math.PI/2+a*Math.PI/5));const r=t/10.5,o=i?k(pe([[n-4.8*r,e-.3*r],[n-3.4*r,e+.8*r],[n-2*r,e-.3*r]]),"#6b4f2a",1.1)+k(pe([[n+2*r,e-.3*r],[n+3.4*r,e+.8*r],[n+4.8*r,e-.3*r]]),"#6b4f2a",1.1)+ft(n-5.2*r,e+2.8*r,1.4*r,"#f2a7a0",.7)+ft(n+5.2*r,e+2.8*r,1.4*r,"#f2a7a0",.7)+k(pe([[n-r,e+3.7*r],[n,e+4.3*r],[n+r,e+3.7*r]]),"#6b4f2a",.9):"";return D(de(s,.75),{fill:"#fff4cf",shade:"#f1d48f",light:"#ffffff"},{stroke:1.8,ink:"#8a6a3a",sx:1.2,sy:1.4,hx:.8,hy:.8,over:o})}function zh(n){return nt(n?"prop.crystaltree.bloom":"prop.crystaltree",520,940,"bc",e=>{const t=n?28:246,i=[],s=[];for(let E=0;E<=26;E++){const v=Gn(934,t,E/26);i.push([Wi(v),v]),s.push(qa(v)*(n?1:Math.min(1,Math.max(.32,(v-t)/90))))}const r=pa(i,s),o=n?[...Gh,...U_]:[...Gh,...N_],a=[...F_,...o];let c="";for(const[E,v]of[[-.34,0],[-.12,2],[.14,4],[.33,1]]){const S=i.map(([T,L],x)=>[T+s[x]*E+Math.sin(L/38+v)*4,L]);c+=k(pe(S),ea.shade,1.7,.8)}for(let E=0;E<26;E++){const v=e.range(t+40,900),S=Wi(v)+qa(v)*e.range(-.35,.3);c+=k(pe([[S-5,v],[S,v-1.8],[S+5,v]]),ea.shade,1.4,.8)}for(const[E]of a)c+=k(pe(Ar(ui(E,3),.1,.9,6)),ea.shade,1.3,.7);const l=(E,v)=>k(pe(E),R.crystalTeal,v*3,.18)+k(pe(E),R.crystalTealLight,v,.85);let h=l(i.slice(0,n?25:22).map(([E,v],S)=>[E-s[S]*.08+Math.sin(v/31)*3.5,v]),1.8);h+=l(i.slice(1,12).map(([E,v],S)=>[E+s[S+1]*.26+Math.sin(v/23)*3,v]),1.2);for(const[E]of o)E.length>4&&(h+=l(Ar(ui(E,-1),.02,.86,8),1.2));const u=pa(i.map(([E,v],S)=>[E+s[S]*.32,v]),s.map(E=>E*.38));let f=on(260,938,160,6,.3);f+=Ts([...a.map(([E,v,S])=>ce(E,v,S)),r],ea,{sx:5,sy:4,hx:3,hy:2,inner:c},4.2),f+=ac(r,ge(u,ea.shade,.85)+c),f+=h;for(const[E,v,S,T]of[[790,1,30,yt.blue],[742,-1,26,yt.teal],[652,1,24,yt.teal],[560,-1,20,yt.blue]]){if(!n&&E<t+60)continue;const L=Wi(E)+v*qa(E)*.42;f+=Kt({x:L-v*3,y:E+4,len:S*.6,w:S*.34,ang:v*.35},T,2.4),f+=Kt({x:L,y:E,len:S,w:S*.4,ang:v*.95},T,2.6)}const d=Wi(872)+2;f+=D(xe(d,874,13,19),{fill:"#221c2e",shade:"#161220",light:"#2f2740"},{sx:-4,sy:-4,hx:0,hy:0,stroke:3.2}),n?(f+=tt(d,874,64,"#ffe9a8",.6),f+=l0(d,874,11,!1)):f+=tt(d,878,10,R.crystalTeal,.35);const m={x:330,y:936,len:58,w:24,ang:.42};if(f+=Kt({x:312,y:936,len:34,w:15,ang:.05},yt.blue,3),f+=Kt(m,yt.teal,3,es("bird",...ma(m,.45),20,-.3,.6)),f+=Kt({x:350,y:938,len:26,w:12,ang:.95},yt.teal,2.6),f+=Kt({x:186,y:938,len:32,w:14,ang:-.55},yt.blue,2.8),f+=Kt({x:202,y:938,len:20,w:10,ang:-.15},yt.teal,2.4),!n){for(const[v,,S]of o){const T=v[v.length-1],L=v[v.length-2],x=Math.atan2(T[0]-L[0],-(T[1]-L[1]));f+=Kt({x:T[0],y:T[1],len:16+S*2,w:9+S,ang:x,shoulder:.55},e.chance(.5)?yt.teal:yt.blue,2.4)}for(const[v,S,T]of[[150,858,22],[192,864,16],[344,752,20],[428,744,24],[142,640,22],[186,646,15]])f+=Kt({x:v,y:S,len:T,w:T*.5,ang:Math.PI+e.range(-.15,.15),shoulder:.55},e.chance(.6)?yt.teal:yt.blue,2.4);const E=Wi(t);return f+=Kt({x:E-6,y:t+26,len:18,w:10,ang:-.6,shoulder:.55},yt.teal,2.2),f+=Kt({x:E+6,y:t+28,len:16,w:9,ang:.7,shoulder:.55},yt.teal,2.2),f+=Kt({x:E,y:t+18,len:30,w:14,ang:.05,shoulder:.55},yt.blue,2.6),f}const _=[{fill:"#f4ecdf",shade:"#d8c8b2",light:"#ffffff"},{fill:"#ebb5c6",shade:"#c98c9f",light:"#f9dbe4"},{fill:"#c9a8ee",shade:"#a07fcb",light:"#e6d4fb"}],p={fill:"#7fb39a",shade:"#5f8f7d",light:"#a6d4bb"},g=[],b=(E,v,S,T,L,x)=>{for(let w=0;w<S;w++)g.push([E+e.range(-x,x),v+e.range(-x,x)*.7,e.range(T,L)])};for(const[E]of o){const v=E[E.length-1];b(v[0],v[1]+6,4,11,15,13);for(let S=2;S<E.length-1;S++){const T=E[S];g.push([T[0]+e.range(-8,0),T[1]+21+e.range(0,6),e.range(9,14)]),e.chance(.6)&&g.push([T[0]+e.range(4,14),T[1]+30+e.range(0,8),e.range(7,11)])}b(E[1][0],E[1][1]+16,3,9,13,10)}for(let E=80;E<860;E+=e.range(40,60)){const v=e.chance(.5)?-1:1;g.push([Wi(E)+v*qa(E)*e.range(.25,.45),E,e.range(9,12)])}b(Wi(40),46,13,12,18,30);for(const[E,v,S]of g){if(!e.chance(.5))continue;const T=e.range(0,Math.PI*2),L=Qe(E,v,S*1.9,T);f+=D(de([[E,v],Qe(E,v,S*.95,T-.5),L,Qe(E,v,S*.95,T+.5)]),p,{stroke:1.8,sx:1,sy:1,hx:.8,hy:.8})}f+=tt(Wi(50),50,96,"#f9d9e6",.35),g.forEach(([E,v,S],T)=>{f+=Gl(E,v,S,_[T%3],e)});for(const[E,v]of[[84,822],[500,708],[82,606],[86,384],[92,162],[Wi(40)+2,24]])f+=Gl(E,v,17,_[0],e)+O_(E,v-3,7);for(let E=0;E<20;E++){const v=e.range(30,500),S=e.range(60,900);f+=Br(`transform="rotate(${Ne(e.range(0,180))} ${Ne(v)} ${Ne(S)})"`,D(xe(v,S,3.8,2.2),_[E%3],{stroke:1.4,sx:.6,sy:.6,hx:0,hy:0}))}return f})}function B_(){return nt("prop.star",40,40,"c",()=>tt(20,20,20,"#ffe9a8",.8)+tt(20,20,11,"#ffffff",.6)+l0(20,20,10.5))}const si={fill:R.leaf,shade:R.leafDark,light:R.leafLight},ga={fill:"#5f5a70",shade:"#46415a",light:"#7a7590"};function Es(n,e,t,i,s,r){return Br(`transform="translate(${n} ${e}) scale(1 ${Ne(i/t)}) translate(${-n} ${-e})"`,tt(n,e,t,s,r))}function $r(n,e=1.8){return n.map(([t,i])=>tt(t,i,e*4,R.violet,.45)+ft(t,i,e,R.vein)).join("")}function _i(n,e,t,i,s=si,r=4,o=1.8){let a="";for(let c=0;c<r;c++){const l=(c-(r-1)/2)*3,h=i.range(-.5,.5)+l*.08,u=t*i.range(.6,1);a+=D(ce([[n+l,e+1],[n+l+h*u*.4,e-u*.5],[n+l+h*u,e-u]],3.2,.6),s,{stroke:o,sx:.8,sy:0,hx:.5,hy:0})}return a}function Hh(n,e,t,i){return D(mt(n-.18*t,e-.9*t,.36*t,.9*t,.15*t),Gs,{stroke:1.6,sx:.8,sy:0,hx:.5,hy:0})+D(`M${n-.7*t} ${e-.8*t}Q${n-.6*t} ${e-1.5*t} ${n} ${e-1.55*t}Q${n+.6*t} ${e-1.5*t} ${n+.7*t} ${e-.8*t}Z`,i,{stroke:1.6,sx:.8,sy:.8,hx:.6,hy:.6,over:ft(n-.25*t,e-1.2*t,.1*t+.4,R.vein)+ft(n+.22*t,e-1.05*t,.08*t+.4,R.vein)})}function $_(){return nt("prop.log",160,60,"bc",n=>{const e={fill:"#4f4353",shade:"#3a3040",light:"#67586b"},t={fill:"#8a7563",shade:"#6b5849",light:"#a38c78"};let i=on(80,58,76,3,.4);const s=wt([[16,26,1],[144,26,1],[144,58,1],[24,58,1],[17,54],[9,51,1],[15,46,1],[5,40,1],[14,35,1],[8,30,1]]);let r="";for(const a of[33,40,47,53]){const c=[];for(let l=20;l<=140;l+=20)c.push([l+n.range(-3,3),a+n.range(-1.5,1.5)]);r+=k(pe(Ar(c,n.range(0,.2),n.range(.7,1),6)),e.shade,1.5,.9)}r+=k(xe(70,44,5,3.5),e.shade,1.6)+ge(xe(70,44,2.2,1.5),"#231d29"),i+=D(s,e,{sx:0,sy:6,hx:0,hy:2.5,inner:r}),i+=D(ce([[104,46],[111,52],[117,55]],9,5),e,{stroke:2.6,sx:1.5,sy:1.5}),i+=D(xe(118,55.5,3,2.4),t,{stroke:1.8,sx:0,sy:0,hx:0,hy:0}),i+=D(xe(144,42,8.5,16),t,{sx:2,sy:2,hx:1,hy:1,stroke:3,over:k(xe(144,42,5.5,10.5),t.shade,1.3)+k(xe(144,42,2.5,5),t.shade,1.2)+k("M144 42L150 30",ut,1.2)});const o=wt([[22,26,1],[130,26,1],[132,30],[124,35],[116,31],[106,38],[96,32],[86,35],[74,31],[64,40],[54,32],[44,36],[34,31],[26,33]]);return i+=D(o,si,{sx:0,sy:2.5,hx:0,hy:1.5,stroke:2.4,over:ft(60,29,1.2,R.leafLight)+ft(98,29,1.2,R.leafLight)}),i+=_i(40,27,7,n)+_i(112,27,6,n,si,3),i+=Hh(30,58,8,{fill:"#b6a3c9",shade:"#8d7aa3",light:"#d5c7e3"})+Hh(40,58,5.5,{fill:"#b6a3c9",shade:"#8d7aa3",light:"#d5c7e3"}),i+=$r([[82,30],[50,30.5],[121,29.5]],1.3),i})}function Ya(n,e,t,i,s=0){const r=(o,a)=>[n+(o*Math.cos(s)-a*Math.sin(s))*t,e+(o*Math.sin(s)+a*Math.cos(s))*t*i];return pe([r(-.62,-.62),r(-.8,0),r(-.52,.62),r(0,.95)])+pe([r(.62,-.62),r(.8,0),r(.52,.62),r(0,.95)])+pe([r(-.5,-.2),r(-.32,-.13),r(-.14,-.18)])+pe([r(.14,-.18),r(.32,-.13),r(.5,-.2)])+pe([r(.02,-.08),r(-.05,.25),r(.08,.3)])+pe([r(-.2,.55),r(0,.52),r(.2,.55)])}function G_(){return nt("prop.mempool",200,60,"bc",n=>{const e={fill:"#a49bd2",shade:"#7b71ab",light:"#ddd6f6"};let t=Es(100,40,90,40,"#b9a3e8",.4);for(const[s,r]of[[12,34],[20,44],[28,30],[176,38],[186,46],[194,28]])t+=D(ce([[s,56],[s+n.range(-2,2),56-r*.6],[s+n.range(-5,5),56-r]],4,1),si,{stroke:1.8,sx:1,sy:0});t+=$r([[20,14],[186,12],[30,26]],1.6);for(const[s,r,o]of[[28,36,7],[48,31,6],[74,29,5.5],[102,28,6],[130,29,5.5],[154,31,6],[173,36,7]])t+=ts(s,r,o,n,ga,2.2);const i=k(Ya(82,42,15,.42,-.25),"#f3eeff",1.3,.42)+k(Ya(104,43,19,.4,.1),"#f3eeff",1.4,.35)+k(Ya(124,41,13,.45,.35),"#f3eeff",1.2,.4)+k(Ya(66,44,9,.45,.5),"#f3eeff",1.1,.3);t+=D(xe(100,42,80,13),e,{sx:0,sy:-5,hx:0,hy:0,stroke:3,inner:tt(100,44,40,"#ffffff",.35),over:i+k("M40 46H66M136 38H164M58 51H80",e.light,1.5,.8)});for(const[s,r,o]of[[22,52,8],[44,56,7],[70,57,6.5],[98,58,7.5],[126,57,6.5],[152,56,7],[178,52,8]])t+=ts(s,r,o,n,ga,2.4);return t+=_i(58,56,8,n)+_i(140,56,9,n)+_i(112,59,6,n,si,3),t})}function c0(n,e,t,i,s=11){const r=[];for(let o=0;o<s;o++){const a=o/s*Math.PI*2+i.range(-.1,.1);r.push(Qe(n,e,t*i.range(.95,1.05),a));const c=Qe(0,0,t*.88,a+Math.PI/s);r.push([n+c[0],e+c[1]])}return de(r,1)}function z_(n,e,t,i,s,r=11){let o="";for(let a=0;a<Math.round(t/12);a++){const c=Qe(n,e,t*s.range(.1,.7),s.range(0,Math.PI*2)),l=s.range(4,7);o+=k(`M${Ne(c[0]-l)} ${Ne(c[1]-2)}Q${Ne(c[0])} ${Ne(c[1]+3)} ${Ne(c[0]+l)} ${Ne(c[1]-2)}`,i.shade,1.6,.9)}return D(c0(n,e,t,s,r),i,{sx:t*.14,sy:t*.2,hx:3,hy:4,stroke:3.2,inner:o})}function H_(){return nt("prop.tree",360,520,"bc",n=>{const e={fill:"#b39aa8",shade:"#937c8b",light:"#cdb9c3"},t={fill:"#97b894",shade:"#7fa27f",light:"#b6cfae"},i={fill:"#b4d19b",shade:"#8fb582",light:"#cfe3b8"};let s=on(180,518,90,4,.35);const r=[[98,150,66],[262,140,68],[180,84,74],[56,222,46],[308,214,46],[180,206,64],[120,250,40],[246,250,40]].map(([h,u,f])=>c0(h,u,f,n));s+=Ts(r,t,{sx:12,sy:16,hx:3,hy:4},3.2);const o=[[180,524],[177,470],[182,410],[178,340],[182,280],[180,236]],a=[ce([[176,290],[150,244],[118,204],[90,172]],22,8),ce([[184,282],[214,236],[248,196],[272,160]],22,8),ce([[180,250],[184,190],[178,130],[182,96]],20,8),ce([[172,330],[140,318],[106,322],[80,306]],12,4),ce([[188,350],[222,342],[258,348],[284,334]],12,4)],c=[ce([[160,500],[136,514],[108,522]],24,6),ce([[200,500],[226,514],[254,522]],24,6),ce([[176,508],[172,522]],20,12)],l=k(pe([[172,510],[168,440],[174,370],[170,300]]),e.shade,1.8)+k(pe([[190,500],[192,430],[188,360]]),e.shade,1.6)+k(xe(184,420,5,8),e.shade,1.6)+ge(xe(184,420,2.5,4.5),ut);s+=Ts([...c,...a,pa(o,[72,52,44,40,34,28])],e,{sx:7,sy:2,hx:3,hy:1,inner:l},3.6);for(const[h,u,f]of[[128,214,52],[240,208,54],[116,118,50],[248,108,50],[184,50,44],[64,180,36],[300,176,36]])s+=z_(h,u,f,i,n);return s+=$r([[96,120],[150,186],[238,88],[270,214],[60,186],[206,40],[118,244],[300,150]],1.9),s})}function ta(n,e,t,i,s,r=9){const o=[[n-t,e+6,1]];for(let a=0;a<=r;a++){const c=Math.PI+a/r*Math.PI;if(o.push([n+Math.cos(c)*t*s.range(.95,1.08),e+Math.sin(c)*i*s.range(.92,1.1),1]),a<r){const l=c+Math.PI/r/2;o.push([n+Math.cos(l)*t*.8,e+Math.sin(l)*i*.78])}}return o.push([n+t,e+6,1]),wt(o)}function V_(){return nt("prop.bush",200,90,"bc",n=>{const e={fill:"#a9c89c",shade:"#8db083",light:"#c6ddb7"},t={fill:"#8fb48c",shade:"#78a079",light:"#afcca6"};let i="";for(const[s,r,o,a]of[[62,58,52,24],[134,58,148,22],[104,50,100,16]]){const c=[Gn(s,o,.5)+3,Gn(r,a,.5)];i+=k(pe([[s,r],c,[o,a]]),ut,2.6)+k(pe([[s,r],c,[o,a]]),t.fill,1.2);for(const l of[.55,.8,1]){const h=[Gn(s,o,l),Gn(r,a,l)],u=l===.8?-1:1;i+=D(de([h,[h[0]+u*6,h[1]-5],[h[0]+u*11,h[1]-3],[h[0]+u*6,h[1]+1]]),e,{stroke:2,sx:.8,sy:1,hx:0,hy:1.5})}}return i+=D(ta(150,90,42,42,n),t,{sx:4,sy:6,hx:0,hy:3,stroke:3.2}),i+=D(ta(46,90,40,38,n),t,{sx:4,sy:6,hx:0,hy:3,stroke:3.2}),i+=D(ta(100,90,52,52,n,11),e,{sx:5,sy:7,hx:1,hy:3,stroke:3.4}),i+=D(ta(178,90,20,24,n,6),e,{sx:3,sy:4,hx:0,hy:2.5,stroke:3}),i+=D(ta(18,90,18,20,n,6),e,{sx:3,sy:4,hx:0,hy:2.5,stroke:3}),i+=$r([[88,52],[150,62]],1.4),i})}function Vh(n){return nt(n?"prop.plate.down":"prop.plate",120,24,"bc",()=>{const e={fill:"#4f4a5d",shade:"#3a3548",light:"#686279"},t={fill:"#7c768c",shade:"#625c73",light:"#9791aa"},i={fill:"#5f596f",shade:"#48435a",light:"#6f6982"},s=n?15:9;let r=D(xe(60,17,57,6.5),e,{stroke:2.6,sx:0,sy:2,hx:0,hy:1});r+=ge(xe(60,16,49,4.6),"#1f1c2a"),r+=D(`M14 ${s}A46 6 0 0 0 106 ${s}V${s+7}A46 6 0 0 1 14 ${s+7}Z`,i,{stroke:2.6,sx:3,sy:0,hx:0,hy:0});const o=xe(60,s,28,3.4),a=[0,1,2,3,4,5].map(h=>{const u=h/6*Math.PI*2+.3,f=Qe(0,0,14,u),d=Qe(0,0,23,u);return`M${Ne(60+f[0])} ${Ne(s+f[1]*.13)}L${Ne(60+d[0])} ${Ne(s+d[1]*.13)}`}).join(""),c=xe(60,s,7,1.6),l=n?k(o+a+c,R.violet,4,.55)+k(o+a+c,R.vein,1.8)+ft(60,s,1.4,"#ffffff"):k(o+a+c,R.violetDark,2.2,.9)+k(o,R.violet,1,.7);return r+=D(xe(60,s,46,6),t,{stroke:2.6,sx:0,sy:-2,hx:0,hy:0,over:l}),r+=D("M3 17A57 6.5 0 0 0 117 17L109 16A49 4.6 0 0 1 11 16Z",e,{stroke:2.6,sx:0,sy:2,hx:0,hy:1.5}),n&&(r+=Es(60,s,52,14,R.violet,.55)+Es(60,s,26,6,R.vein,.5)),r})}function W_(){return nt("prop.shrine",70,110,"bc",n=>{const e={fill:"#6c667c",shade:"#514b62",light:"#88829a"};let t=on(35,108,32,3,.35);t+=D(mt(5,95,60,15,4),e,{sx:0,sy:4,hx:0,hy:2,over:k("M14 101l4 4M50 99l-3 5",e.shade,1.3)}),t+=D("M15 96L18 36H52L55 96Z",e,{sx:5,sy:0,hx:2,hy:0,over:k("M22 44l2 10l-2 8M47 70l-2 9",ut,1.4,.8)});const i=35,s=64;let r="";const o=[];for(let c=0;c<=18;c++)o.push(Qe(i,s,1.5+c*.42,c*.62));r=pe(o);let a="";for(let c=0;c<6;c++){const l=c/6*Math.PI*2-Math.PI/2,h=Qe(i,s,13.5,l);a+=`M${Ne(h[0])} ${Ne(h[1]-2)}l${Ne(Math.cos(l+1.6)*2)} ${Ne(Math.sin(l+1.6)*2+3)}`}return t+=tt(i,s,22,R.violet,.4),t+=k(vt(i,s,11)+r+a,R.violetDark,3.4,.8)+k(vt(i,s,11)+r+a,R.vein,1.5),t+=D(mt(8,24,54,14,4),e,{sx:0,sy:4,hx:0,hy:2}),t+=D(xe(35,25,16,4),{fill:"#3a3548",shade:"#2a2638",light:"#4a4458"},{stroke:2.4,sx:0,sy:-2,hx:0,hy:0,inner:Es(35,25,16,4,R.violet,.5)}),t+=D(wt([[10,30,1],[18,26],[30,28],[26,32],[14,33,1]]),si,{stroke:2,sx:.8,sy:1.2,hx:0,hy:.8}),t+=D(wt([[40,97,1],[50,94],[62,96],[58,100],[44,100,1]]),si,{stroke:2,sx:.8,sy:1.2,hx:0,hy:.8}),t+=_i(8,108,7,n,si,3,1.6)+_i(63,108,8,n,si,3,1.6),t})}function X_(){return nt("prop.stone",64,64,"bc",n=>{const e={fill:"#7b7389",shade:"#5a5368",light:"#978fa6"};let t=on(32,62,29,3,.4);const i=pe([[20,31],[24.5,32.5],[29,31]])+pe([[36,31],[40.5,32.5],[45,31]])+pe([[32.5,33],[31,40],[34,41]])+pe([[27,47],[32.5,46.5],[38,47]])+pe([[14,44],[13,30],[20,20],[32,17],[44,20],[51,30],[50,44],[42,53]]);return t+=D(de([[6,60],[3,46],[7,28],[18,13],[33,8],[48,12],[58,25],[61,43],[58,60],[32,62]]),e,{sx:5,sy:5,hx:3,hy:3,over:k("M50 34l3 6l-2 6M12 48l4 3",e.shade,1.5)+tt(32,36,22,R.violet,.3)+k(i,R.violet,3,.35)+k(i,R.vein,1.2,.6)+ge(wt([[16,16,1],[26,10],[40,9],[50,13],[44,16],[34,14],[22,18,1]]),si.fill)+ft(27,11.5,1.1,si.light)+ft(40,11,1,si.light)}),t+=_i(8,62,7,n,si,3,1.6)+_i(56,62,6,n,si,3,1.6),t})}function Wh(n){return nt(n?"prop.knot.calm":"prop.knot",110,90,"bc",e=>{let t=on(55,88,50,3,.4);const i=n?.9:1;for(const c of[[[36,70],[20,80],[2,88]],[[74,70],[92,80],[110,88]],[[50,78],[44,86],[38,90]],[[64,78],[70,86],[78,90]]])t+=D(ce(c,16,6),Dt,{stroke:3,sx:2,sy:2,hx:1,hy:1});n||(t+=Es(55,88,40,5,R.violet,.5)+D(xe(40,87,14,2.6),Xi,{stroke:1.8,sx:0,sy:1,hx:0,hy:.6}));const s=[];for(let c=0;c<12;c++){const l=c/12*Math.PI*2,h=c%3===0?1.08:.96;s.push([55+Math.cos(l)*36*h*i,50+Math.sin(l)*32*h*i*(Math.sin(l)>0?.9:1)])}const r=[[[36,34],[44,42],[42,52],[50,60]],[[66,26],[62,36],[70,44]],[[74,54],[80,62],[76,70]]],o=[[[28,44],[38,38],[50,36],[58,30],[64,22]],[[34,62],[46,66],[60,64],[72,70]],[[70,40],[80,46],[86,56]],[[50,36],[48,26],[52,20]]];let a=k(xe(38,60,3.5,5),R.barkDark,1.4)+k(pe([[76,30],[84,36],[86,44]]),R.barkDark,1.4);if(n){for(const c of r)a+=k(pe(c),R.barkDark,1.6);for(const c of o)a+=k(pe(c),"#6f5a80",2.4,.5)}else{a+=tt(55,48,36,R.violet,.45);for(const c of r){const l=ce(c,3,6);a+=ge(l,R.violet)+k(l,ut,1.4)+k(pe(c),R.vein,1.3)}for(const c of o)a+=k(pe(c),ut,5)+k(pe(c),R.violet,3.2)+k(pe(c),R.vein,1.1,.9)}if(t+=D(de(s),Dt,{sx:6,sy:6,hx:3,hy:3,stroke:3.6,over:a}),n){const c={fill:"#6f9f86",shade:"#4f7f69",light:"#94c4a8"},l={fill:"#efe6f8",shade:"#c9b6dc",light:"#ffffff"};for(const[h,u,f]of[[40,22,-2.2],[70,20,-.9],[86,40,-.3],[26,42,3.3]]){const d=Qe(h,u,14,f);t+=D(de([[h,u],Qe(h,u,7,f-.5),d,Qe(h,u,7,f+.5)]),c,{stroke:1.8,sx:1,sy:1,hx:.6,hy:.6})}for(const[h,u,f]of[[46,18,6],[60,16,7],[78,26,5.5],[30,34,5],[88,50,4.5]])t+=Gl(h,u,f,l,e,R.sun)}else{for(const[c,l,h]of[[50,61,14],[76,70,9],[44,52,8]])t+=D(de([[c-2.2,l],[c+2.2,l],[c+1.8,l+h*.7],[c+3,l+h],[c,l+h+4],[c-3,l+h],[c-1.8,l+h*.7]]),Xi,{stroke:1.8,sx:1,sy:1,hx:.8,hy:.8});t+=$r([[62,22],[30,50]],1.5)}return t})}function q_(){return nt("prop.river",400,60,"bc",n=>{const t={fill:"#7d8286",shade:"#62676c",light:"#9aa0a3"},i=a=>10+1.6*Math.sin(a/26+1)+Math.sin(a/9.5),s=[];for(let a=0;a<=400;a+=8)s.push([a,i(a)]);let r="";for(let a=0;a<24;a++)r+=ts(n.range(6,394),n.range(50,60),n.range(4,9),n,t,2);r+=ge(pe(s)+"L400 60L0 60Z","#6f8ba1",.55);const o=[];for(let a=0;a<=400;a+=20)o.push([a,30+Math.sin(a/50)*4]);r+=ge(pe(o)+"L400 52L0 52Z","#4e6a82",.3);for(let a=0;a<14;a++){const c=n.range(0,360),l=n.range(18,50),h=n.range(18,50);r+=k(pe([[c,l],[c+h*.5,l+n.range(-1.5,1.5)],[c+h,l]]),"#dbe6ec",n.range(1.2,2.2),n.range(.35,.7))}for(let a=0;a<5;a++){const c=n.range(30,370);r+=k(xe(c,i(c)+5,n.range(8,14),2),"#e7eff2",1.2,.5)}r+=k(pe(s),ut,2.6,.85),r+=k(pe(s.map(([a,c])=>[a,c+2.2])),"#e6eef2",1.6,.85);for(const a of[4,396])for(let c=0;c<3;c++)r+=k(`M${a-5} ${14+c*5}q5 -3 10 0`,"#f0f5f7",1.6,.8);return r})}function Y_(){return nt("prop.reflectpool",160,40,"bc",n=>{const e={fill:"#85878a",shade:"#66696e",light:"#a3a6a8"},t={fill:"#c3cdd1",shade:"#9aa7ad",light:"#eef3f3"};let i="";for(const[o,a,c]of[[18,22,6],[36,17,5.5],[58,14.5,5],[82,14,5.5],[106,14.5,5],[126,17,5.5],[144,22,6]])i+=ts(o,a,c,n,e,2);const s=[[14,22],[30,18.5],[40,20],[52,17.5],[66,19],[80,17],[96,19],[110,17.5],[124,19.5],[140,20],[146,24]];i+=D(xe(80,25,66,9),t,{sx:0,sy:-3.5,hx:0,hy:0,stroke:2.8,inner:ge(xe(80,27,50,3.5),"#e9eeee")+ge(pe(s)+"L146 16L14 16Z","#6f7d80",.55)+tt(104,26,10,"#fffbea",.8),over:k("M30 29H52M96 31H122M62 33H80","#f7fafa",1.4,.8)});for(const[o,a,c]of[[14,32,7],[34,35,6.5],[58,37,6],[84,37.5,7],[110,37,6],[132,35,6.5],[150,31,6.5]])i+=ts(o,a,c,n,e,2.2);const r={fill:"#58705f",shade:"#3f5346",light:"#76907c"};return i+=_i(46,38,8,n,r)+_i(122,38,9,n,r)+_i(4,36,7,n,r,3),i})}const ms={fill:"#3e312d",shade:"#2b2120",light:"#584740"};function Z_(){return nt("prop.dormbed",190,80,"bc",()=>{const n={fill:"#5d4b3f",shade:"#43362d",light:"#7a6452"},e={fill:"#d6c7a8",shade:"#b3a283",light:"#eadfc6"},t={fill:"#9c8c74",shade:"#7d6f5b",light:"#b5a68c"},i=(o,a,c)=>D(ce(o,a,c),ms,{stroke:2.6,sx:1.5,sy:1.5,hx:1,hy:1,over:k(pe(ui(o,a*.15)),ms.shade,1,.8)});let s=on(95,78,92,3,.4);s+=ge(Zt(8,34,174,44),ut,.3),s+=i([[10,40],[40,56],[72,70],[100,80]],7,5),s+=i([[180,40],[150,58],[118,70],[92,80]],7,5),s+=i([[60,38],[70,54],[66,66],[74,80]],5,4),s+=i([[132,38],[122,52],[128,66],[120,80]],5,4),s+=i([[20,38],[48,48],[90,50],[132,46],[172,38]],6,5);for(const o of[1,181])s+=D(mt(o,3,8,77,2.5),n,{sx:2.5,sy:0,hx:1.5,hy:0,stroke:3}),s+=D(xe(o+4,3,5.5,3.5),n,{stroke:2.4,sx:1,sy:1,hx:.8,hy:.8});s+=D(mt(4,28,182,8,2),n,{sx:0,sy:2.5,hx:0,hy:1.5,stroke:3});let r="";for(let o=16;o<180;o+=8)r+=k(`M${o} 10V30`,"#c4b594",1.2);s+=D(mt(10,10,170,19,5),e,{sx:0,sy:4,hx:0,hy:2,inner:r,over:k(pe([[70,16],[78,20],[92,18]]),e.shade,1.3)}),s+=D(wt([[14,11,1],[18,5],[30,3.5],[44,5],[48,11,1]]),e,{stroke:2.4,sx:1.5,sy:2,hx:1,hy:1}),s+=D(wt([[132,10,1],[178,10,1],[181,18],[178,27,1],[134,27,1],[131,18]]),t,{stroke:2.6,sx:2,sy:2.5,hx:0,hy:1.5,over:k("M134 18.5H179",t.shade,1.4)});for(const o of[1,181])for(const a of[44,58,70])s+=i([[o-2,a+4],[o+4,a],[o+10,a-4]],4,3);return s+=i([[4,32],[30,36],[52,30],[80,36],[108,30],[136,36],[160,30],[186,34]],5,4),s+=i([[1,78],[-6,80]],8,4)+i([[189,78],[196,80]],8,4),s})}function K_(){return nt("prop.station",110,150,"bc",()=>{const n={fill:"#c9b17a",shade:"#9a8458",light:"#e8d6a4"},e=(o,a,c,l=ms)=>D(ce(o,a,c),l,{stroke:2.8,sx:2,sy:1,hx:1,hy:.5,over:k(pe(ui(o,a*.15)),l.shade,1.1,.8)});let t=on(55,148,46,3,.4);t+=e([[50,136],[30,144],[8,150]],12,5)+e([[60,136],[82,144],[104,150]],12,5)+e([[54,140],[50,150]],10,7);const i=(o,a)=>Array.from({length:9},(c,l)=>[55+Math.sin(l*1.05+o)*5*a,146-l*8.6]);t+=e(i(Math.PI,1),9,7)+e(i(Math.PI/3,.9),9,7)+e(i(0,1),10,8),t+=e([[55,80],[40,76],[26,72],[18,64]],9,4)+e([[55,80],[70,76],[84,72],[92,64]],9,4),t+=e([[55,82],[46,74],[36,72]],6,3)+e([[55,82],[64,74],[74,72]],6,3),t+=tt(55,38,52,"#f6ecd0",.5);const s=mt(20,6,70,62,5)+aa(30,16,50,42);t+=D(Zt(30,16,50,42),{fill:"#f4ebd6",shade:"#e2d3b4",light:"#ffffff"},{stroke:0,sx:-3,sy:-3,inner:tt(55,37,30,"#ffffff",.9)+tt(55,37,40,R.vein,.35)});let r="";for(let o=0;o<=8;o++)r+=ft(28+o*6.75,12,1.1,n.light)+ft(28+o*6.75,62,1.1,n.shade);t+=D(s,n,{sx:3,sy:3,hx:2,hy:2,stroke:3.2,over:r});for(const[o,a]of[[20,6],[90,6],[20,68],[90,68]])t+=D(vt(o,a,4),n,{stroke:2,sx:1,sy:1,hx:.8,hy:.8});return t+=e([[22,74],[18,66],[22,58]],5,2.5)+e([[88,74],[92,66],[88,58]],5,2.5),t+=$r([[74,22],[34,52]],1.3),t})}function Za(n,e,t,i){const s=l=>(l==="I"?.2:.6)*i,r=.12*i,o=[...n].reduce((l,h)=>l+s(h),0)+r*(n.length-1);let a=e-o/2,c="";for(const l of n)c+=$l(l,a,t-i/2,s(l),i),a+=s(l)+r;return c+`M${Ne(e-o/2-1)} ${Ne(t-i/2)}H${Ne(e+o/2+1)}M${Ne(e-o/2-1)} ${Ne(t+i/2)}H${Ne(e+o/2+1)}`}function Xh(n,e,t,i,s){const r=Math.cos(s),o=Math.sin(s),a=([c,l])=>[n+c*r-l*o,e+c*o+l*r];return lt([[-.16*t,0],[.05*t,-i/2],[.62*t,-i*.28],[.74*t,-i*.62],[t,0],[.74*t,i*.62],[.62*t,i*.28],[.05*t,i/2]].map(a))}function Q_(){return nt("prop.clock",180,220,"c",()=>{const n={fill:"#6b5238",shade:"#4f3c29",light:"#8c6f4e"},e={fill:"#b69a62",shade:"#8f7648",light:"#d6bd86"},t={fill:"#ebe1ca",shade:"#cdbf9f",light:"#f8f2e4"},i=90,s=134,r=u=>Array.from({length:8},(f,d)=>[i+Math.sin(d*1.3+u)*3,-2+d*7]);let o=D(ce(r(Math.PI),5.5,4.5),{...ms,fill:ms.shade},{stroke:2.4,sx:1,sy:0});o+=D(ce(r(0),6,5),ms,{stroke:2.4,sx:1.2,sy:0}),o+=k(vt(i,50,6),ut,5)+k(vt(i,50,6),e.fill,2.6),o+=on(i+5,s+6,80,80,.25),o+=D(vt(i,s,79),n,{sx:5,sy:5,hx:3,hy:3,stroke:4}),o+=D(vt(i,s,71),e,{sx:-3,sy:-3,hx:0,hy:0,stroke:2.6});let a="";for(let u=0;u<60;u++){const f=u/60*Math.PI*2,d=u%5===0,m=Qe(i,s,d?55:59,f),_=Qe(i,s,63,f);a+=k(`M${Ne(m[0])} ${Ne(m[1])}L${Ne(_[0])} ${Ne(_[1])}`,R.inkSoft,d?2.6:1.1)}let c="";for(let u=1;u<=12;u++){if(u%3===0)continue;const f=Qe(i,s,48,u/12*Math.PI*2-Math.PI/2);c+=ft(f[0],f[1],2.2,R.inkSoft)}const l=Za("XII",i,s-46,11)+Za("III",i+45,s,11)+Za("VI",i,s+46,11)+Za("IX",i-45,s,11);o+=D(vt(i,s,65),t,{sx:5,sy:5,hx:0,hy:0,stroke:2.6,over:a+c+k(l,R.inkSoft,1.8)+k(vt(i,s,40),"#d8cbad",1.2)});const h={fill:"#2e2622",shade:"#1c1716",light:"#4a3f38"};return o+=D(Xh(i,s,56,6,-Math.PI/2),h,{stroke:1.6,sx:1,sy:1,hx:.6,hy:.6}),o+=D(Xh(i,s,36,11,-Math.PI/2+Math.PI/6),h,{stroke:1.6,sx:1,sy:1,hx:.6,hy:.6}),o+=D(vt(i,s,5),e,{stroke:2,sx:1,sy:1,hx:.8,hy:.8}),o+=k(`M${i-50} ${s-22}Q${i-44} ${s-46} ${i-22} ${s-52}`,"#ffffff",4,.35),o+=k(lt([[i+30,s-57],[i+24,s-40],[i+30,s-30],[i+20,s-16]],!1),"#ffffff",1.2,.7),o+=D(ce([Qe(i,s,76,-1.62),Qe(i,s,79,-1.95),Qe(i,s,78,-2.3),Qe(i,s,74,-2.6)],7,3),ms,{stroke:2.4,sx:1,sy:1}),o+=D(ce([Qe(i,s,78,-2.1),Qe(i,s,90,-2.2),Qe(i,s,94,-2.4)],3.5,1.2),ms,{stroke:1.8,sx:.8,sy:.8}),o})}const Ki={fill:"#5d6475",shade:R.metalDark,light:"#7d8598"},qh={fill:"#cfc6b2",shade:"#a39a86",light:"#e6dfcf"};function bo(n,e=1.8){return n.map(([t,i])=>ft(t,i,e,Ki.light)+ft(t+e*.4,i+e*.4,e*.55,Ki.shade)).join("")}function J_(){return nt("prop.console",90,110,"bc",()=>{let n=on(45,108,40,3,.4);for(const t of[18,66])n+=D(ce([[t+3,92],[t+2,102],[t+4,109]],8,7),qh,{stroke:2.6,sx:2,sy:0,hx:1,hy:0}),n+=D(vt(t+4,108,4.5),qh,{stroke:2.2,sx:1,sy:1,hx:.8,hy:.8});n+=D(ce([[64,34],[69,20],[74,8]],5,4),Ki,{stroke:2.6,sx:1.5,sy:0,hx:1,hy:0}),n+=D(vt(74.5,7.5,6),Xi,{stroke:2.6,sx:1.5,sy:1.5,hx:1.2,hy:1.2}),n+=D("M8 42L18 26H80L84 42Z",Ki,{sx:0,sy:-2,hx:0,hy:0,stroke:3.2,over:D(xe(64,34,8,3),{fill:"#2a2e38",shade:"#1c1f27",light:"#3a3f4b"},{stroke:2,sx:0,sy:0,hx:0,hy:0})+ft(26,34,2.2,R.crystalTeal)+ft(35,34,2.2,R.vein)+ft(44,34,2.2,"#3a3f4b")}),n+=D(mt(8,41,76,53,3),Ki,{sx:4,sy:3,hx:2,hy:2,stroke:3.4,over:k("M12 80H80M12 84H80M12 88H80",Ki.shade,1.6)+bo([[13,46],[79,46],[13,75],[79,75]])}),n+=D(vt(46,60,14),Ki,{stroke:2.6,sx:1.5,sy:1.5,hx:1,hy:1});let e="";for(let t=0;t<=8;t++){const i=Math.PI*(.8+t/8*1.4),s=Qe(46,61,7.5,i),r=Qe(46,61,10,i);e+=`M${Ne(s[0])} ${Ne(s[1])}L${Ne(r[0])} ${Ne(r[1])}`}return n+=D(vt(46,60,10.5),{fill:"#dfe3ea",shade:"#b9bfcb",light:"#f5f7fa"},{stroke:2,sx:1.5,sy:1.5,hx:0,hy:0,over:k(e,R.inkSoft,1.1)+k("M46 61L52 54",R.stamp,1.8)+ft(46,61,1.8,R.inkSoft)}),n})}function j_(){return nt("prop.gear",200,200,"c",()=>{const n={fill:"#4a4f5c",shade:"#373b46",light:"#5f6573"},e=100,t=100,i=16,s=Math.PI*2/i,r=[];for(let u=0;u<i;u++){const f=u*s;r.push(Qe(e,t,83,f-s*.27),Qe(e,t,95,f-s*.15),Qe(e,t,95,f+s*.15),Qe(e,t,83,f+s*.27))}let o=lt(r);const a=30,c=66,l=8;for(let u=0;u<5;u++){const f=u/5*Math.PI*2-Math.PI/2,d=f+Math.PI*2/5,m=Qe(e,t,c,d-Math.asin(l/c)),_=Qe(e,t,c,f+Math.asin(l/c)),p=Qe(e,t,a,f+Math.asin(l/a)),g=Qe(e,t,a,d-Math.asin(l/a));o+=`M${Ne(m[0])} ${Ne(m[1])}A${c} ${c} 0 0 0 ${Ne(_[0])} ${Ne(_[1])}L${Ne(p[0])} ${Ne(p[1])}A${a} ${a} 0 0 1 ${Ne(g[0])} ${Ne(g[1])}Z`}o+=vt(e,t,9);let h=D(o,n,{sx:5,sy:5,hx:2.5,hy:2.5,stroke:4,over:k(vt(e,t,76),n.shade,2)+k(vt(e,t,20),n.shade,2)+bo([Qe(e,t,15,.4),Qe(e,t,15,2.5),Qe(e,t,15,4.6)],2.4)});return h+=k(vt(e,t,9),"#23262e",3),h})}function e4(){return nt("prop.keyoutline",60,140,"c",()=>{const n="M35 48.4A21 21 0 1 0 25 48.4L25 126Q25 131 30 131Q35 131 35 126L35 124L49 124L49 116L43 116L43 110L49 110L49 102L35 102Z"+vt(30,28,9);let e=tt(30,28,30,R.vein,.28)+tt(38,110,26,R.vein,.2);e+=k(n,R.violet,11,.16)+k(n,R.vein,6.5,.3)+k(n,R.vein,3.4,.95)+k(n,"#fbf6ff",1.3,.95);for(const[t,i,s]of[[10,14,2.4],[52,40,1.8],[17,78,1.6],[52,132,2]])e+=k(`M${t-s*2} ${i}H${t+s*2}M${t} ${i-s*2}V${i+s*2}`,R.vein,1.1,.9)+ft(t,i,s*.55,"#ffffff");return e})}function t4(){return nt("prop.lock",70,90,"c",()=>{let n=on(38,48,30,40,.3);return n+=D(mt(7,5,56,80,11),Ki,{sx:4,sy:4,hx:2,hy:2,stroke:3.6,over:k(mt(13,11,44,68,7),R.violetDark,3.4)+k(mt(13,11,44,68,7),R.violet,1.8)+k(mt(16.5,14.5,37,61,5),R.vein,.9,.6)+bo([[14,12],[56,12],[14,78],[56,78]],2.2)+k("M24 64l6 -3M44 30l4 4",Ki.light,1.1,.8)}),n+=D("M35 30.5a7.5 7.5 0 0 1 4.6 13.4L42 58H28L30.4 43.9A7.5 7.5 0 0 1 35 30.5Z",{fill:"#15131f",shade:"#15131f",light:"#2a2640"},{stroke:2.6,sx:0,sy:0,hx:-1.5,hy:-1.5,inner:tt(35,46,12,R.violet,.5)}),n})}const ml={fill:"#8c8578",shade:"#6f695e",light:"#a39c8e"},gl={fill:"#aaa396",shade:"#8a8376",light:"#c1baac"},rn={fill:"#7a766e",shade:"#5a564f",light:"#a29d93"},lc={fill:R.paper,shade:R.paperDark,light:"#ece4d2"};function Yh(n){return nt(n?"prop.officedoor.open":"prop.officedoor",110,300,"bc",e=>{let t="";if(n)t+=ge(Zt(14,12,82,288),"#2b2825"),t+=ge(Zt(14,250,82,50),"#39342f"),t+=k("M14 250H96","#4a443d",2),t+=tt(66,140,56,"#d9c9a0",.16),t+=k(Zt(52,96,30,40),"#46403a",2.2)+ge(Zt(52,96,30,40),"#35302b"),t+=k(pe([[40,236],[66,230],[92,236]]),"#4a443d",2.2),t+=ge(Zt(14,12,82,8),ut,.35),t+=D("M14 12L40 30V284L14 300Z",{fill:"#8f887b",shade:"#736d61",light:"#a59e90"},{sx:0,sy:0,hx:1.5,hy:0,stroke:3,over:ge("M18 266L36 258V278L18 290Z",rn.fill)+k("M18 266L36 258V278L18 290Z",ut,1.4)+ge("M16 30L22 34V44L16 42Z",rn.fill)}),t+=D("M40 30L44 32V283L40 284Z",gl,{stroke:2,sx:0,sy:0,hx:0,hy:0}),t+=D(mt(32,158,8,4,2),rn,{stroke:1.8,sx:0,sy:1,hx:0,hy:.6});else{t+=D(Zt(14,12,82,288),gl,{sx:0,sy:0,hx:2,hy:2,stroke:3,shadeD:Zt(84,12,12,288),over:k("M30 20V290M62 18V292",gl.shade,1.1,.6)+ge(Zt(16,296.5,78,2.5),"#f3d98e",.8)});for(const i of[40,150,256])t+=D(Zt(12,i,5,16),rn,{stroke:1.8,sx:1,sy:0,hx:.6,hy:0});t+=D(Zt(20,268,70,26),rn,{stroke:2.2,sx:0,sy:2,hx:0,hy:1,over:bo([[24,272],[86,272],[24,290],[86,290]],1.4)}),t+=D(Zt(36,92,38,11),rn,{stroke:2,sx:1,sy:1,hx:.8,hy:.8,over:k("M41 96H69M41 99.5H62",rn.shade,1.1)}),t+=Br('transform="rotate(-4 50 136)"',D(Zt(36,116,30,40),lc,{stroke:1.8,sx:1.5,sy:1.5,hx:0,hy:0,over:k("M40 123H62M40 128H60M40 133H62M40 138H56","#8e8574",1)+k(vt(55,147,5.5),R.stamp,1.6)+k("M51.5 147h7",R.stamp,1.4)})+ge(Zt(46,113,10,5),"#e6dfc9",.8)),t+=D(vt(82,162,4.5),rn,{stroke:2,sx:1,sy:1,hx:.8,hy:.8}),t+=D(mt(66,159.5,18,5,2.5),rn,{stroke:2,sx:0,sy:1.2,hx:0,hy:.8}),t+=ge("M81 172a1.8 1.8 0 1 1 2 0l0.6 4h-3.2Z",ut)}return t+=Ts([Zt(2,0,12,300),Zt(96,0,12,300),Zt(2,0,106,12)],ml,{sx:3,sy:3,hx:2,hy:2},3.4),t+=k("M8 12V296M102 12V296",ml.shade,1.2,.7)+Rr(6,104,[5],ml.shade,e,1.1,.6),t})}function n4(){return nt("prop.bench",200,70,"bc",()=>{const n={fill:"#8f7c66",shade:"#6f604f",light:"#a8957c"};let e=on(100,68,96,3,.4);for(const t of[26,174])e+=D(mt(t-3,4,6,40,2),rn,{stroke:2.4,sx:1.5,sy:0,hx:.8,hy:0}),e+=D(ce([[t-4,44],[t-9,67]],5,4.5),rn,{stroke:2.4,sx:1.2,sy:0}),e+=D(ce([[t+4,44],[t+9,67]],5,4.5),rn,{stroke:2.4,sx:1.2,sy:0}),e+=D(mt(t-13,65,26,4,2),rn,{stroke:2,sx:0,sy:1,hx:0,hy:.6});for(const t of[7,20])e+=D(mt(10,t,180,10,3),n,{sx:0,sy:2.5,hx:0,hy:1.5,stroke:3});return e+=D(mt(4,36,192,11,3),n,{sx:0,sy:3,hx:0,hy:1.5,stroke:3.2,over:k("M7 41.5H193",n.shade,1.3)}),e+=D("M140 36L146 29L172 31L168 36Z",lc,{stroke:1.8,sx:0,sy:1,hx:0,hy:0,over:k("M150 32.5L164 33.5","#8e8574",1)}),e})}function i4(){return nt("prop.coatrack",70,200,"bc",()=>{const n={fill:"#5b4a3e",shade:"#43362d",light:"#76614f"},e={fill:"#5d564d",shade:"#47413a",light:"#766e62"};let t=on(35,198,30,3,.4);t+=D(ce([[35,178],[20,190],[6,198]],7,5),n,{stroke:2.6,sx:1,sy:1.5}),t+=D(ce([[35,178],[50,190],[64,198]],7,5),n,{stroke:2.6,sx:1,sy:1.5}),t+=D(mt(31,12,8,172,3),n,{sx:3,sy:0,hx:1.5,hy:0,stroke:3,over:k("M31 60H39M31 120H39",n.shade,1.4)}),t+=D(vt(35,9,5.5),n,{stroke:2.6,sx:1.2,sy:1.2,hx:1,hy:1}),t+=D(ce([[35,180],[36,199]],8,6),n,{stroke:2.4,sx:1,sy:0});for(const i of[-1,1]){const s=[[35,30],[35+i*11,27],[35+i*17,20],[35+i*16,14]];t+=D(ce(s,4.5,3),rn,{stroke:2.2,sx:1,sy:1})+D(vt(s[3][0],s[3][1],2.4),rn,{stroke:1.6,sx:.5,sy:.5,hx:.4,hy:.4})}return t+=D(ce([[35,44],[47,43],[50,37]],3.5,2.5),rn,{stroke:2,sx:1,sy:1}),t+=D(de([[14,22],[24,26],[28,40],[30,76],[34,126],[30,142],[16,144],[2,140],[4,112],[5,70],[6,38],[9,26]]),e,{sx:4,sy:2,hx:2,hy:1,stroke:3.2,over:k(pe([[16,28],[17,60],[18,100],[17,140]]),e.shade,1.4)+ft(20,60,1.6,ut)+ft(20.5,80,1.6,ut)+ft(21,100,1.6,ut)+k("M24 104h8",e.shade,1.6)+k(pe([[8,40],[6,80],[9,118]]),e.shade,1.2,.8)}),t+=D(wt([[10,24,1],[16,20],[22,24,1],[18,36],[14,36]]),e,{stroke:2.2,sx:1,sy:1,hx:.6,hy:.6}),t+=D(ce([[16,26],[19,44],[18,66],[20,84]],6,5),{fill:R.stamp,shade:"#733643",light:"#b06474"},{stroke:2.2,sx:1.5,sy:.5,hx:1,hy:.5}),t})}function na(n,e,t,i,s,r=()=>""){const o=Math.cos(s),a=Math.sin(s),c=(u,f)=>[n+u*o-f*a,e+(u*a+f*o)*.42],l=lt([c(-t/2,-i/2),c(t/2,-i/2),c(t/2,i/2),c(-t/2,i/2)]);let h="";for(let u=-i/2+9;u<i/2-12;u+=7)h+=lt([c(-t/2+7,u),c(t/2-7-u*7%13,u)],!1);return D(l,lc,{stroke:1.8,sx:0,sy:1.2,hx:0,hy:0,over:k(h,"#8e8574",1.1,.9)+r(c)})}function s4(){return nt("prop.table",620,170,"bc",()=>{const n={fill:"#8b7b69",shade:"#6f604f",light:"#a4937e"},e={fill:"#6b5d4e",shade:"#54483c",light:"#85745f"};let t=on(310,164,280,6,.35);const i=(s,r,o)=>D(mt(s-8,r,16,162-r,3),o,{sx:3,sy:0,hx:1.5,hy:0,stroke:3})+D(mt(s-26,160,52,7,3),o,{sx:0,sy:2,hx:0,hy:1,stroke:2.8});return t+=i(310,96,{...rn,fill:rn.shade}),t+=i(150,108,rn)+i(470,108,rn),t+=D("M8 58A302 46 0 0 0 612 58V72A302 46 0 0 1 8 72Z",e,{sx:0,sy:3,hx:0,hy:1.5,stroke:3.4}),t+=D(xe(310,58,302,46),n,{sx:0,sy:-4,hx:0,hy:3,stroke:3.4,over:k("M60 40Q310 -8 560 40",n.light,2.2,.5)+k(xe(310,58,270,38),n.shade,1.2,.5)}),t+=na(150,66,70,90,-.12,s=>{let r="";for(const o of[-18,4]){const a=s(o-8,-30),c=s(o+8,-30),l=s(o+8,-6),h=s(o-8,-6);r+=ge(lt([a,c,l,h]),"#c9bea6")+k(lt([a,c,l,h]),"#6e6656",1);const u=s(o,-20);r+=ge(xe(u[0],u[1],3.4,1.6),"#6e6656")}return r}),t+=na(300,54,66,86,.08),t+=na(306,58,66,86,-.05),t+=na(312,62,70,90,.1,s=>{const r=s(14,22);return k(xe(r[0],r[1],8,3.6),R.stamp,1.8)+k(xe(r[0],r[1],5,2.2),R.stamp,1.1)}),t+=na(470,64,68,88,.2,s=>{const r=s(-20,30),o=s(20,26);return k(`M${Ne(r[0])} ${Ne(r[1])}q6 -5 10 0t10 -1t10 1t8 -3`,"#3a3550",1.2)+k(lt([s(-24,34),o],!1),"#8e8574",.9)}),t+=D(ce([[512,76],[546,70]],4,3),{fill:"#3a3550",shade:"#2b2840",light:"#4d4766"},{stroke:1.6,sx:0,sy:1,hx:0,hy:.6}),t+=D(mt(368,60,18,7,2),{fill:"#6e4a3a",shade:"#553829",light:"#8a624e"},{stroke:2,sx:0,sy:1.5,hx:0,hy:.8}),t+=D(mt(372,48,10,13,3),{fill:R.stamp,shade:"#733643",light:"#b06474"},{stroke:2,sx:1,sy:0,hx:.8,hy:0}),t+=D(vt(377,46,5),{fill:R.stamp,shade:"#733643",light:"#b06474"},{stroke:2,sx:1,sy:1,hx:.8,hy:.8}),t})}function r4(){return nt("prop.chair",70,110,"bc",()=>{const n={fill:R.suit,shade:R.suitDark,light:R.suitLight};let e=on(35,108,30,2.5,.4);e+=D(ce([[35,94],[20,99],[8,101]],6,4),rn,{stroke:2.4,sx:0,sy:1.5}),e+=D(ce([[35,94],[50,99],[62,101]],6,4),rn,{stroke:2.4,sx:0,sy:1.5});for(const t of[9,35,61])e+=D(vt(t,104.5,4.5),{fill:"#3a3a44",shade:"#282830",light:"#55555f"},{stroke:2,sx:1,sy:1,hx:.8,hy:.8});return e+=D(mt(31,64,8,32,2),rn,{sx:2,sy:0,hx:1,hy:0,stroke:2.6}),e+=D(ce([[40,66],[22,64],[16,52]],6,5),rn,{stroke:2.4,sx:1,sy:1}),e+=D(wt([[12,12],[22,8],[28,14],[26,48],[18,58],[9,54],[8,30]]),n,{sx:3,sy:2,hx:2,hy:1.5,stroke:3,over:k(pe([[14,16],[13,34],[14,50]]),n.shade,1.4)}),e+=D(mt(12,56,50,12,6),n,{sx:0,sy:3,hx:0,hy:2,stroke:3}),e+=D(ce([[30,58],[32,44],[50,42]],4,4),rn,{stroke:2.2,sx:1,sy:1}),e+=D(mt(30,39,24,6,3),{fill:"#3a3a44",shade:"#282830",light:"#55555f"},{stroke:2.2,sx:0,sy:1.5,hx:0,hy:1}),e})}function Qi(n,e,t,i){const s=t*.22;return ge(lt([[n,e-t],[n+s,e-s],[n+t,e],[n+s,e+s],[n,e+t],[n-s,e+s],[n-t,e],[n-s,e-s]]),i)+ft(n,e,s*.9,"#ffffff")}function zl(n,e,t,i,s,r=1){const o=(a,c)=>[n+(a*Math.cos(t)-c*Math.sin(t)),e+(a*Math.sin(t)+c*Math.cos(t))*r];return wt([[...o(0,0),1],[...o(i*.35,-s/2)],[...o(i*.8,-s*.3)],[...o(i,0),1],[...o(i*.8,s*.3)],[...o(i*.35,s/2)]])}const Zh=["M-3.5 1.5L0 -1.5L3.5 1.5","M-3.5 -1.5L3.5 1.5M-3.5 1.5L3.5 -1.5","M-3 -1.5V1.5M1 -1.5L-2 1.5M3 -1.5V1.5","M-3.5 0H3.5M0 -1.5V1.5","M-3.5 -1.5L0 1.5L3.5 -1.5","M-3.5 1.5V-1.5L3.5 1.5V-1.5"];function a4(n,e,t){return Zh[t%Zh.length].replace(/([ML])(-?[\d.]+) (-?[\d.]+)/g,(i,s,r,o)=>`${s}${Ne(n+ +r)} ${Ne(e+ +o)}`).replace(/H(-?[\d.]+)/g,(i,s)=>`H${Ne(n+ +s)}`).replace(/V(-?[\d.]+)/g,(i,s)=>`V${Ne(e+ +s)}`)}function o4(){return nt("prop.anchor",40,40,"c",n=>{let e=tt(20,20,20,R.violet,.5);for(const i of[-2.5,-1.2,.2,1.3,2.4]){const s=i+n.range(-.15,.15);e+=D(ce([Qe(20,20,9,s),Qe(20,20,14.5,s+.12),Qe(20,20,18.5,s+.3)],5.5,1.6),Dt,{stroke:1.8,sx:1,sy:1,hx:.6,hy:.6})}const t=[];for(let i=0;i<11;i++)t.push(Qe(20,20,12.5*n.range(.86,1.08),i/11*Math.PI*2));return e+=D(de(t),Dt,{stroke:2.2,sx:2.5,sy:2.5,hx:1.5,hy:1.5,over:k(pe([[10,17],[12,12.5],[17,10]]),R.barkDark,1.1)+k(pe([[26,29],[30,25]]),R.barkDark,1.1)}),e+=ft(20,20,7,"#241638"),e+=tt(20,20,10,R.vein,.7),e+=k(vt(20,20,5.2),R.violet,3.2)+k(vt(20,20,5.2),R.vein,1.4)+ft(20,20,1.6,"#ffffff"),e})}function l4(){return nt("prop.site",100,28,"bc",n=>{const i=[];for(let a=0;a<14;a++){const c=a/14*Math.PI*2+.1;i.push({a:c,x:50+Math.cos(c)*43,y:19+Math.sin(c)*6.5,r:n.range(3.2,4.4),root:a%3===1})}const s=a=>a.root?D(ce([[a.x-5,a.y+1],[a.x,a.y-1.2],[a.x+5,a.y+.6]],3.4,2.4),Dt,{stroke:1.8,sx:.8,sy:.8,hx:.5,hy:.5}):ts(a.x,a.y,a.r*(Math.sin(a.a)>0?1.15:.85),n,ga,1.8);let r=Es(50,19,50,12,R.violet,.5);for(const a of i)Math.sin(a.a)<0&&(r+=s(a));let o=xe(50,19,30,4.2)+xe(50,19,9,1.4);for(let a=0;a<7;a++){const c=a/7*Math.PI*2+.3;o+=a4(50+Math.cos(c)*20,19+Math.sin(c)*2.6,a)}r+=k(o,R.violetDark,3,.75)+k(o,R.vein,1.3);for(const a of i)Math.sin(a.a)>=0&&(r+=s(a));return r})}function Kh(n){return nt(n?"prop.node.lit":"prop.node",60,72,"bc",()=>{const e={fill:"#3f6b5e",shade:"#2d4d45",light:"#5f8f7d"},t=yt.teal;let i=on(30,70,17,2.5,.35);if(i+=n?tt(30,30,30,R.crystalTeal,.75):tt(30,27,20,R.crystalTeal,.25),i+=D(de([[29,70],[18,65],[7,63],[13,58],[24,60]]),e,{stroke:2,sx:1,sy:1.5,hx:.6,hy:.6}),i+=D(de([[31,70],[42,64],[53,62],[47,57],[36,60]]),e,{stroke:2,sx:1,sy:1.5,hx:.6,hy:.6}),i+=D(ce([[30,71],[29,60],[31,50],[30,42]],6,4.5),e,{stroke:2.4,sx:1.5,sy:0,hx:.8,hy:0}),!n)i+=D(de([[30,47],[19,38],[17,24],[23,11],[30,4],[37,11],[43,24],[41,38]]),t,{stroke:2.6,sx:2.5,sy:2,hx:1.5,hy:1.5}),i+=D(de([[30,47],[20,39],[18.5,26],[24,13],[30.5,6],[27.5,22],[29.5,38]]),t,{stroke:2.2,sx:1.5,sy:1.5,hx:1.2,hy:1.2}),i+=D(de([[30,47],[40,39],[41.5,27],[37.5,14],[31,7],[33,24],[31,40]]),{...t,fill:R.crystalTealDark},{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1,light:t.fill}),i+=D(de([[30,50],[21,47],[17,41],[26,43]]),e,{stroke:1.8,sx:.8,sy:.8}),i+=D(de([[30,50],[39,47],[43,41],[34,43]]),e,{stroke:1.8,sx:.8,sy:.8}),i+=k("M23 18Q22 26 24 34",t.light,1.3,.9)+Qi(24,12,3,R.crystalTealLight);else{const s={fill:"#7fdccc",shade:"#3fa596",light:"#e8fffb"};for(const[r,o,a]of[[-2.75,22,12],[-.39,22,12],[-2.1,25,13],[-1.04,25,13],[-1.57,24,13]])i+=D(zl(30,40,r,o,a),s,{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1,over:k(pe([Qe(30,40,4,r),Qe(30,40,o*.7,r)]),s.shade,1,.8)});i+=tt(30,34,18,"#ffffff",.85),i+=D(vt(30,35,6.5),{fill:"#e8fffb",shade:"#9fe3d8",light:"#ffffff"},{stroke:2,sx:1,sy:1,hx:.8,hy:.8}),i+=Qi(12,18,3.5,R.crystalTealLight)+Qi(48,14,3,R.crystalTealLight)+Qi(40,4,2.5,"#ffffff")}return i})}function c4(){return nt("prop.memory",36,36,"c",()=>{const e=(r,o)=>[18+r*Math.cos(-.62)-o*Math.sin(-.62),19+r*Math.sin(-.62)+o*Math.cos(-.62)];let t=tt(18,18,18,R.violet,.5);const i=wt([[...e(-13,0),1],[...e(-5,-7.5)],[...e(6,-7)],[...e(13,0),1],[...e(6,7.2)],[...e(-5,7.8)]]),s=pe([e(-12,0),e(12,0)])+pe([e(-6,0),e(-3,-4.5)])+pe([e(0,0),e(3,-4.5)])+pe([e(6,0),e(8,-3.5)])+pe([e(-5,0),e(-2,4.5)])+pe([e(1,0),e(4,4.5)]);return t+=ue(i,{fill:"#f4ecdf",stroke:2,shadeD:lt([e(-13,0),e(13,0),e(6,9),e(-5,9)]),over:k(s,"#a8977e",.9,.9)+ge(lt([e(-13,0),e(-8,-3.2),e(-8,.4)]),R.ivoryDark)+k(lt([e(-8,-3.2),e(-8,.4)],!1),ut,.9)}),t+=Qi(...e(11,-7),5,R.vein)+Qi(...e(-9,7),2.6,R.vein),t})}function Qh(n){return nt(n?"prop.lantern.lit":"prop.lantern",40,72,"bc",()=>{const i=n?{fill:"#8ae6d6",shade:"#43b6a4",light:"#f0fffb"}:{fill:"#3f6d68",shade:"#2d4f4b",light:"#5e8e88"};let s=on(20,70,13,2.5,.35);n&&(s+=tt(20,22,20,"#7fe6d4",.85)+Es(20,70,20,4,"#7fe6d4",.5)),s+=D(ce([[20,67],[11,70],[2,72]],5,2),Dt,{stroke:2,sx:.8,sy:1}),s+=D(ce([[20,67],[29,70],[38,72]],5,2),Dt,{stroke:2,sx:.8,sy:1}),s+=D(ce([[20,72],[19,60],[21,48],[20,36]],7,5),Dt,{stroke:2.4,sx:1.5,sy:0,hx:.8,hy:0,over:k("M21 64Q23 54 20 44",R.violet,1,n?.8:.4)});const r=lt([[20,5],[27,12],[27,28],[20,35],[13,28],[13,12]]);return s+=ue(r,{...i,stroke:2.4,shadeD:lt([[20,5],[27,12],[27,28],[20,35],[21.5,20]]),over:(n?tt(20,20,10,"#ffffff",.95):"")+k("M16 13V26",i.light,1.3,.9)}),s+=D(ce([[19,38],[11,31],[9.5,19],[13,9],[20,3]],3.4,2),Dt,{stroke:1.8,sx:.8,sy:0,hx:.5,hy:0}),s+=D(ce([[21,38],[29,31],[30.5,19],[27,9],[20,3]],3.4,2),Dt,{stroke:1.8,sx:.8,sy:0,hx:.5,hy:0}),s+=D(vt(20,3.5,2.6),Dt,{stroke:1.6,sx:.6,sy:.6,hx:.5,hy:.5}),n&&(s+=Qi(6,12,2.6,R.crystalTealLight)+Qi(35,20,2.2,R.crystalTealLight)+Qi(32,5,1.8,"#ffffff")),s})}function Jh(n){return nt(n?"prop.flowernode.open":"prop.flowernode",70,80,"bc",()=>{const e={fill:"#6d7a45",shade:"#525c33",light:"#8b995c"},t={fill:R.sun,shade:R.sunDark,light:R.sunLight};let i=on(35,78,24,3,.35);if(i+=D(de([[34,78],[20,71],[4,69],[12,60],[26,64]]),e,{stroke:2.4,sx:1.5,sy:2,hx:1,hy:1,over:k("M30 74L12 66",e.shade,1.2)}),i+=D(de([[36,78],[50,71],[66,68],[58,59],[44,64]]),e,{stroke:2.4,sx:1.5,sy:2,hx:1,hy:1,over:k("M40 74L58 65",e.shade,1.2)}),i+=D(ce([[35,79],[34,66],[36,52]],8,6),e,{stroke:2.6,sx:2,sy:0,hx:1,hy:0}),n){i+=tt(35,30,34,R.sunLight,.5)+tt(35,30,16,R.vein,.4);const s=35,r=30;for(let o=0;o<8;o++){const a=o/8*Math.PI*2+.2;i+=D(zl(s,r,a,27,14,.8),{...t,fill:R.sunDark,shade:"#8f6a2c"},{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1,light:t.fill})}for(let o=0;o<7;o++){const a=o/7*Math.PI*2-.1;i+=D(zl(s,r,a,22,13,.8),t,{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1,inner:ge(xe(s,r,11,9),R.violet),over:k(pe([Qe(s,r,11,a),[s+Math.cos(a)*18,r+Math.sin(a)*18*.8]]),t.shade,1.1)})}i+=D(xe(s,r,8.5,7.5),{fill:R.violetDark,shade:"#4f2c7a",light:R.violet},{stroke:2.4,sx:1.5,sy:1.5,hx:1,hy:1,over:[0,1,2,3,4,5,6].map(o=>ft(...Qe(s,r,o===0?0:4,o/6*Math.PI*2),1.3,R.vein)).join("")})}else{i+=tt(35,30,30,R.sunLight,.3);const s=r=>ge(r,R.violet,.9);i+=D(de([[35,56],[21,47],[18,30],[24,14],[35,3],[46,14],[52,30],[49,47]]),t,{stroke:2.8,sx:3,sy:2.5,hx:1.5,hy:1.5,inner:s(xe(35,2,9,12))}),i+=D(de([[35,56],[22,48],[19.5,32],[25,16],[35.5,5],[31,26],[33.5,46]]),t,{stroke:2.4,sx:2,sy:2,hx:1.2,hy:1.2,inner:s(xe(30,6,7,10)),over:k("M27 22Q25 34 29 46",t.shade,1.2)}),i+=D(de([[35,56],[48,48],[50.5,32],[45,16],[35.5,6],[39,26],[36.5,46]]),{...t,fill:R.sunDark,shade:"#8f6a2c"},{stroke:2.4,sx:2,sy:2,hx:1.2,hy:1.2,light:t.fill,inner:s(xe(41,7,7,10))}),i+=D(de([[35,58],[25,55],[20,48],[30,50]]),e,{stroke:2,sx:1,sy:1}),i+=D(de([[35,58],[45,55],[50,48],[40,50]]),e,{stroke:2,sx:1,sy:1}),i+=k("M27 16L25 30M44 18L46 30",R.violet,1.3,.7)}return i})}function h4(){return nt("prop.current",80,40,"bc",n=>{const e={fill:"#62a0d4",shade:"#3f72a8",light:"#c6e8fa"},t={fill:"#e6f4fb",shade:"#b7d6e8",light:"#ffffff"};let i=Es(40,28,40,16,"#8fd0f2",.5);for(const[r,o,a]of[[10,30,5],[22,27.5,5],[36,26.5,5],[50,26.5,5],[63,27.5,5],[73,30.5,5]])i+=ts(r,o,a,n,ga,1.8);i+=D(de([[12,34],[17,24],[25,14],[33,9],[40,8],[47,9],[55,14],[63,24],[68,34]]),e,{stroke:2.6,sx:3.5,sy:2,hx:2,hy:2,over:k("M30 30Q31 20 36 13M44 12Q47 20 46 30",e.light,1.6,.85)+k("M38 28V18","#ffffff",1.2,.7)+ft(26,26,1.5,e.light)+ft(52,22,1.2,e.light)});for(const[r,o,a]of[[30,5,2.2],[40,2.5,2],[50,5.5,1.8],[23,11,1.6],[57,12,1.6]])i+=D(de([[r,o-a*1.6],[r+a,o],[r,o+a],[r-a,o]]),e,{stroke:1.4,sx:.6,sy:.6,hx:.5,hy:.5});const s=[[8,36,1]];for(let r=8;r<=72;r+=8)s.push([r+4,30.5+(r%16?1:0)],[r+8,33]);s.push([72,37,1]),i+=D(wt(s),t,{stroke:2,sx:0,sy:1.5,hx:0,hy:1});for(const[r,o,a]of[[6,36.5,6],[20,38,6],[34,39,5.5],[48,39,6],[62,38,5.5],[75,36,5.5]])i+=ts(r,o,a,n,ga,2);return i})}function f4(){return[M_(),y_(),S_(),T_(),E_(),w_(),A_(),R_(),C_(),Bh(!1),Bh(!0),P_(),D_(),I_(),pl("prop.crystals.teal",yt.teal,"fish"),pl("prop.crystals.blue",yt.blue,"bird"),pl("prop.crystals.orange",yt.orange,"fish"),k_(),zh(!1),zh(!0),B_(),$_(),G_(),H_(),V_(),Vh(!1),Vh(!0),W_(),X_(),Wh(!1),Wh(!0),q_(),Y_(),Z_(),K_(),Q_(),J_(),j_(),e4(),t4(),Yh(!1),Yh(!0),n4(),i4(),s4(),r4(),o4(),l4(),Kh(!1),Kh(!0),c4(),Qh(!1),Qh(!0),Jh(!1),Jh(!0),h4()]}const u4=["sperm","blue","bowhead"],_l={sperm:[96,150,210],blue:[150,210,300],bowhead:[96,150]},xa={blue:{back:[.28,.86],tail:[.13,.0555],fluke:[0,.058],fin:[.738,.106],eye:[.769,.05],eyeR:.0105,blow:[.822,0],jawRest:0,ext:{u0:-.105,u1:1.01,v0:-.03,v1:.18},spout:.2},sperm:{back:[.37,.975],tail:[.14,.079],fluke:[0,.085],fin:[.64,.184],eye:[.69,.157],eyeR:.011,blow:[.962,0],jaw:[.715,.194],jawRest:.035,ext:{u0:-.14,u1:1.01,v0:-.03,v1:.26},spout:.16,label:[.46,.105]},bowhead:{back:[.23,.69],tail:[.12,.095],fluke:[0,.1],fin:[.6,.262],eye:[.688,.166],eyeR:.012,blow:[.7,0],jaw:[.708,.19],jawRest:0,ext:{u0:-.14,u1:1.005,v0:-.02,v1:.37},spout:.17}};function To(n,e){const t=xa[n];return e/(t.back[1]-t.back[0])}function cc(n,e){const t=xa[n],i=To(n,e),s=(t.back[0]+t.back[1])/2,r=a=>[(a[0]-s)*i,a[1]*i],o=`whale.${n}.${e}`;return{species:n,size:e,len:i,keys:{body:`${o}.body`,tail:`${o}.tail`,fluke:`${o}.fluke`,fin:`${o}.fin`,lid:`${o}.lid`,jaw:t.jaw?`${o}.jaw`:null,spout:`whale.spout.${n}`},tail:r(t.tail),fluke:r(t.fluke),fin:r(t.fin),jaw:t.jaw?r(t.jaw):null,eye:r(t.eye),blow:r(t.blow),jawRest:t.jawRest,bounds:{x0:(t.ext.u0-s)*i,y0:t.ext.v0*i-t.spout*i,x1:(t.ext.u1-s)*i,y1:t.ext.v1*i},depth:t.ext.v1*i,spoutScale:t.spout*i/u0[n],label:t.label?{at:r(t.label),scale:Math.min(1.3,Math.max(.6,i/250))}:null}}const Y=n=>Math.round(n*100)/100;class hc{constructor(e,t){Me(this,"L");Me(this,"uc");this.L=e,this.uc=t}x(e){return(e-this.uc)*this.L}y(e){return e*this.L}p(e,t){return[this.x(e),this.y(t)]}nodes(e){return e.map(([t,i,s])=>({x:this.x(t),y:this.y(i),s:!!s?.includes("s"),c:!!s?.includes("c"),g:!!s?.includes("g")}))}pts(e){return e.map(([t,i])=>this.p(t,i))}}const ji=(n,e=[])=>n.map(([t,i],s)=>({x:t,y:i,s:!1,c:e.includes(s),g:!1}));function fc(n,e){const t=n.length,i=s=>e?n[(s+t)%t]:s<0||s>=t?null:n[s];return n.map((s,r)=>{if(s.c)return[0,0];const o=i(r-1),a=i(r+1),c=(u,f)=>Math.hypot(f.x-u.x,f.y-u.y)||1,l=!!o?.s,h=s.s;if(o&&a&&l&&h)return[0,0];if(o&&a&&l){if(!s.g)return[a.x-s.x,a.y-s.y];const u=c(o,s),f=c(s,a);return[(s.x-o.x)/u*f,(s.y-o.y)/u*f]}if(o&&a&&h){if(!s.g)return[s.x-o.x,s.y-o.y];const u=c(s,a),f=c(o,s);return[(a.x-s.x)/u*f,(a.y-s.y)/u*f]}return!o&&a?[a.x-s.x,a.y-s.y]:o&&!a?[s.x-o.x,s.y-o.y]:[(a.x-o.x)/2,(a.y-o.y)/2]})}function uc(n,e,t,i){return n.s?`L${Y(e.x)} ${Y(e.y)}`:`C${Y(n.x+t[0]/3)} ${Y(n.y+t[1]/3)} ${Y(e.x-i[0]/3)} ${Y(e.y-i[1]/3)} ${Y(e.x)} ${Y(e.y)}`}function Eo(n){const e=fc(n,!0);let t=`M${Y(n[0].x)} ${Y(n[0].y)}`;for(let i=0;i<n.length;i++)t+=uc(n[i],n[(i+1)%n.length],e[i],e[(i+1)%n.length]);return t+"Z"}function d4(n,e,t){const i=n.length,s=fc(n,!0);let r=`M${Y(n[e%i].x)} ${Y(n[e%i].y)}`;for(let o=e;o<t;o++)r+=uc(n[o%i],n[(o+1)%i],s[o%i],s[(o+1)%i]);return r}function p4(n){const e=fc(n,!1);let t=`M${Y(n[0].x)} ${Y(n[0].y)}`;for(let i=0;i<n.length-1;i++)t+=uc(n[i],n[i+1],e[i],e[i+1]);return t}const Ft=n=>p4(ji(n)),Xt=(n,e=C,t=1)=>k(n,at,e,t),jh=(n,e,t,i,s=1)=>`<circle cx="${Y(n)}" cy="${Y(e)}" r="${Y(t)}" fill="${i}"${s!==1?` opacity="${Y(s)}"`:""}/>`,h0=(n,e,t,i,s=C*.8)=>`<circle cx="${Y(n)}" cy="${Y(e)}" r="${Y(t)}" fill="${i}" stroke="${at}" stroke-width="${s}"/>`;function Dn(n,e,t={}){const i=Eo(n);let s=Q(i,e,{stroke:0,inner:t.inner,over:t.over});if(!t.runs)s+=k(i,at,Ci);else for(const[r,o]of t.runs)s+=k(d4(n,r,o),at,Ci);return s}function ha(n,e){const t=[...n].sort((i,s)=>i[0]-s[0]);if(e<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++){const s=t[i-1],r=t[i];if(e<=r[0])return s[1]+(r[1]-s[1])*(e-s[0])/(r[0]-s[0]||1)}return t[t.length-1][1]}function On(n,e){const t={x0:1/0,y0:1/0,x1:-1/0,y1:-1/0};for(const i of n)for(const[s,r]of i)t.x0=Math.min(t.x0,s),t.y0=Math.min(t.y0,r),t.x1=Math.max(t.x1,s),t.y1=Math.max(t.y1,r);return{x0:t.x0-e,y0:t.y0-e,x1:t.x1+e,y1:t.y1+e}}const Yn=n=>n.map(e=>[e.x,e.y]);function bn(n,e,t,i,s=!0){const r=Ci+2,o=Math.floor(t.x0-r),a=Math.floor(t.y0-r),c=Math.ceil(t.x1+r)-o,l=Math.ceil(t.y1+r)-a;return{key:n,w:c,h:l,px:i[0]-o,py:i[1]-a,body:`<g transform="translate(${-o} ${-a})">${e}</g>`,scale:Math.max(c,l)>120?1.5:2,grain:s}}function dc(n,e,t,i){const s=t*1.3,r=t*.92,o=xe(n,e,s,r),a=`M${Y(n-s-1)} ${Y(e-r-1)}H${Y(n+s+1)}V${Y(e-r*.28)}Q${Y(n)} ${Y(e+r*.05)} ${Y(n-s-1)} ${Y(e-r*.3)}Z`;return Q(o,_e.cream,{stroke:C,inner:jh(n+t*.32,e+t*.12,t*.62,at)+jh(n+t*.5,e-t*.08,t*.2,_e.cream)+ge(a,i),over:Xt(`M${Y(n-s)} ${Y(e-r*.3)}Q${Y(n)} ${Y(e+r*.05)} ${Y(n+s)} ${Y(e-r*.28)}`,C*.8)})+Xt(Ft([[n-s*.9,e-r*1.55],[n+t*.1,e-r*2.05],[n+s*1.05,e-r*1.5]]),C*.8,.85)}function pc(n,e,t,i){const s=t*1.3+1.2,r=t*.92+1.2;return Q(xe(n,e,s,r),i,{stroke:C*.8})+Xt(`M${Y(n-s*.85)} ${Y(e-r*.05)}Q${Y(n)} ${Y(e+r*.75)} ${Y(n+s*.85)} ${Y(e-r*.1)}`,C)}function f0(n,e,t,i=C*.85){let s="",r=e/2;for(let o=1;o<n.length;o++){const[a,c]=n[o-1],[l,h]=n[o],u=Math.hypot(l-a,h-c)||1,f=-(h-c)/u,d=(l-a)/u;for(;r<u;r+=e){const m=a+(l-a)*r/u,_=c+(h-c)*r/u;s+=`M${Y(m-f*t*.5-(l-a)/u*t*.2)} ${Y(_-d*t*.5-(h-c)/u*t*.2)}L${Y(m+f*t*.5+(l-a)/u*t*.2)} ${Y(_+d*t*.5+(h-c)/u*t*.2)}`}r-=u}return Xt(s,i,.9)}function ia(n,e,t,i,s=C*.8,r=.6,o=at){const a=[];for(let c=0;c<=4;c++)a.push([n+t*c/4,e+(c%2===0?0:c===1?-i:i)]);return k(Ft(a),o,s,r)}function ef(n,e,t,i,s){const r=Math.cos(i),o=Math.sin(i),a=(g,b)=>[n+r*g-o*b,e+o*g+r*b],[c,l]=a(t,0),[h,u]=a(t*.45,-t*.32),[f,d]=a(t*.5,t*.3),m=`M${Y(n)} ${Y(e)}Q${Y(h)} ${Y(u)} ${Y(c)} ${Y(l)}Q${Y(f)} ${Y(d)} ${Y(n)} ${Y(e)}Z`,[_,p]=a(t*.8,0);return Q(m,s,{stroke:C})+Xt(`M${Y(n)} ${Y(e)}L${Y(_)} ${Y(p)}`,C*.7,.8)}function m4(n,e,t,i,s){const o=-i/2,a=i*.28,c=`M${Y(-11.5+a)} ${Y(o)}H${Y(11.5-a)}Q${Y(11.5)} ${Y(o)} ${Y(11.5)} ${Y(o+a)}V${Y(-o-a)}Q${Y(11.5)} ${Y(-o)} ${Y(11.5-a)} ${Y(-o)}H${Y(-11.5+a)}Q${Y(-11.5)} ${Y(-o)} ${Y(-11.5)} ${Y(-o-a)}V${Y(o+a)}Q${Y(-11.5)} ${Y(o)} ${Y(-11.5+a)} ${Y(o)}Z`,l=i*.62,h=`M${Y(-l*.62)} ${Y(-l*.22)}L${Y(-l*.36)} ${Y(-l*.5)}V${Y(l*.5)}`,u=`M${Y(l*.42)} ${Y(l*.5)}V${Y(-l*.5)}L${Y(-l*.05)} ${Y(l*.18)}H${Y(l*.66)}`,f=i*.2,d=[[-11.5+f,o+f],[11.5-f,o+f],[11.5-f,-o-f],[-11.5+f,-o-f],[-11.5+f,o+f]];return`<g transform="translate(${Y(n)} ${Y(e)}) rotate(${Y(s*180/Math.PI)})">${Q(c,_e.butter,{stroke:C})}${f0(d,i*.3,i*.12,C*.6)}${Xt(h+u,C*.95)}</g>`}function Cr(n,e,t,i,s,r,o){const a=Math.cos(e),c=Math.sin(e),l=(m,_)=>[n[0]+a*m-c*_,n[1]+c*m+a*_],h=s.length,u=[],f=[];for(let m=0;m<h;m++){const _=m/(h-1),p=Math.sin(Math.PI*_)*o*t;u.push(l(_*t,p+s[m]*i)),f.push(l(_*t,p-r[m]*i))}return[l(-i*.45,0),...u.slice(0,h-1),u[h-1],...f.slice(0,h-1).reverse()]}const Bn={fill:_e.periwinkle,deep:_e.periwinkleDeep,pale:"#b9c1ea",throat:"#cdd2f1",edge:"#e6e9f8",patch:"#aab4e6",lid:"#8a97d4"},mi={fill:"#b5a3c0",deep:"#8d7a9b",pale:"#d6cadf",lip:_e.cream,mouth:"#d596b4",lid:"#9f8cad"},qn={fill:"#8f98a6",deep:"#6c7482",pale:"#b7bec8",chin:_e.cream,spot:"#434955",band:"#d7dadf",baleen:"#5b6170",baleenLine:"#a9aebb",lid:"#7a8391"};function g4(n){const e="blue",t=xa[e],i=To(e,n),s=new hc(i,(t.back[0]+t.back[1])/2),r=cc(e,n),o=new an(9100+n),a=s.nodes([[.13,.024],[.2,.0105],[.28,0,"sg"],[.86,0,"g"],[.925,.0045],[.966,.013],[.99,.022],[.998,.031],[1.004,.042],[.996,.052],[.972,.064],[.93,.081],[.86,.103],[.77,.124],[.66,.138],[.55,.141],[.44,.134],[.34,.119],[.25,.103],[.18,.092],[.13,.087,"s"]]),c=[[1,.045],[.972,.064],[.93,.081],[.86,.103],[.77,.124],[.66,.138],[.55,.141],[.44,.134],[.34,.119]],l=[[.995,.046],[.93,.061],[.84,.074],[.74,.088],[.64,.1],[.55,.11],[.5,.118],[.47,.13]];let h=ge(`${Ft(s.pts(l))}L${Y(s.x(.46))} ${Y(s.y(.2))}L${Y(s.x(1.05))} ${Y(s.y(.2))}Z`,Bn.throat);for(const P of[.2,.38,.56,.74,.9]){const $=[],Z=.53-P*.05;for(let V=.975;V>=Z;V-=.035){const se=ha(l,V);$.push(s.p(V,se+(ha(c,V)-se)*P))}h+=k(Ft($),Bn.deep,C*.8,.9)}for(let P=0;P<Math.round(i/9);P++){const $=o.range(.16,.84),Z=o.range(.012,Math.max(.02,ha(l,$)-.008)),V=o.range(.004,.011)*i,se=o.chance(.6);h+=ge(xe(s.x($),s.y(Z),V*o.range(1.1,1.8),V*o.range(.6,.9)),se?Bn.pale:Bn.deep,se?.85:.55)}const u=s.p(.47,.062),f=.036*i,d=.021*i,m=[];for(let P=0;P<9;P++){const $=P/9*Math.PI*2,Z=1+.12*Math.sin(P*2.3+1);m.push([u[0]+Math.cos($)*f*Z,u[1]+Math.sin($)*d*Z])}h+=Q(Eo(ji(m)),Bn.patch,{stroke:C*.7}),h+=f0([...m,m[0]],Math.max(3.4,.02*i),.007*i+1.2,C*.65);const _=Ft(s.pts([[.998,.037],[.96,.046],[.9,.053],[.84,.058],[.803,.061],[.788,.068]])),p=s.p(...t.eye),g=Xt(Ft(s.pts([[.8,.0085],[.822,.0045],[.846,.0075]])),C*.9,.9)+Xt(`M${Y(s.x(.814))} ${Y(s.y(.0125))}l${Y(.012*i)} 0.4M${Y(s.x(.814))} ${Y(s.y(.0165))}l${Y(.012*i)} 0.4`,C*.8,.8)+Xt(_,Ci*.85)+Xt(Ft(s.pts([[.62,.012],[.52,.02],[.4,.024]])),C*.7,.35)+dc(p[0],p[1],t.eyeR*i,Bn.lid),b=s.nodes([[.265,.006],[.25,-.002],[.232,-.012],[.214,-.022,"c"],[.222,-.009],[.219,.004],[.212,.016]]),E=ji(Cr(s.p(.745,.116),.5,.1*i,.02*i,[.5,.55,.5,.4,.25,0],[.5,.4,.33,.25,.15,0],.04));let v=Dn(E,Bn.deep)+Dn(b,Bn.fill);v+=Dn(a,Bn.fill,{inner:h,over:g,runs:[[0,a.length-1]]});const S=On([Yn(a),Yn(b),Yn(E)],.012*i),T=s.nodes([[.165,.0165],[.13,.024],[.08,.034],[.03,.042],[0,.046,"s"],[0,.07],[.05,.075],[.1,.081],[.13,.0855],[.165,.0895,"s"]]),L=Dn(T,Bn.fill,{inner:ge(xe(s.x(.08),s.y(.05),.012*i,.006*i),Bn.pale,.8)+ge(xe(s.x(.035),s.y(.058),.007*i,.004*i),Bn.deep,.5),runs:[[0,4],[5,9]]}),x=s.nodes([[.012,.046],[-.01,.042],[-.035,.026],[-.06,.006],[-.082,-.012],[-.1,-.024,"c"],[-.093,0],[-.083,.03],[-.074,.058,"c"],[-.083,.086],[-.093,.116],[-.1,.14,"c"],[-.082,.128],[-.06,.11],[-.035,.09],[-.01,.074],[.012,.07]]),w=Dn(x,Bn.fill,{over:Xt(Ft(s.pts([[0,.058],[-.035,.058],[-.068,.058]])),C*.8,.55)+k(Ft(s.pts([[-.02,.043],[-.05,.022],[-.08,0]])),Bn.edge,C,.9)+Xt(`M${Y(s.x(-.07))} ${Y(s.y(.1))}l${Y(.008*i)} ${Y(-.006*i)}M${Y(s.x(-.078))} ${Y(s.y(.11))}l${Y(.007*i)} ${Y(-.005*i)}`,C*.7,.6),runs:[[0,16]]}),I=Cr(s.p(...t.fin),.44,.135*i,.026*i,[.42,.55,.56,.5,.42,.3,.16,0],[.42,.4,.36,.31,.25,.18,.1,0],.035),O=ji(I),U=I.slice(2,8),G=Dn(O,Bn.fill,{over:k(Ft(U),Bn.edge,C*1.1,.95)});return[bn(r.keys.body,v,S,[0,0]),bn(r.keys.tail,L,On([Yn(T)],.006*i),r.tail),bn(r.keys.fluke,w,On([Yn(x)],.006*i),r.fluke),bn(r.keys.fin,G,On([I],.006*i),r.fin),bn(r.keys.lid,pc(p[0],p[1],t.eyeR*i,Bn.lid),On([[p]],t.eyeR*i*1.6+2),r.eye)]}function _4(n){const e="sperm",t=xa[e],i=To(e,n),s=new hc(i,(t.back[0]+t.back[1])/2),r=cc(e,n),o=new an(7300+n),a=[],c=U=>.01+(.33-U)*.037/.18;for(let U=.165;U<.32;U+=.03)a.push([U,c(U)]),a.push([U+.015,c(U+.015)-.0075]);const l=s.nodes([[.14,.05],...a,[.328,.008],[.341,-.004],[.353,-.008],[.364,-.003],[.37,0,"sg"],[.975,0,"g"],[.991,.009],[.999,.035],[1.003,.085],[.999,.135],[.988,.164],[.967,.179],[.92,.184],[.85,.186],[.77,.19],[.72,.196],[.68,.205],[.6,.215],[.5,.216],[.41,.204],[.32,.179],[.25,.152],[.2,.132],[.14,.108,"s"]]),h=s.nodes([[.715,.189],[.8,.187],[.9,.184],[.952,.183],[.948,.203],[.9,.211],[.8,.216],[.73,.216]]);let u=ge(Ft(s.pts([[.3,.26],[.36,.19],[.46,.175],[.56,.185],[.64,.23]]))+"Z",mi.pale,.9);for(let U=0;U<Math.round(i/8);U++){const G=o.range(.17,.64),P=G<.33?c(G)+.02:.03,$=o.range(P,G<.3?.11:.175);u+=ia(s.x(G),s.y($),o.range(.02,.034)*i,.0035*i+.4,C*.75,.55)}for(let U=0;U<5;U++){const G=o.range(.78,.96),P=o.range(.05,.15);u+=h0(s.x(G),s.y(P),o.range(.005,.009)*i,mi.pale,C*.6)}u+=Xt(Ft(s.pts([[.52,.085],[.6,.08],[.66,.1],[.68,.13]])),C*.8,.5);const f=s.p(...t.eye),d=Xt(Ft(s.pts([[.948,.012],[.955,.006],[.962,.01],[.969,.005]])),C,.95)+Xt(Ft(s.pts([[.672,.03],[.664,.085],[.672,.14]])),C*.8,.45)+dc(f[0],f[1],t.eyeR*i,mi.lid),m=ji(Cr(s.p(.655,.196),.75,.07*i,.03*i,[.5,.6,.62,.5,.28,0],[.5,.45,.4,.3,.16,0],.03));let _=Dn(m,mi.deep)+Dn(h,mi.mouth,{inner:Xt(Ft(s.pts([[.73,.206],[.83,.204],[.93,.198]])),C*.7,.5)});_+=Dn(l,mi.fill,{inner:u,over:d,runs:[[0,l.length-1]]});const p=On([Yn(l),Yn(m),Yn(h)],.012*i),g=s.nodes([[.172,.042],[.14,.05],[.127,.0505],[.114,.0565],[.1,.0585],[.07,.064],[.035,.068],[0,.071,"s"],[0,.099],[.04,.104],[.075,.109],[.105,.107],[.14,.108],[.172,.116,"s"]]);let b="";for(let U=0;U<3;U++)b+=ia(s.x(.03+U*.045),s.y(.08+U%2*.012),.022*i,.003*i+.4,C*.7,.5);const E=Dn(g,mi.fill,{inner:b,runs:[[0,7],[8,13]]}),v=s.nodes([[.012,.072],[-.012,.066],[-.045,.046],[-.08,.021],[-.112,-.003],[-.132,-.016,"c"],[-.119,.018],[-.105,.052],[-.093,.085,"c"],[-.105,.118],[-.119,.152],[-.132,.186,"c"],[-.112,.173],[-.08,.149],[-.045,.124],[-.012,.104],[.012,.098]]),S=Dn(v,mi.fill,{over:Xt(Ft(s.pts([[0,.085],[-.045,.085],[-.088,.085]])),C*.8,.5)+ia(s.x(-.1),s.y(.035),.02*i,.003*i,C*.7,.45)+ia(s.x(-.1),s.y(.14),.02*i,.003*i,C*.7,.45),runs:[[0,16]]}),T=Cr(s.p(...t.fin),.62,.085*i,.036*i,[.46,.6,.66,.62,.48,.26,0],[.46,.44,.42,.38,.3,.16,0],.03),L=Dn(ji(T),mi.fill,{over:ia(T[3][0]-2,T[3][1]-3,.025*i,.003*i+.3,C*.7,.5)}),x=s.nodes([[.715,.187],[.78,.187],[.86,.186],[.922,.188],[.94,.194],[.933,.2],[.87,.206],[.8,.212],[.74,.217],[.706,.213],[.699,.2]]);let w="";for(let U=.745;U<=.925;U+=.0155){const G=s.x(U),P=s.y(.1885),$=.0045*i+.25,Z=.012*i+.6;w+=Q(`M${Y(G-$)} ${Y(P+1)}Q${Y(G-$*.3)} ${Y(P-Z*.7)} ${Y(G+$*.15)} ${Y(P-Z)}Q${Y(G+$*.5)} ${Y(P-Z*.5)} ${Y(G+$)} ${Y(P+1)}Z`,_e.cream,{stroke:C*.7})}const I=w+Dn(x,mi.fill,{inner:ge(Ft(s.pts([[.7,.186],[.8,.186],[.95,.19],[.95,.23],[.7,.23]]))+"Z",mi.lip),over:Xt(Ft(s.pts([[.72,.2],[.8,.2],[.88,.197]])),C*.6,.5)}),O=On([Yn(x)],.016*i);return[bn(r.keys.body,_,p,[0,0]),bn(r.keys.tail,E,On([Yn(g)],.008*i),r.tail),bn(r.keys.fluke,S,On([Yn(v)],.006*i),r.fluke),bn(r.keys.fin,L,On([T],.006*i),r.fin),bn(r.keys.jaw,I,O,r.jaw),bn(r.keys.lid,pc(f[0],f[1],t.eyeR*i,mi.lid),On([[f]],t.eyeR*i*1.6+2),r.eye)]}function M4(n){const e="bowhead",t=xa[e],i=To(e,n),s=new hc(i,(t.back[0]+t.back[1])/2),r=cc(e,n),o=new an(5500+n),a=[[.99,.262],[.968,.215],[.935,.168],[.89,.132],[.835,.113],[.785,.112],[.75,.127],[.725,.155],[.708,.19]],c=s.nodes([[.12,.05],[.17,.026],[.205,.008],[.23,0,"sg"],[.69,0,"g"],[.735,.009],[.79,.032],[.845,.07],[.9,.12],[.945,.175],[.975,.225],[.991,.258],[.978,.27],[.948,.234],[.912,.197],[.868,.169],[.82,.158],[.775,.16],[.742,.18],[.72,.212],[.69,.265],[.655,.315],[.6,.328],[.5,.316],[.4,.292],[.31,.252],[.23,.207],[.17,.17],[.12,.14,"s"]]);let l="";for(let G=0;G<=22;G++){const $=.985-G/22*.265,Z=ha(a,$);l+=`M${Y(s.x($))} ${Y(s.y(Z))}l${Y(-.006*i)} ${Y(.045*i)}`}const h=`${Ft(s.pts(a))}L${Y(s.x(.72))} ${Y(s.y(.26))}L${Y(s.x(1))} ${Y(s.y(.3))}Z`;let u=ge(h,qn.baleen)+k(l,qn.baleenLine,C*.7,.8);for(let G=0;G<4;G++){const P=o.range(.3,.6),$=o.range(.06,.2);u+=k(Ft([s.p(P,$),s.p(P-.03,$+o.range(-.01,.012)),s.p(P-.055,$+o.range(-.006,.02))]),qn.pale,C*.9,.8)}const f=s.p(...t.eye),d=Xt(Ft(s.pts(a)),C,.9)+Xt(`M${Y(s.x(.69))} ${Y(s.y(.007))}q${Y(.009*i)} ${Y(-.004*i)} ${Y(.018*i)} ${Y(.002*i)}M${Y(s.x(.694))} ${Y(s.y(.013))}q${Y(.009*i)} ${Y(-.004*i)} ${Y(.018*i)} ${Y(.002*i)}`,C*.9,.9)+Xt(Ft(s.pts([[.64,.012],[.625,.04],[.628,.075]])),C*.8,.5)+Xt(Ft(s.pts([[.47,.03],[.4,.04],[.32,.045]])),C*.7,.35)+dc(f[0],f[1],t.eyeR*i,qn.lid),m=ji(Cr(s.p(.615,.28),.95,.08*i,.036*i,[.5,.62,.62,.5,.28,0],[.5,.46,.4,.3,.16,0],.03));let _=Dn(m,qn.deep);_+=Dn(c,qn.fill,{inner:u,over:d,runs:[[0,c.length-1]]});const p=On([Yn(c),Yn(m)],.012*i),g=s.nodes([[.155,.032],[.12,.05],[.08,.065],[.04,.074],[0,.08,"s"],[0,.12],[.04,.124],[.08,.13],[.12,.14],[.155,.158,"s"]]),b=Eo(s.nodes([[.078,.05,"c"],[.064,.1],[.076,.15,"c"],[.018,.15,"c"],[.03,.105],[.016,.075],[.026,.05,"c"]])),E=ef(s.x(.1),s.y(.062),.035*i+3,-2.2,_e.leaf)+ef(s.x(.1),s.y(.062),.03*i+3,-1.25,_e.mint)+Dn(g,qn.fill,{inner:ge(b,qn.band)+Xt(Ft(s.pts([[.078,.05],[.064,.1],[.076,.15]])),C*.6,.5),runs:[[0,4],[5,9]]}),v=On([Yn(g),[s.p(.1,.062-.05)]],.012*i+4),S=s.nodes([[.012,.08],[-.015,.078],[-.05,.06],[-.085,.032],[-.115,.004],[-.137,-.014,"c"],[-.121,.022],[-.108,.062],[-.1,.1,"c"],[-.108,.138],[-.121,.178],[-.137,.214,"c"],[-.115,.196],[-.085,.168],[-.05,.14],[-.015,.122],[.012,.12]]),T=Dn(S,qn.fill,{inner:ge(`${Ft(s.pts([[-.137,-.014],[-.121,.022],[-.108,.062],[-.1,.1],[-.108,.138],[-.121,.178],[-.137,.214]]))}L${Y(s.x(-.16))} ${Y(s.y(.2))}L${Y(s.x(-.16))} ${Y(s.y(0))}Z`,qn.band,.9),over:Xt(Ft(s.pts([[0,.1],[-.05,.1],[-.095,.1]])),C*.8,.5),runs:[[0,16]]}),L=Cr(s.p(...t.fin),.72,.1*i,.042*i,[.46,.6,.66,.62,.48,.26,0],[.46,.44,.44,.4,.32,.18,0],.04),x=Dn(ji(L),qn.fill,{over:k(Ft(L.slice(2,6)),qn.pale,C,.8)}),w=s.nodes([[.708,.19],[.725,.155],[.75,.127],[.785,.112],[.835,.113],[.89,.132],[.935,.168],[.968,.215],[.99,.26],[.997,.283],[.986,.306],[.957,.325],[.9,.337],[.82,.34],[.72,.337],[.665,.33],[.648,.3],[.655,.26],[.672,.225],[.69,.203]]),I=`${Ft(s.pts([[.84,.36],[.85,.3],[.875,.255],[.91,.225],[.945,.2],[.985,.19]]))}L${Y(s.x(1.03))} ${Y(s.y(.19))}L${Y(s.x(1.03))} ${Y(s.y(.36))}Z`;let O="";for(let G=0;G<16;G++){const P=o.range(.86,.985),$=o.range(Math.max(.2,ha([[.86,.3],[.9,.24],[.95,.21],[.99,.265]],P)+.012),.33),Z=o.range(.0025,.0055)*i+.3;O+=ge(xe(s.x(P),s.y($),Z,Z*.8),qn.spot,.85)}const U=Dn(w,qn.fill,{inner:ge(I,qn.chin)+O+Xt(Ft(s.pts([[.84,.36],[.85,.3],[.875,.255],[.91,.225],[.945,.2],[.985,.19]])),C*.7,.55),over:Xt(Ft(s.pts([[.69,.3],[.72,.318],[.78,.326]])),C*.7,.45)});return[bn(r.keys.body,_,p,[0,0]),bn(r.keys.tail,E,v,r.tail),bn(r.keys.fluke,T,On([Yn(S)],.006*i),r.fluke),bn(r.keys.fin,x,On([L],.006*i),r.fin),bn(r.keys.jaw,U,On([Yn(w)],.008*i),r.jaw),bn(r.keys.lid,pc(f[0],f[1],t.eyeR*i,qn.lid),On([[f]],t.eyeR*i*1.6+2),r.eye)]}const u0={blue:96,sperm:58,bowhead:64},Ka="#e9f5f3";function Ml(n,e,t){const i=[],s=[];for(let h=0;h<n.length;h++){const u=n[Math.max(0,h-1)],f=n[Math.min(n.length-1,h+1)],d=Math.hypot(f[0]-u[0],f[1]-u[1])||1,m=-(f[1]-u[1])/d,_=(f[0]-u[0])/d,p=n[h],g=h>0?1+t.range(-.12,.12):1;i.push([p[0]+m*e[h]*g,p[1]+_*e[h]*g]),s.push([p[0]-m*e[h]*g,p[1]-_*e[h]*g])}const r=n[n.length-1],o=n[n.length-2],a=Math.hypot(r[0]-o[0],r[1]-o[1])||1,c=[r[0]+(r[0]-o[0])/a*e[e.length-1]*.8,r[1]+(r[1]-o[1])/a*e[e.length-1]*.8],l=[...i,c,...s.reverse()];return{d:Eo(ji(l)),pts:l}}function v4(n){const e=new an(4400+n.length),t=u0[n];let i="";const s=[],r=(o,a,c,l)=>{for(let h=0;h<l;h++){const u=e.range(-Math.PI,0),f=c*e.range(.9,1.35),d=o+Math.cos(u)*f,m=a+Math.sin(u)*f*.8;i+=h0(d,m,e.range(1.1,2),Ka,C*.6),s.push([[d,m]])}};if(n==="blue"){const o=Ml([[0,0],[.5,-t*.3],[1,-t*.58],[0,-t*.8],[-1,-t*.93]],[2.2,5,8,12,13],e);i+=Q(o.d,Ka,{stroke:C,over:Xt(Ft([[0,-t*.2],[.5,-t*.45],[0,-t*.7]]),C*.6,.35)}),s.push(o.pts),r(0,-t*.86,14,6)}else if(n==="sperm"){const o=Ml([[0,0],[t*.18,-t*.3],[t*.36,-t*.58],[t*.5,-t*.8]],[2,6,10,13],e);i+=Q(o.d,Ka,{stroke:C}),s.push(o.pts),r(t*.5,-t*.84,13,6)}else for(const o of[-1,1]){const a=Ml([[o*1.5,0],[o*t*.12,-t*.32],[o*t*.24,-t*.62],[o*t*.32,-t*.84]],[1.8,4.5,7.5,9],e);i+=Q(a.d,Ka,{stroke:C}),s.push(a.pts),r(o*t*.32,-t*.9,9,4)}return{...bn(`whale.spout.${n}`,i,On(s,3),[0,0],!1),scale:2}}const x4=[_e.aqua,_e.blush,_e.lavender,_e.butter],y4=[_e.aqua,_e.periwinkle,_e.mint];function S4(){const n=[];return x4.forEach((e,t)=>{const i=Q(xe(0,0,5,5),e,{stroke:C,over:Xt("M-2.6 -1.2Q-2.2 -2.8 -0.6 -3.1",C*.8,.8)});n.push({...bn(`whale.bubble.${t}`,i,{x0:-5,y0:-5,x1:5,y1:5},[0,0],!1),scale:2})}),y4.forEach((e,t)=>{const i=Q("M0 -6.5Q1.2 -3 3.4 0.6A3.5 3.5 0 1 1 -3.4 0.6Q-1.2 -3 0 -6.5Z",e,{stroke:C});n.push({...bn(`whale.drop.${t}`,i,{x0:-4,y0:-7,x1:4,y1:5},[0,0],!1),scale:2})}),n}let vl=null;function b4(){if(vl)return vl;const n=[];for(const e of _l.blue)n.push(...g4(e));for(const e of _l.sperm)n.push(..._4(e));for(const e of _l.bowhead)n.push(...M4(e));for(const e of u4)n.push(v4(e));return n.push(...S4()),n.push({...bn("whale.label",m4(0,0,23,14,-.06),{x0:-13,y0:-9,x1:13,y1:9},[0,0]),scale:2.5}),vl=n,n}let hr=null;function d0(){if(hr)return hr;const n=t=>t.map(i=>({...i,body:R2(i.body)}));hr=[...n(Gg()),...n(a3()),...n(m3()),...h_(),...f4()],hr.push(...b4());const e=new Set;for(const t of hr){if(e.has(t.key))throw new Error(`Duplicate art key ${t.key}`);e.add(t.key)}return hr}function T4(){return[X2,rg,Sg,Fg,Og,Bg,c3,h3,g3]}const po={id:"r01",width:2200,theme:"nursery",checkpoints:[{id:"r01_start",x:290,y:660,facing:1,silent:!0},{id:"r01_door",x:1600,y:660}],solids:[{x:0,y:660,w:1720,h:120,style:"floor"},{x:1720,y:660,w:480,h:120,style:"soil"},{x:0,y:0,w:160,h:660,style:"soil"},{x:160,y:0,w:1540,h:130,style:"soil"},{x:1700,y:130,w:70,h:300,style:"root"},{x:1770,y:0,w:430,h:440,style:"soil"},{x:322,y:590,w:216,h:20,style:"bed",oneWay:!0,hidden:!0},{x:742,y:604,w:116,h:24,style:"wood",oneWay:!0,hidden:!0},{x:772,y:546,w:58,h:24,style:"wood",oneWay:!0,hidden:!0},{x:1368,y:580,w:146,h:24,style:"wood",oneWay:!0,hidden:!0}],props:[{key:"prop.fourteen",x:430,y:330,depth:-50,oy:.5},{key:"prop.bed",x:430,y:662,depth:-20},{key:"prop.lamp",x:900,y:128,oy:0,depth:-30},{key:"prop.blocks",x:800,y:662,depth:-20},{key:"prop.toywhale",x:620,y:662,depth:5},{key:"prop.marks",x:1090,y:500,depth:-50,oy:.5},{key:"prop.window",x:1441,y:400,depth:-50,oy:.5},{key:"prop.chest",x:1441,y:662,depth:-20},{key:"prop.toyhorse",x:1250,y:662,depth:-20,scale:.9},{key:"prop.rootdoor.open",x:1735,y:662,depth:12},{key:"prop.fossil",x:1980,y:500,depth:-40,scale:.8,oy:.5}]},E4=256;let xl=null;function w4(){if(xl)return xl;const n=E4,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");let i=99537381;const s=()=>{i=i+1831565813>>>0;let u=i;return u=Math.imul(u^u>>>15,u|1),u^=u+Math.imul(u^u>>>7,u|61),((u^u>>>14)>>>0)/4294967296},r=(u,f)=>{const d=u/n*Math.PI*2,m=f/n*Math.PI*2;return .55+.25*Math.sin(2*d+m+1.3)+.2*Math.sin(3*m-d+.4)*Math.cos(d+2*m)},o="255,253,247",a="52,44,58",c=new Map,l=(u,f,d,m,_,p,g)=>{const b=`${u}|${f}|${d}`;let E=c.get(b);E||c.set(b,E=new Path2D);for(const v of[-n,0,n])for(const S of[-n,0,n]){const T=Math.min(m,p)+v,L=Math.max(m,p)+v,x=Math.min(_,g)+S,w=Math.max(_,g)+S;L<-2||T>n+2||w<-2||x>n+2||(E.moveTo(m+v,_+S),E.lineTo(p+v,g+S))}},h=2600;for(let u=0;u<h;u++){const f=s()*n,d=s()*n,m=r(f,d);if(s()>m)continue;const _=s(),p=_<.72?-.62+(s()-.5)*.35:_<.92?-1.25+(s()-.5)*.3:.55+(s()-.5)*.4,g=3+s()*9,b=Math.cos(p)*g*.5,E=Math.sin(p)*g*.5,v=s()<.62,S=v?[.06,.1,.15][Math.floor(s()*3)]:[.04,.065,.1][Math.floor(s()*3)],T=s()<.7?1:1.6;l(v?o:a,S,T,f-b,d-E,f+b,d+E)}t.lineCap="round";for(const[u,f]of c){const[d,m,_]=u.split("|");t.strokeStyle=`rgba(${d},${m})`,t.lineWidth=Number(_),t.stroke(f)}return xl=e,e}function wo(n,e,t,i,s,r={}){const o=A4(n,r.scale??1);o&&(n.save(),n.globalCompositeOperation="source-atop",n.globalAlpha=r.strength??1,n.fillStyle=o,n.fillRect(e,t,i,s),n.restore())}function A4(n,e){const t=n.createPattern(w4(),"repeat");return t&&e!==1&&typeof DOMMatrix<"u"&&t.setTransform(new DOMMatrix().scale(e)),t}function R4(n,e){return`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(n.w*e)}" height="${Math.ceil(n.h*e)}" viewBox="0 0 ${n.w} ${n.h}">${n.body}</svg>`}function tf(n){return new Promise((e,t)=>{const i=new Image;i.onload=()=>e(i),i.onerror=()=>t(new Error("SVG rasterization failed")),i.src=n})}let nf=!0;function C4(n){const e=()=>tf("data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n));if(!nf)return e();const t=URL.createObjectURL(new Blob([n],{type:"image/svg+xml;charset=utf-8"}));return tf(t).catch(()=>(nf=!1,e())).finally(()=>URL.revokeObjectURL(t))}function L4(n){return n.grain??!n.additive}let Ao=1;function P4(n){Ao=Math.max(1,n)}let Mr=null;function vr(n){Mr||(Mr=new Map(d0().map(t=>[t.key,t])));const e=Mr.get(n);if(!e)throw new Error(`Missing art: ${n}`);return e}function D4(n){return Mr||(Mr=new Map(d0().map(e=>[e.key,e]))),Mr.has(n)}function ns(n,e){const t=document.createElement("canvas");return t.width=Math.max(1,Math.ceil(n)),t.height=Math.max(1,Math.ceil(e)),[t,t.getContext("2d")]}async function mo(n,e){const[t,i]=ns(n.w*e,n.h*e);if(!n.body)return t;try{i.drawImage(await C4(R4(n,e)),0,0,t.width,t.height)}catch{return t}return L4(n)&&wo(i,0,0,t.width,t.height,{scale:e}),t}function xr(n){const e=new _o(n);return e.premultiplyAlpha=!0,e.colorSpace="",e.minFilter=1008,e.magFilter=1006,e.anisotropy=Ao,e}function Ro(n,e=!1){const t=new _o(n);return t.colorSpace=ni,t.minFilter=1008,t.anisotropy=Ao,e&&(t.wrapS=t.wrapT=1e3),t}const I4=`
#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	// Premultiplied sRGB texels (see cardTexture): straighten, then decode.
	vec3 straightColor = sampledDiffuseColor.rgb / max( sampledDiffuseColor.a, 0.0001 );
	diffuseColor.rgb *= sRGBTransferEOTF( vec4( straightColor, 1.0 ) ).rgb;
	diffuseColor.a *= sampledDiffuseColor.a;
#endif
`;function yr(n,e={}){const t={map:n,color:e.color??16777215,alphaTest:.5,alphaToCoverage:!0},i=e.unlit?new va(t):new Oi(t);return i.shadowSide=2,i.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace("#include <map_fragment>",I4)},i.customProgramCacheKey=()=>"diorama-card",i}function Hl(n,e=128){const[t,i]=ns(e,e),s=i.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);for(const[o,a]of n)s.addColorStop(o,`rgba(255,255,255,${a})`);i.fillStyle=s,i.fillRect(0,0,e,e);const r=new _o(t);return r.colorSpace="",r}function k4(n=1.6){const[e,t]=ns(4,128),i=t.createImageData(4,128);for(let r=0;r<128;r++){const o=Math.round(255*Math.pow(1-r/127,n));for(let a=0;a<4;a++){const c=(r*4+a)*4;i.data[c]=255,i.data[c+1]=255,i.data[c+2]=255,i.data[c+3]=o}}t.putImageData(i,0,0);const s=new _o(e);return s.colorSpace="",s.flipY=!1,s}function U4(n){return new Promise((e,t)=>{new vu().load(n,i=>{i.colorSpace=ni,i.anisotropy=Ao,e(i)},void 0,()=>t(new Error(`Could not load ${n}`)))})}const Pn=.01,N4=660,dt=n=>n*Pn,sn=n=>(N4-n)*Pn,Cn={wall:-1.5,front:3.8},fs=(n,e)=>1-Math.exp(-n*e);class F4{constructor(e,t,i){Me(this,"camera");Me(this,"focus",new z);Me(this,"focusDist",8);Me(this,"mode","follow");Me(this,"dragYaw",0);Me(this,"dragPitch",0);Me(this,"dragging",!1);Me(this,"fixedPose",null);Me(this,"yaw",0);Me(this,"roll",0);Me(this,"dist",8.8);Me(this,"lookX",0);Me(this,"fx",0);Me(this,"fy",0);Me(this,"fz",0);Me(this,"t",0);Me(this,"fov",30);Me(this,"bounds");this.camera=new fi(this.fov,e,.1,80),this.bounds=[t,i]}snap(e){this.fx=dt(e.x),this.fy=sn(e.y)+.85,this.fz=e.z,this.lookX=0,this.yaw=0,this.roll=0,this.dist=8.8,this.update(e,0)}update(e,t){this.t+=t;let i;if(this.mode==="fixed"&&this.fixedPose?i=this.fixedPose:this.mode==="wide"?i=this.widePose():i=this.followPose(e,t),!this.dragging){const s=fs(1.6,t);this.dragYaw-=this.dragYaw*s,this.dragPitch-=this.dragPitch*s}this.apply(i,this.dragYaw,this.dragPitch),this.focusDist=this.camera.position.distanceTo(new z(dt(e.x),sn(e.y)+.7,e.z))}followPose(e,t){const i=Math.min(1,Math.abs(e.vx)/235);this.lookX+=(e.facing*.55*i-this.lookX)*fs(1.8,t);const[s,r]=this.bounds,o=Math.max(s,Math.min(r,dt(e.x)+this.lookX)),a=sn(e.y)+.85-(e.onGround?0:.35);this.fx+=(o-this.fx)*fs(3.2,t),this.fy+=(a-this.fy)*fs(e.onGround?2.6:1.2,t),this.fz+=(e.z*.6-this.fz)*fs(2.5,t);const c=e.vx/235;this.yaw+=(-.075*c-this.yaw)*fs(1.4,t),this.roll+=(.006*c-this.roll)*fs(1.6,t);const l=Math.min(1,Math.max(0,(e.stillT-.6)/2.2)),h=8.8+.55*i-1.15*l*l*(3-2*l);this.dist+=(h-this.dist)*fs(l>0?.9:1.8,t);const u=.012*Math.sin(this.t*.37)+.006*Math.sin(this.t*.83+1.3);return{target:new z(this.fx,this.fy,this.fz),dist:this.dist,yaw:.03+this.yaw+u,pitch:-.14+.008*Math.sin(this.t*.29),roll:this.roll,fov:this.fov}}widePose(){return{target:new z(dt(930),2.6,-.4),dist:19.5,yaw:0,pitch:-.12,roll:0,fov:34}}apply(e,t,i){const s=e.yaw+t,r=e.pitch+i;this.focus.copy(e.target);const o=this.camera;o.position.set(e.target.x+Math.sin(s)*Math.cos(r)*e.dist,e.target.y-Math.sin(r)*e.dist,e.target.z+Math.cos(s)*Math.cos(r)*e.dist),o.up.set(Math.sin(e.roll),Math.cos(e.roll),0),o.lookAt(e.target),o.fov!==e.fov&&(o.fov=e.fov,o.updateProjectionMatrix())}setAspect(e){this.camera.aspect=e,this.camera.updateProjectionMatrix()}}const O4=9404809;function mc(n,e,t,i){const s=new Ri(n*Pn,e*Pn);return s.translate((.5-t)*n*Pn,-(.5-i)*e*Pn,0),s}function ro(n){const e=new Ai,t=mc(n.w,n.h,n.ox,n.oy),i=new tn(t,yr(n.tex,{unlit:n.unlit}));if(i.castShadow=n.cast??n.thick>0,i.receiveShadow=!0,i.name="front",e.add(i),n.thick>0){const s=yr(n.tex,{color:n.edge??O4}),r=n.thick>.025?2:1;for(let o=1;o<=r;o++){const a=o/r,c=new tn(t,s);c.position.set(1.1*Pn*a,-1.4*Pn*a,-n.thick*a),c.receiveShadow=!0,e.add(c)}}return e}function Qa(n,e,t,i,s,r,o,a=[2.56,2.56]){const c=new Ss(t-n,i-e,r-s);c.translate((n+t)/2,(e+i)/2,(s+r)/2);const l=c.getAttribute("position"),h=c.getAttribute("normal"),u=c.getAttribute("uv");for(let d=0;d<l.count;d++){const m=l.getX(d),_=l.getY(d),p=l.getZ(d),[g,b]=a;Math.abs(h.getX(d))>.5?u.setXY(d,p/g,_/b):Math.abs(h.getY(d))>.5?u.setXY(d,m/g,p/b):u.setXY(d,m/g,_/b)}const f=new tn(c,o);return f.castShadow=!0,f.receiveShadow=!0,f}function Vl(n,e,t,i=.5){const s=new tn(new Ri(e,t),new va({map:n,color:3023672,transparent:!0,opacity:i,depthWrite:!1}));return s.rotation.x=-Math.PI/2,s.renderOrder=1,s}function sf(n,e,t,i){const s=new ru(new vf({map:n,color:e,transparent:!0,opacity:i,depthWrite:!1,blending:2}));return s.scale.set(t,t,1),s.renderOrder=2,s}function B4(n){const e=[],t=new Set,i=[...n.joints];let s=0;for(;i.length&&s++<1e3;){const r=i.shift();r.parent===null||t.has(r.parent)?(e.push(r),t.add(r.id)):i.push(r)}if(i.length)throw new Error(`Rig ${n.id}: unresolved joint parents`);return e}function $4(n,e,t,i=new Map){for(const s of n){const r=e[s.id]??0,o=t?.[s.id],a=s.x+(o?.x??0),c=s.y+(o?.y??0);let l=i.get(s.id);if(l||(l={joint:s,x:0,y:0,rot:0},i.set(s.id,l)),s.parent===null)l.x=a,l.y=c,l.rot=r;else{const h=i.get(s.parent),u=Math.cos(h.rot),f=Math.sin(h.rot);l.x=h.x+a*u-c*f,l.y=h.y+a*f+c*u,l.rot=h.rot+r}}return i}function G4(n,e){const t=e===1?"R":"L",i=s=>s.z+(s.side?s.side===t?100:-100:0);return n.filter(s=>s.part).sort((s,r)=>i(s)-i(r))}function z4(n,e){return n.side?(e===1?"R":"L")===n.side:!0}const sa={surprise:()=>({raise:-6.5,knit:-.2,asym:-1.5}),pain:n=>({raise:2.2,knit:-.62+.06*De(n*30),asym:1.2}),joy:n=>({raise:-4.5-1.5*Math.abs(De(n*9)),knit:-.3,asym:0}),anger:()=>({raise:2.5,knit:.8,asym:0}),talk:n=>({raise:-2.2*Math.abs(De(n*8.5)),knit:.14*De(n*3.7),asym:-1.2*Math.max(0,De(n*2.3))}),listen:n=>({raise:-2.6,knit:-.14,asym:-1.6*Math.max(0,De(n*.8))}),relief:()=>({raise:-3,knit:-.38,asym:0}),worry:n=>({raise:-1.5,knit:-.55+.05*De(n*6),asym:.8}),effort:n=>({raise:2,knit:.55+.05*De(n*20),asym:0}),shout:n=>({raise:2.4,knit:.8+.06*De(n*26),asym:0})};function H4(n,e,t,i){let s={raise:0,knit:0,asym:0};switch(n){case"idle":{const o=Math.max(0,De(e*.9)-.82)*22,a=Math.max(0,De(e*.37+1)-.9)*26;s={raise:-o,knit:.04*De(e*.5),asym:-a},i==="suit"&&(s={raise:1.4,knit:-.32,asym:0});const c=Wl(t.idleT??0,i);if(c){const l=c.env,h=c.kind==="look"?{raise:-4,knit:-.15,asym:-2}:c.kind==="stretch"?{raise:-2,knit:-.3,asym:0}:c.kind==="hum"?{raise:-3-1.2*Math.abs(De(e*3.4)),knit:-.25,asym:0}:{raise:-1,knit:.3,asym:-3.2};s={raise:s.raise+(h.raise-s.raise)*l,knit:s.knit+(h.knit-s.knit)*l,asym:s.asym+(h.asym-s.asym)*l}}break}case"dance":s={raise:-5-1.5*Math.abs(De(e*8)),knit:-.3,asym:0};break;case"conjure":s={raise:-5,knit:-.28,asym:-1};break;case"stomp":s=e<.26?{raise:1.5,knit:.55,asym:0}:{raise:2.8,knit:.75,asym:0};break;case"walk":s={raise:0,knit:i==="suit"?-.3:.1,asym:0};break;case"run":s={raise:.8,knit:.3,asym:0};break;case"push":s=sa.effort(e);break;case"crouch":case"takeoff":s={raise:1.4,knit:.42,asym:0};break;case"rise":s={raise:-5,knit:-.12,asym:-1.2};break;case"apex":s={raise:-6-1*Math.abs(De(e*7)),knit:-.28,asym:-1.8};break;case"fall":{const o=Math.min(1,Math.max(0,(t.vy??300)/700));s={raise:-3.5-3*o,knit:-.35*o,asym:-1.5*o};break}case"land":{const o=Math.min(1,t.k??e/.28),a=.4+.6*(t.impact??.5);s={raise:3*a*(1-o),knit:.6*a*(1-o),asym:0};break}case"interact":s={raise:-3,knit:-.08,asym:-2.6};break;case"reach":case"pull":s={raise:1,knit:.45,asym:0};break;case"song":s={raise:-2.4-1.4*De(e*3.2),knit:-.2,asym:1*De(e*1.6)};break;case"breath":s={raise:1.6,knit:.36+.05*De(e*5),asym:0};break;case"transform":s={raise:-5.5,knit:-.35+.18*De(e*18),asym:-1};break;case"hurt":s=sa.pain(e);break;case"collapse":s={raise:1.8,knit:-.55,asym:0};break;case"kneel":case"sit":s={raise:.6,knit:-.45,asym:0};break;case"shout":s=sa.anger(e);break;case"ride":s={raise:-3-1*De(e*7),knit:.12,asym:0};break;case"point":s={raise:.8,knit:.55,asym:0};break;case"look":s={raise:-3.5,knit:-.12,asym:-3};break;case"getup":{s=(t.k??0)>.7?sa.effort(e):{raise:-2,knit:-.15,asym:-1};break}case"sleep":{const o=t.k??0;s={raise:.8-5*o,knit:-.18-.2*o,asym:0};break}}i==="coward"&&(s={raise:s.raise-1.2,knit:s.knit-.32,asym:s.asym}),i==="mech"&&(s={raise:s.raise+.6,knit:s.knit+.18,asym:s.asym});const r=Math.max(0,Math.min(1,t.emoteK??0));if(t.emote&&r>0){const o=sa[t.emote](e);s={raise:s.raise+(o.raise-s.raise)*r,knit:s.knit+(o.knit-s.knit)*r,asym:s.asym+(o.asym-s.asym)*r}}return s}function V4(n,e,t){const i=t==="root"?.45:t==="mech"?.6:1,s=t==="root"?1.35:t==="mech"?.95:1.15;n.angles.browN=e.knit*s,n.offsets.browN={x:e.knit*1.4,y:(e.raise+e.asym*.6)*i}}const De=Math.sin,yl=Math.cos,W4=n=>1-(1-n)*(1-n),fa=(n,e,t)=>{const i=Math.min(1,Math.max(0,(t-n)/(e-n)));return i*i*(3-2*i)},rf=3.5,af=8;function Wl(n,e){if(n<rf||e==="suit")return null;const t=n-rf,i=Math.floor(t/af),s=e==="coward"?["look"]:e==="mech"?["look","stretch"]:["look","stretch","hum","scratch"],r=s[i%s.length],o=r==="hum"?3.4:r==="stretch"?2.6:2.8,a=t-i*af;if(a>o)return null;const c=a/o;return{kind:r,u:c,env:fa(0,.2,c)*(1-fa(.8,1,c))}}function of(n,e,t){for(const[i,s]of Object.entries(e)){const r=n.angles[i]??0;n.angles[i]=r+(s-r)*t}}function X4(n,e,t,i){const s=n.angles,r=e.env;switch(e.kind){case"look":{s.head=(s.head??0)-.3*r+.1*r*De(e.u*Math.PI*3),s.torso=(s.torso??0)-.05*r,n.offsets.eyeN={x:.5*r*De(e.u*Math.PI*3),y:-.8*r};break}case"stretch":{of(n,{...i==="coward"?{}:{armR:-2.9,foreR:-.12,armL:-2.75,foreL:-.2},torso:-.16,head:-.4,footR:.35,footL:.3},r),n.offsets.hips={x:0,y:(n.offsets.hips?.y??0)-3*r};break}case"hum":{const o=De(t*3.4);s.torso=(s.torso??0)+.07*o*r,s.head=(s.head??0)+.12*De(t*3.4+.6)*r,i!=="coward"&&(s.armR=(s.armR??0)+.18*o*r,s.armL=(s.armL??0)-.18*o*r),n.offsets.hips={x:0,y:(n.offsets.hips?.y??0)+1.4*Math.abs(o)*r};break}case"scratch":{of(n,{armR:-2.55,foreR:-2.3+.14*De(t*24),head:.16,torso:.04},r);break}}}function q4(n,e,t,i,s){const r={eye:"",ex:1,ey:1,mouth:"",ms:1};switch(n){case"idle":s&&s.env>.3&&(s.kind==="stretch"?(r.eye="shut",r.mouth="open",r.ms=1.3):s.kind==="hum"?(r.eye="happy",r.mouth="smile"):s.kind==="look"?(r.ex=1.12,r.ey=1.15):r.mouth="frown");break;case"run":r.mouth="open",r.ms=.8;break;case"push":case"pull":case"reach":r.ey=.55,r.mouth="grit";break;case"crouch":case"takeoff":r.ey=.7,r.mouth="grit";break;case"rise":r.ex=1.1,r.ey=1.15,r.mouth="open",r.ms=.85;break;case"apex":r.eye="happy",r.mouth="grin";break;case"fall":{const a=Math.min(1,Math.max(0,(t.vy??300)/700));r.ex=1+.25*a,r.ey=1+.35*a,r.mouth=a>.35?"open":"",r.ms=.8+.5*a;break}case"land":(t.impact??0)>.5&&(t.k??1)<.55?(r.eye="shut",r.mouth="grit"):r.ey=.8;break;case"interact":case"look":r.ex=1.1,r.ey=1.15,r.mouth="open",r.ms=.6;break;case"song":r.eye="happy",r.mouth="open",r.ms=.7+.3*Math.abs(De(e*5.5));break;case"breath":r.ey=.45;break;case"transform":r.ex=1.3,r.ey=1.4,r.mouth="open",r.ms=1.2;break;case"collapse":r.eye="shut",r.mouth="frown";break;case"kneel":case"sit":r.eye="sad",r.mouth="frown";break;case"shout":r.ey=.75,r.mouth="open",r.ms=1.55+.1*De(e*30);break;case"ride":r.mouth="grin";break;case"dance":case"conjure":r.eye="happy",r.mouth="grin";break;case"stomp":r.ey=.55,r.mouth="grit";break;case"torchUp":r.ey=1.1,r.mouth="open",r.ms=.6;break;case"sleep":{const a=t.k??0;r.eye=(t.blink??1)>.97?"shut":"",r.mouth="open",r.ms=a>.04?.55+1.15*a:.32+.07*De(e*1.35);break}}i==="suit"&&!r.eye&&(r.eye="sad",r.mouth||(r.mouth="frown")),i==="coward"&&(!r.eye&&r.ex===1&&(r.ex=1.08,r.ey=1.12),r.mouth||(r.mouth="frown",r.ms=1+.08*De(e*41)));const o=Math.max(0,Math.min(1,t.emoteK??0));if(t.emote&&o>.3)switch(t.emote){case"joy":r.eye="happy",r.mouth="grin";break;case"surprise":r.eye="",r.ex=1.25,r.ey=1.35,r.mouth="open",r.ms=1.1;break;case"pain":r.eye="shut",r.mouth="grit";break;case"anger":r.ey=.7,r.mouth="grit";break;case"talk":r.mouth=De(e*17)>-.2||De(e*6.3)>.7?"open":"",r.ms=.55+.45*Math.abs(De(e*9));break;case"listen":r.mouth="";break;case"relief":r.eye="happy",r.mouth="smile";break;case"worry":r.eye="sad",r.mouth="frown";break;case"effort":r.eye="",r.ey=.5,r.mouth="grit";break;case"shout":r.eye="",r.ey=.8,r.mouth="open",r.ms=1.55+.12*De(e*28);break}return r}function Y4(n,e,t){const s=e.eye===""||e.eye==="sad"?Math.min(1,Math.max(0,t.blink??0)):0;n.frames={...n.frames??{},eyeN:e.eye,mouth:e.mouth},n.scales={...n.scales??{},eyeN:{x:e.ex,y:Math.max(.08,e.ey*(1-.9*s))},mouth:{x:e.ms,y:e.ms}}}function Z4(){return{angles:{},offsets:{}}}function K4(n){return n.includes("human")?"human":n.includes("suit")?"suit":n.includes("coward")?"coward":n.includes("mech")?"mech":"root"}const p0={root:{stride:.66,knee:1.1,arm:.7,bob:4.4,lean:.13,kneeBase:.06,torsoBase:.02,headBase:0},human:{stride:.46,knee:.85,arm:.45,bob:2.6,lean:.07,kneeBase:.09,torsoBase:-.03,headBase:.05},coward:{stride:.38,knee:.8,arm:.1,bob:1.5,lean:.1,kneeBase:.55,torsoBase:.16,headBase:.18},mech:{stride:.5,knee:.9,arm:.3,bob:1.2,lean:.04,kneeBase:.12,torsoBase:0,headBase:0},suit:{stride:.3,knee:.6,arm:.12,bob:1.2,lean:.05,kneeBase:.1,torsoBase:.2,headBase:.28}};function Q4(n,e,t){const i=p0[e],s=n.angles;s.torso=i.torsoBase,s.head=i.headBase,s.legR=-i.kneeBase*.6,s.shinR=i.kneeBase,s.legL=-i.kneeBase*.6+.04,s.shinL=i.kneeBase,s.footR=-(s.legR+s.shinR),s.footL=-(s.legL+s.shinL),s.armR=-.08,s.foreR=-.18,s.armL=.1,s.foreL=-.12,n.offsets.hips={x:0,y:i.kneeBase*10},e==="coward"&&m0(n,t),e==="suit"&&(s.armR=.05,s.armL=.12,s.foreR=-.08+.035*De(t*31),s.foreL=-.06+.035*De(t*27+1))}function m0(n,e){const t=n.angles,i=.04*De(e*23)+.025*De(e*37);t.armR=-.95+i,t.foreR=-.95-i,t.armL=-.75+i,t.foreL=-1.15}function Sl(n,e,t,i={}){const s=K4(n),r=p0[s],o=Z4(),a=o.angles;switch(Q4(o,s,t),e){case"idle":{const l=De(t*2.1);o.offsets.torso={x:0,y:-.6-.6*l},a.head=(a.head??0)+.03*De(t*1.3),a.armR=(a.armR??0)+.04*l,a.armL=(a.armL??0)+.04*l,s==="root"&&(a.head=(a.head??0)+.02*De(t*.7)),s==="suit"&&(o.offsets.torso={x:0,y:-.3*l});const h=Wl(i.idleT??0,s);h&&X4(o,h,t,s);break}case"dance":{const l=t*8;a.legR=-.22+.16*De(l),a.shinR=.35+.25*Math.max(0,De(l)),a.legL=.05-.16*De(l),a.shinL=.35+.25*Math.max(0,-De(l)),a.footR=-(a.legR+a.shinR),a.footL=-(a.legL+a.shinL),o.offsets.hips={x:0,y:r.kneeBase*10+3.5*Math.abs(De(l))},a.torso=r.torsoBase+.09*De(l/2),a.head=r.headBase-.18+.14*De(l/2+.7),s!=="coward"&&(a.armR=-2.55+.4*De(l),a.foreR=-.35+.25*De(l+1),a.armL=-2.35-.4*De(l+.8),a.foreL=-.3+.25*De(l+2));break}case"walk":case"run":case"push":{const l=i.phase??t*8,h=Math.min(1,Math.max(.25,i.speed??1)),u=r.stride*(.55+.45*h),f=-u*De(l),d=u*De(l),m=r.kneeBase+r.knee*Math.pow(Math.max(0,yl(l)),1.4)*h,_=r.kneeBase+r.knee*Math.pow(Math.max(0,-yl(l)),1.4)*h;a.legR=f-r.kneeBase*.5,a.legL=d-r.kneeBase*.5,a.shinR=m,a.shinL=_,a.footR=-(a.legR+a.shinR)*.85+(De(l)<0?-.25*-De(l):0),a.footL=-(a.legL+a.shinL)*.85+(De(l)>0?-.25*De(l):0);const p=r.bob*(.5+.5*h);o.offsets.hips={x:0,y:r.kneeBase*10+p*(.5-.5*yl(2*l))},a.torso=r.torsoBase+r.lean*h,a.head=r.headBase-a.torso*.5+.03*De(2*l),s!=="coward"&&(a.armR=r.arm*h*De(l-.35)+.05,a.armL=-r.arm*h*De(l-.35)+.1,a.foreR=-.25-.2*h*Math.max(0,-De(l-.35)),a.foreL=-.25-.2*h*Math.max(0,De(l-.35))),s==="human"&&(o.offsets.torso={x:0,y:1.1*Math.max(0,De(2*l+.6))}),s==="mech"&&(a.armR=.18*De(Math.round(l*2)/2),a.armL=-.18*De(Math.round(l*2)/2)),s==="suit"&&(a.foreR=-.08+.035*De(t*31),a.foreL=-.06+.035*De(t*27+1)),e==="push"&&(a.torso=.5,a.head=-.25,a.armR=-1.35,a.foreR=-.25,a.armL=-1.25,a.foreL=-.3);break}case"crouch":{a.legR=-.8,a.shinR=1.45,a.legL=-.62,a.shinL=1.35,a.footR=-(a.legR+a.shinR),a.footL=-(a.legL+a.shinL),o.offsets.hips={x:0,y:14+r.kneeBase*10},a.torso=r.torsoBase+.4,a.head=r.headBase-.22,s!=="coward"&&(a.armR=.9,a.foreR=-.25,a.armL=.75,a.foreL=-.2);break}case"takeoff":{a.legR=.1,a.shinR=.12,a.legL=.32,a.shinL=.3,a.footR=-(a.legR+a.shinR)+.75,a.footL=-(a.legL+a.shinL)+.85,o.offsets.hips={x:0,y:-2},a.torso=r.torsoBase-.02,a.head=r.headBase-.25,s!=="coward"&&(a.armR=-2.4,a.foreR=-.25,a.armL=-2.1,a.foreL=-.35);break}case"rise":{const h=1-Math.min(1,Math.max(0,-(i.vy??-300)/Math.max(1,i.jv??600)));a.legR=-.5-.65*h,a.shinR=.55+1*h,a.legL=.2-.5*h,a.shinL=.5+.95*h,a.footR=-(a.legR+a.shinR)+.55,a.footL=-(a.legL+a.shinL)+.6,a.torso=r.torsoBase+.03,a.head=r.headBase-.2+.06*h,s!=="coward"&&(a.armR=-2.3+.55*h,a.foreR=-.3-.25*h,a.armL=-2+.9*h,a.foreL=-.3);break}case"apex":{const l=De(t*7);a.legR=-1.2,a.shinR=1.7,a.legL=-.78,a.shinL=1.8,a.footR=-(a.legR+a.shinR)+.45,a.footL=-(a.legL+a.shinL)+.5,o.offsets.hips={x:0,y:-3},a.torso=r.torsoBase-.06,a.head=r.headBase-.3,s!=="coward"&&(a.armR=-1.95-.1*l,a.foreR=-.45,a.armL=1.9+.1*l,a.foreL=.45),s==="mech"&&(a.armR=-1.5,a.armL=1.2,a.foreR=-.2,a.foreL=.2);break}case"fall":{const l=Math.min(1,Math.max(0,(i.vy??300)/700)),h=l*De(t*15);a.legR=-.3-.15*l,a.shinR=.5-.2*l,a.legL=.12,a.shinL=.45-.15*l,a.footR=-(a.legR+a.shinR)*.6-.1,a.footL=-(a.legL+a.shinL)*.6+.15,a.torso=r.torsoBase-.03-.05*l,a.head=r.headBase-.18-.12*l,s!=="coward"&&(a.armR=-1.7-.6*l+.22*h,a.foreR=-.35-.2*l,a.armL=-2-.5*l-.22*h,a.foreL=-.3),s==="mech"&&(a.armR=-1.3,a.armL=-1.1);break}case"land":{const l=(.35+.65*Math.min(1,i.impact??.5))*(1-W4(Math.min(1,i.k??0)));a.legR=-.72*l,a.shinR=1.35*l+r.kneeBase,a.legL=-.6*l,a.shinL=1.3*l+r.kneeBase,a.footR=-(a.legR+a.shinR),a.footL=-(a.legL+a.shinL),o.offsets.hips={x:0,y:15*l+r.kneeBase*10},a.torso=r.torsoBase+.45*l,a.head=r.headBase-.28*l,s!=="coward"&&(a.armR=-.95*l,a.foreR=-.2-.5*l,a.armL=-.65*l,a.foreL=-.2-.4*l);break}case"conjure":{const l=Math.min(1,t/.25);a.armR=-.3-1.7*l,a.foreR=-.5*l,a.armL=-.2-1.4*l,a.foreL=-.45*l,a.torso=r.torsoBase-.12*l,a.head=r.headBase-.22*l,a.legR=-.12,a.shinR=.18+r.kneeBase,a.legL=.1,a.shinL=.12+r.kneeBase,a.footR=-(a.legR+a.shinR),a.footL=-(a.legL+a.shinL);break}case"stomp":{if(t<.26){const l=Math.min(1,t/.2);a.legR=-1.3*l,a.shinR=1.45*l+r.kneeBase,a.footR=-(a.legR+a.shinR)+.2,a.legL=.05,a.shinL=.15+r.kneeBase,a.footL=-(a.legL+a.shinL),a.torso=r.torsoBase-.1*l,a.head=r.headBase-.2*l,a.armR=-2.3*l,a.foreR=-.4*l,a.armL=-2*l,a.foreL=-.3*l}else{const l=Math.min(1,(t-.26)/.08);a.legR=-.35*(1-l)-.05,a.shinR=.35*(1-l)+.45,a.footR=-(a.legR+a.shinR),a.legL=-.2,a.shinL=.55,a.footL=-(a.legL+a.shinL),o.offsets.hips={x:0,y:9+r.kneeBase*10},a.torso=r.torsoBase+.32,a.head=r.headBase-.15,a.armR=-.6,a.foreR=-.9,a.armL=-.35,a.foreL=-.8}break}case"interact":{a.armR=-1.25,a.foreR=-.35,a.torso=r.torsoBase+.12,a.head=r.headBase+.12;break}case"reach":{a.armR=-1.62,a.foreR=.05,a.armL=.55,a.foreL=-.2,a.torso=.22,a.head=-.12,a.legR=-.35,a.shinR=.35,a.legL=.35,a.shinL=.2;break}case"pull":{a.armR=-2.3,a.foreR=-.2,a.armL=-2,a.foreL=-.3,a.legR=-.5,a.shinR=.9,a.legL=-.1,a.shinL=.8,a.torso=.18;break}case"song":{const l=De(t*5.5);a.torso=-.12-.03*l,a.head=-.35,a.armR=-.95-.12*l,a.foreR=-.4,a.armL=.8+.12*l,a.foreL=-.4,o.offsets.torso={x:0,y:-1.2*(.5+.5*l)};break}case"breath":{a.torso=r.torsoBase-.06,a.head=r.headBase+.12,a.armR=.28,a.foreR=-.55,a.armL=.34,a.foreL=-.55,o.offsets.torso={x:0,y:-2},o.offsets.armR={x:0,y:-1.5},o.offsets.armL={x:0,y:-1.5},s==="coward"&&m0(o,t);break}case"transform":{const l=De(t*22);a.torso=-.2+.05*l,a.head=-.45,a.armR=-2.1+.15*l,a.foreR=-.3,a.armL=2.1-.15*l,a.foreL=.3,a.legR=-.25,a.legL=.25,a.shinR=.2,a.shinL=.2;break}case"hurt":{a.torso=-.32,a.head=-.35,a.armR=-1.5,a.foreR=-.5,a.armL=-1.9,a.foreL=-.4,a.legR=-.35,a.shinR=.45,a.legL=.25,a.shinL=.2;break}case"collapse":{const l=Math.min(1,i.k??1);a.torso=1.15*l,a.head=.5*l,a.legR=-1.25*l,a.shinR=2*l,a.legL=-1.05*l,a.shinL=2.1*l,a.footR=-(a.legR+a.shinR),a.footL=-(a.legL+a.shinL),a.armR=-.3*l,a.armL=-.5*l,o.offsets.hips={x:0,y:26*l};break}case"sleep":{const l=.5+.5*De(t*1.35);a.legR=.04,a.shinR=.1,a.footR=-.35,a.legL=-.05,a.shinL=.14,a.footL=-.28,o.offsets.hips={x:0,y:0},a.torso=-.04,o.offsets.torso={x:1.1*l,y:0},a.head=-.2+.03*l+.18*(i.k??0),a.armR=-.12-.04*l,a.foreR=-2.25,a.armL=.16,a.foreL=-.3;break}case"getup":{const l=i.k??0,h=i.lie??0,u=fa(0,.45,l),f=fa(.45,.7,l),d=fa(.7,1,l),m=-(1-h)*Math.PI*.5,_=(m+(-1.45-m)*f)*(1-d),p=(.05+1.5*f)*(1-d)+.06*d;a.legR=_,a.legL=_+.08*(1-d),a.shinR=p,a.shinL=p+.05*f*(1-d),a.footR=-.3*(1-d)-(a.legR+a.shinR)*d,a.footL=-.25*(1-d)-(a.legL+a.shinL)*d;const g=Math.sin(Math.PI*d);a.torso=-.05+.2*u+.35*g-.15*d,a.head=-.1+.08*u-.12*g,a.armR=.45*(1-f)*(1-d)-.5*f*(1-d)-.55*g,a.foreR=-.2-.9*f*(1-d)-.3*g,a.armL=.35*(1-f)*(1-d)-.4*f*(1-d)-.45*g,a.foreL=-.2-.8*f*(1-d)-.3*g;break}case"kneel":case"sit":{a.legR=-1.45,a.shinR=1.55,a.footR=-.1,a.legL=.1,a.shinL=1.65,a.footL=-1.75,o.offsets.hips={x:0,y:17},a.torso=.05,a.head=.25,a.armR=-.3,a.foreR=-.9,a.armL=-.2,a.foreL=-.8;break}case"shout":{const l=De(t*30)*.03;a.torso=-.28+l,a.head=-.42,a.armR=.65,a.foreR=.1,a.armL=.8,a.foreL=.15,a.legR=-.3,a.shinR=.2,a.legL=.35,a.shinL=.1;break}case"ride":{a.legR=-1.25,a.shinR=1.45,a.footR=-.3,a.legL=-1.2,a.shinL=1.4,a.footL=-.3,a.torso=.18+.04*Math.sin(t*9),a.head=-.18,a.armR=-.95,a.foreR=-.55,a.armL=-.85,a.foreL=-.6,o.offsets.hips={x:0,y:0};break}case"point":{a.armR=-1.9,a.foreR=-.05,a.torso=-.05,a.head=-.25;break}case"look":{a.head=-.35,a.torso=-.06;break}case"torchUp":{a.armR=-2.7,a.foreR=-.2,a.armL=-2.55,a.foreL=-.3,a.torso=-.1,a.head=-.4;break}}if(s==="coward"&&(a.torch=-((a.torso??0)+(a.armR??0)+(a.foreR??0))+(e==="torchUp"?0:.12),a.flame=.05*Math.sin(t*17)),i.look){a.head=(a.head??0)+i.look;const l=o.offsets.eyeN??{x:0,y:0};o.offsets.eyeN={x:l.x,y:l.y+i.look*2.4}}const c=e==="idle"?Wl(i.idleT??0,s):null;return Y4(o,q4(e,t,i,s,c),i),V4(o,H4(e,t,i,s),s),o}const J4={armR:11,armL:10,foreR:12,foreL:11,head:14,browN:30},j4=new Set(["eyeN","browN","mouth"]),bl=.007,e5=4,lf=[.8,1.1];class gc{constructor(e){Me(this,"root",new Ai);Me(this,"rig");Me(this,"ordered");Me(this,"nodes",new Map);Me(this,"solved",new Map);Me(this,"angles",{});Me(this,"offsets",{});Me(this,"facing",1);Me(this,"anim","idle");Me(this,"animT",0);Me(this,"params",{});Me(this,"squashX",1);Me(this,"squashY",1);Me(this,"extraRot",0);Me(this,"stiffness",1);Me(this,"orderFacing",0);this.rig=e,this.ordered=B4(e)}static async create(e){const t=new gc(e);return await t.build(),t.snap(),t}async build(){const e=new Map,t=async s=>{if(!D4(s))return null;const r=vr(s);if(!r.body)return null;let o=e.get(s);return o||(o=xr(await mo(r,e5)),e.set(s,o)),o},i=new Ai;this.root.add(i);for(const s of this.ordered){const r=new Ai;r.name=s.id,(s.parent?this.nodes.get(s.parent).group:i).add(r);const a={joint:s,group:r,mesh:null,back:null,near:null,far:null,shapes:new Map,shape:""};if(this.nodes.set(s.id,a),!s.part)continue;const c=await t(s.part);if(!c)continue;a.shapes.set("",c);for(const f of["happy","sad","shut","smile","open","grin","grit","frown"]){const d=await t(`${s.part}.${f}`);d&&a.shapes.set(f,d)}const l=vr(s.part),h=mc(l.w,l.h,l.px/l.w,l.py/l.h),u=j4.has(s.id);a.near=yr(c,{unlit:u}),a.far=s.side?yr(c,{color:13814994}):a.near,a.mesh=new tn(h,a.near),a.mesh.castShadow=!u,a.mesh.receiveShadow=!u,r.add(a.mesh),u||(a.back=new tn(h,yr(c,{color:8812159})),a.back.receiveShadow=!0,r.add(a.back))}}snap(){const e=Sl(this.rig.id,this.anim,this.animT,this.params);this.angles={...e.angles},this.offsets={};for(const t of Object.keys(e.offsets))this.offsets[t]={...e.offsets[t]};this.layout(e)}snapTo(e,t={}){const i=Sl(this.rig.id,e,0,t);for(const s of this.ordered)this.angles[s.id]=i.angles[s.id]??0;for(const s of Object.keys(i.offsets))this.offsets[s]={...i.offsets[s]}}play(e,t){e!==this.anim&&(this.anim=e,this.animT=0),this.params=t}update(e){this.animT+=e;const t=Sl(this.rig.id,this.anim,this.animT,this.params);for(const i of this.ordered){const s=t.angles[i.id]??0,r=this.angles[i.id]??0,o=(J4[i.id]??16)*this.stiffness;this.angles[i.id]=r+(s-r)*(1-Math.exp(-o*e));const a=t.offsets[i.id],c=this.offsets[i.id];if(a||c){const l=c??{x:0,y:0},h=1-Math.exp(-18*this.stiffness*e);l.x+=((a?.x??0)-l.x)*h,l.y+=((a?.y??0)-l.y)*h,this.offsets[i.id]=l}}this.layout(t)}applyOrder(){if(this.orderFacing===this.facing)return;this.orderFacing=this.facing,G4(this.ordered,this.facing).forEach((t,i)=>{const s=this.nodes.get(t.id);if(!s?.mesh)return;s.mesh.position.z=i*bl,s.back&&(s.back.position.z=i*bl-bl*.5);const r=z4(t,this.facing);s.mesh.material=r?s.near:s.far})}layout(e){this.applyOrder(),$4(this.ordered,this.angles,this.offsets,this.solved);for(const i of this.ordered){const s=this.nodes.get(i.id),r=this.offsets[i.id];if(s.group.position.set((i.x+(r?.x??0))*Pn,-(i.y+(r?.y??0))*Pn,0),s.group.rotation.z=-(this.angles[i.id]??0),!s.mesh)continue;const o=e.frames?.[i.id]??"",a=s.shapes.has(o)?o:"";if(a!==s.shape){s.shape=a;const l=s.shapes.get(a);for(const h of[s.near,s.far])h&&"map"in h&&(h.map=l)}const c=e.scales?.[i.id];if(s.mesh.scale.set(c?.x??1,c?.y??1,1),s.back){const l=this.solved.get(i.id)?.rot??0,h=lf[0]*this.facing,u=lf[1],f=Math.cos(l),d=Math.sin(l);s.back.position.x=(h*f+u*d)*Pn,s.back.position.y=-(-h*d+u*f)*Pn,s.back.scale.copy(s.mesh.scale)}}this.root.children[0].position.set((e.x??0)*Pn,-(e.y??0)*Pn,0),this.root.scale.set(this.facing*(e.sx??1)*this.squashX,(e.sy??1)*this.squashY,1),this.root.rotation.z=-this.extraRot*this.facing}attach(e){const t=this.rig.attach[e],i=t?this.solved.get(t.joint):void 0;if(!t||!i)return{x:0,y:0};const s=Math.cos(i.rot),r=Math.sin(i.rot);return{x:(i.x+t.x*s-t.y*r)*this.facing,y:i.y+t.x*r+t.y*s}}get height(){const e=this.solved.get("head");return e?-e.y+60:130}}const t5=1400,n5=920,i5={speed:235,accel:1900,decel:2300,airAccel:1350,airDecel:900,jumpVel:640,jumpCut:.45},s5=110,r5=130,a5=34,Tl=84;function o5(n,e,t){return n<e?Math.min(e,n+t):n>e?Math.max(e,n-t):n}const bi=i5,ki=a5/2;class l5{constructor(e,t,i,s,r,o){Me(this,"rig");Me(this,"x");Me(this,"y");Me(this,"z",0);Me(this,"vx",0);Me(this,"vy",0);Me(this,"facing",1);Me(this,"onGround",!0);Me(this,"stillT",0);Me(this,"solids");Me(this,"platZ");Me(this,"width");Me(this,"standing",null);Me(this,"coyote",0);Me(this,"jumpBuffer",0);Me(this,"jumping",!1);Me(this,"groundLock",0);Me(this,"airTime",0);Me(this,"maxFallVy",0);Me(this,"landT",0);Me(this,"landDur",.2);Me(this,"landImpact",0);Me(this,"jumpT",-1);Me(this,"sq",1);Me(this,"sqV",0);Me(this,"walkPhase",0);Me(this,"stepN",0);Me(this,"lastVx",0);Me(this,"skidding",!1);Me(this,"visVx",0);Me(this,"accLean",0);Me(this,"idleT",0);Me(this,"blinkIn",1.5);Me(this,"blinkT",-1);Me(this,"blinkAgain",!1);Me(this,"emoteT",0);Me(this,"strideLen");Me(this,"seed",7);this.rig=e,this.solids=t,this.platZ=i,this.x=s,this.y=r,this.width=o;const a=l=>e.rig.joints.find(h=>h.id===l)?.y??0,c=a("shinR")+a("footR");this.strideLen=124*Math.max(.75,Math.min(1.4,c/46))}rand(){return this.seed=this.seed*16807%2147483647,this.seed/2147483647}place(e,t,i){this.x=e,this.y=t,this.vx=0,this.vy=0,this.facing=i,this.onGround=!0,this.jumpT=-1,this.landT=0,this.sq=1,this.sqV=0,this.standing=this.groundAt(e,t),this.z=this.zFor(this.standing),this.rig.facing=i,this.rig.snap()}fixed(e,t){this.groundLock>0&&(this.groundLock-=e),this.onGround||(this.airTime+=e,this.maxFallVy=Math.max(this.maxFallVy,this.vy)),this.coyote=this.onGround?s5/1e3:this.coyote-e,this.landT>0&&(this.landT-=e),this.jumpT>=0&&(this.jumpT+=e);const i=t.axis;t.jumpPressed?this.jumpBuffer=r5/1e3:this.jumpBuffer-=e;const s=i*bi.speed;let r=this.onGround?i!==0?bi.accel:bi.decel:i!==0?bi.airAccel:bi.airDecel;i!==0&&Math.sign(this.vx)===-i&&(r=Math.max(r,bi.decel)),this.vx=o5(this.vx,s,r*e),i!==0&&(this.facing=i>0?1:-1),this.jumpBuffer>0&&this.coyote>0&&(this.vy=-640,this.jumpBuffer=0,this.coyote=0,this.jumping=!0,this.groundLock=.06,this.onGround=!1,this.standing=null,this.airTime=0,this.maxFallVy=0,this.landT=0,this.jumpT=0,this.sq=.86,this.sqV=6,this.rig.snapTo("crouch")),this.jumping&&!t.jumpHeld&&this.vy<0&&(this.vy*=bi.jumpCut,this.jumping=!1),this.vy>=0&&(this.jumping=!1);const o=Math.abs(this.vx);this.onGround&&i===0&&this.lastVx>bi.speed*.6&&o<this.lastVx-1?this.skidding||(this.skidding=!0,this.sqV-=1.1):(o<5||i!==0)&&(this.skidding=!1),this.lastVx=o,this.vy=Math.min(n5,this.vy+t5*e),this.move(e);const a=this.onGround?this.standing:this.vy>-200?this.groundAt(this.x,this.y):null,c=this.onGround?this.zFor(this.standing):a?this.zFor(a):this.z;this.z+=(c-this.z)*(1-Math.exp(-(this.onGround?14:7)*e))}zFor(e){return e?this.platZ.get(e)??0:0}groundAt(e,t){let i=null;for(const s of this.solids)e+ki<=s.x||e-ki>=s.x+s.w||s.y<t-.5||(!i||s.y<i.y)&&(i=s);return i}overlaps(e,t,i){return t+ki>e.x&&t-ki<e.x+e.w&&i>e.y&&i-Tl<e.y+e.h}move(e){this.x+=this.vx*e;for(const r of this.solids)r.oneWay||!this.overlaps(r,this.x,this.y)||(this.vx>0?this.x=r.x-ki:this.vx<0&&(this.x=r.x+r.w+ki),this.vx=0);this.x=Math.max(ki,Math.min(this.width-ki,this.x));const t=this.y;this.y+=this.vy*e;let i=null;for(const r of this.solids)this.x+ki<=r.x||this.x-ki>=r.x+r.w||(this.vy>=0&&t<=r.y+.5&&this.y>=r.y?(!i||r.y<i.y)&&(i=r):!r.oneWay&&this.vy<0&&this.overlaps(r,this.x,this.y)&&t-Tl>=r.y+r.h-.5&&(this.y=r.y+r.h+Tl,this.vy=0));const s=this.onGround;i&&this.groundLock<=0?(this.y=i.y,this.vy=0,this.onGround=!0,this.standing=i,s||this.landed()):(this.onGround=!1,this.standing=null)}landed(){if(this.airTime>.12&&this.maxFallVy>180){const e=Math.min(1,(this.maxFallVy-180)/720);this.landImpact=e,this.landDur=.14+.2*e,this.landT=this.landDur,this.sq=1-(.06+.14*e),this.sqV=-1.2*e,e>.55&&(this.emoteT=.38)}this.jumpT=-1,this.airTime=0,this.maxFallVy=0}visual(e){const t=!this.onGround,i=t?1+Math.min(.06,Math.abs(this.vy)/1e4):1;this.sqV+=((i-this.sq)*320-this.sqV*15)*e,this.sq+=this.sqV*e;const s=this.rig;s.squashY=this.sq,s.squashX=1+(1-this.sq)*.85;const r=Math.abs(this.vx)/bi.speed;let o="idle";const a={};if(this.emoteT>0&&(this.emoteT-=e,a.emote="effort",a.emoteK=Math.min(1,this.emoteT/.25)),this.blinkT>=0?(this.blinkT+=e,this.blinkT>.15&&(this.blinkT=-1,this.blinkIn=this.blinkAgain?.09:2.2+this.rand()*3.6,this.blinkAgain=!this.blinkAgain&&this.rand()<.22)):(this.blinkIn-=e)<=0&&(this.blinkT=0),this.blinkT>=0&&(a.blink=1-Math.abs(this.blinkT/.075-1)),t)a.vy=this.vy,a.jv=bi.jumpVel,this.jumpT<0?o="fall":this.jumpT<.13?o="takeoff":this.vy<-140?o="rise":this.vy<150?o="apex":o="fall";else if(this.landT>0&&!(Math.abs(this.vx)>60&&this.landDur-this.landT>.08))o="land",a.k=1-this.landT/this.landDur,a.impact=this.landImpact;else if(Math.abs(this.vx)>12){o="walk",this.walkPhase+=Math.abs(this.vx)*e/this.strideLen*Math.PI*2,a.phase=this.walkPhase,a.speed=r;const h=Math.floor((this.walkPhase-Math.PI/2)/Math.PI);h!==this.stepN&&(this.stepN=h,this.sqV-=.55)}this.idleT=o==="idle"?this.idleT+e:0,this.stillT=o==="idle"||o==="land"?this.stillT+e:0,a.idleT=this.idleT,s.facing=this.facing,s.play(o,a),s.stiffness=o==="takeoff"?2.6:o==="land"?2:o==="apex"?.85:1;const c=Math.min(1,Math.abs(this.vx)/bi.speed);let l=t?(this.vy<-140?-.05:this.vy>150?.08:.02)*c:0;if(!t){const h=(Math.abs(this.vx)-this.visVx)/Math.max(.001,e);this.accLean+=(Math.max(-.1,Math.min(.1,h/5200))-this.accLean)*(1-Math.exp(-12*e)),l+=this.skidding?-.07:this.accLean}this.visVx=Math.abs(this.vx),s.extraRot+=(l-s.extraRot)*(1-Math.exp(-10*e)),s.update(e),s.root.position.set(dt(this.x),sn(this.y),this.z)}heightAboveGround(){const e=this.groundAt(this.x,this.y),t=e?e.y:660;return{ground:t,h:Math.max(0,t-this.y)}}groundZ(){return this.zFor(this.groundAt(this.x,this.y))}}const c5={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Gr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const h5=new vo(-1,1,1,-1,0,1);class f5 extends Mi{constructor(){super(),this.setAttribute("position",new ai([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ai([0,2,0,0,2,0],2))}}const u5=new f5;class _c{constructor(e){this._mesh=new tn(u5,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,h5)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class g0 extends Gr{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof oi?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ec.clone(e.uniforms),this.material=new oi({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new _c(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class cf extends Gr{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class d5 extends Gr{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class p5{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new st);this._width=i.width,this._height=i.height,t=new ri(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:1016}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new g0(c5),this.copyPass.material.blending=0,this.timer=new wu}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){const a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}cf!==void 0&&(o instanceof cf?i=!0:o instanceof d5&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new st);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const Ja={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class m5 extends Gr{constructor(){super(),this.isOutputPass=!0,this.uniforms=ec.clone(Ja.uniforms),this.material=new Tf({name:Ja.name,uniforms:this.uniforms,vertexShader:Ja.vertexShader,fragmentShader:Ja.fragmentShader}),this._fsQuad=new _c(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Lt.getTransfer(this._outputColorSpace)===$t&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class g5 extends Gr{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new bt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}}const _5=`
#include <packing>
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform vec2 uTexel;
uniform float uNear;
uniform float uFar;
uniform float uFocus;
uniform float uScale;
uniform float uMaxBlur;
varying vec2 vUv;

float viewDepth(vec2 uv) {
  return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, uNear, uFar);
}

// Blur radius in pixels for a depth: thin-lens-like, 1/f - 1/z.
float blurSize(float z) {
  return clamp(abs(1.0 / uFocus - 1.0 / z) * uScale, 0.0, 1.0) * uMaxBlur;
}

void main() {
  float cz = viewDepth(vUv);
  float cs = blurSize(cz);
  vec3 col = texture2D(tColor, vUv).rgb;
  float tot = 1.0;
#if SAMPLES > 0
  // Gather over a golden-angle spiral; a sample counts where its own blur
  // reaches this pixel, and sharper things behind cannot bleed forward.
  for (int i = 0; i < SAMPLES; i++) {
    float fi = float(i) + 0.5;
    float r = sqrt(fi / float(SAMPLES)) * uMaxBlur;
    float a = fi * 2.39996323;
    vec2 tc = vUv + vec2(cos(a), sin(a)) * uTexel * r;
    vec3 sc = texture2D(tColor, tc).rgb;
    float sz = viewDepth(tc);
    float ss = blurSize(sz);
    if (sz > cz) ss = clamp(ss, 0.0, cs * 2.0);
    float m = smoothstep(r - 0.5, r + 0.5, ss);
    col += mix(col / tot, sc, m);
    tot += 1.0;
  }
#endif
  gl_FragColor = vec4(col / tot, 1.0);
}
`,_0=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;class M5 extends Gr{constructor(t,i,s){super();Me(this,"target");Me(this,"uniforms");Me(this,"enabledDof",!0);Me(this,"scenePass");Me(this,"quad");Me(this,"camera");this.camera=i,this.scenePass=new g5(t,i),this.target=new ri(1,1,{type:1016,samples:s}),this.target.depthTexture=new Sr(1,1),this.uniforms={tColor:{value:this.target.texture},tDepth:{value:this.target.depthTexture},uTexel:{value:new st},uNear:{value:i.near},uFar:{value:i.far},uFocus:{value:8},uScale:{value:22},uMaxBlur:{value:11}},this.quad=new _c(new oi({uniforms:this.uniforms,vertexShader:_0,fragmentShader:_5,defines:{SAMPLES:48},depthTest:!1,depthWrite:!1})),this.needsSwap=!0}setSize(t,i){this.target.setSize(t,i),this.uniforms.uTexel.value.set(1/t,1/i),this.uniforms.uMaxBlur.value=11*(i/720)}render(t,i){this.scenePass.render(t,i,this.target,0,!1),this.uniforms.uNear.value=this.camera.near,this.uniforms.uFar.value=this.camera.far;const s=this.quad.material,r=this.enabledDof?48:0;s.defines.SAMPLES!==r&&(s.defines.SAMPLES=r,s.needsUpdate=!0),t.setRenderTarget(this.renderToScreen?null:i),this.quad.render(t)}dispose(){this.target.dispose(),this.quad.dispose()}}const v5=`
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uStrength;
uniform float uVignette;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  vec2 px = 1.0 / uResolution;
  // Measured on the game's 1280x720 view.
  float k = uResolution.y / 720.0;
  // The plates slightly out of register: red a touch right, blue left.
  vec4 base = texture2D(tDiffuse, uv);
  float r = texture2D(tDiffuse, uv + vec2(px.x * 0.9 * k, 0.0)).r;
  float b = texture2D(tDiffuse, uv - vec2(px.x * 0.9 * k, -px.y * 0.4 * k)).b;
  vec3 col = mix(base.rgb, vec3(r, base.g, b), uStrength);
  // Halftone: a 45 degree dot screen; darker tones get bigger dots.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec2 p = uv * uResolution / (4.6 * k);
  vec2 q = vec2(p.x + p.y, p.y - p.x) * 0.7071;
  vec2 cell = fract(q) - 0.5;
  float rad = 0.62 * sqrt(clamp(1.0 - lum, 0.0, 1.0));
  float dotMask = 1.0 - smoothstep(rad - 0.08, rad + 0.08, length(cell));
  float shade = smoothstep(0.92, 0.35, lum);
  col *= 1.0 - dotMask * shade * 0.2 * uStrength;
  // Warm paper: its grain, and a faint cloudiness of the fibres.
  vec2 gp = uv * uResolution / (1.5 * k);
  float g = hash(floor(gp));
  float fibre = noise(uv * uResolution / (38.0 * k)) * 0.6 + noise(uv * uResolution / (11.0 * k)) * 0.4;
  col *= mix(vec3(1.0), vec3(1.0, 0.985, 0.95) * (0.965 + 0.05 * g) * (0.985 + 0.03 * fibre), uStrength);
  // A gentle vignette.
  vec2 d = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float v = smoothstep(1.05, 0.38, length(d));
  col *= mix(1.0 - uVignette, 1.0, v);
  gl_FragColor = vec4(col, 1.0);
}
`;class x5{constructor(e,t,i,s=4){Me(this,"composer");Me(this,"scene");Me(this,"comic");Me(this,"output");this.composer=new p5(e,new ri(1,1,{type:1016})),this.scene=new M5(t,i,s),this.output=new m5,this.comic=new g0(new oi({uniforms:{tDiffuse:{value:null},uResolution:{value:new st(1280,720)},uStrength:{value:1},uVignette:{value:.22}},vertexShader:_0,fragmentShader:v5})),this.composer.addPass(this.scene),this.composer.addPass(this.output),this.composer.addPass(this.comic)}setSize(e,t,i){this.composer.setPixelRatio(i),this.composer.setSize(e,t),this.comic.uniforms.uResolution.value.set(Math.round(e*i),Math.round(t*i))}set focus(e){this.scene.uniforms.uFocus.value=e}set dof(e){this.scene.enabledDof=e}get dof(){return this.scene.enabledDof}set print(e){this.comic.uniforms.uStrength.value=e?1:0,this.comic.uniforms.uVignette.value=e?.22:0}get print(){return this.comic.uniforms.uStrength.value>0}render(){this.composer.render()}}const Sn={a:.42,w:1.5},yn={a:.7,w:1.7},Os={a:.9,w:1.9};function ii(n,e,t=e.w){n.globalAlpha=e.a,n.strokeStyle=at,n.lineWidth=t,n.lineJoin="round",n.lineCap="round",n.stroke(),n.globalAlpha=1}function un(n,e,t){n.fillStyle=e,n.fill(),t&&ii(n,t)}function Lr(n,e,t=!0){const i=e.length;if(n.beginPath(),i<3){n.moveTo(e[0][0],e[0][1]);for(const r of e.slice(1))n.lineTo(r[0],r[1]);t&&n.closePath();return}const s=(r,o)=>[(r[0]+o[0])/2,(r[1]+o[1])/2];if(t){const r=s(e[i-1],e[0]);n.moveTo(r[0],r[1]);for(let o=0;o<i;o++){const a=s(e[o],e[(o+1)%i]);n.quadraticCurveTo(e[o][0],e[o][1],a[0],a[1])}n.closePath()}else{n.moveTo(e[0][0],e[0][1]);for(let r=1;r<i-1;r++){const o=s(e[r],e[r+1]);n.quadraticCurveTo(e[r][0],e[r][1],o[0],o[1])}n.lineTo(e[i-1][0],e[i-1][1])}}function Bs(n,e,t,i){n.fillStyle=i,n.fillRect(-2,-2,e+4,t+4)}function Ei(n,e,t,i,s,r,o,a,c=1){const l=o.range(0,6),h=o.range(0,6),u=[];for(let f=-40;f<=e+40;f+=30){const d=i-s*(.55+.45*Math.sin(f/520*c+l))-s*.35*Math.sin(f/190*c+h)*Math.sin(f/900+l);u.push([f,d])}Lr(n,u,!1),n.lineTo(e+40,t+10),n.lineTo(-40,t+10),n.closePath(),n.fillStyle=r,n.fill(),a&&(Lr(n,u,!1),ii(n,a))}function y5(n,e,t,i,s,r,o=0){n.beginPath();for(let a=0;a<10;a++){const c=o-Math.PI/2+a*Math.PI/5,l=a%2?i*.46:i,h=e+Math.cos(c)*l,u=t+Math.sin(c)*l;a===0?n.moveTo(h,u):n.lineTo(h,u)}n.closePath(),un(n,s,{a:r.a,w:Math.min(r.w,i*.22)})}const hf=[_e.mint,_e.butter,_e.pink,_e.lilac,_e.aqua,_e.cream];function Xl(n,e,t,i,s,r,o=1){const a=Math.floor(e*t/s);for(let c=0;c<a;c++){const l=i.range(0,e),h=i.range(0,t);i.chance(.3)?(n.beginPath(),n.arc(l,h,i.range(1.2,2.2),0,Math.PI*2),n.fillStyle=i.pick(hf),n.globalAlpha=.8,n.fill(),n.globalAlpha=1):y5(n,l,h,i.range(5,10)*o,i.pick(hf),r,i.range(-.4,.4))}}function M0(n,e,t,i,s,r,o,a){const c=Math.max(3,Math.round(i/46)),l=i*.3,h=[];for(let d=0;d<=c;d++){const m=d/c;h.push([e+m*i,t+l*.5-(d===0||d===c?0:l*s.range(.45,.8))])}n.beginPath(),n.moveTo(h[0][0],h[0][1]);for(let d=1;d<h.length;d++){const m=h[d-1],_=h[d],p=(_[0]-m[0])*.62;n.bezierCurveTo(m[0],m[1]-p*1.1,_[0],_[1]-p*1.1,_[0],_[1])}n.bezierCurveTo(e+i+l*.4,t+l*.9,e+i*.6,t+l*1.1,e+i*.5,t+l*.95),n.bezierCurveTo(e+i*.3,t+l*1.15,e-l*.4,t+l*.95,e,t+l*.5),n.closePath(),un(n,r,a),n.beginPath();const u=Math.round(i/38);for(let d=0;d<u;d++){const m=e+s.range(.12,.85)*i,_=t+s.range(0,.55)*l,p=s.range(5,8);n.moveTo(m,_+p*.4),n.quadraticCurveTo(m+p*.5,_-p*.4,m+p,_+p*.1),n.quadraticCurveTo(m+p*1.5,_-p*.4,m+p*2,_+p*.4)}if(ii(n,{a:a.a*.85,w:a.w*.8}),!o)return;const f=Math.round(i/22);for(let d=0;d<f;d++){const m=e+(d+.5)/f*i+s.range(-5,5),_=t+l*1.15+s.range(0,14),p=s.range(14,24);n.beginPath(),n.moveTo(m,_);for(let g=1;g<=4;g++)n.quadraticCurveTo(m+(g%2?3.5:-3.5),_+p*(g-.5)/4,m,_+p*g/4);n.globalAlpha=a.a,n.strokeStyle=at,n.lineWidth=4.2,n.stroke(),n.globalAlpha=1,n.strokeStyle=o,n.lineWidth=2.4,n.stroke()}}function S5(n,e,t,i,s,r,o){const a=Math.cos(s),c=Math.sin(s),l=(E,v)=>[e+E*a-v*c,t+E*c+v*a],h=i*.36,u=l(0,0),f=l(i,0),d=l(i*.35,-h),m=l(i*.8,-h*.7),_=l(i*.35,h),p=l(i*.8,h*.7);n.beginPath(),n.moveTo(u[0],u[1]),n.bezierCurveTo(d[0],d[1],m[0],m[1],f[0],f[1]),n.bezierCurveTo(p[0],p[1],_[0],_[1],u[0],u[1]),n.closePath(),un(n,r,o),n.beginPath();const g=l(i*.1,0),b=l(i*.85,0);n.moveTo(g[0],g[1]),n.lineTo(b[0],b[1]);for(const E of[.35,.55,.72]){const v=l(i*E,0),S=l(i*(E+.12),-h*.45),T=l(i*(E+.12),h*.45);n.moveTo(v[0],v[1]),n.lineTo(S[0],S[1]),n.moveTo(v[0],v[1]),n.lineTo(T[0],T[1])}ii(n,{a:o.a*.8,w:o.w*.7})}function ao(n,e,t,i,s,r,o,a){const c=i*.055,l=t-i*.62;n.beginPath(),n.moveTo(e-c*1.6,t+4),n.quadraticCurveTo(e-c*.8,t-i*.1,e-c*.7,t-i*.3),n.lineTo(e-c*.55,l),n.lineTo(e+c*.55,l),n.lineTo(e+c*.7,t-i*.3),n.quadraticCurveTo(e+c*.8,t-i*.1,e+c*1.6,t+4),n.closePath(),un(n,s,a);const h=e+o.range(-.04,.04)*i,u=t-i*.74,f=i*o.range(.24,.3),d=i*o.range(.2,.25),m=11,_=[];for(let p=0;p<m;p++){const g=p/m*Math.PI*2,b=p%2?.86:1.06+o.range(-.04,.06);_.push([h+Math.cos(g)*f*b,u+Math.sin(g)*d*b])}Lr(n,_),un(n,r,a),n.beginPath();for(let p=0;p<5;p++){const g=h+o.range(-.6,.6)*f,b=u+o.range(-.5,.5)*d,E=f*o.range(.16,.26);n.moveTo(g-E,b+E*.35),n.quadraticCurveTo(g,b-E*.3,g+E,b+E*.35)}ii(n,{a:a.a*.7,w:a.w*.75})}function ql(n,e,t,i,s,r){n.beginPath();const o=3;n.moveTo(e,t-i);for(let a=1;a<=o;a++){const c=a/o;n.lineTo(e+i*.24*c,t-i+i*.86*c),a<o&&n.lineTo(e+i*.09*c,t-i+i*.86*c)}n.lineTo(e+i*.04,t-i*.14),n.lineTo(e+i*.04,t+4),n.lineTo(e-i*.04,t+4),n.lineTo(e-i*.04,t-i*.14);for(let a=o;a>=1;a--){const c=a/o;a<o&&n.lineTo(e-i*.09*c,t-i+i*.86*c),n.lineTo(e-i*.24*c,t-i+i*.86*c)}n.closePath(),un(n,s,r)}function Yl(n,e,t,i,s,r,o=1){const a=78*o;let c=-i.range(10,40);for(;c<t+10;){const l=a*i.range(.75,1.2);let h=-i.range(0,60);for(;h<e+10;){const u=a*i.range(1.1,2.1),f=3.2*o,d=()=>i.range(-5,5)*o,m=[[h+f,c+f+d()*.5],[h+u*.5+d(),c+f+d()*.6],[h+u-f,c+f+d()*.5],[h+u-f+d()*.6,c+l*.5],[h+u-f,c+l-f+d()*.5],[h+u*.5+d(),c+l-f+d()*.6],[h+f,c+l-f+d()*.5],[h+f+d()*.6,c+l*.5]];Lr(n,m),un(n,i.pick(s),r),h+=u}c+=l}}function Zl(n,e,t,i,s,r,o,a,c){const l=Math.max(1,Math.floor(e/o));for(let h=0;h<l;h++){let u=i.range(0,e),f=-20;const d=i.range(a[0],a[1])*t,m=i.range(c[0],c[1]),_=6,p=[[u,f]];for(let E=1;E<=_;E++)u+=i.range(-26,26),f+=d/_,p.push([u,f]);const g=[],b=[];p.forEach((E,v)=>{const S=p[Math.max(0,v-1)],T=p[Math.min(_,v+1)],L=Math.hypot(T[0]-S[0],T[1]-S[1])||1,x=-(T[1]-S[1])/L,w=(T[0]-S[0])/L,I=m*(1-v/_*.9)/2;g.push([E[0]+x*I,E[1]+w*I]),b.push([E[0]-x*I,E[1]-w*I])}),Lr(n,[...g,p[_],...b.reverse()]),un(n,s,r),n.beginPath();for(let E=1;E<_-1;E++){if(!i.chance(.55))continue;const v=p[E],S=i.chance(.5)?1:-1;n.moveTo(v[0]+S*m*.3,v[1]),n.quadraticCurveTo(v[0]+S*m*.9,v[1]+10,v[0]+S*m*1.1,v[1]+i.range(20,34))}for(let E=1;E<_;E+=2){const v=p[E];n.moveTo(v[0]-m*.12,v[1]-6),n.lineTo(v[0]+m*.1,v[1]+4)}ii(n,{a:r.a*.8,w:r.w*.8})}}const v0=[R.crystalTeal,R.crystalBlue,R.crystalOrange,_e.pink,_e.lilac];function x0(n,e,t,i,s,r,o=20){for(let a=0;a<i;a++){const c=s.range(0,e),l=s.range(o,t),h=s.pick(v0),u=s.int(1,3);for(let f=0;f<u;f++){const d=s.range(14,38)*(f===0?1:.7),m=c+(f-(u-1)/2)*d*.4,_=s.range(-.35,.35),p=d*.17;n.beginPath(),n.moveTo(m-p,l),n.lineTo(m-p+_*d*.7,l-d*.72),n.lineTo(m+_*d,l-d),n.lineTo(m+p+_*d*.7,l-d*.72),n.lineTo(m+p,l),n.closePath(),un(n,h,r),n.beginPath(),n.moveTo(m+_*d,l-d),n.lineTo(m+p*.15,l),ii(n,{a:r.a*.7,w:r.w*.7})}}}function b5(n,e,t,i,s,r){n.beginPath(),n.ellipse(e+150*i,t+6*i,200*i,52*i,-.04,0,Math.PI*2),un(n,r,{a:s.a*.6,w:s.w}),n.beginPath(),n.moveTo(e,t),n.quadraticCurveTo(e+160*i,t-50*i,e+340*i,t);for(let o=1;o<12;o++){const a=o/12,c=e+340*i*a,l=t-Math.sin(a*Math.PI)*26*i;n.moveTo(c,l),n.quadraticCurveTo(c+10*i,l+20*i,c-4*i,l+38*i*Math.sin(a*Math.PI+.3))}n.moveTo(e-64*i,t+4*i),n.ellipse(e-30*i,t+4*i,34*i,16*i,-.1,Math.PI,Math.PI*3),ii(n,s)}function T5(n,e,t,i,s,r,o,a){n.beginPath(),n.ellipse(e,t,16*i,6*i,0,0,Math.PI*2),un(n,o,r);const c=s.int(2,3);for(let l=0;l<c;l++)S5(n,e+(l-(c-1)/2)*7*i,t-2*i,s.range(20,30)*i,-Math.PI/2+(l-(c-1)/2)*.55+s.range(-.1,.1),a,r)}function Rn(n,e,t,i=1){wo(n,-2,-2,e+4,t+4,{strength:i})}const E5=["#c9c7c4","#c4c2c0","#cfcdca","#bfbdbb"],ff=(n,e,t,i)=>[{scroll:.15,res:.5,draw:(s,{w:r,h:o},a)=>{Bs(s,r,o,n),Yl(s,r,o,a,e,Sn,1.4),b5(s,r*a.range(.2,.6),o*a.range(.3,.6),.9,Sn,i),Rn(s,r,o)}},{scroll:.4,res:.5,draw:(s,{w:r,h:o},a)=>{Zl(s,r,o,a,li(t,n,.35),yn,150,[.25,.6],[16,34]),x0(s,r,o,Math.floor(r/110),a,yn,o*.25),Rn(s,r,o)}},{scroll:.7,res:1,draw:(s,{w:r,h:o},a)=>{Zl(s,r,o*.7,a,t,Os,420,[.4,.8],[22,40]),Rn(s,r,o)}}],El=(n,e,t,i)=>[{scroll:.05,res:.5,draw:(s,{w:r,h:o,horizon:a},c)=>{Bs(s,r,o,_e.night),Xl(s,r,a-60,c,26e3,Sn),Ei(s,r,o,a+40,120,n,c,Sn,.6),Rn(s,r,o,.35)}},{scroll:.3,res:.5,draw:(s,{w:r,h:o,horizon:a},c)=>{for(let l=c.range(0,80);l<r;l+=c.range(70,160))ql(s,l,a+124+c.range(-16,16),c.range(70,130),li(e,i,.3),yn);Ei(s,r,o,a+110,70,e,c,yn,1.2),Rn(s,r,o,.7)}},{scroll:.6,res:1,draw:(s,{w:r,h:o,horizon:a},c)=>{for(let l=c.range(0,200);l<r;l+=c.range(240,420))ao(s,l,a+300,c.range(260,400),t,i,c,Os);Ei(s,r,o,a+318,34,li(e,i,.45),c,Os,2),Rn(s,r,o)}}];function wl(n,e,t,i,s,r,o,a){Bs(n,e,t,r),o.forEach((l,h)=>{const u=i-40-(o.length-h)*34,f=[];for(let d=-40;d<=e+40;d+=60)f.push([d,u+Math.sin(d/170+h*2)*8]);Lr(n,f,!1),n.lineTo(e+40,t+10),n.lineTo(-40,t+10),n.closePath(),n.fillStyle=l,n.fill()});const c=Math.max(1,Math.round(e/1e3*a));for(let l=0;l<c;l++){const h=s.range(150,260);M0(n,s.range(-40,e),s.range(i*.08,i*.42),h,s,"#c3d0d6",s.chance(.6)?"#d9829c":null,Sn)}}const w5={nursery:{sky:["#efedf0","#ebe8ec"],layers:[{scroll:.2,res:.5,draw:(n,{w:e,h:t},i)=>{Bs(n,e,t,"#ebe8ec"),Yl(n,e,t*.22,i,E5,Sn,1.2),n.beginPath(),n.rect(-10,t*.34,e+20,t*.32),un(n,"#f3d9ee",Sn),n.beginPath(),n.moveTo(-10,t*.66),n.lineTo(e+10,t*.66),ii(n,Sn),Xl(n,e,t*.62,i,6e4,Sn,1.2),x0(n,e,t,Math.floor(e/160),i,Sn,t*.7),Rn(n,e,t)}}],terrain:{soil:{base:"#d8c3a6",top:"#e8d8bd",detail:"#9c8670",accent:R.crystalTeal},wood:{base:"#dcb793",top:"#ead0b3",detail:"#9e7d62"},stone:{base:"#c9c7c4",top:"#dedcd9",detail:"#8f8b8b"}},ambient:"dust",horizon:.6},roots:{sky:["#c3bec6","#bdb8c1"],layers:ff("#bdb8c1",["#c6c1c9","#bfbac3","#cbc7ce","#b8b3bd"],"#b39aa8","#d9d2dc"),terrain:{},ambient:"dust",horizon:.6},chamber:{sky:["#b7ccc6","#afc5bf"],layers:ff("#afc5bf",["#b9cdc8","#b2c8c2","#bfd2cc","#a9c0ba"],"#a996a8","#d5e3df"),terrain:{soil:{base:"#c7bfd0",top:"#dcd5e4",detail:"#8e84a0",accent:R.crystalTeal}},ambient:"sparkle",horizon:.6},surface:{sky:[_e.night,_e.night],layers:El("#4c6356","#5f7868","#a88f9c","#9fb89a"),terrain:{moss:{base:"#cdb89a",top:"#a9cf8f",detail:"#8d7a62"}},ambient:"wind",horizon:.55},hill:{sky:[_e.night,_e.night],layers:El("#4e6559","#627b6c","#b095a3","#a3bb9d"),terrain:{moss:{base:"#d0bb9c",top:"#b0d392",detail:"#8f7c64"}},ambient:"wind",horizon:.5},forest:{sky:[_e.night,_e.night],layers:El("#4a6254","#5b7465","#a58c99","#94b391"),terrain:{moss:{base:"#c9b597",top:"#9fcb8f",detail:"#8a775f"}},ambient:"petals",horizon:.5},ride:{sky:[_e.periwinkle,"#f1c9b0"],layers:[{scroll:.03,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{wl(n,e,t,i,s,_e.periwinkle,["#c9b8e0","#f0c6cf","#f6d3b2"],2.2),Ei(n,e,t,i+30,140,"#b7a6cf",s,Sn,.5),Rn(n,e,t)}},{scroll:.12,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{for(let r=s.range(0,80);r<e;r+=s.range(80,170))ql(n,r,i+122+s.range(-12,12),s.range(60,110),"#98b596",yn);Ei(n,e,t,i+110,80,"#a9c4a0",s,yn,1),Rn(n,e,t)}},{scroll:.35,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{for(let r=s.range(0,200);r<e;r+=s.range(260,460))ao(n,r,i+260,s.range(220,320),"#b39aa8","#b6d09a",s,Os);Ei(n,e,t,i+270,30,_e.sand,s,Os,2),Rn(n,e,t)}}],terrain:{moss:{base:_e.sand,top:"#b8d696",detail:"#94806a"}},ambient:"petals",horizon:.5},sun:{sky:[_e.periwinkle,_e.periwinkle],layers:[{scroll:.1,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{wl(n,e,t,i,s,_e.periwinkle,[],2.6),Ei(n,e,t,i+170,60,_e.sandLight,s,Sn,.7),Rn(n,e,t)}},{scroll:.35,res:.5,draw:(n,{w:e,h:t},i)=>{const s=t*.84;for(let r=-60;r<e+60;r+=i.range(90,150)){const o=Math.abs(r-e/2)/(e/2),a=90+260*Math.pow(o,1.6)+i.range(-20,20);ao(n,r,s+20,a,"#b39aa8",i.pick(["#b8d39a","#a8c9a0","#c3dc8c"]),i,yn)}Ei(n,e,t,s+10,22,_e.sand,i,yn,2);for(let r=i.range(40,140);r<e;r+=i.range(160,300))T5(n,r,s+34+i.range(0,20),1,i,yn,"#a5876c","#b6d6a0");Rn(n,e,t)}}],terrain:{moss:{base:_e.sand,top:"#bfd99b",detail:"#94806a"}},ambient:"embers",horizon:.45},clearing:{sky:["#a9c9d6","#a9c9d6"],layers:[{scroll:.06,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{wl(n,e,t,i,s,"#a9c9d6",["#c8dcd6"],1.6),Ei(n,e,t,i+60,100,"#b3c7b6",s,Sn,.6),Rn(n,e,t)}},{scroll:.25,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{Ei(n,e,t,i+150,40,"#a7c09f",s,yn,1),n.beginPath(),n.rect(-10,i+150,e+20,60),un(n,_e.aqua,yn),n.beginPath();for(let r=s.range(0,40);r<e;r+=s.range(40,90)){const o=i+162+s.range(0,36);n.moveTo(r,o),n.quadraticCurveTo(r+6,o-5,r+12,o),n.quadraticCurveTo(r+18,o+5,r+24,o)}ii(n,{a:yn.a*.7,w:1.4});for(let r=s.range(0,80);r<e;r+=s.range(70,150))ql(n,r,i+152,s.range(60,110),"#8fb193",yn);Rn(n,e,t)}},{scroll:.55,res:1,draw:(n,{w:e,h:t,horizon:i},s)=>{for(let r=s.range(0,200);r<e;r+=s.range(240,420))ao(n,r,i+330,s.range(280,400),"#b39aa8","#a9c99a",s,Os);Ei(n,e,t,i+330,30,"#bcd3a8",s,Os,2),Rn(n,e,t)}}],terrain:{moss:{base:"#d3c3a4",top:"#afd29a",detail:"#8f7e66"}},ambient:"dust",horizon:.45},dorm:{sky:["#efe3e6","#ecdfe2"],layers:[{scroll:.2,res:.5,draw:(n,{w:e,h:t},i)=>{Bs(n,e,t,"#ecdfe2"),n.beginPath(),n.rect(-10,t*.78,e+20,t*.3),un(n,_e.blush,Sn);for(let s=i.range(60,200);s<e;s+=i.range(280,400))n.beginPath(),n.moveTo(s,t*.74),n.lineTo(s,t*.3),n.arc(s+55,t*.3,55,Math.PI,0),n.lineTo(s+110,t*.74),n.closePath(),un(n,_e.periwinkleDeep,Sn),n.save(),n.clip(),Xl(n,e,t,new an(Math.floor(s)),9e3,Sn,.8),n.restore(),n.beginPath(),n.moveTo(s+55,t*.3-55),n.lineTo(s+55,t*.74),n.moveTo(s,t*.5),n.lineTo(s+110,t*.5),ii(n,{a:Sn.a,w:3});Rn(n,e,t)}},{scroll:.45,res:.5,draw:(n,{w:e,h:t},i)=>{for(let s=i.range(100,300);s<e;s+=i.range(320,540)){const r=i.range(t*.12,t*.45),o=i.range(26,56);n.beginPath(),n.moveTo(s,-10),n.lineTo(s,r-o),ii(n,yn),n.beginPath(),n.arc(s,r,o,0,Math.PI*2),un(n,_e.cream,yn),n.beginPath();for(let a=0;a<12;a++){const c=a/12*Math.PI*2;n.moveTo(s+Math.cos(c)*o*.78,r+Math.sin(c)*o*.78),n.lineTo(s+Math.cos(c)*o*.9,r+Math.sin(c)*o*.9)}n.moveTo(s,r),n.lineTo(s,r-o*.66),n.moveTo(s,r),n.lineTo(s+o*.45,r+o*.2),ii(n,yn)}Rn(n,e,t)}}],terrain:{floor:{base:"#dcb99a",top:"#ead3bc",detail:"#9e7f66",accent:R.ivory}},ambient:"drips",horizon:.6},mech:{sky:["#bdbcc4","#b8b7bf"],layers:[{scroll:.2,res:.5,draw:(n,{w:e,h:t},i)=>{Bs(n,e,t,"#b8b7bf"),Yl(n,e,t,i,["#bebdc5","#b5b4bc","#c4c3ca"],Sn,1.6);for(let s=0;s<e/220;s++){const r=i.range(0,e),o=i.range(0,t),a=i.range(30,90);n.beginPath();const c=10;for(let l=0;l<c*2;l++){const h=l/(c*2)*Math.PI*2,u=l%2?a:a*1.18;n.lineTo(r+Math.cos(h)*u,o+Math.sin(h)*u)}n.closePath(),un(n,i.pick([_e.lavender,_e.stone,_e.aqua]),Sn),n.beginPath(),n.arc(r,o,a*.35,0,Math.PI*2),un(n,"#b8b7bf",Sn)}Rn(n,e,t)}},{scroll:.5,res:.5,draw:(n,{w:e,h:t},i)=>{Zl(n,e,t,i,"#a3abb8",yn,260,[.3,.6],[14,26]),Rn(n,e,t)}}],terrain:{metal:{base:"#aeb5c1",top:"#c8cdd6",detail:"#7f8897",accent:_e.butter}},ambient:"dust",horizon:.6},office:{sky:["#e9e2c9","#e5ddc3"],layers:[{scroll:.85,res:1,draw:(n,{w:e,h:t},i)=>{Bs(n,e,t,"#e5ddc3");for(let s=0;s<e;s+=240)n.beginPath(),n.rect(s+8,t*.18,224,t*.6),un(n,"#ede6cf",Sn);n.beginPath(),n.rect(-10,t*.8,e+20,16),un(n,"#b9c9c3",yn);for(let s=i.range(200,500);s<e;s+=i.range(700,900))n.beginPath(),n.rect(s,t*.25,150,200),un(n,_e.aqua,yn),M0(n,s+18,t*.25+26,70,i,"#e8eef0",null,yn),n.beginPath(),n.moveTo(s+75,t*.25),n.lineTo(s+75,t*.25+200),n.moveTo(s,t*.25+100),n.lineTo(s+150,t*.25+100),ii(n,yn,2.4);Rn(n,e,t)}}],terrain:{},ambient:"dust",horizon:.6}};function A5(n,e,t,i,s){const r="#8f8599",o={a:.6,w:2.2};n.save(),n.filter="blur(1.6px)";let a=s.range(-40,120);for(;a<e;){const c=s.range(.35,.95)*t;{n.beginPath(),n.ellipse(a,t+6,s.range(40,90),s.range(14,30),0,Math.PI,0),un(n,r,o);const l=2+Math.floor(s.range(0,3));for(let h=0;h<l;h++){const u=a+s.range(-40,40),f=c*s.range(.4,1),d=f*s.range(.22,.34),m=s.range(-.3,.3);n.beginPath(),n.moveTo(u-d/2,t+4),n.lineTo(u-d/2+m*f*.7,t-f*.75),n.lineTo(u+m*f,t-f),n.lineTo(u+d/2+m*f*.7,t-f*.75),n.lineTo(u+d/2,t+4),n.closePath(),un(n,li(r,s.pick(v0),.35),o)}}a+=s.range(220,520)}n.restore(),wo(n,-2,-2,e+4,t+4)}function R5(n){return w5[n]}function Ti(n,e,t,i,s){return{base:n,shade:n,light:s??li(n,"#ffffff",.32),top:e,topShade:e,detail:t,accent:i}}const C5={soil:Ti("#cdb9a0","#e2d3bb","#98836d",R.crystalTeal),root:Ti(R.bark,R.barkLight,R.barkDark,R.violet),crystal:Ti(R.crystalTeal,R.crystalTealLight,"#5f9d90","#ffffff"),wood:Ti("#d9b48f","#e8cdb0","#a07e62",R.crystalOrange),stone:Ti("#c6c3c7","#dcdadd","#8e8a90",R.crystalBlue),moss:Ti(_e.sand,"#a9cf8f","#8d7a62",R.crystalBlue),floor:Ti("#dcb99a","#ead3bc","#9e7f66",R.ivory),metal:Ti("#aeb5c1","#c8cdd6","#7f8897",_e.butter),bed:Ti("#dcb99a","#ead3bc","#9e7f66",R.ivory),office:Ti("#cfc9b4","#e2ddca","#9d977f","#e9e2c9"),none:Ti("#000000","#000000","#000000","#000000","#000000")};function L5(n,e){const t=e?.[n]??{},i={...C5[n],...t};return t.base&&!t.light&&(i.light=li(t.base,"#ffffff",.32)),i}const ja=26;function P5(n,e,t,i){const s=[],r=i?18:26,o=Math.min(i?e*.45:12,n/3,e/2),a=Math.max(2,Math.round((n-2*o)/r));s.push([0,o]),s.push([o*.3,o*.3]);for(let l=0;l<=a;l++){const h=o+(n-2*o)*l/a;s.push([h,t.range(-1.6,1.2)])}s.push([n-o*.3,o*.3]);const c=Math.max(1,Math.round((e-2*o)/r));for(let l=0;l<=c;l++){const h=o+(e-2*o)*l/c;s.push([n+(i?0:t.range(-4,3)),h])}s.push([n-o*.3,e-o*.3]);for(let l=a;l>=0;l--){const h=o+(n-2*o)*l/a;s.push([h,e+(i?t.range(-1,2):t.range(-3,5))])}s.push([o*.3,e-o*.3]);for(let l=c;l>=0;l--){const h=o+(e-2*o)*l/c;s.push([i?0:t.range(-3,4),h])}return s}function Al(n,e,t=0,i=0){const s=e.length;n.beginPath();const r=(a,c)=>[(a[0]+c[0])/2,(a[1]+c[1])/2],o=r(e[s-1],e[0]);n.moveTo(o[0]+t,o[1]+i);for(let a=0;a<s;a++){const c=e[a],l=r(c,e[(a+1)%s]);n.quadraticCurveTo(c[0]+t,c[1]+i,l[0]+t,l[1]+i)}n.closePath()}function pr(n,e,t,i,s,r=0){n.beginPath(),n.ellipse(e,t,i,s,r,0,Math.PI*2)}function _n(n,e,t=1,i=at){n.strokeStyle=i,n.lineWidth=e,n.globalAlpha=t,n.stroke(),n.globalAlpha=1}function D5(n,e,t,i,s){n.beginPath(),s?(n.ellipse(e,t,i*.5,i*.24,-.3,0,Math.PI*2),n.moveTo(e-i*.45,t+i*.12),n.lineTo(e-i*.8,t-i*.05),n.lineTo(e-i*.72,t+i*.35),n.closePath()):(n.moveTo(e-i*.6,t),n.quadraticCurveTo(e-i*.3,t-i*.5,e,t),n.quadraticCurveTo(e+i*.3,t-i*.5,e+i*.6,t)),_n(n,1.1,.75)}function y0(n,e,t,i,s,r,o,a){const c=i*.34,l=e+s*i,h=t-i,u=()=>{n.beginPath(),n.moveTo(e-c/2,t),n.lineTo(e-c/2+s*i*.7,t-i*.72),n.lineTo(l,h),n.lineTo(e+c/2+s*i*.7,t-i*.72),n.lineTo(e+c/2,t),n.closePath()};u(),n.fillStyle=r.fill,n.fill(),o&&D5(n,e+s*i*.4,t-i*.42,c*.9,a.chance(.5)),n.beginPath(),n.moveTo(l,h),n.lineTo(e+s*i*.15+c*.08,t),_n(n,C*.8,.8),u(),n.lineJoin="round",_n(n,C+.3)}const _s={blue:{fill:R.crystalBlue,shade:R.crystalBlueDark,light:R.crystalBlueLight},teal:{fill:R.crystalTeal,shade:R.crystalTealDark,light:R.crystalTealLight},orange:{fill:R.crystalOrange,shade:R.crystalOrangeDark,light:R.crystalOrangeLight},pink:{fill:_e.pink,shade:_e.pinkDeep,light:_e.blush}};function I5(n,e,t,i,s,r,o){const a=t*Math.min(i,400);switch(e){case"soil":case"moss":{const c=Math.floor(a/7e3);for(let u=0;u<c;u++){const f=r.range(10,t-10),d=r.range(26,Math.min(i,420)-6),m=r.range(3,7);pr(n,f,d,m,m*r.range(.55,.8),r.range(0,3)),n.fillStyle=r.chance(.25)?li(s.light,r.pick([_e.pink,_e.lilac,_e.mint]),.45):s.light,n.fill(),_n(n,1.1,.85)}const l=Math.floor(a/3e4)+1;for(let u=0;u<l;u++){let f=r.range(0,t),d=r.range(30,Math.min(i,420));n.beginPath(),n.moveTo(f,d);for(let m=0;m<4;m++){const _=f+r.range(-60,60),p=d+r.range(-10,30);n.quadraticCurveTo((f+_)/2+r.range(-20,20),(d+p)/2,_,p),f=_,d=p}_n(n,1.2,.8,s.detail)}const h=Math.floor(a/6e4);for(let u=0;u<h;u++){const f=r.range(24,t-24),d=r.range(60,Math.min(i,400));if(d>i-10)continue;const m=r.pick([_s.blue,_s.teal,_s.pink,_s.orange]);y0(n,f,d,r.range(18,34),r.range(-.3,.3),m,r.chance(.45),r)}break}case"root":{const c=Math.max(2,Math.floor(i/9));n.beginPath();for(let h=0;h<c;h++){const u=(h+.6)/c*i+r.range(-2,2);let f=r.range(4,30);for(n.moveTo(f,u);f<t-10;){const d=Math.min(t-6,f+r.range(30,90));n.quadraticCurveTo((f+d)/2,u+r.range(-3,3),d,u+r.range(-1.5,1.5)),f=d+r.range(6,30),n.moveTo(f,u+r.range(-1,1))}}_n(n,1.1,.8,s.detail);const l=Math.floor(t/140);for(let h=0;h<l;h++){const u=r.range(14,t-14),f=r.range(i*.3,i*.75);pr(n,u,f,r.range(4,7),r.range(2.5,4),0),_n(n,1.1,.85)}break}case"crystal":{n.beginPath();const c=Math.max(2,Math.floor(t/40));for(let l=0;l<c;l++){const h=(l+.5)*(t/c)+r.range(-6,6);n.moveTo(h,2),n.lineTo(h+r.range(-14,14),i-2)}_n(n,1.1,.55);break}case"wood":case"floor":case"bed":{const c=e==="floor"?30:22;if(n.beginPath(),e==="floor")for(let l=c;l<Math.min(i,200);l+=c){n.moveTo(0,l+r.range(-1,1)),n.lineTo(t,l+r.range(-1,1));for(let h=r.range(20,160);h<t;h+=r.range(120,220))n.moveTo(h,l-c+2),n.lineTo(h,l-2)}else for(let l=c;l<t-6;l+=c+r.range(-3,3))n.moveTo(l,4),n.lineTo(l+r.range(-1,1),i-4);_n(n,1.2,.8),n.fillStyle=at;for(let l=r.range(8,30);l<t-6;l+=r.range(60,110))pr(n,l,e==="floor"?8:Math.min(i*.5,10),1.3,1.3),n.fill();break}case"stone":{n.beginPath();const c=Math.max(1,Math.floor(t/70));for(let l=0;l<c;l++){let h=r.range(10,t-10),u=r.range(6,i*.4);n.moveTo(h,u);for(let f=0;f<3;f++)h+=r.range(-10,10),u+=r.range(6,16),n.lineTo(h,u)}_n(n,1.3,.9);break}case"metal":{n.beginPath();const c=80;for(let l=c;l<t;l+=c)n.moveTo(l,6),n.lineTo(l,Math.min(i,300));n.moveTo(4,20),n.lineTo(t-4,20),_n(n,1.3,.85);for(let l=12;l<t;l+=c/2)pr(n,l,12,2.4,2.4),n.fillStyle=s.accent,n.fill(),_n(n,1,.9);break}case"office":{n.beginPath();for(let c=60;c<t;c+=60)n.moveTo(c,4),n.lineTo(c-18,Math.min(i,120));n.moveTo(0,26),n.lineTo(t,26),_n(n,1.1,.7);break}}}function k5(n,e,t,i,s,r){const o=Math.cos(s),a=Math.sin(s),c=(p,g)=>[e+p*o-g*a,t+p*a+g*o],l=i*.34,h=c(i,0),u=c(i*.35,-l),f=c(i*.8,-l*.6),d=c(i*.35,l),m=c(i*.8,l*.6);n.beginPath(),n.moveTo(e,t),n.bezierCurveTo(u[0],u[1],f[0],f[1],h[0],h[1]),n.bezierCurveTo(m[0],m[1],d[0],d[1],e,t),n.closePath(),n.fillStyle=r,n.fill(),_n(n,1.2);const _=c(i*.8,0);n.beginPath(),n.moveTo(e,t),n.lineTo(_[0],_[1]),_n(n,.9,.8)}function U5(n,e,t,i,s){if(e==="moss"){const r=Math.floor(t/30);for(let c=0;c<r;c++){const l=s.range(6,t-6),h=s.range(5,11);n.fillStyle=s.chance(.5)?i.top:li(i.top,_e.lime,.4),n.beginPath(),n.moveTo(l-3.5,1),n.quadraticCurveTo(l-2.5,-h*.6,l-1+s.range(-3,3),-h),n.quadraticCurveTo(l+1,-h*.4,l+3.5,1),n.closePath(),n.fill(),_n(n,1.1)}const o=Math.floor(t/260);for(let c=0;c<o;c++){const l=s.range(20,t-20),h=s.int(2,3);for(let u=0;u<h;u++)k5(n,l+(u-(h-1)/2)*5,0,s.range(11,17),-Math.PI/2+(u-(h-1)/2)*.7+s.range(-.15,.15),li(i.top,_e.leaf,.5))}const a=Math.floor(t/220);for(let c=0;c<a;c++){const l=s.range(10,t-10),h=s.pick([_e.pink,_e.butter,_e.lilac,R.ivory]);for(let u=0;u<5;u++){const f=u/5*Math.PI*2;pr(n,l+Math.cos(f)*3,-5+Math.sin(f)*3,2.4,2.4),n.fillStyle=h,n.fill(),_n(n,.9)}pr(n,l,-5,1.6,1.6),n.fillStyle=_e.apricot,n.fill()}}else if(e==="soil"){const r=Math.floor(t/160);for(let o=0;o<r;o++){if(!s.chance(.5))continue;const a=s.range(20,t-20),c=s.pick([_s.teal,_s.blue,_s.pink,_s.orange]);y0(n,a,3,s.range(10,18),s.range(-.25,.25),c,!1,s)}}}function N5(n,e,t,i,s,r){const o=s?9:20,a=-o*.55,c=o*.45,l=Math.min(o*.85,e*.08),h=()=>{n.beginPath(),n.moveTo(l,a),n.lineTo(e-l,a),n.lineTo(e+.5,c);let d=e;for(;d>18;){const m=d-r.range(22,46);n.lineTo(Math.max(0,m),c+r.range(-.8,.8)),d=m}n.lineTo(-.5,c),n.closePath()},u=t==="crystal"?i.light:li(i.top,"#ffffff",.18);h(),n.fillStyle=u,n.fill(),n.save(),h(),n.clip(),n.beginPath();const f=Math.max(2,Math.round(e/40));for(let d=0;d<f;d++){const m=r.range(6,e-6),_=(m-e/2)/Math.max(1,e)*6;n.moveTo(m,c-1),n.lineTo(m-_-r.range(-2,2),a+r.range(1,o*.4))}_n(n,1,.35,i.detail),n.restore(),n.lineJoin="round",n.beginPath(),n.moveTo(0,c),n.lineTo(l,a),n.lineTo(e-l,a),n.lineTo(e,c),_n(n,s?1.2:1.5),n.beginPath(),n.moveTo(-.5,c),n.lineTo(e+.5,c),_n(n,s?1.7:Ci)}function _a(n,e,t,i,s){const r=n.getContext("2d"),o=L5(e.style,i),a=!!e.oneWay||e.h<=30,c=new an(s),l=P5(e.w,e.h,c,a);r.save(),r.translate(e.x-t.x,e.y-t.y),r.lineJoin="round",r.lineCap="round",Al(r,l),r.fillStyle=o.base,r.fill(),r.save(),Al(r,l),r.clip();const h=new an(s^1540483477);if(I5(r,e.style,e.w,e.h,o,h),e.style!=="crystal"&&e.style!=="metal"){const u=a?Math.min(7,e.h*.35):e.style==="moss"?16:11;r.beginPath(),r.moveTo(-10,-10),r.lineTo(e.w+10,-10);let f=e.w+10;r.lineTo(f,u);const d=new an(s^12139),m=[[f,u]];for(;f>-10;){const _=f-d.range(18,40),p=u+d.range(-4,5),g=u+d.range(-2,3);r.quadraticCurveTo((f+_)/2,p,_,g),m.push([(f+_)/2,p],[_,g]),f=_}r.closePath(),r.fillStyle=o.top,r.fill(),r.beginPath(),r.moveTo(m[0][0],m[0][1]);for(let _=1;_+1<m.length;_+=2)r.quadraticCurveTo(m[_][0],m[_][1],m[_+1][0],m[_+1][1]);_n(r,a?1:1.3,.85)}r.restore(),Al(r,l),_n(r,a?1.8:Ci),N5(r,e.w,e.style,o,a,new an(s^961)),U5(r,e.style,e.w,o,new an(s^119)),r.translate(-e.x,-e.y),wo(r,e.x-ja-20,e.y-ja-20,e.w+ja*2+40,e.h+ja*2+40),r.restore()}const jn=po,Pr=R5(jn.theme),oa={"prop.fourteen":{z:Cn.wall+.004,thick:0,paint:!0},"prop.marks":{z:Cn.wall+.004,thick:0,paint:!0},"prop.window":{z:Cn.wall+.07,thick:.05},"prop.lamp":{z:-.95,thick:.03},"prop.bed":{z:-.55,thick:.06,lean:-.05},"prop.chest":{z:-.62,thick:.06,lean:.04},"prop.blocks":{z:-.4,thick:.06,lean:.06},"prop.toyhorse":{z:-.3,thick:.04,lean:-.12},"prop.toywhale":{z:-.2,thick:.05,lean:.1},"prop.rootdoor.open":{z:-.3,thick:.08},"prop.fossil":{z:Cn.wall+.012,thick:0,paint:!0}},S0=2,Kl={x:745,y:430,width:150},F5=new URL(""+new URL("p1-house-of-the-stranger-DZAUcsIe.jpg",import.meta.url).href,import.meta.url).href,O5=[{x:-300,y:-240,w:2800,h:240,style:"soil"},{x:-300,y:0,w:300,h:780,style:"soil"},{x:2200,y:0,w:300,h:440,style:"soil"},{x:2200,y:660,w:300,h:120,style:"soil"},{x:-300,y:780,w:2800,h:260,style:"soil"}],ti={x:-300,y:-240,w:2800,h:1280,res:1.25};function Rl(n,e,t=16777215){const[i]=ns(512,400);return _a(i,{x:0,y:0,w:560,h:600,style:n},{x:24,y:30},Pr.terrain,bs(`${jn.id}:${e}`)),new Oi({map:Ro(i,!0),color:t})}function B5(){const n=Pr.layers[0],e=2600,[t,i]=ns(e,700),s=766;return i.fillStyle="#c9c7c4",i.fillRect(0,0,e,700),i.translate(0,155),n.draw(i,{w:e,h:s,horizon:s*.6},new an(bs(`${jn.id}:layer:0`))),Ro(t)}function $5(){const[n,e]=ns(ti.w*ti.res,ti.h*ti.res);e.scale(ti.res,ti.res);const t={x:ti.x,y:ti.y};return O5.forEach((i,s)=>_a(n,i,t,Pr.terrain,bs(`${jn.id}:pad:${s}`))),jn.solids.forEach((i,s)=>{i.hidden||i.style==="none"||i.style==="root"||_a(n,i,t,Pr.terrain,bs(`${jn.id}:${s}`))}),e.clearRect(163-ti.x,596-ti.y,2600,64.5),xr(n)}function G5(){const[e,t]=ns(2580,450);t.scale(1.5,1.5);for(const s of[0,1])t.save(),t.beginPath(),t.rect(0,150*s,1720,150),t.clip(),_a(e,{x:0,y:0,w:1720,h:400,style:"floor"},{x:0,y:30-150*s},Pr.terrain,bs(`${jn.id}:boards:${s}`)),t.restore();const i=Ro(e);return i.wrapT=1e3,i}function z5(){const[n]=ns(600,240);_a(n,{x:0,y:0,w:600,h:400,style:"soil"},{x:0,y:40},Pr.terrain,bs(`${jn.id}:tunnelfloor`));const e=Ro(n);return e.wrapS=e.wrapT=1e3,e}function H5(n,e,t,i=0){const s=n.getAttribute("position"),r=n.getAttribute("uv");for(let o=0;o<s.count;o++)r.setXY(o,(s.getX(o)-i)/e,-s.getZ(o)/t)}function uf(n,e,t,i,s,r=0){const o=new Ri(e-n,Cn.front-Cn.wall);o.rotateX(-Math.PI/2),o.translate((n+e)/2,0,(Cn.front+Cn.wall)/2),H5(o,i,s,r);const a=new tn(o,t);return a.receiveShadow=!0,a}function eo(n,e,t,i){const s=new tn(new Ri(e,t),new va({map:n,color:3023672,transparent:!0,opacity:i,depthWrite:!1,side:2}));return s.renderOrder=1,s}async function V5(n){const e=oa[n.key];if(!e)return null;const t=vr(n.key),i=xr(await mo(t,S0)),s=n.scale??1,r=ro({tex:i,w:t.w*s,h:t.h*s,ox:n.ox??.5,oy:n.oy??1,thick:e.thick});return r.position.set(dt(n.x),sn(n.y),e.z),e.lean&&(r.rotation.y=e.lean),r.name=n.key,r}function W5(n){const e=new Ai,t=Kl.width*Pn,i=12*Pn,s=.05,r=new Oi({color:7162675}),o=new Oi({color:13610602}),a=(m,_,p,g)=>{const b=new tn(new Ss(m,_,s),r);b.position.set(p,g,0),b.castShadow=!0,b.receiveShadow=!0,e.add(b)},c=t/2+i/2;a(t+i*2,i,0,c),a(t+i*2,i,0,-c),a(i,t,-c,0),a(i,t,c,0);const l=new tn(new Ss(t+8*Pn,t+8*Pn,s*.5),o);l.position.z=-s*.2,l.receiveShadow=!0,e.add(l);const h=new tn(new Ri(t,t),new Oi({map:n}));h.position.z=s*.1,h.receiveShadow=!0,e.add(h);const u=new Oi({color:4866128}),f=t/2+i;for(const m of[-1,1]){const _=new z(m*f*.55,f-.02,-s/2),p=new z(0,f+.34,-.09),g=_.distanceTo(p),b=new tn(new fo(.006,.006,g,5),u);b.position.copy(_).add(p).multiplyScalar(.5),b.quaternion.setFromUnitVectors(new z(0,1,0),p.clone().sub(_).normalize()),b.castShadow=!0,e.add(b)}const d=new tn(new fo(.03,.03,.05,10),new Oi({color:9210514}));return d.rotation.x=Math.PI/2,d.position.set(0,f+.35,-.09),d.castShadow=!0,e.add(d),e}async function X5(){const n=new Ai;n.name="r01";const e=k4(),t=Hl([[0,.9],[.45,.55],[1,0]]),i=B5(),s=new tn(new Ri(26,7),new Oi({map:i}));s.position.set(dt(1100),sn(350),Cn.wall),s.receiveShadow=!0,n.add(s);const r=Rl("soil","earth"),o=Rl("soil","tunnel",10325906),a=Rl("root","rootslab"),c=new tn(new Ri(dt(800),sn(420)-sn(680)),o);c.position.set(dt(2120),(sn(420)+sn(680))/2,Cn.wall+.005),c.receiveShadow=!0,n.add(c);const l=Cn.wall-.3,h=Cn.front-.02,u=[5.12,4];for(const V of[Qa(-3,0,dt(160),sn(-240),l,h,r,u),Qa(dt(160),sn(130),dt(1700),sn(-240),l,h,r,u),Qa(dt(1700),sn(430),dt(1770),sn(130),l,.05,a,u),Qa(dt(1770),sn(440),dt(2500),sn(-240),l,h,r,u)])V.castShadow=!1,n.add(V);const f=new tn(mc(ti.w,ti.h,0,0),yr($5()));f.position.set(dt(ti.x),sn(ti.y),Cn.front),f.receiveShadow=!0,n.add(f);const d=new Oi({map:G5(),color:new bt(1.16,1.16,1.16)});n.add(uf(dt(160),dt(1720),d,dt(1720),3));const m=new Oi({map:z5(),color:new bt(1.1,1.1,1.1)});n.add(uf(dt(1720),dt(2500),m,dt(600),2.4,dt(1720)));const _=eo(e,dt(1560),.4,.18);_.position.set(dt(930),.2,Cn.wall+.003),n.add(_);const p=eo(e,dt(1560),.6,.2);p.rotation.x=Math.PI/2,p.position.set(dt(930),.002,Cn.wall+.3),n.add(p);const g=eo(e,dt(1540),.6,.35);g.rotation.z=Math.PI,g.position.set(dt(930),sn(130)-.3,Cn.wall+.003),n.add(g);const b=eo(e,sn(130),.5,.25);b.rotation.z=-Math.PI/2,b.position.set(dt(160)+.25,sn(130)/2,Cn.wall+.003),n.add(b);const E=new Map,v=await Promise.all((jn.props??[]).map(V=>V5(V)));let S=null;for(const[V,se]of v.entries()){if(!se)continue;const K=jn.props[V],ne=oa[K.key];if(K.key==="prop.lamp"&&(S=se),n.add(se),!ne.paint&&K.key!=="prop.lamp"&&K.key!=="prop.window"){const Be=vr(K.key).w*(K.scale??1)*Pn,Oe=Vl(t,Be*1.05,.34,.55);Oe.position.set(dt(K.x),.003,ne.z+.02),n.add(Oe)}}for(const V of jn.checkpoints){if(V.silent)continue;const se=vr("prop.lantern"),K=ro({tex:xr(await mo(se,S0)),w:se.w,h:se.h,ox:.5,oy:1,thick:.04});K.position.set(dt(V.x-46),sn(V.y+2),-.12),n.add(K);const ne=Vl(t,se.w*Pn*1.1,.25,.45);ne.position.set(dt(V.x-46),.003,-.1),n.add(ne)}for(const V of jn.solids){if(!V.oneWay)continue;const se=V.x+V.w/2,K=jn.props.find(ne=>oa[ne.key]&&!oa[ne.key].paint&&Math.abs(ne.x-se)<90&&ne.y>=600);K&&E.set(V,oa[K.key].z+.1)}const T=W5(await U4(F5));T.position.set(dt(Kl.x),sn(Kl.y),Cn.wall+.11),n.add(T);const L=new xu(16250367,15920098,1.2);n.add(L),n.add(new bu(16775924,.12));const x=new sh(15659263,.8);x.position.set(.75,.15,.64),n.add(x);const w=new sh(16775924,2.2);w.castShadow=!0,w.shadow.mapSize.set(2048,2048),w.shadow.camera.near=1,w.shadow.camera.far=40,w.shadow.bias=-4e-4,w.shadow.normalBias=.012,w.shadow.radius=6,w.shadow.intensity=.82,n.add(w),n.add(w.target);const I=new ih(16757867,2.4,6,1.6),O=Hl([[0,1],[.25,.45],[1,0]]),U=sf(O,16761469,1.5,.45),G=sf(O,16773320,.55,.6);if(S){const V=new In;V.position.set(0,-1.46,.05),S.add(V),V.add(I,U,G)}const P=new ih(12098815,.9,3.2,1.6);P.position.set(dt(1441),sn(400),Cn.wall+.5),n.add(P);const $=new Ai;{const[K,ne]=ns(3200,150);A5(ne,3200,150,jn.theme,new an(bs(`${jn.id}:fg`)));const he=ro({tex:xr(K),w:3200,h:150,ox:0,oy:1,thick:.05});he.scale.y=.5,he.position.set(dt(-500),-.03,Cn.front-.25),$.add(he);const Be=[["prop.crystals.teal",360,4.6,1.55],["prop.crystals.orange",1150,4.75,1.35],["prop.crystals.blue",1590,4.5,1.6]];for(const[Oe,me,Ae,Ve]of Be){const j=vr(Oe),re=ro({tex:xr(await mo(j,1.5)),w:j.w*Ve,h:j.h*Ve,ox:.5,oy:1,thick:.05});re.position.set(dt(me),-.5,Ae),$.add(re)}}n.add($);const Z={lamp:I.intensity,window:P.intensity};return{group:n,key:w,platformZ:E,foreground:$,update(V){S&&(S.rotation.z=.018*Math.sin(V*.8)+.006*Math.sin(V*2.1+1));const se=1+.035*Math.sin(V*11.3)+.025*Math.sin(V*6.1+2)+.02*Math.sin(V*17.9);I.intensity=Z.lamp*se,U.material.opacity=.42*se,P.intensity=Z.window*(1+.08*Math.sin(V*.7))}}}const la=new URLSearchParams(location.search),Cl=document.getElementById("view"),q5=document.getElementById("fx"),b0=document.getElementById("loading");la.has("shot")&&document.body.classList.add("shot");const Us=1/60,Ll=new z(-.56,.4,.73).normalize(),Pl=po.checkpoints[0];async function Y5(){const n=new E2({antialias:!1,powerPreference:"high-performance"});n.shadowMap.enabled=!0,n.shadowMap.type=1,n.toneMapping=0,Cl.prepend(n.domElement),P4(Math.min(8,n.capabilities.getMaxAnisotropy()));const e=new Q0;e.background=new bt(1907240);const t=await X5();e.add(t.group);const i=T4().find(me=>me.id==="gorti.root.child"),s=await gc.create(i);e.add(s.root);const r=po.solids.filter(me=>me.style!=="none"),o=new l5(s,r,t.platformZ,580,Pl.y,po.width);o.place(580,Pl.y,1);const a=Hl([[0,.95],[.5,.6],[1,0]]),c=Vl(a,.95,.3,.6);e.add(c);const l=new F4(16/9,dt(430),dt(1770));l.snap(o);const h=new x5(n,e,l.camera,Number(la.get("msaa")??4));let u=!0;n.info.autoReset=!1;const f=()=>{n.info.reset(),h.render()},d=Number(la.get("dpr")??1.5);let m=Math.min(window.devicePixelRatio||1,d);const _=()=>{const me=Math.max(1,Cl.clientWidth),Ae=Math.max(1,Cl.clientHeight),Ve=m;n.setPixelRatio(Ve),n.setSize(me,Ae,!1),h.setSize(me,Ae,Ve),l.setAspect(me/Ae)};_(),window.addEventListener("resize",_);const p=new Set;let g=!1;const b=new Set(["Space","KeyW","ArrowUp"]);window.addEventListener("keydown",me=>{me.repeat||(p.add(me.code),b.has(me.code)&&(g=!0),me.code==="Digit1"?h.dof=!h.dof:me.code==="Digit2"?h.print=!h.print:me.code==="Digit3"?(u=!u,t.key.castShadow=u):me.code==="KeyG"&&(l.mode=l.mode==="wide"?"follow":"wide"),(b.has(me.code)||me.code.startsWith("Arrow"))&&me.preventDefault(),Z())}),window.addEventListener("keyup",me=>p.delete(me.code)),window.addEventListener("blur",()=>p.clear());for(const[me,Ae]of[["padL","ArrowLeft"],["padR","ArrowRight"],["padJ","Space"]]){const Ve=document.getElementById(me);if(!Ve)continue;Ve.addEventListener("pointerdown",re=>{re.preventDefault(),p.add(Ae),Ae==="Space"&&(g=!0),Ve.classList.add("on")});const j=()=>{p.delete(Ae),Ve.classList.remove("on")};for(const re of["pointerup","pointercancel","pointerleave"])Ve.addEventListener(re,j)}document.getElementById("padG")?.addEventListener("click",()=>{l.mode=l.mode==="wide"?"follow":"wide",Z()});const E=()=>({axis:(p.has("KeyD")||p.has("ArrowRight")?1:0)-(p.has("KeyA")||p.has("ArrowLeft")?1:0),jumpPressed:g,jumpHeld:[...b].some(Ae=>p.has(Ae))}),v=n.domElement;let S=null;v.addEventListener("pointerdown",me=>{S={x:me.clientX,y:me.clientY},l.dragging=!0,v.setPointerCapture(me.pointerId)}),v.addEventListener("pointermove",me=>{S&&(l.dragYaw=Math.max(-.7,Math.min(.7,l.dragYaw-(me.clientX-S.x)*.004)),l.dragPitch=Math.max(-.35,Math.min(.25,l.dragPitch-(me.clientY-S.y)*.003)),S={x:me.clientX,y:me.clientY})});const T=()=>{S=null,l.dragging=!1};v.addEventListener("pointerup",T),v.addEventListener("pointercancel",T);let L=0,x=0;const w=new z,I=new z().crossVectors(new z(0,1,0),Ll).normalize(),O=new z().crossVectors(Ll,I),U=(me,Ae)=>{for(x+=me;x>=Us-1e-9;)o.fixed(Us,{...Ae,jumpPressed:Ae.jumpPressed}),Ae={...Ae,jumpPressed:!1},g=!1,x-=Us;L+=me,o.visual(me),t.update(L),l.update(o,me),h.focus=l.focusDist,t.foreground.visible=l.mode!=="wide";const Ve=o.heightAboveGround(),j=1-Math.min(1,Ve.h/220);c.position.set(dt(o.x),sn(Ve.ground)+.004,o.groundZ()+.02),c.scale.setScalar(.55+.45*j),c.material.opacity=.6*j;const Se=l.mode==="wide"?14:7.5,Je=t.key.shadow.camera;Je.right!==Se&&(Je.left=-Se,Je.right=Se,Je.top=Se*.75,Je.bottom=-Se*.75,Je.updateProjectionMatrix());const Ie=Se*2/t.key.shadow.mapSize.x;w.set(l.focus.x,2.2,-.4);const gt=Math.round(w.dot(I)/Ie)*Ie-w.dot(I),vn=Math.round(w.dot(O)/Ie)*Ie-w.dot(O);w.addScaledVector(I,gt).addScaledVector(O,vn),t.key.target.position.copy(w),t.key.position.copy(w).addScaledVector(Ll,20)};let G=0,P=0,$=0;const Z=()=>{const me=(Ae,Ve,j)=>`<span class="${j?"":"off"}"><b>${Ae}</b> ${Ve}</span>`;q5.innerHTML=`${me("1","Alan derinliği",h.dof)} · ${me("2","Baskı",h.print)} · ${me("3","Gölgeler",u)} · ${me("G","Geniş",l.mode==="wide")}<br>${$?`${$} fps · çözünürlük ${m.toFixed(2)}×`:"…"}`},V=!la.has("dpr")&&!la.has("shot");let se=0,K=0;const ne=me=>{se+=me,K++,!(se<2)&&(V&&K/se<45&&m>.75&&(m=Math.max(.75,m-.25),_()),se=0,K=0)};let he=!1,Be=performance.now();const Oe=me=>{if(he)return;requestAnimationFrame(Oe);const Ae=Math.max(0,(me-Be)/1e3),Ve=Math.min(.05,Ae);Be=me,U(Ve,E()),f(),document.visibilityState==="visible"&&ne(Ae),G++,P+=Ae,P>=.5&&($=Math.round(G/P),G=0,P=0,Z())};U(Us,{axis:0,jumpPressed:!1,jumpHeld:!1}),n.compile(e,l.camera),f(),b0.remove(),Z(),requestAnimationFrame(me=>{Be=me,Oe(me)}),window.__diorama={manual(me){he=me,me||(Be=performance.now(),requestAnimationFrame(Oe))},step(me,Ae={},Ve=!0){const j=Math.max(1,Math.round(me/(Us*1e3))),re={axis:Ae.axis??0,jumpPressed:Ae.jumpPressed??!1,jumpHeld:Ae.jumpHeld??!1};for(let Se=0;Se<j;Se++)U(Us,re),re.jumpPressed=!1;Ve&&f()},place(me,Ae=1,Ve=Pl.y){o.place(me,Ve,Ae),l.snap(o)},camera(me,Ae){if(l.mode=me,Ae){const Ve={target:new z(...Ae.target),dist:Ae.dist,yaw:Ae.yaw,pitch:Ae.pitch,roll:Ae.roll??0,fov:Ae.fov??30};l.fixedPose=Ve}},fx(me){me.dof!==void 0&&(h.dof=me.dof),me.print!==void 0&&(h.print=me.print),me.shadows!==void 0&&(u=me.shadows,t.key.castShadow=u)},state(){return{x:o.x,y:o.y,z:o.z,vx:o.vx,vy:o.vy,onGround:o.onGround,anim:s.anim,fps:$,calls:n.info.render.calls,triangles:n.info.render.triangles,textures:n.info.memory.textures,geometries:n.info.memory.geometries,size:[n.domElement.width,n.domElement.height]}},perf(me=20){const Ae=n.getContext(),Ve=new Uint8Array(4);let j=0;const re=performance.now();for(let Se=0;Se<me;Se++){const Je=performance.now();U(Us,{axis:1,jumpPressed:!1,jumpHeld:!1}),j+=performance.now()-Je,f(),Ae.readPixels(0,0,1,1,Ae.RGBA,Ae.UNSIGNED_BYTE,Ve)}return{ms:(performance.now()-re)/me,simMs:j/me}}},document.body.dataset.ready="1"}Y5().catch(n=>{b0.textContent=`Diorama açılamadı: ${n instanceof Error?n.message:String(n)}`,console.error(n)});
