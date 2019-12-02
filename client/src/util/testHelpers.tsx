import React from 'react';
import { ConnectedComponent, Provider } from 'react-redux';
import { DeepPartial } from 'redux';
import { MockStoreCreator } from 'redux-mock-store';
import initialState from '../reducers/initialState';

export function generateWithStore<S extends {}>(
	mockStore: MockStoreCreator<S>,
	baseState?: S
) {
	return function<P>(
		Element: ConnectedComponent<React.ComponentType<any>, P>,
		state: DeepPartial<S>
	) {
		const store = mockStore({
			...initialState,
			...baseState,
			...state,
		} as S);

		return {
			el: (props: JSX.LibraryManagedAttributes<typeof Element, P>) => (
				<Provider store={store}>
					<Element {...props} />
				</Provider>
			),
			store,
		};
	};
}
