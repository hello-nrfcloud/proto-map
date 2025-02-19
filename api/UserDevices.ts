import { Type } from '@sinclair/typebox'
import { Context } from './Context.js'
import { DeviceId, PublicDeviceId } from './DeviceId.js'
import { Model } from './Devices.js'
import { IsoDateType } from './IsoDateType.js'

export const UserDevices = Type.Object({
	'@context': Type.Literal(Context.userDevices.toString()),
	devices: Type.Array(
		Type.Object({
			id: PublicDeviceId,
			deviceId: DeviceId,
			model: Model,
			expires: IsoDateType(
				'The date when the device will be removed from the list of devices',
			),
		}),
	),
})
