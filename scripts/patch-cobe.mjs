import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runtimePath = path.join(projectRoot, "node_modules/cobe/dist/index.esm.js");
const typesPath = path.join(projectRoot, "node_modules/cobe/dist/index.d.ts");

function replaceOnce(filePath, original, replacement) {
  const source = fs.readFileSync(filePath, "utf8");
  if (source.includes(replacement)) return;
  if (!source.includes(original)) {
    throw new Error(`Unable to apply the COBE timeline patch to ${filePath}`);
  }
  fs.writeFileSync(filePath, source.replace(original, replacement));
}

function replaceOneOf(filePath, originals, replacement) {
  const source = fs.readFileSync(filePath, "utf8");
  if (source.includes(replacement)) return;
  const original = originals.find((candidate) => source.includes(candidate));
  if (!original) {
    throw new Error(`Unable to apply the COBE timeline patch to ${filePath}`);
  }
  fs.writeFileSync(filePath, source.replace(original, replacement));
}

replaceOnce(
  runtimePath,
  "R+p,.005*E",
  "(e.height??R)+p,.005*E",
);

replaceOneOf(
  runtimePath,
  [
    "vec3 C(vec3 c,vec3 d,vec3 e,float a){float b=1.-a;return b*b*c+2.*b*a*d+a*a*e;}vec3 D(vec3 c,vec3 b,vec3 d,float a){float e=1.-a;return 2.*e*(b-c)+2.*a*(d-b);}",
    "vec3 C(vec3 a,vec3 b,vec3 c,vec3 d,float e){float f=1.-e;return f*f*f*a+3.*f*f*e*b+3.*f*e*e*c+e*e*e*d;}vec3 D(vec3 a,vec3 b,vec3 c,vec3 d,float e){float f=1.-e;return 3.*f*f*(b-a)+6.*f*e*(c-b)+3.*e*e*(d-c);}",
    "vec3 C(vec3 a,vec3 b,float n,float h,float r,float t){float s=sin(n),u=1.-t;vec3 d=n<1e-3?normalize(mix(a,b,t)):normalize((sin(u*n)/s)*a+(sin(t*n)/s)*b);float p=pow(max(0.,sin(3.141593*t)),.62);return d*(r+h*p);}vec3 D(vec3 a,vec3 b,float n,float h,float r,float t){float e=.002;return C(a,b,n,h,r,min(1.,t+e))-C(a,b,n,h,r,max(0.,t-e));}",
    "vec3 C(vec3 a,vec3 b,float n,float h,float r,float t){vec3 u=normalize(a+b),v=normalize(a-b);float A=n*.5,c=clamp(h*1.55,.08,r*.78),x=r*cos(A)-c,y=r*sin(A),R=sqrt(x*x+y*y),B=atan(y,x),T=B*(1.-2.*t);return u*(c+R*cos(T))+v*(R*sin(T));}vec3 D(vec3 a,vec3 b,float n,float h,float r,float t){float e=.002;return C(a,b,n,h,r,min(1.,t+e))-C(a,b,n,h,r,max(0.,t-e));}",
    "vec3 C(vec3 a,vec3 b,float n,float h,float r,float t){vec3 u=normalize(a+b),v=normalize(a-b);float A=n*.5,c=r*.25,x=r*cos(A)-c,y=r*sin(A),R=sqrt(x*x+y*y),B=atan(y,x),T=B*(1.-2.*t);return u*(c+R*cos(T))+v*(R*sin(T));}vec3 D(vec3 a,vec3 b,float n,float h,float r,float t){float e=.002;return C(a,b,n,h,r,min(1.,t+e))-C(a,b,n,h,r,max(0.,t-e));}",
    "vec3 C(vec3 a,vec3 b,float n,float h,float r,float t){vec3 u=normalize(a+b),v=normalize(a-b);float A=n*.5,s=clamp(n/2.094395,0.,1.);s=s*s*(3.-2.*s);float c=r*(.25+.1*s),x=r*cos(A)-c,y=r*sin(A),R=sqrt(x*x+y*y),B=atan(y,x),T=B*(1.-2.*t);return u*(c+R*cos(T))+v*(R*sin(T));}vec3 D(vec3 a,vec3 b,float n,float h,float r,float t){float e=.002;return C(a,b,n,h,r,min(1.,t+e))-C(a,b,n,h,r,max(0.,t-e));}",
    "vec3 C(vec3 a,vec3 b,float n,float h,float r,float t){vec3 u=normalize(a+b),v=normalize(a-b);float A=n*.5,c=r*clamp(h,.05,.8),x=r*cos(A)-c,y=r*sin(A),R=sqrt(x*x+y*y),B=atan(y,x),T=B*(1.-2.*t);return u*(c+R*cos(T))+v*(R*sin(T));}vec3 D(vec3 a,vec3 b,float n,float h,float r,float t){float e=.002;return C(a,b,n,h,r,min(1.,t+e))-C(a,b,n,h,r,max(0.,t-e));}",
  ],
  "vec3 C(vec3 a,vec3 b,float n,float h,float r,float t){float s=sin(n),u=1.-t;vec3 d=abs(s)<1e-3?normalize(mix(a,b,t)):normalize((sin(u*n)/s)*a+(sin(t*n)/s)*b);float p=sin(3.141593*t);return d*r*(1.+h*p);}vec3 D(vec3 a,vec3 b,float n,float h,float r,float t){float e=.002;return C(a,b,n,h,r,min(1.,t+e))-C(a,b,n,h,r,max(0.,t-e));}",
);

