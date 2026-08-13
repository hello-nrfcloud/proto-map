import { definitions } from '../lwm2m/definitions.ts'
import { instanceTs } from '../lwm2m/instanceTs.ts'
import { ResourceType, type LWM2MObjectInfo } from '../lwm2m/LWM2MObjectInfo.ts'
import type {
	LwM2MObjectInstance,
	LwM2MResourceValue,
} from '../lwm2m/LwM2MObjectInstance.ts'
import { timestampResources } from '../lwm2m/timestampResources.ts'
import type { SenMLType } from './SenMLSchema.ts'

/**
 * Convert LwM2M Object Instances to senML
 */
export const lwm2mToSenML = (
	lwm2m: LwM2MObjectInstance<any>,
): { senML: SenMLType } | { errors: Array<Error> } => {
	const def = definitions[lwm2m.ObjectID]
	const i = instanceTs(lwm2m)
	const tsResourceId = timestampResources.get(lwm2m.ObjectID) as number // All registered objects must have a timestamp resource
	const [first, ...rest] = Object.entries({
		...lwm2m.Resources,
		[tsResourceId]: undefined,
	})
		// Filter out undefined values (and timestamp resource)
		.filter((r): r is [string, LwM2MResourceValue] => r[1] !== undefined)

	if (first === undefined)
		return { errors: [new Error(`No valid LwM2M object found`)] }

	const senML: SenMLType = []
	const errors: Array<Error> = []
	const resourceId = parseInt(first[0], 10)
	const firstKey = toKey(def, resourceId)
	if (firstKey === null) {
		errors.push(
			new Error(
				`Unknown ResourceID ${resourceId} for LwM2M Object ${def.ObjectID}!`,
			),
		)
	} else {
		senML.push({
			bn: `${lwm2m.ObjectID}/${lwm2m.ObjectInstanceID ?? 0}/`,
			n: first[0],
			[firstKey]: first[1],
			bt: i,
		})
	}

	for (const r of rest) {
		const resourceId = parseInt(r[0], 10)
		const key = toKey(def, resourceId)
		if (key === null) {
			errors.push(
				new Error(
					`Unknown ResourceID ${resourceId} for LwM2M Object ${def.ObjectID}!`,
				),
			)
		} else {
			senML.push({
				n: r[0],
				[key]: r[1],
			})
		}
	}

	if (errors.length > 0) return { errors }
	return { senML }
}

const toKey = (def: LWM2MObjectInfo, resourceId: number): string | null => {
	switch (def.Resources[resourceId]?.Type) {
		case ResourceType.String:
			return 'vs'
		case ResourceType.Boolean:
			return 'vb'
		case ResourceType.Float:
		case ResourceType.Integer:
		case ResourceType.Time:
			return 'v'
		case ResourceType.Opaque:
			return 'vd'
		case undefined:
		default:
			return null
	}
}
