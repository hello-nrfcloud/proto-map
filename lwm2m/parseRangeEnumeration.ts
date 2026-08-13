import { RangeEnumerationRegExp } from './LWM2MObjectDefinition.ts'
import type { Range } from './LWM2MObjectInfo.ts'

export const parseRangeEnumeration = (
	re: string,
): { range: Range } | { error: Error } => {
	const match = RangeEnumerationRegExp.exec(re)
	if (match === null)
		return {
			error: new Error(
				`Could not match '${re}' against ${RangeEnumerationRegExp}!`,
			),
		}
	const { min: minS, max: maxS } = match.groups ?? {}
	const min = parseFloat(minS as string)
	const max = parseFloat(maxS as string)
	if (min > max)
		return {
			error: new Error(
				`'min' must be smaller than 'max' in RangeEnumeration '${re}'!`,
			),
		}
	return {
		range: {
			min,
			max,
		},
	}
}
