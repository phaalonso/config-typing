export class InvalidType extends Error {
	constructor(typeName: string) {
		super(`The type ${typeName} is unknow to the parser`);
		this.name = 'InvalidType';
	}
}
