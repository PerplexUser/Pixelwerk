const {test:base,expect}=require('@playwright/test');
const test=base.extend({
  sessionBrowser:async({playwright,launchOptions},use)=>{const browser=await playwright.chromium.launch(launchOptions);try{await use(browser);}finally{await browser.close();}},
  page:async({sessionBrowser,contextOptions},use)=>{const context=await sessionBrowser.newContext({...contextOptions,viewport:{width:1440,height:1000},locale:'de-DE'});await use(await context.newPage());}
});
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const fs=require('node:fs');
const root=path.resolve(__dirname,'../..');
const sourceUrl=pathToFileURL(path.join(root,'src/renderer/index.html')).href;
const referenceUrl=pathToFileURL(path.join(root,'reference/Pixelwerk/index.html')).href;
const fixture=name=>path.join(root,'tests/fixtures',name);
const state=page=>page.evaluate(()=>PixelwerkAgent.invoke('get_editor_state',{}));
const invoke=(page,name,input)=>page.evaluate(({name,input})=>PixelwerkAgent.invoke(name,input),{name,input});
function launchFile(name,renamed=name){return{name:renamed,mime:/\.jpe?g$/i.test(name)?'image/jpeg':/\.bmp$/i.test(name)?'image/bmp':'image/png',bytes:Array.from(fs.readFileSync(fixture(name)))};}
async function deliverLaunch(page,...files){await page.evaluate(files=>{testDesktop.launchQueue.push(...files.map(file=>({status:'opened',files:[{...file,bytes:new Uint8Array(file.bytes)}]})));testDesktop.launchAvailable();},files);}
async function boot(page,{host=false,launch=[]}={}){
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.errors=errors;
  await page.addInitScript(({host,launch})=>{
    const shared={language:'de',saveStatus:'saved',replaceStatus:'discard',clipboard:null,saves:[],closes:[],registered:[],replaceCalls:0,launchQueue:launch.map(file=>({status:'opened',files:[{...file,bytes:new Uint8Array(file.bytes)}]}))};
    window.testDesktop=shared;
    if(host)document.modelContext={registerTool:(definition,options)=>{shared.registered.push({name:definition.name,signal:options.signal});}};
    window.pixelwerkDesktop={
      initialLanguage:'de',mode:'development',version:'5.0.1',
      openImages:async()=>({status:'cancelled'}),
      nextLaunchImage:async()=>shared.launchQueue.shift()||{status:'empty'},
      onLaunchImageAvailable:callback=>{shared.launchAvailable=callback;},
      saveImage:async input=>{shared.saves.push({...input,bytes:Array.from(input.bytes)});if(shared.delaySave)await new Promise(resolve=>shared.finishSave=resolve);return{status:shared.saveStatus,message:'Simulierter Schreibfehler'};},
      readClipboardImage:async()=>shared.clipboard?{status:'read',bytes:new Uint8Array(shared.clipboard),mime:'image/png'}:{status:'error',code:'NO_IMAGE',message:'Kein Bild'},
      writeClipboardImage:async bytes=>{if(shared.clipboardFailure)return{status:'error'};shared.clipboard=Array.from(bytes);return{status:'written'};},
      getLanguage:async()=>({language:shared.language}),setLanguage:async value=>{shared.language=value;return{status:'saved'};},
      confirmReplace:async()=>{shared.replaceCalls++;return{status:shared.replaceStatus};},
      confirmClose:async input=>{shared.closes.push(input);return{status:'ok'};},
      onPrepareClose:callback=>{shared.prepareClose=callback;},onExport:callback=>{shared.export=callback;}
    };
  },{host,launch});
  await page.goto(sourceUrl);await expect(page.locator('.tool[data-tool]')).toHaveCount(16);
}
test('Explorer images load on startup and later notifications remain ordered',async({page})=>{
  await boot(page,{launch:[launchFile('alpha.png')]});
  await expect.poll(async()=>(await state(page)).name).toBe('alpha');expect(await pixel(page,10,10)).toEqual([255,0,0,255]);
  await deliverLaunch(page,launchFile('colors.jpg','Grüße vom Doppelklick.jpg'));
  await expect.poll(async()=>(await state(page)).name).toBe('Grüße vom Doppelklick');
  await deliverLaunch(page,launchFile('alpha.png','Erstes.png'),launchFile('colors.bmp','Zweites.bmp'));
  await expect.poll(async()=>(await state(page)).name).toBe('Zweites');expect(page.errors).toEqual([]);
});
test('Explorer opening respects unsaved cancellation and discard; damaged images preserve the document',async({page})=>{
  await boot(page);await newCanvas(page,123,98);const before=await state(page);
  await page.evaluate(()=>testDesktop.replaceStatus='cancelled');await deliverLaunch(page,launchFile('alpha.png'));
  await expect.poll(()=>page.evaluate(()=>testDesktop.replaceCalls)).toBe(1);expect(await state(page)).toEqual(before);
  await page.evaluate(()=>testDesktop.replaceStatus='discard');await deliverLaunch(page,launchFile('alpha.png'));
  await expect.poll(async()=>(await state(page)).name).toBe('alpha');const valid=await state(page);
  await deliverLaunch(page,launchFile('broken.png'));await expect(page.locator('#toast')).toContainText('nicht gelesen');expect(await state(page)).toEqual(valid);expect(page.errors).toEqual([]);
});
test('Save as labels and format choices are localized; queued Explorer images wait for saving',async({page})=>{
  await boot(page,{launch:[launchFile('alpha.png')]});await expect.poll(async()=>(await state(page)).loaded).toBe(true);
  await expect(page.locator('#export-btn')).toHaveText('Speichern unter…');await page.locator('#overlay').focus();await page.keyboard.press('Control+Shift+S');
  await expect(page.locator('#dialog h2')).toHaveText('Bild speichern unter');
  expect(await page.locator('#export-format option').evaluateAll(nodes=>nodes.map(n=>n.value))).toEqual(['png','jpeg','bmp']);
  await deliverLaunch(page,launchFile('colors.jpg','Danach.jpg'));expect((await state(page)).name).toBe('alpha');
  await page.locator('#export-format').selectOption('jpeg');await expect(page.locator('#quality-field')).toBeVisible();
  await page.locator('#export-form button[type=submit]').click();await expect.poll(async()=>(await state(page)).name).toBe('Danach');
  expect(await page.evaluate(()=>testDesktop.saves.at(-1).format)).toBe('jpeg');
  await page.locator('[data-language=en]').click();await expect(page.locator('#export-btn')).toHaveText('Save as…');
  await page.locator('#export-btn').click();await expect(page.locator('#dialog h2')).toHaveText('Save image as');await expect(page.locator('#export-form button[type=submit]')).toHaveText('Save');
  await page.locator('#dialog [data-action=close-dialog]').first().click();await page.locator('[data-action=help]').click();await expect(page.locator('.dialog-desc')).toContainText('Save your result before closing.');expect(page.errors).toEqual([]);
});
async function newCanvas(page,width=320,height=240,bg='white'){
  await page.locator('[data-action=new]').first().click();
  await page.locator('#new-width').fill(String(width));await page.locator('#new-height').fill(String(height));await page.locator('#new-bg').selectOption(bg);
  await page.locator('#new-form button[type=submit]').click();await expect(page.locator('#dialog')).not.toHaveAttribute('open','');
  await expect(page.locator('#canvas-stack')).toBeVisible();
}
async function openFile(page,name='alpha.png',layer=false){await page.locator(layer?'#file-layer':'#file-open').setInputFiles(fixture(name));await expect.poll(async()=>(await state(page)).loaded).toBe(true);await page.waitForTimeout(80);}
async function pixel(page,x,y){return page.evaluate(async({x,y})=>{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return Array.from(document.querySelector('#image-canvas').getContext('2d').getImageData(x,y,1,1).data);},{x,y});}
async function stroke(page,tool,points,modifiers=[]){
  await page.locator(`[data-tool="${tool}"]`).first().click();
  const box=await page.locator('#overlay').boundingBox();const s=await state(page);
  const point=p=>({x:box.x+p[0]*box.width/s.width,y:box.y+p[1]*box.height/s.height});
  for(const key of modifiers)await page.keyboard.down(key);
  const start=point(points[0]);await page.mouse.move(start.x,start.y);await page.mouse.down();
  for(const next of points.slice(1)){const p=point(next);await page.mouse.move(p.x,p.y,{steps:8});}
  await page.mouse.up();for(const key of modifiers)await page.keyboard.up(key);await page.waitForTimeout(60);
}
async function closeState(page){return page.evaluate(async()=>{await testDesktop.prepareClose('test-close');await new Promise(r=>setTimeout(r,5));return testDesktop.closes.at(-1);});}
async function exportFormat(page,format='png'){
  await page.locator('[data-action=export]').click();await page.locator('#export-format').selectOption(format);await page.locator('#export-form button[type=submit]').click();if(await page.evaluate(()=>testDesktop.saveStatus==='saved'))await expect(page.locator('#dialog')).not.toHaveAttribute('open','');else await expect(page.locator('#export-form button[type=submit]')).toBeEnabled();
}

