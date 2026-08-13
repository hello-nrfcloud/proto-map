import type { LwM2MObjectInstance } from '../lwm2m/LwM2MObjectInstance.ts'
import { timestampResources } from '../lwm2m/timestampResources.ts'
import { hasName } from './hasName.ts'
import { hasValue } from './hasValue.ts'
import { parseResourceId, type ResourceID } from './parseResourceId.ts'
import type { MeasurementType, SenMLType } from './SenMLSchema.ts'

const isInfoForDifferentInstance = (
	currentObject: LwM2MObjectInstance,
	resourceID: ResourceID,
	currentBaseTime: number,
	tsRes: number,
): boolean => {
	if (currentObject === undefined) return true
	if (currentObject.ObjectID !== resourceID.ObjectID) return true
	if ((currentObject.ObjectInstanceID ?? 0) !== resourceID.ObjectInstanceID)
		return true
	if (
		currentBaseTime !== (currentObject.Resources?.[tsRes] as number | undefined)
	)
		return true
	return false
}

const getValue = (
	measurement: MeasurementType,
): string | number | boolean | undefined => {
	if ('bv' in measurement && !('v' in measurement)) return measurement.bv
	if ('bv' in measurement && 'v' in measurement)
		return measurement.bv + measurement.v
	if ('v' in measurement) return measurement.v
	if ('vs' in measurement) return measurement.vs
	if ('vb' in measurement) return measurement.vb
	if ('vd' in measurement) return measurement.vd
	return undefined
}
export const senMLtoLwM2M = (
	senML: SenMLType,
): { lwm2m: Array<LwM2MObjectInstance> } | { error: Error } => {
	let currentBaseName: string = ''
	let currentBaseTime: number | undefined = undefined
	let currentObject: LwM2MObjectInstance | undefined = undefined
	const lwm2m: Array<LwM2MObjectInstance> = []

	// Special case for timestamp only object
	const maybeTimestampOnly = parseTimestampOnly(senML)
	if (maybeTimestampOnly !== null) return { lwm2m: [maybeTimestampOnly] }

	for (const item of senML) {
		if ('bn' in item && item.bn !== undefined) currentBaseName = item.bn
		if ('bt' in item && item.bt !== undefined) currentBaseTime = item.bt
		if (!hasValue(item)) continue
		if (!hasName(item)) continue
		const itemResourceId = `${currentBaseName}${item.n ?? ''}/0`
		const resourceId = parseResourceId(itemResourceId)
		if (resourceId === null) {
			return { error: new Error(`Invalid resource ID: ${itemResourceId}`) }
		}

		const tsRes = timestampResources.get(resourceId.ObjectID)
		if (tsRes === undefined) {
			return {
				error: new Error(
					`No timestamp resource defined for object: ${resourceId.ObjectID}`,
				),
			}
		}

		if (
			currentObject === undefined ||
			(currentBaseTime !== undefined &&
				isInfoForDifferentInstance(
					currentObject,
					resourceId,
					currentBaseTime,
					tsRes,
				))
		) {
			if (currentObject !== undefined) lwm2m.push(currentObject)
			if (currentBaseTime === undefined) {
				return {
					error: new Error(
						`No base time defined for object: ${resourceId.ObjectID}!`,
					),
				}
			}
			currentObject = {
				ObjectID: resourceId.ObjectID,
				Resources: {
					[tsRes]: currentBaseTime,
				},
			}
			if (resourceId.ObjectInstanceID !== 0)
				currentObject.ObjectInstanceID = resourceId.ObjectInstanceID
			if ('blv' in item) currentObject.ObjectVersion = item.blv
		}
		if (currentObject?.Resources === undefined) continue
		const value = getValue(item)
		if (value !== undefined) {
			currentObject.Resources = {
				...currentObject.Resources,
				[item.n]: value,
			}
		}
	}
	if (currentObject !== undefined) lwm2m.push(currentObject)

	return { lwm2m }
}

/**
 * Handle objects which are only `bt` (base time) and `bn` (base name)
 */
const parseTimestampOnly = (senML: SenMLType): LwM2MObjectInstance | null => {
	if (senML.length !== 1) return null
	const item = senML[0]!
	if (!('bn' in item) || !('bt' in item)) return null
	const { bn, bt, ...rest } = item
	if (Object.keys(rest).length !== 0) return null
	const objectInfo = parseResourceId(`${bn}0/0`)
	if (objectInfo === null) return null
	const tsRes = timestampResources.get(objectInfo.ObjectID)
	if (tsRes === undefined) return null
	return {
		ObjectID: objectInfo.ObjectID,
		ObjectInstanceID: objectInfo.ObjectInstanceID,
		Resources: {
			[tsRes]: bt,
		},
	}
}
