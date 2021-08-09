import fs from 'fs';
import { InvalidFile } from './errors/InvalidPath';
import { InvalidType } from './errors/InvalidType';
import { RequiredConfig } from './errors/RequiredConfig';
import { IConfig } from './struct/Config';

interface IConfigFormat {
	[key: string]: IConfig; } interface IConfiguratorConfig {
	logging: boolean;
}

interface IConfigurator {
	load(path: string): void;
	get(key: string): unknown;
}

type TestFn = (args: any) => boolean;	

interface TestType {
	[key: string]: TestFn;
}

const testType: TestType = {
	'*': (_) => true,
	int: (num) => Number.isInteger(num),
	port: (port) => (port >= 0 && port <= 65535),
	string: (s) => typeof s === 'string',
}

export function configurator(config: IConfigFormat, options: IConfiguratorConfig = { logging: false }): IConfigurator {
	const _logging = options.logging;
	const _configFormat = config;
	const _configs: { [key: string]: unknown } = {};

	//@ts-ignore
	const log = (msg) => {
		if (_logging) {
			console.log(msg);
		}
	}

	log(_configFormat);


	const loadFile = (path: string) => {
		try {
			fs.accessSync(path);
		} catch (err) {
			throw new InvalidFile(path);
		}

		const file = fs.readFileSync(path, { flag: 'r' });

		return file;
	}

	const verifyConfig = (format: IConfig, value: unknown): boolean => {
		console.log(format)
		try {
			return testType[format.type](value);
		} catch (err) {
			throw new InvalidType(format.type);
		}
	}

	const loadConfig = (path: string) => {
		log(`Verifying if file exists`);
		const file = loadFile(path);

		log('Parsing file as json');
		const decoded = JSON.parse(file.toString());
		console.log(decoded);

		const decodedKeys = Object.keys(decoded)
		const formatKeys = Object.keys(_configFormat);

		// Find the keys that is not defined in the config file
		const notDefinedKeys = formatKeys.filter(k => !decodedKeys.includes(k))

		// Identify if these config are required
		notDefinedKeys.forEach(nd => {
			const conf = _configFormat[nd];
			//FIX: Verify if it works fine even when default valuue is an boolean
			if (conf.required && !conf.default) {
				throw new RequiredConfig(nd);
			}
		})

		decodedKeys.forEach(key => {
			const format = _configFormat[key];
			console.log(format)
			const value: unknown = decoded[key];

			const isValid = verifyConfig(format, value);

		if (isValid) {
				if (value != undefined) {
					_configs[key] = value;		
				} else if (format.default) {
					_configs[key] = format.default;	
				}
			}
		});

		console.log(_configs);
	}

	const get = (key: string) => {
		return _configs[key];
	}

	return {
		load: loadConfig,
		get,
	}
}
