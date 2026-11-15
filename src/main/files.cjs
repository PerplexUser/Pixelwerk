'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { MAX_IMPORT, FORMATS, detectImage, fail } = require('./contracts.cjs');

async function readImage(filePath) {
  const handle = await fs.open(filePath, 'r');
  try {
    const stat = await handle.stat();
    if (!stat.isFile()) fail();
    if (stat.size > MAX_IMPORT) fail('TOO_LARGE');
    // Bound reads even if another process grows the file after stat().
    const data = Buffer.alloc(stat.size);
    let offset = 0;
    while (offset < data.length) {
      const { bytesRead } = await handle.read(data, offset, data.length - offset, offset);
      if (!bytesRead) fail('IO_ERROR');
      offset += bytesRead;
    }
    const info = detectImage(data);
    return { name: path.basename(filePath), mime: FORMATS[info.format], bytes: new Uint8Array(data) };
  } finally { await handle.close(); }
}

async function atomicWrite(destination, data, io = fs) {
  const temporary = path.join(path.dirname(destination), `.pixelwerk-${randomUUID()}.tmp`);
  let handle;
  try {
    handle = await io.open(temporary, 'wx', 0o600);
    await handle.writeFile(data);
    await handle.sync();
    await handle.close(); handle = null;
    // Same-volume replacement: on failure the existing destination is untouched.
    await io.rename(temporary, destination);
  } finally {
    if (handle) await handle.close().catch(() => {});
    await io.unlink(temporary).catch(() => {});
  }
}
module.exports = { readImage, atomicWrite };
