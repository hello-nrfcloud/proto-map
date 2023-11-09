import xml2js from 'xml2js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * JSON representation of an XML object
 */
type jsonObject = {
	Name: string[]
	Description1: string[]
	ObjectID: string[]
	ObjectURN: string[]
	LWM2MVersion: string[]
	ObjectVersion: string[]
	MultipleInstances: ['Single'] | ['Multiple']
	Mandatory: ['Optional'] | ['Mandatory']
	Resources: [Record<string, unknown>]
	Description2: string[]
}

/**
 * From XML to JSON
 */
export const fromXML2JSON = async (id: number): Promise<jsonObject> => {
	const baseDir = process.cwd()
	const subDir = (...tree: string[]): string => path.join(baseDir, ...tree)
	const jsonObject = await xml2js.parseStringPromise(
		await readFile(subDir('lwm2m/definitions', `${id}.xml`), 'utf-8'),
	)
	return jsonObject.LWM2M.Object[0]
}