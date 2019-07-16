import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import LoginPage from './routes/login';

const App: React.FC = () => (
	<Router>
		<Switch>
			<Route path="/login" component={LoginPage} />
			{/* <Route path="/" component={HomePage} /> */}
		</Switch>
	</Router>
);

export default App;
