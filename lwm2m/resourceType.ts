export const LwM2MType = {
	Boolean: 'Boolean',
	Float: 'Float',
	Integer: 'Integer',
	UnsignedInteger: 'Unsigned Integer',
	Objlnk: 'Objlnk',
	Corelnk: 'Corelnk',
	Opaque: 'Opaque',
	String: 'String',
	Time: 'Time',
} as const
export type LwM2MType = (typeof LwM2MType)[keyof typeof LwM2MType]
