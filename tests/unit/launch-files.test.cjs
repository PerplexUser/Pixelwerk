const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {imageArguments}=require('../../src/main/launch-files.cjs');
const options={paths:path.win32};
test('Windows launch paths preserve spaces, Unicode, upper-case extensions and order',()=>{
  assert.deepEqual(imageArguments(['C:\\Apps\\Pixelwerk.exe','C:\\Bilder\\Grüße zum Fest.PNG','Foto 1.jpg','"C:\\Bilder\\Foto 2.jpeg"','Foto 1.jpg'], 'D:\\Fotos',options),['C:\\Bilder\\Grüße zum Fest.PNG','D:\\Fotos\\Foto 1.jpg','C:\\Bilder\\Foto 2.jpeg']);
});
test('launch parsing excludes Electron options, URLs, unrelated files and malformed arguments',()=>{
  assert.deepEqual(imageArguments(['Pixelwerk.exe','--inspect=123','--data=image.png','https://example.org/a.png','file:///C:/a.jpg','x.svg','x.exe',null,42,'a\0.png','bild.bmp'],'C:\\Fotos',options),['C:\\Fotos\\bild.bmp']);
});
test('development launch skips the app entry and resolves relative paths in the launch working directory',()=>{
  assert.deepEqual(imageArguments(['electron.exe','C:\\Project.png','..\\Bild.jpg'],'C:\\Fotos\\Unterordner',{...options,packaged:false}),['C:\\Fotos\\Bild.jpg']);
});
