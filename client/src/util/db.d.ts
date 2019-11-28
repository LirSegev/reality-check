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
}
