import React from 'react';
import { Checkbox } from 'react-onsenui';

import styles from '../SuspectList.module.css';

interface Props {
	stopPropagation: (e: React.MouseEvent) => void;
	handleMarkChange: () => void;
	isMarked: boolean;
	showLegend: boolean;
}

const SuspectSelectorsView: React.FC<Props> = ({
	stopPropagation,
	showLegend,
	handleMarkChange,
	isMarked,
}) => (
	<div
		className={['ui form', styles.suspectSelectors].join(' ')}
		onClick={stopPropagation}
	>
		<div className="field">
			{showLegend && <label>Mark</label>}
			<Checkbox onChange={handleMarkChange} checked={isMarked} />
		</div>
		<div className="field">
			{showLegend && <label>Hide</label>}
			<Checkbox />
		</div>
	</div>
);

export default SuspectSelectorsView;
