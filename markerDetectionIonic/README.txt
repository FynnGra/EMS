1) Erstellt eine leere ionic blank App
	-> $ ionic start markerDetection blank

2) Ersetzt den "www Ordner" mit dem aus github.

3) Wechselt über die Console in das Verzeichnis in dem das Projekt liegt
   Bsp: C:\Users\Username\markerDetection>
        -> $ ionic platform add android
	   $ ionic build android

4) Geht unter ..\markerDetection\platforms\android\AndroidManifest.xml und
   fügt ein:
	-> <uses-permission android:name="android.permission.CAMERA" />

5) Führt die App über Browser aus mit Consolenbefehl
	-> ionic serve




