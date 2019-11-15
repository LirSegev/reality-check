/// <reference types="firebase" />
/// <reference types="../global" />

declare namespace DB {
	export interface GameDoc {
		chaser_sequence_num?: number;
		collected_identity_points?: number[];
		collected_intelligence_points?: number[];
		suspect_list: NonEmptyArray<number | string>;
		detective_clues?: { [property: string]: string };
		phase?: number;
	}

	export namespace Game {
		export interface ChatItem {
			author: {
				displayName: string | null;
				uid: string;
			};
			message: string;
			timeStamp: firebase.firestore.Timestamp;
		}

		export namespace Intel {
			export interface IntelItem {
				action: Action_tramBus | Action_Metro | Action_walking;
				timestamp: firebase.firestore.Timestamp;
			}

			export type ActionType = IntelItem['action']['type'];

			export type MetroLine = 'green line' | 'yellow line' | 'red line';

			interface Action_tramBus {
				type: 'tram' | 'bus';
				text: number;
			}
			interface Action_Metro {
				type: 'metro';
				text: MetroLine;
			}
			interface Action_walking {
				type: 'walking';
				text: string;
				coordinates: firebase.firestore.GeoPoint;
			}
		}

		export namespace Players {
			export interface Player {
				displayName: string;
				// TODO: Change to be optional, need to change implementation
				role: PlayerRole;
				uid: string;
				location: {
					geopoint: firebase.firestore.GeoPoint;
					timestamp: firebase.firestore.Timestamp;
				} | null;
				messagingToken?: string;
				isDeleted?: boolean;
			}

			export type PlayerRole = 'detective' | 'intelligence' | 'chaser';
		}
	}
}
