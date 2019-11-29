import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { ConnectedComponent, Provider } from 'react-redux';
import { DeepPartial } from 'redux';
import configureStore from 'redux-mock-store';

import initialState, { ReduxState } from '../../../reducers/initialState';
import TargetTabContainerImport from './Target.tab.container';
import { Props as TargetTabViewProps } from './Target.tab.view';

const mockStore = configureStore<ReduxState>();

function withStore<P>(
	Element: ConnectedComponent<React.ComponentType<any>, P>,
	state: DeepPartial<ReduxState> & {
		main: Pick<ReduxState['main'], 'tabIndex'>;
	}
) {
	const baseState: ReduxState = {
		...initialState,
		main: {
			...initialState.main,
			gameId: 'someGameId',
			isLoading: false,
			tabIndex: 0,
		},
	};

	const store = mockStore({
		...baseState,
		...state,
	} as ReduxState);

	return (props: JSX.LibraryManagedAttributes<typeof Element, P>) => (
		<Provider store={store}>
			<Element {...props} />
		</Provider>
	);
}

afterEach(cleanup);
// afterEach(jest.resetModules);

it('renders', () => {
	jest.isolateModules(() => {
		jest.doMock('./Target.tab.view.tsx', () => () => <div />);
		const { default: TargetTab } = require('./Target.tab.container');
		const TargetTabWithStore = withStore(
			TargetTab as typeof TargetTabContainerImport,
			{
				main: {
					tabIndex: 0,
				},
			}
		);

		const { asFragment } = render(
			<TargetTabWithStore tabIndex={0} incrementUnreadNum={() => true} />
		);

		expect(asFragment()).toMatchSnapshot();
	});
});

it('updateSuspectList() works', () => {
	jest.isolateModules(() => {
		jest.doMock('./Target.tab.view.tsx', () =>
			jest
				.fn()
				.mockImplementationOnce((props: TargetTabViewProps) => {
					props.updateSuspectList([1, 2]);

					return <div />;
				})
				.mockImplementation(() => <div />)
		);
		const { default: TargetTab } = require('./Target.tab.container');
		const TargetTabWithStore = withStore(
			TargetTab as typeof TargetTabContainerImport,
			{
				main: {
					tabIndex: 0,
				},
			}
		);

		render(<TargetTabWithStore tabIndex={0} incrementUnreadNum={() => true} />);

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
});

it('selectSuspect() works', () => {
	jest.isolateModules(() => {
		jest.doMock('./Target.tab.view.tsx', () =>
			jest
				.fn()
				.mockImplementationOnce((props: TargetTabViewProps) => {
					props.selectSuspect(1);

					return <div />;
				})
				.mockImplementation(() => <div />)
		);
		const { default: TargetTab } = require('./Target.tab.container');
		const TargetTabWithStore = withStore(
			TargetTab as typeof TargetTabContainerImport,
			{
				main: {
					tabIndex: 0,
				},
			}
		);

		render(<TargetTabWithStore incrementUnreadNum={() => true} tabIndex={0} />);

		const TargetTabView = require('./Target.tab.view');
		expect(TargetTabView).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				selectedSuspect: undefined,
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
});
