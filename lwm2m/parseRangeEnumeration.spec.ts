import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { RangeEnumerationRegExp } from './LWM2MObjectDefinition.js'
import { parseRangeEnumeration } from './parseRangeEnumeration.js'

void describe('parseRangeEnumeration()', () => {
	void it('should parse valid range enumeration', () => {
		const result = parseRangeEnumeration('1..10')
		assert.deepEqual(result, {
			range: {
				min: 1,
				max: 10,
			},
		})
	})

	void it('should handle invalid range enumeration', () => {
		const result = parseRangeEnumeration('10..1')
		assert.deepEqual(result, {
			error: new Error(
				`'min' must be smaller than 'max' in RangeEnumeration '10..1'!`,
			),
		})
	})

	void it('should handle invalid input', () => {
		const result = parseRangeEnumeration('invalid')
		assert.deepEqual(result, {
			error: new Error(
				`Could not match 'invalid' against ${RangeEnumerationRegExp}!`,
			),
		})
	})
})
