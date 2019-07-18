import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import LoginPage from './routes/login';
import LoadingIndicator from './components/LoadingIndicator.component';

interface Props {
	isLogged: boolean;
	isLoading: boolean;
	stopLoading: () => void;
}

const AppView: React.FC<Props> = props => {
	const { isLoading, isLogged, stopLoading } = props;
	let app: JSX.Element;

	if (isLogged) app = <div>The game</div>;
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
