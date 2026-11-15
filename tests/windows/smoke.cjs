'use strict';
// Run on Windows after extracting/installing the actual release. This is NOT
// counted as passed by Linux browser or mocked-IPC tests.
const { _electron } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const {spawn,execFileSync}=require('node:child_process');
const version=require('../../package.json').version;

async function main(){
  if(process.platform!=='win32')throw new Error('This acceptance smoke test must run on Windows.');
  const executable=process.argv[2];if(!executable)throw new Error('Usage: node tests/windows/smoke.cjs C:\\...\\Pixelwerk.exe');
  const out=await fs.mkdtemp(path.join(os.tmpdir(),'Pixelwerk-Windows-QA-'));
  const startup=path.join(out,'Grüße beim Start.png'),second=path.join(out,'Weiteres Bild.jpg');
  await fs.copyFile(path.resolve(__dirname,'../fixtures/alpha.png'),startup);
  await fs.copyFile(path.resolve(__dirname,'../fixtures/colors.jpg'),second);
  const application=await _electron.launch({executablePath:path.resolve(executable),args:[startup],timeout:30000});
  try{
    const window=await application.firstWindow();await window.waitForSelector('#app .topbar');
    assert.equal(await window.locator('.tool[data-tool]').count(),16);
    const bridge=await window.evaluate(()=>({version:pixelwerkDesktop.version,mode:pixelwerkDesktop.mode,node:typeof require,tools:PixelwerkAgent.list().length}));
    assert.equal(bridge.version,version);assert.equal(bridge.node,'undefined');assert.equal(bridge.tools,4);
    await window.waitForFunction(()=>PixelwerkAgent.invoke('get_editor_state',{}).name==='Grüße beim Start');
    const initial=await window.evaluate(()=>PixelwerkAgent.invoke('get_editor_state',{}));
    assert.equal(initial.loaded,true,'Close other Pixelwerk instances before running this test.');
    await new Promise((resolve,reject)=>{const child=spawn(path.resolve(executable),[second],{stdio:'ignore'});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error('Second launch exited '+code)));});
    await window.waitForFunction(()=>PixelwerkAgent.invoke('get_editor_state',{}).name==='Weiteres Bild');
    if(bridge.mode==='installed'){
      const key='HKCU\\Software\\Pixelwerk\\Capabilities\\FileAssociations';
      const registrations=execFileSync('reg.exe',['query',key],{encoding:'utf8'});
      for(const ext of ['.png','.jpg','.jpeg','.bmp'])assert.ok(registrations.includes(ext),'Missing registration: '+ext);
      const command=execFileSync('reg.exe',['query','HKCU\\Software\\Classes\\Pixelwerk.Image\\shell\\open\\command','/ve'],{encoding:'utf8'});
      assert.ok(command.includes('"'+path.resolve(executable)+'" "%1"'));
    }
    const fixture=Array.from(await fs.readFile(path.resolve(__dirname,'../fixtures/alpha.png')));
    await application.evaluate(({clipboard,nativeImage},bytes)=>clipboard.writeImage(nativeImage.createFromBuffer(Buffer.from(bytes))),fixture);
    await window.locator('[data-tool=move]').click();await window.locator('[data-action=paste]').click();
    await window.waitForFunction(()=>PixelwerkAgent.invoke('get_editor_state',{}).loaded);
    assert.equal((await window.evaluate(()=>PixelwerkAgent.invoke('get_editor_state',{}))).width,320);
    const saved=path.join(out,'Grüße mit Leerzeichen.png');
    // Only file chooser automation is substituted. Native PNG transfer, disk I/O,
    // clipboard, main/preload boundary and close handshake remain real Electron.
    await application.evaluate(({dialog},file)=>{dialog.showSaveDialog=async()=>({canceled:false,filePath:file});},saved);
    await window.locator('[data-action=export]').click();await window.locator('#export-form button[type=submit]').click();
    await window.waitForFunction(()=>!document.querySelector('#dialog').open);
    const buffer=await fs.readFile(saved);assert.deepEqual([...buffer.subarray(0,8)],[137,80,78,71,13,10,26,10]);
    await window.screenshot({path:path.join(out,'windows-editor.png')});
    const runtime=await application.evaluate(()=>process.versions);
    await fs.writeFile(path.join(out,'result.json'),JSON.stringify({status:'passed',platform:process.platform,os:os.release(),arch:os.arch(),executable,bridge,runtime,launchAndSecondInstance:true,registrationChecked:bridge.mode==='installed',windowsDefaultChoiceChecked:false,exportBytes:buffer.length},null,2));
    await application.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].close());
    console.log(`Windows smoke passed. Evidence: ${out}`);
  }finally{await application.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
