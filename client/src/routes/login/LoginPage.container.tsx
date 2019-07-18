import React from 'react';
import * as firebase from 'firebase/app';
import { match } from 'react-router-dom';

// Components
import LoginPageValidView from './LoginPageValid.view';
import LoginPageInvalidView from './LoginPageInvalid.view';
import { Page } from 'react-onsenui';

interface Props {
	match: match<{ gameId: string }>;
	stopLoading: () => void;
}
interface State {
	isValidGame: boolean | null;
}

class LoginPageContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			isValidGame: null,
		};

		this.onLogin = this.onLogin.bind(this);
	}

	_isMounted: boolean = false;

	componentDidMount() {
		this._isMounted = true;

		const db = firebase.firestore();
		db.collection('games')
			.doc(this.props.match.params.gameId)
			.get()
			.then(game => {
				if (this._isMounted) {
					if (game.exists) this.setState({ isValidGame: true });
					else this.setState({ isValidGame: false });
					this.props.stopLoading();
				}
			})
			.catch(reason => console.error(reason));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	onLogin() {
		firebase
			.auth()
			.signInAnonymously()
			.catch(err => {
				// Handle Errors here.
				console.error(err.message);
			});
	}

	render() {
		const { isValidGame } = this.state;
		if (isValidGame) return <LoginPageValidView onLogin={this.onLogin} />;
		else if (isValidGame === false) return <LoginPageInvalidView />;
		return <Page />;
	}
}

export default LoginPageContainer;
