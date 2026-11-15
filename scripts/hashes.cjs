'use strict';
const fs=require('node:fs/promises');
const {createHash}=require('node:crypto');
async function hashes(){
  const files=(await fs.readdir('dist')).filter(f=>/\.(zip|exe)$/.test(f)).sort();
  const rows=[];
  for(const file of files){const buffer=await fs.readFile('dist/'+file);rows.push(`${createHash('sha256').update(buffer).digest('hex')}  ${file}`);}
  await fs.writeFile('dist/SHA256SUMS.txt',rows.join('\n')+'\n');
  console.log(rows.join('\n'));
}
module.exports={hashes};
if(require.main===module)hashes().catch(error=>{console.error(error);process.exitCode=1;});
