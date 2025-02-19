import chalk from 'chalk'
import { parseREADME } from 'markdown/parseREADME.js'
import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { ModelIDRegExp } from './types.js'

console.log(chalk.gray('Models rules check'))
console.log('')
const modelsDir = path.join(process.cwd(), 'models')
for (const model of await readdir(modelsDir)) {
	const modelDir = path.join(modelsDir, model)
	if (!(await stat(modelDir)).isDirectory()) continue
	console.log(chalk.white('·'), chalk.white.bold(model))
	assert.match(
		model,
		ModelIDRegExp,
		'Model identifiers must consist of numbers, letters, dash, plus, and underscore only',
	)
	console.log(chalk.green('✔'), chalk.gray('Model name is correct'))

	// A README.md should exist
	try {
		await stat(path.join(modelDir, 'README.md'))
	} catch {
		throw new Error(`No README.md defined for model ${model}!`)
	}
	console.log(chalk.green('✔'), chalk.gray(`README.md exists`))
	try {
		parseREADME(await readFile(path.join(modelDir, 'README.md'), 'utf-8'))
	} catch (err) {
		console.error(err)
		throw new Error(`README is not valid for ${model}!`)
	}
	console.log(chalk.green('✔'), chalk.gray(`README.md is valid`))
}
