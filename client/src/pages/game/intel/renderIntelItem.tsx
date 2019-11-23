import React from 'react';
import { ListItem } from 'react-onsenui';
import { Icons } from './Intel.d';

interface Props {
	handleClick: (e: React.MouseEvent<any, MouseEvent>) => void;
}

const renderIntelItem = (props: Props) => (row: DB.Game.Intel.IntelItem) => {
	const { action, timestamp } = row;
	const time = new Date(timestamp.toMillis()).toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});

	let dataAtr: any = {};
	let text: string;
	switch (action.type) {
		case 'tram':
			text = `Seen on tram ${action.text}`;
			dataAtr['data-tram'] = action.text;
			break;
		case 'metro':
			text = `Seen on the ${action.text} metro`;
			dataAtr['data-metro'] = action.text;
			break;
		case 'bus':
			text = `Seen on bus ${action.text}`;
			break;
		case 'walking':
			text = `Seen near ${action.text}`;
			const point = action.coordinates;
			if (point) dataAtr['data-coords'] = [point.longitude, point.latitude];
			break;
		default:
			text = 'Seen';
	}

	return (
		<ListItem
			tappable={Object.keys(dataAtr).length ? true : false}
			onClick={props.handleClick}
			{...dataAtr}
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