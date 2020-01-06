import React from 'react';
import { ListItem } from 'react-onsenui';

import SuspectSelectors from './SuspectSelectors';
import SuspectIdentifiers from './SuspectIdentifiers.view';

interface Props {
	handleSuspectClick: (e: React.MouseEvent<any, MouseEvent>) => void;
}

const renderSuspectListItem = (props: Props) => (
	id: number,
	rowIndex: number
) => {
	const suspect = require(`../../../../files/suspects/${id}.json`) as SuspectFile;

	return (
		<ListItem
			key={`suspectList_suspect-${suspect.id}`}
			data-suspect_id={suspect.id}
			tappable
			onClick={props.handleSuspectClick}
		>
			<div className="left">
				<SuspectIdentifiers suspect={suspect} />
			</div>
			<div className="right">
				<SuspectSelectors showLegend={rowIndex === 0} suspectId={suspect.id} />
			</div>
		</ListItem>
	);
};

export default renderSuspectListItem;
