# Pixelwerk für Windows

Installation files: https://github.com/PerplexUser/Pixelwerk/releases/tag/v5.0.2

Vollständiger Pixelwerk-v5-Editor in einer lokalen Electron-Anwendung. Ein Quellstand erzeugt eine portable Ordner-ZIP und ein Offline-Setup für Windows x64. © by www.perplex.click bleibt erhalten.

Die ausführbaren Ausgaben stehen im Release neben diesem Quellcodearchiv. Die Windows-Abnahme ist separat in `docs/QA-Releasebericht.md` ausgewiesen. Keine automatische Updatesuche, kein Konto, keine Telemetrie, kein Projektformat und keine automatische Bildspeicherung.

## Neu in 5.0.1

Explorer-Doppelklick öffnet das Bild auch bei bereits laufendem Pixelwerk.
„Speichern unter…“ bietet PNG, JPG und BMP. Das Setup registriert alle Bildtypen
und öffnet die Windows-Einstellungen zur Bestätigung als Standard-App.
Die geschützte Standardwahl muss in Windows bestätigt werden.

## Start und Entwicklung

Node.js 24 x64 mit npm installieren, dann im entpackten Quellcodeordner:

```powershell
npm ci
npm start
```

Für die Entwicklung muss npm die gepinnten Pakete und die Electron-Laufzeit einmal herunterladen. Die fertige Anwendung benötigt keine Internetverbindung.

```powershell
npm run check
npm test
npx playwright install chromium
npm run test:e2e
npm run dist:win
```

Einzelausgaben: `npm run build:win:portable` und `npm run build:win:setup`.
Prüfsummen: `npm run release:hashes`.

## Inhalt

- `reference/`: unveränderte sechs Quelldateien und Originalarchiv mit verifiziertem SHA-256.
- `src/renderer/`: kompletter Editor, Desktop-Anbindung und lokal aufrufbarer Agentenadapter.
- `src/main/`: Fenster, IPC-Validierung, native Dialoge, atomarer Export, Clipboard und Profile.
- `src/preload/`: eingeschränkte Brücke mit dokumentiertem TypeScript-Vertrag.
- `tests/`: Algorithmus-, Vertrags-, Datei-, Integrations- und Browser-Regressionstests mit generierten Bildfixtures.
- `build/`, `scripts/`: Icon, NSIS-Erweiterung, reproduzierbare Paketierung und Prüfskripte.
- `docs/`: deutsche/englische Anleitung, Architektur, Entscheidungen und Abnahmebericht.
- `qa/`: tatsächlich ausgeführte Prüfungen und Messprotokolle.

Keine privaten Schlüssel oder Signaturzertifikate enthalten. Builds sind ausdrücklich unsigniert.
