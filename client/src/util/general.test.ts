import { toTitleCase } from './general';

describe('toTitleCase()', () => {
	it.each([['lir segev'], ['lIR SeGEv'], ['LIR SEGEV']])(
		'returns correct value - %s',
		s => {
			expect(toTitleCase(s)).toBe('Lir Segev');
		}
	);
});