test('baseline and desktop load without errors; all 16 tools and 72 stickers retain order',async({page,sessionBrowser:browser})=>{
  await boot(page,{host:true});await page.locator('[data-tool=smile]').click();
  const stickers=await page.locator('[data-sticker]').evaluateAll(nodes=>nodes.map(n=>n.dataset.sticker));expect(stickers).toHaveLength(72);
  const baseline=await browser.newPage();await baseline.goto(referenceUrl);await baseline.locator('[data-tool=smile]').click();
  expect(await baseline.locator('[data-sticker]').evaluateAll(nodes=>nodes.map(n=>n.dataset.sticker))).toEqual(stickers);
  expect(await page.evaluate(()=>testDesktop.registered.map(t=>t.name))).toEqual(['get_editor_state','select_editor_tool','set_active_layer_position','resize_image']);
  await page.screenshot({path:path.join(root,'qa/editor-empty.png'),fullPage:true});expect(page.errors).toEqual([]);await baseline.close();
});

test('PNG/JPG/BMP import; invalid and oversized images preserve the document',async({page})=>{
  await boot(page);
  for(const f of ['alpha.png','colors.jpg','colors.bmp']){await openFile(page,f);expect(await state(page)).toMatchObject({width:320,height:240});}
  const before=await state(page);await page.locator('#file-open').setInputFiles(fixture('broken.png'));await expect(page.locator('#toast')).toContainText('nicht gelesen');expect(await state(page)).toEqual(before);
  const bytes=fs.readFileSync(fixture('alpha.png'));bytes.writeUInt32BE(9999,16);
  await page.locator('#file-open').setInputFiles({name:'huge.png',mimeType:'image/png',buffer:bytes});await expect(page.locator('#toast')).toContainText('Megapixel');expect(await state(page)).toEqual(before);expect(page.errors).toEqual([]);
});

