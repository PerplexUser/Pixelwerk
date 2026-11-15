'use strict';
const { app, BrowserWindow, Menu, dialog, ipcMain, clipboard, nativeImage, session } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { randomUUID } = require('node:crypto');
const C = require('./contracts.cjs');
const { readImage, atomicWrite } = require('./files.cjs');
const { profilePath, initializeProfile } = require('./profile.cjs');
const { message, errorResult } = require('./messages.cjs');
const { imageArguments } = require('./launch-files.cjs');

const rendererPath = path.join(__dirname, '../renderer/index.html');
const rendererUrl = pathToFileURL(rendererPath).href;
const resourceRoot = pathToFileURL(path.dirname(rendererPath) + path.sep).href;
let win, profile, closeRequest = null, allowClose = false, nativeDialogBusy = false;
let selectedBatch = null;
const pendingLaunchImages = [];

function enqueueLaunchImages(argv, workingDirectory) {
  pendingLaunchImages.push(...imageArguments(argv, workingDirectory, { packaged: app.isPackaged }));
  // Notification contains no paths or bytes. The ready renderer pulls one image
  // at a time; its initial pull also covers events received before window creation.
  if (pendingLaunchImages.length && win && !win.isDestroyed()) win.webContents.send('pw:launch-available');
}

async function nextSelectedImage(batchId) {
  if (typeof batchId !== 'string' || batchId !== selectedBatch?.id) C.fail();
  const batch = selectedBatch, chosen = batch.paths.shift();
  let result;
  try { result = { status: 'opened', files: [await readImage(chosen)] }; }
  catch (error) { result = errorResult(error, profile.getLanguage()); }
  // Return only one bitmap per IPC message. Large multi-selections are streamed.
  result.batchId = batch.paths.length ? batch.id : null;
  if (!batch.paths.length && selectedBatch === batch) selectedBatch = null;
  return result;
}

function configureProfile() {
  const mode = app.isPackaged ? JSON.parse(fs.readFileSync(path.join(process.resourcesPath, 'build-mode.json'), 'utf8')).mode : 'development';
  const directory = profilePath({ mode, executable: process.execPath, localAppData: process.env.LOCALAPPDATA, home: app.getPath('home'), development: app.getAppPath() });
  profile = initializeProfile(directory, 'de');
  app.setPath('userData', directory);
  app.setPath('sessionData', path.join(directory, 'Session'));
  app.setPath('logs', path.join(directory, 'Logs'));
  app.setPath('crashDumps', path.join(directory, 'CrashDumps'));
  app.commandLine.appendSwitch('disk-cache-dir', path.join(directory, 'Cache'));
  app.commandLine.appendSwitch('disable-http-cache');
  app.commandLine.appendSwitch('disable-background-networking');
  app.commandLine.appendSwitch('disable-component-update');
  app.commandLine.appendSwitch('disable-domain-reliability');
  app.commandLine.appendSwitch('no-pings');
  return mode;
}

async function guardedDialog(operation) {
  if (nativeDialogBusy) return { status: 'cancelled', code: 'CANCELLED' };
  nativeDialogBusy = true;
  try { return await operation(); } finally { nativeDialogBusy = false; }
}

async function confirmDiscard(unresponsive = false) {
  const lang = profile.getLanguage(), t = key => message(key, lang);
  return guardedDialog(async () => {
    const buttons = unresponsive ? [t('cancel'), t('discard')] : [t('cancel'), t('export'), t('discard')];
    const { response } = await dialog.showMessageBox(win, {
      type: 'warning', title: t('closeTitle'), message: t(unresponsive ? 'unresponsive' : 'closeMessage'),
      detail: t('closeDetail'), buttons, defaultId: 0, cancelId: 0, noLink: true
    });
    return { status: response === 0 ? 'cancelled' : response === buttons.length - 1 ? 'discard' : 'export' };
  });
}

async function finishClose() {
  await profile.flush();
  allowClose = true;
  if (win && !win.isDestroyed()) win.close();
}

