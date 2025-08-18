import assert from 'node:assert'
import { describe, it } from 'node:test'
import { LwM2MObjectID } from '../LwM2MObjectID.js'
import type { Environment_14205 } from '../objects.js'
import { instanceMeasuresToRecord } from './instanceMeasuresToRecord.js'

void describe('instanceMeasuresToRecord()', () => {
	void it('should convert LwM2M object instance to Timestream records', () => {
		const env: Environment_14205 = {
			ObjectID: LwM2MObjectID.Environment_14205,
			ObjectVersion: '1.0',
			Resources: {
				0: 21,
				1: 45,
				'99': 1717419305,
			},
		}

		const maybeRecord = instanceMeasuresToRecord(env)
		assert.deepEqual('record' in maybeRecord && maybeRecord.record, {
			Dimensions: [
				{
					Name: 'ObjectID',
					Value: LwM2MObjectID.Environment_14205,
				},
				{
					Name: 'ObjectInstanceID',
					Value: '0',
				},
				{
					Name: 'ObjectVersion',
					Value: '1.0',
				},
			],
			MeasureName: '14205/0',
			MeasureValueType: 'MULTI',
			MeasureValues: [
				{
					Name: '14205/1.0/0',
					Type: 'DOUBLE',
					Value: '21',
				},
				{
					Name: '14205/1.0/1',
					Type: 'DOUBLE',
					Value: '45',
				},
			],
			Time: '1717419305',
			TimeUnit: 'SECONDS',
		})
	})
})
