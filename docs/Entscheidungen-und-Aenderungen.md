# Entscheidungen und Änderungen

Stand 15.11.2026. Die Umsetzung folgt der beauftragten Anforderungsanalyse und dem Pflichtenheft. Die Dokumente erlauben die Abgabe mit getrennt ausgewiesenem Build-/Teststatus, wenn keine Windows-Ausführung oder Signierung verfügbar ist.

| Entscheidung | Umsetzung |
|---|---|
| D-01 Plattform | Windows 10 22H2 / Windows 11, x64 als Ziel. ARM64/x86 nicht enthalten. Herstellerkompatibilität geprüft; reale Windows-Abnahme steht aus. |
| D-02 Portable | Vollständige Ordner-ZIP mit Pixelwerk.exe und Runtime; explizite Modusdatei, Profil relativ zur EXE. |
| D-03 Erweiterungen | Kein Projektformat, Autosave, Cloud, Konto, Rotationswerkzeug, KI oder automatische Updates hinzugefügt. |
| D-04 Signatur | Kein Zertifikat geliefert. Ausgaben ausdrücklich unsigniert; keine SmartScreen-Zusage. |
| D-05 Installation | Per-user-Setup ohne Standard-Administratoranforderung; Startmenü und optionaler Desktop-Link. |
| D-06 Architektur | Electron mit vollständigem Originaleditor und schmaler Preload-Brücke. |
| Produktmetadaten | Pixelwerk 5.0.1; App-ID click.perplex.pixelwerk; ursprünglicher Copyright-Inhaber beibehalten. Diese Angaben ersetzen keine Vertriebsrechtsfreigabe. |

## Bewusst dokumentierte Fehlerkorrekturen

| Befund der Referenz | Korrektur und Nachweis |
|---|---|
| Neue Leinwand rundet Dezimalwerte stillschweigend | Werte werden vor Mutation als positive ganze Pixelzahlen geprüft. Browser-Grenztest. |
| Browserdownload setzt den Entwurf sofort auf gespeichert | Native Schreibbestätigung nach temporärem Schreiben, Sync und Ersetzen; Abbruch/Fehler bewahren dirty. Datei-/IPC-/Browsertests. |
| Änderungen innerhalb des 600-ms-Eigenschaftspuffers können noch als sauber gelten | Änderungen markieren dirty sofort; vor Ersetzen und Schließen werden Gesten und Puffer abgeschlossen. |
| Neue leere Leinwand wird durch clearDocument als sauber behandelt | Eine neue Leinwand und ein neues Clipboard-Dokument gelten bis zum erfolgreichen Export als ungespeichert. |
| Referenz bestätigt Ersetzen vor Auswahl/Dekodierung | Erst Datei auswählen und vollständig prüfen, dann bestehenden Entwurf nach ausdrücklichem Verwerfen ersetzen. Ungültige Dateien lassen ihn erhalten. |
| Effektvorschau kann noch auf einen Animationsframe warten | Export berechnet die ausstehenden Effekte vor dem Snapshot synchron; der Vorschauzustand bleibt erhalten. |
| Ein älterer asynchroner Export kann neuere Änderungen als gespeichert markieren | Revisions- und Effektzustand müssen beim Schreibabschluss noch zum Snapshot passen. Browser-Race-Test. |
| Agentenzustand hat ein leeres Schema, validiert aber keine Zusatzfelder | Der extrahierte Adapter validiert alle vier Verträge einschließlich leerer Eingaben, unbekannter Felder, Zahlen und Lebenszyklus. |
| Host fehlt in gewöhnlicher Desktop-Laufzeit | Lokal aufrufbarer Registry-Adapter; optionaler Originalhost weiterhin unterstützt. Mock-Host und hostloser Modus geprüft. |

Keine Änderungen an `core.js`, der Stickerliste oder `style.css`. Der Header-Parser ist eine vorgelagerte Sicherheitsprüfung, keine neue Bilddekodierung. Pixelvergleiche erfolgen mit identischer Browserengine auf denselben Fixtures; Schrift-/GPU-/DPI-Unterschiede unter Windows müssen dort visuell abgenommen werden.

## Nachbesserung 5.0.1 nach Nutzertest

- Windows-Dateipfade aus Kaltstart und weiteren Instanzen werden zuverlässig an den bereiten Editor übergeben; native Dialoge und bestehende Importe werden abgewartet.
- „Exportieren“ heißt jetzt „Speichern unter…“; Dialoge, Hilfetexte und Englisch verwenden dieselbe Speicherterminologie. PNG, JPG und BMP sowie JPG-Qualität bleiben auswählbar.
- Setup registriert PNG/JPG/JPEG/BMP als unterstützte Typen und führt zur Windows-Standardwahl. Ein stilles Erzwingen wurde nicht implementiert: Microsoft schreibt die Auswahl in der Windows-Systemoberfläche vor.
- Der Nutzer hat die vorherige Ausgabe ausführlich praktisch getestet und positiv bewertet; dies ersetzt keine dokumentierte Windows-Abnahme der neuen Funktionen.