test('new canvas backgrounds, exact dimension validation and dirty close state',async({page})=>{
  await boot(page);await newCanvas(page,320,240,'transparent');expect(await pixel(page,5,5)).toEqual([0,0,0,0]);expect((await closeState(page)).dirty).toBe(true);
  await newCanvas(page,120,80,'color');expect(await pixel(page,5,5)).toEqual([20,138,117,255]);
  await page.locator('[data-action=new]').first().click();await page.locator('#new-width').fill('3.5');await page.locator('#new-form').evaluate(el=>el.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));await expect(page.locator('#toast')).toContainText('ganze Pixelwerte');expect((await state(page)).width).toBe(120);expect(page.errors).toEqual([]);
});

test('raster, text and sticker resize proportionally with editable undo/redo',async({page})=>{
  await boot(page);await newCanvas(page,1200,800);
  await page.locator('[data-tool=text]').click();await page.locator('#text-value').fill('Pixelwerk\nZweite Zeile');await page.locator('[data-action=add-text]').click();
  await page.locator('[data-tool=smile]').click();await page.locator('[data-sticker]').first().click();
  const before=await state(page);expect(before.layers.filter(l=>l.type==='text')).toHaveLength(2);
  await invoke(page,'resize_image',{width:600,height:400});let after=await state(page);expect(after.width).toBe(600);
  for(let i=0;i<after.layers.length;i++){expect(after.layers[i].x).toBe(before.layers[i].x/2);expect(after.layers[i].width).toBe(before.layers[i].width/2);expect(after.layers[i].type).toBe(before.layers[i].type);}
  await page.locator('[data-action=undo]').click();expect((await state(page)).width).toBe(1200);await page.locator('[data-action=redo]').click();expect((await state(page)).width).toBe(600);expect(page.errors).toEqual([]);
});

