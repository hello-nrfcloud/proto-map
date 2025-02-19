import type { LwM2MObjectID } from './LwM2MObjectID.js'
import type { LwM2MObjectInstance } from './LwM2MObjectInstance.js'
import { isLwM2MObject } from './validation.js'

export const validate =
	(
		validators: Map<
			LwM2MObjectID,
			(o: unknown) => { object: LwM2MObjectInstance } | { error: Error }
		>,
	) =>
	(o: unknown): { object: LwM2MObjectInstance } | { error: Error } => {
		const maybeValidInstance = isLwM2MObject(o)
		if ('error' in maybeValidInstance) return maybeValidInstance
		const i = maybeValidInstance.object
		const validator = validators.get(i.ObjectID)
		if (validator === undefined) {
			return {
				error: new Error(`No validator defined for ObjectID: ${i.ObjectID}!`),
			}
		}
		return validator(o)
	}
