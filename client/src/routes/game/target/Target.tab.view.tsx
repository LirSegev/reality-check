import * as React from 'react';
import { Page } from 'react-onsenui';
import styles from './Target.module.css';

interface Props {
	imgSrc: string[];
}

const TargetTabView: React.FC<Props> = props => {
	const imgEls = props.imgSrc.map(src => <img src={src} alt="" />);

	return (
		<Page>
			<div id={styles.wrapper}>
				<div id={styles.suspects}>
					<div id={styles.images}>{imgEls}</div>
				</div>
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
};

export default TargetTabView;
