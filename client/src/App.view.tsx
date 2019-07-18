import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import LoginPage from './routes/login';
import Game from './routes/game';
import LoadingIndicator from './components/LoadingIndicator.component';

interface Props {
	isLogged: boolean;
	isLoading: boolean;
	stopLoading: () => void;
	gameId: string | null;
}

const AppView: React.FC<Props> = props => {
	const { isLoading, isLogged, stopLoading, gameId } = props;
	let app: JSX.Element;

	if (isLogged && gameId)
		app = <Game stopLoading={stopLoading} gameId={gameId} />;
	else
		app = (
			<Router>
				<Switch>
					<Route exact path="/" render={() => <div>Home</div>} />
					<Route
						path="/:gameId"
						render={routeProps => (
							<LoginPage stopLoading={stopLoading} {...routeProps} />
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
