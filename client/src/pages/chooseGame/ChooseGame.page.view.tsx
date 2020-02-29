import * as React from 'react';
import { Fab, Icon, List, Page } from 'react-onsenui';

interface Props {
	gameList: string[];
	renderGameItem: (row: string) => JSX.Element;
	createGame: () => void;
}

const ChooseGamePageView: React.FC<Props> = props => (
	<Page
		renderFixed={() => (
			<Fab position="bottom right" onClick={props.createGame}>
				<Icon icon="md-plus" />
			</Fab>
		)}
	>
		<List dataSource={props.gameList} renderRow={props.renderGameItem} />
	</Page>
);

export default ChooseGamePageView;
