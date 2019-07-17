import React from 'react';
import * as firebase from 'firebase/app';
import { match } from 'react-router-dom';

// Components
import LoginPageValidView from './LoginPageValid.view';
import LoginPageInvalidView from './LoginPageInvalid.view';
import LoginPageLoadingView from './LoginPageLoading.view';

interface GameLogin {
	gameId: string;
}
interface Props {
	match: match<GameLogin>;
}
interface State {
	isLoading: boolean;
	isValidGame: boolean;
}

class LoginPageContainer extends React.Component<Props, State> {
	constructor(props: { match: match<GameLogin> }) {
		super(props);
		this.state = {
			isLoading: true,
			isValidGame: false,
		};

		this.onLogin = this.onLogin.bind(this);
	}

	componentDidMount() {
		const db = firebase.firestore();
		db.collection('games')
			.doc(this.props.match.params.gameId)
			.get()
			.then(game => {
				if (game.exists) this.setState({ isValidGame: true });
				this.setState({ isLoading: false });
			})
			.catch(reason => console.error(reason));
	}

class LoginPageContainer extends React.Component {
	onLogin() {}

	render() {
		return this.state.isLoading ? (
			<LoginPageLoadingView />
		) : this.state.isValidGame ? (
			<LoginPageValidView onLogin={this.onLogin} />
		) : (
			<LoginPageInvalidView />
		);
	}
}

export default LoginPageContainer;
