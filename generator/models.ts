/**
 * Generate code from the model and schema definitions
 */

import chalk from 'chalk'
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { generateModels } from './generateModels.ts'
import { printNode } from './printNode.ts'

const baseDir = process.cwd()
const subDir = (...tree: string[]): string => path.join(baseDir, ...tree)

console.log(chalk.gray('Models'))

const models = await Promise.all(
	(
		await Promise.all(
			(await readdir(subDir('models'))).map(async (f) => ({
				name: f,
				stat: await stat(subDir('models', f)),
			})),
		)
	)
		.filter(({ stat }) => stat.isDirectory())
		.map(async (model) => {
			console.log(chalk.gray('·'), chalk.white(model.name))
			return {
				id: model.name,
				readmeMarkdown: await readFile(
					path.join(subDir('models'), model.name, 'README.md'),
					'utf-8',
				),
			}
		}),
)

const modelsFile = subDir('models', 'models.ts')
console.log(chalk.green('Writing'), chalk.blue(modelsFile.replace(baseDir, '')))
await writeFile(
	modelsFile,
	generateModels(models).map(printNode).join(os.EOL),
	'utf-8',
)
