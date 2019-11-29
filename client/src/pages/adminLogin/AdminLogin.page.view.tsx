import React from 'react';
import { Page, Input, Button } from 'react-onsenui';

interface Props {
	onLogin: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const AdminLoginPageView: React.FC<Props> = props => (
	<Page>
		<section style={{ textAlign: 'center' }}>
			<p style={{ marginTop: '1em' }}>
				<Input
					name="email"
					type="email"
					placeholder="Email"
					modifier="underbar"
					float
				/>
			</p>
			<p>
				<Input
					name="password"
					type="password"
					placeholder="Password"
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

export default AdminLoginPageView;
