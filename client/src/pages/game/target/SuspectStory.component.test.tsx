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

	expect(getByText('underscore test')).toBeDefined();
	expect(getByText('dash test')).toBeDefined();

	expect(getByText('one table')).toBeDefined();
	expect(getByText('under 2')).toBeDefined();
	expect(getByText('dash 2')).toBeDefined();

	expect(getByText('multiple tables')).toBeDefined();
	expect(getByText('table 1')).toBeDefined();
	expect(getByText('under 3')).toBeDefined();
	expect(getByText('dash 3')).toBeDefined();
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

	expect(getByText('someText')).toBeDefined();
	expect(getByText('Here is some text')).toBeDefined();

	expect(getByText('row1')).toBeDefined();
	expect(getByText('value1')).toBeDefined();

	expect(getByText('multiple tables')).toBeDefined();
	expect(getByText('table1')).toBeDefined();
	expect(getByText('subRow1')).toBeDefined();
	expect(getByText('subValue1')).toBeDefined();
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

	expect(getByText('row1', { selector: 'th,td' })).toBeDefined();
	expect(getByText('value1', { selector: 'td' })).toBeDefined();
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

	expect(getByText('row1', { selector: 'th,td' })).toBeDefined();
	expect(getByText('value1', { selector: 'td' })).toBeDefined();
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

	expect(getByText('Here is some text', { selector: 'p' })).toBeDefined();
	expect(getByText('next paragraph', { selector: 'p' })).toBeDefined();
});
