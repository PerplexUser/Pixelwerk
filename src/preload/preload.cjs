'use strict';
const { contextBridge, ipcRenderer } = require('electron');

// Sandboxed preload: no Buffer, filesystem, shell, generic IPC or eval exposed.
const argument = (name, fallback) => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3) || fallback;
const subscribe = (channel, callback) => {
  if (typeof callback !== 'function') throw new TypeError('Expected function');
  const listener = (_event, value) => callback(value);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
};
contextBridge.exposeInMainWorld('pixelwerkDesktop', Object.freeze({
  initialLanguage: argument('pixelwerk-language', 'de'),
  mode: argument('pixelwerk-mode', 'development'), version: argument('pixelwerk-version', '5.0.1'),
  openImages: input => ipcRenderer.invoke('pw:open', input),
  nextImage: batchId => ipcRenderer.invoke('pw:open:next', { batchId }),
  nextLaunchImage: () => ipcRenderer.invoke('pw:launch:next', {}),
  onLaunchImageAvailable: callback => subscribe('pw:launch-available', callback),
  saveImage: input => ipcRenderer.invoke('pw:save', input),
  readClipboardImage: () => ipcRenderer.invoke('pw:clipboard:read', {}),
  writeClipboardImage: bytes => ipcRenderer.invoke('pw:clipboard:write', { bytes }),
  getLanguage: () => ipcRenderer.invoke('pw:language:get', {}),
  setLanguage: language => ipcRenderer.invoke('pw:language:set', { language }),
  confirmReplace: () => ipcRenderer.invoke('pw:replace', {}),
  requestClose: () => ipcRenderer.invoke('pw:close:request', {}),
  confirmClose: input => ipcRenderer.invoke('pw:close:response', input),
  onPrepareClose: callback => subscribe('pw:prepare-close', callback),
  onExport: callback => subscribe('pw:export', callback)
}));
