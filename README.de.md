# n8n-nodes-libretranslate-api

n8n-Community-Node für die [LibreTranslate](https://libretranslate.com/docs/)-API, eine freie und quelloffene (AGPL-3.0) Maschinenübersetzungs-API.

[n8n](https://n8n.io/) ist eine Workflow-Automatisierungsplattform unter [Fair-Code-Lizenz](https://docs.n8n.io/reference/license/).

Andere Sprachen: [English](README.md) · [Français](README.fr.md) · [Español](README.es.md)

[Installation](#installation)
[Operationen](#operationen)
[Credentials](#credentials)
[Kompatibilität](#kompatibilität)
[Ressourcen](#ressourcen)
[Versionsverlauf](#versionsverlauf)
[Entwicklung](#entwicklung)

## Installation

Folgen Sie dem [Installationsleitfaden](https://docs.n8n.io/integrations/community-nodes/installation/) in der n8n-Dokumentation für Community-Nodes und installieren Sie das Paket `n8n-nodes-libretranslate-api`.

## Operationen

- **Translate Text** — übersetzt einen Text (`POST /translate`), mit Auswahl der Quellsprache (oder automatischer Erkennung), der Zielsprache, des Formats (Text/HTML) und der Anzahl alternativer Übersetzungen.
- **Detect Language** — erkennt die Sprache eines Textes (`POST /detect`).
- **List Languages** — listet die auf der Instanz verfügbaren Sprachen und Übersetzungspaare (`GET /languages`).
- **Translate File** — übersetzt eine Binärdatei (`POST /translate_file`), gelesen aus einer Binäreigenschaft des Eingabe-Items.
- **Suggest Translation** — sendet einen Verbesserungsvorschlag für eine Übersetzung (`POST /suggest`).

Die Sprachlisten (Quelle/Ziel) werden dynamisch von der konfigurierten Instanz über `GET /languages` geladen.

## Credentials

Der Credential-Typ `LibreTranslate API` umfasst:

- **Base URL** (erforderlich) — URL der LibreTranslate-Instanz, z. B. `https://libretranslate.com` oder die URL einer selbst gehosteten Instanz.
- **API Key** (optional) — API-Schlüssel, nur erforderlich, wenn die Ziel-Instanz einen solchen verlangt. Er wird bei jedem Aufruf als Query-Parameter gesendet, wie von der LibreTranslate-API erwartet.

## Kompatibilität

Erstellt mit `n8n-workflow` ^2.16, erfordert Node.js >=20.15. Getestet mit LibreTranslate API v1.9.x.

## Ressourcen

- [n8n-Dokumentation zu Community-Nodes](https://docs.n8n.io/integrations/#community-nodes)
- [LibreTranslate-API-Dokumentation](https://libretranslate.com/docs/)
- [LibreTranslate-Repository](https://github.com/LibreTranslate/LibreTranslate)

## Versionsverlauf

- 0.1.0 — Erstveröffentlichung: Translate Text, Detect Language, List Languages, Translate File, Suggest Translation.

## Entwicklung

```bash
npm install
npm run build
npm run lint
```

### Lokal in n8n testen

```bash
npm run build
npm link
cd ~/.n8n/custom   # oder der custom-Ordner Ihrer n8n-Instanz
npm link n8n-nodes-libretranslate-api
```

Starten Sie n8n anschließend neu. Der Node „LibreTranslate“ erscheint in der Node-Liste.
