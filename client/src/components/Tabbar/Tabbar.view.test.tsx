import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';

import styles from './Tabbar.module.css';
import Tabbar from './Tabbar.view';

afterEach(cleanup);

it('renders', () => {
	const { asFragment } = render(
		<Tabbar
			tabs={[
				{
					tabTitle: 'lir',
					content: <div></div>,
				},
			]}
			handleClick={() => {}}
			index={0}
		/>
	);

	expect(asFragment()).toMatchSnapshot();
});

it('displays tabTitle', () => {
	const { getByText } = render(
		<Tabbar
			tabs={[
				{
					tabTitle: 'lir segev',
					content: <div></div>,
				},
				{
					tabTitle: 'tom segev',
					content: <div></div>,
				},
			]}
			handleClick={() => {}}
			index={0}
		/>
	);

	expect(getByText('lir segev')).toBeVisible();
	expect(getByText('tom segev')).toBeVisible();
});

it('highlights active tab', () => {
	const { getByText } = render(
		<Tabbar
			tabs={[
				{
					tabTitle: 'lir segev',
					content: <div></div>,
				},
				{
					tabTitle: 'tom segev',
					content: <div></div>,
				},
			]}
			handleClick={() => {}}
			index={1}
		/>
	);

	expect(getByText('tom segev')).toHaveClass(styles.active);
});

it('calls handleClick() correctly', () => {
	const handleClick = jest.fn(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			const index = e.currentTarget.dataset.index;
			expect(index).toBe('0');
		}
	);

	const { getByText } = render(
		<Tabbar
			tabs={[
				{
					tabTitle: 'lir segev',
					content: <div></div>,
				},
			]}
			handleClick={handleClick}
			index={0}
		/>
	);

	fireEvent.click(getByText('lir segev'));
	expect(handleClick).toBeCalledTimes(1);
});

it('displays content', () => {
	const { getByTestId } = render(
		<Tabbar
			tabs={[
				{
					tabTitle: 'lir segev',
					content: <div>Lir segev's content</div>,
				},
			]}
			handleClick={() => {}}
			index={0}
		/>
	);
	expect(getByTestId('content')).toContainHTML(
		"<div>Lir segev's content</div>"
	);
});
