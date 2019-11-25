import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { Props } from './Target.tab.view';

afterEach(cleanup);
afterEach(jest.resetModules);

it('renders', () => {
	jest.mock('./Target.tab.view.tsx', () => () => <div />);
	const { default: TargetTab } = require('./Target.tab.container');
	const { asFragment } = render(<TargetTab />);

	expect(asFragment()).toMatchSnapshot();
});

it('updateSuspectList() works', () => {
	jest.mock('./Target.tab.view.tsx', () =>
		jest
			.fn()
			.mockImplementationOnce((props: Props) => {
				props.updateSuspectList([1, 2]);

				return <div />;
			})
			.mockImplementation(() => <div />)
	);
	const { default: TargetTab } = require('./Target.tab.container');
	render(<TargetTab />);

	const TargetTabView = require('./Target.tab.view');
	expect(TargetTabView).toHaveBeenNthCalledWith(
		1,
		expect.objectContaining({
			suspectList: [],
		}),
		{}
	);
	expect(TargetTabView).toHaveBeenNthCalledWith(
		2,
		expect.objectContaining({
			suspectList: [1, 2],
		}),
		{}
	);
});

it('selectSuspect() works', () => {
	jest.mock('./Target.tab.view.tsx', () =>
		jest
			.fn()
			.mockImplementationOnce((props: Props) => {
				props.selectSuspect(1);

				return <div />;
			})
			.mockImplementation(() => <div />)
	);
	const { default: TargetTab } = require('./Target.tab.container');
	render(<TargetTab />);

	const TargetTabView = require('./Target.tab.view');
	expect(TargetTabView).toHaveBeenNthCalledWith(
		1,
		expect.objectContaining({
			selectedSuspect: null,
		}),
		{}
	);
	expect(TargetTabView).toHaveBeenNthCalledWith(
		2,
		expect.objectContaining({
			selectedSuspect: 1,
		}),
		{}
	);
});