function requestClose() {
  if (closeRequest || nativeDialogBusy || !win || win.isDestroyed()) return;
  const requestId = randomUUID();
  const timer = setTimeout(async () => {
    if (closeRequest?.requestId !== requestId) return;
    closeRequest = null;
    const answer = await confirmDiscard(true);
    if (answer.status === 'discard') await finishClose();
  }, 6000);
  closeRequest = { requestId, timer };
  win.webContents.send('pw:prepare-close', requestId);
}

function installIPC() {
  const handle = (channel, operation, fallback) => ipcMain.handle(channel, async (event, input) => {
    if (!C.trusted(event, win, rendererUrl)) return errorResult({ code: 'INVALID_INPUT' }, profile.getLanguage());
    try { return await operation(input); } catch (error) { return errorResult(error, profile.getLanguage(), fallback); }
  });
  handle('pw:open', input => {
    const { multiple } = C.openInput(input);
    return guardedDialog(async () => {
      const result = await dialog.showOpenDialog(win, {
        title: message('openTitle', profile.getLanguage()),
        filters: [{ name: message('images', profile.getLanguage()), extensions: ['png','jpg','jpeg','bmp'] }],
        properties: multiple ? ['openFile','multiSelections'] : ['openFile']
      });
      if (result.canceled) return { status: 'cancelled', code: 'CANCELLED' };
      if (!result.filePaths.length) return { status: 'cancelled', code: 'CANCELLED' };
      selectedBatch = { id: randomUUID(), paths: [...result.filePaths] };
      return nextSelectedImage(selectedBatch.id);
    });
  });
  handle('pw:open:next', input => { C.object(input, ['batchId']); return nextSelectedImage(input.batchId); });
  handle('pw:launch:next', async input => {
    C.object(input, []);
    const file = pendingLaunchImages.shift();
    return file ? { status: 'opened', files: [await readImage(file)] } : { status: 'empty' };
  });
  handle('pw:save', input => {
    const { name, format, data } = C.saveInput(input);
    return guardedDialog(async () => {
      const extension = format === 'jpeg' ? 'jpg' : format;
      const result = await dialog.showSaveDialog(win, {
        title: message('saveTitle', profile.getLanguage()), defaultPath: name,
        filters: [{ name: extension.toUpperCase(), extensions: format === 'jpeg' ? ['jpg','jpeg'] : [extension] }],
        properties: ['showOverwriteConfirmation', 'createDirectory']
      });
      if (result.canceled || !result.filePath) return { status: 'cancelled', code: 'CANCELLED' };
      // Never silently change the path after the OS has asked about overwriting.
      const suffix = path.extname(result.filePath).toLowerCase();
      if (!(format === 'jpeg' ? ['.jpg','.jpeg'] : ['.' + format]).includes(suffix)) C.fail('INVALID_INPUT');
      await atomicWrite(result.filePath, data);
      return { status: 'saved', name: path.basename(result.filePath), bytes: data.byteLength };
    });
  });
  handle('pw:clipboard:read', input => {
    C.object(input, []);
    const image = clipboard.readImage();
    if (image.isEmpty()) C.fail('NO_IMAGE');
    const size = image.getSize(); C.dimensions(size.width, size.height);
    const data = image.toPNG();
    C.bytes(data, C.MAX_IMPORT);
    return { status: 'read', bytes: new Uint8Array(data), mime: 'image/png' };
  }, 'CLIPBOARD_ERROR');
  handle('pw:clipboard:write', input => {
    C.object(input, ['bytes']);
    const data = C.bytes(input.bytes), info = C.detectImage(data);
    if (info.format !== 'png') C.fail();
    const image = nativeImage.createFromBuffer(data);
    if (image.isEmpty()) C.fail('NO_IMAGE');
    clipboard.writeImage(image);
    return { status: 'written' };
  }, 'CLIPBOARD_ERROR');
  handle('pw:language:get', input => { C.object(input, []); return { status: 'ok', language: profile.getLanguage() }; });
  handle('pw:language:set', async input => {
    C.object(input, ['language']);
    C.language(input.language);
    try { await profile.setLanguage(input.language); return { status: 'saved', language: profile.getLanguage() }; }
    catch { return errorResult({ code: 'PROFILE_ERROR' }, profile.getLanguage()); }
  });
  handle('pw:replace', input => { C.object(input, []); return confirmDiscard(); });
  handle('pw:close:request', input => { C.object(input, []); requestClose(); return { status: 'ok' }; });
  handle('pw:close:response', async input => {
    C.object(input, ['requestId','dirty']);
    if (typeof input.requestId !== 'string' || typeof input.dirty !== 'boolean' || input.requestId !== closeRequest?.requestId) C.fail();
    clearTimeout(closeRequest.timer); closeRequest = null;
    if (!input.dirty) { await finishClose(); return { status: 'ok' }; }
    const answer = await confirmDiscard();
    if (answer.status === 'discard') await finishClose();
    else if (answer.status === 'export') win.webContents.send('pw:export');
    return answer;
  });
}

