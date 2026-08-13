import chalk from 'chalk'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import ts from 'typescript'
import xml2js from 'xml2js'
import type { ParsedLwM2MObjectDefinition } from '../lwm2m/ParsedLwM2MObjectDefinition.ts'
import { unwrapNestedArray } from '../lwm2m/unwrapNestedArray.ts'

import os from 'node:os'
import { addDocBlock } from './addDocBlock.ts'
import { generateName, generateType } from './generateType.ts'
import { generateValidator } from './generateValidator.ts'
import { generateValidators } from './generateValidators.ts'
import { printNode } from './printNode.ts'

const baseDir = process.cwd()
const subDir = (...tree: string[]): string => path.join(baseDir, ...tree)

const idMembers: ts.EnumMember[] = []
const objects: ParsedLwM2MObjectDefinition[] = []

console.log(chalk.gray('Creating TypeBox definition for LwM2M objects'))
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
	const ObjectID = parseInt(definition.ObjectID, 10)

	const member = ts.factory.createEnumMember(
		generateName(definition),
		ts.factory.createNumericLiteral(ObjectID),
	)
	addDocBlock(
		[`${definition.Name} (${ObjectID})`, ``, definition.Description1],
		member,
	)
	idMembers.push(member)

	try {
		await mkdir(subDir('lwm2m', `object`))
	} catch {
		// pass
	}

	// Type
	const typeFile = subDir('lwm2m', `object`, `${ObjectID}.d.ts`)
	console.log(chalk.green('Writing'), chalk.blue(typeFile.replace(baseDir, '')))
	await writeFile(
		typeFile,
		generateType(definition).map(printNode).join(os.EOL),
		'utf-8',
	)

	// Validator
	const validatorFile = subDir('lwm2m', `object`, `validate${ObjectID}.ts`)
	console.log(
		chalk.green('Writing'),
		chalk.blue(validatorFile.replace(baseDir, '')),
	)
	await writeFile(
		validatorFile,
		generateValidator(definition).map(printNode).join(os.EOL),
		'utf-8',
	)

	objects.push(definition)
}

const validatorsFile = subDir('lwm2m', `validators.ts`)
console.log(
	chalk.green('Writing'),
	chalk.blue(validatorsFile.replace(baseDir, '')),
)
await writeFile(
	validatorsFile,
	generateValidators(objects).map(printNode).join(os.EOL),
	'utf-8',
)

const idFile = subDir('lwm2m', `LwM2MObjectID.ts`)
console.log(chalk.green('Writing'), chalk.blue(idFile.replace(baseDir, '')))
const enumNode = ts.factory.createEnumDeclaration(
	[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
	ts.factory.createIdentifier('LwM2MObjectID'),
	idMembers,
)
addDocBlock(['The LwM2M Object IDs defined in this repo.'], enumNode)

const objectIdArray = ts.factory.createVariableStatement(
	[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
	ts.factory.createVariableDeclarationList(
		[
			ts.factory.createVariableDeclaration(
				ts.factory.createIdentifier(`LwM2MObjectIDs`),
				undefined,
				undefined,
				ts.factory.createArrayLiteralExpression(
					objects.map((definition) => {
						// const id = ts.factory.createNumericLiteral(ObjectID)
						const id = ts.factory.createPropertyAccessExpression(
							ts.factory.createIdentifier('LwM2MObjectID'),
							ts.factory.createIdentifier(generateName(definition)),
						)
						ts.addSyntheticLeadingComment(
							id,
							ts.SyntaxKind.SingleLineCommentTrivia,
							` ${definition.Name} (${definition.ObjectID})`,
							true,
						)
						return id
					}),
				),
			),
		],
		ts.NodeFlags.Const,
	),
)
addDocBlock(['The LwM2M Object IDs defined in this repo.'], objectIdArray)

await writeFile(
	idFile,
	[enumNode, objectIdArray].map(printNode).join(os.EOL),
	'utf-8',
)

const objectsFile = subDir('lwm2m', `objects.ts`)
console.log(
	chalk.green('Writing'),
	chalk.blue(objectsFile.replace(baseDir, '')),
)
await writeFile(
	objectsFile,
	objects
		.map(({ ObjectID, Name }) => {
			const name = generateName({ ObjectID, Name })
			return [
				ts.factory.createExportDeclaration(
					[],
					true,
					ts.factory.createNamedExports([
						ts.factory.createExportSpecifier(
							false,
							undefined,
							ts.factory.createIdentifier(name),
						),
					]),
					ts.factory.createStringLiteral(`./object/${ObjectID}.ts`),
				),
				ts.factory.createExportDeclaration(
					[],
					false,
					ts.factory.createNamedExports([
						ts.factory.createExportSpecifier(
							false,
							undefined,
							ts.factory.createIdentifier(`validate${ObjectID}`),
						),
					]),
					ts.factory.createStringLiteral(`./object/validate${ObjectID}.ts`),
				),
			]
		})
		.flat()
		.map(printNode)
		.join(os.EOL),
	'utf-8',
)
