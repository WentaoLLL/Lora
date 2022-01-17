# Lora

Projekt: <Entwicklung einer auf LoraWAN basierten Erkennungs- und Webanwendung für häusliches Zähler>

Verschiedene Sensoren werden verwendet, um Werte von Strom-, Gas- und Wasserzählern zu sammeln. Über LoRa WAN werden dann die Messdaten von Zählern an das Gateway weitergegeben. Installierte Hardwaregeräte ermöglichen es den Sensoren, Echtzeitdaten an die Webanwendung zu senden. Energieversorger und Kunden können verschiedene Datenänderungen auf der Webanwendung beobachten.

In diesem Projekt wird eine interaktive Website für die Datenanzeige auf der Basis von Node.js erstellt, die drei Benutzertypen umfasst: Administratoren, Mitarbeiter und Kunden. Unter diesen hat der Administrator die Berechtigung, andere Benutzerkonten und zugehörige Daten zu löschen und zu verwalten, und das Personal hat die Berechtigung, die Korrelation zwischen Tabellen und Adressen zu erhöhen, und das Kundenkonto kann nur den Inhalt zugehöriger Daten anzeigen und den Vorgang nicht löschen oder ändern. Die Datenstruktur besteht aus Wirtschaftseinheit, Objekt, Verwaltungseinheit, Elementen (Gas, Sturm, Wasser, Wärme und Zählerstand), und jedes Element ist mit einer bestimmten Tabellen-ID verbunden.

Ein auf LoraWAN basierte Datenübertragungskanal wurde zwischen den Lora-Zählern und der Webanwendung aufgebaut. Eine basierte auf Node.JS, EJS und MongoDB Webanwendung wurde bereitgestellt. Dann wurde Docker als Kontainer der Webanwendung und Echarts.JS als Diagramm-Tool benutzt.
