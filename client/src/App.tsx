import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import LoginPage from './routes/login';
import HomePage from './routes/home';

const App: React.FC = () => (
	<Router>
		<Switch>
			<Route exact path="/" component={HomePage} />
			<Route path="/:gameId" component={LoginPage} />
		</Switch>
	</Router>
);

export default App;
