import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { fromCBOR } from './fromCBOR.ts'

void describe('fromCBOR()', () => {
	void it('should convert CBOR encoding to JSON encoding', () =>
		assert.deepEqual(
			fromCBOR([
				{ '0': '0', '2': 28.904369, '-2': '14205/0/' },
				{ '0': '1', '2': 17.66905 },
				{ '0': '2', '2': 100562.21875 },
				{ '0': '10', '2': 57 },
				// Converts from BigInt as well
				{ '0': '99', '2': 1716475294n },
			]),
			[
				{ n: '0', v: 28.904369, bn: '14205/0/' },
				{ n: '1', v: 17.66905 },
				{ n: '2', v: 100562.21875 },
				{ n: '10', v: 57 },
				{ n: '99', v: 1716475294 },
			],
		))
})
