const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const C=require('../../src/main/contracts.cjs');

test('image dimension limits are exact, including the 20 MP boundary',()=>{
  assert.deepEqual(C.dimensions(8192,2441),{width:8192,height:2441});
  for(const pair of [[8192,2442],[8193,1],[0,1],[-1,1],[1.5,1],[NaN,1],[Infinity,1]])assert.throws(()=>C.dimensions(...pair));
});
for(const [file,format] of [['alpha.png','png'],['colors.jpg','jpeg'],['colors.bmp','bmp']])test(`detect ${format} by content and dimensions`,()=>{
  assert.deepEqual(C.detectImage(fs.readFileSync('tests/fixtures/'+file)),{format,width:320,height:240});
});
test('malformed, unsupported and truncated image headers are rejected',()=>{
  for(const bytes of [Buffer.alloc(0),Buffer.from('GIF89a'),Buffer.from([255,216,255,192,0,8,0])])assert.throws(()=>C.detectImage(bytes));
  const png=fs.readFileSync('tests/fixtures/alpha.png');png.writeUInt32BE(30000,16);assert.throws(()=>C.detectImage(png),{code:'TOO_LARGE'});
});
test('IPC objects reject additional fields, arrays, bad MIME/bytes and missing arguments',()=>{
  for(const input of [null,[],{multiple:1},{multiple:true,path:'C:/private'}])assert.throws(()=>C.openInput(input));
  assert.deepEqual(C.openInput({multiple:true}),{multiple:true});
  for(const value of ['abc',[1,2],new Uint8Array(0)])assert.throws(()=>C.bytes(value));
  assert.throws(()=>C.bytes(new Uint8Array(20),19),{code:'TOO_LARGE'});
  assert.throws(()=>C.saveInput({name:'image',format:'jpeg',bytes:fs.readFileSync('tests/fixtures/alpha.png')}));
});
test('Windows filenames sanitize reserved names, punctuation, suffixes and Unicode',()=>{
  assert.equal(C.filename('CON','png'),'_CON.png');
  assert.equal(C.filename('lpt1.txt','jpeg'),'_lpt1.txt.jpg');
  assert.equal(C.filename('COM¹','bmp'),'_COM¹.bmp');
  assert.equal(C.filename(' Urlaub – Grüße.PNG ','png'),'Urlaub – Grüße.png');
  assert.equal(C.filename('../a:b?','bmp'),'.._a_b_.bmp');
  assert.equal(C.filename('... ','png'),'Pixelwerk.png');
  assert.throws(()=>C.filename('a','svg'));
});
test('IPC sender validation rejects foreign windows, child frames and navigation',()=>{
  const mainFrame={url:'file:///app/src/renderer/index.html?lang=en'};
  const webContents={mainFrame};const win={isDestroyed:()=>false,webContents};
  const good={sender:webContents,senderFrame:mainFrame};
  assert.equal(C.trusted(good,win,'file:///app/src/renderer/index.html'),true);
  assert.equal(C.trusted({...good,sender:{}},win,'file:///app/src/renderer/index.html'),false);
  assert.equal(C.trusted({...good,senderFrame:{url:mainFrame.url}},win,'file:///app/src/renderer/index.html'),false);
  mainFrame.url='https://example.com/';assert.equal(C.trusted(good,win,'file:///app/src/renderer/index.html'),false);
});
