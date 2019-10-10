import * as React from 'react';
import styles from './Clues.module.css';

interface Props {
	clues: { [key: string]: string };
}

const CluesView: React.FC<Props> = props => {
	const keys = Object.keys(props.clues);
	const rows = keys.map(key => (
		<tr key={`clue_${key}`}>
			<td>{key}</td>
			<td>{props.clues[key]}</td>
		</tr>
	));

	return (
		<section id={styles.clues}>
			<table>
				<tbody>{rows}</tbody>
			</table>
		</section>
	);
};

export default CluesView;
