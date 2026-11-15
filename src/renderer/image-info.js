(function(root){
  'use strict';
  // Probe dimensions before asking Chromium to allocate a decoded bitmap.
  async function inspect(file) {
    const bad=()=>{throw new Error('INVALID_IMAGE');};
    const chunk=async(start,length)=>new Uint8Array(await file.slice(start,start+length).arrayBuffer());
    const head=await chunk(0,32),view=new DataView(head.buffer);
    if(head.length>=24&&[137,80,78,71,13,10,26,10].every((v,i)=>head[i]===v))return{width:view.getUint32(16),height:view.getUint32(20)};
    if(head.length>=26&&head[0]===66&&head[1]===77){
      const dib=view.getUint32(14,true);
      if(dib===12)return{width:view.getUint16(18,true),height:view.getUint16(20,true)};
      if(dib>=40)return{width:view.getInt32(18,true),height:Math.abs(view.getInt32(22,true))};
    }
    if(head[0]===255&&head[1]===216){
      let at=2,segments=0;
      while(at+4<=file.size&&++segments<=10000){
        let data=await chunk(at,12);
        if(data[0]!==255)bad();
        while(data[1]===255){at++;data=await chunk(at,12);}
        const marker=data[1];
        if(marker===217||marker===218)bad();
        if(marker===1||marker>=208&&marker<=215){at+=2;continue;}
        const length=(data[2]<<8)|data[3];if(length<2||at+2+length>file.size)bad();
        if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){
          if(length<8||data.length<9)bad();
          return{width:(data[7]<<8)|data[8],height:(data[5]<<8)|data[6]};
        }
        at+=2+length;
      }
    }
    bad();
  }
  root.PixelImageInfo=Object.freeze({inspect});
})(globalThis);