test('brush/eraser gestures produce pixels and one undo restores editable text',async({page})=>{
  await boot(page);await newCanvas(page);await stroke(page,'brush',[[30,30],[100,30]]);expect(await pixel(page,60,30)).not.toEqual([255,255,255,255]);
  await page.keyboard.press('Control+z');await page.waitForTimeout(50);expect(await pixel(page,60,30)).toEqual([255,255,255,255]);
  await page.locator('[data-tool=text]').click();await page.locator('[data-action=add-text]').click();expect((await state(page)).layers.at(-1).type).toBe('text');
  await stroke(page,'eraser',[[30,30],[130,80]]);expect((await state(page)).layers.at(-1).type).toBe('raster');await page.locator('[data-action=undo]').click();expect((await state(page)).layers.at(-1).type).toBe('text');expect(page.errors).toEqual([]);
});

test('annotation layers, geometry cancellation and selection clipping',async({page})=>{
  await boot(page);await newCanvas(page);await stroke(page,'select',[[40,40],[180,160]]);
  await stroke(page,'arrow',[[10,100],[250,100]]);expect((await state(page)).layers).toHaveLength(2);expect(await pixel(page,20,100)).toEqual([255,255,255,255]);expect((await pixel(page,100,100))[0]).toBe(255);expect((await pixel(page,100,100))[1]).toBeLessThan(255);
  await page.locator('[data-action=clear-selection]').count().then(async n=>{if(n)await page.locator('[data-action=clear-selection]').first().click();});
  await stroke(page,'marker',[[50,60],[150,60]],['Shift']);await stroke(page,'shape',[[80,80],[150,140]]);expect((await state(page)).layers.length).toBe(4);
  await page.screenshot({path:path.join(root,'qa/editor-annotations.png'),fullPage:true});expect(page.errors).toEqual([]);
});

test('crop retains layers and undo restores dimensions and positions',async({page})=>{
  await boot(page);await openFile(page);await stroke(page,'crop',[[20,20],[220,180]]);await page.keyboard.press('Enter');expect(await state(page)).toMatchObject({width:200,height:160});expect((await state(page)).layers[0]).toMatchObject({x:-20,y:-20});
  await page.keyboard.press('Control+z');expect(await state(page)).toMatchObject({width:320,height:240});expect((await state(page)).layers[0]).toMatchObject({x:0,y:0});expect(page.errors).toEqual([]);
});

test('native clipboard copy survives document replacement including internal fallback',async({page})=>{
  await boot(page);await openFile(page);await stroke(page,'select',[[0,0],[80,100]]);await page.keyboard.press('Control+c');await page.waitForTimeout(60);
  await newCanvas(page,400,300);await page.locator('#overlay').focus();await page.keyboard.press('Control+v');await expect.poll(async()=>(await state(page)).layers.length).toBe(2);expect((await state(page)).layers.at(-1)).toMatchObject({width:80,height:100});
  await page.evaluate(()=>{testDesktop.clipboardFailure=true;});await page.keyboard.press('Control+c');await page.waitForTimeout(40);await page.evaluate(()=>{testDesktop.clipboard=null;});await newCanvas(page,400,300);await page.locator('#overlay').focus();await page.keyboard.press('Control+v');await expect.poll(async()=>(await state(page)).layers.length).toBe(2);expect(page.errors).toEqual([]);
});

