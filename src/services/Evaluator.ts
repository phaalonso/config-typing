import { InvalidType } from "../errors/InvalidType";
import { IConfig } from "../struct/Config";
import { TestFn, TestType } from "../struct/TestType";

export interface IValidator {
	validate(format: IConfig, config: unknown): boolean;
	add(key: string, validator: TestFn): void;
	remove(key: string): void;
	has(key: string): boolean;
	get(key: string): TestFn;
}

export function evaluator(): IValidator {
	const _validators: TestType = {
		'*': (_) => true,
		int: (c) => Number.isInteger(c),
		port: (c) => Number.isInteger(c) && c >= 0 && c <= 65535,
		string: (c) => typeof c === 'string',
		//map: (c) => typeof c === 'object' && c instanceof Map,
		//set: (c) => typeof c === 'object' && c instanceof Set,
		array: (c) => typeof c === 'object' && c instanceof Array,
	}

	const validate = (format: IConfig, config: unknown) => {
		console.log(format)
		try {
			return _validators[format.type](config);
		} catch (err) {
			throw new InvalidType(format.type);
		}
	}

	const add = (key: string, validator: TestFn) => {
		_validators[key] = validator;
	}

	const remove = (key: string) => {
		delete _validators[key];
	}

	const has = (key: string) => {
		return _validators[key] != undefined;
	}

	const get = (key: string) => {
		return _validators[key];
	}

	return {
		validate,
		add,
		remove,
		has,
		get
	};
}
