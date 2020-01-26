import React from 'react';

import styles from './SuspectList.module.css';

function removeMiddleName(name: string): string {
	const names = name.split(' ');
	return [names[0], names.pop()].join(' ');
}

interface Props {
	suspect: SuspectFile;
}

const SuspectIdentifiersView: React.FC<Props> = ({ suspect }) => (
	<React.Fragment>
		<div
			className="ui mini circular image"
			style={{
				width: '35px',
				height: '35px',
				flex: 'none',
				borderRadius: '50%',
			}}
		>
			<img
				style={{
					width: '60px',
					height: '60px',
					marginLeft: '-12px',
					marginTop: '-8px',
					maxWidth: 'unset',
					borderRadius: 'unset',
				}}
				src={`/images/suspects/${suspect.id}.jpg`}
				alt=""
			/>
		</div>
		<div className={styles.suspectName}>{removeMiddleName(suspect.name)}</div>
	</React.Fragment>
);

export default SuspectIdentifiersView;