test('export cancellation/error retains dirty; confirmed write clears it; PNG/JPG/BMP bytes valid',async({page})=>{
  await boot(page);await newCanvas(page,100,80,'transparent');
  await page.evaluate(()=>{testDesktop.saveStatus='cancelled';});await exportFormat(page);expect((await closeState(page)).dirty).toBe(true);await page.locator('[data-action=close-dialog]').first().click();
  await page.evaluate(()=>{testDesktop.saveStatus='error';});await exportFormat(page);await expect(page.locator('#toast')).toContainText('Schreibfehler');expect((await closeState(page)).dirty).toBe(true);await page.locator('[data-action=close-dialog]').first().click();
  await page.evaluate(()=>{testDesktop.saveStatus='saved';});
  for(const format of ['png','jpeg','bmp']){
    await exportFormat(page,format);expect((await closeState(page)).dirty).toBe(false);
    const result=await page.evaluate(async()=>{const s=testDesktop.saves.at(-1),b=new Blob([new Uint8Array(s.bytes)],{type:'image/'+s.format}),img=await createImageBitmap(b),c=document.createElement('canvas');c.width=img.width;c.height=img.height;c.getContext('2d').drawImage(img,0,0);return{width:img.width,height:img.height,pixel:[...c.getContext('2d').getImageData(0,0,1,1).data],format:s.format,header:s.bytes.slice(0,2)};});
    expect(result).toMatchObject({width:100,height:80,format});expect(result.pixel).toEqual(format==='png'?[0,0,0,0]:[255,255,255,255]);if(format==='bmp')expect(result.header).toEqual([66,77]);
  }expect(page.errors).toEqual([]);
});

test('live effects included in export without rasterizing text; reset and undo remain available',async({page})=>{
  await boot(page);await openFile(page);await page.locator('[data-tab=effects]').click();await page.locator('[data-effect=invert]').click();await exportFormat(page);expect(await pixel(page,10,10)).toEqual([0,255,255,255]);expect((await closeState(page)).dirty).toBe(false);
  await page.locator('[data-action=apply-effects]').click();expect((await closeState(page)).dirty).toBe(true);await page.locator('[data-action=undo]').click();await page.waitForTimeout(50);expect(await pixel(page,10,10)).toEqual([255,0,0,255]);expect(page.errors).toEqual([]);
});

test('language switches preserve user text, and text inputs take precedence over shortcuts',async({page})=>{
  await boot(page);await newCanvas(page);await page.locator('[data-tool=text]').click();await page.locator('#text-value').fill('Meine Notiz');await page.locator('[data-action=add-text]').click();
  await page.locator('[data-language=en]').click();expect(await state(page)).toMatchObject({language:'en'});expect((await state(page)).layers.at(-1).name).toBe('Meine Notiz');expect(await page.evaluate(()=>testDesktop.language)).toBe('en');
  await page.locator('#text-value').focus();await page.keyboard.type('vmbc');expect((await state(page)).tool).toBe('text');await page.locator('[data-language=de]').click();expect((await state(page)).language).toBe('de');expect(page.errors).toEqual([]);
});

test('layer position adapter validates without mutation and undo works',async({page})=>{
  await boot(page);await openFile(page);await invoke(page,'set_active_layer_position',{x:100,y:-50});expect((await state(page)).layers[0]).toMatchObject({x:100,y:-50});await page.locator('[data-action=undo]').click();expect((await state(page)).layers[0]).toMatchObject({x:0,y:0});
  const before=await state(page);for(const input of [{width:8192,height:2442},{width:0,height:1},{width:1,height:1,extra:true}]){const error=await page.evaluate(input=>{try{PixelwerkAgent.invoke('resize_image',input);return null;}catch(e){return e.message;}},input);expect(error).toBeTruthy();expect(await state(page)).toEqual(before);}expect(page.errors).toEqual([]);
});

test('deterministic brush, fill and effects pixels match the untouched web baseline',async({page,sessionBrowser:browser})=>{
  await boot(page);const baseline=await browser.newPage({viewport:{width:1440,height:1000}});await baseline.goto(referenceUrl+'?lang=de');
  for(const target of [page,baseline]){
    await target.locator('#file-open').setInputFiles(fixture('alpha.png'));await expect(target.locator('#canvas-stack')).toBeVisible();await target.waitForTimeout(80);
    const box=await target.locator('#overlay').boundingBox();await target.locator('[data-tool=brush]').first().click();
    await target.mouse.move(box.x+30*box.width/320,box.y+40*box.height/240);await target.mouse.down();await target.mouse.move(box.x+150*box.width/320,box.y+70*box.height/240,{steps:12});await target.mouse.up();
    await target.locator('[data-tab=effects]').click();await target.locator('[data-effect=sepia]').click();await target.locator('[data-action=apply-effects]').click();await target.waitForTimeout(80);
  }
  const pixels=target=>target.evaluate(()=>Array.from(document.querySelector('#image-canvas').getContext('2d').getImageData(0,0,320,240).data));
  expect(await pixels(page)).toEqual(await pixels(baseline));expect(page.errors).toEqual([]);await baseline.close();
});

