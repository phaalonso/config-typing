# Configurator

[Npm package](https://www.npmjs.com/package/config-type)

A library created with the objective to facilitate creating configuration for applications utilizing JSON (or others formats in the future). While having the security of type checking the variables and resolver to default values.

## Reasong
An alternative of [Convict](https://www.npmjs.com/package/convict) written in Typescript, the primary reason of this library is the need of dynamically updating the configuration file in  some of my projects (yeah, it cab be risk but I need to do it :/)

## How to use
Setup an configuration file anywhere in your machine (be certain that the application can read the file), and use it's path in configurator

Example:
```ts
import { configurator } from "config-type";
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
		default: 15000
	}
});

Configurator.load(path.join(__dirname, 'config.json'));

console.log(Configurator.get('databaseUrl'));
```

## Todo
- [X] Ability to the user add new types
- [ ] Method that permit changing an config
- [ ] Updating the configuration file
- [ ] Implementing unit test's

## Inspiration
- [Convict](https://www.npmjs.com/package/convict)
