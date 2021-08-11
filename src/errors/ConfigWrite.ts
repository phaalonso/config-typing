export class ConfigWrite extends Error {
	constructor(fileName: string) {
		super(`There was an error writing in the temporary config ${fileName}`);
	}
}
