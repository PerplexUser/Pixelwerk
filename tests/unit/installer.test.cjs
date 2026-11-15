const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {createRemovalManifest}=require('../../scripts/installed-files.cjs');
test('uninstall manifest deletes only packaged files and keeps unknown exports/directories',async t=>{
  const root=await fs.mkdtemp(path.resolve('tests/fixtures/installer-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));
  const app=path.join(root,'app');await fs.mkdir(path.join(app,'resources'),{recursive:true});
  await fs.writeFile(path.join(app,'Pixelwerk.exe'),'binary');await fs.writeFile(path.join(app,'resources','app.asar'),'code');
  const out=path.join(root,'installed-files.nsh');await createRemovalManifest(app,out);const script=await fs.readFile(out,'utf8');
  assert.ok(script.includes('Delete "$INSTDIR\\Pixelwerk.exe"'));assert.ok(script.includes('Delete "$INSTDIR\\resources\\app.asar"'));
  assert.equal(/RMDir\s+\/r/i.test(script),false);assert.equal(/Delete[^\n]*\*/.test(script),false);assert.equal(script.includes('.png'),false);
});
