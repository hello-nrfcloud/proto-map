import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { instanceTs, instanceTsAsDate } from './instanceTs.ts'

void describe('instanceTs()', () => {
	void it('should return the timestamp of the instance', () =>
		assert.equal(
			instanceTs({
				ObjectID: 14210,
				ObjectVersion: '1.0',
				Resources: {
					'0': 3.5399999618530273,
					'1': 4.168000221252441,
					'99': 1708683500,
				},
			}),
			1708683500,
		))
})

void describe('instanceTsAsDate()', () => {
	void it('should return the timestamp of the instance', () =>
		assert.equal(
			instanceTsAsDate({
				ObjectID: 14210,
				ObjectVersion: '1.0',
				Resources: {
					'0': 3.5399999618530273,
					'1': 4.168000221252441,
					'99': 1708683500,
				},
			}).getTime(),
			1708683500 * 1000,
		))
})
