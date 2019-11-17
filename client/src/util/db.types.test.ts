import { PlayerCodec, Player } from './db.types';
import { map, mapLeft, fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as firebase from 'firebase';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

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
				expect(PathReporter.report(result)).toEqual(errors);
			},
			() => {
				throw new Error(`${result} is not a left`);
			}
		)
	);
}

describe.only('PlayerCodec', () => {
	it('Should succeed validating a valid value', () => {
		const T = PlayerCodec;

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

	it('Should fail validating a invalid value', () => {
		const T = PlayerCodec;

		expectFailure(
			T.decode({
				messagingToken: 12345,
				isDeleted: 'yes',
			}),
			[
				'Invalid value undefined supplied to : Player/0: required/displayName: string',
				'Invalid value undefined supplied to : Player/0: required/uid: string',
				'Invalid value undefined supplied to : Player/0: required/location: PlayerLocation',
				'Invalid value 12345 supplied to : Player/1: optional/messagingToken: string',
				'Invalid value "yes" supplied to : Player/1: optional/isDeleted: boolean',
			]
		);
	});

	it('Should not pass extra params', () => {
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
