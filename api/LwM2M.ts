import { Type } from '@sinclair/typebox'
import { LwM2MObjectID } from '../lwm2m/LwM2MObjectID.ts'

export const ObjectVersion = Type.String({
	pattern: '^[0-9]+.[0-9]+$',
	default: '1.0',
	examples: ['1.0', '1.1'],
	description:
		"The Object Version of an Object is composed of 2 digits separated by a dot '.'.\nSee https://www.openmobilealliance.org/release/LightweightM2M/V1_1_1-20190617-A/OMA-TS-LightweightM2M_Core-V1_1_1-20190617-A.pdf Section 7.2.2",
})

export const ObjectID = Type.Enum(LwM2MObjectID, {
	description: 'The LwM2M Object IDs defined in @hello.nrfcloud.com/proto-map',
})

export const ObjectInstanceID = Type.Integer({
	minimum: 0,
	default: 0,
	description: 'The LwM2M Object Instance ID',
	examples: [0, 1],
})

const String = Type.String({ minLength: 1, title: 'LwM2M string value' })
const Number = Type.Number({ title: 'LwM2M number value' })
const Boolean = Type.Boolean({ title: 'LwM2M boolean value' })

export const Resources = Type.Record(
	Type.Integer({ minimum: 0 }),
	Type.Union([
		String,
		Type.Array(String),
		Number,
		Type.Array(Number),
		Boolean,
		Type.Array(Boolean),
	]),
)
