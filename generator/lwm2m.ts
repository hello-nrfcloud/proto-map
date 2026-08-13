import chalk from 'chalk'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import xml2js from 'xml2js'
import type { ParsedLwM2MObjectDefinition } from '../lwm2m/ParsedLwM2MObjectDefinition.ts'
import { unwrapNestedArray } from '../lwm2m/unwrapNestedArray.ts'
import { generateLwM2MDefinitions } from './generateLwM2MDefinitions.ts'
import { generateLwm2mTimestampResources } from './generateLwm2mTimestampResources.ts'
import { generateName } from './generateType.ts'
import { printNode } from './printNode.ts'

const baseDir = process.cwd()
const subDir = (...tree: string[]): string => path.join(baseDir, ...tree)

console.log(chalk.gray('LwM2M'))

// Load definitions
const definitions: ParsedLwM2MObjectDefinition[] = []
for (const objectDefinitionFile of (await readdir(subDir('lwm2m'))).filter(
	(s) => s.endsWith('.xml'),
)) {
	const definition = (
		unwrapNestedArray(
			await xml2js.parseStringPromise(
				await readFile(subDir('lwm2m', objectDefinitionFile), 'utf-8'),
			),
		) as any
	).LWM2M.Object as ParsedLwM2MObjectDefinition
	definitions.push(definition)
}

console.log(chalk.gray('', '·'), chalk.gray('timestamp resources map'))
const timestampResources: Record<string, number> = {}
for (const definition of definitions) {
	const ObjectID = parseInt(definition.ObjectID, 10)
	const Item = definition.Resources.Item
	let ResourceId: number | undefined = undefined
	if (Array.isArray(Item)) {
		ResourceId = parseInt(
			Item.find(({ Type }) => Type === 'Time')?.$.ID as string,
			10,
		)
	} else {
		if (Item.Type === 'Time') ResourceId = parseInt(Item.$.ID, 10)
	}
	if (ResourceId === undefined)
		throw new Error(`No Time resource found in ${ObjectID}!`)
	timestampResources[generateName(definition)] = ResourceId
	console.log(
		'  ',
		chalk.gray('·'),
		`${chalk.white(ObjectID)}${chalk.gray('.')}${chalk.white(ResourceId)}`,
	)
}

const timestampResourcesFile = subDir('lwm2m', 'timestampResources.ts')
console.log(
	chalk.green('Writing'),
	chalk.blue(timestampResourcesFile.replace(baseDir, '')),
)
await writeFile(
	timestampResourcesFile,
	generateLwm2mTimestampResources(timestampResources)
		.map(printNode)
		.join(os.EOL),
	'utf-8',
)

console.log(chalk.gray('', '·'), chalk.gray('static object information'))
const definitionsFile = subDir('lwm2m', 'definitions.ts')
console.log(
	chalk.green('Writing'),
	chalk.blue(definitionsFile.replace(baseDir, '')),
)
await writeFile(
	definitionsFile,
	generateLwM2MDefinitions(definitions).map(printNode).join(os.EOL),
	'utf-8',
)
