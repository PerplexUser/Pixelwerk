'use strict';
module.exports = {
  appId: 'click.perplex.pixelwerk', productName: 'Pixelwerk',
  copyright: '© by www.perplex.click',
  asar: true, npmRebuild: false,
  afterPack: async context => require('./scripts/installed-files.cjs').createRemovalManifest(context.appOutDir),
  directories: { buildResources: 'build', output: 'dist' },
  files: ['src/**/*', 'build/icon.png', 'package.json', 'LICENSE.txt'],
  extraFiles: [{from:'docs/Benutzerhandbuch-DE-EN.md',to:'Benutzerhandbuch-DE-EN.md'}, {from:'LICENSE.txt',to:'Pixelwerk-LICENSE.txt'}],
  win: { target: [{target:'nsis',arch:['x64']}], icon:'build/icon.ico', requestedExecutionLevel:'asInvoker', signExecutable:false },
  nsis: {
    oneClick:false, perMachine:false, allowElevation:false, allowToChangeInstallationDirectory:true,
    createDesktopShortcut:false, createStartMenuShortcut:true, shortcutName:'Pixelwerk',
    deleteAppDataOnUninstall:false, runAfterFinish:true,
    installerLanguages:['de_DE','en_US'], displayLanguageSelector:true,
    artifactName:'Pixelwerk-${version}-Windows-x64-Setup.exe',
    include:'build/installer.nsh', differentialPackage:false
  },
  toolsets: { nsis:'1.2.1' },
  publish:null
};
