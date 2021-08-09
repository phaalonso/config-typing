export type TestFn = (args: any) => boolean;	

export interface TestType {
	[key: string]: TestFn;
}
