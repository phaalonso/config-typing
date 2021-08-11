export interface ILogging {
	log(...args: unknown[]): void;
	set(enabled: boolean): void;
}

let _logging = false;

export function logging(): ILogging {
	const set = (enabled: boolean) => {
		_logging = enabled;
	};

	const log = (...args: unknown[]) => {
		if (_logging) {
			console.log(args.length == 1 ? args.shift() : args);
		}
	};

	return {
		log,
		set
	};
}

