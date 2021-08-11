export class FormatNotExist extends Error {
	constructor(configName: string) {
		super(`The config ${configName} not exist in the format`);
		this.name = "ConfigNotExist";
	}
}
