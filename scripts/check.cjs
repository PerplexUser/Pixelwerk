'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {createHash}=require('node:crypto');
let count=0;
function visit(folder){for(const file of fs.readdirSync(folder,{withFileTypes:true})){const target=path.join(folder,file.name);if(file.isDirectory())visit(target);else if(/\.(c?js)$/.test(file.name)){const result=spawnSync(process.execPath,['--check',target],{encoding:'utf8'});if(result.status)throw new Error(result.stderr);count++;}}}
for(const folder of ['src','scripts','tests'])visit(folder);
const hash=createHash('sha256').update(fs.readFileSync('reference/Pixelwerk-v5.zip')).digest('hex');
if(hash!=='36e9b69713b49b1e986cf2b80d84743d7984bde24238573f059b7c06a0f27c5e')throw new Error('Reference archive changed');
for(const file of ['core.js','style.css'])if(!fs.readFileSync('reference/Pixelwerk/'+file).equals(fs.readFileSync('src/renderer/'+file)))throw new Error(file+' differs from baseline');
console.log(`${count} JavaScript files checked; reference SHA-256 and unchanged core/CSS verified.`);
