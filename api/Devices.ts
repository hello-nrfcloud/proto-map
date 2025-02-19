import { Type } from '@sinclair/typebox'
import { models } from '../models/models.js'
import { Context } from './Context.js'
import { DeviceId, PublicDeviceId } from './DeviceId.js'
import {
	ObjectID,
	ObjectInstanceID,
	ObjectVersion,
	Resources,
} from './LwM2M.js'

export const LwM2MObjectInstance = Type.Object({
	ObjectID,
	ObjectVersion: Type.Optional(ObjectVersion),
	ObjectInstanceID: Type.Optional(ObjectInstanceID),
	Resources,
})

export const Model = Type.Union(
	Object.keys(models).map((s) => Type.Literal(s)),
	{
		title: 'Model',
		description:
			'Must be one of the models defined in @hello.nrfcloud.com/proto-map',
	},
)

export const PublicDevice = Type.Object(
	{
		'@context': Type.Literal(Context.device.toString()),
		id: PublicDeviceId,
		deviceId: DeviceId,
		model: Model,
		state: Type.Optional(Type.Array(LwM2MObjectInstance)),
	},
	{ title: 'Public device', description: 'A device that is publicly visible.' },
)

export const Devices = Type.Object({
	'@context': Type.Literal(Context.devices.toString()),
	devices: Type.Array(PublicDevice),
})
