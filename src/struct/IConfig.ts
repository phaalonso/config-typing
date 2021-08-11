export interface IConfig {
	name?: string;
	description?: string;
	type: string | Record<string, IConfig>;
	default?: unknown;
	required?: boolean;
}
