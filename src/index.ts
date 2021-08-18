import fs from "fs";
import { FormatNotExist } from "./errors/ConfigNotExist";
import { ConfigWrite } from "./errors/ConfigWrite";
import { InvalidConfig } from "./errors/InvalidConfig";
import { InvalidFile } from "./errors/InvalidPath";
import { RequiredConfig } from "./errors/RequiredConfig";
import { evaluator, IValidator } from "./services/Evaluator";
import { logging } from "./services/Logging";
import { IConfig } from "./struct/IConfig";
import { IConfigFormat } from "./struct/IConfigFormat";
import { IConfiguratorConfig } from "./struct/IConfiguratorConfig";

interface IConfigurator {
	load(path: string): void;
	get(key: string): any;
	getConfig(): { [key: string]: any };
	set(key: string, value: unknown): void;
	updateConfigFile(): Promise<void>;
	evaluator: IValidator;
}

export function configurator(
	config: IConfigFormat, 
	options: IConfiguratorConfig = { logging: false }
): IConfigurator {
	const _logging = logging();
	const _evaluator = evaluator(_logging);
	const _configFormat = config;
	const _configs: { [key: string]: unknown } = {};
	let fileName: string;
	let hasChanges = false;

	_logging.set(options.logging);

	const recursiveFormatValidation = (key: string, config: IConfig | Record<string, IConfig>) => {
		_logging.log([key, config]);
		if (config.required && config.default != undefined) {
			throw Error("Required specify that an config must be present in the file, so it wont work with the default value");
		}

		if (!config.type) {
			Object.entries(config).forEach(([key, subconf]) => recursiveFormatValidation(key, subconf));
		} else {
			if (!config.name) {
				config.name = key;
			}
		}
	};

	Object.entries(config).forEach(([key, config]) => {
		recursiveFormatValidation(key, config);
	});

	//log(config);
	//log(_configFormat);

	const loadFile = (path: string) => {
		try {
			fs.accessSync(path);
		} catch (err) {
			throw new InvalidFile(path);
		}

		const file = fs.readFileSync(path, { flag: "r" });

		return file;
	};

	const loadConfig = (path: string) => {
		_logging.log("Verifying if file exists");
		const file = loadFile(path);

		fileName = path;

		_logging.log("Parsing file as json");
		const decoded = JSON.parse(file.toString());
		console.log(decoded);

		const decodedKeys = Object.keys(decoded);
		const formatKeys = Object.keys(_configFormat);

		// Find the keys that is not defined in the config file
		const notDefinedKeys = formatKeys.filter(k => !decodedKeys.includes(k));

		// Identify if these config are required
		notDefinedKeys.forEach(nd => {
			const conf = _configFormat[nd];
			//FIX: Verify if it works fine even when default value is an boolean
			if (conf.required && !conf.default) {
				throw new RequiredConfig(nd);
			}
		});

		function validateRecord(formats: IConfigFormat, configs: Record<string, unknown>) {
			_logging.log("Validating:");
			_logging.log("Formats:", formats);
			_logging.log("Configs:", configs);
			Object.entries(configs).forEach(([key, config]) => {
				_logging.log(`------${key}------`);
				const format = formats[key];
				const value: unknown = configs[key];
				_logging.log(format);
				_logging.log(configs);

				const isValid = _evaluator.validate(format as IConfig, value);

				if (isValid) {
					if (value != undefined) {
						_configs[key] = value;		
					} else if (format.default) {
						_configs[key] = format.default;	
					}
				}
			});
		}

		validateRecord(_configFormat, decoded);

		_logging.log(_configs);
	};

	const get = (key: string) => {
		return _configs[key];
	};

	const getConfig = () => ( _configs );

	const set = (key: string, value: unknown) => {
		const format = _configFormat[key];

		if (format && typeof format.type !== "object") {
			const isValid = _evaluator.validate(format as IConfig, value);

			if (isValid) {
				if (value != undefined)	 {
					_configs[key] = value;
					hasChanges = true;
				}
			} else {
				throw new InvalidConfig(key, format.type);
			}
		} else {
			throw new FormatNotExist(key);
		}
	};

	const findValidFileName = (oldName: string) => {
		const dotIndex = oldName.lastIndexOf(".");

		const fileName = oldName.substr(0, dotIndex);
		const extension = oldName.substr(dotIndex);

		const isInUse = true;
		let number = 1;
		let tempName =  fileName + number + extension;

		while (isInUse) {
			tempName =  fileName + number + extension;
			try {
				fs.accessSync(tempName);
				number++;
			} catch (err) {
				break;
			}
		}

		_logging.log(`Temp file name is ${tempName}`);

		return tempName;
	};

	const updateConfigFile = async () => {
		// Verify if there is any changes, and is needed to update the file
		if (!hasChanges)
			return;

		hasChanges = false;
		// Create an tmp file and write the configurations to it
		
		const tempFileName = findValidFileName(fileName);

		const newConfig = JSON.stringify(_configs);

		try {
			fs.writeFileSync(tempFileName, newConfig, { flag: "w" });
		} catch (err) {
			throw new ConfigWrite(tempFileName);
		}
		
		// Validate the tmp file and verify the configurations
		try {
			fs.renameSync(fileName, fileName + ".backup");
		} catch (err) {
			throw Error("Error renaming the config file");
		}

		// Rename the old configuration file, and rename the tmp file to substitute it
		try {
			fs.renameSync(tempFileName, fileName);
		} catch (err) {
			throw Error("Error renaming the temp file to have the name of the config file");
		}
	};

	return {
		load: loadConfig,
		get,
		getConfig,
		set,
		updateConfigFile,
		evaluator: _evaluator,
	};
}
