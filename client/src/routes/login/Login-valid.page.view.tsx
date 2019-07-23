import React from 'react';
import { Page, Input, Button } from 'react-onsenui';

interface Props {
	onLogin: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const LoginPageValidView: React.FC<Props> = props => (
	<Page>
		<section style={{ textAlign: 'center' }}>
			<p>
				<Input
					name="displayName"
					type="text"
					placeholder="Username"
					modifier="underbar"
					float
				/>
			</p>
			<p>
				<Button onClick={props.onLogin}>Login</Button>
			</p>
		</section>
	</Page>
);

export default LoginPageValidView;
