import chalk from 'chalk'
import assert from 'node:assert/strict'
import { exec } from 'node:child_process'
import { readFile, readdir, stat } from 'node:fs/promises'
import path, { parse } from 'node:path'
import xml2js from 'xml2js'
import { validate } from '../validate.js'
import {
	LWM2MObjectDefinition,
	type LWM2MObjectDefinitionType,
} from './LWM2MObjectDefinition.js'
import type { ParsedLwM2MObjectDefinition } from './ParsedLwM2MObjectDefinition.js'
import { parseRangeEnumeration } from './parseRangeEnumeration.js'
import { unwrapNestedArray } from './unwrapNestedArray.js'

const v = validate(LWM2MObjectDefinition)

const listLwm2mDefinitions = async (
	modelDir: string,
): Promise<LWM2MObjectDefinitionType[]> => {
	const defs: LWM2MObjectDefinitionType[] = []
	const files = await readdir(modelDir)
	for (const file of files) {
		if (!file.endsWith('.xml')) continue
		console.log(chalk.white('·'), chalk.white.bold(file))
		assert.match(
			file,
			/^[0-9]+\.xml$/,
			'LwM2M object definition files must only have numbers in their file names',
		)
		console.log(chalk.green('✔'), chalk.gray('File name is correct'))
		const objectDefinitionFile = path.join(modelDir, file)
		if ((await stat(objectDefinitionFile)).isDirectory()) continue

		// validate
		const schemaValidated = await new Promise<boolean>((resolve) =>
			exec(
				`xmllint --noout --schema ${path.join(
					process.cwd(),
					'lwm2m',
					'LWM2M-v1_1.xsd',
				)} ${objectDefinitionFile}`,
				(error, _, stderr) => {
					if (error) {
						console.error(stderr)
						return resolve(false)
					}
					resolve(true)
				},
			),
		)
		assert.equal(schemaValidated, true, '')
		console.log(
			chalk.green('✔'),
			chalk.gray('Is a valid LwM2M object definition'),
		)
		const ObjectID = parseInt(parse(objectDefinitionFile).name, 10)
		assert.equal(ObjectID > 14200, true, 'ObjectID must be greater than 14200')
		assert.equal(ObjectID < 15000, true, 'ObjectID must be smaller than 15000')
		const ObjectURN = `urn:oma:lwm2m:x:${ObjectID}`

		const definition = (
			unwrapNestedArray(
				await xml2js.parseStringPromise(
					await readFile(objectDefinitionFile, 'utf-8'),
				),
			) as any
		).LWM2M.Object as ParsedLwM2MObjectDefinition

		assert.equal(
			ObjectID.toString(),
			definition.ObjectID,
			`ObjectID must match filename`,
		)
		assert.equal(
			ObjectURN,
			definition.ObjectURN,
			`ObjectURN must follow schema`,
		)

		console.log(
			chalk.green('✔'),
			chalk.blue(ObjectURN),
			chalk.gray('ObjectID and URN match filename and schema'),
		)

		const objectDef: LWM2MObjectDefinitionType = {
			...definition,
			LWM2MVersion: '1.1',
			Resources: {},
		}

		const Item = definition.Resources.Item
		if (Array.isArray(Item)) {
			objectDef.Resources = Item.reduce<Record<string, any>>(
				(resources, { $, ...item }) => {
					if (resources[$.ID] !== undefined)
						throw new Error(`Duplicate resource ID: ${$.ID}`)
					if (item.RangeEnumeration.length > 0) {
						const maybeRange = parseRangeEnumeration(item.RangeEnumeration)
						if ('error' in maybeRange) throw maybeRange.error
					}
					return {
						...resources,
						[$.ID]: item,
					}
				},
				{},
			)
		} else {
			// Object only has one Resource
			objectDef.Resources = {
				[Item.$.ID]: Item,
			}
		}

		const maybeValid = v(objectDef)
		if ('errors' in maybeValid) {
			console.error(maybeValid.errors)
			throw new Error(`The definition should be valid!`)
		}

		console.log(chalk.green('✔'), chalk.gray('LwM2M limitations are honored'))

		defs.push(maybeValid.value)

		const { Name, Resources } = maybeValid.value

		const TimeResources = Object.values(Resources).filter(
			({ Type }) => Type === 'Time',
		)
		assert.equal(
			TimeResources.length,
			1,
			'Objects must define one Time resource',
		)
		assert.equal(
			TimeResources[0]?.Mandatory,
			'Mandatory',
			'The Time resources must be mandatory.',
		)
		console.log(
			chalk.green('✔'),
			chalk.gray(`Object has one time resource (${TimeResources[0]?.Name})`),
		)

		console.log(`${chalk.yellow(ObjectID)}:`, chalk.white(Name))
		for (const [id, resource] of Object.entries(Resources)) {
			console.log(
				`${chalk.gray(ObjectID)}.${chalk.yellow(id)}:`,
				chalk.white(resource.Name),
				`${chalk.gray(resource.Type)} ${chalk.gray(
					`(${resource.Units ?? 'no unit'})`,
				)}`,
			)
		}
	}
	return defs
}

// LwM2M
console.log(chalk.gray('LwM2M rules check'))
console.log('')
const lwm2mDir = path.join(process.cwd(), 'lwm2m')
const lwm2mDefinitions = await listLwm2mDefinitions(lwm2mDir)
assert.equal(
	lwm2mDefinitions.length > 0,
	true,
	'LwM2M objects must be defined.',
)
