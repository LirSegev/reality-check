import React from 'react';
import * as firebase from 'firebase/app';
import { ReduxState } from './reducers/initialState';
import { connect } from 'react-redux';

// Components
import LoadingIndicator from './components/LoadingIndicator.component';
import AdminChooseGame from './pages/chooseGame';
import Notifications from './components/Notifications';
import AuthenticatedRouter from './router-authenticated';
import PublicRouter from './router-public';

interface Props {
	isLogged: boolean;
	gameId: string | null;
	isAdmin: boolean;
}

const AppView: React.FC<Props> = props => {
	const { isLogged, gameId, isAdmin } = props;
	let app: JSX.Element;

	if (isLogged && gameId) app = <AuthenticatedRouter isAdmin={isAdmin} />;
	else if (
		isLogged &&
		isAdmin &&
		firebase.auth().currentUser &&
		!firebase.auth().currentUser!.isAnonymous
	)
		app = <AdminChooseGame />;
	else app = <PublicRouter />;

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
