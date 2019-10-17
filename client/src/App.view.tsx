import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import LoginPage from './routes/login';
import Game from './routes/game';
import LoadingIndicator from './components/LoadingIndicator.component';
import AdminLoginPage from './routes/adminLogin';
import Admin from './routes/admin';
import * as firebase from 'firebase/app';
import { signOut } from './util/firebase';

interface Props {
	isLogged: boolean;
	changeGame: (gameId: string | null) => void;
	gameId: string | null;
	isAdmin: boolean;
}

const AppView: React.FC<Props> = props => {
	const { isLogged, gameId, isAdmin, changeGame } = props;
	let app: JSX.Element;

	if (isLogged && gameId)
		app = (
			<Router>
				<Route
					path="/logout"
					render={() => {
						signOut(props.isAdmin);
						return undefined;
					}}
				/>
				<Route
					path="/"
					render={() => <Game isAdmin={isAdmin} gameId={gameId} />}
				/>
			</Router>
		);
	else if (
		isLogged &&
		isAdmin &&
		firebase.auth().currentUser &&
		!firebase.auth().currentUser!.isAnonymous
	)
		app = <Admin changeGame={changeGame} />;
	else
		app = (
			<Router>
				<Switch>
					<Route exact path="/" render={() => <div>Home</div>} />
					<Route
						path="/admin"
						render={routeProps => <AdminLoginPage {...routeProps} />}
					/>
					<Route
						path="/:gameId"
						render={routeProps => <LoginPage {...routeProps} />}
					/>
				</Switch>
			</Router>
		);

	return (
		<React.Fragment>
			<LoadingIndicator />
			{app}
		</React.Fragment>
	);
};

export default AppView;
