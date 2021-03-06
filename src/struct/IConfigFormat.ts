import { IConfig } from "./IConfig";

export interface IConfigFormat {
	[key: string]: IConfig | Record<string, IConfig>;
} 
