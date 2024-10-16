import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import invalidEmails from './test/invalid-emails.json' assert { type: 'json' }
import { Email } from './Email.js'
import { validate } from '../validate.js'

const v = validate(Email)

void describe('it should validate emails', () => {
	for (const validEmail of ['alex@example.com', 'a@a.no']) {
		void it(`should validate ${validEmail}`, () => {
			assert.equal(
				'errors' in v(validEmail),
				false,
				`${validEmail} should be valid`,
			)
		})
	}

	for (const email of invalidEmails) {
		void it(`should not validate ${email}`, () => {
			assert.equal(
				'errors' in v(email),
				true,
				`The email ${email} should not be valid!`,
			)
		})
	}
})
