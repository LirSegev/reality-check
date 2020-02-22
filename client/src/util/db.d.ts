/// <reference types="firebase" />
/// <reference types="../global" />

declare namespace DB {
	export interface GameDoc {
		chaser_sequence_num?: number;
		collected_identity_points?: number[];
		collected_intelligence_points?: number[];
		suspect_list: number[];
		marked_suspects?: number[];
		hidden_suspects?: number[];
		detective_clues?: { [property: string]: string };
		phase?: number;
		notes?: { [name: string]: string };
	}
}
