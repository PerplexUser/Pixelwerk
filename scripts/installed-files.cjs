'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const escape=value=>value.replaceAll('$','$$').replaceAll('"','$\\"').replaceAll('/','\\');
async function createRemovalManifest(appOutDir, output=path.resolve(__dirname,'../build/installed-files.nsh')){
  const files=[],directories=[];
  async function visit(dir,relative=''){
    for(const entry of (await fs.readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
      const rel=relative?relative+'/'+entry.name:entry.name;
      if(entry.isDirectory()){directories.push(rel);await visit(path.join(dir,entry.name),rel);}
      else if(entry.isFile())files.push(rel);
      else throw new Error('Unexpected non-regular packaged resource');
    }
  }
  await visit(appOutDir);
  const lines=['; Generated from the exact packaged files. Never recursively delete the install directory.','!macro PixelwerkRemoveInstalledFiles','StrCpy $R9 "0"'];
  files.forEach((file,i)=>{
    const name=escape(file);
    lines.push(`IfFileExists "$INSTDIR\\${name}" 0 pw_keep_${i}`, 'ClearErrors', `Delete "$INSTDIR\\${name}"`, 'IfErrors 0 +2', 'StrCpy $R9 "1"',`pw_keep_${i}:`);
  });
  lines.push('${If} $R9 == "1"','  MessageBox MB_ICONSTOP|MB_OK "Programmdateien sind noch belegt. Schließe Pixelwerk und starte das Setup erneut. / Program files are still in use. Close Pixelwerk and run Setup again."','  Abort','${EndIf}', 'Delete "$INSTDIR\\${UNINSTALL_FILENAME}"');
  for(const dir of directories.sort((a,b)=>b.length-a.length))lines.push(`RMDir "$INSTDIR\\${escape(dir)}"`);
  lines.push('RMDir "$INSTDIR"','!macroend','');
  await fs.writeFile(output,lines.join('\n'));
  return files;
}
module.exports={createRemovalManifest};
if(require.main===module)createRemovalManifest(path.resolve(process.argv[2])).catch(error=>{console.error(error);process.exitCode=1;});
