import {
	MeasureValueType,
	TimeUnit,
	type _Record,
} from '@aws-sdk/client-timestream-write'
import { instanceTs } from '../instanceTs.js'
import type { LwM2MObjectInstance } from '../LwM2MObjectInstance.js'
import { instanceToMeasures } from './instanceToMeasures.js'
import { NoHistoryMeasuresError } from './NoHistoryMeasuresError.js'

export const instanceMeasuresToRecord = ({
	ObjectID,
	ObjectInstanceID,
	ObjectVersion,
	Resources,
}: LwM2MObjectInstance):
	| { error: Error | NoHistoryMeasuresError }
	| { record: _Record } => {
	const maybeMeasures = instanceToMeasures({
		ObjectID,
		ObjectInstanceID,
		ObjectVersion,
		Resources,
	})
	if ('error' in maybeMeasures) return maybeMeasures
	if (maybeMeasures.measures.length === 0)
		return {
			error: new NoHistoryMeasuresError(
				`No measure to be stored in history for object ${ObjectID}!`,
			),
		}
	const instanceTime = instanceTs({
		ObjectID,
		ObjectInstanceID,
		Resources,
	})
	if (instanceTime === undefined)
		return { error: new Error(`No timestamp found for ${ObjectID}!`) }
	return {
		record: {
			Dimensions: [
				{
					Name: 'ObjectID',
					Value: ObjectID.toString(),
				},
				{
					Name: 'ObjectInstanceID',
					Value: (ObjectInstanceID ?? 0).toString(),
				},
				{
					Name: 'ObjectVersion',
					Value: ObjectVersion,
				},
			],
			MeasureName: `${ObjectID}/${ObjectInstanceID ?? 0}`,
			MeasureValues: maybeMeasures.measures,
			MeasureValueType: MeasureValueType.MULTI,
			Time: instanceTime.toString(),
			TimeUnit: TimeUnit.SECONDS,
		},
	}
}
