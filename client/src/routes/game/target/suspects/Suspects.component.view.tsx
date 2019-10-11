import * as React from 'react';
import styles from './Suspects.module.css';

interface Props {
	showId: number | undefined;
}

const NUMBER_OF_SUSPECT_IMAGES = 17;

const SuspectsView: React.FC<Props> = props => {
	// Build suspect img elements and push to imgEls
	let imgEls: JSX.Element[] = [];
	for (let suspectId = 0; suspectId <= NUMBER_OF_SUSPECT_IMAGES; suspectId++) {
		imgEls.push(
			<img
				src={`pictures/${suspectId}.jpg`}
				className={props.showId === suspectId ? styles.show : undefined}
				key={`suspect-image_${suspectId}`}
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
