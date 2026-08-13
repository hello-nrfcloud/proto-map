import { Type } from '@sinclair/typebox'
import { Context } from './Context.ts'
import { Email } from './Email.ts'

export const UserJWTPayload = Type.Object(
	{
		'@context': Type.Literal(Context.userJWT.toString()),
		email: Email,
	},
	{
		title: 'UserJWTPayload',
		description: 'The payload of the JWT for a user identified by their email.',
	},
)

export const UserJWT = Type.Intersect([
	Type.Object(
		{
			'@context': Type.Literal(Context.userJWT.toString()),
			jwt: Type.String({
				title: 'JWT',
				minLength: 5,
				description: 'The JWT for a user.',
				examples: [
					'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6Ijg1NDdiNWIyLTdiNDctNDFlNC1iZjJkLTdjZGZmNDhiM2VhNCJ9.eyJAY29udGV4dCI6Imh0dHBzOi8vZ2l0aHViLmNvbS9oZWxsby1ucmZjbG91ZC9wcm90by1tYXAvdXNlci1qd3QiLCJlbWFpbCI6ImVkYjJiZDM3QGV4YW1wbGUuY29tIiwiaWF0IjoxNzIyODcxNTYyLCJleHAiOjE3MjI5NTc5NjIsImF1ZCI6ImhlbGxvLm5yZmNsb3VkLmNvbSJ9.ALiHjxR7HIjuYQBvPVh5-GMs-2f-pMGs_FTz-x0HGzQ4amLASeUGEZ7X_y-_mgZpYu8VKGm6be0LtIIx9DgYBff1ASfmQH327rub0a2-DjXW-JUJQn_6t6H6_JhvPZ9jWBSzy3Tbpp9NmTUNmHgEwzyoctnmgp0oo26VEwc4r6YGQWkZ',
				],
			}),
		},
		{
			title: 'UserJWT',
			description: 'The JWT for a user.',
		},
	),
	UserJWTPayload,
])
