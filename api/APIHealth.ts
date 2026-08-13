import { Type } from '@sinclair/typebox'
import { Context } from './Context.ts'

export const APIHealth = Type.Object(
	{
		'@context': Type.Literal(Context.apiHealth.toString()),
		version: Type.String({
			title: 'Version',
			minLength: 1,
			description: 'The version of the API.',
		}),
	},
	{ title: 'APIHealth', description: 'Information about the API.' },
)
