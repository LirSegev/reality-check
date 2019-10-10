import * as React from 'react';
import styles from './Clues.module.css';

const CluesView: React.FC = () => (
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
);

export default CluesView;
