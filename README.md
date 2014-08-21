piTemp
======
Anwendung zur Temperaturmessung mit Hilfe von NodeJS Serveranwendung auf einem RaspberryPi.
Unterstützt 1w ds18b20-Sensor und Abfrage per serieller Schnittstelle.

Files
-----
* server.js - Anzeige und Konfiguration
* temp.py - Python Script für serielle Abfrage
* get.htm - "missbrauchte" get-Methoden Hilfsseite
* load_gpio.sh - Script um Kernel Module laden

References
----------
auf Basis von:
https://github.com/talltom/PiThermServer

NodeJS auf RaspberryPi:
http://jankarres.de/2013/07/raspberry-pi-node-js-installieren/