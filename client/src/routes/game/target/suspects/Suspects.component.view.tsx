import * as React from 'react';
import styles from './Suspects.module.css';

interface Props {
	imgSrc: { url: string; name: string }[];
}

const SuspectsView: React.FC<Props> = props => {
	const imgEls = props.imgSrc.map(img => {
		const classList = img.name === 'default' ? styles.show : '';
		return (
			<img
				src={img.url}
				className={classList}
				key={`suspect-image_${img.name}`}
				alt=""
			/>
		);
	});

	return (
		<div id={styles.suspects}>
			<div id={styles.images}>{imgEls}</div>
		</div>
	);
};

export default SuspectsView;
