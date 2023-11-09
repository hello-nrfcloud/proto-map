import { describe, it } from 'node:test'
import assert from 'node:assert'
import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { Geolocation_14201 } from '../lwm2m/14201.js'
import type { Static } from '@sinclair/typebox'

void describe('validateLwM2M', () => {
	void it(`should validate LwM2M object follows type  definition`, async () => {
		const object: Static<typeof Geolocation_14201> = {
			ObjectID: 14201,
			ObjectVersion: '1.0',
			Resources: {
				0: 33.98755678796222,
				1: -84.506132079174634,
				2: 295.468994140625,
				3: 17.74077033996582,
				4: 26.376304626464844,
				5: 359.1545715332,
				6: 'GNSS',
				99: new Date(1698155694), // TODO validation fail in ajv.compile(schema). Fix it
			},
		}

		const result = validateWithTypeBox(Geolocation_14201)(
			object,
		) as unknown as {
			value: unknown
		}

		assert.deepEqual(result.value, object)
	})
})
