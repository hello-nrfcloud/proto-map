import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { SenMLType } from './SenMLSchema.js'
import { validateSenML } from './validateSenML.js'

void describe('validateSenML()', () => {
	void it('should validate', () => {
		const senMl: SenMLType = [
			{ bn: '14202/1/', blv: '1.1', n: '0', v: 99, bt: 1699049685 },
			{ n: '1', v: 4.179 },
			{ n: '2', v: 0 },
			{ n: '3', v: 25.7 },
		]
		assert.deepEqual(validateSenML(senMl), { value: senMl })
	})
})
