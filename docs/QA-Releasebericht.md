# Pixelwerk 5.0.1 Prüf- und Releasebericht

Stand: 15.11.2026. Ziel: Windows 10 22H2 und Windows 11 x64. Die Implementierung und die Windows-Paketierung sind abgeschlossen. Eine Produktionsfreigabe wird ausdrücklich nicht erteilt: die echte Windows-Abnahme, einschließlich Installation/Upgrade/Deinstallation, DPI, Schriften und Performance auf dem vorgesehenen Referenzrechner, ist noch offen.

## Tatsächlich geprüfter Stand

| Prüfung | Ergebnis und Grenze |
|---|---|
| Referenzidentität | Originalarchiv-SHA-256 stimmt exakt mit beiden Vorgabedokumenten überein; alle sechs Dateien unverändert mitgeliefert. |
| Bildalgorithmen/Oberfläche | `core.js` und `style.css` bytegleich mit der Referenz. Keine Werkzeuge, Sticker oder Einstellungen entfernt. |
| Syntax-/Bestandsprüfung | Bestanden; Protokoll `qa/check.log`. |
| Modul-/Integrationstests | 33 bestanden, 0 fehlgeschlagen. Native Electron-APIs in Integrationstests simuliert; echter Dateizugriff im temporären Testordner. |
| Browsertests | 21 bestanden, 0 fehlgeschlagen. Echte Canvas-/DOM-Ausführung in Chromium 153.0.8010.0 unter Linux, pro Test isolierter Prozess; Desktop-Systemaufrufe im Browser simuliert. |
| Pixelvergleich | Gleiche PNG-Fixture, Pinselgeste und Sepia-Effekt in unveränderter Referenz und Desktop-Renderer: exakte RGBA-Gleichheit. Core-Effekte zusätzlich für alle Presets und Extremwerte bytegleich. Keine daraus abgeleitete Windows-Font-/GPU-Zusage. |
| Werkzeuge/Sticker | 16 Werkzeug-IDs und Tasten geprüft; alle 72 Original-Sticker in derselben Reihenfolge. Windows-Glyphen separat offen. |
| 20-MP-Diagnose | 8192×2441 Pixel (19.996.672 Pixel) erstellt, bemalt, rückgängig gemacht und als PNG exportiert, ohne Browserfehler. Rohdauer/Dateigröße in `qa/20mp-diagnostic.json`. Dies ist kein Windows-Performance-Abnahmetest. |
| Export | PNG-Alpha, JPG/BMP-Weiß, BMP-Header/Padding, Vorschau-Effekt und Wiedereinlesen geprüft. Abbruch/Fehler behalten dirty; späterer Schreibabschluss überschreibt keinen neueren Änderungsstatus. |
| Datei-/Profilfehler | Grenzen, beschädigte Header, Windows-Reservierungen, Unicode/Leerzeichen, Schreib-/Rename-Fehler und simulierte volle Platte geprüft; altes Ziel bleibt erhalten. Sprachpersistenz und getrennte Profilpfade geprüft. |
| Sicherheit | CSP, IPC-Hauptframe/Sender/URL, geschlossene Parameterverträge, Popup-/Navigations-/Berechtigungsblockade und Reload-Schutz geprüft. Kein reales Windows-Netzwerkmessprotokoll. |
| Agenten | Vier lokal aufrufbare Verträge, Schemas, Fehler, Undo über Editorfunktionen, Mock-Host, hostloser Betrieb und Abort-Lebenszyklus geprüft. Keine echte ChatGPT-Hostintegration behauptet. |
| Windows-Pakete | Aus demselben Quellstand gebaut. Paketinhalt, Version/Modus, identisches app.asar, PE-x64 und Prüfsummen werden in `qa/artifact-verification.json` und `qa/release.json` protokolliert. EXE nicht unter Windows ausgeführt. |

## Neu geprüfte Regressionen in 5.0.1

Die zusätzlichen Tests prüfen Startargumente mit Leerzeichen/Unicode, Ausschluss von Optionen und URLs, Kaltstart bis Rendererbereitschaft, zweite Instanzen vor/nach Fenstererstellung, beschädigte Dateien, Reihenfolge, Abbruch/Verwerfen ungespeicherter Arbeit und Warten auf den Speicherdialog. Die DE/EN-Beschriftung „Speichern unter…“ und PNG/JPG/BMP-Auswahl sind im Browser geprüft.

Die NSIS-Registrierung ist im Setup kompiliert, aber noch nicht auf einem echten Windows-System ausgeführt. Insbesondere die Standard-App-Systemseite, ihre Benutzerbestätigung und der Registry-Lebenszyklus bei Update/Deinstallation bleiben echte Windows-Abnahmepunkte. Keine automatische Standardwahl wird behauptet.

## Abdeckungsmatrix

„Lokal geprüft“ bedeutet die oben beschriebenen Modul-/Browserprüfungen, nicht die vollständige Windows-Abnahme. Für jeden Eintrag sind Portable und Setup unter Windows 10 und Windows 11 noch auszuführen.

