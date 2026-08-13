import type { LwM2MObjectID } from './LwM2MObjectID.ts'

/**
 * Provides information about the the LwM2M objects defined in this project.
 */
export type LWM2MObjectInfo = {
	ObjectID: LwM2MObjectID
	ObjectVersion: string
	Name: string
	Description: string
	Resources: Record<number, LwM2MResourceInfo>
}

export type LwM2MResourceInfo = {
	ResourceID: number
	Name: string
	Mandatory: boolean
	Type: ResourceType
	Description: string // e.g. 'The decimal notation of latitude, e.g. -43.5723 [World Geodetic System 1984].'
	RangeEnumeration?: Range
	Units?: string // e.g. 'lat'
	Multiple: boolean
}

export type Range = {
	/**
	 * The minimum inclusive value of the range. Always smaller than max.
	 */
	min: number
	/**
	 * The maximum inclusive value of the range. Always larger than min.
	 */
	max: number
}

export enum ResourceType {
	String = 'String',
	Integer = 'Integer',
	Float = 'Float',
	Boolean = 'Boolean',
	Opaque = 'Opaque',
	Time = 'Time',
}
