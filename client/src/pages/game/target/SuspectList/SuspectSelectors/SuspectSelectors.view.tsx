import React from 'react';
import { Checkbox } from 'react-onsenui';

import styles from '../SuspectList.module.css';

interface Props {
	stopPropagation: (e: React.MouseEvent) => void;
	showLegend: boolean;
}

const SuspectSelectorsView: React.FC<Props> = ({
	stopPropagation,
	showLegend,
}) => (
	<div
		className={['ui form', styles.suspectSelectors].join(' ')}
		onClick={stopPropagation}
	>
		<div className="field">
			{showLegend && <label>Mark</label>}
			<Checkbox />
		</div>
		<div className="field">
			{showLegend && <label>Hide</label>}
			<Checkbox />
		</div>
	</div>
);

export default SuspectSelectorsView;
