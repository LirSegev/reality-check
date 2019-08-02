import * as React from 'react';
import { Page, List } from 'react-onsenui';
import renderGameItem from './renderGameItem';

interface Props {
	gameList: string[];
}

const ChooseGamePageView: React.FC<Props> = props => (
	<Page>
		<List dataSource={props.gameList} renderRow={renderGameItem} />
	</Page>
);

export default ChooseGamePageView;
