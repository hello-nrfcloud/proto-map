import type { LwM2MObjectID } from './LwM2MObjectID.ts'

export type LwM2MResourceValue =
	| string
	| number
	| boolean
	| Array<string>
	| Array<number>
	| Array<boolean>

type GenericLwM2MObjectInstance = {
	ObjectID: LwM2MObjectID
	/**
	 * @default 0
	 */
	ObjectInstanceID?: number
	/**
	 * @default '1.0'
	 */
	ObjectVersion?: string
	/**
	 * Key range: 0..65534
	 */
	Resources: Partial<Record<number, LwM2MResourceValue>>
}
export type LwM2MObjectInstance<
	Instance extends GenericLwM2MObjectInstance = GenericLwM2MObjectInstance,
> = {
	ObjectID: LwM2MObjectID
	/**
	 * @default 0
	 */
	ObjectInstanceID?: number
	/**
	 * @default '1.0'
	 */
	ObjectVersion?: Instance['ObjectVersion']
	/**
	 * Key range: 0..65534
	 */
	Resources: Instance['Resources']
}
