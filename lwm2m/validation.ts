import { LwM2MObjectIDs, type LwM2MObjectID } from './LwM2MObjectID.js'
import type { LwM2MObjectInstance } from './LwM2MObjectInstance.js'

export const isLwM2MObject = (
	object: unknown,
): { object: LwM2MObjectInstance } | { error: Error } => {
	const error = (message: string) => ({ error: new Error(message) })
	// Must be an object
	if (typeof object !== 'object' || object === null)
		return error(`Not an object`)
	// Must have valid ObjectID
	if (
		!('ObjectID' in object) ||
		typeof object.ObjectID !== 'number' ||
		object.ObjectID < 14200 ||
		object.ObjectID > 15000 ||
		LwM2MObjectIDs.includes(object.ObjectID) === false
	)
		return error(
			`Not an valid Object ID: ${JSON.stringify((object as any).ObjectID)}`,
		)
	// ObjectVersion must be valid
	if ('ObjectVersion' in object) {
		if (
			typeof object.ObjectVersion !== 'string' ||
			!/^\d+\.\d+$/.test(object.ObjectVersion)
		)
			return error(`Invalid ObjectVersion`)
	}
	// ObjectInstanceID must be valid
	if ('ObjectInstanceID' in object) {
		if (
			typeof object.ObjectInstanceID !== 'number' ||
			object.ObjectInstanceID < 0
		)
			return error(`Invalid ObjectInstanceID`)
	}
	// Must have valid resources
	if (
		!('Resources' in object) ||
		typeof object.Resources !== 'object' ||
		object.Resources === null
	)
		return error(`Resources must be an object`)
	// All keys must be numbers
	if (
		(Object.keys(object.Resources).find((k) => /[^\d]/.test(k))?.length ?? 0) >
		0
	)
		return error(`All resource IDs must be a number`)
	// All values must be number, string, boolean
	for (const v of Object.values(object.Resources)) {
		if (isSimpleResource(v)) continue
		if (Array.isArray(v) && v.every((v) => isSimpleResource(v))) continue
		return error(`Invalid value type ${typeof v}`)
	}
	return { object: object as LwM2MObjectInstance }
}

const isSimpleResource = (
	v?: unknown,
): v is number | string | boolean | undefined => {
	if (v === undefined) return true
	if (typeof v === 'string') return true
	if (typeof v === 'boolean') return true
	if (typeof v === 'number') return true
	return false
}

export const validateInstance =
	<O extends LwM2MObjectInstance>(
		ObjectID: LwM2MObjectID,
		ObjectVersion: string,
		Resources: Record<number, (r: unknown) => boolean>,
	) =>
	(o: unknown): { object: LwM2MObjectInstance<O> } | { error: Error } => {
		const error = (message: string) => ({ error: new Error(message) })
		const maybeValidLwM2MObject = isLwM2MObject(o)
		if ('error' in maybeValidLwM2MObject) return maybeValidLwM2MObject
		const i = maybeValidLwM2MObject.object
		if (i.ObjectID !== ObjectID) {
			return error(
				`Given Object ID ${i.ObjectID} does not match expected ${ObjectID}`,
			)
		}
		if ((i.ObjectVersion ?? '1.0') !== ObjectVersion) {
			return error(
				`Given Object version ${i.ObjectVersion} does not match expected ${ObjectVersion}`,
			)
		}

		for (const [ResourceID, validator] of Object.entries(Resources)) {
			if (validator(i.Resources[parseInt(ResourceID, 10)]) === false) {
				return error(
					`Resource ${ResourceID} for Object ${ObjectID} is invalid.`,
				)
			}
		}
		return { object: o as LwM2MObjectInstance<O> }
	}

export const NumberResource = (r: unknown): r is number => typeof r === 'number'
export const TimeResource = (r: unknown): r is number =>
	NumberResource(r) && r > 1700000000 && r < 9999999999
export const StringResource = (r: unknown): r is string => typeof r === 'string'
export const BooleanResource = (r: unknown): r is boolean =>
	typeof r === 'boolean'

export const OptionalResource =
	(validator: (r: unknown) => boolean) =>
	(r: unknown): boolean =>
		r === undefined ? true : validator(r)

export const MultipleInstanceResource =
	(validator: (r: unknown) => boolean) =>
	(r: unknown): boolean =>
		Array.isArray(r) && r.every(validator)
