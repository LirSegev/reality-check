import React from 'react';
import { Page } from 'react-onsenui';

const LoginPageLoadingView: React.FC = props => (
	<Page>
		<section style={{ textAlign: 'center' }}>
			<p>Not a valid game id</p>
		</section>
	</Page>
);

export default LoginPageLoadingView;
