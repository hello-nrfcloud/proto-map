import assert from 'node:assert'
import { describe, it } from 'node:test'
import {
	MultipleInstanceResource,
	OptionalResource,
	StringResource,
} from './validation.js'

void describe('MultipleInstanceResource()', () => {
	void it('should validate a multiple instance resource', () => {
		assert.equal(
			true,
			MultipleInstanceResource(StringResource)(['BOOT', 'MODEM', 'APP']),
		)
	})
})

void describe('StringResource()', () => {
	void it('should validate a string', () => {
		assert.equal(true, StringResource('test'))
	})
})

void describe('OptionalResource()', () => {
	void it('should validate an undefined resource', () => {
		assert.equal(true, OptionalResource(StringResource)(undefined))
	})
	void it('should validate an defined resource', () => {
		assert.equal(true, OptionalResource(StringResource)('foo'))
	})
	void it('should not validate an invalid defined resource', () => {
		assert.equal(false, OptionalResource(StringResource)(true))
	})
})

void describe('combination', () => {
	void it('should validate OptionalResource(MultipleInstanceResource(StringResource))', () => {
		assert.equal(
			true,
			OptionalResource(MultipleInstanceResource(StringResource))([
				'BOOT',
				'MODEM',
				'APP',
			]),
		)
		assert.equal(
			true,
			OptionalResource(MultipleInstanceResource(StringResource))(undefined),
		)
		assert.equal(
			false,
			OptionalResource(MultipleInstanceResource(StringResource))('foo'),
		)
	})
})
