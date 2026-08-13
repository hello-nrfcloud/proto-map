import { Type } from '@sinclair/typebox'
import { Context } from './Context.ts'
import { DeviceId, PublicDeviceId } from './DeviceId.ts'
import { Model } from './Devices.ts'
import { IsoDateType } from './IsoDateType.ts'

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
