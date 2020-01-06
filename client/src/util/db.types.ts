import * as firebase from 'firebase/app';
import { either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export const FirebaseTimestampCodec = new t.Type<
	firebase.firestore.Timestamp,
	Date,
	unknown
>(
	'FirebaseTimestamp',
	(u): u is firebase.firestore.Timestamp =>
		u instanceof firebase.firestore.Timestamp,
	function(this: t.Type<firebase.firestore.Timestamp, Date, unknown>, u, c) {
		return this.is(u)
			? t.success(u)
			: u instanceof Date
			? t.success(firebase.firestore.Timestamp.fromDate(u))
			: either.chain(t.number.validate(u, c), n => {
					try {
						const timestamp = new firebase.firestore.Timestamp(n, 0);
						return t.success(timestamp);
					} catch (err) {
						return t.failure(
							u,
							c,
							'cannot parse to firebase.firestore.Timestamp'
						);
					}
			  });
	},
	timestamp => timestamp.toDate()
);

export const FirebaseGeoPointCodec = new t.Type<
	firebase.firestore.GeoPoint,
	{ lat: number; long: number },
	unknown
>(
	'FirebaseGeoPoint',
	(u): u is firebase.firestore.GeoPoint =>
		u instanceof firebase.firestore.GeoPoint,
	function(
		this: t.Type<
			firebase.firestore.GeoPoint,
			{ lat: number; long: number },
			unknown
		>,
		u,
		c
	) {
		return this.is(u)
			? t.success(u)
			: either.chain(
					t
						.type({
							lat: t.number,
							long: t.number,
						})
						.validate(u, c),
					coord => {
						try {
							const geopoint = new firebase.firestore.GeoPoint(
								coord.lat,
								coord.long
							);
							return t.success(geopoint);
						} catch (err) {
							return t.failure(u, c, 'cannot pare to firebase geopoint');
						}
					}
			  );
	},
	geopoint => {
		const { latitude: lat, longitude: long } = geopoint;
		return { lat, long };
	}
);

const NumberCodec = new t.Type<number, string, string>(
	'NumberCodec',
	t.number.is,
	(s, c) => {
		const n = parseFloat(s);
		return isNaN(n) ? t.failure(s, c) : t.success(n);
	},
	String
);
const NumberFromStringCodec = t.string.pipe(NumberCodec, 'NumberFromString');

export const MetroLineCodec = t.keyof({
	'green line': null,
	'yellow line': null,
	'red line': null,
});
export type MetroLine = t.TypeOf<typeof MetroLineCodec>;

export const IntelItemCodec = t.strict(
	{
		action: t.union(
			[
				t.strict(
					{
						type: t.keyof({ tram: null, bus: null }),
						text: NumberFromStringCodec,
					},
					'Action_tramBus'
				),
				t.strict(
					{
						type: t.literal('metro'),
						text: MetroLineCodec,
					},
					'Action_metro'
				),
				t.strict(
					{
						type: t.literal('walking'),
						text: t.string,
						coordinates: FirebaseGeoPointCodec,
					},
					'Action_walking'
				),
			],
			'IntelItemAction'
		),
		timestamp: FirebaseTimestampCodec,
	},
	'IntelItem'
);

export type IntelItem = t.TypeOf<typeof IntelItemCodec>;
export type ActionType = IntelItem['action']['type'];

export const PlayerRoleCodec = t.keyof(
	{ detective: null, intelligence: null, chaser: null },
	'PlayerRole'
);
export type PlayerRole = t.TypeOf<typeof PlayerRoleCodec>;

// TODO: Test that t.exact works as intended
export const PlayerCodec = t.exact(
	t.intersection([
		t.type(
			{
				// TODO: Change to be optional, need to change implementation
				displayName: t.string,
				role: PlayerRoleCodec,
				uid: t.string,
				location: t.union([
					t.strict(
						{
							geopoint: FirebaseGeoPointCodec,
							timestamp: FirebaseTimestampCodec,
						},
						'PlayerLocation'
					),
					t.null,
				]),
			},
			'required'
		),
		t.partial(
			{
				messagingToken: t.string,
				isDeleted: t.boolean,
			},
			'optional'
		),
	]),
	'Player'
);
export type Player = t.TypeOf<typeof PlayerCodec>;

export const ChatItemCodec = t.strict(
	{
		author: t.strict(
			{
				displayName: t.union([t.string, t.null]),
				uid: t.string,
			},
			'ChatItemAuthor'
		),
		message: t.string,
		timestamp: FirebaseTimestampCodec,
	},
	'ChatItem'
);
export type ChatItem = t.TypeOf<typeof ChatItemCodec>;

export const GameDocCodec = t.partial({
	chaser_sequence_num: t.number,
	collected_identity_points: t.array(t.number),
	collected_intelligence_points: t.array(t.number),
	//? I think it might not a NonEmptyArray
	// suspect_list: NonEmptyArray<t.number | t.string>,
	marked_suspects: t.array(t.number),
	hidden_suspects: t.array(t.number),
	// TODO: Use array instead of object
	// detective_clues: { [property: t.string]: t.string },
	phase: t.number,
});
