const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const fsp=require('node:fs/promises');
const path=require('node:path');
const vm=require('node:vm');
const {EventEmitter}=require('node:events');
const {createRequire}=require('node:module');
const {pathToFileURL}=require('node:url');

async function desktop(t,options={}){
  const temporary=await fsp.mkdtemp(path.resolve('tests/fixtures/main-'));
  t.after(()=>fsp.rm(temporary,{recursive:true,force:true}));
  const handlers=new Map(),paths={},order=[],messages=[],dialogs={open:{canceled:true},save:{canceled:true},response:0};
  let win,clipboardData=null;
  class Window extends EventEmitter{
    constructor(options){super();win=this;this.options=options;this.destroyed=false;
      this.webContents=new EventEmitter();this.webContents.mainFrame={url:pathToFileURL(path.resolve('src/renderer/index.html')).href};
      this.webContents.setWindowOpenHandler=fn=>{this.openHandler=fn;};this.webContents.send=(channel,value)=>messages.push({channel,value});
    }
    loadFile(){return Promise.resolve();}isDestroyed(){return this.destroyed;}show(){}focus(){}isMinimized(){return false;}
    close(){const event={preventDefault(){this.prevented=true;}};this.emit('close',event);if(!event.prevented){this.destroyed=true;this.emit('closed');}}
  }
  const app=new EventEmitter();Object.assign(app,{isPackaged:false,getAppPath:()=>temporary,getPath:name=>paths[name]||temporary,setPath:(name,value)=>{paths[name]=value;order.push(name);},commandLine:{appendSwitch:()=>{}},getVersion:()=>require('../../package.json').version,requestSingleInstanceLock:()=>true,setAppUserModelId:()=>{},whenReady:()=>{order.push('ready');return Promise.resolve();},quit:()=>{},exit:()=>{throw new Error('startup failed');}});
  const nativeImage={createFromBuffer:buffer=>({isEmpty:()=>!buffer?.length,getSize:()=>({width:320,height:240}),toPNG:()=>buffer})};
  const localSession={setPermissionRequestHandler:fn=>{localSession.permission=fn;},setPermissionCheckHandler:fn=>{localSession.check=fn;},on:()=>{},webRequest:{onBeforeRequest:fn=>{localSession.network=fn;}}};
  const electron={app,BrowserWindow:Window,Menu:{setApplicationMenu:()=>{}},dialog:{showOpenDialog:async()=>dialogs.open,showSaveDialog:async()=>dialogs.save,showMessageBox:async()=>({response:dialogs.response}),showErrorBox:()=>{}},ipcMain:{handle:(name,handler)=>handlers.set(name,handler)},nativeImage,clipboard:{readImage:()=>nativeImage.createFromBuffer(clipboardData),writeImage:image=>{clipboardData=image.toPNG();}},session:{fromPartition:()=>localSession}};
  const mainPath=path.resolve('src/main/main.cjs'),realRequire=createRequire(mainPath);
  const testProcess={...process,argv:options.argv||[process.execPath,mainPath],cwd:()=>options.cwd||process.cwd()};
  vm.runInNewContext(fs.readFileSync(mainPath,'utf8'),{require:name=>name==='electron'?electron:realRequire(name),__dirname:path.dirname(mainPath),process:testProcess,setTimeout,clearTimeout,console,URL,Uint8Array,ArrayBuffer,Buffer});
  options.beforeReady?.(app);
  await new Promise(r=>setImmediate(r));
  const event={sender:win.webContents,senderFrame:win.webContents.mainFrame};
  const invoke=(name,input={})=>handlers.get(name)(event,input);
  t.after(()=>{win.destroyed=true;win.emit('closed');});
  return{app,win,invoke,handlers,event,paths,order,messages,dialogs,localSession,temporary};
}
test('cold launch retains its image until the renderer is ready and exposes no filesystem path',async t=>{
  const d=await desktop(t,{argv:['electron','main.cjs',path.resolve('tests/fixtures/alpha.png')]});
  const result=await d.invoke('pw:launch:next');assert.equal(result.status,'opened');assert.equal(result.files[0].name,'alpha.png');assert.equal('path' in result.files[0],false);
  assert.ok(Buffer.from(result.files[0].bytes).equals(fs.readFileSync('tests/fixtures/alpha.png')));
  assert.equal((await d.invoke('pw:launch:next')).status,'empty');
  assert.equal((await d.invoke('pw:launch:next',{path:'/etc/passwd'})).code,'INVALID_INPUT');
  assert.equal((await d.handlers.get('pw:launch:next')({...d.event,senderFrame:{url:d.event.senderFrame.url}},{})).code,'INVALID_INPUT');
});
test('second instance queues Unicode/space filenames, survives bad images and also works before window creation',async t=>{
  const cwd=path.resolve('tests/fixtures');
  const d=await desktop(t,{beforeReady:app=>app.emit('second-instance',{},['electron','main.cjs','broken.png','colors.jpg'],cwd)});
  assert.equal((await d.invoke('pw:launch:next')).status,'error');
  assert.equal((await d.invoke('pw:launch:next')).files[0].name,'colors.jpg');
  const file=path.join(d.temporary,'Grüße mit Leerzeichen.PNG');await fsp.copyFile(path.join(cwd,'alpha.png'),file);
  d.app.emit('second-instance',{},['electron','main.cjs',path.basename(file)],d.temporary);
  assert.equal(d.messages.at(-1).channel,'pw:launch-available');
  assert.equal((await d.invoke('pw:launch:next')).files[0].name,path.basename(file));
  assert.equal((await d.invoke('pw:launch:next')).status,'empty');
});
test('secure BrowserWindow, local-only network policy and profile initialization before ready',async t=>{
  const d=await desktop(t);assert.ok(d.order.indexOf('userData')<d.order.indexOf('ready'));
  const prefs=d.win.options.webPreferences;assert.equal(prefs.contextIsolation,true);assert.equal(prefs.sandbox,true);assert.equal(prefs.nodeIntegration,false);assert.equal(prefs.webSecurity,true);
  assert.equal(d.win.openHandler().action,'deny');assert.equal(d.localSession.check(),false);
  let prevented=false;d.win.webContents.emit('before-input-event',{preventDefault:()=>{prevented=true;}},{key:'F5'});assert.equal(prevented,true);
  for(const url of ['https://example.com','http://127.0.0.1:9999','file:///etc/passwd']){let blocked;d.localSession.network({url},result=>blocked=result.cancel);assert.equal(blocked,true);}
});
test('native file contracts return only chosen image bytes and reject foreign IPC',async t=>{
  const d=await desktop(t);d.dialogs.open={canceled:false,filePaths:[path.resolve('tests/fixtures/alpha.png')]};
  const result=await d.invoke('pw:open',{multiple:false});assert.equal(result.status,'opened');assert.equal(result.files[0].name,'alpha.png');assert.equal('path' in result.files[0],false);
  const rejected=await d.handlers.get('pw:open')({...d.event,senderFrame:{url:d.event.senderFrame.url}},{multiple:false});assert.equal(rejected.code,'INVALID_INPUT');
  d.dialogs.open={canceled:true};assert.equal((await d.invoke('pw:open',{multiple:false})).status,'cancelled');
});
test('multiple native imports stream selected files and cannot read invented paths',async t=>{
  const d=await desktop(t);d.dialogs.open={canceled:false,filePaths:['alpha.png','broken.png','colors.bmp'].map(name=>path.resolve('tests/fixtures',name))};
  let result=await d.invoke('pw:open',{multiple:true});assert.equal(result.files.length,1);assert.ok(result.batchId);
  assert.equal((await d.invoke('pw:open:next',{batchId:'forged'})).code,'INVALID_INPUT');
  result=await d.invoke('pw:open:next',{batchId:result.batchId});assert.equal(result.status,'error');assert.ok(result.batchId);
  result=await d.invoke('pw:open:next',{batchId:result.batchId});assert.equal(result.files[0].name,'colors.bmp');assert.equal(result.batchId,null);
});
test('native save confirms disk content only after completion; cancellation and errors are explicit',async t=>{
  const d=await desktop(t);const data=fs.readFileSync('tests/fixtures/alpha.png'),input={name:'CON',format:'png',bytes:data};
  assert.equal((await d.invoke('pw:save',input)).status,'cancelled');
  const output=path.join(d.temporary,'Grüße mit Leerzeichen.png');d.dialogs.save={canceled:false,filePath:output};
  const result=await d.invoke('pw:save',input);assert.equal(result.status,'saved');assert.ok(fs.readFileSync(output).equals(data));
  d.dialogs.save={canceled:false,filePath:path.join(d.temporary,'missing','image.png')};assert.equal((await d.invoke('pw:save',input)).code,'IO_ERROR');
  d.dialogs.save={canceled:false,filePath:path.join(d.temporary,'image.exe')};assert.equal((await d.invoke('pw:save',input)).code,'INVALID_INPUT');
});
test('system clipboard bridge round trips PNG and handles empty clipboard',async t=>{
  const d=await desktop(t);assert.equal((await d.invoke('pw:clipboard:read')).code,'NO_IMAGE');
  const bytes=fs.readFileSync('tests/fixtures/alpha.png');assert.equal((await d.invoke('pw:clipboard:write',{bytes})).status,'written');assert.deepEqual(Buffer.from((await d.invoke('pw:clipboard:read')).bytes),bytes);
});
test('close handshake permits cancel/export/discard and validates request tokens',async t=>{
  const d=await desktop(t);
  d.win.close();let request=d.messages.at(-1);assert.equal(request.channel,'pw:prepare-close');assert.equal(d.win.destroyed,false);
  assert.equal((await d.invoke('pw:close:response',{requestId:'forged',dirty:false})).code,'INVALID_INPUT');
  d.dialogs.response=0;await d.invoke('pw:close:response',{requestId:request.value,dirty:true});assert.equal(d.win.destroyed,false);
  d.win.close();request=d.messages.at(-1);d.dialogs.response=1;await d.invoke('pw:close:response',{requestId:request.value,dirty:true});assert.equal(d.messages.at(-1).channel,'pw:export');assert.equal(d.win.destroyed,false);
  d.win.close();request=d.messages.at(-1);d.dialogs.response=2;await d.invoke('pw:close:response',{requestId:request.value,dirty:true});assert.equal(d.win.destroyed,true);
});
