import React from 'react';
import { render, cleanup } from '@testing-library/react';

beforeAll(() => {
	window.$ = () => ({
		accordion: jest.fn(),
	});
});
afterEach(cleanup);

it.only('renders', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { asFragment } = render(
		<SuspectStory
			suspect={{
				someText: 'Here is some text',
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
			}}
		/>
	);

	expect(asFragment()).toMatchSnapshot();
});

it('displays all information', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { getByText } = render(
		<SuspectStory
			suspect={{
				someText: 'Here is some text',
				table: {
					row1: 'value1',
				},
				'multiple tables': {
					table1: {
						subRow1: 'subValue1',
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
				title: {
					row1: 'value1',
					row2: 'value2',
				},
			}}
		/>
	);

	expect(getByText('row1', { selector: 'td' })).toBeDefined();
	expect(getByText('value1', { selector: 'td' })).toBeDefined();
});

it('displays nested objects as tables', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { getByText } = render(
		<SuspectStory
			suspect={{
				title: {
					subtitle: {
						row1: 'value1',
						row2: 'value2',
					},
				},
			}}
		/>
	);

	expect(getByText('row1', { selector: 'td' })).toBeDefined();
	expect(getByText('value1', { selector: 'td' })).toBeDefined();
});

it('displays strings as paragraphs', () => {
	const { default: SuspectStory } = require('./SuspectStory.component.tsx');
	const { getByText } = render(
		<SuspectStory
			suspect={{
				title: 'Here is some text',
			}}
		/>
	);

	expect(getByText('Here is some text', { selector: 'p' })).toBeDefined();
});