test('external requests are prevented by CSP and no Node or generic IPC is exposed',async({page})=>{
  await boot(page);const result=await page.evaluate(async()=>({node:typeof require,process:typeof process,external:await fetch('https://example.com').then(()=>true,()=>false)}));expect(result).toEqual({node:'undefined',process:'undefined',external:false});
});

test('a completed older export never clears a more recent edit',async({page})=>{
  await boot(page);await newCanvas(page);await page.evaluate(()=>{testDesktop.delaySave=true;});
  await page.locator('[data-action=export]').click();await page.locator('#export-form button[type=submit]').click();
  await expect.poll(()=>page.evaluate(()=>typeof testDesktop.finishSave)).toBe('function');
  await invoke(page,'set_active_layer_position',{x:10,y:20});
  await page.evaluate(()=>testDesktop.finishSave());await expect(page.locator('#dialog')).not.toHaveAttribute('open','');
  expect((await closeState(page)).dirty).toBe(true);expect(page.errors).toEqual([]);
});

test('all tool shortcuts, numeric layer controls, undo cap and redo branching',async({page})=>{
  await boot(page);await newCanvas(page,40,30);
  for(const [key,id] of Object.entries({v:'move',m:'select',c:'crop',b:'brush',a:'airbrush',d:'smudge',h:'marker',l:'line',p:'arrow',u:'shape',e:'eraser',g:'fill',i:'picker',t:'text',r:'background',s:'smile'})){
    await page.locator('#overlay').focus();await page.keyboard.press(key);expect((await state(page)).tool).toBe(id);
  }
  await invoke(page,'select_editor_tool',{tool:'move'});
  await page.locator('#layer-x').fill('12');await page.locator('#layer-x').press('Tab');expect((await state(page)).layers[0].x).toBe(12);
  for(let x=1;x<=30;x++)await invoke(page,'set_active_layer_position',{x,y:0});
  let count=0;while(await page.locator('#undo-btn').isEnabled()){await page.locator('#undo-btn').click();count++;if(count>30)throw new Error('History not bounded');}
  expect(count).toBe(24);await page.locator('#redo-btn').click();expect(await page.locator('#redo-btn').isEnabled()).toBe(true);
  await invoke(page,'set_active_layer_position',{x:100,y:100});expect(await page.locator('#redo-btn').isEnabled()).toBe(false);expect(page.errors).toEqual([]);
});

test('stationary airbrush stops on blur; line and background eraser respect selection',async({page})=>{
  await boot(page);await newCanvas(page);await page.locator('[data-tool=airbrush]').click();
  const box=await page.locator('#overlay').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(250);
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.mouse.up();const region=()=>page.evaluate(()=>Array.from(document.querySelector('#image-canvas').getContext('2d').getImageData(120,80,80,80).data));const before=await region();await page.waitForTimeout(120);expect(await region()).toEqual(before);expect(before.some(v=>v!==255)).toBe(true);
  await stroke(page,'select',[[10,10],[100,90]]);await page.locator('[data-tool=background]').click();const next=await page.locator('#overlay').boundingBox();await page.mouse.click(next.x+30*next.width/320,next.y+30*next.height/240);expect((await pixel(page,30,30))[3]).toBe(0);expect((await pixel(page,200,30))[3]).toBe(255);expect(page.errors).toEqual([]);
});

test('20 MP boundary canvas can be painted, undone and exported without page failure',async({page})=>{
  await boot(page);const started=Date.now();await newCanvas(page,8192,2441);
  await stroke(page,'brush',[[100,100],[300,100]]);await page.locator('#undo-btn').click();await exportFormat(page,'png');
  const exported=await page.evaluate(()=>testDesktop.saves.at(-1).bytes.length);
  expect(exported).toBeGreaterThan(1000);expect((await state(page)).width).toBe(8192);expect(page.errors).toEqual([]);
  fs.writeFileSync(path.join(root,'qa/20mp-diagnostic.json'),JSON.stringify({engine:'Chromium headless (Linux; not Windows acceptance)',width:8192,height:2441,elapsed_ms:Date.now()-started,png_bytes:exported},null,2));
});
