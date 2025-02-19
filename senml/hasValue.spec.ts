import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { hasValue } from './hasValue.js'

void describe('hasValue() should determine whether an object has a value', () => {
	for (const [record, expected] of [
		[{ bn: 14202, n: 0, v: 99, bt: 1699049685 }, true],
		[{ n: 1, v: 4.179 }, true],
		[{ n: 2, v: 0 }, true],
		[{ n: 3, v: 25.7 }, true],
		[{ n: 4, v: null }, false],
		[{ n: 5, v: null }, false],
	]) {
		void it(`should determine that ${JSON.stringify(
			record,
		)} has a value: ${JSON.stringify(expected)}`, () =>
			assert.equal(hasValue(record), expected))
	}
})
