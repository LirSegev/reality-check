import * as firebase from 'firebase/app';
import React from 'react';
import { connect } from 'react-redux';

import {
	addNotification,
	startLoading,
	stopLoading,
} from '../../reducers/main.reducer';
import AdminLoginPageView from './AdminLogin.page.view';

// Components
interface Props {
	startLoading: ConnectedAction<typeof startLoading>;
	stopLoading: ConnectedAction<typeof stopLoading>;
	addNotification: ConnectedAction<typeof addNotification>;
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
					let header = (err.code as string).split('/')[1].replace(/-/g, ' ');
					header = header[0].toUpperCase() + header.slice(1);
					this.props.stopLoading();
					this._sendErrorNotification(header, err.message);
				});
		}
	}

	_sendErrorNotification(header: string, content: string) {
		this.props.addNotification({
			notification: {
				type: 'error',
				header,
				content,
				duration: 3,
			},
		});
	}

	render() {
		return <AdminLoginPageView onLogin={this.onLogin} />;
	}
}

const mapDispatchToProps = {
	startLoading,
	stopLoading,
	addNotification,
};
export default connect(null, mapDispatchToProps)(AdminLoginPageContainer);
