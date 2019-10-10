import * as React from 'react';
import styles from './Suspects.module.css';

interface Props {
	showId: string | undefined;
}

const NUMBER_OF_SUSPECT_IMAGES = 17;

const SuspectsView: React.FC<Props> = props => {
	let imgEls: JSX.Element[] = [];
	for (let i = 1; i <= NUMBER_OF_SUSPECT_IMAGES; i++) {
		imgEls.push(
			<img
				src={`pictures/${i}.jpg`}
				className={props.showId === String(i) ? styles.show : undefined}
				key={`suspect-image_${i}`}
				alt=""
			/>
		);
	}

	return (
		<div id={styles.suspects}>
			<div id={styles.images}>
				<img
					src="pictures/default.jpg"
					className={props.showId === undefined ? styles.show : undefined}
					alt=""
				/>
				{imgEls}
			</div>
		</div>
	);
};

export default SuspectsView;
