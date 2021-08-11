import { configurator } from "../src";
import path from "path";

const Configurator = configurator({
	databaseUrl: {
		description: "Url do banco de dados",
		type: "string",
		required: true,
	},
	serverConfig: {
		serverPort: {
			type: "port",
			default: 3333,
		},
	}
}, {
	logging: false,
});

Configurator.load(path.join(__dirname, "config.json"));

//Configurator.set("serverPort", 2222);

console.log(Configurator.get("databaseUrl"));
console.log(Configurator.get("serverPort"));
Configurator.updateConfigFile();
