import { LwM2MObjectIDs, type LwM2MObjectID } from './LwM2MObjectID.ts'

export const isLwM2MObjectID = (o: unknown): o is LwM2MObjectID =>
	typeof o === 'number' && LwM2MObjectIDs.includes(o)
