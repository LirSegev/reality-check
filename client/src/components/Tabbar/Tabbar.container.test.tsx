import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Props } from './Tabbar.view';

afterEach(cleanup);
afterEach(jest.resetModules);

it('renders', () => {
	jest.mock('./Tabbar.view.tsx', () => () => <div />);
	const { default: Tabbar } = require('./Tabbar.container.tsx');

	const { asFragment } = render(
		<Tabbar
			tabs={[
				{
					tabTitle: 'lir',
					content: <div></div>,
				},
			]}
		/>
	);

	expect(asFragment()).toMatchSnapshot();
});

describe('changes tab', () => {
	test('on click', () => {
		jest.mock('./Tabbar.view.tsx', () =>
			jest.fn().mockImplementation((props: Props) => {
				return (
					<div>
						<button
							data-testid="button"
							onClick={props.handleClick}
							data-index="1"
						></button>
					</div>
				);
			})
		);

		const { default: Tabbar } = require('./Tabbar.container.tsx');
		const { getByTestId } = render(
			<Tabbar
				tabs={[
					{
						tabTitle: 'lir',
						content: <div></div>,
					},
					{
						tabTitle: 'tom',
						content: <div></div>,
					},
				]}
			/>
		);

		const TabbarView = require('./Tabbar.view');
		expect(TabbarView).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ index: 0 }),
			{}
		);

		fireEvent.click(getByTestId('button'));
		expect(TabbarView).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ index: 1 }),
			{}
		);
	});

	test('on index prop change', () => {
		jest.mock('./Tabbar.view.tsx', () =>
			jest.fn().mockImplementation((props: Props) => {
				return (
					<div>
						<button
							data-testid="button"
							onClick={props.handleClick}
							data-index="1"
						></button>
					</div>
				);
			})
		);

		const { default: Tabbar } = require('./Tabbar.container.tsx');
		const div = document.createElement('div');
		const { container } = render(
			<Tabbar
				tabs={[
					{
						tabTitle: 'lir',
						content: <div></div>,
					},
					{
						tabTitle: 'tom',
						content: <div></div>,
					},
				]}
				index={0}
			/>,
			{ container: document.body.appendChild(div) }
		);

		const TabbarView = require('./Tabbar.view');
		expect(TabbarView).toHaveBeenCalledWith(
			expect.objectContaining({ index: 0 }),
			{}
		);

		render(
			<Tabbar
				tabs={[
					{
						tabTitle: 'lir',
						content: <div></div>,
					},
					{
						tabTitle: 'tom',
						content: <div></div>,
					},
				]}
				index={1}
			/>,
			{ container }
		);

		expect(TabbarView).toHaveBeenLastCalledWith(
			expect.objectContaining({ index: 1 }),
			{}
		);
	});
});

it('starts with correct tab when index prop is provided', () => {
	jest.mock('./Tabbar.view.tsx', () => jest.fn().mockReturnValue(<div />));

	const { default: Tabbar } = require('./Tabbar.container.tsx');
	render(
		<Tabbar
			tabs={[
				{
					tabTitle: 'lir',
					content: <div></div>,
				},
				{
					tabTitle: 'tom',
					content: <div></div>,
				},
			]}
			index={1}
		/>
	);

	const TabbarView = require('./Tabbar.view');
	expect(TabbarView).toHaveBeenCalledWith(
		expect.objectContaining({ index: 1 }),
		{}
	);
});

describe('calls onChange() when changing tab', () => {
	test('on click', () => {
		jest.mock('./Tabbar.view.tsx', () =>
			jest.fn().mockImplementation((props: Props) => {
				return (
					<div>
						<button
							data-testid="button"
							onClick={props.handleClick}
							data-index="1"
						></button>
					</div>
				);
			})
		);

		const onChange = jest.fn();
		const { default: Tabbar } = require('./Tabbar.container.tsx');
		const { getByTestId } = render(
			<Tabbar
				tabs={[
					{
						tabTitle: 'lir',
						content: <div></div>,
					},
					{
						tabTitle: 'tom',
						content: <div></div>,
					},
				]}
				onChange={onChange}
			/>
		);

		fireEvent.click(getByTestId('button'));
		expect(onChange).toBeCalledWith(expect.objectContaining({ index: 1 }));
	});

	test('on index prop change', () => {
		jest.mock('./Tabbar.view.tsx', () =>
			jest.fn().mockImplementation((props: Props) => {
				return (
					<div>
						<button
							data-testid="button"
							onClick={props.handleClick}
							data-index="1"
						></button>
					</div>
				);
			})
		);

		const onChange = jest.fn();
		const { default: Tabbar } = require('./Tabbar.container.tsx');
		const div = document.createElement('div');
		const { container } = render(
			<Tabbar
				tabs={[
					{
						tabTitle: 'lir',
						content: <div></div>,
					},
					{
						tabTitle: 'tom',
						content: <div></div>,
					},
				]}
				onChange={onChange}
			/>,
			{ container: document.body.appendChild(div) }
		);

		render(
			<Tabbar
				tabs={[
					{
						tabTitle: 'lir',
						content: <div></div>,
					},
					{
						tabTitle: 'tom',
						content: <div></div>,
					},
				]}
				index={1}
				onChange={onChange}
			/>,
			{ container }
		);

		expect(onChange).toBeCalledWith(expect.objectContaining({ index: 1 }));
	});
});
