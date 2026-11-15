const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../../src/renderer/core.js');
const R=require('../../reference/Pixelwerk/core.js');
const image=()=>({width:3,height:2,data:new Uint8ClampedArray([255,0,0,255, 0,0,0,0, 255,0,0,255, 255,0,0,255, 20,25,30,128, 30,35,40,255])});
test('flood-fill contiguous/global behavior and selection clipping',()=>{
  let data=image();assert.equal(C.regionPixels(data,0,0,{color:[0,255,0],tolerance:0}),2);assert.equal(data.data[8],255);
  data=image();assert.equal(C.regionPixels(data,0,0,{erase:true,tolerance:0,contiguous:false}),3);assert.equal(data.data[3],0);
  data=image();const before=[...data.data];C.regionPixels(data,0,0,{bounds:{x:1,y:0,w:1,h:2}});assert.deepEqual([...data.data],before);
});
test('all effect presets and extreme adjustments match original byte-for-byte',()=>{
  for(const effect of ['none','mono','sepia','warm','cool','invert'])for(const value of [-100,0,100]){
    const a=image(),b=image(),settings={effect,contrast:value,brightness:value,saturation:value};
    C.effects(a,settings,{x:0,y:0,w:2,h:1});R.effects(b,settings,{x:0,y:0,w:2,h:1});assert.deepEqual(a,b);
    assert.equal(a.data[7],0);assert.equal(a.data[19],128);
  }
});
test('smudge transparent pickup creates no black fringe',()=>{
  const dest={width:3,height:3,data:new Uint8ClampedArray(36)},pickup={width:3,height:3,data:new Uint8ClampedArray(36)};
  for(let i=0;i<36;i+=4){dest.data[i]=255;dest.data[i+3]=255;}
  const before=[...dest.data];C.smudgeDab(dest,pickup,{strength:100,hardness:100});assert.deepEqual([...dest.data],before);
});
test('BMP writes bottom-up 24-bit BGR, row padding and white alpha flattening',()=>{
  const pixels=new Uint8ClampedArray([255,0,0,255, 0,0,255,0]);
  const c={width:1,height:2,getContext:()=>({getImageData:()=>({data:pixels})})};
  const bytes=Buffer.from(C.encodeBMP(c));assert.equal(bytes.toString('ascii',0,2),'BM');assert.equal(bytes.readUInt16LE(28),24);assert.equal(bytes.length,62);
  assert.deepEqual([...bytes.subarray(54)],[255,255,255,0,0,0,255,0]);
});
