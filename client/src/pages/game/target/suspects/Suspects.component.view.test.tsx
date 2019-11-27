import { render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';

import Suspects from './Suspects.component.view';
import styles from './Suspects.module.css';

afterEach(cleanup);

it('renders', () => {
	const { asFragment } = render(<Suspects showId={1} handleClick={() => {}} />);

	expect(asFragment()).toMatchSnapshot();
});

it('shows correct suspect', () => {
	const { asFragment } = render(<Suspects showId={2} handleClick={() => {}} />);

	const shownImages = asFragment().querySelector(`.${styles.show}`);
	expect((shownImages as HTMLElement).dataset.suspect_id).toBe('2');
});

it('shows only one image at a time', () => {
	const { asFragment } = render(<Suspects showId={2} handleClick={() => {}} />);

	const shownImages = asFragment().querySelectorAll(`.${styles.show}`);
	expect(shownImages).toHaveLength(1);
});

it('sets data-suspect-id for images', () => {
	const { asFragment } = render(<Suspects showId={1} handleClick={() => {}} />);

	const shownImages = asFragment().querySelector(`.${styles.show}`);
	expect((shownImages as HTMLElement).dataset).toHaveProperty('suspect_id');
});

it('calls handleClick() correctly', () => {
	const handleClick = jest.fn().mockImplementation(e => {
		expect(e.currentTarget.dataset.suspect_id).toBe('1');
	});
	const { container } = render(
		<Suspects showId={1} handleClick={handleClick} />
	);

	fireEvent.click(container.querySelector(`.${styles.show}`)!);

	expect(handleClick).toBeCalled();
});

it('shows default image when showId is undefined', () => {
	const { getByTestId } = render(
		<Suspects showId={undefined} handleClick={() => {}} />
	);

	expect(getByTestId('default')).toHaveClass(styles.show);
});
