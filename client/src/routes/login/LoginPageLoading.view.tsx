import React from 'react';
import { Page } from 'react-onsenui';
import LoadingIndicator from '../../components/LoadingIndicator.component';

const LoginPageInvalidView: React.FC = props => (
	<Page>
		<LoadingIndicator />
	</Page>
);

export default LoginPageInvalidView;
