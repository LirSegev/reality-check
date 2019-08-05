import React from 'react';
import { ListItem } from 'react-onsenui';
import { IntelItem, WalkingIntelMore, Icons } from './Intel.d';

const renderIntelItem = (row: IntelItem) => {
	const { action, timestamp } = row;
	const time = new Date(timestamp.toMillis()).toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});

	let text: string;
	switch (action.type) {
		case 'tram':
			text = `Seen on tram ${action.more}`;
			break;
		case 'metro':
			text = `Seen on the ${action.more} metro`;
			break;
		case 'bus':
			text = `Seen on bus ${action.more}`;
			break;
		case 'walking':
			text = `Seen near ${
				(action.more as WalkingIntelMore).text
					? (action.more as WalkingIntelMore).text
					: action.more
			}`;
			break;
		default:
			text = `Seen on ${action.type} ${action.more}`;
	}

	return (
		<ListItem
			modifier="nodivider"
			key={`intelItem-${timestamp.seconds}__${Math.random()}`}
		>
			<div className="left">
				<img
					src={Icons[(action.type as unknown) as any]}
					alt=""
					className="list-item__icon"
				/>
			</div>
			<div className="center">
				<span className="list-item__title">{text}</span>
				<span className="list-item__subtitle">{time}</span>
			</div>
		</ListItem>
	);
};

export default renderIntelItem;
