import React from 'react';
import { ListItem } from 'react-onsenui';

function enterGame(e: React.MouseEvent<any, MouseEvent>) {}

const renderGameItem = (row: string) => {
	return (
		<ListItem key={`game-${row}`} tappable onClick={enterGame}>
			<span className="list-item_title">{row}</span>
		</ListItem>
	);
};

export default renderGameItem;
