import React from 'react';
import * as firebase from 'firebase/app';
import { match } from 'react-router-dom';
import { stopLoading, startLoading } from '../../reducers/main.reducer';
import { connect } from 'react-redux';

// Components
import LoginPageValidView from './Login-valid.page.view';
import LoginPageInvalidView from './Login-invalid.page.view';
import { Page } from 'react-onsenui';

interface Props {
	match: match<{ gameId: string }>;
	stopLoading: ConnectedAction<typeof stopLoading>;
	startLoading: ConnectedAction<typeof startLoading>;
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
			.catch(err =>
				console.error(new Error('Error checking if game exists:'), err)
			);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	onLogin() {
		this.props.startLoading();
		firebase
			.auth()
			.signInAnonymously()
			.catch(err => {
				console.error(new Error('Error signing user in:'), err);
			});
	}

	render() {
		const { isValidGame } = this.state;
		if (isValidGame) return <LoginPageValidView onLogin={this.onLogin} />;
		else if (isValidGame === false) return <LoginPageInvalidView />;
		return <Page />;
	}
}

const mapDispatchToProps = {
	stopLoading,
	startLoading,
};
export default connect(
	null,
	mapDispatchToProps
)(LoginPageContainer);
