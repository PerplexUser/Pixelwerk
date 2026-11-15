/* Pixelwerk's image operations never perform network requests. */
(function(root){
  'use strict';
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  function canvas(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;}
  function clone(c){const d=canvas(c.width,c.height);d.getContext('2d').drawImage(c,0,0);return d;}
  function hexRGB(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
  function regionPixels(image,x,y,{color=[0,0,0],opacity=1,tolerance=20,erase=false,contiguous=true,bounds=null}={}){
    const {width:w,height:h,data:d}=image;x=Math.floor(x);y=Math.floor(y);
    const b=bounds?{x:Math.max(0,Math.floor(bounds.x)),y:Math.max(0,Math.floor(bounds.y)),r:Math.min(w,Math.ceil(bounds.x+bounds.w)),b:Math.min(h,Math.ceil(bounds.y+bounds.h))}:{x:0,y:0,r:w,b:h};
    if(x<b.x||y<b.y||x>=b.r||y>=b.b)return 0;
    const start=(y*w+x)*4,target=[d[start],d[start+1],d[start+2],d[start+3]],seen=new Uint8Array(w*h),stack=[y*w+x];let count=0;
    const matches=p=>{const a=d[p+3];if(target[3]===0)return a===0;return Math.max(Math.abs(d[p]-target[0]),Math.abs(d[p+1]-target[1]),Math.abs(d[p+2]-target[2]),Math.abs(a-target[3]))<=tolerance*2.55;};
    const apply=p=>{if(erase){d[p+3]=Math.round(d[p+3]*(1-opacity));}else{const sa=opacity,da=d[p+3]/255,oa=sa+da*(1-sa);for(let k=0;k<3;k++)d[p+k]=oa?Math.round((color[k]*sa+d[p+k]*da*(1-sa))/oa):0;d[p+3]=Math.round(oa*255);}count++;};
    if(!contiguous){for(let yy=b.y;yy<b.b;yy++)for(let xx=b.x;xx<b.r;xx++){const p=(yy*w+xx)*4;if(matches(p))apply(p);}return count;}
    while(stack.length){const i=stack.pop(),yy=Math.floor(i/w);let xx=i%w;if(seen[i]||!matches(i*4))continue;while(xx>b.x&&!seen[yy*w+xx-1]&&matches((yy*w+xx-1)*4))xx--;let above=false,below=false;for(;xx<b.r&&!seen[yy*w+xx]&&matches((yy*w+xx)*4);xx++){const p=yy*w+xx;seen[p]=1;apply(p*4);if(yy>b.y){const match=!seen[p-w]&&matches((p-w)*4);if(match&&!above)stack.push(p-w);above=match;}if(yy+1<b.b){const match=!seen[p+w]&&matches((p+w)*4);if(match&&!below)stack.push(p+w);below=match;}}}
    return count;
  }
  function effects(image,{contrast=0,brightness=0,saturation=0,effect='none'}={},bounds=null){
    const {data:d,width:w,height:h}=image;const c=clamp(contrast,-100,100)*2.55;const factor=259*(c+255)/(255*(259-c));const sat=1+saturation/100;
    const b=bounds?{x:Math.max(0,Math.floor(bounds.x)),y:Math.max(0,Math.floor(bounds.y)),r:Math.min(w,Math.ceil(bounds.x+bounds.w)),b:Math.min(h,Math.ceil(bounds.y+bounds.h))}:{x:0,y:0,r:w,b:h};
    for(let y=b.y;y<b.b;y++)for(let x=b.x;x<b.r;x++){const p=(y*w+x)*4;let r=factor*(d[p]-128)+128+brightness*2.55,g=factor*(d[p+1]-128)+128+brightness*2.55,bl=factor*(d[p+2]-128)+128+brightness*2.55;const lum=.2126*r+.7152*g+.0722*bl;r=lum+(r-lum)*sat;g=lum+(g-lum)*sat;bl=lum+(bl-lum)*sat;
    if(effect==='mono')r=g=bl=lum;
    if(effect==='sepia'){const a=r,b=g,c=bl;r=.393*a+.769*b+.189*c;g=.349*a+.686*b+.168*c;bl=.272*a+.534*b+.131*c;}
    if(effect==='invert'){r=255-r;g=255-g;bl=255-bl;}
    if(effect==='cool'){r*=.92;g*=1.02;bl*=1.14;}
    if(effect==='warm'){r*=1.14;g*=1.03;bl*=.9;}
    d[p]=clamp(r,0,255);d[p+1]=clamp(g,0,255);d[p+2]=clamp(bl,0,255);}
    return image;
  }
  function brushTip(size,thickness,hardness,color,shape='round'){
    if(shape==='square'){
      const c=canvas(size+4,size+4),ctx=c.getContext('2d'),d=ctx.createImageData(c.width,c.height),rgb=hexRGB(color);
      const rx=size/2,ry=rx*Math.max(.05,thickness/100),edge=clamp(hardness/100,0,1);
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
        const dx=Math.abs(x+.5-c.width/2),dy=Math.abs(y+.5-c.height/2),distance=Math.max(dx/rx,dy/ry);
        const coverage=clamp(rx+.5-dx,0,1)*clamp(ry+.5-dy,0,1);
        const alpha=edge>=.99?coverage:coverage*clamp((1-distance)/(1-edge),0,1),p=(y*c.width+x)*4;
        d.data[p]=rgb[0];d.data[p+1]=rgb[1];d.data[p+2]=rgb[2];d.data[p+3]=Math.round(alpha*255);
      }
      ctx.putImageData(d,0,0);return c;
    }
    const c=canvas(size+4,size+4),ctx=c.getContext('2d'),r=size/2;ctx.translate(c.width/2,c.height/2);ctx.scale(1,Math.max(.05,thickness/100));
    if(hardness>=99)ctx.fillStyle=color;else{const grad=ctx.createRadialGradient(0,0,r*hardness/100,0,0,r);grad.addColorStop(0,color);grad.addColorStop(1,color+'00');ctx.fillStyle=grad;}
    ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();return c;
  }
  // Carry colors from the previous dab; blend in premultiplied alpha so
  // transparent pixels never introduce a black fringe or erase opaque color.
  function smudgeDab(image,pickup,{strength=50,hardness=35,x=0,y=0,bounds=null}={}){
    const d=image.data,s=pickup.data,w=image.width,h=image.height,r=Math.min(w,h)/2,force=clamp(strength/100,0,1),edge=clamp(hardness/100,0,.99);
    let changed=0;
    for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
      const p=(yy*w+xx)*4,px=x+xx,py=y+yy;
      if(bounds&&(px<bounds.x||py<bounds.y||px>=bounds.x+bounds.w||py>=bounds.y+bounds.h)){s[p+3]=0;continue;}
      const distance=Math.hypot(xx+.5-w/2,yy+.5-h/2)/r;
      if(distance>=1)continue;
      const weight=force*clamp((1-distance)/(1-edge),0,1),sa=s[p+3]/255,da=d[p+3]/255,a=sa*weight,out=a+da*(1-a),pick=.18,pickAlpha=sa*(1-pick)+da*pick;
      for(let k=0;k<3;k++){
        const source=s[p+k],dest=d[p+k];
        if(a>0)d[p+k]=out?Math.round((source*a+dest*da*(1-a))/out):0;
        s[p+k]=pickAlpha?Math.round((source*sa*(1-pick)+dest*da*pick)/pickAlpha):0;
      }
      if(a>0){d[p+3]=Math.round(out*255);changed++;}
      s[p+3]=Math.round(pickAlpha*255);
    }
    return changed;
  }
  function encodeBMP(c){
    const w=c.width,h=c.height,stride=Math.ceil(w*3/4)*4,size=54+stride*h,buffer=new ArrayBuffer(size),v=new DataView(buffer),bytes=new Uint8Array(buffer),d=c.getContext('2d').getImageData(0,0,w,h).data;
    v.setUint16(0,0x4d42,true);v.setUint32(2,size,true);v.setUint32(10,54,true);v.setUint32(14,40,true);v.setInt32(18,w,true);v.setInt32(22,h,true);v.setUint16(26,1,true);v.setUint16(28,24,true);v.setUint32(34,stride*h,true);v.setInt32(38,2835,true);v.setInt32(42,2835,true);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=(y*w+x)*4,q=54+(h-1-y)*stride+x*3,a=d[p+3]/255;bytes[q]=Math.round(d[p+2]*a+255*(1-a));bytes[q+1]=Math.round(d[p+1]*a+255*(1-a));bytes[q+2]=Math.round(d[p]*a+255*(1-a));}return buffer;
  }
  const api={clamp,canvas,clone,hexRGB,regionPixels,effects,brushTip,smudgeDab,encodeBMP};
  if(typeof module!=='undefined')module.exports=api;else root.PixelCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
