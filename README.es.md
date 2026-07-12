# n8n-nodes-libretranslate-api

Nodo comunitario de n8n para la API de [LibreTranslate](https://libretranslate.com/docs/), una API de traducción automática libre y de código abierto (AGPL-3.0).

[n8n](https://n8n.io/) es una plataforma de automatización de flujos de trabajo con [licencia fair-code](https://docs.n8n.io/reference/license/).

Otros idiomas: [English](README.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

[Instalación](#instalación)
[Operaciones](#operaciones)
[Credenciales](#credenciales)
[Compatibilidad](#compatibilidad)
[Recursos](#recursos)
[Historial de versiones](#historial-de-versiones)
[Desarrollo](#desarrollo)

## Instalación

Sigue la [guía de instalación](https://docs.n8n.io/integrations/community-nodes/installation/) de la documentación de nodos comunitarios de n8n, e instala el paquete `n8n-nodes-libretranslate-api`.

## Operaciones

- **Translate Text** — traduce un texto (`POST /translate`), con opción de idioma de origen (o detección automática), idioma de destino, formato (texto/HTML) y número de traducciones alternativas.
- **Detect Language** — detecta el idioma de un texto (`POST /detect`).
- **List Languages** — lista los idiomas y pares de traducción disponibles en la instancia (`GET /languages`).
- **Translate File** — traduce un archivo binario (`POST /translate_file`), leído desde una propiedad binaria del elemento de entrada.
- **Suggest Translation** — envía una mejora de traducción (`POST /suggest`).

Las listas de idiomas (origen/destino) se cargan dinámicamente desde la instancia configurada mediante `GET /languages`.

## Credenciales

El tipo de credencial `LibreTranslate API` incluye:

- **Base URL** (obligatorio) — URL de la instancia de LibreTranslate, por ejemplo `https://libretranslate.com` o la URL de una instancia autoalojada.
- **API Key** (opcional) — clave API, solo necesaria si la instancia de destino la requiere. Se envía como parámetro de consulta en cada llamada, tal como espera la API de LibreTranslate.

## Compatibilidad

Construido con `n8n-workflow` ^2.16, requiere Node.js >=20.15. Probado con la API de LibreTranslate v1.9.x.

## Recursos

- [Documentación de nodos comunitarios de n8n](https://docs.n8n.io/integrations/#community-nodes)
- [Documentación de la API de LibreTranslate](https://libretranslate.com/docs/)
- [Repositorio de LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)

## Historial de versiones

- 0.1.0 — versión inicial: Translate Text, Detect Language, List Languages, Translate File, Suggest Translation.

## Desarrollo

```bash
npm install
npm run build
npm run lint
```

### Probar localmente en n8n

```bash
npm run build
npm link
cd ~/.n8n/custom   # o la carpeta custom de tu instancia de n8n
npm link n8n-nodes-libretranslate-api
```

Luego reinicia n8n. El nodo «LibreTranslate» aparecerá en la lista de nodos.
