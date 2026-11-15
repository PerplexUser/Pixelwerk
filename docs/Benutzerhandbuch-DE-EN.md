# Pixelwerk 5.0.1 für Windows

© by www.perplex.click · Windows x64 · Unsigned / Unsigniert

## Deutsch

**Portable:** ZIP vollständig in einen beschreibbaren Ordner entpacken. Im Ordner
`Pixelwerk` die `Pixelwerk.exe` starten. Alle Dateien zusammenlassen. Die App
benötigt weder Browser noch Internet, Webserver, Konto oder Administratorrechte.
Sprache und Laufzeitprofil liegen im Unterordner `data`. Den gesamten Ordner
kannst du verschieben oder auf einen USB-Stick kopieren. Ist der Profilordner
schreibgeschützt, startet die App mit einer Fehlermeldung nicht weiter.

**Installation:** `Pixelwerk-5.0.1-Windows-x64-Setup.exe` starten. Installation
für den aktuellen Benutzer, standardmäßig im Benutzerprogrammordner. Das Setup
enthält die Laufzeit vollständig. Ein Startmenüeintrag wird angelegt; eine
Desktop-Verknüpfung ist optional. Ein neueres Setup aktualisiert dieselbe App.
Es gibt keine automatische Updatesuche. Das Profil liegt unter
`%LOCALAPPDATA%\Pixelwerk`. Unter Windows „Installierte Apps“ regulär deinstallieren.
Der Uninstaller entfernt ausschließlich die mitgelieferten Programmdateien.
Eigene Bilder, Exporte und das Benutzerprofil bleiben erhalten. Auch fremde
Dateien im Programmordner werden nicht rekursiv gelöscht.

**Dateizuordnung:** Das Setup registriert Pixelwerk für `.png`, `.jpg`, `.jpeg` und `.bmp`.
Nach der Installation öffnet der Schritt „Pixelwerk als Standard-App“ die
Windows-Einstellungen. Dort Pixelwerk für diese vier Endungen auswählen und die
Windows-Bestätigung abschließen. Unter Windows 10 „Standard-Apps nach Dateityp
 auswählen“ verwenden; unter aktuellem Windows 11 öffnet sich direkt die Seite
für Pixelwerk. Windows erlaubt keine stille Änderung einer bestehenden Standard-App.
Die portable Ausgabe kann über „Öffnen mit > Andere App auswählen“ zugewiesen werden.
Danach öffnen Doppelklick und „Öffnen mit“ das Bild beim Start oder im bereits
laufenden Pixelwerk. Ungespeicherte Änderungen werden vor dem Ersetzen abgefragt.
Bei „Speichern unter…“ bleibt der Entwurf geöffnet; anschließend das neue Bild
erneut öffnen. Bei mehreren Startdateien wird jede nacheinander geöffnet, die
zuletzt geöffnete bleibt sichtbar.

**Start:** Bild öffnen (PNG/JPG/BMP), auf die Arbeitsfläche ziehen, mit Strg+V
einfügen oder „Neue Leinwand“ wählen. Weitere Drops und Zwischenablagebilder
werden Ebenen; „Bild hinzufügen“ erlaubt mehrere Dateien. Ein einzelnes Bild
darf höchstens 80 MiB, 8192 Pixel je Seite und insgesamt 20 Millionen Pixel haben.

**Werkzeuge:** V Verschieben, M Auswahl, C Zuschneiden, B Pinsel, A Sprühdose,
D Schmierfinger, H Textmarker, L Linie, P Pfeil, U Formen, E Radierer,
G Fülleimer, I Pipette, T Text, R Hintergrundradierer, S Sticker.
Die Sprühdose malt auch ohne Bewegung. Linie mit zwei Klicks; Escape verwirft
Vorschauen. Beim Schmieren und Radieren werden Text und Sticker zu Pixeln;
Rückgängig stellt ihre Bearbeitbarkeit wieder her. Marker, Pfeil und Formen
entstehen auf eigenen Ebenen. Der Hintergrundradierer entfernt ähnliche Farben.
Alle 72 Sticker der Vorlage sind enthalten.

Im Inspektor Werkzeuge konfigurieren, Ebenen sortieren, ein-/ausblenden,
duplizieren und ihre Deckkraft ändern oder Effekte einstellen. Effekte erscheinen
als Vorschau bis „Anwenden“. Text bleibt bis zur Rasterisierung editierbar.
Verschieben an Ecken skaliert proportional; Umschalt erlaubt freie Proportionen.
Pfeiltasten verschieben 1 Pixel, mit Umschalt 10 Pixel. Entf löscht die aktive Ebene.
Mit [ und ] die Werkzeuggröße ändern. „Bildgröße“ skaliert alle Ebenen.

**Zwischenablage:** Strg+C kopiert die Auswahl oder die gesamte sichtbare
Komposition. Strg+V fügt ein Windows-Bild als Ebene ein. Scheitert der Zugriff,
bleibt die interne Bildkopie erhalten, auch beim Öffnen eines anderen Dokuments.
In Textfeldern haben die normalen Text-Tastenkürzel Vorrang.

