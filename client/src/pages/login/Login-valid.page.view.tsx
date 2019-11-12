import React from 'react';
import { Page, Input, Button } from 'react-onsenui';
import styles from './Login.module.css';
import SelectRole from './SelectRole.component';

interface Props {
	onLogin: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const LoginPageValidView: React.FC<Props> = props => (
	<Page>
		<section id={styles.login} style={{ textAlign: 'center' }}>
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
				<SelectRole />
			</p>
			<p>
				<Button onClick={props.onLogin}>Login</Button>
			</p>
		</section>
	</Page>
);

export default LoginPageValidView;
