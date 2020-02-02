import * as React from 'react';
import styles from './Suspects.module.css';
import { AVAIL_SUSPECTS } from '../Target.tab.container'

interface Props {
	showId: number | undefined;
	handleClick: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
}

const SuspectsView: React.FC<Props> = props => {
	// Build suspect img elements and push to imgEls
	let imgEls: JSX.Element[] = [];
	for (let suspectId of AVAIL_SUSPECTS) {
		imgEls.push(
			<img
				src={`/images/suspects/${suspectId}.jpg`}
				className={props.showId === suspectId ? styles.show : undefined}
				data-suspect_id={suspectId}
				key={`suspect-image_${suspectId}`}
				onClick={props.handleClick}
				alt=""
			/>
		);
	}

	return (
		<div id={styles.suspects}>
			<div id={styles.images}>
				<img
					src="/images/suspects/default.jpg"
					data-testid="default"
					className={props.showId === undefined ? styles.show : undefined}
					alt=""
				/>
				{imgEls}
			</div>
		</div>
	);
};

export default SuspectsView;
