import * as firebase from 'firebase';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

import { PlayerCodec } from './db.types';

function expectSuccess<T>(result: t.Validation<T>, expected?: T): void {
	pipe(
		result,
		fold(
			() => {
				throw new Error(`${result} is not a right`);
			},
			a => {
				if (expected !== undefined) {
					expect(a).toEqual(expected);
				}
			}
		)
	);
}

function expectFailure(result: t.Validation<any>, errors: Array<string>): void {
	pipe(
		result,
		fold(
			() => {
				expect(PathReporter.report(result)).toIncludeAllMembers(errors);
			},
			() => {
				throw new Error(`${result} is not a left`);
			}
		)
	);
}

describe('PlayerCodec', () => {
	describe('should succeed validating a valid value', () => {
		const T = PlayerCodec;

		test('without partials', () => {
			expectSuccess(
				T.decode({
					displayName: 'lir',
					uid: 'someUid',
					location: {
						geopoint: new firebase.firestore.GeoPoint(1, 2),
						timestamp: new firebase.firestore.Timestamp(1, 2),
					},
				})
			);
			expectSuccess(
				T.decode({
					displayName: 'test',
					uid: 'anotherUid',
					location: null,
				})
			);
		});
		test('with partials', () => {
			expectSuccess(
				T.decode({
					displayName: 'lir',
					uid: 'someUid',
					location: {
						geopoint: new firebase.firestore.GeoPoint(1, 2),
						timestamp: new firebase.firestore.Timestamp(1, 2),
					},
					isDeleted: true,
					messagingToken: 'messaging',
				})
			);
		});
	});

	it('should fail validating a invalid value', () => {
		const T = PlayerCodec;

		expectFailure(
			T.decode({
				messagingToken: 12345,
				isDeleted: 'yes',
			}),
			[
				'Invalid value undefined supplied to : Player/0: required/displayName: string',
				'Invalid value undefined supplied to : Player/0: required/uid: string',
				'Invalid value 12345 supplied to : Player/1: optional/messagingToken: string',
				'Invalid value "yes" supplied to : Player/1: optional/isDeleted: boolean',
			]
		);
		expectFailure(
			T.decode({
				displayName: 123,
				uid: null,
				location: { lat: 12, long: 12 },
			}),
			[
				'Invalid value 123 supplied to : Player/0: required/displayName: string',
				'Invalid value null supplied to : Player/0: required/uid: string',
				'Invalid value {"lat":12,"long":12} supplied to : Player/0: required/location: (PlayerLocation | null)/1: null',
			]
		);
	});

	it('should not pass extra params', () => {
		const T = PlayerCodec;
		expect.assertions(2);

		expectSuccess(
			T.decode({
				displayName: 'lir',
				uid: 'someUid',
				location: {
					geopoint: new firebase.firestore.GeoPoint(1, 2),
					timestamp: new firebase.firestore.Timestamp(1, 2),
				},
				test: 'lir',
			}),
			{
				displayName: 'lir',
				uid: 'someUid',
				location: {
					geopoint: new firebase.firestore.GeoPoint(1, 2),
					timestamp: new firebase.firestore.Timestamp(1, 2),
				},
			}
		);
		expectSuccess(
			T.decode({
				displayName: 'lir',
				uid: 'someUid',
				location: {
					geopoint: new firebase.firestore.GeoPoint(1, 2),
					timestamp: new firebase.firestore.Timestamp(1, 2),
					test: 'lir',
				},
			}),
			{
				displayName: 'lir',
				uid: 'someUid',
				location: {
					geopoint: new firebase.firestore.GeoPoint(1, 2),
					timestamp: new firebase.firestore.Timestamp(1, 2),
				},
			}
		);
	});
});
