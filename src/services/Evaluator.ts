import { InvalidConfig } from "../errors/InvalidConfig";
import { InvalidType } from "../errors/InvalidType";
import { IConfig } from "../struct/IConfig";
import { TestFn, TestType } from "../struct/TestType";
import { ILogging } from "./Logging";

export interface IValidator {
	validate(format: IConfig, config: unknown): boolean;
	add(key: string, validator: TestFn): void;
	remove(key: string): void;
	has(key: string): boolean;
	get(key: string): TestFn;
}

export function evaluator(_logging: ILogging): IValidator {

	const _validators: TestType = {
		"*": (_) => true,
		int: (c) => Number.isInteger(c),
		port: (c) => Number.isInteger(c) && c >= 0 && c <= 65535,
		string: (c) => typeof c === "string",
		//map: (c) => typeof c === 'object' && c instanceof Map,
		//set: (c) => typeof c === 'object' && c instanceof Set,
		array: (c) => typeof c === "object" && c instanceof Array,
	};

	const validate = (format: IConfig, config: any) => {
		_logging.log("=== Evaluating ===");
		_logging.log("Format", format);
		_logging.log("Config", config);

		if (!format.type) {
			const validSubConfig = Object.entries(format).some(([key, form]) => {
				_logging.log([key, form]);
				return validate(form, config[key]);
			});

			return validSubConfig;
		} else {
			try {
				const isValid = _validators[format.type as string](config);

				if (!isValid) {
					throw new InvalidConfig(format.name, format.type as string);
				}

				return true;
			} catch (err) {
				if (err instanceof InvalidConfig) {
					throw err;
				}
				throw new InvalidType(format.type as string);
			}
		}
	};

	const add = (key: string, validator: TestFn) => {
		_validators[key] = validator;
	};

	const remove = (key: string) => {
		delete _validators[key];
	};

	const has = (key: string) => {
		return _validators[key] != undefined;
	};

	const get = (key: string) => {
		return _validators[key];
	};

	return {
		validate,
		add,
		remove,
		has,
		get
	};
}
