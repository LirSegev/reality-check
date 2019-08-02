import React from 'react';
import { ListItem } from 'react-onsenui';

const renderGameItem = (changeGame: (gameId: string) => void) => (
	row: string
) => {
	function enterGame(e: React.MouseEvent<any, MouseEvent>) {
		const gameId = (e.currentTarget as HTMLElement).querySelector('span')!
			.innerText;
		changeGame(gameId);
	}

	return (
		<ListItem key={`game-${row}`} tappable onClick={enterGame}>
			<span className="list-item_title">{row}</span>
		</ListItem>
	);
};

export default renderGameItem;
