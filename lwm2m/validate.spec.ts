import assert from 'node:assert'
import { describe, it } from 'node:test'
import { validate } from './validate.js'
import { validators } from './validators.js'

void describe('validate()', () => {
	const v = validate(validators)
	void it('should validate a LwM2M object instance', () => {
		const object = {
			ObjectID: 14201,
			ObjectVersion: '1.0',
			Resources: {
				'0': 62.469414,
				'1': 6.151946,
				'6': 'Fixed',
				'3': 1,
				'99': 1710147413,
			},
		}
		const maybeValid = v(object)
		assert.deepEqual('object' in maybeValid && maybeValid.object, object)
	})

	void it('should return an error for an invalid object', () => {
		const maybeValid = v({})
		assert.equal('error' in maybeValid, true)
	})

	void it('should validate an object with undefined optional resources', () => {
		const object = {
			ObjectID: 14203,
			ObjectVersion: '1.0',
			Resources: {
				'0': 'LTE-M GPS',
				'1': 20,
				'3': 33187,
				'4': 52661514,
				'5': 24201,
				'6': '10.234.105.140',
				11: undefined,
				'99': 1716988087,
			},
		}
		const maybeValid = v(object)
		assert.deepEqual('object' in maybeValid && maybeValid.object, object)
	})

	void it('should validate an object with multiple instance resource', () => {
		const object = {
			ObjectID: 14401,
			ObjectVersion: '1.0',
			Resources: {
				'0': ['BOOT', 'MODEM', 'APP'],
				'99': 1717409966,
			},
		}
		const maybeValid = v(object)
		assert.deepEqual('object' in maybeValid && maybeValid.object, object)
	})
})
