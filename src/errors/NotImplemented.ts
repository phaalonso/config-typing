export class NotImplemented extends Error {
	constructor(functionName: string) {
		super(`This method/function with the name of ${functionName} was not implemented yet`);
		this.name = "NotImplemented";
	}
}
