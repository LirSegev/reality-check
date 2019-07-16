import React from 'react';
import { Page, Input, Button } from 'react-onsenui';

const LoginPageView: React.FC<{
	onLogin: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}> = props => (
	<Page>
		<form method="POST" action="/api/login" style={{ textAlign: 'center' }}>
			<p>
				<Input
					name="username"
					type="text"
					placeholder="Username"
					modifier="underbar"
					float
				/>
			</p>
			<p>
				<Button onClick={props.onLogin}>Login</Button>
			</p>
		</form>
	</Page>
);

export default LoginPageView;
