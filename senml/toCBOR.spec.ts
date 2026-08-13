import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { fromCBOR } from './fromCBOR.ts'
import { toCBOR } from './toCBOR.ts'

void describe('toCBOR()', () => {
	void it('should convert JSON encoding to CBOR encoding', () =>
		assert.deepEqual(
			toCBOR([
				{ n: '0', v: 28.904369, bn: '14205/0/' },
				{ n: '1', v: 17.66905 },
				{ n: '2', v: 100562.21875 },
				{ n: '10', v: 57 },
			]),
			[
				{ '0': '0', '2': 28.904369, '-2': '14205/0/' },
				{ '0': '1', '2': 17.66905 },
				{ '0': '2', '2': 100562.21875 },
				{ '0': '10', '2': 57 },
			],
		))

	void it('should round-trip through fromCBOR', () => {
		const json = [
			{ n: '0', v: 28.904369, bn: '14205/0/' },
			{ n: '1', v: 17.66905, u: 'lat' },
		]
		assert.deepEqual(fromCBOR(toCBOR(json)), json)
	})

	void it('should round-trip through toCBOR', () => {
		const cbor = [
			{ '0': '0', '2': 28.904369, '-2': '14205/0/' },
			{ '0': '1', '2': 17.66905, '1': 'lat' },
		]
		assert.deepEqual(toCBOR(fromCBOR(cbor)), cbor)
	})
})
