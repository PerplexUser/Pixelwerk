# Windows-Abnahme

Diese Prüfschritte sind für eine echte Windows-Umgebung vorgesehen. Sie sind in diesem Build nicht als bestanden gewertet. Vor der Freigabe auf Windows 10 22H2 x64 und Windows 11 x64 jeweils beide Ausgaben prüfen. Windows-Buildnummer, CPU, RAM, DPI und Paket-SHA-256 protokollieren. Zielsystem laut Vorgabe: 4 Kerne, 8 GB RAM, SSD, 1920×1080.

## Automatisierter Starttest der tatsächlichen EXE

Im Quellcodeordner nach `npm ci`, alle anderen Pixelwerk-Fenster schließen:

```powershell
node tests/windows/smoke.cjs "C:\Test\Pixelwerk\Pixelwerk.exe"
node tests/windows/smoke.cjs "$env:LOCALAPPDATA\Programs\Pixelwerk\Pixelwerk.exe"
```

Das Skript öffnet die tatsächliche Anwendung, prüft die isolierte Brücke, Werkzeuge und Metadaten, prüft Start per Dateipfad und einen zweiten Prozess mit weiterem Bild, kontrolliert im installierten Modus die registrierten Dateitypen und überträgt ein generiertes Testbild über die Windows-Zwischenablage, exportiert es in einen eigenen temporären Ordner mit Unicode-Dateiname und prüft den Schließablauf. Der Speicherdialog wird für diesen automatisierten Test auf die Testdatei gelenkt; das ersetzt nicht die manuelle Dialogprüfung. Das Testbild ersetzt den Inhalt der Zwischenablage. Ergebnis, Screenshot und Runtimeversion stehen im ausgegebenen QA-Ordner. Dieser Ordner darf anschließend manuell gelöscht werden.

## Manuelle Prüfläufe pro Paket und Betriebssystem

| Test | Konkrete Prüfung | Protokoll |
|---|---|---|
| T01 | Offline starten; PNG/JPG/BMP öffnen, Mehrfachimport und Drop; Clipboard aus Paint/Snipping Tool. Leinwandhintergründe und Grenzen 8192×2441/2442, >80 MiB und defekte Bilder. Bestehenden Entwurf erhalten. | Ergebnis/Fehler |
| T02 | Raster/Text/Sticker skalieren, Positionen/Selektion, Undo/Redo; alle Ebenenaktionen und Deckkraft. | Ergebnis/Pixelvergleich |
| T03 | Auswahl/Strg+A/Esc, Kopie über Dokumentwechsel; Crop frei, 1:1, 4:3, 16:9, 2:3; Enter/Esc/Undo. | Ergebnis |
| T04 | Pinsel rund/quadratisch, Sprühen im Stillstand und Fokuswechsel, Smear/Alpha, Linie/Esc, Radierer und Text-Rasterisierung/Undo. | Ergebnis |
| T05 | Fülleimer/Hintergrundradierer Toleranz 0/100, global/zusammenhängend, Auswahlclip; Pipette/Hex/16 Farben/[ und ]. | Ergebnis |
| T06 | Markerfarben und Blend-Modi, Pfeil/45°, Formen, Text mit fünf Fonts und Rand, 72 Sticker/Glyphen in Originalreihenfolge. | Screenshots |
| T07 | Alle Effekte und Wertebereiche; PNG/JPG 10/92/100/BMP neu öffnen; Vorschau, Alpha/Weiß, Speicherdialog, Abbruch/volle Platte/fehlende Rechte. | Dateien/Fehler |
| T08 | Jede Geste als ein Undo-Schritt, Text wieder editierbar, >25 Zustände, 600-ms-Gruppe, Redo nach neuer Änderung verworfen. | Ergebnis |
| T09 | DE/EN und Neustart, Nutzernamen/Text erhalten, sämtliche Shortcuts und Formularfokus, Zoom 3–800 %, Fenster/DPI 100/125/150/200 %, Tab-Bedienung. | Screenshots |
| T10 | Lokalen Adapter mit gültigen/ungültigen Eingaben und ohne Host prüfen; echte Hostintegration nur falls verfügbar. | JSON/Hostversion |
| T11 | Portable als Standardnutzer offline; Sprache ändern, ganzen Ordner nach Unicode-/USB-Pfad verschieben; kein permanentes AppData-/Registry-Profil. Schreibschutz kontrolliert ablehnen. | Prozess-/Dateiprotokoll |
| T12 | Setup als Standardnutzer offline; Startmenü, optionaler Desktop-Link, Eintrag in installierten Apps. Testvorgänger installieren, mit neuer Version aktualisieren, Sprache erhalten. Deinstallieren, eigene Exportbilder erhalten. | Install-/Upgrade-/Uninstall-Protokoll |
| T13 | Netzwerk sperren und Anfragen protokollieren; schließen/ersetzen abbrechen/verwerfen/exportieren. Mehrfachstart, Unicode-/Leerzeichen-/lange Pfade, Reservierungen und Fehlerfälle. | Netzwerk-/Fehlerprotokoll |
| T14 | Kaltstart 3× (Median ≤10 s), Import/PNG-Export 1920×1080 je ≤5 s, Vorschau 20× (P95 ≤250 ms), 20-MP-Workflow und RAM. | Rohmesswerte |

