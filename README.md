# n8n-nodes-libretranslate-api

n8n community node for the [LibreTranslate](https://libretranslate.com/docs/) API, a free and open source (AGPL-3.0) machine translation API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

Other languages: [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md)

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)
[Version history](#version-history)
[Development](#development)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation, and install the `n8n-nodes-libretranslate-api` package.

## Operations

- **Translate Text** — translates a text (`POST /translate`), with a choice of source language (or automatic detection), target language, format (text/HTML), and number of alternative translations.
- **Detect Language** — detects the language of a text (`POST /detect`).
- **List Languages** — lists the languages and translation pairs available on the instance (`GET /languages`).
- **Translate File** — translates a binary file (`POST /translate_file`), read from a binary property of the input item.
- **Suggest Translation** — submits a translation improvement (`POST /suggest`).

Source/target language lists are loaded dynamically from the configured instance via `GET /languages`.

## Credentials

The `LibreTranslate API` credential type has:

- **Base URL** (required) — the LibreTranslate instance URL, e.g. `https://libretranslate.com` or a self-hosted instance URL.
- **API Key** (optional) — API key, only needed if the target instance requires one. It is sent as a query parameter on each call, as expected by the LibreTranslate API.

## Compatibility

Built against `n8n-workflow` ^2.16, requires Node.js >=20.15. Tested against LibreTranslate API v1.9.x.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [LibreTranslate API documentation](https://libretranslate.com/docs/)
- [LibreTranslate repository](https://github.com/LibreTranslate/LibreTranslate)

## Version history

- 0.1.0 — initial release: Translate Text, Detect Language, List Languages, Translate File, Suggest Translation.

## Development

```bash
npm install
npm run build
npm run lint
```

### Testing locally in n8n

```bash
npm run build
npm link
cd ~/.n8n/custom   # or your n8n instance's custom folder
npm link n8n-nodes-libretranslate-api
```

Then restart n8n. The "LibreTranslate" node appears in the nodes list.
