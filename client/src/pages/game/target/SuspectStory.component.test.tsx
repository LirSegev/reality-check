import React from 'react';
import { render, cleanup } from '@testing-library/react';

beforeAll(() => {
	window.$ = () => ({
		accordion: jest.fn(),
	});
});
afterEach(cleanup);

it('renders', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { asFragment } = render(
		<SuspectStory
			suspect={{
				name: 'lir',
				id: 1,
				data: {
					some_text: 'Here is some text\n\nnew paragraph',
					table: {
						row1: 'value1',
						row2: 'value2',
					},
					category: {
						title: {
							row1: 'value1',
							row2: 'value2',
						},
						title2: {
							row1: 'value1',
							row2: 'value2',
						},
					},
				},
			}}
		/>
	);

	expect(asFragment()).toMatchSnapshot();
});

it('capitalizes', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { getByText } = render(
		<SuspectStory
			suspect={{
				name: 'lir',
				id: 1,
				data: {
					'space test': 'space',
					underscore_test: 'underscore',
					'dash-test': 'dash',
					one_table: {
						under_2_test: 'under',
						'dash-2 test': 'dash',
					},
					multiple_tables: {
						table_1_test: {
							under_3_test: 'under',
							'dash-3_test': 'dash',
						},
					},
				},
			}}
		/>
	);

	expect(getByText('Underscore Test')).toBeDefined();
	expect(getByText('Dash Test')).toBeDefined();

	expect(getByText('One Table')).toBeDefined();
	expect(getByText('Under 2 Test')).toBeDefined();
	expect(getByText('Dash 2 Test')).toBeDefined();

	expect(getByText('Multiple Tables')).toBeDefined();
	expect(getByText('Table 1 Test')).toBeDefined();
	expect(getByText('Under 3 Test')).toBeDefined();
	expect(getByText('Dash 3 Test')).toBeDefined();
});

it('replaces - or _ with space', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { getByText } = render(
		<SuspectStory
			suspect={{
				name: 'lir',
				id: 1,
				data: {
					underscore_test: 'underscore',
					'dash-test': 'dash',
					one_table: {
						under_2: 'under',
						'dash-2': 'dash',
					},
					multiple_tables: {
						table_1: {
							under_3: 'under',
							'dash-3': 'dash',
						},
					},
				},
			}}
		/>
	);

	expect(getByText(/^underscore test$/i)).toBeDefined();
	expect(getByText(/^dash test$/i)).toBeDefined();

	expect(getByText(/^one table$/i)).toBeDefined();
	expect(getByText(/^under 2$/i)).toBeDefined();
	expect(getByText(/^dash 2$/i)).toBeDefined();

	expect(getByText(/^multiple tables$/i)).toBeDefined();
	expect(getByText(/^table 1$/i)).toBeDefined();
	expect(getByText(/^under 3$/i)).toBeDefined();
	expect(getByText(/^dash 3$/i)).toBeDefined();
});

it('displays all information', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { getByText } = render(
		<SuspectStory
			suspect={{
				name: 'lir',
				id: 1,
				data: {
					someText: 'Here is some text',
					table: {
						row1: 'value1',
					},
					'multiple tables': {
						table1: {
							subRow1: 'subValue1',
						},
					},
				},
			}}
		/>
	);

	expect(getByText(/^someText$/i)).toBeDefined();
	expect(getByText(/^Here is some text$/i)).toBeDefined();

	expect(getByText(/^row1$/i)).toBeDefined();
	expect(getByText(/^value1$/i)).toBeDefined();

	expect(getByText(/^multiple tables$/i)).toBeDefined();
	expect(getByText(/^table1$/i)).toBeDefined();
	expect(getByText(/^subRow1$/i)).toBeDefined();
	expect(getByText(/^subValue1$/i)).toBeDefined();
});

it('displays objects as tables', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { getByText } = render(
		<SuspectStory
			suspect={{
				name: 'lir',
				id: 1,
				data: {
					title: {
						row1: 'value1',
						row2: 'value2',
					},
				},
			}}
		/>
	);

	expect(getByText(/^row1$/i, { selector: 'th,td' })).toBeDefined();
	expect(getByText(/^value1$/i, { selector: 'td' })).toBeDefined();
});

it('displays nested objects as tables', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { getByText } = render(
		<SuspectStory
			suspect={{
				name: 'lir',
				id: 1,
				data: {
					title: {
						subtitle: {
							row1: 'value1',
							row2: 'value2',
						},
					},
				},
			}}
		/>
	);

	expect(getByText(/^row1$/i, { selector: 'th,td' })).toBeDefined();
	expect(getByText(/^value1$/i, { selector: 'td' })).toBeDefined();
});

it('displays strings as paragraphs', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { getByText } = render(
		<SuspectStory
			suspect={{
				name: 'lir',
				id: 1,
				data: {
					title: 'Here is some text\n\nnext paragraph',
				},
			}}
		/>
	);

	expect(getByText(/^Here is some text$/i, { selector: 'p' })).toBeDefined();
	expect(getByText(/^next paragraph$/i, { selector: 'p' })).toBeDefined();
});