## Vergleichsmethode

Unveränderte Referenz aus `reference/Pixelwerk/` und Desktop in derselben Chromium-Version mit denselben Fonts, Fixtures und Eingaben vergleichen. Deterministische Pixelalgorithmen: exakt gleiche RGBA-Werte. Für Schrift/GPU/DPI eine sichtbare Differenz nie stillschweigend akzeptieren; Abweichung samt Ursache und vorab abgestimmter Toleranz dokumentieren. Sprühdose mit festem Seed oder mit nachvollziehbarer Farbauftragsmessung prüfen. Den lokalen Browsernachweis in `qa/` nicht als Windows-Abnahme übertragen.

## Freigabe

Erst nach allen geforderten Tests, geklärten Vertriebsrechten und Entscheidung über Signierung freigeben. Die gelieferten unsignierten Dateien können Windows-Warnungen auslösen. Ein Zertifikat oder eine SmartScreen-Reputation wird nicht mitgeliefert.

## Zusätzliche Abnahme 5.0.1

- 5.0.0 mit dem neuen Setup aktualisieren; Profil und vorhandene Bilder erhalten.
- Setup registriert `.png`, `.jpg`, `.jpeg`, `.bmp` unter HKCU. In den geöffneten Windows-Einstellungen Pixelwerk für alle vier Endungen bestätigen. Unter Windows 10 die allgemeine Dateitypliste, unter Windows 11 die Pixelwerk-Seite prüfen. Der Installer meldet keine Standardwahl als bereits bestätigt.
- Für jeden Dateityp Explorer-Doppelklick bei geschlossener und bereits laufender App. Dateipfade mit Leerzeichen, Umlauten und mehreren Punkten; Fenster minimiert; rasch aufeinanderfolgende Starts.
- Bei ungespeichertem Entwurf Abbrechen, Verwerfen und Speichern unter… prüfen. Während eines Speicherdialogs angeklickte Datei wird erst nach dessen Abschluss verarbeitet. Defekte Bilder erhalten den aktuellen Entwurf.
- „Speichern unter…“ / Strg+S / Strg+Umschalt+S, DE/EN, PNG-Transparenz, JPG-Qualität und BMP prüfen.
- Update mit bereits gewähltem `Pixelwerk.Image` erhält die Standardwahl; Deinstallation entfernt ausschließlich Pixelwerk-Registrierungen und keine fremden Open-with-Einträge.
- Silent-Setup registriert Dateitypen, öffnet keine UI und bestätigt keine Standardwahl automatisch.

Diese Windows-Prüfungen sind hier weiterhin nicht als ausgeführt gewertet.
