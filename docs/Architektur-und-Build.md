# Architektur und Build

Pixelwerk 5.0.1 verwendet Electron 45.3.2, electron-builder 26.18.0 und den vollständigen Editor aus der gelieferten Referenz. Die ausführbaren Pakete enthalten dieselbe Anwendung in `resources/app.asar`; nur `resources/build-mode.json` legt den Profiltyp fest. Es gibt keinen lokalen Webserver.

## Referenz und Änderungen

SHA-256 der Original-ZIP: `36e9b69713b49b1e986cf2b80d84743d7984bde24238573f059b7c06a0f27c5e`.
Alle sechs Originaldateien sind unverändert in `reference/Pixelwerk/` vorhanden. `core.js` und `style.css` sind auch im Renderer bytegleich. Die Bildalgorithmen wurden nicht neu implementiert. Der Canvas-Editor bleibt alleiniger Eigentümer von Bildmodell, Historie und Effekten.

Der Hauptprozess besitzt ausschließlich native Systemfunktionen. Der Renderer läuft mit `sandbox`, `contextIsolation` und `webSecurity`, ohne Node-Integration, Webviews oder beliebige IPC-Aufrufe. Vor jedem IPC-Aufruf werden das konkrete Fenster, sein Hauptframe und die lokale Einstiegsdatei geprüft. CSP untersagt Netzverbindungen, externe Skripte, Frames, Objekte und eval. Inline-CSS bleibt für die vorhandenen Schieberegler und Farbflächen erforderlich. Zusätzlich blockiert die Session externe Requests, Navigation, Popups, Downloads und Berechtigungen. Es gibt weder Crashreport-Upload noch Telemetrie oder Updater.

## Dateien und Zwischenablage

`pw:open` öffnet den nativen Dateidialog. Bei Mehrfachauswahl wird jeweils eine Datei mit Namen, MIME und Bytes übergeben; ein zufälliges Batch-Token erlaubt `pw:open:next` ausschließlich für die übrigen ausdrücklich gewählten Dateien. Keine Pfade werden dem Renderer zurückgegeben. Stat-Prüfung und begrenzte Leseoperationen verhindern unbeschränkte Zuweisungen. PNG/BMP/JPEG-Header werden vor dem Dekodieren auf Dimensionen geprüft. Die vollständige Dekodierung übernimmt Chromium. Die Renderer-Prüfung gilt auch für Drag & Drop und Browser-Dateiauswahl.

Windows-Startargumente und `second-instance` werden durch `launch-files.cjs`
ausgewertet. Pfade mit Leerzeichen/Unicode bleiben einzelne Argumente; Optionen
und URLs werden ignoriert. Der Hauptprozess hält die Dateien bis zur Bereitschaft
des Renderers in einer Warteschlange. `pw:launch:next` liefert nur die nächste
validierte Bilddatei, ohne beliebige Pfade als Eingabe zu akzeptieren. Die Meldung
`pw:launch-available` enthält keine Bilddaten. Die Oberfläche serialisiert
Importe, wartet auf offene Dialoge und verwendet denselben Ersetzschutz wie beim
normalen Öffnen.

`pw:save` akzeptiert nur PNG/JPEG/BMP mit passender Signatur, zulässigen Dimensionen und maximal 128 MiB Übertragung. Der Name wird auf Windows-Reservierungen und unerlaubte Zeichen geprüft. Der vom Speicherdialog bestätigte Zielpfad wird nicht nachträglich umbenannt. Eine widersprechende Dateiendung wird abgelehnt. Schreiben erfolgt in eine exklusive temporäre Datei im Zielordner, inklusive `fsync`, danach Umbenennen/Ersetzen. Fehlgeschlagene Schreib-/Ersetzoperationen entfernen die temporäre Datei und erhalten die alte Zieldatei.

