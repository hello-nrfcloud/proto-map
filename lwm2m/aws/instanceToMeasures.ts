import {
	MeasureValueType,
	type MeasureValue,
} from '@aws-sdk/client-timestream-write'
import { correctOffset } from '../correctOffset.ts'
import { definitions } from '../definitions.ts'
import { InvalidTimeError } from '../InvalidTimeError.ts'
import { isNumber } from '../isNumber.ts'
import { isNumeric } from '../isNumeric.ts'
import { isUnixTimeInSeconds } from '../isUnixTimeInSeconds.ts'
import type { LwM2MObjectInstance } from '../LwM2MObjectInstance.ts'
import { timestampResources } from '../timestampResources.ts'

export const instanceToMeasures = ({
	Resources,
	ObjectID,
	ObjectInstanceID,
	ObjectVersion,
}: LwM2MObjectInstance): { measures: MeasureValue[] } | { error: Error } => {
	const measures: MeasureValue[] = []

	const tsResource = timestampResources.get(ObjectID) as number
	const ts = Resources[tsResource]

	if (ts === undefined) {
		return {
			error: new InvalidTimeError(
				`No timestamp resource defined for ${ObjectID}!`,
			),
		}
	}

	if (!isNumber(ts)) {
		return {
			error: new InvalidTimeError(
				`Not a timestamp resource defined for ${ObjectID}: ${ts.toString()}!`,
			),
		}
	}
	const correctedTs = correctOffset(ts)

	if (!isUnixTimeInSeconds(correctedTs)) {
		return {
			error: new InvalidTimeError(
				`Timestamp ${JSON.stringify(ts)} for ${ObjectID} is not a valid unix time in seconds!`,
			),
		}
	}

	for (const [ResourceID, Value] of Object.entries(Resources)) {
		const def = definitions[ObjectID].Resources[parseInt(ResourceID, 10)]
		if (def === undefined) {
			return {
				error: new Error(
					`No definition found for ${ObjectID}/${ObjectInstanceID}/${ResourceID}`,
				),
			}
		}

		if (Value === null) continue
		if (Value === undefined) continue

		if (!isNumeric(def)) continue

		measures.push({
			Name: `${ObjectID}/${ObjectVersion}/${ResourceID}`,
			Value: Value.toString(),
			Type: MeasureValueType.DOUBLE,
		})
	}
	return { measures }
}