function createWindow(mode) {
  Menu.setApplicationMenu(null);
  const localSession = session.fromPartition('pixelwerk-memory', { cache: false });
  localSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  localSession.setPermissionCheckHandler(() => false);
  localSession.on('will-download', event => event.preventDefault());
  localSession.webRequest.onBeforeRequest((details, callback) => {
    const local = details.url.startsWith(resourceRoot) || details.url.startsWith('data:') || details.url.startsWith('blob:file:');
    callback({ cancel: !local });
  });
  win = new BrowserWindow({
    width: 1440, height: 940, minWidth: 780, minHeight: 580, show: false,
    title: 'Pixelwerk', backgroundColor: '#f5f7f4', icon: path.join(__dirname, '../../build/icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.cjs'),
      contextIsolation: true, sandbox: true, nodeIntegration: false,
      webSecurity: true, webviewTag: false, spellcheck: false,
      devTools: !app.isPackaged, session: localSession,
      additionalArguments: [`--pixelwerk-language=${profile.getLanguage()}`, `--pixelwerk-mode=${mode}`, `--pixelwerk-version=${app.getVersion()}`]
    }
  });
  const wc = win.webContents;
  wc.setWindowOpenHandler(() => ({ action: 'deny' }));
  wc.on('before-input-event', (event, input) => {
    if (input.key === 'F5' || (input.control || input.meta) && input.key?.toLowerCase() === 'r') event.preventDefault();
  });
  wc.on('will-navigate', event => event.preventDefault());
  wc.on('will-frame-navigate', event => event.preventDefault());
  wc.on('will-redirect', event => event.preventDefault());
  wc.on('will-attach-webview', event => event.preventDefault());
  wc.on('will-prevent-unload', event => { if (allowClose) event.preventDefault(); });
  win.on('close', event => { if (!allowClose) { event.preventDefault(); requestClose(); } });
  win.on('closed', () => { if (closeRequest) clearTimeout(closeRequest.timer); win = null; });
  win.once('ready-to-show', () => {
    win.show();
    if (profile.warning) dialog.showMessageBox(win, { type: 'warning', title: 'Pixelwerk', message: message('PROFILE_ERROR', profile.getLanguage()) });
  });
  wc.on('render-process-gone', () => {
    dialog.showMessageBox(win, { type: 'error', title: 'Pixelwerk', message: message('unresponsive', profile.getLanguage()), buttons: [message('cancel', profile.getLanguage())] });
  });
  win.loadFile(rendererPath).catch(() => { dialog.showErrorBox('Pixelwerk', 'Die Anwendung konnte nicht geladen werden. / The application could not be loaded.'); allowClose = true; app.quit(); });
}

let mode;
try { mode = configureProfile(); }
catch {
  dialog.showErrorBox('Pixelwerk – Profil / Profile', 'Der Profilordner ist nicht beschreibbar oder die Paketkonfiguration ist ungültig. Entpacke die portable Ausgabe in einen beschreibbaren Ordner.\n\nThe profile folder is not writable or the package configuration is invalid. Extract the portable edition to a writable folder.');
  app.exit(1);
}
if (profile) {
  if (!app.requestSingleInstanceLock()) app.quit();
  else {
    enqueueLaunchImages(process.argv, process.cwd());
    app.on('second-instance', (_event, argv, workingDirectory) => {
      enqueueLaunchImages(argv, workingDirectory);
      if (win) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); }
    });
    app.whenReady().then(() => { app.setAppUserModelId('click.perplex.pixelwerk'); installIPC(); createWindow(mode); });
    app.on('window-all-closed', () => app.quit());
  }
}