Erst `status: saved` setzt den Änderungsstatus zurück. Ein monotoner Revisionszähler verhindert, dass ein während des Exports fortgeschriebener Entwurf fälschlich als gespeichert gilt. Aktive Effektvorschauen gehören zum Export; die Vorschau selbst bleibt unverändert. Native Clipboard-IPC überträgt PNG; bei Fehler bleibt die interne Kopie verfügbar. Es wird keine Zwischenablage im Hintergrund überwacht.

## Profile und Lebenszyklus

Portable: `Pixelwerk/data` neben der EXE. Installiert: `%LOCALAPPDATA%/Pixelwerk`. Entwicklung: `.dev-data` im Projekt. `userData`, `sessionData`, Logs, Crashdump-Ziel und Diskcache-Ziel werden vor dem Electron-Ready-Ereignis gesetzt. Die Anwendung nutzt eine Session im Arbeitsspeicher und deaktiviert HTTP-Diskcache. Nur die Sprache wird explizit als Einstellung gespeichert. Schreibschutz wird beim Start kontrolliert gemeldet, ohne Ausweichen auf ein anderes Profil. OS-eigene Ausführungs-/Antivirus-/Schriftcaches können außerhalb des Profilordners entstehen und sind keine Pixelwerk-Konfiguration.

Ein Schließversuch fordert mit einem einmaligen Token den aktuellen Rendererzustand an. Der Renderer beendet Gesten und bündelt offene Eigenschaftsänderungen vor der Antwort. Bei Änderungen erscheinen Abbrechen, Speichern unter… und bewusstes Verwerfen. Speichern hält das Fenster offen. Bei fehlender Rendererantwort nach sechs Sekunden wird ein gesonderter Verlusthinweis gezeigt; es erfolgt kein stilles Schließen. Ein zweiter Start derselben Profilinstanz aktiviert das vorhandene Fenster und übergibt dessen Dateipfade an die Importwarteschlange.

## Agentenadapter

Lokal im Renderer: `window.PixelwerkAgent.list()` und `window.PixelwerkAgent.invoke(name, input)`.
Vier Originalverträge: `get_editor_state`, `select_editor_tool`, `set_active_layer_position`, `resize_image`. Zustand enthält ausschließlich Metadaten. Eingaben, Zusatzfelder, Grenzen, Lebenszyklus und Gestenstatus werden geprüft. Änderungen nutzen dieselben Editorfunktionen wie die Oberfläche und unterstützen Undo. Eine tatsächlich vorhandene `document.modelContext.registerTool`-API wird verwendet; ohne Host läuft der Editor unverändert. Sprachwechsel registriert lokalisierte Metadaten neu und beendet die vorige Registrierung. Kein Netzwerk-/MCP-Server, keine behauptete ChatGPT-Hostintegration.

## Build

Empfohlen: sauberer Windows-x64-Rechner mit Node.js 24 und npm. `npm ci` verwendet `package-lock.json`. Alle direkten Abhängigkeiten sind exakt gepinnt. `npm run dist:win` baut zuerst die portable Ordnerausgabe, danach NSIS aus denselben Quellen. Jeder Pakettyp wird in einem eigenen Buildprozess erstellt, damit zwischengespeicherte Builder-Konfigurationen keine Profilkennung übertragen. Vor Übernahme jedes Artefakts werden dessen Modus und Version geprüft. Keine nativen Node-Zusatzmodule. Der Linux-Crossbuild verwendet die in electron-builder gepinnten Werkzeuge; NSIS 3.12 ist über Toolset 1.2.1 festgelegt. Der Linux-Build extrahiert den kompilierten Uninstaller mit dem mitgelieferten electron-builder-UninstallerReader, wie dessen macOS-Buildpfad. Dafür wird kein Windows-Programm ausgeführt; der schmale Hook in scripts/nsis-crossbuild.cjs ist an app-builder-lib 26.18.0 gebunden. Windows-Builds nutzen den unveränderten Standardpfad. Die Runtime-ZIP, Buildwerkzeuge und Pakete werden nur beim Build heruntergeladen.

