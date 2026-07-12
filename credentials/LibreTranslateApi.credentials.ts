import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class LibreTranslateApi implements ICredentialType {
  name = 'libreTranslateApi';

  displayName = 'LibreTranslate API';

  icon = {
    light: 'file:../icons/libretranslate.svg',
    dark: 'file:../icons/libretranslate.dark.svg',
  } as const;

  documentationUrl = 'https://libretranslate.com/docs/';

  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://libretranslate.com',
      description: "URL de l'instance LibreTranslate (officielle ou auto-hébergée)",
      required: true,
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description:
        "Clé API LibreTranslate. Laisser vide si l'instance ciblée n'en requiert pas.",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      qs: {
        api_key: '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/languages',
      method: 'GET',
    },
  };
}
