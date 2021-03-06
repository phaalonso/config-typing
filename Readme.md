# Config validator

[Npm package](https://www.npmjs.com/package/config-validation)

A library created with the objective to facilitate creating configurating configuration that are stored in JSON files. It's uses a schema defined by the user, that the loaded json file needs to have otherside the loading of the file will fail as an "Config error".

## Important
In the moment this library is in pre-release, so be careful when to use it. There can be lots of bugs or some problems that needs to be fixed.

## Reasong
An alternative of [Convict](https://www.npmjs.com/package/convict) written in Typescript, the primary reason of this library is the need of dynamically updating the configuration file in  some of my projects (yeah, it has it's owns risk but I need to do it :/ and take care of all possible errors)

## How to use
Setup an configuration file anywhere in your machine (be certain that the application can read the file), and use it's path in configurator

Example:
```ts
import { configurator } from "config-validation";
import path from 'path';

const Configurator = configurator({
	databaseUrl: {
		description: 'Database url',
		type: 'string',
		required: true,
	},
	insert_invertal: {
		description: 'Bach insert interval used for buffer cleaning',
		type: 'number',
		required: true,
	},
	server: {
		port: {
			description: 'The server port',
			type: 'number',
			default: 3333,
		}
	}
});

// Load configs from the file config.json
Configurator.load(path.join(__dirname, 'config.json'));

console.log(Configurator.get('databaseUrl'));

// Update the config value
Configurator.set('databaseUrl', 'Another url')

console.log(Configurator.get('databaseUrl'));

// Write the config changes to the file
Configurator.updateConfigFile();
```

## Todo
- [X] Ability to the user add new types
- [X] Method that permit changing an config
- [X] Updating the configuration file
- [X] Sub-configs
- [ ] Fix set and get to work with Sub-configs
- [ ] Implementing unit test's

## Inspiration
- [Convict](https://www.npmjs.com/package/convict)
