import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import LoginPage from './routes/login';
import Game from './routes/game';
import LoadingIndicator from './components/LoadingIndicator.component';
import AdminLoginPage from './routes/adminLogin';
import AdminPage from './routes/admin';

interface Props {
	isLogged: boolean;
	isLoading: boolean;
	stopLoading: () => void;
	startLoading: () => void;
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
	} = props;
	let app: JSX.Element;

	if (isLogged && gameId)
		app = <Game stopLoading={stopLoading} gameId={gameId} />;
	else if (isLogged && isAdmin) app = <AdminPage stopLoading={stopLoading} />;
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
