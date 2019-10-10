import * as React from 'react';
import { Page } from 'react-onsenui';
import styles from './Target.module.css';
import Suspects from './suspects';

const TargetTabView: React.FC = () => (
	<Page>
		<div id={styles.wrapper}>
			<Suspects />
			<section id={styles.clues}>
				<table>
					<tbody>
						<tr>
							<td>Accessories</td>
							<td>Glasses</td>
						</tr>
						<tr>
							<td>Facial Hair</td>
							<td>None</td>
						</tr>
					</tbody>
				</table>
			</section>
		</div>
	</Page>
);

export default TargetTabView;
