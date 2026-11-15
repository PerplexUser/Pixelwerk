'use strict';

const MAX_IMPORT = 80 * 1024 * 1024;
const MAX_TRANSFER = 128 * 1024 * 1024;
const MAX_SIDE = 8192;
const MAX_PIXELS = 20_000_000;
const FORMATS = Object.freeze({ png: 'image/png', jpeg: 'image/jpeg', bmp: 'image/bmp' });
class AppError extends Error {
  constructor(code) { super(code); this.code = code; }
}
function fail(code = 'INVALID_INPUT') { throw new AppError(code); }
function object(value, keys, required = keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).some(k => !keys.includes(k)) || required.some(k => !Object.hasOwn(value, k))) fail();
  return value;
}
function language(value) { if (!['de', 'en'].includes(value)) fail(); return value; }
function dimensions(width, height) {
  if (![width, height].every(n => Number.isInteger(n) && n > 0)) fail();
  if (width > MAX_SIDE || height > MAX_SIDE || width * height > MAX_PIXELS) fail('TOO_LARGE');
  return { width, height };
}
function bytes(value, max = MAX_TRANSFER) {
  if (!(value instanceof Uint8Array) && !(value instanceof ArrayBuffer)) fail();
  const length = value.byteLength;
  if (!length) fail();
  if (length > max) fail('TOO_LARGE');
  return Buffer.from(value instanceof ArrayBuffer ? new Uint8Array(value) : value);
}
function detectImage(b) {
  if (b.length >= 24 && b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && b.toString('ascii',12,16) === 'IHDR') {
    return { format: 'png', ...dimensions(b.readUInt32BE(16), b.readUInt32BE(20)) };
  }
  if (b.length >= 26 && b.toString('ascii',0,2) === 'BM') {
    const dib = b.readUInt32LE(14);
    if (dib === 12) return { format: 'bmp', ...dimensions(b.readUInt16LE(18), b.readUInt16LE(20)) };
    if (dib >= 40 && b.length >= 54) return { format: 'bmp', ...dimensions(b.readInt32LE(18), Math.abs(b.readInt32LE(22))) };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let at = 2;
    while (at + 3 < b.length) {
      if (b[at++] !== 0xff) fail();
      while (b[at] === 0xff) at++;
      const marker = b[at++];
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker === 0x01 || marker >= 0xd0 && marker <= 0xd7) continue;
      if (at + 2 > b.length) fail();
      const length = b.readUInt16BE(at);
      if (length < 2 || at + length > b.length) fail();
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
        if (length < 8) fail();
        return { format: 'jpeg', ...dimensions(b.readUInt16BE(at+5), b.readUInt16BE(at+3)) };
      }
      at += length;
    }
  }
  fail();
}
function filename(name, format) {
  if (typeof name !== 'string' || name.length > 240 || !Object.hasOwn(FORMATS, format)) fail();
  let base = name.trim().replace(/\.(png|jpe?g|bmp)$/i, '').replace(/[<>:"/\\|?*\x00-\x1f\x7f]/g, '_').replace(/[. ]+$/g, '').slice(0, 120);
  if (!base) base = 'Pixelwerk';
  if (/^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(base)) base = '_' + base;
  return `${base}.${format === 'jpeg' ? 'jpg' : format}`;
}
function openInput(input) { object(input, ['multiple']); if (typeof input.multiple !== 'boolean') fail(); return input; }
function saveInput(input) {
  object(input, ['name','format','bytes']);
  const name = filename(input.name, input.format), data = bytes(input.bytes), image = detectImage(data);
  if (image.format !== input.format) fail();
  return { name, format: input.format, data };
}
function trusted(event, win, expectedUrl) {
  try {
    if (!win || win.isDestroyed() || event.sender !== win.webContents || event.senderFrame !== win.webContents.mainFrame) return false;
    const actual = new URL(event.senderFrame.url), expected = new URL(expectedUrl);
    return actual.protocol === expected.protocol && actual.host === expected.host && actual.pathname === expected.pathname;
  } catch { return false; }
}
module.exports = { MAX_IMPORT, MAX_TRANSFER, MAX_SIDE, MAX_PIXELS, FORMATS, AppError, fail, object, language, dimensions, bytes, detectImage, filename, openInput, saveInput, trusted };
