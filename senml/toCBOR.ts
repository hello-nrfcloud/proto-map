const reverseLabelMap = new Map<string, number>([
	['bver', -1], // Base Version
	['bn', -2], // Base Name
	['bt', -3], // Base Time
	['bu', -4], // Base Unit
	['bv', -5], // Base Value
	['bs', -6], // Base Sum
	['n', 0], // Name
	['u', 1], // Unit
	['v', 2], // Value
	['vs', 3], // String Value
	['vb', 4], // Boolean Value
	['s', 5], // Sum
	['t', 6], // Time
	['ut', 7], // Update Time
	['vd', 8], // Data Value
])

/**
 * Convert SenML from JSON notation to CBOR notation.
 *
 * @see https://www.rfc-editor.org/rfc/rfc8428.html#section-6
 */
export const toCBOR = (
	records: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> =>
	records.map((record) =>
		Object.entries(record).reduce(
			(cbor, [label, v]) => {
				const key = reverseLabelMap.get(label)
				if (key === undefined) return cbor
				return {
					...cbor,
					[String(key)]: v,
				}
			},
			{} as Record<string, unknown>,
		),
	)
