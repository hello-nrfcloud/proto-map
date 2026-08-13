import { SenML } from '../senml/SenMLSchema.ts'
import { validate } from '../validate.ts'

const validator = validate(SenML)

export const validateSenML = (
	maybeSenML: unknown,
): ReturnType<typeof validator> => validator(maybeSenML)