| Anforderungen | Abnahmetests | Implementierung / lokaler Nachweis | Windows-Status beider Pakete |
|---|---|---|---|
| A-01 | T01–T10 | Originaleditor vollständig, Core/CSS unverändert, Pixelvergleich und Sticker-/Toolliste | Offen |
| A-02 | T01, T13 | Runtime und Ressourcen enthalten, kein Server, Requests gesperrt | Offline-Start offen |
| A-03 | T01 | PNG/JPG/BMP, native Auswahl als Stream, Drop/Paste-Pipeline, fehlerhafte Bilder erhalten Dokument | Native Dialog-/Drop-/Clipboard-Abnahme offen |
| A-04 | T01, T14 | Grenzen vor Dekodierung, drei Hintergründe, Ganzzahlprüfung, 20-MP-Diagnose | Windows-Ressourcenprüfung offen |
| A-05 | T02 | Raster/Text/Sticker-Resize, Position/Größe, Undo/Redo | Offen |
| A-06 | T02 | Vollständige Original-Ebenenverwaltung erhalten | Alle Ebenenaktionen unter Windows offen |
| A-07 | T02, T09 | Originaltransformation, numerische Position und Adapter-/Undo-Test | Ecken/Shift/DPI offen |
| A-08 | T03 | Auswahlclip, sichtbare Kopie, Dokumentwechsel und interner Fallback geprüft | Austausch mit Windows-Apps offen |
| A-09 | T03 | Original-Crop, Größen-/Offset-/Undo-Prüfung | Alle Verhältnisse unter Windows offen |
| A-10 | T04–T05 | Original-Mal-/Retuschewerkzeuge; Pinsel, Radierer, Sprühen/Fokus, Füllen, Hintergrundradierer und Core-Smudging geprüft | Vollständige Gestenmatrix offen |
| A-11 | T05, T09 | Originalfarben, unabhängige Einstellungen und Shortcuts erhalten | Vollständige Grenzbedienung offen |
| A-12 | T06 | Marker als eigene Ebene mit Blend-Eigenschaften erhalten; Auswahlclip geprüft | Beide Blend-Modi visuell offen |
| A-13 | T06 | Pfeil/Form als Rasterebenen, Clip-/Transparenzprüfung | Shift/Esc/alle Geometrien offen |
| A-14 | T06 | Editierbarer mehrzeiliger Text, Rasterisierung/Undo geprüft | Fünf Windows-Fonts offen |
| A-15 | T06 | 72 Motive exakt übernommen und gezählt | Windows-Glyphen aller 72 offen |
| A-16 | T07 | Originaleffekte, Vorschau/Anwenden/Undo, Core-Extremwerte geprüft | Visuelle Windows-Regression offen |
| A-17 | T07, T13 | Exportformate, Alpha, BMP, Fehler/Abbruch und bestätigte Schreibvorgänge geprüft | Nativer Dialog/Dateisystemfehler unter Windows offen |
| A-18 | T10 | Gemeinsamer lokaler Adapter, vier Originaltools, keine Pixel im Zustand | Echter Host nur falls vorhanden |
| A-19 | T08 | Gesten-Undo, Text-Rückkehr, 25 Zustände, Redo-Verzweigung und 600-ms-Flush erhalten/geprüft | Große Historie unter Windows offen |
| A-20 | T09 | Originalanordnung, DE/EN, Tastaturvorrang und alle 16 Tool-Keys geprüft | DPI/Tab/Zoom-Matrix offen |
| A-21 | T11 | Portable-Paket, expliziter Modus, relative Profile, Schreibschutzbehandlung | Standardnutzer/USB/Registry-Prüfung offen |
| A-22 | T12 | NSIS per user, optionale Desktop-Verknüpfung, Startmenü/Uninstaller; Löschung nur exakter Paketdateiliste | Installation/Upgrade/Deinstallation offen |
| A-23 | T13 | Lokale Verarbeitung, enger IPC, Clipboardfallback, Schließ-/Ersetzschutz | Windows-Netzwerkmessung und Fremd-Clipboard offen |
| A-24 | T01–T14 | Gepinnte Builds, vollständige Quellen/Tests/Dokumentation, Lizenzhinweise/Hashes | OS-/DPI-/Performance-Endabnahme offen |

## Lieferumfang und Nachweise

Portable ZIP und Setup EXE sind eigenständige Offline-Ausgaben mit Runtime. Das Quellcodearchiv enthält unveränderte Referenz, Implementierung, Lockfile, Builds, Tests und Fixtures, DE/EN-Anleitung, Architektur, Entscheidungen und diesen Bericht. `qa/release.json` nennt Version, Quellcommit, Paketgrößen und SHA-256; `SHA256SUMS.txt` enthält die Download-Prüfsummen. Runtime-Lizenztexte liegen in den ausführbaren Paketen. `docs/Build-Abhaengigkeiten.json` dokumentiert die Build-/Testabhängigkeiten.

Die Browserprüfungen verwenden ausschließlich generierte Testbilder. `qa/browser-results.json`, `qa/browser.log`, `qa/unit-integration.log` und `qa/build.log` enthalten die Ergebnisse der finalen lokalen Läufe. Unter `tests/windows/smoke.cjs` liegt ein ausführbarer Start-/Clipboard-/Exporttest für die echte EXE; alle weiteren Prüfschritte stehen in `docs/Windows-Abnahme.md`.

## Offene Freigabepunkte

Die fehlende Windows-Endabnahme ist der verbleibende Freigabeblocker. Besonders zu prüfen sind Installer-/Upgrade-/Uninstall-Verhalten, Windows-Systemzwischenablage, portable Profile, alle 72 Emoji-Glyphen, HiDPI und die vereinbarten Zeit-/Speicherziele. Keine dieser Prüfungen wird hier als bestanden ausgegeben. Signaturzertifikat und ausdrückliche Vertriebsrechte wurden nicht mitgeliefert; Builds sind unsigniert. Kein automatisches Veröffentlichen oder Verteilen an Dritte erfolgt.
