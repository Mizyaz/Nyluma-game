var hu=Object.defineProperty;var uu=(n,e,t)=>e in n?hu(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Se=(n,e,t)=>uu(n,typeof e!="symbol"?e+"":e,t);const di="srgb",Ro="srgb-linear",Lo="linear",qt="srgb";const a0="300 es";function du(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ca(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function pu(){const n=Ca("canvas");return n.style.display="block",n}const o0={};function Co(...n){const e="THREE."+n.shift();console.log(e,...n)}function zf(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function ft(...n){n=zf(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Gt(...n){n=zf(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Pr(...n){const e=n.join(" ");e in o0||(o0[e]=!0,ft(...n))}function mu(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const gu={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};class rr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const ei=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Jo=Math.PI/180,sc=180/Math.PI;function Is(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ei[n&255]+ei[n>>8&255]+ei[n>>16&255]+ei[n>>24&255]+"-"+ei[e&255]+ei[e>>8&255]+"-"+ei[e>>16&15|64]+ei[e>>24&255]+"-"+ei[t&63|128]+ei[t>>8&255]+"-"+ei[t>>16&255]+ei[t>>24&255]+ei[i&255]+ei[i>>8&255]+ei[i>>16&255]+ei[i>>24&255]).toLowerCase()}function Bt(n,e,t){return Math.max(e,Math.min(t,n))}function _u(n,e){return(n%e+e)%e}function jo(n,e,t){return(1-t)*n+t*e}function Ki(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Jt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Wc=class Wc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Bt(this.x,e.x,t.x),this.y=Bt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Bt(this.x,e,t),this.y=Bt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Bt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Wc.prototype.isVector2=!0;let ht=Wc;class Yr{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let c=i[s+0],l=i[s+1],f=i[s+2],u=i[s+3],h=r[a+0],d=r[a+1],p=r[a+2],_=r[a+3];if(u!==_||c!==h||l!==d||f!==p){let m=c*h+l*d+f*p+u*_;m<0&&(h=-h,d=-d,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){const b=Math.acos(m),E=Math.sin(b);g=Math.sin(g*b)/E,o=Math.sin(o*b)/E,c=c*g+h*o,l=l*g+d*o,f=f*g+p*o,u=u*g+_*o}else{c=c*g+h*o,l=l*g+d*o,f=f*g+p*o,u=u*g+_*o;const b=1/Math.sqrt(c*c+l*l+f*f+u*u);c*=b,l*=b,f*=b,u*=b}}e[t]=c,e[t+1]=l,e[t+2]=f,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],f=i[s+3],u=r[a],h=r[a+1],d=r[a+2],p=r[a+3];return e[t]=o*p+f*u+c*d-l*h,e[t+1]=c*p+f*h+l*u-o*d,e[t+2]=l*p+f*d+o*h-c*u,e[t+3]=f*p-o*u-c*h-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),f=o(s/2),u=o(r/2),h=c(i/2),d=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=h*f*u+l*d*p,this._y=l*d*u-h*f*p,this._z=l*f*p+h*d*u,this._w=l*f*u-h*d*p;break;case"YXZ":this._x=h*f*u+l*d*p,this._y=l*d*u-h*f*p,this._z=l*f*p-h*d*u,this._w=l*f*u+h*d*p;break;case"ZXY":this._x=h*f*u-l*d*p,this._y=l*d*u+h*f*p,this._z=l*f*p+h*d*u,this._w=l*f*u-h*d*p;break;case"ZYX":this._x=h*f*u-l*d*p,this._y=l*d*u+h*f*p,this._z=l*f*p-h*d*u,this._w=l*f*u+h*d*p;break;case"YZX":this._x=h*f*u+l*d*p,this._y=l*d*u+h*f*p,this._z=l*f*p-h*d*u,this._w=l*f*u-h*d*p;break;case"XZY":this._x=h*f*u-l*d*p,this._y=l*d*u-h*f*p,this._z=l*f*p+h*d*u,this._w=l*f*u+h*d*p;break;default:ft("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],f=t[6],u=t[10],h=i+o+u;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(f-c)*d,this._y=(r-l)*d,this._z=(a-s)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(f-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+l)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(r-l)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+f)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-s)/d,this._x=(r+l)/d,this._y=(c+f)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Bt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,f=t._w;return this._x=i*f+a*o+s*l-r*c,this._y=s*f+a*c+r*o-i*l,this._z=r*f+a*l+i*c-s*o,this._w=a*f-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),f=Math.sin(l);c=Math.sin(c*l)/f,t=Math.sin(t*l)/f,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Xc=class Xc{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(l0.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(l0.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*i),f=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+c*l+a*u-o*f,this.y=i+c*f+o*l-r*u,this.z=s+c*u+r*f-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Bt(this.x,e.x,t.x),this.y=Bt(this.y,e.y,t.y),this.z=Bt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Bt(this.x,e,t),this.y=Bt(this.y,e,t),this.z=Bt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Bt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return el.copy(this).projectOnVector(e),this.sub(el)}reflect(e){return this.sub(el.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Xc.prototype.isVector3=!0;let H=Xc;const el=new H,l0=new Yr,qc=class qc{constructor(e,t,i,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,l)}set(e,t,i,s,r,a,o,c,l){const f=this.elements;return f[0]=e,f[1]=s,f[2]=o,f[3]=t,f[4]=r,f[5]=c,f[6]=i,f[7]=a,f[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],f=i[4],u=i[7],h=i[2],d=i[5],p=i[8],_=s[0],m=s[3],g=s[6],b=s[1],E=s[4],v=s[7],S=s[2],T=s[5],P=s[8];return r[0]=a*_+o*b+c*S,r[3]=a*m+o*E+c*T,r[6]=a*g+o*v+c*P,r[1]=l*_+f*b+u*S,r[4]=l*m+f*E+u*T,r[7]=l*g+f*v+u*P,r[2]=h*_+d*b+p*S,r[5]=h*m+d*E+p*T,r[8]=h*g+d*v+p*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],f=e[8];return t*a*f-t*o*l-i*r*f+i*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],f=e[8],u=f*a-o*l,h=o*c-f*r,d=l*r-a*c,p=t*u+i*h+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=u*_,e[1]=(s*l-f*i)*_,e[2]=(o*i-s*a)*_,e[3]=h*_,e[4]=(f*t-s*c)*_,e[5]=(s*r-o*t)*_,e[6]=d*_,e[7]=(i*c-l*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Pr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(tl.makeScale(e,t)),this}rotate(e){return Pr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(tl.makeRotation(-e)),this}translate(e,t){return Pr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(tl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};qc.prototype.isMatrix3=!0;let pt=qc;const tl=new pt,c0=new pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),f0=new pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mu(){const n={enabled:!0,workingColorSpace:Ro,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===qt&&(s.r=us(s.r),s.g=us(s.g),s.b=us(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===qt&&(s.r=Dr(s.r),s.g=Dr(s.g),s.b=Dr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===""?Lo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Pr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Pr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ro]:{primaries:e,whitePoint:i,transfer:Lo,toXYZ:c0,fromXYZ:f0,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:di},outputColorSpaceConfig:{drawingBufferColorSpace:di}},[di]:{primaries:e,whitePoint:i,transfer:qt,toXYZ:c0,fromXYZ:f0,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:di}}}),n}const Ft=Mu();function us(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Dr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let cr;class vu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{cr===void 0&&(cr=Ca("canvas")),cr.width=e.width,cr.height=e.height;const s=cr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=cr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ca("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=us(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(us(t[i]/255)*255):t[i]=us(t[i]);return{data:t,width:e.width,height:e.height}}else return ft("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xu=0;class Sc{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:xu++}),this.uuid=Is(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(nl(s[a].image)):r.push(nl(s[a]))}else r=nl(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function nl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?vu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(ft("Texture: Unable to serialize Texture."),{})}let yu=0;const il=new H;class Qn extends rr{constructor(e=Qn.DEFAULT_IMAGE,t=Qn.DEFAULT_MAPPING,i=1001,s=1001,r=1006,a=1008,o=1023,c=1009,l=Qn.DEFAULT_ANISOTROPY,f=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yu++}),this.uuid=Is(),this.name="",this.source=new Sc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(il).x}get height(){return this.source.getSize(il).y}get depth(){return this.source.getSize(il).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){ft(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ft(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Qn.DEFAULT_IMAGE=null;Qn.DEFAULT_MAPPING=300;Qn.DEFAULT_ANISOTROPY=1;const Zc=class Zc{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const c=e.elements,l=c[0],f=c[4],u=c[8],h=c[1],d=c[5],p=c[9],_=c[2],m=c[6],g=c[10];if(Math.abs(f-h)<.01&&Math.abs(u-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(f+h)<.1&&Math.abs(u+_)<.1&&Math.abs(p+m)<.1&&Math.abs(l+d+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(l+1)/2,v=(d+1)/2,S=(g+1)/2,T=(f+h)/4,P=(u+_)/4,x=(p+m)/4;return E>v&&E>S?E<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(E),s=T/i,r=P/i):v>S?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=T/s,r=x/s):S<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),i=P/r,s=x/r),this.set(i,s,r,t),this}let b=Math.sqrt((m-p)*(m-p)+(u-_)*(u-_)+(h-f)*(h-f));return Math.abs(b)<.001&&(b=1),this.x=(m-p)/b,this.y=(u-_)/b,this.z=(h-f)/b,this.w=Math.acos((l+d+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Bt(this.x,e.x,t.x),this.y=Bt(this.y,e.y,t.y),this.z=Bt(this.z,e.z,t.z),this.w=Bt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Bt(this.x,e,t),this.y=Bt(this.y,e,t),this.z=Bt(this.z,e,t),this.w=Bt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Bt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Zc.prototype.isVector4=!0;let Tn=Zc;class Su extends rr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Tn(0,0,e,t),this.scissorTest=!1,this.viewport=new Tn(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},r=new Qn(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Sc(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class mi extends Su{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Hf extends Qn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class bu extends Qn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const No=class No{constructor(e,t,i,s,r,a,o,c,l,f,u,h,d,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,l,f,u,h,d,p,_,m)}set(e,t,i,s,r,a,o,c,l,f,u,h,d,p,_,m){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=c,g[2]=l,g[6]=f,g[10]=u,g[14]=h,g[3]=d,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new No().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/fr.setFromMatrixColumn(e,0).length(),r=1/fr.setFromMatrixColumn(e,1).length(),a=1/fr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),f=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const h=a*f,d=a*u,p=o*f,_=o*u;t[0]=c*f,t[4]=-c*u,t[8]=l,t[1]=d+p*l,t[5]=h-_*l,t[9]=-o*c,t[2]=_-h*l,t[6]=p+d*l,t[10]=a*c}else if(e.order==="YXZ"){const h=c*f,d=c*u,p=l*f,_=l*u;t[0]=h+_*o,t[4]=p*o-d,t[8]=a*l,t[1]=a*u,t[5]=a*f,t[9]=-o,t[2]=d*o-p,t[6]=_+h*o,t[10]=a*c}else if(e.order==="ZXY"){const h=c*f,d=c*u,p=l*f,_=l*u;t[0]=h-_*o,t[4]=-a*u,t[8]=p+d*o,t[1]=d+p*o,t[5]=a*f,t[9]=_-h*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const h=a*f,d=a*u,p=o*f,_=o*u;t[0]=c*f,t[4]=p*l-d,t[8]=h*l+_,t[1]=c*u,t[5]=_*l+h,t[9]=d*l-p,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const h=a*c,d=a*l,p=o*c,_=o*l;t[0]=c*f,t[4]=_-h*u,t[8]=p*u+d,t[1]=u,t[5]=a*f,t[9]=-o*f,t[2]=-l*f,t[6]=d*u+p,t[10]=h-_*u}else if(e.order==="XZY"){const h=a*c,d=a*l,p=o*c,_=o*l;t[0]=c*f,t[4]=-u,t[8]=l*f,t[1]=h*u+_,t[5]=a*f,t[9]=d*u-p,t[2]=p*u-d,t[6]=o*f,t[10]=_*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Tu,e,Eu)}lookAt(e,t,i){const s=this.elements;return vi.subVectors(e,t),vi.lengthSq()===0&&(vi.z=1),vi.normalize(),ys.crossVectors(i,vi),ys.lengthSq()===0&&(Math.abs(i.z)===1?vi.x+=1e-4:vi.z+=1e-4,vi.normalize(),ys.crossVectors(i,vi)),ys.normalize(),Ha.crossVectors(vi,ys),s[0]=ys.x,s[4]=Ha.x,s[8]=vi.x,s[1]=ys.y,s[5]=Ha.y,s[9]=vi.y,s[2]=ys.z,s[6]=Ha.z,s[10]=vi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],f=i[1],u=i[5],h=i[9],d=i[13],p=i[2],_=i[6],m=i[10],g=i[14],b=i[3],E=i[7],v=i[11],S=i[15],T=s[0],P=s[4],x=s[8],A=s[12],I=s[1],B=s[5],U=s[9],z=s[13],D=s[2],G=s[6],K=s[10],W=s[14],le=s[3],Q=s[7],ae=s[11],de=s[15];return r[0]=a*T+o*I+c*D+l*le,r[4]=a*P+o*B+c*G+l*Q,r[8]=a*x+o*U+c*K+l*ae,r[12]=a*A+o*z+c*W+l*de,r[1]=f*T+u*I+h*D+d*le,r[5]=f*P+u*B+h*G+d*Q,r[9]=f*x+u*U+h*K+d*ae,r[13]=f*A+u*z+h*W+d*de,r[2]=p*T+_*I+m*D+g*le,r[6]=p*P+_*B+m*G+g*Q,r[10]=p*x+_*U+m*K+g*ae,r[14]=p*A+_*z+m*W+g*de,r[3]=b*T+E*I+v*D+S*le,r[7]=b*P+E*B+v*G+S*Q,r[11]=b*x+E*U+v*K+S*ae,r[15]=b*A+E*z+v*W+S*de,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],f=e[2],u=e[6],h=e[10],d=e[14],p=e[3],_=e[7],m=e[11],g=e[15],b=c*d-l*h,E=o*d-l*u,v=o*h-c*u,S=a*d-l*f,T=a*h-c*f,P=a*u-o*f;return t*(_*b-m*E+g*v)-i*(p*b-m*S+g*T)+s*(p*E-_*S+g*P)-r*(p*v-_*T+m*P)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],f=e[10];return t*(a*f-o*l)-i*(r*f-o*c)+s*(r*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],f=e[8],u=e[9],h=e[10],d=e[11],p=e[12],_=e[13],m=e[14],g=e[15],b=t*o-i*a,E=t*c-s*a,v=t*l-r*a,S=i*c-s*o,T=i*l-r*o,P=s*l-r*c,x=f*_-u*p,A=f*m-h*p,I=f*g-d*p,B=u*m-h*_,U=u*g-d*_,z=h*g-d*m,D=b*z-E*U+v*B+S*I-T*A+P*x;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const G=1/D;return e[0]=(o*z-c*U+l*B)*G,e[1]=(s*U-i*z-r*B)*G,e[2]=(_*P-m*T+g*S)*G,e[3]=(h*T-u*P-d*S)*G,e[4]=(c*I-a*z-l*A)*G,e[5]=(t*z-s*I+r*A)*G,e[6]=(m*v-p*P-g*E)*G,e[7]=(f*P-h*v+d*E)*G,e[8]=(a*U-o*I+l*x)*G,e[9]=(i*I-t*U-r*x)*G,e[10]=(p*T-_*v+g*b)*G,e[11]=(u*v-f*T-d*b)*G,e[12]=(o*A-a*B-c*x)*G,e[13]=(t*B-i*A+s*x)*G,e[14]=(_*E-p*S-m*b)*G,e[15]=(f*S-u*E+h*b)*G,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,l=r*a,f=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,f*o+i,f*c-s*a,0,l*c-s*o,f*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,f=a+a,u=o+o,h=r*l,d=r*f,p=r*u,_=a*f,m=a*u,g=o*u,b=c*l,E=c*f,v=c*u,S=i.x,T=i.y,P=i.z;return s[0]=(1-(_+g))*S,s[1]=(d+v)*S,s[2]=(p-E)*S,s[3]=0,s[4]=(d-v)*T,s[5]=(1-(h+g))*T,s[6]=(m+b)*T,s[7]=0,s[8]=(p+E)*P,s[9]=(m-b)*P,s[10]=(1-(h+_))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=fr.set(s[0],s[1],s[2]).length();const o=fr.set(s[4],s[5],s[6]).length(),c=fr.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Ii.copy(this);const l=1/a,f=1/o,u=1/c;return Ii.elements[0]*=l,Ii.elements[1]*=l,Ii.elements[2]*=l,Ii.elements[4]*=f,Ii.elements[5]*=f,Ii.elements[6]*=f,Ii.elements[8]*=u,Ii.elements[9]*=u,Ii.elements[10]*=u,t.setFromRotationMatrix(Ii),i.x=a,i.y=o,i.z=c,this}makePerspective(e,t,i,s,r,a,o=2e3,c=!1){const l=this.elements,f=2*r/(t-e),u=2*r/(i-s),h=(t+e)/(t-e),d=(i+s)/(i-s);let p,_;if(c)p=r/(a-r),_=a*r/(a-r);else if(o===2e3)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===2001)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=f,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=2e3,c=!1){const l=this.elements,f=2/(t-e),u=2/(i-s),h=-(t+e)/(t-e),d=-(i+s)/(i-s);let p,_;if(c)p=1/(a-r),_=a/(a-r);else if(o===2e3)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===2001)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=f,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};No.prototype.isMatrix4=!0;let En=No;const fr=new H,Ii=new En,Tu=new H(0,0,0),Eu=new H(1,1,1),ys=new H,Ha=new H,vi=new H,h0=new En,u0=new Yr;class Ns{constructor(e=0,t=0,i=0,s=Ns.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],f=s[9],u=s[2],h=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(Bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Bt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Bt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Bt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Bt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-f,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-f,d),this._y=0);break;default:ft("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return h0.makeRotationFromQuaternion(e),this.setFromRotationMatrix(h0,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return u0.setFromEuler(this),this.setFromQuaternion(u0,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ns.DEFAULT_ORDER="XYZ";class Vf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let wu=0;const d0=new H,hr=new Yr,es=new En,Va=new H,ra=new H,Au=new H,Ru=new Yr,p0=new H(1,0,0),m0=new H(0,1,0),g0=new H(0,0,1),_0={type:"added"},Lu={type:"removed"},ur={type:"childadded",child:null},sl={type:"childremoved",child:null};class zn extends rr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=Is(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zn.DEFAULT_UP.clone();const e=new H,t=new Ns,i=new Yr,s=new H(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new En},normalMatrix:{value:new pt}}),this.matrix=new En,this.matrixWorld=new En,this.matrixAutoUpdate=zn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return hr.setFromAxisAngle(e,t),this.quaternion.multiply(hr),this}rotateOnWorldAxis(e,t){return hr.setFromAxisAngle(e,t),this.quaternion.premultiply(hr),this}rotateX(e){return this.rotateOnAxis(p0,e)}rotateY(e){return this.rotateOnAxis(m0,e)}rotateZ(e){return this.rotateOnAxis(g0,e)}translateOnAxis(e,t){return d0.copy(e).applyQuaternion(this.quaternion),this.position.add(d0.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(p0,e)}translateY(e){return this.translateOnAxis(m0,e)}translateZ(e){return this.translateOnAxis(g0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(es.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Va.copy(e):Va.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ra.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?es.lookAt(ra,Va,this.up):es.lookAt(Va,ra,this.up),this.quaternion.setFromRotationMatrix(es),s&&(es.extractRotation(s.matrixWorld),hr.setFromRotationMatrix(es),this.quaternion.premultiply(hr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Gt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_0),ur.child=e,this.dispatchEvent(ur),ur.child=null):Gt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Lu),sl.child=e,this.dispatchEvent(sl),sl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),es.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),es.multiply(e.parent.matrixWorld)),e.applyMatrix4(es),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_0),ur.child=e,this.dispatchEvent(ur),ur.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ra,e,Au),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ra,Ru,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,f=c.length;l<f;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),f=a(e.images),u=a(e.shapes),h=a(e.skeletons),d=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),f.length>0&&(i.images=f),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const c=[];for(const l in o){const f=o[l];delete f.metadata,c.push(f)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}zn.DEFAULT_UP=new H(0,1,0);zn.DEFAULT_MATRIX_AUTO_UPDATE=!0;zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Oi extends zn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Cu={type:"move"};class rl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),g=this._getHandJoint(l,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const f=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=f.position.distanceTo(u.position),d=.02,p=.005;l.inputState.pinching&&h>d+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=d-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Oi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Wf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ss={h:0,s:0,l:0},Wa={h:0,s:0,l:0};function al(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Lt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=di){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ft.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ft.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ft.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ft.workingColorSpace){if(e=_u(e,1),t=Bt(t,0,1),i=Bt(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=al(a,r,e+1/3),this.g=al(a,r,e),this.b=al(a,r,e-1/3)}return Ft.colorSpaceToWorking(this,s),this}setStyle(e,t=di){function i(r){r!==void 0&&parseFloat(r)<1&&ft("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ft("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ft("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=di){const i=Wf[e.toLowerCase()];return i!==void 0?this.setHex(i,t):ft("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=us(e.r),this.g=us(e.g),this.b=us(e.b),this}copyLinearToSRGB(e){return this.r=Dr(e.r),this.g=Dr(e.g),this.b=Dr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=di){return Ft.workingToColorSpace(ti.copy(this),e),Math.round(Bt(ti.r*255,0,255))*65536+Math.round(Bt(ti.g*255,0,255))*256+Math.round(Bt(ti.b*255,0,255))}getHexString(e=di){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ft.workingColorSpace){Ft.workingToColorSpace(ti.copy(this),t);const i=ti.r,s=ti.g,r=ti.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const f=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=f<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=f,e}getRGB(e,t=Ft.workingColorSpace){return Ft.workingToColorSpace(ti.copy(this),t),e.r=ti.r,e.g=ti.g,e.b=ti.b,e}getStyle(e=di){Ft.workingToColorSpace(ti.copy(this),e);const t=ti.r,i=ti.g,s=ti.b;return e!==di?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Ss),this.setHSL(Ss.h+e,Ss.s+t,Ss.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ss),e.getHSL(Wa);const i=jo(Ss.h,Wa.h,t),s=jo(Ss.s,Wa.s,t),r=jo(Ss.l,Wa.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ti=new Lt;Lt.NAMES=Wf;class Pu extends zn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ns,this.environmentIntensity=1,this.environmentRotation=new Ns,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Fi=new H,ts=new H,ol=new H,ns=new H,dr=new H,pr=new H,M0=new H,ll=new H,cl=new H,fl=new H,hl=new Tn,ul=new Tn,dl=new Tn;class Ri{constructor(e=new H,t=new H,i=new H){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Fi.subVectors(e,t),s.cross(Fi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Fi.subVectors(s,t),ts.subVectors(i,t),ol.subVectors(e,t);const a=Fi.dot(Fi),o=Fi.dot(ts),c=Fi.dot(ol),l=ts.dot(ts),f=ts.dot(ol),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const h=1/u,d=(l*c-o*f)*h,p=(a*f-o*c)*h;return r.set(1-d-p,p,d)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,ns)===null?!1:ns.x>=0&&ns.y>=0&&ns.x+ns.y<=1}static getInterpolation(e,t,i,s,r,a,o,c){return this.getBarycoord(e,t,i,s,ns)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ns.x),c.addScaledVector(a,ns.y),c.addScaledVector(o,ns.z),c)}static getInterpolatedAttribute(e,t,i,s,r,a){return hl.setScalar(0),ul.setScalar(0),dl.setScalar(0),hl.fromBufferAttribute(e,t),ul.fromBufferAttribute(e,i),dl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(hl,r.x),a.addScaledVector(ul,r.y),a.addScaledVector(dl,r.z),a}static isFrontFacing(e,t,i,s){return Fi.subVectors(i,t),ts.subVectors(e,t),Fi.cross(ts).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fi.subVectors(this.c,this.b),ts.subVectors(this.a,this.b),Fi.cross(ts).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ri.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ri.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return Ri.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return Ri.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ri.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;dr.subVectors(s,i),pr.subVectors(r,i),ll.subVectors(e,i);const c=dr.dot(ll),l=pr.dot(ll);if(c<=0&&l<=0)return t.copy(i);cl.subVectors(e,s);const f=dr.dot(cl),u=pr.dot(cl);if(f>=0&&u<=f)return t.copy(s);const h=c*u-f*l;if(h<=0&&c>=0&&f<=0)return a=c/(c-f),t.copy(i).addScaledVector(dr,a);fl.subVectors(e,r);const d=dr.dot(fl),p=pr.dot(fl);if(p>=0&&d<=p)return t.copy(r);const _=d*l-c*p;if(_<=0&&l>=0&&p<=0)return o=l/(l-p),t.copy(i).addScaledVector(pr,o);const m=f*p-d*u;if(m<=0&&u-f>=0&&d-p>=0)return M0.subVectors(r,s),o=(u-f)/(u-f+(d-p)),t.copy(s).addScaledVector(M0,o);const g=1/(m+_+h);return a=_*g,o=h*g,t.copy(i).addScaledVector(dr,a).addScaledVector(pr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Na{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ui.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ui.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Ui.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ui):Ui.fromBufferAttribute(r,a),Ui.applyMatrix4(e.matrixWorld),this.expandByPoint(Ui);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Xa.copy(i.boundingBox)),Xa.applyMatrix4(e.matrixWorld),this.union(Xa)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ui),Ui.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(aa),qa.subVectors(this.max,aa),mr.subVectors(e.a,aa),gr.subVectors(e.b,aa),_r.subVectors(e.c,aa),bs.subVectors(gr,mr),Ts.subVectors(_r,gr),Ws.subVectors(mr,_r);let t=[0,-bs.z,bs.y,0,-Ts.z,Ts.y,0,-Ws.z,Ws.y,bs.z,0,-bs.x,Ts.z,0,-Ts.x,Ws.z,0,-Ws.x,-bs.y,bs.x,0,-Ts.y,Ts.x,0,-Ws.y,Ws.x,0];return!pl(t,mr,gr,_r,qa)||(t=[1,0,0,0,1,0,0,0,1],!pl(t,mr,gr,_r,qa))?!1:(Za.crossVectors(bs,Ts),t=[Za.x,Za.y,Za.z],pl(t,mr,gr,_r,qa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ui).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ui).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(is[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),is[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),is[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),is[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),is[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),is[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),is[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),is[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(is),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const is=[new H,new H,new H,new H,new H,new H,new H,new H],Ui=new H,Xa=new Na,mr=new H,gr=new H,_r=new H,bs=new H,Ts=new H,Ws=new H,aa=new H,qa=new H,Za=new H,Xs=new H;function pl(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Xs.fromArray(n,r);const o=s.x*Math.abs(Xs.x)+s.y*Math.abs(Xs.y)+s.z*Math.abs(Xs.z),c=e.dot(Xs),l=t.dot(Xs),f=i.dot(Xs);if(Math.max(-Math.max(c,l,f),Math.min(c,l,f))>o)return!1}return!0}const Fn=new H,Ya=new ht;let Du=0;class Ji extends rr{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Du++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ya.fromBufferAttribute(this,t),Ya.applyMatrix3(e),this.setXY(t,Ya.x,Ya.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Fn.fromBufferAttribute(this,t),Fn.applyMatrix3(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Fn.fromBufferAttribute(this,t),Fn.applyMatrix4(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Fn.fromBufferAttribute(this,t),Fn.applyNormalMatrix(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Fn.fromBufferAttribute(this,t),Fn.transformDirection(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ki(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Jt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ki(t,this.array)),t}setX(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ki(t,this.array)),t}setY(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ki(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ki(t,this.array)),t}setW(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array),s=Jt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array),s=Jt(s,this.array),r=Jt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Xf extends Ji{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class qf extends Ji{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class gi extends Ji{constructor(e,t,i){super(new Float32Array(e),t,i)}}const ku=new Na,oa=new H,ml=new H;class bc{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):ku.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;oa.subVectors(e,this.center);const t=oa.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(oa,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ml.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(oa.copy(e.center).add(ml)),this.expandByPoint(oa.copy(e.center).sub(ml))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Iu=0;const Ei=new En,gl=new zn,Mr=new H,xi=new Na,la=new Na,Xn=new H;class Di extends rr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Iu++}),this.uuid=Is(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(du(e)?qf:Xf)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new pt().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ei.makeRotationFromQuaternion(e),this.applyMatrix4(Ei),this}rotateX(e){return Ei.makeRotationX(e),this.applyMatrix4(Ei),this}rotateY(e){return Ei.makeRotationY(e),this.applyMatrix4(Ei),this}rotateZ(e){return Ei.makeRotationZ(e),this.applyMatrix4(Ei),this}translate(e,t,i){return Ei.makeTranslation(e,t,i),this.applyMatrix4(Ei),this}scale(e,t,i){return Ei.makeScale(e,t,i),this.applyMatrix4(Ei),this}lookAt(e){return gl.lookAt(e),gl.updateMatrix(),this.applyMatrix4(gl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mr).negate(),this.translate(Mr.x,Mr.y,Mr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new gi(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ft("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Na);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];xi.setFromBufferAttribute(r),this.morphTargetsRelative?(Xn.addVectors(this.boundingBox.min,xi.min),this.boundingBox.expandByPoint(Xn),Xn.addVectors(this.boundingBox.max,xi.max),this.boundingBox.expandByPoint(Xn)):(this.boundingBox.expandByPoint(xi.min),this.boundingBox.expandByPoint(xi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Gt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new bc);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const i=this.boundingSphere.center;if(xi.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];la.setFromBufferAttribute(o),this.morphTargetsRelative?(Xn.addVectors(xi.min,la.min),xi.expandByPoint(Xn),Xn.addVectors(xi.max,la.max),xi.expandByPoint(Xn)):(xi.expandByPoint(la.min),xi.expandByPoint(la.max))}xi.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Xn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Xn));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,f=o.count;l<f;l++)Xn.fromBufferAttribute(o,l),c&&(Mr.fromBufferAttribute(e,l),Xn.add(Mr)),s=Math.max(s,i.distanceToSquared(Xn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Gt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Gt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new Ji(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let x=0;x<i.count;x++)o[x]=new H,c[x]=new H;const l=new H,f=new H,u=new H,h=new ht,d=new ht,p=new ht,_=new H,m=new H;function g(x,A,I){l.fromBufferAttribute(i,x),f.fromBufferAttribute(i,A),u.fromBufferAttribute(i,I),h.fromBufferAttribute(r,x),d.fromBufferAttribute(r,A),p.fromBufferAttribute(r,I),f.sub(l),u.sub(l),d.sub(h),p.sub(h);const B=1/(d.x*p.y-p.x*d.y);isFinite(B)&&(_.copy(f).multiplyScalar(p.y).addScaledVector(u,-d.y).multiplyScalar(B),m.copy(u).multiplyScalar(d.x).addScaledVector(f,-p.x).multiplyScalar(B),o[x].add(_),o[A].add(_),o[I].add(_),c[x].add(m),c[A].add(m),c[I].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let x=0,A=b.length;x<A;++x){const I=b[x],B=I.start,U=I.count;for(let z=B,D=B+U;z<D;z+=3)g(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const E=new H,v=new H,S=new H,T=new H;function P(x){S.fromBufferAttribute(s,x),T.copy(S);const A=o[x];E.copy(A),E.sub(S.multiplyScalar(S.dot(A))).normalize(),v.crossVectors(T,A);const B=v.dot(c[x])<0?-1:1;a.setXYZW(x,E.x,E.y,E.z,B)}for(let x=0,A=b.length;x<A;++x){const I=b[x],B=I.start,U=I.count;for(let z=B,D=B+U;z<D;z+=3)P(e.getX(z+0)),P(e.getX(z+1)),P(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Ji(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);const s=new H,r=new H,a=new H,o=new H,c=new H,l=new H,f=new H,u=new H;if(e)for(let h=0,d=e.count;h<d;h+=3){const p=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),f.subVectors(a,r),u.subVectors(s,r),f.cross(u),o.fromBufferAttribute(i,p),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),o.add(f),c.add(f),l.add(f),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,d=t.count;h<d;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),f.subVectors(a,r),u.subVectors(s,r),f.cross(u),i.setXYZ(h+0,f.x,f.y,f.z),i.setXYZ(h+1,f.x,f.y,f.z),i.setXYZ(h+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Xn.fromBufferAttribute(e,t),Xn.normalize(),e.setXYZ(t,Xn.x,Xn.y,Xn.z)}toNonIndexed(){function e(o,c){const l=o.array,f=o.itemSize,u=o.normalized,h=new l.constructor(c.length*f);let d=0,p=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*f;for(let g=0;g<f;g++)h[p++]=l[d++]}return new Ji(h,f,u)}if(this.index===null)return ft("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Di,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,i);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let f=0,u=l.length;f<u;f++){const h=l[f],d=e(h,i);c.push(d)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],f=[];for(let u=0,h=l.length;u<h;u++){const d=l[u];f.push(d.toJSON(e.data))}f.length>0&&(s[c]=f,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const l in s){const f=s[l];this.setAttribute(l,f.clone(t))}const r=e.morphAttributes;for(const l in r){const f=[],u=r[l];for(let h=0,d=u.length;h<d;h++)f.push(u[h].clone(t));this.morphAttributes[l]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,f=a.length;l<f;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fu{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=Is()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Is()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Is()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const oi=new H;class Po{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)oi.fromBufferAttribute(this,t),oi.applyMatrix4(e),this.setXYZ(t,oi.x,oi.y,oi.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)oi.fromBufferAttribute(this,t),oi.applyNormalMatrix(e),this.setXYZ(t,oi.x,oi.y,oi.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)oi.fromBufferAttribute(this,t),oi.transformDirection(e),this.setXYZ(t,oi.x,oi.y,oi.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Ki(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Jt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Jt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Jt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Jt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Jt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ki(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ki(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ki(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ki(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array),s=Jt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Jt(t,this.array),i=Jt(i,this.array),s=Jt(s,this.array),r=Jt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Co("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ji(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Po(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Co("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const _l=new H,Uu=new H,Nu=new pt;class Rs{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=_l.subVectors(i,t).cross(Uu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(_l),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Nu.getNormalMatrix(e),s=this.coplanarPoint(_l).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let $u=0;class Kr extends rr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=Is(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Lt(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){ft(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ft(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Lt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Rs().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ht().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ht().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Zf extends Kr{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Lt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let vr;const ca=new H,xr=new H,yr=new H,Sr=new ht,fa=new ht,Yf=new En,Ka=new H,ha=new H,Qa=new H,v0=new ht,Ml=new ht,x0=new ht;class Bu extends zn{constructor(e=new Zf){if(super(),this.isSprite=!0,this.type="Sprite",vr===void 0){vr=new Di;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Fu(t,5);vr.setIndex([0,1,2,0,2,3]),vr.setAttribute("position",new Po(i,3,0,!1)),vr.setAttribute("uv",new Po(i,2,3,!1))}this.geometry=vr,this.material=e,this.center=new ht(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Gt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),xr.setFromMatrixScale(this.matrixWorld),Yf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),yr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&xr.multiplyScalar(-yr.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const a=this.center;Ja(Ka.set(-.5,-.5,0),yr,a,xr,s,r),Ja(ha.set(.5,-.5,0),yr,a,xr,s,r),Ja(Qa.set(.5,.5,0),yr,a,xr,s,r),v0.set(0,0),Ml.set(1,0),x0.set(1,1);let o=e.ray.intersectTriangle(Ka,ha,Qa,!1,ca);if(o===null&&(Ja(ha.set(-.5,.5,0),yr,a,xr,s,r),Ml.set(0,1),o=e.ray.intersectTriangle(Ka,Qa,ha,!1,ca),o===null))return;const c=e.ray.origin.distanceTo(ca);c<e.near||c>e.far||t.push({distance:c,point:ca.clone(),uv:Ri.getInterpolation(ca,Ka,ha,Qa,v0,Ml,x0,new ht),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Ja(n,e,t,i,s,r){Sr.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(fa.x=r*Sr.x-s*Sr.y,fa.y=s*Sr.x+r*Sr.y):fa.copy(Sr),n.copy(e),n.x+=fa.x,n.y+=fa.y,n.applyMatrix4(Yf)}const ss=new H,vl=new H,ja=new H,eo=new H;class Ou{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ss)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ss.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ss.copy(this.origin).addScaledVector(this.direction,t),ss.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){vl.copy(e).add(t).multiplyScalar(.5),ja.copy(t).sub(e).normalize(),eo.copy(this.origin).sub(vl);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ja),o=eo.dot(this.direction),c=-eo.dot(ja),l=eo.lengthSq(),f=Math.abs(1-a*a);let u,h,d,p;if(f>0)if(u=a*c-o,h=a*o-c,p=r*f,u>=0)if(h>=-p)if(h<=p){const _=1/f;u*=_,h*=_,d=u*(u+a*h+2*o)+h*(a*u+h+2*c)+l}else h=r,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*c)+l;else h=-r,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*c)+l;else h<=-p?(u=Math.max(0,-(-a*r+o)),h=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+h*(h+2*c)+l):h<=p?(u=0,h=Math.min(Math.max(-r,-c),r),d=h*(h+2*c)+l):(u=Math.max(0,-(a*r+o)),h=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+h*(h+2*c)+l);else h=a>0?-r:r,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(vl).addScaledVector(ja,h),d}intersectSphere(e,t){if(e.radius<0)return null;ss.subVectors(e.center,this.origin);const i=ss.dot(this.direction),s=ss.dot(ss)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,c;const l=1/this.direction.x,f=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(i=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(i=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),f>=0?(r=(e.min.y-h.y)*f,a=(e.max.y-h.y)*f):(r=(e.max.y-h.y)*f,a=(e.min.y-h.y)*f),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-h.z)*u,c=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,c=(e.min.z-h.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,ss)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,c=o.x,l=o.y,f=o.z,u=e.x-a.x,h=e.y-a.y,d=e.z-a.z,p=t.x-a.x,_=t.y-a.y,m=t.z-a.z,g=i.x-a.x,b=i.y-a.y,E=i.z-a.z,v=Math.abs(c),S=Math.abs(l),T=Math.abs(f);let P,x,A,I,B,U,z,D,G,K,W,le;if(v>=S&&v>=T?(A=c,U=u,G=p,le=g,c>=0?(P=l,x=f,I=h,B=d,z=_,D=m,K=b,W=E):(P=f,x=l,I=d,B=h,z=m,D=_,K=E,W=b)):S>=T?(A=l,U=h,G=_,le=b,l>=0?(P=f,x=c,I=d,B=u,z=m,D=p,K=E,W=g):(P=c,x=f,I=u,B=d,z=p,D=m,K=g,W=E)):(A=f,U=d,G=m,le=E,f>=0?(P=c,x=l,I=u,B=h,z=p,D=_,K=g,W=b):(P=l,x=c,I=h,B=u,z=_,D=p,K=b,W=g)),A===0)return null;const Q=P/A,ae=x/A,de=1/A,Ve=I-Q*U,ze=B-ae*U,Me=z-Q*G,Pe=D-ae*G,Ye=K-Q*le,te=W-ae*le,ce=Ye*Pe-te*Me,we=Ve*te-ze*Ye,st=Me*ze-Pe*Ve;if(s){if(ce<0||we<0||st<0)return null}else if((ce<0||we<0||st<0)&&(ce>0||we>0||st>0))return null;const Ne=ce+we+st;if(Ne===0)return null;const St=de*(ce*U+we*G+st*le);return(Ne>0?St<0:St>0)?null:this.at(St/Ne,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $a extends Kr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ns,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const y0=new En,qs=new Ou,to=new bc,S0=new H,no=new H,io=new H,so=new H,xl=new H,ro=new H,b0=new H,ao=new H;class fn extends zn{constructor(e=new Di,t=new $a){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ro.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const f=o[c],u=r[c];f!==0&&(xl.fromBufferAttribute(u,e),a?ro.addScaledVector(xl,f):ro.addScaledVector(xl.sub(t),f))}t.add(ro)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),to.copy(i.boundingSphere),to.applyMatrix4(r),qs.copy(e.ray).recast(e.near),!(to.containsPoint(qs.origin)===!1&&(qs.intersectSphere(to,S0)===null||qs.origin.distanceToSquared(S0)>(e.far-e.near)**2))&&(y0.copy(r).invert(),qs.copy(e.ray).applyMatrix4(y0),!(i.boundingBox!==null&&qs.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,qs)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,f=r.attributes.uv1,u=r.attributes.normal,h=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=h.length;p<_;p++){const m=h[p],g=a[m.materialIndex],b=Math.max(m.start,d.start),E=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let v=b,S=E;v<S;v+=3){const T=o.getX(v),P=o.getX(v+1),x=o.getX(v+2);s=oo(this,g,e,i,l,f,u,T,P,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=p,g=_;m<g;m+=3){const b=o.getX(m),E=o.getX(m+1),v=o.getX(m+2);s=oo(this,a,e,i,l,f,u,b,E,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,_=h.length;p<_;p++){const m=h[p],g=a[m.materialIndex],b=Math.max(m.start,d.start),E=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let v=b,S=E;v<S;v+=3){const T=v,P=v+1,x=v+2;s=oo(this,g,e,i,l,f,u,T,P,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=p,g=_;m<g;m+=3){const b=m,E=m+1,v=m+2;s=oo(this,a,e,i,l,f,u,b,E,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Gu(n,e,t,i,s,r,a,o){let c;if(e.side===1?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===0,o),c===null)return null;ao.copy(o),ao.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(ao);return l<t.near||l>t.far?null:{distance:l,point:ao.clone(),object:n}}function oo(n,e,t,i,s,r,a,o,c,l){n.getVertexPosition(o,no),n.getVertexPosition(c,io),n.getVertexPosition(l,so);const f=Gu(n,e,t,i,no,io,so,b0);if(f){const u=new H;Ri.getBarycoord(b0,no,io,so,u),s&&(f.uv=Ri.getInterpolatedAttribute(s,o,c,l,u,new ht)),r&&(f.uv1=Ri.getInterpolatedAttribute(r,o,c,l,u,new ht)),a&&(f.normal=Ri.getInterpolatedAttribute(a,o,c,l,u,new H),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const h={a:o,b:c,c:l,normal:new H,materialIndex:0};Ri.getNormal(no,io,so,h.normal),f.face=h,f.barycoord=u}return f}class zu extends Qn{constructor(e=null,t=1,i=1,s,r,a,o,c,l=1003,f=1003,u,h){super(null,a,o,c,l,f,s,r,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Zs=new bc,Hu=new ht(.5,.5),lo=new H;class Tc{constructor(e=new Rs,t=new Rs,i=new Rs,s=new Rs,r=new Rs,a=new Rs){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],f=r[4],u=r[5],h=r[6],d=r[7],p=r[8],_=r[9],m=r[10],g=r[11],b=r[12],E=r[13],v=r[14],S=r[15];if(s[0].setComponents(l-a,d-f,g-p,S-b).normalize(),s[1].setComponents(l+a,d+f,g+p,S+b).normalize(),s[2].setComponents(l+o,d+u,g+_,S+E).normalize(),s[3].setComponents(l-o,d-u,g-_,S-E).normalize(),i)s[4].setComponents(c,h,m,v).normalize(),s[5].setComponents(l-c,d-h,g-m,S-v).normalize();else if(s[4].setComponents(l-c,d-h,g-m,S-v).normalize(),t===2e3)s[5].setComponents(l+c,d+h,g+m,S+v).normalize();else if(t===2001)s[5].setComponents(c,h,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zs)}intersectsSprite(e){Zs.center.set(0,0,0);const t=Hu.distanceTo(e.center);return Zs.radius=.7071067811865476+t,Zs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zs)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(lo.x=s.normal.x>0?e.max.x:e.min.x,lo.y=s.normal.y>0?e.max.y:e.min.y,lo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(lo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Kf extends Qn{constructor(e=[],t=301,i,s,r,a,o,c,l,f){super(e,t,i,s,r,a,o,c,l,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $o extends Qn{constructor(e,t,i,s,r,a,o,c,l){super(e,t,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Br extends Qn{constructor(e,t,i=1014,s,r,a,o=1003,c=1003,l,f=1026,u=1){if(f!==1026&&f!==1027)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:u};super(h,s,r,a,o,c,f,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Sc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Vu extends Br{constructor(e,t=1014,i=301,s,r,a=1003,o=1003,c,l=1026){const f={width:e,height:e,depth:1},u=[f,f,f,f,f,f];super(e,e,t,i,s,r,a,o,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Qf extends Qn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class $s extends Di{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],f=[],u=[];let h=0,d=0;p("z","y","x",-1,-1,i,t,e,a,r,0),p("z","y","x",1,-1,i,t,-e,a,r,1),p("x","z","y",1,1,e,i,t,s,a,2),p("x","z","y",1,-1,e,i,-t,s,a,3),p("x","y","z",1,-1,e,t,i,s,r,4),p("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new gi(l,3)),this.setAttribute("normal",new gi(f,3)),this.setAttribute("uv",new gi(u,2));function p(_,m,g,b,E,v,S,T,P,x,A){const I=v/P,B=S/x,U=v/2,z=S/2,D=T/2,G=P+1,K=x+1;let W=0,le=0;const Q=new H;for(let ae=0;ae<K;ae++){const de=ae*B-z;for(let Ve=0;Ve<G;Ve++){const ze=Ve*I-U;Q[_]=ze*b,Q[m]=de*E,Q[g]=D,l.push(Q.x,Q.y,Q.z),Q[_]=0,Q[m]=0,Q[g]=T>0?1:-1,f.push(Q.x,Q.y,Q.z),u.push(Ve/P),u.push(1-ae/x),W+=1}}for(let ae=0;ae<x;ae++)for(let de=0;de<P;de++){const Ve=h+de+G*ae,ze=h+de+G*(ae+1),Me=h+(de+1)+G*(ae+1),Pe=h+(de+1)+G*ae;c.push(Ve,ze,Pe),c.push(ze,Me,Pe),le+=6}o.addGroup(d,le,A),d+=le,h+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Do extends Di{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const f=[],u=[],h=[],d=[];let p=0;const _=[],m=i/2;let g=0;b(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(f),this.setAttribute("position",new gi(u,3)),this.setAttribute("normal",new gi(h,3)),this.setAttribute("uv",new gi(d,2));function b(){const v=new H,S=new H;let T=0;const P=(t-e)/i;for(let x=0;x<=r;x++){const A=[],I=x/r,B=I*(t-e)+e;for(let U=0;U<=s;U++){const z=U/s,D=z*c+o,G=Math.sin(D),K=Math.cos(D);S.x=B*G,S.y=-I*i+m,S.z=B*K,u.push(S.x,S.y,S.z),v.set(G,P,K).normalize(),h.push(v.x,v.y,v.z),d.push(z,1-I),A.push(p++)}_.push(A)}for(let x=0;x<s;x++)for(let A=0;A<r;A++){const I=_[A][x],B=_[A+1][x],U=_[A+1][x+1],z=_[A][x+1];(e>0||A!==0)&&(f.push(I,B,z),T+=3),(t>0||A!==r-1)&&(f.push(B,U,z),T+=3)}l.addGroup(g,T,0),g+=T}function E(v){const S=p,T=new ht,P=new H;let x=0;const A=v===!0?e:t,I=v===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,m*I,0),h.push(0,I,0),d.push(.5,.5),p++;const B=p;for(let U=0;U<=s;U++){const D=U/s*c+o,G=Math.cos(D),K=Math.sin(D);P.x=A*K,P.y=m*I,P.z=A*G,u.push(P.x,P.y,P.z),h.push(0,I,0),T.x=G*.5+.5,T.y=K*.5*I+.5,d.push(T.x,T.y),p++}for(let U=0;U<s;U++){const z=S+U,D=B+U;v===!0?f.push(D,D+1,z):f.push(D+1,D,z),x+=3}l.addGroup(g,x,v===!0?1:2),g+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Do(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Gi extends Di{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(s),l=o+1,f=c+1,u=e/o,h=t/c,d=[],p=[],_=[],m=[];for(let g=0;g<f;g++){const b=g*h-a;for(let E=0;E<l;E++){const v=E*u-r;p.push(v,-b,0),_.push(0,0,1),m.push(E/o),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let b=0;b<o;b++){const E=b+l*g,v=b+l*(g+1),S=b+1+l*(g+1),T=b+1+l*g;d.push(E,v,T),d.push(v,S,T)}this.setIndex(d),this.setAttribute("position",new gi(p,3)),this.setAttribute("normal",new gi(_,3)),this.setAttribute("uv",new gi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gi(e.width,e.height,e.widthSegments,e.heightSegments)}}function Or(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(T0(s))s.isRenderTargetTexture?(ft("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(T0(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function li(n){const e={};for(let t=0;t<n.length;t++){const i=Or(n[t]);for(const s in i)e[s]=i[s]}return e}function T0(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Wu(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Jf(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ft.workingColorSpace}const Ec={clone:Or,merge:li};var Xu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,qu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _i extends Kr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Xu,this.fragmentShader=qu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Or(e.uniforms),this.uniformsGroups=Wu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new Lt().setHex(s.value);break;case"v2":this.uniforms[i].value=new ht().fromArray(s.value);break;case"v3":this.uniforms[i].value=new H().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Tn().fromArray(s.value);break;case"m3":this.uniforms[i].value=new pt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new En().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class jf extends _i{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Qi extends Kr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Lt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ns,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Zu extends Kr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Yu extends Kr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const yl={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(E0(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!E0(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function E0(n){try{const e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Ku{constructor(e,t,i){const s=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(f){o++,r===!1&&s.onStart!==void 0&&s.onStart(f,a,o),r=!0},this.itemEnd=function(f){a++,s.onProgress!==void 0&&s.onProgress(f,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(f){s.onError!==void 0&&s.onError(f)},this.resolveURL=function(f){return f=f.normalize("NFC"),c?c(f):f},this.setURLModifier=function(f){return c=f,this},this.addHandler=function(f,u){return l.push(f,u),this},this.removeHandler=function(f){const u=l.indexOf(f);return u!==-1&&l.splice(u,2),this},this.getHandler=function(f){for(let u=0,h=l.length;u<h;u+=2){const d=l[u],p=l[u+1];if(d.global&&(d.lastIndex=0),d.test(f))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Qu=new Ku;class wc{constructor(e){this.manager=e!==void 0?e:Qu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}wc.DEFAULT_MATERIAL_NAME="__DEFAULT";const br=new WeakMap;class Ju extends wc{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=yl.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=br.get(a);u===void 0&&(u=[],br.set(a,u)),u.push({onLoad:t,onError:s})}return a}const o=Ca("img");function c(){f(),t&&t(this);const u=br.get(this)||[];for(let h=0;h<u.length;h++){const d=u[h];d.onLoad&&d.onLoad(this)}br.delete(this),r.manager.itemEnd(e)}function l(u){f(),s&&s(u),yl.remove(`image:${e}`);const h=br.get(this)||[];for(let d=0;d<h.length;d++){const p=h[d];p.onError&&p.onError(u)}br.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function f(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),yl.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class ju extends wc{constructor(e){super(e)}load(e,t,i,s){const r=new Qn,a=new Ju(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}}class Bo extends zn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Lt(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class ed extends Bo{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(zn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Lt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Sl=new En,w0=new H,A0=new H;class eh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new En,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Tc,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new Tn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;w0.setFromMatrixPosition(e.matrixWorld),t.position.copy(w0),A0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(A0),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){Sl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Sl,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(Sl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const co=new H,fo=new Yr,Wi=new H;class th extends zn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new En,this.projectionMatrix=new En,this.projectionMatrixInverse=new En,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(co,fo,Wi),Wi.x===1&&Wi.y===1&&Wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(co,fo,Wi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(co,fo,Wi),Wi.x===1&&Wi.y===1&&Wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(co,fo,Wi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Es=new H,R0=new ht,L0=new ht;class yi extends th{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=sc*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Jo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return sc*2*Math.atan(Math.tan(Jo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Es.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Es.x,Es.y).multiplyScalar(-e/Es.z),Es.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Es.x,Es.y).multiplyScalar(-e/Es.z)}getViewSize(e,t){return this.getViewBounds(e,R0,L0),t.subVectors(L0,R0)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Jo*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class td extends eh{constructor(){super(new yi(90,1,.5,500)),this.isPointLightShadow=!0}}class C0 extends Bo{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new td}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Oo extends th{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=f*this.view.offsetY,c=o-f*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class nd extends eh{constructor(){super(new Oo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class P0 extends Bo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zn.DEFAULT_UP),this.updateMatrix(),this.target=new zn,this.shadow=new nd}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class id extends Bo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Tr=-90,Er=1;class sd extends zn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new yi(Tr,Er,e,t);s.layers=this.layers,this.add(s);const r=new yi(Tr,Er,e,t);r.layers=this.layers,this.add(r);const a=new yi(Tr,Er,e,t);a.layers=this.layers,this.add(a);const o=new yi(Tr,Er,e,t);o.layers=this.layers,this.add(o);const c=new yi(Tr,Er,e,t);c.layers=this.layers,this.add(c);const l=new yi(Tr,Er,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===2e3)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===2001)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,f]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),e.setRenderTarget(u,h,d),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class rd extends yi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class ad{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=od.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function od(){this._document.hidden===!1&&this.reset()}const Yc=class Yc{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};Yc.prototype.isMatrix2=!0;let D0=Yc;function k0(n,e,t,i){const s=ld(i);switch(t){case 1021:return n*e;case 1028:return n*e/s.components*s.byteLength;case 1029:return n*e/s.components*s.byteLength;case 1030:return n*e*2/s.components*s.byteLength;case 1031:return n*e*2/s.components*s.byteLength;case 1022:return n*e*3/s.components*s.byteLength;case 1023:return n*e*4/s.components*s.byteLength;case 1033:return n*e*4/s.components*s.byteLength;case 33776:case 33777:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(n,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(n,8)*Math.max(e,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(n/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(n/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ld(n){switch(n){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ft("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function nh(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function cd(n){const e=new WeakMap;function t(o,c){const l=o.array,f=o.usage,u=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,f),o.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,l){const f=c.array,u=c.updateRanges;if(n.bindBuffer(l,o),u.length===0)n.bufferSubData(l,0,f);else{u.sort((d,p)=>d.start-p.start);let h=0;for(let d=1;d<u.length;d++){const p=u[h],_=u[d];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++h,u[h]=_)}u.length=h+1;for(let d=0,p=u.length;d<p;d++){const _=u[d];n.bufferSubData(l,_.start*f.BYTES_PER_ELEMENT,f,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=e.get(o);(!f||f.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var fd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hd=`#ifdef USE_ALPHAHASH
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
#endif`,ud=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,md=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gd=`#ifdef USE_AOMAP
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
#endif`,_d=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Md=`#ifdef USE_BATCHING
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
#endif`,vd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,bd=`#ifdef USE_IRIDESCENCE
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
#endif`,Td=`#ifdef USE_BUMPMAP
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
#endif`,Ed=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,wd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ld=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Cd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Pd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Dd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,kd=`#define PI 3.141592653589793
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
} // validated`,Id=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Fd=`vec3 transformedNormal = objectNormal;
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
#endif`,Ud=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$d=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Od="gl_FragColor = linearToOutputTexel( gl_FragColor );",Gd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zd=`#ifdef USE_ENVMAP
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
#endif`,Hd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Vd=`#ifdef USE_ENVMAP
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
#endif`,Wd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xd=`#ifdef USE_ENVMAP
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
#endif`,qd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qd=`#ifdef USE_GRADIENTMAP
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
}`,Jd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,e1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,t1=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,n1=`#ifdef USE_ENVMAP
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
#endif`,i1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,s1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,r1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,a1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,o1=`PhysicalMaterial material;
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
#endif`,l1=`uniform sampler2D dfgLUT;
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
}`,c1=`
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
#endif`,f1=`#if defined( RE_IndirectDiffuse )
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
#endif`,h1=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,u1=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,d1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,p1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,m1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,g1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,M1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,v1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,x1=`#if defined( USE_POINTS_UV )
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
#endif`,y1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,S1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,b1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,T1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,E1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,w1=`#ifdef USE_MORPHTARGETS
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
#endif`,A1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,R1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,L1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,C1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,P1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,D1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,k1=`#ifdef USE_NORMALMAP
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
#endif`,I1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,F1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,U1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,N1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,B1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,O1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,G1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,z1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,H1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,V1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,W1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,X1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,q1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Z1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Y1=`float getShadowMask() {
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
}`,K1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Q1=`#ifdef USE_SKINNING
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
#endif`,J1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,j1=`#ifdef USE_SKINNING
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
#endif`,ep=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,np=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ip=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,sp=`#ifdef USE_TRANSMISSION
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
#endif`,rp=`#ifdef USE_TRANSMISSION
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
#endif`,ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const fp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hp=`uniform sampler2D t2D;
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
}`,up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,pp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gp=`#include <common>
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
}`,_p=`#if DEPTH_PACKING == 3200
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
}`,Mp=`#define DISTANCE
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
}`,vp=`#define DISTANCE
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
}`,xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sp=`uniform float scale;
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
}`,bp=`uniform vec3 diffuse;
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
}`,Tp=`#include <common>
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
}`,Ep=`uniform vec3 diffuse;
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
}`,wp=`#define LAMBERT
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
}`,Ap=`#define LAMBERT
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
}`,Rp=`#define MATCAP
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
}`,Lp=`#define MATCAP
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
}`,Cp=`#define NORMAL
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
}`,Pp=`#define NORMAL
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
}`,Dp=`#define PHONG
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
}`,kp=`#define PHONG
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
}`,Ip=`#define STANDARD
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
}`,Fp=`#define STANDARD
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
}`,Up=`#define TOON
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
}`,Np=`#define TOON
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
}`,$p=`uniform float size;
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
}`,Bp=`uniform vec3 diffuse;
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
}`,Op=`#include <common>
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
}`,Gp=`uniform vec3 color;
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
}`,zp=`uniform float rotation;
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
}`,Hp=`uniform vec3 diffuse;
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
}`,Tt={alphahash_fragment:fd,alphahash_pars_fragment:hd,alphamap_fragment:ud,alphamap_pars_fragment:dd,alphatest_fragment:pd,alphatest_pars_fragment:md,aomap_fragment:gd,aomap_pars_fragment:_d,batching_pars_vertex:Md,batching_vertex:vd,begin_vertex:xd,beginnormal_vertex:yd,bsdfs:Sd,iridescence_fragment:bd,bumpmap_pars_fragment:Td,clipping_planes_fragment:Ed,clipping_planes_pars_fragment:wd,clipping_planes_pars_vertex:Ad,clipping_planes_vertex:Rd,color_fragment:Ld,color_pars_fragment:Cd,color_pars_vertex:Pd,color_vertex:Dd,common:kd,cube_uv_reflection_fragment:Id,defaultnormal_vertex:Fd,displacementmap_pars_vertex:Ud,displacementmap_vertex:Nd,emissivemap_fragment:$d,emissivemap_pars_fragment:Bd,colorspace_fragment:Od,colorspace_pars_fragment:Gd,envmap_fragment:zd,envmap_common_pars_fragment:Hd,envmap_pars_fragment:Vd,envmap_pars_vertex:Wd,envmap_physical_pars_fragment:n1,envmap_vertex:Xd,fog_vertex:qd,fog_pars_vertex:Zd,fog_fragment:Yd,fog_pars_fragment:Kd,gradientmap_pars_fragment:Qd,lightmap_pars_fragment:Jd,lights_lambert_fragment:jd,lights_lambert_pars_fragment:e1,lights_pars_begin:t1,lights_toon_fragment:i1,lights_toon_pars_fragment:s1,lights_phong_fragment:r1,lights_phong_pars_fragment:a1,lights_physical_fragment:o1,lights_physical_pars_fragment:l1,lights_fragment_begin:c1,lights_fragment_maps:f1,lights_fragment_end:h1,lightprobes_pars_fragment:u1,logdepthbuf_fragment:d1,logdepthbuf_pars_fragment:p1,logdepthbuf_pars_vertex:m1,logdepthbuf_vertex:g1,map_fragment:_1,map_pars_fragment:M1,map_particle_fragment:v1,map_particle_pars_fragment:x1,metalnessmap_fragment:y1,metalnessmap_pars_fragment:S1,morphinstance_vertex:b1,morphcolor_vertex:T1,morphnormal_vertex:E1,morphtarget_pars_vertex:w1,morphtarget_vertex:A1,normal_fragment_begin:R1,normal_fragment_maps:L1,normal_pars_fragment:C1,normal_pars_vertex:P1,normal_vertex:D1,normalmap_pars_fragment:k1,clearcoat_normal_fragment_begin:I1,clearcoat_normal_fragment_maps:F1,clearcoat_pars_fragment:U1,iridescence_pars_fragment:N1,opaque_fragment:$1,packing:B1,premultiplied_alpha_fragment:O1,project_vertex:G1,dithering_fragment:z1,dithering_pars_fragment:H1,roughnessmap_fragment:V1,roughnessmap_pars_fragment:W1,shadowmap_pars_fragment:X1,shadowmap_pars_vertex:q1,shadowmap_vertex:Z1,shadowmask_pars_fragment:Y1,skinbase_vertex:K1,skinning_pars_vertex:Q1,skinning_vertex:J1,skinnormal_vertex:j1,specularmap_fragment:ep,specularmap_pars_fragment:tp,tonemapping_fragment:np,tonemapping_pars_fragment:ip,transmission_fragment:sp,transmission_pars_fragment:rp,uv_pars_fragment:ap,uv_pars_vertex:op,uv_vertex:lp,worldpos_vertex:cp,background_vert:fp,background_frag:hp,backgroundCube_vert:up,backgroundCube_frag:dp,cube_vert:pp,cube_frag:mp,depth_vert:gp,depth_frag:_p,distance_vert:Mp,distance_frag:vp,equirect_vert:xp,equirect_frag:yp,linedashed_vert:Sp,linedashed_frag:bp,meshbasic_vert:Tp,meshbasic_frag:Ep,meshlambert_vert:wp,meshlambert_frag:Ap,meshmatcap_vert:Rp,meshmatcap_frag:Lp,meshnormal_vert:Cp,meshnormal_frag:Pp,meshphong_vert:Dp,meshphong_frag:kp,meshphysical_vert:Ip,meshphysical_frag:Fp,meshtoon_vert:Up,meshtoon_frag:Np,points_vert:$p,points_frag:Bp,shadow_vert:Op,shadow_frag:Gp,sprite_vert:zp,sprite_frag:Hp},ke={common:{diffuse:{value:new Lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pt}},envmap:{envMap:{value:null},envMapRotation:{value:new pt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new H},probesMax:{value:new H},probesResolution:{value:new H}},points:{diffuse:{value:new Lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0},uvTransform:{value:new pt}},sprite:{diffuse:{value:new Lt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}}},Zi={basic:{uniforms:li([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.fog]),vertexShader:Tt.meshbasic_vert,fragmentShader:Tt.meshbasic_frag},lambert:{uniforms:li([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new Lt(0)},envMapIntensity:{value:1}}]),vertexShader:Tt.meshlambert_vert,fragmentShader:Tt.meshlambert_frag},phong:{uniforms:li([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new Lt(0)},specular:{value:new Lt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Tt.meshphong_vert,fragmentShader:Tt.meshphong_frag},standard:{uniforms:li([ke.common,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.roughnessmap,ke.metalnessmap,ke.fog,ke.lights,{emissive:{value:new Lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Tt.meshphysical_vert,fragmentShader:Tt.meshphysical_frag},toon:{uniforms:li([ke.common,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.gradientmap,ke.fog,ke.lights,{emissive:{value:new Lt(0)}}]),vertexShader:Tt.meshtoon_vert,fragmentShader:Tt.meshtoon_frag},matcap:{uniforms:li([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,{matcap:{value:null}}]),vertexShader:Tt.meshmatcap_vert,fragmentShader:Tt.meshmatcap_frag},points:{uniforms:li([ke.points,ke.fog]),vertexShader:Tt.points_vert,fragmentShader:Tt.points_frag},dashed:{uniforms:li([ke.common,ke.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Tt.linedashed_vert,fragmentShader:Tt.linedashed_frag},depth:{uniforms:li([ke.common,ke.displacementmap]),vertexShader:Tt.depth_vert,fragmentShader:Tt.depth_frag},normal:{uniforms:li([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,{opacity:{value:1}}]),vertexShader:Tt.meshnormal_vert,fragmentShader:Tt.meshnormal_frag},sprite:{uniforms:li([ke.sprite,ke.fog]),vertexShader:Tt.sprite_vert,fragmentShader:Tt.sprite_frag},background:{uniforms:{uvTransform:{value:new pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Tt.background_vert,fragmentShader:Tt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pt}},vertexShader:Tt.backgroundCube_vert,fragmentShader:Tt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Tt.cube_vert,fragmentShader:Tt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Tt.equirect_vert,fragmentShader:Tt.equirect_frag},distance:{uniforms:li([ke.common,ke.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Tt.distance_vert,fragmentShader:Tt.distance_frag},shadow:{uniforms:li([ke.lights,ke.fog,{color:{value:new Lt(0)},opacity:{value:1}}]),vertexShader:Tt.shadow_vert,fragmentShader:Tt.shadow_frag}};Zi.physical={uniforms:li([Zi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pt},sheen:{value:0},sheenColor:{value:new Lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pt},attenuationDistance:{value:0},attenuationColor:{value:new Lt(0)},specularColor:{value:new Lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pt}}]),vertexShader:Tt.meshphysical_vert,fragmentShader:Tt.meshphysical_frag};const ho={r:0,b:0,g:0},Vp=new En,ih=new pt;ih.set(-1,0,0,0,1,0,0,0,1);function Wp(n,e,t,i,s,r){const a=new Lt(0);let o=s===!0?0:1,c,l,f=null,u=0,h=null;function d(b){let E=b.isScene===!0?b.background:null;if(E&&E.isTexture){const v=b.backgroundBlurriness>0;E=e.get(E,v)}return E}function p(b){let E=!1;const v=d(b);v===null?m(a,o):v&&v.isColor&&(m(v,1),E=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(b,E){const v=d(E);v&&(v.isCubeTexture||v.mapping===306)?(l===void 0&&(l=new fn(new $s(1,1,1),new _i({name:"BackgroundCubeMaterial",uniforms:Or(Zi.backgroundCube.uniforms),vertexShader:Zi.backgroundCube.vertexShader,fragmentShader:Zi.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(S,T,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Vp.makeRotationFromEuler(E.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(ih),l.material.toneMapped=Ft.getTransfer(v.colorSpace)!==qt,(f!==v||u!==v.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,f=v,u=v.version,h=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new fn(new Gi(2,2),new _i({name:"BackgroundMaterial",uniforms:Or(Zi.background.uniforms),vertexShader:Zi.background.vertexShader,fragmentShader:Zi.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=Ft.getTransfer(v.colorSpace)!==qt,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||u!==v.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,u=v.version,h=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function m(b,E){b.getRGB(ho,Jf(n)),t.buffers.color.setClear(ho.r,ho.g,ho.b,E,r)}function g(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,E=1){a.set(b),o=E,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,m(a,o)},render:p,addToRenderList:_,dispose:g}}function Xp(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,a=!1;function o(B,U,z,D,G){let K=!1;const W=u(B,D,z,U);r!==W&&(r=W,l(r.object)),K=d(B,D,z,G),K&&p(B,D,z,G),G!==null&&e.update(G,n.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,v(B,U,z,D),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function c(){return n.createVertexArray()}function l(B){return n.bindVertexArray(B)}function f(B){return n.deleteVertexArray(B)}function u(B,U,z,D){const G=D.wireframe===!0;let K=i[U.id];K===void 0&&(K={},i[U.id]=K);const W=B.isInstancedMesh===!0?B.id:0;let le=K[W];le===void 0&&(le={},K[W]=le);let Q=le[z.id];Q===void 0&&(Q={},le[z.id]=Q);let ae=Q[G];return ae===void 0&&(ae=h(c()),Q[G]=ae),ae}function h(B){const U=[],z=[],D=[];for(let G=0;G<t;G++)U[G]=0,z[G]=0,D[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:z,attributeDivisors:D,object:B,attributes:{},index:null}}function d(B,U,z,D){const G=r.attributes,K=U.attributes;let W=0;const le=z.getAttributes();for(const Q in le)if(le[Q].location>=0){const de=G[Q];let Ve=K[Q];if(Ve===void 0&&(Q==="instanceMatrix"&&B.instanceMatrix&&(Ve=B.instanceMatrix),Q==="instanceColor"&&B.instanceColor&&(Ve=B.instanceColor)),de===void 0||de.attribute!==Ve||Ve&&de.data!==Ve.data)return!0;W++}return r.attributesNum!==W||r.index!==D}function p(B,U,z,D){const G={},K=U.attributes;let W=0;const le=z.getAttributes();for(const Q in le)if(le[Q].location>=0){let de=K[Q];de===void 0&&(Q==="instanceMatrix"&&B.instanceMatrix&&(de=B.instanceMatrix),Q==="instanceColor"&&B.instanceColor&&(de=B.instanceColor));const Ve={};Ve.attribute=de,de&&de.data&&(Ve.data=de.data),G[Q]=Ve,W++}r.attributes=G,r.attributesNum=W,r.index=D}function _(){const B=r.newAttributes;for(let U=0,z=B.length;U<z;U++)B[U]=0}function m(B){g(B,0)}function g(B,U){const z=r.newAttributes,D=r.enabledAttributes,G=r.attributeDivisors;z[B]=1,D[B]===0&&(n.enableVertexAttribArray(B),D[B]=1),G[B]!==U&&(n.vertexAttribDivisor(B,U),G[B]=U)}function b(){const B=r.newAttributes,U=r.enabledAttributes;for(let z=0,D=U.length;z<D;z++)U[z]!==B[z]&&(n.disableVertexAttribArray(z),U[z]=0)}function E(B,U,z,D,G,K,W){W===!0?n.vertexAttribIPointer(B,U,z,G,K):n.vertexAttribPointer(B,U,z,D,G,K)}function v(B,U,z,D){_();const G=D.attributes,K=z.getAttributes(),W=U.defaultAttributeValues;for(const le in K){const Q=K[le];if(Q.location>=0){let ae=G[le];if(ae===void 0&&(le==="instanceMatrix"&&B.instanceMatrix&&(ae=B.instanceMatrix),le==="instanceColor"&&B.instanceColor&&(ae=B.instanceColor)),ae!==void 0){const de=ae.normalized,Ve=ae.itemSize,ze=e.get(ae);if(ze===void 0)continue;const Me=ze.buffer,Pe=ze.type,Ye=ze.bytesPerElement,te=Pe===n.INT||Pe===n.UNSIGNED_INT||ae.gpuType===1013;if(ae.isInterleavedBufferAttribute){const ce=ae.data,we=ce.stride,st=ae.offset;if(ce.isInstancedInterleavedBuffer){for(let Ne=0;Ne<Q.locationSize;Ne++)g(Q.location+Ne,ce.meshPerAttribute);B.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Ne=0;Ne<Q.locationSize;Ne++)m(Q.location+Ne);n.bindBuffer(n.ARRAY_BUFFER,Me);for(let Ne=0;Ne<Q.locationSize;Ne++)E(Q.location+Ne,Ve/Q.locationSize,Pe,de,we*Ye,(st+Ve/Q.locationSize*Ne)*Ye,te)}else{if(ae.isInstancedBufferAttribute){for(let ce=0;ce<Q.locationSize;ce++)g(Q.location+ce,ae.meshPerAttribute);B.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let ce=0;ce<Q.locationSize;ce++)m(Q.location+ce);n.bindBuffer(n.ARRAY_BUFFER,Me);for(let ce=0;ce<Q.locationSize;ce++)E(Q.location+ce,Ve/Q.locationSize,Pe,de,Ve*Ye,Ve/Q.locationSize*ce*Ye,te)}}else if(W!==void 0){const de=W[le];if(de!==void 0)switch(de.length){case 2:n.vertexAttrib2fv(Q.location,de);break;case 3:n.vertexAttrib3fv(Q.location,de);break;case 4:n.vertexAttrib4fv(Q.location,de);break;default:n.vertexAttrib1fv(Q.location,de)}}}}b()}function S(){A();for(const B in i){const U=i[B];for(const z in U){const D=U[z];for(const G in D){const K=D[G];for(const W in K)f(K[W].object),delete K[W];delete D[G]}}delete i[B]}}function T(B){if(i[B.id]===void 0)return;const U=i[B.id];for(const z in U){const D=U[z];for(const G in D){const K=D[G];for(const W in K)f(K[W].object),delete K[W];delete D[G]}}delete i[B.id]}function P(B){for(const U in i){const z=i[U];for(const D in z){const G=z[D];if(G[B.id]===void 0)continue;const K=G[B.id];for(const W in K)f(K[W].object),delete K[W];delete G[B.id]}}}function x(B){for(const U in i){const z=i[U],D=B.isInstancedMesh===!0?B.id:0,G=z[D];if(G!==void 0){for(const K in G){const W=G[K];for(const le in W)f(W[le].object),delete W[le];delete G[K]}delete z[D],Object.keys(z).length===0&&delete i[U]}}}function A(){I(),a=!0,r!==s&&(r=s,l(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:I,dispose:S,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function qp(n,e,t){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function a(c,l,f){f!==0&&(n.drawArraysInstanced(i,c,l,f),t.update(l,i,f))}function o(c,l,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,f);let h=0;for(let d=0;d<f;d++)h+=l[d];t.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Zp(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==1023&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const x=P===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==1009&&P!==1015&&!x&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function c(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const f=c(l);f!==l&&(ft("WebGLRenderer:",l,"not supported, using",f,"instead."),l=f);const u=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&ft("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:b,maxVaryings:E,maxFragmentUniforms:v,maxSamples:S,samples:T}}function Yp(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new Rs,o=new pt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const d=u.length!==0||h||i!==0||s;return s=h,i=u.length,d},this.beginShadows=function(){r=!0,f(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){t=f(u,h,0)},this.setState=function(u,h,d){const p=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,g=n.get(u);if(!s||p===null||p.length===0||r&&!m)r?f(null):l();else{const b=r?0:i,E=b*4;let v=g.clippingState||null;c.value=v,v=f(p,h,E,d);for(let S=0;S!==E;++S)v[S]=t[S];g.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(u,h,d,p){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,p!==!0||m===null){const g=d+_*4,b=h.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<g)&&(m=new Float32Array(g));for(let E=0,v=d;E!==_;++E,v+=4)a.copy(u[E]).applyMatrix4(b,o),a.normal.toArray(m,v),m[v+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const Rr=4,Kp=6,Qp=20,Jp=256,ua=new Oo,I0=new Lt;let bl=null,Tl=0,El=0,wl=!1;const jp=new H,Ys=new H;class F0{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=jp}=r;bl=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),El=this._renderer.getActiveMipmapLevel(),wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=N0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(bl,Tl,El),this._renderer.xr.enabled=wl,e.scissorTest=!1,wr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bl=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),El=this._renderer.getActiveMipmapLevel(),wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:Ro,depthBuffer:!1},s=U0(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=U0(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=e2(r)),this._blurMaterial=n2(r,e,t),this._ggxMaterial=t2(r,e,t)}return s}_compileMaterial(e){const t=new fn(new Di,e);this._renderer.compile(t,ua)}_sceneToCubeUV(e,t,i,s,r){const c=new yi(90,1,t,i),l=[1,-1,1,1,1,1],f=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(I0),u.toneMapping=0,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new fn(new $s,new $a({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let g=!1;const b=e.background;b?b.isColor&&(m.color.copy(b),e.background=null,g=!0):(m.color.copy(I0),g=!0);for(let E=0;E<6;E++){const v=E%3;v===0?(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+f[E],r.y,r.z)):v===1?(c.up.set(0,0,l[E]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+f[E],r.z)):(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+f[E]));const S=this._cubeSize;wr(s,v*S,E>2?S:0,S,S),u.setRenderTarget(s),g&&u.render(_,c),u.render(e,c)}u.toneMapping=d,u.autoClear=h,e.background=b}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===301||e.mapping===302;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=$0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=N0());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;wr(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,ua)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),f=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-f*f),h=l*1.25,d=u*h,{_lodMax:p}=this,_=this._sizeLods[i],m=3*_*(i>p-Rr?i-p+Rr:0),g=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=d,c.mipInt.value=p-t,wr(r,m,g,3*_,2*_),s.setRenderTarget(r),s.render(o,ua),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-i,wr(e,m,g,3*_,2*_),s.setRenderTarget(e),s.render(o,ua)}_blur(e,t,i,s){const r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,i,a),this._blurPass(r,e,i,i,a)}_blurPass(e,t,i,s,r){const a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[s];c.material=o;const l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-i;const f=this._sizeLods[s],u=3*f*(s>this._lodMax-Rr?s-this._lodMax+Rr:0),h=4*(this._cubeSize-f);wr(t,u,h,3*f,2*f),a.setRenderTarget(t),a.render(c,ua)}}function e2(n){const e=[],t=[];let i=n;const s=n-Rr+1+Kp;for(let r=0;r<s;r++){const a=Math.pow(2,i);e.push(a);const o=1/(a-2),c=-o,l=1+o,f=[c,c,l,c,l,l,c,c,l,l,c,l],u=6,h=6,d=3,p=new Float32Array(d*h*u),_=new Float32Array(d*h*u);for(let g=0;g<u;g++){const b=g%3*2/3-1,E=g>2?0:-1,v=[b,E,0,b+2/3,E,0,b+2/3,E+1,0,b,E,0,b+2/3,E+1,0,b,E+1,0];p.set(v,d*h*g);for(let S=0;S<h;S++){const T=f[S*2]*2-1,P=f[S*2+1]*2-1;g===0?Ys.set(1,P,T):g===1?Ys.set(-T,1,-P):g===2?Ys.set(-T,P,1):g===3?Ys.set(-1,P,-T):g===4?Ys.set(-T,-1,P):Ys.set(T,P,-1),Ys.toArray(_,(g*h+S)*d)}}const m=new Di;m.setAttribute("position",new Ji(p,d)),m.setAttribute("outputDirection",new Ji(_,d)),t.push(new fn(m,null)),i>Rr&&i--}return{lodMeshes:t,sizeLods:e}}function U0(n,e,t){const i=new mi(n,e,t);return i.texture.mapping=306,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wr(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function t2(n,e,t){return new _i({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Jp,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Go(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function n2(n,e,t){return new _i({name:"SphericalGaussianBlur",defines:{SAMPLES:Qp,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Go(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function N0(){return new _i({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Go(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function $0(){return new _i({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Go(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class sh extends mi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Kf(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new $s(5,5,5),r=new _i({name:"CubemapFromEquirect",uniforms:Or(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:1,blending:0});r.uniforms.tEquirect.value=t;const a=new fn(s,r),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new sd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}function i2(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,d=!1){return h==null?null:d?a(h):r(h)}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===303||d===304)if(e.has(h)){const p=e.get(h).texture;return o(p,h.mapping)}else{const p=h.image;if(p&&p.height>0){const _=new sh(p.height);return _.fromEquirectangularTexture(n,h),e.set(h,_),h.addEventListener("dispose",l),o(_.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){const d=h.mapping,p=d===303||d===304,_=d===301||d===302;if(p||_){let m=t.get(h);const g=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==g)return i===null&&(i=new F0(n)),m=p?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const b=h.image;return p&&b&&b.height>0||_&&b&&c(b)?(i===null&&(i=new F0(n)),m=p?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",f),m.texture):null}}}return h}function o(h,d){return d===303?h.mapping=301:d===304&&(h.mapping=302),h}function c(h){let d=0;const p=6;for(let _=0;_<p;_++)h[_]!==void 0&&d++;return d===p}function l(h){const d=h.target;d.removeEventListener("dispose",l);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function f(h){const d=h.target;d.removeEventListener("dispose",f);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function s2(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Pr("WebGLRenderer: "+i+" extension not supported."),s}}}function r2(n,e,t,i){const s={},r=new WeakMap;function a(u){const h=u.target;h.index!==null&&e.remove(h.index);for(const p in h.attributes)e.remove(h.attributes[p]);h.removeEventListener("dispose",a),delete s[h.id];const d=r.get(h);d&&(e.remove(d),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function c(u){const h=u.attributes;for(const d in h)e.update(h[d],n.ARRAY_BUFFER)}function l(u){const h=[],d=u.index,p=u.attributes.position;let _=0;if(p===void 0)return;if(d!==null){const b=d.array;_=d.version;for(let E=0,v=b.length;E<v;E+=3){const S=b[E+0],T=b[E+1],P=b[E+2];h.push(S,T,T,P,P,S)}}else{const b=p.array;_=p.version;for(let E=0,v=b.length/3-1;E<v;E+=3){const S=E+0,T=E+1,P=E+2;h.push(S,T,T,P,P,S)}}const m=new(p.count>=65535?qf:Xf)(h,1);m.version=_;const g=r.get(u);g&&e.remove(g),r.set(u,m)}function f(u){const h=r.get(u);if(h){const d=u.index;d!==null&&h.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:f}}function a2(n,e,t){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,h){n.drawElements(i,h,r,u*a),t.update(h,i,1)}function l(u,h,d){d!==0&&(n.drawElementsInstanced(i,h,r,u*a,d),t.update(h,i,d))}function f(u,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,u,0,d);let _=0;for(let m=0;m<d;m++)_+=h[m];t.update(_,i,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=f}function o2(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Gt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function l2(n,e,t){const i=new WeakMap,s=new Tn;function r(a,o,c){const l=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=f!==void 0?f.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let A=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();const d=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let E=0;d===!0&&(E=1),p===!0&&(E=2),_===!0&&(E=3);let v=o.attributes.position.count*E,S=1;v>e.maxTextureSize&&(S=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const T=new Float32Array(v*S*4*u),P=new Hf(T,v,S,u);P.type=1015,P.needsUpdate=!0;const x=E*4;for(let I=0;I<u;I++){const B=m[I],U=g[I],z=b[I],D=v*S*4*I;for(let G=0;G<B.count;G++){const K=G*x;d===!0&&(s.fromBufferAttribute(B,G),T[D+K+0]=s.x,T[D+K+1]=s.y,T[D+K+2]=s.z,T[D+K+3]=0),p===!0&&(s.fromBufferAttribute(U,G),T[D+K+4]=s.x,T[D+K+5]=s.y,T[D+K+6]=s.z,T[D+K+7]=0),_===!0&&(s.fromBufferAttribute(z,G),T[D+K+8]=s.x,T[D+K+9]=s.y,T[D+K+10]=s.z,T[D+K+11]=z.itemSize===4?s.w:1)}}h={count:u,texture:P,size:new ht(v,S)},i.set(o,h),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let d=0;for(let _=0;_<l.length;_++)d+=l[_];const p=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(n,"morphTargetBaseInfluence",p),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function c2(n,e,t,i,s){let r=new WeakMap;function a(l){const f=s.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==f&&(e.update(h),r.set(h,f)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==f&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,f))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==f&&(d.update(),r.set(d,f))}return h}function o(){r=new WeakMap}function c(l){const f=l.target;f.removeEventListener("dispose",c),i.releaseStatesOfObject(f),t.remove(f.instanceMatrix),f.instanceColor!==null&&t.remove(f.instanceColor)}return{update:a,dispose:o}}const f2={1:"LINEAR_TONE_MAPPING",2:"REINHARD_TONE_MAPPING",3:"CINEON_TONE_MAPPING",4:"ACES_FILMIC_TONE_MAPPING",6:"AGX_TONE_MAPPING",7:"NEUTRAL_TONE_MAPPING",5:"CUSTOM_TONE_MAPPING"};function h2(n,e,t,i,s,r){const a=new mi(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,c=null;const l=new Di;l.setAttribute("position",new gi([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new gi([0,2,0,0,2,0],2));const f=new jf({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new fn(l,f),h=new Oo(-1,1,1,-1,0,1);let d=null,p=null,_=!1,m,g=null,b=[],E=!1;this.setSize=function(v,S){a.setSize(v,S),o!==null&&o.setSize(v,S),c!==null&&c.setSize(v,S);for(let T=0;T<b.length;T++){const P=b[T];P.setSize&&P.setSize(v,S)}},this.setEffects=function(v){b=v,E=b.length>0&&b[0].isRenderPass===!0;const S=a.width,T=a.height;b.length>0&&o===null&&(o=new mi(S,T,{type:1016,depthBuffer:!1,stencilBuffer:!1}),c=new mi(S,T,{type:1016,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<b.length;P++){const x=b[P];x.setSize&&x.setSize(S,T)}},this.begin=function(v,S){if(_||v.toneMapping===0&&b.length===0)return!1;if(g=S,S!==null){const T=S.width,P=S.height;(a.width!==T||a.height!==P)&&this.setSize(T,P)}return E===!1&&v.setRenderTarget(a),m=v.toneMapping,v.toneMapping=0,!0},this.hasRenderPass=function(){return E},this.end=function(v,S){v.toneMapping=m,_=!0;let T=a,P=o;for(let x=0;x<b.length;x++){const A=b[x];A.enabled!==!1&&(A.render(v,P,T,S),A.needsSwap!==!1&&(T=P,P=P===o?c:o))}if(d!==v.outputColorSpace||p!==v.toneMapping){d=v.outputColorSpace,p=v.toneMapping,f.defines={},Ft.getTransfer(d)===qt&&(f.defines.SRGB_TRANSFER="");const x=f2[p];x&&(f.defines[x]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(g),v.render(u,h),g=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),f.dispose()}}const rh=new Qn,rc=new Br(1,1),ah=new Hf,oh=new bu,lh=new Kf,B0=[],O0=[],G0=new Float32Array(16),z0=new Float32Array(9),H0=new Float32Array(4);function Qr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=B0[s];if(r===void 0&&(r=new Float32Array(s),B0[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Hn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Vn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function zo(n,e){let t=O0[e];t===void 0&&(t=new Int32Array(e),O0[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function u2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function d2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Hn(t,e))return;n.uniform2fv(this.addr,e),Vn(t,e)}}function p2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Hn(t,e))return;n.uniform3fv(this.addr,e),Vn(t,e)}}function m2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Hn(t,e))return;n.uniform4fv(this.addr,e),Vn(t,e)}}function g2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Hn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Vn(t,e)}else{if(Hn(t,i))return;H0.set(i),n.uniformMatrix2fv(this.addr,!1,H0),Vn(t,i)}}function _2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Hn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Vn(t,e)}else{if(Hn(t,i))return;z0.set(i),n.uniformMatrix3fv(this.addr,!1,z0),Vn(t,i)}}function M2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Hn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Vn(t,e)}else{if(Hn(t,i))return;G0.set(i),n.uniformMatrix4fv(this.addr,!1,G0),Vn(t,i)}}function v2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function x2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Hn(t,e))return;n.uniform2iv(this.addr,e),Vn(t,e)}}function y2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Hn(t,e))return;n.uniform3iv(this.addr,e),Vn(t,e)}}function S2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Hn(t,e))return;n.uniform4iv(this.addr,e),Vn(t,e)}}function b2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function T2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Hn(t,e))return;n.uniform2uiv(this.addr,e),Vn(t,e)}}function E2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Hn(t,e))return;n.uniform3uiv(this.addr,e),Vn(t,e)}}function w2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Hn(t,e))return;n.uniform4uiv(this.addr,e),Vn(t,e)}}function A2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(rc.compareFunction=t.isReversedDepthBuffer()?518:515,r=rc):r=rh,t.setTexture2D(e||r,s)}function R2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||oh,s)}function L2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||lh,s)}function C2(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||ah,s)}function P2(n){switch(n){case 5126:return u2;case 35664:return d2;case 35665:return p2;case 35666:return m2;case 35674:return g2;case 35675:return _2;case 35676:return M2;case 5124:case 35670:return v2;case 35667:case 35671:return x2;case 35668:case 35672:return y2;case 35669:case 35673:return S2;case 5125:return b2;case 36294:return T2;case 36295:return E2;case 36296:return w2;case 35678:case 36198:case 36298:case 36306:case 35682:return A2;case 35679:case 36299:case 36307:return R2;case 35680:case 36300:case 36308:case 36293:return L2;case 36289:case 36303:case 36311:case 36292:return C2}}function D2(n,e){n.uniform1fv(this.addr,e)}function k2(n,e){const t=Qr(e,this.size,2);n.uniform2fv(this.addr,t)}function I2(n,e){const t=Qr(e,this.size,3);n.uniform3fv(this.addr,t)}function F2(n,e){const t=Qr(e,this.size,4);n.uniform4fv(this.addr,t)}function U2(n,e){const t=Qr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function N2(n,e){const t=Qr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function $2(n,e){const t=Qr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function B2(n,e){n.uniform1iv(this.addr,e)}function O2(n,e){n.uniform2iv(this.addr,e)}function G2(n,e){n.uniform3iv(this.addr,e)}function z2(n,e){n.uniform4iv(this.addr,e)}function H2(n,e){n.uniform1uiv(this.addr,e)}function V2(n,e){n.uniform2uiv(this.addr,e)}function W2(n,e){n.uniform3uiv(this.addr,e)}function X2(n,e){n.uniform4uiv(this.addr,e)}function q2(n,e,t){const i=this.cache,s=e.length,r=zo(t,s);Hn(i,r)||(n.uniform1iv(this.addr,r),Vn(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=rc:a=rh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Z2(n,e,t){const i=this.cache,s=e.length,r=zo(t,s);Hn(i,r)||(n.uniform1iv(this.addr,r),Vn(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||oh,r[a])}function Y2(n,e,t){const i=this.cache,s=e.length,r=zo(t,s);Hn(i,r)||(n.uniform1iv(this.addr,r),Vn(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||lh,r[a])}function K2(n,e,t){const i=this.cache,s=e.length,r=zo(t,s);Hn(i,r)||(n.uniform1iv(this.addr,r),Vn(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||ah,r[a])}function Q2(n){switch(n){case 5126:return D2;case 35664:return k2;case 35665:return I2;case 35666:return F2;case 35674:return U2;case 35675:return N2;case 35676:return $2;case 5124:case 35670:return B2;case 35667:case 35671:return O2;case 35668:case 35672:return G2;case 35669:case 35673:return z2;case 5125:return H2;case 36294:return V2;case 36295:return W2;case 36296:return X2;case 35678:case 36198:case 36298:case 36306:case 35682:return q2;case 35679:case 36299:case 36307:return Z2;case 35680:case 36300:case 36308:case 36293:return Y2;case 36289:case 36303:case 36311:case 36292:return K2}}class J2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=P2(t.type)}}class j2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Q2(t.type)}}class em{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Al=/(\w+)(\])?(\[|\.)?/g;function V0(n,e){n.seq.push(e),n.map[e.id]=e}function tm(n,e,t){const i=n.name,s=i.length;for(Al.lastIndex=0;;){const r=Al.exec(i),a=Al.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){V0(t,l===void 0?new J2(o,n,e):new j2(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new em(o),V0(t,u)),t=u}}}class So{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);tm(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function W0(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const nm=37297;let im=0;function sm(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const X0=new pt;function rm(n){Ft._getMatrix(X0,Ft.workingColorSpace,n);const e=`mat3( ${X0.elements.map(t=>t.toFixed(4))} )`;switch(Ft.getTransfer(n)){case Lo:return[e,"LinearTransferOETF"];case qt:return[e,"sRGBTransferOETF"];default:return ft("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function q0(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+sm(n.getShaderSource(e),o)}else return r}function am(n,e){const t=rm(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const om={1:"Linear",2:"Reinhard",3:"Cineon",4:"ACESFilmic",6:"AgX",7:"Neutral",5:"Custom"};function lm(n,e){const t=om[e];return t===void 0?(ft("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const uo=new H;function cm(){Ft.getLuminanceCoefficients(uo);const n=uo.x.toFixed(4),e=uo.y.toFixed(4),t=uo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fm(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Sa).join(`
`)}function hm(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function um(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Sa(n){return n!==""}function Z0(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Y0(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const dm=/^[ \t]*#include +<([\w\d./]+)>/gm;function ac(n){return n.replace(dm,mm)}const pm=new Map;function mm(n,e){let t=Tt[e];if(t===void 0){const i=pm.get(e);if(i!==void 0)t=Tt[i],ft('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return ac(t)}const gm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function K0(n){return n.replace(gm,_m)}function _m(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Q0(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const Mm={1:"SHADOWMAP_TYPE_PCF",3:"SHADOWMAP_TYPE_VSM"};function vm(n){return Mm[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const xm={301:"ENVMAP_TYPE_CUBE",302:"ENVMAP_TYPE_CUBE",306:"ENVMAP_TYPE_CUBE_UV"};function ym(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":xm[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const Sm={302:"ENVMAP_MODE_REFRACTION"};function bm(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Sm[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Tm={0:"ENVMAP_BLENDING_MULTIPLY",1:"ENVMAP_BLENDING_MIX",2:"ENVMAP_BLENDING_ADD"};function Em(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Tm[n.combine]||"ENVMAP_BLENDING_NONE"}function wm(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Am(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=vm(t),l=ym(t),f=bm(t),u=Em(t),h=wm(t),d=fm(t),p=hm(r),_=s.createProgram();let m,g,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Sa).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Sa).join(`
`),g.length>0&&(g+=`
`)):(m=[Q0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Sa).join(`
`),g=[Q0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+f:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Tt.tonemapping_pars_fragment:"",t.toneMapping!==0?lm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Tt.colorspace_pars_fragment,am("linearToOutputTexel",t.outputColorSpace),cm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Sa).join(`
`)),a=ac(a),a=Z0(a,t),a=Y0(a,t),o=ac(o),o=Z0(o,t),o=Y0(o,t),a=K0(a),o=K0(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",t.glslVersion===a0?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===a0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const E=b+m+a,v=b+g+o,S=W0(s,s.VERTEX_SHADER,E),T=W0(s,s.FRAGMENT_SHADER,v);s.attachShader(_,S),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function P(B){if(n.debug.checkShaderErrors){const U=s.getProgramInfoLog(_)||"",z=s.getShaderInfoLog(S)||"",D=s.getShaderInfoLog(T)||"",G=U.trim(),K=z.trim(),W=D.trim();let le=!0,Q=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(le=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,S,T);else{const ae=q0(s,S,"vertex"),de=q0(s,T,"fragment");Gt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+G+`
`+ae+`
`+de)}else G!==""?ft("WebGLProgram: Program Info Log:",G):(K===""||W==="")&&(Q=!1);Q&&(B.diagnostics={runnable:le,programLog:G,vertexShader:{log:K,prefix:m},fragmentShader:{log:W,prefix:g}})}s.deleteShader(S),s.deleteShader(T),x=new So(s,_),A=um(s,_)}let x;this.getUniforms=function(){return x===void 0&&P(this),x};let A;this.getAttributes=function(){return A===void 0&&P(this),A};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(_,nm)),I},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=im++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=S,this.fragmentShader=T,this}let Rm=0;class Lm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Cm(e),t.set(e,i)),i}}class Cm{constructor(e){this.id=Rm++,this.code=e,this.usedTimes=0}}function Pm(n){return n===1030||n===37490||n===36285}function Dm(n,e,t,i,s,r){const a=new Vf,o=new Lm,c=new Set,l=[],f=new Map,u=i.logarithmicDepthBuffer;let h=i.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return c.add(x),x===0?"uv":`uv${x}`}function _(x,A,I,B,U,z){const D=B.fog,G=U.geometry,K=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?B.environment:null,W=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,le=e.get(x.envMap||K,W),Q=le&&le.mapping===306?le.image.height:null,ae=d[x.type];x.precision!==null&&(h=i.getMaxPrecision(x.precision),h!==x.precision&&ft("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));const de=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Ve=de!==void 0?de.length:0;let ze=0;G.morphAttributes.position!==void 0&&(ze=1),G.morphAttributes.normal!==void 0&&(ze=2),G.morphAttributes.color!==void 0&&(ze=3);let Me,Pe,Ye,te;if(ae){const on=Zi[ae];Me=on.vertexShader,Pe=on.fragmentShader}else{Me=x.vertexShader,Pe=x.fragmentShader;const on=o.getVertexShaderStage(x),Wt=o.getFragmentShaderStage(x);o.update(x,on,Wt),Ye=on.id,te=Wt.id}const ce=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),st=U.isInstancedMesh===!0,Ne=U.isBatchedMesh===!0,St=!!x.map,Rn=!!x.matcap,Dt=!!le,zt=!!x.aoMap,an=!!x.lightMap,It=!!x.bumpMap&&x.wireframe===!1,mn=!!x.normalMap,Wn=!!x.displacementMap,hi=!!x.emissiveMap,xn=!!x.metalnessMap,kn=!!x.roughnessMap,O=x.anisotropy>0,Jn=x.clearcoat>0,Yt=x.dispersion>0,R=x.retroreflectivity>0,M=x.iridescence>0,V=x.sheen>0,Z=x.transmission>0,ne=O&&!!x.anisotropyMap,be=Jn&&!!x.clearcoatMap,Te=Jn&&!!x.clearcoatNormalMap,se=Jn&&!!x.clearcoatRoughnessMap,he=M&&!!x.iridescenceMap,Ae=M&&!!x.iridescenceThicknessMap,Je=V&&!!x.sheenColorMap,De=V&&!!x.sheenRoughnessMap,Re=!!x.specularMap,je=!!x.specularColorMap,at=!!x.specularIntensityMap,gt=Z&&!!x.transmissionMap,$=Z&&!!x.thicknessMap,Le=!!x.gradientMap,fe=!!x.alphaMap,Ce=x.alphaTest>0,$e=!!x.alphaHash,pe=!!x.extensions;let tt=0;x.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(tt=n.toneMapping);const qe={shaderID:ae,shaderType:x.type,shaderName:x.name,vertexShader:Me,fragmentShader:Pe,defines:x.defines,customVertexShaderID:Ye,customFragmentShaderID:te,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:Ne,batchingColor:Ne&&U._colorsTexture!==null,instancing:st,instancingColor:st&&U.instanceColor!==null,instancingMorph:st&&U.morphTexture!==null,outputColorSpace:ce===null?n.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Ft.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:St,matcap:Rn,envMap:Dt,envMapMode:Dt&&le.mapping,envMapCubeUVHeight:Q,aoMap:zt,lightMap:an,bumpMap:It,normalMap:mn,displacementMap:Wn,emissiveMap:hi,normalMapObjectSpace:mn&&x.normalMapType===1,normalMapTangentSpace:mn&&x.normalMapType===0,packedNormalMap:mn&&x.normalMapType===0&&Pm(x.normalMap.format),metalnessMap:xn,roughnessMap:kn,anisotropy:O,anisotropyMap:ne,clearcoat:Jn,clearcoatMap:be,clearcoatNormalMap:Te,clearcoatRoughnessMap:se,dispersion:Yt,retroreflection:R,iridescence:M,iridescenceMap:he,iridescenceThicknessMap:Ae,sheen:V,sheenColorMap:Je,sheenRoughnessMap:De,specularMap:Re,specularColorMap:je,specularIntensityMap:at,transmission:Z,transmissionMap:gt,thicknessMap:$,gradientMap:Le,opaque:x.transparent===!1&&x.blending===1&&x.alphaToCoverage===!1,alphaMap:fe,alphaTest:Ce,alphaHash:$e,combine:x.combine,mapUv:St&&p(x.map.channel),aoMapUv:zt&&p(x.aoMap.channel),lightMapUv:an&&p(x.lightMap.channel),bumpMapUv:It&&p(x.bumpMap.channel),normalMapUv:mn&&p(x.normalMap.channel),displacementMapUv:Wn&&p(x.displacementMap.channel),emissiveMapUv:hi&&p(x.emissiveMap.channel),metalnessMapUv:xn&&p(x.metalnessMap.channel),roughnessMapUv:kn&&p(x.roughnessMap.channel),anisotropyMapUv:ne&&p(x.anisotropyMap.channel),clearcoatMapUv:be&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:Te&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&p(x.clearcoatRoughnessMap.channel),iridescenceMapUv:he&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:Ae&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:Je&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:De&&p(x.sheenRoughnessMap.channel),specularMapUv:Re&&p(x.specularMap.channel),specularColorMapUv:je&&p(x.specularColorMap.channel),specularIntensityMapUv:at&&p(x.specularIntensityMap.channel),transmissionMapUv:gt&&p(x.transmissionMap.channel),thicknessMapUv:$&&p(x.thicknessMap.channel),alphaMapUv:fe&&p(x.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(mn||O),vertexNormals:!!G.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!G.attributes.uv&&(St||fe),fog:!!D,useFog:x.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||G.attributes.normal===void 0&&mn===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:we,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:G.attributes.position!==void 0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Ve,morphTextureStride:ze,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:tt,decodeVideoTexture:St&&x.map.isVideoTexture===!0&&Ft.getTransfer(x.map.colorSpace)===qt,decodeVideoTextureEmissive:hi&&x.emissiveMap.isVideoTexture===!0&&Ft.getTransfer(x.emissiveMap.colorSpace)===qt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===2,flipSided:x.side===1,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:pe&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&x.extensions.multiDraw===!0||Ne)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return qe.vertexUv1s=c.has(1),qe.vertexUv2s=c.has(2),qe.vertexUv3s=c.has(3),c.clear(),qe}function m(x){const A=[];if(x.shaderID?A.push(x.shaderID):(A.push(x.customVertexShaderID),A.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)A.push(I),A.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(g(A,x),b(A,x),A.push(n.outputColorSpace)),A.push(x.customProgramCacheKey),A.join()}function g(x,A){x.push(A.precision),x.push(A.outputColorSpace),x.push(A.envMapMode),x.push(A.envMapCubeUVHeight),x.push(A.mapUv),x.push(A.alphaMapUv),x.push(A.lightMapUv),x.push(A.aoMapUv),x.push(A.bumpMapUv),x.push(A.normalMapUv),x.push(A.displacementMapUv),x.push(A.emissiveMapUv),x.push(A.metalnessMapUv),x.push(A.roughnessMapUv),x.push(A.anisotropyMapUv),x.push(A.clearcoatMapUv),x.push(A.clearcoatNormalMapUv),x.push(A.clearcoatRoughnessMapUv),x.push(A.iridescenceMapUv),x.push(A.iridescenceThicknessMapUv),x.push(A.sheenColorMapUv),x.push(A.sheenRoughnessMapUv),x.push(A.specularMapUv),x.push(A.specularColorMapUv),x.push(A.specularIntensityMapUv),x.push(A.transmissionMapUv),x.push(A.thicknessMapUv),x.push(A.combine),x.push(A.fogExp2),x.push(A.sizeAttenuation),x.push(A.morphTargetsCount),x.push(A.morphAttributeCount),x.push(A.numSunLights),x.push(A.numDirLights),x.push(A.numPointLights),x.push(A.numSpotLights),x.push(A.numSpotLightMaps),x.push(A.numHemiLights),x.push(A.numRectAreaLights),x.push(A.numSunLightShadows),x.push(A.numDirLightShadows),x.push(A.numPointLightShadows),x.push(A.numSpotLightShadows),x.push(A.numSpotLightShadowsWithMaps),x.push(A.numLightProbes),x.push(A.shadowMapType),x.push(A.toneMapping),x.push(A.numClippingPlanes),x.push(A.numClipIntersection),x.push(A.depthPacking)}function b(x,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function E(x){const A=d[x.type];let I;if(A){const B=Zi[A];I=Ec.clone(B.uniforms)}else I=x.uniforms;return I}function v(x,A){let I=f.get(A);return I!==void 0?++I.usedTimes:(I=new Am(n,A,x,s),l.push(I),f.set(A,I)),I}function S(x){if(--x.usedTimes===0){const A=l.indexOf(x);l[A]=l[l.length-1],l.pop(),f.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function P(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:E,acquireProgram:v,releaseProgram:S,releaseShaderCache:T,programs:l,dispose:P}}function km(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Im(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function J0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function j0(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,p,_,m,g){let b=n[e];return b===void 0?(b={id:h.id,object:h,geometry:d,material:p,materialVariant:a(h),groupOrder:_,renderOrder:h.renderOrder,z:m,group:g},n[e]=b):(b.id=h.id,b.object=h,b.geometry=d,b.material=p,b.materialVariant=a(h),b.groupOrder=_,b.renderOrder=h.renderOrder,b.z=m,b.group=g),e++,b}function c(h,d,p,_,m,g,b){b.reversedDepth===!0&&(m=-m);const E=o(h,d,p,_,m,g);p.transmission>0?i.push(E):p.transparent===!0?s.push(E):t.push(E)}function l(h,d,p,_,m,g){const b=o(h,d,p,_,m,g);p.transmission>0?i.unshift(b):p.transparent===!0?s.unshift(b):t.unshift(b)}function f(h,d){t.length>1&&t.sort(h||Im),i.length>1&&i.sort(d||J0),s.length>1&&s.sort(d||J0)}function u(){for(let h=e,d=n.length;h<d;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:u,sort:f}}function Fm(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new j0,n.set(i,[a])):s>=r.length?(a=new j0,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Um(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new H,color:new Lt};break;case"SpotLight":t={position:new H,direction:new H,color:new Lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new Lt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new Lt,groundColor:new Lt};break;case"RectAreaLight":t={color:new Lt,position:new H,halfWidth:new H,halfHeight:new H};break}return n[e.id]=t,t}}}function Nm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let $m=0;function Bm(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Om(n){const e=new Um,t=Nm(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new H);const s=new H,r=new En,a=new En;function o(l){let f=0,u=0,h=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let d=0,p=0,_=0,m=0,g=0,b=0,E=0,v=0,S=0,T=0,P=0,x=0,A=0,I=0;l.sort(Bm);for(let U=0,z=l.length;U<z;U++){const D=l[U],G=D.color,K=D.intensity,W=D.distance;let le=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===1030?le=D.shadow.map.texture:le=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)f+=G.r*K,u+=G.g*K,h+=G.b*K;else if(D.isLightProbe){for(let Q=0;Q<9;Q++)i.probe[Q].addScaledVector(D.sh.coefficients[Q],K);I++}else if(D.isSunLight){const Q=e.get(D);if(Q.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const ae=D.shadow,de=t.get(D);de.shadowIntensity=ae.intensity,de.shadowBias=ae.bias,de.shadowNormalBias=ae.normalBias,de.shadowRadius=ae.radius,de.shadowMapSize.copy(ae.mapSize).multiply(ae.getFrameExtents()),i.sunShadow[p]=de,i.sunShadowMap[p]=le;const Ve=ae.getViewportCount();for(let ze=0;ze<Ve;ze++)i.sunShadowMatrix[_+ze]=ae.getMatrix(ze),i.sunShadowCascade[_+ze]=ae._cascadeData[ze];_+=Ve,p++}i.sun[d]=Q,d++}else if(D.isDirectionalLight){const Q=e.get(D);if(Q.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const ae=D.shadow,de=t.get(D);de.shadowIntensity=ae.intensity,de.shadowBias=ae.bias,de.shadowNormalBias=ae.normalBias,de.shadowRadius=ae.radius,de.shadowMapSize=ae.mapSize,i.directionalShadow[m]=de,i.directionalShadowMap[m]=le,i.directionalShadowMatrix[m]=D.shadow.matrix,S++}i.directional[m]=Q,m++}else if(D.isSpotLight){const Q=e.get(D);Q.position.setFromMatrixPosition(D.matrixWorld),Q.color.copy(G).multiplyScalar(K),Q.distance=W,Q.coneCos=Math.cos(D.angle),Q.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Q.decay=D.decay,i.spot[b]=Q;const ae=D.shadow;if(D.map&&(i.spotLightMap[x]=D.map,x++,ae.updateMatrices(D),D.castShadow&&A++),i.spotLightMatrix[b]=ae.matrix,D.castShadow){const de=t.get(D);de.shadowIntensity=ae.intensity,de.shadowBias=ae.bias,de.shadowNormalBias=ae.normalBias,de.shadowRadius=ae.radius,de.shadowMapSize=ae.mapSize,i.spotShadow[b]=de,i.spotShadowMap[b]=le,P++}b++}else if(D.isRectAreaLight){const Q=e.get(D);Q.color.copy(G).multiplyScalar(K),Q.halfWidth.set(D.width*.5,0,0),Q.halfHeight.set(0,D.height*.5,0),i.rectArea[E]=Q,E++}else if(D.isPointLight){const Q=e.get(D);if(Q.color.copy(D.color).multiplyScalar(D.intensity),Q.distance=D.distance,Q.decay=D.decay,D.castShadow){const ae=D.shadow,de=t.get(D);de.shadowIntensity=ae.intensity,de.shadowBias=ae.bias,de.shadowNormalBias=ae.normalBias,de.shadowRadius=ae.radius,de.shadowMapSize=ae.mapSize,de.shadowCameraNear=ae.camera.near,de.shadowCameraFar=ae.camera.far,i.pointShadow[g]=de,i.pointShadowMap[g]=le,i.pointShadowMatrix[g]=D.shadow.matrix,T++}i.point[g]=Q,g++}else if(D.isHemisphereLight){const Q=e.get(D);Q.skyColor.copy(D.color).multiplyScalar(K),Q.groundColor.copy(D.groundColor).multiplyScalar(K),i.hemi[v]=Q,v++}}E>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ke.LTC_FLOAT_1,i.rectAreaLTC2=ke.LTC_FLOAT_2):(i.rectAreaLTC1=ke.LTC_HALF_1,i.rectAreaLTC2=ke.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=u,i.ambient[2]=h;const B=i.hash;(B.sunLength!==d||B.directionalLength!==m||B.pointLength!==g||B.spotLength!==b||B.rectAreaLength!==E||B.hemiLength!==v||B.numSunShadows!==p||B.numDirectionalShadows!==S||B.numPointShadows!==T||B.numSpotShadows!==P||B.numSpotMaps!==x||B.numLightProbes!==I)&&(i.sun.length=d,i.directional.length=m,i.spot.length=b,i.rectArea.length=E,i.point.length=g,i.hemi.length=v,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=P,i.spotShadowMap.length=P,i.spotLightMatrix.length=P+x-A,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=I,B.sunLength=d,B.directionalLength=m,B.pointLength=g,B.spotLength=b,B.rectAreaLength=E,B.hemiLength=v,B.numSunShadows=p,B.numDirectionalShadows=S,B.numPointShadows=T,B.numSpotShadows=P,B.numSpotMaps=x,B.numLightProbes=I,i.version=$m++)}function c(l,f){let u=0,h=0,d=0,p=0,_=0,m=0;const g=f.matrixWorldInverse;for(let b=0,E=l.length;b<E;b++){const v=l[b];if(v.isSunLight){const S=i.sun[u];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(g),u++}else if(v.isDirectionalLight){const S=i.directional[h];S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(g),h++}else if(v.isSpotLight){const S=i.spot[p];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(g),p++}else if(v.isRectAreaLight){const S=i.rectArea[_];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(g),a.identity(),r.copy(v.matrixWorld),r.premultiply(g),a.extractRotation(r),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),_++}else if(v.isPointLight){const S=i.point[d];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(g),d++}else if(v.isHemisphereLight){const S=i.hemi[m];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(g),m++}}}return{setup:o,setupView:c,state:i}}function ef(n){const e=new Om(n),t=[],i=[],s=[];function r(h){u.camera=h,t.length=0,i.length=0,s.length=0}function a(h){t.push(h)}function o(h){i.push(h)}function c(h){s.push(h)}function l(){e.setup(t)}function f(h){e.setupView(t,h)}const u={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:f,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function Gm(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new ef(n),e.set(s,[o])):r>=a.length?(o=new ef(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const zm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hm=`uniform sampler2D shadow_pass;
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
}`,Vm=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],Wm=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],tf=new En,da=new H,Rl=new H;function Xm(n,e,t){let i=new Tc;const s=new ht,r=new ht,a=new Tn,o=new Zu,c=new Yu,l={},f=t.maxTextureSize,u={0:1,1:0,2:2},h=new _i({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:zm,fragmentShader:Hm}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const p=new Di;p.setAttribute("position",new Ji(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new fn(p,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let g=this.type;this.render=function(T,P,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===2&&(ft("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=1);const A=n.getRenderTarget(),I=n.getActiveCubeFace(),B=n.getActiveMipmapLevel(),U=n.state;U.setBlending(0),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const z=g!==this.type;z&&P.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(G=>G.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,G=T.length;D<G;D++){const K=T[D],W=K.shadow;if(W===void 0){ft("WebGLShadowMap:",K,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const le=W.getFrameExtents();s.multiply(le),r.copy(W.mapSize),(s.x>f||s.y>f)&&(s.x>f&&(r.x=Math.floor(f/le.x),s.x=r.x*le.x,W.mapSize.x=r.x),s.y>f&&(r.y=Math.floor(f/le.y),s.y=r.y*le.y,W.mapSize.y=r.y));const Q=n.state.buffers.depth.getReversed();if(W.camera._reversedDepth=Q,W.map===null||z===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===3){if(K.isPointLight){ft("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new mi(s.x,s.y,{format:1030,type:1016,minFilter:1006,magFilter:1006,generateMipmaps:!1}),W.map.texture.name=K.name+".shadowMap",W.map.depthTexture=new Br(s.x,s.y,1015),W.map.depthTexture.name=K.name+".shadowMapDepth",W.map.depthTexture.format=1026,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=1003,W.map.depthTexture.magFilter=1003}else K.isPointLight?(W.map=new sh(s.x),W.map.depthTexture=new Vu(s.x,1014)):(W.map=new mi(s.x,s.y),W.map.depthTexture=new Br(s.x,s.y,1014)),W.map.depthTexture.name=K.name+".shadowMap",W.map.depthTexture.format=1026,this.type===1?(W.map.depthTexture.compareFunction=Q?518:515,W.map.depthTexture.minFilter=1006,W.map.depthTexture.magFilter=1006):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=1003,W.map.depthTexture.magFilter=1003);W.camera.updateProjectionMatrix()}W.map.isWebGLCubeRenderTarget!==!0&&(W.map.width!==s.x||W.map.height!==s.y)&&W.map.setSize(s.x,s.y);const ae=W.map.isWebGLCubeRenderTarget?6:W.getViewportCount();K.isPointLight!==!0&&W.updateMatrices(K,x);for(let de=0;de<ae;de++){const Ve=W.getCamera(de);if(K.isPointLight){const ze=W.camera,Me=W.matrix,Pe=K.distance||ze.far;Pe!==ze.far&&(ze.far=Pe,ze.updateProjectionMatrix()),da.setFromMatrixPosition(K.matrixWorld),ze.position.copy(da),Rl.copy(ze.position),Rl.add(Vm[de]),ze.up.copy(Wm[de]),ze.lookAt(Rl),ze.updateMatrixWorld(),Me.makeTranslation(-da.x,-da.y,-da.z),tf.multiplyMatrices(ze.projectionMatrix,ze.matrixWorldInverse),W._frustum.setFromProjectionMatrix(tf,ze.coordinateSystem,ze.reversedDepth)}if(W.map.isWebGLCubeRenderTarget)n.setRenderTarget(W.map,de),n.clear();else{de===0&&(n.setRenderTarget(W.map),n.clear());const ze=W.getViewport(de);a.set(r.x*ze.x,r.y*ze.y,r.x*ze.z,r.y*ze.w),U.viewport(a)}i=W.getFrustum(de),v(P,x,Ve,K,this.type)}W.isPointLightShadow!==!0&&this.type===3&&b(W,x),W.needsUpdate=!1}g=this.type,m.needsUpdate=!1,n.setRenderTarget(A,I,B)};function b(T,P){const x=e.update(_);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null?T.mapPass=new mi(s.x,s.y,{format:1030,type:1016}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(P,null,x,h,_,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(P,null,x,d,_,null)}function E(T,P,x,A){let I=null;const B=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(B!==void 0)I=B;else if(I=x.isPointLight===!0?c:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const U=I.uuid,z=P.uuid;let D=l[U];D===void 0&&(D={},l[U]=D);let G=D[z];G===void 0&&(G=I.clone(),D[z]=G,P.addEventListener("dispose",S)),I=G}if(I.visible=P.visible,I.wireframe=P.wireframe,A===3?I.side=P.shadowSide!==null?P.shadowSide:P.side:I.side=P.shadowSide!==null?P.shadowSide:u[P.side],I.alphaMap=P.alphaMap,I.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,I.map=P.map,I.clipShadows=P.clipShadows,I.clippingPlanes=P.clippingPlanes,I.clipIntersection=P.clipIntersection,I.displacementMap=P.displacementMap,I.displacementScale=P.displacementScale,I.displacementBias=P.displacementBias,I.wireframeLinewidth=P.wireframeLinewidth,I.linewidth=P.linewidth,x.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const U=n.properties.get(I);U.light=x}return I}function v(T,P,x,A,I){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&I===3)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);const z=e.update(T),D=T.material;if(Array.isArray(D)){const G=z.groups;for(let K=0,W=G.length;K<W;K++){const le=G[K],Q=D[le.materialIndex];if(Q&&Q.visible){const ae=E(T,Q,A,I);T.onBeforeShadow(n,T,P,x,z,ae,le),n.renderBufferDirect(x,null,z,ae,T,le),T.onAfterShadow(n,T,P,x,z,ae,le)}}}else if(D.visible){const G=E(T,D,A,I);T.onBeforeShadow(n,T,P,x,z,G,null),n.renderBufferDirect(x,null,z,G,T,null),T.onAfterShadow(n,T,P,x,z,G,null)}}const U=T.children;for(let z=0,D=U.length;z<D;z++)v(U[z],P,x,A,I)}function S(T){T.target.removeEventListener("dispose",S);for(const x in l){const A=l[x],I=T.target.uuid;I in A&&(A[I].dispose(),delete A[I])}}}function qm(n,e){function t(){let $=!1;const Le=new Tn;let fe=null;const Ce=new Tn(0,0,0,0);return{setMask:function($e){fe!==$e&&!$&&(n.colorMask($e,$e,$e,$e),fe=$e)},setLocked:function($e){$=$e},setClear:function($e,pe,tt,qe,on){on===!0&&($e*=qe,pe*=qe,tt*=qe),Le.set($e,pe,tt,qe),Ce.equals(Le)===!1&&(n.clearColor($e,pe,tt,qe),Ce.copy(Le))},reset:function(){$=!1,fe=null,Ce.set(-1,0,0,0)}}}function i(){let $=!1,Le=!1,fe=null,Ce=null,$e=null;return{setReversed:function(pe){if(Le!==pe){const tt=e.get("EXT_clip_control");pe?tt.clipControlEXT(tt.LOWER_LEFT_EXT,tt.ZERO_TO_ONE_EXT):tt.clipControlEXT(tt.LOWER_LEFT_EXT,tt.NEGATIVE_ONE_TO_ONE_EXT),Le=pe;const qe=$e;$e=null,this.setClear(qe)}},getReversed:function(){return Le},setTest:function(pe){pe?ce(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(pe){fe!==pe&&!$&&(n.depthMask(pe),fe=pe)},setFunc:function(pe){if(Le&&(pe=gu[pe]),Ce!==pe){switch(pe){case 0:n.depthFunc(n.NEVER);break;case 1:n.depthFunc(n.ALWAYS);break;case 2:n.depthFunc(n.LESS);break;case 3:n.depthFunc(n.LEQUAL);break;case 4:n.depthFunc(n.EQUAL);break;case 5:n.depthFunc(n.GEQUAL);break;case 6:n.depthFunc(n.GREATER);break;case 7:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ce=pe}},setLocked:function(pe){$=pe},setClear:function(pe){$e!==pe&&($e=pe,Le&&(pe=1-pe),n.clearDepth(pe))},reset:function(){$=!1,fe=null,Ce=null,$e=null,Le=!1}}}function s(){let $=!1,Le=null,fe=null,Ce=null,$e=null,pe=null,tt=null,qe=null,on=null;return{setTest:function(Wt){$||(Wt?ce(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(Wt){Le!==Wt&&!$&&(n.stencilMask(Wt),Le=Wt)},setFunc:function(Wt,ki,Hi){(fe!==Wt||Ce!==ki||$e!==Hi)&&(n.stencilFunc(Wt,ki,Hi),fe=Wt,Ce=ki,$e=Hi)},setOp:function(Wt,ki,Hi){(pe!==Wt||tt!==ki||qe!==Hi)&&(n.stencilOp(Wt,ki,Hi),pe=Wt,tt=ki,qe=Hi)},setLocked:function(Wt){$=Wt},setClear:function(Wt){on!==Wt&&(n.clearStencil(Wt),on=Wt)},reset:function(){$=!1,Le=null,fe=null,Ce=null,$e=null,pe=null,tt=null,qe=null,on=null}}}const r=new t,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let f={},u={},h={},d=new WeakMap,p=[],_=null,m=!1,g=null,b=null,E=null,v=null,S=null,T=null,P=null,x=new Lt(0,0,0),A=0,I=!1,B=null,U=null,z=null,D=null,G=null;const K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,le=0;const Q=n.getParameter(n.VERSION);Q.indexOf("WebGL")!==-1?(le=parseFloat(/^WebGL (\d)/.exec(Q)[1]),W=le>=1):Q.indexOf("OpenGL ES")!==-1&&(le=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),W=le>=2);let ae=null,de={};const Ve=n.getParameter(n.SCISSOR_BOX),ze=n.getParameter(n.VIEWPORT),Me=new Tn().fromArray(Ve),Pe=new Tn().fromArray(ze);function Ye($,Le,fe,Ce){const $e=new Uint8Array(4),pe=n.createTexture();n.bindTexture($,pe),n.texParameteri($,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri($,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let tt=0;tt<fe;tt++)$===n.TEXTURE_3D||$===n.TEXTURE_2D_ARRAY?n.texImage3D(Le,0,n.RGBA,1,1,Ce,0,n.RGBA,n.UNSIGNED_BYTE,$e):n.texImage2D(Le+tt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,$e);return pe}const te={};te[n.TEXTURE_2D]=Ye(n.TEXTURE_2D,n.TEXTURE_2D,1),te[n.TEXTURE_CUBE_MAP]=Ye(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[n.TEXTURE_2D_ARRAY]=Ye(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),te[n.TEXTURE_3D]=Ye(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ce(n.DEPTH_TEST),a.setFunc(3),It(!1),mn(1),ce(n.CULL_FACE),zt(0);function ce($){f[$]!==!0&&(n.enable($),f[$]=!0)}function we($){f[$]!==!1&&(n.disable($),f[$]=!1)}function st($,Le){return h[$]!==Le?(n.bindFramebuffer($,Le),h[$]=Le,$===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=Le),$===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=Le),!0):!1}function Ne($,Le){let fe=p,Ce=!1;if($){fe=d.get(Le),fe===void 0&&(fe=[],d.set(Le,fe));const $e=$.textures;if(fe.length!==$e.length||fe[0]!==n.COLOR_ATTACHMENT0){for(let pe=0,tt=$e.length;pe<tt;pe++)fe[pe]=n.COLOR_ATTACHMENT0+pe;fe.length=$e.length,Ce=!0}}else fe[0]!==n.BACK&&(fe[0]=n.BACK,Ce=!0);Ce&&n.drawBuffers(fe)}function St($){return _!==$?(n.useProgram($),_=$,!0):!1}const Rn={100:n.FUNC_ADD,101:n.FUNC_SUBTRACT,102:n.FUNC_REVERSE_SUBTRACT};Rn[103]=n.MIN,Rn[104]=n.MAX;const Dt={200:n.ZERO,201:n.ONE,202:n.SRC_COLOR,204:n.SRC_ALPHA,210:n.SRC_ALPHA_SATURATE,208:n.DST_COLOR,206:n.DST_ALPHA,203:n.ONE_MINUS_SRC_COLOR,205:n.ONE_MINUS_SRC_ALPHA,209:n.ONE_MINUS_DST_COLOR,207:n.ONE_MINUS_DST_ALPHA,211:n.CONSTANT_COLOR,212:n.ONE_MINUS_CONSTANT_COLOR,213:n.CONSTANT_ALPHA,214:n.ONE_MINUS_CONSTANT_ALPHA};function zt($,Le,fe,Ce,$e,pe,tt,qe,on,Wt){if($===0){m===!0&&(we(n.BLEND),m=!1);return}if(m===!1&&(ce(n.BLEND),m=!0),$!==5){if($!==g||Wt!==I){if((b!==100||S!==100)&&(n.blendEquation(n.FUNC_ADD),b=100,S=100),Wt)switch($){case 1:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case 2:n.blendFunc(n.ONE,n.ONE);break;case 3:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case 4:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Gt("WebGLState: Invalid blending: ",$);break}else switch($){case 1:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case 2:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case 3:Gt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:Gt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Gt("WebGLState: Invalid blending: ",$);break}E=null,v=null,T=null,P=null,x.set(0,0,0),A=0,g=$,I=Wt}return}$e=$e||Le,pe=pe||fe,tt=tt||Ce,(Le!==b||$e!==S)&&(n.blendEquationSeparate(Rn[Le],Rn[$e]),b=Le,S=$e),(fe!==E||Ce!==v||pe!==T||tt!==P)&&(n.blendFuncSeparate(Dt[fe],Dt[Ce],Dt[pe],Dt[tt]),E=fe,v=Ce,T=pe,P=tt),(qe.equals(x)===!1||on!==A)&&(n.blendColor(qe.r,qe.g,qe.b,on),x.copy(qe),A=on),g=$,I=!1}function an($,Le){$.side===2?we(n.CULL_FACE):ce(n.CULL_FACE);let fe=$.side===1;Le&&(fe=!fe),It(fe),$.blending===1&&$.transparent===!1?zt(0):zt($.blending,$.blendEquation,$.blendSrc,$.blendDst,$.blendEquationAlpha,$.blendSrcAlpha,$.blendDstAlpha,$.blendColor,$.blendAlpha,$.premultipliedAlpha),a.setFunc($.depthFunc),a.setTest($.depthTest),a.setMask($.depthWrite),r.setMask($.colorWrite);const Ce=$.stencilWrite;o.setTest(Ce),Ce&&(o.setMask($.stencilWriteMask),o.setFunc($.stencilFunc,$.stencilRef,$.stencilFuncMask),o.setOp($.stencilFail,$.stencilZFail,$.stencilZPass)),hi($.polygonOffset,$.polygonOffsetFactor,$.polygonOffsetUnits),$.alphaToCoverage===!0?ce(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function It($){B!==$&&($?n.frontFace(n.CW):n.frontFace(n.CCW),B=$)}function mn($){$!==0?(ce(n.CULL_FACE),$!==U&&($===1?n.cullFace(n.BACK):$===2?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),U=$}function Wn($){$!==z&&(W&&n.lineWidth($),z=$)}function hi($,Le,fe){$?(ce(n.POLYGON_OFFSET_FILL),(D!==Le||G!==fe)&&(D=Le,G=fe,a.getReversed()&&(Le=-Le),n.polygonOffset(Le,fe))):we(n.POLYGON_OFFSET_FILL)}function xn($){$?ce(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function kn($){$===void 0&&($=n.TEXTURE0+K-1),ae!==$&&(n.activeTexture($),ae=$)}function O($,Le,fe){fe===void 0&&(ae===null?fe=n.TEXTURE0+K-1:fe=ae);let Ce=de[fe];Ce===void 0&&(Ce={type:void 0,texture:void 0},de[fe]=Ce),(Ce.type!==$||Ce.texture!==Le)&&(ae!==fe&&(n.activeTexture(fe),ae=fe),n.bindTexture($,Le||te[$]),Ce.type=$,Ce.texture=Le)}function Jn(){const $=de[ae];$!==void 0&&$.type!==void 0&&(n.bindTexture($.type,null),$.type=void 0,$.texture=void 0)}function Yt(){try{n.compressedTexImage2D(...arguments)}catch($){Gt("WebGLState:",$)}}function R(){try{n.compressedTexImage3D(...arguments)}catch($){Gt("WebGLState:",$)}}function M(){try{n.texSubImage2D(...arguments)}catch($){Gt("WebGLState:",$)}}function V(){try{n.texSubImage3D(...arguments)}catch($){Gt("WebGLState:",$)}}function Z(){try{n.compressedTexSubImage2D(...arguments)}catch($){Gt("WebGLState:",$)}}function ne(){try{n.compressedTexSubImage3D(...arguments)}catch($){Gt("WebGLState:",$)}}function be(){try{n.texStorage2D(...arguments)}catch($){Gt("WebGLState:",$)}}function Te(){try{n.texStorage3D(...arguments)}catch($){Gt("WebGLState:",$)}}function se(){try{n.texImage2D(...arguments)}catch($){Gt("WebGLState:",$)}}function he(){try{n.texImage3D(...arguments)}catch($){Gt("WebGLState:",$)}}function Ae($){return u[$]!==void 0?u[$]:n.getParameter($)}function Je($,Le){u[$]!==Le&&(n.pixelStorei($,Le),u[$]=Le)}function De($){Me.equals($)===!1&&(n.scissor($.x,$.y,$.z,$.w),Me.copy($))}function Re($){Pe.equals($)===!1&&(n.viewport($.x,$.y,$.z,$.w),Pe.copy($))}function je($,Le){let fe=l.get(Le);fe===void 0&&(fe=new WeakMap,l.set(Le,fe));let Ce=fe.get($);Ce===void 0&&(Ce=n.getUniformBlockIndex(Le,$.name),fe.set($,Ce))}function at($,Le){const Ce=l.get(Le).get($);c.get(Le)!==Ce&&(n.uniformBlockBinding(Le,Ce,$.__bindingPointIndex),c.set(Le,Ce))}function gt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),f={},u={},ae=null,de={},h={},d=new WeakMap,p=[],_=null,m=!1,g=null,b=null,E=null,v=null,S=null,T=null,P=null,x=new Lt(0,0,0),A=0,I=!1,B=null,U=null,z=null,D=null,G=null,Me.set(0,0,n.canvas.width,n.canvas.height),Pe.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ce,disable:we,bindFramebuffer:st,drawBuffers:Ne,useProgram:St,setBlending:zt,setMaterial:an,setFlipSided:It,setCullFace:mn,setLineWidth:Wn,setPolygonOffset:hi,setScissorTest:xn,activeTexture:kn,bindTexture:O,unbindTexture:Jn,compressedTexImage2D:Yt,compressedTexImage3D:R,texImage2D:se,texImage3D:he,pixelStorei:Je,getParameter:Ae,updateUBOMapping:je,uniformBlockBinding:at,texStorage2D:be,texStorage3D:Te,texSubImage2D:M,texSubImage3D:V,compressedTexSubImage2D:Z,compressedTexSubImage3D:ne,scissor:De,viewport:Re,reset:gt}}function Zm(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ht,f=new WeakMap,u=new Set;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,M){return p?new OffscreenCanvas(R,M):Ca("canvas")}function m(R,M,V){let Z=1;const ne=Yt(R);if((ne.width>V||ne.height>V)&&(Z=V/Math.max(ne.width,ne.height)),Z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const be=Math.floor(Z*ne.width),Te=Math.floor(Z*ne.height);h===void 0&&(h=_(be,Te));const se=M?_(be,Te):h;return se.width=be,se.height=Te,se.getContext("2d").drawImage(R,0,0,be,Te),ft("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+be+"x"+Te+")."),se}else return"data"in R&&ft("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),R;return R}function g(R){return R.generateMipmaps}function b(R){n.generateMipmap(R)}function E(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(R,M,V,Z,ne,be=!1){if(R!==null){if(n[R]!==void 0)return n[R];ft("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Te;Z&&(Te=e.get("EXT_texture_norm16"),Te||ft("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let se=M;if(M===n.RED&&(V===n.FLOAT&&(se=n.R32F),V===n.HALF_FLOAT&&(se=n.R16F),V===n.UNSIGNED_BYTE&&(se=n.R8),V===n.UNSIGNED_SHORT&&Te&&(se=Te.R16_EXT),V===n.SHORT&&Te&&(se=Te.R16_SNORM_EXT)),M===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(se=n.R8UI),V===n.UNSIGNED_SHORT&&(se=n.R16UI),V===n.UNSIGNED_INT&&(se=n.R32UI),V===n.BYTE&&(se=n.R8I),V===n.SHORT&&(se=n.R16I),V===n.INT&&(se=n.R32I)),M===n.RG&&(V===n.FLOAT&&(se=n.RG32F),V===n.HALF_FLOAT&&(se=n.RG16F),V===n.UNSIGNED_BYTE&&(se=n.RG8),V===n.UNSIGNED_SHORT&&Te&&(se=Te.RG16_EXT),V===n.SHORT&&Te&&(se=Te.RG16_SNORM_EXT)),M===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(se=n.RG8UI),V===n.UNSIGNED_SHORT&&(se=n.RG16UI),V===n.UNSIGNED_INT&&(se=n.RG32UI),V===n.BYTE&&(se=n.RG8I),V===n.SHORT&&(se=n.RG16I),V===n.INT&&(se=n.RG32I)),M===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(se=n.RGB8UI),V===n.UNSIGNED_SHORT&&(se=n.RGB16UI),V===n.UNSIGNED_INT&&(se=n.RGB32UI),V===n.BYTE&&(se=n.RGB8I),V===n.SHORT&&(se=n.RGB16I),V===n.INT&&(se=n.RGB32I)),M===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(se=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(se=n.RGBA16UI),V===n.UNSIGNED_INT&&(se=n.RGBA32UI),V===n.BYTE&&(se=n.RGBA8I),V===n.SHORT&&(se=n.RGBA16I),V===n.INT&&(se=n.RGBA32I)),M===n.RGB&&(V===n.UNSIGNED_SHORT&&Te&&(se=Te.RGB16_EXT),V===n.SHORT&&Te&&(se=Te.RGB16_SNORM_EXT),V===n.UNSIGNED_INT_5_9_9_9_REV&&(se=n.RGB9_E5),V===n.UNSIGNED_INT_10F_11F_11F_REV&&(se=n.R11F_G11F_B10F)),M===n.RGBA){const he=be?Lo:Ft.getTransfer(ne);V===n.FLOAT&&(se=n.RGBA32F),V===n.HALF_FLOAT&&(se=n.RGBA16F),V===n.UNSIGNED_BYTE&&(se=he===qt?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT&&Te&&(se=Te.RGBA16_EXT),V===n.SHORT&&Te&&(se=Te.RGBA16_SNORM_EXT),V===n.UNSIGNED_SHORT_4_4_4_4&&(se=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(se=n.RGB5_A1)}return(se===n.R16F||se===n.R32F||se===n.RG16F||se===n.RG32F||se===n.RGBA16F||se===n.RGBA32F)&&e.get("EXT_color_buffer_float"),se}function S(R,M){let V;return R?M===null||M===1014||M===1020?V=n.DEPTH24_STENCIL8:M===1015?V=n.DEPTH32F_STENCIL8:M===1012&&(V=n.DEPTH24_STENCIL8,ft("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===1014||M===1020?V=n.DEPTH_COMPONENT24:M===1015?V=n.DEPTH_COMPONENT32F:M===1012&&(V=n.DEPTH_COMPONENT16),V}function T(R,M){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==1003&&R.minFilter!==1006?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function P(R){const M=R.target;M.removeEventListener("dispose",P),A(M),M.isVideoTexture&&f.delete(M),M.isHTMLTexture&&u.delete(M)}function x(R){const M=R.target;M.removeEventListener("dispose",x),B(M)}function A(R){const M=i.get(R);if(M.__webglInit===void 0)return;const V=R.source,Z=d.get(V);if(Z){const ne=Z[M.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&I(R),Object.keys(Z).length===0&&d.delete(V)}i.remove(R)}function I(R){const M=i.get(R);n.deleteTexture(M.__webglTexture);const V=R.source,Z=d.get(V);delete Z[M.__cacheKey],a.memory.textures--}function B(R){const M=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(M.__webglFramebuffer[Z]))for(let ne=0;ne<M.__webglFramebuffer[Z].length;ne++)n.deleteFramebuffer(M.__webglFramebuffer[Z][ne]);else n.deleteFramebuffer(M.__webglFramebuffer[Z]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[Z])}else{if(Array.isArray(M.__webglFramebuffer))for(let Z=0;Z<M.__webglFramebuffer.length;Z++)n.deleteFramebuffer(M.__webglFramebuffer[Z]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Z=0;Z<M.__webglColorRenderbuffer.length;Z++)M.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[Z]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const V=R.textures;for(let Z=0,ne=V.length;Z<ne;Z++){const be=i.get(V[Z]);be.__webglTexture&&(n.deleteTexture(be.__webglTexture),a.memory.textures--),i.remove(V[Z])}i.remove(R)}let U=0;function z(){U=0}function D(){return U}function G(R){U=R}function K(){const R=U;return R>=s.maxTextures&&ft("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+s.maxTextures),U+=1,R}function W(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function le(R,M){const V=i.get(R);if(R.isVideoTexture&&O(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&V.__version!==R.version){const Z=R.image;if(Z===null)ft("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)ft("WebGLRenderer: Texture marked for update but image is incomplete");else{we(V,R,M);return}}else R.isExternalTexture&&(V.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+M)}function Q(R,M){const V=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){we(V,R,M);return}else R.isExternalTexture&&(V.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+M)}function ae(R,M){const V=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){we(V,R,M);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+M)}function de(R,M){const V=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&V.__version!==R.version){st(V,R,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+M)}const Ve={1e3:n.REPEAT,1001:n.CLAMP_TO_EDGE,1002:n.MIRRORED_REPEAT},ze={1003:n.NEAREST,1004:n.NEAREST_MIPMAP_NEAREST,1005:n.NEAREST_MIPMAP_LINEAR,1006:n.LINEAR,1007:n.LINEAR_MIPMAP_NEAREST,1008:n.LINEAR_MIPMAP_LINEAR},Me={512:n.NEVER,519:n.ALWAYS,513:n.LESS,515:n.LEQUAL,514:n.EQUAL,518:n.GEQUAL,516:n.GREATER,517:n.NOTEQUAL};function Pe(R,M){if(M.type===1015&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===1006||M.magFilter===1007||M.magFilter===1005||M.magFilter===1008||M.minFilter===1006||M.minFilter===1007||M.minFilter===1005||M.minFilter===1008)&&ft("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,Ve[M.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,Ve[M.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,Ve[M.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,ze[M.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,ze[M.minFilter]),M.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Me[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===1003||M.minFilter!==1005&&M.minFilter!==1008||M.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Ye(R,M){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",P));const Z=M.source;let ne=d.get(Z);ne===void 0&&(ne={},d.set(Z,ne));const be=W(M);if(be!==R.__cacheKey){ne[be]===void 0&&(ne[be]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,V=!0),ne[be].usedTimes++;const Te=ne[R.__cacheKey];Te!==void 0&&(ne[R.__cacheKey].usedTimes--,Te.usedTimes===0&&I(M)),R.__cacheKey=be,R.__webglTexture=ne[be].texture}return V}function te(R,M,V){return Math.floor(Math.floor(R/V)/M)}function ce(R,M,V,Z){const be=R.updateRanges;if(be.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,V,Z,M.data);else{be.sort((Je,De)=>Je.start-De.start);let Te=0;for(let Je=1;Je<be.length;Je++){const De=be[Te],Re=be[Je],je=De.start+De.count,at=te(Re.start,M.width,4),gt=te(De.start,M.width,4);Re.start<=je+1&&at===gt&&te(Re.start+Re.count-1,M.width,4)===at?De.count=Math.max(De.count,Re.start+Re.count-De.start):(++Te,be[Te]=Re)}be.length=Te+1;const se=t.getParameter(n.UNPACK_ROW_LENGTH),he=t.getParameter(n.UNPACK_SKIP_PIXELS),Ae=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let Je=0,De=be.length;Je<De;Je++){const Re=be[Je],je=Math.floor(Re.start/4),at=Math.ceil(Re.count/4),gt=je%M.width,$=Math.floor(je/M.width),Le=at,fe=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,gt),t.pixelStorei(n.UNPACK_SKIP_ROWS,$),t.texSubImage2D(n.TEXTURE_2D,0,gt,$,Le,fe,V,Z,M.data)}R.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,se),t.pixelStorei(n.UNPACK_SKIP_PIXELS,he),t.pixelStorei(n.UNPACK_SKIP_ROWS,Ae)}}function we(R,M,V){let Z=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Z=n.TEXTURE_3D);const ne=Ye(R,M),be=M.source;t.bindTexture(Z,R.__webglTexture,n.TEXTURE0+V);const Te=i.get(be);if(be.version!==Te.__version||ne===!0){if(t.activeTexture(n.TEXTURE0+V),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const fe=Ft.getPrimaries(Ft.workingColorSpace),Ce=M.colorSpace===""?null:Ft.getPrimaries(M.colorSpace),$e=M.colorSpace===""||fe===Ce?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,$e)}t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment);let he=m(M.image,!1,s.maxTextureSize);he=Jn(M,he);const Ae=r.convert(M.format,M.colorSpace),Je=r.convert(M.type);let De=v(M.internalFormat,Ae,Je,M.normalized,M.colorSpace,M.isVideoTexture);Pe(Z,M);let Re;const je=M.mipmaps,at=M.isVideoTexture!==!0,gt=Te.__version===void 0||ne===!0,$=be.dataReady,Le=T(M,he);if(M.isDepthTexture)De=S(M.format===1027,M.type),gt&&(at?t.texStorage2D(n.TEXTURE_2D,1,De,he.width,he.height):t.texImage2D(n.TEXTURE_2D,0,De,he.width,he.height,0,Ae,Je,null));else if(M.isDataTexture)if(je.length>0){at&&gt&&t.texStorage2D(n.TEXTURE_2D,Le,De,je[0].width,je[0].height);for(let fe=0,Ce=je.length;fe<Ce;fe++)Re=je[fe],at?$&&t.texSubImage2D(n.TEXTURE_2D,fe,0,0,Re.width,Re.height,Ae,Je,Re.data):t.texImage2D(n.TEXTURE_2D,fe,De,Re.width,Re.height,0,Ae,Je,Re.data);M.generateMipmaps=!1}else at?(gt&&t.texStorage2D(n.TEXTURE_2D,Le,De,he.width,he.height),$&&ce(M,he,Ae,Je)):t.texImage2D(n.TEXTURE_2D,0,De,he.width,he.height,0,Ae,Je,he.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){at&&gt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Le,De,je[0].width,je[0].height,he.depth);for(let fe=0,Ce=je.length;fe<Ce;fe++)if(Re=je[fe],M.format!==1023)if(Ae!==null)if(at){if($)if(M.layerUpdates.size>0){const $e=k0(Re.width,Re.height,M.format,M.type);for(const pe of M.layerUpdates){const tt=Re.data.subarray(pe*$e/Re.data.BYTES_PER_ELEMENT,(pe+1)*$e/Re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,fe,0,0,pe,Re.width,Re.height,1,Ae,tt)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,fe,0,0,0,Re.width,Re.height,he.depth,Ae,Re.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,fe,De,Re.width,Re.height,he.depth,0,Re.data,0,0);else ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else at?$&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,fe,0,0,0,Re.width,Re.height,he.depth,Ae,Je,Re.data):t.texImage3D(n.TEXTURE_2D_ARRAY,fe,De,Re.width,Re.height,he.depth,0,Ae,Je,Re.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{at&&gt&&t.texStorage2D(n.TEXTURE_2D,Le,De,je[0].width,je[0].height);for(let fe=0,Ce=je.length;fe<Ce;fe++)Re=je[fe],M.format!==1023?Ae!==null?at?$&&t.compressedTexSubImage2D(n.TEXTURE_2D,fe,0,0,Re.width,Re.height,Ae,Re.data):t.compressedTexImage2D(n.TEXTURE_2D,fe,De,Re.width,Re.height,0,Re.data):ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):at?$&&t.texSubImage2D(n.TEXTURE_2D,fe,0,0,Re.width,Re.height,Ae,Je,Re.data):t.texImage2D(n.TEXTURE_2D,fe,De,Re.width,Re.height,0,Ae,Je,Re.data)}else if(M.isDataArrayTexture)if(at){if(gt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Le,De,he.width,he.height,he.depth),$)if(M.layerUpdates.size>0){const fe=k0(he.width,he.height,M.format,M.type);for(const Ce of M.layerUpdates){const $e=he.data.subarray(Ce*fe/he.data.BYTES_PER_ELEMENT,(Ce+1)*fe/he.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Ce,he.width,he.height,1,Ae,Je,$e)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,he.width,he.height,he.depth,Ae,Je,he.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,De,he.width,he.height,he.depth,0,Ae,Je,he.data);else if(M.isData3DTexture)at?(gt&&t.texStorage3D(n.TEXTURE_3D,Le,De,he.width,he.height,he.depth),$&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,he.width,he.height,he.depth,Ae,Je,he.data)):t.texImage3D(n.TEXTURE_3D,0,De,he.width,he.height,he.depth,0,Ae,Je,he.data);else if(M.isFramebufferTexture){if(gt)if(at)t.texStorage2D(n.TEXTURE_2D,Le,De,he.width,he.height);else{let fe=he.width,Ce=he.height;for(let $e=0;$e<Le;$e++)t.texImage2D(n.TEXTURE_2D,$e,De,fe,Ce,0,Ae,Je,null),fe>>=1,Ce>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in n){const fe=n.canvas;if(fe.hasAttribute("layoutsubtree")||fe.setAttribute("layoutsubtree","true"),he.parentNode!==fe){fe.appendChild(he),u.add(M),fe.onpaint=Ce=>{const $e=Ce.changedElements;for(const pe of u)$e.includes(pe.image)&&(pe.needsUpdate=!0)},fe.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,he);else{const $e=n.RGBA,pe=n.RGBA,tt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,$e,pe,tt,he)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(je.length>0){if(at&&gt){const fe=Yt(je[0]);t.texStorage2D(n.TEXTURE_2D,Le,De,fe.width,fe.height)}for(let fe=0,Ce=je.length;fe<Ce;fe++)Re=je[fe],at?$&&t.texSubImage2D(n.TEXTURE_2D,fe,0,0,Ae,Je,Re):t.texImage2D(n.TEXTURE_2D,fe,De,Ae,Je,Re);M.generateMipmaps=!1}else if(at){if(gt){const fe=Yt(he);t.texStorage2D(n.TEXTURE_2D,Le,De,fe.width,fe.height)}$&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ae,Je,he)}else t.texImage2D(n.TEXTURE_2D,0,De,Ae,Je,he);g(M)&&b(Z),Te.__version=be.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function st(R,M,V){if(M.image.length!==6)return;const Z=Ye(R,M),ne=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+V);const be=i.get(ne);if(ne.version!==be.__version||Z===!0){t.activeTexture(n.TEXTURE0+V);const Te=Ft.getPrimaries(Ft.workingColorSpace),se=M.colorSpace===""?null:Ft.getPrimaries(M.colorSpace),he=M.colorSpace===""||Te===se?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const Ae=M.isCompressedTexture||M.image[0].isCompressedTexture,Je=M.image[0]&&M.image[0].isDataTexture,De=[];for(let pe=0;pe<6;pe++)!Ae&&!Je?De[pe]=m(M.image[pe],!0,s.maxCubemapSize):De[pe]=Je?M.image[pe].image:M.image[pe],De[pe]=Jn(M,De[pe]);const Re=De[0],je=r.convert(M.format,M.colorSpace),at=r.convert(M.type),gt=v(M.internalFormat,je,at,M.normalized,M.colorSpace),$=M.isVideoTexture!==!0,Le=be.__version===void 0||Z===!0,fe=ne.dataReady;let Ce=T(M,Re);Pe(n.TEXTURE_CUBE_MAP,M);let $e;if(Ae){$&&Le&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ce,gt,Re.width,Re.height);for(let pe=0;pe<6;pe++){$e=De[pe].mipmaps;for(let tt=0;tt<$e.length;tt++){const qe=$e[tt];M.format!==1023?je!==null?$?fe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,tt,0,0,qe.width,qe.height,je,qe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,tt,gt,qe.width,qe.height,0,qe.data):ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,tt,0,0,qe.width,qe.height,je,at,qe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,tt,gt,qe.width,qe.height,0,je,at,qe.data)}}}else{if($e=M.mipmaps,$&&Le){$e.length>0&&Ce++;const pe=Yt(De[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ce,gt,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(Je){$?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,De[pe].width,De[pe].height,je,at,De[pe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,gt,De[pe].width,De[pe].height,0,je,at,De[pe].data);for(let tt=0;tt<$e.length;tt++){const on=$e[tt].image[pe].image;$?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,tt+1,0,0,on.width,on.height,je,at,on.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,tt+1,gt,on.width,on.height,0,je,at,on.data)}}else{$?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,je,at,De[pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,gt,je,at,De[pe]);for(let tt=0;tt<$e.length;tt++){const qe=$e[tt];$?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,tt+1,0,0,je,at,qe.image[pe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pe,tt+1,gt,je,at,qe.image[pe])}}}g(M)&&b(n.TEXTURE_CUBE_MAP),be.__version=ne.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Ne(R,M,V,Z,ne,be){const Te=r.convert(V.format,V.colorSpace),se=r.convert(V.type),he=v(V.internalFormat,Te,se,V.normalized,V.colorSpace),Ae=i.get(M),Je=i.get(V);if(Je.__renderTarget=M,!Ae.__hasExternalTextures){const De=Math.max(1,M.width>>be),Re=Math.max(1,M.height>>be);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,be,he,De,Re,M.depth,0,Te,se,null):t.texImage2D(ne,be,he,De,Re,0,Te,se,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),kn(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,ne,Je.__webglTexture,0,xn(M)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,ne,Je.__webglTexture,be),t.bindFramebuffer(n.FRAMEBUFFER,null)}function St(R,M,V){if(n.bindRenderbuffer(n.RENDERBUFFER,R),M.depthBuffer){const Z=M.depthTexture,ne=Z&&Z.isDepthTexture?Z.type:null,be=S(M.stencilBuffer,ne),Te=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;kn(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xn(M),be,M.width,M.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,xn(M),be,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,be,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Te,n.RENDERBUFFER,R)}else{const Z=M.textures;for(let ne=0;ne<Z.length;ne++){const be=Z[ne],Te=r.convert(be.format,be.colorSpace),se=r.convert(be.type),he=v(be.internalFormat,Te,se,be.normalized,be.colorSpace);kn(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xn(M),he,M.width,M.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,xn(M),he,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,he,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Rn(R,M,V){const Z=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ne=i.get(M.depthTexture);if(ne.__renderTarget=M,(!ne.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),Z){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,M.depthTexture.addEventListener("dispose",P)),ne.__webglTexture===void 0){ne.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ne.__webglTexture),Pe(n.TEXTURE_CUBE_MAP,M.depthTexture);const Ae=r.convert(M.depthTexture.format),Je=r.convert(M.depthTexture.type);let De;M.depthTexture.format===1026?De=n.DEPTH_COMPONENT24:M.depthTexture.format===1027&&(De=n.DEPTH24_STENCIL8);for(let Re=0;Re<6;Re++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,De,M.width,M.height,0,Ae,Je,null)}}else le(M.depthTexture,0);const be=ne.__webglTexture,Te=xn(M),se=Z?n.TEXTURE_CUBE_MAP_POSITIVE_X+V:n.TEXTURE_2D,he=M.depthTexture.format===1027?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(M.depthTexture.format===1026)kn(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,he,se,be,0,Te):n.framebufferTexture2D(n.FRAMEBUFFER,he,se,be,0);else if(M.depthTexture.format===1027)kn(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,he,se,be,0,Te):n.framebufferTexture2D(n.FRAMEBUFFER,he,se,be,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Dt(R){const M=i.get(R),V=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const Z=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Z){const ne=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Z.removeEventListener("dispose",ne)};Z.addEventListener("dispose",ne),M.__depthDisposeCallback=ne}M.__boundDepthTexture=Z}if(R.depthTexture&&!M.__autoAllocateDepthBuffer)if(V)for(let Z=0;Z<6;Z++)Rn(M.__webglFramebuffer[Z],R,Z);else{const Z=R.texture.mipmaps;Z&&Z.length>0?Rn(M.__webglFramebuffer[0],R,0):Rn(M.__webglFramebuffer,R,0)}else if(V){M.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[Z]),M.__webglDepthbuffer[Z]===void 0)M.__webglDepthbuffer[Z]=n.createRenderbuffer(),St(M.__webglDepthbuffer[Z],R,!1);else{const ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,be=M.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,be),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,be)}}else{const Z=R.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),St(M.__webglDepthbuffer,R,!1);else{const ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,be=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,be),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,be)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function zt(R,M,V){const Z=i.get(R);M!==void 0&&Ne(Z.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&Dt(R)}function an(R){const M=R.texture,V=i.get(R),Z=i.get(M);R.addEventListener("dispose",x);const ne=R.textures,be=R.isWebGLCubeRenderTarget===!0,Te=ne.length>1;if(Te||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=M.version,a.memory.textures++),be){V.__webglFramebuffer=[];for(let se=0;se<6;se++)if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer[se]=[];for(let he=0;he<M.mipmaps.length;he++)V.__webglFramebuffer[se][he]=n.createFramebuffer()}else V.__webglFramebuffer[se]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer=[];for(let se=0;se<M.mipmaps.length;se++)V.__webglFramebuffer[se]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(Te)for(let se=0,he=ne.length;se<he;se++){const Ae=i.get(ne[se]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=n.createTexture(),a.memory.textures++)}if(R.samples>0&&kn(R)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let se=0;se<ne.length;se++){const he=ne[se];V.__webglColorRenderbuffer[se]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[se]);const Ae=r.convert(he.format,he.colorSpace),Je=r.convert(he.type),De=v(he.internalFormat,Ae,Je,he.normalized,he.colorSpace,R.isXRRenderTarget===!0),Re=xn(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Re,De,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+se,n.RENDERBUFFER,V.__webglColorRenderbuffer[se])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),St(V.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(be){t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),Pe(n.TEXTURE_CUBE_MAP,M);for(let se=0;se<6;se++)if(M.mipmaps&&M.mipmaps.length>0)for(let he=0;he<M.mipmaps.length;he++)Ne(V.__webglFramebuffer[se][he],R,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+se,he);else Ne(V.__webglFramebuffer[se],R,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);g(M)&&b(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let se=0,he=ne.length;se<he;se++){const Ae=ne[se],Je=i.get(Ae);let De=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(De=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(De,Je.__webglTexture),Pe(De,Ae),Ne(V.__webglFramebuffer,R,Ae,n.COLOR_ATTACHMENT0+se,De,0),g(Ae)&&b(De)}t.unbindTexture()}else{let se=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(se=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(se,Z.__webglTexture),Pe(se,M),M.mipmaps&&M.mipmaps.length>0)for(let he=0;he<M.mipmaps.length;he++)Ne(V.__webglFramebuffer[he],R,M,n.COLOR_ATTACHMENT0,se,he);else Ne(V.__webglFramebuffer,R,M,n.COLOR_ATTACHMENT0,se,0);g(M)&&b(se),t.unbindTexture()}R.depthBuffer&&Dt(R)}function It(R){const M=R.textures;for(let V=0,Z=M.length;V<Z;V++){const ne=M[V];if(g(ne)){const be=E(R),Te=i.get(ne).__webglTexture;t.bindTexture(be,Te),b(be),t.unbindTexture()}}}const mn=[],Wn=[];function hi(R){if(R.samples>0){if(kn(R)===!1){const M=R.textures,V=R.width,Z=R.height;let ne=n.COLOR_BUFFER_BIT;const be=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Te=i.get(R),se=M.length>1;if(se)for(let Ae=0;Ae<M.length;Ae++)t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer);const he=R.texture.mipmaps;he&&he.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let Ae=0;Ae<M.length;Ae++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),se){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Te.__webglColorRenderbuffer[Ae]);const Je=i.get(M[Ae]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Je,0)}n.blitFramebuffer(0,0,V,Z,0,0,V,Z,ne,n.NEAREST),c===!0&&(mn.length=0,Wn.length=0,mn.push(n.COLOR_ATTACHMENT0+Ae),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(mn.push(be),Wn.push(be),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Wn)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,mn))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),se)for(let Ae=0;Ae<M.length;Ae++){t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.RENDERBUFFER,Te.__webglColorRenderbuffer[Ae]);const Je=i.get(M[Ae]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.TEXTURE_2D,Je,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&c){const M=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function xn(R){return Math.min(s.maxSamples,R.samples)}function kn(R){const M=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function O(R){const M=a.render.frame;f.get(R)!==M&&(f.set(R,M),R.update())}function Jn(R,M){const V=R.colorSpace,Z=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||V!==Ro&&V!==""&&(Ft.getTransfer(V)===qt?(Z!==1023||ne!==1009)&&ft("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Gt("WebGLTextures: Unsupported texture color space:",V)),M}function Yt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=K,this.resetTextureUnits=z,this.getTextureUnits=D,this.setTextureUnits=G,this.setTexture2D=le,this.setTexture2DArray=Q,this.setTexture3D=ae,this.setTextureCube=de,this.rebindTextures=zt,this.setupRenderTarget=an,this.updateRenderTargetMipmap=It,this.updateMultisampleRenderTarget=hi,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=Ne,this.useMultisampledRTT=kn,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Ym(n,e){function t(i,s=""){let r;const a=Ft.getTransfer(s);if(i===1009)return n.UNSIGNED_BYTE;if(i===1017)return n.UNSIGNED_SHORT_4_4_4_4;if(i===1018)return n.UNSIGNED_SHORT_5_5_5_1;if(i===35902)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===35899)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===1010)return n.BYTE;if(i===1011)return n.SHORT;if(i===1012)return n.UNSIGNED_SHORT;if(i===1013)return n.INT;if(i===1014)return n.UNSIGNED_INT;if(i===1015)return n.FLOAT;if(i===1016)return n.HALF_FLOAT;if(i===1021)return n.ALPHA;if(i===1022)return n.RGB;if(i===1023)return n.RGBA;if(i===1026)return n.DEPTH_COMPONENT;if(i===1027)return n.DEPTH_STENCIL;if(i===1028)return n.RED;if(i===1029)return n.RED_INTEGER;if(i===1030)return n.RG;if(i===1031)return n.RG_INTEGER;if(i===1033)return n.RGBA_INTEGER;if(i===33776||i===33777||i===33778||i===33779)if(a===qt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===33776)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===33777)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===33778)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===33779)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===33776)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===33777)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===33778)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===33779)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===35840||i===35841||i===35842||i===35843)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===35840)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===35841)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===35842)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===35843)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===36196||i===37492||i===37496||i===37488||i===37489||i===37490||i===37491)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===36196||i===37492)return a===qt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===37496)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===37488)return r.COMPRESSED_R11_EAC;if(i===37489)return r.COMPRESSED_SIGNED_R11_EAC;if(i===37490)return r.COMPRESSED_RG11_EAC;if(i===37491)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===37808||i===37809||i===37810||i===37811||i===37812||i===37813||i===37814||i===37815||i===37816||i===37817||i===37818||i===37819||i===37820||i===37821)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===37808)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===37809)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===37810)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===37811)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===37812)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===37813)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===37814)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===37815)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===37816)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===37817)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===37818)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===37819)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===37820)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===37821)return a===qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===36492||i===36494||i===36495)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===36492)return a===qt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===36494)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===36495)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===36283||i===36284||i===36285||i===36286)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===36283)return r.COMPRESSED_RED_RGTC1_EXT;if(i===36284)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===36285)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===36286)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===1020?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Km=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qm=`
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

}`;class Jm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Qf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new _i({vertexShader:Km,fragmentShader:Qm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new fn(new Gi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class jm extends rr{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,f=null,u=null,h=null,d=null,p=null;const _=typeof XRWebGLBinding<"u",m=new Jm,g={},b=t.getContextAttributes();let E=null,v=null;const S=[],T=[],P=new ht;let x=null,A=null;const I=new yi;I.viewport=new Tn;const B=new yi;B.viewport=new Tn;const U=[I,B],z=new rd;let D=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let ce=S[te];return ce===void 0&&(ce=new rl,S[te]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(te){let ce=S[te];return ce===void 0&&(ce=new rl,S[te]=ce),ce.getGripSpace()},this.getHand=function(te){let ce=S[te];return ce===void 0&&(ce=new rl,S[te]=ce),ce.getHandSpace()};function K(te){const ce=T.indexOf(te.inputSource);if(ce===-1)return;const we=S[ce];we!==void 0&&(we.update(te.inputSource,te.frame,l||a),we.dispatchEvent({type:te.type,data:te.inputSource}))}function W(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",le);for(let te=0;te<S.length;te++){const ce=T[te];ce!==null&&(T[te]=null,S[te].disconnect(ce))}D=null,G=null,m.reset();for(const te in g)delete g[te];if(e.setRenderTarget(E),d=null,h=null,u=null,s=null,v=null,Ye.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(P.width,P.height,!1),A!==null){const te=A.camera;te.fov=A.fov,te.zoom=A.zoom,te.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){r=te,i.isPresenting===!0&&ft("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){o=te,i.isPresenting===!0&&ft("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(te){l=te},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(te){if(s=te,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",W),s.addEventListener("inputsourceschange",le),b.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,st=null,Ne=null;b.depth&&(Ne=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=b.stencil?1027:1026,st=b.stencil?1020:1014);const St={colorFormat:t.RGBA8,depthFormat:Ne,scaleFactor:r};u=this.getBinding(),h=u.createProjectionLayer(St),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new mi(h.textureWidth,h.textureHeight,{format:1023,type:1009,depthTexture:new Br(h.textureWidth,h.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const we={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,we),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new mi(d.framebufferWidth,d.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Ye.setContext(s),Ye.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function le(te){for(let ce=0;ce<te.removed.length;ce++){const we=te.removed[ce],st=T.indexOf(we);st>=0&&(T[st]=null,S[st].disconnect(we))}for(let ce=0;ce<te.added.length;ce++){const we=te.added[ce];let st=T.indexOf(we);if(st===-1){for(let St=0;St<S.length;St++)if(St>=T.length){T.push(we),st=St;break}else if(T[St]===null){T[St]=we,st=St;break}if(st===-1)break}const Ne=S[st];Ne&&Ne.connect(we)}}const Q=new H,ae=new H;function de(te,ce,we){Q.setFromMatrixPosition(ce.matrixWorld),ae.setFromMatrixPosition(we.matrixWorld);const st=Q.distanceTo(ae),Ne=ce.projectionMatrix.elements,St=we.projectionMatrix.elements,Rn=Ne[14]/(Ne[10]-1),Dt=Ne[14]/(Ne[10]+1),zt=(Ne[9]+1)/Ne[5],an=(Ne[9]-1)/Ne[5],It=(Ne[8]-1)/Ne[0],mn=(St[8]+1)/St[0],Wn=Rn*It,hi=Rn*mn,xn=st/(-It+mn),kn=xn*-It;if(ce.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(kn),te.translateZ(xn),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Ne[10]===-1)te.projectionMatrix.copy(ce.projectionMatrix),te.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{const O=Rn+xn,Jn=Dt+xn,Yt=Wn-kn,R=hi+(st-kn),M=zt*Dt/Jn*O,V=an*Dt/Jn*O;te.projectionMatrix.makePerspective(Yt,R,M,V,O,Jn),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function Ve(te,ce){ce===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(ce.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(s===null)return;let ce=te.near,we=te.far;m.texture!==null&&(m.depthNear>0&&(ce=m.depthNear),m.depthFar>0&&(we=m.depthFar)),z.near=B.near=I.near=ce,z.far=B.far=I.far=we,(D!==z.near||G!==z.far)&&(s.updateRenderState({depthNear:z.near,depthFar:z.far}),D=z.near,G=z.far),z.layers.mask=te.layers.mask|6,I.layers.mask=z.layers.mask&-5,B.layers.mask=z.layers.mask&-3;const st=te.parent,Ne=z.cameras;Ve(z,st);for(let St=0;St<Ne.length;St++)Ve(Ne[St],st);Ne.length===2?de(z,I,B):z.projectionMatrix.copy(I.projectionMatrix),A===null&&te.isPerspectiveCamera&&(A={camera:te,fov:te.fov,zoom:te.zoom}),ze(te,z,st)};function ze(te,ce,we){we===null?te.matrix.copy(ce.matrixWorld):(te.matrix.copy(we.matrixWorld),te.matrix.invert(),te.matrix.multiply(ce.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(ce.projectionMatrix),te.projectionMatrixInverse.copy(ce.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=sc*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(h===null&&d===null))return c},this.setFoveation=function(te){c=te,h!==null&&(h.fixedFoveation=te),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=te)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(z)},this.getCameraTexture=function(te){return g[te]};let Me=null;function Pe(te,ce){if(f=ce.getViewerPose(l||a),p=ce,f!==null){const we=f.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let st=!1;we.length!==z.cameras.length&&(z.cameras.length=0,st=!0);for(let Dt=0;Dt<we.length;Dt++){const zt=we[Dt];let an=null;if(d!==null)an=d.getViewport(zt);else{const mn=u.getViewSubImage(h,zt);an=mn.viewport,Dt===0&&(e.setRenderTargetTextures(v,mn.colorTexture,mn.depthStencilTexture),e.setRenderTarget(v))}let It=U[Dt];It===void 0&&(It=new yi,It.layers.enable(Dt),It.viewport=new Tn,U[Dt]=It),It.matrix.fromArray(zt.transform.matrix),It.matrix.decompose(It.position,It.quaternion,It.scale),It.projectionMatrix.fromArray(zt.projectionMatrix),It.projectionMatrixInverse.copy(It.projectionMatrix).invert(),It.viewport.set(an.x,an.y,an.width,an.height),Dt===0&&(z.matrix.copy(It.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),st===!0&&z.cameras.push(It)}const Ne=s.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const Dt=u.getDepthInformation(we[0]);Dt&&Dt.isValid&&Dt.texture&&m.init(Dt,s.renderState)}if(Ne&&Ne.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let Dt=0;Dt<we.length;Dt++){const zt=we[Dt].camera;if(zt){let an=g[zt];an||(an=new Qf,g[zt]=an);const It=u.getCameraImage(zt);an.sourceTexture=It}}}}for(let we=0;we<S.length;we++){const st=T[we],Ne=S[we];st!==null&&Ne!==void 0&&Ne.update(st,ce,l||a)}Me&&Me(te,ce),ce.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ce}),p=null}const Ye=new nh;Ye.setAnimationLoop(Pe),this.setAnimationLoop=function(te){Me=te},this.dispose=function(){}}}const eg=new En,ch=new pt;ch.set(-1,0,0,0,1,0,0,0,1);function tg(n,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,Jf(n)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,b,E,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),f(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),h(m,g),g.isMeshPhysicalMaterial&&d(m,g,v)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?c(m,g,b,E):g.isSpriteMaterial?l(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===1&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===1&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const b=e.get(g),E=b.envMap,v=b.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(eg.makeRotationFromEuler(v)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(ch),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,b,E){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*b,m.scale.value=E*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function l(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function f(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function h(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function d(m,g,b){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===1&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.retroreflectivity>0&&(m.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const b=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function ng(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,S){const T=S.program;i.uniformBlockBinding(v,T)}function l(v,S){let T=s[v.id];T===void 0&&(m(v),T=f(v),s[v.id]=T,v.addEventListener("dispose",b));const P=S.program;i.updateUBOMapping(v,P);const x=e.render.frame;r[v.id]!==x&&(h(v),r[v.id]=x)}function f(v){const S=u();v.__bindingPointIndex=S;const T=n.createBuffer(),P=v.__size,x=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,P,x),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,T),T}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Gt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const S=s[v.id],T=v.uniforms,P=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let x=0,A=T.length;x<A;x++){const I=T[x];if(Array.isArray(I))for(let B=0,U=I.length;B<U;B++)d(I[B],x,B,P);else d(I,x,0,P)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(v,S,T,P){if(_(v,S,T,P)===!0){const x=v.__offset,A=v.value;if(Array.isArray(A)){let I=0;for(let B=0;B<A.length;B++){const U=A[B],z=g(U);p(U,v.__data,I),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(I+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(A,v.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,x,v.__data)}}function p(v,S,T){typeof v=="number"||typeof v=="boolean"?S[0]=v:v.isMatrix3?(S[0]=v.elements[0],S[1]=v.elements[1],S[2]=v.elements[2],S[3]=0,S[4]=v.elements[3],S[5]=v.elements[4],S[6]=v.elements[5],S[7]=0,S[8]=v.elements[6],S[9]=v.elements[7],S[10]=v.elements[8],S[11]=0):ArrayBuffer.isView(v)?S.set(new v.constructor(v.buffer,v.byteOffset,S.length)):v.toArray(S,T)}function _(v,S,T,P){const x=v.value,A=S+"_"+T;if(P[A]===void 0)return typeof x=="number"||typeof x=="boolean"?P[A]=x:ArrayBuffer.isView(x)?P[A]=x.slice():P[A]=x.clone(),!0;{const I=P[A];if(typeof x=="number"||typeof x=="boolean"){if(I!==x)return P[A]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(I.equals(x)===!1)return I.copy(x),!0}}return!1}function m(v){const S=v.uniforms;let T=0;const P=16;for(let A=0,I=S.length;A<I;A++){const B=Array.isArray(S[A])?S[A]:[S[A]];for(let U=0,z=B.length;U<z;U++){const D=B[U],G=Array.isArray(D.value)?D.value:[D.value];for(let K=0,W=G.length;K<W;K++){const le=G[K],Q=g(le),ae=T%P,de=ae%Q.boundary,Ve=ae+de;T+=de,Ve!==0&&P-Ve<Q.storage&&(T+=P-Ve),D.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=T,T+=Q.storage}}}const x=T%P;return x>0&&(T+=P-x),v.__size=T,v.__cache={},this}function g(v){const S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?ft("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(S.boundary=16,S.storage=v.byteLength):ft("WebGLRenderer: Unsupported uniform value type.",v),S}function b(v){const S=v.target;S.removeEventListener("dispose",b);const T=a.indexOf(S.__bindingPointIndex);a.splice(T,1),n.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function E(){for(const v in s)n.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:E}}const ig=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Xi=null;function sg(){return Xi===null&&(Xi=new zu(ig,16,16,1030,1016),Xi.name="DFG_LUT",Xi.minFilter=1006,Xi.magFilter=1006,Xi.wrapS=1001,Xi.wrapT=1001,Xi.generateMipmaps=!1,Xi.needsUpdate=!0),Xi}class rg{constructor(e={}){const{canvas:t=pu(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1,outputBufferType:d=1009}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const _=d,m=new Set([1033,1031,1029]),g=new Set([1009,1014,1012,1020,1017,1018]),b=new Uint32Array(4),E=new Int32Array(4),v=new H;let S=null,T=null;const P=[],x=[];let A=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let B=!1,U=null,z=null,D=null,G=null;this._outputColorSpace=di;let K=0,W=0,le=null,Q=-1,ae=null;const de=new Tn,Ve=new Tn;let ze=null;const Me=new Lt(0);let Pe=0,Ye=t.width,te=t.height,ce=1,we=null,st=null;const Ne=new Tn(0,0,Ye,te),St=new Tn(0,0,Ye,te);let Rn=!1;const Dt=new Tc;let zt=!1,an=!1;const It=new En,mn=new H,Wn=new Tn,hi={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let xn=!1;function kn(){return le===null?ce:1}let O=i;function Jn(y,N){return t.getContext(y,N)}let Yt,R,M,V,Z,ne,be,Te,se,he,Ae,Je,De,Re,je,at,gt,$,Le,fe,Ce,$e,pe;try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:f,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r186"),t.addEventListener("webglcontextlost",on,!1),t.addEventListener("webglcontextrestored",Wt,!1),t.addEventListener("webglcontextcreationerror",ki,!1),O===null){const N="webgl2";if(O=Jn(N,y),O===null)throw Jn(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}tt()}catch(y){throw t.removeEventListener("webglcontextlost",on,!1),t.removeEventListener("webglcontextrestored",Wt,!1),t.removeEventListener("webglcontextcreationerror",ki,!1),Gt("WebGLRenderer: "+y.message),y}function tt(){Yt=new s2(O),Yt.init(),Ce=new Ym(O,Yt),R=new Zp(O,Yt,e,Ce),M=new qm(O,Yt),R.reversedDepthBuffer&&h&&M.buffers.depth.setReversed(!0),z=O.createFramebuffer(),D=O.createFramebuffer(),G=O.createFramebuffer(),V=new o2(O),Z=new km,ne=new Zm(O,Yt,M,Z,R,Ce,V),be=new i2(I),Te=new cd(O),$e=new Xp(O,Te),se=new r2(O,Te,V,$e),he=new c2(O,se,Te,$e,V),$=new l2(O,R,ne),je=new Yp(Z),Ae=new Dm(I,be,Yt,R,$e,je),Je=new tg(I,Z),De=new Fm,Re=new Gm(Yt),gt=new Wp(I,be,M,he,p,c),at=new Xm(I,he,R),pe=new ng(O,V,R,M),Le=new qp(O,Yt,V),fe=new a2(O,Yt,V),V.programs=Ae.programs,I.capabilities=R,I.extensions=Yt,I.properties=Z,I.renderLists=De,I.shadowMap=at,I.state=M,I.info=V}_!==1009&&(A=new h2(_,t.width,t.height,o,s,r));const qe=new jm(I,O);this.xr=qe,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const y=Yt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Yt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return ce},this.setPixelRatio=function(y){y!==void 0&&(ce=y,this.setSize(Ye,te,!1))},this.getSize=function(y){return y.set(Ye,te)},this.setSize=function(y,N,ee=!0){if(qe.isPresenting){ft("WebGLRenderer: Can't change size while VR device is presenting.");return}Ye=y,te=N,t.width=Math.floor(y*ce),t.height=Math.floor(N*ce),ee===!0&&(t.style.width=y+"px",t.style.height=N+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,y,N)},this.getDrawingBufferSize=function(y){return y.set(Ye*ce,te*ce).floor()},this.setDrawingBufferSize=function(y,N,ee){Ye=y,te=N,ce=ee,t.width=Math.floor(y*ee),t.height=Math.floor(N*ee),this.setViewport(0,0,y,N)},this.setEffects=function(y){if(_===1009){Gt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let N=0;N<y.length;N++)if(y[N].isOutputPass===!0){ft("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(de)},this.getViewport=function(y){return y.copy(Ne)},this.setViewport=function(y,N,ee,X){y.isVector4?Ne.set(y.x,y.y,y.z,y.w):Ne.set(y,N,ee,X),M.viewport(de.copy(Ne).multiplyScalar(ce).round())},this.getScissor=function(y){return y.copy(St)},this.setScissor=function(y,N,ee,X){y.isVector4?St.set(y.x,y.y,y.z,y.w):St.set(y,N,ee,X),M.scissor(Ve.copy(St).multiplyScalar(ce).round())},this.getScissorTest=function(){return Rn},this.setScissorTest=function(y){M.setScissorTest(Rn=y)},this.setOpaqueSort=function(y){we=y},this.setTransparentSort=function(y){st=y},this.getClearColor=function(y){return y.copy(gt.getClearColor())},this.setClearColor=function(){gt.setClearColor(...arguments)},this.getClearAlpha=function(){return gt.getClearAlpha()},this.setClearAlpha=function(){gt.setClearAlpha(...arguments)},this.clear=function(y=!0,N=!0,ee=!0){let X=0;if(y){let q=!1;if(le!==null){const Fe=le.texture.format;q=m.has(Fe)}if(q){const Fe=le.texture.type,Ge=g.has(Fe),Ie=gt.getClearColor(),We=gt.getClearAlpha(),Ze=Ie.r,bt=Ie.g,kt=Ie.b;Ge?(b[0]=Ze,b[1]=bt,b[2]=kt,b[3]=We,O.clearBufferuiv(O.COLOR,0,b)):(E[0]=Ze,E[1]=bt,E[2]=kt,E[3]=We,O.clearBufferiv(O.COLOR,0,E))}else X|=O.COLOR_BUFFER_BIT}N&&(X|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ee&&(X|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&O.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),U=y},this.dispose=function(){t.removeEventListener("webglcontextlost",on,!1),t.removeEventListener("webglcontextrestored",Wt,!1),t.removeEventListener("webglcontextcreationerror",ki,!1),gt.dispose(),De.dispose(),Re.dispose(),Z.dispose(),be.dispose(),he.dispose(),$e.dispose(),pe.dispose(),Ae.dispose(),qe.dispose(),qe.removeEventListener("sessionstart",Qc),qe.removeEventListener("sessionend",Jc),Vs.stop()};function on(y){y.preventDefault(),Co("WebGLRenderer: Context Lost."),B=!0}function Wt(){Co("WebGLRenderer: Context Restored."),B=!1;const y=V.autoReset,N=at.enabled,ee=at.autoUpdate,X=at.needsUpdate,q=at.type;tt(),V.autoReset=y,at.enabled=N,at.autoUpdate=ee,at.needsUpdate=X,at.type=q}function ki(y){Gt("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Hi(y){const N=y.target;N.removeEventListener("dispose",Hi),su(N)}function su(y){ru(y),Z.remove(y)}function ru(y){const N=Z.get(y).programs;N!==void 0&&(N.forEach(function(ee){Ae.releaseProgram(ee)}),y.isShaderMaterial&&Ae.releaseShaderCache(y))}this.renderBufferDirect=function(y,N,ee,X,q,Fe){N===null&&(N=hi);const Ge=q.isMesh&&q.matrixWorld.determinantAffine()<0,Ie=lu(y,N,ee,X,q);M.setMaterial(X,Ge);let We=ee.index,Ze=1;if(X.wireframe===!0){if(We=se.getWireframeAttribute(ee),We===void 0)return;Ze=2}const bt=ee.drawRange,kt=ee.attributes.position;let Xe=bt.start*Ze,Xt=(bt.start+bt.count)*Ze;Fe!==null&&(Xe=Math.max(Xe,Fe.start*Ze),Xt=Math.min(Xt,(Fe.start+Fe.count)*Ze)),We!==null?(Xe=Math.max(Xe,0),Xt=Math.min(Xt,We.count)):kt!=null&&(Xe=Math.max(Xe,0),Xt=Math.min(Xt,kt.count));const In=Xt-Xe;if(In<0||In===1/0)return;$e.setup(q,X,Ie,ee,We);let hn,tn=Le;if(We!==null&&(hn=Te.get(We),tn=fe,tn.setIndex(hn)),q.isMesh)X.wireframe===!0?(M.setLineWidth(X.wireframeLinewidth*kn()),tn.setMode(O.LINES)):tn.setMode(O.TRIANGLES);else if(q.isLine){let jn=X.linewidth;jn===void 0&&(jn=1),M.setLineWidth(jn*kn()),q.isLineSegments?tn.setMode(O.LINES):q.isLineLoop?tn.setMode(O.LINE_LOOP):tn.setMode(O.LINE_STRIP)}else q.isPoints?tn.setMode(O.POINTS):q.isSprite&&tn.setMode(O.TRIANGLES);if(q.isBatchedMesh)if(Yt.get("WEBGL_multi_draw"))tn.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const jn=q._multiDrawStarts,Be=q._multiDrawCounts,ai=q._multiDrawCount,Ot=We?Te.get(We).bytesPerElement:1,Ti=Z.get(X).currentProgram.getUniforms();for(let Vi=0;Vi<ai;Vi++)Ti.setValue(O,"_gl_DrawID",Vi),tn.render(jn[Vi]/Ot,Be[Vi])}else if(q.isInstancedMesh)tn.renderInstances(Xe,In,q.count);else if(ee.isInstancedBufferGeometry){const jn=ee._maxInstanceCount!==void 0?ee._maxInstanceCount:1/0,Be=Math.min(ee.instanceCount,jn);tn.renderInstances(Xe,In,Be)}else tn.render(Xe,In)};function Kc(y,N,ee,X){U!==null&&y.isNodeMaterial&&U.setObject(X,y),zt===!0&&je.setState(y,ee,!1),y.transparent===!0&&y.side===2&&y.forceSinglePass===!1?(y.side=1,y.needsUpdate=!0,za(y,N,X),y.side=0,y.needsUpdate=!0,za(y,N,X),y.side=2):za(y,N,X)}this.compile=function(y,N,ee=null){ee===null&&(ee=y),U!==null&&U.renderStart(y,N,ee),T=Re.get(ee),T.init(N),x.push(T),ee.traverseVisible(function(q){q.isLight&&q.layers.test(N.layers)&&(T.pushLight(q),q.castShadow&&T.pushShadow(q))}),y!==ee&&y.traverseVisible(function(q){q.isLight&&q.layers.test(N.layers)&&(T.pushLight(q),q.castShadow&&T.pushShadow(q))}),T.setupLights(),U!==null&&U.updateLights(T.state.lightsArray),an=this.localClippingEnabled,zt=je.init(this.clippingPlanes,an),zt===!0&&je.setGlobalState(this.clippingPlanes,N),U!==null&&at.render(T.state.shadowsArray,ee,N);const X=new Set;return y.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const Fe=q.material;if(Fe)if(Array.isArray(Fe))for(let Ge=0;Ge<Fe.length;Ge++){const Ie=Fe[Ge];Kc(Ie,ee,N,q),X.add(Ie)}else Kc(Fe,ee,N,q),X.add(Fe)}),T=x.pop(),U!==null&&U.renderEnd(),X},this.compileAsync=function(y,N,ee=null){const X=this.compile(y,N,ee);return new Promise(q=>{function Fe(){if(X.forEach(function(Ge){const We=Z.get(Ge).currentProgram;(We===void 0||We.isReady())&&X.delete(Ge)}),X.size===0){q(y);return}setTimeout(Fe,10)}Yt.get("KHR_parallel_shader_compile")!==null?Fe():setTimeout(Fe,10)})};let Ko=null;function au(y){Ko&&Ko(y)}function Qc(){Vs.stop()}function Jc(){Vs.start()}const Vs=new nh;Vs.setAnimationLoop(au),typeof self<"u"&&Vs.setContext(self),this.setAnimationLoop=function(y){Ko=y,qe.setAnimationLoop(y),y===null?Vs.stop():Vs.start()},qe.addEventListener("sessionstart",Qc),qe.addEventListener("sessionend",Jc),this.render=function(y,N){if(N!==void 0&&N.isCamera!==!0){Gt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(B===!0)return;U!==null&&U.renderStart(y,N);const ee=qe.enabled===!0&&qe.isPresenting===!0,X=A!==null&&(le===null||ee)&&A.begin(I,le);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),qe.enabled===!0&&qe.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(qe.cameraAutoUpdate===!0&&qe.updateCamera(N),N=qe.getCamera()),y.isScene===!0&&y.onBeforeRender(I,y,N,le),T=Re.get(y,x.length),T.init(N),T.state.textureUnits=ne.getTextureUnits(),x.push(T),It.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Dt.setFromProjectionMatrix(It,2e3,N.reversedDepth),an=this.localClippingEnabled,zt=je.init(this.clippingPlanes,an),S=De.get(y,P.length),S.init(),P.push(S),qe.enabled===!0&&qe.isPresenting===!0){const Ge=I.xr.getDepthSensingMesh();Ge!==null&&Qo(Ge,N,-1/0,I.sortObjects)}Qo(y,N,0,I.sortObjects),S.finish(),U!==null&&U.updateLights(T.state.lightsArray),I.sortObjects===!0&&S.sort(we,st),xn=qe.enabled===!1||qe.isPresenting===!1||qe.hasDepthSensing()===!1,xn&&gt.addToRenderList(S,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),zt===!0&&je.beginShadows();const q=T.state.shadowsArray;if(at.render(q,y,N),zt===!0&&je.endShadows(),(X&&A.hasRenderPass())===!1){const Ge=S.opaque,Ie=S.transmissive;if(T.setupLights(),N.isArrayCamera){const We=N.cameras;if(Ie.length>0)for(let Ze=0,bt=We.length;Ze<bt;Ze++){const kt=We[Ze];e0(Ge,Ie,y,kt)}xn&&gt.render(y);for(let Ze=0,bt=We.length;Ze<bt;Ze++){const kt=We[Ze];jc(S,y,kt,kt.viewport)}}else Ie.length>0&&e0(Ge,Ie,y,N),xn&&gt.render(y),jc(S,y,N)}le!==null&&W===0&&(ne.updateMultisampleRenderTarget(le),ne.updateRenderTargetMipmap(le)),X&&A.end(I),y.isScene===!0&&y.onAfterRender(I,y,N),$e.resetDefaultState(),Q=-1,ae=null,x.pop(),x.length>0?(T=x[x.length-1],ne.setTextureUnits(T.state.textureUnits),zt===!0&&je.setGlobalState(I.clippingPlanes,T.state.camera)):T=null,P.pop(),P.length>0?S=P[P.length-1]:S=null,U!==null&&U.renderEnd()};function Qo(y,N,ee,X){if(y.visible===!1)return;if(y.layers.test(N.layers)){if(y.isGroup)ee=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(N);else if(y.isLightProbeGrid)T.pushLightProbeGrid(y);else if(y.isLight)T.pushLight(y),y.castShadow&&T.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(Dt)){X&&Wn.setFromMatrixPosition(y.matrixWorld).applyMatrix4(It);const Ge=he.update(y),Ie=y.material;Ie.visible&&S.push(y,Ge,Ie,ee,Wn.z,null,N)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(Dt))){const Ge=he.update(y),Ie=y.material;if(X&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Wn.copy(y.boundingSphere.center)):(Ge.boundingSphere===null&&Ge.computeBoundingSphere(),Wn.copy(Ge.boundingSphere.center)),Wn.applyMatrix4(y.matrixWorld).applyMatrix4(It)),Array.isArray(Ie)){const We=Ge.groups;for(let Ze=0,bt=We.length;Ze<bt;Ze++){const kt=We[Ze],Xe=Ie[kt.materialIndex];Xe&&Xe.visible&&S.push(y,Ge,Xe,ee,Wn.z,kt,N)}}else Ie.visible&&S.push(y,Ge,Ie,ee,Wn.z,null,N)}}const Fe=y.children;for(let Ge=0,Ie=Fe.length;Ge<Ie;Ge++)Qo(Fe[Ge],N,ee,X)}function jc(y,N,ee,X){const{opaque:q,transmissive:Fe,transparent:Ge}=y;T.setupLightsView(ee),zt===!0&&je.setGlobalState(I.clippingPlanes,ee),X&&M.viewport(de.copy(X)),q.length>0&&Ga(q,N,ee),Fe.length>0&&Ga(Fe,N,ee),Ge.length>0&&Ga(Ge,N,ee),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function e0(y,N,ee,X){if((ee.isScene===!0?ee.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[X.id]===void 0){const Xe=Yt.has("EXT_color_buffer_half_float")||Yt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[X.id]=new mi(1,1,{generateMipmaps:!0,type:Xe?1016:1009,minFilter:1008,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ft.workingColorSpace})}const Fe=T.state.transmissionRenderTarget[X.id],Ge=X.viewport||de;Fe.setSize(Ge.z*I.transmissionResolutionScale,Ge.w*I.transmissionResolutionScale);const Ie=I.getRenderTarget(),We=I.getActiveCubeFace(),Ze=I.getActiveMipmapLevel();I.setRenderTarget(Fe),I.getClearColor(Me),Pe=I.getClearAlpha(),Pe<1&&I.setClearColor(16777215,.5),I.clear(),xn&&gt.render(ee);const bt=I.toneMapping;I.toneMapping=0;const kt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),T.setupLightsView(X),zt===!0&&je.setGlobalState(I.clippingPlanes,X),Ga(y,ee,X),ne.updateMultisampleRenderTarget(Fe),ne.updateRenderTargetMipmap(Fe),Yt.has("WEBGL_multisampled_render_to_texture")===!1){let Xe=!1;for(let Xt=0,In=N.length;Xt<In;Xt++){const hn=N[Xt],{object:tn,geometry:jn,material:Be,group:ai}=hn;if(Be.side===2&&tn.layers.test(X.layers)){const Ot=Be.side;Be.side=1,Be.needsUpdate=!0,t0(tn,ee,X,jn,Be,ai),Be.side=Ot,Be.needsUpdate=!0,Xe=!0}}Xe===!0&&(ne.updateMultisampleRenderTarget(Fe),ne.updateRenderTargetMipmap(Fe))}I.setRenderTarget(Ie,We,Ze),I.setClearColor(Me,Pe),kt!==void 0&&(X.viewport=kt),I.toneMapping=bt}function Ga(y,N,ee){const X=N.isScene===!0?N.overrideMaterial:null;for(let q=0,Fe=y.length;q<Fe;q++){const Ge=y[q],{object:Ie,geometry:We,group:Ze}=Ge;let bt=Ge.material;bt.allowOverride===!0&&X!==null&&(bt=X),Ie.layers.test(ee.layers)&&t0(Ie,N,ee,We,bt,Ze)}}function t0(y,N,ee,X,q,Fe){U!==null&&q.isNodeMaterial&&U.setObject(y,q),y.onBeforeRender(I,N,ee,X,q,Fe),y.modelViewMatrix.multiplyMatrices(ee.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),q.onBeforeRender(I,N,ee,X,y,Fe),q.transparent===!0&&q.side===2&&q.forceSinglePass===!1?(q.side=1,q.needsUpdate=!0,I.renderBufferDirect(ee,N,X,q,y,Fe),q.side=0,q.needsUpdate=!0,I.renderBufferDirect(ee,N,X,q,y,Fe),q.side=2):I.renderBufferDirect(ee,N,X,q,y,Fe),y.onAfterRender(I,N,ee,X,q,Fe)}function za(y,N,ee){N.isScene!==!0&&(N=hi);const X=Z.get(y),q=T.state.lights,Fe=T.state.shadowsArray,Ge=q.state.version,Ie=Ae.getParameters(y,q.state,Fe,N,ee,T.state.lightProbeGridArray),We=Ae.getProgramCacheKey(Ie);let Ze=X.programs;X.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?N.environment:null,X.fog=N.fog;const bt=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;X.envMap=be.get(y.envMap||X.environment,bt),X.envMapRotation=X.environment!==null&&y.envMap===null?N.environmentRotation:y.envMapRotation,Ze===void 0&&(y.addEventListener("dispose",Hi),Ze=new Map,X.programs=Ze);let kt=Ze.get(We);if(kt!==void 0){if(X.currentProgram===kt&&X.lightsStateVersion===Ge)return i0(y,Ie),kt}else Ie.uniforms=Ae.getUniforms(y),U!==null&&y.isNodeMaterial&&U.build(y,ee,Ie),y.onBeforeCompile(Ie,I),kt=Ae.acquireProgram(Ie,We),Ze.set(We,kt),X.uniforms=Ie.uniforms;const Xe=X.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Xe.clippingPlanes=je.uniform),i0(y,Ie),X.needsLights=fu(y),X.lightsStateVersion=Ge,X.needsLights&&(Xe.ambientLightColor.value=q.state.ambient,Xe.lightProbe.value=q.state.probe,Xe.sunLights.value=q.state.sun,Xe.sunLightShadows.value=q.state.sunShadow,Xe.directionalLights.value=q.state.directional,Xe.directionalLightShadows.value=q.state.directionalShadow,Xe.spotLights.value=q.state.spot,Xe.spotLightShadows.value=q.state.spotShadow,Xe.rectAreaLights.value=q.state.rectArea,Xe.ltc_1.value=q.state.rectAreaLTC1,Xe.ltc_2.value=q.state.rectAreaLTC2,Xe.pointLights.value=q.state.point,Xe.pointLightShadows.value=q.state.pointShadow,Xe.hemisphereLights.value=q.state.hemi,Xe.sunShadowMatrix.value=q.state.sunShadowMatrix,Xe.sunShadowCascade.value=q.state.sunShadowCascade,Xe.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Xe.spotLightMatrix.value=q.state.spotLightMatrix,Xe.spotLightMap.value=q.state.spotLightMap,Xe.pointShadowMatrix.value=q.state.pointShadowMatrix),X.lightProbeGrid=T.state.lightProbeGridArray.length>0,X.currentProgram=kt,X.uniformsList=null,kt}function n0(y){if(y.uniformsList===null){const N=y.currentProgram.getUniforms();y.uniformsList=So.seqWithValue(N.seq,y.uniforms)}return y.uniformsList}function i0(y,N){const ee=Z.get(y);ee.outputColorSpace=N.outputColorSpace,ee.batching=N.batching,ee.batchingColor=N.batchingColor,ee.instancing=N.instancing,ee.instancingColor=N.instancingColor,ee.instancingMorph=N.instancingMorph,ee.skinning=N.skinning,ee.morphTargets=N.morphTargets,ee.morphNormals=N.morphNormals,ee.morphColors=N.morphColors,ee.morphTargetsCount=N.morphTargetsCount,ee.numClippingPlanes=N.numClippingPlanes,ee.numIntersection=N.numClipIntersection,ee.vertexAlphas=N.vertexAlphas,ee.vertexTangents=N.vertexTangents,ee.toneMapping=N.toneMapping}function ou(y,N){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;v.setFromMatrixPosition(N.matrixWorld);for(let ee=0,X=y.length;ee<X;ee++){const q=y[ee];if(q.texture!==null&&q.boundingBox.containsPoint(v))return q}return null}function lu(y,N,ee,X,q){N.isScene!==!0&&(N=hi),ne.resetTextureUnits();const Fe=N.fog,Ge=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?N.environment:null,Ie=le===null?I.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:Ft.workingColorSpace,We=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Ze=be.get(X.envMap||Ge,We),bt=X.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,kt=!!ee.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Xe=!!ee.morphAttributes.position,Xt=!!ee.morphAttributes.normal,In=!!ee.morphAttributes.color;let hn=0;X.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(hn=I.toneMapping);const tn=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,jn=tn!==void 0?tn.length:0,Be=Z.get(X),ai=T.state.lights;if(zt===!0&&(an===!0||y!==ae)){const ln=y===ae&&X.id===Q;je.setState(X,y,ln)}let Ot=!1;X.version===Be.__version?(Be.needsLights&&Be.lightsStateVersion!==ai.state.version||Be.outputColorSpace!==Ie||q.isBatchedMesh&&Be.batching===!1||!q.isBatchedMesh&&Be.batching===!0||q.isBatchedMesh&&Be.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Be.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Be.instancing===!1||!q.isInstancedMesh&&Be.instancing===!0||q.isSkinnedMesh&&Be.skinning===!1||!q.isSkinnedMesh&&Be.skinning===!0||q.isInstancedMesh&&Be.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Be.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Be.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Be.instancingMorph===!1&&q.morphTexture!==null||Be.envMap!==Ze||X.fog===!0&&Be.fog!==Fe||Be.numClippingPlanes!==void 0&&(Be.numClippingPlanes!==je.numPlanes||Be.numIntersection!==je.numIntersection)||Be.vertexAlphas!==bt||Be.vertexTangents!==kt||Be.morphTargets!==Xe||Be.morphNormals!==Xt||Be.morphColors!==In||Be.toneMapping!==hn||Be.morphTargetsCount!==jn||!!Be.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(Ot=!0):(Ot=!0,Be.__version=X.version);let Ti=Be.currentProgram;Ot===!0&&(Ti=za(X,N,q),U&&X.isNodeMaterial&&U.onUpdateProgram(X,Ti,Be));let Vi=!1,Ms=!1,or=!1;const Qt=Ti.getUniforms(),Ln=Be.uniforms;if(M.useProgram(Ti.program)&&(Vi=!0,Ms=!0,or=!0),X.id!==Q&&(Q=X.id,Ms=!0),Be.needsLights){const ln=ou(T.state.lightProbeGridArray,q);Be.lightProbeGrid!==ln&&(Be.lightProbeGrid=ln,Ms=!0)}if(Vi||ae!==y){M.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),Qt.setValue(O,"projectionMatrix",y.projectionMatrix),Qt.setValue(O,"viewMatrix",y.matrixWorldInverse);const xs=Qt.map.cameraPosition;xs!==void 0&&xs.setValue(O,mn.setFromMatrixPosition(y.matrixWorld)),R.logarithmicDepthBuffer&&Qt.setValue(O,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Qt.setValue(O,"isOrthographic",y.isOrthographicCamera===!0),ae!==y&&(ae=y,Ms=!0,or=!0)}if(Be.needsLights&&(ai.state.sunShadowMap.length>0&&Qt.setValue(O,"sunShadowMap",ai.state.sunShadowMap,ne),ai.state.directionalShadowMap.length>0&&Qt.setValue(O,"directionalShadowMap",ai.state.directionalShadowMap,ne),ai.state.spotShadowMap.length>0&&Qt.setValue(O,"spotShadowMap",ai.state.spotShadowMap,ne),ai.state.pointShadowMap.length>0&&Qt.setValue(O,"pointShadowMap",ai.state.pointShadowMap,ne)),q.isSkinnedMesh){Qt.setOptional(O,q,"bindMatrix"),Qt.setOptional(O,q,"bindMatrixInverse");const ln=q.skeleton;ln&&(ln.boneTexture===null&&ln.computeBoneTexture(),Qt.setValue(O,"boneTexture",ln.boneTexture,ne))}q.isBatchedMesh&&(Qt.setOptional(O,q,"batchingTexture"),Qt.setValue(O,"batchingTexture",q._matricesTexture,ne),Qt.setOptional(O,q,"batchingIdTexture"),Qt.setValue(O,"batchingIdTexture",q._indirectTexture,ne),Qt.setOptional(O,q,"batchingColorTexture"),q._colorsTexture!==null&&Qt.setValue(O,"batchingColorTexture",q._colorsTexture,ne));const vs=ee.morphAttributes;if((vs.position!==void 0||vs.normal!==void 0||vs.color!==void 0)&&$.update(q,ee,Ti),(Ms||Be.receiveShadow!==q.receiveShadow)&&(Be.receiveShadow=q.receiveShadow,Qt.setValue(O,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&N.environment!==null&&(Ln.envMapIntensity.value=N.environmentIntensity),Ln.dfgLUT!==void 0&&(Ln.dfgLUT.value=sg()),Ms){if(Qt.setValue(O,"toneMappingExposure",I.toneMappingExposure),Be.needsLights&&cu(Ln,or),Fe&&X.fog===!0&&Je.refreshFogUniforms(Ln,Fe),Je.refreshMaterialUniforms(Ln,X,ce,te,T.state.transmissionRenderTarget[y.id]),Be.needsLights&&Be.lightProbeGrid){const ln=Be.lightProbeGrid;Ln.probesSH.value=ln.texture,Ln.probesMin.value.copy(ln.boundingBox.min),Ln.probesMax.value.copy(ln.boundingBox.max),Ln.probesResolution.value.copy(ln.resolution)}So.upload(O,n0(Be),Ln,ne)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(So.upload(O,n0(Be),Ln,ne),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Qt.setValue(O,"center",q.center),Qt.setValue(O,"modelViewMatrix",q.modelViewMatrix),Qt.setValue(O,"normalMatrix",q.normalMatrix),Qt.setValue(O,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){const ln=X.uniformsGroups;for(let xs=0,lr=ln.length;xs<lr;xs++){const r0=ln[xs];pe.update(r0,Ti),pe.bind(r0,Ti)}}return Ti}function cu(y,N){y.ambientLightColor.needsUpdate=N,y.lightProbe.needsUpdate=N,y.sunLights.needsUpdate=N,y.sunLightShadows.needsUpdate=N,y.directionalLights.needsUpdate=N,y.directionalLightShadows.needsUpdate=N,y.pointLights.needsUpdate=N,y.pointLightShadows.needsUpdate=N,y.spotLights.needsUpdate=N,y.spotLightShadows.needsUpdate=N,y.rectAreaLights.needsUpdate=N,y.hemisphereLights.needsUpdate=N}function fu(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return le},this.setRenderTargetTextures=function(y,N,ee){const X=Z.get(y);X.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Z.get(y.texture).__webglTexture=N,Z.get(y.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:ee,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,N){const ee=Z.get(y);ee.__webglFramebuffer=N,ee.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(y,N=0,ee=0){le=y,K=N,W=ee;let X=null,q=!1,Fe=!1;if(y){const Ie=Z.get(y);if(Ie.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(O.FRAMEBUFFER,Ie.__webglFramebuffer),de.copy(y.viewport),Ve.copy(y.scissor),ze=y.scissorTest,M.viewport(de),M.scissor(Ve),M.setScissorTest(ze),Q=-1;return}else if(Ie.__webglFramebuffer===void 0)ne.setupRenderTarget(y);else if(Ie.__hasExternalTextures)ne.rebindTextures(y,Z.get(y.texture).__webglTexture,Z.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const bt=y.depthTexture;if(Ie.__boundDepthTexture!==bt){if(bt!==null&&Z.has(bt)&&(y.width!==bt.image.width||y.height!==bt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ne.setupDepthRenderbuffer(y)}}const We=y.texture;(We.isData3DTexture||We.isDataArrayTexture||We.isCompressedArrayTexture)&&(Fe=!0);const Ze=Z.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ze[N])?X=Ze[N][ee]:X=Ze[N],q=!0):y.samples>0&&ne.useMultisampledRTT(y)===!1?X=Z.get(y).__webglMultisampledFramebuffer:Array.isArray(Ze)?X=Ze[ee]:X=Ze,de.copy(y.viewport),Ve.copy(y.scissor),ze=y.scissorTest}else de.copy(Ne).multiplyScalar(ce).floor(),Ve.copy(St).multiplyScalar(ce).floor(),ze=Rn;if(ee!==0&&(X=z),M.bindFramebuffer(O.FRAMEBUFFER,X)&&M.drawBuffers(y,X),M.viewport(de),M.scissor(Ve),M.setScissorTest(ze),q){const Ie=Z.get(y.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+N,Ie.__webglTexture,ee)}else if(Fe){const Ie=N;for(let We=0;We<y.textures.length;We++){const Ze=Z.get(y.textures[We]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+We,Ze.__webglTexture,ee,Ie)}}else if(y!==null&&ee!==0){const Ie=Z.get(y.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ie.__webglTexture,ee)}Q=-1};function s0(y){const N=Z.get(y);return(N.__readFormat!==y.format||N.__readType!==y.type)&&(N.__readFormat=y.format,N.__readType=y.type,N.__formatReadable=R.textureFormatReadable(y.format),N.__typeReadable=R.textureTypeReadable(y.type)),N}this.readRenderTargetPixels=function(y,N,ee,X,q,Fe,Ge,Ie=0){if(!(y&&y.isWebGLRenderTarget)){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let We=Z.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ge!==void 0&&(We=We[Ge]),We){M.bindFramebuffer(O.FRAMEBUFFER,We);try{const Ze=y.textures[Ie],bt=Ze.format,kt=Ze.type;y.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ie);const Xe=s0(Ze);if(Xe.__formatReadable===!1){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Xe.__typeReadable===!1){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=y.width-X&&ee>=0&&ee<=y.height-q&&O.readPixels(N,ee,X,q,Ce.convert(bt),Ce.convert(kt),Fe)}finally{const Ze=le!==null?Z.get(le).__webglFramebuffer:null;M.bindFramebuffer(O.FRAMEBUFFER,Ze)}}},this.readRenderTargetPixelsAsync=async function(y,N,ee,X,q,Fe,Ge,Ie=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let We=Z.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ge!==void 0&&(We=We[Ge]),We)if(N>=0&&N<=y.width-X&&ee>=0&&ee<=y.height-q){M.bindFramebuffer(O.FRAMEBUFFER,We);const Ze=y.textures[Ie],bt=Ze.format,kt=Ze.type;y.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ie);const Xe=s0(Ze);if(Xe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Xe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Xt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Xt),O.bufferData(O.PIXEL_PACK_BUFFER,Fe.byteLength,O.STREAM_READ),O.readPixels(N,ee,X,q,Ce.convert(bt),Ce.convert(kt),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);const In=le!==null?Z.get(le).__webglFramebuffer:null;M.bindFramebuffer(O.FRAMEBUFFER,In);const hn=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await mu(O,hn,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Xt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Fe),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(Xt),O.deleteSync(hn),Fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,N=null,ee=0){const X=Math.pow(2,-ee),q=Math.floor(y.image.width*X),Fe=Math.floor(y.image.height*X),Ge=N!==null?N.x:0,Ie=N!==null?N.y:0;ne.setTexture2D(y,0),O.copyTexSubImage2D(O.TEXTURE_2D,ee,0,0,Ge,Ie,q,Fe),M.unbindTexture()},this.copyTextureToTexture=function(y,N,ee=null,X=null,q=0,Fe=0){let Ge,Ie,We,Ze,bt,kt,Xe,Xt,In;const hn=y.isCompressedTexture?y.mipmaps[Fe]:y.image;if(ee!==null)Ge=ee.max.x-ee.min.x,Ie=ee.max.y-ee.min.y,We=ee.isBox3?ee.max.z-ee.min.z:1,Ze=ee.min.x,bt=ee.min.y,kt=ee.isBox3?ee.min.z:0;else{const Ln=Math.pow(2,-q);Ge=Math.floor(hn.width*Ln),Ie=Math.floor(hn.height*Ln),y.isDataArrayTexture?We=hn.depth:y.isData3DTexture?We=Math.floor(hn.depth*Ln):We=1,Ze=0,bt=0,kt=0}X!==null?(Xe=X.x,Xt=X.y,In=X.z):(Xe=0,Xt=0,In=0);const tn=Ce.convert(N.format),jn=Ce.convert(N.type);let Be;N.isData3DTexture?(ne.setTexture3D(N,0),Be=O.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(ne.setTexture2DArray(N,0),Be=O.TEXTURE_2D_ARRAY):(ne.setTexture2D(N,0),Be=O.TEXTURE_2D),M.activeTexture(O.TEXTURE0),M.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,N.flipY),M.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),M.pixelStorei(O.UNPACK_ALIGNMENT,N.unpackAlignment);const ai=M.getParameter(O.UNPACK_ROW_LENGTH),Ot=M.getParameter(O.UNPACK_IMAGE_HEIGHT),Ti=M.getParameter(O.UNPACK_SKIP_PIXELS),Vi=M.getParameter(O.UNPACK_SKIP_ROWS),Ms=M.getParameter(O.UNPACK_SKIP_IMAGES);M.pixelStorei(O.UNPACK_ROW_LENGTH,hn.width),M.pixelStorei(O.UNPACK_IMAGE_HEIGHT,hn.height),M.pixelStorei(O.UNPACK_SKIP_PIXELS,Ze),M.pixelStorei(O.UNPACK_SKIP_ROWS,bt),M.pixelStorei(O.UNPACK_SKIP_IMAGES,kt);const or=y.isDataArrayTexture||y.isData3DTexture,Qt=N.isDataArrayTexture||N.isData3DTexture;if(y.isDepthTexture){const Ln=Z.get(y),vs=Z.get(N),ln=Z.get(Ln.__renderTarget),xs=Z.get(vs.__renderTarget);M.bindFramebuffer(O.READ_FRAMEBUFFER,ln.__webglFramebuffer),M.bindFramebuffer(O.DRAW_FRAMEBUFFER,xs.__webglFramebuffer);for(let lr=0;lr<We;lr++)or&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Z.get(y).__webglTexture,q,kt+lr),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Z.get(N).__webglTexture,Fe,In+lr)),O.blitFramebuffer(Ze,bt,Ge,Ie,Xe,Xt,Ge,Ie,O.DEPTH_BUFFER_BIT,O.NEAREST);M.bindFramebuffer(O.READ_FRAMEBUFFER,null),M.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(q!==0||y.isRenderTargetTexture||Z.has(y)){const Ln=Z.get(y),vs=Z.get(N);M.bindFramebuffer(O.READ_FRAMEBUFFER,D),M.bindFramebuffer(O.DRAW_FRAMEBUFFER,G);for(let ln=0;ln<We;ln++)or?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ln.__webglTexture,q,kt+ln):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ln.__webglTexture,q),Qt?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,vs.__webglTexture,Fe,In+ln):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,vs.__webglTexture,Fe),q!==0?O.blitFramebuffer(Ze,bt,Ge,Ie,Xe,Xt,Ge,Ie,O.COLOR_BUFFER_BIT,O.NEAREST):Qt?O.copyTexSubImage3D(Be,Fe,Xe,Xt,In+ln,Ze,bt,Ge,Ie):O.copyTexSubImage2D(Be,Fe,Xe,Xt,Ze,bt,Ge,Ie);M.bindFramebuffer(O.READ_FRAMEBUFFER,null),M.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Qt?y.isDataTexture||y.isData3DTexture?O.texSubImage3D(Be,Fe,Xe,Xt,In,Ge,Ie,We,tn,jn,hn.data):N.isCompressedArrayTexture?O.compressedTexSubImage3D(Be,Fe,Xe,Xt,In,Ge,Ie,We,tn,hn.data):O.texSubImage3D(Be,Fe,Xe,Xt,In,Ge,Ie,We,tn,jn,hn):y.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Fe,Xe,Xt,Ge,Ie,tn,jn,hn.data):y.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Fe,Xe,Xt,hn.width,hn.height,tn,hn.data):O.texSubImage2D(O.TEXTURE_2D,Fe,Xe,Xt,Ge,Ie,tn,jn,hn);M.pixelStorei(O.UNPACK_ROW_LENGTH,ai),M.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ot),M.pixelStorei(O.UNPACK_SKIP_PIXELS,Ti),M.pixelStorei(O.UNPACK_SKIP_ROWS,Vi),M.pixelStorei(O.UNPACK_SKIP_IMAGES,Ms),Fe===0&&N.generateMipmaps&&O.generateMipmap(Be),M.unbindTexture()},this.initRenderTarget=function(y){Z.get(y).__webglFramebuffer===void 0&&ne.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?ne.setTextureCube(y,0):y.isData3DTexture?ne.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?ne.setTexture2DArray(y,0):ne.setTexture2D(y,0),M.unbindTexture()},this.resetState=function(){K=0,W=0,le=null,M.reset(),$e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ft._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ft._getUnpackColorSpace()}}const L={ink:"#4f4557",inkSoft:"#4a4549",bark:"#b39aa8",barkDark:"#937c8b",barkLight:"#d3c2cc",gortiBark:"#b9adc9",gortiBarkDark:"#9788aa",gortiBarkLight:"#d7cfe3",violet:"#ae8fdc",violetDark:"#8d6fc2",vein:"#e4d2f8",crystalBlue:"#93b1ea",crystalBlueDark:"#7391cf",crystalBlueLight:"#c9d9f7",crystalTeal:"#8ccfc0",crystalTealDark:"#68b0a1",crystalTealLight:"#c6ede4",crystalOrange:"#f4b580",crystalOrangeDark:"#dc9563",crystalOrangeLight:"#fad8b8",ivory:"#f6ecdb",ivoryDark:"#dfcfb4",sun:"#f1be7e",sunDark:"#d99b5f",sunLight:"#f6e39a",paper:"#f3eadb",paperDark:"#dccdb1",stamp:"#d9737e",suit:"#8e97aa",suitDark:"#737c8f",suitLight:"#b0b8c8",metalDark:"#838c9b",horse:"#b597d9",horseDark:"#977abf",horseLight:"#d4c1ec",leaf:"#a6ca8a",leafDark:"#80a96b",leafLight:"#cbe3b1",sparrow:"#c99d7e",sparrowDark:"#a88062",sparrowLight:"#e2c29f",raccoon:"#aca8b4",raccoonDark:"#8c8897",raccoonLight:"#d0cdd7"};function Ut(n,e,t){const i=parseInt(n.slice(1),16),s=parseInt(e.slice(1),16),r=Math.round((i>>16&255)*(1-t)+(s>>16&255)*t),a=Math.round((i>>8&255)*(1-t)+(s>>8&255)*t),o=Math.round((i&255)*(1-t)+(s&255)*t);return"#"+(1<<24|r<<16|a<<8|o).toString(16).slice(1)}function fh(n){const e=parseInt(n.slice(1),16),t=(e>>16&255)/255,i=(e>>8&255)/255,s=(e&255)/255,r=Math.max(t,i,s),a=Math.min(t,i,s),o=(r+a)/2;if(r===a)return[0,0,o];const c=r-a,l=o>.5?c/(2-r-a):c/(r+a);return[(r===t?(i-s)/c+(i<s?6:0):r===i?(s-t)/c+2:(t-i)/c+4)/6,l,o]}function hh(n,e,t){const i=r=>{const a=(r+n*12)%12,o=e*Math.min(t,1-t);return t-o*Math.max(-1,Math.min(a-3,9-a,1))},s=r=>Math.round(Math.max(0,Math.min(1,r))*255);return"#"+(1<<24|s(i(0))<<16|s(i(8))<<8|s(i(4))).toString(16).slice(1)}const nf=new Map;function ag(n,e=!1){const t=n.toLowerCase(),i=e?t+"+":t,s=nf.get(i);if(s)return s;const[r,a,o]=fh(t);let c=t;const l=a*(1-Math.abs(2*o-1)),f=(u,h)=>hh(r,Math.min(.62,l*h/Math.max(.05,1-Math.abs(2*u-1))),u);if(o>=.17){const u=o>=.78?o:.5+(o-.17)/.61*.28;c=f(u,1.25)}else e&&t!==L.ink&&t!=="#191728"&&t!=="#000000"&&(c=f(.28+o*.9,1.6));return nf.set(i,c),c}function uh(n,e=!1){return n.replace(/#[0-9a-fA-F]{6}\b/g,t=>ag(t,e))}const sf=new Map;function og(n){const e=n.toLowerCase(),t=sf.get(e);if(t)return t;const[i,s,r]=fh(e),a=r<.16?e:hh(i,s*.92,r+(.93-r)*.14);return sf.set(e,a),a}function lg(n){return n.replace(/(fill|stop-color)="(#[0-9a-fA-F]{6})"/g,(e,t,i)=>`${t}="${og(i)}"`).replace(/stroke="(#[0-9a-fA-F]{6})"/g,(e,t)=>`stroke="${Ut(t,"#3b3245",.38)}"`)}const dt="#4f4557",zi=1.5,C=1,cg="#3b3245";function He(n){if(!/^#[0-9a-fA-F]{6}$/.test(n))return dt;const e=parseInt(n.slice(1),16),t=parseInt(cg.slice(1),16),i=.58,s=r=>Math.round((e>>r&255)*(1-i)+(t>>r&255)*i);return`#${(s(16)<<16|s(8)<<8|s(0)).toString(16).padStart(6,"0")}`}const ye={periwinkle:"#97a3dc",periwinkleDeep:"#7d8bcc",sand:"#d8c09e",sandLight:"#e8d7b8",cream:"#f7eddc",blush:"#f7dbf2",pink:"#f0b2cf",pinkDeep:"#dd8db3",lilac:"#c3a3dc",lavender:"#dccdf0",mint:"#b6dcc6",aqua:"#bfdcd8",lime:"#c3dc8c",leaf:"#9cc47a",butter:"#f3e08e",apricot:"#f4b27c",stone:"#c9c7c4",night:"#3d5248"};function J(n,e,t={}){return me(n,{fill:e,stroke:t.stroke??zi,ink:t.ink??dt,inner:t.inner,over:t.over,opacity:t.opacity})}class Vt{constructor(e){Se(this,"s");this.s=e>>>0||1}next(){this.s=this.s+1831565813>>>0;let e=this.s;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+(t-e)*this.next()}int(e,t){return Math.floor(this.range(e,t+1))}pick(e){return e[Math.floor(this.next()*e.length)]}chance(e){return this.next()<e}}function Mi(n){let e=2166136261;for(let t=0;t<n.length;t++)e^=n.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}const et=n=>(Math.round(n*100)/100).toString();function re(n,e=1,t=!0){const i=n.length;if(i<3)return ve(n,t);const s=o=>t?n[(o+i)%i]:n[Math.max(0,Math.min(i-1,o))];let r=`M${et(n[0][0])} ${et(n[0][1])}`;const a=t?i:i-1;for(let o=0;o<a;o++){const c=s(o-1),l=s(o),f=s(o+1),u=s(o+2),h=e/6,d=[l[0]+(f[0]-c[0])*h,l[1]+(f[1]-c[1])*h],p=[f[0]-(u[0]-l[0])*h,f[1]-(u[1]-l[1])*h];r+=`C${et(d[0])} ${et(d[1])} ${et(p[0])} ${et(p[1])} ${et(f[0])} ${et(f[1])}`}return t?r+"Z":r}function ve(n,e=!0){if(n.length===0)return"";let t=`M${et(n[0][0])} ${et(n[0][1])}`;for(let i=1;i<n.length;i++)t+=`L${et(n[i][0])} ${et(n[i][1])}`;return e?t+"Z":t}function yt(n){const e=n.length;let t="";for(let i=0;i<e;i++){const s=n[i],r=n[(i-1+e)%e],a=n[(i+1)%e];if(s[2])t+=(i===0?"M":"L")+`${et(s[0])} ${et(s[1])}`;else{const o=[(r[0]+s[0])/2,(r[1]+s[1])/2],c=[(a[0]+s[0])/2,(a[1]+s[1])/2];t+=(i===0?"M":"L")+`${et(o[0])} ${et(o[1])}Q${et(s[0])} ${et(s[1])} ${et(c[0])} ${et(c[1])}`}}return t+"Z"}function ge(n,e,t,i){return`M${et(n-t)} ${et(e)}A${et(t)} ${et(i)} 0 1 0 ${et(n+t)} ${et(e)}A${et(t)} ${et(i)} 0 1 0 ${et(n-t)} ${et(e)}Z`}function Ke(n,e,t,i,s){const r=Math.min(s,t/2,i/2);return`M${et(n+r)} ${et(e)}H${et(n+t-r)}Q${et(n+t)} ${et(e)} ${et(n+t)} ${et(e+r)}V${et(e+i-r)}Q${et(n+t)} ${et(e+i)} ${et(n+t-r)} ${et(e+i)}H${et(n+r)}Q${et(n)} ${et(e+i)} ${et(n)} ${et(e+i-r)}V${et(e+r)}Q${et(n)} ${et(e)} ${et(n+r)} ${et(e)}Z`}function An(n,e,t,i,s=0){const r=e[0]-n[0],a=e[1]-n[1],o=Math.hypot(r,a)||1,c=-a/o,l=r/o,f=r/o,u=a/o,h=t/2,d=i/2,p=[(n[0]+e[0])/2,(n[1]+e[1])/2],_=(h+d)/2+s,m=[[n[0]+c*h,n[1]+l*h],[p[0]+c*_,p[1]+l*_],[e[0]+c*d,e[1]+l*d],[e[0]+f*d*.9,e[1]+u*d*.9],[e[0]-c*d,e[1]-l*d],[p[0]-c*_,p[1]-l*_],[n[0]-c*h,n[1]-l*h],[n[0]-f*h*.9,n[1]-u*h*.9]];return re(m,.9)}function j(n,e,t){const i=n.length;if(i<2)return"";const s=[],r=[];for(let p=0;p<i;p++){const _=n[Math.max(0,p-1)],m=n[Math.min(i-1,p+1)],g=m[0]-_[0],b=m[1]-_[1],E=Math.hypot(g,b)||1,v=-b/E,S=g/E,T=(e+(t-e)*(p/(i-1)))/2,P=n[p];s.push([P[0]+v*T,P[1]+S*T]),r.push([P[0]-v*T,P[1]-S*T])}const a=n[i-1],o=n[i-2],c=Math.hypot(a[0]-o[0],a[1]-o[1])||1,l=[a[0]+(a[0]-o[0])/c*t*.6,a[1]+(a[1]-o[1])/c*t*.6],f=n[0],u=n[1],h=Math.hypot(u[0]-f[0],u[1]-f[1])||1,d=[f[0]-(u[0]-f[0])/h*e*.4,f[1]-(u[1]-f[1])/h*e*.4];return re([...s,l,...r.reverse(),d],.85)}let Ll=0;function Ho(n="k"){return Ll=(Ll+1)%1e9,`${n}${Ll}`}function dh(n){if(!n)return!0;const e=n.toLowerCase();return e===dt||e===L.ink||e==="#191728"||e==="#1d1b1e"}function ph(n){return n>0?n>zi?zi:n:0}function me(n,e){const t=dh(e.ink)?He(e.fill):e.ink,i=ph(e.stroke??zi);let s=`<g${e.opacity!==void 0?` opacity="${e.opacity}"`:""}>`;if(s+=`<path d="${n}" fill="${e.fill}"/>`,e.inner||e.over){const r=Ho();s+=`<clipPath id="c${r}"><path d="${n}"/></clipPath>`,s+=`<g clip-path="url(#c${r})">${e.inner??""}${e.over??""}</g>`}return i>0&&(s+=`<path d="${n}" fill="none" stroke="${t}" stroke-width="${i}" stroke-linejoin="round" stroke-linecap="round"/>`),s+="</g>",s}function F(n,e,t,i=1){const s=dh(e),r=s?dt:e,a=s?ph(t):t;return`<path d="${n}" fill="none" stroke="${r}" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"${i!==1?` opacity="${i}"`:""}/>`}function xe(n,e,t=1){return`<path d="${n}" fill="${e}"${t!==1?` opacity="${t}"`:""}/>`}function ot(n,e,t,i,s=.6){const r=Ho("g"),a=Math.min(.32,s*.5);return`<radialGradient id="${r}"><stop offset="0" stop-color="${i}" stop-opacity="${et(a)}"/><stop offset="0.55" stop-color="${i}" stop-opacity="${et(a*.8)}"/><stop offset="1" stop-color="${i}" stop-opacity="0"/></radialGradient><circle cx="${et(n)}" cy="${et(e)}" r="${et(t)}" fill="url(#${r})"/>`}const rn=(n,e,t)=>n.map(([i,s])=>[i+e,s+t]);function Qe(n,e,t,i={}){const r=-e.x0+5,a=-e.y0+5;return{key:n,w:Math.ceil(e.x1-e.x0+10),h:Math.ceil(e.y1-e.y0+10),px:r,py:a,body:t(r,a),...i}}function ue(n,e=C,t=dt,i=1){return`<path d="${n}" fill="none" stroke="${t}" stroke-width="${e}" stroke-linecap="round" stroke-linejoin="round"${i!==1?` opacity="${i}"`:""}/>`}function zs(n,e,t=1){return`<path d="${n}" fill="${e}"${t!==1?` opacity="${t}"`:""}/>`}const nt=n=>re(n,1,!1);function rf(n,e,t,i){const s=e[0]-n[0],r=e[1]-n[1],a=Math.hypot(s,r)||1;return[n[0]+s*t-r/a*i,n[1]+r*t+s/a*i]}function Pa(n,e,t,i,s={}){const r=new Vt(i),a=s.n??3,o=s.color??dt,c=s.width??C*.85;let l="";for(let f=0;f<a;f++){const u=a===1?0:(f/(a-1)-.5)*t*.55,h=.08+r.range(0,.25),d=Math.min(.95,h+r.range(.35,.6)),p=[],_=4;for(let m=0;m<=_;m++){const g=h+(d-h)*m/_;p.push(rf(n,e,g,u+r.range(-.9,.9)))}l+=ue(nt(p),c,o)}for(let f=0;f<(s.knots??1);f++){const u=r.range(.3,.75),h=rf(n,e,u,r.range(-t*.15,t*.15)),d=Math.max(1.1,t*.12);l+=ue(`M${h[0]-d} ${h[1]}q${d} ${-d*1.4} ${d*2} 0`,c,o)}return l}function ar(n,e,t,i,s,r,a={}){return J(An(n,e,t,i,a.bulge??.4),s,{over:Pa(n,e,(t+i)/2,r,{n:a.lines??3})+(a.over??"")})}function Fs(n,e,t,i,s={}){const r=(s.width??.38)*t,a=Math.cos(e),o=Math.sin(e),c=(m,g)=>[n[0]+m*a-g*o,n[1]+m*o+g*a],l=c(t*.12,0),f=c(t,0),u=c(t*.5,-r*1.05),h=c(t*.5,r*1.05),d=m=>`${Math.round(m[0]*100)/100} ${Math.round(m[1]*100)/100}`,p=`M${d(l)}Q${d(u)} ${d(f)}Q${d(h)} ${d(l)}Z`;let _=ue(`M${d(n)}L${d(l)}`,C,dt);return _+=J(p,i,{stroke:s.stroke??C*1.1,over:s.vein===!1?"":ue(`M${d(l)}L${d(c(t*.82,0))}`,C*.7)}),_}function ri(n,e=4.5,t=2.4,i=dt,s=C*.85){let r=ue(nt(n),s*.8,i),a=e/2;for(let o=0;o<n.length-1;o++){const c=n[o],l=n[o+1],f=Math.hypot(l[0]-c[0],l[1]-c[1]);if(f===0)continue;const u=-(l[1]-c[1])/f,h=(l[0]-c[0])/f;for(let d=a;d<f;d+=e){const p=d/f,_=c[0]+(l[0]-c[0])*p,m=c[1]+(l[1]-c[1])*p;r+=ue(`M${_-u*t} ${m-h*t}L${_+u*t} ${m+h*t}`,s,i)}a=(a-f)%e,a<0&&(a+=e)}return r}function oc(n,e,t,i,s,r=dt,a=C*.75){const o=new Vt(s),c=[],l=Math.max(3,Math.round(t/2.2));for(let f=0;f<=l;f++)c.push([n+t*f/l,e+i*(.5+o.range(-.5,.5))]);return ue(`M${c.map(f=>`${Math.round(f[0]*100)/100} ${Math.round(f[1]*100)/100}`).join("L")}`,a,r)}function wa(n,e,t,i,s,r,a=0){const o=Math.min(2,i/3),c=J(`M${n+o} ${e}H${n+t-o}Q${n+t} ${e} ${n+t} ${e+o}V${e+i-o}Q${n+t} ${e+i} ${n+t-o} ${e+i}H${n+o}Q${n} ${e+i} ${n} ${e+i-o}V${e+o}Q${n} ${e} ${n+o} ${e}Z`,s,{stroke:C*1.1})+oc(n+t*.16,e+i*.3,t*.68,i*.4,r);return a?`<g transform="rotate(${a} ${n+t/2} ${e+i/2})">${c}</g>`:c}function mh(n,e,t,i,s,r,a=C){const o=new Vt(r),c=Math.max(2,Math.round(t/4.5)),l=Math.max(2,Math.round(i/4.5)),f=t/c,u=i/l;let h="";for(let d=0;d<l;d++)for(let p=0;p<c;p++){const _=n+p*f,m=e+d*u,g=o.int(0,3);g===0?h+=`M${_} ${m+u*.5}H${_+f*.8}`:g===1?h+=`M${_+f*.5} ${m}V${m+u*.8}`:g===2?h+=`M${_+f*.15} ${m+u*.2}H${_+f*.8}V${m+u*.85}`:h+=`M${_+f*.2} ${m+u*.85}V${m+u*.2}H${_+f*.85}`}return ue(h,a,s)}function Vo(n,e,t,i,s,r,a,o=.35){const c=new Vt(a);let l="";const f=i.length;for(let u=0;u<f;u++){const h=e+(f===1?0:(u/(f-1)-.5)*t)+c.range(-.06,.06),d=i[u],p=Math.cos(h),_=Math.sin(h),m=h+o,g=[n[0]+p*d*.55,n[1]+_*d*.55],b=[g[0]+Math.cos(m)*d*.45,g[1]+Math.sin(m)*d*.45];l+=J(j([n,g,b],s,.5),r,{stroke:C*1.2})}return l}function Pt(n,e){const t=n.length,i=r=>(Math.round(r*100)/100).toString();let s="";for(let r=0;r<t;r++){const a=n[r],o=n[(r-1+t)%t],c=n[(r+1)%t],l=typeof e=="number"?e:e[r]??0,f=Math.hypot(a[0]-o[0],a[1]-o[1])||1,u=Math.hypot(c[0]-a[0],c[1]-a[1])||1,h=Math.min(l,f/2)/f,d=Math.min(l,u/2)/u,p=[a[0]+(o[0]-a[0])*h,a[1]+(o[1]-a[1])*h],_=[a[0]+(c[0]-a[0])*d,a[1]+(c[1]-a[1])*d];s+=`${r===0?"M":"L"}${i(p[0])} ${i(p[1])}Q${i(a[0])} ${i(a[1])} ${i(_[0])} ${i(_[1])}`}return s+"Z"}function js(n,e,t,i=!1){const s=`<path d="${n}" fill="${i?t.glow:"none"}" stroke="${t.glow}" stroke-width="${e*2.6}" stroke-linecap="round" stroke-linejoin="round" opacity="0.32"/>`,r=`<path d="${n}" fill="${i?t.mid:"none"}" stroke="${t.mid}" stroke-width="${e}" stroke-linecap="round" stroke-linejoin="round"/>`,a=i?"":`<path d="${n}" fill="none" stroke="${t.core}" stroke-width="${e*.38}" stroke-linecap="round" stroke-linejoin="round"/>`;return s+r+a}const fg=["","happy","sad","shut"],hg=["","smile","open","grin","grit","frown"],gh=(n,e)=>e?`${n}.${e}`:n;function Jr(n,e,t){return fg.map(i=>Qe(gh(`${n}.eye`,i),e,(s,r)=>t(i,s,r)))}function Ac(n){const e=n.find(t=>t.key.endsWith(".eye"));return e?n.map(t=>t.key.endsWith(".eye.happy")?{...t,body:e.body}:t):n}function jr(n,e,t){return hg.map(i=>Qe(gh(`${n}.mouth`,i),e,(s,r)=>t(i,s,r)))}const ut=n=>(Math.round(n*100)/100).toString();function Gr(n,e,t,i,s,r){const a=r.white??"#fbf6ee",o=Math.max(1.3,s*.42);if(n==="happy")return ue(`M${ut(e-i)} ${ut(t+s*.35)}Q${ut(e)} ${ut(t-s*1.5)} ${ut(e+i)} ${ut(t+s*.35)}`,o*1.15);if(n==="shut")return ue(`M${ut(e-i)} ${ut(t-s*.1)}Q${ut(e)} ${ut(t+s*1)} ${ut(e+i)} ${ut(t-s*.1)}`,o);const c=`M${ut(e-i)} ${ut(t)}Q${ut(e)} ${ut(t-s*1.9)} ${ut(e+i)} ${ut(t)}Q${ut(e)} ${ut(t+s*1.7)} ${ut(e-i)} ${ut(t)}Z`,l=r.look??.25,f=s*.9;let u=r.blank?"":`<path d="${ge(e+i*l,t+s*.05,f*.92,f)}" fill="${r.iris}"/>`;r.blank||(u+=`<path d="${ge(e+i*l,t+s*.05,f*(r.pupil??.45),f*(r.pupil??.45)*1.08)}" fill="${dt}"/>`);const h=r.lid??0;if(h>0||n==="sad"){const p=t-s*.95,_=s*1.8,m=p+_*(n==="sad"?Math.max(h,.2)+.42:h),g=p+_*(n==="sad"?Math.max(h-.12,.04):h),[b,E]=[e-i-2,e+i+2],[v,S]=r.outer===-1?[m,g]:[g,m];u+=`<path d="M${ut(b)} ${ut(t-s*2.5)}L${ut(E)} ${ut(t-s*2.5)}L${ut(E)} ${ut(S)}L${ut(b)} ${ut(v)}Z" fill="${r.lidFill??"#e9c7cf"}"/>`,u+=ue(`M${ut(b)} ${ut(v)}L${ut(E)} ${ut(S)}`,C)}let d=J(c,a,{stroke:C*1.25,inner:u});if(r.lash){const p=r.outer*i;d+=ue(`M${ut(e+p)} ${ut(t)}l${ut(r.outer*2.2)} ${ut(-1.6)}`,C)}return d}function Rc(n,e,t,i,s){const r=s.inside??"#5a2438",a=s.teeth??"#fbf6ee",o=s.line??C*1.15,c=s.sad??0,l=(f,u)=>`${ut(e+f*i)} ${ut(t+u*i)}`;switch(n){case"":return ue(`M${l(-1,.1+c*.3)}Q${l(0,-.12-c*.3)} ${l(1,.08+c*.3)}`,o);case"smile":return(s.lip?J(`M${l(-1,-.1)}Q${l(0,.9)} ${l(1,-.2)}Q${l(0,.4)} ${l(-1,-.1)}Z`,s.lip,{stroke:C}):"")+ue(`M${l(-1,-.12)}Q${l(0,.75)} ${l(1,-.22)}`,o);case"open":return J(ge(e,t+i*.1,i*.55,i*.7),r,{stroke:C*1.2,inner:`<path d="${ge(e,t+i*.62,i*.38,i*.22)}" fill="${s.lip??"#e98aa8"}"/>`});case"grin":return J(`M${l(-1.05,-.25)}Q${l(0,1.25)} ${l(1.05,-.3)}Q${l(0,.05)} ${l(-1.05,-.25)}Z`,r,{stroke:C*1.2,inner:`<path d="M${l(-1.1,-.35)}Q${l(0,.2)} ${l(1.1,-.4)}L${l(1.1,-.9)}L${l(-1.1,-.9)}Z" fill="${a}"/>`+ue(`M${l(-1.05,-.2)}Q${l(0,.2)} ${l(1.05,-.25)}`,C*.8)});case"grit":return J(`M${l(-1,-.38)}L${l(1,-.38)}L${l(1,.38)}L${l(-1,.38)}Z`,a,{stroke:C*1.2,over:ue(`M${l(-.95,0)}H${ut(e+i*.95)}M${l(-.35,-.38)}V${ut(t+i*.38)}M${l(.35,-.38)}V${ut(t+i*.38)}`,C*.8)});case"frown":return ue(`M${l(-1,.4)}Q${l(0,-.45)} ${l(1,.35)}`,o)}}function zr(n,e,t,i,s={}){const r=t/2,a=s.sad??0;return Qe(n,{x0:-r-2,y0:-i-3,x1:r+2,y1:i+3},(o,c)=>{const l=[[-r,.6+a*.4],[-r*.2,-.7],[r*.5,-.5-a*.8],[r,.3-a*1.2]],f=rn(l,o,c),u=f.map(([p,_],m)=>[p,_-i*(.35+.65*(m/3))/2]),h=f.map(([p,_],m)=>[p,_+i*(.35+.65*(m/3))/2]).reverse(),d=`${nt(u)}L${h.map(([p,_])=>`${ut(p)} ${ut(_)}`).join("L")}Z`;return J(d,e,{stroke:s.stroke??C*1.1})})}const ug=["idle","walk","run","rise","fall","land","interact","reach","song","breath","transform","hurt","collapse","push","sit","kneel","shout"];function Hs(n,e,t,i=!1,s){const r=(l,f)=>t.parts?.[l]??`${e}.${f}`,a=[{id:"root",parent:null,x:0,y:0,z:0},{id:"hips",parent:"root",x:0,y:-t.hip,z:0},{id:"torso",parent:"hips",x:0,y:0,part:r("torso","torso"),z:50},{id:"head",parent:"torso",x:t.headX,y:-t.torso,part:r("head","head"),z:60},{id:"armR",parent:"torso",x:t.shoulderX,y:-t.shoulderY,part:r("armR","arm"),side:"R",z:70},{id:"foreR",parent:"armR",x:0,y:t.upper,part:r("foreR","fore"),side:"R",z:71},{id:"armL",parent:"torso",x:t.shoulderX*(t.farShoulder??-.4),y:-t.shoulderY-1,part:r("armL","arm"),side:"L",z:70},{id:"foreL",parent:"armL",x:0,y:t.upper,part:r("foreL","fore"),side:"L",z:71},{id:"legR",parent:"hips",x:t.hipX,y:-1,part:r("legR","thigh"),side:"R",z:40},{id:"shinR",parent:"legR",x:0,y:t.thigh,part:r("shinR","shin"),side:"R",z:41},{id:"footR",parent:"shinR",x:0,y:t.shin,part:r("footR","foot"),side:"R",z:42},{id:"legL",parent:"hips",x:-t.hipX,y:-1,part:r("legL","thigh"),side:"L",z:40},{id:"shinL",parent:"legL",x:0,y:t.thigh,part:r("shinL","shin"),side:"L",z:41},{id:"footL",parent:"shinL",x:0,y:t.shin,part:r("footL","foot"),side:"L",z:42}],o=t.watch??(i?{part:"gorti.watch",side:"L",at:t.shin-4}:null);o&&a.push({id:"watch",parent:`shin${o.side}`,x:0,y:o.at,part:o.part,side:o.side,z:43}),t.brow&&t.eye&&a.push({id:"browN",parent:"head",x:t.eye[0]+t.brow.dx,y:t.eye[1]-t.brow.up,part:t.brow.part,z:66}),t.face&&t.eye&&(a.push({id:"eyeN",parent:"head",x:t.eye[0],y:t.eye[1],part:`${t.face.eye}.eye`,z:64}),a.push({id:"mouth",parent:"head",x:t.face.mouthAt[0],y:t.face.mouthAt[1],part:`${t.face.mouth}.mouth`,z:63}));for(const l of t.hair??[])a.push({id:l.id,parent:"head",x:l.at[0],y:l.at[1],part:l.part,z:l.z,spring:{k:l.k??170,c:l.c??6.5,lag:.7,gain:.0045,tip:l.tip}});for(const l of t.extra??[])a.push({...l});const c=t.hand??30;return{id:n,joints:a,attach:{handR:{joint:"foreR",x:0,y:c},handL:{joint:"foreL",x:0,y:c},chest:{joint:"torso",x:2,y:-Math.round(t.shoulderY*.7)},eye:{joint:"head",x:t.eye?.[0]??8,y:t.eye?.[1]??-20},ankleL:{joint:"shinL",x:0,y:t.shin-4}},animations:[...ug]}}const yn={body:"#bdcb9e",root:"#9c8461",rootDark:"#7c6649",box:"#baa97f",boxSide:"#9e8e66",bezel:"#8e7f5c",screen:"#4c2245",glow:"#ff5db6",neon:"#ff9ad6",core:"#ffe4f4"},er={glow:yn.glow,mid:yn.neon,core:yn.core},dg={hip:42,thigh:19,shin:19,torso:33,shoulderY:27,shoulderX:3,upper:15,hipX:5,headX:1,hand:20,eye:[8,-32],brow:{part:"gorti.child.brow",up:8.5,dx:-7.5},face:{eye:"gorti.child",mouth:"gorti.child",mouthAt:[10,-19]}};function pg(){return Qe("gorti.child.head",{x0:-29,y0:-62,x1:33,y1:4},(n,e)=>{const t=c=>rn(c,n,e);let i=J(An([n,e+3],[n+1,e-8],9,8,.2),yn.root,{over:ue(`M${n-1} ${e+1}l1 -7`,C*.8)});const s=[[-27,-53],[-18,-60],[25,-60],[31,-54],[31,-9],[26,-3],[-16,-3],[-27,-8]],r=zs(`M${n-32} ${e-64}L${n-16} ${e-64}L${n-16} ${e+2}L${n-32} ${e+2}Z`,yn.boxSide)+ue(`M${n-16} ${e-59}L${n-16} ${e-4}`,C)+`<circle cx="${n-22}" cy="${e-49}" r="1.6" fill="${yn.bezel}" stroke="${dt}" stroke-width="${C*.8}"/><circle cx="${n-22}" cy="${e-13}" r="1.6" fill="${yn.bezel}" stroke="${dt}" stroke-width="${C*.8}"/>`+ue(`M${n-24} ${e-34}q2 3 0 7`,C*.8)+ue(`M${n-4} ${e-60}l1 3M${n+11} ${e-60}l-1 3`,C*.9);i+=J(Pt(t(s),[6,7,7,6,6,6,6,6]),yn.box,{inner:r}),i+=J(Pt(t([[-12,-55],[28,-55],[28,-8],[-12,-8]]),6),yn.bezel,{stroke:C*1.2});let a="";for(let c=-4;c<=24;c+=5.4)a+=`M${n+c} ${e-53}V${e-10}`;for(let c=-48;c<=-12;c+=5.4)a+=`M${n-10} ${e+c}H${n+27}`;const o=`<radialGradient id="cgscr"><stop offset="0" stop-color="${yn.glow}" stop-opacity="0.45"/><stop offset="1" stop-color="${yn.glow}" stop-opacity="0"/></radialGradient><ellipse cx="${n+8}" cy="${e-31}" rx="26" ry="25" fill="url(#cgscr)"/>`+ue(a,.7,yn.neon,.28)+js(nt(t([[-7,-49],[-4,-51],[-4,-47],[-1,-49]])),.9,er)+js(nt(t([[18,-14],[21,-16],[21,-12],[24,-14]])),.9,er)+`<path d="${Pt(t([[-8,-51],[25,-51],[25,-11],[-8,-11]]),4)}" fill="none" stroke="${yn.glow}" stroke-width="2.4" opacity="0.35"/>`;return i+=J(Pt(t([[-9,-52],[25,-52],[25,-11],[-9,-11]]),5),yn.screen,{stroke:C*1.3,inner:o}),i})}function mg(){const n=[{x:-7.5,w:6.4,h:8,outer:-1},{x:7.5,w:5.4,h:7.4,outer:1}];return Ac(Jr("gorti.child",{x0:-14,y0:-9,x1:14,y1:9},(e,t,i)=>n.map(s=>{const r=t+s.x,a=i,o=s.w/2,c=s.h/2;if(e==="happy")return js(`M${r-o} ${a+c*.5}L${r} ${a-c*.6}L${r+o} ${a+c*.5}`,1.9,er);if(e==="shut"){const l=s.outer===-1?`M${r-o} ${a-c*.6}L${r+o*.8} ${a}L${r-o} ${a+c*.6}`:`M${r+o} ${a-c*.6}L${r-o*.8} ${a}L${r+o} ${a+c*.6}`;return js(l,1.8,er)}if(e==="sad"){const l=a-c*.1,f=a-c,[u,h]=s.outer===-1?[l,f]:[f,l];return js(`M${r-o} ${u}L${r+o} ${h}L${r+o} ${a+c}L${r-o} ${a+c}Z`,1.1,er,!0)}return js(Pt([[r-o,a-c],[r+o,a-c],[r+o,a+c],[r-o,a+c]],1.6),1.1,er,!0)}).join("")))}function gg(){return jr("gorti.child",{x0:-4,y0:-4,x1:4,y1:4},()=>"")}function _g(){return Qe("gorti.child.brow",{x0:-7,y0:-4,x1:7,y1:4},(n,e)=>js(`M${n-4.5} ${e+.6}L${n+4.5} ${e-.4}`,1.9,er))}function Mg(){return Qe("gorti.child.torso",{x0:-19,y0:-38,x1:19,y1:8},(n,e)=>{const t=r=>rn(r,n,e),i=[[-13,6],[-16.5,-4],[-16.5,-16],[-15,-26],[-9,-32.5],[2,-35],[11,-32],[16,-25],[17,-12],[15.5,-2],[13,6]],s=zs(`M${n-18} ${e-7}Q${n-9} ${e-12} ${n-1} ${e-7}T${n+18} ${e-8}L${n+18} ${e+10}L${n-18} ${e+10}Z`,yn.root)+ue(`M${n-18} ${e-7}Q${n-9} ${e-12} ${n-1} ${e-7}T${n+18} ${e-8}`,C)+Pa([n-7,e-8],[n-8,e+6],8,11,{n:2,knots:0})+Pa([n+5,e-8],[n+6,e+6],8,12,{n:2,knots:0})+ue(nt(t([[-4,-9],[-5,-15],[-3,-20]])),C*.9)+ue(nt(t([[7,-9],[8,-13],[10,-16]])),C*.9)+ue(nt(t([[-4,-31],[1,-28],[7,-30]])),C)+ue(nt(t([[-9,-21],[-6,-19]])),C*.9);return J(nt(t(i))+"Z",yn.body,{inner:s})})}function vg(){return Qe("gorti.child.arm",{x0:-6,y0:-5,x1:6,y1:19},(n,e)=>J(An([n,e],[n,e+15],10.4,8.4,.6),yn.body,{over:ue(`M${n-3} ${e+11}q3 2 6 0`,C*.9)}),{far:!0})}function xg(){return Qe("gorti.child.fore",{x0:-9,y0:-4,x1:9,y1:26},(n,e)=>Vo([n,e+13],Math.PI/2,1.25,[8,10,10.5,8.5],3.6,yn.rootDark,21,.25)+ar([n,e],[n,e+14],8.2,7.2,yn.root,22,{lines:2}),{far:!0})}function yg(){return Qe("gorti.child.thigh",{x0:-8,y0:-5,x1:8,y1:23},(n,e)=>ar([n,e],[n,e+19],12.8,10.2,yn.root,31,{bulge:.8}),{far:!0})}function Sg(){return Qe("gorti.child.shin",{x0:-7,y0:-4,x1:7,y1:22},(n,e)=>ar([n,e],[n,e+19],10.2,8,yn.root,32,{lines:2}),{far:!0})}function bg(){return Qe("gorti.child.foot",{x0:-10,y0:-5,x1:17,y1:8},(n,e)=>{const t=r=>rn(r,n,e),i=(r,a)=>J(j(t(r),a,.7),yn.rootDark,{stroke:C*1.2});let s=i([[-2,3],[-6,5],[-9,6.2]],3.4);return s+=i([[1,3.5],[6,5.5],[10,6.3]],3.8),s+=i([[2,2],[9,3],[15,5.8]],4.2),s+=J(ge(n,e+2.5,6,4.2),yn.root,{over:ue(`M${n-2} ${e+1}q2 2 4 0`,C*.8)}),s},{far:!0})}function Tg(){return[pg(),...mg(),...gg(),_g(),Mg(),vg(),xg(),yg(),Sg(),bg()]}const Eg=Hs("gorti.root.child","gorti.child",dg),xt={head:"#d6e271",headSide:"#b8c65a",frame:"#f2a3c9",socket:"#5a2d52",lens:"#c9a6e4",tendril:"#5d4454",tendrilPink:"#e58fb8",tendrilGrey:"#8ea59f",armour:"#bab9c2",armourDark:"#8f8e99",yellow:"#f2d878",pink:"#f2adcb",blue:"#8fa2c4",collar:"#c9da7c",collarDeep:"#a9c46a",limb:"#b0b1b9",boot:"#7f818d"},_h=[{cx:-6,cy:-35,w:15,h:11.5,outer:-1},{cx:14,cy:-35,w:11,h:10.5,outer:1}],lc=[4,-35],Mh=[{id:"hairA",base:[-15,-52],pts:[[-15,-52],[-23,-61],[-33,-64],[-40,-73],[-39,-83],[-34,-89]],w:9,color:xt.tendril,band:!0},{id:"hairB",base:[-7,-55],pts:[[-7,-55],[-12,-67],[-10,-79],[-15,-89],[-23,-93]],w:8.5,color:xt.tendril,bird:"green"},{id:"hairC",base:[3,-56],pts:[[3,-56],[5,-68],[1,-79],[4,-89],[10,-92]],w:7.5,color:xt.tendrilGrey},{id:"hairD",base:[12,-55],pts:[[12,-55],[18,-65],[17,-75],[23,-83],[31,-83]],w:8,color:xt.tendril,bird:"lilac"},{id:"hairE",base:[20,-50],pts:[[20,-50],[29,-55],[35,-63],[36,-70]],w:6.5,color:xt.tendril,band:!0}],wg={hip:50,thigh:23,shin:23,torso:44,shoulderY:37,shoulderX:3,upper:22,hipX:5,headX:3,hand:27,eye:lc,brow:{part:"gorti.youth.brow",up:9.5,dx:-10},face:{eye:"gorti.youth",mouth:"gorti.youth",mouthAt:[9,-17]},hair:Mh.map((n,e)=>{const t=n.pts[n.pts.length-1];return{part:`gorti.youth.${n.id}`,id:n.id,at:n.base,tip:[t[0]-n.base[0],t[1]-n.base[1]],z:55+e,k:150,c:6}})};function cc(n,e,t,i){const s=t/2,r=i/2;return[[n-s,e-r*.35],[n-s*.55,e-r],[n+s*.55,e-r],[n+s,e-r*.35],[n+s*.8,e+r],[n-s*.8,e+r]]}function Ag(){return Qe("gorti.youth.head",{x0:-24,y0:-60,x1:28,y1:3},(n,e)=>{const t=a=>rn(a,n,e),i=[[-21,-52],[-14,-57],[20,-57],[26,-51],[27,-26],[24,-10],[17,-3],[-9,-2],[-19,-8],[-22,-26]],s=zs(`M${n-30} ${e-62}L${n-13} ${e-62}Q${n-15} ${e-30} ${n-12} ${e+3}L${n-30} ${e+3}Z`,xt.headSide)+ue(`M${n-13} ${e-56}Q${n-15} ${e-30} ${n-12} ${e-3}`,C)+ue(nt(t([[1,-15],[0,-9],[1,-3]])),C)+ue(nt(t([[19,-15],[20,-9],[18,-4]])),C)+ue(`M${n-11} ${e-21}h5M${n-9} ${e-16}h5M${n-11} ${e-11}h4M${n+22} ${e-22}h3`,C*.9)+ue(nt(t([[16,-57],[14,-52],[17,-48]])),C*.9)+ue(nt(t([[-6,-57],[-5,-53]])),C*.9)+ue(nt(t([[6,-30],[8,-24],[5,-23]])),C);let r=J(Pt(t(i),[5,6,6,5,6,7,6,6,6,5]),xt.head,{inner:s});for(const a of _h)r+=J(Pt(t(cc(a.cx,a.cy,a.w+5,a.h+4.5)),1.5),xt.frame,{stroke:C*1.2}),r+=J(Pt(t(cc(a.cx,a.cy,a.w,a.h)),1),xt.socket,{stroke:C});return r})}function Rg(){return Ac(Jr("gorti.youth",{x0:-18,y0:-9,x1:18,y1:9},(n,e,t)=>_h.map(i=>{const s=e+i.cx-lc[0],r=t+i.cy-lc[1],a=i.w/2-1.2,o=i.h/2-1.2;if(n==="happy")return ue(`M${s-a} ${r+o*.45}Q${s} ${r-o*1.3} ${s+a} ${r+o*.45}`,2.4,xt.lens)+ue(`M${s-a} ${r+o*.45}Q${s} ${r-o*1.3} ${s+a} ${r+o*.45}`,.9);if(n==="shut")return ue(`M${s-a} ${r}Q${s} ${r+o*.8} ${s+a} ${r}`,2.2,xt.lens)+ue(`M${s-a} ${r}Q${s} ${r+o*.8} ${s+a} ${r}`,.9);const c=Pt(cc(s,r,i.w-2.4,i.h-2.4),1);let l="";if(n==="sad"){const[f,u]=i.outer===-1?[r+o*.1,r-o*.8]:[r-o*.8,r+o*.1];l+=`<path d="M${s-a-2} ${r-o-3}L${s+a+2} ${r-o-3}L${s+a+2} ${u}L${s-a-2} ${f}Z" fill="${xt.socket}"/>`+ue(`M${s-a-2} ${f}L${s+a+2} ${u}`,1)}return J(c,xt.lens,{stroke:.9,inner:l})}).join("")))}function Lg(){return jr("gorti.youth",{x0:-4,y0:-4,x1:4,y1:4},()=>"")}function Cg(n){const e=n.pts.map(([r,a])=>[r-n.base[0],a-n.base[1]]),t=e.map(r=>r[0]),i=e.map(r=>r[1]),s={x0:Math.min(...t)-10,y0:Math.min(...i)-12,x1:Math.max(...t)+10,y1:Math.max(...i)+6};return Qe(`gorti.youth.${n.id}`,s,(r,a)=>{const o=rn(e,r,a);let c=J(j(o,n.w,1.6),n.color,{stroke:C*1.2,over:ue(nt(o.slice(1,-1)),C*.7,"#8b6d7e")});if(n.band){const f=o[Math.floor(o.length/2)];c+=`<circle cx="${f[0]}" cy="${f[1]}" r="${n.w*.42}" fill="${xt.tendrilPink}" stroke="${dt}" stroke-width="${C}"/>`}const l=o[o.length-1];if(n.bird){const f=n.bird==="green"?ye.leaf:ye.lilac,u=l[0],h=l[1]-4;c+=J(`M${u-5} ${h+1}Q${u-3} ${h-5} ${u+3} ${h-3}Q${u+6} ${h-1} ${u+3} ${h+3}Q${u-1} ${h+4} ${u-5} ${h+1}Z`,f,{stroke:C}),c+=J(`M${u+.5} ${h+.5}Q${u+3.5} ${h} ${u+3} ${h+2.5}Q${u+1} ${h+3} ${u+.5} ${h+.5}Z`,ye.pink,{stroke:.8}),c+=J(`M${u+4.5} ${h-2.5}l3 0.6l-2.6 1.2Z`,ye.butter,{stroke:.8}),c+=`<circle cx="${u+2.4}" cy="${h-2.2}" r="0.7" fill="${dt}"/>`,c+=ue(`M${u-5} ${h+1}l-3 -1.5M${u-5} ${h+1}l-3 1`,C*.9)}else c+=Fs(l,Math.atan2(l[1]-o[o.length-2][1],l[0]-o[o.length-2][0]),6,xt.collar,{vein:!1});return c})}function Pg(){return Qe("gorti.youth.torso",{x0:-24,y0:-66,x1:28,y1:10},(n,e)=>{const t=d=>rn(d,n,e),i=[[-12,5],[-13,-8],[-15,-22],[-16,-35],[-12,-42],[-2,-45],[10,-44],[16,-38],[16,-24],[13,-10],[12,5]];let s="";[-10,-4.5,1,6.5].forEach((d,p)=>{const _=p%2===0?xt.yellow:xt.pink;s+=J(`M${n+d} ${e-1}V${e-17}L${n+d+1.8} ${e-19.5}L${n+d+3} ${e-17}L${n+d+4.2} ${e-19.5}L${n+d+5.5} ${e-17}V${e-1}Z`,_,{stroke:C})});const a=n+3,o=e-31,c=J(`M${a-6} ${o}Q${a} ${o-5.5} ${a+6} ${o}Q${a} ${o+5} ${a-6} ${o}Z`,"#fbf6ee",{stroke:C,inner:`<circle cx="${a+.5}" cy="${o}" r="2.4" fill="#6fb2d8"/><circle cx="${a+.5}" cy="${o}" r="1.1" fill="${dt}"/>`})+ue(`M${a-5} ${o-3}l-1.5 -2M${a-2} ${o-4.2}l-0.6 -2.4M${a+1.5} ${o-4.4}l0.3 -2.4M${a+5} ${o-3}l1.6 -2M${a-3} ${o+3.8}l-0.8 2M${a+3} ${o+3.8}l0.8 2`,C*.85),l=ue(nt(t([[-15,-23],[0,-22],[16,-24]])),C)+`<circle cx="${n-11}" cy="${e-38}" r="1.2" fill="${xt.armourDark}" stroke="${dt}" stroke-width="0.8"/><circle cx="${n+12}" cy="${e-38}" r="1.2" fill="${xt.armourDark}" stroke="${dt}" stroke-width="0.8"/>`+zs(`M${n-20} ${e+1}H${n+20}V${e+9}H${n-20}Z`,xt.armourDark)+ue(`M${n-20} ${e+1}H${n+20}`,C)+`<rect x="${n+1}" y="${e+1.5}" width="5" height="4" rx="1" fill="${xt.yellow}" stroke="${dt}" stroke-width="0.9"/>`;let f=J(Pt(t(i),5),xt.armour,{inner:l,over:s+c});const u=[n+3,e-44],h=[[-2.95,22,xt.collarDeep],[-.2,21,xt.collarDeep],[-2.6,20,xt.collar],[-.55,20,xt.collar],[-2.25,16,xt.collar],[-.9,16,xt.collar]];for(const[d,p,_]of h)f+=Fs([u[0]+Math.cos(d)*3,u[1]+Math.sin(d)*2],d,p,_,{width:.3,stroke:C});return f})}function Dg(){return Qe("gorti.youth.arm",{x0:-8,y0:-7,x1:8,y1:27},(n,e)=>J(An([n,e],[n,e+22],9.5,8,.4),xt.limb,{over:ri([[n+1,e+7],[n+1.5,e+18]],3.6,1.8)})+J(Pt([[n-7,e-5],[n+7,e-5],[n+6.5,e+7],[n-6.5,e+7]],3),xt.blue,{stroke:C*1.2,over:ue(`M${n-6} ${e+1}H${n+6}`,C*.8)})+J(Pt([[n-5,e+15],[n+5,e+15],[n+5,e+20],[n-5,e+20]],1.5),xt.yellow,{stroke:C}),{far:!0})}function kg(){return Qe("gorti.youth.fore",{x0:-9,y0:-5,x1:10,y1:32},(n,e)=>{let t=J(An([n,e],[n,e+20],8.2,7,.3),xt.limb,{over:ri([[n-.5,e+3],[n,e+12]],3.4,1.7)});t+=J(`M${n-4.6} ${e+13}H${n+4.6}V${e+17.5}H${n-4.6}Z`,"#5a4e56",{stroke:C}),t+=J(ge(n+1.5,e+15.2,3.6,3.6),"#f7eddc",{stroke:C,over:ue(`M${n+1.5} ${e+15.2}v-2.2M${n+1.5} ${e+15.2}l1.6 0.8`,.8)}),t+=J(Pt([[n-1.5,e+21],[n+3.2,e+22],[n+5.8,e+27.5],[n+3.5,e+29]],1.2),xt.limb,{stroke:C}),t+=J(Pt([[n-4.5,e+19.5],[n+4,e+19.5],[n+4,e+25],[n-4.5,e+25]],1.8),xt.limb,{stroke:C*1.1});for(const i of[-3.5,-.8,1.9])t+=J(Pt([[n+i,e+24.5],[n+i+2.3,e+24.5],[n+i+2.1,e+30.5],[n+i+.2,e+30.5]],.9),xt.limb,{stroke:C*.9});return t},{far:!0})}function Ig(){return Qe("gorti.youth.thigh",{x0:-8,y0:-5,x1:8,y1:27},(n,e)=>J(An([n,e],[n,e+23],12.5,10,.5),xt.limb,{over:ri([[n-2,e+3],[n-2.5,e+13]],3.6,1.8)+J(Pt([[n-5.5,e+16],[n+5.5,e+15.5],[n+5,e+24],[n-5,e+24]],2),xt.pink,{stroke:C,over:ue(`M${n-3} ${e+18}l2 2M${n+1} ${e+18}l2 2`,C*.8)})}),{far:!0})}function Fg(){return Qe("gorti.youth.shin",{x0:-7,y0:-4,x1:7,y1:26},(n,e)=>J(An([n,e],[n,e+23],10,8,.2),xt.limb,{over:ue(`M${n-5} ${e+9}H${n+5}`,C)+ri([[n+1.5,e+11],[n+1.5,e+20]],3.2,1.6)}),{far:!0})}function Ug(){return Qe("gorti.youth.foot",{x0:-8,y0:-5,x1:16,y1:8},(n,e)=>J(Pt(rn([[-6,-3],[3,-3],[7,0],[14,1.5],[15,6],[-7,6]],n,e),[2,2,3,3,1.5,1.5]),xt.boot,{over:zs(`M${n-8} ${e+3.8}H${n+16}V${e+7}H${n-8}Z`,xt.pink)+ue(`M${n-7} ${e+3.8}H${n+15}`,C)+ue(`M${n+4} ${e-1}l-2 3`,C*.9)}),{far:!0})}function Ng(){return[Ag(),...Rg(),...Lg(),zr("gorti.youth.brow",xt.tendril,12,3.4,{stroke:C}),...Mh.map(Cg),Pg(),Dg(),kg(),Ig(),Fg(),Ug()]}const $g=Hs("gorti.root.youth","gorti.youth",wg),Rt={skin:"#f1dade",skinLine:"#c99aa8",hair:"#f2dc72",hairDeep:"#d9bb4a",tunic:"#c1d488",root:"#f3b5cf",leaf:"#9cc47a",metal:"#c5c3ca",metalDeep:"#a09ea8",plate:"#f6e8ef",maze:"#e27fae",iris:"#7d91a9"},Bg=[5,-27],Og={hip:62,thigh:29,shin:29,torso:64,shoulderY:49,shoulderX:3,upper:26,hipX:5,headX:3,hand:30,eye:Bg,brow:{part:"gorti.warrior.brow",up:6.2,dx:-5},face:{eye:"gorti.warrior",mouth:"gorti.warrior",mouthAt:[11,-11]},parts:{armL:"gorti.warrior.mecharm",foreL:"gorti.warrior.mechfore"},watch:{part:"gorti.warrior.watch",side:"L",at:22},extra:[{id:"skirt",parent:"torso",x:0,y:-4,part:"gorti.warrior.skirt",z:150,spring:{k:130,c:7,lag:.35,gain:.0025,tip:[0,26]}}]};function Gg(){return Qe("gorti.warrior.head",{x0:-17,y0:-56,x1:22,y1:4},(n,e)=>{const t=c=>rn(c,n,e);let i=J(An([n-1,e+4],[n,e-10],11,10,0),Rt.skin,{over:ue(`M${n+3} ${e-1}q1 -4 -1 -7`,C*.8,Rt.skinLine)});i+=J(nt(t([[-7,-27],[-15,-35],[-13,-26],[-10,-20],[-6,-19]]))+"Z",Rt.skin,{over:ue(nt(t([[-12,-31],[-10,-25]])),C*.8,Rt.skinLine)});const s=[[6,-2],[-3,-5],[-9,-12],[-11,-22],[-11,-33],[-7,-41],[2,-45],[10,-43],[14,-37],[15,-30],[19,-21],[16,-18],[16,-14],[14,-8],[11,-4]],r=ue(nt(t([[14,-29],[17.5,-21],[14.5,-19]])),C)+ue(nt(t([[-2.5,-23.5],[0,-22],[3,-23]])),C*.8,Rt.skinLine)+ue(nt(t([[9,-23.5],[11,-22.5],[13,-23.5]])),C*.8,Rt.skinLine)+ue(nt(t([[-5,-14],[-2,-10]])),C*.8,Rt.skinLine)+ue(nt(t([[9,-32.5],[12,-33.5],[14.5,-32]])),1.8,Rt.hairDeep);i+=J(nt(t(s))+"Z",Rt.skin,{over:r});const a=[[-12,-30],[-13,-40],[-9,-48],[0,-53],[11,-52],[17,-46],[16,-39],[11,-41],[5,-39],[-1,-41],[-6,-37],[-9,-33]],o=ue(nt(t([[-9,-38],[-4,-46],[4,-50]])),C)+ue(nt(t([[-3,-40],[3,-46],[11,-49]])),C)+ue(nt(t([[5,-41],[11,-45],[15,-44]])),C)+ue(nt(t([[-11,-34],[-9,-42]])),C);return i+=J(nt(t(a))+"Z",Rt.hair,{over:o}),i})}function zg(){return Ac(Jr("gorti.warrior",{x0:-12,y0:-8,x1:13,y1:7},(n,e,t)=>Gr(n,e-5.5,t,4.2,2.6,{outer:-1,iris:Rt.iris,lid:.34,lidFill:Rt.skin,look:.3,blank:!0})+Gr(n,e+6.5,t,3.2,2.4,{outer:1,iris:Rt.iris,lid:.34,lidFill:Rt.skin,look:.45,blank:!0})))}function Hg(){return jr("gorti.warrior",{x0:-4,y0:-4,x1:4,y1:4},()=>"")}function vh(n,e,t){return t.map(([i,s])=>ue(`M${n+i-3} ${e+s}q1.5 -1.6 3 0t3 0`,C)).join("")}function Vg(){return Qe("gorti.warrior.torso",{x0:-21,y0:-70,x1:22,y1:6},(n,e)=>{const t=r=>rn(r,n,e),i=[[-13,3],[-15,-10],[-16,-26],[-18,-40],[-18,-48],[-11,-53],[-7,-57],[-6,-67],[9,-67],[10,-57],[15,-53],[20,-48],[19,-36],[15,-22],[13,-8],[13,3]],s=vh(n,e,[[-8,-40],[6,-33],[-9,-24],[8,-18],[-2,-10],[11,-45],[-3,-30],[4,-60]])+ue(nt(t([[-6,-57],[2,-55],[10,-57]])),C)+J(`M${n-11} ${e-44}Q${n-4} ${e-50} ${n+3} ${e-44}Q${n-4} ${e-39} ${n-11} ${e-44}Z`,"#f3eed8",{stroke:C,inner:`<circle cx="${n-3.6}" cy="${e-44}" r="2.2" fill="${Rt.iris}"/><circle cx="${n-3.6}" cy="${e-44}" r="1" fill="${dt}"/>`})+ue(`M${n-9} ${e-46.5}l-1 -1.6M${n-6} ${e-47.8}l-0.4 -1.8M${n-2.5} ${e-48}l0.3 -1.8M${n+1} ${e-46.8}l1 -1.5`,C*.8);return J(nt(t(i))+"Z",Rt.tunic,{over:s})})}function Wg(){return Qe("gorti.warrior.skirt",{x0:-21,y0:-8,x1:21,y1:30},(n,e)=>{const i=`M${[[-14,-6],[14,-6],[16,6],[19,17],[13,13],[11,25],[6,15],[2,28],[-2,16],[-7,26],[-10,14],[-15,22],[-15,11],[-18,14],[-15,3]].map(([s,r])=>`${n+s} ${e+r}`).join("L")}Z`;return J(i,Rt.tunic,{over:vh(n,e,[[-6,3],[7,6],[0,12],[-9,12]])+ue(`M${n+2} ${e+16}l0.5 8M${n-7} ${e+15}l-0.3 7M${n+11} ${e+14}l0 7`,C*.8,"#7f9a4c")})})}function Xg(){return Qe("gorti.warrior.arm",{x0:-10,y0:-9,x1:10,y1:30},(n,e)=>{let t=ar([n,e],[n,e+26],11.5,9.5,Rt.root,41,{lines:3});return t+=J(`M${n-7} ${e+4}Q${n-8} ${e-7} ${n} ${e-7}Q${n+8} ${e-7} ${n+7} ${e+4}Z`,Rt.metal,{stroke:C*1.2}),t+=J(`M${n-7} ${e+3}L${n-9} ${e+11}L${n-4.5} ${e+7}L${n-2} ${e+13}L${n+1} ${e+7}L${n+4} ${e+12}L${n+5.5} ${e+6.5}L${n+9} ${e+10}L${n+7} ${e+3}Z`,Rt.leaf,{stroke:C*1.1}),t},{far:!0})}function qg(){return Qe("gorti.warrior.fore",{x0:-16,y0:-6,x1:16,y1:44},(n,e)=>{let t=Fs([n-3.5,e+9],Math.PI*.85,9,Rt.leaf);return t+=Fs([n+3.8,e+15],-Math.PI*.12,8,Rt.leaf),t+=Vo([n,e+24],Math.PI/2,1.05,[13,16,17,13],4.8,Rt.root,43,.28),t+=ar([n,e],[n,e+25],9.5,10.5,Rt.root,42,{lines:3,bulge:.2}),t},{far:!0})}function Zg(){return Qe("gorti.warrior.mecharm",{x0:-10,y0:-9,x1:10,y1:30},(n,e)=>{let t=J(Pt([[n-5.5,e+10],[n+5.5,e+10],[n+4.8,e+27],[n-4.8,e+27]],2.5),Rt.metal,{stroke:C*1.2,over:ue(`M${n-4} ${e+18}H${n+4}`,C*.9)});return t+=J(Pt([[n-8,e-6],[n+8,e-6],[n+7,e+12],[n-7,e+12]],4),Rt.metal,{stroke:C*1.3,over:ue(`M${n-7} ${e+3}H${n+7}`,C)+`<circle cx="${n+3.5}" cy="${e-1}" r="1.3" fill="${Rt.metalDeep}" stroke="${dt}" stroke-width="0.8"/>`}),t},{far:!0})}function Yg(){return Qe("gorti.warrior.mechfore",{x0:-12,y0:-6,x1:12,y1:40},(n,e)=>{let t=J(Pt([[n-4.8,e-2],[n+4.8,e-2],[n+4.2,e+21],[n-4.2,e+21]],2),Rt.metal,{stroke:C*1.2,over:ue(`M${n-4} ${e+7}H${n+4}M${n-4} ${e+13}H${n+4}`,C*.9)});return t+=`<circle cx="${n}" cy="${e}" r="3.4" fill="${Rt.metalDeep}" stroke="${dt}" stroke-width="${C}"/>`,t+=Vo([n,e+30],Math.PI/2,.9,[7,8.5,7],2.8,Rt.metal,45,.3),t+=J(ge(n,e+26,8.5,6),Rt.plate,{stroke:C*1.2,inner:mh(n-7,e+21,14,10,Rt.maze,7,1.1)}),t},{far:!0})}function Kg(){return Qe("gorti.warrior.thigh",{x0:-9,y0:-5,x1:9,y1:33},(n,e)=>ar([n,e],[n,e+29],14,11,Rt.root,51,{bulge:.6}),{far:!0})}function Qg(){return Qe("gorti.warrior.shin",{x0:-9,y0:-4,x1:9,y1:32},(n,e)=>ar([n,e],[n,e+29],11,8.6,Rt.root,52)+Fs([n+4,e+8],-.5,8,Rt.leaf),{far:!0})}function Jg(){return Qe("gorti.warrior.foot",{x0:-12,y0:-5,x1:20,y1:9},(n,e)=>{const t=r=>rn(r,n,e),i=(r,a)=>{const o=t(r);return J(j(o,a,.7),Rt.root,{stroke:C*1.2,inner:`<path d="${j(o.slice(-2),a*.45,.5)}" fill="${Rt.leaf}"/>`})};let s=i([[-2,3],[-7,5],[-11,6.3]],3.6);return s+=i([[1,3.5],[7,5.5],[12,6.4]],4.2),s+=i([[2,1.5],[10,2.8],[18,6]],4.8),s+=J(ge(n,e+2.4,5.8,4.2),Rt.root,{over:Pa([n-3,e+1],[n+3,e+3],4,53,{n:1,knots:0})}),s},{far:!0})}function jg(){return Qe("gorti.warrior.watch",{x0:-8,y0:-6,x1:8,y1:6},(n,e)=>J(`M${n-6.8} ${e-2.6}H${n+6.8}V${e+2.6}H${n-6.8}Z`,"#5f4f45",{stroke:C})+J(ge(n+1,e,4.3,4.3),ye.cream,{stroke:C*1.2,over:ue(`M${n+1} ${e}v-2.8M${n+1} ${e}l2 1`,.9)+`<circle cx="${n+1}" cy="${e}" r="3.2" fill="none" stroke="${ye.sand}" stroke-width="0.8"/>`}))}function e3(){return[Gg(),...zg(),...Hg(),zr("gorti.warrior.brow",Rt.hairDeep,9,2.6,{sad:1.6,stroke:C*.9}),Vg(),Wg(),Xg(),qg(),Zg(),Yg(),Kg(),Qg(),Jg(),jg()]}const t3=Hs("gorti.root.warrior","gorti.warrior",Og),rt={body:"#dfe7e2",bodyLine:"#aebdb6",mauve:"#c996aa",mauveDeep:"#b27f95",sage:"#aacd9c",stripe:"#8fd19a",hand:"#a9c580",leg:"#bf8fa2",foot:"#d3e8e4",moon:"#a7abe3",moonDeep:"#7f84c8",tear:"#8fd3ee",sun:"#f6b77f",ray:"#f3e08e",freckle:"#c07f5e",suit:"#a3a5ad",suitDeep:"#83858f",shirt:"#f5f2ea",tie:"#5d6178",shoe:"#4c4852"},xh={hip:43,thigh:19,shin:20,torso:57,shoulderY:46,shoulderX:9,upper:23,hipX:7,headX:9,hand:29},yh={...xh,eye:[-3,-31],brow:{part:"gorti.human.brow",up:6.5,dx:-.5},face:{eye:"gorti.human",mouth:"gorti.human",mouthAt:[2.5,-14.5]}},n3={...xh,parts:{head:"gorti.sun.head"},eye:[7,-30],brow:{part:"gorti.sun.brow",up:5.8,dx:-5},face:{eye:"gorti.sun",mouth:"gorti.sun",mouthAt:[10,-18]}};function i3(){return Qe("gorti.human.head",{x0:-22,y0:-68,x1:16,y1:4},(n,e)=>{const t=a=>rn(a,n,e),i=[[12,-65],[3,-56],[-1,-47],[-1,-39],[3,-34],[4.5,-30],[1.5,-27],[2,-22],[5,-18],[8,-12],[11,-6],[8,-1],[0,1],[-9,-1],[-16,-8],[-20,-20],[-20,-34],[-16,-47],[-7,-58]],s=J(`M${n-6} ${e-25}q-2.4 3.4 0 4.6q2.4 -1.2 0 -4.6Z`,rt.tear,{stroke:C})+J(`M${n-8.5} ${e-18}q-2.6 3.6 0 5q2.6 -1.4 0 -5Z`,rt.tear,{stroke:C})+J(`M${n-4.5} ${e-13}q-2 2.8 0 3.9q2 -1.1 0 -3.9Z`,rt.tear,{stroke:C}),r=ue(ge(n-13,e-42,2.2,1.6),C*.8,rt.moonDeep)+ue(ge(n-15,e-12,1.6,1.2),C*.8,rt.moonDeep)+ue(nt(t([[-12,-52],[-7,-55]])),C*.8,rt.moonDeep);return J(nt(t(i))+"Z",rt.moon,{over:r+s})})}function s3(){return Jr("gorti.human",{x0:-8,y0:-8,x1:8,y1:7},(n,e,t)=>Gr(n,e,t,5.2,3.6,{outer:-1,iris:"#3f6f63",lid:.1,lidFill:rt.moon,look:.3,pupil:.5,blank:!0}))}function r3(){return jr("gorti.human",{x0:-6,y0:-6,x1:6,y1:6},(e,t,i)=>Rc(e,t,i,3,{lip:rt.mauve,inside:"#4a2a4f",sad:.5}))}function a3(){return Qe("gorti.sun.head",{x0:-27,y0:-64,x1:34,y1:6},(n,e)=>{const t=n+4,i=e-28,s=20,r=new Vt(88);let a="";const o=15;for(let u=0;u<o;u++){const h=u/o*Math.PI*2+.1,d=s+8+r.range(-1.5,2.5),p=.2,_=(m,g)=>`${t+Math.cos(m)*g} ${i+Math.sin(m)*g}`;a+=J(`M${_(h-p,s-2)}L${_(h,d)}L${_(h+p,s-2)}Z`,rt.ray,{stroke:C})}let c="";for(let u=0;u<10;u++){const h=r.range(0,Math.PI*2),d=r.range(s*.45,s*.85),p=t+Math.cos(h)*d,_=i+Math.sin(h)*d;_>i-7&&_<i+14&&p>t-6||(c+=`<circle cx="${p}" cy="${_}" r="0.9" fill="${rt.freckle}"/>`)}const l=c+ue(`M${t+7} ${i-1}l2.6 5.2l-2.8 1`,C)+ue(`M${t-13} ${i+5}q2 1.5 4 0`,C*.8,rt.freckle)+ue(`M${t-6} ${i-8}q2 -1.4 5 -1.1`,1.6,"#c7743f");let f=J(An([n,e+4],[n+1,e-10],10,10,0),rt.body,{});return f+=a,f+=J(ge(t,i,s,s),rt.sun,{over:l}),f})}function o3(){return Jr("gorti.sun",{x0:-12,y0:-8,x1:13,y1:7},(n,e,t)=>Gr(n,e-5,t,3.9,2.7,{outer:-1,iris:"#e0667f",lid:.18,lidFill:rt.sun,look:.3,blank:!0})+Gr(n,e+6.5,t,3.2,2.5,{outer:1,iris:"#e0667f",lid:.18,lidFill:rt.sun,look:.45,blank:!0}))}function l3(){return jr("gorti.sun",{x0:-4.4-3,y0:-4.4-3,x1:4.4+3,y1:4.4+3},(e,t,i)=>Rc(e,t,i,4.4,{lip:"#e98a7a",inside:"#6b2c34",sad:.3}))}function ko(n,e,t,i,s,r=11){const a=new Vt(s),o=[];for(let c=0;c<r*2;c++){const l=c/(r*2)*Math.PI*2,f=c%2===0?1:.72+a.range(-.06,.06);o.push(`${n+Math.cos(l)*t*f} ${e+Math.sin(l)*i*f}`)}return`M${o.join("L")}Z`}const Sh=[[-17,7],[-25,-5],[-31,-22],[-32,-40],[-26,-54],[-12,-62],[6,-61],[17,-53],[22,-38],[23,-20],[20,-4],[13,7]];function c3(){return Qe("gorti.human.torso",{x0:-35,y0:-66,x1:27,y1:11},(n,e)=>{const t=r=>rn(r,n,e),i=J(ko(n-18,e-1,13,9,3,13),rt.mauve,{stroke:C})+J(ko(n+9,e-53,9,7,4,9),rt.mauve,{stroke:C})+J(Pt(t([[6,-22],[16,-23],[17,-13],[7,-12]]),2),rt.sage,{stroke:C,over:ri(t([[6.5,-17.5],[16.5,-18]]),3,1.4)}),s=ri(t([[16,-47],[19,-33],[19,-26]]),4,1.8)+ue(nt(t([[-25,-16],[-18,-12],[-12,-14]])),C,rt.bodyLine)+ue(nt(t([[-8,-58],[-4,-52]])),C,rt.bodyLine)+wa(n-31,e-47,13,7,"#f2a7b5",11,-14)+wa(n-29,e-38.5,12,6.5,ye.butter,12,-6)+wa(n-28,e-29.5,12,7,ye.mint,13,5)+ue(nt(t([[-2,-26],[0,-36],[-1,-46]])),C)+Fs(rn([[-1,-44]],n,e)[0],-2.3,10,ye.leaf)+Fs(rn([[0,-36]],n,e)[0],-.5,9,ye.leaf)+Fs(rn([[-.5,-29]],n,e)[0],-2.7,8,ye.leaf);return J(nt(t(Sh))+"Z",rt.body,{inner:i,over:s})})}function f3(){return Qe("gorti.human.arm",{x0:-9,y0:-6,x1:9,y1:28},(n,e)=>J(An([n,e],[n,e+23],14,11,.7),rt.body,{inner:J(ko(n+1,e+6,6.5,5.5,21,8),rt.mauve,{stroke:C}),over:ue(`M${n-4} ${e+16}q4 2 8 0`,C,rt.bodyLine)}),{far:!0})}function af(n=!1){return Qe(n?"gorti.suit.fore":"gorti.human.fore",{x0:-9,y0:-5,x1:10,y1:33},(e,t)=>{const i=r=>rn(r,e,t);let s="";if(s+=J(nt(i([[-4,18],[4,18],[6.5,23],[6,29.5],[3.8,30],[2.5,26],[0,29.5],[-3.5,28],[-5,23]]))+"Z",rt.hand,{stroke:C*1.2,over:ue(`M${e+2.5} ${t+26}l-1 -3M${e-1} ${t+27.5}l-0.3 -3`,C*.8)}),s+=J(j(i([[4,21],[7,23],[8.5,26]]),3.4,2.2),rt.hand,{stroke:C}),n)s+=J(An([e,t],[e,t+18],10.5,9.5,.3),rt.suit,{over:ue(`M${e-3} ${t+8}q2 2 5 0`,C,rt.suitDeep)}),s+=J(Pt(i([[-5,15],[5,15],[5,20],[-5,20]]),1.2),rt.shirt,{stroke:C});else{const r=[9,13,17].map(a=>J(`M${e-6} ${t+a}H${e+6}V${t+a+2.2}H${e-6}Z`,rt.stripe,{stroke:.9})).join("");s+=J(An([e,t],[e,t+19],10,9,.3),rt.body,{inner:r})}return s},{far:!0})}function of(n=!1){return Qe(n?"gorti.suit.thigh":"gorti.human.thigh",{x0:-9,y0:-5,x1:9,y1:24},(e,t)=>n?J(An([e,t],[e,t+19],15,12,.7),rt.suit,{over:ue(`M${e+2} ${t+5}q-3 6 1 11`,C,rt.suitDeep)}):J(An([e,t],[e,t+19],16,12.5,.8),rt.leg,{inner:J(ko(e-2,t+8,5.5,5,31,8),rt.sage,{stroke:C}),over:ri([[e+4,t+2],[e+5,t+14]],3.4,1.6)}),{far:!0})}function lf(n=!1){return Qe(n?"gorti.suit.shin":"gorti.human.shin",{x0:-9,y0:-4,x1:9,y1:24},(e,t)=>{if(n)return J(An([e,t],[e,t+20],12,11,.3),rt.suit,{over:ue(`M${e-5} ${t+17}H${e+5}`,C,rt.suitDeep)});const i=`M${e-7} ${t+3}L${e-5} ${t+10}L${e-3} ${t+5}L${e-1} ${t+11}L${e+1.5} ${t+5}L${e+3.5} ${t+10.5}L${e+5.5} ${t+4.5}L${e+7.5} ${t+9}L${e+7} ${t-1}L${e-7} ${t-1}Z`;return J(An([e,t],[e,t+20],12,10.5,.3),rt.leg,{over:ue(`M${e-3} ${t+14}l3 1.5`,C*.8)})+J(i,rt.mauveDeep,{stroke:C})},{far:!0})}function h3(){return Qe("gorti.human.foot",{x0:-9,y0:-5,x1:17,y1:8},(n,e)=>J(`M${n-7} ${e-2}Q${n-1} ${e-5} ${n+5} ${e-1}L${n+16} ${e+3}L${n+11} ${e+3.5}L${n+13} ${e+6}L${n+7} ${e+5}L${n+6} ${e+6.5}L${n-7} ${e+6.5}Z`,rt.foot,{stroke:C*1.3,over:ue(`M${n-2} ${e+1}q2 1 4 0`,C*.8,rt.bodyLine)}),{far:!0})}function u3(){return Qe("gorti.suit.foot",{x0:-9,y0:-5,x1:17,y1:8},(n,e)=>J(Pt(rn([[-6,-3],[4,-3],[8,0],[15,2],[15.5,6.5],[-7,6.5]],n,e),[2,2,3,3,1.5,1.5]),rt.shoe,{stroke:C*1.3,over:ue(`M${n-6} ${e+4.8}H${n+15}`,C*.8,"#8a8494")}),{far:!0})}function d3(){return Qe("gorti.suit.torso",{x0:-35,y0:-66,x1:27,y1:11},(n,e)=>{const t=r=>rn(r,n,e),s=J(`M${n+1} ${e-61}L${n+16} ${e-56}L${n+10} ${e-38}Z`,rt.shirt,{stroke:C*1.1})+J(`M${n+7} ${e-57}L${n+11} ${e-56}L${n+11.5} ${e-44}L${n+9.5} ${e-39}L${n+7.5} ${e-44}Z`,rt.tie,{stroke:C})+J(`M${n+1} ${e-61}L${n+10} ${e-38}L${n+3} ${e-45}L${n-1} ${e-58}Z`,rt.suitDeep,{stroke:C*1.1})+J(`M${n+16} ${e-56}L${n+10} ${e-38}L${n+17} ${e-46}L${n+19} ${e-53}Z`,rt.suitDeep,{stroke:C*1.1})+ue(nt(t([[10,-38],[13,-22],[15,-8],[15,6]])),C*1.2)+`<circle cx="${n+12.5}" cy="${e-26}" r="1.3" fill="${dt}"/><circle cx="${n+14}" cy="${e-14}" r="1.3" fill="${dt}"/>`+ue(nt(t([[-24,-32],[-17,-29],[-11,-31]])),C,rt.suitDeep)+ue(nt(t([[-24,-12],[-17,-10],[-11,-12]])),C,rt.suitDeep)+wa(n+15,e-36,8,5,ye.cream,17,8);return J(nt(t(Sh))+"Z",rt.suit,{over:s})})}function p3(){return Qe("gorti.suit.arm",{x0:-9,y0:-6,x1:9,y1:28},(n,e)=>J(An([n,e],[n,e+23],14,11,.7),rt.suit,{over:ue(`M${n-4} ${e+14}q4 2 8 0`,C,rt.suitDeep)}),{far:!0})}function m3(){return[i3(),...s3(),...r3(),zr("gorti.human.brow",rt.moonDeep,11,3.4,{stroke:C}),a3(),...o3(),...l3(),zr("gorti.sun.brow","#c7743f",9,2.8,{stroke:C}),c3(),f3(),af(),of(),lf(),h3(),d3(),p3(),af(!0),of(!0),lf(!0),u3()]}const g3=Hs("gorti.human","gorti.human",yh),_3=Hs("gorti.human.sun","gorti.human",n3),M3=Hs("gorti.suit","gorti.suit",{...yh,parts:{head:"gorti.human.head"}});function v3(){return Qe("gorti.watch",{x0:-6,y0:-5,x1:6,y1:5},(n,e)=>J(`M${n-5.5} ${e-2}H${n+5.5}V${e+2}H${n-5.5}Z`,"#5f4f45",{stroke:C})+J(ge(n+1,e,3.5,3.5),ye.cream,{stroke:C*1.1,over:ue(`M${n+1} ${e}v-2M${n+1} ${e}l1.4 0.7`,.8)}))}function x3(){return[...Tg(),...Ng(),...e3(),...m3(),v3()]}const vn={blanket:"#c9b8e4",blanketDeep:"#a995cf",face:"#f3e2dc",faceLine:"#cfa9a8",hair:"#4d3f4f",pyjama:"#aeb8d2",pyjamaLine:"#8290b4",foot:"#f1ddd8",wood:"#c09469",wrap:"#f4ead6",flame:"#f7c46b",flameCore:"#fff0b8",flameEdge:"#ef9a5c"},bn={plate:"#bdbcc4",plateDeep:"#9a99a4",joint:"#dddbe2",yellow:"#f2d878",pink:"#f2adcb",maze:"#e27fae",blue:"#8fa2c4",photo:"#f7eddc"};function y3(){return Qe("coward.head",{x0:-19,y0:-38,x1:18,y1:6},(n,e)=>{const t=a=>rn(a,n,e);let s=J(nt(t([[2,-2],[-4,-8],[-5,-20],[0,-27],[8,-27],[12,-22],[13,-17],[16,-13],[12.5,-11],[12.5,-7],[9,-3]]))+"Z",vn.face,{over:ue(nt(t([[13,-17],[15.5,-13],[12.5,-12]])),C)+ue(nt(t([[2,-12],[5,-10]])),C*.8,vn.faceLine)});return s+=J(nt(t([[-1,-26],[4,-30],[10,-28],[9,-24],[5,-26],[2,-23]]))+"Z",vn.hair,{stroke:C}),s+=J(nt(t([[-15,4],[-18,-10],[-16,-25],[-8,-34],[4,-36],[12,-31],[14,-26],[7,-28],[2,-27],[-2,-21],[-2,-9],[2,1],[-5,5]]))+"Z",vn.blanket,{inner:J(Pt(t([[-16,-18],[-9,-19],[-8,-11],[-15,-10]]),1.5),ye.mint,{stroke:C,over:ri(t([[-15.5,-14.5],[-8.5,-15]]),2.6,1.2)}),over:ri(t([[10,-30],[4,-28],[-1,-22],[-1,-10],[2,0]]),3.4,1.5)}),s})}function S3(){return Jr("coward",{x0:-7,y0:-8,x1:7,y1:7},(n,e,t)=>Gr(n,e,t,3.6,3.3,{outer:-1,iris:"#4b3f5a",look:.35,pupil:.55,lidFill:vn.face}))}function b3(){return jr("coward",{x0:-2.6-3,y0:-2.6-3,x1:2.6+3,y1:2.6+3},(e,t,i)=>Rc(e,t,i,2.6,{lip:"#e7a3b0",inside:"#5a2a3c",sad:.6}))}function T3(){return Qe("coward.torso",{x0:-16,y0:-40,x1:16,y1:12},(n,e)=>{const t=r=>rn(r,n,e),i=[[-11,8],[-13,-4],[-13,-18],[-11,-29],[-3,-35],[6,-34],[11,-28],[12,-16],[11,-3],[13,7],[9,5],[7,10],[3,6],[0,10],[-3,6],[-7,10]],s=J(Pt(t([[-12,-26],[-4,-27],[-3,-18],[-11,-17]]),1.5),ye.butter,{stroke:C,over:ri(t([[-11.5,-21.5],[-3.5,-22.5]]),2.8,1.2)})+J(Pt(t([[2,-12],[10,-13],[10,-4],[3,-3]]),1.5),ye.pink,{stroke:C})+ue(nt(t([[-8,-8],[-3,-6],[1,-9]])),C,vn.blanketDeep)+ue(nt(t([[3,-32],[5,-24],[3,-16]])),C,vn.blanketDeep);return J(`M${i.map(([r,a])=>`${n+r} ${e+a}`).join("L")}Z`,vn.blanket,{inner:s,over:wa(n-2,e-5,8,4.5,ye.cream,5,-8)})})}function E3(){return Qe("coward.arm",{x0:-7,y0:-5,x1:7,y1:21},(n,e)=>J(An([n,e],[n,e+16],9,8,.4),vn.blanket,{over:ue(`M${n-3} ${e+12}q3 2 6 0`,C,vn.blanketDeep)}),{far:!0})}function w3(){return Qe("coward.fore",{x0:-7,y0:-4,x1:8,y1:27},(n,e)=>{let t=J(nt(rn([[-3,16],[3,16],[4.5,20],[3,24],[-1,25],[-3.5,21]],n,e))+"Z",vn.face,{stroke:C*1.2});return t+=J(An([n,e],[n,e+17],8,7,.2),vn.blanket,{over:ue(`M${n-4} ${e+14}H${n+4}`,C,vn.blanketDeep)}),t},{far:!0})}function A3(){return Qe("coward.thigh",{x0:-7,y0:-4,x1:7,y1:23},(n,e)=>J(An([n,e],[n,e+19],9.5,8,.3),vn.pyjama,{inner:ue(`M${n-2} ${e-2}V${e+22}M${n+2} ${e-2}V${e+22}`,.9,vn.pyjamaLine)}),{far:!0})}function R3(){return Qe("coward.shin",{x0:-6,y0:-4,x1:6,y1:22},(n,e)=>J(An([n,e],[n,e+19],8,7,.2),vn.pyjama,{inner:ue(`M${n-1.5} ${e-2}V${e+21}M${n+2} ${e-2}V${e+21}`,.9,vn.pyjamaLine)}),{far:!0})}function L3(){return Qe("coward.foot",{x0:-8,y0:-4,x1:13,y1:8},(n,e)=>J(nt(rn([[-4,-2],[-6,2],[-5,6],[6,6],[11.5,5],[10,1.5],[3,-2]],n,e))+"Z",vn.foot,{stroke:C*1.2,over:ue(`M${n+8} ${e+5.5}l0.5 -2M${n+5.5} ${e+5.8}l0.4 -2`,C*.7)}),{far:!0})}function C3(){return Qe("coward.torch",{x0:-9,y0:-58,x1:9,y1:26},(n,e)=>{let t=J(An([n,e+24],[n+1,e-40],6,7,.3),vn.wood,{over:Pa([n,e+20],[n+1,e-36],5,61,{n:2,knots:1})});return t+=J(Pt([[n-7,e-53],[n+8,e-53],[n+8,e-38],[n-7,e-38]],3),vn.wrap,{stroke:C*1.3,over:ue(`M${n-7} ${e-48}l15 2M${n-7} ${e-43}l15 2`,C)}),t})}function P3(){return Qe("coward.flame",{x0:-13,y0:-32,x1:13,y1:5},(n,e)=>{const t=s=>rn(s,n,e);let i=ot(n,e-10,15,ye.butter,.5);return i+=J(nt(t([[-9,0],[-10,-9],[-5,-17],[-3,-27],[2,-18],[6,-25],[9,-12],[9,-2],[3,2]]))+"Z",vn.flame,{stroke:C*1.3,inner:zs(nt(t([[-10,2],[-8,-6],[-2,-4],[4,-7],[10,-3],[10,4]]))+"Z",vn.flameEdge,.8)}),i+=`<path d="${nt(t([[-4,-1],[-5,-8],[-1,-14],[3,-9],[4,-2]]))}Z" fill="${vn.flameCore}"/>`,i})}function D3(){return Qe("mech.head",{x0:-16,y0:-44,x1:18,y1:5},(n,e)=>{const t=c=>rn(c,n,e);let i=ue(`M${n-5} ${e-29}L${n-8} ${e-38}`,1.8)+`<circle cx="${n-8.5}" cy="${e-39}" r="2.2" fill="${bn.pink}" stroke="${dt}" stroke-width="${C}"/>`;const s=Pt(t([[-12,-26],[-5,-30],[10,-29],[15,-22],[16,-8],[12,-1],[-9,0],[-13,-8]]),4),r=zs(`M${n-20} ${e-34}H${n-5}V${e+4}H${n-20}Z`,bn.plateDeep)+ue(`M${n-5} ${e-30}V${e}`,C)+ue(`M${n-5} ${e-15}H${n+16}`,C)+`<circle cx="${n-9}" cy="${e-22}" r="1.2" fill="${bn.joint}" stroke="${dt}" stroke-width="0.8"/><circle cx="${n-9}" cy="${e-6}" r="1.2" fill="${bn.joint}" stroke="${dt}" stroke-width="0.8"/>`+ri(t([[-3,-26],[4,-27.5]]),2.6,1.2);i+=J(s,bn.plate,{inner:r});const a=n+8,o=e-20;return i+=`<circle cx="${a-2}" cy="${o}" r="3.2" fill="${bn.yellow}" stroke="${dt}" stroke-width="${C*1.2}"/><circle cx="${a-2}" cy="${o}" r="1.2" fill="${dt}"/>`,i+=ue(`M${a+1.2} ${o}L${a+7} ${o}M${a+5} ${o}l0 2.4M${a+7} ${o}l0 3`,1.8),i+=`<path d="M${n+6.8} ${e-10}a2.4 2.4 0 1 1 4.4 0l1.2 5.2h-6.8z" fill="${dt}"/>`,i})}function k3(){return Qe("mech.torso",{x0:-16,y0:-42,x1:17,y1:8},(n,e)=>{const t=a=>rn(a,n,e),i=Pt(t([[-10,5],[-12,-10],[-12,-30],[-6,-38],[7,-38],[13,-31],[13,-10],[10,5]]),4);let s="";[-8,-3,2,7].forEach((a,o)=>{s+=J(`M${n+a} ${e+2}V${e-10}L${n+a+1.6} ${e-12.5}L${n+a+2.6} ${e-10}L${n+a+3.6} ${e-12.5}L${n+a+4.8} ${e-10}V${e+2}Z`,o%2?bn.pink:bn.yellow,{stroke:C})});const r=ue(`M${n-12} ${e-15}H${n+13}`,C)+J(Pt(t([[-9,-34],[3,-34],[3,-19],[-9,-19]]),2),"#f6e8ef",{stroke:C*1.1,inner:mh(n-8,e-33,10,13,bn.maze,3,1.1)})+J(Pt(t([[5,-33],[11,-33],[11,-25],[5,-25]]),1),bn.photo,{stroke:C,inner:`<circle cx="${n+8}" cy="${e-30}" r="1.6" fill="${ye.lilac}"/>`})+ri(t([[6,-22],[11,-21]]),2.4,1.2)+s;return J(i,bn.plate,{over:r})})}function I3(){return Qe("mech.arm",{x0:-7,y0:-7,x1:7,y1:25},(n,e)=>J(Pt([[n-4,e],[n+4,e],[n+3.6,e+21],[n-3.6,e+21]],2),bn.plate,{stroke:C*1.2,over:ri([[n,e+5],[n,e+17]],3.2,1.6)})+J(Pt([[n-6,e-5],[n+6,e-5],[n+5.5,e+5],[n-5.5,e+5]],2.5),bn.blue,{stroke:C*1.2}),{far:!0})}function F3(){return Qe("mech.fore",{x0:-8,y0:-5,x1:8,y1:33},(n,e)=>{let t=Vo([n,e+22],Math.PI/2,.8,[7,8,7],2.8,bn.plateDeep,71,.2);return t+=J(Pt([[n-3.6,e],[n+3.6,e],[n+3.2,e+22],[n-3.2,e+22]],2),bn.plate,{stroke:C*1.2,over:ue(`M${n-3} ${e+8}H${n+3}M${n-3} ${e+15}H${n+3}`,C*.9)}),t+=`<circle cx="${n}" cy="${e}" r="3.2" fill="${bn.joint}" stroke="${dt}" stroke-width="${C*1.1}"/>`,t},{far:!0})}function U3(){return Qe("mech.thigh",{x0:-7,y0:-6,x1:7,y1:25},(n,e)=>J(Pt([[n-5,e-1],[n+5,e-1],[n+4.4,e+21],[n-4.4,e+21]],2.5),bn.plate,{stroke:C*1.2,over:J(Pt([[n-4,e+9],[n+4,e+9],[n+4,e+15],[n-4,e+15]],1),bn.pink,{stroke:C})+ri([[n+1,e+2],[n+1,e+8]],2.6,1.3)})+`<circle cx="${n}" cy="${e}" r="3.4" fill="${bn.joint}" stroke="${dt}" stroke-width="${C*1.1}"/>`,{far:!0})}function N3(){return Qe("mech.shin",{x0:-6,y0:-6,x1:6,y1:25},(n,e)=>J(Pt([[n-4.2,e-1],[n+4.2,e-1],[n+3.6,e+21],[n-3.6,e+21]],2),bn.plate,{stroke:C*1.2,over:ri([[n,e+4],[n,e+17]],3,1.5)})+`<circle cx="${n}" cy="${e}" r="3.2" fill="${bn.joint}" stroke="${dt}" stroke-width="${C*1.1}"/>`,{far:!0})}function $3(){return Qe("mech.foot",{x0:-8,y0:-4,x1:14,y1:8},(n,e)=>J(Pt(rn([[-6,-2],[4,-2],[13,2],[13,6],[-7,6]],n,e),[2,2,2,1.5,1.5]),bn.plateDeep,{stroke:C*1.2,over:zs(`M${n-8} ${e+3.5}H${n+14}V${e+7}H${n-8}Z`,bn.yellow)+ue(`M${n-7} ${e+3.5}H${n+13}`,C)}),{far:!0})}function B3(){return[y3(),T3(),E3(),w3(),A3(),R3(),L3(),C3(),P3(),zr("coward.brow",vn.hair,9,2.8,{sad:1,stroke:C}),...S3(),...b3(),D3(),k3(),I3(),F3(),U3(),N3(),$3(),zr("mech.brow","#5b5d6b",10,3,{stroke:C})]}const O3={hip:42,thigh:19,shin:19,torso:34,shoulderY:30,shoulderX:2,upper:16,hipX:3,headX:1,hand:22,eye:[7.4,-18.5],brow:{part:"coward.brow",up:5.2,dx:0},face:{eye:"coward",mouth:"coward",mouthAt:[10.5,-7.5]}},G3={hip:46,thigh:21,shin:21,torso:38,shoulderY:33,shoulderX:2,upper:21,hipX:4,headX:1,hand:28,eye:[7,-20],brow:{part:"mech.brow",up:6,dx:-1.5}},z3=(()=>{const n=Hs("coward","coward",O3,!1);return n.joints.push({id:"torch",parent:"foreR",x:0,y:22,part:"coward.torch",z:72}),n.joints.push({id:"flame",parent:"torch",x:1,y:-50,part:"coward.flame",z:73,spring:{k:120,c:6,lag:.5,gain:.004,tip:[0,-26]}}),n.attach.flame={joint:"torch",x:1,y:-58},n})(),H3=Hs("mech","mech",G3,!1),ea=(n,e,t)=>n.map(([i,s])=>[i+e,s+t]);function ta(n,e,t,i={}){const r=-e.x0+6,a=-e.y0+6;return{key:n,w:Math.ceil(e.x1-e.x0+12),h:Math.ceil(e.y1-e.y0+12),px:r,py:a,body:t(r,a),scale:1.5,...i}}const Dn={body:"#c4a7df",bodyLine:"#9a7fc0",patch:"#aacf8f",patchDeep:"#8fbf74",dash:"#7fb86a",tag:"#f3e08e",tagRim:"#e7a3c6",goggle:"#d6e271",hoof:"#f1d76a",cuff:"#f3e08e",eye:"#3b2d45"},Hr=zi*1.25;function os(n,e,t,i,s,r=Dn.patch){const a=new Vt(s),o=[],c=7;for(let l=0;l<c;l++){const f=l/c*Math.PI*2,u=1+a.range(-.28,.22);o.push([n+Math.cos(f)*t*u,e+Math.sin(f)*i*u])}return J(re(o),r,{stroke:C*1.3})}function bh(n,e,t,i=Dn.dash){let s="";for(let r=0;r<n.length-1;r++){const a=n[r],o=n[r+1],c=Math.hypot(o[0]-a[0],o[1]-a[1]),l=(o[0]-a[0])/c,f=(o[1]-a[1])/c;for(let u=e/2;u<c;u+=e){const h=a[0]+l*u,d=a[1]+f*u;s+=`<path d="M${h-l*t/2} ${d-f*t/2}L${h+l*t/2} ${d+f*t/2}" stroke="${dt}" stroke-width="${t*.55+1.6}" stroke-linecap="round"/>`,s+=`<path d="M${h-l*t/2} ${d-f*t/2}L${h+l*t/2} ${d+f*t/2}" stroke="${i}" stroke-width="${t*.55}" stroke-linecap="round"/>`}}return s}function V3(){return ta("horse.body",{x0:-108,y0:-18,x1:100,y1:80},(n,e)=>{const t=f=>ea(f,n,e),i=[[-104,14],[-98,-4],[-80,-14],[-58,-12],[-30,-4],[10,0],[44,-6],[66,-16],[86,-8],[100,10],[102,30],[92,50],[74,64],[44,64],[16,68],[-16,68],[-44,62],[-66,66],[-90,56],[-104,36]],s=os(n-78,e+36,18,13,1)+os(n-30,e+54,22,10,2)+os(n+36,e+44,16,11,3)+os(n+76,e+18,12,16,4,Dn.patchDeep)+os(n-50,e+4,10,6,5),r=n-6,a=e+14,o=[];for(let f=0;f<=16;f++){const u=f/16*Math.PI*2,h=f%2?1:.86;o.push(`${r+Math.cos(u)*21*h} ${a+Math.sin(u)*12*h}`)}const c=J(`M${o.join("L")}Z`,Dn.tagRim,{stroke:C*1.2})+J(`M${r-15} ${a-7}H${r+15}V${a+7}H${r-15}Z`,Dn.tag,{stroke:C*1.3})+oc(r-12,a-4.5,24,3.5,17,"#6a4a8a",1.4)+oc(r-9,a+1.5,18,3.5,18,"#6a4a8a",1.4),l=bh(t([[-86,-6],[-60,-4],[-30,4],[10,8],[44,2],[70,-6]]),11,5)+ri(t([[-60,30],[-50,44],[-54,56]]),5,2.4,dt,1.4)+ue(re(t([[60,6],[70,30],[62,52]]),1,!1),1.6,Dn.bodyLine)+c;return J(re(t(i)),Dn.body,{stroke:Hr,inner:s,over:l})})}function W3(){return ta("horse.neck",{x0:-24,y0:-86,x1:64,y1:22},(n,e)=>{const t=s=>ea(s,n,e);return J(re(t([[-20,18],[-18,-10],[0,-44],[22,-72],[42,-82],[60,-70],[52,-48],[36,-20],[26,8],[14,22]])),Dn.body,{stroke:Hr,inner:os(n+18,e-20,10,16,11)+os(n+46,e-64,7,6,12,Dn.patchDeep),over:bh(t([[-12,-8],[4,-40],[24,-66],[42,-78]]),12,5)})})}function X3(){return ta("horse.head",{x0:-18,y0:-34,x1:86,y1:56},(n,e)=>{const t=o=>ea(o,n,e),i=[[-14,-6],[-2,-18],[18,-16],[42,-4],[64,14],[80,30],[81,42],[70,50],[54,47],[40,38],[22,30],[4,26],[-10,14]],s=[];for(let o=0;o<=10;o++)s.push(`${n+40+o*3.4} ${e+37.5+(o%2?2.4:-.6)+o*.8}`);const r=ue(`M${s.join("L")}`,C*1.3)+`<path d="${re(t([[68,32],[74,30],[76,36],[70,38]]))}" fill="${dt}"/>`+J(ge(n+17,e-5,11,8),Dn.goggle,{stroke:C*1.5,inner:ue(`M${n+8} ${e-1}l18 -8`,1,"#aab84a")})+J(ge(n+18,e-5,5,4.4),"#fbf6ee",{stroke:C*1.2,inner:`<circle cx="${n+19.5}" cy="${e-5}" r="2.6" fill="${Dn.eye}"/>`})+ue(`M${n+29} ${e-1}q10 4 16 12`,C*1.2,"#aab84a")+os(n+40,e+20,7,5,21)+ue(re(t([[4,24],[18,14],[30,20]]),1,!1),1.6,Dn.bodyLine);let a=J(re(t([[-6,-14],[-2,-30],[6,-16]])),Dn.body,{stroke:C*1.5});return a+=J(re(t(i)),Dn.body,{stroke:Hr,over:r}),a})}function q3(){return ta("horse.tail",{x0:-70,y0:-12,x1:10,y1:96},(n,e)=>{const t=r=>ea(r,n,e),i=(r,a)=>{const o=t(r);return J(j(o,a,1.6),Dn.body,{stroke:C*1.5,inner:`<path d="${j(o.slice(-2),a*.5,1.4)}" fill="${Dn.patch}"/>`})};let s=i([[0,0],[-20,14],[-34,40],[-46,70],[-60,90]],12);return s+=i([[-6,4],[-20,30],[-24,58],[-34,84]],9),s+=i([[-2,2],[-30,12],[-50,30],[-64,44]],8),s})}function cf(n,e,t){return ta(n,{x0:-18,y0:-10,x1:18,y1:e+8},(i,s)=>J(j(ea([[0,-6],[2,e*.3],[1,e*.7],[0,e]],i,s),t,t*.42),Dn.body,{stroke:Hr,inner:os(i-2,s+e*.35,t*.3,e*.16,e),over:ue(`M${i-t*.3} ${s+e*.62}q${t*.25} ${e*.18} 0 ${e*.3}`,1.5,Dn.bodyLine)}),{far:!0})}function ff(n,e){return ta(n,{x0:-16,y0:-6,x1:20,y1:e+12},(t,i)=>{let s=J(j(ea([[0,0],[0,e*.55],[1,e-10]],t,i),10,7.5),Dn.body,{stroke:Hr*.9});s+=J(`M${t-10} ${i+e-8}L${t+9} ${i+e-9}L${t+15} ${i+e+2}L${t+14} ${i+e+8}L${t-11} ${i+e+8}L${t-12} ${i+e}Z`,Dn.hoof,{stroke:Hr*.9});const r=i+e-12;return s+=J(`M${t-8} ${r-5}L${t+8} ${r-6}L${t+9} ${r+4}L${t+6} ${r+1}L${t+3.5} ${r+6}L${t+1} ${r+1.5}L${t-2} ${r+6.5}L${t-4.5} ${r+1.5}L${t-7} ${r+5.5}L${t-9} ${r+1}Z`,Dn.cuff,{stroke:C*1.4}),s},{far:!0})}function Z3(){return[V3(),W3(),X3(),q3(),cf("horse.fu",44,30),ff("horse.fl",40),cf("horse.hu",48,36),ff("horse.hl",42)]}const Y3={id:"horse",joints:[{id:"root",parent:null,x:0,y:0,z:0},{id:"body",parent:"root",x:0,y:-118,part:"horse.body",z:50},{id:"tail",parent:"body",x:-98,y:6,part:"horse.tail",z:45},{id:"neck",parent:"body",x:78,y:8,part:"horse.neck",z:52},{id:"head",parent:"neck",x:46,y:-70,part:"horse.head",z:53},{id:"fuR",parent:"body",x:62,y:40,part:"horse.fu",side:"R",z:60},{id:"flR",parent:"fuR",x:0,y:44,part:"horse.fl",side:"R",z:61},{id:"huR",parent:"body",x:-60,y:34,part:"horse.hu",side:"R",z:60},{id:"hlR",parent:"huR",x:0,y:48,part:"horse.hl",side:"R",z:61},{id:"fuL",parent:"body",x:56,y:40,part:"horse.fu",side:"L",z:60},{id:"flL",parent:"fuL",x:0,y:44,part:"horse.fl",side:"L",z:61},{id:"huL",parent:"body",x:-54,y:34,part:"horse.hu",side:"L",z:60},{id:"hlL",parent:"huL",x:0,y:48,part:"horse.hl",side:"L",z:61}],attach:{saddle:{joint:"body",x:6,y:-6},muzzle:{joint:"head",x:74,y:42},hoofFR:{joint:"flR",x:0,y:44},hoofFL:{joint:"flL",x:0,y:44},hoofHR:{joint:"hlR",x:0,y:46},hoofHL:{joint:"hlL",x:0,y:46}},animations:["emerge","idle","gallop","jump","land","rear","kneel","dissolve"]},Ct=L.ink,wt=n=>Math.round(n*100)/100,K3=n=>n!==1?` opacity="${wt(n)}"`:"",Th=(n,e=1)=>re(n,e,!1),oe=(n,e,t,i=1)=>F(Th(n),e,t,i),en=(n,e,t,i,s=1)=>`<circle cx="${wt(n)}" cy="${wt(e)}" r="${wt(t)}" fill="${i}"${K3(s)}/>`,wn=(n,e,t,i,s,r=1)=>xe(ge(n,e,t,i),s,r),Zt=(n,e,t=1)=>xe(re(n),e,t),kr=(n,e,t)=>n.map(([i,s])=>[i+e,s+t]);function pa(n,e){const t=n[0][0]<=n[n.length-1][0]?n:[...n].reverse();if(e<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++){const s=t[i-1],r=t[i];if(e<=r[0])return s[1]+(r[1]-s[1])*(e-s[0])/(r[0]-s[0]||1)}return t[t.length-1][1]}function mt(n,e,t,i,s,r){const a=n.startsWith("whale")?r:uh(r);return{key:n,w:e,h:t,px:i,py:s,body:a,scale:Math.max(e,t)>320?1.5:2}}function Q3(n,e,t,i){const s=[];for(let r=0;r<t;r++){const a=r/t*Math.PI*2,o=i(a,r);s.push([n+Math.cos(a)*o,e+Math.sin(a)*o])}return s}const Nn={fill:"#4f6d8f",shade:"#3b5470",light:"#7f9dbe",groove:"#c7ccde"};function J3(){const n=[[417,80],[413,68],[399,59],[377,52],[352,47],[332,42],[303,36],[264,32],[222,33],[182,37],[143,44],[110,52],[80,59],[52,65],[32,68],[20,70],[15,74],[20,78],[34,81],[58,87],[94,97],[140,109],[190,117],[240,120],[290,118],[330,112],[364,103],[392,94],[410,87]],e=[[418,83],[380,89],[340,89],[300,95],[260,102],[220,108],[190,111]],t=[[418,83],[400,91],[380,98],[360,104],[340,109],[320,113.5],[300,116.5],[280,118],[260,119.5],[240,120],[220,119.5],[190,117.5]];let i="";[.14,.3,.46,.62,.78,.92].forEach((u,h)=>{const d=[],p=409-h*3,_=200+h*9;for(let m=p;m>=_;m-=16)d.push([m,pa(e,m)+u*(pa(t,m)-pa(e,m))]);i+=oe(d,Nn.groove,h===0?1.9:1.6,.78)});const r=new Vt(4210);let a="";for(let u=0;u<56;u++){const h=r.range(46,330),d=pa([[40,66],[120,48],[200,38],[280,36],[330,44]],h)+7,p=pa([[40,80],[120,95],[200,104],[280,100],[330,90]],h),_=r.range(d,p),m=r.range(1.2,3.4),g=r.chance(.62);a+=xe(ge(h,_,m*r.range(1.1,1.9),m),g?"#6f8bab":"#3f5a79",g?.6:.5)}`${Th([[8,75],[60,85],[120,99],[190,108],[260,111],[320,105],[372,95],[424,84]])}`;const o=oe([[333,66],[340,63.5],[350,63.5],[356,66.5]],Nn.shade,2.2)+wn(345,70,7.5,5.5,"#445f80")+wn(345.5,70.5,4.3,3.3,Ct)+en(346.8,69.4,1.2,"#c7ccde")+oe([[337,75],[345,77.5],[353,76]],Nn.shade,1.6,.9),c=a+oe([[300,41],[330,46],[362,52],[396,63]],Nn.light,2,.55)+oe([[314,44],[323,40],[333,41.5]],Nn.shade,2.4)+oe([[316,46.5],[324,43.5],[331,44.5]],Nn.light,1.3,.8)+oe([[70,73],[130,77.5],[190,81],[236,83]],Nn.shade,1.4,.35)+i+oe([[417,81],[398,85.5],[376,87.5],[356,86.5],[341,83.5],[334,80]],Ct,2.6)+oe([[334,80],[331,76.5]],Ct,2)+o,l=me(yt([[128,52],[117,45],[106,40],[99,38,1],[103,45],[101,56]]),{fill:Nn.fill,stroke:3}),f=me(re(n,.95),{fill:Nn.fill,stroke:4,over:c});return mt("whale.body",420,150,210,75,l+f)}function j3(){return mt("whale.fin",120,60,108,12,me(re([[113,5],[99,8],[78,15],[55,25],[34,37],[18,47],[9,54],[17,55.5],[35,50],[58,42],[81,33],[100,25],[113,19],[118,12]],.9),{fill:Nn.fill,stroke:3,over:oe([[106,13],[82,21],[56,32],[30,44]],Nn.shade,1.5,.8)+oe([[16,52.5],[34,48],[56,40.5]],Nn.groove,1.5,.65)+oe([[70,22],[66,24.5]],Nn.light,1.4,.8)+oe([[48,31],[44,33.5]],Nn.light,1.4,.8)}))}function e4(){const n=[[109,58.5],[96,56],[80,50],[62,38],[44,24],[26,12],[10,6,1],[16,17],[22,31],[30,45],[38,55],[45,60.5,1],[38,66],[30,76],[22,90],[16,104],[10,114,1],[26,108],[44,96],[62,82],[80,70],[96,64.5],[109,62.5]];ve([[0,62],[60,66],[112,63.5],[112,122],[0,122]]);const e=oe([[98,59],[70,46],[44,30],[22,13]],Nn.light,1.6,.8)+oe([[96,61],[70,60.5],[50,60.5]],Nn.shade,1.6,.9)+oe([[34,30],[40,34]],Nn.groove,1.4,.7)+oe([[27,40],[31,44]],Nn.groove,1.3,.6)+oe([[30,88],[36,84]],Nn.groove,1.3,.45);return mt("whale.fluke",110,120,100,60,me(yt(n),{fill:Nn.fill,stroke:3.2,over:e}))}const ls={fill:L.sparrow,shade:L.sparrowDark,light:L.sparrowLight,throat:"#e8dcca",bib:"#33251f",edge:"#f2c69c"};function Lc(n,e,t,i,s,r,a){const o=-Math.cos(r),c=Math.sin(r),l=Math.sin(r),f=Math.cos(r),u=m=>m.map(([g,b])=>[n+o*g*t+l*b*i,e+c*g*t+f*b*i]),h=[];for(let m=0;m<s;m++){const g=s>1?m/(s-1):0,b=1-.36*g,E=-.2+.3*g,v=-.1+.72*g;h.push({path:[[.24,E],[.24+(b-.24)*.55,(E+v)/2+.03],[b,v]],len:b,vt:v})}const d=[[.02,-.3],[.5,-.36],[.9,-.22]];for(const m of h)d.push([m.len-.06,m.vt+.02]);d.push([.36,.6],[.14,.42],[0,.2]);let p=me(re(u(d),.8),{fill:a.featherShade,stroke:a.stroke});for(const m of h)p+=me(j(u(m.path),i*.46,i*.3),{fill:a.feather,shade:a.featherShade,stroke:a.featherStroke}),p+=oe(u(m.path.slice(1).map(([g,b])=>[g,b-.12])),a.edge,Math.max(.7,i*.06),.85);return p+=me(re(u([[-.02,-.3],[.12,-.42],[.3,-.44],[.48,-.34],[.58,-.16],[.54,.02],[.42,.14],[.26,.26],[.1,.3],[-.03,.14]])),{fill:a.covert,shade:a.covertShade,light:a.covertLight,stroke:a.stroke,over:oe(u([[.2,-.12],[.3,.04]]),a.covertShade,Math.max(.7,i*.06))+oe(u([[.34,-.18],[.44,-.02]]),a.covertShade,Math.max(.7,i*.06))}),a.bar&&(p+=oe(u([[.06,.24],[.24,.2],[.42,.08],[.53,-.06]]),a.bar,Math.max(1,i*.1))),p+=oe(u([[.03,-.31],[.2,-.39],[.4,-.35]]),a.covertLight,Math.max(.8,i*.07),.9),p}function t4(){const n=oe([[29,34],[28,40.5]],"#5a4535",1.8)+oe([[25.5,41.5],[28,40.5],[31,41.8]],"#5a4535",1.4)+oe([[34,34],[34.5,40.5]],"#5a4535",1.8)+oe([[32,41.8],[34.5,40.5],[37.5,41.8]],"#5a4535",1.4),e=me(yt([[19,20.5],[11,17.5],[2.5,16.5,1],[5,20.5],[2,23.5,1],[6.5,26],[19,28.5]]),{fill:ls.shade,stroke:2.2,over:oe([[17,22.5],[9,20.5],[4,20.5]],ls.edge,1,.8)+oe([[17,25.5],[8,24.5]],"#4a3423",1)}),t=[[14,25],[17,18],[24,13.5],[32,11.5],[38,8.5],[42,4.5],[48,3],[52.5,5],[55,9],[54.8,13],[52.5,18],[50.5,24],[46.5,30],[40,34.5],[31,36],[23,34.5],[17,31]],i=Zt([[40,7],[44,3.6],[49,2.8],[53,5],[52,7.4],[47,6.4],[42,8.8]],"#6c6264")+Zt([[43,9.8],[49,10.2],[53.5,12.5],[55.5,15],[52.5,19.5],[48,22.5],[44.5,17.5]],ls.throat)+Zt([[51,14.5],[54.2,14.2],[53.5,19],[50.5,24.5],[47.2,22.5],[48.3,18]],ls.bib)+Zt([[37,9.5],[42,8.6],[47,9.2],[44.5,11],[39,11.8]],"#7a4a2c")+Zt([[45,24],[49,25.5],[45,32],[37,35.5],[30,36],[33,31],[40,28]],"#c7ae8c")+oe([[21,18.5],[27,15.5]],"#4a3322",1.3)+oe([[25,21.5],[31,18]],"#4a3322",1.3)+oe([[33,15],[37,13]],"#4a3322",1.2)+en(49.8,8.7,1.7,Ct)+en(50.4,8.1,.55,"#f4ead8"),s=me(re(t),{fill:ls.fill,stroke:2.4,over:i}),r=me(yt([[54,8.4],[59.4,11,1],[54,13.6]]),{fill:"#4a3a30",stroke:1.6});return mt("sparrow.body",60,46,30,34,n+e+s+r)}function n4(){const n=Lc(38,8,33,15,5,.2,{covert:"#7d5536",covertShade:ls.shade,covertLight:ls.light,feather:"#5e4230",featherShade:"#45301f",edge:ls.edge,bar:ls.throat,stroke:2,featherStroke:1.05});return mt("sparrow.wing",46,28,38,8,n)}function i4(){const n={fill:L.ivory,shade:L.ivoryDark,light:"#f7f0e4"},e=me(yt([[11.4,13.6],[5.4,13.8],[1.6,15.2,1],[4.2,17],[2.4,19.6,1],[6.8,19.2],[12,17.4]]),{fill:L.ivoryDark,stroke:1.6,over:oe([[10,16.2],[4,16.9]],L.violetDark,.9,.8)}),t=[[8,15],[10.5,10.4],[15,7.6],[20.5,6.4],[23.5,3.2],[28,1.9],[32,3.4],[34,7.2],[33.2,11.2],[30.4,14.8],[28.2,19],[23.4,22.4],[16.4,23.3],[10.8,21]],i=Zt([[22.2,5.4],[25,2.2],[29.5,1.4],[33,3.6],[34.4,6.4],[30.6,5.2],[26.2,5.6],[23.6,7.2]],L.violet),s=Zt([[27,5.3],[31,4.9],[34.4,6.4],[33.6,7.4],[30.2,6.6]],L.violetDark),r=i+s+oe([[24.2,3.6],[28.5,2.6]],L.vein,1,.9)+Zt([[25,16],[29.5,14],[29,18.5],[24,21.6],[18,22.6],[21,19]],"#f6efe3")+en(29.3,7.6,1.35,Ct)+en(29.7,7.2,.45,"#ffffff"),a=me(re(t),{...n,stroke:2,over:r}),o=me(yt([[33.2,6.3],[36.2,8.6,1],[33.2,10.6]]),{fill:L.crystalOrange,stroke:1.4});return mt("bird.a",36,26,18,14,e+a+o)}function s4(){const n=Lc(24,6,18.5,9,4,.22,{covert:L.ivory,covertShade:L.ivoryDark,covertLight:"#f7f0e4",feather:Ut(L.ivoryDark,L.violet,.28),featherShade:Ut(L.ivoryDark,L.violetDark,.45),edge:"#f7f0e4",stroke:1.6,featherStroke:.9});return mt("bird.a.wing",30,18,24,6,n)}function r4(){const n={fill:L.crystalBlue,shade:L.crystalBlueDark,light:L.crystalBlueLight},e=o=>me(j(o,4.2,.9),{fill:L.crystalBlueDark,stroke:1.6}),t=e([[14,11],[8,7.8],[1.8,4.6]])+e([[14,13.4],[8,16.4],[2.4,20.2]]),i=[[10.5,12.2],[14.5,9.2],[20.5,7.8],[26.5,6.6],[30.5,4.6],[34.4,4.4],[37.4,6.6],[38.2,9.6],[36.4,12],[32.4,14],[26.4,15.9],[18.6,16.2],[12.6,14.8]],s=Zt([[13,14.2],[20,13.6],[28,12.6],[33.6,12.2],[31.4,14.4],[25.6,16.6],[17.6,16.8]],L.ivory)+Zt([[34.4,9.8],[38.6,9.8],[36.4,12.6],[33,12.8]],L.crystalOrange)+oe([[18,9.4],[27,8]],L.crystalBlueLight,1,.9)+en(35,7.6,1.15,Ct)+en(35.4,7.2,.4,"#ffffff"),r=me(re(i),{...n,stroke:2,over:s}),a=me(yt([[37.6,7.9],[40,9.2,1],[37.6,10.3]]),{fill:"#2b2840",stroke:1.2});return mt("bird.b",40,24,20,13,t+r+a)}function a4(){const n=Lc(28,5,25,7.4,4,.14,{covert:L.crystalBlue,covertShade:L.crystalBlueDark,covertLight:L.crystalBlueLight,feather:"#3f6aa6",featherShade:"#2e5285",edge:L.crystalBlueLight,stroke:1.6,featherStroke:.9});return mt("bird.b.wing",34,16,28,5,n)}function o4(){const n={fill:L.crystalOrange,shade:L.crystalOrangeDark,light:L.crystalOrangeLight},e=(c,l,f,u,h)=>{const d=[c+u*f,l-f],p=[c-h,l],_=[c+h,l],m=[c+u*f*.3+h*.15,l-f*.3];return xe(ve([p,d,_]),L.crystalTeal)+xe(ve([d,_,m]),L.crystalTealDark)+xe(ve([p,d,[p[0]+h*.55,l]]),L.crystalTealLight)+F(ve([p,d,_],!1),Ct,1)},t=ot(22.6,5,6.5,L.crystalTealLight,.35)+e(19.2,8.4,6.6,-.45,2.3)+e(26.2,8.2,6,.42,2.1)+e(22.7,7.6,7,.03,2.6),i=[[6.6,19.6],[6.4,14.8],[8.9,11.8],[12.6,10.8],[15.6,9.2],[17.4,6.8],[21,5.4],[25.4,5.6],[28.4,8],[29.6,11.2],[28.3,14.2],[27.4,17],[26.2,20.4],[22.6,24],[16.8,25.8],[11.2,24.8],[8,22.8]],s=Zt([[26.6,16.4],[26.8,20.4],[22.8,23.8],[16.8,25.4],[18.6,21.6],[23.2,19]],L.crystalOrangeLight)+oe([[8.9,12.4],[7.6,11.2]],L.crystalOrangeDark,1)+oe([[11.8,11.4],[11.2,9.8]],L.crystalOrangeDark,1)+oe([[21,24],[21.8,25.8]],L.crystalOrangeDark,1)+wn(24.9,10.6,2.1,2.3,Ct)+en(25.5,9.8,.75,"#ffffff")+oe([[22.2,8],[24.2,7.3]],L.crystalOrangeDark,.9,.9),r=me(re(i),{...n,stroke:2,over:s}),a=me(yt([[28.6,10.4],[32.6,11.9,1],[28.4,13]]),{fill:"#e8c16a",stroke:1.2})+me(yt([[28.6,12.8],[31.4,13.3,1],[28.2,14.5]]),{fill:"#d9a653",stroke:1.1}),o=oe([[13.6,25.4],[13,26.9]],"#c77f4a",1.2)+oe([[18.4,25.6],[18.8,26.9]],"#c77f4a",1.2);return mt("bird.c",34,28,17,15,o+r+t+a)}function l4(){const n=[[21.4,3.2],[15,3],[9,4.8],[4.8,7.6],[2.6,11,1],[5.8,11.2],[7,13.6,1],[9.8,12],[12,13.8,1],[14.6,11.8],[18.4,9.8],[21.8,6.6]],e=oe([[13,7.4],[7,13.6]],L.crystalOrangeDark,.9)+oe([[16,8],[12,13.8]],L.crystalOrangeDark,.9)+oe([[18.6,5],[11,5.2]],L.crystalOrangeLight,1,.95)+en(6,9.4,1.1,L.crystalTeal,.95);return mt("bird.c.wing",24,16,19,5,me(yt(n),{fill:"#cc8752",stroke:1.7,over:e}))}const Eh={fill:"#8fa6bf",shade:"#62799a",light:"#cfdceb",belly:"#b9c8d9",fin:"#7f97b3",finShade:"#5d7592",finLight:"#b9c9dc"},wh={fill:L.crystalTeal,shade:L.crystalTealDark,light:L.crystalTealLight,belly:"#bfe9e1",fin:"#3fa394",finShade:"#2c7a6f",finLight:L.crystalTealLight},Ah={fill:L.crystalOrange,shade:L.crystalOrangeDark,belly:"#f2cfa6",fin:L.violet,finShade:L.violetDark,finLight:"#b98ae6"},nr=(n,e,t=1.5,i="")=>me(yt(n),{fill:e.fin,shade:e.finShade,light:e.finLight,stroke:t,over:i}),Us=(n,e,t,i=.8,s=.85)=>e.map(r=>F(`M${wt(n[0])} ${wt(n[1])}L${wt(r[0])} ${wt(r[1])}`,t,i,s)).join("");function Rh(n,e,t,i,s,r,a,o,c){let l="",f=0;for(let u=t;u<=i;u+=r,f++)for(let h=n+f%2*(s/2);h<=e;h+=s)l+=`M${wt(h)} ${wt(u-a)}q${wt(-a*1.1)} ${wt(a)} 0 ${wt(a*2)}`;return F(l,o,.8,c)}function c4(){const n=Eh,e=nr([[15,8],[19,2.6,1],[26,1.6],[32,3.4],[35,6.2]],n,1.5,Us([25,8],[[19,3],[23,2],[27,2],[31,3.6]],n.finShade)),t=nr([[12,16.4],[14,21,1],[18,18.6]],n,1.3)+nr([[22,18.6],[24.5,22.6,1],[28.5,19]],n,1.3),i=[[3.8,12],[8,9.8],[14,7.2],[20,5.2],[28,4.2],[35,5],[41,7],[45,9.4],[46.6,12],[45,14.6],[40,17.2],[33,19.2],[25,19.8],[17,18.2],[11,16.2],[6.4,14.4]],s=Zt([[8,14],[16,15],[26,15.6],[36,15.2],[44,13.8],[40,17.6],[30,20.6],[18,19.4]],n.belly)+Rh(12,33,8,16,4,2.8,1.3,n.shade,.55)+oe([[8,11.4],[18,10.4],[30,10],[35,10.4]],n.light,.9,.8)+oe([[35.6,5.8],[33.8,10.5],[35.4,16.2]],n.shade,1.3)+wn(39.4,9.6,2.3,2.3,"#e6edf4")+en(39.8,9.7,1.35,Ct)+en(39.2,9,.45,"#ffffff")+oe([[45.4,12.4],[46.8,12.6]],Ct,.9),r=me(re(i),{fill:n.fill,stroke:2,over:s}),a=me(yt([[33.6,13.6],[28.4,14.2],[26.4,15.8,1],[28.6,16.8],[33,15.4]]),{fill:n.finLight,stroke:1,ink:n.finShade,over:Us([33,14.4],[[27.4,15],[27.8,16.4]],n.finShade,.6,.8)}),o=oe([[45,13.6],[46.2,15.6],[44.6,17.4]],Ct,.9);return mt("fish.a",48,24,26,12,e+t+r+a+o)}function f4(){const n=Eh,e=[[19.5,9],[13,7.6],[8,4.6],[2.5,2,1],[4.2,6.6],[7.4,11,1],[4.2,15.4],[2.5,20,1],[8,17.4],[13,14.4],[19.5,13]],t=Us([17,11],[[4,3],[6,6.5],[8,9.5],[8,12.5],[6,15.5],[4,19]],n.finShade,.8,.9)+oe([[16,9.6],[10,7],[4.4,3.4]],n.finLight,.9,.9);return mt("fish.a.tail",20,22,18,11,me(yt(e),{fill:n.fin,stroke:1.6,over:t}))}function h4(){const n=wh,e=nr([[20,6.4],[24,2.6,1],[30,3.4],[32,6]],n,1.3),t=nr([[16,13.4],[19,17,1],[23,14]],n,1.2),i=[[3,10],[8,8.4],[15,6.8],[24,5.8],[32,5.8],[38,6.8],[42,8.5],[43.6,10],[42,11.6],[37,13.3],[30,14.4],[22,14.4],[14,13.4],[8,12],[4,10.8]],s=Zt([[8,11.4],[16,11.4],[26,11.6],[36,11.4],[42,10.8],[37,13.6],[28,15],[16,14.2]],n.belly)+oe([[6,10],[16,9.6],[28,9.4],[36,9.4]],"#2f6f67",1.3,.9)+oe([[10,8.2],[22,7],[32,7]],n.light,.9,.9)+oe([[34.4,6.6],[33.2,9.6],[34.2,12.6]],n.shade,1.1)+wn(38.2,8.8,1.9,1.9,"#e9f7f4")+en(38.5,8.9,1.1,Ct)+en(38,8.3,.4,"#ffffff"),r=me(re(i),{fill:n.fill,stroke:1.9,over:s}),a=me(yt([[32.6,11.4],[28.4,11.8],[26.6,13.2,1],[28.6,13.8],[32.2,12.8]]),{fill:n.finLight,stroke:.9,ink:n.finShade});return mt("fish.b",44,20,24,10,e+t+r+a)}function u4(){const n=wh,e=[[17.4,8],[12,6.4],[7,3.6],[2,1.6,1],[4.8,6],[8,9,1],[4.8,12],[2,16.4,1],[7,14.4],[12,11.6],[17.4,10]],t=Us([15.5,9],[[3.5,2.6],[6,6],[6,12],[3.5,15.4]],n.finShade,.8,.9)+oe([[14,7.6],[8,5],[3.6,2.6]],n.finLight,.9,.9);return mt("fish.b.tail",18,18,16,9,me(yt(e),{fill:n.fin,stroke:1.5,over:t}))}function d4(){const n=Ah,e=nr([[11,8.4],[14.4,2.6,1],[21.6,1.6],[28,3.4],[30.6,6.6]],n,1.4,Us([21,8],[[15,3],[19,2],[23,2.2],[27,3.6]],n.finShade)),t=nr([[13,20.6],[15,26,1],[21,25.6],[24,22.4]],n,1.3,Us([18,21],[[15.6,25],[19,25.4]],n.finShade)),i=[[4,14],[7.6,10.8],[12.6,7.4],[19,5.2],[26,5],[32,7],[36.2,10.2],[38.2,13.6],[37.2,17.2],[33.4,20.6],[27.4,23.2],[20,23.6],[13,21.6],[8,18.2],[4.8,15.6]],s=Zt([[10,17],[18,18.4],[28,18.2],[36,16.4],[33.6,20.8],[26,24],[16,23.6]],n.belly)+Rh(13,29,9,17,4.2,3,1.4,n.shade,.5)+oe([[32.2,7.8],[30.2,13],[32,18.6]],n.shade,1.3)+wn(32.4,11.2,2.6,2.6,"#fbe9d3")+en(32.8,11.3,1.55,Ct)+en(32.1,10.5,.5,"#ffffff")+oe([[37.6,14.2],[36,15]],Ct,.9),r=me(re(i),{fill:n.fill,stroke:2,over:s}),a=me(yt([[28.4,14.6],[22.8,15.4],[20.6,17.4,1],[23.2,18.4],[27.8,16.8]]),{fill:n.finLight,stroke:1,ink:n.finShade,over:Us([27.8,15.6],[[21.8,16.4],[22.4,17.8]],n.finShade,.6,.8)});return mt("fish.c",40,28,22,14,e+t+r+a)}function p4(){const n=Ah,e=[[17.4,9.6],[12,7.2],[6.4,3.4],[2,2.6,1],[1.2,7.6],[3,11],[1.2,14.4],[2,19.4,1],[6.4,18.6],[12,14.8],[17.4,12.4]],t=Us([15.5,11],[[3,3.6],[2.4,7.6],[3.4,11],[2.4,14.4],[3,18.4]],n.finShade,.8,.9)+oe([[14,9],[8,5.6],[3.4,3.6]],n.finLight,.9,.9);return mt("fish.c.tail",18,22,16,11,me(yt(e),{fill:n.fin,stroke:1.5,over:t}))}const Kt={fill:L.raccoon,shade:L.raccoonDark,light:L.raccoonLight,mask:"#2c2a35",white:"#e9e6ee",paw:"#3a3844",ring:"#3d3a47",tail:"#a4a1ab",chest:"#99969f"};function m4(n,e,t,i,s,r=1){const a=[];let o=0;for(let l=1;l<n.length;l++){const f=Math.hypot(n[l][0]-n[l-1][0],n[l][1]-n[l-1][1]);a.push(f),o+=f}let c="";for(const l of e){let f=l*o,u=0;for(;u<a.length-1&&f>a[u];)f-=a[u],u++;const h=n[u],d=n[u+1],p=a[u]||1,_=(d[0]-h[0])/p,m=(d[1]-h[1])/p,g=h[0]+_*f,b=h[1]+m*f;c+=`M${wt(g-m*t)} ${wt(b+_*t)}L${wt(g+m*t)} ${wt(b-_*t)}`}return F(c,i,s,r)}function Lh(n,e,t){const i=n[n.length-1],s=n[n.length-2],r=Math.hypot(i[0]-s[0],i[1]-s[1])||1,a=[i[0]+(i[0]-s[0])/r*t*.25,i[1]+(i[1]-s[1])/r*t*.25];return me(j(n,e,t),{fill:Kt.tail,stroke:2.4,over:m4(n,[.2,.42,.63,.82],e,Kt.ring,e*.3)+wn(a[0],a[1],t*.75,t*.75,Kt.ring)})}function Ch(n){const e=(r,a)=>{const o=(r[0][0]+r[1][0]+r[2][0])/3,c=(r[0][1]+r[1][1]+r[2][1])/3,l=r.map(([f,u])=>[o+(f-o)*.55,c+(u-c)*.55+.8]);return me(re(r,.6),{fill:a?"#c9c6cf":"#dddae3",stroke:2.2,over:Zt(l,a?"#3a3844":"#4a4754")})},[t,i]=n.eye,s=Zt(n.cheek,"#d3d0d9")+Zt(n.mask,Kt.mask)+Zt(n.brow,Kt.white)+Zt(n.muzzle,Kt.white)+oe(n.stripe,"#4a4754",2)+wn(t,i,2.4,2.4,"#6e6b78")+wn(t,i,1.9,1.9,"#15131f")+en(t+.7,i-.8,.75,"#e6e9f3")+wn(n.nose[0],n.nose[1],2.3,1.8,Ct)+en(n.nose[0]-.6,n.nose[1]-.6,.55,"#8d8a98")+oe(n.mouth,Ct,1.1)+en(n.nose[0]-6.2,n.nose[1]+1.6,.5,"#8a8794")+en(n.nose[0]-5,n.nose[1]+3,.5,"#8a8794")+en(n.nose[0]-7.4,n.nose[1]+3.2,.5,"#8a8794");return e(n.earFar,!0)+e(n.earNear,!1)+me(re(n.outline),{fill:Kt.fill,stroke:2.6,over:s})}function g4(){let n=Lh([[25,75.5],[15.5,79.2],[7.5,78],[3.8,71.5],[5,63.5]],12.5,8);return n+=me(re([[20,81],[15.5,73],[15,63],[18.5,53],[25,45],[32,39],[40,36.5],[47,39],[51,45.5],[52.5,53],[50.5,61],[50.5,68.5],[53,76],[51,81.8],[40,82.4],[28,82.4]]),{fill:Kt.fill,stroke:2.8,over:Zt([[46.5,43.5],[51,48],[52.4,56],[50.4,64],[47.2,58.5],[45.4,50.5]],Kt.chest)+oe([[22.5,53],[25.5,49.5]],Kt.shade,1.2)+oe([[19.5,60],[22,56.5]],Kt.shade,1.2)+oe([[29,44.5],[32,42]],Kt.light,1.1,.9)}),n+=Zt([[26,70],[29,62.6],[36,59.6],[43,61],[47.6,66.4],[47.8,73],[43.6,78.4],[33,80],[27,77.4]],"#8a8792"),n+=Zt([[38,76.6],[44.6,72.6],[47.8,73],[46.6,77.6],[42,80.2]],Kt.shade),n+=oe([[27.4,69],[30.4,62.6],[37,59.8],[43.4,61.2],[47.4,65.8]],Ct,2),n+=oe([[31,63.4],[36.6,61.4]],Kt.light,1.2,.9),n+=me(re([[42.4,77.2],[50,76.4],[57.6,77.8],[61.4,80.2],[59.4,82.4],[44,82.6]],.8),{fill:Kt.paw,stroke:2.2,over:oe([[56.4,79.2],[57.2,82.4]],"#1f1d27",.9)+oe([[53,79.4],[53.6,82.4]],"#1f1d27",.9)}),n+=me(j([[46,43.4],[52.8,45.8],[57.6,45.4]],6.4,5),{fill:Kt.shade,stroke:2.2}),n+=me(ge(59.4,45.2,3.3,2.9),{fill:Kt.paw,stroke:1.8}),n+=Ch({outline:[[33,26],[33.5,17.5],[37.5,11],[44.5,7.6],[51.5,9.2],[56,14],[61,18.5],[65.5,22.5],[65,27],[59,30],[51,33],[42.5,34],[36.5,31.5]],earFar:[[33.6,14.2],[34.6,4.4],[41,9.6]],earNear:[[42,9.2],[46.6,1.8],[50.6,8.6]],mask:[[39.5,18.5],[45.5,15.8],[53,15.3],[58.5,18.6],[56.6,22.8],[50.5,24.2],[44.6,27.2],[39,25.2]],brow:[[42.6,13.8],[49.5,11.6],[56.6,14.4],[56,16.2],[49.6,14.6],[44,16]],muzzle:[[54.8,21.6],[60,20.2],[64.6,23],[64.4,27.4],[58.6,29.6],[53.2,28],[52,24.6]],cheek:[[39.6,26.4],[45,27.2],[49.6,29.6],[44.4,32.8],[38.8,30.6]],stripe:[[49.6,9.6],[52.6,13.4],[56.2,17.8]],eye:[53.2,19.4],nose:[64.8,23.6],mouth:[[63.8,27],[61.2,28.2],[58.8,27.8]]}),n+=me(j([[41.6,44],[48.4,49.4],[54.2,50.8]],8,6),{fill:Kt.fill,stroke:2.4}),n+=me(re([[53.4,48.6],[57,47.6],[59.8,49.6],[59.4,52.8],[55.6,53.8],[53,52]]),{fill:Kt.paw,stroke:1.9,over:oe([[57.2,49.2],[58.6,52.6]],"#1f1d27",.8)+oe([[55.4,49.4],[56.2,53.2]],"#1f1d27",.8)}),mt("raccoon.sit",74,84,37,84,n)}function _4(){const n=(i,s,r,a)=>me(j(i,s,r),{fill:a?Kt.shade:Kt.fill,stroke:2.4,over:xe(`M0 ${wt(i[i.length-1][1]-5)}H96V62H0Z`,Kt.paw)}),e=(i,s)=>me(ge(i,57.9,4.6,2.4),{fill:s?"#2f2d38":Kt.paw,stroke:2});let t="";return t+=n([[33.4,41],[34.2,49],[35,56.2]],7.8,6,!0)+e(38,!0),t+=n([[53.8,41],[54.8,49],[55.8,56.2]],7.6,5.6,!0)+e(58.8,!0),t+=Lh([[17,26],[10,22],[4.8,23.8],[4.2,30.4]],11.5,7.4),t+=me(re([[12,31],[16,22.4],[26,17.2],[38,17.4],[50,21.6],[60,27],[66.4,33.4],[65.4,41],[57,45.6],[45,46.6],[33,45.8],[21,44.6],[14,39.6]]),{fill:Kt.fill,stroke:2.8,over:Zt([[26,42.6],[38,42],[50,41.6],[61,39.6],[58,46],[44,47.6],[30,46.6]],Kt.chest)+oe([[27,20.4],[31,19]],Kt.light,1.1,.9)+oe([[40,21.4],[44,22]],Kt.shade,1.1)+oe([[48,26.4],[52,28.2]],Kt.shade,1.1)}),t+=Zt([[18,34.6],[21.6,27.6],[29.6,26],[36.4,30.6],[37,38.4],[33,44.4],[24,44.6],[19.4,40.6]],"#8a8792"),t+=Zt([[29,43],[35.6,37.6],[37,38.4],[34.4,44],[30,45]],Kt.shade),t+=oe([[18.6,33.4],[22,27.8],[29.6,26.2],[35.6,29.8]],Ct,2),t+=n([[29.4,41.6],[29,49],[30,56.2]],8.4,6.4,!1)+e(33,!1),t+=n([[59.6,39.6],[60.8,48.4],[61.8,56.2]],8.4,6,!1)+e(64.8,!1),t+=Ch({outline:[[61,34],[61.6,26],[65.6,20],[71.6,17],[78,16],[84,14.6],[89,13.2],[92.8,15],[91.6,18.8],[86.6,22.6],[81,28.4],[73,33.6],[66,35.6]],earFar:[[63,21.2],[63.2,12.8],[69,17]],earNear:[[67.2,17.8],[70.4,10],[75,16.2]],mask:[[66.8,23.6],[72.4,19.8],[79.6,18.2],[84.2,19.4],[83,23.4],[77.2,25.2],[71.6,29],[66.4,28]],brow:[[69.4,18.6],[75.4,15.8],[81.8,15.8],[80.6,17.6],[75,17.6],[70.6,20.2]],muzzle:[[82.6,19.4],[87.4,16.4],[92.2,15.8],[91,19],[86.2,23],[81.6,24.6],[80.8,22]],cheek:[[66.6,29],[71,29.8],[74.6,31.6],[70.4,34.4],[65.4,33.4]],stripe:[[76.4,15.8],[80.6,17.4],[84.4,19.4]],eye:[79.4,20.8],nose:[92.4,14.8],mouth:[[90.6,18.4],[88,20.8],[85.6,21.6]]}),t+=oe([[94.2,9.6],[95.2,7.8]],"#c7ccde",.9,.8)+oe([[94.8,12.4],[95.6,11.6]],"#c7ccde",.9,.6),mt("raccoon.sniff",96,62,48,62,t)}function M4(){const n="#1f2340";let e="";e+=xe(j([[51,56.5],[60,55],[65.6,48.6],[65.4,40]],11.6,7),n),e+=F("M56.4 50.6L57.2 60.4M62.6 48L68 52.8M61.8 42.4L68.8 41.8","#272c4d",2.6,.9),e+=xe(re([[12.6,59.5],[13,47],[17,38],[24,32.4],[34,30.6],[44,32],[51,37.6],[55.4,46],[56.6,59.5]]),n),e+=xe(re([[21.6,14],[22.6,7],[25.6,4.6],[29.4,6],[31.2,10.4]],.9),n)+xe(re([[36.6,10],[38.6,4.6],[42.4,3.6],[45,6.4],[45.8,11.6]],.9),n),e+=xe(ve([[22.6,20],[17.4,25.4],[23.4,25.2],[19.8,29.6],[27,27.4]]),n),e+=xe(re([[21,23],[22,15.5],[27,10.6],[34,9],[41,9.6],[46,12.6],[50.6,16],[55,19.4],[55.6,21.8],[52.4,23.8],[46,27.2],[38,29.6],[29,29]]),n);for(const[t,i]of[[34.6,17.8],[44.2,17]])e+=ot(t,i,5.5,"#9fb0ff",.28),e+=xe(ge(t,i,2.1,1.35),"#cfd8ff",.72),e+=en(t+.5,i-.3,.55,"#ffffff",.8);return mt("raccoon.shadow",70,60,35,60,e)}function Ph(n,e,t,i,s,r){const a=n+t*i,o=e+t*s,c=t*r,l=Math.hypot(a-n,o-e),f=Math.atan2(o-e,a-n),u=Math.acos((t*t+l*l-c*c)/(2*t*l)),h=Math.acos((c*c+l*l-t*t)/(2*c*l)),d=[],p=40;for(let _=0;_<=p;_++){const m=f+u+_/p*(2*Math.PI-2*u);d.push([n+Math.cos(m)*t,e+Math.sin(m)*t])}for(let _=1;_<p;_++){const m=f+Math.PI+h-_/p*2*h;d.push([a+Math.cos(m)*c,o+Math.sin(m)*c])}return ve(d)}function v4(n,e,t,i){const s=`M${wt(n)} ${wt(e)}C${wt(n+t*.2)} ${wt(e+t*.5)} ${wt(n+t*.55)} ${wt(e+t*.8)} ${wt(n+t*.5)} ${wt(e+t*1.15)}C${wt(n+t*.45)} ${wt(e+t*1.5)} ${wt(n-t*.45)} ${wt(e+t*1.5)} ${wt(n-t*.5)} ${wt(e+t*1.15)}C${wt(n-t*.55)} ${wt(e+t*.8)} ${wt(n-t*.2)} ${wt(e+t*.5)} ${wt(n)} ${wt(e)}Z`;return me(s,{fill:i,stroke:1.5})}function Cl(n,e,t,i,s=0){const r=[];for(let a=0;a<10;a++){const o=s-Math.PI/2+a*Math.PI/5,c=a%2?t*.45:t;r.push([n+Math.cos(o)*c,e+Math.sin(o)*c])}return me(ve(r),{fill:i,stroke:1.4})}const Ls={fill:"#c6dbe6",mark:"#9fb9c8",eye:"#f39ac0",eyeDeep:"#e27aa8",blush:"#f4c1d6"};function x4(){const n=Ph(130,130,112,.55,-.1,.86);let e="";e+=wn(58,160,14,8,Ls.blush,.9),e+=oe([[40,196],[52,204],[66,206]],Ls.mark,1.4),e+=oe([[34,110],[36,126]],Ls.mark,1.3)+oe([[98,222],[112,226]],Ls.mark,1.3);let t=me(n,{fill:Ls.fill,over:e});return t+=Cl(196,150,11,ye.butter,.2)+Cl(226,196,8,ye.mint,-.3)+Cl(176,206,7,ye.pink,.4),mt("moon.baby",260,260,130,130,t)}function y4(){const n=ge(28,22,23,16),e=xe("M3 22Q6 4 28 5Q50 4 53 22Q40 13 28 13Q15 13 3 22Z",Ct)+wn(20,25,3,2.2,"#ffffff",.9);let t=me(n,{fill:Ls.eye,inner:e,stroke:1.8});return t+=oe([[10,33],[28,38],[46,33]],Ls.eyeDeep,1.2,.8),mt("moon.baby.eye",56,44,28,22,t)}function S4(){let e=me("M3 22Q6 4 28 4Q50 4 53 22Q40 30 28 30Q16 30 3 22Z",{fill:Ls.fill,stroke:1.8});e+=oe([[6,24],[28,31],[50,24]],Ct,1.8);for(const t of[14,22,30,38,44])e+=oe([[t,29],[t-1,34]],Ct,1.2);return mt("moon.baby.lid",56,44,28,22,e)}function b4(){let n=oe([[6,10],[16,13],[26,11]],Ct,1.8);return n+=oe([[3,8],[6,10]],Ct,1.2),mt("moon.baby.mouth",32,20,16,10,n)}const Ds={fill:"#b3b3e0",mark:"#8f8fc6",iris:"#9fd6a3",tear:"#9ed7ea",tearDeep:"#7cc0dc"};function T4(){const n=Ph(150,150,132,.5,-.12,.84);let e="";for(const[s,r,a,o]of[[34,150,36,170],[50,220,62,232],[48,92,58,80],[96,262,112,266]])e+=oe([[s,r],[a,o]],Ds.mark,1.4);let t=me(n,{fill:Ds.fill,over:e});return[[64,146,10],[52,162,11],[76,166,10],[62,184,12],[46,196,9],[80,198,11],[58,218,12],[78,232,10],[64,250,10],[82,266,8]].forEach(([s,r,a],o)=>{t+=v4(s,r,a,o%3===0?Ds.tearDeep:Ds.tear)}),mt("moon.old",300,300,150,150,t)}function E4(){const n="M4 22Q18 6 32 6Q48 6 60 22Q46 36 32 36Q16 36 4 22Z",e=wn(34,24,8.5,9,Ds.iris)+wn(35,25,4,4.4,Ct)+xe("M2 22Q16 2 32 3Q50 3 62 22Q48 14 32 14Q16 14 2 22Z",Ct)+en(31,21,1.6,"#ffffff",.9);let t=me(n,{fill:"#eef3f0",inner:e,stroke:1.8});return t+=oe([[10,34],[32,40],[54,34]],Ds.mark,1.2),mt("moon.old.eye",64,44,32,22,t)}function w4(){let e=me("M3 22Q16 4 32 4Q48 4 61 22Q46 30 32 30Q18 30 3 22Z",{fill:Ds.fill,stroke:1.8});e+=oe([[6,24],[32,32],[58,24]],Ct,2);for(const t of[16,26,36,46])e+=oe([[t,30],[t-1.5,36]],Ct,1.2);return mt("moon.old.lid",64,44,32,22,e)}function A4(){let n=oe([[6,16],[18,11],[32,12],[42,16]],Ct,1.8);return n+=oe([[14,20],[26,19]],Ds.mark,1.2),mt("moon.old.mouth",48,28,24,14,n)}function R4(){const n=re([[4,10],[22,7],[42,10],[38,24],[24,32],[10,26]]);let e="";for(const s of[12,20,28])e+=me(`M${s} 8L${s+7} 8L${s+6} 14L${s+1} 14Z`,{fill:"#fbf5e6",stroke:1.1});const t=e+wn(24,27,8,5,ye.pinkDeep),i=me(n,{fill:"#3a3446",inner:t,stroke:1.8});return mt("moon.old.mouth.laugh",48,36,24,16,i)}const Bi={face:"#f3be86",mark:"#d9955f",ring:"#ef8f86",ringDeep:"#e0716c",ray:"#f4e08c",rayLime:"#dbe68a",cheek:"#f4a3a0"};function L4(){const n=new Vt(9160),e=Q3(160,160,60,s=>138+2.2*Math.sin(s*5+.6)+n.range(-.8,.8));let t="";for(let s=0;s<46;s++){const r=n.range(0,Math.PI*2),a=n.range(20,124),o=160+Math.cos(r)*a,c=160+Math.sin(r)*a;if(Math.abs(c-140)<26&&Math.abs(Math.abs(o-160)-46)<34||Math.abs(o-160)<22&&c>136&&c<230)continue;const l=n.range(3.5,5.5);t+=oe([[o-l,c+l*.8],[o,c-l*.3],[o+l,c+l*.8]],Bi.mark,1.5)}for(const[s,r]of[[114,-1],[206,1]])t+=me(ge(s,142,30,23),{fill:Bi.ring,stroke:1.8}),t+=oe([[s+r*30,104],[s+r*10,108],[s-r*18,100]],Ct,2.2);t+=oe([[156,162],[150,186],[162,188]],Ct,1.8),t+=wn(92,196,16,9,Bi.cheek,.8)+wn(228,196,16,9,Bi.cheek,.8);const i=me(re(e),{fill:Bi.face,over:t,stroke:2.2});return mt("sun.disk",320,320,160,160,i)}function C4(){const n="M4 18Q16 4 28 4Q42 4 52 18Q40 30 28 30Q14 30 4 18Z",e=wn(28,20,8,8.4,"#8a6a9c")+wn(28,21,3.8,4,Ct)+xe("M2 18Q14 0 28 1Q44 1 54 18Q42 11 28 11Q14 11 2 18Z",Bi.ringDeep)+en(25.5,18,1.4,"#ffffff",.9);let t=me(n,{fill:"#fbf1e4",inner:e,stroke:1.8});return t+=oe([[3,17],[16,9],[28,9],[42,9],[53,17]],Ct,2),mt("sun.eye",56,36,28,18,t)}function P4(){let e=me("M3 18Q14 2 28 2Q42 2 53 18Q40 26 28 26Q16 26 3 18Z",{fill:Bi.ring,stroke:1.8});e+=oe([[6,20],[28,27],[50,20]],Ct,2);for(const t of[14,22,30,38,44])e+=oe([[t,25.5],[t-1,31]],Ct,1.2);return mt("sun.lid",56,36,28,18,e)}function D4(){let n=oe([[8,20],[16,11],[28,8],[40,11],[48,20]],Ct,2);return n+=oe([[22,23],[34,23]],Bi.mark,1.3),mt("sun.mouth",56,30,28,15,n)}function k4(){const n=re([[4,20],[14,8],[28,5],[42,8],[52,20],[44,34],[28,40],[12,34]]);let e="";for(const s of[13,22,31])e+=me(`M${s} 6L${s+8} 6L${s+6.5} 14L${s+1.5} 14Z`,{fill:"#fbf5e6",stroke:1.1});e+=me("M18 38L22 30L26 38Z",{fill:"#fbf5e6",stroke:1})+me("M30 38L34 30L38 38Z",{fill:"#fbf5e6",stroke:1});const t=e+wn(28,30,9,5,"#9ed0b8"),i=me(n,{fill:"#4a3438",inner:t,stroke:2});return mt("sun.mouth.open",56,44,28,20,i)}function I4(){const n=yt([[4,74,1],[18,30],[22,3,1],[26,30],[40,74,1]]),e=me(n,{fill:Bi.ray,stroke:2,over:oe([[22,16],[22,50]],Bi.mark,1.1,.6)});return mt("sun.ray",44,76,22,74,e)}function F4(){const n=yt([[4,74,1],[16,44],[14,30,1],[26,22],[30,6,1],[30,34],[40,74,1]]);let e=me(n,{fill:Bi.rayLime,stroke:2});return e+=oe([[18,52],[24,46],[20,40]],Ct,1.3),mt("sun.ray.broken",44,76,22,74,e)}const Nt={fill:"#3d3b45",shade:"#2e2c35",rim:"#6d6a7c",dark:"#26242c",collar:"#6a6878",chair:"#2a2830",chairLight:"#3b3843",skin:"#4a4854",skinShade:"#3a3842"},cs=(n,e="",t=Nt.rim)=>me(n,{fill:Nt.fill,stroke:2.6,over:e});function Dh(n,e,t){return me(re(n),{fill:Nt.skin,stroke:2.6,over:Zt(e,Nt.dark)+oe([[t[0],t[1]-3],[t[0]+2.2,t[1]],[t[0],t[1]+3]],Nt.skinShade,1.4)})}function U4(){const n={fill:Nt.chair,shade:"#1f1d25",light:Nt.chairLight,sx:1.6,sy:1,hx:1,hy:1,stroke:2.4};let e="";return e+=me(ve([[21,103],[26,103],[25.4,148.4],[20.4,148.4]]),n),e+=me(ve([[58,103],[63,103],[64,148.4],[59,148.4]]),n),e+=F("M25 130L60 130",Nt.chair,2.6),e+=me(yt([[17.6,49,1],[26.4,47.4,1],[29.4,98,1],[21,99.4,1]]),{...n,over:oe([[21,56],[24.4,94]],Nt.chairLight,1.2,.8)}),e+=me(yt([[19,95.6,1],[67,95.6,1],[67,103,1],[19,103,1]]),n),e+=me(j([[42,90],[58,90.6],[75,91.4]],16,14),{fill:Nt.shade,stroke:2.4}),e+=me(j([[74.6,93],[75.6,118],[76.4,140]],12.4,10.4),{fill:Nt.shade,stroke:2.4}),e+=me(re([[69,140.6],[78,139.4],[87.6,142],[92.4,145.4],[91.4,148.6],[70,148.6]],.8),{fill:"#1f1d25",stroke:2.2}),e+=cs(re([[28,94.4],[26.2,80],[27,66],[31,55],[38,47.6],[46,46],[52,49],[56,57],[57,68],[54,80],[50.4,90],[46,96.4],[36,97.4]]),Zt([[47.6,46],[52,47.4],[53.8,52],[50,50.4]],Nt.collar)+oe([[51.8,50],[54,62],[53.4,70]],Nt.dark,2.4)+oe([[47,49],[52,58],[53,66]],Nt.shade,1.3)+oe([[33.6,78],[41,77.4]],Nt.shade,1.2)),e+=cs(j([[34,91.6],[52,92.6],[70,93.6]],19,16.4),oe([[44,86.4],[66,87.6]],Nt.rim,1,.6)),e+=cs(j([[69.6,95],[70.6,119],[71.4,141]],14,11.6),oe([[69.2,104],[70,130]],Nt.shade,1.1)),e+=me(re([[63.6,140.8],[73.6,139.4],[83.6,142],[89.4,145.6],[88.4,148.8],[65.6,148.8]],.8),{fill:Nt.dark,stroke:2.2}),e+='<g transform="rotate(17 46 49)">',e+=me(j([[44,51],[48.4,42]],8.6,7.6),{fill:Nt.skinShade,stroke:2.2}),e+=Dh([[41.6,32],[42.8,24],[48,19],[55,17.6],[61,20.6],[64.4,26.6],[64.6,31],[66.6,35.4],[64.2,37.2],[62.6,41],[58.4,44.4],[52.6,45.4],[47,43],[43,38]],[[40,34],[42,22],[49.6,16],[58,16.6],[62.6,21.4],[56,22.6],[50,25.4],[47,31],[45.6,38]],[49.4,31.4]),e+="</g>",e+=cs(j([[42,53.6],[45,66],[49,78]],12.4,10.6)),e+=cs(j([[48.6,78],[58,82.6],[66.4,85.6]],10.6,9.2)),e+=Zt([[64.2,81.6],[67.2,81.4],[68.4,89.4],[65.2,89.8]],Nt.collar),e+=me(re([[66.6,81.8],[72,82.4],[75.4,86.4],[72.4,89.8],[66.6,89.4]]),{fill:Nt.skin,stroke:2}),mt("attendee.sit",96,150,48,150,e)}function N4(){let n="";return n+=me(j([[31.6,108],[30.8,148],[30,184]],15,12.4),{fill:Nt.shade,stroke:2.4}),n+=me(re([[23.4,183.4],[33,182.2],[42,186],[44.4,190.6],[42.6,194.2],[23.6,194.2]],.8),{fill:"#1f1d25",stroke:2.2}),n+=cs(j([[38.4,108],[39.2,148],[40.2,184]],16.4,12.8),oe([[39.4,116],[40.4,180]],Nt.shade,1.1)+oe([[34,118],[34.4,170]],Nt.rim,1,.5)),n+=me(re([[31.6,183],[42,182.2],[52,186],[55.2,190.4],[53.8,194.4],[32.6,194.4]],.8),{fill:Nt.dark,stroke:2.2}),n+=cs(re([[23,52],[26,44],[33,40],[42,40.6],[48,45],[51,56],[51.4,72],[49.4,88],[48.4,104],[45.4,112.4],[36,113.4],[26,112.4],[24,100],[22.6,84],[22,68]]),Zt([[41.6,40],[46,42],[47.6,47],[44,45.2]],Nt.collar)+oe([[46,45],[49,60],[48.6,74]],Nt.dark,2.4)+oe([[41,42],[47,54],[49,70]],Nt.shade,1.3)+en(49,79,1.1,Nt.dark)+en(48.6,91,1.1,Nt.dark)+oe([[36,92],[45,92]],Nt.shade,1.2)+oe([[25,104],[47.4,104.6]],Nt.shade,1,.8)),n+='<g transform="rotate(8 37 41)">',n+=me(j([[36.4,42],[37.2,34]],9.4,9),{fill:Nt.skinShade,stroke:2.2}),n+=Dh([[26,20],[27,11],[33,6],[41,5.4],[47,9],[49.6,14.6],[50,19],[52.4,23.2],[50.4,25],[50,29],[47,33.6],[41,35.4],[34,34],[29,29]],[[24.8,22],[26,9.6],[33,4.4],[42,4],[48,8.6],[42.4,9.4],[36,11.6],[32,17],[30.4,25]],[34.4,20.4]),n+="</g>",n+=cs(j([[33,50],[34,70],[35,88]],12.6,11)),n+=cs(j([[35,88],[36.8,104],[38.4,117]],11,9.6)),n+=Zt([[33.4,114.4],[38.4,114],[39,118.6],[33.8,119]],Nt.collar),n+=me(re([[34.6,117.4],[40.6,116.6],[42.6,122],[40.6,128],[36.2,128.4],[34,123]]),{fill:Nt.skin,stroke:2}),mt("attendee.stand",70,196,35,196,n)}const bo={fill:"#2b2229",rim:"#5a3d78",ink:"#1d171c"};function kh(n,e){const t={fill:bo.fill,light:bo.rim,sx:0,sy:0,hx:1.8,hy:1.4,stroke:2,ink:bo.ink};let i="";for(const s of e)i+=me(s,t);return i+=me(re(n,.9),{...t,over:oe([[n[0][0]+8,96],[n[0][0]+9,124]],"#231b21",2.4,.8)}),i}function Ih(n,e,t){const i=new Vt(t);let s="";for(const r of n){const a=i.range(4,8);s+=xe(j([[r,e-3],[r+i.range(-2,2),e+a*.5],[r+i.range(-3,3),e+a]],3.6,.8),bo.fill,.75)}return s}function $4(){const n=[[13,126],[12.4,110],[11,94],[9.4,78],[10,62],[13,50],[18.6,41],[26,35.4],[32,33.6],[34,27],[37.4,20.4],[43.4,17.4],[50,18.6],[53.6,23.8],[54,30.6],[51.6,36],[47.4,39.8],[48,46],[49,54],[50,64],[48.6,76],[46.6,88],[47.4,102],[48.8,116],[49.4,126],[44,127.4],[39,124],[34,127.6],[31,116],[28,127.6],[22,124.4],[17,127.6]],e=j([[38,44],[41.6,62],[44.6,80],[46,90]],9.4,6.4);let t=kh(n,[e]);return t+=Ih([15,21,27,35,41,47],126,51),t+=oe([[36,24],[41,19],[48,18.4]],L.vein,1,.35),mt("form.shadow",62,132,31,132,t)}function B4(){const n=[[22,126],[21.4,110],[20,94],[18.8,78],[20,62],[24,50],[30,42],[37,37.4],[40,33.4],[39.6,25.4],[42.4,17.4],[48.4,13.6],[55.4,14.6],[59.4,19.8],[60,26.8],[57.6,32.6],[53.4,36.6],[54.6,44],[55.6,54],[56.4,66],[55,78],[53,90],[53.6,104],[55,116],[55.6,126],[50.4,127.4],[45.6,124],[41,127.6],[38,116],[35,127.6],[29.6,124.4],[25,127.6]],e=j([[46,46.4],[60,44.6],[74,42.4],[84,41]],11.4,7.2),t=re([[80.4,37.6],[86.6,37.4],[89.4,39.6],[86.4,42.8],[81,44.6]]),i=j([[86,39.8],[91.6,39.2],[94,39]],3.4,2.2);let s=kh(n,[i,t,e]);return s+=Ih([24,30,36,44,50,55],126,77),s+=oe([[42,19],[47,14.6],[54,14.4]],L.vein,1,.35),s+=oe([[60,42],[74,39.6],[85,38]],L.vein,1,.3),mt("form.point",96,132,40,132,s)}const Yn={fill:L.gortiBark,shade:L.gortiBarkDark,light:L.gortiBarkLight};function Ar(n,e){return oe(n,L.violetDark,e+1.6,.9)+oe(n,L.violet,e)+oe(kr(n,-.6,0),L.vein,Math.max(.9,e*.35),.95)}function O4(){const n=[[14,426],[12,380],[15.4,340],[12.6,306],[9.6,290],[14,272],[18,240],[19.4,200],[17,172],[14.6,158],[19,142],[23,110],[25,80],[27.6,50],[33.4,26],[44,13],[55,9.6],[66,12],[76.6,24],[82.6,48],[85,80],[87,110],[91,142],[95.4,158],[93,172],[91,200],[92,240],[96,272],[100.4,290],[97.4,306],[95,340],[98,380],[96,426]],e=(r,a)=>me(j(r,a,1.4),{...Yn,stroke:2.6});let t="";t+=e([[18,250],[9,243],[4,231]],7),t+=e([[92,212],[101,201],[104.6,188]],7),t+=e([[15,392],[7,398],[3,408]],8),t+=e([[88,118],[96,112],[99.6,102]],5.6);let i="";const s=[[[30,418],[33,380],[28.6,350],[34,320]],[[74,416],[69.6,372],[75,334]],[[33,380],[52,386],[69.6,372]],[[26,250],[30,222],[27,196]],[[80,256],[76,226],[82,196]],[[30,222],[48,230],[76,226]],[[34,128],[36,96],[33,70]],[[74,128],[71,98],[76,70]],[[36,96],[54,102],[71,98]],[[40,64],[56,60],[72,66]]];for(const r of s)i+=oe(r,Yn.shade,2.2);for(const[r,a]of[[290,1],[158,.9]])for(let o=-1;o<=1;o++){const c=r+o*11,l=[[20,c-3],[36,c+3],[55,c+1],[74,c+4],[90,c-2]].map(([f,u])=>[55+(f-55)*a,u]);i+=oe(l,Yn.shade,o===0?3:2.2)+oe(kr(l,0,-2.6),Yn.light,1.4,.8)}i+=Fh(new Vt(4101),[16,60,94,400],14,"#5e5670",Yn.light,1.9),i+=fc(34,214,4.6,3.4,Yn.shade,Yn.light)+fc(76,360,4,3,Yn.shade,Yn.light),i+=me(re([[60,24],[70,22],[77.6,32],[79.6,52],[72,58],[62,50]]),{fill:Yn.light,stroke:2.4}),i+=Ar([[48,424],[46,372],[52,330],[48,300],[54,262],[50,222],[56,180],[52,140],[57,100],[54,62],[56,36]],3.2),i+=Ar([[52,330],[66,314],[74,296]],2)+Ar([[50,222],[36,204],[30,184]],2)+Ar([[57,100],[68,86],[72,70]],1.8),i+=Ar([[46,372],[32,360],[24,342]],2);for(const[r,a]of[[52,330],[50,222],[57,100]])i+=ot(r,a,11,L.vein,.4)+en(r,a,2.2,"#f1e3ff",.9);return t+=me(re(n,.95),{...Yn,stroke:4,over:i}),mt("giant.finger",110,420,55,410,t)}function Fh(n,e,t,i,s,r){const[a,o,c,l]=e;let f="";for(let u=0;u<t;u++){let h=n.range(a,c),d=n.range(o,l),p=Math.PI/2+n.range(-.35,.35);const _=[[h,d]],m=n.int(3,5);for(let g=0;g<m;g++){const b=n.range(10,20);p=Math.max(Math.PI/2-.7,Math.min(Math.PI/2+.7,p+n.range(-.45,.45))),h+=Math.cos(p)*b,d+=Math.sin(p)*b,_.push([h,d])}if(f+=F(ve(_,!1),i,r)+F(ve(kr(_,1.3,-.4),!1),s,r*.4,.55),n.chance(.55)){const g=_[n.int(1,_.length-2)],b=p+(n.chance(.5)?1:-1)*n.range(.7,1.2),E=n.range(7,13);f+=F(ve([g,[g[0]+Math.cos(b)*E,g[1]+Math.sin(b)*E]],!1),i,r*.7)}}return f}function fc(n,e,t,i,s,r){return wn(n,e,t*1.45,i*1.4,s,.55)+F(ge(n,e,t*1.45,i*1.4),s,1.6)+wn(n,e,t,i,r)+wn(n+t*.15,e+i*.2,t*.55,i*.5,"#4a4258")+F(ge(n,e,t,i),"#4a4258",1.4)}function G4(){const n="giantLegsFade";let e=`<mask id="${n}" maskUnits="userSpaceOnUse" x="-10" y="-30" width="400" height="620"><rect x="-10" y="160" width="400" height="420" fill="#fff"/>`;const t=40;for(let c=0;c<t;c++)e+=`<rect x="-10" y="${c*4}" width="400" height="4.3" fill="#fff" opacity="${wt(((c+.5)/t)**1.3)}"/>`;e+="</mask>";const i=(c,l)=>{const f=l?{fill:Ut(Yn.fill,Yn.shade,.55),shade:"#554d66",light:Yn.fill}:{fill:Yn.fill,shade:Yn.shade,light:Yn.light},u=l?"#463f55":"#564d68";let h="";for(const[_,m]of c.rootlets)h+=me(j(_,m,1.6),{...f,stroke:2.6});for(const[_,m,g]of c.toes)h+=me(j(_,m,g),{...f,stroke:3,over:oe(kr(_.slice(1),0,-m*.12),f.light,1.3,.7)+oe(kr(_.slice(1,3),2,m*.1),u,1.6,.8)});const d=new Vt(c.seed);let p=Fh(d,c.box,26,u,f.light,2.2);for(const[_,m,g,b]of c.knots)p+=fc(_,m,g,b,f.shade,f.light);for(let _=0;_<3;_++){const m=c.knee-12+_*12,[g,b]=c.kneeX,E=[[g,m],[g+(b-g)*.3,m+5],[g+(b-g)*.65,m+3],[b,m-2]];p+=oe(E,u,_===1?3:2.2)+oe(kr(E,1,-2.8),f.light,1.4,.7)}for(const[_,m]of c.veins)p+=Ar(_,l?m*.85:m);for(const[_,m]of c.nodes)p+=ot(_,m,l?10:12,L.vein,l?.25:.38)+en(_,m,l?2:2.4,"#f1e3ff",l?.7:.9);return h+=me(re([...c.left,...c.right],.9),{...f,stroke:4,over:p}),h},s={left:[[70,-30],[75,40],[80,96],[76,112],[82,128],[88,180],[84,226],[88,262],[93,300],[96,352],[90,372],[98,392],[102,420],[104,446],[102,478],[97,506],[90,530],[84,548],[80,562]],right:[[100,564],[140,564],[156,552],[166,528],[166,500],[163,470],[167,420],[172,384],[178,372],[174,356],[180,300],[190,262],[186,226],[181,186],[186,160],[191,146],[186,120],[191,50],[195,-30]],toes:[[[[146,526],[172,528],[194,536],[210,548],[218,563]],26,7],[[[148,542],[172,546],[192,554],[202,564]],18,5],[[[104,544],[88,550],[72,556],[60,564]],17,4]],rootlets:[[[[180,368],[192,360],[199,346]],7],[[[80,118],[70,110],[64,98]],7]],box:[70,-10,190,520],seed:5601,knots:[[112,196,6,4.2],[150,418,5,3.6]],knee:262,kneeX:[92,186],veins:[[[[132,-20],[128,60],[136,140],[130,210],[138,280],[132,350],[138,420],[134,470],[148,518],[178,532],[204,544]],3.2],[[[136,140],[154,160],[164,186]],2],[[[138,280],[118,300],[108,330]],2],[[[138,420],[154,440],[158,466]],1.8]],nodes:[[136,140],[138,280]]},r={left:[[178,-30],[182,40],[188,110],[194,180],[190,206],[196,222],[194,236],[197,262],[202,300],[206,350],[210,400],[212,440],[210,478],[205,506],[198,530],[192,548],[188,562]],right:[[208,564],[250,564],[266,552],[276,528],[276,500],[272,470],[276,420],[282,360],[289,300],[298,264],[294,228],[289,188],[293,120],[296,92],[304,80],[298,66],[300,50],[304,-30]],toes:[[[[258,524],[284,526],[308,534],[326,546],[336,563]],28,7],[[[258,540],[284,545],[306,553],[318,564]],19,5],[[[214,544],[198,550],[182,556],[170,564]],17,4],[[[236,548],[236,556],[232,564]],12,4]],rootlets:[[[[300,76],[312,68],[318,54]],7],[[[192,214],[180,208],[174,196]],6.5]],box:[178,-10,298,520],seed:5602,knots:[[268,150,6.5,4.4],[222,330,5.4,3.8],[258,470,4.6,3.2]],knee:264,kneeX:[200,294],veins:[[[[240,-20],[236,60],[244,140],[238,210],[246,280],[240,350],[246,420],[242,470],[258,514],[290,528],[318,540]],3.4],[[[244,140],[262,160],[272,186]],2],[[[246,280],[226,300],[216,330]],2],[[[246,420],[262,440],[266,466]],1.8],[[[236,60],[218,80],[208,104]],1.8]],nodes:[[244,140],[246,280],[246,420]]};let a=me(re([[99,466],[130,471.4],[163,466.4],[164.4,480],[130,485.4],[100.6,480]],.7),{fill:"#4a3528",stroke:2.4,over:oe([[112,474.6],[118,475.6]],"#6a4d3a",1.2)+oe([[146,475.6],[152,474.6]],"#6a4d3a",1.2)});a+=`<rect x="141.4" y="474.4" width="2.4" height="4" fill="#b9a36a" stroke="${Ct}" stroke-width="1"/>`,a+=`<circle cx="131" cy="477.6" r="10.4" fill="${L.ivory}" stroke="${Ct}" stroke-width="2.4"/>`,a+='<circle cx="131" cy="477.6" r="8.2" fill="none" stroke="#b9a36a" stroke-width="1.4"/>',a+=F("M131 477.6l0-5.6M131 477.6l4 2",Ct,1.3),a+=F("M131 470.6l0 1.4M131 483.2l0 1.4M124 477.6l1.4 0M136.6 477.6l1.4 0","#6b5a4a",.9),a+=xe(ge(127.6,473.6,2.4,1.4),"#ffffff",.7);const o=i(s,!0)+a+i(r,!1);return mt("giant.legs",380,560,190,560,`${e}<g mask="url(#${n})">${o}</g>`)}function z4(){const n="M11 2.2C11.6 8 13.4 12.6 16.2 17.8C19.4 23.8 19.2 32.4 11 34.6C2.8 32.4 2.6 23.8 5.8 17.8C8.6 12.6 10.4 8 11 2.2Z";let e=ot(11,26,10.5,L.vein,.35);return e+=me(n,{fill:L.violet,stroke:2}),e+=xe(ge(8.2,24.4,1.7,3.4),"#f1e3ff",.9)+en(9.6,13.6,.8,"#f1e3ff",.8),mt("giant.drip",22,40,11,6,e)}function H4(){return[J3(),j3(),e4(),t4(),n4(),g4(),_4(),M4(),i4(),s4(),r4(),a4(),o4(),l4(),c4(),f4(),h4(),u4(),d4(),p4(),x4(),y4(),S4(),b4(),T4(),E4(),w4(),A4(),R4(),L4(),C4(),P4(),D4(),k4(),I4(),F4(),U4(),N4(),$4(),B4(),O4(),G4(),z4()]}const Mt=L.ink,Oe=n=>Math.round(n*100)/100;function ct(n,e,t,i,s){const r=i==="bc"?t:i==="c"?t/2:0;return{key:n,w:e,h:t,px:e/2,py:r,body:uh(s(new Vt(Mi(n)))),scale:1}}function k(n,e,t={}){return me(n,{fill:e.fill,shade:e.shade,light:e.light,stroke:3.5,...t})}const Et=(n,e,t)=>ge(n,e,t,t),_e=(n,e=1)=>re(n,e,!1),_t=(n,e,t,i,s=1)=>`<circle cx="${Oe(n)}" cy="${Oe(e)}" r="${Oe(t)}" fill="${i}"${s!==1?` opacity="${s}"`:""}/>`,na=(n,e)=>`<g ${n}>${e}</g>`,pn=(n,e,t,i,s=.3)=>xe(ge(n,e,t,i),Mt,s),it=(n,e,t,i)=>[n+Math.cos(i)*t,e+Math.sin(i)*t],Kn=(n,e,t)=>n+(e-n)*t,nn=(n,e,t,i)=>`M${Oe(n)} ${Oe(e)}H${Oe(n+t)}V${Oe(e+i)}H${Oe(n)}Z`,ba=(n,e,t,i)=>`M${Oe(n)} ${Oe(e)}V${Oe(e+i)}H${Oe(n+t)}V${Oe(e)}Z`;function Cc(n,e){const t=Ho("pc");return`<clipPath id="${t}"><path d="${n}"/></clipPath><g clip-path="url(#${t})">${e}</g>`}function Da(n,e,t=.85){const i=n.length,s=[],r=[];for(let m=0;m<i;m++){const g=n[Math.max(0,m-1)],b=n[Math.min(i-1,m+1)],E=Math.hypot(b[0]-g[0],b[1]-g[1])||1,v=-(b[1]-g[1])/E,S=(b[0]-g[0])/E,T=e[m]/2,P=n[m];s.push([P[0]+v*T,P[1]+S*T]),r.push([P[0]-v*T,P[1]-S*T])}const a=n[i-1],o=n[i-2],c=Math.hypot(a[0]-o[0],a[1]-o[1])||1,l=e[i-1]*.5,f=[a[0]+(a[0]-o[0])/c*l,a[1]+(a[1]-o[1])/c*l],u=n[0],h=n[1],d=Math.hypot(h[0]-u[0],h[1]-u[1])||1,p=e[0]*.4,_=[u[0]-(h[0]-u[0])/d*p,u[1]-(h[1]-u[1])/d*p];return re([...s,f,...r.reverse(),_],t)}function bi(n,e){const t=n.length;return n.map((i,s)=>{const r=n[Math.max(0,s-1)],a=n[Math.min(t-1,s+1)],o=Math.hypot(a[0]-r[0],a[1]-r[1])||1;return[i[0]-(a[1]-r[1])/o*e,i[1]+(a[0]-r[0])/o*e]})}function Vr(n,e,t,i=6){const s=r=>{const a=r*(n.length-1),o=Math.min(n.length-2,Math.floor(a)),c=a-o,l=n[o],f=n[o+1];return[Kn(l[0],f[0],c),Kn(l[1],f[1],c)]};return Array.from({length:i},(r,a)=>s(Kn(e,t,a/(i-1))))}function Bs(n,e,t={},i=3.5,s=Mt){let r="";for(const a of n)r+=`<path d="${a}" fill="${s}" stroke="${s}" stroke-width="${i}" stroke-linejoin="round"/>`;for(const a of n)r+=k(a,e,{...t,stroke:0});return r}function Lr(n,e,t,i=.45,s=5,r=-Math.PI/2){const a=[];for(let o=0;o<s*2;o++)a.push(it(n,e,o%2?t*i:t,r+o*Math.PI/s));return ve(a)}function hc(n,e,t,i=.45,s=-.35,r=.82){const a=n+t*i,o=e+t*s,c=t*r,l=Math.hypot(a-n,o-e),f=Math.atan2(o-e,a-n),u=Math.acos((t*t+l*l-c*c)/(2*t*l)),h=Math.acos((c*c+l*l-t*t)/(2*c*l)),d=[],p=18;for(let _=0;_<=p;_++)d.push(it(n,e,t,f+u+_/p*(2*Math.PI-2*u)));for(let _=1;_<p;_++)d.push(it(a,o,c,f+Math.PI+h-_/p*2*h));return ve(d)}function V4(n,e,t,i=5,s=0,r=.38,a=1){const o=[],c=Math.PI*2/i;for(let l=0;l<i;l++){const f=s+l*c;for(const[u,h]of[[-.5,r],[-.3,.9],[0,1],[.3,.9]]){const d=it(0,0,t*h,f+u*c);o.push([n+d[0],e+d[1]*a])}}return re(o,1)}const W4={1:[[[.18,.24],[.62,0],[.62,1]]],4:[[[.72,1],[.72,0],[0,.66],[1,.66]]],I:[[[.5,0],[.5,1]]],V:[[[0,0],[.5,1],[1,0]]],X:[[[0,0],[1,1]],[[1,0],[0,1]]]};function uc(n,e,t,i,s,r){const a=()=>r?r.range(-.04,.04):0;return(W4[n]??[]).map(o=>ve(o.map(([c,l])=>[e+(c+a())*i,t+(l+a())*s]),!1)).join("")}const Yi={fill:"#a27758",shade:"#7b5840",light:"#c29873"},To={fill:"#caa277",shade:"#a07b55",light:"#e3c49b"},ma={fill:"#8e5d45",shade:"#694333",light:"#ae7b5d"},Uh={fill:"#6b4d3b",shade:"#4f382b",light:"#86644d"},$t={fill:L.bark,shade:L.barkDark,light:L.barkLight},ir={fill:L.ivory,shade:L.ivoryDark,light:"#f7f0e4"},X4={fill:"#dcd2c2",shade:"#b8aa95",light:"#efe8dd"},Pl={fill:"#f0e8da",shade:"#cdbfa9",light:"#fffaf2"},q4={fill:"#5d80b6",shade:"#48658f",light:"#86a6d6"},Z4={fill:"#cf9a52",shade:"#a8783a",light:"#e6b976"},Y4={fill:"#e6dac6",shade:"#c3b49c",light:"#f5eee2"},hf={fill:"#4d4756",shade:"#37323f",light:"#6a6475"},Pc={fill:L.sun,shade:L.sunDark,light:L.sunLight},ga={fill:"#b7ae9d",shade:"#8f8778",light:"#d5ccb8"},Cs={fill:"#6d6680",shade:"#524c63",light:"#8a839b"},as={fill:L.horse,shade:L.horseDark,light:L.horseLight},At={teal:{fill:L.crystalTeal,shade:L.crystalTealDark,light:L.crystalTealLight},blue:{fill:L.crystalBlue,shade:L.crystalBlueDark,light:L.crystalBlueLight},orange:{fill:L.crystalOrange,shade:L.crystalOrangeDark,light:L.crystalOrangeLight}},Eo="#8c62c6";function Wr(n,e,t,i,s,r=1.3,a=.8){return t.map(o=>{const c=s.range(n,Kn(n,e,.3)),l=s.range(Kn(n,e,.6),e);return F(_e([[c,o],[Kn(c,l,.5),o+s.range(-1.2,1.2)],[l,o+s.range(-.8,.8)]]),i,r,a)}).join("")}const K4={fish:{parts:[{pts:[[.5,0],[.3,.17],[.02,.22],[-.22,.14],[-.3,0],[-.22,-.14],[.02,-.23],[.3,-.18]],round:!0},{pts:[[-.24,0],[-.5,.21],[-.43,0],[-.5,-.21]],round:!1},{pts:[[.12,-.19],[-.06,-.33],[-.12,-.15]],round:!1}],eye:[.3,-.05]},bird:{parts:[{pts:[[.36,-.08],[.24,.06],[-.05,.12],[-.3,.06],[-.36,-.01],[-.1,-.06],[.14,-.14],[.3,-.18]],round:!0},{pts:[[.36,-.14],[.52,-.1],[.37,-.04]],round:!1},{pts:[[.1,-.08],[.02,-.38],[-.12,-.52],[-.22,-.32],[-.14,-.05]],round:!0},{pts:[[-.28,.02],[-.52,.12],[-.5,-.04],[-.3,-.05]],round:!1}],eye:[.28,-.12]},moth:{parts:[{pts:[[0,-.12],[.34,-.36],[.46,-.1],[.12,.04]],round:!0},{pts:[[0,-.12],[-.34,-.36],[-.46,-.1],[-.12,.04]],round:!0},{pts:[[.02,.02],[.3,.2],[.18,.34],[.02,.18]],round:!0},{pts:[[-.02,.02],[-.3,.2],[-.18,.34],[-.02,.18]],round:!0},{pts:[[.05,-.22],[.06,.26],[-.06,.26],[-.05,-.22]],round:!0}],eye:[0,-.2]}};function ms(n,e,t,i,s,r=.62,a="#e8f6f3"){const o=Math.cos(s),c=Math.sin(s),l=([d,p])=>[e+(d*o-p*c)*i,t+(d*c+p*o)*i],f=K4[n];let u="";for(const d of f.parts)u+=xe(d.round?re(d.pts.map(l)):ve(d.pts.map(l)),Mt);const h=l(f.eye);return na(`opacity="${r}"`,u)+_t(h[0],h[1],Math.max(.7,i*.035),a,.85)}function sn(n,e,t=3,i=""){const s=Math.sin(n.ang),r=-Math.cos(n.ang),a=Math.cos(n.ang),o=Math.sin(n.ang),c=a+o*.3>=0?1:-1,l=(_,m)=>[n.x+a*_*c+s*m,n.y+o*_*c+r*m],f=n.w/2,u=n.len,h=(n.shoulder??.72)*u,d=ve([l(-f,-1),l(-f,h),l(0,u),l(f,h),l(f,-1)]);ve([l(0,u),l(f,h),l(f,-1),l(f*.2,-1),l(f*.2,h*.97)]);const p=i+F(ve([l(-f*.5,h*.25),l(-f*.5,h*.88)],!1),e.light,Math.max(1,n.w*.09),.9)+F(ve([l(-f,h),l(0,u*.94),l(f*.2,h*.97)],!1),e.light,1,.5);return me(d,{fill:e.fill,shade:e.shade,light:e.light,stroke:t,over:p})}function ka(n,e,t=0){return[n.x+Math.sin(n.ang)*n.len*e+Math.cos(n.ang)*t,n.y-Math.cos(n.ang)*n.len*e+Math.sin(n.ang)*t]}function uf(n,e,t,i,s,r,a){return k(Ke(n,e,t,i,3),Yi,{sx:3,sy:0,hx:2,hy:0})+k(Ke(n-1.5,e-1,t+3,6,2),Yi,{sx:0,sy:2,hx:0,hy:1.5,stroke:2.6})+k(Et(s,r,a),Yi,{sx:2,sy:2,hx:1.5,hy:1.5,stroke:3})}function Q4(){return ct("prop.bed",250,110,"bc",n=>{let e=pn(126,108,118,4,.35);e+=xe(nn(14,80,222,27),Mt,.25),e+=k("M12 66V17Q13 5 27 6Q45 8 50 27V66Z",Yi,{sx:5,sy:0,over:xe(hc(29,17,6.5),L.ivory)+F(hc(29,17,6.5),Mt,1.3)+xe(Lr(41,24,2.8),L.ivory)+F(_e([[16,34],[18,50],[16,64]]),Yi.shade,1.3)});let t="";for(let r=22;r<234;r+=7)t+=F(`M${r} 38V64`,"#cbbfaa",1.3);e+=k(Ke(16,38,218,25,7),X4,{sx:0,sy:4,hx:0,hy:2,inner:t}),e+=k(Ke(10,60,230,22,4),Yi,{sx:0,sy:5,hx:0,hy:2.5,over:Wr(16,234,[66,72,77],Yi.shade,n)+_t(22,71,3,Yi.shade)+_t(228,71,3,Yi.shade)}),e+=k(re([[22,41],[19,32],[25,24],[41,21],[59,22],[70,27],[73,35],[67,41],[45,43]]),Pl,{sx:3,sy:4,stroke:3,over:F(_e([[33,27],[40,31],[49,30]]),Pl.shade,1.6)+F(_e([[62,28],[66,33]]),Pl.shade,1.4)});const i=yt([[74,38,1],[237,38,1],[239,52],[237,77,1],[222,79.5],[206,76],[190,79.5],[174,76],[158,79.5],[142,76],[126,79.5],[110,76],[94,79.5],[78,77,1],[73,58]]);e+=na('transform="translate(2 4)"',xe(i,Mt,.3));let s="";for(const r of[102,136,170,204])s+=xe(nn(r,30,11,60),Eo)+xe(nn(r+15,30,2.5,60),Eo,.85);return e+=k(i,ir,{sx:3,sy:4,hx:0,hy:2.5,inner:s,over:xe(nn(72,36,17,46),"#f5eee2")+xe(nn(76,36,4,46),Eo,.9)+F("M89 38.5V78",Mt,2)+F(_e([[124,46],[127,60],[124,72]]),ir.shade,1.5,.8)+F(_e([[192,44],[195,58],[192,70]]),ir.shade,1.5,.8)}),e+=uf(4,12,12,96,10,7,6),e+=uf(234,29,12,79,240,24,5),e})}function J4(n,e,t){const i=c=>c.map(([l,f])=>[n+l*t,e+f*t]),s={fill:L.ivory,shade:L.ivoryDark,sx:1.5,sy:1.5,stroke:1.6},r=re(i([[.46,.06],[.36,-.16],[.08,-.25],[-.2,-.16],[-.34,.02],[-.22,.18],[.08,.24],[.34,.2]])),a=re(i([[-.28,.04],[-.42,-.1],[-.56,-.24],[-.52,-.04],[-.62,.08],[-.42,.08]])),o=i([[.24,-.05]])[0];return me(a,s)+me(r,{...s,over:_t(o[0],o[1],1.4,Mt)+F(_e(i([[.45,.08],[.3,.11],[.18,.08]])),Mt,1)})+F(_e(i([[.1,-.27],[.06,-.4],[-.02,-.46]])),L.ivory,1.6)+F(_e(i([[.14,-.27],[.2,-.4],[.28,-.44]])),L.ivory,1.6)}function j4(n,e,t,i=!1){const s=[[0,-1],[.55,-.5],[.55,.5],[0,1],[-.55,.5],[-.55,-.5]].map(([r,a])=>[n+r*t,e+a*t]);return me(ve(s),{...At.teal,stroke:1.8,shadeD:ve([[n,e-t],[n+.55*t,e-.5*t],[n+.55*t,e+.5*t],[n,e+t],[n+.12*t,e]]),over:(i?ms("fish",n-.05*t,e+.1*t,t*.85,-.5,.55):"")+F(`M${n-.3*t} ${e-.4*t}V${e+.3*t}`,At.teal.light,1.2)})}function Dl(n,e,t,i,s){let a="";for(let o=0;o<3;o++){const c=n+8+s.range(0,42),l=s.chance(.5)?e+8+s.range(-1,2):e+58-8+s.range(-2,1);a+=xe(ge(c,l,s.range(2,3.5),s.range(1.2,2)),To.fill)}return k(Ke(n,e,58,58,5),To,{sx:4,sy:4,hx:2.5,hy:2.5,over:Wr(n+4,n+58-4,[e+4,e+58-4.5],To.shade,s,1.1)})+k(Ke(n+8,e+8,42,42,3),t,{sx:3,sy:3,hx:1.5,hy:1.5,stroke:2.2,over:i+a})}function e_(){return ct("prop.blocks",130,122,"bc",n=>{let e=pn(65,121,62,3,.35);return e+=Dl(7,64,q4,J4(37,94,30),n),e+=Dl(65,64,Z4,k(Lr(94,94,14,.46),ir,{stroke:1.6,sx:1.5,sy:1.5,hx:0,hy:0}),n),e+=Dl(37,6,Y4,j4(66,35,14,!0),n),e})}function kl(n,e=1.1,t="2.2 2.2"){return`<path d="${n}" fill="none" stroke="${Mt}" stroke-width="${e}" stroke-dasharray="${t}" stroke-linecap="round"/>`}function t_(){return ct("prop.toywhale",90,56,"bc",()=>{const n="#b9c2df",e="#f4ecdc";let t=pn(46,54.5,36,2.2,.18);t+=me(re([[16,36],[10,30],[4,24],[2,17],[7,18],[11,24],[11,15],[15,12],[16,20],[19,31]]),{fill:n,stroke:1.8});const i=yt([[15,37],[22,30],[36,22],[52,15],[66,12],[80,12],[86,16,1],[88,26],[87,38,1],[80,44],[60,47],[40,46],[26,43]]),s=xe(re([[26,43],[40,40],[58,41],[80,40],[90,38],[90,56],[20,56]]),"#d4dbee")+me(ve([[31,25.5],[41.5,23.5],[43.5,33],[33,35]]),{fill:"#f2b6cf",stroke:0,over:kl("M32 26.4L41 24.6L42.6 32.4L33.6 34.2Z",.9,"1.6 1.6")})+F(_e([[50,22],[54,20],[58,21.5]]),Mt,1)+F(_e([[47,27],[51,25.2],[55,26.6]]),Mt,1)+F(_e([[21,35.5],[24,33.2],[27,34]]),Mt,.9);t+=me(i,{fill:n,stroke:2,inner:s}),t+=kl(_e([[60,13],[57,24],[58,35],[61,45.5]])),t+=kl(_e([[27,42],[40,39.6],[58,40.4],[80,39.4],[87,37.6]]));let r="";for(const a of[64,69,74,79])r+=me(`M${a} 44.6L${a+3.4} 44.6L${a+1.7} 41.8Z`,{fill:"#ffffff",stroke:.8});t+=me(re([[60,45.5],[72,44],[84,43.5],[86.5,45.5],[82,48.5],[66,49]]),{fill:e,stroke:1.5})+r,t+=me(Et(66,28,3.4),{fill:Mt,stroke:0}),t+=F("M64.6 26.6L67.4 29.4M67.4 26.6L64.6 29.4","#dfe4f2",.8),t+=me(ve([[19,38.5],[25.5,40.5],[23.5,48],[17,46]]),{fill:n_,stroke:1.2,over:F("M19.2 42.6q1.2-1 2.4 0t2.4 0M18.6 45q1.2-1 2.4 0","#d9737e",.8)}),t+=F(_e([[82,12],[81,8],[83,5]]),Mt,1.4);for(const[a,o,c]of[[79,4.5,2.6],[84.5,3,2.4],[87.4,6.5,2.1]])t+=me(Et(a,o,c),{fill:"#bfe4ea",stroke:1.1});return t})}const n_="#f7efdc";function Ks(n,e=2){return na('transform="translate(1.1 1.3)"',F(n,"#141120",e+.6,.9))+F(n,"#a99dbf",e)}function Il(n,e,t,i,s=1.12){const r=[],a=i.range(0,Math.PI*2);for(let o=0;o<=14;o++)r.push(it(n,e,t*(1+i.range(-.08,.08)),a+o/14*s*Math.PI*2));return _e(r)}function i_(){return ct("prop.marks",230,260,"c",n=>{const e={fill:"#2e2840",shade:"#241f33",light:"#3b3450"},t=[];for(let r=0;r<16;r++){const a=r/16*Math.PI*2;t.push([115+Math.cos(a)*106*n.range(.88,1.03),130+Math.sin(a)*124*n.range(.9,1.03)])}let i="";for(let r=0;r<9;r++){const a=n.range(24,206),o=n.range(20,240);i+=xe(ge(a,o,n.range(2,5),n.range(1.5,3)),e.light,.9)}i+=F(_e([[6,180],[40,170],[60,188],[96,196]]),e.shade,3)+F(_e([[150,12],[168,40],[200,52]]),e.shade,2.5);let s=k(re(t),e,{sx:6,sy:6,hx:3,hy:3,stroke:3,inner:i});for(let r=0;r<14;r++){const a=r<7?0:1,o=r%7,c=(a?142:86)+n.range(-3,3),l=222-o*27+n.range(-2,2)-a*7;if(s+=Ks(`M${Oe(c-26)} ${Oe(l+n.range(-1,1))}L${Oe(c-13)} ${Oe(l)}`,1.8),r<13){s+=Ks(Il(c,l,8.5,n),2);continue}s+=ot(c,l,26,L.vein,.28),s+=xe(Et(c,l,9.5),"#c7aef0",.9),s+=Ks(Il(c,l,9.5,n,1.05),2.4),s+=Ks(Il(c,l,15,n,1.2),1.8),s+=Ks(uc("1",c+22,l-17,12,32,n),2.4),s+=Ks(uc("4",c+36,l-17,20,32,n),2.4)}for(let r=0;r<4;r++){const a=36+r*5+n.range(-1,1);s+=Ks(`M${a} ${40+n.range(-2,2)}l${Oe(n.range(3,6))} ${Oe(n.range(16,22))}`,1.4)}return s})}function s_(){return ct("prop.fourteen",180,120,"c",n=>{const e={fill:L.ivory,shade:"#c8b99f",light:"#fbf6ec"},t=o=>[o[0]+n.range(-1.5,1.5),o[1]+n.range(-1.5,1.5)],i=[[[[33,33],[46,22],[60,12]],9,14],[[[60,11],[59,40],[58.5,70],[57,98]],16,13],[[[37,100],[58,98.5],[79,99]],10,11],[[[131,11],[113,37],[96,61],[84,75]],12,15],[[[83,75],[110,73],[136,72.5],[158,70]],14,9],[[[131,24],[130.5,60],[129,104]],17,12]],s=[];let r="";for(const[o,c,l]of i){const f=o.map(t);s.push(j(f,c,l)),r+=F(_e(bi(f,c*.22)),e.shade,1.1,.7)+F(_e(Vr(bi(f,-c*.18),.1,.7)),e.light,1.2,.8)}for(const[o,c,l,f]of[[45,101,11,4.5],[70,101,18,4],[101,76,14,4.5],[147,74,9,3.5],[127,107,7,4],[59,99,6,3.5]])s.push(re([[o-f/2,c-4],[o+f/2,c-4],[o+f*.38,c+l*.7],[o+f*.62,c+l],[o,c+l+f*.75],[o-f*.62,c+l],[o-f*.38,c+l*.7]]));let a=Bs(s,e,{sx:2.5,sy:2.5,hx:1.5,hy:1.5},4,L.inkSoft);a+=r;for(let o=0;o<7;o++)a+=_t(n.range(20,165),n.range(8,112),n.range(.8,2),L.ivory,.8);return a})}function r_(){return ct("prop.window",170,200,"c",n=>{const e={fill:"#8f6a4f",shade:"#6c4f3b",light:"#ad8768"},t=23,i=21,s=147,r=171;let a=xe(nn(t-4,i-4,s-t+8,r-i+8),"#2a2340");["#3a2f54","#2f2746","#4b3c6c","#352b4e","#413461","#2c2442"].forEach((p,_)=>{const m=i+12+_*25,g=[];for(let b=t-6;b<=s+6;b+=16)g.push([b,m+Math.sin(b/23+_*1.7)*4+(b-85)*.08]);a+=xe(_e(g)+`L${s+6} ${r+6}L${t-6} ${r+6}Z`,p),a+=F(_e(g),Mt,1.4,.55)});for(let p=0;p<12;p++)a+=k(ge(n.range(t,s),n.range(i,r),n.range(2,4),n.range(1.5,2.5)),{fill:"#54467a",shade:"#3b3157",light:"#6a5b94"},{stroke:1.2,sx:1,sy:1,hx:.5,hy:.5});a+=ot(85,92,92,L.violet,.42),a+=k(j([[14,52],[52,66],[92,94],[156,122]],15,8),Cs,{stroke:2.6,sx:2,sy:3,over:F(_e([[30,58],[62,72],[96,96]]),Cs.shade,1.2)}),a+=k(j([[66,76],[80,58],[98,42],[112,30]],7,3),Cs,{stroke:2.2,sx:1.5,sy:1.5});const c={x:44,y:166,len:42,w:19,ang:.42};a+=sn({x:30,y:168,len:22,w:11,ang:-.3},At.teal,2.2),a+=sn(c,At.teal,2.4,ms("fish",...ka(c,.45),15,.42-Math.PI/2+.3,.6));const l={x:136,y:24,len:38,w:17,ang:Math.PI+.55};a+=sn(l,At.blue,2.4,ms("fish",...ka(l,.5),13,2.4,.6)),a+=sn({x:118,y:22,len:20,w:10,ang:Math.PI-.1},At.blue,2);for(const[p,_]of[[t,i],[89,i],[t,99],[89,99]])a+=xe(`M${p} ${_}H${p+58}V${_+6}H${p+5}V${_+72}H${p}Z`,Mt,.35),a+=F(`M${p+16} ${_+60}L${p+48} ${_+14}`,"#ffffff",7,.1),a+=F(`M${p+30} ${_+62}L${p+52} ${_+31}`,"#ffffff",2.2,.16);let f=Cc(nn(t,i,s-t,r-i),a);const u=Ke(10,8,150,176,5)+ba(t,i,58,70)+ba(89,i,58,70)+ba(t,99,58,72)+ba(89,99,58,72);f+=k(u,e,{sx:3.5,sy:3.5,over:Wr(14,156,[13,179],e.shade,n,1.2)+F("M16 30V160M154 36V150",e.shade,1.2,.7)}),f+=k(Et(85,95,4.5),Pc,{stroke:2,sx:1.2,sy:1.2,hx:1,hy:1});for(const p of[26,144])f+=k(`M${p-7} 190H${p+7}L${p+3} 199H${p-3}Z`,e,{stroke:2.4,sx:2,sy:1});f+=k(Ke(2,180,166,12,3),e,{sx:0,sy:4,hx:0,hy:2});let h="";for(let p=14;p<164;p+=22)h+=xe(nn(p,0,7,30),Eo,.9);const d=[[6,3,1],[164,3,1]];for(let p=164;p>=6;p-=19.75)d.push([p,22],[p-9.9,27.5]);return d.push([6,22,1]),f+=k(yt(d),ir,{sx:2,sy:3.5,hx:0,hy:2,stroke:3,inner:h,over:F("M26 6V20M65 6V22M105 6V22M145 6V20",ir.shade,1.3,.8)}),f+=k(Ke(0,.5,170,5,2.5),Uh,{stroke:2.4,sx:0,sy:1.5,hx:0,hy:1}),f})}function a_(){return ct("prop.chest",160,86,"bc",n=>{let e=pn(80,84,76,3,.35);for(const i of[14,130])e+=k(Ke(i,74,16,12,2),Uh,{stroke:2.6,sx:2,sy:1});const t=xe(hc(48,48.5,8.5),L.ivory,.85)+xe(Lr(99,47,5,.45,5,-1.3),L.ivory,.85)+xe(Lr(115,51,3.5,.45,5,-1.8),L.ivory,.85)+xe(Lr(88,53,3,.45,5,-1.5),L.ivory,.85)+xe(Lr(112,69,3,.45,5,-1.2),L.ivory,.7);e+=k(Ke(9,20,142,58,3),ma,{sx:5,sy:4,inner:t,over:F("M11 39H149M11 58H149",ma.shade,1.6)+Wr(12,148,[28,47,67],ma.shade,n,1.1,.6)}),e+=k(Ke(4,4,152,19,5),ma,{sx:0,sy:4,hx:0,hy:2.5,over:Wr(8,150,[10],ma.shade,n,1.1,.6)});for(const i of[20,132]){e+=k(nn(i,4,8,74),hf,{stroke:2.4,sx:2,sy:0,hx:1,hy:0});for(const s of[12,31,50,69])e+=_t(i+4,s,1.6,hf.light)}return e+=k(Ke(71,14,18,22,4),Pc,{stroke:2.4,sx:2,sy:2,hx:1,hy:1,over:xe("M80 21.5a2.6 2.6 0 1 1 -0.01 0M78.6 23.5L77.8 30H82.2L81.4 23.5Z",Mt)}),e})}function o_(){return ct("prop.toyhorse",80,70,"bc",()=>{const n={fill:"#efe5d4",shade:"#c9b99f",light:"#fffaf0"};let e=pn(40,68,34,2.5,.35);const t={...as,fill:L.horseDark,shade:"#44246f",light:L.horse};return e+=k(j([[30,40],[27,52],[24,61]],6,5),t,{stroke:2.4,sx:1.5,sy:0}),e+=k(j([[55,40],[58,52],[60,61]],6,5),t,{stroke:2.4,sx:1.5,sy:0}),e+=k(j([[2,52],[14,61],[30,66],[50,66],[66,61],[78,52]],6.5,6),Yi,{stroke:2.6,sx:0,sy:2.5,hx:0,hy:1.5}),e+=k(j([[26,40],[22,52],[18,62]],6.5,5.5),as,{stroke:2.4,sx:1.5,sy:0}),e+=k(j([[52,40],[55,52],[57,62]],6.5,5.5),as,{stroke:2.4,sx:1.5,sy:0}),e+=Bs([j([[19,30],[12,36],[8,46],[10,54]],5,3),j([[19,31],[15,40],[15,49]],4,2.5)],n,{sx:1.5,sy:1},2.4),e+=k(re([[20,30],[26,25],[42,24],[52,26],[59,31],[58,41],[50,45],[34,45],[23,42],[18,36]]),as,{sx:2.5,sy:3,stroke:2.8,over:_t(30,38,1.6,L.horseLight,.8)+_t(36,41,1.2,L.horseLight,.8)+_t(44,38,1.4,L.horseLight,.8)}),e+=k(re([[50,32],[53,20],[58,11],[63,5],[68,6],[74,10],[79,17],[78.5,22.5],[73,24],[67,20],[63,26],[60,36]]),as,{sx:2,sy:2.5,stroke:2.8,over:_t(69,11.5,1.8,Mt)+_t(69.6,10.9,.6,"#fff")+_t(77,19.5,.9,Mt)+F(_e([[72.5,23.5],[75.5,21.5]]),Mt,1)}),e+=k(ve([[62,7],[63,0],[67,5.5]]),as,{stroke:2,sx:.8,sy:.8,hx:.6,hy:.6}),e+=Bs([j([[62,5],[57,11],[53,20],[51,29]],5.5,3.5),j([[60,8],[56,14],[55.5,21]],4.5,2.5)],n,{sx:1.5,sy:1},2.4),e+=k(re([[31,25.5],[39,23.5],[47,25],[48,31],[40,33],[31,31]]),Pc,{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1}),e+=k(Ke(59,12,11,4,2),To,{stroke:1.8,sx:0,sy:1,hx:0,hy:.8}),e})}function l_(){return ct("prop.lamp",90,190,"tc",()=>{const n=At.orange;let e=ot(45,150,44,"#f2b36a",.55);e+=k(j([[45,3],[30,1],[16,-1]],8,3),$t,{stroke:2.6,sx:0,sy:2}),e+=k(j([[45,3],[60,1],[76,0]],8,3),$t,{stroke:2.6,sx:0,sy:2});const t=s=>Array.from({length:11},(r,a)=>[45+Math.sin(a*1.15+s)*3.8,1+a*11.8]);e+=k(j(t(Math.PI),6.5,5),{...$t,fill:L.barkDark},{stroke:2.4,sx:1.5,sy:0}),e+=k(j(t(0),7,5.5),$t,{stroke:2.4,sx:2,sy:0,over:F(_e(t(.4).slice(1,9)),L.violet,1,.55)}),e+=k(j([[47,46],[55,52],[60,50]],3.5,1.5),$t,{stroke:1.8,sx:1,sy:1}),e+=k(j([[43,80],[35,86],[31,84]],3.5,1.5),$t,{stroke:1.8,sx:1,sy:1});const i={x:45,y:118,len:60,w:30,ang:Math.PI,shoulder:.45};e+=sn({x:34,y:124,len:30,w:14,ang:Math.PI+.45,shoulder:.5},n,2.6),e+=sn({x:57,y:124,len:32,w:14,ang:Math.PI-.5,shoulder:.5},n,2.6),e+=sn(i,n,3,ot(45,142,18,"#fff1c9",.8)+ms("moth",45,146,15,.25,.5,"#fff4d8"));for(const s of[[[43,116],[33,124],[30,138],[33,150]],[[47,116],[58,125],[60,138],[57,149]],[[45,118],[46,128],[44,138]]])e+=k(j(s,6,2.5),$t,{stroke:2.2,sx:1.5,sy:.5});return e+=k(ge(45,116,9,5),$t,{stroke:2.4,sx:0,sy:2}),e+=ot(45,146,20,"#ffe3a1",.35),e})}function c_(){return ct("prop.rootdoor.open",220,280,"bc",n=>{const e={fill:"#9cc47a",shade:"#86b06a",light:"#b4d894"},t={fill:"#a6e0c6",shade:"#8fcfb4",light:"#d6f4e6"},i=(r,a,o,c=!1)=>k(j(r,a,o),$t,{stroke:2.4,over:c?F(_e(r),L.vein,1.1,.55):""});let s="";for(const r of[-1,1]){const a=110+r*82;for(let l=0;l<4;l++){const f=[110+r*(30+l*13),44],u=[a+r*(l-1.5)*3,150],h=[a+r*(-14+l*11),206],d=[a+r*(-26+l*17)+n.range(-3,3),280],p=[Kn(f[0],u[0],.5)-r*(10-l*2),96];s+=i([f,p,u,h,d],13-l,10-l*.5,l===1)}const[o,c]=[a+r*1,150];s+=ot(o,c,20,"#d6f4e6",.45),s+=k(ge(o,c,15,9),t,{stroke:2,inner:F(ge(o,c,10,5),"#72b99b",1,.8)}),s+=k(`M${o-5} ${c-9}L${o} ${c-20}L${o+5} ${c-9}Z`,t,{stroke:1.6});for(const[l,f,u]of[[a-r*14,104,-.6],[a+r*12,226,.5]]){const h=it(l,f,13,r>0?-Math.PI+u:u);s+=k(`M${l} ${f}Q${(l+h[0])/2} ${f-7} ${h[0]} ${h[1]}Q${(l+h[0])/2} ${f+5} ${l} ${f}Z`,e,{stroke:1.4})}}for(let r=0;r<3;r++){const a=Array.from({length:7},(o,c)=>[-6+c*38.6,22+r*9+Math.sin(c*1.25+r*2.1)*7]);s+=i(a,14-r*2,12-r*2,r===1)}for(const[r,a,o]of[[64,26,!1],[80,40,!0],[96,22,!1],[112,34,!1],[128,46,!0],[144,24,!1],[158,30,!1]]){const c=[[r,42],[r+n.range(-4,4),42+a*.55],[r+n.range(-6,6),42+a]];if(s+=k(j(c,5,1.4),$t,{stroke:1.6}),o){const[l,f]=c[2];s+=k(`M${l} ${f}Q${l-6} ${f+6} ${l} ${f+12}Q${l+6} ${f+6} ${l} ${f}Z`,e,{stroke:1.2})}}return s})}function df(n){return n?c_():ct(n?"prop.rootdoor.open":"prop.rootdoor",120,250,"bc",e=>{const t={fill:L.barkDark,shade:"#3a2e40",light:L.bark};let i=xe("M3 252V26Q60 -10 117 26V252Z","#17131f");const s=(a,o,c,l)=>Array.from({length:9},(f,u)=>{const h=-6+u*32.5,d=l*Math.sin(Math.PI*Math.max(0,Math.min(250,h))/250);return[a+Math.sin(u*.9+c)*o+d,h]}),r=(a,o=$t,c=!1)=>{const l=F(_e(bi(a.pts,a.w0*.18)),o.shade,1.3,.8)+(c?F(_e(Vr(bi(a.pts,-a.w0*.12),.1,.85,8)),L.violet,1.4,.7):"");return k(j(a.pts,a.w0,a.w1),o,{sx:4,sy:1,hx:2,hy:0,stroke:3.2,over:l})};if(n){i+=xe("M30 252V60Q31 28 60 24Q89 28 90 60V252Z","#0d0b13"),i+=ot(60,170,56,L.violet,.16),i+=F(_e([[40,250],[52,236],[70,238],[84,250]]),"#241d30",3,.8);const a=[{pts:[[-6,60],[14,30],[40,14],[62,10],[86,16],[108,32],[126,58]],w0:16,w1:14},{pts:[[-6,30],[30,4],[70,0],[100,8],[126,26]],w0:12,w1:11}];i+=r(a[1],t);const o=[6,18,29].map((l,f)=>({pts:s(l,3,f*1.7,-8+f*2),w0:20,w1:17})),c=[91,102,114].map((l,f)=>({pts:s(l,3,f*2.3,8-f*2),w0:20,w1:17}));i+=r(o[0])+r(c[2])+r(o[2],$t,!0)+r(c[0],$t,!0)+r(o[1])+r(c[1]),i+=r(a[0],$t,!0);for(const[l,f]of[[40,40],[52,26],[67,34],[80,22]])i+=k(j([[l,18],[l+e.range(-3,3),18+f*.5],[l+e.range(-4,4),18+f]],4,1.2),$t,{stroke:2,sx:1,sy:0});for(const[l,f,u]of[[30,120,1],[90,150,-1],[30,196,1],[90,84,-1]])i+=k(j([[l,f],[l+u*8,f+4],[l+u*13,f+12]],6,2),$t,{stroke:2.2,sx:1,sy:1})}else{const a=(f,u,h,d)=>({pts:Array.from({length:6},(p,_)=>[-8+_*27,Kn(f,u,_/5)+Math.sin(_*1.3+h)*7]),w0:d,w1:d*.75}),o=[9,33,59,86,111].map((f,u)=>({pts:s(f+e.range(-3,3),8+e.range(0,4),u*1.9,0),w0:e.range(18,23),w1:e.range(14,18)})),c=[a(40,70,.3,14),a(120,88,1.8,13),a(150,196,2.9,14),a(214,180,.9,12),a(18,8,2.2,12),a(92,128,4.1,11),{pts:[[-4,150],[22,176],[52,196],[80,226],[100,256]],w0:13,w1:10},{pts:[[124,50],[100,76],[74,92],[50,118],[30,150]],w0:12,w1:9}];i+=r(c[0],t)+r(c[2],t),i+=r(o[0])+r(o[2],$t,!0)+r(o[4]),i+=r(c[1])+r(c[3]),i+=r(o[1],$t,!0)+r(o[3]),i+=r(c[6],$t,!0),i+=r(c[4])+r(c[5])+r(c[7]);const l=[];for(let f=0;f<10;f++)l.push(it(60,128,17*e.range(.85,1.1),f/10*Math.PI*2));i+=k(re(l),$t,{sx:4,sy:4,stroke:3.2,over:F(ge(55,122,5,3.5),L.barkDark,1.3)}),i+=ot(60,129,16,L.violet,.6),i+=F(Et(60,129,6),L.violet,3)+F(Et(60,129,6),L.vein,1.2)}return i+=k(j([[16,244],[4,250],[-6,252]],10,5),$t,{stroke:2.6,sx:0,sy:2}),i+=k(j([[104,244],[116,250],[126,252]],10,5),$t,{stroke:2.6,sx:0,sy:2}),i})}function f_(){return ct("prop.fossil",260,150,"c",n=>{const e={fill:"#3b3550",shade:"#2e293f",light:"#4a4462"},t=[];for(let o=0;o<16;o++){const c=o/16*Math.PI*2;t.push([130+Math.cos(c)*124*n.range(.92,1.02),76+Math.sin(c)*68*n.range(.88,1.02)])}let i="";for(let o=0;o<5;o++){const c=n.range(20,240),l=n.range(20,130);i+=F(ve([[c,l],[c+n.range(-10,10),l+n.range(6,12)],[c+n.range(-14,14),l+n.range(14,22)]],!1),e.shade,1.5)}let s=k(re(t),e,{sx:6,sy:6,hx:3,hy:3,stroke:3.5,inner:i});const r=(o,c=2.4)=>k(o,ga,{sx:1.5,sy:1.5,hx:1,hy:1,stroke:c}),a=[];for(let o=0;o<=16;o++){const c=o/16;a.push([168-c*150,66-Math.sin(c*Math.PI*.9)*14+c*6])}s+=F(re([[20,66],[8,52],[2,46],[10,62],[4,80],[12,76],[20,70]]),ga.shade,1.6,.7);for(let o=1;o<=8;o++){const[c,l]=a[o],f=42-Math.abs(o-3.5)*4;s+=r(j([[c,l+4],[c-4,l+f*.45],[c-12,l+f*.85],[c-18,l+f]],5,2.2),2)}a.forEach(([o,c],l)=>{const f=1-l/16*.6;s+=r(j([[o,c-5*f],[o-2,c-11*f]],4*f,2),1.8),s+=r(Ke(o-4.5*f,c-5.5*f,9*f,11*f,3*f),2)});for(const[o,c]of[[1.9,22],[2.2,26],[2.5,20]]){const l=it(160,94,c,o);s+=r(j([[160,94],[Kn(160,l[0],.5),Kn(94,l[1],.5)+1],l],4,2),1.8)}return s+=r(j([[170,74],[166,86],[160,94]],6,4.5)),s+=r(re([[176,86],[204,93],[234,88],[248,81],[244,89],[212,100],[182,96]]),2.6),s+=k(re([[166,60],[180,45],[206,40],[232,45],[250,57],[253,70],[241,79],[214,85],[186,85],[170,77]]),ga,{sx:3,sy:3,hx:1.5,hy:1.5,stroke:2.8,over:xe(ge(217,59,7.5,5.5),e.shade)+F(ge(217,59,7.5,5.5),Mt,1.6)+xe(ge(195,50,4,2.5),e.shade)+F(_e([[180,72],[206,76],[240,72]]),ga.shade,1.4)+F(_e([[228,48],[236,60],[233,70]]),ga.shade,1.2)}),s})}function gs(n,e,t,i,s,r=2){const a=[];for(let o=0;o<7;o++){const c=it(0,0,t*i.range(.82,1.08),o/7*Math.PI*2+i.range(-.2,.2));a.push([n+c[0],e+c[1]*.72])}return k(re(a),s,{stroke:r,sx:t*.22,sy:t*.3,hx:t*.15,hy:t*.18})}function h_(){return ct("prop.coil",320,110,"bc",n=>{const i=[[6,100],[36,98],[72,100.5],[110,97.5],[150,99.5],[190,96]],s=[9,15,21,26,30,33],r=28;for(let f=0;f<=r;f++){const u=f/r;i.push(it(234,55,Kn(38,7,u),Math.PI/2-u*Math.PI*2*1.15)),s.push(Kn(35,13,u))}const a=Da(i,s,.9);let o="";for(let f=2;f<i.length-2;f+=2){const u=i[f-1],h=i[f+1],d=i[f],p=Math.hypot(h[0]-u[0],h[1]-u[1])||1,_=(h[0]-u[0])/p,m=(h[1]-u[1])/p,g=s[f]*.42,b=n.range(1.5,3.5);o+=F(_e([[d[0]-m*g,d[1]+_*g],[d[0]+_*b,d[1]+m*b],[d[0]+m*g,d[1]-_*g]]),L.barkDark,1.4,.85)}o+=F(_e(bi(i.slice(3),6)),L.barkDark,1.3,.7),o+=F(_e(bi(i.slice(1,31),-3)),L.violet,1.8,.45),o+=F(_e(bi(i.slice(9,18),8)),L.violet,1.2,.4);for(const f of[9,16,23]){const u=i[f];o+=F(ge(u[0]+n.range(-3,3),u[1]+n.range(-3,3),2.8,4),L.barkDark,1.3,.9)}let c=pn(168,107,152,5,.35);for(const[f,u,h]of[[60,104,-8],[118,104,6],[176,105,-7],[214,108,10],[262,106,12]])c+=k(j([[f,u-4],[f+h*.6,u+1],[f+h,u+4]],4,1.4),$t,{stroke:2,sx:1,sy:1});c+=k(a,$t,{sx:2,sy:6,hx:2,hy:3,stroke:3.8,over:o});const l=i[i.length-1];return c+=ot(l[0],l[1],12,L.violet,.35),c})}const pf=[[[60,246],[84,206],[100,160],[104,110],[110,70],[118,40]],[[112,240],[118,200],[122,150],[124,100],[130,60],[134,28]],[[168,244],[164,200],[160,150],[158,100],[156,60],[152,26]],[[236,238],[208,200],[192,150],[186,100],[182,56]]];function u_(){return ct("prop.fossilroot",300,260,"bc",n=>{const e=yt([[0,260,1],[0,257],[24,250],[50,237],[72,216],[86,188],[93,150],[95,112],[99,80],[106,54],[111,40,1],[117,28,1],[124,14,1],[131,25,1],[140,6,1],[148,22,1],[157,11,1],[164,27,1],[176,19,1],[183,38,1],[194,58],[197,96],[199,138],[206,178],[224,212],[252,236],[280,249],[300,256],[300,260,1]]),t=[j([[80,226],[48,244],[16,252],[-8,256]],34,8),j([[222,222],[256,240],[288,250],[308,254]],30,8)];let i="";for(const c of pf)i+=F(_e(c.map(([l,f])=>[l+n.range(-2,2),f])),Cs.shade,2,.9);for(const c of pf.slice(0,3))i+=F(_e(bi(c,9).slice(1,5)),Cs.light,1.4,.55);for(const[c,l,f]of[[118,58,18],[178,150,16],[104,196,22],[160,222,18]])i+=F(ve([[c,l],[c+3,l+f*.4],[c-1,l+f*.7],[c+2,l+f]],!1),Mt,1.6,.8);const s=re([[168,22],[184,40],[194,60],[197,100],[199,140],[207,180],[226,214],[256,238],[300,256],[300,264],[176,264],[180,220],[174,170],[170,110],[170,60]]);let r=pn(150,258,150,4,.35);r+=Bs([...t,e],Cs,{sx:5,sy:3,hx:3,hy:2,shadeD:s,inner:i},4);const a={fill:"#262131",shade:"#1b1824",light:"#322c40"};for(const c of[[[112,150],[104,190],[84,222],[52,244],[18,256]],[[182,146],[192,188],[212,220],[244,242],[280,255]]])r+=k(Da(c,[4,12,18,20,16]),Cs,{sx:3,sy:3,hx:2,hy:1,stroke:3.2,over:F(_e(bi(c,3).slice(1)),Cs.shade,1.4,.8)});r+=k(ge(158,118,9,13),a,{sx:-3,sy:-3,hx:0,hy:0,stroke:3});const o=(c,l,f,u,h,d)=>{let p=k(ge(c,l+1,h*.42,h*.22),a,{stroke:2.4,sx:0,sy:0,hx:0,hy:0});p+=sn({x:c-5,y:l,len:h*.62,w:h*.34,ang:f-.42},u,2.4),p+=sn({x:c+5,y:l,len:h*.7,w:h*.34,ang:f+.4},u,2.4);const _={x:c,y:l+2,len:h,w:h*.42,ang:f};return p+=sn(_,u,2.6,d?ms(d,...ka(_,.44),h*.36,f-Math.PI/2+.4,.6):""),p};return r+=o(98,96,-1.15,At.teal,22),r+=o(192,118,1.1,At.blue,22),r+=o(116,150,-.35,At.teal,34,"bird"),r+=sn({x:140,y:18,len:20,w:9,ang:.2},At.blue,2.2),r+=sn({x:131,y:24,len:14,w:8,ang:-.5},At.teal,2),r})}function Fl(n,e,t){return ct(n,120,100,"bc",i=>{const s=h=>({...h,ang:h.ang+i.range(-.06,.06),len:h.len*i.range(.94,1.04)});let r=ot(60,60,54,e.light,.24);const a=s({x:60,y:93,len:82,w:28,ang:.05}),o=[s({x:24,y:92,len:30,w:14,ang:-.75}),s({x:98,y:92,len:28,w:13,ang:.8}),s({x:40,y:92,len:54,w:20,ang:-.36}),s({x:82,y:92,len:60,w:21,ang:.32})];for(const h of o)r+=sn(h,e,3);const[c,l]=ka(a,.46,-1);r+=sn(a,e,3.2,ms(t,c,l,21,t==="fish"?-1.2:-.35,.62));const f={fill:"#4a4458",shade:"#383346",light:"#5c566c"},u={fill:"#7a7490",shade:"#5a546e",light:"#948ea8"};r+=k(re([[6,101],[12,93],[30,89],[50,91],[72,88],[94,90],[110,93],[116,101]]),f,{sx:0,sy:3,hx:0,hy:2,stroke:3});for(const[h,d,p]of[[18,96,6],[76,95,5],[104,97,4.5]])r+=gs(h,d,p,i,u,1.8);return r})}function d_(){return ct("prop.pool.poison",560,90,"bc",n=>{const t=f=>8+2.6*Math.sin(f/34+.6)+1.6*Math.sin(f/13.5+2.1),i=[];for(let f=0;f<=560;f+=8)i.push([f,t(f)]);const s=_e(i)+"L560 90L0 90Z";let r="M0 -10H560";for(let f=i.length-1;f>=0;f--)r+=`L${Oe(i[f][0])} ${Oe(i[f][1])}`;r+="Z";let a="";for(const[f,u,h,d]of[[62,84,-.22,At.teal],[84,46,.42,At.teal],[214,64,.2,At.orange],[232,40,.6,At.orange],[470,86,.1,At.teal],[446,52,-.5,At.blue],[528,44,.35,At.teal]])a+=sn({x:f,y:92,len:u,w:u*.3,ang:h},d,2.8);let o=a;o+=xe(s,"#2e6a63",.74);const c=[];for(let f=0;f<=560;f+=20)c.push([f,50+Math.sin(f/40)*5]);o+=xe(_e(c)+"L560 90L0 90Z","#1f4a47",.5),o+=ot(150,42,70,L.crystalTeal,.28)+ot(410,50,80,L.crystalTeal,.24),o+=ms("fish",330,62,22,.3,.35,"#9fe3d8"),o+=ms("fish",118,70,16,-2.6,.3,"#9fe3d8"),o+=Cc(r,a);const l=i.map(([f,u])=>[f,u+5]);o+=xe(_e(i)+_e(l.slice().reverse()).replace("M","L")+"Z","#6fc4b1",.75);for(let f=12;f<560;f+=n.range(40,70)){const u=n.range(14,30);o+=F(_e(Vr(l,f/560,Math.min(1,(f+u)/560),5).map(([h,d])=>[h,d+3])),"#b8f0e2",2,.7)}o+=F(_e(i),Mt,3.2),o+=F(_e(i.map(([f,u])=>[f,u+2.2])),"#b8f0e2",1.4,.8);for(let f=0;f<16;f++){const u=n.range(10,550),h=t(u)+n.range(-1,3);f%2?o+=xe(ge(u,h,n.range(5,11),n.range(1.5,2.5)),"#9ad8b8",.55):o+=k(Et(u,h-1.5,n.range(2.5,5)),{fill:"#62b9a6",shade:"#3f8f80",light:"#d6fff2"},{stroke:1.6,sx:1,sy:1,hx:1,hy:1,opacity:.9})}for(let f=0;f<12;f++){const u=n.range(10,550);o+=F(Et(u,n.range(22,80),n.range(1.2,3)),"#b8f0e2",1.2,n.range(.35,.7))}return o})}const _a={fill:"#5d5272",shade:"#443b57",light:"#7a6c90"},mf=[[[[256,902],[232,876],[204,858],[166,848],[128,843],[100,838],[84,826]],34,7],[[[268,800],[290,770],[322,748],[364,738],[412,733],[456,731],[488,726],[502,712]],30,6],[[[258,684],[238,658],[208,640],[166,630],[126,626],[98,622],[82,610]],26,6]],p_=[[[[264,572],[286,546],[322,526],[366,516],[414,512],[458,510],[490,505],[504,492]],22,5],[[[258,462],[236,436],[204,418],[162,408],[124,404],[98,400],[84,388]],20,5],[[[264,350],[288,324],[326,304],[370,294],[420,291],[466,290],[496,285],[508,272]],18,5],[[[258,240],[238,214],[206,196],[166,186],[128,182],[104,178],[92,166]],16,4],[[[264,132],[288,104],[326,84],[372,74],[424,71],[474,70],[506,68],[520,60]],14,5]],m_=[[[[262,562],[300,534],[338,508],[368,480]],12,3],[[[318,522],[328,500],[334,486]],5,2],[[[256,508],[224,480],[196,452],[176,422]],11,3],[[[208,464],[194,470],[178,468]],4,1.5],[[[262,442],[292,416],[312,386]],9,2.5],[[[258,392],[238,364],[226,336]],8,2.5],[[[242,370],[252,352],[256,340]],4,1.5]],g_=[[[[222,900],[190,926],[150,936],[108,941]],32,6],[[[300,900],[332,924],[372,934],[414,941]],32,6],[[[238,916],[220,934],[200,942]],22,8],[[[284,914],[300,932],[318,942]],22,8]],rs=n=>260+Math.sin(n/110+.8)*9,po=n=>16+84*Math.pow(Math.max(0,n-30)/910,1.15)+Math.pow(Math.max(0,n-858),1.5)*.1;function dc(n,e,t,i,s,r="#f0c75e"){return k(V4(n,e,t,5,s.range(0,1.2)),i,{sx:t*.18,sy:t*.2,hx:t*.1,hy:t*.1,stroke:t>9?2.4:2,light:t>12?i.light:""})+_t(n,e,t*.26,r)+F(Et(n,e,t*.26),Mt,1.2)}function __(n,e,t){const i={fill:"#f3dc8a",shade:"#d6b25a",light:"#fff4c8"};return k(re([[n-t,e+.3*t],[n-.8*t,e-.5*t],[n,e-.8*t],[n+.8*t,e-.4*t],[n+t,e+.3*t],[n,e+.6*t]]),i,{stroke:1.8,sx:1,sy:1.2,hx:.8,hy:.8})+k(Et(n+.35*t,e-1.05*t,.62*t),i,{stroke:1.8,sx:.8,sy:.8,hx:.6,hy:.6,over:F(_e([[n+.3*t,e-1.15*t],[n+.48*t,e-1.05*t],[n+.66*t,e-1.15*t]]),Mt,1)})+xe(ve([[n+.92*t,e-1.12*t],[n+1.38*t,e-.95*t],[n+.92*t,e-.8*t]]),"#e3913f")+F(_e([[n-.5*t,e-.1*t],[n-.1*t,e+.15*t],[n+.3*t,e-.05*t]]),"#c9a04a",1.1)}function Nh(n,e,t,i=!0){const s=[];for(let o=0;o<10;o++)s.push(it(n,e+t*.05,o%2?t*.68:t,-Math.PI/2+o*Math.PI/5));const r=t/10.5,a=i?F(_e([[n-4.8*r,e-.3*r],[n-3.4*r,e+.8*r],[n-2*r,e-.3*r]]),"#6b4f2a",1.1)+F(_e([[n+2*r,e-.3*r],[n+3.4*r,e+.8*r],[n+4.8*r,e-.3*r]]),"#6b4f2a",1.1)+_t(n-5.2*r,e+2.8*r,1.4*r,"#f2a7a0",.7)+_t(n+5.2*r,e+2.8*r,1.4*r,"#f2a7a0",.7)+F(_e([[n-r,e+3.7*r],[n,e+4.3*r],[n+r,e+3.7*r]]),"#6b4f2a",.9):"";return k(re(s,.75),{fill:"#fff4cf",shade:"#f1d48f",light:"#ffffff"},{stroke:1.8,ink:"#8a6a3a",sx:1.2,sy:1.4,hx:.8,hy:.8,over:a})}function gf(n){return ct(n?"prop.crystaltree.bloom":"prop.crystaltree",520,940,"bc",e=>{const t=n?28:246,i=[],s=[];for(let E=0;E<=26;E++){const v=Kn(934,t,E/26);i.push([rs(v),v]),s.push(po(v)*(n?1:Math.min(1,Math.max(.32,(v-t)/90))))}const r=Da(i,s),a=n?[...mf,...p_]:[...mf,...m_],o=[...g_,...a];let c="";for(const[E,v]of[[-.34,0],[-.12,2],[.14,4],[.33,1]]){const S=i.map(([T,P],x)=>[T+s[x]*E+Math.sin(P/38+v)*4,P]);c+=F(_e(S),_a.shade,1.7,.8)}for(let E=0;E<26;E++){const v=e.range(t+40,900),S=rs(v)+po(v)*e.range(-.35,.3);c+=F(_e([[S-5,v],[S,v-1.8],[S+5,v]]),_a.shade,1.4,.8)}for(const[E]of o)c+=F(_e(Vr(bi(E,3),.1,.9,6)),_a.shade,1.3,.7);const l=(E,v)=>F(_e(E),L.crystalTeal,v*3,.18)+F(_e(E),L.crystalTealLight,v,.85);let f=l(i.slice(0,n?25:22).map(([E,v],S)=>[E-s[S]*.08+Math.sin(v/31)*3.5,v]),1.8);f+=l(i.slice(1,12).map(([E,v],S)=>[E+s[S+1]*.26+Math.sin(v/23)*3,v]),1.2);for(const[E]of a)E.length>4&&(f+=l(Vr(bi(E,-1),.02,.86,8),1.2));const u=Da(i.map(([E,v],S)=>[E+s[S]*.32,v]),s.map(E=>E*.38));let h=pn(260,938,160,6,.3);h+=Bs([...o.map(([E,v,S])=>j(E,v,S)),r],_a,{sx:5,sy:4,hx:3,hy:2,inner:c},4.2),h+=Cc(r,xe(u,_a.shade,.85)+c),h+=f;for(const[E,v,S,T]of[[790,1,30,At.blue],[742,-1,26,At.teal],[652,1,24,At.teal],[560,-1,20,At.blue]]){if(!n&&E<t+60)continue;const P=rs(E)+v*po(E)*.42;h+=sn({x:P-v*3,y:E+4,len:S*.6,w:S*.34,ang:v*.35},T,2.4),h+=sn({x:P,y:E,len:S,w:S*.4,ang:v*.95},T,2.6)}const d=rs(872)+2;h+=k(ge(d,874,13,19),{fill:"#221c2e",shade:"#161220",light:"#2f2740"},{sx:-4,sy:-4,hx:0,hy:0,stroke:3.2}),n?(h+=ot(d,874,64,"#ffe9a8",.6),h+=Nh(d,874,11,!1)):h+=ot(d,878,10,L.crystalTeal,.35);const p={x:330,y:936,len:58,w:24,ang:.42};if(h+=sn({x:312,y:936,len:34,w:15,ang:.05},At.blue,3),h+=sn(p,At.teal,3,ms("bird",...ka(p,.45),20,-.3,.6)),h+=sn({x:350,y:938,len:26,w:12,ang:.95},At.teal,2.6),h+=sn({x:186,y:938,len:32,w:14,ang:-.55},At.blue,2.8),h+=sn({x:202,y:938,len:20,w:10,ang:-.15},At.teal,2.4),!n){for(const[v,,S]of a){const T=v[v.length-1],P=v[v.length-2],x=Math.atan2(T[0]-P[0],-(T[1]-P[1]));h+=sn({x:T[0],y:T[1],len:16+S*2,w:9+S,ang:x,shoulder:.55},e.chance(.5)?At.teal:At.blue,2.4)}for(const[v,S,T]of[[150,858,22],[192,864,16],[344,752,20],[428,744,24],[142,640,22],[186,646,15]])h+=sn({x:v,y:S,len:T,w:T*.5,ang:Math.PI+e.range(-.15,.15),shoulder:.55},e.chance(.6)?At.teal:At.blue,2.4);const E=rs(t);return h+=sn({x:E-6,y:t+26,len:18,w:10,ang:-.6,shoulder:.55},At.teal,2.2),h+=sn({x:E+6,y:t+28,len:16,w:9,ang:.7,shoulder:.55},At.teal,2.2),h+=sn({x:E,y:t+18,len:30,w:14,ang:.05,shoulder:.55},At.blue,2.6),h}const _=[{fill:"#f4ecdf",shade:"#d8c8b2",light:"#ffffff"},{fill:"#ebb5c6",shade:"#c98c9f",light:"#f9dbe4"},{fill:"#c9a8ee",shade:"#a07fcb",light:"#e6d4fb"}],m={fill:"#7fb39a",shade:"#5f8f7d",light:"#a6d4bb"},g=[],b=(E,v,S,T,P,x)=>{for(let A=0;A<S;A++)g.push([E+e.range(-x,x),v+e.range(-x,x)*.7,e.range(T,P)])};for(const[E]of a){const v=E[E.length-1];b(v[0],v[1]+6,4,11,15,13);for(let S=2;S<E.length-1;S++){const T=E[S];g.push([T[0]+e.range(-8,0),T[1]+21+e.range(0,6),e.range(9,14)]),e.chance(.6)&&g.push([T[0]+e.range(4,14),T[1]+30+e.range(0,8),e.range(7,11)])}b(E[1][0],E[1][1]+16,3,9,13,10)}for(let E=80;E<860;E+=e.range(40,60)){const v=e.chance(.5)?-1:1;g.push([rs(E)+v*po(E)*e.range(.25,.45),E,e.range(9,12)])}b(rs(40),46,13,12,18,30);for(const[E,v,S]of g){if(!e.chance(.5))continue;const T=e.range(0,Math.PI*2),P=it(E,v,S*1.9,T);h+=k(re([[E,v],it(E,v,S*.95,T-.5),P,it(E,v,S*.95,T+.5)]),m,{stroke:1.8,sx:1,sy:1,hx:.8,hy:.8})}h+=ot(rs(50),50,96,"#f9d9e6",.35),g.forEach(([E,v,S],T)=>{h+=dc(E,v,S,_[T%3],e)});for(const[E,v]of[[84,822],[500,708],[82,606],[86,384],[92,162],[rs(40)+2,24]])h+=dc(E,v,17,_[0],e)+__(E,v-3,7);for(let E=0;E<20;E++){const v=e.range(30,500),S=e.range(60,900);h+=na(`transform="rotate(${Oe(e.range(0,180))} ${Oe(v)} ${Oe(S)})"`,k(ge(v,S,3.8,2.2),_[E%3],{stroke:1.4,sx:.6,sy:.6,hx:0,hy:0}))}return h})}function M_(){return ct("prop.star",40,40,"c",()=>ot(20,20,20,"#ffe9a8",.8)+ot(20,20,11,"#ffffff",.6)+Nh(20,20,10.5))}const pi={fill:L.leaf,shade:L.leafDark,light:L.leafLight},Ia={fill:"#5f5a70",shade:"#46415a",light:"#7a7590"};function Os(n,e,t,i,s,r){return na(`transform="translate(${n} ${e}) scale(1 ${Oe(i/t)}) translate(${-n} ${-e})"`,ot(n,e,t,s,r))}function ia(n,e=1.8){return n.map(([t,i])=>ot(t,i,e*4,L.violet,.45)+_t(t,i,e,L.vein)).join("")}function Ci(n,e,t,i,s=pi,r=4,a=1.8){let o="";for(let c=0;c<r;c++){const l=(c-(r-1)/2)*3,f=i.range(-.5,.5)+l*.08,u=t*i.range(.6,1);o+=k(j([[n+l,e+1],[n+l+f*u*.4,e-u*.5],[n+l+f*u,e-u]],3.2,.6),s,{stroke:a,sx:.8,sy:0,hx:.5,hy:0})}return o}function _f(n,e,t,i){return k(Ke(n-.18*t,e-.9*t,.36*t,.9*t,.15*t),ir,{stroke:1.6,sx:.8,sy:0,hx:.5,hy:0})+k(`M${n-.7*t} ${e-.8*t}Q${n-.6*t} ${e-1.5*t} ${n} ${e-1.55*t}Q${n+.6*t} ${e-1.5*t} ${n+.7*t} ${e-.8*t}Z`,i,{stroke:1.6,sx:.8,sy:.8,hx:.6,hy:.6,over:_t(n-.25*t,e-1.2*t,.1*t+.4,L.vein)+_t(n+.22*t,e-1.05*t,.08*t+.4,L.vein)})}function v_(){return ct("prop.log",160,60,"bc",n=>{const e={fill:"#4f4353",shade:"#3a3040",light:"#67586b"},t={fill:"#8a7563",shade:"#6b5849",light:"#a38c78"};let i=pn(80,58,76,3,.4);const s=yt([[16,26,1],[144,26,1],[144,58,1],[24,58,1],[17,54],[9,51,1],[15,46,1],[5,40,1],[14,35,1],[8,30,1]]);let r="";for(const o of[33,40,47,53]){const c=[];for(let l=20;l<=140;l+=20)c.push([l+n.range(-3,3),o+n.range(-1.5,1.5)]);r+=F(_e(Vr(c,n.range(0,.2),n.range(.7,1),6)),e.shade,1.5,.9)}r+=F(ge(70,44,5,3.5),e.shade,1.6)+xe(ge(70,44,2.2,1.5),"#231d29"),i+=k(s,e,{sx:0,sy:6,hx:0,hy:2.5,inner:r}),i+=k(j([[104,46],[111,52],[117,55]],9,5),e,{stroke:2.6,sx:1.5,sy:1.5}),i+=k(ge(118,55.5,3,2.4),t,{stroke:1.8,sx:0,sy:0,hx:0,hy:0}),i+=k(ge(144,42,8.5,16),t,{sx:2,sy:2,hx:1,hy:1,stroke:3,over:F(ge(144,42,5.5,10.5),t.shade,1.3)+F(ge(144,42,2.5,5),t.shade,1.2)+F("M144 42L150 30",Mt,1.2)});const a=yt([[22,26,1],[130,26,1],[132,30],[124,35],[116,31],[106,38],[96,32],[86,35],[74,31],[64,40],[54,32],[44,36],[34,31],[26,33]]);return i+=k(a,pi,{sx:0,sy:2.5,hx:0,hy:1.5,stroke:2.4,over:_t(60,29,1.2,L.leafLight)+_t(98,29,1.2,L.leafLight)}),i+=Ci(40,27,7,n)+Ci(112,27,6,n,pi,3),i+=_f(30,58,8,{fill:"#b6a3c9",shade:"#8d7aa3",light:"#d5c7e3"})+_f(40,58,5.5,{fill:"#b6a3c9",shade:"#8d7aa3",light:"#d5c7e3"}),i+=ia([[82,30],[50,30.5],[121,29.5]],1.3),i})}function mo(n,e,t,i,s=0){const r=(a,o)=>[n+(a*Math.cos(s)-o*Math.sin(s))*t,e+(a*Math.sin(s)+o*Math.cos(s))*t*i];return _e([r(-.62,-.62),r(-.8,0),r(-.52,.62),r(0,.95)])+_e([r(.62,-.62),r(.8,0),r(.52,.62),r(0,.95)])+_e([r(-.5,-.2),r(-.32,-.13),r(-.14,-.18)])+_e([r(.14,-.18),r(.32,-.13),r(.5,-.2)])+_e([r(.02,-.08),r(-.05,.25),r(.08,.3)])+_e([r(-.2,.55),r(0,.52),r(.2,.55)])}function x_(){return ct("prop.mempool",200,60,"bc",n=>{const e={fill:"#a49bd2",shade:"#7b71ab",light:"#ddd6f6"};let t=Os(100,40,90,40,"#b9a3e8",.4);for(const[s,r]of[[12,34],[20,44],[28,30],[176,38],[186,46],[194,28]])t+=k(j([[s,56],[s+n.range(-2,2),56-r*.6],[s+n.range(-5,5),56-r]],4,1),pi,{stroke:1.8,sx:1,sy:0});t+=ia([[20,14],[186,12],[30,26]],1.6);for(const[s,r,a]of[[28,36,7],[48,31,6],[74,29,5.5],[102,28,6],[130,29,5.5],[154,31,6],[173,36,7]])t+=gs(s,r,a,n,Ia,2.2);const i=F(mo(82,42,15,.42,-.25),"#f3eeff",1.3,.42)+F(mo(104,43,19,.4,.1),"#f3eeff",1.4,.35)+F(mo(124,41,13,.45,.35),"#f3eeff",1.2,.4)+F(mo(66,44,9,.45,.5),"#f3eeff",1.1,.3);t+=k(ge(100,42,80,13),e,{sx:0,sy:-5,hx:0,hy:0,stroke:3,inner:ot(100,44,40,"#ffffff",.35),over:i+F("M40 46H66M136 38H164M58 51H80",e.light,1.5,.8)});for(const[s,r,a]of[[22,52,8],[44,56,7],[70,57,6.5],[98,58,7.5],[126,57,6.5],[152,56,7],[178,52,8]])t+=gs(s,r,a,n,Ia,2.4);return t+=Ci(58,56,8,n)+Ci(140,56,9,n)+Ci(112,59,6,n,pi,3),t})}function $h(n,e,t,i,s=11){const r=[];for(let a=0;a<s;a++){const o=a/s*Math.PI*2+i.range(-.1,.1);r.push(it(n,e,t*i.range(.95,1.05),o));const c=it(0,0,t*.88,o+Math.PI/s);r.push([n+c[0],e+c[1]])}return re(r,1)}function y_(n,e,t,i,s,r=11){let a="";for(let o=0;o<Math.round(t/12);o++){const c=it(n,e,t*s.range(.1,.7),s.range(0,Math.PI*2)),l=s.range(4,7);a+=F(`M${Oe(c[0]-l)} ${Oe(c[1]-2)}Q${Oe(c[0])} ${Oe(c[1]+3)} ${Oe(c[0]+l)} ${Oe(c[1]-2)}`,i.shade,1.6,.9)}return k($h(n,e,t,s,r),i,{sx:t*.14,sy:t*.2,hx:3,hy:4,stroke:3.2,inner:a})}function S_(){return ct("prop.tree",360,520,"bc",n=>{const e={fill:"#b39aa8",shade:"#937c8b",light:"#cdb9c3"},t={fill:"#97b894",shade:"#7fa27f",light:"#b6cfae"},i={fill:"#b4d19b",shade:"#8fb582",light:"#cfe3b8"};let s=pn(180,518,90,4,.35);const r=[[98,150,66],[262,140,68],[180,84,74],[56,222,46],[308,214,46],[180,206,64],[120,250,40],[246,250,40]].map(([f,u,h])=>$h(f,u,h,n));s+=Bs(r,t,{sx:12,sy:16,hx:3,hy:4},3.2);const a=[[180,524],[177,470],[182,410],[178,340],[182,280],[180,236]],o=[j([[176,290],[150,244],[118,204],[90,172]],22,8),j([[184,282],[214,236],[248,196],[272,160]],22,8),j([[180,250],[184,190],[178,130],[182,96]],20,8),j([[172,330],[140,318],[106,322],[80,306]],12,4),j([[188,350],[222,342],[258,348],[284,334]],12,4)],c=[j([[160,500],[136,514],[108,522]],24,6),j([[200,500],[226,514],[254,522]],24,6),j([[176,508],[172,522]],20,12)],l=F(_e([[172,510],[168,440],[174,370],[170,300]]),e.shade,1.8)+F(_e([[190,500],[192,430],[188,360]]),e.shade,1.6)+F(ge(184,420,5,8),e.shade,1.6)+xe(ge(184,420,2.5,4.5),Mt);s+=Bs([...c,...o,Da(a,[72,52,44,40,34,28])],e,{sx:7,sy:2,hx:3,hy:1,inner:l},3.6);for(const[f,u,h]of[[128,214,52],[240,208,54],[116,118,50],[248,108,50],[184,50,44],[64,180,36],[300,176,36]])s+=y_(f,u,h,i,n);return s+=ia([[96,120],[150,186],[238,88],[270,214],[60,186],[206,40],[118,244],[300,150]],1.9),s})}function Ma(n,e,t,i,s,r=9){const a=[[n-t,e+6,1]];for(let o=0;o<=r;o++){const c=Math.PI+o/r*Math.PI;if(a.push([n+Math.cos(c)*t*s.range(.95,1.08),e+Math.sin(c)*i*s.range(.92,1.1),1]),o<r){const l=c+Math.PI/r/2;a.push([n+Math.cos(l)*t*.8,e+Math.sin(l)*i*.78])}}return a.push([n+t,e+6,1]),yt(a)}function b_(){return ct("prop.bush",200,90,"bc",n=>{const e={fill:"#a9c89c",shade:"#8db083",light:"#c6ddb7"},t={fill:"#8fb48c",shade:"#78a079",light:"#afcca6"};let i="";for(const[s,r,a,o]of[[62,58,52,24],[134,58,148,22],[104,50,100,16]]){const c=[Kn(s,a,.5)+3,Kn(r,o,.5)];i+=F(_e([[s,r],c,[a,o]]),Mt,2.6)+F(_e([[s,r],c,[a,o]]),t.fill,1.2);for(const l of[.55,.8,1]){const f=[Kn(s,a,l),Kn(r,o,l)],u=l===.8?-1:1;i+=k(re([f,[f[0]+u*6,f[1]-5],[f[0]+u*11,f[1]-3],[f[0]+u*6,f[1]+1]]),e,{stroke:2,sx:.8,sy:1,hx:0,hy:1.5})}}return i+=k(Ma(150,90,42,42,n),t,{sx:4,sy:6,hx:0,hy:3,stroke:3.2}),i+=k(Ma(46,90,40,38,n),t,{sx:4,sy:6,hx:0,hy:3,stroke:3.2}),i+=k(Ma(100,90,52,52,n,11),e,{sx:5,sy:7,hx:1,hy:3,stroke:3.4}),i+=k(Ma(178,90,20,24,n,6),e,{sx:3,sy:4,hx:0,hy:2.5,stroke:3}),i+=k(Ma(18,90,18,20,n,6),e,{sx:3,sy:4,hx:0,hy:2.5,stroke:3}),i+=ia([[88,52],[150,62]],1.4),i})}function Mf(n){return ct(n?"prop.plate.down":"prop.plate",120,24,"bc",()=>{const e={fill:"#4f4a5d",shade:"#3a3548",light:"#686279"},t={fill:"#7c768c",shade:"#625c73",light:"#9791aa"},i={fill:"#5f596f",shade:"#48435a",light:"#6f6982"},s=n?15:9;let r=k(ge(60,17,57,6.5),e,{stroke:2.6,sx:0,sy:2,hx:0,hy:1});r+=xe(ge(60,16,49,4.6),"#1f1c2a"),r+=k(`M14 ${s}A46 6 0 0 0 106 ${s}V${s+7}A46 6 0 0 1 14 ${s+7}Z`,i,{stroke:2.6,sx:3,sy:0,hx:0,hy:0});const a=ge(60,s,28,3.4),o=[0,1,2,3,4,5].map(f=>{const u=f/6*Math.PI*2+.3,h=it(0,0,14,u),d=it(0,0,23,u);return`M${Oe(60+h[0])} ${Oe(s+h[1]*.13)}L${Oe(60+d[0])} ${Oe(s+d[1]*.13)}`}).join(""),c=ge(60,s,7,1.6),l=n?F(a+o+c,L.violet,4,.55)+F(a+o+c,L.vein,1.8)+_t(60,s,1.4,"#ffffff"):F(a+o+c,L.violetDark,2.2,.9)+F(a,L.violet,1,.7);return r+=k(ge(60,s,46,6),t,{stroke:2.6,sx:0,sy:-2,hx:0,hy:0,over:l}),r+=k("M3 17A57 6.5 0 0 0 117 17L109 16A49 4.6 0 0 1 11 16Z",e,{stroke:2.6,sx:0,sy:2,hx:0,hy:1.5}),n&&(r+=Os(60,s,52,14,L.violet,.55)+Os(60,s,26,6,L.vein,.5)),r})}function T_(){return ct("prop.shrine",70,110,"bc",n=>{const e={fill:"#6c667c",shade:"#514b62",light:"#88829a"};let t=pn(35,108,32,3,.35);t+=k(Ke(5,95,60,15,4),e,{sx:0,sy:4,hx:0,hy:2,over:F("M14 101l4 4M50 99l-3 5",e.shade,1.3)}),t+=k("M15 96L18 36H52L55 96Z",e,{sx:5,sy:0,hx:2,hy:0,over:F("M22 44l2 10l-2 8M47 70l-2 9",Mt,1.4,.8)});const i=35,s=64;let r="";const a=[];for(let c=0;c<=18;c++)a.push(it(i,s,1.5+c*.42,c*.62));r=_e(a);let o="";for(let c=0;c<6;c++){const l=c/6*Math.PI*2-Math.PI/2,f=it(i,s,13.5,l);o+=`M${Oe(f[0])} ${Oe(f[1]-2)}l${Oe(Math.cos(l+1.6)*2)} ${Oe(Math.sin(l+1.6)*2+3)}`}return t+=ot(i,s,22,L.violet,.4),t+=F(Et(i,s,11)+r+o,L.violetDark,3.4,.8)+F(Et(i,s,11)+r+o,L.vein,1.5),t+=k(Ke(8,24,54,14,4),e,{sx:0,sy:4,hx:0,hy:2}),t+=k(ge(35,25,16,4),{fill:"#3a3548",shade:"#2a2638",light:"#4a4458"},{stroke:2.4,sx:0,sy:-2,hx:0,hy:0,inner:Os(35,25,16,4,L.violet,.5)}),t+=k(yt([[10,30,1],[18,26],[30,28],[26,32],[14,33,1]]),pi,{stroke:2,sx:.8,sy:1.2,hx:0,hy:.8}),t+=k(yt([[40,97,1],[50,94],[62,96],[58,100],[44,100,1]]),pi,{stroke:2,sx:.8,sy:1.2,hx:0,hy:.8}),t+=Ci(8,108,7,n,pi,3,1.6)+Ci(63,108,8,n,pi,3,1.6),t})}function E_(){return ct("prop.stone",64,64,"bc",n=>{const e={fill:"#7b7389",shade:"#5a5368",light:"#978fa6"};let t=pn(32,62,29,3,.4);const i=_e([[20,31],[24.5,32.5],[29,31]])+_e([[36,31],[40.5,32.5],[45,31]])+_e([[32.5,33],[31,40],[34,41]])+_e([[27,47],[32.5,46.5],[38,47]])+_e([[14,44],[13,30],[20,20],[32,17],[44,20],[51,30],[50,44],[42,53]]);return t+=k(re([[6,60],[3,46],[7,28],[18,13],[33,8],[48,12],[58,25],[61,43],[58,60],[32,62]]),e,{sx:5,sy:5,hx:3,hy:3,over:F("M50 34l3 6l-2 6M12 48l4 3",e.shade,1.5)+ot(32,36,22,L.violet,.3)+F(i,L.violet,3,.35)+F(i,L.vein,1.2,.6)+xe(yt([[16,16,1],[26,10],[40,9],[50,13],[44,16],[34,14],[22,18,1]]),pi.fill)+_t(27,11.5,1.1,pi.light)+_t(40,11,1,pi.light)}),t+=Ci(8,62,7,n,pi,3,1.6)+Ci(56,62,6,n,pi,3,1.6),t})}function vf(n){return ct(n?"prop.knot.calm":"prop.knot",110,90,"bc",e=>{let t=pn(55,88,50,3,.4);const i=n?.9:1;for(const c of[[[36,70],[20,80],[2,88]],[[74,70],[92,80],[110,88]],[[50,78],[44,86],[38,90]],[[64,78],[70,86],[78,90]]])t+=k(j(c,16,6),$t,{stroke:3,sx:2,sy:2,hx:1,hy:1});n||(t+=Os(55,88,40,5,L.violet,.5)+k(ge(40,87,14,2.6),as,{stroke:1.8,sx:0,sy:1,hx:0,hy:.6}));const s=[];for(let c=0;c<12;c++){const l=c/12*Math.PI*2,f=c%3===0?1.08:.96;s.push([55+Math.cos(l)*36*f*i,50+Math.sin(l)*32*f*i*(Math.sin(l)>0?.9:1)])}const r=[[[36,34],[44,42],[42,52],[50,60]],[[66,26],[62,36],[70,44]],[[74,54],[80,62],[76,70]]],a=[[[28,44],[38,38],[50,36],[58,30],[64,22]],[[34,62],[46,66],[60,64],[72,70]],[[70,40],[80,46],[86,56]],[[50,36],[48,26],[52,20]]];let o=F(ge(38,60,3.5,5),L.barkDark,1.4)+F(_e([[76,30],[84,36],[86,44]]),L.barkDark,1.4);if(n){for(const c of r)o+=F(_e(c),L.barkDark,1.6);for(const c of a)o+=F(_e(c),"#6f5a80",2.4,.5)}else{o+=ot(55,48,36,L.violet,.45);for(const c of r){const l=j(c,3,6);o+=xe(l,L.violet)+F(l,Mt,1.4)+F(_e(c),L.vein,1.3)}for(const c of a)o+=F(_e(c),Mt,5)+F(_e(c),L.violet,3.2)+F(_e(c),L.vein,1.1,.9)}if(t+=k(re(s),$t,{sx:6,sy:6,hx:3,hy:3,stroke:3.6,over:o}),n){const c={fill:"#6f9f86",shade:"#4f7f69",light:"#94c4a8"},l={fill:"#efe6f8",shade:"#c9b6dc",light:"#ffffff"};for(const[f,u,h]of[[40,22,-2.2],[70,20,-.9],[86,40,-.3],[26,42,3.3]]){const d=it(f,u,14,h);t+=k(re([[f,u],it(f,u,7,h-.5),d,it(f,u,7,h+.5)]),c,{stroke:1.8,sx:1,sy:1,hx:.6,hy:.6})}for(const[f,u,h]of[[46,18,6],[60,16,7],[78,26,5.5],[30,34,5],[88,50,4.5]])t+=dc(f,u,h,l,e,L.sun)}else{for(const[c,l,f]of[[50,61,14],[76,70,9],[44,52,8]])t+=k(re([[c-2.2,l],[c+2.2,l],[c+1.8,l+f*.7],[c+3,l+f],[c,l+f+4],[c-3,l+f],[c-1.8,l+f*.7]]),as,{stroke:1.8,sx:1,sy:1,hx:.8,hy:.8});t+=ia([[62,22],[30,50]],1.5)}return t})}function w_(){return ct("prop.river",400,60,"bc",n=>{const t={fill:"#7d8286",shade:"#62676c",light:"#9aa0a3"},i=o=>10+1.6*Math.sin(o/26+1)+Math.sin(o/9.5),s=[];for(let o=0;o<=400;o+=8)s.push([o,i(o)]);let r="";for(let o=0;o<24;o++)r+=gs(n.range(6,394),n.range(50,60),n.range(4,9),n,t,2);r+=xe(_e(s)+"L400 60L0 60Z","#6f8ba1",.55);const a=[];for(let o=0;o<=400;o+=20)a.push([o,30+Math.sin(o/50)*4]);r+=xe(_e(a)+"L400 52L0 52Z","#4e6a82",.3);for(let o=0;o<14;o++){const c=n.range(0,360),l=n.range(18,50),f=n.range(18,50);r+=F(_e([[c,l],[c+f*.5,l+n.range(-1.5,1.5)],[c+f,l]]),"#dbe6ec",n.range(1.2,2.2),n.range(.35,.7))}for(let o=0;o<5;o++){const c=n.range(30,370);r+=F(ge(c,i(c)+5,n.range(8,14),2),"#e7eff2",1.2,.5)}r+=F(_e(s),Mt,2.6,.85),r+=F(_e(s.map(([o,c])=>[o,c+2.2])),"#e6eef2",1.6,.85);for(const o of[4,396])for(let c=0;c<3;c++)r+=F(`M${o-5} ${14+c*5}q5 -3 10 0`,"#f0f5f7",1.6,.8);return r})}function A_(){return ct("prop.reflectpool",160,40,"bc",n=>{const e={fill:"#85878a",shade:"#66696e",light:"#a3a6a8"},t={fill:"#c3cdd1",shade:"#9aa7ad",light:"#eef3f3"};let i="";for(const[a,o,c]of[[18,22,6],[36,17,5.5],[58,14.5,5],[82,14,5.5],[106,14.5,5],[126,17,5.5],[144,22,6]])i+=gs(a,o,c,n,e,2);const s=[[14,22],[30,18.5],[40,20],[52,17.5],[66,19],[80,17],[96,19],[110,17.5],[124,19.5],[140,20],[146,24]];i+=k(ge(80,25,66,9),t,{sx:0,sy:-3.5,hx:0,hy:0,stroke:2.8,inner:xe(ge(80,27,50,3.5),"#e9eeee")+xe(_e(s)+"L146 16L14 16Z","#6f7d80",.55)+ot(104,26,10,"#fffbea",.8),over:F("M30 29H52M96 31H122M62 33H80","#f7fafa",1.4,.8)});for(const[a,o,c]of[[14,32,7],[34,35,6.5],[58,37,6],[84,37.5,7],[110,37,6],[132,35,6.5],[150,31,6.5]])i+=gs(a,o,c,n,e,2.2);const r={fill:"#58705f",shade:"#3f5346",light:"#76907c"};return i+=Ci(46,38,8,n,r)+Ci(122,38,9,n,r)+Ci(4,36,7,n,r,3),i})}const Ps={fill:"#3e312d",shade:"#2b2120",light:"#584740"};function R_(){return ct("prop.dormbed",190,80,"bc",()=>{const n={fill:"#5d4b3f",shade:"#43362d",light:"#7a6452"},e={fill:"#d6c7a8",shade:"#b3a283",light:"#eadfc6"},t={fill:"#9c8c74",shade:"#7d6f5b",light:"#b5a68c"},i=(a,o,c)=>k(j(a,o,c),Ps,{stroke:2.6,sx:1.5,sy:1.5,hx:1,hy:1,over:F(_e(bi(a,o*.15)),Ps.shade,1,.8)});let s=pn(95,78,92,3,.4);s+=xe(nn(8,34,174,44),Mt,.3),s+=i([[10,40],[40,56],[72,70],[100,80]],7,5),s+=i([[180,40],[150,58],[118,70],[92,80]],7,5),s+=i([[60,38],[70,54],[66,66],[74,80]],5,4),s+=i([[132,38],[122,52],[128,66],[120,80]],5,4),s+=i([[20,38],[48,48],[90,50],[132,46],[172,38]],6,5);for(const a of[1,181])s+=k(Ke(a,3,8,77,2.5),n,{sx:2.5,sy:0,hx:1.5,hy:0,stroke:3}),s+=k(ge(a+4,3,5.5,3.5),n,{stroke:2.4,sx:1,sy:1,hx:.8,hy:.8});s+=k(Ke(4,28,182,8,2),n,{sx:0,sy:2.5,hx:0,hy:1.5,stroke:3});let r="";for(let a=16;a<180;a+=8)r+=F(`M${a} 10V30`,"#c4b594",1.2);s+=k(Ke(10,10,170,19,5),e,{sx:0,sy:4,hx:0,hy:2,inner:r,over:F(_e([[70,16],[78,20],[92,18]]),e.shade,1.3)}),s+=k(yt([[14,11,1],[18,5],[30,3.5],[44,5],[48,11,1]]),e,{stroke:2.4,sx:1.5,sy:2,hx:1,hy:1}),s+=k(yt([[132,10,1],[178,10,1],[181,18],[178,27,1],[134,27,1],[131,18]]),t,{stroke:2.6,sx:2,sy:2.5,hx:0,hy:1.5,over:F("M134 18.5H179",t.shade,1.4)});for(const a of[1,181])for(const o of[44,58,70])s+=i([[a-2,o+4],[a+4,o],[a+10,o-4]],4,3);return s+=i([[4,32],[30,36],[52,30],[80,36],[108,30],[136,36],[160,30],[186,34]],5,4),s+=i([[1,78],[-6,80]],8,4)+i([[189,78],[196,80]],8,4),s})}function L_(){return ct("prop.station",110,150,"bc",()=>{const n={fill:"#c9b17a",shade:"#9a8458",light:"#e8d6a4"},e=(a,o,c,l=Ps)=>k(j(a,o,c),l,{stroke:2.8,sx:2,sy:1,hx:1,hy:.5,over:F(_e(bi(a,o*.15)),l.shade,1.1,.8)});let t=pn(55,148,46,3,.4);t+=e([[50,136],[30,144],[8,150]],12,5)+e([[60,136],[82,144],[104,150]],12,5)+e([[54,140],[50,150]],10,7);const i=(a,o)=>Array.from({length:9},(c,l)=>[55+Math.sin(l*1.05+a)*5*o,146-l*8.6]);t+=e(i(Math.PI,1),9,7)+e(i(Math.PI/3,.9),9,7)+e(i(0,1),10,8),t+=e([[55,80],[40,76],[26,72],[18,64]],9,4)+e([[55,80],[70,76],[84,72],[92,64]],9,4),t+=e([[55,82],[46,74],[36,72]],6,3)+e([[55,82],[64,74],[74,72]],6,3),t+=ot(55,38,52,"#f6ecd0",.5);const s=Ke(20,6,70,62,5)+ba(30,16,50,42);t+=k(nn(30,16,50,42),{fill:"#f4ebd6",shade:"#e2d3b4",light:"#ffffff"},{stroke:0,sx:-3,sy:-3,inner:ot(55,37,30,"#ffffff",.9)+ot(55,37,40,L.vein,.35)});let r="";for(let a=0;a<=8;a++)r+=_t(28+a*6.75,12,1.1,n.light)+_t(28+a*6.75,62,1.1,n.shade);t+=k(s,n,{sx:3,sy:3,hx:2,hy:2,stroke:3.2,over:r});for(const[a,o]of[[20,6],[90,6],[20,68],[90,68]])t+=k(Et(a,o,4),n,{stroke:2,sx:1,sy:1,hx:.8,hy:.8});return t+=e([[22,74],[18,66],[22,58]],5,2.5)+e([[88,74],[92,66],[88,58]],5,2.5),t+=ia([[74,22],[34,52]],1.3),t})}function go(n,e,t,i){const s=l=>(l==="I"?.2:.6)*i,r=.12*i,a=[...n].reduce((l,f)=>l+s(f),0)+r*(n.length-1);let o=e-a/2,c="";for(const l of n)c+=uc(l,o,t-i/2,s(l),i),o+=s(l)+r;return c+`M${Oe(e-a/2-1)} ${Oe(t-i/2)}H${Oe(e+a/2+1)}M${Oe(e-a/2-1)} ${Oe(t+i/2)}H${Oe(e+a/2+1)}`}function xf(n,e,t,i,s){const r=Math.cos(s),a=Math.sin(s),o=([c,l])=>[n+c*r-l*a,e+c*a+l*r];return ve([[-.16*t,0],[.05*t,-i/2],[.62*t,-i*.28],[.74*t,-i*.62],[t,0],[.74*t,i*.62],[.62*t,i*.28],[.05*t,i/2]].map(o))}function C_(){return ct("prop.clock",180,220,"c",()=>{const n={fill:"#6b5238",shade:"#4f3c29",light:"#8c6f4e"},e={fill:"#b69a62",shade:"#8f7648",light:"#d6bd86"},t={fill:"#ebe1ca",shade:"#cdbf9f",light:"#f8f2e4"},i=90,s=134,r=u=>Array.from({length:8},(h,d)=>[i+Math.sin(d*1.3+u)*3,-2+d*7]);let a=k(j(r(Math.PI),5.5,4.5),{...Ps,fill:Ps.shade},{stroke:2.4,sx:1,sy:0});a+=k(j(r(0),6,5),Ps,{stroke:2.4,sx:1.2,sy:0}),a+=F(Et(i,50,6),Mt,5)+F(Et(i,50,6),e.fill,2.6),a+=pn(i+5,s+6,80,80,.25),a+=k(Et(i,s,79),n,{sx:5,sy:5,hx:3,hy:3,stroke:4}),a+=k(Et(i,s,71),e,{sx:-3,sy:-3,hx:0,hy:0,stroke:2.6});let o="";for(let u=0;u<60;u++){const h=u/60*Math.PI*2,d=u%5===0,p=it(i,s,d?55:59,h),_=it(i,s,63,h);o+=F(`M${Oe(p[0])} ${Oe(p[1])}L${Oe(_[0])} ${Oe(_[1])}`,L.inkSoft,d?2.6:1.1)}let c="";for(let u=1;u<=12;u++){if(u%3===0)continue;const h=it(i,s,48,u/12*Math.PI*2-Math.PI/2);c+=_t(h[0],h[1],2.2,L.inkSoft)}const l=go("XII",i,s-46,11)+go("III",i+45,s,11)+go("VI",i,s+46,11)+go("IX",i-45,s,11);a+=k(Et(i,s,65),t,{sx:5,sy:5,hx:0,hy:0,stroke:2.6,over:o+c+F(l,L.inkSoft,1.8)+F(Et(i,s,40),"#d8cbad",1.2)});const f={fill:"#2e2622",shade:"#1c1716",light:"#4a3f38"};return a+=k(xf(i,s,56,6,-Math.PI/2),f,{stroke:1.6,sx:1,sy:1,hx:.6,hy:.6}),a+=k(xf(i,s,36,11,-Math.PI/2+Math.PI/6),f,{stroke:1.6,sx:1,sy:1,hx:.6,hy:.6}),a+=k(Et(i,s,5),e,{stroke:2,sx:1,sy:1,hx:.8,hy:.8}),a+=F(`M${i-50} ${s-22}Q${i-44} ${s-46} ${i-22} ${s-52}`,"#ffffff",4,.35),a+=F(ve([[i+30,s-57],[i+24,s-40],[i+30,s-30],[i+20,s-16]],!1),"#ffffff",1.2,.7),a+=k(j([it(i,s,76,-1.62),it(i,s,79,-1.95),it(i,s,78,-2.3),it(i,s,74,-2.6)],7,3),Ps,{stroke:2.4,sx:1,sy:1}),a+=k(j([it(i,s,78,-2.1),it(i,s,90,-2.2),it(i,s,94,-2.4)],3.5,1.2),Ps,{stroke:1.8,sx:.8,sy:.8}),a})}const fs={fill:"#5d6475",shade:L.metalDark,light:"#7d8598"},yf={fill:"#cfc6b2",shade:"#a39a86",light:"#e6dfcf"};function Wo(n,e=1.8){return n.map(([t,i])=>_t(t,i,e,fs.light)+_t(t+e*.4,i+e*.4,e*.55,fs.shade)).join("")}function P_(){return ct("prop.console",90,110,"bc",()=>{let n=pn(45,108,40,3,.4);for(const t of[18,66])n+=k(j([[t+3,92],[t+2,102],[t+4,109]],8,7),yf,{stroke:2.6,sx:2,sy:0,hx:1,hy:0}),n+=k(Et(t+4,108,4.5),yf,{stroke:2.2,sx:1,sy:1,hx:.8,hy:.8});n+=k(j([[64,34],[69,20],[74,8]],5,4),fs,{stroke:2.6,sx:1.5,sy:0,hx:1,hy:0}),n+=k(Et(74.5,7.5,6),as,{stroke:2.6,sx:1.5,sy:1.5,hx:1.2,hy:1.2}),n+=k("M8 42L18 26H80L84 42Z",fs,{sx:0,sy:-2,hx:0,hy:0,stroke:3.2,over:k(ge(64,34,8,3),{fill:"#2a2e38",shade:"#1c1f27",light:"#3a3f4b"},{stroke:2,sx:0,sy:0,hx:0,hy:0})+_t(26,34,2.2,L.crystalTeal)+_t(35,34,2.2,L.vein)+_t(44,34,2.2,"#3a3f4b")}),n+=k(Ke(8,41,76,53,3),fs,{sx:4,sy:3,hx:2,hy:2,stroke:3.4,over:F("M12 80H80M12 84H80M12 88H80",fs.shade,1.6)+Wo([[13,46],[79,46],[13,75],[79,75]])}),n+=k(Et(46,60,14),fs,{stroke:2.6,sx:1.5,sy:1.5,hx:1,hy:1});let e="";for(let t=0;t<=8;t++){const i=Math.PI*(.8+t/8*1.4),s=it(46,61,7.5,i),r=it(46,61,10,i);e+=`M${Oe(s[0])} ${Oe(s[1])}L${Oe(r[0])} ${Oe(r[1])}`}return n+=k(Et(46,60,10.5),{fill:"#dfe3ea",shade:"#b9bfcb",light:"#f5f7fa"},{stroke:2,sx:1.5,sy:1.5,hx:0,hy:0,over:F(e,L.inkSoft,1.1)+F("M46 61L52 54",L.stamp,1.8)+_t(46,61,1.8,L.inkSoft)}),n})}function D_(){return ct("prop.gear",200,200,"c",()=>{const n={fill:"#4a4f5c",shade:"#373b46",light:"#5f6573"},e=100,t=100,i=16,s=Math.PI*2/i,r=[];for(let u=0;u<i;u++){const h=u*s;r.push(it(e,t,83,h-s*.27),it(e,t,95,h-s*.15),it(e,t,95,h+s*.15),it(e,t,83,h+s*.27))}let a=ve(r);const o=30,c=66,l=8;for(let u=0;u<5;u++){const h=u/5*Math.PI*2-Math.PI/2,d=h+Math.PI*2/5,p=it(e,t,c,d-Math.asin(l/c)),_=it(e,t,c,h+Math.asin(l/c)),m=it(e,t,o,h+Math.asin(l/o)),g=it(e,t,o,d-Math.asin(l/o));a+=`M${Oe(p[0])} ${Oe(p[1])}A${c} ${c} 0 0 0 ${Oe(_[0])} ${Oe(_[1])}L${Oe(m[0])} ${Oe(m[1])}A${o} ${o} 0 0 1 ${Oe(g[0])} ${Oe(g[1])}Z`}a+=Et(e,t,9);let f=k(a,n,{sx:5,sy:5,hx:2.5,hy:2.5,stroke:4,over:F(Et(e,t,76),n.shade,2)+F(Et(e,t,20),n.shade,2)+Wo([it(e,t,15,.4),it(e,t,15,2.5),it(e,t,15,4.6)],2.4)});return f+=F(Et(e,t,9),"#23262e",3),f})}function k_(){return ct("prop.keyoutline",60,140,"c",()=>{const n="M35 48.4A21 21 0 1 0 25 48.4L25 126Q25 131 30 131Q35 131 35 126L35 124L49 124L49 116L43 116L43 110L49 110L49 102L35 102Z"+Et(30,28,9);let e=ot(30,28,30,L.vein,.28)+ot(38,110,26,L.vein,.2);e+=F(n,L.violet,11,.16)+F(n,L.vein,6.5,.3)+F(n,L.vein,3.4,.95)+F(n,"#fbf6ff",1.3,.95);for(const[t,i,s]of[[10,14,2.4],[52,40,1.8],[17,78,1.6],[52,132,2]])e+=F(`M${t-s*2} ${i}H${t+s*2}M${t} ${i-s*2}V${i+s*2}`,L.vein,1.1,.9)+_t(t,i,s*.55,"#ffffff");return e})}function I_(){return ct("prop.lock",70,90,"c",()=>{let n=pn(38,48,30,40,.3);return n+=k(Ke(7,5,56,80,11),fs,{sx:4,sy:4,hx:2,hy:2,stroke:3.6,over:F(Ke(13,11,44,68,7),L.violetDark,3.4)+F(Ke(13,11,44,68,7),L.violet,1.8)+F(Ke(16.5,14.5,37,61,5),L.vein,.9,.6)+Wo([[14,12],[56,12],[14,78],[56,78]],2.2)+F("M24 64l6 -3M44 30l4 4",fs.light,1.1,.8)}),n+=k("M35 30.5a7.5 7.5 0 0 1 4.6 13.4L42 58H28L30.4 43.9A7.5 7.5 0 0 1 35 30.5Z",{fill:"#15131f",shade:"#15131f",light:"#2a2640"},{stroke:2.6,sx:0,sy:0,hx:-1.5,hy:-1.5,inner:ot(35,46,12,L.violet,.5)}),n})}const Ul={fill:"#8c8578",shade:"#6f695e",light:"#a39c8e"},Nl={fill:"#aaa396",shade:"#8a8376",light:"#c1baac"},dn={fill:"#7a766e",shade:"#5a564f",light:"#a29d93"},Dc={fill:L.paper,shade:L.paperDark,light:"#ece4d2"};function Sf(n){return ct(n?"prop.officedoor.open":"prop.officedoor",110,300,"bc",e=>{let t="";if(n)t+=xe(nn(14,12,82,288),"#2b2825"),t+=xe(nn(14,250,82,50),"#39342f"),t+=F("M14 250H96","#4a443d",2),t+=ot(66,140,56,"#d9c9a0",.16),t+=F(nn(52,96,30,40),"#46403a",2.2)+xe(nn(52,96,30,40),"#35302b"),t+=F(_e([[40,236],[66,230],[92,236]]),"#4a443d",2.2),t+=xe(nn(14,12,82,8),Mt,.35),t+=k("M14 12L40 30V284L14 300Z",{fill:"#8f887b",shade:"#736d61",light:"#a59e90"},{sx:0,sy:0,hx:1.5,hy:0,stroke:3,over:xe("M18 266L36 258V278L18 290Z",dn.fill)+F("M18 266L36 258V278L18 290Z",Mt,1.4)+xe("M16 30L22 34V44L16 42Z",dn.fill)}),t+=k("M40 30L44 32V283L40 284Z",Nl,{stroke:2,sx:0,sy:0,hx:0,hy:0}),t+=k(Ke(32,158,8,4,2),dn,{stroke:1.8,sx:0,sy:1,hx:0,hy:.6});else{t+=k(nn(14,12,82,288),Nl,{sx:0,sy:0,hx:2,hy:2,stroke:3,shadeD:nn(84,12,12,288),over:F("M30 20V290M62 18V292",Nl.shade,1.1,.6)+xe(nn(16,296.5,78,2.5),"#f3d98e",.8)});for(const i of[40,150,256])t+=k(nn(12,i,5,16),dn,{stroke:1.8,sx:1,sy:0,hx:.6,hy:0});t+=k(nn(20,268,70,26),dn,{stroke:2.2,sx:0,sy:2,hx:0,hy:1,over:Wo([[24,272],[86,272],[24,290],[86,290]],1.4)}),t+=k(nn(36,92,38,11),dn,{stroke:2,sx:1,sy:1,hx:.8,hy:.8,over:F("M41 96H69M41 99.5H62",dn.shade,1.1)}),t+=na('transform="rotate(-4 50 136)"',k(nn(36,116,30,40),Dc,{stroke:1.8,sx:1.5,sy:1.5,hx:0,hy:0,over:F("M40 123H62M40 128H60M40 133H62M40 138H56","#8e8574",1)+F(Et(55,147,5.5),L.stamp,1.6)+F("M51.5 147h7",L.stamp,1.4)})+xe(nn(46,113,10,5),"#e6dfc9",.8)),t+=k(Et(82,162,4.5),dn,{stroke:2,sx:1,sy:1,hx:.8,hy:.8}),t+=k(Ke(66,159.5,18,5,2.5),dn,{stroke:2,sx:0,sy:1.2,hx:0,hy:.8}),t+=xe("M81 172a1.8 1.8 0 1 1 2 0l0.6 4h-3.2Z",Mt)}return t+=Bs([nn(2,0,12,300),nn(96,0,12,300),nn(2,0,106,12)],Ul,{sx:3,sy:3,hx:2,hy:2},3.4),t+=F("M8 12V296M102 12V296",Ul.shade,1.2,.7)+Wr(6,104,[5],Ul.shade,e,1.1,.6),t})}function F_(){return ct("prop.bench",200,70,"bc",()=>{const n={fill:"#8f7c66",shade:"#6f604f",light:"#a8957c"};let e=pn(100,68,96,3,.4);for(const t of[26,174])e+=k(Ke(t-3,4,6,40,2),dn,{stroke:2.4,sx:1.5,sy:0,hx:.8,hy:0}),e+=k(j([[t-4,44],[t-9,67]],5,4.5),dn,{stroke:2.4,sx:1.2,sy:0}),e+=k(j([[t+4,44],[t+9,67]],5,4.5),dn,{stroke:2.4,sx:1.2,sy:0}),e+=k(Ke(t-13,65,26,4,2),dn,{stroke:2,sx:0,sy:1,hx:0,hy:.6});for(const t of[7,20])e+=k(Ke(10,t,180,10,3),n,{sx:0,sy:2.5,hx:0,hy:1.5,stroke:3});return e+=k(Ke(4,36,192,11,3),n,{sx:0,sy:3,hx:0,hy:1.5,stroke:3.2,over:F("M7 41.5H193",n.shade,1.3)}),e+=k("M140 36L146 29L172 31L168 36Z",Dc,{stroke:1.8,sx:0,sy:1,hx:0,hy:0,over:F("M150 32.5L164 33.5","#8e8574",1)}),e})}function U_(){return ct("prop.coatrack",70,200,"bc",()=>{const n={fill:"#5b4a3e",shade:"#43362d",light:"#76614f"},e={fill:"#5d564d",shade:"#47413a",light:"#766e62"};let t=pn(35,198,30,3,.4);t+=k(j([[35,178],[20,190],[6,198]],7,5),n,{stroke:2.6,sx:1,sy:1.5}),t+=k(j([[35,178],[50,190],[64,198]],7,5),n,{stroke:2.6,sx:1,sy:1.5}),t+=k(Ke(31,12,8,172,3),n,{sx:3,sy:0,hx:1.5,hy:0,stroke:3,over:F("M31 60H39M31 120H39",n.shade,1.4)}),t+=k(Et(35,9,5.5),n,{stroke:2.6,sx:1.2,sy:1.2,hx:1,hy:1}),t+=k(j([[35,180],[36,199]],8,6),n,{stroke:2.4,sx:1,sy:0});for(const i of[-1,1]){const s=[[35,30],[35+i*11,27],[35+i*17,20],[35+i*16,14]];t+=k(j(s,4.5,3),dn,{stroke:2.2,sx:1,sy:1})+k(Et(s[3][0],s[3][1],2.4),dn,{stroke:1.6,sx:.5,sy:.5,hx:.4,hy:.4})}return t+=k(j([[35,44],[47,43],[50,37]],3.5,2.5),dn,{stroke:2,sx:1,sy:1}),t+=k(re([[14,22],[24,26],[28,40],[30,76],[34,126],[30,142],[16,144],[2,140],[4,112],[5,70],[6,38],[9,26]]),e,{sx:4,sy:2,hx:2,hy:1,stroke:3.2,over:F(_e([[16,28],[17,60],[18,100],[17,140]]),e.shade,1.4)+_t(20,60,1.6,Mt)+_t(20.5,80,1.6,Mt)+_t(21,100,1.6,Mt)+F("M24 104h8",e.shade,1.6)+F(_e([[8,40],[6,80],[9,118]]),e.shade,1.2,.8)}),t+=k(yt([[10,24,1],[16,20],[22,24,1],[18,36],[14,36]]),e,{stroke:2.2,sx:1,sy:1,hx:.6,hy:.6}),t+=k(j([[16,26],[19,44],[18,66],[20,84]],6,5),{fill:L.stamp,shade:"#733643",light:"#b06474"},{stroke:2.2,sx:1.5,sy:.5,hx:1,hy:.5}),t})}function va(n,e,t,i,s,r=()=>""){const a=Math.cos(s),o=Math.sin(s),c=(u,h)=>[n+u*a-h*o,e+(u*o+h*a)*.42],l=ve([c(-t/2,-i/2),c(t/2,-i/2),c(t/2,i/2),c(-t/2,i/2)]);let f="";for(let u=-i/2+9;u<i/2-12;u+=7)f+=ve([c(-t/2+7,u),c(t/2-7-u*7%13,u)],!1);return k(l,Dc,{stroke:1.8,sx:0,sy:1.2,hx:0,hy:0,over:F(f,"#8e8574",1.1,.9)+r(c)})}function N_(){return ct("prop.table",620,170,"bc",()=>{const n={fill:"#8b7b69",shade:"#6f604f",light:"#a4937e"},e={fill:"#6b5d4e",shade:"#54483c",light:"#85745f"};let t=pn(310,164,280,6,.35);const i=(s,r,a)=>k(Ke(s-8,r,16,162-r,3),a,{sx:3,sy:0,hx:1.5,hy:0,stroke:3})+k(Ke(s-26,160,52,7,3),a,{sx:0,sy:2,hx:0,hy:1,stroke:2.8});return t+=i(310,96,{...dn,fill:dn.shade}),t+=i(150,108,dn)+i(470,108,dn),t+=k("M8 58A302 46 0 0 0 612 58V72A302 46 0 0 1 8 72Z",e,{sx:0,sy:3,hx:0,hy:1.5,stroke:3.4}),t+=k(ge(310,58,302,46),n,{sx:0,sy:-4,hx:0,hy:3,stroke:3.4,over:F("M60 40Q310 -8 560 40",n.light,2.2,.5)+F(ge(310,58,270,38),n.shade,1.2,.5)}),t+=va(150,66,70,90,-.12,s=>{let r="";for(const a of[-18,4]){const o=s(a-8,-30),c=s(a+8,-30),l=s(a+8,-6),f=s(a-8,-6);r+=xe(ve([o,c,l,f]),"#c9bea6")+F(ve([o,c,l,f]),"#6e6656",1);const u=s(a,-20);r+=xe(ge(u[0],u[1],3.4,1.6),"#6e6656")}return r}),t+=va(300,54,66,86,.08),t+=va(306,58,66,86,-.05),t+=va(312,62,70,90,.1,s=>{const r=s(14,22);return F(ge(r[0],r[1],8,3.6),L.stamp,1.8)+F(ge(r[0],r[1],5,2.2),L.stamp,1.1)}),t+=va(470,64,68,88,.2,s=>{const r=s(-20,30),a=s(20,26);return F(`M${Oe(r[0])} ${Oe(r[1])}q6 -5 10 0t10 -1t10 1t8 -3`,"#3a3550",1.2)+F(ve([s(-24,34),a],!1),"#8e8574",.9)}),t+=k(j([[512,76],[546,70]],4,3),{fill:"#3a3550",shade:"#2b2840",light:"#4d4766"},{stroke:1.6,sx:0,sy:1,hx:0,hy:.6}),t+=k(Ke(368,60,18,7,2),{fill:"#6e4a3a",shade:"#553829",light:"#8a624e"},{stroke:2,sx:0,sy:1.5,hx:0,hy:.8}),t+=k(Ke(372,48,10,13,3),{fill:L.stamp,shade:"#733643",light:"#b06474"},{stroke:2,sx:1,sy:0,hx:.8,hy:0}),t+=k(Et(377,46,5),{fill:L.stamp,shade:"#733643",light:"#b06474"},{stroke:2,sx:1,sy:1,hx:.8,hy:.8}),t})}function $_(){return ct("prop.chair",70,110,"bc",()=>{const n={fill:L.suit,shade:L.suitDark,light:L.suitLight};let e=pn(35,108,30,2.5,.4);e+=k(j([[35,94],[20,99],[8,101]],6,4),dn,{stroke:2.4,sx:0,sy:1.5}),e+=k(j([[35,94],[50,99],[62,101]],6,4),dn,{stroke:2.4,sx:0,sy:1.5});for(const t of[9,35,61])e+=k(Et(t,104.5,4.5),{fill:"#3a3a44",shade:"#282830",light:"#55555f"},{stroke:2,sx:1,sy:1,hx:.8,hy:.8});return e+=k(Ke(31,64,8,32,2),dn,{sx:2,sy:0,hx:1,hy:0,stroke:2.6}),e+=k(j([[40,66],[22,64],[16,52]],6,5),dn,{stroke:2.4,sx:1,sy:1}),e+=k(yt([[12,12],[22,8],[28,14],[26,48],[18,58],[9,54],[8,30]]),n,{sx:3,sy:2,hx:2,hy:1.5,stroke:3,over:F(_e([[14,16],[13,34],[14,50]]),n.shade,1.4)}),e+=k(Ke(12,56,50,12,6),n,{sx:0,sy:3,hx:0,hy:2,stroke:3}),e+=k(j([[30,58],[32,44],[50,42]],4,4),dn,{stroke:2.2,sx:1,sy:1}),e+=k(Ke(30,39,24,6,3),{fill:"#3a3a44",shade:"#282830",light:"#55555f"},{stroke:2.2,sx:0,sy:1.5,hx:0,hy:1}),e})}function hs(n,e,t,i){const s=t*.22;return xe(ve([[n,e-t],[n+s,e-s],[n+t,e],[n+s,e+s],[n,e+t],[n-s,e+s],[n-t,e],[n-s,e-s]]),i)+_t(n,e,s*.9,"#ffffff")}function pc(n,e,t,i,s,r=1){const a=(o,c)=>[n+(o*Math.cos(t)-c*Math.sin(t)),e+(o*Math.sin(t)+c*Math.cos(t))*r];return yt([[...a(0,0),1],[...a(i*.35,-s/2)],[...a(i*.8,-s*.3)],[...a(i,0),1],[...a(i*.8,s*.3)],[...a(i*.35,s/2)]])}const bf=["M-3.5 1.5L0 -1.5L3.5 1.5","M-3.5 -1.5L3.5 1.5M-3.5 1.5L3.5 -1.5","M-3 -1.5V1.5M1 -1.5L-2 1.5M3 -1.5V1.5","M-3.5 0H3.5M0 -1.5V1.5","M-3.5 -1.5L0 1.5L3.5 -1.5","M-3.5 1.5V-1.5L3.5 1.5V-1.5"];function B_(n,e,t){return bf[t%bf.length].replace(/([ML])(-?[\d.]+) (-?[\d.]+)/g,(i,s,r,a)=>`${s}${Oe(n+ +r)} ${Oe(e+ +a)}`).replace(/H(-?[\d.]+)/g,(i,s)=>`H${Oe(n+ +s)}`).replace(/V(-?[\d.]+)/g,(i,s)=>`V${Oe(e+ +s)}`)}function O_(){return ct("prop.anchor",40,40,"c",n=>{let e=ot(20,20,20,L.violet,.5);for(const i of[-2.5,-1.2,.2,1.3,2.4]){const s=i+n.range(-.15,.15);e+=k(j([it(20,20,9,s),it(20,20,14.5,s+.12),it(20,20,18.5,s+.3)],5.5,1.6),$t,{stroke:1.8,sx:1,sy:1,hx:.6,hy:.6})}const t=[];for(let i=0;i<11;i++)t.push(it(20,20,12.5*n.range(.86,1.08),i/11*Math.PI*2));return e+=k(re(t),$t,{stroke:2.2,sx:2.5,sy:2.5,hx:1.5,hy:1.5,over:F(_e([[10,17],[12,12.5],[17,10]]),L.barkDark,1.1)+F(_e([[26,29],[30,25]]),L.barkDark,1.1)}),e+=_t(20,20,7,"#241638"),e+=ot(20,20,10,L.vein,.7),e+=F(Et(20,20,5.2),L.violet,3.2)+F(Et(20,20,5.2),L.vein,1.4)+_t(20,20,1.6,"#ffffff"),e})}function G_(){return ct("prop.site",100,28,"bc",n=>{const i=[];for(let o=0;o<14;o++){const c=o/14*Math.PI*2+.1;i.push({a:c,x:50+Math.cos(c)*43,y:19+Math.sin(c)*6.5,r:n.range(3.2,4.4),root:o%3===1})}const s=o=>o.root?k(j([[o.x-5,o.y+1],[o.x,o.y-1.2],[o.x+5,o.y+.6]],3.4,2.4),$t,{stroke:1.8,sx:.8,sy:.8,hx:.5,hy:.5}):gs(o.x,o.y,o.r*(Math.sin(o.a)>0?1.15:.85),n,Ia,1.8);let r=Os(50,19,50,12,L.violet,.5);for(const o of i)Math.sin(o.a)<0&&(r+=s(o));let a=ge(50,19,30,4.2)+ge(50,19,9,1.4);for(let o=0;o<7;o++){const c=o/7*Math.PI*2+.3;a+=B_(50+Math.cos(c)*20,19+Math.sin(c)*2.6,o)}r+=F(a,L.violetDark,3,.75)+F(a,L.vein,1.3);for(const o of i)Math.sin(o.a)>=0&&(r+=s(o));return r})}function Tf(n){return ct(n?"prop.node.lit":"prop.node",60,72,"bc",()=>{const e={fill:"#3f6b5e",shade:"#2d4d45",light:"#5f8f7d"},t=At.teal;let i=pn(30,70,17,2.5,.35);if(i+=n?ot(30,30,30,L.crystalTeal,.75):ot(30,27,20,L.crystalTeal,.25),i+=k(re([[29,70],[18,65],[7,63],[13,58],[24,60]]),e,{stroke:2,sx:1,sy:1.5,hx:.6,hy:.6}),i+=k(re([[31,70],[42,64],[53,62],[47,57],[36,60]]),e,{stroke:2,sx:1,sy:1.5,hx:.6,hy:.6}),i+=k(j([[30,71],[29,60],[31,50],[30,42]],6,4.5),e,{stroke:2.4,sx:1.5,sy:0,hx:.8,hy:0}),!n)i+=k(re([[30,47],[19,38],[17,24],[23,11],[30,4],[37,11],[43,24],[41,38]]),t,{stroke:2.6,sx:2.5,sy:2,hx:1.5,hy:1.5}),i+=k(re([[30,47],[20,39],[18.5,26],[24,13],[30.5,6],[27.5,22],[29.5,38]]),t,{stroke:2.2,sx:1.5,sy:1.5,hx:1.2,hy:1.2}),i+=k(re([[30,47],[40,39],[41.5,27],[37.5,14],[31,7],[33,24],[31,40]]),{...t,fill:L.crystalTealDark},{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1,light:t.fill}),i+=k(re([[30,50],[21,47],[17,41],[26,43]]),e,{stroke:1.8,sx:.8,sy:.8}),i+=k(re([[30,50],[39,47],[43,41],[34,43]]),e,{stroke:1.8,sx:.8,sy:.8}),i+=F("M23 18Q22 26 24 34",t.light,1.3,.9)+hs(24,12,3,L.crystalTealLight);else{const s={fill:"#7fdccc",shade:"#3fa596",light:"#e8fffb"};for(const[r,a,o]of[[-2.75,22,12],[-.39,22,12],[-2.1,25,13],[-1.04,25,13],[-1.57,24,13]])i+=k(pc(30,40,r,a,o),s,{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1,over:F(_e([it(30,40,4,r),it(30,40,a*.7,r)]),s.shade,1,.8)});i+=ot(30,34,18,"#ffffff",.85),i+=k(Et(30,35,6.5),{fill:"#e8fffb",shade:"#9fe3d8",light:"#ffffff"},{stroke:2,sx:1,sy:1,hx:.8,hy:.8}),i+=hs(12,18,3.5,L.crystalTealLight)+hs(48,14,3,L.crystalTealLight)+hs(40,4,2.5,"#ffffff")}return i})}function z_(){return ct("prop.memory",36,36,"c",()=>{const e=(r,a)=>[18+r*Math.cos(-.62)-a*Math.sin(-.62),19+r*Math.sin(-.62)+a*Math.cos(-.62)];let t=ot(18,18,18,L.violet,.5);const i=yt([[...e(-13,0),1],[...e(-5,-7.5)],[...e(6,-7)],[...e(13,0),1],[...e(6,7.2)],[...e(-5,7.8)]]),s=_e([e(-12,0),e(12,0)])+_e([e(-6,0),e(-3,-4.5)])+_e([e(0,0),e(3,-4.5)])+_e([e(6,0),e(8,-3.5)])+_e([e(-5,0),e(-2,4.5)])+_e([e(1,0),e(4,4.5)]);return t+=me(i,{fill:"#f4ecdf",stroke:2,shadeD:ve([e(-13,0),e(13,0),e(6,9),e(-5,9)]),over:F(s,"#a8977e",.9,.9)+xe(ve([e(-13,0),e(-8,-3.2),e(-8,.4)]),L.ivoryDark)+F(ve([e(-8,-3.2),e(-8,.4)],!1),Mt,.9)}),t+=hs(...e(11,-7),5,L.vein)+hs(...e(-9,7),2.6,L.vein),t})}function Ef(n){return ct(n?"prop.lantern.lit":"prop.lantern",40,72,"bc",()=>{const i=n?{fill:"#8ae6d6",shade:"#43b6a4",light:"#f0fffb"}:{fill:"#3f6d68",shade:"#2d4f4b",light:"#5e8e88"};let s=pn(20,70,13,2.5,.35);n&&(s+=ot(20,22,20,"#7fe6d4",.85)+Os(20,70,20,4,"#7fe6d4",.5)),s+=k(j([[20,67],[11,70],[2,72]],5,2),$t,{stroke:2,sx:.8,sy:1}),s+=k(j([[20,67],[29,70],[38,72]],5,2),$t,{stroke:2,sx:.8,sy:1}),s+=k(j([[20,72],[19,60],[21,48],[20,36]],7,5),$t,{stroke:2.4,sx:1.5,sy:0,hx:.8,hy:0,over:F("M21 64Q23 54 20 44",L.violet,1,n?.8:.4)});const r=ve([[20,5],[27,12],[27,28],[20,35],[13,28],[13,12]]);return s+=me(r,{...i,stroke:2.4,shadeD:ve([[20,5],[27,12],[27,28],[20,35],[21.5,20]]),over:(n?ot(20,20,10,"#ffffff",.95):"")+F("M16 13V26",i.light,1.3,.9)}),s+=k(j([[19,38],[11,31],[9.5,19],[13,9],[20,3]],3.4,2),$t,{stroke:1.8,sx:.8,sy:0,hx:.5,hy:0}),s+=k(j([[21,38],[29,31],[30.5,19],[27,9],[20,3]],3.4,2),$t,{stroke:1.8,sx:.8,sy:0,hx:.5,hy:0}),s+=k(Et(20,3.5,2.6),$t,{stroke:1.6,sx:.6,sy:.6,hx:.5,hy:.5}),n&&(s+=hs(6,12,2.6,L.crystalTealLight)+hs(35,20,2.2,L.crystalTealLight)+hs(32,5,1.8,"#ffffff")),s})}function wf(n){return ct(n?"prop.flowernode.open":"prop.flowernode",70,80,"bc",()=>{const e={fill:"#6d7a45",shade:"#525c33",light:"#8b995c"},t={fill:L.sun,shade:L.sunDark,light:L.sunLight};let i=pn(35,78,24,3,.35);if(i+=k(re([[34,78],[20,71],[4,69],[12,60],[26,64]]),e,{stroke:2.4,sx:1.5,sy:2,hx:1,hy:1,over:F("M30 74L12 66",e.shade,1.2)}),i+=k(re([[36,78],[50,71],[66,68],[58,59],[44,64]]),e,{stroke:2.4,sx:1.5,sy:2,hx:1,hy:1,over:F("M40 74L58 65",e.shade,1.2)}),i+=k(j([[35,79],[34,66],[36,52]],8,6),e,{stroke:2.6,sx:2,sy:0,hx:1,hy:0}),n){i+=ot(35,30,34,L.sunLight,.5)+ot(35,30,16,L.vein,.4);const s=35,r=30;for(let a=0;a<8;a++){const o=a/8*Math.PI*2+.2;i+=k(pc(s,r,o,27,14,.8),{...t,fill:L.sunDark,shade:"#8f6a2c"},{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1,light:t.fill})}for(let a=0;a<7;a++){const o=a/7*Math.PI*2-.1;i+=k(pc(s,r,o,22,13,.8),t,{stroke:2.2,sx:1.5,sy:1.5,hx:1,hy:1,inner:xe(ge(s,r,11,9),L.violet),over:F(_e([it(s,r,11,o),[s+Math.cos(o)*18,r+Math.sin(o)*18*.8]]),t.shade,1.1)})}i+=k(ge(s,r,8.5,7.5),{fill:L.violetDark,shade:"#4f2c7a",light:L.violet},{stroke:2.4,sx:1.5,sy:1.5,hx:1,hy:1,over:[0,1,2,3,4,5,6].map(a=>_t(...it(s,r,a===0?0:4,a/6*Math.PI*2),1.3,L.vein)).join("")})}else{i+=ot(35,30,30,L.sunLight,.3);const s=r=>xe(r,L.violet,.9);i+=k(re([[35,56],[21,47],[18,30],[24,14],[35,3],[46,14],[52,30],[49,47]]),t,{stroke:2.8,sx:3,sy:2.5,hx:1.5,hy:1.5,inner:s(ge(35,2,9,12))}),i+=k(re([[35,56],[22,48],[19.5,32],[25,16],[35.5,5],[31,26],[33.5,46]]),t,{stroke:2.4,sx:2,sy:2,hx:1.2,hy:1.2,inner:s(ge(30,6,7,10)),over:F("M27 22Q25 34 29 46",t.shade,1.2)}),i+=k(re([[35,56],[48,48],[50.5,32],[45,16],[35.5,6],[39,26],[36.5,46]]),{...t,fill:L.sunDark,shade:"#8f6a2c"},{stroke:2.4,sx:2,sy:2,hx:1.2,hy:1.2,light:t.fill,inner:s(ge(41,7,7,10))}),i+=k(re([[35,58],[25,55],[20,48],[30,50]]),e,{stroke:2,sx:1,sy:1}),i+=k(re([[35,58],[45,55],[50,48],[40,50]]),e,{stroke:2,sx:1,sy:1}),i+=F("M27 16L25 30M44 18L46 30",L.violet,1.3,.7)}return i})}function H_(){return ct("prop.current",80,40,"bc",n=>{const e={fill:"#62a0d4",shade:"#3f72a8",light:"#c6e8fa"},t={fill:"#e6f4fb",shade:"#b7d6e8",light:"#ffffff"};let i=Os(40,28,40,16,"#8fd0f2",.5);for(const[r,a,o]of[[10,30,5],[22,27.5,5],[36,26.5,5],[50,26.5,5],[63,27.5,5],[73,30.5,5]])i+=gs(r,a,o,n,Ia,1.8);i+=k(re([[12,34],[17,24],[25,14],[33,9],[40,8],[47,9],[55,14],[63,24],[68,34]]),e,{stroke:2.6,sx:3.5,sy:2,hx:2,hy:2,over:F("M30 30Q31 20 36 13M44 12Q47 20 46 30",e.light,1.6,.85)+F("M38 28V18","#ffffff",1.2,.7)+_t(26,26,1.5,e.light)+_t(52,22,1.2,e.light)});for(const[r,a,o]of[[30,5,2.2],[40,2.5,2],[50,5.5,1.8],[23,11,1.6],[57,12,1.6]])i+=k(re([[r,a-o*1.6],[r+o,a],[r,a+o],[r-o,a]]),e,{stroke:1.4,sx:.6,sy:.6,hx:.5,hy:.5});const s=[[8,36,1]];for(let r=8;r<=72;r+=8)s.push([r+4,30.5+(r%16?1:0)],[r+8,33]);s.push([72,37,1]),i+=k(yt(s),t,{stroke:2,sx:0,sy:1.5,hx:0,hy:1});for(const[r,a,o]of[[6,36.5,6],[20,38,6],[34,39,5.5],[48,39,6],[62,38,5.5],[75,36,5.5]])i+=gs(r,a,o,n,Ia,2);return i})}function V_(){return[Q4(),e_(),t_(),i_(),s_(),r_(),a_(),o_(),l_(),df(!1),df(!0),f_(),h_(),u_(),Fl("prop.crystals.teal",At.teal,"fish"),Fl("prop.crystals.blue",At.blue,"bird"),Fl("prop.crystals.orange",At.orange,"fish"),d_(),gf(!1),gf(!0),M_(),v_(),x_(),S_(),b_(),Mf(!1),Mf(!0),T_(),E_(),vf(!1),vf(!0),w_(),A_(),R_(),L_(),C_(),P_(),D_(),k_(),I_(),Sf(!1),Sf(!0),F_(),U_(),N_(),$_(),O_(),G_(),Tf(!1),Tf(!0),z_(),Ef(!1),Ef(!0),wf(!1),wf(!0),H_()]}const Bh=1280,Oh=720,W_=1400,X_=920,q_={speed:235,accel:1900,decel:2300,airAccel:1350,airDecel:900,jumpVel:640,jumpCut:.45},Z_=110,Y_=130,K_=34,$l=84,Af=2200,Io={zoom:Bh/Af,x:Af/2,y:395.75},Fa=Io.y-Oh/2/Io.zoom,Rf={x:Io.x-Bh/2,y:Io.y-Oh/2},ji={stone:.25,sky:.4,wall:.95,charms:1.08};function kc(n,e,t){return{x:e-(1-n)*Rf.x,y:t-(1-n)*Rf.y}}const sr={lidBack:140,lidBackLeft:430,lidBackRight:1770,lidFront:380,wallLeft:150,wallRight:2050,wallFoot:600,floor:660,bottom:780},Q_=256;let Bl=null;function J_(){if(Bl)return Bl;const n=Q_,e=document.createElement("canvas");e.width=n,e.height=n;const t=e.getContext("2d");let i=99537381;const s=()=>{i=i+1831565813>>>0;let u=i;return u=Math.imul(u^u>>>15,u|1),u^=u+Math.imul(u^u>>>7,u|61),((u^u>>>14)>>>0)/4294967296},r=(u,h)=>{const d=u/n*Math.PI*2,p=h/n*Math.PI*2;return .55+.25*Math.sin(2*d+p+1.3)+.2*Math.sin(3*p-d+.4)*Math.cos(d+2*p)},a="255,253,247",o="52,44,58",c=new Map,l=(u,h,d,p,_,m,g)=>{const b=`${u}|${h}|${d}`;let E=c.get(b);E||c.set(b,E=new Path2D);for(const v of[-n,0,n])for(const S of[-n,0,n]){const T=Math.min(p,m)+v,P=Math.max(p,m)+v,x=Math.min(_,g)+S,A=Math.max(_,g)+S;P<-2||T>n+2||A<-2||x>n+2||(E.moveTo(p+v,_+S),E.lineTo(m+v,g+S))}},f=2600;for(let u=0;u<f;u++){const h=s()*n,d=s()*n,p=r(h,d);if(s()>p)continue;const _=s(),m=_<.72?-.62+(s()-.5)*.35:_<.92?-1.25+(s()-.5)*.3:.55+(s()-.5)*.4,g=3+s()*9,b=Math.cos(m)*g*.5,E=Math.sin(m)*g*.5,v=s()<.62,S=v?[.06,.1,.15][Math.floor(s()*3)]:[.04,.065,.1][Math.floor(s()*3)],T=s()<.7?1:1.6;l(v?a:o,S,T,h-b,d-E,h+b,d+E)}t.lineCap="round";for(const[u,h]of c){const[d,p,_]=u.split("|");t.strokeStyle=`rgba(${d},${p})`,t.lineWidth=Number(_),t.stroke(h)}return Bl=e,e}function Ba(n,e,t,i,s,r={}){const a=j_(n,r.scale??1);a&&(n.save(),n.globalCompositeOperation="source-atop",n.globalAlpha=r.strength??1,n.fillStyle=a,n.fillRect(e,t,i,s),n.restore())}function j_(n,e){const t=n.createPattern(J_(),"repeat");return t&&e!==1&&typeof DOMMatrix<"u"&&t.setTransform(new DOMMatrix().scale(e)),t}function e5(n,e){return`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(n.w*e)}" height="${Math.ceil(n.h*e)}" viewBox="0 0 ${n.w} ${n.h}">${n.body}</svg>`}function Lf(n){return new Promise((e,t)=>{const i=new Image;i.onload=()=>e(i),i.onerror=()=>t(new Error("SVG rasterization failed")),i.src=n})}let Cf=!0;function t5(n){const e=()=>Lf("data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n));if(!Cf)return e();const t=URL.createObjectURL(new Blob([n],{type:"image/svg+xml;charset=utf-8"}));return Lf(t).catch(()=>(Cf=!1,e())).finally(()=>URL.revokeObjectURL(t))}function n5(n){return n.grain??!n.additive}const w={stone:"#d0ccc4",world:"#e0dfdf",lid:"#f5caf3",wall:"#f6e2f4",wallSide:"#efd6ee",wallFloor:"#f3dcf1",paper:"#f1e8d0",paperFloor:"#f5eedf",paperLit:"#f6e7ca",moon:"#bfd4d9",moonLid:"#a6bec5",eye:"#f29bbb",sun:"#eeba92",sunLid:"#dca283",ray:"#efd67e",starTeal:"#9fd3c6",starMint:"#b8dcae",starLime:"#dcdf98",starPink:"#e2abbf",skyStar:"#95d4ca",blade:"#c3cbcf",armBlue:"#8597c7",armBlueLight:"#a9b6de",armGrey:"#a9b0b3",armGreyLight:"#c1c7ca",armJoint:"#8f969a",toe:"#ab9ca3",toePad:"#ddb8c6",lamp:"#adb6b5",lampDark:"#9ea6a4",bulb:"#f2d9cf",bulbStripe:"#dcbdb2",pane:"#cfd6cb",paneSide:"#c4ccc1",turret:"#eee3d8",turretBand:"#baab9f",handle:"#d1c6bf",glyphGreen:"#9fc493",glyphPink:"#eb97ba",glyphDark:"#7f8575",glyphFigure:"#877f8e",glyphPurple:"#a98bd3",glyphBlue:"#8fb2d6",glyphBlueLight:"#cadcee",bark:"#ae93bc",barkDark:"#967ba7",crystalBlue:"#cfe4ea",crystalLilac:"#dbd1e8",pod:"#bc9ecd",bud:"#cda9b9",leaf:"#a9cea3",leafDark:"#92b08e",mist:"#decce5",giftBlue:"#8fc7dc",giftBlueSide:"#7cb4ca",giftPink:"#f2a4ca",giftPinkTop:"#f7c0dc",giftPinkSide:"#e592bd",giftYellow:"#f3dd8a",giftLime:"#cfe38f",starfolk:"#c6e9e4",starfolkFacet:"#abdcd5",spark:"#83a4a1",flower:"#c9b1da",flowerRib:"#e3d5ee",flowerFold:"#a78ec0",flowerThroat:"#947cab",stem:"#a0c094",rootling:"#bfa78e",rootlingDark:"#a28b74",visor:"#eca7bb",shade:"#8a8096",shadeDark:"#756b82",bang:"#ad98b8",frame:"#b6a8af",frameInner:"#dad0d9",portrait:"#a4d1a4",window:"#b0a199",earth:"#cdbeaf",earthDark:"#bdae9f",earthLight:"#d6c8ba",crystal:"#aae5dc",crystalDeep:"#88d0c2",fossil:"#bda4b4",marksPaper:"#ecdec2",pencil:"#8f7d89",circle14:"#e490b4",bed:"#f0c2e8",bedDeep:"#e6b2dc",mattress:"#f7efe0",pillow:"#fbf6ec",blanket:"#ced5f0",blanketStripe:"#f2c0dd",wood:"#e1c8a3",woodDark:"#c9ae89",paintBlue:"#9bb8dd",charmGreen:"#8ebc97",cord:"#b76a7c",banner:"#d7eb9e",bannerInk:"#627f53",pole:"#a2a6a9",branch:"#96bda0",claw:"#9096a0",pinkTag:"#f2b6d1",starburst:"#d9e690",leafCharm:"#8aae8f",lizard:"#a2ccb2",spine:"#7a9a86",lizardHead:"#ec918f",imp:"#bca389",greyBox:"#b6babd",dial:"#9fa4a8",string:"#958a97"},lt=n=>(Math.round(n*100)/100).toString(),Ic=n=>n!==1?` opacity="${lt(n)}"`:"",fi=(n,e,t)=>ge(n,e,t,t),Mn=(n,e=1)=>re(n,e,!1);function ie(n,e,t=1.6,i={}){let s=`<g${i.opacity!==void 0?Ic(i.opacity):""}><path d="${n}" fill="${e}"/>`;if(i.inner){const r=Ho("p1c");s+=`<clipPath id="${r}"><path d="${n}"/></clipPath><g clip-path="url(#${r})">${i.inner}</g>`}return t>0&&(s+=`<path d="${n}" fill="none" stroke="${i.line??He(e)}" stroke-width="${lt(t)}" stroke-linejoin="round" stroke-linecap="round"/>`),s+"</g>"}function Ee(n,e,t,i=1){return`<path d="${n}" fill="none" stroke="${e}" stroke-width="${lt(t)}" stroke-linecap="round" stroke-linejoin="round"${Ic(i)}/>`}function cn(n,e,t=1){return`<path d="${n}" fill="${e}"${Ic(t)}/>`}function ds(n,e){return`<g transform="${n}">${e}</g>`}function Pi(n,e,t,i,s=1.6){return Ee(`M${lt(n-t)} ${lt(e)}Q${lt(n)} ${lt(e+t*.45)} ${lt(n+t)} ${lt(e)}`,i,s)}function Fc(n,e,t,i=6,s=0){const r=[];for(let a=0;a<i*2;a++){const o=s+a*Math.PI/i,c=a%2?t*.38:t;r.push([n+Math.cos(o)*c,e+Math.sin(o)*c])}return ve(r)}function Gh(n,e,t,i=0,s=.46){const r=[];for(let a=0;a<10;a++){const o=i-Math.PI/2+a*Math.PI/5,c=a%2?t*s:t;r.push([n+Math.cos(o)*c,e+Math.sin(o)*c])}return ve(r)}function mc(n,e,t,i,s=.34){const r=Math.cos(i),a=Math.sin(i),o=(f,u)=>[n+f*r-u*a,e+f*a+u*r],c=t*s,l=[o(0,0),o(t*.35,-c),o(t*.8,-c*.6),o(t,0),o(t*.8,c*.6),o(t*.35,c)];return`M${lt(l[0][0])} ${lt(l[0][1])}C${lt(l[1][0])} ${lt(l[1][1])} ${lt(l[2][0])} ${lt(l[2][1])} ${lt(l[3][0])} ${lt(l[3][1])}C${lt(l[4][0])} ${lt(l[4][1])} ${lt(l[5][0])} ${lt(l[5][1])} ${lt(l[0][0])} ${lt(l[0][1])}Z`}function Gs(n,e,t,i,s,r=1.4){const a=[n+Math.cos(i)*t*.85,e+Math.sin(i)*t*.85];return ie(mc(n,e,t,i),s,r)+Ee(`M${lt(n)} ${lt(e)}L${lt(a[0])} ${lt(a[1])}`,He(s),1,.7)}const i5={S:[{curve:!0,pts:[[.88,.16],[.55,.02],[.2,.1],[.14,.34],[.5,.5],[.84,.64],[.86,.88],[.5,1],[.12,.86]]}],T:[{pts:[[.02,.02],[.98,.02]]},{pts:[[.5,.02],[.5,1]]}],R:[{pts:[[.14,1],[.14,.02],[.62,.02],[.86,.14],[.86,.36],[.62,.5],[.14,.5]]},{pts:[[.48,.5],[.9,1]]}],A:[{pts:[[.02,1],[.5,.02],[.98,1]]},{pts:[[.24,.62],[.76,.62]]}],N:[{pts:[[.12,1],[.12,.02],[.88,1],[.88,.02]]}],G:[{curve:!0,pts:[[.9,.2],[.6,.02],[.22,.12],[.06,.5],[.22,.88],[.58,1],[.9,.84]]},{pts:[[.9,.84],[.9,.56],[.56,.56]]}],E:[{pts:[[.86,.02],[.14,.02],[.14,1],[.86,1]]},{pts:[[.14,.5],[.7,.5]]}],D:[{pts:[[.14,.02],[.14,1]]},{curve:!0,pts:[[.14,.02],[.55,.04],[.88,.3],[.9,.64],[.62,.96],[.14,1]]}],Y:[{pts:[[.02,.02],[.5,.52],[.98,.02]]},{pts:[[.5,.52],[.5,1]]}],"?":[{curve:!0,pts:[[.14,.28],[.34,.05],[.68,.04],[.88,.24],[.74,.46],[.52,.58],[.5,.76]]},{dot:!0,pts:[[.5,.95]]}],1:[{pts:[[.16,.28],[.58,.02],[.58,1]]}],4:[{pts:[[.74,1],[.74,.02],[.04,.68],[.98,.68]]}]};function Aa(n,e,t,i,s,r,a,o,c){let l="";const f=[];let u=e;for(const p of n){if(p===" "){u+=s*.7;continue}const _=i*(p==="1"?.55:p==="?"?.62:.72),m=o.range(-.06,.06)*i;for(const g of i5[p]??[]){const b=g.pts.map(([E,v])=>[u+E*_,t+m+v*i]);g.dot?f.push(b[0]):l+=g.curve?Mn(b,.9):ve(b,!1)}u+=s}let h="";const d=(p,_)=>f.map(([m,g])=>`<circle cx="${lt(m)}" cy="${lt(g)}" r="${lt(_)}" fill="${p}"/>`).join("");return c&&(h+=Ee(l,c.color,c.w)+d(c.color,c.w*.62)),h+=Ee(l,r,a)+d(r,a*.62),h}function _n(n,e,t,i,s,r,a=1){return{key:n,w:e,h:t,px:i,py:s,body:r,scale:a}}function s5(){const n=new Vt(Mi("p1.cube")),e=[30,118,242,330],t=[[128,114,114,128],[198,192,192,198],[272,270,270,272],[346,354,354,346]],i=(d,p)=>[e[p],t[d][p]];let s="";for(const[d,p]of[[20,-1],[340,1]]){const _=`M${d-p*4} 214C${d+p*18} 206 ${d+p*24} 246 ${d-p*4} 250`;s+=Ee(_,He(w.handle),9)+Ee(_,w.handle,5.6)}for(const[d,p]of[[74,-9],[286,9]]){let m=ie(`M${d-19} 124C${d-20} 102 ${d-17} 80 ${d-14} 66L${d+14} 66C${d+17} 80 ${d+20} 102 ${d+19} 124Z`,w.turret,2.6,{inner:Ee(Mn([[d-8,126],[d-9,94],[d-6,64]]),w.turretBand,4.2)+Ee(Mn([[d+3,126],[d+3,94],[d+4,64]]),w.turretBand,4.2)+Ee(Mn([[d+13,126],[d+14,94],[d+11,64]]),w.turretBand,3)});m+=ie(ge(d,66,16,5.5),Ut(w.turret,w.turretBand,.35),2.2),m+=ie(Ke(d-7,50,14,14,2),Ut(w.turret,w.turretBand,.5),2),s+=ds(`rotate(${p} ${d} 124)`,m)}const r=ve([i(0,0),i(0,1),i(0,2),i(0,3),i(3,3),i(3,2),i(3,1),i(3,0)]);let a="";for(let d=0;d<3;d++)for(let p=0;p<3;p++){const _=ve([i(d,p),i(d,p+1),i(d+1,p+1),i(d+1,p)]);a+=cn(_,p===1?w.pane:w.paneSide)}const o=He(w.pane);let c="";for(let d=1;d<3;d++)c+=Ee(ve([i(d,0),i(d,1),i(d,2),i(d,3)],!1),o,3.2);for(let d=1;d<3;d++)c+=Ee(ve([i(0,d),i(3,d)],!1),o,3.2);s+=ie(r,w.pane,0,{inner:a})+c+Ee(r,o,3.6);const l=w.glyphGreen;s+=ie(re([[50,170],[58,158],[76,154],[92,150],[100,142],[108,148],[104,158],[92,166],[72,172]]),l,1.8),s+=ie("M52 168L38 160L44 172Z",l,1.6)+Ee("M66 170L62 182M84 166L86 178",He(l),2)+Pi(101,148,2.6,He(l),1.4),s+=ie("M74 156L80 142L86 154Z",l,1.4);const f=ve([[146,186],[150,132],[210,130],[214,186]],!1)+ve([[146,186],[138,190]],!1)+ve([[214,186],[222,190]],!1),u=ve([[160,152],[180,140],[200,152]],!1)+ve([[166,154],[194,154],[194,174],[166,174],[166,154]],!1)+ve([[180,154],[180,174]],!1);s+=Ee(f+u,He(w.glyphPink),5.6)+Ee(f+u,w.glyphPink,3),s+=ie(fi(262,162,8),w.glyphPurple,1.6),s+=Ee("M292 138V190M280 148H306M282 162H304M282 176H304M300 190L308 183",w.glyphDark,3.4),s+=Ee(ve([[44,256],[64,236],[100,260]],!1),w.glyphDark,4.2);for(let d=0;d<5;d++){const p=d/5*Math.PI*2-.4;s+=`<circle cx="${lt(56+Math.cos(p)*7)}" cy="${lt(214+Math.sin(p)*7)}" r="3.6" fill="${w.glyphDark}"/>`}s+=Ee("M84 216H98M91 209V223",w.glyphDark,3.2);const h=re([[136,238],[148,222],[176,214],[206,216],[226,228],[222,242],[196,250],[160,250]]);return s+=ie("M140 236L120 220L118 236L124 250Z",w.glyphBlue,1.8),s+=ie(h,w.glyphBlue,2,{inner:cn(re([[140,246],[170,240],[206,238],[230,240],[226,262],[140,262]]),w.glyphBlueLight)}),s+=Pi(208,228,3.4,He(w.glyphBlue),1.6)+Ee(Mn([[222,239],[212,239.4],[204,240.4]]),He(w.glyphBlue),1.4),s+=ie(fi(286,212,8),w.glyphFigure,1.4),s+=Ee("M270 226H302M286 220V230M276 250L282 226H290L296 250ZM280 250L276 262M292 250L296 262",w.glyphFigure,3.2),s+=ie(ge(74,318,26,17),l,1.8)+ie(fi(64,298,12),l,1.8)+Pi(64,297,4,He(l),1.6),s+=Ee("M58 332L50 338M90 332L98 338",He(l),2.2),s+=Aa("14",146,284,58,42,"#e5a6c0",3,n,{color:"#8b7583",w:6.4}),s+=Aa("?",268,282,60,30,"#f0aac8",3.2,n,{color:"#c97c9f",w:6.6}),_n("p1.cube",360,360,180,356,s,.8)}function r5(){let n="";const e=[[226,-14],[214,70],[196,150],[170,226]];n+=ie(j(e,64,56),w.armBlue,2.6,{inner:Ee(Mn(e.map(([i,s])=>[i-20,s+4])),w.armBlueLight,20)+Ee(Mn(e.map(([i,s])=>[i-8,s+2])),He(w.armBlue),1.4,.8)+Ee(Mn(e.map(([i,s])=>[i+14,s+2])),Ut(w.armBlue,"#6f81b8",.6),12)});const t=[[164,246],[148,312],[122,382],[92,438]];return n+=ie(j(t,56,44),w.armGrey,2.6,{inner:Ee(Mn(t.map(([i,s])=>[i-12,s])),w.armGreyLight,14)+Ee(Mn(t.map(([i,s])=>[i+8,s+2])),He(w.armGrey),1.3,.7)}),n+=ie(ge(162,252,34,11),w.armJoint,2.2),n+=ie(ve([[130,222],[104,188],[146,212]]),w.armGreyLight,2),n+=ie(ve([[128,236],[134,214],[200,222],[198,246]]),w.armGreyLight,2.4,{inner:Ee("M136 232L194 238",He(w.armGreyLight),1.2,.7)}),n+=ie(ve([[66,424],[74,404],[118,420],[112,442]]),w.armJoint,2.2),n+=ie(ge(62,452,24,12),w.toe,2.2,{inner:cn(ge(46,456,12,9),w.toePad)}),n+=ie(ge(106,454,20,11),w.toe,2.2,{inner:cn(ge(120,458,10,8),w.toePad)}),_n("p1.arm",270,470,84,464,n,.8)}function a5(){let n="";return n+=ie(ve([[0,26],[82,12],[98,62],[2,64]]),w.lamp,2.4),n+=ie(ve([[2,64],[98,62],[90,112],[0,104]]),w.lampDark,2.4),n+=ie("M92 10C150 12 184 48 174 78C164 106 128 118 90 114Z",w.bulb,2.6,{inner:Ee("M96 30C130 32 160 50 172 72",w.bulbStripe,2.6)+Ee("M96 58C126 60 150 72 164 94",w.bulbStripe,2.6)+Ee("M96 86C118 90 132 98 142 110",w.bulbStripe,2.6)}),n+=Ee("M92 12L90 112",He(w.lamp),3),_n("p1.lamp",180,124,90,62,n)}function o5(){let n="";n+=ie(j([[226,290],[262,284],[298,291],[340,285]],13,6),w.mist,1.6),n+=ie(re([[90,298],[100,282],[132,274],[170,271],[208,275],[238,283],[250,297],[170,302]]),w.mist,1.8);for(const[i,s,r,a]of[[160,262,46,3.5],[150,236,42,3.9],[176,250,44,-.35],[182,222,40,-.75],[158,206,36,4.2],[168,276,40,2.9],[178,272,42,.2]])n+=Gs(i,s,r,a,w.leafDark,1.5);const e=[[170,298],[166,250],[172,196],[165,146],[160,104]];n+=ie(j(e,36,20),w.bark,2.2,{inner:Ee(Mn(e.map(([i,s])=>[i-6,s])),w.barkDark,2.2)+Ee(Mn(e.map(([i,s])=>[i+7,s+4])),w.barkDark,1.8)+cn(ge(170,220,4,6),w.barkDark)}),n+=ie(j([[164,156],[132,132],[106,116]],16,9),w.bark,2),n+=ie(j([[170,142],[204,124],[228,114]],18,10),w.bark,2),n+=ie(j([[158,108],[150,88],[146,72]],12,8),w.bark,1.8),n+=ie(j([[164,106],[178,90],[188,78]],12,8),w.bark,1.8),n+=ds("rotate(-24 96 110)",ie(ge(96,110,16,12),w.bud,2)+Ee("M84 110Q96 104 108 110",He(w.bud),1.2,.8)),n+=ds("rotate(18 250 126)",ie(re([[226,126],[240,108],[264,106],[280,120],[274,140],[250,146],[232,140]]),w.pod,2.2,{inner:Ee(Mn([[236,128],[254,122],[274,126]]),He(w.pod),1.4,.7)})),n+=ie(ve([[134,76],[136,36],[147,16],[158,36],[160,76]]),w.crystalBlue,2,{inner:Ee("M147 16L145 76",He(w.crystalBlue),1.2,.8)}),n+=ie(ve([[178,82],[180,52],[191,34],[201,52],[200,82]]),w.crystalLilac,2,{inner:Ee("M191 34L188 82",He(w.crystalLilac),1.2,.8)});for(const[i,s,r,a]of[[126,128,22,-2.4],[214,118,22,-1.2],[190,128,18,1.1],[150,90,18,3.6]])n+=Gs(i,s,r,a,w.leaf,1.3);const t=(i,s,r,a)=>{const o=l=>l.map(([f,u])=>[i+f*r*a,s+u*a]);let c=ie(mc(i-r*8*a,s+2*a,24*a,r>0?Math.PI+.3:-.3),w.leaf,1.4);return c+=ie(re(o([[-10,4],[-4,-6],[8,-8],[16,-4],[18,4],[8,10],[-4,10]])),w.leaf,1.8),c+=ie(re(o([[12,-6],[18,-14],[26,-12],[28,-4],[20,0]])),w.leaf,1.6),c+=Pi(i+r*22*a,s-8*a,2.4*a,He(w.leaf),1.3),c+=ie(mc(i+r*2*a,s-4*a,16*a,r>0?-2.2:-.9),Ut(w.leaf,w.leafDark,.4),1.3),c};return n+=t(70,104,-1,1),n+=t(284,82,1,1.15),_n("p1.tree",340,300,170,300,n)}function l5(){let n="";return n+=ie(ve([[22,66],[136,66],[136,108],[22,108]]),w.giftBlue,2,{inner:cn(ve([[74,60],[86,60],[86,112],[74,112]]),w.giftYellow)}),n+=ie(ve([[136,66],[150,56],[150,98],[136,108]]),w.giftBlueSide,2),n+=ie(ve([[18,44],[140,44],[140,68],[18,68]]),w.giftPink,2,{inner:cn(ve([[74,40],[86,40],[86,70],[74,70]]),w.giftYellow)}),n+=ie(ve([[140,44],[154,32],[154,56],[140,68]]),w.giftPinkSide,2),n+=ie(ve([[18,44],[32,32],[154,32],[140,44]]),w.giftPinkTop,2,{inner:cn(ve([[74,44],[88,32],[100,32],[86,44]]),w.giftYellow)}),n+=ie(re([[90,36],[74,28],[68,14],[80,10],[92,30]]),w.giftYellow,1.8),n+=ie(re([[94,36],[106,14],[120,12],[120,26],[98,36]]),w.giftYellow,1.8),n+=ie(fi(93,34,5.4),w.giftLime,1.6),n+=Ee("M90 38Q84 46 80 50M96 38Q102 46 108 48",He(w.giftYellow),2.2),_n("p1.gift",160,112,80,112,n)}function c5(){let n="";n+=ie(re([[26,116],[36,108],[58,106],[82,108],[90,116],[58,119]]),w.mist,1.4);const e=[[58,8,1],[68,40],[100,50,1],[74,66],[80,110,1],[58,84],[34,110,1],[40,66],[4,36,1],[46,40]],t=yt(e),i=[57,58];let s="";for(const[r,a,o]of e)o&&(s+=Ee(`M${i[0]} ${i[1]}L${r} ${a}`,w.starfolkFacet,3.2));n+=ie(t,w.starfolk,2.2,{inner:s});for(const[r,a,o]of[[4,36,9],[100,50,8],[34,110,6.5],[80,110,6.5]])n+=ie(Fc(r,a,o,6,.3),w.spark,1.2);return n+=Pi(50,48,3.4,He(w.starfolk),1.7)+Pi(64,48,3.4,He(w.starfolk),1.7),n+=Ee("M54 60H60",He(w.starfolk),1.6),_n("p1.starfolk",108,120,57,118,n)}function f5(){let n="";n+=ie(j([[70,110],[62,94],[58,80]],6,4),w.stem,1.5),n+=Gs(72,102,30,-.35,w.stem,1.5);const e=64,t=52,i=[],s=[];for(let o=0;o<5;o++){const c=-Math.PI/2+o*2*Math.PI/5+.2,l=46;i.push([e+Math.cos(c)*l,t+Math.sin(c)*l*.86]),s.push([e+Math.cos(c)*l,t+Math.sin(c)*l*.86]);const f=c+Math.PI/5;s.push([e+Math.cos(f)*l*.9,t+Math.sin(f)*l*.9*.86])}const r=[e-4,t-3];let a="";for(const[o,c]of i)a+=Ee(`M${lt(r[0])} ${lt(r[1])}L${lt(o)} ${lt(c)}`,w.flowerRib,8)+Ee(`M${lt(r[0])} ${lt(r[1])}L${lt(o)} ${lt(c)}`,w.flowerFold,1.5);return n+=ds("rotate(-14 64 52)",ie(re(s,.9),w.flower,2.2,{inner:a})+ie(ge(r[0],r[1],12,9),w.flowerThroat,1.8,{inner:cn(ge(r[0]-2,r[1]-1,5,3.5),Ut(w.flowerThroat,"#ffffff",.25))})),_n("p1.flower",140,112,70,112,n)}function h5(){let n="";for(const e of[[[48,84],[40,100],[28,118]],[[58,86],[64,102],[74,118]],[[52,88],[50,104],[46,118]]])n+=ie(j(e,9,4),w.rootlingDark,1.6);return n+=ie(j([[40,58],[26,42],[16,22]],9,5),w.rootling,1.6)+Ee("M16 22L8 14M16 22L14 10M16 22L22 12",He(w.rootling),1.8),n+=ie(j([[70,58],[86,48],[98,34]],9,5),w.rootling,1.6)+Ee("M98 34L106 28M98 34L104 22M98 34L94 24",He(w.rootling),1.8),n+=ie(re([[38,86],[34,66],[42,50],[56,46],[70,52],[74,70],[70,88],[56,94]]),w.rootling,2,{inner:Ee("M46 60Q50 70 46 82M62 58Q66 68 64 84",w.rootlingDark,1.6)}),n+=ie(ve([[40,22],[36,2],[52,14]]),w.rootling,1.6)+ie(ve([[60,14],[74,0],[72,22]]),w.rootling,1.6),n+=ie(re([[38,40],[36,24],[46,14],[64,14],[74,24],[72,40],[56,48]]),w.rootling,2),n+=ie(Ke(40,22,34,11,5),w.visor,1.6),n+=Gs(66,16,16,-.9,w.leaf,1.2)+Gs(30,44,14,3.6,w.leaf,1.2),_n("p1.rootling",110,120,55,120,n)}function u5(){let n="";return n+=ie(j([[38,70],[28,82],[18,90]],9,4),w.shadeDark,1.6)+ie(j([[54,72],[62,82],[72,90]],9,4),w.shadeDark,1.6),n+=ie(j([[36,60],[24,66],[16,76]],8,4),w.shadeDark,1.6),n+=ie(re([[30,74],[28,56],[38,44],[54,44],[62,56],[60,72],[46,78]]),w.shade,2,{inner:Ee("M38 58Q44 64 40 72",w.shadeDark,1.6)}),n+=ie(j([[56,52],[68,40],[76,24]],10,6),w.shade,1.8),n+=Ee(Mn([[76,26],[80,14],[88,10],[92,18],[86,24]]),He(w.shade),7)+Ee(Mn([[76,26],[80,14],[88,10],[92,18],[86,24]]),w.shadeDark,4),n+=ie(Ke(24,16,38,30,7),w.shade,2),n+=ie(Ke(28,26,30,8,3),w.shadeDark,1.4),n+=Ee("M44 16L42 6",He(w.shade),2.2)+`<circle cx="42" cy="5" r="2.6" fill="${w.shadeDark}"/>`,_n("p1.shade",96,92,46,92,n)}function d5(){let n="";for(const[e,t]of[[14,-18],[32,-2],[50,14]])n+=ds(`rotate(${t} ${e} 40)`,ie(ve([[e-4.5,4],[e+4.5,4],[e+2,34],[e-2,34]]),w.bang,1.8)+ie(fi(e,44,4),w.bang,1.6));return _n("p1.bang",64,56,32,56,n)}function zh(n,e,t,i,s){const r=s.filter(c=>c.side==="l").sort((c,l)=>l.y-c.y),a=s.filter(c=>c.side==="r").sort((c,l)=>c.y-l.y),o=[[n,e],[t,e]];for(const c of a)o.push([t,c.y],[t-8,c.y],[t-8,c.y+c.h],[t,c.y+c.h]);o.push([t,i],[n+12,i],[n,i-12]);for(const c of r)o.push([n,c.y+c.h],[n+8,c.y+c.h],[n+8,c.y],[n,c.y]);return ve(o)}function p5(){let n="";n+=ie(ve([[30,28],[110,28],[110,142],[30,142]]),w.frameInner,1.6);for(const[t,i]of[[40,42],[54,30],[86,30],[102,40],[106,60]])n+=ie(j([[70,64],[(70+t)/2+2,(64+i)/2-4],[t,i]],7,3),w.portrait,1.4);n+=ie(j([[70,82],[66,110],[70,140]],20,14),w.portrait,1.6),n+=ie(j([[64,94],[50,104],[44,118]],7,4),w.portrait,1.4)+ie(j([[76,94],[90,104],[96,116]],7,4),w.portrait,1.4),n+=ie(fi(70,72,15),w.portrait,1.8),n+=Pi(64,72,3.4,He(w.portrait),1.6)+Pi(77,72,3.4,He(w.portrait),1.6);let e=ie(zh(18,16,122,154,[{side:"l",y:60,h:12},{side:"r",y:100,h:12}]),w.frame,2.4)+n;return e+=ie(Fc(16,14,9,4,.2),Ut(w.frame,"#ffffff",.35),1.4),e+=ie(fi(130,12,4),w.frame,1.4),_n("p1.picture",140,170,70,85,ds("rotate(-7 70 85)",e))}function m5(){let n="";n+=Ee("M34 44L75 8L116 44",w.string,2.4)+ie(fi(75,8,4.2),Ut(w.frame,w.string,.4),1.4),n+=ie(zh(16,40,134,200,[{side:"l",y:86,h:14},{side:"r",y:150,h:14}]),w.window,2.6);let e=cn(Ke(26,50,98,140,0),w.earth);return e+=cn("M24 92Q60 82 126 96V122Q70 110 24 120Z",w.earthDark),e+=cn("M24 150Q72 140 126 150V172Q70 164 24 176Z",w.earthLight),e+=ie(j([[20,142],[58,124],[96,116],[128,98]],11,6),w.fossil,1.6),e+=ie(re([[54,184],[40,142],[48,98],[60,124],[60,172]]),w.crystalDeep,1.8),e+=ie(re([[96,184],[110,142],[102,98],[90,124],[90,172]]),w.crystalDeep,1.8),e+=ie(ve([[62,186],[64,112],[75,62],[86,112],[88,186]]),w.crystal,2,{inner:cn("M64 140Q75 128 88 138Q76 150 64 140ZM62 140L54 132L55 148Z",Ut(w.crystalDeep,w.earthDark,.35),.55)+Ee("M75 64L74 184",He(w.crystal),1.1,.7)}),e+=Ee("M36 176L66 58","#ffffff",6,.14)+Ee("M52 182L82 70","#ffffff",2.2,.2),n+=ie(Ke(28,52,94,136,0),w.earth,2,{inner:e,line:He(w.window)}),_n("p1.window",150,212,75,120,n)}function g5(){const n=new Vt(Mi("p1.marks")),e=[],t=10,i=12,s=210,r=124;for(let f=t;f<s;f+=n.range(9,15))e.push([f,i+n.range(-3,3)]);for(let f=i;f<r;f+=n.range(9,15))e.push([s+n.range(-3,3),f]);for(let f=s;f>t;f-=n.range(9,15))e.push([f,r+n.range(-3,3)]);for(let f=r;f>i;f-=n.range(9,15))e.push([t+n.range(-3,3),f]);let a=ie(ve(e),w.marksPaper,1.5),o="";for(let f=0;f<14;f++){const u=f<7?0:1,h=26+f%7*16+n.range(-1.5,1.5),d=38+u*44+n.range(-2,2);o+=`M${lt(h)} ${lt(d)}L${lt(h-2-n.range(0,2))} ${lt(d+22)}`}a+=Ee(o,w.pencil,2.6);const c=[];for(let f=0;f<=16;f++){const u=-.6+f/16*Math.PI*2.15;c.push([121+Math.cos(u)*12.5*(1+n.range(-.06,.06)),93+Math.sin(u)*15*(1+n.range(-.06,.06))])}a+=Ee(Mn(c),w.circle14,2.2);const l=`font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="13" fill="${w.pencil}"`;return a+=`<text x="142" y="90" ${l}>Gorti</text><text x="140" y="107" ${l}>Evaskinan</text>`,_n("p1.marks",220,134,110,67,a)}function _5(){let n=cn(Ke(14,80,222,27,2),Ut(w.bedDeep,w.wall,.4),.8);const e=(r,a,o,c,l,f,u)=>ie(Ke(r,a,o,c,3),w.bed,1.6)+ie(Ke(r-1.5,a-1,o+3,6,2),w.bedDeep,1.4)+ie(fi(l,f,u),w.bed,1.6);n+=ie("M12 66V17Q13 5 27 6Q45 8 50 27V66Z",w.bed,1.6,{inner:cn("M24 12A7 7 0 1 0 31 23A5.6 5.6 0 1 1 24 12Z",w.moon)+cn(Gh(41,25,3.4),w.starTeal)+Ee("M16 34Q18 50 16 64",w.bedDeep,1.3)});let t="";for(let r=22;r<234;r+=7)t+=Ee(`M${r} 38V64`,Ut(w.mattress,w.pencil,.18),1.2);n+=ie(Ke(16,38,218,25,7),w.mattress,1.6,{inner:t}),n+=ie(Ke(10,60,230,22,4),w.bedDeep,1.6,{inner:cn("M22 71a3 3 0 1 0 0.01 0M228 71a3 3 0 1 0 0.01 0",He(w.bedDeep),.6)}),n+=ie(re([[22,41],[19,32],[25,24],[41,21],[59,22],[70,27],[73,35],[67,41],[45,43]]),w.pillow,1.6,{inner:Ee(Mn([[33,27],[40,31],[49,30]]),Ut(w.pillow,w.pencil,.3),1.3)});const i=yt([[74,38,1],[237,38,1],[239,52],[237,77,1],[222,79.5],[206,76],[190,79.5],[174,76],[158,79.5],[142,76],[126,79.5],[110,76],[94,79.5],[78,77,1],[73,58]]);let s="";for(const r of[102,136,170,204])s+=cn(Ke(r,30,11,60,0),w.blanketStripe)+cn(Ke(r+15,30,2.5,60,0),w.blanketStripe,.85);return s+=cn(Ke(72,36,17,46,0),Ut(w.blanket,"#ffffff",.45))+cn(Ke(76,36,4,46,0),w.blanketStripe,.9),n+=ie(i,w.blanket,1.6,{inner:s+Ee("M89 38.5V78",He(w.blanket),1.4)}),n+=e(4,12,12,96,10,7,6)+e(234,29,12,79,240,24,5),_n("p1.bed",250,110,125,110,n)}function M5(){const n=new Vt(Mi("p1.whale"));let e="";for(const[s,r]of[[28,56],[44,58],[68,58],[84,56]])e+=ie(fi(s,r,6),w.woodDark,1.4,{inner:cn(fi(s,r,1.8),He(w.woodDark))});e+=ie(re([[18,40],[10,32],[4,24],[2,16],[8,18],[12,24],[13,14],[18,11],[19,20],[22,34]]),w.wood,1.6);const t=yt([[16,42],[24,34],[38,26],[54,19],[68,16],[84,16],[92,20,1],[94,30],[93,42,1],[86,48],[64,52],[42,51],[28,48]]);let i=cn(re([[14,40],[26,30],[44,20],[66,14],[96,14],[98,30],[80,30],[56,32],[34,38]]),w.paintBlue);for(let s=0;s<12;s++){const r=n.range(34,88),a=n.range(18,30);i+=cn(`M${lt(r-2.4)} ${lt(a)}a2.4 1.7 ${lt(n.range(-30,30))} 1 0 4.8 0a2.4 1.7 0 1 0 -4.8 0Z`,Ut(w.wood,w.paintBlue,.2))}return i+=Ee(Mn([[26,44],[50,45],[76,43],[90,40]]),w.woodDark,1.1)+Ee(Mn([[36,38],[58,40],[80,38]]),w.woodDark,1,.8),e+=ie(t,w.wood,1.8,{inner:i}),e+=Pi(76,30,3.4,He(w.wood),1.5)+Ee(Mn([[93,39],[84,39.4],[78,40.4]]),He(w.wood),1.3),e+=Ee("M86 16L85 9",He(w.wood),1.6)+ie(fi(83,6,3),w.paintBlue,1.1)+ie(fi(89,5,2.6),w.paintBlue,1.1),_n("p1.whale",104,64,52,64,e)}function v5(){const n=new Vt(Mi("p1.rootdoor")),e=(i,s,r,a=!1)=>ie(j(i,s,r),w.bark,1.8,{inner:a?Ee(Mn(i),Ut(w.bark,"#ffffff",.4),1.2,.8):""});let t="";for(const[i,s]of[[52,.4],[110,1.6],[168,2.8]]){const r=[i+Math.sin(s)*4,22];t+=e([r,[i+Math.sin(s+.6)*6,32],[i+Math.sin(s+1)*5,46]],10,12);for(const[a,o]of[[-13,-4],[0,-8],[12,-5]])t+=ie(j([r,[r[0]+a*.6,r[1]+o*.6],[r[0]+a,r[1]+o]],5,2),w.bark,1.3)}for(const i of[-1,1]){const s=110+i*82;for(let a=0;a<4;a++){const o=[110+i*(30+a*13),44],c=[s+i*(a-1.5)*3,150],l=[s+i*(-14+a*11),206],f=[s+i*(-26+a*17)+n.range(-3,3),300],u=[(o[0]+c[0])/2-i*(10-a*2),96];t+=e([o,u,c,l,f],13-a,10-a*.5,a===1)}const r=s+i;t+=ie(ge(r,150,15,9),w.crystal,1.8,{inner:Ee(ge(r,150,10,5),w.crystalDeep,1.2)}),t+=ie(`M${r-5} 141L${r} 130L${r+5} 141Z`,w.crystal,1.4);for(const[a,o,c]of[[s-i*14,104,-.6],[s+i*12,236,.5]])t+=Gs(a,o,14,i>0?-Math.PI+c:c,w.leaf,1.3)}for(let i=0;i<3;i++){const s=[[18+i*4,70-i*6]];for(let r=0;r<=6;r++)s.push([30+r*26.7,42+i*8+Math.sin(r*1.25+i*2.1)*6]);s.push([202-i*4,70-i*6]),t+=e(s,13-i*2,13-i*2,i===1)}for(const[i,s,r]of[[64,26,!1],[80,40,!0],[96,22,!1],[112,34,!1],[128,46,!0],[144,24,!1],[158,30,!1]]){const a=[[i,44],[i+n.range(-4,4),44+s*.55],[i+n.range(-6,6),44+s]];t+=ie(j(a,5,1.4),w.bark,1.4),r&&(t+=Gs(a[2][0],a[2][1],12,Math.PI/2,w.leaf,1.1))}return _n("p1.rootdoor",220,300,110,300,t)}function Ol(n,e,t=w.string,i=2.4){return Ee(`M${n} 0L${n} ${e}`,t,i)}function x5(){const n=new Vt(Mi("p1.charms")),e=.6,t=[];{let i=Ee("M42 0Q38 14 42 30",w.cord,4.6)+Ee("M44 0Q48 14 42 30",Ut(w.cord,"#ffffff",.2),2.8);i+=ie(ve([[16,28],[28,22],[36,32],[48,32],[56,22],[68,28],[66,70],[72,112],[12,112],[18,70]]),w.charmGreen,3.1,{inner:cn(ge(32,60,8,6),Ut(w.charmGreen,w.spine,.4))+cn(ge(52,78,7,9),Ut(w.charmGreen,w.spine,.4))+Ee("M18 92H70",He(w.charmGreen),1.4,.7)}),t.push(_n("p1.charm.tag",84,116,42,0,i,e))}{let i=Ee("M40 0L24 74",w.pole,6.4)+Ee("M40 0L24 74",He(w.pole),1.4,.6);i+=ie("M34 16C80 30 140 52 204 76L186 96L200 120C140 100 80 76 28 58Z",w.banner,3.4);const r=Aa("STRANGE",0,0,20,17,w.bannerInk,3,n);i+=ds("translate(50 28) rotate(21)",r),i+=ds("translate(46 58) rotate(21)",Aa("DAYS",0,0,16,14,w.bannerInk,2.8,n)),t.push(_n("p1.charm.banner",214,128,40,0,i,e))}{const i=[[30,0],[30,34],[50,52],[118,54]];let s=ie(j(i,26,20),w.branch,3.1,{inner:Ee(Mn(i.map(([r,a])=>[r-5,a-5])),Ut(w.branch,"#ffffff",.3),6)});for(const[r,a]of[[-10,-8],[0,0],[10,8]])s+=ie(j([[114,54+r*.4],[140,52+r],[158,50+r+a]],8,3),w.claw,2.2);t.push(_n("p1.charm.branch",172,92,30,0,s,e))}{let i=Ee("M46 0C36 10 38 22 46 26C54 22 56 10 46 0Z",w.pinkTag,3.4)+Ee("M46 0C36 10 38 22 46 26C54 22 56 10 46 0Z",He(w.pinkTag),1,.7);const s=ds("rotate(18 46 66)",ie(Ke(18,30,56,70,4),w.pinkTag,3.1,{inner:Ee(Ke(24,36,44,58,3),He(w.pinkTag),1.2,.6)})+ie(Fc(46,64,19,8,.2),w.starburst,2.2));i+=s,t.push(_n("p1.charm.pinktag",92,112,46,0,i,e))}{let i=Ol(52,36,He(w.leafCharm),3);for(const s of[1.1,1.9,2.7,.3,-.5])i+=Gs(52,40,46,s,w.leafCharm,2.5);t.push(_n("p1.charm.leaf",104,112,52,0,i,e))}{const i=[[150,4],[136,26],[104,44],[70,56],[40,70]];let s="";for(let r=0;r<6;r++){const a=.15+r*.14,o=Math.min(i.length-2,Math.floor(a*(i.length-1))),c=a*(i.length-1)-o,l=i[o],f=i[o+1],u=l[0]+(f[0]-l[0])*c,h=l[1]+(f[1]-l[1])*c;s+=ie(ve([[u-8,h-6],[u-2,h-24+r],[u+6,h-6]]),w.spine,2)}s+=ie(j(i,16,30),w.lizard,3.1,{inner:Ee(Mn(i.map(([r,a])=>[r+4,a+9])),Ut(w.lizard,"#ffffff",.35),6)}),s+=ie(re([[44,60],[24,72],[10,86],[22,92],[44,84],[54,72]]),w.lizardHead,2.8),s+=Pi(42,70,3,He(w.lizardHead),2)+Ee("M14 86L40 80",He(w.lizardHead),2),s+=ie(j([[92,50],[96,66],[90,76]],7,4),w.lizard,2)+ie(j([[124,34],[132,50],[128,60]],7,4),w.lizard,2),t.push(_n("p1.charm.lizard",170,100,150,0,s,e))}{let i=Ol(46,14);i+=ie(j([[40,12],[38,26],[36,40]],6,5),w.imp,2)+ie(j([[52,12],[54,26],[56,40]],6,5),w.imp,2),i+=ie(re([[36,40],[34,54],[40,66],[52,66],[58,54],[56,40],[46,36]]),w.imp,2.5),i+=ie(j([[40,64],[36,76],[34,86]],7,5),w.imp,2)+ie(j([[52,64],[58,76],[60,84]],7,5),w.imp,2),i+=ie(fi(46,30,10),w.imp,2.5)+ie(ve([[38,24],[34,14],[42,20]]),w.imp,1.7)+ie(ve([[52,20],[60,14],[56,24]]),w.imp,1.7),i+=Pi(42,30,2.4,He(w.imp),1.7)+Pi(50,30,2.4,He(w.imp),1.7),i+=Aa("??",26,92,30,22,"#8d818e",3.2,n),t.push(_n("p1.charm.imp",92,128,46,0,i,e))}{let i=Ol(36,22);i+=ie(ve([[16,30],[52,30],[52,70],[16,70]]),w.greyBox,3.1),i+=ie(ve([[16,30],[26,22],[62,22],[52,30]]),Ut(w.greyBox,"#ffffff",.3),2.8),i+=ie(ve([[52,30],[62,22],[62,62],[52,70]]),Ut(w.greyBox,w.dial,.6),2.8),i+=ie(fi(34,50,9),w.dial,2.2)+Ee("M34 50L40 45",He(w.dial),2.2),t.push(_n("p1.charm.box",72,80,36,0,i,e))}return t}function y5(){return[s5(),r5(),a5(),o5(),l5(),c5(),f5(),h5(),u5(),d5(),p5(),m5(),g5(),_5(),M5(),v5(),...x5()]}function gn(n,e,t,i=0,s,r=1){const a=new Path2D(e);n.globalAlpha=r,t&&(n.fillStyle=t,n.fill(a)),i>0&&(n.strokeStyle=s??He(t??w.stone),n.lineWidth=i,n.lineJoin="round",n.lineCap="round",n.stroke(a)),n.globalAlpha=1}function Li(n,e,t,i,s=1){gn(n,e,null,i,t,s)}function Hh(n,e,t){const i=[];let s=0;for(let r=0;r<n.length-1;r++){const a=n[r],o=n[r+1],c=Math.hypot(o[0]-a[0],o[1]-a[1])||1,l=-(o[1]-a[1])/c,f=(o[0]-a[0])/c,u=Math.max(1,Math.round(c/e));for(let h=0;h<u;h++){const d=h/u,p=t(s++);i.push([a[0]+(o[0]-a[0])*d+l*p,a[1]+(o[1]-a[1])*d+f*p])}}return i.push(n[n.length-1]),i}function Gl(n,e,t,i,s,r){const a=kc(n,i.x0,i.y0),o=i.x1-i.x0,c=i.y1-i.y0;return{scroll:n,res:e,depth:t,area:{x:a.x,y:a.y,w:o,h:c},draw:l=>{l.save(),l.translate(-i.x0,-i.y0),l.lineJoin="round",l.lineCap="round",r(l,new Vt(Mi(s))),Ba(l,i.x0-2,i.y0-2,o+4,c+4),l.restore()}}}function S5(n,e,t){n.fillStyle=w.stone,n.fillRect(t.x0,t.y0,t.x1-t.x0,t.y1-t.y0);const i=He(w.stone),s=Fa+64,r=Fa+1237.5-96,a=60,o=2140,c=new Set,f=Hh([[a,s],[o,s],[o,r],[a,r],[a,s]],34,_=>(e.chance(.08)&&c.add(_),(c.has(_)?-1:1)*e.range(4,15)*(_%2?1:.6))),u=re(f,.7);gn(n,u,w.world,4.6,i);const h=400,d=(_,m)=>{const g=[_];let[b,E]=_;for(let v=1;v<=4;v++)b+=m[0]*(h/4)+e.range(-16,16)*Math.abs(m[1]),E+=m[1]*(h/4)+e.range(-16,16)*Math.abs(m[0]),g.push([b,E]);Li(n,ve(g,!1),i,4.2)};for(let _=a+e.range(40,120);_<o-40;_+=e.range(130,230))d([_,s+e.range(-6,6)],[0,-1]),d([_+e.range(-40,40),r+e.range(-6,6)],[0,1]);for(let _=s+e.range(60,140);_<r-40;_+=e.range(140,240))d([a+e.range(-6,6),_],[-1,0]),d([o+e.range(-6,6),_+e.range(-40,40)],[1,0]);const p=[];for(let _=t.x0;_<=t.x1;_+=60)p.push([_,r+46+e.range(-8,8)]);Li(n,Mn(p,.8),i,4.2);for(const[_,m,g,b]of[[300,s,90,1],[760,s,60,1],[1420,s,70,1],[1980,s,110,1],[a,520,80,0],[o,640,70,0],[520,r,70,-1],[1700,r,60,-1]]){const E=[[_,m]];let v=_,S=m;for(let T=0;T<3;T++)b===0?(v+=(_<1e3?1:-1)*g/3,S+=e.range(-18,18)):(v+=e.range(-16,16),S+=b*g/3),E.push([v,S]);Li(n,ve(E,!1),i,3.4,.9)}}function b5(n,e,t,i,s,r){const a=n+t*i,o=e+t*s,c=t*r,l=Math.hypot(a-n,o-e),f=Math.atan2(o-e,a-n),u=Math.acos((t*t+l*l-c*c)/(2*t*l)),h=Math.acos((c*c+l*l-t*t)/(2*c*l)),d=[],p=28;for(let _=0;_<=p;_++){const m=f+u+_/p*(2*Math.PI-2*u);d.push([n+Math.cos(m)*t,e+Math.sin(m)*t])}for(let _=1;_<p;_++){const m=f+Math.PI+h-_/p*2*h;d.push([a+Math.cos(m)*c,o+Math.sin(m)*c])}return ve(d)}function zl(n,e,t,i,s,r){const a=ge(e,t,i,i);gn(n,a,w.eye),n.save(),n.clip(new Path2D(a));const o=t-i+2*i*r;gn(n,`M${e-i-2} ${t-i-2}H${e+i+2}V${o-i*.18}Q${e} ${o+i*.32} ${e-i-2} ${o-i*.18}Z`,s),n.restore(),Li(n,`M${e-i*.98} ${o-i*.2}Q${e} ${o+i*.3} ${e+i*.98} ${o-i*.2}`,He(s),4.2),gn(n,a,null,3.4,He(w.eye))}function T5(n){const e=u=>Fa+u*1237.5,t=e(.134),i=b5(257,t,96,.5,-.36,.8);gn(n,i,w.moon,5),zl(n,219,t-36,32,w.moonLid,.44),Li(n,`M195 ${t+26}L251 ${t+26}`,He(w.moon),4.4);for(const[u,h,d,p,_]of[[452,.134,18,w.starTeal,.1],[543,.125,19,w.starMint,-.15],[482,.17,17,w.starLime,.25],[386,.198,16,w.starPink,-.2]])gn(n,Gh(u,e(h),d,_),p,3.8);const s=1870,r=e(.14),a=62,o=[],c=20;for(let u=0;u<c*2;u++){const h=u/(c*2)*Math.PI*2+.05,d=u%2?a+3:a+25+(u%4===0?5:0);o.push([s+Math.cos(h)*d,r+Math.sin(h)*d])}gn(n,ve(o),w.ray,4),gn(n,ge(s,r,a,a*.96),w.sun,4.6),zl(n,s-21,r-9,17,w.sunLid,.56),zl(n,s+24,r-7,17,w.sunLid,.56),Li(n,`M${s-14} ${r+36}Q${s+1} ${r+22} ${s+16} ${r+36}`,He(w.sun),4.6);const l=1960,f=e(.27);for(const[u,h]of[[-2.35,78],[-.8,80],[2.05,74],[1.05,72]]){const d=[l+Math.cos(u)*h,f+Math.sin(u)*h],p=_=>[l+Math.cos(u)*h*.3+Math.cos(u+Math.PI/2)*_,f+Math.sin(u)*h*.3+Math.sin(u+Math.PI/2)*_];gn(n,ve([[l,f],p(11),d,p(-11)]),w.blade,3.8)}gn(n,re([[l-22,f+2],[l-18,f-14],[l-6,f-22],[l+8,f-22],[l+20,f-12],[l+22,f+6],[l+12,f+20],[l-12,f+20]]),w.skyStar,4),gn(n,ve([[l-6,f-21],[l,f-34],[l+6,f-21]]),w.skyStar,3.4);for(const u of[-8,8])Li(n,`M${l+u-5} ${f-4}Q${l+u} ${f+1} ${l+u+5} ${f-4}`,Ut(w.eye,"#8a6a80",.35),2.6);Li(n,`M${l-4} ${f+9}H${l+4}`,He(w.skyStar),2.4)}function E5(n,e){const t=sr,i=-60,s=2260;gn(n,`M${i} 640H${s}V${t.bottom}H${i}Z`,w.wall),Li(n,`M${i} ${t.bottom}H${s}`,He(w.wall),3.4),gn(n,`M${t.wallLeft} ${t.lidFront}H${t.wallRight}V${t.wallFoot}H${t.wallLeft}Z`,w.wall),gn(n,`M${i} ${t.lidFront}H${t.wallLeft}V${t.wallFoot}L0 ${t.floor}L${i} ${t.floor+6}Z`,w.wallSide),gn(n,`M${t.wallRight} ${t.lidFront}H${s}V${t.floor+6}L2200 ${t.floor}L${t.wallRight} ${t.wallFoot}Z`,w.wallSide),gn(n,`M${t.wallLeft} ${t.wallFoot}H${t.wallRight}L2200 ${t.floor}L${s} ${t.floor+6}V700H${i}V${t.floor+6}L0 ${t.floor}Z`,w.wallFloor);const r=`M${t.lidBackLeft} ${t.lidBack}H${t.lidBackRight}L2200 ${t.lidFront}H0Z`;gn(n,r,w.lid,3.6);const o=Hh([[40,470],[58,420],[110,402],[170,396],[236,352],[300,318],[380,322],[430,360],[500,372],[560,330],[640,282],[740,262],[840,276],[900,312],[940,356],[990,372],[1040,338],[1110,300],[1200,290],[1280,312],[1330,350],[1390,366],[1450,326],[1520,292],[1600,300],[1660,336],[1710,372],[1770,392],[1850,402],[1940,418],[1972,446],[1936,470],[1850,466],[1814,520],[1826,600],[1840,720],[30,720],[44,650],[66,590],[44,520]],16,()=>e.chance(.07)?-e.range(5,9):e.range(-2.4,2.4)),c=re(o,.8);gn(n,c,w.paper),n.save(),n.clip(new Path2D(c)),gn(n,`M${t.wallLeft} ${t.wallFoot}H${t.wallRight}L2200 ${t.floor}V720H0V${t.floor}Z`,w.paperFloor),gn(n,r,w.paperLit);for(const[f,u,h,d]of[[700,280,800,380],[1150,300,1210,390],[1500,300,1560,390],[300,430,420,560],[960,450,1080,580],[1560,440,1680,590]])Li(n,`M${f} ${u}Q${(f+h)/2+14} ${(u+d)/2} ${h} ${d}`,He(w.paper),1.4,.35);n.restore(),gn(n,c,null,3,He(w.paper));const l=Ut(He(w.wall),He(w.paper),.5);Li(n,`M${t.wallLeft} ${t.lidFront}V${t.wallFoot}L-40 ${t.floor+14}M${t.wallRight} ${t.lidFront}V${t.wallFoot}L2240 ${t.floor+14}M${t.wallLeft} ${t.wallFoot}H${t.wallRight}`,l,2.8,.85),Li(n,`M-40 ${t.lidFront}H2240`,He(w.lid),3.4)}function w5(n,e,t,i){n.save(),n.filter="blur(1.8px)",n.lineJoin="round";let s=i.range(-40,160);for(;s<e;){const r=i.range(90,170),a=i.range(24,50),o=[];for(let l=0;l<=8;l++){const f=l/8;o.push([s-r/2+f*r,t+6-Math.sin(f*Math.PI)*a*i.range(.7,1.15)])}o.push([s+r/2,t+10],[s-r/2,t+10]);const c=i.pick([w.paper,w.paperLit,w.wall,w.lid]);if(gn(n,ve(o),c,2.2,He(c),.9),i.chance(.55)){const l=s+i.range(-r*.6,r*.6),f=i.range(40,92),u=f*i.range(.24,.32),h=i.range(-.28,.28),d=i.pick([w.starTeal,w.crystal,w.starPink,w.crystalLilac]);gn(n,ve([[l-u/2,t+6],[l-u/2+h*f*.7,t-f*.75],[l+h*f,t-f],[l+u/2+h*f*.7,t-f*.75],[l+u/2,t+6]]),d,2.2,He(d),.9)}s+=i.range(260,560)}n.restore(),Ba(n,-2,-2,e+4,t+4)}function A5(){const n={x0:-60,y0:Fa-24,x1:2260,y1:1130};return[Gl(ji.stone,.5,-900,n,"p1:stone",(e,t)=>S5(e,t,n)),Gl(ji.sky,.6,-890,{x0:120,y0:Fa-10,x1:2110,y1:300},"p1:sky",e=>T5(e)),Gl(ji.wall,1,-150,{x0:-60,y0:sr.lidBack-16,x1:2260,y1:sr.bottom+12},"p1:box",(e,t)=>E5(e,t))]}const R5=["sperm","blue","bowhead"],Hl={sperm:[96,150,210],blue:[150,210,300],bowhead:[96,150]},Oa={blue:{back:[.28,.86],tail:[.13,.0555],fluke:[0,.058],fin:[.738,.106],eye:[.769,.05],eyeR:.0105,blow:[.822,0],jawRest:0,ext:{u0:-.105,u1:1.01,v0:-.03,v1:.18},spout:.2},sperm:{back:[.37,.975],tail:[.14,.079],fluke:[0,.085],fin:[.64,.184],eye:[.69,.157],eyeR:.011,blow:[.962,0],jaw:[.715,.194],jawRest:.035,ext:{u0:-.14,u1:1.01,v0:-.03,v1:.26},spout:.16,label:[.46,.105]},bowhead:{back:[.23,.69],tail:[.12,.095],fluke:[0,.1],fin:[.6,.262],eye:[.688,.166],eyeR:.012,blow:[.7,0],jaw:[.708,.19],jawRest:0,ext:{u0:-.14,u1:1.005,v0:-.02,v1:.37},spout:.17}};function Xo(n,e){const t=Oa[n];return e/(t.back[1]-t.back[0])}function Uc(n,e){const t=Oa[n],i=Xo(n,e),s=(t.back[0]+t.back[1])/2,r=o=>[(o[0]-s)*i,o[1]*i],a=`whale.${n}.${e}`;return{species:n,size:e,len:i,keys:{body:`${a}.body`,tail:`${a}.tail`,fluke:`${a}.fluke`,fin:`${a}.fin`,lid:`${a}.lid`,jaw:t.jaw?`${a}.jaw`:null,spout:`whale.spout.${n}`},tail:r(t.tail),fluke:r(t.fluke),fin:r(t.fin),jaw:t.jaw?r(t.jaw):null,eye:r(t.eye),blow:r(t.blow),jawRest:t.jawRest,bounds:{x0:(t.ext.u0-s)*i,y0:t.ext.v0*i-t.spout*i,x1:(t.ext.u1-s)*i,y1:t.ext.v1*i},depth:t.ext.v1*i,spoutScale:t.spout*i/Xh[n],label:t.label?{at:r(t.label),scale:Math.min(1.3,Math.max(.6,i/250))}:null}}const Y=n=>Math.round(n*100)/100;class Nc{constructor(e,t){Se(this,"L");Se(this,"uc");this.L=e,this.uc=t}x(e){return(e-this.uc)*this.L}y(e){return e*this.L}p(e,t){return[this.x(e),this.y(t)]}nodes(e){return e.map(([t,i,s])=>({x:this.x(t),y:this.y(i),s:!!s?.includes("s"),c:!!s?.includes("c"),g:!!s?.includes("g")}))}pts(e){return e.map(([t,i])=>this.p(t,i))}}const ps=(n,e=[])=>n.map(([t,i],s)=>({x:t,y:i,s:!1,c:e.includes(s),g:!1}));function $c(n,e){const t=n.length,i=s=>e?n[(s+t)%t]:s<0||s>=t?null:n[s];return n.map((s,r)=>{if(s.c)return[0,0];const a=i(r-1),o=i(r+1),c=(u,h)=>Math.hypot(h.x-u.x,h.y-u.y)||1,l=!!a?.s,f=s.s;if(a&&o&&l&&f)return[0,0];if(a&&o&&l){if(!s.g)return[o.x-s.x,o.y-s.y];const u=c(a,s),h=c(s,o);return[(s.x-a.x)/u*h,(s.y-a.y)/u*h]}if(a&&o&&f){if(!s.g)return[s.x-a.x,s.y-a.y];const u=c(s,o),h=c(a,s);return[(o.x-s.x)/u*h,(o.y-s.y)/u*h]}return!a&&o?[o.x-s.x,o.y-s.y]:a&&!o?[s.x-a.x,s.y-a.y]:[(o.x-a.x)/2,(o.y-a.y)/2]})}function Bc(n,e,t,i){return n.s?`L${Y(e.x)} ${Y(e.y)}`:`C${Y(n.x+t[0]/3)} ${Y(n.y+t[1]/3)} ${Y(e.x-i[0]/3)} ${Y(e.y-i[1]/3)} ${Y(e.x)} ${Y(e.y)}`}function qo(n){const e=$c(n,!0);let t=`M${Y(n[0].x)} ${Y(n[0].y)}`;for(let i=0;i<n.length;i++)t+=Bc(n[i],n[(i+1)%n.length],e[i],e[(i+1)%n.length]);return t+"Z"}function L5(n,e,t){const i=n.length,s=$c(n,!0);let r=`M${Y(n[e%i].x)} ${Y(n[e%i].y)}`;for(let a=e;a<t;a++)r+=Bc(n[a%i],n[(a+1)%i],s[a%i],s[(a+1)%i]);return r}function C5(n){const e=$c(n,!1);let t=`M${Y(n[0].x)} ${Y(n[0].y)}`;for(let i=0;i<n.length-1;i++)t+=Bc(n[i],n[i+1],e[i],e[i+1]);return t}const Ht=n=>C5(ps(n)),jt=(n,e=C,t=1)=>F(n,dt,e,t),Pf=(n,e,t,i,s=1)=>`<circle cx="${Y(n)}" cy="${Y(e)}" r="${Y(t)}" fill="${i}"${s!==1?` opacity="${Y(s)}"`:""}/>`,Vh=(n,e,t,i,s=C*.8)=>`<circle cx="${Y(n)}" cy="${Y(e)}" r="${Y(t)}" fill="${i}" stroke="${dt}" stroke-width="${s}"/>`;function Gn(n,e,t={}){const i=qo(n);let s=J(i,e,{stroke:0,inner:t.inner,over:t.over});if(!t.runs)s+=F(i,dt,zi);else for(const[r,a]of t.runs)s+=F(L5(n,r,a),dt,zi);return s}function Ra(n,e){const t=[...n].sort((i,s)=>i[0]-s[0]);if(e<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++){const s=t[i-1],r=t[i];if(e<=r[0])return s[1]+(r[1]-s[1])*(e-s[0])/(r[0]-s[0]||1)}return t[t.length-1][1]}function qn(n,e){const t={x0:1/0,y0:1/0,x1:-1/0,y1:-1/0};for(const i of n)for(const[s,r]of i)t.x0=Math.min(t.x0,s),t.y0=Math.min(t.y0,r),t.x1=Math.max(t.x1,s),t.y1=Math.max(t.y1,r);return{x0:t.x0-e,y0:t.y0-e,x1:t.x1+e,y1:t.y1+e}}const si=n=>n.map(e=>[e.x,e.y]);function Pn(n,e,t,i,s=!0){const r=zi+2,a=Math.floor(t.x0-r),o=Math.floor(t.y0-r),c=Math.ceil(t.x1+r)-a,l=Math.ceil(t.y1+r)-o;return{key:n,w:c,h:l,px:i[0]-a,py:i[1]-o,body:`<g transform="translate(${-a} ${-o})">${e}</g>`,scale:Math.max(c,l)>120?1.5:2,grain:s}}function Oc(n,e,t,i){const s=t*1.3,r=t*.92,a=ge(n,e,s,r),o=`M${Y(n-s-1)} ${Y(e-r-1)}H${Y(n+s+1)}V${Y(e-r*.28)}Q${Y(n)} ${Y(e+r*.05)} ${Y(n-s-1)} ${Y(e-r*.3)}Z`;return J(a,ye.cream,{stroke:C,inner:Pf(n+t*.32,e+t*.12,t*.62,dt)+Pf(n+t*.5,e-t*.08,t*.2,ye.cream)+xe(o,i),over:jt(`M${Y(n-s)} ${Y(e-r*.3)}Q${Y(n)} ${Y(e+r*.05)} ${Y(n+s)} ${Y(e-r*.28)}`,C*.8)})+jt(Ht([[n-s*.9,e-r*1.55],[n+t*.1,e-r*2.05],[n+s*1.05,e-r*1.5]]),C*.8,.85)}function Gc(n,e,t,i){const s=t*1.3+1.2,r=t*.92+1.2;return J(ge(n,e,s,r),i,{stroke:C*.8})+jt(`M${Y(n-s*.85)} ${Y(e-r*.05)}Q${Y(n)} ${Y(e+r*.75)} ${Y(n+s*.85)} ${Y(e-r*.1)}`,C)}function Wh(n,e,t,i=C*.85){let s="",r=e/2;for(let a=1;a<n.length;a++){const[o,c]=n[a-1],[l,f]=n[a],u=Math.hypot(l-o,f-c)||1,h=-(f-c)/u,d=(l-o)/u;for(;r<u;r+=e){const p=o+(l-o)*r/u,_=c+(f-c)*r/u;s+=`M${Y(p-h*t*.5-(l-o)/u*t*.2)} ${Y(_-d*t*.5-(f-c)/u*t*.2)}L${Y(p+h*t*.5+(l-o)/u*t*.2)} ${Y(_+d*t*.5+(f-c)/u*t*.2)}`}r-=u}return jt(s,i,.9)}function xa(n,e,t,i,s=C*.8,r=.6,a=dt){const o=[];for(let c=0;c<=4;c++)o.push([n+t*c/4,e+(c%2===0?0:c===1?-i:i)]);return F(Ht(o),a,s,r)}function Df(n,e,t,i,s){const r=Math.cos(i),a=Math.sin(i),o=(g,b)=>[n+r*g-a*b,e+a*g+r*b],[c,l]=o(t,0),[f,u]=o(t*.45,-t*.32),[h,d]=o(t*.5,t*.3),p=`M${Y(n)} ${Y(e)}Q${Y(f)} ${Y(u)} ${Y(c)} ${Y(l)}Q${Y(h)} ${Y(d)} ${Y(n)} ${Y(e)}Z`,[_,m]=o(t*.8,0);return J(p,s,{stroke:C})+jt(`M${Y(n)} ${Y(e)}L${Y(_)} ${Y(m)}`,C*.7,.8)}function P5(n,e,t,i,s){const a=-i/2,o=i*.28,c=`M${Y(-11.5+o)} ${Y(a)}H${Y(11.5-o)}Q${Y(11.5)} ${Y(a)} ${Y(11.5)} ${Y(a+o)}V${Y(-a-o)}Q${Y(11.5)} ${Y(-a)} ${Y(11.5-o)} ${Y(-a)}H${Y(-11.5+o)}Q${Y(-11.5)} ${Y(-a)} ${Y(-11.5)} ${Y(-a-o)}V${Y(a+o)}Q${Y(-11.5)} ${Y(a)} ${Y(-11.5+o)} ${Y(a)}Z`,l=i*.62,f=`M${Y(-l*.62)} ${Y(-l*.22)}L${Y(-l*.36)} ${Y(-l*.5)}V${Y(l*.5)}`,u=`M${Y(l*.42)} ${Y(l*.5)}V${Y(-l*.5)}L${Y(-l*.05)} ${Y(l*.18)}H${Y(l*.66)}`,h=i*.2,d=[[-11.5+h,a+h],[11.5-h,a+h],[11.5-h,-a-h],[-11.5+h,-a-h],[-11.5+h,a+h]];return`<g transform="translate(${Y(n)} ${Y(e)}) rotate(${Y(s*180/Math.PI)})">${J(c,ye.butter,{stroke:C})}${Wh(d,i*.3,i*.12,C*.6)}${jt(f+u,C*.95)}</g>`}function Xr(n,e,t,i,s,r,a){const o=Math.cos(e),c=Math.sin(e),l=(p,_)=>[n[0]+o*p-c*_,n[1]+c*p+o*_],f=s.length,u=[],h=[];for(let p=0;p<f;p++){const _=p/(f-1),m=Math.sin(Math.PI*_)*a*t;u.push(l(_*t,m+s[p]*i)),h.push(l(_*t,m-r[p]*i))}return[l(-i*.45,0),...u.slice(0,f-1),u[f-1],...h.slice(0,f-1).reverse()]}const Zn={fill:ye.periwinkle,deep:ye.periwinkleDeep,pale:"#b9c1ea",throat:"#cdd2f1",edge:"#e6e9f8",patch:"#aab4e6",lid:"#8a97d4"},wi={fill:"#b5a3c0",deep:"#8d7a9b",pale:"#d6cadf",lip:ye.cream,mouth:"#d596b4",lid:"#9f8cad"},ni={fill:"#8f98a6",deep:"#6c7482",pale:"#b7bec8",chin:ye.cream,spot:"#434955",band:"#d7dadf",baleen:"#5b6170",baleenLine:"#a9aebb",lid:"#7a8391"};function D5(n){const e="blue",t=Oa[e],i=Xo(e,n),s=new Nc(i,(t.back[0]+t.back[1])/2),r=Uc(e,n),a=new Vt(9100+n),o=s.nodes([[.13,.024],[.2,.0105],[.28,0,"sg"],[.86,0,"g"],[.925,.0045],[.966,.013],[.99,.022],[.998,.031],[1.004,.042],[.996,.052],[.972,.064],[.93,.081],[.86,.103],[.77,.124],[.66,.138],[.55,.141],[.44,.134],[.34,.119],[.25,.103],[.18,.092],[.13,.087,"s"]]),c=[[1,.045],[.972,.064],[.93,.081],[.86,.103],[.77,.124],[.66,.138],[.55,.141],[.44,.134],[.34,.119]],l=[[.995,.046],[.93,.061],[.84,.074],[.74,.088],[.64,.1],[.55,.11],[.5,.118],[.47,.13]];let f=xe(`${Ht(s.pts(l))}L${Y(s.x(.46))} ${Y(s.y(.2))}L${Y(s.x(1.05))} ${Y(s.y(.2))}Z`,Zn.throat);for(const D of[.2,.38,.56,.74,.9]){const G=[],K=.53-D*.05;for(let W=.975;W>=K;W-=.035){const le=Ra(l,W);G.push(s.p(W,le+(Ra(c,W)-le)*D))}f+=F(Ht(G),Zn.deep,C*.8,.9)}for(let D=0;D<Math.round(i/9);D++){const G=a.range(.16,.84),K=a.range(.012,Math.max(.02,Ra(l,G)-.008)),W=a.range(.004,.011)*i,le=a.chance(.6);f+=xe(ge(s.x(G),s.y(K),W*a.range(1.1,1.8),W*a.range(.6,.9)),le?Zn.pale:Zn.deep,le?.85:.55)}const u=s.p(.47,.062),h=.036*i,d=.021*i,p=[];for(let D=0;D<9;D++){const G=D/9*Math.PI*2,K=1+.12*Math.sin(D*2.3+1);p.push([u[0]+Math.cos(G)*h*K,u[1]+Math.sin(G)*d*K])}f+=J(qo(ps(p)),Zn.patch,{stroke:C*.7}),f+=Wh([...p,p[0]],Math.max(3.4,.02*i),.007*i+1.2,C*.65);const _=Ht(s.pts([[.998,.037],[.96,.046],[.9,.053],[.84,.058],[.803,.061],[.788,.068]])),m=s.p(...t.eye),g=jt(Ht(s.pts([[.8,.0085],[.822,.0045],[.846,.0075]])),C*.9,.9)+jt(`M${Y(s.x(.814))} ${Y(s.y(.0125))}l${Y(.012*i)} 0.4M${Y(s.x(.814))} ${Y(s.y(.0165))}l${Y(.012*i)} 0.4`,C*.8,.8)+jt(_,zi*.85)+jt(Ht(s.pts([[.62,.012],[.52,.02],[.4,.024]])),C*.7,.35)+Oc(m[0],m[1],t.eyeR*i,Zn.lid),b=s.nodes([[.265,.006],[.25,-.002],[.232,-.012],[.214,-.022,"c"],[.222,-.009],[.219,.004],[.212,.016]]),E=ps(Xr(s.p(.745,.116),.5,.1*i,.02*i,[.5,.55,.5,.4,.25,0],[.5,.4,.33,.25,.15,0],.04));let v=Gn(E,Zn.deep)+Gn(b,Zn.fill);v+=Gn(o,Zn.fill,{inner:f,over:g,runs:[[0,o.length-1]]});const S=qn([si(o),si(b),si(E)],.012*i),T=s.nodes([[.165,.0165],[.13,.024],[.08,.034],[.03,.042],[0,.046,"s"],[0,.07],[.05,.075],[.1,.081],[.13,.0855],[.165,.0895,"s"]]),P=Gn(T,Zn.fill,{inner:xe(ge(s.x(.08),s.y(.05),.012*i,.006*i),Zn.pale,.8)+xe(ge(s.x(.035),s.y(.058),.007*i,.004*i),Zn.deep,.5),runs:[[0,4],[5,9]]}),x=s.nodes([[.012,.046],[-.01,.042],[-.035,.026],[-.06,.006],[-.082,-.012],[-.1,-.024,"c"],[-.093,0],[-.083,.03],[-.074,.058,"c"],[-.083,.086],[-.093,.116],[-.1,.14,"c"],[-.082,.128],[-.06,.11],[-.035,.09],[-.01,.074],[.012,.07]]),A=Gn(x,Zn.fill,{over:jt(Ht(s.pts([[0,.058],[-.035,.058],[-.068,.058]])),C*.8,.55)+F(Ht(s.pts([[-.02,.043],[-.05,.022],[-.08,0]])),Zn.edge,C,.9)+jt(`M${Y(s.x(-.07))} ${Y(s.y(.1))}l${Y(.008*i)} ${Y(-.006*i)}M${Y(s.x(-.078))} ${Y(s.y(.11))}l${Y(.007*i)} ${Y(-.005*i)}`,C*.7,.6),runs:[[0,16]]}),I=Xr(s.p(...t.fin),.44,.135*i,.026*i,[.42,.55,.56,.5,.42,.3,.16,0],[.42,.4,.36,.31,.25,.18,.1,0],.035),B=ps(I),U=I.slice(2,8),z=Gn(B,Zn.fill,{over:F(Ht(U),Zn.edge,C*1.1,.95)});return[Pn(r.keys.body,v,S,[0,0]),Pn(r.keys.tail,P,qn([si(T)],.006*i),r.tail),Pn(r.keys.fluke,A,qn([si(x)],.006*i),r.fluke),Pn(r.keys.fin,z,qn([I],.006*i),r.fin),Pn(r.keys.lid,Gc(m[0],m[1],t.eyeR*i,Zn.lid),qn([[m]],t.eyeR*i*1.6+2),r.eye)]}function k5(n){const e="sperm",t=Oa[e],i=Xo(e,n),s=new Nc(i,(t.back[0]+t.back[1])/2),r=Uc(e,n),a=new Vt(7300+n),o=[],c=U=>.01+(.33-U)*.037/.18;for(let U=.165;U<.32;U+=.03)o.push([U,c(U)]),o.push([U+.015,c(U+.015)-.0075]);const l=s.nodes([[.14,.05],...o,[.328,.008],[.341,-.004],[.353,-.008],[.364,-.003],[.37,0,"sg"],[.975,0,"g"],[.991,.009],[.999,.035],[1.003,.085],[.999,.135],[.988,.164],[.967,.179],[.92,.184],[.85,.186],[.77,.19],[.72,.196],[.68,.205],[.6,.215],[.5,.216],[.41,.204],[.32,.179],[.25,.152],[.2,.132],[.14,.108,"s"]]),f=s.nodes([[.715,.189],[.8,.187],[.9,.184],[.952,.183],[.948,.203],[.9,.211],[.8,.216],[.73,.216]]);let u=xe(Ht(s.pts([[.3,.26],[.36,.19],[.46,.175],[.56,.185],[.64,.23]]))+"Z",wi.pale,.9);for(let U=0;U<Math.round(i/8);U++){const z=a.range(.17,.64),D=z<.33?c(z)+.02:.03,G=a.range(D,z<.3?.11:.175);u+=xa(s.x(z),s.y(G),a.range(.02,.034)*i,.0035*i+.4,C*.75,.55)}for(let U=0;U<5;U++){const z=a.range(.78,.96),D=a.range(.05,.15);u+=Vh(s.x(z),s.y(D),a.range(.005,.009)*i,wi.pale,C*.6)}u+=jt(Ht(s.pts([[.52,.085],[.6,.08],[.66,.1],[.68,.13]])),C*.8,.5);const h=s.p(...t.eye),d=jt(Ht(s.pts([[.948,.012],[.955,.006],[.962,.01],[.969,.005]])),C,.95)+jt(Ht(s.pts([[.672,.03],[.664,.085],[.672,.14]])),C*.8,.45)+Oc(h[0],h[1],t.eyeR*i,wi.lid),p=ps(Xr(s.p(.655,.196),.75,.07*i,.03*i,[.5,.6,.62,.5,.28,0],[.5,.45,.4,.3,.16,0],.03));let _=Gn(p,wi.deep)+Gn(f,wi.mouth,{inner:jt(Ht(s.pts([[.73,.206],[.83,.204],[.93,.198]])),C*.7,.5)});_+=Gn(l,wi.fill,{inner:u,over:d,runs:[[0,l.length-1]]});const m=qn([si(l),si(p),si(f)],.012*i),g=s.nodes([[.172,.042],[.14,.05],[.127,.0505],[.114,.0565],[.1,.0585],[.07,.064],[.035,.068],[0,.071,"s"],[0,.099],[.04,.104],[.075,.109],[.105,.107],[.14,.108],[.172,.116,"s"]]);let b="";for(let U=0;U<3;U++)b+=xa(s.x(.03+U*.045),s.y(.08+U%2*.012),.022*i,.003*i+.4,C*.7,.5);const E=Gn(g,wi.fill,{inner:b,runs:[[0,7],[8,13]]}),v=s.nodes([[.012,.072],[-.012,.066],[-.045,.046],[-.08,.021],[-.112,-.003],[-.132,-.016,"c"],[-.119,.018],[-.105,.052],[-.093,.085,"c"],[-.105,.118],[-.119,.152],[-.132,.186,"c"],[-.112,.173],[-.08,.149],[-.045,.124],[-.012,.104],[.012,.098]]),S=Gn(v,wi.fill,{over:jt(Ht(s.pts([[0,.085],[-.045,.085],[-.088,.085]])),C*.8,.5)+xa(s.x(-.1),s.y(.035),.02*i,.003*i,C*.7,.45)+xa(s.x(-.1),s.y(.14),.02*i,.003*i,C*.7,.45),runs:[[0,16]]}),T=Xr(s.p(...t.fin),.62,.085*i,.036*i,[.46,.6,.66,.62,.48,.26,0],[.46,.44,.42,.38,.3,.16,0],.03),P=Gn(ps(T),wi.fill,{over:xa(T[3][0]-2,T[3][1]-3,.025*i,.003*i+.3,C*.7,.5)}),x=s.nodes([[.715,.187],[.78,.187],[.86,.186],[.922,.188],[.94,.194],[.933,.2],[.87,.206],[.8,.212],[.74,.217],[.706,.213],[.699,.2]]);let A="";for(let U=.745;U<=.925;U+=.0155){const z=s.x(U),D=s.y(.1885),G=.0045*i+.25,K=.012*i+.6;A+=J(`M${Y(z-G)} ${Y(D+1)}Q${Y(z-G*.3)} ${Y(D-K*.7)} ${Y(z+G*.15)} ${Y(D-K)}Q${Y(z+G*.5)} ${Y(D-K*.5)} ${Y(z+G)} ${Y(D+1)}Z`,ye.cream,{stroke:C*.7})}const I=A+Gn(x,wi.fill,{inner:xe(Ht(s.pts([[.7,.186],[.8,.186],[.95,.19],[.95,.23],[.7,.23]]))+"Z",wi.lip),over:jt(Ht(s.pts([[.72,.2],[.8,.2],[.88,.197]])),C*.6,.5)}),B=qn([si(x)],.016*i);return[Pn(r.keys.body,_,m,[0,0]),Pn(r.keys.tail,E,qn([si(g)],.008*i),r.tail),Pn(r.keys.fluke,S,qn([si(v)],.006*i),r.fluke),Pn(r.keys.fin,P,qn([T],.006*i),r.fin),Pn(r.keys.jaw,I,B,r.jaw),Pn(r.keys.lid,Gc(h[0],h[1],t.eyeR*i,wi.lid),qn([[h]],t.eyeR*i*1.6+2),r.eye)]}function I5(n){const e="bowhead",t=Oa[e],i=Xo(e,n),s=new Nc(i,(t.back[0]+t.back[1])/2),r=Uc(e,n),a=new Vt(5500+n),o=[[.99,.262],[.968,.215],[.935,.168],[.89,.132],[.835,.113],[.785,.112],[.75,.127],[.725,.155],[.708,.19]],c=s.nodes([[.12,.05],[.17,.026],[.205,.008],[.23,0,"sg"],[.69,0,"g"],[.735,.009],[.79,.032],[.845,.07],[.9,.12],[.945,.175],[.975,.225],[.991,.258],[.978,.27],[.948,.234],[.912,.197],[.868,.169],[.82,.158],[.775,.16],[.742,.18],[.72,.212],[.69,.265],[.655,.315],[.6,.328],[.5,.316],[.4,.292],[.31,.252],[.23,.207],[.17,.17],[.12,.14,"s"]]);let l="";for(let z=0;z<=22;z++){const G=.985-z/22*.265,K=Ra(o,G);l+=`M${Y(s.x(G))} ${Y(s.y(K))}l${Y(-.006*i)} ${Y(.045*i)}`}const f=`${Ht(s.pts(o))}L${Y(s.x(.72))} ${Y(s.y(.26))}L${Y(s.x(1))} ${Y(s.y(.3))}Z`;let u=xe(f,ni.baleen)+F(l,ni.baleenLine,C*.7,.8);for(let z=0;z<4;z++){const D=a.range(.3,.6),G=a.range(.06,.2);u+=F(Ht([s.p(D,G),s.p(D-.03,G+a.range(-.01,.012)),s.p(D-.055,G+a.range(-.006,.02))]),ni.pale,C*.9,.8)}const h=s.p(...t.eye),d=jt(Ht(s.pts(o)),C,.9)+jt(`M${Y(s.x(.69))} ${Y(s.y(.007))}q${Y(.009*i)} ${Y(-.004*i)} ${Y(.018*i)} ${Y(.002*i)}M${Y(s.x(.694))} ${Y(s.y(.013))}q${Y(.009*i)} ${Y(-.004*i)} ${Y(.018*i)} ${Y(.002*i)}`,C*.9,.9)+jt(Ht(s.pts([[.64,.012],[.625,.04],[.628,.075]])),C*.8,.5)+jt(Ht(s.pts([[.47,.03],[.4,.04],[.32,.045]])),C*.7,.35)+Oc(h[0],h[1],t.eyeR*i,ni.lid),p=ps(Xr(s.p(.615,.28),.95,.08*i,.036*i,[.5,.62,.62,.5,.28,0],[.5,.46,.4,.3,.16,0],.03));let _=Gn(p,ni.deep);_+=Gn(c,ni.fill,{inner:u,over:d,runs:[[0,c.length-1]]});const m=qn([si(c),si(p)],.012*i),g=s.nodes([[.155,.032],[.12,.05],[.08,.065],[.04,.074],[0,.08,"s"],[0,.12],[.04,.124],[.08,.13],[.12,.14],[.155,.158,"s"]]),b=qo(s.nodes([[.078,.05,"c"],[.064,.1],[.076,.15,"c"],[.018,.15,"c"],[.03,.105],[.016,.075],[.026,.05,"c"]])),E=Df(s.x(.1),s.y(.062),.035*i+3,-2.2,ye.leaf)+Df(s.x(.1),s.y(.062),.03*i+3,-1.25,ye.mint)+Gn(g,ni.fill,{inner:xe(b,ni.band)+jt(Ht(s.pts([[.078,.05],[.064,.1],[.076,.15]])),C*.6,.5),runs:[[0,4],[5,9]]}),v=qn([si(g),[s.p(.1,.062-.05)]],.012*i+4),S=s.nodes([[.012,.08],[-.015,.078],[-.05,.06],[-.085,.032],[-.115,.004],[-.137,-.014,"c"],[-.121,.022],[-.108,.062],[-.1,.1,"c"],[-.108,.138],[-.121,.178],[-.137,.214,"c"],[-.115,.196],[-.085,.168],[-.05,.14],[-.015,.122],[.012,.12]]),T=Gn(S,ni.fill,{inner:xe(`${Ht(s.pts([[-.137,-.014],[-.121,.022],[-.108,.062],[-.1,.1],[-.108,.138],[-.121,.178],[-.137,.214]]))}L${Y(s.x(-.16))} ${Y(s.y(.2))}L${Y(s.x(-.16))} ${Y(s.y(0))}Z`,ni.band,.9),over:jt(Ht(s.pts([[0,.1],[-.05,.1],[-.095,.1]])),C*.8,.5),runs:[[0,16]]}),P=Xr(s.p(...t.fin),.72,.1*i,.042*i,[.46,.6,.66,.62,.48,.26,0],[.46,.44,.44,.4,.32,.18,0],.04),x=Gn(ps(P),ni.fill,{over:F(Ht(P.slice(2,6)),ni.pale,C,.8)}),A=s.nodes([[.708,.19],[.725,.155],[.75,.127],[.785,.112],[.835,.113],[.89,.132],[.935,.168],[.968,.215],[.99,.26],[.997,.283],[.986,.306],[.957,.325],[.9,.337],[.82,.34],[.72,.337],[.665,.33],[.648,.3],[.655,.26],[.672,.225],[.69,.203]]),I=`${Ht(s.pts([[.84,.36],[.85,.3],[.875,.255],[.91,.225],[.945,.2],[.985,.19]]))}L${Y(s.x(1.03))} ${Y(s.y(.19))}L${Y(s.x(1.03))} ${Y(s.y(.36))}Z`;let B="";for(let z=0;z<16;z++){const D=a.range(.86,.985),G=a.range(Math.max(.2,Ra([[.86,.3],[.9,.24],[.95,.21],[.99,.265]],D)+.012),.33),K=a.range(.0025,.0055)*i+.3;B+=xe(ge(s.x(D),s.y(G),K,K*.8),ni.spot,.85)}const U=Gn(A,ni.fill,{inner:xe(I,ni.chin)+B+jt(Ht(s.pts([[.84,.36],[.85,.3],[.875,.255],[.91,.225],[.945,.2],[.985,.19]])),C*.7,.55),over:jt(Ht(s.pts([[.69,.3],[.72,.318],[.78,.326]])),C*.7,.45)});return[Pn(r.keys.body,_,m,[0,0]),Pn(r.keys.tail,E,v,r.tail),Pn(r.keys.fluke,T,qn([si(S)],.006*i),r.fluke),Pn(r.keys.fin,x,qn([P],.006*i),r.fin),Pn(r.keys.jaw,U,qn([si(A)],.008*i),r.jaw),Pn(r.keys.lid,Gc(h[0],h[1],t.eyeR*i,ni.lid),qn([[h]],t.eyeR*i*1.6+2),r.eye)]}const Xh={blue:96,sperm:58,bowhead:64},_o="#e9f5f3";function Vl(n,e,t){const i=[],s=[];for(let f=0;f<n.length;f++){const u=n[Math.max(0,f-1)],h=n[Math.min(n.length-1,f+1)],d=Math.hypot(h[0]-u[0],h[1]-u[1])||1,p=-(h[1]-u[1])/d,_=(h[0]-u[0])/d,m=n[f],g=f>0?1+t.range(-.12,.12):1;i.push([m[0]+p*e[f]*g,m[1]+_*e[f]*g]),s.push([m[0]-p*e[f]*g,m[1]-_*e[f]*g])}const r=n[n.length-1],a=n[n.length-2],o=Math.hypot(r[0]-a[0],r[1]-a[1])||1,c=[r[0]+(r[0]-a[0])/o*e[e.length-1]*.8,r[1]+(r[1]-a[1])/o*e[e.length-1]*.8],l=[...i,c,...s.reverse()];return{d:qo(ps(l)),pts:l}}function F5(n){const e=new Vt(4400+n.length),t=Xh[n];let i="";const s=[],r=(a,o,c,l)=>{for(let f=0;f<l;f++){const u=e.range(-Math.PI,0),h=c*e.range(.9,1.35),d=a+Math.cos(u)*h,p=o+Math.sin(u)*h*.8;i+=Vh(d,p,e.range(1.1,2),_o,C*.6),s.push([[d,p]])}};if(n==="blue"){const a=Vl([[0,0],[.5,-t*.3],[1,-t*.58],[0,-t*.8],[-1,-t*.93]],[2.2,5,8,12,13],e);i+=J(a.d,_o,{stroke:C,over:jt(Ht([[0,-t*.2],[.5,-t*.45],[0,-t*.7]]),C*.6,.35)}),s.push(a.pts),r(0,-t*.86,14,6)}else if(n==="sperm"){const a=Vl([[0,0],[t*.18,-t*.3],[t*.36,-t*.58],[t*.5,-t*.8]],[2,6,10,13],e);i+=J(a.d,_o,{stroke:C}),s.push(a.pts),r(t*.5,-t*.84,13,6)}else for(const a of[-1,1]){const o=Vl([[a*1.5,0],[a*t*.12,-t*.32],[a*t*.24,-t*.62],[a*t*.32,-t*.84]],[1.8,4.5,7.5,9],e);i+=J(o.d,_o,{stroke:C}),s.push(o.pts),r(a*t*.32,-t*.9,9,4)}return{...Pn(`whale.spout.${n}`,i,qn(s,3),[0,0],!1),scale:2}}const U5=[ye.aqua,ye.blush,ye.lavender,ye.butter],N5=[ye.aqua,ye.periwinkle,ye.mint];function $5(){const n=[];return U5.forEach((e,t)=>{const i=J(ge(0,0,5,5),e,{stroke:C,over:jt("M-2.6 -1.2Q-2.2 -2.8 -0.6 -3.1",C*.8,.8)});n.push({...Pn(`whale.bubble.${t}`,i,{x0:-5,y0:-5,x1:5,y1:5},[0,0],!1),scale:2})}),N5.forEach((e,t)=>{const i=J("M0 -6.5Q1.2 -3 3.4 0.6A3.5 3.5 0 1 1 -3.4 0.6Q-1.2 -3 0 -6.5Z",e,{stroke:C});n.push({...Pn(`whale.drop.${t}`,i,{x0:-4,y0:-7,x1:4,y1:5},[0,0],!1),scale:2})}),n}let Wl=null;function B5(){if(Wl)return Wl;const n=[];for(const e of Hl.blue)n.push(...D5(e));for(const e of Hl.sperm)n.push(...k5(e));for(const e of Hl.bowhead)n.push(...I5(e));for(const e of R5)n.push(F5(e));return n.push(...$5()),n.push({...Pn("whale.label",P5(0,0,23,14,-.06),{x0:-13,y0:-9,x1:13,y1:9},[0,0]),scale:2.5}),Wl=n,n}let Qs=null;function qh(){if(Qs)return Qs;const n=t=>t.map(i=>({...i,body:lg(i.body)}));Qs=[...n(x3()),...n(B3()),...n(Z3()),...H4(),...V_()],Qs.push(...B5()),Qs.push(...y5());const e=new Set;for(const t of Qs){if(e.has(t.key))throw new Error(`Duplicate art key ${t.key}`);e.add(t.key)}return Qs}function O5(){return[Eg,$g,t3,g3,_3,M3,z3,H3,Y3]}const Xl=(n,e)=>{const t=Math.min(1133,Math.max(-213,n+90-640));return{x:n-(1-ji.wall)*t,y:e-(1-ji.wall)*180,scroll:ji.wall}},ql=(n,e)=>({...kc(ji.wall,n,e),scroll:ji.wall}),ws=n=>({...kc(ji.charms,n,sr.bottom),scroll:ji.charms,oy:0,depth:-5}),Fo={id:"r01",width:2200,theme:"nursery",checkpoints:[{id:"r01_start",x:290,y:660,facing:1,silent:!0},{id:"r01_door",x:1600,y:660}],solids:[{x:0,y:660,w:2200,h:120,style:"paper"},{x:0,y:0,w:160,h:660,style:"soil",hidden:!0},{x:160,y:0,w:1540,h:130,style:"soil",hidden:!0},{x:1700,y:130,w:70,h:300,style:"root",hidden:!0},{x:1770,y:0,w:430,h:440,style:"soil",hidden:!0},{x:322,y:590,w:216,h:20,style:"bed",oneWay:!0,hidden:!0},{x:842,y:590,w:128,h:20,style:"wood",oneWay:!0,hidden:!0}],props:[{key:"p1.arm",...ql(640,sr.lidBack+56),ox:.311,oy:.987,depth:-146},{key:"p1.arm",...ql(1560,sr.lidBack+56),ox:.689,oy:.987,flipX:!0,depth:-146},{key:"p1.cube",...ql(1100,sr.lidBack+36),scale:1.15,depth:-144},{key:"p1.lamp",x:80,y:330,ox:.5,oy:.5,depth:-100},{key:"p1.lamp",x:2120,y:330,ox:.5,oy:.5,flipX:!0,depth:-100},{key:"p1.marks",...Xl(1085,470),oy:.5,depth:-120},{key:"p1.picture",...Xl(1245,470),oy:.5,depth:-120},{key:"p1.window",...Xl(1441,465),oy:.566,depth:-120},{key:"p1.rootling",x:185,y:662,depth:-30},{key:"p1.bed",x:430,y:662,depth:-20},{key:"p1.whale",x:620,y:662,depth:5},{key:"p1.tree",x:760,y:662,depth:-40},{key:"p1.gift",x:900,y:662,depth:-20},{key:"p1.starfolk",x:1010,y:662,depth:-15},{key:"p1.shade",x:1165,y:662,depth:-10},{key:"p1.flower",x:1468,y:662,depth:-15},{key:"p1.rootdoor",x:1735,y:662,depth:12},{key:"p1.charm.tag",...ws(150)},{key:"p1.charm.banner",...ws(360),ox:40/214},{key:"p1.charm.branch",...ws(610),ox:30/172},{key:"p1.charm.pinktag",...ws(930)},{key:"p1.charm.leaf",...ws(1250)},{key:"p1.charm.lizard",...ws(1540),ox:150/170},{key:"p1.charm.imp",...ws(1790)},{key:"p1.charm.box",...ws(2040)}]};let Zo=1;function G5(n){Zo=Math.max(1,n)}let Ir=null;function Fr(n){Ir||(Ir=new Map(qh().map(t=>[t.key,t])));const e=Ir.get(n);if(!e)throw new Error(`Missing art: ${n}`);return e}function z5(n){return Ir||(Ir=new Map(qh().map(e=>[e.key,e]))),Ir.has(n)}function _s(n,e){const t=document.createElement("canvas");return t.width=Math.max(1,Math.ceil(n)),t.height=Math.max(1,Math.ceil(e)),[t,t.getContext("2d")]}async function Uo(n,e){const[t,i]=_s(n.w*e,n.h*e);if(!n.body)return t;try{i.drawImage(await t5(e5(n,e)),0,0,t.width,t.height)}catch{return t}return n5(n)&&Ba(i,0,0,t.width,t.height,{scale:e}),t}function Ur(n){const e=new $o(n);return e.premultiplyAlpha=!0,e.colorSpace="",e.minFilter=1008,e.magFilter=1006,e.anisotropy=Zo,e}function Yo(n,e=!1){const t=new $o(n);return t.colorSpace=di,t.minFilter=1008,t.anisotropy=Zo,e&&(t.wrapS=t.wrapT=1e3),t}const H5=`
#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	// Premultiplied sRGB texels (see cardTexture): straighten, then decode.
	vec3 straightColor = sampledDiffuseColor.rgb / max( sampledDiffuseColor.a, 0.0001 );
	diffuseColor.rgb *= sRGBTransferEOTF( vec4( straightColor, 1.0 ) ).rgb;
	diffuseColor.a *= sampledDiffuseColor.a;
#endif
`;function Nr(n,e={}){const t={map:n,color:e.color??16777215,alphaTest:.5,alphaToCoverage:!0},i=e.unlit?new $a(t):new Qi(t);return i.shadowSide=2,i.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace("#include <map_fragment>",H5)},i.customProgramCacheKey=()=>"diorama-card",i}function gc(n,e=128){const[t,i]=_s(e,e),s=i.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);for(const[a,o]of n)s.addColorStop(a,`rgba(255,255,255,${o})`);i.fillStyle=s,i.fillRect(0,0,e,e);const r=new $o(t);return r.colorSpace="",r}function V5(n=1.6){const[e,t]=_s(4,128),i=t.createImageData(4,128);for(let r=0;r<128;r++){const a=Math.round(255*Math.pow(1-r/127,n));for(let o=0;o<4;o++){const c=(r*4+o)*4;i.data[c]=255,i.data[c+1]=255,i.data[c+2]=255,i.data[c+3]=a}}t.putImageData(i,0,0);const s=new $o(e);return s.colorSpace="",s.flipY=!1,s}function W5(n){return new Promise((e,t)=>{new ju().load(n,i=>{i.colorSpace=di,i.anisotropy=Zo,e(i)},void 0,()=>t(new Error(`Could not load ${n}`)))})}const Bn=.01,X5=660,vt=n=>n*Bn,un=n=>(X5-n)*Bn,Un={wall:-1.5,front:3.8},As=(n,e)=>1-Math.exp(-n*e);class q5{constructor(e,t,i){Se(this,"camera");Se(this,"focus",new H);Se(this,"focusDist",8);Se(this,"mode","follow");Se(this,"dragYaw",0);Se(this,"dragPitch",0);Se(this,"dragging",!1);Se(this,"fixedPose",null);Se(this,"yaw",0);Se(this,"roll",0);Se(this,"dist",8.8);Se(this,"lookX",0);Se(this,"fx",0);Se(this,"fy",0);Se(this,"fz",0);Se(this,"t",0);Se(this,"fov",30);Se(this,"bounds");this.camera=new yi(this.fov,e,.1,80),this.bounds=[t,i]}snap(e){this.fx=vt(e.x),this.fy=un(e.y)+.85,this.fz=e.z,this.lookX=0,this.yaw=0,this.roll=0,this.dist=8.8,this.update(e,0)}update(e,t){this.t+=t;let i;if(this.mode==="fixed"&&this.fixedPose?i=this.fixedPose:this.mode==="wide"?i=this.widePose():i=this.followPose(e,t),!this.dragging){const s=As(1.6,t);this.dragYaw-=this.dragYaw*s,this.dragPitch-=this.dragPitch*s}this.apply(i,this.dragYaw,this.dragPitch),this.focusDist=this.camera.position.distanceTo(new H(vt(e.x),un(e.y)+.7,e.z))}followPose(e,t){const i=Math.min(1,Math.abs(e.vx)/235);this.lookX+=(e.facing*.55*i-this.lookX)*As(1.8,t);const[s,r]=this.bounds,a=Math.max(s,Math.min(r,vt(e.x)+this.lookX)),o=un(e.y)+.85-(e.onGround?0:.35);this.fx+=(a-this.fx)*As(3.2,t),this.fy+=(o-this.fy)*As(e.onGround?2.6:1.2,t),this.fz+=(e.z*.6-this.fz)*As(2.5,t);const c=e.vx/235;this.yaw+=(-.075*c-this.yaw)*As(1.4,t),this.roll+=(.006*c-this.roll)*As(1.6,t);const l=Math.min(1,Math.max(0,(e.stillT-.6)/2.2)),f=8.8+.55*i-1.15*l*l*(3-2*l);this.dist+=(f-this.dist)*As(l>0?.9:1.8,t);const u=.012*Math.sin(this.t*.37)+.006*Math.sin(this.t*.83+1.3);return{target:new H(this.fx,this.fy,this.fz),dist:this.dist,yaw:.03+this.yaw+u,pitch:-.14+.008*Math.sin(this.t*.29),roll:this.roll,fov:this.fov}}widePose(){return{target:new H(vt(930),2.6,-.4),dist:19.5,yaw:0,pitch:-.12,roll:0,fov:34}}apply(e,t,i){const s=e.yaw+t,r=e.pitch+i;this.focus.copy(e.target);const a=this.camera;a.position.set(e.target.x+Math.sin(s)*Math.cos(r)*e.dist,e.target.y-Math.sin(r)*e.dist,e.target.z+Math.cos(s)*Math.cos(r)*e.dist),a.up.set(Math.sin(e.roll),Math.cos(e.roll),0),a.lookAt(e.target),a.fov!==e.fov&&(a.fov=e.fov,a.updateProjectionMatrix())}setAspect(e){this.camera.aspect=e,this.camera.updateProjectionMatrix()}}const Z5=9404809;function zc(n,e,t,i){const s=new Gi(n*Bn,e*Bn);return s.translate((.5-t)*n*Bn,-(.5-i)*e*Bn,0),s}function wo(n){const e=new Oi,t=zc(n.w,n.h,n.ox,n.oy),i=new fn(t,Nr(n.tex,{unlit:n.unlit}));if(i.castShadow=n.cast??n.thick>0,i.receiveShadow=!0,i.name="front",e.add(i),n.thick>0){const s=Nr(n.tex,{color:n.edge??Z5}),r=n.thick>.025?2:1;for(let a=1;a<=r;a++){const o=a/r,c=new fn(t,s);c.position.set(1.1*Bn*o,-1.4*Bn*o,-n.thick*o),c.receiveShadow=!0,e.add(c)}}return e}function Mo(n,e,t,i,s,r,a,o=[2.56,2.56]){const c=new $s(t-n,i-e,r-s);c.translate((n+t)/2,(e+i)/2,(s+r)/2);const l=c.getAttribute("position"),f=c.getAttribute("normal"),u=c.getAttribute("uv");for(let d=0;d<l.count;d++){const p=l.getX(d),_=l.getY(d),m=l.getZ(d),[g,b]=o;Math.abs(f.getX(d))>.5?u.setXY(d,m/g,_/b):Math.abs(f.getY(d))>.5?u.setXY(d,p/g,m/b):u.setXY(d,p/g,_/b)}const h=new fn(c,a);return h.castShadow=!0,h.receiveShadow=!0,h}function _c(n,e,t,i=.5){const s=new fn(new Gi(e,t),new $a({map:n,color:3023672,transparent:!0,opacity:i,depthWrite:!1}));return s.rotation.x=-Math.PI/2,s.renderOrder=1,s}function kf(n,e,t,i){const s=new Bu(new Zf({map:n,color:e,transparent:!0,opacity:i,depthWrite:!1,blending:2}));return s.scale.set(t,t,1),s.renderOrder=2,s}function Y5(n){const e=[],t=new Set,i=[...n.joints];let s=0;for(;i.length&&s++<1e3;){const r=i.shift();r.parent===null||t.has(r.parent)?(e.push(r),t.add(r.id)):i.push(r)}if(i.length)throw new Error(`Rig ${n.id}: unresolved joint parents`);return e}function K5(n,e,t,i=new Map){for(const s of n){const r=e[s.id]??0,a=t?.[s.id],o=s.x+(a?.x??0),c=s.y+(a?.y??0);let l=i.get(s.id);if(l||(l={joint:s,x:0,y:0,rot:0},i.set(s.id,l)),s.parent===null)l.x=o,l.y=c,l.rot=r;else{const f=i.get(s.parent),u=Math.cos(f.rot),h=Math.sin(f.rot);l.x=f.x+o*u-c*h,l.y=f.y+o*h+c*u,l.rot=f.rot+r}}return i}function Q5(n,e){const t=e===1?"R":"L",i=s=>s.z+(s.side?s.side===t?100:-100:0);return n.filter(s=>s.part).sort((s,r)=>i(s)-i(r))}function J5(n,e){return n.side?(e===1?"R":"L")===n.side:!0}const ya={surprise:()=>({raise:-6.5,knit:-.2,asym:-1.5}),pain:n=>({raise:2.2,knit:-.62+.06*Ue(n*30),asym:1.2}),joy:n=>({raise:-4.5-1.5*Math.abs(Ue(n*9)),knit:-.3,asym:0}),anger:()=>({raise:2.5,knit:.8,asym:0}),talk:n=>({raise:-2.2*Math.abs(Ue(n*8.5)),knit:.14*Ue(n*3.7),asym:-1.2*Math.max(0,Ue(n*2.3))}),listen:n=>({raise:-2.6,knit:-.14,asym:-1.6*Math.max(0,Ue(n*.8))}),relief:()=>({raise:-3,knit:-.38,asym:0}),worry:n=>({raise:-1.5,knit:-.55+.05*Ue(n*6),asym:.8}),effort:n=>({raise:2,knit:.55+.05*Ue(n*20),asym:0}),shout:n=>({raise:2.4,knit:.8+.06*Ue(n*26),asym:0})};function j5(n,e,t,i){let s={raise:0,knit:0,asym:0};switch(n){case"idle":{const a=Math.max(0,Ue(e*.9)-.82)*22,o=Math.max(0,Ue(e*.37+1)-.9)*26;s={raise:-a,knit:.04*Ue(e*.5),asym:-o},i==="suit"&&(s={raise:1.4,knit:-.32,asym:0});const c=Mc(t.idleT??0,i);if(c){const l=c.env,f=c.kind==="look"?{raise:-4,knit:-.15,asym:-2}:c.kind==="stretch"?{raise:-2,knit:-.3,asym:0}:c.kind==="hum"?{raise:-3-1.2*Math.abs(Ue(e*3.4)),knit:-.25,asym:0}:{raise:-1,knit:.3,asym:-3.2};s={raise:s.raise+(f.raise-s.raise)*l,knit:s.knit+(f.knit-s.knit)*l,asym:s.asym+(f.asym-s.asym)*l}}break}case"dance":s={raise:-5-1.5*Math.abs(Ue(e*8)),knit:-.3,asym:0};break;case"conjure":s={raise:-5,knit:-.28,asym:-1};break;case"stomp":s=e<.26?{raise:1.5,knit:.55,asym:0}:{raise:2.8,knit:.75,asym:0};break;case"walk":s={raise:0,knit:i==="suit"?-.3:.1,asym:0};break;case"run":s={raise:.8,knit:.3,asym:0};break;case"push":s=ya.effort(e);break;case"crouch":case"takeoff":s={raise:1.4,knit:.42,asym:0};break;case"rise":s={raise:-5,knit:-.12,asym:-1.2};break;case"apex":s={raise:-6-1*Math.abs(Ue(e*7)),knit:-.28,asym:-1.8};break;case"fall":{const a=Math.min(1,Math.max(0,(t.vy??300)/700));s={raise:-3.5-3*a,knit:-.35*a,asym:-1.5*a};break}case"land":{const a=Math.min(1,t.k??e/.28),o=.4+.6*(t.impact??.5);s={raise:3*o*(1-a),knit:.6*o*(1-a),asym:0};break}case"interact":s={raise:-3,knit:-.08,asym:-2.6};break;case"reach":case"pull":s={raise:1,knit:.45,asym:0};break;case"song":s={raise:-2.4-1.4*Ue(e*3.2),knit:-.2,asym:1*Ue(e*1.6)};break;case"breath":s={raise:1.6,knit:.36+.05*Ue(e*5),asym:0};break;case"transform":s={raise:-5.5,knit:-.35+.18*Ue(e*18),asym:-1};break;case"hurt":s=ya.pain(e);break;case"collapse":s={raise:1.8,knit:-.55,asym:0};break;case"kneel":case"sit":s={raise:.6,knit:-.45,asym:0};break;case"shout":s=ya.anger(e);break;case"ride":s={raise:-3-1*Ue(e*7),knit:.12,asym:0};break;case"point":s={raise:.8,knit:.55,asym:0};break;case"look":s={raise:-3.5,knit:-.12,asym:-3};break;case"getup":{s=(t.k??0)>.7?ya.effort(e):{raise:-2,knit:-.15,asym:-1};break}case"sleep":{const a=t.k??0;s={raise:.8-5*a,knit:-.18-.2*a,asym:0};break}}i==="coward"&&(s={raise:s.raise-1.2,knit:s.knit-.32,asym:s.asym}),i==="mech"&&(s={raise:s.raise+.6,knit:s.knit+.18,asym:s.asym});const r=Math.max(0,Math.min(1,t.emoteK??0));if(t.emote&&r>0){const a=ya[t.emote](e);s={raise:s.raise+(a.raise-s.raise)*r,knit:s.knit+(a.knit-s.knit)*r,asym:s.asym+(a.asym-s.asym)*r}}return s}function e6(n,e,t){const i=t==="root"?.45:t==="mech"?.6:1,s=t==="root"?1.35:t==="mech"?.95:1.15;n.angles.browN=e.knit*s,n.offsets.browN={x:e.knit*1.4,y:(e.raise+e.asym*.6)*i}}const Ue=Math.sin,Zl=Math.cos,t6=n=>1-(1-n)*(1-n),La=(n,e,t)=>{const i=Math.min(1,Math.max(0,(t-n)/(e-n)));return i*i*(3-2*i)},If=3.5,Ff=8;function Mc(n,e){if(n<If||e==="suit")return null;const t=n-If,i=Math.floor(t/Ff),s=e==="coward"?["look"]:e==="mech"?["look","stretch"]:["look","stretch","hum","scratch"],r=s[i%s.length],a=r==="hum"?3.4:r==="stretch"?2.6:2.8,o=t-i*Ff;if(o>a)return null;const c=o/a;return{kind:r,u:c,env:La(0,.2,c)*(1-La(.8,1,c))}}function Uf(n,e,t){for(const[i,s]of Object.entries(e)){const r=n.angles[i]??0;n.angles[i]=r+(s-r)*t}}function n6(n,e,t,i){const s=n.angles,r=e.env;switch(e.kind){case"look":{s.head=(s.head??0)-.3*r+.1*r*Ue(e.u*Math.PI*3),s.torso=(s.torso??0)-.05*r,n.offsets.eyeN={x:.5*r*Ue(e.u*Math.PI*3),y:-.8*r};break}case"stretch":{Uf(n,{...i==="coward"?{}:{armR:-2.9,foreR:-.12,armL:-2.75,foreL:-.2},torso:-.16,head:-.4,footR:.35,footL:.3},r),n.offsets.hips={x:0,y:(n.offsets.hips?.y??0)-3*r};break}case"hum":{const a=Ue(t*3.4);s.torso=(s.torso??0)+.07*a*r,s.head=(s.head??0)+.12*Ue(t*3.4+.6)*r,i!=="coward"&&(s.armR=(s.armR??0)+.18*a*r,s.armL=(s.armL??0)-.18*a*r),n.offsets.hips={x:0,y:(n.offsets.hips?.y??0)+1.4*Math.abs(a)*r};break}case"scratch":{Uf(n,{armR:-2.55,foreR:-2.3+.14*Ue(t*24),head:.16,torso:.04},r);break}}}function i6(n,e,t,i,s){const r={eye:"",ex:1,ey:1,mouth:"",ms:1};switch(n){case"idle":s&&s.env>.3&&(s.kind==="stretch"?(r.eye="shut",r.mouth="open",r.ms=1.3):s.kind==="hum"?(r.eye="happy",r.mouth="smile"):s.kind==="look"?(r.ex=1.12,r.ey=1.15):r.mouth="frown");break;case"run":r.mouth="open",r.ms=.8;break;case"push":case"pull":case"reach":r.ey=.55,r.mouth="grit";break;case"crouch":case"takeoff":r.ey=.7,r.mouth="grit";break;case"rise":r.ex=1.1,r.ey=1.15,r.mouth="open",r.ms=.85;break;case"apex":r.eye="happy",r.mouth="grin";break;case"fall":{const o=Math.min(1,Math.max(0,(t.vy??300)/700));r.ex=1+.25*o,r.ey=1+.35*o,r.mouth=o>.35?"open":"",r.ms=.8+.5*o;break}case"land":(t.impact??0)>.5&&(t.k??1)<.55?(r.eye="shut",r.mouth="grit"):r.ey=.8;break;case"interact":case"look":r.ex=1.1,r.ey=1.15,r.mouth="open",r.ms=.6;break;case"song":r.eye="happy",r.mouth="open",r.ms=.7+.3*Math.abs(Ue(e*5.5));break;case"breath":r.ey=.45;break;case"transform":r.ex=1.3,r.ey=1.4,r.mouth="open",r.ms=1.2;break;case"collapse":r.eye="shut",r.mouth="frown";break;case"kneel":case"sit":r.eye="sad",r.mouth="frown";break;case"shout":r.ey=.75,r.mouth="open",r.ms=1.55+.1*Ue(e*30);break;case"ride":r.mouth="grin";break;case"dance":case"conjure":r.eye="happy",r.mouth="grin";break;case"stomp":r.ey=.55,r.mouth="grit";break;case"torchUp":r.ey=1.1,r.mouth="open",r.ms=.6;break;case"sleep":{const o=t.k??0;r.eye=(t.blink??1)>.97?"shut":"",r.mouth="open",r.ms=o>.04?.55+1.15*o:.32+.07*Ue(e*1.35);break}}i==="suit"&&!r.eye&&(r.eye="sad",r.mouth||(r.mouth="frown")),i==="coward"&&(!r.eye&&r.ex===1&&(r.ex=1.08,r.ey=1.12),r.mouth||(r.mouth="frown",r.ms=1+.08*Ue(e*41)));const a=Math.max(0,Math.min(1,t.emoteK??0));if(t.emote&&a>.3)switch(t.emote){case"joy":r.eye="happy",r.mouth="grin";break;case"surprise":r.eye="",r.ex=1.25,r.ey=1.35,r.mouth="open",r.ms=1.1;break;case"pain":r.eye="shut",r.mouth="grit";break;case"anger":r.ey=.7,r.mouth="grit";break;case"talk":r.mouth=Ue(e*17)>-.2||Ue(e*6.3)>.7?"open":"",r.ms=.55+.45*Math.abs(Ue(e*9));break;case"listen":r.mouth="";break;case"relief":r.eye="happy",r.mouth="smile";break;case"worry":r.eye="sad",r.mouth="frown";break;case"effort":r.eye="",r.ey=.5,r.mouth="grit";break;case"shout":r.eye="",r.ey=.8,r.mouth="open",r.ms=1.55+.12*Ue(e*28);break}return r}function s6(n,e,t){const s=e.eye===""||e.eye==="sad"?Math.min(1,Math.max(0,t.blink??0)):0;n.frames={...n.frames??{},eyeN:e.eye,mouth:e.mouth},n.scales={...n.scales??{},eyeN:{x:e.ex,y:Math.max(.08,e.ey*(1-.9*s))},mouth:{x:e.ms,y:e.ms}}}function r6(){return{angles:{},offsets:{}}}function a6(n){return n.includes("human")?"human":n.includes("suit")?"suit":n.includes("coward")?"coward":n.includes("mech")?"mech":"root"}const Zh={root:{stride:.66,knee:1.1,arm:.7,bob:4.4,lean:.13,kneeBase:.06,torsoBase:.02,headBase:0},human:{stride:.46,knee:.85,arm:.45,bob:2.6,lean:.07,kneeBase:.09,torsoBase:-.03,headBase:.05},coward:{stride:.38,knee:.8,arm:.1,bob:1.5,lean:.1,kneeBase:.55,torsoBase:.16,headBase:.18},mech:{stride:.5,knee:.9,arm:.3,bob:1.2,lean:.04,kneeBase:.12,torsoBase:0,headBase:0},suit:{stride:.3,knee:.6,arm:.12,bob:1.2,lean:.05,kneeBase:.1,torsoBase:.2,headBase:.28}};function o6(n,e,t){const i=Zh[e],s=n.angles;s.torso=i.torsoBase,s.head=i.headBase,s.legR=-i.kneeBase*.6,s.shinR=i.kneeBase,s.legL=-i.kneeBase*.6+.04,s.shinL=i.kneeBase,s.footR=-(s.legR+s.shinR),s.footL=-(s.legL+s.shinL),s.armR=-.08,s.foreR=-.18,s.armL=.1,s.foreL=-.12,n.offsets.hips={x:0,y:i.kneeBase*10},e==="coward"&&Yh(n,t),e==="suit"&&(s.armR=.05,s.armL=.12,s.foreR=-.08+.035*Ue(t*31),s.foreL=-.06+.035*Ue(t*27+1))}function Yh(n,e){const t=n.angles,i=.04*Ue(e*23)+.025*Ue(e*37);t.armR=-.95+i,t.foreR=-.95-i,t.armL=-.75+i,t.foreL=-1.15}function Yl(n,e,t,i={}){const s=a6(n),r=Zh[s],a=r6(),o=a.angles;switch(o6(a,s,t),e){case"idle":{const l=Ue(t*2.1);a.offsets.torso={x:0,y:-.6-.6*l},o.head=(o.head??0)+.03*Ue(t*1.3),o.armR=(o.armR??0)+.04*l,o.armL=(o.armL??0)+.04*l,s==="root"&&(o.head=(o.head??0)+.02*Ue(t*.7)),s==="suit"&&(a.offsets.torso={x:0,y:-.3*l});const f=Mc(i.idleT??0,s);f&&n6(a,f,t,s);break}case"dance":{const l=t*8;o.legR=-.22+.16*Ue(l),o.shinR=.35+.25*Math.max(0,Ue(l)),o.legL=.05-.16*Ue(l),o.shinL=.35+.25*Math.max(0,-Ue(l)),o.footR=-(o.legR+o.shinR),o.footL=-(o.legL+o.shinL),a.offsets.hips={x:0,y:r.kneeBase*10+3.5*Math.abs(Ue(l))},o.torso=r.torsoBase+.09*Ue(l/2),o.head=r.headBase-.18+.14*Ue(l/2+.7),s!=="coward"&&(o.armR=-2.55+.4*Ue(l),o.foreR=-.35+.25*Ue(l+1),o.armL=-2.35-.4*Ue(l+.8),o.foreL=-.3+.25*Ue(l+2));break}case"walk":case"run":case"push":{const l=i.phase??t*8,f=Math.min(1,Math.max(.25,i.speed??1)),u=r.stride*(.55+.45*f),h=-u*Ue(l),d=u*Ue(l),p=r.kneeBase+r.knee*Math.pow(Math.max(0,Zl(l)),1.4)*f,_=r.kneeBase+r.knee*Math.pow(Math.max(0,-Zl(l)),1.4)*f;o.legR=h-r.kneeBase*.5,o.legL=d-r.kneeBase*.5,o.shinR=p,o.shinL=_,o.footR=-(o.legR+o.shinR)*.85+(Ue(l)<0?-.25*-Ue(l):0),o.footL=-(o.legL+o.shinL)*.85+(Ue(l)>0?-.25*Ue(l):0);const m=r.bob*(.5+.5*f);a.offsets.hips={x:0,y:r.kneeBase*10+m*(.5-.5*Zl(2*l))},o.torso=r.torsoBase+r.lean*f,o.head=r.headBase-o.torso*.5+.03*Ue(2*l),s!=="coward"&&(o.armR=r.arm*f*Ue(l-.35)+.05,o.armL=-r.arm*f*Ue(l-.35)+.1,o.foreR=-.25-.2*f*Math.max(0,-Ue(l-.35)),o.foreL=-.25-.2*f*Math.max(0,Ue(l-.35))),s==="human"&&(a.offsets.torso={x:0,y:1.1*Math.max(0,Ue(2*l+.6))}),s==="mech"&&(o.armR=.18*Ue(Math.round(l*2)/2),o.armL=-.18*Ue(Math.round(l*2)/2)),s==="suit"&&(o.foreR=-.08+.035*Ue(t*31),o.foreL=-.06+.035*Ue(t*27+1)),e==="push"&&(o.torso=.5,o.head=-.25,o.armR=-1.35,o.foreR=-.25,o.armL=-1.25,o.foreL=-.3);break}case"crouch":{o.legR=-.8,o.shinR=1.45,o.legL=-.62,o.shinL=1.35,o.footR=-(o.legR+o.shinR),o.footL=-(o.legL+o.shinL),a.offsets.hips={x:0,y:14+r.kneeBase*10},o.torso=r.torsoBase+.4,o.head=r.headBase-.22,s!=="coward"&&(o.armR=.9,o.foreR=-.25,o.armL=.75,o.foreL=-.2);break}case"takeoff":{o.legR=.1,o.shinR=.12,o.legL=.32,o.shinL=.3,o.footR=-(o.legR+o.shinR)+.75,o.footL=-(o.legL+o.shinL)+.85,a.offsets.hips={x:0,y:-2},o.torso=r.torsoBase-.02,o.head=r.headBase-.25,s!=="coward"&&(o.armR=-2.4,o.foreR=-.25,o.armL=-2.1,o.foreL=-.35);break}case"rise":{const f=1-Math.min(1,Math.max(0,-(i.vy??-300)/Math.max(1,i.jv??600)));o.legR=-.5-.65*f,o.shinR=.55+1*f,o.legL=.2-.5*f,o.shinL=.5+.95*f,o.footR=-(o.legR+o.shinR)+.55,o.footL=-(o.legL+o.shinL)+.6,o.torso=r.torsoBase+.03,o.head=r.headBase-.2+.06*f,s!=="coward"&&(o.armR=-2.3+.55*f,o.foreR=-.3-.25*f,o.armL=-2+.9*f,o.foreL=-.3);break}case"apex":{const l=Ue(t*7);o.legR=-1.2,o.shinR=1.7,o.legL=-.78,o.shinL=1.8,o.footR=-(o.legR+o.shinR)+.45,o.footL=-(o.legL+o.shinL)+.5,a.offsets.hips={x:0,y:-3},o.torso=r.torsoBase-.06,o.head=r.headBase-.3,s!=="coward"&&(o.armR=-1.95-.1*l,o.foreR=-.45,o.armL=1.9+.1*l,o.foreL=.45),s==="mech"&&(o.armR=-1.5,o.armL=1.2,o.foreR=-.2,o.foreL=.2);break}case"fall":{const l=Math.min(1,Math.max(0,(i.vy??300)/700)),f=l*Ue(t*15);o.legR=-.3-.15*l,o.shinR=.5-.2*l,o.legL=.12,o.shinL=.45-.15*l,o.footR=-(o.legR+o.shinR)*.6-.1,o.footL=-(o.legL+o.shinL)*.6+.15,o.torso=r.torsoBase-.03-.05*l,o.head=r.headBase-.18-.12*l,s!=="coward"&&(o.armR=-1.7-.6*l+.22*f,o.foreR=-.35-.2*l,o.armL=-2-.5*l-.22*f,o.foreL=-.3),s==="mech"&&(o.armR=-1.3,o.armL=-1.1);break}case"land":{const l=(.35+.65*Math.min(1,i.impact??.5))*(1-t6(Math.min(1,i.k??0)));o.legR=-.72*l,o.shinR=1.35*l+r.kneeBase,o.legL=-.6*l,o.shinL=1.3*l+r.kneeBase,o.footR=-(o.legR+o.shinR),o.footL=-(o.legL+o.shinL),a.offsets.hips={x:0,y:15*l+r.kneeBase*10},o.torso=r.torsoBase+.45*l,o.head=r.headBase-.28*l,s!=="coward"&&(o.armR=-.95*l,o.foreR=-.2-.5*l,o.armL=-.65*l,o.foreL=-.2-.4*l);break}case"conjure":{const l=Math.min(1,t/.25);o.armR=-.3-1.7*l,o.foreR=-.5*l,o.armL=-.2-1.4*l,o.foreL=-.45*l,o.torso=r.torsoBase-.12*l,o.head=r.headBase-.22*l,o.legR=-.12,o.shinR=.18+r.kneeBase,o.legL=.1,o.shinL=.12+r.kneeBase,o.footR=-(o.legR+o.shinR),o.footL=-(o.legL+o.shinL);break}case"stomp":{if(t<.26){const l=Math.min(1,t/.2);o.legR=-1.3*l,o.shinR=1.45*l+r.kneeBase,o.footR=-(o.legR+o.shinR)+.2,o.legL=.05,o.shinL=.15+r.kneeBase,o.footL=-(o.legL+o.shinL),o.torso=r.torsoBase-.1*l,o.head=r.headBase-.2*l,o.armR=-2.3*l,o.foreR=-.4*l,o.armL=-2*l,o.foreL=-.3*l}else{const l=Math.min(1,(t-.26)/.08);o.legR=-.35*(1-l)-.05,o.shinR=.35*(1-l)+.45,o.footR=-(o.legR+o.shinR),o.legL=-.2,o.shinL=.55,o.footL=-(o.legL+o.shinL),a.offsets.hips={x:0,y:9+r.kneeBase*10},o.torso=r.torsoBase+.32,o.head=r.headBase-.15,o.armR=-.6,o.foreR=-.9,o.armL=-.35,o.foreL=-.8}break}case"interact":{o.armR=-1.25,o.foreR=-.35,o.torso=r.torsoBase+.12,o.head=r.headBase+.12;break}case"reach":{o.armR=-1.62,o.foreR=.05,o.armL=.55,o.foreL=-.2,o.torso=.22,o.head=-.12,o.legR=-.35,o.shinR=.35,o.legL=.35,o.shinL=.2;break}case"pull":{o.armR=-2.3,o.foreR=-.2,o.armL=-2,o.foreL=-.3,o.legR=-.5,o.shinR=.9,o.legL=-.1,o.shinL=.8,o.torso=.18;break}case"song":{const l=Ue(t*5.5);o.torso=-.12-.03*l,o.head=-.35,o.armR=-.95-.12*l,o.foreR=-.4,o.armL=.8+.12*l,o.foreL=-.4,a.offsets.torso={x:0,y:-1.2*(.5+.5*l)};break}case"breath":{o.torso=r.torsoBase-.06,o.head=r.headBase+.12,o.armR=.28,o.foreR=-.55,o.armL=.34,o.foreL=-.55,a.offsets.torso={x:0,y:-2},a.offsets.armR={x:0,y:-1.5},a.offsets.armL={x:0,y:-1.5},s==="coward"&&Yh(a,t);break}case"transform":{const l=Ue(t*22);o.torso=-.2+.05*l,o.head=-.45,o.armR=-2.1+.15*l,o.foreR=-.3,o.armL=2.1-.15*l,o.foreL=.3,o.legR=-.25,o.legL=.25,o.shinR=.2,o.shinL=.2;break}case"hurt":{o.torso=-.32,o.head=-.35,o.armR=-1.5,o.foreR=-.5,o.armL=-1.9,o.foreL=-.4,o.legR=-.35,o.shinR=.45,o.legL=.25,o.shinL=.2;break}case"collapse":{const l=Math.min(1,i.k??1);o.torso=1.15*l,o.head=.5*l,o.legR=-1.25*l,o.shinR=2*l,o.legL=-1.05*l,o.shinL=2.1*l,o.footR=-(o.legR+o.shinR),o.footL=-(o.legL+o.shinL),o.armR=-.3*l,o.armL=-.5*l,a.offsets.hips={x:0,y:26*l};break}case"sleep":{const l=.5+.5*Ue(t*1.35);o.legR=.04,o.shinR=.1,o.footR=-.35,o.legL=-.05,o.shinL=.14,o.footL=-.28,a.offsets.hips={x:0,y:0},o.torso=-.04,a.offsets.torso={x:1.1*l,y:0},o.head=-.2+.03*l+.18*(i.k??0),o.armR=-.12-.04*l,o.foreR=-2.25,o.armL=.16,o.foreL=-.3;break}case"getup":{const l=i.k??0,f=i.lie??0,u=La(0,.45,l),h=La(.45,.7,l),d=La(.7,1,l),p=-(1-f)*Math.PI*.5,_=(p+(-1.45-p)*h)*(1-d),m=(.05+1.5*h)*(1-d)+.06*d;o.legR=_,o.legL=_+.08*(1-d),o.shinR=m,o.shinL=m+.05*h*(1-d),o.footR=-.3*(1-d)-(o.legR+o.shinR)*d,o.footL=-.25*(1-d)-(o.legL+o.shinL)*d;const g=Math.sin(Math.PI*d);o.torso=-.05+.2*u+.35*g-.15*d,o.head=-.1+.08*u-.12*g,o.armR=.45*(1-h)*(1-d)-.5*h*(1-d)-.55*g,o.foreR=-.2-.9*h*(1-d)-.3*g,o.armL=.35*(1-h)*(1-d)-.4*h*(1-d)-.45*g,o.foreL=-.2-.8*h*(1-d)-.3*g;break}case"kneel":case"sit":{o.legR=-1.45,o.shinR=1.55,o.footR=-.1,o.legL=.1,o.shinL=1.65,o.footL=-1.75,a.offsets.hips={x:0,y:17},o.torso=.05,o.head=.25,o.armR=-.3,o.foreR=-.9,o.armL=-.2,o.foreL=-.8;break}case"shout":{const l=Ue(t*30)*.03;o.torso=-.28+l,o.head=-.42,o.armR=.65,o.foreR=.1,o.armL=.8,o.foreL=.15,o.legR=-.3,o.shinR=.2,o.legL=.35,o.shinL=.1;break}case"ride":{o.legR=-1.25,o.shinR=1.45,o.footR=-.3,o.legL=-1.2,o.shinL=1.4,o.footL=-.3,o.torso=.18+.04*Math.sin(t*9),o.head=-.18,o.armR=-.95,o.foreR=-.55,o.armL=-.85,o.foreL=-.6,a.offsets.hips={x:0,y:0};break}case"point":{o.armR=-1.9,o.foreR=-.05,o.torso=-.05,o.head=-.25;break}case"look":{o.head=-.35,o.torso=-.06;break}case"torchUp":{o.armR=-2.7,o.foreR=-.2,o.armL=-2.55,o.foreL=-.3,o.torso=-.1,o.head=-.4;break}}if(s==="coward"&&(o.torch=-((o.torso??0)+(o.armR??0)+(o.foreR??0))+(e==="torchUp"?0:.12),o.flame=.05*Math.sin(t*17)),i.look){o.head=(o.head??0)+i.look;const l=a.offsets.eyeN??{x:0,y:0};a.offsets.eyeN={x:l.x,y:l.y+i.look*2.4}}const c=e==="idle"?Mc(i.idleT??0,s):null;return s6(a,i6(e,t,i,s,c),i),e6(a,j5(e,t,i,s),s),a}const l6={armR:11,armL:10,foreR:12,foreL:11,head:14,browN:30},c6=new Set(["eyeN","browN","mouth"]),Kl=.007,f6=4,Nf=[.8,1.1];class Hc{constructor(e){Se(this,"root",new Oi);Se(this,"rig");Se(this,"ordered");Se(this,"nodes",new Map);Se(this,"solved",new Map);Se(this,"angles",{});Se(this,"offsets",{});Se(this,"facing",1);Se(this,"anim","idle");Se(this,"animT",0);Se(this,"params",{});Se(this,"squashX",1);Se(this,"squashY",1);Se(this,"extraRot",0);Se(this,"stiffness",1);Se(this,"orderFacing",0);this.rig=e,this.ordered=Y5(e)}static async create(e){const t=new Hc(e);return await t.build(),t.snap(),t}async build(){const e=new Map,t=async s=>{if(!z5(s))return null;const r=Fr(s);if(!r.body)return null;let a=e.get(s);return a||(a=Ur(await Uo(r,f6)),e.set(s,a)),a},i=new Oi;this.root.add(i);for(const s of this.ordered){const r=new Oi;r.name=s.id,(s.parent?this.nodes.get(s.parent).group:i).add(r);const o={joint:s,group:r,mesh:null,back:null,near:null,far:null,shapes:new Map,shape:""};if(this.nodes.set(s.id,o),!s.part)continue;const c=await t(s.part);if(!c)continue;o.shapes.set("",c);for(const h of["happy","sad","shut","smile","open","grin","grit","frown"]){const d=await t(`${s.part}.${h}`);d&&o.shapes.set(h,d)}const l=Fr(s.part),f=zc(l.w,l.h,l.px/l.w,l.py/l.h),u=c6.has(s.id);o.near=Nr(c,{unlit:u}),o.far=s.side?Nr(c,{color:13814994}):o.near,o.mesh=new fn(f,o.near),o.mesh.castShadow=!u,o.mesh.receiveShadow=!u,r.add(o.mesh),u||(o.back=new fn(f,Nr(c,{color:8812159})),o.back.receiveShadow=!0,r.add(o.back))}}snap(){const e=Yl(this.rig.id,this.anim,this.animT,this.params);this.angles={...e.angles},this.offsets={};for(const t of Object.keys(e.offsets))this.offsets[t]={...e.offsets[t]};this.layout(e)}snapTo(e,t={}){const i=Yl(this.rig.id,e,0,t);for(const s of this.ordered)this.angles[s.id]=i.angles[s.id]??0;for(const s of Object.keys(i.offsets))this.offsets[s]={...i.offsets[s]}}play(e,t){e!==this.anim&&(this.anim=e,this.animT=0),this.params=t}update(e){this.animT+=e;const t=Yl(this.rig.id,this.anim,this.animT,this.params);for(const i of this.ordered){const s=t.angles[i.id]??0,r=this.angles[i.id]??0,a=(l6[i.id]??16)*this.stiffness;this.angles[i.id]=r+(s-r)*(1-Math.exp(-a*e));const o=t.offsets[i.id],c=this.offsets[i.id];if(o||c){const l=c??{x:0,y:0},f=1-Math.exp(-18*this.stiffness*e);l.x+=((o?.x??0)-l.x)*f,l.y+=((o?.y??0)-l.y)*f,this.offsets[i.id]=l}}this.layout(t)}applyOrder(){if(this.orderFacing===this.facing)return;this.orderFacing=this.facing,Q5(this.ordered,this.facing).forEach((t,i)=>{const s=this.nodes.get(t.id);if(!s?.mesh)return;s.mesh.position.z=i*Kl,s.back&&(s.back.position.z=i*Kl-Kl*.5);const r=J5(t,this.facing);s.mesh.material=r?s.near:s.far})}layout(e){this.applyOrder(),K5(this.ordered,this.angles,this.offsets,this.solved);for(const i of this.ordered){const s=this.nodes.get(i.id),r=this.offsets[i.id];if(s.group.position.set((i.x+(r?.x??0))*Bn,-(i.y+(r?.y??0))*Bn,0),s.group.rotation.z=-(this.angles[i.id]??0),!s.mesh)continue;const a=e.frames?.[i.id]??"",o=s.shapes.has(a)?a:"";if(o!==s.shape){s.shape=o;const l=s.shapes.get(o);for(const f of[s.near,s.far])f&&"map"in f&&(f.map=l)}const c=e.scales?.[i.id];if(s.mesh.scale.set(c?.x??1,c?.y??1,1),s.back){const l=this.solved.get(i.id)?.rot??0,f=Nf[0]*this.facing,u=Nf[1],h=Math.cos(l),d=Math.sin(l);s.back.position.x=(f*h+u*d)*Bn,s.back.position.y=-(-f*d+u*h)*Bn,s.back.scale.copy(s.mesh.scale)}}this.root.children[0].position.set((e.x??0)*Bn,-(e.y??0)*Bn,0),this.root.scale.set(this.facing*(e.sx??1)*this.squashX,(e.sy??1)*this.squashY,1),this.root.rotation.z=-this.extraRot*this.facing}attach(e){const t=this.rig.attach[e],i=t?this.solved.get(t.joint):void 0;if(!t||!i)return{x:0,y:0};const s=Math.cos(i.rot),r=Math.sin(i.rot);return{x:(i.x+t.x*s-t.y*r)*this.facing,y:i.y+t.x*r+t.y*s}}get height(){const e=this.solved.get("head");return e?-e.y+60:130}}function h6(n,e,t){return n<e?Math.min(e,n+t):n>e?Math.max(e,n-t):n}const Ni=q_,qi=K_/2;class u6{constructor(e,t,i,s,r,a){Se(this,"rig");Se(this,"x");Se(this,"y");Se(this,"z",0);Se(this,"vx",0);Se(this,"vy",0);Se(this,"facing",1);Se(this,"onGround",!0);Se(this,"stillT",0);Se(this,"solids");Se(this,"platZ");Se(this,"width");Se(this,"standing",null);Se(this,"coyote",0);Se(this,"jumpBuffer",0);Se(this,"jumping",!1);Se(this,"groundLock",0);Se(this,"airTime",0);Se(this,"maxFallVy",0);Se(this,"landT",0);Se(this,"landDur",.2);Se(this,"landImpact",0);Se(this,"jumpT",-1);Se(this,"sq",1);Se(this,"sqV",0);Se(this,"walkPhase",0);Se(this,"stepN",0);Se(this,"lastVx",0);Se(this,"skidding",!1);Se(this,"visVx",0);Se(this,"accLean",0);Se(this,"idleT",0);Se(this,"blinkIn",1.5);Se(this,"blinkT",-1);Se(this,"blinkAgain",!1);Se(this,"emoteT",0);Se(this,"strideLen");Se(this,"seed",7);this.rig=e,this.solids=t,this.platZ=i,this.x=s,this.y=r,this.width=a;const o=l=>e.rig.joints.find(f=>f.id===l)?.y??0,c=o("shinR")+o("footR");this.strideLen=124*Math.max(.75,Math.min(1.4,c/46))}rand(){return this.seed=this.seed*16807%2147483647,this.seed/2147483647}place(e,t,i){this.x=e,this.y=t,this.vx=0,this.vy=0,this.facing=i,this.onGround=!0,this.jumpT=-1,this.landT=0,this.sq=1,this.sqV=0,this.standing=this.groundAt(e,t),this.z=this.zFor(this.standing),this.rig.facing=i,this.rig.snap()}fixed(e,t){this.groundLock>0&&(this.groundLock-=e),this.onGround||(this.airTime+=e,this.maxFallVy=Math.max(this.maxFallVy,this.vy)),this.coyote=this.onGround?Z_/1e3:this.coyote-e,this.landT>0&&(this.landT-=e),this.jumpT>=0&&(this.jumpT+=e);const i=t.axis;t.jumpPressed?this.jumpBuffer=Y_/1e3:this.jumpBuffer-=e;const s=i*Ni.speed;let r=this.onGround?i!==0?Ni.accel:Ni.decel:i!==0?Ni.airAccel:Ni.airDecel;i!==0&&Math.sign(this.vx)===-i&&(r=Math.max(r,Ni.decel)),this.vx=h6(this.vx,s,r*e),i!==0&&(this.facing=i>0?1:-1),this.jumpBuffer>0&&this.coyote>0&&(this.vy=-640,this.jumpBuffer=0,this.coyote=0,this.jumping=!0,this.groundLock=.06,this.onGround=!1,this.standing=null,this.airTime=0,this.maxFallVy=0,this.landT=0,this.jumpT=0,this.sq=.86,this.sqV=6,this.rig.snapTo("crouch")),this.jumping&&!t.jumpHeld&&this.vy<0&&(this.vy*=Ni.jumpCut,this.jumping=!1),this.vy>=0&&(this.jumping=!1);const a=Math.abs(this.vx);this.onGround&&i===0&&this.lastVx>Ni.speed*.6&&a<this.lastVx-1?this.skidding||(this.skidding=!0,this.sqV-=1.1):(a<5||i!==0)&&(this.skidding=!1),this.lastVx=a,this.vy=Math.min(X_,this.vy+W_*e),this.move(e);const o=this.onGround?this.standing:this.vy>-200?this.groundAt(this.x,this.y):null,c=this.onGround?this.zFor(this.standing):o?this.zFor(o):this.z;this.z+=(c-this.z)*(1-Math.exp(-(this.onGround?14:7)*e))}zFor(e){return e?this.platZ.get(e)??0:0}groundAt(e,t){let i=null;for(const s of this.solids)e+qi<=s.x||e-qi>=s.x+s.w||s.y<t-.5||(!i||s.y<i.y)&&(i=s);return i}overlaps(e,t,i){return t+qi>e.x&&t-qi<e.x+e.w&&i>e.y&&i-$l<e.y+e.h}move(e){this.x+=this.vx*e;for(const r of this.solids)r.oneWay||!this.overlaps(r,this.x,this.y)||(this.vx>0?this.x=r.x-qi:this.vx<0&&(this.x=r.x+r.w+qi),this.vx=0);this.x=Math.max(qi,Math.min(this.width-qi,this.x));const t=this.y;this.y+=this.vy*e;let i=null;for(const r of this.solids)this.x+qi<=r.x||this.x-qi>=r.x+r.w||(this.vy>=0&&t<=r.y+.5&&this.y>=r.y?(!i||r.y<i.y)&&(i=r):!r.oneWay&&this.vy<0&&this.overlaps(r,this.x,this.y)&&t-$l>=r.y+r.h-.5&&(this.y=r.y+r.h+$l,this.vy=0));const s=this.onGround;i&&this.groundLock<=0?(this.y=i.y,this.vy=0,this.onGround=!0,this.standing=i,s||this.landed()):(this.onGround=!1,this.standing=null)}landed(){if(this.airTime>.12&&this.maxFallVy>180){const e=Math.min(1,(this.maxFallVy-180)/720);this.landImpact=e,this.landDur=.14+.2*e,this.landT=this.landDur,this.sq=1-(.06+.14*e),this.sqV=-1.2*e,e>.55&&(this.emoteT=.38)}this.jumpT=-1,this.airTime=0,this.maxFallVy=0}visual(e){const t=!this.onGround,i=t?1+Math.min(.06,Math.abs(this.vy)/1e4):1;this.sqV+=((i-this.sq)*320-this.sqV*15)*e,this.sq+=this.sqV*e;const s=this.rig;s.squashY=this.sq,s.squashX=1+(1-this.sq)*.85;const r=Math.abs(this.vx)/Ni.speed;let a="idle";const o={};if(this.emoteT>0&&(this.emoteT-=e,o.emote="effort",o.emoteK=Math.min(1,this.emoteT/.25)),this.blinkT>=0?(this.blinkT+=e,this.blinkT>.15&&(this.blinkT=-1,this.blinkIn=this.blinkAgain?.09:2.2+this.rand()*3.6,this.blinkAgain=!this.blinkAgain&&this.rand()<.22)):(this.blinkIn-=e)<=0&&(this.blinkT=0),this.blinkT>=0&&(o.blink=1-Math.abs(this.blinkT/.075-1)),t)o.vy=this.vy,o.jv=Ni.jumpVel,this.jumpT<0?a="fall":this.jumpT<.13?a="takeoff":this.vy<-140?a="rise":this.vy<150?a="apex":a="fall";else if(this.landT>0&&!(Math.abs(this.vx)>60&&this.landDur-this.landT>.08))a="land",o.k=1-this.landT/this.landDur,o.impact=this.landImpact;else if(Math.abs(this.vx)>12){a="walk",this.walkPhase+=Math.abs(this.vx)*e/this.strideLen*Math.PI*2,o.phase=this.walkPhase,o.speed=r;const f=Math.floor((this.walkPhase-Math.PI/2)/Math.PI);f!==this.stepN&&(this.stepN=f,this.sqV-=.55)}this.idleT=a==="idle"?this.idleT+e:0,this.stillT=a==="idle"||a==="land"?this.stillT+e:0,o.idleT=this.idleT,s.facing=this.facing,s.play(a,o),s.stiffness=a==="takeoff"?2.6:a==="land"?2:a==="apex"?.85:1;const c=Math.min(1,Math.abs(this.vx)/Ni.speed);let l=t?(this.vy<-140?-.05:this.vy>150?.08:.02)*c:0;if(!t){const f=(Math.abs(this.vx)-this.visVx)/Math.max(.001,e);this.accLean+=(Math.max(-.1,Math.min(.1,f/5200))-this.accLean)*(1-Math.exp(-12*e)),l+=this.skidding?-.07:this.accLean}this.visVx=Math.abs(this.vx),s.extraRot+=(l-s.extraRot)*(1-Math.exp(-10*e)),s.update(e),s.root.position.set(vt(this.x),un(this.y),this.z)}heightAboveGround(){const e=this.groundAt(this.x,this.y),t=e?e.y:660;return{ground:t,h:Math.max(0,t-this.y)}}groundZ(){return this.zFor(this.groundAt(this.x,this.y))}}const d6={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class sa{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const p6=new Oo(-1,1,1,-1,0,1);class m6 extends Di{constructor(){super(),this.setAttribute("position",new gi([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new gi([0,2,0,0,2,0],2))}}const g6=new m6;class Vc{constructor(e){this._mesh=new fn(g6,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,p6)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Kh extends sa{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof _i?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ec.clone(e.uniforms),this.material=new _i({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Vc(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class $f extends sa{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class _6 extends sa{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class M6{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new ht);this._width=i.width,this._height=i.height,t=new mi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:1016}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Kh(d6),this.copyPass.material.blending=0,this.timer=new ad}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}$f!==void 0&&(a instanceof $f?i=!0:a instanceof _6&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new ht);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const vo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class v6 extends sa{constructor(){super(),this.isOutputPass=!0,this.uniforms=Ec.clone(vo.uniforms),this.material=new jf({name:vo.name,uniforms:this.uniforms,vertexShader:vo.vertexShader,fragmentShader:vo.fragmentShader}),this._fsQuad=new Vc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ft.getTransfer(this._outputColorSpace)===qt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class x6 extends sa{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Lt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const y6=`
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
`,Qh=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;class S6 extends sa{constructor(t,i,s){super();Se(this,"target");Se(this,"uniforms");Se(this,"enabledDof",!0);Se(this,"scenePass");Se(this,"quad");Se(this,"camera");this.camera=i,this.scenePass=new x6(t,i),this.target=new mi(1,1,{type:1016,samples:s}),this.target.depthTexture=new Br(1,1),this.uniforms={tColor:{value:this.target.texture},tDepth:{value:this.target.depthTexture},uTexel:{value:new ht},uNear:{value:i.near},uFar:{value:i.far},uFocus:{value:8},uScale:{value:22},uMaxBlur:{value:11}},this.quad=new Vc(new _i({uniforms:this.uniforms,vertexShader:Qh,fragmentShader:y6,defines:{SAMPLES:48},depthTest:!1,depthWrite:!1})),this.needsSwap=!0}setSize(t,i){this.target.setSize(t,i),this.uniforms.uTexel.value.set(1/t,1/i),this.uniforms.uMaxBlur.value=11*(i/720)}render(t,i){this.scenePass.render(t,i,this.target,0,!1),this.uniforms.uNear.value=this.camera.near,this.uniforms.uFar.value=this.camera.far;const s=this.quad.material,r=this.enabledDof?48:0;s.defines.SAMPLES!==r&&(s.defines.SAMPLES=r,s.needsUpdate=!0),t.setRenderTarget(this.renderToScreen?null:i),this.quad.render(t)}dispose(){this.target.dispose(),this.quad.dispose()}}const b6=`
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
`;class T6{constructor(e,t,i,s=4){Se(this,"composer");Se(this,"scene");Se(this,"comic");Se(this,"output");this.composer=new M6(e,new mi(1,1,{type:1016})),this.scene=new S6(t,i,s),this.output=new v6,this.comic=new Kh(new _i({uniforms:{tDiffuse:{value:null},uResolution:{value:new ht(1280,720)},uStrength:{value:1},uVignette:{value:.22}},vertexShader:Qh,fragmentShader:b6})),this.composer.addPass(this.scene),this.composer.addPass(this.output),this.composer.addPass(this.comic)}setSize(e,t,i){this.composer.setPixelRatio(i),this.composer.setSize(e,t),this.comic.uniforms.uResolution.value.set(Math.round(e*i),Math.round(t*i))}set focus(e){this.scene.uniforms.uFocus.value=e}set dof(e){this.scene.enabledDof=e}get dof(){return this.scene.enabledDof}set print(e){this.comic.uniforms.uStrength.value=e?1:0,this.comic.uniforms.uVignette.value=e?.22:0}get print(){return this.comic.uniforms.uStrength.value>0}render(){this.composer.render()}}const ii={a:.42,w:1.5},Cn={a:.7,w:1.7},tr={a:.9,w:1.9};function Si(n,e,t=e.w){n.globalAlpha=e.a,n.strokeStyle=dt,n.lineWidth=t,n.lineJoin="round",n.lineCap="round",n.stroke(),n.globalAlpha=1}function $n(n,e,t){n.fillStyle=e,n.fill(),t&&Si(n,t)}function qr(n,e,t=!0){const i=e.length;if(n.beginPath(),i<3){n.moveTo(e[0][0],e[0][1]);for(const r of e.slice(1))n.lineTo(r[0],r[1]);t&&n.closePath();return}const s=(r,a)=>[(r[0]+a[0])/2,(r[1]+a[1])/2];if(t){const r=s(e[i-1],e[0]);n.moveTo(r[0],r[1]);for(let a=0;a<i;a++){const o=s(e[a],e[(a+1)%i]);n.quadraticCurveTo(e[a][0],e[a][1],o[0],o[1])}n.closePath()}else{n.moveTo(e[0][0],e[0][1]);for(let r=1;r<i-1;r++){const a=s(e[r],e[r+1]);n.quadraticCurveTo(e[r][0],e[r][1],a[0],a[1])}n.lineTo(e[i-1][0],e[i-1][1])}}function $r(n,e,t,i){n.fillStyle=i,n.fillRect(-2,-2,e+4,t+4)}function $i(n,e,t,i,s,r,a,o,c=1){const l=a.range(0,6),f=a.range(0,6),u=[];for(let h=-40;h<=e+40;h+=30){const d=i-s*(.55+.45*Math.sin(h/520*c+l))-s*.35*Math.sin(h/190*c+f)*Math.sin(h/900+l);u.push([h,d])}qr(n,u,!1),n.lineTo(e+40,t+10),n.lineTo(-40,t+10),n.closePath(),n.fillStyle=r,n.fill(),o&&(qr(n,u,!1),Si(n,o))}function E6(n,e,t,i,s,r,a=0){n.beginPath();for(let o=0;o<10;o++){const c=a-Math.PI/2+o*Math.PI/5,l=o%2?i*.46:i,f=e+Math.cos(c)*l,u=t+Math.sin(c)*l;o===0?n.moveTo(f,u):n.lineTo(f,u)}n.closePath(),$n(n,s,{a:r.a,w:Math.min(r.w,i*.22)})}const Bf=[ye.mint,ye.butter,ye.pink,ye.lilac,ye.aqua,ye.cream];function Jh(n,e,t,i,s,r,a=1){const o=Math.floor(e*t/s);for(let c=0;c<o;c++){const l=i.range(0,e),f=i.range(0,t);i.chance(.3)?(n.beginPath(),n.arc(l,f,i.range(1.2,2.2),0,Math.PI*2),n.fillStyle=i.pick(Bf),n.globalAlpha=.8,n.fill(),n.globalAlpha=1):E6(n,l,f,i.range(5,10)*a,i.pick(Bf),r,i.range(-.4,.4))}}function jh(n,e,t,i,s,r,a,o){const c=Math.max(3,Math.round(i/46)),l=i*.3,f=[];for(let d=0;d<=c;d++){const p=d/c;f.push([e+p*i,t+l*.5-(d===0||d===c?0:l*s.range(.45,.8))])}n.beginPath(),n.moveTo(f[0][0],f[0][1]);for(let d=1;d<f.length;d++){const p=f[d-1],_=f[d],m=(_[0]-p[0])*.62;n.bezierCurveTo(p[0],p[1]-m*1.1,_[0],_[1]-m*1.1,_[0],_[1])}n.bezierCurveTo(e+i+l*.4,t+l*.9,e+i*.6,t+l*1.1,e+i*.5,t+l*.95),n.bezierCurveTo(e+i*.3,t+l*1.15,e-l*.4,t+l*.95,e,t+l*.5),n.closePath(),$n(n,r,o),n.beginPath();const u=Math.round(i/38);for(let d=0;d<u;d++){const p=e+s.range(.12,.85)*i,_=t+s.range(0,.55)*l,m=s.range(5,8);n.moveTo(p,_+m*.4),n.quadraticCurveTo(p+m*.5,_-m*.4,p+m,_+m*.1),n.quadraticCurveTo(p+m*1.5,_-m*.4,p+m*2,_+m*.4)}if(Si(n,{a:o.a*.85,w:o.w*.8}),!a)return;const h=Math.round(i/22);for(let d=0;d<h;d++){const p=e+(d+.5)/h*i+s.range(-5,5),_=t+l*1.15+s.range(0,14),m=s.range(14,24);n.beginPath(),n.moveTo(p,_);for(let g=1;g<=4;g++)n.quadraticCurveTo(p+(g%2?3.5:-3.5),_+m*(g-.5)/4,p,_+m*g/4);n.globalAlpha=o.a,n.strokeStyle=dt,n.lineWidth=4.2,n.stroke(),n.globalAlpha=1,n.strokeStyle=a,n.lineWidth=2.4,n.stroke()}}function w6(n,e,t,i,s,r,a){const o=Math.cos(s),c=Math.sin(s),l=(E,v)=>[e+E*o-v*c,t+E*c+v*o],f=i*.36,u=l(0,0),h=l(i,0),d=l(i*.35,-f),p=l(i*.8,-f*.7),_=l(i*.35,f),m=l(i*.8,f*.7);n.beginPath(),n.moveTo(u[0],u[1]),n.bezierCurveTo(d[0],d[1],p[0],p[1],h[0],h[1]),n.bezierCurveTo(m[0],m[1],_[0],_[1],u[0],u[1]),n.closePath(),$n(n,r,a),n.beginPath();const g=l(i*.1,0),b=l(i*.85,0);n.moveTo(g[0],g[1]),n.lineTo(b[0],b[1]);for(const E of[.35,.55,.72]){const v=l(i*E,0),S=l(i*(E+.12),-f*.45),T=l(i*(E+.12),f*.45);n.moveTo(v[0],v[1]),n.lineTo(S[0],S[1]),n.moveTo(v[0],v[1]),n.lineTo(T[0],T[1])}Si(n,{a:a.a*.8,w:a.w*.7})}function Ao(n,e,t,i,s,r,a,o){const c=i*.055,l=t-i*.62;n.beginPath(),n.moveTo(e-c*1.6,t+4),n.quadraticCurveTo(e-c*.8,t-i*.1,e-c*.7,t-i*.3),n.lineTo(e-c*.55,l),n.lineTo(e+c*.55,l),n.lineTo(e+c*.7,t-i*.3),n.quadraticCurveTo(e+c*.8,t-i*.1,e+c*1.6,t+4),n.closePath(),$n(n,s,o);const f=e+a.range(-.04,.04)*i,u=t-i*.74,h=i*a.range(.24,.3),d=i*a.range(.2,.25),p=11,_=[];for(let m=0;m<p;m++){const g=m/p*Math.PI*2,b=m%2?.86:1.06+a.range(-.04,.06);_.push([f+Math.cos(g)*h*b,u+Math.sin(g)*d*b])}qr(n,_),$n(n,r,o),n.beginPath();for(let m=0;m<5;m++){const g=f+a.range(-.6,.6)*h,b=u+a.range(-.5,.5)*d,E=h*a.range(.16,.26);n.moveTo(g-E,b+E*.35),n.quadraticCurveTo(g,b-E*.3,g+E,b+E*.35)}Si(n,{a:o.a*.7,w:o.w*.75})}function vc(n,e,t,i,s,r){n.beginPath();const a=3;n.moveTo(e,t-i);for(let o=1;o<=a;o++){const c=o/a;n.lineTo(e+i*.24*c,t-i+i*.86*c),o<a&&n.lineTo(e+i*.09*c,t-i+i*.86*c)}n.lineTo(e+i*.04,t-i*.14),n.lineTo(e+i*.04,t+4),n.lineTo(e-i*.04,t+4),n.lineTo(e-i*.04,t-i*.14);for(let o=a;o>=1;o--){const c=o/a;o<a&&n.lineTo(e-i*.09*c,t-i+i*.86*c),n.lineTo(e-i*.24*c,t-i+i*.86*c)}n.closePath(),$n(n,s,r)}function eu(n,e,t,i,s,r,a=1){const o=78*a;let c=-i.range(10,40);for(;c<t+10;){const l=o*i.range(.75,1.2);let f=-i.range(0,60);for(;f<e+10;){const u=o*i.range(1.1,2.1),h=3.2*a,d=()=>i.range(-5,5)*a,p=[[f+h,c+h+d()*.5],[f+u*.5+d(),c+h+d()*.6],[f+u-h,c+h+d()*.5],[f+u-h+d()*.6,c+l*.5],[f+u-h,c+l-h+d()*.5],[f+u*.5+d(),c+l-h+d()*.6],[f+h,c+l-h+d()*.5],[f+h+d()*.6,c+l*.5]];qr(n,p),$n(n,i.pick(s),r),f+=u}c+=l}}function xc(n,e,t,i,s,r,a,o,c){const l=Math.max(1,Math.floor(e/a));for(let f=0;f<l;f++){let u=i.range(0,e),h=-20;const d=i.range(o[0],o[1])*t,p=i.range(c[0],c[1]),_=6,m=[[u,h]];for(let E=1;E<=_;E++)u+=i.range(-26,26),h+=d/_,m.push([u,h]);const g=[],b=[];m.forEach((E,v)=>{const S=m[Math.max(0,v-1)],T=m[Math.min(_,v+1)],P=Math.hypot(T[0]-S[0],T[1]-S[1])||1,x=-(T[1]-S[1])/P,A=(T[0]-S[0])/P,I=p*(1-v/_*.9)/2;g.push([E[0]+x*I,E[1]+A*I]),b.push([E[0]-x*I,E[1]-A*I])}),qr(n,[...g,m[_],...b.reverse()]),$n(n,s,r),n.beginPath();for(let E=1;E<_-1;E++){if(!i.chance(.55))continue;const v=m[E],S=i.chance(.5)?1:-1;n.moveTo(v[0]+S*p*.3,v[1]),n.quadraticCurveTo(v[0]+S*p*.9,v[1]+10,v[0]+S*p*1.1,v[1]+i.range(20,34))}for(let E=1;E<_;E+=2){const v=m[E];n.moveTo(v[0]-p*.12,v[1]-6),n.lineTo(v[0]+p*.1,v[1]+4)}Si(n,{a:r.a*.8,w:r.w*.8})}}const A6=[L.crystalTeal,L.crystalBlue,L.crystalOrange,ye.pink,ye.lilac];function R6(n,e,t,i,s,r,a=20){for(let o=0;o<i;o++){const c=s.range(0,e),l=s.range(a,t),f=s.pick(A6),u=s.int(1,3);for(let h=0;h<u;h++){const d=s.range(14,38)*(h===0?1:.7),p=c+(h-(u-1)/2)*d*.4,_=s.range(-.35,.35),m=d*.17;n.beginPath(),n.moveTo(p-m,l),n.lineTo(p-m+_*d*.7,l-d*.72),n.lineTo(p+_*d,l-d),n.lineTo(p+m+_*d*.7,l-d*.72),n.lineTo(p+m,l),n.closePath(),$n(n,f,r),n.beginPath(),n.moveTo(p+_*d,l-d),n.lineTo(p+m*.15,l),Si(n,{a:r.a*.7,w:r.w*.7})}}}function L6(n,e,t,i,s,r){n.beginPath(),n.ellipse(e+150*i,t+6*i,200*i,52*i,-.04,0,Math.PI*2),$n(n,r,{a:s.a*.6,w:s.w}),n.beginPath(),n.moveTo(e,t),n.quadraticCurveTo(e+160*i,t-50*i,e+340*i,t);for(let a=1;a<12;a++){const o=a/12,c=e+340*i*o,l=t-Math.sin(o*Math.PI)*26*i;n.moveTo(c,l),n.quadraticCurveTo(c+10*i,l+20*i,c-4*i,l+38*i*Math.sin(o*Math.PI+.3))}n.moveTo(e-64*i,t+4*i),n.ellipse(e-30*i,t+4*i,34*i,16*i,-.1,Math.PI,Math.PI*3),Si(n,s)}function C6(n,e,t,i,s,r,a,o){n.beginPath(),n.ellipse(e,t,16*i,6*i,0,0,Math.PI*2),$n(n,a,r);const c=s.int(2,3);for(let l=0;l<c;l++)w6(n,e+(l-(c-1)/2)*7*i,t-2*i,s.range(20,30)*i,-Math.PI/2+(l-(c-1)/2)*.55+s.range(-.1,.1),o,r)}function On(n,e,t,i=1){Ba(n,-2,-2,e+4,t+4,{strength:i})}const Of=(n,e,t,i)=>[{scroll:.15,res:.5,draw:(s,{w:r,h:a},o)=>{$r(s,r,a,n),eu(s,r,a,o,e,ii,1.4),L6(s,r*o.range(.2,.6),a*o.range(.3,.6),.9,ii,i),On(s,r,a)}},{scroll:.4,res:.5,draw:(s,{w:r,h:a},o)=>{xc(s,r,a,o,Ut(t,n,.35),Cn,150,[.25,.6],[16,34]),R6(s,r,a,Math.floor(r/110),o,Cn,a*.25),On(s,r,a)}},{scroll:.7,res:1,draw:(s,{w:r,h:a},o)=>{xc(s,r,a*.7,o,t,tr,420,[.4,.8],[22,40]),On(s,r,a)}}],Ql=(n,e,t,i)=>[{scroll:.05,res:.5,draw:(s,{w:r,h:a,horizon:o},c)=>{$r(s,r,a,ye.night),Jh(s,r,o-60,c,26e3,ii),$i(s,r,a,o+40,120,n,c,ii,.6),On(s,r,a,.35)}},{scroll:.3,res:.5,draw:(s,{w:r,h:a,horizon:o},c)=>{for(let l=c.range(0,80);l<r;l+=c.range(70,160))vc(s,l,o+124+c.range(-16,16),c.range(70,130),Ut(e,i,.3),Cn);$i(s,r,a,o+110,70,e,c,Cn,1.2),On(s,r,a,.7)}},{scroll:.6,res:1,draw:(s,{w:r,h:a,horizon:o},c)=>{for(let l=c.range(0,200);l<r;l+=c.range(240,420))Ao(s,l,o+300,c.range(260,400),t,i,c,tr);$i(s,r,a,o+318,34,Ut(e,i,.45),c,tr,2),On(s,r,a)}}];function Jl(n,e,t,i,s,r,a,o){$r(n,e,t,r),a.forEach((l,f)=>{const u=i-40-(a.length-f)*34,h=[];for(let d=-40;d<=e+40;d+=60)h.push([d,u+Math.sin(d/170+f*2)*8]);qr(n,h,!1),n.lineTo(e+40,t+10),n.lineTo(-40,t+10),n.closePath(),n.fillStyle=l,n.fill()});const c=Math.max(1,Math.round(e/1e3*o));for(let l=0;l<c;l++){const f=s.range(150,260);jh(n,s.range(-40,e),s.range(i*.08,i*.42),f,s,"#c3d0d6",s.chance(.6)?"#d9829c":null,ii)}}const P6={nursery:{sky:[w.stone,w.stone],layers:A5(),terrain:{paper:{base:w.wall,top:w.paperFloor,detail:He(w.wall),accent:w.lid},soil:{base:"#d8c3a6",top:"#e8d8bd",detail:"#9c8670",accent:L.crystalTeal},stone:{base:"#c9c7c4",top:"#dedcd9",detail:"#8f8b8b"}},ambient:"dust",horizon:.6},roots:{sky:["#c3bec6","#bdb8c1"],layers:Of("#bdb8c1",["#c6c1c9","#bfbac3","#cbc7ce","#b8b3bd"],"#b39aa8","#d9d2dc"),terrain:{},ambient:"dust",horizon:.6},chamber:{sky:["#b7ccc6","#afc5bf"],layers:Of("#afc5bf",["#b9cdc8","#b2c8c2","#bfd2cc","#a9c0ba"],"#a996a8","#d5e3df"),terrain:{soil:{base:"#c7bfd0",top:"#dcd5e4",detail:"#8e84a0",accent:L.crystalTeal}},ambient:"sparkle",horizon:.6},surface:{sky:[ye.night,ye.night],layers:Ql("#4c6356","#5f7868","#a88f9c","#9fb89a"),terrain:{moss:{base:"#cdb89a",top:"#a9cf8f",detail:"#8d7a62"}},ambient:"wind",horizon:.55},hill:{sky:[ye.night,ye.night],layers:Ql("#4e6559","#627b6c","#b095a3","#a3bb9d"),terrain:{moss:{base:"#d0bb9c",top:"#b0d392",detail:"#8f7c64"}},ambient:"wind",horizon:.5},forest:{sky:[ye.night,ye.night],layers:Ql("#4a6254","#5b7465","#a58c99","#94b391"),terrain:{moss:{base:"#c9b597",top:"#9fcb8f",detail:"#8a775f"}},ambient:"petals",horizon:.5},ride:{sky:[ye.periwinkle,"#f1c9b0"],layers:[{scroll:.03,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{Jl(n,e,t,i,s,ye.periwinkle,["#c9b8e0","#f0c6cf","#f6d3b2"],2.2),$i(n,e,t,i+30,140,"#b7a6cf",s,ii,.5),On(n,e,t)}},{scroll:.12,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{for(let r=s.range(0,80);r<e;r+=s.range(80,170))vc(n,r,i+122+s.range(-12,12),s.range(60,110),"#98b596",Cn);$i(n,e,t,i+110,80,"#a9c4a0",s,Cn,1),On(n,e,t)}},{scroll:.35,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{for(let r=s.range(0,200);r<e;r+=s.range(260,460))Ao(n,r,i+260,s.range(220,320),"#b39aa8","#b6d09a",s,tr);$i(n,e,t,i+270,30,ye.sand,s,tr,2),On(n,e,t)}}],terrain:{moss:{base:ye.sand,top:"#b8d696",detail:"#94806a"}},ambient:"petals",horizon:.5},sun:{sky:[ye.periwinkle,ye.periwinkle],layers:[{scroll:.1,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{Jl(n,e,t,i,s,ye.periwinkle,[],2.6),$i(n,e,t,i+170,60,ye.sandLight,s,ii,.7),On(n,e,t)}},{scroll:.35,res:.5,draw:(n,{w:e,h:t},i)=>{const s=t*.84;for(let r=-60;r<e+60;r+=i.range(90,150)){const a=Math.abs(r-e/2)/(e/2),o=90+260*Math.pow(a,1.6)+i.range(-20,20);Ao(n,r,s+20,o,"#b39aa8",i.pick(["#b8d39a","#a8c9a0","#c3dc8c"]),i,Cn)}$i(n,e,t,s+10,22,ye.sand,i,Cn,2);for(let r=i.range(40,140);r<e;r+=i.range(160,300))C6(n,r,s+34+i.range(0,20),1,i,Cn,"#a5876c","#b6d6a0");On(n,e,t)}}],terrain:{moss:{base:ye.sand,top:"#bfd99b",detail:"#94806a"}},ambient:"embers",horizon:.45},clearing:{sky:["#a9c9d6","#a9c9d6"],layers:[{scroll:.06,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{Jl(n,e,t,i,s,"#a9c9d6",["#c8dcd6"],1.6),$i(n,e,t,i+60,100,"#b3c7b6",s,ii,.6),On(n,e,t)}},{scroll:.25,res:.5,draw:(n,{w:e,h:t,horizon:i},s)=>{$i(n,e,t,i+150,40,"#a7c09f",s,Cn,1),n.beginPath(),n.rect(-10,i+150,e+20,60),$n(n,ye.aqua,Cn),n.beginPath();for(let r=s.range(0,40);r<e;r+=s.range(40,90)){const a=i+162+s.range(0,36);n.moveTo(r,a),n.quadraticCurveTo(r+6,a-5,r+12,a),n.quadraticCurveTo(r+18,a+5,r+24,a)}Si(n,{a:Cn.a*.7,w:1.4});for(let r=s.range(0,80);r<e;r+=s.range(70,150))vc(n,r,i+152,s.range(60,110),"#8fb193",Cn);On(n,e,t)}},{scroll:.55,res:1,draw:(n,{w:e,h:t,horizon:i},s)=>{for(let r=s.range(0,200);r<e;r+=s.range(240,420))Ao(n,r,i+330,s.range(280,400),"#b39aa8","#a9c99a",s,tr);$i(n,e,t,i+330,30,"#bcd3a8",s,tr,2),On(n,e,t)}}],terrain:{moss:{base:"#d3c3a4",top:"#afd29a",detail:"#8f7e66"}},ambient:"dust",horizon:.45},dorm:{sky:["#efe3e6","#ecdfe2"],layers:[{scroll:.2,res:.5,draw:(n,{w:e,h:t},i)=>{$r(n,e,t,"#ecdfe2"),n.beginPath(),n.rect(-10,t*.78,e+20,t*.3),$n(n,ye.blush,ii);for(let s=i.range(60,200);s<e;s+=i.range(280,400))n.beginPath(),n.moveTo(s,t*.74),n.lineTo(s,t*.3),n.arc(s+55,t*.3,55,Math.PI,0),n.lineTo(s+110,t*.74),n.closePath(),$n(n,ye.periwinkleDeep,ii),n.save(),n.clip(),Jh(n,e,t,new Vt(Math.floor(s)),9e3,ii,.8),n.restore(),n.beginPath(),n.moveTo(s+55,t*.3-55),n.lineTo(s+55,t*.74),n.moveTo(s,t*.5),n.lineTo(s+110,t*.5),Si(n,{a:ii.a,w:3});On(n,e,t)}},{scroll:.45,res:.5,draw:(n,{w:e,h:t},i)=>{for(let s=i.range(100,300);s<e;s+=i.range(320,540)){const r=i.range(t*.12,t*.45),a=i.range(26,56);n.beginPath(),n.moveTo(s,-10),n.lineTo(s,r-a),Si(n,Cn),n.beginPath(),n.arc(s,r,a,0,Math.PI*2),$n(n,ye.cream,Cn),n.beginPath();for(let o=0;o<12;o++){const c=o/12*Math.PI*2;n.moveTo(s+Math.cos(c)*a*.78,r+Math.sin(c)*a*.78),n.lineTo(s+Math.cos(c)*a*.9,r+Math.sin(c)*a*.9)}n.moveTo(s,r),n.lineTo(s,r-a*.66),n.moveTo(s,r),n.lineTo(s+a*.45,r+a*.2),Si(n,Cn)}On(n,e,t)}}],terrain:{floor:{base:"#dcb99a",top:"#ead3bc",detail:"#9e7f66",accent:L.ivory}},ambient:"drips",horizon:.6},mech:{sky:["#bdbcc4","#b8b7bf"],layers:[{scroll:.2,res:.5,draw:(n,{w:e,h:t},i)=>{$r(n,e,t,"#b8b7bf"),eu(n,e,t,i,["#bebdc5","#b5b4bc","#c4c3ca"],ii,1.6);for(let s=0;s<e/220;s++){const r=i.range(0,e),a=i.range(0,t),o=i.range(30,90);n.beginPath();const c=10;for(let l=0;l<c*2;l++){const f=l/(c*2)*Math.PI*2,u=l%2?o:o*1.18;n.lineTo(r+Math.cos(f)*u,a+Math.sin(f)*u)}n.closePath(),$n(n,i.pick([ye.lavender,ye.stone,ye.aqua]),ii),n.beginPath(),n.arc(r,a,o*.35,0,Math.PI*2),$n(n,"#b8b7bf",ii)}On(n,e,t)}},{scroll:.5,res:.5,draw:(n,{w:e,h:t},i)=>{xc(n,e,t,i,"#a3abb8",Cn,260,[.3,.6],[14,26]),On(n,e,t)}}],terrain:{metal:{base:"#aeb5c1",top:"#c8cdd6",detail:"#7f8897",accent:ye.butter}},ambient:"dust",horizon:.6},office:{sky:["#e9e2c9","#e5ddc3"],layers:[{scroll:.85,res:1,draw:(n,{w:e,h:t},i)=>{$r(n,e,t,"#e5ddc3");for(let s=0;s<e;s+=240)n.beginPath(),n.rect(s+8,t*.18,224,t*.6),$n(n,"#ede6cf",ii);n.beginPath(),n.rect(-10,t*.8,e+20,16),$n(n,"#b9c9c3",Cn);for(let s=i.range(200,500);s<e;s+=i.range(700,900))n.beginPath(),n.rect(s,t*.25,150,200),$n(n,ye.aqua,Cn),jh(n,s+18,t*.25+26,70,i,"#e8eef0",null,Cn),n.beginPath(),n.moveTo(s+75,t*.25),n.lineTo(s+75,t*.25+200),n.moveTo(s,t*.25+100),n.lineTo(s+150,t*.25+100),Si(n,Cn,2.4);On(n,e,t)}}],terrain:{},ambient:"dust",horizon:.6}};function D6(n,e,t,i,s){{w5(n,e,t,s);return}}function k6(n){return P6[n]}function Ai(n,e,t,i,s){return{base:n,shade:n,light:s??Ut(n,"#ffffff",.32),top:e,topShade:e,detail:t,accent:i}}const I6={soil:Ai("#cdb9a0","#e2d3bb","#98836d",L.crystalTeal),root:Ai(L.bark,L.barkLight,L.barkDark,L.violet),crystal:Ai(L.crystalTeal,L.crystalTealLight,"#5f9d90","#ffffff"),wood:Ai("#d9b48f","#e8cdb0","#a07e62",L.crystalOrange),stone:Ai("#c6c3c7","#dcdadd","#8e8a90",L.crystalBlue),moss:Ai(ye.sand,"#a9cf8f","#8d7a62",L.crystalBlue),floor:Ai("#dcb99a","#ead3bc","#9e7f66",L.ivory),metal:Ai("#aeb5c1","#c8cdd6","#7f8897",ye.butter),bed:Ai("#dcb99a","#ead3bc","#9e7f66",L.ivory),office:Ai("#cfc9b4","#e2ddca","#9d977f","#e9e2c9"),paper:Ai("#f6e2f4","#f5eedf","#c9a9c4","#f5caf3"),none:Ai("#000000","#000000","#000000","#000000","#000000")};function F6(n,e){const t=e?.[n]??{},i={...I6[n],...t};return t.base&&!t.light&&(i.light=Ut(t.base,"#ffffff",.32)),i}const xo=26;function U6(n,e,t,i){const s=[],r=i?18:26,a=Math.min(i?e*.45:12,n/3,e/2),o=Math.max(2,Math.round((n-2*a)/r));s.push([0,a]),s.push([a*.3,a*.3]);for(let l=0;l<=o;l++){const f=a+(n-2*a)*l/o;s.push([f,t.range(-1.6,1.2)])}s.push([n-a*.3,a*.3]);const c=Math.max(1,Math.round((e-2*a)/r));for(let l=0;l<=c;l++){const f=a+(e-2*a)*l/c;s.push([n+(i?0:t.range(-4,3)),f])}s.push([n-a*.3,e-a*.3]);for(let l=o;l>=0;l--){const f=a+(n-2*a)*l/o;s.push([f,e+(i?t.range(-1,2):t.range(-3,5))])}s.push([a*.3,e-a*.3]);for(let l=c;l>=0;l--){const f=a+(e-2*a)*l/c;s.push([i?0:t.range(-3,4),f])}return s}function jl(n,e,t=0,i=0){const s=e.length;n.beginPath();const r=(o,c)=>[(o[0]+c[0])/2,(o[1]+c[1])/2],a=r(e[s-1],e[0]);n.moveTo(a[0]+t,a[1]+i);for(let o=0;o<s;o++){const c=e[o],l=r(c,e[(o+1)%s]);n.quadraticCurveTo(c[0]+t,c[1]+i,l[0]+t,l[1]+i)}n.closePath()}function Cr(n,e,t,i,s,r=0){n.beginPath(),n.ellipse(e,t,i,s,r,0,Math.PI*2)}function Sn(n,e,t=1,i=dt){n.strokeStyle=i,n.lineWidth=e,n.globalAlpha=t,n.stroke(),n.globalAlpha=1}function N6(n,e,t,i,s){n.beginPath(),s?(n.ellipse(e,t,i*.5,i*.24,-.3,0,Math.PI*2),n.moveTo(e-i*.45,t+i*.12),n.lineTo(e-i*.8,t-i*.05),n.lineTo(e-i*.72,t+i*.35),n.closePath()):(n.moveTo(e-i*.6,t),n.quadraticCurveTo(e-i*.3,t-i*.5,e,t),n.quadraticCurveTo(e+i*.3,t-i*.5,e+i*.6,t)),Sn(n,1.1,.75)}function tu(n,e,t,i,s,r,a,o){const c=i*.34,l=e+s*i,f=t-i,u=()=>{n.beginPath(),n.moveTo(e-c/2,t),n.lineTo(e-c/2+s*i*.7,t-i*.72),n.lineTo(l,f),n.lineTo(e+c/2+s*i*.7,t-i*.72),n.lineTo(e+c/2,t),n.closePath()};u(),n.fillStyle=r.fill,n.fill(),a&&N6(n,e+s*i*.4,t-i*.42,c*.9,o.chance(.5)),n.beginPath(),n.moveTo(l,f),n.lineTo(e+s*i*.15+c*.08,t),Sn(n,C*.8,.8),u(),n.lineJoin="round",Sn(n,C+.3)}const ks={blue:{fill:L.crystalBlue,shade:L.crystalBlueDark,light:L.crystalBlueLight},teal:{fill:L.crystalTeal,shade:L.crystalTealDark,light:L.crystalTealLight},orange:{fill:L.crystalOrange,shade:L.crystalOrangeDark,light:L.crystalOrangeLight},pink:{fill:ye.pink,shade:ye.pinkDeep,light:ye.blush}};function $6(n,e,t,i,s,r,a){const o=t*Math.min(i,400);switch(e){case"soil":case"moss":{const c=Math.floor(o/7e3);for(let u=0;u<c;u++){const h=r.range(10,t-10),d=r.range(26,Math.min(i,420)-6),p=r.range(3,7);Cr(n,h,d,p,p*r.range(.55,.8),r.range(0,3)),n.fillStyle=r.chance(.25)?Ut(s.light,r.pick([ye.pink,ye.lilac,ye.mint]),.45):s.light,n.fill(),Sn(n,1.1,.85)}const l=Math.floor(o/3e4)+1;for(let u=0;u<l;u++){let h=r.range(0,t),d=r.range(30,Math.min(i,420));n.beginPath(),n.moveTo(h,d);for(let p=0;p<4;p++){const _=h+r.range(-60,60),m=d+r.range(-10,30);n.quadraticCurveTo((h+_)/2+r.range(-20,20),(d+m)/2,_,m),h=_,d=m}Sn(n,1.2,.8,s.detail)}const f=Math.floor(o/6e4);for(let u=0;u<f;u++){const h=r.range(24,t-24),d=r.range(60,Math.min(i,400));if(d>i-10)continue;const p=r.pick([ks.blue,ks.teal,ks.pink,ks.orange]);tu(n,h,d,r.range(18,34),r.range(-.3,.3),p,r.chance(.45),r)}break}case"root":{const c=Math.max(2,Math.floor(i/9));n.beginPath();for(let f=0;f<c;f++){const u=(f+.6)/c*i+r.range(-2,2);let h=r.range(4,30);for(n.moveTo(h,u);h<t-10;){const d=Math.min(t-6,h+r.range(30,90));n.quadraticCurveTo((h+d)/2,u+r.range(-3,3),d,u+r.range(-1.5,1.5)),h=d+r.range(6,30),n.moveTo(h,u+r.range(-1,1))}}Sn(n,1.1,.8,s.detail);const l=Math.floor(t/140);for(let f=0;f<l;f++){const u=r.range(14,t-14),h=r.range(i*.3,i*.75);Cr(n,u,h,r.range(4,7),r.range(2.5,4),0),Sn(n,1.1,.85)}break}case"crystal":{n.beginPath();const c=Math.max(2,Math.floor(t/40));for(let l=0;l<c;l++){const f=(l+.5)*(t/c)+r.range(-6,6);n.moveTo(f,2),n.lineTo(f+r.range(-14,14),i-2)}Sn(n,1.1,.55);break}case"wood":case"floor":case"bed":{const c=e==="floor"?30:22;if(n.beginPath(),e==="floor")for(let l=c;l<Math.min(i,200);l+=c){n.moveTo(0,l+r.range(-1,1)),n.lineTo(t,l+r.range(-1,1));for(let f=r.range(20,160);f<t;f+=r.range(120,220))n.moveTo(f,l-c+2),n.lineTo(f,l-2)}else for(let l=c;l<t-6;l+=c+r.range(-3,3))n.moveTo(l,4),n.lineTo(l+r.range(-1,1),i-4);Sn(n,1.2,.8),n.fillStyle=dt;for(let l=r.range(8,30);l<t-6;l+=r.range(60,110))Cr(n,l,e==="floor"?8:Math.min(i*.5,10),1.3,1.3),n.fill();break}case"stone":{n.beginPath();const c=Math.max(1,Math.floor(t/70));for(let l=0;l<c;l++){let f=r.range(10,t-10),u=r.range(6,i*.4);n.moveTo(f,u);for(let h=0;h<3;h++)f+=r.range(-10,10),u+=r.range(6,16),n.lineTo(f,u)}Sn(n,1.3,.9);break}case"metal":{n.beginPath();const c=80;for(let l=c;l<t;l+=c)n.moveTo(l,6),n.lineTo(l,Math.min(i,300));n.moveTo(4,20),n.lineTo(t-4,20),Sn(n,1.3,.85);for(let l=12;l<t;l+=c/2)Cr(n,l,12,2.4,2.4),n.fillStyle=s.accent,n.fill(),Sn(n,1,.9);break}case"office":{n.beginPath();for(let c=60;c<t;c+=60)n.moveTo(c,4),n.lineTo(c-18,Math.min(i,120));n.moveTo(0,26),n.lineTo(t,26),Sn(n,1.1,.7);break}case"paper":{n.beginPath();for(let c=r.range(60,200);c<t-20;c+=r.range(160,320))n.moveTo(c,r.range(22,34)),n.quadraticCurveTo(c+r.range(-10,10),Math.min(i,400)*.5,c+r.range(-16,16),Math.min(i,400)-r.range(8,20));Sn(n,1.2,.35,s.detail);break}}}function B6(n,e,t,i,s,r){const a=Math.cos(s),o=Math.sin(s),c=(m,g)=>[e+m*a-g*o,t+m*o+g*a],l=i*.34,f=c(i,0),u=c(i*.35,-l),h=c(i*.8,-l*.6),d=c(i*.35,l),p=c(i*.8,l*.6);n.beginPath(),n.moveTo(e,t),n.bezierCurveTo(u[0],u[1],h[0],h[1],f[0],f[1]),n.bezierCurveTo(p[0],p[1],d[0],d[1],e,t),n.closePath(),n.fillStyle=r,n.fill(),Sn(n,1.2);const _=c(i*.8,0);n.beginPath(),n.moveTo(e,t),n.lineTo(_[0],_[1]),Sn(n,.9,.8)}function O6(n,e,t,i,s){if(e==="moss"){const r=Math.floor(t/30);for(let c=0;c<r;c++){const l=s.range(6,t-6),f=s.range(5,11);n.fillStyle=s.chance(.5)?i.top:Ut(i.top,ye.lime,.4),n.beginPath(),n.moveTo(l-3.5,1),n.quadraticCurveTo(l-2.5,-f*.6,l-1+s.range(-3,3),-f),n.quadraticCurveTo(l+1,-f*.4,l+3.5,1),n.closePath(),n.fill(),Sn(n,1.1)}const a=Math.floor(t/260);for(let c=0;c<a;c++){const l=s.range(20,t-20),f=s.int(2,3);for(let u=0;u<f;u++)B6(n,l+(u-(f-1)/2)*5,0,s.range(11,17),-Math.PI/2+(u-(f-1)/2)*.7+s.range(-.15,.15),Ut(i.top,ye.leaf,.5))}const o=Math.floor(t/220);for(let c=0;c<o;c++){const l=s.range(10,t-10),f=s.pick([ye.pink,ye.butter,ye.lilac,L.ivory]);for(let u=0;u<5;u++){const h=u/5*Math.PI*2;Cr(n,l+Math.cos(h)*3,-5+Math.sin(h)*3,2.4,2.4),n.fillStyle=f,n.fill(),Sn(n,.9)}Cr(n,l,-5,1.6,1.6),n.fillStyle=ye.apricot,n.fill()}}else if(e==="soil"){const r=Math.floor(t/160);for(let a=0;a<r;a++){if(!s.chance(.5))continue;const o=s.range(20,t-20),c=s.pick([ks.teal,ks.blue,ks.pink,ks.orange]);tu(n,o,3,s.range(10,18),s.range(-.25,.25),c,!1,s)}}}function G6(n,e,t,i,s,r){const a=s?9:20,o=-a*.55,c=a*.45,l=Math.min(a*.85,e*.08),f=()=>{n.beginPath(),n.moveTo(l,o),n.lineTo(e-l,o),n.lineTo(e+.5,c);let d=e;for(;d>18;){const p=d-r.range(22,46);n.lineTo(Math.max(0,p),c+r.range(-.8,.8)),d=p}n.lineTo(-.5,c),n.closePath()},u=t==="crystal"?i.light:Ut(i.top,"#ffffff",.18);f(),n.fillStyle=u,n.fill(),n.save(),f(),n.clip(),n.beginPath();const h=Math.max(2,Math.round(e/40));for(let d=0;d<h;d++){const p=r.range(6,e-6),_=(p-e/2)/Math.max(1,e)*6;n.moveTo(p,c-1),n.lineTo(p-_-r.range(-2,2),o+r.range(1,a*.4))}Sn(n,1,.35,i.detail),n.restore(),n.lineJoin="round",n.beginPath(),n.moveTo(0,c),n.lineTo(l,o),n.lineTo(e-l,o),n.lineTo(e,c),Sn(n,s?1.2:1.5),n.beginPath(),n.moveTo(-.5,c),n.lineTo(e+.5,c),Sn(n,s?1.7:zi)}function Ua(n,e,t,i,s){const r=n.getContext("2d"),a=F6(e.style,i),o=!!e.oneWay||e.h<=30,c=new Vt(s),l=U6(e.w,e.h,c,o);r.save(),r.translate(e.x-t.x,e.y-t.y),r.lineJoin="round",r.lineCap="round",jl(r,l),r.fillStyle=a.base,r.fill(),r.save(),jl(r,l),r.clip();const f=new Vt(s^1540483477);if($6(r,e.style,e.w,e.h,a,f),e.style!=="crystal"&&e.style!=="metal"){const u=o?Math.min(7,e.h*.35):e.style==="moss"?16:e.style==="paper"?52:11;r.beginPath(),r.moveTo(-10,-10),r.lineTo(e.w+10,-10);let h=e.w+10;r.lineTo(h,u);const d=new Vt(s^12139),p=[[h,u]],_=e.style==="paper"?2.4:1;for(;h>-10;){const m=h-d.range(18,40)*_,g=u+d.range(-4,5)*_,b=u+d.range(-2,3)*_;r.quadraticCurveTo((h+m)/2,g,m,b),p.push([(h+m)/2,g],[m,b]),h=m}r.closePath(),r.fillStyle=a.top,r.fill(),r.beginPath(),r.moveTo(p[0][0],p[0][1]);for(let m=1;m+1<p.length;m+=2)r.quadraticCurveTo(p[m][0],p[m][1],p[m+1][0],p[m+1][1]);Sn(r,o?1:1.3,.85)}r.restore(),jl(r,l),Sn(r,o?1.8:zi),G6(r,e.w,e.style,a,o,new Vt(s^961)),O6(r,e.style,e.w,a,new Vt(s^119)),r.translate(-e.x,-e.y),Ba(r,e.x-xo-20,e.y-xo-20,e.w+xo*2+40,e.h+xo*2+40),r.restore()}const ci=Fo,Zr=k6(ci.theme),Ta={"prop.fourteen":{z:Un.wall+.004,thick:0,paint:!0},"prop.marks":{z:Un.wall+.004,thick:0,paint:!0},"prop.window":{z:Un.wall+.07,thick:.05},"prop.lamp":{z:-.95,thick:.03},"prop.bed":{z:-.55,thick:.06,lean:-.05},"prop.chest":{z:-.62,thick:.06,lean:.04},"prop.blocks":{z:-.4,thick:.06,lean:.06},"prop.toyhorse":{z:-.3,thick:.04,lean:-.12},"prop.toywhale":{z:-.2,thick:.05,lean:.1},"prop.rootdoor.open":{z:-.3,thick:.08},"prop.fossil":{z:Un.wall+.012,thick:0,paint:!0}},nu=2,yc={x:745,y:430,width:150},z6=new URL(""+new URL("p1-house-of-the-stranger-DZAUcsIe.jpg",import.meta.url).href,import.meta.url).href,H6=[{x:-300,y:-240,w:2800,h:240,style:"soil"},{x:-300,y:0,w:300,h:780,style:"soil"},{x:2200,y:0,w:300,h:440,style:"soil"},{x:2200,y:660,w:300,h:120,style:"soil"},{x:-300,y:780,w:2800,h:260,style:"soil"}],ui={x:-300,y:-240,w:2800,h:1280,res:1.25};function ec(n,e,t=16777215){const[i]=_s(512,400);return Ua(i,{x:0,y:0,w:560,h:600,style:n},{x:24,y:30},Zr.terrain,Mi(`${ci.id}:${e}`)),new Qi({map:Yo(i,!0),color:t})}function V6(){const n=Zr.layers[0],e=2600,[t,i]=_s(e,700),s=766;return i.fillStyle="#c9c7c4",i.fillRect(0,0,e,700),i.translate(0,155),n.draw(i,{w:e,h:s,horizon:s*.6},new Vt(Mi(`${ci.id}:layer:0`))),Yo(t)}function W6(){const[n,e]=_s(ui.w*ui.res,ui.h*ui.res);e.scale(ui.res,ui.res);const t={x:ui.x,y:ui.y};return H6.forEach((i,s)=>Ua(n,i,t,Zr.terrain,Mi(`${ci.id}:pad:${s}`))),ci.solids.forEach((i,s)=>{i.hidden||i.style==="none"||i.style==="root"||Ua(n,i,t,Zr.terrain,Mi(`${ci.id}:${s}`))}),e.clearRect(163-ui.x,596-ui.y,2600,64.5),Ur(n)}function X6(){const[e,t]=_s(2580,450);t.scale(1.5,1.5);for(const s of[0,1])t.save(),t.beginPath(),t.rect(0,150*s,1720,150),t.clip(),Ua(e,{x:0,y:0,w:1720,h:400,style:"floor"},{x:0,y:30-150*s},Zr.terrain,Mi(`${ci.id}:boards:${s}`)),t.restore();const i=Yo(e);return i.wrapT=1e3,i}function q6(){const[n]=_s(600,240);Ua(n,{x:0,y:0,w:600,h:400,style:"soil"},{x:0,y:40},Zr.terrain,Mi(`${ci.id}:tunnelfloor`));const e=Yo(n);return e.wrapS=e.wrapT=1e3,e}function Z6(n,e,t,i=0){const s=n.getAttribute("position"),r=n.getAttribute("uv");for(let a=0;a<s.count;a++)r.setXY(a,(s.getX(a)-i)/e,-s.getZ(a)/t)}function Gf(n,e,t,i,s,r=0){const a=new Gi(e-n,Un.front-Un.wall);a.rotateX(-Math.PI/2),a.translate((n+e)/2,0,(Un.front+Un.wall)/2),Z6(a,i,s,r);const o=new fn(a,t);return o.receiveShadow=!0,o}function yo(n,e,t,i){const s=new fn(new Gi(e,t),new $a({map:n,color:3023672,transparent:!0,opacity:i,depthWrite:!1,side:2}));return s.renderOrder=1,s}async function Y6(n){const e=Ta[n.key];if(!e)return null;const t=Fr(n.key),i=Ur(await Uo(t,nu)),s=n.scale??1,r=wo({tex:i,w:t.w*s,h:t.h*s,ox:n.ox??.5,oy:n.oy??1,thick:e.thick});return r.position.set(vt(n.x),un(n.y),e.z),e.lean&&(r.rotation.y=e.lean),r.name=n.key,r}function K6(n){const e=new Oi,t=yc.width*Bn,i=12*Bn,s=.05,r=new Qi({color:7162675}),a=new Qi({color:13610602}),o=(p,_,m,g)=>{const b=new fn(new $s(p,_,s),r);b.position.set(m,g,0),b.castShadow=!0,b.receiveShadow=!0,e.add(b)},c=t/2+i/2;o(t+i*2,i,0,c),o(t+i*2,i,0,-c),o(i,t,-c,0),o(i,t,c,0);const l=new fn(new $s(t+8*Bn,t+8*Bn,s*.5),a);l.position.z=-s*.2,l.receiveShadow=!0,e.add(l);const f=new fn(new Gi(t,t),new Qi({map:n}));f.position.z=s*.1,f.receiveShadow=!0,e.add(f);const u=new Qi({color:4866128}),h=t/2+i;for(const p of[-1,1]){const _=new H(p*h*.55,h-.02,-s/2),m=new H(0,h+.34,-.09),g=_.distanceTo(m),b=new fn(new Do(.006,.006,g,5),u);b.position.copy(_).add(m).multiplyScalar(.5),b.quaternion.setFromUnitVectors(new H(0,1,0),m.clone().sub(_).normalize()),b.castShadow=!0,e.add(b)}const d=new fn(new Do(.03,.03,.05,10),new Qi({color:9210514}));return d.rotation.x=Math.PI/2,d.position.set(0,h+.35,-.09),d.castShadow=!0,e.add(d),e}async function Q6(){const n=new Oi;n.name="r01";const e=V5(),t=gc([[0,.9],[.45,.55],[1,0]]),i=V6(),s=new fn(new Gi(26,7),new Qi({map:i}));s.position.set(vt(1100),un(350),Un.wall),s.receiveShadow=!0,n.add(s);const r=ec("soil","earth"),a=ec("soil","tunnel",10325906),o=ec("root","rootslab"),c=new fn(new Gi(vt(800),un(420)-un(680)),a);c.position.set(vt(2120),(un(420)+un(680))/2,Un.wall+.005),c.receiveShadow=!0,n.add(c);const l=Un.wall-.3,f=Un.front-.02,u=[5.12,4];for(const W of[Mo(-3,0,vt(160),un(-240),l,f,r,u),Mo(vt(160),un(130),vt(1700),un(-240),l,f,r,u),Mo(vt(1700),un(430),vt(1770),un(130),l,.05,o,u),Mo(vt(1770),un(440),vt(2500),un(-240),l,f,r,u)])W.castShadow=!1,n.add(W);const h=new fn(zc(ui.w,ui.h,0,0),Nr(W6()));h.position.set(vt(ui.x),un(ui.y),Un.front),h.receiveShadow=!0,n.add(h);const d=new Qi({map:X6(),color:new Lt(1.16,1.16,1.16)});n.add(Gf(vt(160),vt(1720),d,vt(1720),3));const p=new Qi({map:q6(),color:new Lt(1.1,1.1,1.1)});n.add(Gf(vt(1720),vt(2500),p,vt(600),2.4,vt(1720)));const _=yo(e,vt(1560),.4,.18);_.position.set(vt(930),.2,Un.wall+.003),n.add(_);const m=yo(e,vt(1560),.6,.2);m.rotation.x=Math.PI/2,m.position.set(vt(930),.002,Un.wall+.3),n.add(m);const g=yo(e,vt(1540),.6,.35);g.rotation.z=Math.PI,g.position.set(vt(930),un(130)-.3,Un.wall+.003),n.add(g);const b=yo(e,un(130),.5,.25);b.rotation.z=-Math.PI/2,b.position.set(vt(160)+.25,un(130)/2,Un.wall+.003),n.add(b);const E=new Map,v=await Promise.all((ci.props??[]).map(W=>Y6(W)));let S=null;for(const[W,le]of v.entries()){if(!le)continue;const Q=ci.props[W],ae=Ta[Q.key];if(Q.key==="prop.lamp"&&(S=le),n.add(le),!ae.paint&&Q.key!=="prop.lamp"&&Q.key!=="prop.window"){const Ve=Fr(Q.key).w*(Q.scale??1)*Bn,ze=_c(t,Ve*1.05,.34,.55);ze.position.set(vt(Q.x),.003,ae.z+.02),n.add(ze)}}for(const W of ci.checkpoints){if(W.silent)continue;const le=Fr("prop.lantern"),Q=wo({tex:Ur(await Uo(le,nu)),w:le.w,h:le.h,ox:.5,oy:1,thick:.04});Q.position.set(vt(W.x-46),un(W.y+2),-.12),n.add(Q);const ae=_c(t,le.w*Bn*1.1,.25,.45);ae.position.set(vt(W.x-46),.003,-.1),n.add(ae)}for(const W of ci.solids){if(!W.oneWay)continue;const le=W.x+W.w/2,Q=ci.props.find(ae=>Ta[ae.key]&&!Ta[ae.key].paint&&Math.abs(ae.x-le)<90&&ae.y>=600);Q&&E.set(W,Ta[Q.key].z+.1)}const T=K6(await W5(z6));T.position.set(vt(yc.x),un(yc.y),Un.wall+.11),n.add(T);const P=new ed(16250367,15920098,1.2);n.add(P),n.add(new id(16775924,.12));const x=new P0(15659263,.8);x.position.set(.75,.15,.64),n.add(x);const A=new P0(16775924,2.2);A.castShadow=!0,A.shadow.mapSize.set(2048,2048),A.shadow.camera.near=1,A.shadow.camera.far=40,A.shadow.bias=-4e-4,A.shadow.normalBias=.012,A.shadow.radius=6,A.shadow.intensity=.82,n.add(A),n.add(A.target);const I=new C0(16757867,2.4,6,1.6),B=gc([[0,1],[.25,.45],[1,0]]),U=kf(B,16761469,1.5,.45),z=kf(B,16773320,.55,.6);if(S){const W=new zn;W.position.set(0,-1.46,.05),S.add(W),W.add(I,U,z)}const D=new C0(12098815,.9,3.2,1.6);D.position.set(vt(1441),un(400),Un.wall+.5),n.add(D);const G=new Oi;{const[Q,ae]=_s(3200,150);D6(ae,3200,150,ci.theme,new Vt(Mi(`${ci.id}:fg`)));const de=wo({tex:Ur(Q),w:3200,h:150,ox:0,oy:1,thick:.05});de.scale.y=.5,de.position.set(vt(-500),-.03,Un.front-.25),G.add(de);const Ve=[["prop.crystals.teal",360,4.6,1.55],["prop.crystals.orange",1150,4.75,1.35],["prop.crystals.blue",1590,4.5,1.6]];for(const[ze,Me,Pe,Ye]of Ve){const te=Fr(ze),ce=wo({tex:Ur(await Uo(te,1.5)),w:te.w*Ye,h:te.h*Ye,ox:.5,oy:1,thick:.05});ce.position.set(vt(Me),-.5,Pe),G.add(ce)}}n.add(G);const K={lamp:I.intensity,window:D.intensity};return{group:n,key:A,platformZ:E,foreground:G,update(W){S&&(S.rotation.z=.018*Math.sin(W*.8)+.006*Math.sin(W*2.1+1));const le=1+.035*Math.sin(W*11.3)+.025*Math.sin(W*6.1+2)+.02*Math.sin(W*17.9);I.intensity=K.lamp*le,U.material.opacity=.42*le,D.intensity=K.window*(1+.08*Math.sin(W*.7))}}}const Ea=new URLSearchParams(location.search),tc=document.getElementById("view"),J6=document.getElementById("fx"),iu=document.getElementById("loading");Ea.has("shot")&&document.body.classList.add("shot");const Js=1/60,nc=new H(-.56,.4,.73).normalize(),ic=Fo.checkpoints[0];async function j6(){const n=new rg({antialias:!1,powerPreference:"high-performance"});n.shadowMap.enabled=!0,n.shadowMap.type=1,n.toneMapping=0,tc.prepend(n.domElement),G5(Math.min(8,n.capabilities.getMaxAnisotropy()));const e=new Pu;e.background=new Lt(1907240);const t=await Q6();e.add(t.group);const i=O5().find(Me=>Me.id==="gorti.root.child"),s=await Hc.create(i);e.add(s.root);const r=Fo.solids.filter(Me=>Me.style!=="none"),a=new u6(s,r,t.platformZ,580,ic.y,Fo.width);a.place(580,ic.y,1);const o=gc([[0,.95],[.5,.6],[1,0]]),c=_c(o,.95,.3,.6);e.add(c);const l=new q5(16/9,vt(430),vt(1770));l.snap(a);const f=new T6(n,e,l.camera,Number(Ea.get("msaa")??4));let u=!0;n.info.autoReset=!1;const h=()=>{n.info.reset(),f.render()},d=Number(Ea.get("dpr")??1.5);let p=Math.min(window.devicePixelRatio||1,d);const _=()=>{const Me=Math.max(1,tc.clientWidth),Pe=Math.max(1,tc.clientHeight),Ye=p;n.setPixelRatio(Ye),n.setSize(Me,Pe,!1),f.setSize(Me,Pe,Ye),l.setAspect(Me/Pe)};_(),window.addEventListener("resize",_);const m=new Set;let g=!1;const b=new Set(["Space","KeyW","ArrowUp"]);window.addEventListener("keydown",Me=>{Me.repeat||(m.add(Me.code),b.has(Me.code)&&(g=!0),Me.code==="Digit1"?f.dof=!f.dof:Me.code==="Digit2"?f.print=!f.print:Me.code==="Digit3"?(u=!u,t.key.castShadow=u):Me.code==="KeyG"&&(l.mode=l.mode==="wide"?"follow":"wide"),(b.has(Me.code)||Me.code.startsWith("Arrow"))&&Me.preventDefault(),K())}),window.addEventListener("keyup",Me=>m.delete(Me.code)),window.addEventListener("blur",()=>m.clear());for(const[Me,Pe]of[["padL","ArrowLeft"],["padR","ArrowRight"],["padJ","Space"]]){const Ye=document.getElementById(Me);if(!Ye)continue;Ye.addEventListener("pointerdown",ce=>{ce.preventDefault(),m.add(Pe),Pe==="Space"&&(g=!0),Ye.classList.add("on")});const te=()=>{m.delete(Pe),Ye.classList.remove("on")};for(const ce of["pointerup","pointercancel","pointerleave"])Ye.addEventListener(ce,te)}document.getElementById("padG")?.addEventListener("click",()=>{l.mode=l.mode==="wide"?"follow":"wide",K()});const E=()=>({axis:(m.has("KeyD")||m.has("ArrowRight")?1:0)-(m.has("KeyA")||m.has("ArrowLeft")?1:0),jumpPressed:g,jumpHeld:[...b].some(Pe=>m.has(Pe))}),v=n.domElement;let S=null;v.addEventListener("pointerdown",Me=>{S={x:Me.clientX,y:Me.clientY},l.dragging=!0,v.setPointerCapture(Me.pointerId)}),v.addEventListener("pointermove",Me=>{S&&(l.dragYaw=Math.max(-.7,Math.min(.7,l.dragYaw-(Me.clientX-S.x)*.004)),l.dragPitch=Math.max(-.35,Math.min(.25,l.dragPitch-(Me.clientY-S.y)*.003)),S={x:Me.clientX,y:Me.clientY})});const T=()=>{S=null,l.dragging=!1};v.addEventListener("pointerup",T),v.addEventListener("pointercancel",T);let P=0,x=0;const A=new H,I=new H().crossVectors(new H(0,1,0),nc).normalize(),B=new H().crossVectors(nc,I),U=(Me,Pe)=>{for(x+=Me;x>=Js-1e-9;)a.fixed(Js,{...Pe,jumpPressed:Pe.jumpPressed}),Pe={...Pe,jumpPressed:!1},g=!1,x-=Js;P+=Me,a.visual(Me),t.update(P),l.update(a,Me),f.focus=l.focusDist,t.foreground.visible=l.mode!=="wide";const Ye=a.heightAboveGround(),te=1-Math.min(1,Ye.h/220);c.position.set(vt(a.x),un(Ye.ground)+.004,a.groundZ()+.02),c.scale.setScalar(.55+.45*te),c.material.opacity=.6*te;const we=l.mode==="wide"?14:7.5,st=t.key.shadow.camera;st.right!==we&&(st.left=-we,st.right=we,st.top=we*.75,st.bottom=-we*.75,st.updateProjectionMatrix());const Ne=we*2/t.key.shadow.mapSize.x;A.set(l.focus.x,2.2,-.4);const St=Math.round(A.dot(I)/Ne)*Ne-A.dot(I),Rn=Math.round(A.dot(B)/Ne)*Ne-A.dot(B);A.addScaledVector(I,St).addScaledVector(B,Rn),t.key.target.position.copy(A),t.key.position.copy(A).addScaledVector(nc,20)};let z=0,D=0,G=0;const K=()=>{const Me=(Pe,Ye,te)=>`<span class="${te?"":"off"}"><b>${Pe}</b> ${Ye}</span>`;J6.innerHTML=`${Me("1","Alan derinliği",f.dof)} · ${Me("2","Baskı",f.print)} · ${Me("3","Gölgeler",u)} · ${Me("G","Geniş",l.mode==="wide")}<br>${G?`${G} fps · çözünürlük ${p.toFixed(2)}×`:"…"}`},W=!Ea.has("dpr")&&!Ea.has("shot");let le=0,Q=0;const ae=Me=>{le+=Me,Q++,!(le<2)&&(W&&Q/le<45&&p>.75&&(p=Math.max(.75,p-.25),_()),le=0,Q=0)};let de=!1,Ve=performance.now();const ze=Me=>{if(de)return;requestAnimationFrame(ze);const Pe=Math.max(0,(Me-Ve)/1e3),Ye=Math.min(.05,Pe);Ve=Me,U(Ye,E()),h(),document.visibilityState==="visible"&&ae(Pe),z++,D+=Pe,D>=.5&&(G=Math.round(z/D),z=0,D=0,K())};U(Js,{axis:0,jumpPressed:!1,jumpHeld:!1}),n.compile(e,l.camera),h(),iu.remove(),K(),requestAnimationFrame(Me=>{Ve=Me,ze(Me)}),window.__diorama={manual(Me){de=Me,Me||(Ve=performance.now(),requestAnimationFrame(ze))},step(Me,Pe={},Ye=!0){const te=Math.max(1,Math.round(Me/(Js*1e3))),ce={axis:Pe.axis??0,jumpPressed:Pe.jumpPressed??!1,jumpHeld:Pe.jumpHeld??!1};for(let we=0;we<te;we++)U(Js,ce),ce.jumpPressed=!1;Ye&&h()},place(Me,Pe=1,Ye=ic.y){a.place(Me,Ye,Pe),l.snap(a)},camera(Me,Pe){if(l.mode=Me,Pe){const Ye={target:new H(...Pe.target),dist:Pe.dist,yaw:Pe.yaw,pitch:Pe.pitch,roll:Pe.roll??0,fov:Pe.fov??30};l.fixedPose=Ye}},fx(Me){Me.dof!==void 0&&(f.dof=Me.dof),Me.print!==void 0&&(f.print=Me.print),Me.shadows!==void 0&&(u=Me.shadows,t.key.castShadow=u)},state(){return{x:a.x,y:a.y,z:a.z,vx:a.vx,vy:a.vy,onGround:a.onGround,anim:s.anim,fps:G,calls:n.info.render.calls,triangles:n.info.render.triangles,textures:n.info.memory.textures,geometries:n.info.memory.geometries,size:[n.domElement.width,n.domElement.height]}},perf(Me=20){const Pe=n.getContext(),Ye=new Uint8Array(4);let te=0;const ce=performance.now();for(let we=0;we<Me;we++){const st=performance.now();U(Js,{axis:1,jumpPressed:!1,jumpHeld:!1}),te+=performance.now()-st,h(),Pe.readPixels(0,0,1,1,Pe.RGBA,Pe.UNSIGNED_BYTE,Ye)}return{ms:(performance.now()-ce)/Me,simMs:te/Me}}},document.body.dataset.ready="1"}j6().catch(n=>{iu.textContent=`Diorama açılamadı: ${n instanceof Error?n.message:String(n)}`,console.error(n)});
