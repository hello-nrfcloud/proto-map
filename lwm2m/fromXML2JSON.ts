import { readFile } from 'node:fs/promises'
import path from 'node:path'
import xml2js from 'xml2js'
import type { LwM2MType } from './resourceType.ts'

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
	Resources: [{ Item: Resource[] }]
	Description2: string[]
}

type Resource = {
	$: { ID: string }
	Name: string[]
	Operations: string[]
	MultipleInstances: ['Single'] | ['Multiple']
	Mandatory: ['Optional'] | ['Mandatory']
	Type: LwM2MType[]
	RangeEnumeration: string[]
	Units: string[]
	Description: string[]
}

/**
 * From XML to JSON
 */
export const fromXML2JSON = async (id: number): Promise<jsonObject> => {
	const baseDir = process.cwd()
	const subDir = (...tree: string[]): string => path.join(baseDir, ...tree)
	const jsonObject = await xml2js.parseStringPromise(
		await readFile(subDir('lwm2m', `${id}.xml`), 'utf-8'),
	)
	return jsonObject.LWM2M.Object[0]
}
