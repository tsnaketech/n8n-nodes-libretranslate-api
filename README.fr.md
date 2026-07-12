# n8n-nodes-libretranslate-api

Nœud communautaire n8n pour interroger l'API [LibreTranslate](https://libretranslate.com/docs/), une API de traduction automatique libre et open source (AGPL-3.0).

[n8n](https://n8n.io/) est une plateforme d'automatisation de workflows sous [licence fair-code](https://docs.n8n.io/reference/license/).

Autres langues : [English](README.md) · [Español](README.es.md) · [Deutsch](README.de.md)

[Installation](#installation)
[Opérations](#opérations)
[Credentials](#credentials)
[Compatibilité](#compatibilité)
[Ressources](#ressources)
[Historique des versions](#historique-des-versions)
[Développement](#développement)

## Installation

Suivez le [guide d'installation](https://docs.n8n.io/integrations/community-nodes/installation/) de la documentation n8n sur les nœuds communautaires, et installez le package `n8n-nodes-libretranslate-api`.

## Opérations

- **Translate Text** — traduit un texte (`POST /translate`), avec choix de la langue source (ou détection automatique), de la langue cible, du format (texte/HTML) et du nombre de traductions alternatives.
- **Detect Language** — détecte la langue d'un texte (`POST /detect`).
- **List Languages** — liste les langues et paires de traduction disponibles sur l'instance (`GET /languages`).
- **Translate File** — traduit un fichier binaire (`POST /translate_file`), à partir d'une propriété binaire de l'item d'entrée.
- **Suggest Translation** — propose une amélioration de traduction (`POST /suggest`).

Les listes de langues (source/cible) sont chargées dynamiquement depuis l'instance configurée via `GET /languages`.

## Credentials

Le type de credential `LibreTranslate API` comprend :

- **Base URL** (requis) — URL de l'instance LibreTranslate, par exemple `https://libretranslate.com` ou l'URL d'une instance auto-hébergée.
- **API Key** (optionnel) — clé API, à renseigner uniquement si l'instance ciblée en exige une. Elle est transmise en paramètre de requête à chaque appel, comme attendu par l'API LibreTranslate.

## Compatibilité

Construit avec `n8n-workflow` ^2.16, nécessite Node.js >=20.15. Testé contre l'API LibreTranslate v1.9.x.

## Ressources

- [Documentation des nœuds communautaires n8n](https://docs.n8n.io/integrations/#community-nodes)
- [Documentation de l'API LibreTranslate](https://libretranslate.com/docs/)
- [Dépôt LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)

## Historique des versions

- 0.1.0 — version initiale : Translate Text, Detect Language, List Languages, Translate File, Suggest Translation.

## Développement

```bash
npm install
npm run build
npm run lint
```

### Tester localement dans n8n

```bash
npm run build
npm link
cd ~/.n8n/custom   # ou le dossier custom de votre installation n8n
npm link n8n-nodes-libretranslate-api
```

Puis redémarrez n8n. Le nœud « LibreTranslate » apparaît dans la liste des nœuds.
