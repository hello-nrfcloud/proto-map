import assert from 'node:assert/strict'
import { describe, test as it } from 'node:test'
import { validate } from '../validate.ts'
import { IsoDateType } from './IsoDateType.ts'

void describe('isoDateRegExp', () => {
	void it('should match a date string', () => {
		const isoTs = new Date().toISOString()
		const maybeValid = validate(IsoDateType())(isoTs)
		assert.equal('errors' in maybeValid, false)
		assert.equal('value' in maybeValid && maybeValid?.value, isoTs)
	})
	void it('should validate a date string with local timezone', () => {
		const isoTs = '2024-07-01T16:33:15+02:00'
		const maybeValid = validate(IsoDateType())(isoTs)
		assert.equal('errors' in maybeValid, false)
		assert.equal('value' in maybeValid && maybeValid?.value, isoTs)
	})
})
