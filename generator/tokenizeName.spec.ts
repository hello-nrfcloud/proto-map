import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { tokenizeName } from './tokenizeName.ts'

void describe('tokenizeName', () => {
	for (const [name, expected] of [
		// Uppercase words
		['Battery and Power', 'BatteryAndPower'],
		['LwM2M Server', 'LwM2MServer'],
		// Dash -> underline
		['LTE-MTC Band Config', 'LTE_MTCBandConfig'],
		// Number at the Beginning, prefix with n
		['5GNR Connectivity', 'n5GNRConnectivity'],
		// Slash -> underline
		['On/Off Switch', 'On_OffSwitch'],
		// Dot -> underline
		['LwM2M v1.1 Test Object', 'LwM2MV1_1TestObject'],
		// & -> and
		['AT&T Connectivity Extension', 'ATandTConnectivityExtension'],
		// Remove whitespace
		[' Server ', 'Server'],
	] as [string, string][]) {
		void it(`should replaced ${name} to ${expected}`, () =>
			assert.equal(tokenizeName(name), expected))
	}
})
