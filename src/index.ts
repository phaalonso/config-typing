import fs from 'fs';
import { InvalidFile } from './errors/InvalidPath';
import { NotImplemented } from './errors/NotImplemented';
import { RequiredConfig } from './errors/RequiredConfig';
import { evaluator, IValidator } from './services/Evaluator';
import { IConfigFormat } from './struct/IConfigFormat';
import { IConfiguratorConfig } from './struct/IConfiguratorConfig';

interface IConfigurator {
	load(path: string): void;
	get(key: string): unknown;
	set(key: string, value: unknown): void;
	updateConfigFile(): Promise<void>;
	evaluator: IValidator;
}

export function configurator(
	config: IConfigFormat, 
	options: IConfiguratorConfig = { logging: false }
): IConfigurator {
	const _logging = options.logging;
	const _configFormat = config;
	const _configs: { [key: string]: unknown } = {};
	const _evaluator = evaluator();

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

			const isValid = _evaluator.validate(format, value);

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

	const set = (key: string, value: unknown) => {
		throw new NotImplemented('configurator.set');
	}

	const updateConfigFile = async () => {
		// Verify if there is any changes, and is needed to update the file
		
		// Create an tmp file and write the configurations to it
		
		// Validate the tmp file and verify the configurations

		// Delete the old configuration file, and rename the tmp file to substitute it
		

		throw new NotImplemented('configurator.updateConfigFile');
	}

	return {
		load: loadConfig,
		get,
		set,
		updateConfigFile,
		evaluator: _evaluator,
	}
}
