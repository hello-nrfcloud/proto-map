import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { LwM2MObjectID } from '../lwm2m/LwM2MObjectID.js'
import type { LwM2MObjectInstance } from '../lwm2m/LwM2MObjectInstance.js'
import type {
	Geolocation_14201,
	SeaWaterLevel_14230,
} from '../lwm2m/objects.js'
import { lwm2mToSenML } from './lwm2mToSenML.js'
import type { SenMLType } from './SenMLSchema.js'

void describe('lwm2mToSenML()', () => {
	void it('should convert LwM2M to SenML', () => {
		const location: LwM2MObjectInstance<Geolocation_14201> = {
			ObjectID: LwM2MObjectID.Geolocation_14201,
			ObjectVersion: '1.0',
			Resources: {
				'0': 62.469414,
				'1': 6.151946,
				'6': 'Fixed',
				'3': 1,
				'99': 1710147413,
			},
		}
		const level1: LwM2MObjectInstance<SeaWaterLevel_14230> = {
			ObjectID: LwM2MObjectID.SeaWaterLevel_14230,
			ObjectVersion: '1.0',
			Resources: {
				'0': 84.3,
				'1': 'AES',
				'99': 1710140400,
			},
		}
		const level2: LwM2MObjectInstance<SeaWaterLevel_14230> = {
			ObjectID: LwM2MObjectID.SeaWaterLevel_14230,
			ObjectVersion: '1.0',
			Resources: {
				'0': 140.4,
				'1': 'AES',
				'99': 1710144000,
			},
		}
		const level3: LwM2MObjectInstance<SeaWaterLevel_14230> = {
			ObjectID: LwM2MObjectID.SeaWaterLevel_14230,
			ObjectVersion: '1.0',
			ObjectInstanceID: 1,
			Resources: {
				'0': 140.7,
				'1': 'AES',
				'99': 1710144001,
			},
		}
		const lwm2m: Array<LwM2MObjectInstance<any>> = [
			location,
			level1,
			level2,
			level3,
		]
		const expected: SenMLType = [
			{ bn: '14201/0/', n: '0', v: 62.469414, bt: 1710147413 },
			{ n: '1', v: 6.151946 },
			{ n: '3', v: 1 },
			{ n: '6', vs: 'Fixed' },
			{ bn: '14230/0/', n: '0', v: 84.3, bt: 1710140400 },
			{ n: '1', vs: 'AES' },
			{ bn: '14230/0/', n: '0', v: 140.4, bt: 1710144000 },
			{ n: '1', vs: 'AES' },
			{ bn: '14230/1/', n: '0', v: 140.7, bt: 1710144001 },
			{ n: '1', vs: 'AES' },
		]

		assert.deepEqual(
			lwm2m
				.map(lwm2mToSenML)
				.map((res) => 'senML' in res && res.senML)
				.flat(),
			expected,
		)
	})
})
