import { configurator } from "../src";
import path from 'path';

const Configurator = configurator({
	databaseUrl: {
		description: 'Url do banco de dados',
		type: 'string',
		required: true,
	} 
}, {
	logging: true,
});

Configurator.load(path.join(__dirname, 'config.json'));

console.log(Configurator.get('databaseUrl'));
