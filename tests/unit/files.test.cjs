const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {atomicWrite,readImage}=require('../../src/main/files.cjs');
const {initializeProfile,profilePath}=require('../../src/main/profile.cjs');
async function temporary(t){const dir=await fs.mkdtemp(path.resolve('tests/fixtures/run-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));return dir;}
test('atomic write replaces only after successful write and cleans temporary files',async t=>{
  const dir=await temporary(t),dest=path.join(dir,'Grüße mit Leerzeichen.png');
  await fs.writeFile(dest,'old');await atomicWrite(dest,Buffer.from('new'));
  assert.equal(await fs.readFile(dest,'utf8'),'new');assert.deepEqual(await fs.readdir(dir),[path.basename(dest)]);
});
test('rename failure preserves original file and removes temporary output',async t=>{
  const dir=await temporary(t),dest=path.join(dir,'image.png');await fs.writeFile(dest,'original');
  await assert.rejects(atomicWrite(dest,Buffer.from('replacement'),{...fs,rename:async()=>{throw Object.assign(new Error(),{code:'EACCES'});}}));
  assert.equal(await fs.readFile(dest,'utf8'),'original');assert.deepEqual(await fs.readdir(dir),['image.png']);
});
test('disk full during write does not destroy existing destination',async t=>{
  const dir=await temporary(t),dest=path.join(dir,'image.png');await fs.writeFile(dest,'original');
  const io={...fs,open:async(...args)=>{const handle=await fs.open(...args);return{writeFile:async()=>{throw Object.assign(new Error(),{code:'ENOSPC'});},close:()=>handle.close()};}};
  await assert.rejects(atomicWrite(dest,Buffer.from('new'),io));assert.equal(await fs.readFile(dest,'utf8'),'original');assert.deepEqual(await fs.readdir(dir),['image.png']);
});
test('native import rejects >80 MiB before allocation and preserves basename privacy',async t=>{
  const dir=await temporary(t),dest=path.join(dir,'huge.png');await fs.writeFile(dest,'');await fs.truncate(dest,80*1024*1024+1);
  await assert.rejects(readImage(dest),{code:'TOO_LARGE'});
  const image=await readImage(path.resolve('tests/fixtures/alpha.png'));assert.equal(image.name,'alpha.png');assert.equal(image.mime,'image/png');assert.equal('path' in image,false);
});
test('portable and installed profiles remain separate and mode is explicit',()=>{
  assert.equal(profilePath({mode:'portable',executable:'/usb/Pixelwerk/Pixelwerk.exe'}),'/usb/Pixelwerk/data');
  assert.equal(profilePath({mode:'installed',localAppData:'/users/u/Local'}),'/users/u/Local/Pixelwerk');
  assert.throws(()=>profilePath({mode:'unknown'}));
});
test('language persists, serializes concurrent writes, and malformed preferences recover',async t=>{
  const dir=await temporary(t);let profile=initializeProfile(dir,'de');
  await Promise.all([profile.setLanguage('en'),profile.setLanguage('de'),profile.setLanguage('en')]);
  profile=initializeProfile(dir,'de');assert.equal(profile.getLanguage(),'en');assert.equal(profile.warning,false);
  await fs.writeFile(path.join(dir,'settings.json'),'bad json');profile=initializeProfile(dir,'de');assert.equal(profile.getLanguage(),'de');assert.equal(profile.warning,true);
  assert.throws(()=>profile.setLanguage('fr'));
});
