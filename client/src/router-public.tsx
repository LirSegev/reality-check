import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminLoginPage from './pages/adminLogin';
import LoginPage from './pages/login';

const PublicRouter: React.FC = () => (
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

export default PublicRouter;
