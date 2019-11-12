import * as React from 'react';
import { Page, List } from 'react-onsenui';

interface Props {
	gameList: string[];
	renderGameItem: (row: string) => JSX.Element;
}

const ChooseGamePageView: React.FC<Props> = props => (
	<Page>
		<List dataSource={props.gameList} renderRow={props.renderGameItem} />
	</Page>
);

export default ChooseGamePageView;
