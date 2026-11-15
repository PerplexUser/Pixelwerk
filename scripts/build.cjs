'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const { build, Platform, Arch } = require('electron-builder');
const { spawn } = require('node:child_process');
const base = require('../electron-builder.cjs');
const { version } = require('../package.json');
require('./nsis-crossbuild.cjs').enableNativeUninstallerExtraction();

async function main() {
  const requested = process.argv[2] || 'all';
  if (!['all','portable','setup'].includes(requested)) throw new Error('Use portable, setup or all');
  const root = path.resolve(__dirname,'..'); process.chdir(root);
  await fs.mkdir('dist',{recursive:true}); await fs.mkdir('.build-mode',{recursive:true});
  // electron-builder mutates its loaded configuration. Keep different modes in
  // separate processes so a cached extraResources entry cannot leak between them.
  if(requested==='all') {
    for(const kind of ['portable','setup'])await new Promise((resolve,reject)=>{
      const child=spawn(process.execPath,[__filename,kind],{cwd:root,stdio:'inherit',env:process.env});
      child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`${kind} build: ${code}`)));
    });
    await require('./hashes.cjs').hashes();return;
  }
  // Explicit packaged-mode manifest, never infer mode from an arbitrary executable path.
  for (const kind of [requested]) {
    const mode = kind === 'portable' ? 'portable' : 'installed';
    const marker = path.resolve('.build-mode',`${kind}.json`);
    await fs.writeFile(marker,JSON.stringify({mode,version})+'\n');
    const output = path.resolve('dist',kind);
    const config = {...base,directories:{...base.directories,output},extraResources:[{from:marker,to:'build-mode.json'}]};
    await build({projectDir:root,targets:Platform.WINDOWS.createTarget(kind==='portable'?'dir':'nsis',Arch.x64),config,publish:'never'});
    const actualMode=JSON.parse(await fs.readFile(path.join(output,'win-unpacked','resources','build-mode.json'),'utf8'));
    if(actualMode.mode!==mode||actualMode.version!==version||Object.keys(actualMode).length!==2)throw new Error(`Packaged mode/version mismatch for ${kind}`);
    if(kind==='portable') {
      const staging=output;
      const folder=path.join(staging,'Pixelwerk');await fs.rm(folder,{recursive:true,force:true});
      await fs.rename(path.join(output,'win-unpacked'),folder);
      const destination=path.resolve('dist',`Pixelwerk-${version}-Windows-x64-Portable.zip`);
      await fs.rm(destination,{force:true});
      // Use the builder's pinned, bundled 7-Zip on Windows and Linux.
      const sevenZip=require('7zip-bin').path7za;
      if(process.platform!=='win32')await fs.chmod(sevenZip,0o755);
      await new Promise((resolve,reject)=>{
        const child=spawn(sevenZip,['a','-tzip','-mx=5',destination,'Pixelwerk'],{cwd:staging,stdio:'inherit'});
        child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`7-Zip: ${code}`)));
      });
    } else {
      await fs.copyFile(path.join(output,`Pixelwerk-${version}-Windows-x64-Setup.exe`),path.resolve('dist',`Pixelwerk-${version}-Windows-x64-Setup.exe`));
    }
  }
  await require('./hashes.cjs').hashes();
}
main().catch(error=>{console.error(error);process.exit(1);});
