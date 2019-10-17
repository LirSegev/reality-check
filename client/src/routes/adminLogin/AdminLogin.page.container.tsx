import React from 'react';
import * as firebase from 'firebase/app';
import { startLoading, stopLoading } from '../../reducers/main.reducer';
import { connect } from 'react-redux';

// Components
import AdminLoginPageView from './AdminLogin.page.view';

interface Props {
	startLoading: () => void;
	stopLoading: () => void;
}

class AdminLoginPageContainer extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onLogin = this.onLogin.bind(this);
	}

	componentDidMount() {
		this.props.stopLoading();
	}

	onLogin() {
		const email = (document.querySelector(
			'input[name=email]'
		) as HTMLInputElement).value;
		const password = (document.querySelector(
			'input[name=password]'
		) as HTMLInputElement).value;

		if (email && password) {
			this.props.startLoading();
			firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.catch(err => {
					if (err.code !== 'auth/wrong-password')
						console.error(new Error('Error signing user in'), err);
					this.props.stopLoading();
				});
		}
	}

	render() {
		return <AdminLoginPageView onLogin={this.onLogin} />;
	}
}

const mapDispatchToProps = {
	startLoading,
	stopLoading,
};
export default connect(
	null,
	mapDispatchToProps
)(AdminLoginPageContainer);
