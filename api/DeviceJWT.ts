import { Type } from '@sinclair/typebox'
import { Context } from './Context.ts'
import { DeviceId, PublicDeviceId } from './DeviceId.ts'
import { Model } from './Devices.ts'

export const DeviceJWTPayload = Type.Object(
	{
		'@context': Type.Literal(Context.deviceJWT.toString()),
		id: PublicDeviceId,
		deviceId: DeviceId,
		model: Model,
	},
	{
		title: 'DeviceJWTPayload',
		description: 'The payload of the JWT for a publicly shared device.',
	},
)

export const DeviceJWT = Type.Intersect([
	Type.Object(
		{
			'@context': Type.Literal(Context.deviceJWT.toString()),
			jwt: Type.String({
				title: 'JWT',
				minLength: 5,
				description: 'The JWT for a publicly shared device.',
				examples: [
					'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6Ijg1NDdiNWIyLTdiNDctNDFlNC1iZjJkLTdjZGZmNDhiM2VhNCJ9.eyJAY29udGV4dCI6Imh0dHBzOi8vZ2l0aHViLmNvbS9oZWxsby1ucmZjbG91ZC9wcm90by1tYXAvZGV2aWNlLWp3dCIsImlkIjoiYmFubmVyZXQtcmVlbmxpc3QtY2hhbGRlYW4iLCJkZXZpY2VJZCI6IjliMDA0MzFhLWM1OWEtNGU4ZC04OTkxLTNlZDc0OTBkZGU3MiIsIm1vZGVsIjoidGhpbmd5OTF4IiwiaWF0IjoxNzIyODcxODA1LCJleHAiOjE3MjI4NzU0MDUsImF1ZCI6ImhlbGxvLm5yZmNsb3VkLmNvbSJ9.Aeh5zwv33Obi7Pm5H4S8f4d3EGUnDyqRCShZV9Yr7nkCedlMfdpSImaLVzh39dlGgHN-XWrWrxMkr5TqxpebPwrfAGh6e_UWl3oO2RHflA6CX7AtwpcwIfm5StE87Ew9KRL6Czhx4e23_FcuhaucGtgcRSMqaVG34uHpvBqiSq8jcpwd',
				],
			}),
		},
		{
			title: 'DeviceJWT',
			description: 'The JWT for a publicly shared device.',
		},
	),
	DeviceJWTPayload,
])
