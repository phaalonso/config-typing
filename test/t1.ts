import { configurator } from "../src";
import path from 'path';

const Configurator = configurator({
	databaseUrl: {
		description: 'Url do banco de dados',
		type: 'string',
		required: true,
	},
	serverPort: {
		type: 'port',
		required: true,
		default: 3333,
	}
}, {
	logging: true,
});

Configurator.load(path.join(__dirname, 'config.json'));

Configurator.set('serverPort', 2222);

console.log(Configurator.get('databaseUrl'));
console.log(Configurator.get('serverPort'));
