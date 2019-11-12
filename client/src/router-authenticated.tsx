import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Game from './pages/game';
import { signOut } from './util/firebase';

interface Props {
	isAdmin: boolean;
}

const AuthenticatedRouter: React.FC<Props> = props => (
	<Router>
		<Route
			path="/logout"
			render={() => {
				signOut(props.isAdmin);
				return undefined;
			}}
		/>
		<Route path="/" render={() => <Game />} />
	</Router>
);

export default AuthenticatedRouter;
