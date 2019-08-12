import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import LoginPage from './routes/login';
import Game from './routes/game';
import LoadingIndicator from './components/LoadingIndicator.component';
import AdminLoginPage from './routes/adminLogin';
import Admin from './routes/admin';
import * as firebase from 'firebase/app';

interface Props {
	isLogged: boolean;
	isLoading: boolean;
	stopLoading: () => void;
	startLoading: () => void;
	changeGame: (gameId: string | null) => void;
	gameId: string | null;
	isAdmin: boolean;
}

const AppView: React.FC<Props> = props => {
	const {
		isLoading,
		isLogged,
		stopLoading,
		gameId,
		startLoading,
		isAdmin,
		changeGame,
	} = props;
	let app: JSX.Element;

	if (isLogged && gameId)
		app = (
			<Router>
				<Route
					path="/logout"
					render={() => {
						firebase.auth().signOut();
						return undefined;
					}}
				/>
				<Route
					path="/"
					render={() => (
						<Game isAdmin={isAdmin} stopLoading={stopLoading} gameId={gameId} />
					)}
				/>
			</Router>
		);
	else if (
		isLogged &&
		isAdmin &&
		firebase.auth().currentUser &&
		!firebase.auth().currentUser!.isAnonymous
	)
		app = <Admin changeGame={changeGame} stopLoading={stopLoading} />;
	else
		app = (
			<Router>
				<Switch>
					<Route exact path="/" render={() => <div>Home</div>} />
					<Route
						path="/admin"
						render={routeProps => (
							<AdminLoginPage
								startLoading={startLoading}
								stopLoading={stopLoading}
								{...routeProps}
							/>
						)}
					/>
					<Route
						path="/:gameId"
						render={routeProps => (
							<LoginPage
								startLoading={startLoading}
								stopLoading={stopLoading}
								{...routeProps}
							/>
						)}
					/>
				</Switch>
			</Router>
		);

	return (
		<React.Fragment>
			<LoadingIndicator isLoading={isLoading} />
			{app}
		</React.Fragment>
	);
};

export default AppView;
