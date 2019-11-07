import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as firebase from 'firebase/app';
import { signOut } from './util/firebase';
import { ReduxState } from './reducers/initialState';
import { connect } from 'react-redux';

// Components
import LoginPage from './routes/login';
import Game from './routes/game';
import LoadingIndicator from './components/LoadingIndicator.component';
import AdminLoginPage from './routes/adminLogin';
import ChooseGame from './routes/chooseGame';
import Notifications from './components/Notifications';

interface Props {
	isLogged: boolean;
	gameId: string | null;
	isAdmin: boolean;
}

const AppView: React.FC<Props> = props => {
	const { isLogged, gameId, isAdmin } = props;
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
				<Route path="/" render={() => <Game />} />
			</Router>
		);
	else if (
		isLogged &&
		isAdmin &&
		firebase.auth().currentUser &&
		!firebase.auth().currentUser!.isAnonymous
	)
		app = <ChooseGame />;
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
			<Notifications />
			{app}
		</React.Fragment>
	);
};

const mapStateToProps = (state: ReduxState) => ({
	gameId: state.main.gameId,
	isAdmin: state.main.isAdmin,
});
export default connect(mapStateToProps)(AppView);
