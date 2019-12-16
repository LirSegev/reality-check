import React from 'react';
import { ListItem } from 'react-onsenui';

import SuspectIdentifiers from './SuspectIdentifiers.view';

interface Props {
	handleSuspectClick: (e: React.MouseEvent<any, MouseEvent>) => void;
}

const renderSuspectListItem = (props: Props) => (id: number) => {
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
			</div>
			{/* <div className="right">right</div> */}
		</ListItem>
	);
};

export default renderSuspectListItem;
