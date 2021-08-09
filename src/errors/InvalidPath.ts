export class InvalidFile extends Error {
	constructor(path: string) {
		super(`The path ${path} is invalid or this app don't have acess permissions`);
		this.name = 'InvalidPath';
	}
}
