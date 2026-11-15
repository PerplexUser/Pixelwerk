'use strict';
const path = require('node:path');

// Windows supplies paths as individual argv entries; never split on whitespace,
// execute arguments, or interpret URLs/options as image files.
function imageArguments(argv, workingDirectory, { packaged = true, paths = path } = {}) {
  if (!Array.isArray(argv) || typeof workingDirectory !== 'string') return [];
  const result = [];
  for (const value of argv.slice(packaged ? 1 : 2)) {
    if (typeof value !== 'string' || !value || value.length > 32767 || value.includes('\0')) continue;
    const file = value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;
    if (file.startsWith('-') || /^[a-z][a-z\d+.-]*:\/\//i.test(file) || !/\.(png|jpe?g|bmp)$/i.test(file)) continue;
    const resolved = paths.resolve(workingDirectory, file);
    if (!result.includes(resolved)) result.push(resolved);
  }
  return result;
}
module.exports = { imageArguments };
