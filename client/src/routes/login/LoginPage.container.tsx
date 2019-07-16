import React from 'react';
import LoginPageView from './LoginPage.view';

class LoginPageContainer extends React.Component {
	onLogin() {}

	render() {
		return <LoginPageView onLogin={this.onLogin} />;
	}
}

export default LoginPageContainer;
