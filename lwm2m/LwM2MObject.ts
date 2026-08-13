import type { LwM2MObjectID } from './LwM2MObjectID.ts'
import type { LwM2MResourceValue } from './LwM2MObjectInstance.ts'

export type LwM2MObject<
	ObjectDef extends {
		ObjectID: LwM2MObjectID
		/**
		 * The Object Version of an Object is composed of 2 digits separated by a dot '.'
		 *
		 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_1_1-20190617-A/OMA-TS-LightweightM2M_Core-V1_1_1-20190617-A.pdf Section 7.2.2
		 */
		ObjectVersion: string
		Resources: Record<number, LwM2MResourceValue | undefined>
	},
> = {
	ObjectID: ObjectDef['ObjectID']
	ObjectVersion: ObjectDef['ObjectVersion']
	Resources: ObjectDef['Resources']
}
