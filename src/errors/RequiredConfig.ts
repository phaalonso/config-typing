export class RequiredConfig extends Error {
	constructor(configName: string) {
		super(`Required config ${configName} is undefined`);
		this.name = 'RequiredConfig';
	}
}
