import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

interface LibreTranslateCredentials {
	baseUrl: string;
	apiKey?: string;
}

async function libreTranslateRequest<T = IDataObject>(
	context: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<T> {
	const credentials = await context.getCredentials<LibreTranslateCredentials>('libreTranslateApi');
	const baseUrl = credentials.baseUrl.replace(/\/+$/, '');

	return context.helpers.httpRequestWithAuthentication.call(context, 'libreTranslateApi', {
		method,
		url: `${baseUrl}${endpoint}`,
		body: method === 'GET' ? undefined : body,
		json: true,
	}) as Promise<T>;
}

function buildMultipartBody(
	fields: Record<string, string>,
	file: { fieldName: string; filename: string; contentType: string; data: Buffer },
): { body: Buffer; contentType: string } {
	const boundary = `n8nLibreTranslate${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
	const parts: Buffer[] = [];

	for (const [key, value] of Object.entries(fields)) {
		parts.push(
			Buffer.from(
				`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`,
				'utf-8',
			),
		);
	}

	parts.push(
		Buffer.from(
			`--${boundary}\r\nContent-Disposition: form-data; name="${file.fieldName}"; filename="${file.filename}"\r\nContent-Type: ${file.contentType}\r\n\r\n`,
			'utf-8',
		),
	);
	parts.push(file.data);
	parts.push(Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8'));

	return { body: Buffer.concat(parts), contentType: `multipart/form-data; boundary=${boundary}` };
}

export class LibreTranslate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LibreTranslate',
		name: 'libreTranslate',
		icon: {
			light: 'file:../../icons/libretranslate.svg',
			dark: 'file:../../icons/libretranslate.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: "Traduire du texte ou des fichiers via l'API LibreTranslate",
		defaults: {
			name: 'LibreTranslate',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'libreTranslateApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'File', value: 'file' },
					{ name: 'Language', value: 'language' },
					{ name: 'Translation', value: 'translation' },
				],
				default: 'translation',
			},

			// ---------------- Resource: Translation ----------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['translation'] } },
				options: [
					{
						name: 'Suggest Translation',
						value: 'suggestTranslation',
						description: 'Proposer une amélioration de traduction',
						action: 'Suggest translation',
					},
					{
						name: 'Translate Text',
						value: 'translate',
						description: 'Traduire un texte',
						action: 'Translate text',
					},
				],
				default: 'translate',
			},

			// ---------------- Resource: Language ----------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['language'] } },
				options: [
					{
						name: 'Detect Language',
						value: 'detectLanguage',
						description: "Détecter la langue d'un texte",
						action: 'Detect language',
					},
					{
						name: 'List Languages',
						value: 'listLanguages',
						description: 'Lister les langues supportées',
						action: 'List languages',
					},
				],
				default: 'detectLanguage',
			},

			// ---------------- Resource: File ----------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['file'] } },
				options: [
					{
						name: 'Translate File',
						value: 'translateFile',
						description: 'Traduire un fichier binaire',
						action: 'Translate file',
					},
				],
				default: 'translateFile',
			},

			// ---------------- Translation: Translate Text ----------------
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				required: true,
				displayOptions: { show: { resource: ['translation'], operation: ['translate'] } },
				description: 'Texte à traduire',
			},
			{
				displayName: 'Source Language Name or ID',
				name: 'source',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getSourceLanguages' },
				default: 'auto',
				required: true,
				displayOptions: { show: { resource: ['translation'], operation: ['translate'] } },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Target Language Name or ID',
				name: 'target',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getLanguages' },
				default: '',
				required: true,
				displayOptions: { show: { resource: ['translation'], operation: ['translate'] } },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'HTML', value: 'html' },
					{ name: 'Text', value: 'text' },
				],
				default: 'text',
				displayOptions: { show: { resource: ['translation'], operation: ['translate'] } },
				description: 'Format du texte source',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['translation'], operation: ['translate'] } },
				options: [
					{
						displayName: 'Alternatives',
						name: 'alternatives',
						type: 'number',
						typeOptions: { minValue: 0 },
						default: 0,
						description: 'Nombre de traductions alternatives à retourner',
					},
				],
			},

			// ---------------- Translation: Suggest Translation ----------------
			{
				displayName: 'Original Text',
				name: 'q',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['translation'], operation: ['suggestTranslation'] } },
				description: 'Texte original',
			},
			{
				displayName: 'Suggested Translation',
				name: 's',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['translation'], operation: ['suggestTranslation'] } },
				description: 'Traduction proposée',
			},
			{
				displayName: 'Source Language Name or ID',
				name: 'source',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getLanguages' },
				default: '',
				required: true,
				displayOptions: { show: { resource: ['translation'], operation: ['suggestTranslation'] } },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Target Language Name or ID',
				name: 'target',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getLanguages' },
				default: '',
				required: true,
				displayOptions: { show: { resource: ['translation'], operation: ['suggestTranslation'] } },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},

			// ---------------- Language: Detect Language ----------------
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				required: true,
				displayOptions: { show: { resource: ['language'], operation: ['detectLanguage'] } },
				description: 'Texte dont la langue doit être détectée',
			},

			// ---------------- File: Translate File ----------------
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: { show: { resource: ['file'], operation: ['translateFile'] } },
				description: 'Nom de la propriété binaire contenant le fichier à traduire',
			},
			{
				displayName: 'Source Language Name or ID',
				name: 'source',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getSourceLanguages' },
				default: 'auto',
				required: true,
				displayOptions: { show: { resource: ['file'], operation: ['translateFile'] } },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Target Language Name or ID',
				name: 'target',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getLanguages' },
				default: '',
				required: true,
				displayOptions: { show: { resource: ['file'], operation: ['translateFile'] } },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	};

	methods = {
		loadOptions: {
			async getLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const languages = await libreTranslateRequest<Array<{ code: string; name: string }>>(
					this,
					'GET',
					'/languages',
				);

				return languages
					.map((language) => ({ name: language.name, value: language.code }))
					.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getSourceLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const languages = await libreTranslateRequest<Array<{ code: string; name: string }>>(
					this,
					'GET',
					'/languages',
				);

				const options = languages
					.map((language) => ({ name: language.name, value: language.code }))
					.sort((a, b) => a.name.localeCompare(b.name));

				return [{ name: 'Auto-Detect', value: 'auto' }, ...options];
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let response: IDataObject;

				if (operation === 'translate') {
					const text = this.getNodeParameter('text', i) as string;
					const source = this.getNodeParameter('source', i) as string;
					const target = this.getNodeParameter('target', i) as string;
					const format = this.getNodeParameter('format', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

					response = await libreTranslateRequest(this, 'POST', '/translate', {
						q: text,
						source,
						target,
						format,
						...additionalFields,
					});
				} else if (operation === 'detectLanguage') {
					const text = this.getNodeParameter('text', i) as string;

					const detections = await libreTranslateRequest<IDataObject[]>(this, 'POST', '/detect', {
						q: text,
					});

					response = { detections };
				} else if (operation === 'listLanguages') {
					const languages = await libreTranslateRequest<IDataObject[]>(this, 'GET', '/languages');

					response = { languages };
				} else if (operation === 'translateFile') {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const source = this.getNodeParameter('source', i) as string;
					const target = this.getNodeParameter('target', i) as string;

					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

					const { body, contentType } = buildMultipartBody(
						{ source, target },
						{
							fieldName: 'file',
							filename: binaryData.fileName ?? 'file',
							contentType: binaryData.mimeType || 'application/octet-stream',
							data: buffer,
						},
					);

					const credentials =
						await this.getCredentials<LibreTranslateCredentials>('libreTranslateApi');
					const baseUrl = credentials.baseUrl.replace(/\/+$/, '');

					response = (await this.helpers.httpRequestWithAuthentication.call(
						this,
						'libreTranslateApi',
						{
							method: 'POST',
							url: `${baseUrl}/translate_file`,
							body,
							headers: { 'Content-Type': contentType },
							json: true,
						},
					)) as IDataObject;
				} else if (operation === 'suggestTranslation') {
					const q = this.getNodeParameter('q', i) as string;
					const s = this.getNodeParameter('s', i) as string;
					const source = this.getNodeParameter('source', i) as string;
					const target = this.getNodeParameter('target', i) as string;

					response = await libreTranslateRequest(this, 'POST', '/suggest', {
						q,
						s,
						source,
						target,
					});
				} else {
					throw new NodeOperationError(this.getNode(), `Opération inconnue : "${operation}"`, {
						itemIndex: i,
					});
				}

				returnData.push({
					json: response,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
