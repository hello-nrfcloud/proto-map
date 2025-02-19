import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { definitions } from '../lwm2m/definitions.js'
import { LwM2MObjectID } from '../lwm2m/LwM2MObjectID.js'
import { ResourceType } from '../lwm2m/LWM2MObjectInfo.js'

void describe('generateLwM2MDefinitions()', () => {
	void it('should have generated definitions from the XML files', () => {
		assert.deepEqual(definitions[LwM2MObjectID.Geolocation_14201], {
			ObjectID: 14201,
			ObjectVersion: '1.0',
			Name: 'Geolocation',
			Description: 'Describes the geo location of a device',
			Resources: {
				0: {
					ResourceID: 0,
					Name: 'Latitude',
					Mandatory: true,
					Type: ResourceType.Float,
					Multiple: false,
					Description:
						'The decimal notation of latitude in degrees, e.g. -43.5723 [World Geodetic System 1984].',
					Units: '°',
					RangeEnumeration: {
						max: 90,
						min: -90,
					},
				},
				1: {
					ResourceID: 1,
					Name: 'Longitude',
					Mandatory: true,
					Type: ResourceType.Float,
					Multiple: false,
					Description:
						'The decimal notation of longitude in degrees, e.g. 153.21760 [World Geodetic System 1984].',
					Units: '°',
					RangeEnumeration: {
						max: 180,
						min: -180,
					},
				},
				2: {
					ResourceID: 2,
					Name: 'Altitude',
					Mandatory: false,
					Type: ResourceType.Float,
					Multiple: false,
					Description:
						'The decimal notation of altitude in meters above sea level.',
					Units: 'm',
				},
				3: {
					ResourceID: 3,
					Name: 'Radius',
					Mandatory: false,
					Type: ResourceType.Float,
					Multiple: false,
					Description:
						'The value in this resource indicates the radius of a circular area in meters. The circular area is used to describe uncertainty about a point for coordinates in a two-dimensional coordinate reference systems (CRS). The center point of a circular area is specified by using the Latitude and the Longitude Resources.',
					Units: 'm',
				},
				4: {
					ResourceID: 4,
					Name: 'Speed',
					Mandatory: false,
					Type: ResourceType.Float,
					Multiple: false,
					Description: 'Speed is the time rate of change in position.',
					Units: 'm/s',
				},
				5: {
					ResourceID: 5,
					Name: 'Heading',
					Mandatory: false,
					Type: ResourceType.Float,
					Multiple: false,
					Description: 'The angle of movement in degrees.',
					Units: '°',
					RangeEnumeration: {
						min: 0,
						max: 360,
					},
				},
				6: {
					ResourceID: 6,
					Name: 'Source',
					Mandatory: true,
					Type: ResourceType.String,
					Multiple: false,
					Description:
						'The source of the geo location, e.g. GNSS, SCELL, MCELL, WIFI.',
				},
				99: {
					ResourceID: 99,
					Name: 'Timestamp',
					Mandatory: true,
					Type: ResourceType.Time,
					Multiple: false,
					Description:
						'The timestamp of when the location measurement was performed.',
				},
			},
		})

		// Support for multiple instance resources
		assert.deepEqual(
			definitions[LwM2MObjectID.NRFCloudServiceInfo_14401].Resources[0]
				?.Multiple,
			true,
		)
	})
})
