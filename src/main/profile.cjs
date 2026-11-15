'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { atomicWrite } = require('./files.cjs');
const { language } = require('./contracts.cjs');

function profilePath({ mode, executable, localAppData, home, development }) {
  if (mode === 'portable') return path.join(path.dirname(executable), 'data');
  if (mode === 'installed') return path.join(localAppData || path.join(home, 'AppData', 'Local'), 'Pixelwerk');
  if (mode === 'development') return path.join(development, '.dev-data');
  throw new Error('INVALID_MODE');
}
function initializeProfile(directory, defaultLanguage = 'de') {
  fs.mkdirSync(directory, { recursive: true });
  const probe = path.join(directory, `.write-${randomUUID()}`);
  fs.writeFileSync(probe, '', { flag: 'wx', mode: 0o600 }); fs.unlinkSync(probe);
  for (const sub of ['Session', 'Cache', 'Logs', 'CrashDumps']) fs.mkdirSync(path.join(directory, sub), { recursive: true });
  const preferences = path.join(directory, 'settings.json');
  let selected = defaultLanguage, warning = false;
  try {
    if (fs.statSync(preferences).size > 4096) throw new Error('INVALID_INPUT');
    selected = language(JSON.parse(fs.readFileSync(preferences, 'utf8')).language);
  } catch (error) { if (error.code !== 'ENOENT') warning = true; }
  let queue = Promise.resolve();
  return {
    directory, warning,
    getLanguage: () => selected,
    setLanguage(value) {
      selected = language(value);
      const payload = JSON.stringify({ language: selected }, null, 2) + '\n';
      const task = queue.catch(() => {}).then(() => atomicWrite(preferences, payload));
      queue = task;
      return task;
    },
    flush: () => queue.catch(() => {})
  };
}
module.exports = { profilePath, initializeProfile };