**Speichern:** „Speichern unter…“, Strg+S oder Strg+Umschalt+S öffnet Vorschau, Format und Dateiname.
„Speichern“ öffnet den Windows-Dialog. PNG bewahrt Transparenz; JPG und BMP
verwenden Weiß. JPG-Qualität ist einstellbar. Abbruch/Schreibfehler lassen den
Entwurf unverändert. Erst bestätigtes Schreiben markiert ihn als gespeichert.
Bei Schließen/Ersetzen warnt die App vor ungespeicherten Änderungen. Wähle
Abbrechen, Speichern unter… oder Änderungen verwerfen. Speichern schließt die App
nicht automatisch.

**Wichtig:** PNG/JPG/BMP sind fertige Bilder, keine editierbaren Projekte.
Ebenen, Texte und Undo-Verlauf werden nicht separat gespeichert. Kein Autosave,
keine Cloud, keine Telemetrie. Bilder bleiben bis zum expliziten Speichern im RAM.
Strg+Z macht rückgängig; Strg+Y / Strg+Umschalt+Z wiederholt. Der Verlauf hält
höchstens 25 Zustände, mit ca. 192 MiB Zielgrenze und mindestens zwei Zuständen.
DE/EN wechselt jederzeit die Oberfläche und wird für die nächste Sitzung gespeichert.

## English

**Portable:** Extract the complete ZIP into a writable folder, then run
`Pixelwerk/Pixelwerk.exe`. Keep all runtime files together. No browser, network,
server, account or administrator access is required. The `data` subfolder holds
language preferences and runtime profile. Move the entire folder, including to
a USB drive. A read-only profile produces an explicit startup error.

**Setup:** Run the Setup EXE. Installation is per user, with a Start menu entry
and an optional desktop shortcut. The runtime is bundled for offline use.
A newer Setup updates the same app; there are no automatic update checks.
Settings are stored in `%LOCALAPPDATA%\Pixelwerk`. Uninstall using Windows
Installed Apps. The uninstaller removes only the files supplied with the program. Personal
images, exports and the profile remain intact, including extra files stored
inside the installation directory.

**File associations:** Setup registers `.png`, `.jpg`, `.jpeg` and `.bmp` for
Pixelwerk. Its final configuration step opens Windows Settings, where you select
Pixelwerk for all four extensions. Windows 10 uses Choose default apps by file
type; current Windows 11 opens Pixelwerk's own default-app page. Windows requires
user confirmation and does not permit silent default-app changes. For the portable
edition, use Open with > Choose another app. Double-clicking now loads the image
both on startup and in an already-running window. Unsaved work is protected.
Choosing Save as keeps the draft open; reopen the requested image after saving.
Multiple launch files open in order, leaving the last one visible.

**Editing:** Open or drop PNG/JPG/BMP images, paste with Ctrl+V, or create a new
canvas. Additional drops/pastes create layers. Use Add image for multiple files.
Limits: 80 MiB per imported file, 8192 pixels per side, 20 million pixels total.

Tools: V Move, M Select, C Crop, B Brush, A Airbrush, D Smear, H Highlighter,
L Line, P Arrow, U Shapes, E Eraser, G Fill, I Eyedropper, T Text,
R Background eraser, S Stickers (72 original designs). Configure tools, layers
and effects in the inspector. Effects preview until applied. Smearing/erasing
rasterizes text; Undo restores editable text. Highlighter, arrow and shapes use
separate layers. Line uses two clicks; Escape cancels previews. Airbrush keeps
painting while held still. Drag layer corners to scale; Shift unlocks proportions.
Arrow keys move 1 pixel, Shift+arrows 10 pixels; Delete removes the active layer.
[ and ] adjust tool size. Image size scales every layer.

**Clipboard:** Ctrl+C copies the selection or visible composition. Ctrl+V pastes
Windows image data as a layer. If system access fails, the internal image copy
remains available, even after switching documents. Text inputs keep normal
copy/paste shortcuts.

**Saving:** Save as / Ctrl+S / Ctrl+Shift+S shows a preview, filename and PNG/JPG/BMP choices.
Save opens the Windows dialog. PNG retains alpha; JPG and BMP flatten against
white. JPEG quality is adjustable. Cancellation and write failures retain the
unsaved state. Only a completed write confirms saving. Closing or replacing an
unsaved draft offers Cancel, Save as or Discard. Saving keeps the window open.

**No project format or autosave:** Exports are flattened pictures. Editable
layers, text and undo history remain in memory only. No cloud or telemetry.
Ctrl+Z undoes; Ctrl+Y / Ctrl+Shift+Z redoes. History retains up to 25 states with
a roughly 192 MiB target and at least two states. DE/EN switches language at
any time; the preference persists for the next session.
