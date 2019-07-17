import React from 'react';
import ReactDOM from 'react-dom';
import AppView from './App.view';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<AppView />, div);
	ReactDOM.unmountComponentAtNode(div);
});
