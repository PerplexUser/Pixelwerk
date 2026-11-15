'use strict';
const messages = {
  INVALID_INPUT: ['Die Datei oder Eingabe ist ungültig. Erlaubt sind PNG, JPG und BMP.', 'The file or input is invalid. PNG, JPG and BMP are supported.'],
  TOO_LARGE: ['Die Grenze beträgt 80 MiB pro Import, 8.192 Pixel je Seite und 20 Megapixel.', 'The limit is 80 MiB per import, 8,192 pixels per side and 20 megapixels.'],
  IO_ERROR: ['Die Datei konnte nicht vollständig gelesen oder gespeichert werden. Prüfe Speicherplatz und Zugriffsrechte.', 'The file could not be fully read or saved. Check free space and access permissions.'],
  NO_IMAGE: ['Die Zwischenablage enthält kein unterstütztes Bild.', 'The clipboard contains no supported image.'],
  CLIPBOARD_ERROR: ['Die Systemzwischenablage ist nicht verfügbar. Die interne Kopie bleibt nutzbar.', 'The system clipboard is unavailable. The internal copy remains available.'],
  PROFILE_ERROR: ['Die Sprache konnte nicht dauerhaft gespeichert werden. Sie gilt für diese Sitzung.', 'The language could not be saved. It remains active for this session.'],
  closeTitle: ['Ungespeicherter Entwurf', 'Unsaved draft'],
  closeMessage: ['Dein Entwurf enthält ungespeicherte Änderungen.', 'Your draft contains unsaved changes.'],
  closeDetail: ['Speichere das Bild oder verwerfe die Änderungen bewusst. Bilddateien enthalten keine bearbeitbaren Ebenen.', 'Save the image or explicitly discard the changes. Image files do not preserve editable layers.'],
  cancel: ['Abbrechen', 'Cancel'], export: ['Speichern unter…', 'Save as…'], discard: ['Änderungen verwerfen', 'Discard changes'],
  openTitle: ['Bild öffnen', 'Open image'], saveTitle: ['Speichern unter', 'Save as'], images: ['Bilder', 'Images'],
  unresponsive: ['Der Editor reagiert nicht. Beim Beenden gehen ungespeicherte Änderungen verloren.', 'The editor is not responding. Quitting will lose unsaved changes.']
};
function message(key, language = 'de') { return (messages[key] || messages.IO_ERROR)[language === 'en' ? 1 : 0]; }
function errorResult(error, lang, fallback = 'IO_ERROR') {
  const code = Object.hasOwn(messages, error?.code) ? error.code : fallback;
  return { status: 'error', code, message: message(code, lang) };
}
module.exports = { message, errorResult };