Portable enthält einen Stammordner Pixelwerk mit EXE, vollständiger Runtime, Lizenzen und Anleitung. Setup ist ein vollständiges Offline-NSIS-Setup, per user und ohne Elevation; Desktop-Link optional, Startmenüeintrag und Uninstaller vorhanden. Die App-ID `click.perplex.pixelwerk` bleibt für Updates stabil. `build/file-associations.nsh` registriert PNG/JPG/JPEG/BMP ausschließlich unter
HKCU mit dem stabilen ProgID `Pixelwerk.Image`, `OpenWithProgids`,
`Applications/Pixelwerk.exe/SupportedTypes` und `RegisteredApplications`/Capabilities.
Der Öffnungsbefehl quotiert EXE und `%1`. Bei Updates bleibt der ProgID erhalten;
beim Entfernen werden nur Einträge dieser Installation gelöscht. Geschützte
`UserChoice`-Einträge und fremde Standardzuordnungen werden nicht geschrieben.
Die letzte Setup-Konfigurationsseite startet die Windows-Standard-App-Einstellungen:
Windows 11 ab Build 22000 mit `registeredAppUser=Pixelwerk`, Windows 10 allgemein.
Die tatsächliche Standardwahl muss der Benutzer in der Windows-Oberfläche bestätigen.
Es gibt keinen Updater. Der Installer behält das Profil bei. Eine beim Packen erzeugte exakte Dateiliste steuert die Deinstallation: nur Programmdateien werden entfernt, niemals rekursiv der ganze Installationsordner. Unbekannte Dateien und Nutzerbilder bleiben auch innerhalb dieses Ordners erhalten.

Für schnellere lokale Builds kann `ELECTRON_BUILDER_COMPRESSION_LEVEL=1` gesetzt werden; das ändert nur die Archivkompression. Releaseberichte dokumentieren die verwendeten Einstellungen. Byte-identische Builds werden nicht versprochen: Werkzeugversionen, Inputs, Paketinhalt, Funktion und Prüfsummen sind nachvollziehbar.

## Quellen zur Laufzeitwahl

- Electron 45.3.2, veröffentlicht 12.11.2026: https://releases.electronjs.org/release/v45.3.2
- Plattformunterstützung Windows 10 und neuer, x64: https://github.com/electron/electron/blob/main/README.md
- Electron-Supportpolitik (drei neueste stabile Hauptversionen): https://www.electronjs.org/docs/latest/tutorial/electron-timelines
- Electron-Sicherheitskonfiguration: https://www.electronjs.org/docs/latest/tutorial/security
- electron-builder NSIS und Crossbuild: https://www.electron.build/nsis/ und https://www.electron.build/multi-platform-build/

Abrufdatum: 15.11.2026. Plattformunterstützung des Herstellers ersetzt keinen Test auf konkreten Windows-Builds.

In stark eingeschränkten Linux-Umgebungen kann scripts/nsis-tmpdir.c als lokale Buildhilfe kompiliert werden. Sie lässt die von NSIS verwendete libc-Funktion tmpfile den expliziten TMPDIR-Ordner verwenden. Rechte und Sicherheitsprüfungen bleiben unverändert. Diese Hilfe gehört nicht zur Windows-Anwendung.

## Quellen zur Windows-Dateiübergabe und Standardwahl

- Electron Startargumente und second-instance: https://www.electronjs.org/docs/latest/api/app/
- Microsoft Standard-App-Plattform und verpflichtende System-UI: https://learn.microsoft.com/en-us/windows/apps/develop/windows-integration/default-apps-platform
- Microsoft Default-App-Registrierung: https://learn.microsoft.com/en-us/windows/win32/shell/default-programs
- Microsoft Settings-Deep-Link: https://learn.microsoft.com/en-us/windows/apps/develop/launch/launch-default-apps-settings
