'use strict';
// Pure-data extraction of the compiled NSIS uninstaller, using electron-builder's
// own reader (also used by its macOS build path). No Windows executable is run.
// This narrow hook is tied to the exact app-builder-lib version in package-lock.
const fs = require('node:fs/promises');
const path = require('node:path');

function enableNativeUninstallerExtraction() {
  if (process.platform === 'win32') return;
  require('electron-builder'); // initialize its public module before internal classes
  const { NsisTarget } = require('app-builder-lib/out/targets/nsis/NsisTarget');
  const { UninstallerReader, nsisTemplatesDir } = require('app-builder-lib/out/targets/nsis/nsisUtil');
  if (NsisTarget.prototype.pixelwerkReaderEnabled) return;
  NsisTarget.prototype.pixelwerkReaderEnabled = true;
  NsisTarget.prototype.computeScriptAndSignUninstaller = async function(defines, commands, installerPath, sharedHeader, archs) {
    if (this.options.script) throw new Error('The Pixelwerk crossbuild expects the pinned standard NSIS template.');
    const script = await fs.readFile(path.join(nsisTemplatesDir,'installer.nsi'),'utf8');
    const uninstallerPath = path.join(this.outDir,`${path.basename(installerPath,'exe')}__uninstaller.exe`);
    defines.BUILD_UNINSTALLER = null;
    defines.UNINSTALLER_OUT_FILE = path.win32.join('Z:',uninstallerPath);
    await this.executeMakensis(defines,commands,sharedHeader + await this.computeFinalScript(script,false,archs));
    await UninstallerReader.exec(installerPath,uninstallerPath);
    const executable = await fs.readFile(uninstallerPath);
    if (executable.length < 10000 || executable.toString('ascii',0,2) !== 'MZ') throw new Error('Invalid extracted NSIS uninstaller');
    await this.packager.signIf(uninstallerPath);
    delete defines.BUILD_UNINSTALLER;
    defines.UNINSTALLER_OUT_FILE = uninstallerPath;
    return { script, isCustomScript:false };
  };
}
module.exports = { enableNativeUninstallerExtraction };
