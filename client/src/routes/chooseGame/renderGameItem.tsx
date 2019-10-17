import React from 'react';
import { ListItem } from 'react-onsenui';
import { changeGameActionPayload } from '../../reducers/main.reducer';

const renderGameItem = (
	changeGame: (payload: changeGameActionPayload) => void
) => (row: string) => {
	function enterGame(e: React.MouseEvent<any, MouseEvent>) {
		const gameId = (e.currentTarget as HTMLElement).querySelector('span')!
			.innerText;
		changeGame({ gameId });
	}

	return (
		<ListItem key={`game-${row}`} tappable onClick={enterGame}>
			<span className="list-item_title">{row}</span>
		</ListItem>
	);
};

export default renderGameItem;