replaceOneOf(
  runtimePath,
  [
    "vec3 d=l*c,e=m*c,f=l+m;float n=length(f);vec3 E=n>1e-3?f/n:vec3(0,1,0),o=E*(.8+v);float p=k.x;vec3 F=C(d,o,e,p),q=b*F,G=D(d,o,e,p),H=b*G;",
    "vec3 d=l*c,e=m*c;float f=clamp(dot(l,m),-1.,1.),n=acos(f),E=min(.42,n*.24);vec3 o=m-l*f,u=l-m*f;o=length(o)>1e-4?normalize(o):vec3(1,0,0);u=length(u)>1e-4?normalize(u):vec3(1,0,0);float R=.8+A+v;vec3 V=normalize(l+o*E)*R,W=normalize(m+u*E)*R;float p=k.x;vec3 F=C(d,V,W,e,p),q=b*F,G=D(d,V,W,e,p),H=b*G;",
    "vec3 d=l*c,e=m*c;float f=clamp(dot(l,m),-1.,1.),n=acos(f),E=min(.22,max(.05,n*.1)),Q=max(.025,v*.72);vec3 o=m-l*f,u=l-m*f;o=length(o)>1e-4?normalize(o):vec3(1,0,0);u=length(u)>1e-4?normalize(u):vec3(1,0,0);vec3 V=l*(.8+A+Q)+o*E,W=m*(.8+A+Q)+u*E;float p=k.x;vec3 F=C(d,V,W,e,p),q=b*F,G=D(d,V,W,e,p),H=b*G;",
    "vec3 d=l*c,e=m*c;float f=clamp(dot(l,m),-1.,1.),n=acos(f),E=min(.1,max(.025,n*.045)),Q=max(.065,v*1.25);vec3 o=m-l*f,u=l-m*f;o=length(o)>1e-4?normalize(o):vec3(1,0,0);u=length(u)>1e-4?normalize(u):vec3(1,0,0);vec3 V=l*(.8+A+Q)+o*E,W=m*(.8+A+Q)+u*E;float p=k.x;vec3 F=C(d,V,W,e,p),q=b*F,G=D(d,V,W,e,p),H=b*G;",
    "vec3 d=l*c,e=m*c;float f=clamp(dot(l,m),-1.,1.),n=acos(f),E=min(.1,max(.025,n*.045)),Q=max(.065,v*1.25);vec3 o=m-l*f,u=l-m*f;o=length(o)>1e-4?normalize(o):vec3(1,0,0);u=length(u)>1e-4?normalize(u):vec3(1,0,0);vec3 V=l*(.8+A+Q)+o*E,W=m*(.8+A+Q)+u*E,X=l+m;float L=length(X);X=(L>1e-3?X/L:vec3(0,1,0))*(.8+A+v*1.55);float p=k.x,S=.18,T;vec3 F,G;if(p<S){T=p/S;F=mix(d,V,T);G=(V-d)/S;}else if(p>1.-S){T=(p-1.+S)/S;F=mix(W,e,T);G=(e-W)/S;}else{T=(p-S)/(1.-2.*S);F=C(V,X,X,W,T);G=D(V,X,X,W,T)/(1.-2.*S);}vec3 q=b*F,H=b*G;",
    "float c=.8+A,f=clamp(dot(l,m),-1.,1.),n=acos(f),p=k.x;vec3 F=C(l,m,n,v,c,p),q=b*F,G=D(l,m,n,v,c,p),H=b*G;",
  ],
  "float f=clamp(dot(l,m),-1.,1.),n=acos(f),p=k.x;vec3 F=C(l,m,n,v,c,p),q=b*F,G=D(l,m,n,v,c,p),H=b*G;",
);

replaceOnce(
  typesPath,
  "  id?: string\n}\n\nexport interface COBEOptions",
  "  id?: string\n  height?: number\n}\n\nexport interface COBEOptions",
);
