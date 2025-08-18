import assert from 'node:assert'
import { describe, it } from 'node:test'
import { parseResourceId } from './parseResourceId.js'

void describe('parseResourceId()', () => {
	void it('should parse an LwM2M resource ID', () =>
		assert.deepEqual(parseResourceId('14201/1/2/0'), {
			ObjectID: 14201,
			ObjectInstanceID: 1,
			ResourceID: 2,
			ResourceInstanceId: 0,
		}))
})
