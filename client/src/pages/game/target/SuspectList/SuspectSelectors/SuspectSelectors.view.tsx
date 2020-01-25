import React from 'react';
import { Checkbox } from 'react-onsenui';

import styles from '../SuspectList.module.css';

interface Props {
	stopPropagation: (e: React.MouseEvent) => void;
	handleMarkChange: () => void;
	handleHideChange: () => void;
	isMarked: boolean;
	isHidden: boolean;
	isInList: boolean;
	showLegend: boolean;
	isAdmin: boolean;
}

const SuspectSelectorsView: React.FC<Props> = ({
	stopPropagation,
	showLegend,
	handleMarkChange,
	isMarked,
	handleHideChange,
	isHidden,
	isAdmin,
	isInList,
}) => {
	const playerButtons = (
		<React.Fragment>
			<div className="field">
				{showLegend && <label>Mark</label>}
				<Checkbox onChange={handleMarkChange} checked={isMarked} />
			</div>
			<div className="field">
				{showLegend && <label>Hide</label>}
				<Checkbox onChange={handleHideChange} checked={isHidden} />
			</div>
		</React.Fragment>
	);

	const adminButtons = (
		<React.Fragment>
			<div className="field">
				<Checkbox checked={isInList} />
			</div>
		</React.Fragment>
	);

	return (
		<div
			className={['ui form', styles.suspectSelectors].join(' ')}
			onClick={stopPropagation}
		>
			{isAdmin ? adminButtons : playerButtons}
		</div>
	);
};

export default SuspectSelectorsView;
