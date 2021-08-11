export class InvalidConfig extends Error {
	constructor(configName = "", configType: string) {
		super(`The config ${configName} must be of the type ${configType}`);
		this.name = "InvalidType";
	}
}
